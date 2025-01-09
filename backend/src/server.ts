import "dotenv/config";

import { WebSocket, WebSocketServer } from "ws";
import {
  getDetails,
  getEntries,
  getEntryDetails,
  getExampleSentences,
  getParts,
} from "./common.js";

import OpenAI from "openai";
import express from "express";
import https from "https";

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

// Initialize OpenAI client with DeepSeek API configuration
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com", // DeepSeek API endpoint
  apiKey: process.env.DEEPSEEK_API_KEY, // Set your DeepSeek API key in .env
});

const app = express();

// Load SSL key and cert from .env
const options = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT,
};

const server = https.createServer(options, app);

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  ws.on("message", async (message) => {
    console.log(`Received: ${message}`);
    const { api, ...payload } = JSON.parse(message.toString()) as ApiRequest;

    if (api === "search") {
      await search(ws, payload);
    } else if (api === "generate_example_sentences") {
      await generateExampleSentences(ws, payload);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
