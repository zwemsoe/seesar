import { arrayBufferToBase64, transformToSSML } from "~/lib/speech";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import * as Crypto from "expo-crypto";
import TrackPlayer from "react-native-track-player";
import { useCurrentReaderStore } from "~/state/store";
import { getAudioFileName } from "~/lib/utils";

export const useSynthesizeSpeech = ({
  text,
  url,
}: {
  text: string;
  url: string;
}) => {
  const language = useCurrentReaderStore((state) => state.language);
  const [isLoading, setIsLoading] = useState(true);
  const [fileUri, setFileUri] = useState("");
  const [error, setError] = useState("");

  const synthesizeSpeech = async () => {
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

      const subscriptionKey = process.env.EXPO_PUBLIC_SPEECH_API_KEY!;
      const region = process.env.EXPO_PUBLIC_SPEECH_REGION!;
      const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

      const tokenResponse = await fetch(
        `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
        }
      );

      const accessToken = await tokenResponse.text();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: transformToSSML(text),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioData = await response.arrayBuffer();

      await FileSystem.writeAsStringAsync(
        cachedFileUri,
        arrayBufferToBase64(audioData),
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      setFileUri(cachedFileUri);
    } catch (error) {
      setError("Failed to synthesize speech");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (text && url && language) {
      synthesizeSpeech();
    }
  }, [text, url, language]);

  return { isLoading, fileUri, error };
};
