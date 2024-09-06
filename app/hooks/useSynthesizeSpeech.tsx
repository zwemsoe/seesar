import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import TrackPlayer from "react-native-track-player";
import { useCurrentReaderStore } from "~/state/store";
import { getAudioFileName } from "~/lib/utils";
import { azureSynthesizeSpeech } from "~/lib/azure-speech";
import {
  MAX_CHARS_TO_SYNTHESIZE,
  MIN_CHARS_TO_SYNTHESIZE,
} from "~/lib/constants";
import { useTranslation } from "react-i18next";
import { getTrackId } from "~/lib/track-player";

export const useSynthesizeSpeech = ({
  text,
  url,
}: {
  text: string;
  url: string;
}) => {
  const activeTrack = useCurrentReaderStore((state) => state.activeTrack);
  const { t } = useTranslation();
  const language = useCurrentReaderStore((state) => state.language);
  const [isLoading, setIsLoading] = useState(!activeTrack);
  const [fileUri, setFileUri] = useState("");
  const [error, setError] = useState("");

  const generateFileUri = async () => {
    setIsLoading(true);

    try {
      await TrackPlayer.reset();
      const cachedFileUri = await getAudioFileName(url, language);

      const fileInfo = await FileSystem.getInfoAsync(cachedFileUri);
      if (fileInfo.exists) {
        setFileUri(cachedFileUri);
        setIsLoading(false);
        return;
      }

      if (text.length < MIN_CHARS_TO_SYNTHESIZE) {
        setError(t("textTooShort"));
        setIsLoading(false);
        return;
      }

      if (text.length > MAX_CHARS_TO_SYNTHESIZE) {
        setError(t("textTooLong"));
        setIsLoading(false);
        return;
      }

      const audioData = await azureSynthesizeSpeech(text, language);

      await FileSystem.writeAsStringAsync(cachedFileUri, audioData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setFileUri(cachedFileUri);
    } catch (error) {
      console.error(error);
      setError("Failed to synthesize speech");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (text && url && language) {
      if (activeTrack?.id !== getTrackId(url, language)) {
        generateFileUri();
      }
    }
  }, [text, url, language]);

  return { isLoading, fileUri, error };
};
