import { Box, IconButton } from "@mui/material";
import { SetState, defaultLanguageSettings } from "@/_lib/model";

import { CiCircleQuestion } from "react-icons/ci";
import { useDataContext } from "@/_contexts/DataContext";
import { useUser } from "@/_contexts/UserContext";

interface Props {
  entry: string;
  isChatOpen: boolean;
  setIsChatOpen: SetState<boolean>;
  onModifyEntry: (detailId: string, command: string) => void;
}

const DictionaryEntryModifiers: React.FC<Props> = ({
  entry,
  isChatOpen,
  setIsChatOpen,
  onModifyEntry,
}) => {
  const { profile } = useUser();
  const { learningLang } = useDataContext();
  const modifiers =
    profile.learningLanguages?.[learningLang]?.entryModifiers ||
    defaultLanguageSettings.entryModifiers;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      pt="8px"
    >
      <Box display="flex" alignItems="center" gap="8px">
        {...modifiers.map(({ name, prompt }) => (
          <u
            style={{ cursor: "pointer" }}
            onClick={() => onModifyEntry(entry, prompt)}
          >
            {name}
          </u>
        ))}
      </Box>
      <IconButton onClick={() => setIsChatOpen(!isChatOpen)}>
        <CiCircleQuestion fontSize="28px" />
      </IconButton>
    </Box>
  );
};

export default DictionaryEntryModifiers;
