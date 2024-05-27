import mongoose, { Document, Schema } from "mongoose";
import { TPlanName, TPlanStatus } from "../../utils/types";

interface IPlan extends Document {
  ownerID: string;
  domainID: string;
  planType: TPlanName;
  planLabel: string;
  hasTxtRecord: boolean;
  status: TPlanStatus;
  expiry: Date;
  razorpaySubscriptionID: string;
  created_at: Date;
}

const planSchema: Schema<IPlan> = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ownerID: { type: String, required: true, ref: "User" },
  domainID: { type: String, required: true, ref: "Domain" },
  planType: { type: String, required: true },
  planLabel: { type: String, required: true },
  status: { type: String, required: true, default: "processing" },
  hasTxtRecord: { type: Boolean, required: true, default: false },
  expiry: { type: Date, required: true },
  razorpaySubscriptionID: { type: String, required: true, default: "x" },
  created_at: { type: Date, default: Date.now },
});

const Plan = mongoose.model<IPlan>("Plan", planSchema);

export { Plan, IPlan };
