import { SupportedLanguages } from "~/translations";

const wrapWithLang = (match: string, lang: string) => {
  return `<lang xml:lang="${lang}">${match}</lang>`;
};

const createSSML = (content: string) => {
  return `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:gender="Male" xml:lang="en-US">
      <voice name="en-US-BrianMultilingualNeural" xml:lang="en-US">
        ${content}
      </voice>
    </speak>
  `.trim();
};

const escapeXML = (str: string) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const replaceEscapes = (str: string) => {
  return str
    .replace(/&amp;/g, " ")
    .replace(/&lt;/g, " ")
    .replace(/&gt;/g, " ")
    .replace(/&quot;/g, " ")
    .replace(/&apos;/g, " ");
};

export const transformToSSML = (text: string, lang: SupportedLanguages) => {
  let cleanText = escapeXML(text.replace(/\n/g, " "));
  if (lang === "mm") {
    cleanText = replaceEscapes(cleanText);
    const englishRegex = /[a-zA-Z]+(?:[a-zA-Z\s]*)/g;

    const transformedText = cleanText.replace(englishRegex, (match) => {
      return wrapWithLang(match, "en-US");
    });

    return createSSML(transformedText);
  } else {
    return createSSML(cleanText);
  }
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
