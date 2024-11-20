const { messages } = require("../config");
const { fetchWord } = require("../dictionary");

const getTranslation = async (ctx) => {
  const chatId = ctx.chat.id;
  const word = ctx.message.text;
  const user = ctx.user;
  const responseLanguageChoice = user.responseLanguageChoice;
  const response = await fetchWord(word, user.translationLanguage ?? "English");

  const msg = response.map((item) => {
    const wordType = item.WordType;
    const wordLang = item.Language;

    if (responseLanguageChoice[wordLang] === false) return;
    const text = messages.translationResponse(
      "Language",
      wordLang,
      "Type",
      wordType,
      item.defs
    );

    return text;
  });

  await ctx.reply(msg.length ? msg.join("") : "No Definition Found", {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
};

module.exports = { getTranslation };
