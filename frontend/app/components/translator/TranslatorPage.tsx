import { Box, Collapse } from "@mui/material";
import {
  Entry,
  Message,
  Part,
  Request,
  SetState,
  Translation,
} from "@/lib/model";
import React, { useRef, useState } from "react";

import Conversation from "../conversation/Conversation";
import IndexSelect from "../common/IndexSelect";
import LoadingSkeleton from "@/components/dictionary/LoadingSkeleton";
import Markdown from "../common/Markdown";
import SearchInput from "@/components/dictionary/SearchInput";
import TranslationModifiers from "./TranslationModifiers";
import { createId } from "@/lib/misc";
import { produce } from "immer";

interface Props {
  nativeLang: string;
  learningLang: string;
  requests: Request[];
  entries: Entry[];
  translations: Translation[];
  setNativeLang: SetState<string>;
  setLearningLang: SetState<string>;
  setTab: SetState<string>;
  setRequests: SetState<Request[]>;
  setParts: SetState<Part[]>;
  setEntries: SetState<Entry[]>;
  setTranslations: SetState<Translation[]>;
  socket: WebSocket | null;
  isLoading: boolean;
}

const TranslatorPage: React.FC<Props> = ({
  nativeLang,
  learningLang,
  translations,
  setRequests,
  setParts,
  setEntries,
  setTranslations,
  socket,
  isLoading,
}) => {
  const responseWindowRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const translation = translations?.[index];
  const translationId = translation?.id || "";
  const content = translation?.value || "";
  const messages: Message[] = translation?.messages?.length
    ? translation.messages
    : [{ source: "deepseek", content: "What would you like to know?" }];

  const handleSend = (search: string) => {
    if (isLoading) return;
    if (!socket) return;
    if (!search.trim()) return;
    const id = createId();
    setParts([]);
    setEntries([]);
    setTranslations([]);

    const request = { id, type: "translate" };
    setRequests((prev) => [...prev, request]);
    socket.send(
      JSON.stringify({
        api: "translate",
        requestId: id,
        provider: "openai",
        learningLang,
        nativeLang,
        content: search,
      })
    );
  };

  const handleAskQuestion = async (question: string) => {
    const newMessages = [
      ...messages,
      { source: "user", content: question },
    ] as Message[];

    if (isLoading) return;
    if (!socket) return;
    const translation = translations.find(({ id }) => id === translationId);
    if (!translation) return;
    const id = createId();
    const request = { id, type: "translation_converse" };
    setTranslations(
      produce((prev) => {
        const translation = prev.find(({ id }) => id === translationId);
        if (!translation) return;
        translation.messages = newMessages;
      })
    );
    setRequests((prev) => [...prev, request]);
    socket.send(
      JSON.stringify({
        api: "translation_converse",
        requestId: id,
        provider: "openai",
        learningLang,
        nativeLang,
        translationId,
        content: translation.value,
        messages: newMessages,
      })
    );
  };

  return (
    <>
      <Box width="100%" pb="16px">
        <SearchInput onSend={handleSend} />
      </Box>

      <div ref={responseWindowRef} style={{ width: "100%" }}>
        {translation?.value ? (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <span style={{ fontSize: "32px" }}>Translation</span>
              <IndexSelect
                index={index}
                setIndex={setIndex}
                total={translations?.length || 0}
              />
            </Box>
            <Markdown content={content} />
            <TranslationModifiers
              isChatOpen={isChatOpen}
              setIsChatOpen={setIsChatOpen}
            />
            <Collapse in={isChatOpen}>
              <Box pt="16px">
                <Conversation messages={messages} onSend={handleAskQuestion} />
              </Box>
            </Collapse>
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

export default TranslatorPage;
