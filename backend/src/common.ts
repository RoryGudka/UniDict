import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com", // DeepSeek API endpoint
  apiKey: process.env.DEEPSEEK_API_KEY, // Set your DeepSeek API key in .env
});

const makeExamples = (examples: string[]) => {
  return `Examples:\n${examples.join("\n")}`;
};

export const getParts = async (
  content: string,
  onChunk: (chunk: string) => void
) => {
  let message = "";

  const examples = makeExamples([
    "`User: love` `Response: love`",
    "`User: I'm in love with you` `Response: I'm|in|love|you`",
    "`User: 君のことが好きだ` `Response: 君|の|こと|が|好き|だ`",
    "`User: お前はもう死んでいる` `Response: お前|は|もう|死んでいる`",
  ]);
  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are a text parser for a universal dictionary application. Split the user's message into words or phrases that dictionary entries can be generated for, using | as a delimiter. Keep conjunctions and verb conjugations in the same segment.\n${examples}`,
      },
      { role: "user", content },
    ],
    stream: true,
  });
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    message += content;
    if (content) onChunk(content);
  }

  return message.split("|");
};

export const getEntries = async (
  content: string,
  learningLang: string,
  onChunk: (chunk: string) => void
) => {
  const examples = makeExamples([
    "`Target language: Japanese` `User: 恋人` `Response: 恋人|恋人つなぎ|恋人未満`",
    "`Target language: Japanese` `User: ?跡` `Response: 足跡|遺跡|追跡|奇跡|筆跡|痕跡|傷跡|形跡|軌跡|史跡`",
    "`Target language: Korean` `User: Sound` `Response: 소리|하다|든든하다|울리다|온전하다|음향|건실하다|건전하다`",
  ]);

  let message = "";
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
    if (content) onChunk(content);
  }

  return message.split("|");
};

export const getEntryDetails = async (
  entries: string[],
  learningLang: string,
  nativeLang: string,
  onChunk: (chunk: string) => void
) => {
  const examples = makeExamples([
    "`User learning language: Japanese` `User native language: English` `User: 告白` `Response: **こくはく**\n*Noun, Suru verb, Transitive verb*\n1. confession (to a crime, wrongdoing, etc.); admission\n*Noun, Suru verb, Intransitive verb*\n2. professing one's feelings (to someone one wants to go out with); declaration of love`",
    "`User learning language: Chinese` `User native language: Korean` `User: 谢天谢地` `Response: **xiè tiān xiè dì**\n*감탄사*\n1. 다행스럽게 생각하거나 안도할 때 쓰는 말\n감탄사\n2. 무슨 일이 잘 되어 감사하거나 안심할 때 사용하는 표현.`",
  ]);
  for (const entry of entries) {
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
      if (content) onChunk(content);
    }
    onChunk("[ENTRY_DETAILS]");
  }
};

export const getExampleSentences = async (
  content: string,
  learningLang: string,
  nativeLang: string,
  onChunk: (chunk: string) => void
) => {
  const examples = makeExamples([
    "`User learning language: Japanese` `User native language: English` `User: 告白\n**こくはく**\n*Noun, Suru verb, Transitive verb*\n1. confession (to a crime, wrongdoing, etc.); admission\n*Noun, Suru verb, Intransitive verb*\n2. professing one's feelings (to someone one wants to go out with); declaration of love` `Response: 告白\n**こくはく**\n*Noun, Suru verb, Transitive verb*\n1. confession (to a crime, wrongdoing, etc.); admission\n\t* 自分の過ちを告白するのに恥じる必要は何もない。\n\t* There is no need to be ashamed of confessing one's mistakes.\n*Noun, Suru verb, Intransitive verb*\n2. professing one's feelings (to someone one wants to go out with); declaration of love\n\t* 彼は私を好きになったと告白した。\n\t*He confessed that he had fallen in love with me.`",
  ]);
  const stream = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: `You are an entry generator for a universal dictionary application. Your goal is to assist the user, whose native language is ${nativeLang}, in learning ${learningLang}. If their native language is not English, do not respond in English. Expand on the previously generated entry given to you by the user by adding example sentences to each definition.\n\n${examples}\n\nUser learning language: ${learningLang}\nUser native language: ${nativeLang}`,
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
