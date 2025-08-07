import { useEffect, useState } from "react";

interface UseWebsocketProps {
  onMessage: (message: string) => void;
  onError: (event: Event) => void;
}

export const useWebsocket = ({ onMessage, onError }: UseWebsocketProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  useEffect(() => {
    const isLocalhost = location.href.includes(":3000");
    const url = isLocalhost
      ? `ws://${location.hostname}:8080`
      : `wss://api.${location.hostname.replace("www.", "")}:8080`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.info("WebSocket connected");
      setSocket(ws);
    };

    return () => {
      ws.close();
    };
  }, [reconnectAttempt]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        onMessage(event.data as string);
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
  }, [socket, onMessage, onError]);

  const reconnect = () => {
    setReconnectAttempt(reconnectAttempt + 1);
  };

  return { socket, reconnect };
};
