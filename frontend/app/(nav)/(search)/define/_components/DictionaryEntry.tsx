import { Box, Collapse } from "@mui/material";
import { EntryDetails, Message } from "@/_lib/model";
import { useEffect, useState } from "react";

import Conversation from "@/(nav)/(search)/_components/Conversation";
import DictionaryEntryModifiers from "@/(nav)/(search)/define/_components/DictionaryEntryModifiers";
import IndexSelect from "@/(nav)/(search)/_components/IndexSelect";
import Markdown from "@/(nav)/_components/Markdown";

interface Props {
  entry: string;
  details?: EntryDetails[];
  isDone?: boolean;
  onModifyEntry: (detailId: string, command: string) => void;
  onAskQuestion: (detailId: string, messages: Message[]) => void;
}

const DictionaryEntry: React.FC<Props> = ({
  entry,
  details,
  isDone,
  onModifyEntry,
  onAskQuestion,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const detail = details?.[index];
  const messages: Message[] = detail?.messages?.length
    ? detail.messages
    : [{ source: "deepseek", content: "What would you like to know?" }];

  const handleSend = async (question: string) => {
    const newMessages = [
      ...messages,
      { source: "user", content: question },
    ] as Message[];
    onAskQuestion(detail?.id || "", newMessages);
  };

  useEffect(() => {
    setIndex((details?.length || 1) - 1);
  }, [details?.length]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <span style={{ fontSize: "32px" }}>{entry}</span>
        {isDone && (
          <IndexSelect
            index={index}
            setIndex={setIndex}
            total={details?.length || 0}
          />
        )}
      </Box>
      {detail && <Markdown content={detail.value} />}
      {isDone && (
        <DictionaryEntryModifiers
          entry={detail?.value || ""}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          onModifyEntry={onModifyEntry}
        />
      )}
      <Collapse in={isChatOpen}>
        <Box pt="16px">
          <Conversation messages={messages} onSend={handleSend} />
        </Box>
      </Collapse>
    </Box>
  );
};

export default DictionaryEntry;
