"use client";

import { Entry, Part, Request, Translation } from "@/lib/model";
import React, { useCallback, useEffect, useState } from "react";
import { getHandlers, handleMessage } from "./lib/actions";

import { Box } from "@mui/material";
import DictionaryPage from "@/components/dictionary/DictionaryPage";
import LanguageSelect from "@/components/LanguageSelect";
import Navigation from "@/components/Navigation";
import TranslatorPage from "./components/translator/TranslatorPage";
import WebsocketAlert from "./components/WebsocketAlert";
import { useWebsocket } from "@/lib/websocket";

const App: React.FC = () => {
  const [learningLang, setLearningLang] = useState("Japanese");
  const [nativeLang, setNativeLang] = useState("English");
  const [tab, setTab] = useState("dictionary");
  const [requests, setRequests] = useState<Request[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const isLoading = !!requests.length;

  useEffect(() => {
    setRequests([]);
    setParts([]);
    setEntries([]);
    setTranslations([]);
  }, [tab]);

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

  const context = {
    nativeLang,
    learningLang,
    tab,
    requests,
    parts,
    entries,
    translations,
    setNativeLang,
    setLearningLang,
    setTab,
    setRequests,
    setParts,
    setEntries,
    setTranslations,
    socket,
    isLoading,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Noto Sans JP",
        lineHeight: 2,
        "& ol": { pl: "18px" },
        "& ul": { pl: "18px" },
      }}
    >
      <LanguageSelect {...context} />
      {tab === "dictionary" ? (
        <DictionaryPage {...context} />
      ) : (
        <TranslatorPage {...context} />
      )}
      <Navigation tab={tab} setTab={setTab} />
      <WebsocketAlert socket={socket} reconnect={reconnect} />
    </Box>
  );
};

export default App;
