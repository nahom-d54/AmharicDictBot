const mongoose = require("mongoose");
const Schema = require("./schema");
const statics = require("./static");

Schema.static(statics);
const User = mongoose.model("User", Schema);

module.exports = User;
