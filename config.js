const translations = {
  English: {
    START: (userName, botName) => `Hi ${userName}! welcome to ${botName}.`,
    HELP: "Here is the help text for the bot.",
    ABOUT: "This bot provides dictionary definitions in Ethiopian languages.",
    LANGUAGE: "Language",
    TYPE: "Type",
    LANGUAGE_NAME: "English",
    CHANGE_TRANSLATION_LANGUAGE: "Change Translation language",
    CHANGE_BOT_LANGUAGE: "Change Bot language",
    CHOOSE_LANGUAGE: "Choose a language",
    CHANGE_RESPONSE_LANGUAGE: "Change Response language",
  },
  Amharic: {
    HELP: "በዚህ ማስታወሻ የቡቭት ቅርጽ ይሰጣል።",
    ABOUT: "ይህ ቦት በኢትዮጵያ ቋንቋዎች የቡቭት ቅርጽ አይደለም።",
    LANGUAGE: "ቋንቋ",
    TYPE: "አይነት",
    LANGUAGE_NAME: "አማርኛ",
  },
  Tigrigna: {
    HELP: "እዚ እቶም ብሓበሬታ እዩ።",
    ABOUT: "ቦት ኣብ ኢትዮጵያ ቋንቋታት ኣብ ቡቭት ቅርጽ ኣይኮነን።",
    lANGUAGE: "ቋንቋ",
    TYPE: "አይነት",
  },
  Somalia: {
    HELP: "Halkan waa qoraal sax ah oo ku saabsan botka.",
    ABOUT: "Botkan wuxuu bixiyaa turjubaan luqadda Soomaaliga.",
    LANGUAGE: "Luqadda",
    TYPE: "Nooca",
  },
  Arabic: {
    HELP: "هنا نص المساعدة للروبوت.",
    ABOUT: "يوفر هذا الروبوت تعريفات القاموس باللغات الإثيوبية.",
    LANGUAGE: "لغة",
    TYPE: "نوع",
  },
};

const messages = {
  translationResponse: (
    language,
    languagePlaceholder,
    type,
    typePlaceholder,
    content
  ) =>
    `🌐  ${language}: ${languagePlaceholder}\n📖  ${type}: ${typePlaceholder}\n━━━━━━━━━━━━━\n${content
      .map((c) => `• <code>${c}</code>`)
      .join("\n")}\n\n━━━━━━━━━━━━━\n\n`,
};

const availableTranslateLangs = {
  ge: "Geez",
  am: "Amharic",
  en: "English",
  de: "German",
  fr: "French",
  it: "Italian",
};

const settings = {
  currentFromLang: "Amharic",
  currentToLang: "Amharic",
};

const DEF_LANGS = [
  "Amharic",
  "English",
  "Geez",
  "Oromiffa",
  "Tigrinya",
  "Arabic",
  "Hebrew",
  "Italian",
  "French",
  "German",
];

const defaultResponseLang = {
  Amharic: true,
  English: true,
  Geez: true,
  Oromiffa: true,
  Tigrinya: true,
  Arabic: true,
  Hebrew: true,
  Italian: true,
  French: true,
  German: true,
};

module.exports = {
  HELP: "Here is the help text for the bot.",
  ABOUT: "This bot provides dictionary definitions in Ethiopian languages.",
  translations,
  settings,
  DEF_LANGS,
  messages,
  defaultResponseLang,
};
