import {
  Box,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  EntryModifier,
  LanguageSettings,
  Profile,
  getDefaultLanguageSettings,
} from "@/_lib/model";
import { useEffect, useState } from "react";

import CustomInput from "@/_components/CustomInput";
import Header from "@/(nav)/profile/_components/Header";
import LanguageGenerationSettings from "./LanguageSettings";
import LearningLanguages from "./LearningLanguages";
import _ from "lodash";
import { createId } from "@/_lib/misc";
import { put } from "@/_lib/api";
import { useUser } from "@/_contexts/UserContext";
import { useWarnIfUnsavedChanges } from "@/_lib/misc";

const GenerationSettings: React.FC = () => {
  const { profile, setProfile, authToken, signOutUser } = useUser();
  const [editCache, setEditCache] = useState<Profile>(profile);

  useEffect(() => {
    setEditCache({ ...profile });
  }, [profile]);

  const handleProviderChange = (value: string) => {
    setEditCache((prev) => ({
      ...prev,
      provider: value as "openai" | "deepseek",
    }));
  };

  const handleNativeLanguageChange = (value: string) => {
    setEditCache((prev) => ({
      ...prev,
      nativeLanguage: value,
    }));
  };

  const selectLearningLanguage = (language: string) => {
    setEditCache((prev) => ({
      ...prev,
      learningLanguage: language,
    }));
  };

  const addLearningLanguage = (language: string) => {
    if (!editCache.learningLanguages[language]) {
      setEditCache((prev) => ({
        ...prev,
        learningLanguages: {
          ...prev.learningLanguages,
          [language]: getDefaultLanguageSettings(),
        },
      }));
    }
  };

  const removeLearningLanguage = (language: string) => {
    setEditCache((prev) => {
      const newCache = { ...prev };
      delete newCache.learningLanguages[language];
      return newCache;
    });
  };

  const updateLanguageSettings = (
    language: string,
    settings: Partial<LanguageSettings>
  ) => {
    setEditCache((prev) => ({
      ...prev,
      learningLanguages: {
        ...prev.learningLanguages,
        [language]: {
          ...prev.learningLanguages[language],
          ...settings,
        },
      },
    }));
  };

  const addModifier = (language: string) => {
    const newModifier: EntryModifier = {
      id: createId(),
      name: "",
      prompt: "",
    };

    setEditCache((prev) => ({
      ...prev,
      learningLanguages: {
        ...prev.learningLanguages,
        [language]: {
          ...prev.learningLanguages[language],
          entryModifiers: [
            ...(prev.learningLanguages[language]?.entryModifiers || []),
            newModifier,
          ],
        },
      },
    }));
  };

  const removeModifier = (language: string, index: number) => {
    setEditCache((prev) => ({
      ...prev,
      learningLanguages: {
        ...prev.learningLanguages,
        [language]: {
          ...prev.learningLanguages[language],
          entryModifiers: prev.learningLanguages[
            language
          ].entryModifiers.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      if (!authToken) throw new Error("No auth token available");
      await put<Profile>("/api/profile", {
        body: editCache,
        authToken,
      });
      setProfile(editCache);
    } catch (e) {
      console.error("Error updating profile:", e);
    }
  };

  useWarnIfUnsavedChanges(!_.isEqual(profile, editCache));

  return (
    <>
      <Header
        title="Generation settings"
        disabled={_.isEqual(profile, editCache)}
        onSave={handleSave}
      />

      <Box
        display="flex"
        flexDirection="column"
        gap="24px"
        maxWidth="600px"
        width="100%"
      >
        <Card>
          <CardContent>
            <Box display="flex" flexDirection="column" gap="16px">
              <Typography fontWeight={600}>AI Provider</Typography>
              <RadioGroup
                value={editCache.provider}
                onChange={(e) => handleProviderChange(e.target.value)}
              >
                <Box display=" flex" alignItems="center">
                  <Radio value="openai" />
                  <Typography>OpenAI</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Radio value="deepseek" />
                  <Typography>Deepseek</Typography>
                </Box>
              </RadioGroup>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" flexDirection="column" gap="16px">
              <Typography fontWeight={600}>Native Language</Typography>
              <CustomInput
                value={editCache.nativeLanguage}
                onChange={(e) => handleNativeLanguageChange(e.target.value)}
                placeholder="e.g. English"
              />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <LearningLanguages
              profile={editCache}
              onSelect={selectLearningLanguage}
              onAdd={addLearningLanguage}
              onRemove={removeLearningLanguage}
            />
          </CardContent>
        </Card>

        {!!Object.keys(editCache.learningLanguages).length && (
          <Card>
            <CardContent>
              <Typography fontWeight={600}>Generation settings</Typography>
              {Object.entries(editCache.learningLanguages).map(
                ([language, settings]) => (
                  <LanguageGenerationSettings
                    key={language}
                    language={language}
                    settings={settings}
                    onUpdate={(s) => updateLanguageSettings(language, s)}
                    onRemoveModifier={(index) =>
                      removeModifier(language, index)
                    }
                    onAddModifier={() => addModifier(language)}
                  />
                )
              )}
            </CardContent>
          </Card>
        )}
        <Button onClick={() => signOutUser()} color="error">
          Sign out
        </Button>
      </Box>
    </>
  );
};

export default GenerationSettings;
