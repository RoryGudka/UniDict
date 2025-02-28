"use client";

import { Entry, Part, Request } from "@/lib/model";
import React, { useCallback, useEffect, useState } from "react";

import { Box } from "@mui/material";
import DictionaryPage from "@/components/dictionary/DictionaryPage";
import LanguageSelect from "@/components/LanguageSelect";
import Navigation from "@/components/Navigation";
import WebsocketAlert from "./components/WebsocketAlert";
import { produce } from "immer";
import { useWebsocket } from "@/lib/websocket";

const App: React.FC = () => {
  const [learningLang, setLearningLang] = useState("Japanese");
  const [nativeLang, setNativeLang] = useState("English");
  const [tab, setTab] = useState("dictionary");
  const [requests, setRequests] = useState<Request[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [translation, setTranslation] = useState("");
  const isLoading = !!requests.length;

  useEffect(() => {
    setRequests([]);
    setParts([]);
    setEntries([]);
    setTranslation("");
  }, [tab]);

  const getMetadataSegment = (str: string) => {
    const index = str.indexOf(":");
    if (index === -1) return [];
    return [str.slice(0, index), str.slice(index + 1)];
  };

  const onMessage = useCallback(
    (message: string) => {
      const isMessageVariable = (part: string) => {
        return part[0] === part[0].toLowerCase();
      };

      type MatcherFn = (arg: { [key: string]: string }) => void;
      type MatcherMap = { [matcher: string]: MatcherFn };

      const handleMessage = async (message: string, map: MatcherMap) => {
        const messageParts = message.split("⌺");
        const matchers = Object.keys(map);
        for (let i = 0; i < matchers.length; i++) {
          const matcher = matchers[i];
          const matcherParts = matcher.split(":");
          if (matcherParts.length !== messageParts.length) continue;
          const isMatch = messageParts.every((messagePart, i) => {
            const matcherPart = matcherParts[i];
            if (isMessageVariable(matcherPart)) return true;
            return messagePart === matcherPart;
          });
          const values = matcherParts
            .map((matcherPart, i) => [matcherPart, messageParts[i]])
            .filter(([matcherPart]) => isMessageVariable(matcherPart));
          const args = Object.fromEntries(values);
          if (isMatch) return await map[matcher](args);
        }
      };

      handleMessage(message, {
        "requestId:GET_PARTS:partId:segment": ({
          requestId,
          partId,
          segment,
        }) => {
          const request = requests.find((request) => request.id === requestId);
          if (!request) return;

          setParts((prev) => [...prev, { id: partId, value: segment }]);
        },
        "requestId:GET_ENTRIES:entryId:segment": ({
          requestId,
          entryId,
          segment,
        }) => {
          const request = requests.find((request) => request.id === requestId);
          if (!request) return;

          setEntries((prev) => [...prev, { id: entryId, value: segment }]);
        },
        "requestId:GET_ENTRY_DETAILS:entryId:detailId:segment": ({
          requestId,
          entryId,
          detailId,
          segment,
        }) => {
          const request = requests.find((request) => request.id === requestId);
          if (!request) return;

          setEntries(
            produce((prev) => {
              const entry = prev.find((entry) => entry.id === entryId);
              if (!entry) return prev;
              if (!entry.details) entry.details = [];
              const detail = entry.details?.find(
                (detail) => detail.id === detailId
              );
              if (!detail) {
                entry.details.push({
                  id: detailId,
                  value: segment,
                  messages: [],
                });
              } else {
                detail.value = `${detail.value}${segment}`;
              }
            })
          );
        },
        "requestId:GET_TRANSLATION:segment": ({ requestId, segment }) => {
          const request = requests.find((request) => request.id === requestId);
          if (!request) return;

          setTranslation((prev) => prev + segment);
        },
        "requestId:GET_MODIFIED_ENTRY:entryId:detailId:segment": ({
          requestId,
          entryId,
          detailId,
          segment,
        }) => {
          const request = requests.find((request) => request.id === requestId);
          if (!request) return;

          setEntries(
            produce((prev) => {
              const entry = prev.find((entry) => entry.id === entryId);
              if (!entry) return prev;
              if (!entry.details) entry.details = [];
              const detail = entry.details?.find(
                (detail) => detail.id === detailId
              );
              if (!detail) {
                entry.details.push({
                  id: detailId,
                  value: segment,
                  messages: [],
                });
              } else {
                detail.value = `${detail.value}${segment}`;
              }
            })
          );
        },
        "requestId:GET_CONVERSATION:entryId:detailId:segment": ({
          requestId,
          entryId,
          detailId,
          segment,
        }) => {
          const request = requests.find((request) => request.id === requestId);
          if (!request) return;

          setEntries(
            produce((prev) => {
              const entry = prev.find((entry) => entry.id === entryId);
              if (!entry) return prev;
              if (!entry.details) entry.details = [];
              const detail = entry.details?.find(
                (detail) => detail.id === detailId
              );
              if (!detail?.messages) return;
              const message = detail.messages[detail.messages.length - 1];
              if (message.source !== "deepseek") {
                detail.messages.push({ source: "deepseek", content: segment });
              } else {
                message.content += segment;
              }
            })
          );
        },
        "requestId:SET_DONE:REQUEST": ({ requestId }) => {
          const request = requests.find((request) => request.id === requestId);
          if (!request) return;

          setRequests((prev) =>
            prev.filter((request) => request.id !== requestId)
          );
        },
        "requestId:SET_DONE:ENTRY:entryId": ({ requestId, entryId }) => {
          const request = requests.find((request) => request.id === requestId);
          if (!request) return;

          setEntries(
            produce((prev) => {
              const entry = prev.find((entry) => entry.id === entryId);
              if (!entry) return prev;
              entry.isDone = true;
            })
          );
        },
      });

      const [requestId, update] = getMetadataSegment(message);
      if (!requestId || !update) return;

      const request = requests.find((request) => request.id === requestId);
      if (!request) return;
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
    translation,
    setNativeLang,
    setLearningLang,
    setTab,
    setRequests,
    setParts,
    setEntries,
    setTranslation,
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
      <DictionaryPage {...context} />
      <Navigation tab={tab} setTab={setTab} />
      <WebsocketAlert socket={socket} reconnect={reconnect} />
    </Box>
  );
};

export default App;
