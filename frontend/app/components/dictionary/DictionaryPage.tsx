import { Entry, Message, Part, Request, SetState } from "@/lib/model";
import React, { useRef } from "react";

import { Box } from "@mui/material";
import DictionaryEntry from "@/components/dictionary/DictionaryEntry";
import LoadingSkeleton from "@/components/dictionary/LoadingSkeleton";
import SearchInput from "@/components/dictionary/SearchInput";
import { createId } from "@/lib/misc";
import { produce } from "immer";

interface Props {
  nativeLang: string;
  learningLang: string;
  requests: Request[];
  parts: Part[];
  entries: Entry[];
  setNativeLang: SetState<string>;
  setLearningLang: SetState<string>;
  setTab: SetState<string>;
  setRequests: SetState<Request[]>;
  setParts: SetState<Part[]>;
  setEntries: SetState<Entry[]>;
  socket: WebSocket | null;
  isLoading: boolean;
}

const DictionaryPage: React.FC<Props> = ({
  nativeLang,
  learningLang,
  parts,
  entries,
  setRequests,
  setParts,
  setEntries,
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

    const request = { id, type: "search" };
    setRequests((prev) => [...prev, request]);
    socket.send(
      JSON.stringify({
        api: "search",
        requestId: id,
        provider: "openai",
        learningLang,
        nativeLang,
        content: search,
      })
    );
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
    const request = { id, type: "get_entry_modification" };
    setRequests((prev) => [...prev, request]);
    socket.send(
      JSON.stringify({
        api: "get_entry_modification",
        requestId: id,
        provider: "openai",
        learningLang,
        nativeLang,
        entryId,
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
    const request = { id, type: "entry_converse" };
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
        api: "entry_converse",
        requestId: id,
        provider: "openai",
        learningLang,
        nativeLang,
        entryId,
        detailId,
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
        {parts.length > 1 || entries.some(({ details }) => details) ? (
          <>
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
