"use client";

import { Box, Button } from "@mui/material";

import React from "react";

interface Props {
  title: string;
  disabled?: boolean;
  onSave: () => void;
}

const Header: React.FC<Props> = ({ title, disabled, onSave }) => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        pb="16px"
      >
        <h1 style={{ fontSize: "16px" }}>{title}</h1>
        <Button
          variant="text"
          color="primary"
          onClick={onSave}
          disabled={disabled}
        >
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default Header;
