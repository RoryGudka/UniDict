"use client";

import { Entry, Part, Request, SetState, Translation } from "@/_lib/model";
import React, { useCallback, useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { getHandlers, handleMessage } from "@/_lib/actions";

import { useUser } from "@/_contexts/UserContext";
import { useWebsocket } from "@/_lib/websocket";

interface DataContextType {
  nativeLang: string;
  learningLang: string;
  requests: Request[];
  parts: Part[];
  entries: Entry[];
  translations: Translation[];
  setNativeLang: SetState<string>;
  setLearningLang: SetState<string>;
  setRequests: SetState<Request[]>;
  setParts: SetState<Part[]>;
  setEntries: SetState<Entry[]>;
  setTranslations: SetState<Translation[]>;
  socket: WebSocket | null;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

interface DataContextProviderProps {
  children: React.ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
}) => {
  const { user, profile, isLoading: isUserLoading } = useUser();
  const [learningLang, setLearningLang] = useState(profile?.learningLanguage);
  const [nativeLang, setNativeLang] = useState(profile?.nativeLanguage);
  const [requests, setRequests] = useState<Request[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const hasProfile = !isUserLoading && !!user;

  const isLoading = !!requests.length;

  useEffect(() => {
    setRequests([]);
    setParts([]);
    setEntries([]);
    setTranslations([]);
  }, []);

  const onMessage = useCallback(
    (message: string) => {
      handleMessage(
        message,
        getHandlers({ setParts, setEntries, setTranslations, setRequests })
      );
    },
    [requests]
  );

  const onError = useCallback(() => {
    setRequests([]);
  }, [setRequests]);

  const { socket, reconnect } = useWebsocket({ onMessage, onError });

  const value = {
    nativeLang: hasProfile ? profile.nativeLanguage : nativeLang,
    learningLang: hasProfile ? profile.learningLanguage : learningLang,
    requests,
    parts,
    entries,
    translations,
    setNativeLang,
    setLearningLang,
    setRequests,
    setParts,
    setEntries,
    setTranslations,
    socket,
    isLoading,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const isConnected = socket?.readyState === WebSocket.OPEN;
      if (!isConnected) reconnect();
    }, 1000);

    return () => clearInterval(interval);
  }, [socket, reconnect]);

  useEffect(() => {
    if (socket) {
      socket.onopen = () => {
        console.info("WebSocket connection opened");
      };
    }
  }, [socket]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
