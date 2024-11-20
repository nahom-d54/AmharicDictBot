const mongoose = require("mongoose");
const { responseLanguageChoice } = require("../../controllers/callbackQuery");
const { defaultResponseLang } = require("../../config");

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
  responseLanguage: {
    type: String,
    default: "English",
  },
  botLanguage: {
    type: String,
    default: "English",
  },
  translationLanguage: {
    type: String,
    default: "English",
  },
  responseLanguageChoice: {
    type: Object,
    default: defaultResponseLang,
  },
});

module.exports = userSchema;
