import { Box } from "@mui/material";
import { DataContextProvider } from "@/_contexts/DataContext";
import Navigation from "@/(nav)/_components/Navigation";
import WebsocketAlert from "@/(nav)/_components/WebsocketAlert";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Noto Sans JP",
        lineHeight: 2,
        "& ol": { pl: "18px" },
        "& ul": { pl: "18px" },
      }}
    >
      <DataContextProvider>
        {children}
        <Navigation />
        <WebsocketAlert />
      </DataContextProvider>
    </Box>
  );
}
