import { Add, ExpandMore, Remove } from "@mui/icons-material";
import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";

import CustomInput from "@/_components/CustomInput";
import { LanguageSettings } from "@/_lib/model";
import { useState } from "react";

interface Props {
  language: string;
  settings: LanguageSettings;
  onUpdate: (settings: LanguageSettings) => void;
  onRemoveModifier: (index: number) => void;
  onAddModifier: () => void;
}

const LanguageGenerationSettings: React.FC<Props> = ({
  language,
  settings,
  onUpdate,
  onRemoveModifier,
  onAddModifier,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <Box borderBottom="1px solid #e0e0e0">
      <Box
        display="flex"
        alignItems="center"
        gap="8px"
        onClick={() => setOpen(!open)}
        padding="24px 0"
        sx={{ cursor: "pointer" }}
      >
        <ExpandMore
          sx={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
        <Typography fontWeight={600}>{language} </Typography>
      </Box>
      <Collapse in={open}>
        <Box py="16px" px="8px">
          <Box display="flex" flexDirection="column" gap="16px">
            <Typography fontWeight={600}>Dictionary entry prompt</Typography>
            <CustomInput
              placeholder="How would you like your dictionary entries to be generated?"
              multiline
              minRows={2}
              value={settings.entryGenerationPrompt}
              onChange={(e) =>
                onUpdate({
                  ...settings,
                  entryGenerationPrompt: e.target.value,
                })
              }
            />
            <Typography fontWeight={600} gutterBottom>
              Translation prompt
            </Typography>
            <CustomInput
              placeholder="How would you like your translations to be generated?"
              multiline
              minRows={2}
              value={settings.translationGenerationPrompt}
              onChange={(e) =>
                onUpdate({
                  ...settings,
                  translationGenerationPrompt: e.target.value,
                })
              }
            />
            <Typography fontWeight={600} gutterBottom>
              Entry Modifiers
            </Typography>
            <Box display="flex" flexDirection="column" gap="24px">
              {settings.entryModifiers.map((modifier, index) => (
                <Box
                  key={modifier.id}
                  display="flex"
                  flexDirection="column"
                  gap="16px"
                >
                  <Box display="flex" alignItems="center" gap="8px">
                    <Box flex={1}>
                      <CustomInput
                        value={modifier.name}
                        placeholder="e.g. Conjugations"
                        onChange={(e) =>
                          onUpdate({
                            ...settings,
                            entryModifiers: settings.entryModifiers.map(
                              (m, i) =>
                                i === index ? { ...m, name: e.target.value } : m
                            ),
                          })
                        }
                      />
                    </Box>
                    <IconButton onClick={() => onRemoveModifier(index)}>
                      <Remove />
                    </IconButton>
                  </Box>
                  <CustomInput
                    multiline
                    minRows={2}
                    value={modifier.prompt}
                    placeholder="e.g. Add example sentences for each definition"
                    onChange={(e) =>
                      onUpdate({
                        ...settings,
                        entryModifiers: settings.entryModifiers.map((m, i) =>
                          i === index ? { ...m, prompt: e.target.value } : m
                        ),
                      })
                    }
                  />
                </Box>
              ))}
            </Box>
            <Button startIcon={<Add />} onClick={() => onAddModifier()}>
              Add Modifier
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default LanguageGenerationSettings;
