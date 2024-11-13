const { settings } = require("../config");

const settingsCommands = (bot) => {
  bot.onText(/\/settings/, (msg) => {
    const chatId = msg.chat.id;

    const langChoice = settings;

    bot.sendMessage(chatId, `Current language: ${langChoice}`);
  });
};
