const { Composer } = require("telegraf");

const commandController = require("../controllers/commands");
const { message } = require("telegraf/filters");
const { getTranslation } = require("../controllers/messages");

const router = new Composer();

router.command("start", commandController.start);
router.command("help", commandController.help);
router.command("about", commandController.about);
router.command("settings", commandController.settings);

router.on(message("text"), getTranslation);

module.exports = router;
