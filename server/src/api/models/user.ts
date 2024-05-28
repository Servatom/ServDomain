import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  phoneNumber: string;
  firebaseUID: string;
  email: string;
  stripeCustomerID: string;
  razorpayCustomerID: string;
  onWaitlist: boolean;
}

const userScheme: Schema<IUser> = new mongoose.Schema({
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
  stripeCustomerID: { type: String, required: false },
  razorpayCustomerID: { type: String, required: false },
  onWaitlist: { type: Boolean, required: true, default: false },
});

const User = mongoose.model<IUser>("User", userScheme);

export { User, IUser };
