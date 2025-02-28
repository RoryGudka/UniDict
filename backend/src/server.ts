import "dotenv/config";

import {
  ApiRequest,
  ConverseRequest,
  GetModifiedEntryRequest,
  SearchRequest,
  TranslateRequest,
} from "./model.js";
import { WebSocket, WebSocketServer } from "ws";
import {
  getConversation,
  getEntries,
  getEntryDetails,
  getModifiedEntry,
  getParts,
  getTranslation,
  sendRequestDoneMessage,
} from "./common.js";

import express from "express";
import http from "http";

const search = async (ws: WebSocket, payload: SearchRequest) => {
  const { requestId } = payload;
  try {
    await getParts({ ...payload, ws });
    let entries = await getEntries({ ...payload, ws });
    entries = entries.slice(0, 3);
    await getEntryDetails({ ...payload, entries, ws });
    sendRequestDoneMessage({ ws, requestId });
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const translate = async (ws: WebSocket, payload: TranslateRequest) => {
  const { requestId } = payload;
  try {
    await getTranslation({ ...payload, ws });
    sendRequestDoneMessage({ ws, requestId });
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const modifyEntry = async (ws: WebSocket, payload: GetModifiedEntryRequest) => {
  const { requestId } = payload;
  try {
    await getModifiedEntry({ ...payload, ws });
    sendRequestDoneMessage({ ws, requestId });
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const converse = async (ws: WebSocket, payload: ConverseRequest) => {
  const { requestId } = payload;
  try {
    await getConversation({ ...payload, ws });
    sendRequestDoneMessage({ ws, requestId });
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

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

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
