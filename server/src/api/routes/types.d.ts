import { Request } from "express";
import { AuthenticatedRequest } from "../../utils/types";
import { IUser } from "../models/user";

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
