import { Entry, Message, Part, Request, SetState } from "@/lib/model";
import React, { useRef } from "react";

import { Box } from "@mui/material";
import DictionaryEntry from "@/components/dictionary/DictionaryEntry";
import LoadingSkeleton from "@/components/dictionary/LoadingSkeleton";
import ReactMarkdown from "react-markdown";
import SearchInput from "@/components/dictionary/SearchInput";
import { createId } from "@/lib/misc";
import { produce } from "immer";
import remarkGfm from "remark-gfm";

interface Props {
  nativeLang: string;
  learningLang: string;
  tab: string;
  requests: Request[];
  parts: Part[];
  entries: Entry[];
  translation: string;
  setNativeLang: SetState<string>;
  setLearningLang: SetState<string>;
  setTab: SetState<string>;
  setRequests: SetState<Request[]>;
  setParts: SetState<Part[]>;
  setEntries: SetState<Entry[]>;
  setTranslation: SetState<string>;
  socket: WebSocket | null;
  isLoading: boolean;
}

const DictionaryPage: React.FC<Props> = ({
  nativeLang,
  learningLang,
  tab,
  parts,
  entries,
  translation,
  setRequests,
  setParts,
  setEntries,
  setTranslation,
  socket,
  isLoading,
}) => {
  const responseWindowRef = useRef<HTMLDivElement>(null);

  const handleSend = (search: string) => {
    if (isLoading) return;
    if (!socket) return;
    if (!search.trim()) return;
    const id = createId();
    setParts([]);
    setEntries([]);
    setTranslation("");
    if (tab === "dictionary") {
      const request = { id, type: "search" };
      setRequests((prev) => [...prev, request]);
      socket.send(
        JSON.stringify({
          api: "search",
          requestId: id,
          learningLang,
          nativeLang,
          content: search,
        })
      );
    } else {
      const request = { id, type: "translate" };
      setRequests((prev) => [...prev, request]);
      socket.send(
        JSON.stringify({
          api: "translate",
          requestId: id,
          learningLang,
          nativeLang,
          content: search,
        })
      );
    }
  };

  const handleModifyEntry = (
    entryId: string,
    content: string,
    command: string
  ) => {
    if (isLoading) return;
    if (!socket) return;
    const entry = entries.find((entry) => entry.id === entryId);
    if (!entry) return;
    const id = createId();
    const request = { id, type: "get_modified_entry" };
    setRequests((prev) => [...prev, request]);
    socket.send(
      JSON.stringify({
        api: "get_modified_entry",
        requestId: id,
        entryId,
        learningLang,
        nativeLang,
        content: `${entry.value}\n${content}`,
        command,
      })
    );
  };

  const handleAskQuestion = (
    entryId: string,
    detailId: string,
    messages: Message[]
  ) => {
    if (isLoading) return;
    if (!socket) return;
    const entry = entries.find((entry) => entry.id === entryId);
    if (!entry) return;
    const detail = entry.details?.find((detail) => detail.id === detailId);
    if (!detail) return;
    const id = createId();
    const request = { id, type: "converse" };
    setEntries(
      produce((prev) => {
        const entry = prev.find((entry) => entry.id === entryId);
        if (!entry) return prev;
        if (!entry.details) entry.details = [];
        const detail = entry.details?.find((detail) => detail.id === detailId);
        if (!detail) return;
        detail.messages = messages;
      })
    );
    setRequests((prev) => [...prev, request]);
    socket.send(
      JSON.stringify({
        api: "converse",
        requestId: id,
        entryId,
        detailId,
        learningLang,
        nativeLang,
        content: detail.value,
        messages,
      })
    );
  };

  return (
    <>
      <Box width="100%" pb="16px">
        <SearchInput onSend={handleSend} />
      </Box>

      <div ref={responseWindowRef} style={{ width: "100%" }}>
        {translation ||
        parts.length > 1 ||
        entries.some(({ details }) => details) ? (
          <>
            {translation && (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {translation}
              </ReactMarkdown>
            )}
            {parts.length > 1 && (
              <Box
                pb="16px"
                display="flex"
                justifyContent="center"
                gap="8px"
                flexWrap="wrap"
              >
                {parts.map(({ id, value }) => (
                  <span key={id} style={{ fontSize: "32px" }}>
                    <u>{value}</u>
                  </span>
                ))}
              </Box>
            )}
            {entries.some(({ details }) => details) && (
              <Box display="flex" flexDirection="column" gap="16px">
                {entries.map(
                  ({ id, value, details, isDone }) =>
                    details && (
                      <DictionaryEntry
                        key={id}
                        entry={value}
                        details={details}
                        isDone={isDone}
                        onModifyEntry={(content: string, command: string) =>
                          handleModifyEntry(id, content, command)
                        }
                        onAskQuestion={(
                          detailId: string,
                          messages: Message[]
                        ) => {
                          handleAskQuestion(id, detailId, messages);
                        }}
                      />
                    )
                )}
              </Box>
            )}
          </>
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : (
          <Box color="#888888" pt="24px">
            Uni-Dictionary is an AI powered universal dictionary intended to be
            used as a tool for learning languages. Get dynamic dictionary
            entries in any format you need, expand on them with custom
            information buttons, and chat with Deepseek about them to gain a
            deep understanding of any words or phrases you want to learn.
          </Box>
        )}
      </div>
    </>
  );
};

export default DictionaryPage;
