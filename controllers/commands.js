const { translations } = require("../config");

const start = async (ctx) => {
  const user = ctx.user;
  ctx.reply(
    translations[user.botLanguage].START(ctx.message.from.first_name, "🇪🇹")
  );
};

const help = (ctx) => {
  ctx.reply(translations["English"].HELP);
};
const about = (ctx) => {
  ctx.reply(translations["English"].ABOUT);
};

const settings = async (ctx) => {
  const userId = ctx.message.from.id;
  const user = ctx.user;

  const choiceKeyboard = [
    [
      {
        text: translations["English"].CHANGE_TRANSLATION_LANGUAGE,
        callback_data: "change_language",
      },
      {
        text: translations["English"].CHANGE_BOT_LANGUAGE,
        callback_data: "change_bot_language",
      },
    ],
    [
      {
        text: translations["English"].CHANGE_RESPONSE_LANGUAGE,
        callback_data: "change_response_language",
      },
    ],
  ];

  const msg = `⚙️\tSettings\n\n<b>Translation Language:</b>
      current: ${user.translationLanguage}\n\n<b>Bot Language:</b>
      current: ${user.botLanguage}`;

  ctx.reply(msg, {
    reply_markup: { inline_keyboard: choiceKeyboard },
    parse_mode: "HTML",
  });
};

module.exports = { start, help, about, settings };
