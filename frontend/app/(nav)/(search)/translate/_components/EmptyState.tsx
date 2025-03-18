import { Box } from "@mui/material";

const EmptyState: React.FC = () => {
  return (
    <Box color="#888888" pt="24px">
      Welcome to Uni-Dictionary's translator! Enter any sentence in the language
      of your choice to get a detailed translation with word-by-word breakdowns.
      Customize your translation output with specific instructions to focus on
      what matters most to you. Need clarification on grammar or usage? Ask
      questions to better understand the translation and language patterns.
    </Box>
  );
};

export default EmptyState;
