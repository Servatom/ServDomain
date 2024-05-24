import mongoose, { Document, Schema } from "mongoose";

interface IDomain extends Document {
  ownerID: string;
  cfAuthEmail?: string;
  cfAuthKey?: string;
  cfZoneID: string;
  cfAuthToken: string;
  domainName: string;
  restrictedSubdomains: string[];
}

const domainSchema: Schema<IDomain> = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  ownerID: { type: String, required: true, ref: "User" },
  cfAuthEmail: { type: String, required: false },
  cfAuthKey: { type: String, required: false },
  cfZoneID: { type: String, required: true },
  cfAuthToken: { type: String, required: true },
  domainName: { type: String, required: true, unique: true },
  restrictedSubdomains: { type: [String], default: [] },
});

const Domain = mongoose.model<IDomain>("Domain", domainSchema);

export { Domain, IDomain };
