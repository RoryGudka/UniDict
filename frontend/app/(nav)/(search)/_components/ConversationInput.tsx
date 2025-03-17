import { Box, OutlinedInput } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { CiLocationArrow1, CiUndo } from "react-icons/ci";

interface Props {
  onSend: (question: string) => Promise<void>;
}

const ConversationInput: React.FC<Props> = ({ onSend }) => {
  const [question, setQuestion] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && question) {
      e.preventDefault();
      onSend(question);
      setQuestion("");
    }
  };

  const handleClick = () => {
    if (question) {
      onSend(question);
      setQuestion("");
    }
  };

  return (
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
        onClick={handleClick}
      >
        <CiLocationArrow1 size="24px" />
      </Box>
    </Box>
  );
};

export default ConversationInput;
