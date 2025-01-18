import OpenAI from "openai";
import { nanoid } from "nanoid";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com", // DeepSeek API endpoint
  apiKey: process.env.DEEPSEEK_API_KEY, // Set your DeepSeek API key in .env
});

export const createId = () => {
  return nanoid().slice(0, 5);
};

const makeExamples = (examples: string[]) => {
  return `Examples:\n${examples.join("\n")}`;
};

export const getParts = async (
  requestId: string,
  content: string,
  onChunk: (chunk: string) => void
) => {
  let message = "";
  let parts: { id: string; value: string }[] = [];

  const addPart = (value: string) => {
    const id = createId();
    parts.push({ id, value });
    onChunk(`${requestId}:GET_PARTS:${id}:${value}`);
  };

  const examples = makeExamples([
    "`User: The scientist developed the laws of thermodynamics` `Response: The|scientist|developed|the|laws of thermodynamics`",
    "`User: Thank you for the fabric softener` `Response: Thank you|for|the|fabric softener",
    "`User: See you later` `Response: see you later`",
    "`User: 君のことが好きだ` `Response: 君|の|こと|が|好き|だ`",
    "`User: お前も行ったでしょう` `Response: お前|も|行った|でしょう`",
    "`User: `君の名は` `Response: 君の名は`",
  ]);

  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are a text parser for a universal dictionary application. Split the user's message into words or phrases that dictionary entries can be generated for, using | as a delimiter. Keep longer concepts, phrases, conjunctions, and verb conjugations in the same segment.\n${examples}`,
      },
      { role: "user", content },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    message += content;
    if (message.includes("|")) {
      addPart(message.split("|")[0]);
      message = message.split("|")[1];
    }
  }
  if (message) addPart(message);

  return message.split("|");
};

export const getEntries = async (
  requestId: string,
  content: string,
  learningLang: string,
  onChunk: (chunk: string) => void
) => {
  let message = "";
  let entries: { id: string; value: string }[] = [];

  const addEntry = (value: string) => {
    const id = createId();
    entries.push({ id, value });
    onChunk(`${requestId}:GET_ENTRIES:${id}:${value}`);
  };

  const examples = makeExamples([
    "`Target language: Japanese` `User: 恋人` `Response: 恋人|恋人つなぎ|恋人未満`",
    "`Target language: Japanese` `User: ?跡` `Response: 足跡|遺跡|追跡|奇跡|筆跡|痕跡|傷跡|形跡|軌跡|史跡`",
    "`Target language: Korean` `User: Sound` `Response: 소리|하다|든든하다|울리다|온전하다|음향|건실하다|건전하다`",
  ]);

  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are an entry generator for a universal dictionary application. List dictionary entries that are relevant to use the user's query, using | as a delimiter. Limit: 10.\n\n${examples}\n\nTarget language: ${learningLang}`,
      },
      { role: "user", content },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    message += content;
    if (message.includes("|")) {
      addEntry(message.split("|")[0]);
      message = message.split("|")[1];
    }
  }
  if (message) addEntry(message);

  return entries;
};

export const getEntryDetail = async (
  requestId: string,
  entry: string,
  entryId: string,
  detailId: string,
  learningLang: string,
  nativeLang: string,
  onChunk: (chunk: string) => void
) => {
  const addEntryDetail = (value: string) => {
    onChunk(`${requestId}:GET_ENTRY_DETAILS:${entryId}:${detailId}:${value}`);
  };

  const examples = makeExamples([
    "`User learning language: Japanese` `User native language: English` `User: 告白` `Response: **こくはく**\n*Noun, Suru verb, Transitive verb*\n1. confession (to a crime, wrongdoing, etc.); admission\n*Noun, Suru verb, Intransitive verb*\n2. professing one's feelings (to someone one wants to go out with); declaration of love`",
    "`User learning language: Chinese` `User native language: Korean` `User: 谢天谢地` `Response: **xiè tiān xiè dì**\n*감탄사*\n1. 다행스럽게 생각하거나 안도할 때 쓰는 말\n감탄사\n2. 무슨 일이 잘 되어 감사하거나 안심할 때 사용하는 표현.`",
  ]);

  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are an entry generator for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Give a brief list of possible definitions and their parts of speech. If applicable for the language/word do not forget the reading (i.e. pinyin or furigana).\n\n${examples}\n\nUser learning language: ${learningLang}\nUser native language: ${nativeLang}`,
      },
      { role: "user", content: entry },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) addEntryDetail(content);
  }

  onChunk(`${requestId}:SET_DONE:ENTRY:${entryId}`);
};

export const getEntryDetails = async (
  requestId: string,
  entries: { id: string; value: string }[],
  learningLang: string,
  nativeLang: string,
  onChunk: (chunk: string) => void
) => {
  for (const { id, value } of entries) {
    await getEntryDetail(
      requestId,
      value,
      id,
      createId(),
      learningLang,
      nativeLang,
      onChunk
    );
  }
};

export const getModifiedEntry = async (
  requestId: string,
  entryId: string,
  content: string,
  learningLang: string,
  nativeLang: string,
  command: string,
  onChunk: (chunk: string) => void
) => {
  const detailId = createId();

  const addEntrySegment = (value: string) => {
    onChunk(`${requestId}:GET_MODIFIED_ENTRY:${entryId}:${detailId}:${value}`);
  };

  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are an entry generator for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Expand on the previously generated entry given to you by the user with the following directive: ${command}.\n\nUser learning language: ${learningLang}\nUser native language: ${nativeLang}`,
      },
      { role: "user", content },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) addEntrySegment(content);
  }
};

export const getConversation = async (
  requestId: string,
  entryId: string,
  detailId: string,
  content: string,
  messages: { source: "user" | "deepseek"; content: string }[],
  learningLang: string,
  nativeLang: string,
  onChunk: (chunk: string) => void
) => {
  const addEntrySegment = (value: string) => {
    onChunk(`${requestId}:GET_CONVERSATION:${entryId}:${detailId}:${value}`);
  };

  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are an chatbot for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Answer any questions the user may have on the following dictionary entry:\n\n${content}`,
      },
      ...messages.map(
        ({ source, content }) =>
          ({
            role: source === "deepseek" ? "system" : "user",
            content,
          } as { role: "system" | "user"; content: string })
      ),
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) addEntrySegment(content);
  }
};

export const getDetails = async (
  content: string,
  source: string,
  target: string,
  onChunk: (chunk: string) => void
) => {
  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are a universal dictionary. Generate detailed dictionary entries for the given word or phrase. Use markdown formatting for headings, definitions, examples, synonyms, and related terms. Be concise but thorough.\n\nSource language: ${source}\nTarget language: ${target}`,
      },
      { role: "user", content },
    ],
    stream: true,
  });
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) onChunk(content);
  }
};
