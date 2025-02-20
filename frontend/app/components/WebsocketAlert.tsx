import { Box, Collapse, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useHasTimeElapsed } from "@/lib/misc";

interface Props {
  socket: WebSocket | null;
  reconnect: () => void;
}

const WebsocketAlert: React.FC<Props> = ({ socket, reconnect }) => {
  const hasLoaded = useHasTimeElapsed(2000);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const showWarningMessage = hasLoaded && isConnecting;
  const showErrorMessage = hasLoaded && (!socket || isClosing || isClosed);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnecting(socket?.readyState === socket?.CONNECTING);
      setIsClosing(socket?.readyState === socket?.CLOSING);
      setIsClosed(socket?.readyState === socket?.CLOSED);
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [socket]);

  return (
    <Box position="fixed" bottom="0" left="0" width="100%">
      <Collapse in={showWarningMessage || showErrorMessage}>
        {showErrorMessage ? (
          <Box
            p="16px"
            bgcolor="#faeeee"
            display="flex"
            justifyContent="center"
            borderTop="1px solid #e75550"
          >
            <Box
              flex="1 0 0"
              maxWidth="600px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography textAlign="center" color="#e75550" fontWeight={600}>
                Disconnected from service...
              </Typography>{" "}
              <Typography
                textAlign="center"
                color="#e75550"
                fontWeight={600}
                sx={{ cursor: "pointer" }}
                onClick={reconnect}
              >
                <u>Reconnect</u>
              </Typography>
            </Box>
          </Box>
        ) : showWarningMessage ? (
          <Box
            p="16px"
            bgcolor="#fff8e4"
            display="flex"
            justifyContent="center"
            borderTop="1px solid #ffc000"
          >
            <Box flex="1 0 0" maxWidth="600px">
              <Typography textAlign="center" color="#ffc000" fontWeight={600}>
                Connecting to service...
              </Typography>
            </Box>
          </Box>
        ) : null}
      </Collapse>
    </Box>
  );
};

export default WebsocketAlert;
