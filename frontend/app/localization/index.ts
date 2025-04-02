import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

import en from "./en";
import uk from "./uk";

// Create the i18n instance with translations
const i18n = new I18n({
  en,
  uk,
});

// Enable fallback to default language
i18n.enableFallback = true;

// Get user's preferred locale safely
const userLocale = Localization.getLocales()[0]?.languageCode || "en";

// Set i18n locale
i18n.locale = userLocale.startsWith("en") ? "uk" : "en";

export default i18n;
