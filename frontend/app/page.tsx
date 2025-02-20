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
      const [requestId, update] = getMetadataSegment(message);
      if (!requestId || !update) return;

      const request = requests.find((request) => request.id === requestId);
      if (!request) return;

      if (request.type === "search") {
        const [task, content] = getMetadataSegment(update);
        if (!task || !content) return;

        if (task === "GET_PARTS") {
          // REQUEST_ID:TASK:PART_ID:CONTENT
          const [partId, part] = getMetadataSegment(content);
          setParts((prev) => [...prev, { id: partId, value: part }]);
        } else if (task === "GET_ENTRIES") {
          // REQUEST_ID:TASK:ENTRY_ID:CONTENT
          const [entryId, entry] = getMetadataSegment(content);
          setEntries((prev) => [...prev, { id: entryId, value: entry }]);
        } else if (task === "GET_ENTRY_DETAILS") {
          // REQUEST_ID:TASK:ENTRY_ID:DETAIL_ID:CONTENT
          const [entryId, details] = getMetadataSegment(content);
          const [detailId, segment] = getMetadataSegment(details);
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
        } else if (task === "GET_TRANSLATION") {
          // REQUEST_ID:TASK:CONTENT
          setTranslation((prev) => prev + content);
        } else if (task === "SET_DONE") {
          // REQUEST_ID:TASK:TARGET:TARGET_ID
          const [target, targetId] = getMetadataSegment(content);
          if (target === "REQUEST") {
            setRequests((prev) =>
              prev.filter((request) => request.id !== requestId)
            );
          } else if (target === "ENTRY") {
            setEntries(
              produce((prev) => {
                const entry = prev.find((entry) => entry.id === targetId);
                if (!entry) return prev;
                entry.isDone = true;
              })
            );
          }
        }
      }

      if (request.type == "get_modified_entry") {
        const [task, content] = getMetadataSegment(update);
        if (task === "GET_MODIFIED_ENTRY") {
          // REQUEST_ID:ENTRY_ID:DETAIL_ID:CONTENT
          const [entryId, details] = getMetadataSegment(content);
          const [detailId, segment] = getMetadataSegment(details);
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
        } else if (task === "SET_DONE") {
          // REQUEST_ID:TASK:TARGET:TARGET_ID
          const [target] = getMetadataSegment(content);
          if (target === "REQUEST") {
            setRequests((prev) =>
              prev.filter((request) => request.id !== requestId)
            );
          }
        }
      }

      if (request.type === "converse") {
        const [task, content] = getMetadataSegment(update);
        if (task === "GET_CONVERSATION") {
          // REQUEST_ID:ENTRY_ID:DETAIL_ID:CONTENT
          const [entryId, details] = getMetadataSegment(content);
          const [detailId, segment] = getMetadataSegment(details);
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
        } else if (task === "SET_DONE") {
          // REQUEST_ID:TASK:TARGET:TARGET_ID
          const [target] = getMetadataSegment(content);
          if (target === "REQUEST") {
            setRequests((prev) =>
              prev.filter((request) => request.id !== requestId)
            );
          }
        }
      }
    },
    [requests, setRequests, setParts, setTranslation, setEntries]
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
