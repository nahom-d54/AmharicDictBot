const { DEF_LANGS } = require("../config");
const { inlineKeyboardGenerator } = require("../utils/keyboardGen");

const changeTranslationLanguage = (ctx) => {
  const cuurentLang = ctx.user.translationLanguage;
  const langKeyboard = inlineKeyboardGenerator(DEF_LANGS, 3, (lang) => ({
    text: lang == cuurentLang ? `✅ ${lang}` : lang,
    callback_data: `${lang}:ln_choice`,
  }));

  ctx.deleteMessage(ctx.msgId);
  ctx.reply("Choose a language", {
    reply_markup: { inline_keyboard: langKeyboard },
  });
};

const translationLanguageChoice = async (ctx) => {
  const query = ctx.callbackQuery.data;

  const lang = query.split(":")[0];

  const user = ctx.user;
  user.translationLanguage = lang;
  await user.save();
  ctx.deleteMessage(ctx.msgId);
  ctx.reply(`Language set to ${lang}`);
};

const changeBotLanguage = async (ctx) => {
  const user = ctx.user;
  console.log(user);

  const langKeyboard = inlineKeyboardGenerator(DEF_LANGS, 3, (lang) => ({
    text: lang === user.botLanguage ? `✅ ${lang}` : lang,
    callback_data: `${lang}:bot_ln_choice`,
  }));

  ctx.deleteMessage(ctx.msgId);
  ctx.reply("Choose a language", {
    reply_markup: { inline_keyboard: langKeyboard },
  });
};

const botLanguageChoice = async (ctx) => {
  const query = ctx.callbackQuery.data;

  const lang = query.split(":")[0];
  const user = ctx.user;
  user.botLanguage = lang;
  await user.save();
  ctx.deleteMessage(ctx.msgId);
  ctx.reply(`Bot language set to ${lang}`);
};

const changeResponseLanguage = async (ctx) => {
  await ctx.deleteMessage(ctx.msgId);
  const user = ctx.user;
  const choice = user.responseLanguageChoice;
  const keys = Object.keys(choice);
  const langKeyboard = inlineKeyboardGenerator(keys, 3, (lang) => ({
    text: `${choice[lang] ? `✅ ${lang}` : `❌ ${lang}`}`,
    callback_data: `${lang}:response_ln_choice`,
  }));

  langKeyboard.push([{ text: "close", callback_data: "close" }]);

  ctx.reply("Choose a language", {
    reply_markup: { inline_keyboard: langKeyboard },
  });
};

const responseLanguageChoice = async (ctx) => {
  const query = ctx.callbackQuery.data;
  const user = ctx.user;
  const lang = query.split(":")[0];
  const choice = user.responseLanguageChoice;

  user.responseLanguageChoice = {
    ...user.responseLanguageChoice,
    [lang]: !choice[lang],
  };
  await user.save();

  const keys = Object.keys(user.responseLanguageChoice);
  const langKeyboard = inlineKeyboardGenerator(keys, 3, (lang) => ({
    text: `${user.responseLanguageChoice[lang] ? `✅ ${lang}` : `❌ ${lang}`}`,
    callback_data: `${lang}:response_ln_choice`,
  }));

  langKeyboard.push([{ text: "close", callback_data: "close" }]);
  await ctx.editMessageReplyMarkup({ inline_keyboard: langKeyboard });
};

const defaultResponse = async (ctx) => {
  const query = ctx.callbackQuery;
  if (query.data === "close") {
    ctx.deleteMessage(ctx.msgId);
  }
};

module.exports = {
  changeTranslationLanguage,
  translationLanguageChoice,
  changeBotLanguage,
  botLanguageChoice,
  changeResponseLanguage,
  responseLanguageChoice,
  defaultResponse,
};
