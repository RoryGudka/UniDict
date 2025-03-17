"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ToastProvider } from "@/_contexts/ToastContext";
import { UserProvider } from "@/_contexts/UserContext";
import theme from "@/_lib/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <UserProvider>{children}</UserProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
