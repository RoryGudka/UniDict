import { Box } from "@mui/material";
import Image from "next/image";
import Markdown from "@/(nav)/_components/Markdown";
import deepseek from "@/public/deepseek.ico";
import openai from "@/public/openai.ico";
import { useUser } from "@/_contexts/UserContext";

interface Props {
  message: string;
}

const AssistantMessage: React.FC<Props> = ({ message }) => {
  const { profile } = useUser();
  const { provider } = profile;

  return (
    <Box display="flex" gap="8px">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="32px"
        height="32px"
        boxShadow={
          provider === "deepseek" ? "0 0 0 1px #d5e4ff" : "0 0 0 1px #0000001a"
        }
        borderRadius="32px"
        mt="10px"
      >
        <Image
          src={provider === "deepseek" ? deepseek : openai}
          alt="Icon"
          height={22}
          width={22}
        />
      </Box>
      <Box display="inline-block" padding="10px 20px" borderRadius="24px">
        <Markdown content={message} />
      </Box>
    </Box>
  );
};

export default AssistantMessage;
