import { Box } from "@mui/material";
import ConversationInput from "./ConversationInput";
import DeepseekMessage from "./DeepseekMessage";
import { Message } from "@/lib/model";
import UserMessage from "./UserMessage";

interface Props {
  messages: Message[];
  onSend: (question: string) => Promise<void>;
}

const Conversation: React.FC<Props> = ({ messages, onSend }) => {
  return (
    <>
      <Box display="flex" flexDirection="column" gap="16px" pb="24px">
        {messages.map(({ source, content }, i) => {
          return source === "deepseek" ? (
            <DeepseekMessage key={i} message={content} />
          ) : (
            <UserMessage key={i} message={content} />
          );
        })}
      </Box>
      <ConversationInput onSend={onSend} />
    </>
  );
};

export default Conversation;
