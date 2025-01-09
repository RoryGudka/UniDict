import { useEffect, useState } from "react";

interface UseWebsocketProps {
  onMessage: (message: string) => void;
  onPhase: (phase: string) => void;
  onError: (event: Event) => void;
}

export const useWebsocket = ({
  onMessage,
  onPhase,
  onError,
}: UseWebsocketProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:4000");

    ws.onopen = () => {
      console.info("WebSocket connected");
      setSocket(ws);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = event.data as string;
        if (data.startsWith("[") && data.endsWith("]") && data.length > 2) {
          onPhase(data);
        } else onMessage(data);
      };

      socket.onclose = () => {
        console.info("WebSocket disconnected");
        setSocket(null);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError(error);
      };
    }
  }, [socket, onMessage, onPhase, onError]);

  return { socket };
};
