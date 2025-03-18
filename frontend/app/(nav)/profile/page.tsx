"use client";

import { Box, Link, Paper, Typography } from "@mui/material";

import GenerationSettings from "./_components/GenerationSettings";
import React from "react";
import { useUser } from "@/_contexts/UserContext";

const ProfilePage: React.FC = () => {
  const { user } = useUser();

  return (
    <>
      <GenerationSettings />
      {!user && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          sx={{ backdropFilter: "blur(4px)" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Paper sx={{ p: "24px" }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              textAlign="center"
            >
              Please <Link href="/signin">sign in</Link> to edit generation
              settings
            </Typography>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default ProfilePage;
