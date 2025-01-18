import { Box } from "@mui/material";
import Image from "next/image";
import Markdown from "@/components/Markdown";
import deepseek from "@/public/deepseek.ico";

interface Props {
  message: string;
}

const DeepseekMessage: React.FC<Props> = ({ message }) => {
  return (
    <Box display="flex" gap="8px">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="32px"
        height="32px"
        boxShadow="0 0 0 1px #d5e4ff"
        borderRadius="32px"
        mt="10px"
      >
        <Image src={deepseek} alt="Deepseek icon" height={22} width={22} />
      </Box>
      <Box display="inline-block" padding="10px 20px" borderRadius="24px">
        <Markdown content={message} />
      </Box>
    </Box>
  );
};

export default DeepseekMessage;
