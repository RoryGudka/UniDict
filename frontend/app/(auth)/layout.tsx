import { Box, Paper } from "@mui/material";

import AuthedRedirect from "@/(auth)/_components/AuthedRedirect";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
    >
      <Box
        width="100%"
        maxWidth="400px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Paper
          sx={{
            padding: "24px",
            maxWidth: "90vw",
            width: "100%",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 14px 38px",
          }}
        >
          <AuthedRedirect />
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
