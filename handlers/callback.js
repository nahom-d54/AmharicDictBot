const { Composer } = require("telegraf");
const { HELP, ABOUT } = require("../config");
const { defaultResponse } = require("../controllers/callbackQuery");
const { callbackQueryMiddleware } = require("../controllers/middlewares");

const router = new Composer();

router.on("callback_query", callbackQueryMiddleware, defaultResponse);

module.exports = router;
