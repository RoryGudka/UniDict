import "dotenv/config";

import {
  ApiRequest,
  EntryConverseRequest,
  GetEntryModificationRequest,
  SearchRequest,
  TranslateRequest,
  TranslationConverseRequest,
} from "./model.js";
import { RawData, WebSocket } from "ws";
import {
  getEntries,
  getEntryConversation,
  getEntryDetails,
  getEntryModification,
  getParts,
  getTranslation,
  getTranslationConversation,
  sendRequestDoneMessage,
} from "./common.js";

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

const modifyEntry = async (
  ws: WebSocket,
  payload: GetEntryModificationRequest
) => {
  const { requestId } = payload;
  try {
    await getEntryModification({ ...payload, ws });
    sendRequestDoneMessage({ ws, requestId });
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const entryConverse = async (ws: WebSocket, payload: EntryConverseRequest) => {
  const { requestId } = payload;
  try {
    await getEntryConversation({ ...payload, ws });
    sendRequestDoneMessage({ ws, requestId });
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

const translationConverse = async (
  ws: WebSocket,
  payload: TranslationConverseRequest
) => {
  const { requestId } = payload;
  try {
    await getTranslationConversation({ ...payload, ws });
    sendRequestDoneMessage({ ws, requestId });
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    ws.send("Error: Failed to process request");
  }
};

export const handleWebsocketMessage = async (
  ws: WebSocket,
  message: RawData
) => {
  console.log(`Received: ${message}`);
  try {
    const payload = JSON.parse(message.toString()) as ApiRequest;
    const { api } = payload;

    if (api === "search") {
      await search(ws, payload);
    } else if (api === "translate") {
      await translate(ws, payload);
    } else if (api === "get_entry_modification") {
      await modifyEntry(ws, payload);
    } else if (api === "entry_converse") {
      await entryConverse(ws, payload);
    } else if (api === "translation_converse") {
      await translationConverse(ws, payload);
    } else {
      ws.send("Error: Invalid API request");
      console.error(`Invalid api: ${api}`);
    }
  } catch (error) {
    console.error("Error processing WebSocket message:", error);
    ws.send("Error: Invalid message format");
  }
};
