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
      <Paper
        sx={{
          padding: "24px",
          maxWidth: 400,
          width: "100%",
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 14px 38px",
        }}
      >
        <AuthedRedirect />
        {children}
      </Paper>
    </Box>
  );
}
