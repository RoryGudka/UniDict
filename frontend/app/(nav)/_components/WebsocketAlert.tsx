"use client";

import { Box, Collapse, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useDataContext } from "@/_contexts/DataContext";
import { useHasTimeElapsed } from "@/_lib/misc";

const WebsocketAlert: React.FC = () => {
  const { socket } = useDataContext();
  const hasLoaded = useHasTimeElapsed(2000);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const showWarningMessage =
    hasLoaded && (!socket || isConnecting || isClosing || isClosed);

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
    <Box
      position="fixed"
      bottom="72px"
      left="0"
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Box width="90%" maxWidth="400px">
        <Collapse in={showWarningMessage}>
          {showWarningMessage && (
            <Box
              p="8px"
              bgcolor="#fff8e4"
              display="flex"
              justifyContent="center"
              border="1px solid #ffc000"
              borderRadius="8px"
            >
              <Box flex="1 0 0" maxWidth="600px">
                <Typography textAlign="center" color="#ffc000" fontWeight={600}>
                  Connecting to service...
                </Typography>
              </Box>
            </Box>
          )}
        </Collapse>
      </Box>
    </Box>
  );
};

export default WebsocketAlert;
