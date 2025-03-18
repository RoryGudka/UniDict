export type Provider = "openai" | "deepseek";

export interface SearchRequest {
  api: "search";
  requestId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  provider: Provider;
  instructions: string;
}

export interface TranslateRequest {
  api: "translate";
  requestId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  provider: Provider;
  instructions: string;
}

export interface GetEntryModificationRequest {
  api: "get_entry_modification";
  requestId: string;
  entryId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  command: string;
  provider: Provider;
}

export interface Message {
  source: "assistant" | "user";
  content: string;
}

export interface EntryConverseRequest {
  api: "entry_converse";
  requestId: string;
  entryId: string;
  detailId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  messages: Message[];
  provider: Provider;
}

export interface TranslationConverseRequest {
  api: "translation_converse";
  requestId: string;
  translationId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  messages: Message[];
  provider: Provider;
}

export type ApiRequest =
  | SearchRequest
  | TranslateRequest
  | GetEntryModificationRequest
  | EntryConverseRequest
  | TranslationConverseRequest;
