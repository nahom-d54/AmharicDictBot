require("dotenv").config();
const { Telegraf } = require("telegraf");
// const express = require("express");
const router = require("./handlers/command");
const cbrouter = require("./handlers/callback");

const connectDB = require("./config/mongoose");
const { userMiddleware } = require("./controllers/middlewares");

const TOKEN = process.env.TG_BOT_TOKEN;
// const WEBHOOK_URL = process.env.WEBHOOK_URL;
// const PORT = process.env.PORT || 3000;
// const DOMAIN = "google.com";

connectDB();
const bot = new Telegraf(TOKEN);

// Initialize the Express server

// const app = express();

// app.use(express.json());
// (async () => {
//   app.use(
//     await bot.createWebhook({
//       url: DOMAIN,
//       path: "/bot",
//       secret_token: process.env.TG_SECRET_TOKEN,
//     })
//   );
// })();

bot.use(userMiddleware);
bot.use(router);
bot.use(cbrouter);
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}`, err);
  ctx.reply("An error occurred");
});

// app.get("/", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });

if (require.main === module) {
  bot.launch(() => {
    console.log("Bot Running");
  });
  // app.listen(PORT, () => {
  //   console.log(`Express server is running on port ${PORT}`);
  // });
}

module.exports = { bot };
