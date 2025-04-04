import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";

import Storage from "./storage";
import en from "./translates/en";
import tr from "./translates/tr";
import ar from "./translates/ar";
import zh from "./translates/zh";
import ru from "./translates/ru";
const detectLocale = async (callback) => {
  const user = await Storage.getItem("user");

  if (user) {
    const parsedUser = JSON.parse(user);

    return callback(parsedUser.lang);
  }

  return callback(getLocales()[0].languageCode);
};

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: detectLocale,
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    react: {
      useSuspense: false,
    },
    compatibilityJSON: "v3",
    resources: {
      en: {
        translation: en,
      },
      tr: {
        translation: tr,
      },
      ar: {
        translation: ar,
      },
      zh: {
        translation: zh,
      },
      ru: {
        translation: ru,
      },
    },
  });

export default i18n;
