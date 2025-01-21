import { Box, OutlinedInput } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { CiSearch, CiUndo } from "react-icons/ci";

interface Props {
  onSend: (search: string) => void;
}

const SearchInput: React.FC<Props> = ({ onSend }) => {
  const [search, setSearch] = useState("");

  const handleSend = async () => {
    if (search) await onSend(search);
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
        placeholder="Enter a word or phrase"
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
