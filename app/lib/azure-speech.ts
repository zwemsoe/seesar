import { SupportedLanguages } from "~/translations";
import { arrayBufferToBase64, transformToSSML } from "./speechUtils";

export const azureSynthesizeSpeech = async (
  text: string,
  language: SupportedLanguages
) => {
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
    body: transformToSSML(text, language),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const audioData = await response.arrayBuffer();
  return arrayBufferToBase64(audioData);
};
