const { fetchWord } = require("../dictionary");
const {
  HELP,
  ABOUT,
  DEF_LANGS,
  messages,
  defaultResponseLang,
} = require("../config");
const Database = require("../db");
const { text } = require("express");

const db = new Database();
db.createTables();

module.exports = (bot) => {
  // Start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || "User";
    const userId = msg.from.id;

    db.getUser(userId, (user) => {
      if (!user) {
        db.saveUser(userId, userName);
        db.updateResponseLanguageChoice(userId, defaultResponseLang);
        db.updateBotLanguageChoice(userId, "English");
        db.updateLanguageChoice(userId, "English", "Amharic");
      }
    });

    bot.sendMessage(chatId, `Hi ${userName}!`, { parse_mode: "HTML" });
  });

  // Help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, HELP);
  });

  // About command
  bot.onText(/\/about/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, ABOUT);
  });

  bot.onText(/\/settings/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const choiceKeyboard = [
      [
        {
          text: "Change Translation language",
          callback_data: "change_language",
        },
        {
          text: "Change Bot language",
          callback_data: "change_bot_language",
        },
      ],
      [
        {
          text: "Change Response language",
          callback_data: "change_response_language",
        },
      ],
    ];
    db.getBotLanguageChoice(userId, (botLang) => {
      db.getUserLanguageChoice(userId, (choice) => {
        console.log(botLang, choice);
        const msg = `⚙️\tSettings\n\n<b>Translation Language:</b>
    current: ${choice?.fromLanguage}\n\n<b>Bot Language:</b>
    current: ${botLang}`;

        bot.sendMessage(chatId, msg, {
          reply_markup: { inline_keyboard: choiceKeyboard },
          parse_mode: "HTML",
        });
      });
    });
  });

  bot.on("callback_query", (query) => {
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === "change_language") {
      const langKeyboard = DEF_LANGS.map((lang) => [
        { text: lang, callback_data: `${lang}:ln_choice` },
      ]);
      bot.deleteMessage(chatId, query.message.message_id);
      bot.sendMessage(chatId, "Choose a language", {
        reply_markup: { inline_keyboard: langKeyboard },
      });
    }
    if (data.includes(":ln_choice")) {
      const lang = data.split(":")[0];
      db.updateLanguageChoice(userId, lang, "Amharic");
      bot.deleteMessage(chatId, query.message.message_id);
      bot.sendMessage(chatId, `Language set to ${lang}`);
    }
    if (data === "change_bot_language") {
      const langKeyboard = DEF_LANGS.map((lang) => [
        { text: lang, callback_data: `${lang}:bot_ln_choice` },
      ]);
      bot.deleteMessage(chatId, query.message.message_id);
      bot.sendMessage(chatId, "Choose a language", {
        reply_markup: { inline_keyboard: langKeyboard },
      });
    }
    if (data.includes(":bot_ln_choice")) {
      const lang = data.split(":")[0];
      db.updateBotLanguageChoice(userId, lang);
      bot.deleteMessage(chatId, query.message.message_id);
      bot.sendMessage(chatId, `Bot language set to ${lang}`);
    }
    if (data === "change_response_language") {
      bot.deleteMessage(chatId, query.message.message_id);
      db.getResponseLanguageChoice(userId, (choice) => {
        const langKeyboard = [];
        const keys = Object.keys(choice);
        for (let i = 0; i < keys.length; i += 4) {
          const row = keys.slice(i, i + 4).map((lang) => ({
            text: `${choice[lang] ? `✅ ${lang}` : `❌ ${lang}`}`,
            callback_data: `${lang}:response_ln_choice`,
          }));
          langKeyboard.push(row);
        }
        langKeyboard.push([{ text: "close", callback_data: "close" }]);

        bot.sendMessage(chatId, "Choose a language", {
          reply_markup: { inline_keyboard: langKeyboard },
        });
      });
    }
    if (data.includes(":response_ln_choice")) {
      db.getResponseLanguageChoice(userId, (choice) => {
        const lang = data.split(":")[0];

        choice[lang] = !choice[lang];

        db.updateResponseLanguageChoice(userId, choice);
        const langKeyboard = [];
        const keys = Object.keys(choice);
        for (let i = 0; i < keys.length; i += 4) {
          const row = keys.slice(i, i + 4).map((lang) => ({
            text: `${choice[lang] ? `✅ ${lang}` : `❌ ${lang}`}`,
            callback_data: `${lang}:response_ln_choice`,
          }));
          langKeyboard.push(row);
        }
        langKeyboard.push([{ text: "close", callback_data: "close" }]);

        bot.editMessageReplyMarkup(
          { inline_keyboard: langKeyboard },
          {
            chat_id: chatId,
            message_id: query.message.message_id,
          }
        );
      });
    }
    if (data === "close") {
      bot.deleteMessage(chatId, query.message.message_id);
    }
    bot.answerCallbackQuery(query.id);
  });

  // Main dictionary command
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const word = msg?.text;
    const userId = msg.from.id;
    const userName = msg.from.first_name || "User";

    if (word.startsWith("/")) return;

    bot.sendChatAction(chatId, "typing");

    const constructAndSendMsg = (res) => {
      db.getResponseLanguageChoice(userId, (choice) => {
        const msg = [];
        res.forEach((item) => {
          const wordType = item.WordType;
          const wordLang = item.Language;

          if (choice[wordLang] === false) return;
          const text = messages.translationResponse(
            "Language",
            wordLang,
            "Type",
            wordType,
            item.defs
          );

          msg.push(text);
        });
        bot.sendMessage(chatId, msg.join(""), {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      });
    };

    try {
      db.getUserLanguageChoice(msg.from.id, (choice) => {
        const lnChoice = choice;
        fetchWord(word, lnChoice?.fromLanguage ?? "English").then(
          (response) => {
            constructAndSendMsg(response);
          }
        );
      });
    } catch (error) {
      console.error("Error fetching dictionary data:", error);
      bot.sendMessage(
        chatId,
        "An error occurred while fetching the word definition."
      );
    }
  });
};
