import "dotenv/config";

import { WebSocket, WebSocketServer } from "ws";
import {
  getConversation,
  getEntries,
  getEntryDetails,
  getModifiedEntry,
  getParts,
  getTranslation,
} from "./common.js";

import express from "express";
import http from "http";

interface SearchRequest {
  api: "search";
  requestId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
}

interface TranslateRequest {
  api: "translate";
  requestId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
}

interface GetModifiedEntryRequest {
  api: "get_modified_entry";
  requestId: string;
  entryId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  command: string;
}

interface ConverseRequest {
  api: "converse";
  requestId: string;
  entryId: string;
  detailId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  messages: { source: "user" | "deepseek"; content: string }[];
}

type ApiRequest =
  | SearchRequest
  | TranslateRequest
  | GetModifiedEntryRequest
  | ConverseRequest;

const search = async (ws: WebSocket, payload: SearchRequest) => {
  const { requestId, learningLang, nativeLang, content } = payload;
  try {
    await getParts(requestId, content, (c) => ws.send(c));
    const entries = await getEntries(requestId, content, learningLang, (c) =>
      ws.send(c)
    );
    await getEntryDetails(
      requestId,
      entries.slice(0, 3),
      learningLang,
      nativeLang,
      (c) => ws.send(c)
    );
    ws.send(`${requestId}:SET_DONE:REQUEST:${requestId}`);
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const translate = async (ws: WebSocket, payload: TranslateRequest) => {
  const { requestId, learningLang, nativeLang, content } = payload;
  try {
    await getTranslation(requestId, content, learningLang, nativeLang, (c) =>
      ws.send(c)
    );
    ws.send(`${requestId}:SET_DONE:REQUEST:${requestId}`);
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const modifyEntry = async (ws: WebSocket, payload: GetModifiedEntryRequest) => {
  const { requestId, entryId, learningLang, nativeLang, content, command } =
    payload;
  try {
    await getModifiedEntry(
      requestId,
      entryId,
      content,
      learningLang,
      nativeLang,
      command,
      (c) => ws.send(c)
    );
    ws.send(`${requestId}:SET_DONE:REQUEST:${requestId}`);
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const converse = async (ws: WebSocket, payload: ConverseRequest) => {
  const {
    requestId,
    entryId,
    detailId,
    learningLang,
    nativeLang,
    content,
    messages,
  } = payload;
  try {
    await getConversation(
      requestId,
      entryId,
      detailId,
      content,
      messages,
      learningLang,
      nativeLang,
      (c) => ws.send(c)
    );
    ws.send(`${requestId}:SET_DONE:REQUEST:${requestId}`);
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

// Express app setup
const app = express();
const server = http.createServer(app);

// WebSocket server setup
const wss = new WebSocketServer({ noServer: true });

// Handle HTTP upgrade requests
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  ws.on("message", async (message) => {
    console.log(`Received: ${message}`);
    try {
      const payload = JSON.parse(message.toString()) as ApiRequest;
      const { api } = payload;

      if (api === "search") {
        await search(ws, payload);
      } else if (api === "translate") {
        await translate(ws, payload);
      } else if (api === "get_modified_entry") {
        await modifyEntry(ws, payload);
      } else if (api === "converse") {
        await converse(ws, payload);
      } else {
        ws.send("Error: Invalid API request");
        console.error(`Invalid api: ${api}`);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      ws.send("Error: Invalid message format");
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start the server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
