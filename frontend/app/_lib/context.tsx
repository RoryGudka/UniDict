import { Entry, Part, Request, Translation } from "./model";
import { createContext, useContext } from "react";

interface AppContextType {
  nativeLang: string;
  learningLang: string;
  requests: Request[];
  parts: Part[];
  entries: Entry[];
  translations: Translation[];
  setNativeLang: (lang: string) => void;
  setLearningLang: (lang: string) => void;
  setRequests: (requests: Request[]) => void;
  setParts: (parts: Part[]) => void;
  setEntries: (entries: Entry[]) => void;
  setTranslations: (translations: Translation[]) => void;
  socket: WebSocket | null;
  isLoading: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
