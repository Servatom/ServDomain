import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../utils/types";
import jwt from "jsonwebtoken";

const checkAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY!);
    req.userData = decoded as AuthenticatedRequest["userData"];
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

export default checkAuth;
