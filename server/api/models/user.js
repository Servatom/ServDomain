const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    // regex for indian phone number beginning with +91
    match: /^\+91[0-9]{10}$/,
  },
  firebaseUID: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  stripeCustomerId: { type: String, required: false },
  onWaitlist: { type: Boolean, required: true, default: false },
});

const User = mongoose.model("User", userScheme);

module.exports = { User };
