"use client";

import { Box, Collapse } from "@mui/material";
import React, { useRef, useState } from "react";

import Conversation from "@/(nav)/(search)/_components/Conversation";
import EmptyState from "@/(nav)/(search)/translate/_components/EmptyState";
import Header from "@/(nav)/(search)/_components/Header";
import IndexSelect from "@/(nav)/(search)/_components/IndexSelect";
import LoadingSkeleton from "@/(nav)/(search)/define/_components/LoadingSkeleton";
import Markdown from "@/(nav)/_components/Markdown";
import { Message } from "@/_lib/model";
import SearchInput from "@/(nav)/(search)/_components/SearchInput";
import TranslationModifiers from "@/(nav)/(search)/translate/_components/TranslationModifiers";
import { createId } from "@/_lib/misc";
import { produce } from "immer";
import { useDataContext } from "@/_contexts/DataContext";
import { useUser } from "@/_contexts/UserContext";

const TranslatorPage: React.FC = () => {
  const {
    nativeLang,
    learningLang,
    isLoading,
    socket,
    setParts,
    setEntries,
    setTranslations,
    setRequests,
    translations,
  } = useDataContext();
  const { profile } = useUser();
  const { provider, learningLanguages } = profile;
  const { translationGenerationPrompt } = learningLanguages[learningLang] || {};

  const responseWindowRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const translation = translations?.[index];
  const translationId = translation?.id || "";
  const content = translation?.value || "";
  const messages: Message[] = translation?.messages?.length
    ? translation.messages
    : [{ source: "assistant", content: "What would you like to know?" }];

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
        provider,
        learningLang,
        nativeLang,
        content: search,
        instructions: translationGenerationPrompt,
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
        provider,
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
      <Header title="Translator" />

      <Box width="100%" pb="16px">
        <SearchInput
          onSend={handleSend}
          placeholder="Enter a sentence to translate"
        />
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
          <EmptyState />
        )}
      </div>
    </>
  );
};

export default TranslatorPage;
