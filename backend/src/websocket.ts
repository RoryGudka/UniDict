import { Server } from "http";
import { WebSocketServer } from "ws";

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
      console.log(`Received: ${message}`);
      ws.send(`Echo: ${message}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
