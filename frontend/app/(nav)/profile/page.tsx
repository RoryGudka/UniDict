"use client";

import {
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { get, put } from "@/_lib/api";

import GenerationSettings from "./_components/GenerationSettings";
import { Profile } from "@/_lib/model";
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
