const wrapWithLang = (match: string, lang: string) => {
  return `<lang xml:lang="${lang}">${match}</lang>`;
};

export const transformToSSML = (text: string) => {
  const burmeseRegex = /[\u1000-\u109F]+(?:[\u1000-\u109F၊။\s]*)/g;
  const englishRegex = /[a-zA-Z0-9\s,.'"-]+/g;

  let transformedText = text.replace(englishRegex, (match) =>
    wrapWithLang(match, "en-US")
  );
  transformedText = transformedText.replace(burmeseRegex, (match) =>
    wrapWithLang(match, "mm-MY")
  );

  const ssml = `
            <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
          <voice name="en-US-BrianMultilingualNeural" >
          ${transformedText}
          </voice>
          </speak>
            `;

  return ssml.trim();
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
