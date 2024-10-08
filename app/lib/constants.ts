import { Theme } from "@react-navigation/native";

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(240 5.9% 10%)", // primary
    text: "hsl(240 10% 3.9%)", // foreground
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "hsl(0 0% 98%)", // primary
    text: "hsl(0 0% 98%)", // foreground
  },
};

export const Colors = {
  light: {
    text: "#000000",
    background: "#fff",
    tint: "#000000",
    icon: "#000000",
    tabIconDefault: "#D3D3D3",
    tabIconSelected: "#000000",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#fff",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};

export const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

export const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export const AUDIO_FILE_PREFIX = "seesar-audio-";

export const MIN_CHARS_TO_SYNTHESIZE = 500; // ~100 words
export const MAX_CHARS_TO_SYNTHESIZE = 6000; // ~1200 words

export const QueryKeys = {
  linkContent: (url: string) => ["linkContent", url],
  yourLinks: ["yourLinks"],
};
