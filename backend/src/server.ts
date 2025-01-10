import "dotenv/config";

import { WebSocket, WebSocketServer } from "ws";
import {
  getDetails,
  getEntries,
  getEntryDetails,
  getExampleSentences,
  getParts,
} from "./common.js";

import express from "express";
import http from "http";

interface ApiPayload {
  learningLang: string;
  nativeLang: string;
  content: string;
}

type Api = "search" | "generate_example_sentences";

interface ApiRequest extends ApiPayload {
  api: Api;
}

const search = async (ws: WebSocket, payload: ApiPayload) => {
  const { learningLang, nativeLang, content } = payload;
  try {
    ws.send("[PARTS]");
    const parts = await getParts(content, (c) => ws.send(c));

    if (parts.length > 1) {
      ws.send("[DETAILS]");
      await getDetails(content, learningLang, nativeLang, (c) => ws.send(c));
      ws.send("[ENTRIES]");
      const entries = await getEntries(parts[0], learningLang, (c) =>
        ws.send(c)
      );
      ws.send("[ENTRY_DETAILS]");
      await getEntryDetails(
        entries.slice(0, 3),
        learningLang,
        nativeLang,
        (c) => ws.send(c)
      );
      ws.send("[DONE]");
    } else {
      ws.send("[ENTRIES]");
      const entries = await getEntries(content, learningLang, (c) =>
        ws.send(c)
      );
      ws.send("[ENTRY_DETAILS]");
      await getEntryDetails(
        entries.slice(0, 3),
        learningLang,
        nativeLang,
        (c) => ws.send(c)
      );
      ws.send("[DONE]");
    }
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const generateExampleSentences = async (ws: WebSocket, payload: ApiPayload) => {
  const { learningLang, nativeLang, content } = payload;
  try {
    await getExampleSentences(content, learningLang, nativeLang, (c) =>
      ws.send(c)
    );
    ws.send("[DONE]");
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
      const { api, ...payload } = JSON.parse(message.toString()) as ApiRequest;

      if (api === "search") {
        await search(ws, payload);
      } else if (api === "generate_example_sentences") {
        await generateExampleSentences(ws, payload);
      } else {
        ws.send("Error: Invalid API request");
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
