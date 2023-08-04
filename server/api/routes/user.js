const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const axios = require("../../axios");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

router.post("/login", async (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  const firebaseUID = req.body.firebaseUID;
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
          process.env.JWT_KEY,
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
              process.env.JWT_KEY,
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
});

router.get("/", checkAuth, (req, res, next) => {
  const userID = req.userData.userID;
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
});

router.patch("/update", checkAuth, async (req, res, next) => {
  const userID = req.userData.userID;

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
});

router.post("/verify", checkAuth, (req, res, next) => {
  res.status(200).json({
    message: "User verified",
  });
});

module.exports = router;
