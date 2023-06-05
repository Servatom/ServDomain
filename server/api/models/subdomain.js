const mongoose = require("mongoose");

const subdomainSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ownerID: { type: String, required: true, ref: "User" },
  name: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  plan: { type: String, required: true },
  expiry: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subdomain", subdomainSchema);
