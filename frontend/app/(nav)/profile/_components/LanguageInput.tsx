import { Box, IconButton } from "@mui/material";

import { OutlinedInput } from "@mui/material";
import { Remove } from "@mui/icons-material";
import { useState } from "react";

interface LanguageInputProps {
  onRemove: () => void;
}

const LanguageInput: React.FC<LanguageInputProps> = ({ onRemove }) => {
  const [language, setLanguage] = useState("");

  return (
    <Box display="flex" alignItems="center" gap="8px">
      <OutlinedInput
        fullWidth
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        placeholder="e.g. English"
        sx={{
          fontFamily: "Noto Sans JP",
          lineHeight: 1,
          bgcolor: "#f3f3f3",
          borderRadius: "24px",
          border: "none",
          outline: "none",
          boxShadow: "none",
          "& input": { py: "13px" },
          "& fieldset": { border: "none" },
        }}
      />
      <IconButton onClick={onRemove}>
        <Remove />
      </IconButton>
    </Box>
  );
};

export default LanguageInput;
