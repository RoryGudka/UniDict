import { Box, IconButton } from "@mui/material";

import { CiCircleQuestion } from "react-icons/ci";
import { SetState } from "@/_lib/model";

interface Props {
  isChatOpen: boolean;
  setIsChatOpen: SetState<boolean>;
}

const TranslationModifiers: React.FC<Props> = ({
  isChatOpen,
  setIsChatOpen,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      pt="8px"
    >
      <Box />
      <IconButton onClick={() => setIsChatOpen(!isChatOpen)}>
        <CiCircleQuestion fontSize="28px" />
      </IconButton>
    </Box>
  );
};

export default TranslationModifiers;
