import { create } from "zustand";

export type CurrentReader = {
  url: string;
  setUrl: (url: string) => void;
};

export const useCurrentReaderStore = create<CurrentReader>((set) => ({
  url: "",
  setUrl: (url: string) => set({ url }),
}));
