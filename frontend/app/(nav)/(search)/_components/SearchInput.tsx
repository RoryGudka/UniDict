import { Box, OutlinedInput } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { CiSearch, CiUndo } from "react-icons/ci";

import { useDataContext } from "@/_contexts/DataContext";
import { useToast } from "@/_contexts/ToastContext";

interface Props {
  onSend: (search: string) => void;
  placeholder: string;
}

const SearchInput: React.FC<Props> = ({ onSend, placeholder }) => {
  const [search, setSearch] = useState("");
  const { nativeLang, learningLang } = useDataContext();
  const { showToast } = useToast();

  const handleSend = async () => {
    if (!nativeLang || !learningLang) {
      return showToast("Languages not set", "error");
    } else if (search) {
      await onSend(search);
    }
  };

  const handleReset = () => {
    setSearch("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
      e.preventDefault();
    }
  };

  return (
    <Box position="relative">
      <OutlinedInput
        fullWidth
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        placeholder={placeholder}
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
          "& textarea": { height: search ? undefined : "19px" },
          "& fieldset": { border: "none" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: "54px",
          top: "8.5px",
          width: "32px",
          height: "32px",
          display: search ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleReset}
      >
        <CiUndo size="24px" />
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: "9px",
          top: "9px",
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
        <CiSearch size="24px" />
      </Box>
    </Box>
  );
};

export default SearchInput;
