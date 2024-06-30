import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  userData?: {
    userID: string;
    phoneNumber: string;
    firebaseUID: string;
  };
}

export interface CustomError extends Error {
  status?: number;
}

export type TPlanName = "personal" | "vercel" | "annual";
export type TPlanFrequency = "Daily" | "Monthly" | "Yearly";
export type TRecordType = "CNAME" | "A" | "TXT";
export type TPlanStatus =
  | "active"
  | "processing"
  | "expired"
  | "cancelled"
  | "overdue";

export type TRecordUpdateConfig = {
  content?: string;
  proxied?: boolean;
  ttl?: number;
  type?: TRecordType;
};
