const mongoose = require("mongoose");

const recordSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cloudflareId: { type: String, required: true, default: "x" },
  cloudflareZoneId: { type: String, required: true, default: "x" },
  domainID: { type: String, required: true, ref: "Domain" },
  planId: { type: String, required: true, ref: "Plan" },
  stripeSubscriptionId: { type: String, required: true, default: "x" }, //TODO: remove this
  ownerID: { type: String, required: true, ref: "User" },
  name: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  plan: { type: String, required: true }, // TODO: remove this
  expiry: { type: Date, required: true }, // TODO: remove this
  status: { type: String, default: "processing" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const reservedRecordScheme = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  recordID: { type: String, required: true, ref: "Record" },
  ownerID: { type: String, required: true, ref: "User" },
  name: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

const Record = mongoose.model("Record", recordSchema);
const ReservedRecord = mongoose.model("ReservedRecord", reservedRecordScheme);

module.exports = { Record, ReservedRecord };
