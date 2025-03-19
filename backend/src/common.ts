import { Message, Provider } from "@/model";

import { ChatCompletionCreateParams } from "openai/resources";
import OpenAI from "openai";
import { WebSocket } from "ws";
import { nanoid } from "nanoid";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getClient = (provider: Provider) => {
  if (provider === "openai") return openai;
  else return deepseek;
};

const getModel = (provider: Provider) => {
  if (provider === "openai") return "gpt-4o-mini-2024-07-18";
  else return "deepseek-chat";
};

export const createId = () => {
  return nanoid().slice(0, 5);
};

const makeExamples = (examples: string[]) => {
  return `Examples:\n${examples.join("\n")}`;
};

interface MakeChatCompletionsRequestParams
  extends Omit<ChatCompletionCreateParams, "model" | "stream"> {
  provider: Provider;
}

export const makeChatCompletionsRequest = async ({
  provider,
  ...params
}: MakeChatCompletionsRequestParams) => {
  const client = getClient(provider);
  const model = getModel(provider);
  return await client.chat.completions.create({
    ...params,
    model,
    stream: true,
  });
};

interface SendWebsocketMessageParams {
  ws: WebSocket;
  parts: string[];
}

const sendWebsocketMessage = ({ ws, parts }: SendWebsocketMessageParams) => {
  ws.send(parts.join("⌺"));
};

interface SendGetPartsMessageParams {
  ws: WebSocket;
  requestId: string;
  partId: string;
  segment: string;
}

export const sendGetPartsMessage = ({
  ws,
  requestId,
  partId,
  segment,
}: SendGetPartsMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "GET_PARTS", partId, segment],
  });
};

interface SendGetEntriesMessageParams {
  ws: WebSocket;
  requestId: string;
  entryId: string;
  segment: string;
}

export const sendGetEntriesMessage = ({
  ws,
  requestId,
  entryId,
  segment,
}: SendGetEntriesMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "GET_ENTRIES", entryId, segment],
  });
};

interface SendGetEntryDetailMessageParams {
  ws: WebSocket;
  requestId: string;
  entryId: string;
  detailId: string;
  segment: string;
}

export const sendGetEntryDetailMessage = ({
  ws,
  requestId,
  entryId,
  detailId,
  segment,
}: SendGetEntryDetailMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "GET_ENTRY_DETAILS", entryId, detailId, segment],
  });
};

interface SendEntryDoneMessageParams {
  ws: WebSocket;
  requestId: string;
  entryId: string;
}

export const sendEntryDoneMessage = ({
  ws,
  requestId,
  entryId,
}: SendEntryDoneMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "SET_DONE", "ENTRY", entryId],
  });
};

interface SendGetEntryModificationMessageParams {
  ws: WebSocket;
  requestId: string;
  entryId: string;
  detailId: string;
  segment: string;
}

export const sendGetEntryModificationMessage = ({
  ws,
  requestId,
  entryId,
  detailId,
  segment,
}: SendGetEntryModificationMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "GET_ENTRY_MODIFICATION", entryId, detailId, segment],
  });
};

interface SendGetEntryConversationMessageParams {
  ws: WebSocket;
  requestId: string;
  entryId: string;
  detailId: string;
  segment: string;
}

export const sendGetEntryConversationMessage = ({
  ws,
  requestId,
  entryId,
  detailId,
  segment,
}: SendGetEntryConversationMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "GET_ENTRY_CONVERSATION", entryId, detailId, segment],
  });
};

interface SendGetTranslationMessageParams {
  ws: WebSocket;
  requestId: string;
  segment: string;
}

export const sendGetTranslationMessage = ({
  ws,
  requestId,
  segment,
}: SendGetTranslationMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "GET_TRANSLATION", segment],
  });
};

interface SendGetTranslationConversationMessageParams {
  ws: WebSocket;
  requestId: string;
  translationId: string;
  segment: string;
}

export const sendGetTranslationConversationMessage = ({
  ws,
  requestId,
  translationId,
  segment,
}: SendGetTranslationConversationMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "GET_TRANSLATION_CONVERSATION", translationId, segment],
  });
};

interface SendRequestDoneMessageParams {
  ws: WebSocket;
  requestId: string;
}

export const sendRequestDoneMessage = ({
  ws,
  requestId,
}: SendRequestDoneMessageParams) => {
  sendWebsocketMessage({
    ws,
    parts: [requestId, "SET_DONE", "REQUEST"],
  });
};

interface GetPartsParams {
  ws: WebSocket;
  requestId: string;
  provider: Provider;
  content: string;
  generateParts: boolean;
}

export const getParts = async ({
  ws,
  requestId,
  provider,
  content,
  generateParts,
}: GetPartsParams) => {
  let message = "";
  let temp = "";
  let parts: { id: string; value: string }[] = [];

  const addPart = (value: string) => {
    const id = createId();
    parts.push({ id, value });
    if (!generateParts) return;
    sendGetPartsMessage({ ws, requestId, partId: id, segment: value });
  };

  const examples = makeExamples([
    "<user_message>The scientist developed the laws of thermodynamics</user_message><assistant_message>The|scientist|developed|the|laws of thermodynamics</assistant_message>",
    "<user_message>Thank you for the fabric softener</user_message><assistant_message>Thank you|for|the|fabric softener</assistant_message>",
    "<user_message>See you later</user_message><assistant_message>see you later</assistant_message>",
    "<user_message>君のことが好きだ</user_message><assistant_message>君|の|こと|が|好き|だ</assistant_message>",
    "<user_message>お前も行ったでしょう</user_message><assistant_message>お前|も|行った|でしょう</assistant_message>",
    "<user_message>君の名は</user_message><assistant_message>君の名は</assistant_message>",
  ]);

  const stream = await makeChatCompletionsRequest({
    provider,
    messages: [
      {
        role: "system",
        content: `You are a text parser for a universal dictionary application. Split the user's message into words or phrases that dictionary entries can be generated for, using | as a delimiter. Keep longer concepts, phrases, conjunctions, and verb conjugations in the same segment.\n${examples}`,
      },
      { role: "user", content },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      message += content;
      temp += content;
    }
    if (temp.includes("|")) {
      addPart(temp.split("|")[0]);
      temp = temp.split("|")[1];
    }
  }
  if (temp) addPart(temp);

  return message.split("|");
};

interface GetEntriesParams {
  ws: WebSocket;
  requestId: string;
  provider: Provider;
  learningLang: string;
  content: string;
}

export const getEntries = async ({
  ws,
  requestId,
  provider,
  learningLang,
  content,
}: GetEntriesParams) => {
  let message = "";
  let temp = "";
  let entries: { id: string; value: string }[] = [];

  const addEntry = (value: string) => {
    const id = createId();
    entries.push({ id, value });
    sendGetEntriesMessage({ ws, requestId, entryId: id, segment: value });
  };

  const examples = makeExamples([
    "<system_prompt>Target language: Japanese</system_prompt><user_message>恋人</user_message><assistant_message>恋人|恋人つなぎ|恋人未満</assistant_message>",
    "<system_prompt>Target language: Japanese</system_prompt><user_message>?跡</user_message><assistant_message>足跡|遺跡|追跡|奇跡|筆跡|痕跡|傷跡|形跡|軌跡|史跡</assistant_message>",
    "<system_prompt>Target language: Korean</system_prompt><user_message>Sound</user_message><assistant_message>소리|하다|든든하다|울리다|온전하다|음향|건실하다|건전하다</assistant_message>",
  ]);

  const stream = await makeChatCompletionsRequest({
    provider,
    messages: [
      {
        role: "system",
        content: `You are an entry generator for a universal dictionary application. List dictionary entries that are relevant to use the user's query, using | as a delimiter. If the user sends an entire sentence or more, pick out the most relevant entries. Limit: 3.\n\n${examples}\n\nTarget language: ${learningLang}`,
      },
      { role: "user", content },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      message += content;
      temp += content;
    }
    if (temp.includes("|")) {
      addEntry(temp.split("|")[0]);
      temp = temp.split("|")[1];
    }
  }
  if (temp) addEntry(temp);

  return entries;
};

interface GetEntryDetailParams {
  ws: WebSocket;
  requestId: string;
  provider: Provider;
  learningLang: string;
  nativeLang: string;
  entryId: string;
  entry: string;
  detailId: string;
  instructions: string;
}

export const getEntryDetail = async ({
  ws,
  requestId,
  provider,
  learningLang,
  nativeLang,
  entryId,
  entry,
  detailId,
  instructions,
}: GetEntryDetailParams) => {
  const addEntryDetail = (value: string) => {
    sendGetEntryDetailMessage({
      ws,
      requestId,
      entryId,
      detailId,
      segment: value,
    });
  };

  const examples = makeExamples([
    "<system_prompt>User learning language: Japanese</system_prompt><user_message>告白</user_message><assistant_message>こくはく\n*Noun, Suru verb, Transitive verb*\n1. confession (to a crime, wrongdoing, etc.); admission\n*Noun, Suru verb, Intransitive verb*\n2. professing one's feelings (to someone one wants to go out with); declaration of love</assistant_message>",
    "<system_prompt>User learning language: Chinese</system_prompt><user_message>谢天谢地</user_message><assistant_message>xiè tiān xiè dì\n*감탄사*\n1. 다행스럽게 생각하거나 안도할 때 쓰는 말\n감탄사\n2. 무슨 일이 잘 되어 감사하거나 안심할 때 사용하는 표현.</assistant_message>",
  ]);

  const additionalInstructions = instructions
    ? `\nUser added instructions: ${instructions}`
    : "";

  const stream = await makeChatCompletionsRequest({
    provider,
    messages: [
      {
        role: "system",
        content: `You are an entry generator for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Give a brief list of possible definitions and their parts of speech. If applicable for the language/word do not forget the reading (i.e. pinyin or furigana).\n\n${examples}\n\nUser learning language: ${learningLang}\nUser native language: ${nativeLang}${additionalInstructions}`,
      },
      { role: "user", content: entry },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) addEntryDetail(content);
  }

  sendEntryDoneMessage({ ws, requestId, entryId });
};

interface GetEntryDetailsParams {
  ws: WebSocket;
  requestId: string;
  provider: Provider;
  learningLang: string;
  nativeLang: string;
  entries: { id: string; value: string }[];
  instructions: string;
}

export const getEntryDetails = async ({
  entries,
  ...params
}: GetEntryDetailsParams) => {
  for (const { id, value } of entries) {
    await getEntryDetail({
      ...params,
      entryId: id,
      entry: value,
      detailId: createId(),
      instructions: params.instructions,
    });
  }
};

interface GetEntryModificationParams {
  ws: WebSocket;
  requestId: string;
  provider: Provider;
  learningLang: string;
  nativeLang: string;
  entryId: string;
  content: string;
  command: string;
}

export const getEntryModification = async ({
  ws,
  requestId,
  provider,
  learningLang,
  nativeLang,
  entryId,
  content,
  command,
}: GetEntryModificationParams) => {
  const detailId = createId();

  const addEntrySegment = (value: string) => {
    sendGetEntryModificationMessage({
      ws,
      requestId,
      entryId,
      detailId,
      segment: value,
    });
  };

  const stream = await makeChatCompletionsRequest({
    provider,
    messages: [
      {
        role: "system",
        content: `You are an entry generator for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Expand on the previously generated entry given to you by the user with the following directive: ${command}.\n\nUser learning language: ${learningLang}\nUser native language: ${nativeLang}`,
      },
      { role: "user", content },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) addEntrySegment(content);
  }
};

interface GetEntryConversationParams {
  ws: WebSocket;
  requestId: string;
  provider: Provider;
  learningLang: string;
  nativeLang: string;
  entryId: string;
  detailId: string;
  content: string;
  messages: { source: "user" | "assistant"; content: string }[];
}

export const getEntryConversation = async ({
  ws,
  requestId,
  provider,
  learningLang,
  nativeLang,
  entryId,
  detailId,
  content,
  messages,
}: GetEntryConversationParams) => {
  const addEntrySegment = (value: string) => {
    sendGetEntryConversationMessage({
      ws,
      requestId,
      entryId,
      detailId,
      segment: value,
    });
  };

  const stream = await makeChatCompletionsRequest({
    provider,
    messages: [
      {
        role: "system",
        content: `You are an chatbot for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Answer any questions the user may have on the following dictionary entry:\n\n${content}`,
      },
      ...messages.map(
        ({ source, content }) =>
          ({
            role: source === "assistant" ? "system" : "user",
            content,
          } as { role: "system" | "user"; content: string })
      ),
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) addEntrySegment(content);
  }
};

interface GetTranslationParams {
  ws: WebSocket;
  requestId: string;
  provider: Provider;
  learningLang: string;
  nativeLang: string;
  content: string;
  instructions: string;
}

export const getTranslation = async ({
  ws,
  requestId,
  provider,
  learningLang,
  nativeLang,
  content,
  instructions,
}: GetTranslationParams) => {
  const addDetailSegment = (value: string) => {
    sendGetTranslationMessage({ ws, requestId, segment: value });
  };

  const additionalInstructions = instructions
    ? `\nUser added instructions: ${instructions}`
    : "";

  const stream = await makeChatCompletionsRequest({
    provider,
    messages: [
      {
        role: "system",
        content: `You are a translator for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Give a translation for the following phrase or sentence, explain any words or grammar patterns that might be confusing. Be concise but thorough.\n\nUser learning language: ${learningLang}\nUser native language: ${nativeLang}${additionalInstructions}`,
      },
      { role: "user", content },
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) addDetailSegment(content);
  }
};

interface GetTranslationConversationParams {
  ws: WebSocket;
  requestId: string;
  provider: Provider;
  learningLang: string;
  nativeLang: string;
  translationId: string;
  content: string;
  messages: Message[];
}

export const getTranslationConversation = async ({
  ws,
  requestId,
  provider,
  learningLang,
  nativeLang,
  translationId,
  content,
  messages,
}: GetTranslationConversationParams) => {
  const addTranslationSegment = (value: string) => {
    sendGetTranslationConversationMessage({
      ws,
      requestId,
      translationId,
      segment: value,
    });
  };

  const stream = await makeChatCompletionsRequest({
    provider,
    messages: [
      {
        role: "system",
        content: `You are an chatbot for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Answer any questions the user may have on the following translation:\n\n${content}`,
      },
      ...messages.map(
        ({ source, content }) =>
          ({
            role: source === "assistant" ? "system" : "user",
            content,
          } as { role: "system" | "user"; content: string })
      ),
    ],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) addTranslationSegment(content);
  }
};
