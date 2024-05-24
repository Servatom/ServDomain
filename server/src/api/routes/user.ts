import express, { NextFunction, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import checkAuth from "../middleware/check-auth";
import { LoginRequest, UpdateUserRequest } from "./types";
import { AuthenticatedRequest } from "../../utils/types";

const router = express.Router();

router.post(
  "/login",
  async (req: LoginRequest, res: Response, next: NextFunction) => {
    const { phoneNumber, firebaseUID } = req.body;
    // check if user exists in db with phoneNumber and firebaseUID combination
    // if not, create new user
    // return jwt
    // if user exists, return jwt

    User.findOne({ phoneNumber: phoneNumber, firebaseUID: firebaseUID }).then(
      (result) => {
        if (result) {
          const token = jwt.sign(
            {
              userID: result._id,
              phoneNumber: phoneNumber,
              firebaseUID: firebaseUID,
            },
            process.env.JWT_KEY!,
            {
              expiresIn: "7d",
            }
          );
          res.status(200).json({
            message: "User found",
            data: {
              userID: result._id,
              token: token,
              phoneNumber: phoneNumber,
              firebaseUID: firebaseUID,
              email: result.email,
              onWaitlist: result.onWaitlist,
            },
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            phoneNumber: phoneNumber,
            firebaseUID: firebaseUID,
          });
          user
            .save()
            .then((result) => {
              const token = jwt.sign(
                {
                  userID: result._id,
                  phoneNumber: phoneNumber,
                  firebaseUID: firebaseUID,
                },
                process.env.JWT_KEY!,
                {
                  expiresIn: "7d",
                }
              );
              res.status(201).json({
                message: "User created",
                data: {
                  userID: result._id,
                  token: token,
                  phoneNumber: phoneNumber,
                  firebaseUID: firebaseUID,
                  email: result.email,
                  onWaitlist: result.onWaitlist,
                },
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                message: "Internal Server Error",
                error: err,
              });
            });
        }
      }
    );
  }
);

router.get(
  "/",
  checkAuth,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userID = req.userData!.userID;
    User.findOne({ _id: userID })
      .then((result) => {
        res.status(200).json({
          message: "User found",
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      });
  }
);

router.patch(
  "/update",
  checkAuth,
  async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
    const userID = req.userData!.userID;

    const doc = await User.findOneAndUpdate({ _id: userID }, req.body, {
      new: true,
    })
      .then((result) => {
        res.status(200).json({
          message: "Data updated",
          user: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      });
  }
);

router.post(
  "/waitlist",
  checkAuth,
  async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
    const userID = req.userData!.userID;
    const onWaitlist = req.body.onWaitlist;

    const doc = await User.findOneAndUpdate(
      { _id: userID },
      { onWaitlist: onWaitlist },
      { new: true }
    )
      .then((result) => {
        res.status(200).json({
          message: "User updated",
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      });
  }
);

router.post(
  "/verify",
  checkAuth,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    res.status(200).json({
      message: "User verified",
    });
  }
);

export default router;
