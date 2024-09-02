import { create } from "zustand";

export type CurrentReader = {
  url: string;
  language: "en" | "my";
  setUrl: (url: string) => void;
  setLanguage: (language: "en" | "my") => void;
};

export const useCurrentReaderStore = create<CurrentReader>((set) => ({
  url: "",
  language: "my",
  setUrl: (url: string) => set({ url }),
  setLanguage: (language: "en" | "my") => set({ language }),
}));
