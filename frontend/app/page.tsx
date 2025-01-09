"use client";

import {
  Box,
  Collapse,
  IconButton,
  OutlinedInput,
  Skeleton,
} from "@mui/material";
import React, { ChangeEvent, useCallback, useRef, useState } from "react";

import { CiGlobe } from "react-icons/ci";
import Navigation from "./components/Navigation";
import ReactMarkdown from "react-markdown";
import SearchInput from "./components/SearchInput";
import remarkGfm from "remark-gfm";
import { useWebsocket } from "./lib/websocket";

enum Phase {
  Waiting,
  GettingParts,
  GettingDetails,
  GettingEntries,
  GettingEntryDetails,
  GettingExampleSentences,
}

const App: React.FC = () => {
  const [tab, setTab] = useState("home");
  const [parts, setParts] = useState("");
  const [details, setDetails] = useState("");
  const [entries, setEntries] = useState("");
  const [tempEntry, setTempEntry] = useState("");
  const [entryDetails, setEntryDetails] = useState<string[]>([]);
  const [entryNumber, setEntryNumber] = useState(0);
  const [learningLang, setLearningLang] = useState("Japanese");
  const [nativeLang, setNativeLang] = useState("English");
  const [phase, setPhase] = useState(Phase.Waiting);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const responseWindowRef = useRef<HTMLDivElement>(null);

  const onMessage = useCallback(
    (message: string) => {
      if (phase === Phase.GettingParts) {
        setParts((prev) => prev + message);
      } else if (phase === Phase.GettingDetails) {
        setDetails((prev) => prev + message);
      } else if (phase === Phase.GettingEntries) {
        setEntries((prev) => prev + message);
      } else if (phase === Phase.GettingEntryDetails) {
        setEntryDetails((prev) => [
          ...prev.slice(0, entryNumber - 1),
          `${prev[entryNumber - 1] || ""}${message}`,
        ]);
      } else if (phase === Phase.GettingExampleSentences) {
        setTempEntry((prev) => prev + message);
      }
    },
    [phase, entryNumber, setParts, setDetails, setEntries, setEntryDetails]
  );

  const onPhase = useCallback(
    (change: string) => {
      console.log(phase);
      if (change === "[PARTS]") {
        setPhase(Phase.GettingParts);
      } else if (change === "[ENTRIES]") {
        setPhase(Phase.GettingEntries);
      } else if (change === "[DETAILS]") {
        setPhase(Phase.GettingDetails);
      } else if (change === "[ENTRY_DETAILS]") {
        setPhase(Phase.GettingEntryDetails);
        setEntryNumber((prev) => prev + 1);
      } else {
        if (phase === Phase.GettingExampleSentences) {
          setEntryDetails((prev) => [
            ...prev.slice(0, entryNumber),
            tempEntry,
            ...prev.slice(entryNumber + 1),
          ]);
        }
        setPhase(Phase.Waiting);
      }
    },
    [phase, tempEntry, entryNumber, setPhase, setEntryNumber]
  );

  const onError = useCallback(() => {
    setPhase(Phase.Waiting);
  }, [setPhase]);

  const { socket } = useWebsocket({ onMessage, onPhase, onError });

  const handleSearch = (search: string) => {
    if (socket && search.trim()) {
      setPhase(Phase.GettingParts);
      setParts("");
      setDetails("");
      setEntries("");
      setEntryDetails([]);
      setEntryNumber(0);
      socket.send(
        JSON.stringify({
          api: "search",
          learningLang,
          nativeLang,
          content: search,
        })
      );
    }
  };

  const handleGenerateExampleSentences = (entryNumber: number) => {
    if (socket) {
      setPhase(Phase.GettingExampleSentences);
      setEntryNumber(entryNumber);
      setTempEntry("");
      socket.send(
        JSON.stringify({
          api: "generate_example_sentences",
          learningLang,
          nativeLang,
          content: `${entries.split("|")[entryNumber]}\n${
            entryDetails[entryNumber]
          }`,
        })
      );
    }
  };

  const handleToggleLanguageOpen = () => {
    setIsLanguageOpen((isLanguageOpen) => !isLanguageOpen);
  };

  const handleLearningLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLearningLang(e.target.value);
  };

  const handleNativeLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNativeLang(e.target.value);
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        pb="16px"
      >
        <h1 style={{ fontSize: "24px" }}>UniDict</h1>
        <Box display="flex" alignItems="center" gap="8px">
          <span style={{ color: "rgba(0, 0, 0, 0.54)" }}>
            {learningLang} ⟷ {nativeLang}
          </span>
          <IconButton onClick={handleToggleLanguageOpen}>
            <CiGlobe size="28px" />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isLanguageOpen} sx={{ width: "100%" }}>
        <Box
          display="flex"
          flexDirection="column"
          gap="4px"
          width="100%"
          pb="16px"
        >
          <span>Learning language:</span>
          <OutlinedInput
            value={learningLang}
            onChange={handleLearningLangChange}
          />
          <span>Native language:</span>
          <OutlinedInput value={nativeLang} onChange={handleNativeLangChange} />
        </Box>
      </Collapse>

      <Box width="100%" pb="16px">
        <SearchInput onSend={(search) => handleSearch(search)} />
      </Box>

      <div ref={responseWindowRef} style={{ width: "100%" }}>
        {parts ? (
          <>
            {details && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {details}
              </ReactMarkdown>
            )}
            {parts && parts.includes("|") && (
              <Box pb="16px" display="flex" justifyContent="center" gap="8px">
                {parts.split("|").map((part, i) => (
                  <span key={i} style={{ fontSize: "32px" }}>
                    <u>{part}</u>
                  </span>
                ))}
              </Box>
            )}
            {entries && (
              <Box display="flex" flexDirection="column" gap="16px">
                {entries.split("|").map(
                  (entry, i) =>
                    entryDetails[i] && (
                      <Box key={entry}>
                        <span style={{ fontSize: "32px" }}>{entry}</span>
                        {entryDetails[i] && (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {entryDetails[i]}
                          </ReactMarkdown>
                        )}
                        <Box display="flex" justifyContent="flex-end">
                          <u onClick={() => handleGenerateExampleSentences(i)}>
                            Get example sentences
                          </u>
                        </Box>
                      </Box>
                    )
                )}
              </Box>
            )}
          </>
        ) : (
          <>
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => (
              <Skeleton key={i} animation="pulse" height="38px" />
            ))}
          </>
        )}
      </div>
      <Navigation tab={tab} setTab={setTab} />
    </Box>
  );
};

export default App;
