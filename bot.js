require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const commands = require("./commands");

const TOKEN = process.env.TG_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

// Initialize bot with webhook settings
const bot = new TelegramBot(TOKEN, { webHook: true });
bot.setWebHook(`${WEBHOOK_URL}/bot/tg-webhook`, {
  secret_token: process.env.TG_SECRET_TOKEN,
});

// Initialize the Express server
const app = express();
app.use(express.json());

// Define webhook route
app.get("/", (req, res) => {
  res.send({ status: "ok" });
});
app.post(`/bot/tg-webhook`, (req, res) => {
  if (
    req.headers["X-Telegram-Bot-Api-Secret-Token"] !==
    process.env.TG_SECRET_TOKEN
  ) {
    return res.sendStatus(403);
  }
  bot.processUpdate(req.body); // Pass incoming request to bot
  res.sendStatus(200);
});

// Load bot commands
commands(bot);

// Start the Express server

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
  });
}

module.exports = app;
