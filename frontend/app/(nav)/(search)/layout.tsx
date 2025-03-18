import { Box } from "@mui/material";
import Header from "@/(nav)/profile/_components/Header";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box width="100%">{children}</Box>;
}
