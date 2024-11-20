const User = require("../models/User");
const {
  changeBotLanguage,
  botLanguageChoice,
  changeResponseLanguage,
  responseLanguageChoice,
  changeTranslationLanguage,
  translationLanguageChoice,
} = require("./callbackQuery");

const callbackQueryMiddleware = async (ctx, next) => {
  const query = ctx.callbackQuery;

  await ctx.answerCbQuery("Processing...");
  if (query.data === "change_language") {
    return changeTranslationLanguage(ctx);
  }
  if (query.data.includes(":ln_choice")) {
    return translationLanguageChoice(ctx);
  }
  if (query.data === "change_bot_language") {
    return changeBotLanguage(ctx);
  }
  if (query.data === "change_response_language") {
    return changeResponseLanguage(ctx);
  }

  if (query.data.includes(":response_ln_choice")) {
    return responseLanguageChoice(ctx);
  }
  if (query.data.includes(":bot_ln_choice")) {
    return botLanguageChoice(ctx);
  }

  await next();
};

const userMiddleware = async (ctx, next) => {
  const userId = ctx.from.id;
  const user = await User.findOne({ userId });

  if (!user) {
    ctx.user = await User.create({
      userId,
      firstName: ctx.message.from.first_name || "User",
      lastName: ctx.message.from.last_name || "",
      username: ctx.message.from.username || "",
      responseLanguage: "English",
      botLanguage: "English",
      translationLanguage: "Amharic",
    });
    return await next();
  }
  ctx.user = user;

  await next();
};

module.exports = { callbackQueryMiddleware, userMiddleware };
