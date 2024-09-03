import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";
import { AUDIO_FILE_PREFIX } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateString = (str: string, num: number): string => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const getAudioFileName = async (url: string, language: string) => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    url
  );
  return (
    FileSystem.cacheDirectory + `${AUDIO_FILE_PREFIX}${hash}-${language}.mp3`
  );
};

export const formatSecondsToMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
