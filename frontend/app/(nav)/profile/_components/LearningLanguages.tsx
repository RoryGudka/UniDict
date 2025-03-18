"use client";

import { Add, Remove } from "@mui/icons-material";
import { Box, IconButton, Radio, RadioGroup, Typography } from "@mui/material";
import React, { useState } from "react";

import CustomInput from "@/_components/CustomInput";
import { Profile } from "@/_lib/model";

interface LearningLanguagesProps {
  profile: Profile;
  onSelect: (language: string) => void;
  onAdd: (language: string) => void;
  onRemove: (language: string) => void;
}

const LearningLanguages: React.FC<LearningLanguagesProps> = ({
  profile,
  onSelect,
  onAdd,
  onRemove,
}) => {
  const [newLanguage, setNewLanguage] = useState("");

  const handleSelectLanguage = (language: string) => {
    onSelect(language);
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      onAdd(newLanguage.trim());
      setNewLanguage("");
      if (!profile.learningLanguage) onSelect(newLanguage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddLanguage();
    }
  };

  return (
    <Box>
      <Box display="flex" flexDirection="column" gap="16px">
        <Typography fontWeight={600}>Learning Languages</Typography>
        <RadioGroup
          value={profile.learningLanguage}
          onChange={(e) => handleSelectLanguage(e.target.value)}
        >
          {Object.keys(profile.learningLanguages).map((language) => (
            <Box key={language} display="flex" alignItems="center" gap="8px">
              <Radio value={language} />
              <Typography key={language} flex={1}>
                {language}
              </Typography>
              <IconButton onClick={() => onRemove(language)}>
                <Remove />
              </IconButton>
            </Box>
          ))}
        </RadioGroup>

        <Box display="flex" alignItems="center" gap="8px">
          <Box flex={1}>
            <CustomInput
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. Japanese"
            />
          </Box>

          <IconButton
            onClick={handleAddLanguage}
            disabled={!newLanguage.trim()}
            color="primary"
          >
            <Add />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default LearningLanguages;
