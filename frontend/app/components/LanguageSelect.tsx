import {
  Box,
  Collapse,
  IconButton,
  OutlinedInput,
  Skeleton,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";

import { CiGlobe } from "react-icons/ci";
import { SetState } from "@/lib/model";
import { useCookies } from "react-cookie";
import { useDebouncedEffect } from "@/lib/misc";

interface Props {
  nativeLang: string;
  learningLang: string;
  setNativeLang: SetState<string>;
  setLearningLang: SetState<string>;
}

const LanguageSelect: React.FC<Props> = ({
  nativeLang,
  learningLang,
  setLearningLang,
  setNativeLang,
}) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [cookies, setCookie] = useCookies(["languages"]);
  const [localNativeLang, setLocalNativeLang] = useState(nativeLang);
  const [localLearningLang, setLocalLearningLang] = useState(learningLang);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

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

  const handleToggleLanguageOpen = () => {
    setIsLanguageOpen((isLanguageOpen) => !isLanguageOpen);
  };

  const handleLearningLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalLearningLang(e.target.value);
  };

  const handleNativeLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalNativeLang(e.target.value);
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
        <h1 style={{ fontSize: "16px" }}>Uni-Dictionary</h1>
        <Box display="flex" alignItems="center" gap="8px">
          {isFirstRender ? (
            <Skeleton width="150px" />
          ) : (
            <span style={{ color: "rgba(0, 0, 0, 0.54)" }}>
              {localNativeLang} ⟷ {localLearningLang}
            </span>
          )}

          <IconButton onClick={handleToggleLanguageOpen}>
            <CiGlobe size="28px" />
          </IconButton>
        </Box>
      </Box>
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
    </>
  );
};

export default LanguageSelect;
