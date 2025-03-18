import AssistantMessage from "@/(nav)/(search)/_components/AssistantMessage";
import { Box } from "@mui/material";
import ConversationInput from "@/(nav)/(search)/_components/ConversationInput";
import { Message } from "@/_lib/model";
import UserMessage from "@/(nav)/(search)/_components/UserMessage";

interface Props {
  messages: Message[];
  onSend: (question: string) => Promise<void>;
}

const Conversation: React.FC<Props> = ({ messages, onSend }) => {
  return (
    <>
      <Box display="flex" flexDirection="column" gap="16px" pb="24px">
        {messages.map(({ source, content }, i) => {
          return source === "assistant" ? (
            <AssistantMessage key={i} message={content} />
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
