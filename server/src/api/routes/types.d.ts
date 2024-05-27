import { Request } from "express";
import { AuthenticatedRequest } from "../../utils/types";
import { IUser } from "../models/user";
import { IPlan } from "../models/plan";

export interface DomainPostRequest extends AuthenticatedRequest {
  body: {
    cfZoneID: string;
    cfAuthToken: string;
    restrictedSubdomains: string[];
  };
}

export interface LoginRequest extends Request {
  body: {
    phoneNumber: string;
    firebaseUID: string;
  };
}

export interface UpdateUserRequest extends AuthenticatedRequest {
  body: IUser;
}

export interface SubdomainCheckRequest extends Request {
  query: {
    domainID: string;
    subdomain: string;
  };
}

export interface CreatePlanRequest extends AuthenticatedRequest {
  body: IPlan;
}

export interface PaymentVerifyRequest extends AuthenticatedRequest {
  body: {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  };
}
