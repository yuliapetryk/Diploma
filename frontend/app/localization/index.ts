import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

import en from "./en";
import uk from "./uk";

const i18n = new I18n({
  en,
  uk,
});

i18n.enableFallback = true;

const userLocale = Localization.getLocales()[0]?.languageCode || "uk";

i18n.locale = userLocale.startsWith("en") ? "uk" : "en";

export default i18n;
