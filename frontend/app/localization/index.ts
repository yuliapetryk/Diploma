import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";

import en from "./en";
import uk from "./uk";

const i18n = new I18n({
  en,
  uk,
});

i18n.enableFallback = true;

const saveLanguagePreference = async (locale: string) => {
  try {
    await SecureStore.setItemAsync("user_language", locale);
  } catch (error) {
    console.error("Error saving language preference:", error);
  }
};

const loadLanguagePreference = async () => {
  try {
    const savedLanguage = await SecureStore.getItemAsync("user_language");
    if (savedLanguage) {
      i18n.locale = savedLanguage;
    } else {
      const userLocale = Localization.getLocales()[0]?.languageCode || "uk";
      i18n.locale = userLocale.startsWith("en") ? "uk" : "en";
    }
  } catch (error) {
    console.error("Error loading language preference:", error);
  }
};

loadLanguagePreference(); 

export { saveLanguagePreference };
export default i18n;
