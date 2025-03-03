import { Box } from "@mui/material";

interface Props {
  message: string;
}

const UserMessage: React.FC<Props> = ({ message }) => {
  return (
    <Box display="flex" justifyContent="flex-end" gap="8px">
      <Box
        display="inline-block"
        bgcolor="#f3f3f3"
        padding="10px 20px"
        borderRadius="24px"
        maxWidth="calc(100% - 40px)"
      >
        {message}
      </Box>
    </Box>
  );
};

export default UserMessage;
