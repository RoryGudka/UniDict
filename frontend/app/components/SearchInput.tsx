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
    if (e.key === "Enter") handleSend();
  };

  return (
    <Box position="relative">
      <OutlinedInput
        fullWidth
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        placeholder="Enter a word or phrase"
        sx={{
          fontFamily: "Noto Sans JP",
          fontSize: "20px",
          lineHeight: 1,
          "& input": { py: "13px" },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: "54px",
          top: "8px",
          width: "38px",
          height: "38px",
          display: search ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleReset}
      >
        <CiUndo size="28px" />
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: "8px",
          top: "8px",
          bgcolor: "rgba(0, 0, 0, 0.1)",
          width: "38px",
          height: "38px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={handleSend}
      >
        <CiSearch size="28px" />
      </Box>
    </Box>
  );
};

export default SearchInput;
