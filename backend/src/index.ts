import { WebSocketServer } from "ws";
import express from "express";
import http from "http";
import routes from "./routes/index.js"; // Use .js extension for ES modules

const app = express();
const server = http.createServer(app);

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Middleware
app.use(express.json());

// Routes
app.use("/", routes);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
