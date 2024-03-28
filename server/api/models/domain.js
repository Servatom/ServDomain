const mongoose = require("mongoose");

const domainSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ownerID: { type: String, required: true, ref: "User" },
  cfAuthEmail: { type: String, required: false },
  cfAuthKey: { type: String, required: false },
  cfZoneID: { type: String, required: true },
  cfAuthToken: { type: String, required: true },
  domainName: { type: String, required: true, unique: true },
  restrictedSubdomains: { type: Array, default: [] },
});

const Domain = mongoose.model("Domain", domainSchema);

module.exports = { Domain };
