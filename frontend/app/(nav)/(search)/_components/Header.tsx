"use client";

import { Box, IconButton, Skeleton } from "@mui/material";
import React, { useState } from "react";

import { CiGlobe } from "react-icons/ci";
import LanguageInputs from "./LanguageInputs";
import Link from "next/link";
import { Settings } from "@mui/icons-material";
import { useDataContext } from "@/_contexts/DataContext";
import { useUser } from "@/_contexts/UserContext";

interface Props {
  title: string;
}

const Header: React.FC<Props> = ({ title }) => {
  const { nativeLang, learningLang } = useDataContext();
  const { user, isLoading } = useUser();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const handleToggleLanguageOpen = () => {
    setIsLanguageOpen((isLanguageOpen) => !isLanguageOpen);
  };

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
        <Box display="flex" alignItems="center" gap="8px">
          {isLoading ? (
            <Skeleton width="150px" />
          ) : nativeLang && learningLang ? (
            <span style={{ color: "rgba(0, 0, 0, 0.54)" }}>
              {nativeLang} ⟷ {learningLang}
            </span>
          ) : (
            <span style={{ color: "rgba(0, 0, 0, 0.54)" }}>
              Languages not set
            </span>
          )}

          {isLoading ? (
            <Skeleton variant="circular" width="44px" height="44px" />
          ) : user ? (
            <Link href="/profile">
              <IconButton>
                <Settings />
              </IconButton>
            </Link>
          ) : (
            <IconButton onClick={handleToggleLanguageOpen}>
              <CiGlobe size="28px" />
            </IconButton>
          )}
        </Box>
      </Box>
      <LanguageInputs isLanguageOpen={isLanguageOpen} />
    </>
  );
};

export default Header;
