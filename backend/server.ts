import { WebSocket, WebSocketServer } from "ws";

import cors from "cors";
import { createServer } from "http";
import express from "express";
import { handleWebsocketMessage } from "./src/websocket";
import profileRoutes from "./routes/profile";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Store active WebSocket connections
const clients = new Set<WebSocket>();

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");
  clients.add(ws);

  ws.on("message", async (message) => {
    try {
      await handleWebsocketMessage(ws, message);
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      ws.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// API Routes
app.use("/api/profile", profileRoutes);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Start server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server is ready`);
  console.log(`HTTP server is ready`);
});
