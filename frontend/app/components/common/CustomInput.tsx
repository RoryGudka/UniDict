import { Box, OutlinedInput } from "@mui/material";
import React, { ChangeEvent, KeyboardEvent, ReactNode } from "react";

interface Props {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeydown: (e: KeyboardEvent<HTMLInputElement>) => void;
  icons: ReactNode;
}

const CustomInput: React.FC<Props> = ({ value, onChange, onKeydown }) => {
  return (
    <Box position="relative">
      <OutlinedInput
        fullWidth
        value={value}
        onChange={onChange}
        onKeyDown={onKeydown}
        placeholder="Enter a word or phrase"
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
    </Box>
  );
};

export default CustomInput;
