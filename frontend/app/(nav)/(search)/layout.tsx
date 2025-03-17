import { Box } from "@mui/material";
import LanguageSelect from "@/(nav)/(search)/_components/LanguageSelect";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box>
      <LanguageSelect />
      {children}
    </Box>
  );
}
