import { Box, Collapse, IconButton, OutlinedInput } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  CiCircleChevLeft,
  CiCircleChevRight,
  CiCircleQuestion,
  CiLocationArrow1,
  CiUndo,
} from "react-icons/ci";
import { EntryDetails, Message } from "@/lib/model";

import DeepseekMessage from "@/components/dictionary/DeepseekMessage";
import ReactMarkdown from "react-markdown";
import UserMessage from "@/components/dictionary/UserMessage";
import remarkGfm from "remark-gfm";

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
  const [question, setQuestion] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const detail = details?.[selectedIndex];
  const messages = detail?.messages?.length
    ? detail.messages
    : [{ source: "deepseek", content: "What would you like to know?" }];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend();
      setQuestion("");
    }
  };

  const handleSend = async () => {
    const newMessages = [
      ...messages,
      { source: "user", content: question },
    ] as Message[];
    onAskQuestion(details?.[selectedIndex].id || "", newMessages);
  };

  useEffect(() => {
    setSelectedIndex((details?.length || 1) - 1);
  }, [details?.length]);

  return (
    <Box key={entry}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <span style={{ fontSize: "32px" }}>{entry}</span>
        {isDone && (
          <Box display="flex" alignItems="center" gap="16px">
            <Box>
              {details?.length && details.length > 1 && (
                <Box display="flex" alignItems="center" gap="4px">
                  <IconButton
                    onClick={() => setSelectedIndex(selectedIndex - 1)}
                    disabled={selectedIndex === 0}
                  >
                    <CiCircleChevLeft fontSize="22px" />
                  </IconButton>
                  {selectedIndex + 1} / {details.length}
                  <IconButton
                    onClick={() => setSelectedIndex(selectedIndex + 1)}
                    disabled={selectedIndex + 1 === details.length}
                  >
                    <CiCircleChevRight fontSize="22px" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
      {details?.length && (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {details[selectedIndex].value}
        </ReactMarkdown>
      )}
      {isDone && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pt="8px"
        >
          <Box display="flex" alignItems="center" gap="8px">
            <u
              style={{ cursor: "pointer" }}
              onClick={() =>
                onModifyEntry(
                  details?.[selectedIndex].value || "",
                  "Add example sentences for each definition for this dictionary entry"
                )
              }
            >
              Examples
            </u>
            <u
              style={{ cursor: "pointer" }}
              onClick={() =>
                onModifyEntry(
                  details?.[selectedIndex].value || "",
                  "Add a table of conjugations at the end of this dictionary entry; add a divider between the dictionary entry and the table, give the table the name 'Conjugations', and give it the columns 'Form' and 'Conjugation'"
                )
              }
            >
              Conjugations
            </u>
          </Box>
          <IconButton onClick={() => setIsChatOpen(!isChatOpen)}>
            <CiCircleQuestion fontSize="28px" />
          </IconButton>
        </Box>
      )}
      <Collapse in={isChatOpen}>
        <Box pt="16px">
          <Box display="flex" flexDirection="column" gap="16px" pb="24px">
            {messages.map(({ source, content }, i) => {
              return source === "deepseek" ? (
                <DeepseekMessage key={i} message={content} />
              ) : (
                <UserMessage key={i} message={content} />
              );
            })}
          </Box>

          <Box position="relative">
            <OutlinedInput
              fullWidth
              value={question}
              onChange={handleChange}
              onKeyDown={handleKeydown}
              placeholder="Ask a question about this entry"
              multiline
              sx={{
                fontFamily: "Noto Sans JP",
                lineHeight: 1,
                bgcolor: "#f3f3f3",
                borderRadius: "24px",
                border: "none",
                outline: "none",
                boxShadow: "none",
                pr: "90px",
                "& input": { py: "13px" },
                "& fieldset": { border: "none" },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: "54px",
                top: "8px",
                width: "38px",
                height: "38px",
                display: question ? "flex" : "none",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => setQuestion("")}
            >
              <CiUndo size="28px" />
            </Box>
            <Box
              sx={{
                position: "absolute",
                right: "8.5px",
                top: "8.5px",
                bgcolor: "#4e6cf9",
                color: "white",
                width: "32px",
                height: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "38px",
                cursor: "pointer",
              }}
              onClick={handleSend}
            >
              <CiLocationArrow1 size="24px" />
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DictionaryEntry;
