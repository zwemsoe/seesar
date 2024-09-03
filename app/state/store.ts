import { Track } from "react-native-track-player";
import { create } from "zustand";
import { SupportedLanguages } from "~/translations";

export type CurrentReader = {
  url: string;
  language: SupportedLanguages;
  setUrl: (url: string) => void;
  setLanguage: (language: SupportedLanguages) => void;
  activeTrack: Track | undefined;
  setActiveTrack: (track: Track | undefined) => void;
};

export const useCurrentReaderStore = create<CurrentReader>((set) => ({
  url: "",
  language: "mm",
  setUrl: (url: string) => set({ url }),
  setLanguage: (language: SupportedLanguages) => set({ language }),
  activeTrack: undefined,
  setActiveTrack: (track: Track | undefined) => set({ activeTrack: track }),
}));
