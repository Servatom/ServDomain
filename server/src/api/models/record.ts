import mongoose, { Document, Schema } from "mongoose";
import { TRecordType } from "../../utils/types";

interface IRecord extends Document {
  cloudflareID: string;
  cloudflareZoneID: string;
  domainID: string;
  planID: string;
  ownerID: string;
  name: string;
  content: string;
  type: TRecordType;
  ttl: number;
  proxied: boolean;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

interface IReservedRecord extends Document {
  recordID: string;
  ownerID: string;
  name: string;
  created_at: Date;
}

const recordSchema: Schema<IRecord> = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cloudflareID: { type: String, required: true, default: "x" },
  cloudflareZoneID: { type: String, required: true, default: "x" },
  domainID: { type: String, required: true, ref: "Domain" },
  planID: { type: String, required: true, ref: "Plan" },
  ownerID: { type: String, required: true, ref: "User" },
  name: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  ttl: { type: Number, required: true, default: 1 },
  proxied: { type: Boolean, required: true, default: false },
  isActive: { type: Boolean, required: true, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const reservedRecordScheme = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  recordID: { type: String, required: true, ref: "Record" },
  ownerID: { type: String, required: true, ref: "User" },
  name: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

const Record = mongoose.model<IRecord>("Record", recordSchema);
const ReservedRecord = mongoose.model<IReservedRecord>(
  "ReservedRecord",
  reservedRecordScheme
);

export { Record, IRecord, ReservedRecord, IReservedRecord };
