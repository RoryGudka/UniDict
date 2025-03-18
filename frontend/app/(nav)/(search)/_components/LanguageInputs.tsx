"use client";

import { Box, Collapse, OutlinedInput } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { useDataContext } from "@/_contexts/DataContext";
import { useDebouncedEffect } from "@/_lib/misc";

interface Props {
  isLanguageOpen: boolean;
}

const LanguageInputs: React.FC<Props> = ({ isLanguageOpen }) => {
  const { nativeLang, learningLang, setNativeLang, setLearningLang } =
    useDataContext();
  const [cookies, setCookie] = useCookies(["languages"]);
  const [localNativeLang, setLocalNativeLang] = useState(nativeLang);
  const [localLearningLang, setLocalLearningLang] = useState(learningLang);

  useEffect(() => {
    if (cookies.languages?.learning && cookies.languages?.native) {
      setNativeLang(cookies.languages.native);
      setLocalNativeLang(cookies.languages.native);
      setLearningLang(cookies.languages.learning);
      setLocalLearningLang(cookies.languages.learning);
    }
  }, [cookies, setLearningLang, setNativeLang]);

  useDebouncedEffect(
    () => {
      setNativeLang(localNativeLang);
      setLearningLang(localLearningLang);
      setCookie("languages", {
        native: localNativeLang,
        learning: localLearningLang,
      });
    },
    500,
    [localNativeLang, localLearningLang]
  );

  const handleLearningLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalLearningLang(e.target.value);
  };

  const handleNativeLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalNativeLang(e.target.value);
  };

  return (
    <Collapse in={isLanguageOpen} sx={{ width: "100%" }}>
      <Box
        display="flex"
        flexDirection="column"
        gap="16px"
        width="100%"
        pb="32px"
      >
        <span style={{ fontWeight: 600 }}>Languages:</span>
        <Box display="flex" alignItems="center">
          <span style={{ width: "80px" }}>Native:</span>
          <Box position="relative" flex="1 0 0">
            <OutlinedInput
              fullWidth
              value={localNativeLang}
              onChange={handleNativeLangChange}
              placeholder="e.g. Japanese"
              sx={{
                fontFamily: "Noto Sans JP",
                lineHeight: 1,
                bgcolor: "#f3f3f3",
                borderRadius: "24px",
                border: "none",
                outline: "none",
                boxShadow: "none",
                "& input": { py: "13px" },
                "& fieldset": { border: "none" },
              }}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <span style={{ width: "80px" }}>Learning:</span>
          <Box position="relative" flex="1 0 0">
            <OutlinedInput
              fullWidth
              value={localLearningLang}
              onChange={handleLearningLangChange}
              placeholder="e.g. English"
              sx={{
                fontFamily: "Noto Sans JP",
                lineHeight: 1,
                bgcolor: "#f3f3f3",
                borderRadius: "24px",
                border: "none",
                outline: "none",
                boxShadow: "none",
                "& input": { py: "13px" },
                "& fieldset": { border: "none" },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
};

export default LanguageInputs;
