import { Box, IconButton } from "@mui/material";

import { CiCircleQuestion } from "react-icons/ci";
import { SetState } from "@/lib/model";

enum Modifier {
  Examples = "Examples",
  Conjugations = "Conjugations",
}
const modifiers = {
  [Modifier.Examples]: `Add example sentences for each definition for this dictionary entry`,
  [Modifier.Conjugations]: `Add a table of conjugations at the end of this dictionary entry; add a divider between the dictionary entry and the table, give the table the name 'Conjugations', and give it the columns 'Form' and 'Conjugation'`,
};

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
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      pt="8px"
    >
      <Box display="flex" alignItems="center" gap="8px">
        <u
          style={{ cursor: "pointer" }}
          onClick={() => onModifyEntry(entry, modifiers[Modifier.Examples])}
        >
          Examples
        </u>
        <u
          style={{ cursor: "pointer" }}
          onClick={() => onModifyEntry(entry, modifiers[Modifier.Conjugations])}
        >
          Conjugations
        </u>
      </Box>
      <IconButton onClick={() => setIsChatOpen(!isChatOpen)}>
        <CiCircleQuestion fontSize="28px" />
      </IconButton>
    </Box>
  );
};

export default DictionaryEntryModifiers;
