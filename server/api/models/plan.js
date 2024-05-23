const mongoose = require("mongoose");

const planSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ownerID: { type: String, required: true, ref: "User" },
  domainID: { type: String, required: true, ref: "Domain" },
  planType: { type: String, required: true },
  planLabel: { type: String, required: true },
  expiry: { type: Date, required: true },
  stripeSubscriptionId: { type: String, required: true, default: "x" },
  records: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now },
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = { Plan };
