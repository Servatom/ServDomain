const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firebaseUID: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("User", userScheme);
