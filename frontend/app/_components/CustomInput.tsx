import { Box, OutlinedInput, OutlinedInputProps } from "@mui/material";

import React from "react";

const CustomInput: React.FC<OutlinedInputProps> = (props) => {
  return (
    <Box position="relative">
      <OutlinedInput
        {...props}
        fullWidth
        sx={{
          fontFamily: "Noto Sans JP",
          lineHeight: props.multiline ? undefined : 1,
          bgcolor: "#f3f3f3",
          borderRadius: "24px",
          border: "none",
          outline: "none",
          boxShadow: "none",
          "& input": { py: "13px", lineHeight: 1 },
          "& fieldset": { border: "none" },
        }}
      />
    </Box>
  );
};

export default CustomInput;
