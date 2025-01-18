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

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
