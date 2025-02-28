export type Provider = "openai" | "deepseek";

export interface SearchRequest {
  api: "search";
  requestId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  provider: Provider;
}

export interface TranslateRequest {
  api: "translate";
  requestId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  provider: Provider;
}

export interface GetModifiedEntryRequest {
  api: "get_modified_entry";
  requestId: string;
  entryId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  command: string;
  provider: Provider;
}

export interface ConverseRequest {
  api: "converse";
  requestId: string;
  entryId: string;
  detailId: string;
  learningLang: string;
  nativeLang: string;
  content: string;
  messages: { source: "user" | "deepseek"; content: string }[];
  provider: Provider;
}

export type ApiRequest =
  | SearchRequest
  | TranslateRequest
  | GetModifiedEntryRequest
  | ConverseRequest;
