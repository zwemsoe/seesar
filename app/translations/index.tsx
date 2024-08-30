import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en.json";
import translationMm from "./locales/mm.json";

export type SupportedLanguages = "en" | "mm";

const resources = {
  en: { translation: translationEn },
  mm: { translation: translationMm },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = "en";
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
