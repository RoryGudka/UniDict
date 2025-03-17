export interface Request {
  id: string;
  type: string;
}

export interface Part {
  id: string;
  value: string;
}

export interface Message {
  source: "deepseek" | "user";
  content: string;
}

export interface EntryDetails {
  id: string;
  value: string;
  messages: Message[];
}

export interface Entry {
  id: string;
  value: string;
  details?: EntryDetails[];
  isDone?: boolean;
}

export interface Translation {
  id: string;
  value: string;
  messages: Message[];
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface User {
  id: string;
  email: string;
}

export interface EntryModifier {
  name: string;
  prompt: string;
}

export interface LanguageSettings {
  entryGenerationPrompt: string;
  entryModifiers: EntryModifier[];
  translationGenerationPrompt: string;
}

export interface Profile {
  nativeLanguage: string;
  learningLanguages: { [language: string]: LanguageSettings };
  learningLanguage: string;
  provider: "openai" | "deepseek";
}

export const defaultLanguageSettings: LanguageSettings = {
  entryGenerationPrompt: "",
  entryModifiers: [
    {
      name: "Examples",
      prompt:
        "Add example sentences for each definition of this dictionary entry",
    },
    {
      name: "Conjugations",
      prompt:
        "Add a table of conjugations at the end of this dictionary entry; add a divider between the dictionary entry and the table, give the table the name 'Conjugations', and give it the columns 'Form' and 'Conjugation'",
    },
  ],
  translationGenerationPrompt: "",
};

export const defaultNoUserProfile: Profile = {
  nativeLanguage: "English",
  learningLanguages: { Japanese: defaultLanguageSettings },
  learningLanguage: "Japanese",
  provider: "openai",
};

export const defaultUserProfile: Profile = {
  nativeLanguage: "",
  learningLanguages: {},
  learningLanguage: "",
  provider: "openai",
};
