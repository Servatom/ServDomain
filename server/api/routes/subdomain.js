const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const axios = require("../../axios");
const Subdomain = require("../models/subdomain");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, (req, res, next) => {
  const ownerID = req.userData.userID;
  Subdomain.find({ ownerID: ownerID })
    .then((result) => {
      res.status(200).json({
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  const validTypes = ["A", "CNAME"];
  if (
    !req.body.name ||
    !req.body.content ||
    !validTypes.includes(req.body.type) ||
    !req.headers.authorization
  ) {
    return res.status(400).json({
      error: "Bad Request",
    });
  } else {
    //post to cloudflare and on success save to db
    //set expiryDate to 30 days from now
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const subdomain = new Subdomain({
      _id: new mongoose.Types.ObjectId(),
      ownerID: req.userData.userID,
      name: req.body.name,
      content: req.body.content,
      type: req.body.type,
      expiry: expiryDate, // calculate expiry date from now
    });

    subdomain
      .save()
      .then((result) => {
        console.log(result);
        return res.status(201).json({
          message: "Subdomain added!",
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      });
  }
});

router.delete("/", checkAuth, (req, res, next) => {
  const ownerID = req.userData.userID;
  const subdomainID = req.body.subdomainID;
  Subdomain.deleteOne({ _id: subdomainID, ownerID: ownerID })
    .then((result) => {
      res.status(200).json({
        message: "Subdomain deleted",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/check", async (req, res, next) => {
  if (!req.query)
    res.status(400).json({
      error: "Must pass subdomain",
    });
  else {
    const subdomain = req.query.subdomain;
    const restrictedSubdomains = [
      "www",
      "api",
      "app",
      "mail",
      "blog",
      "dev",
      "staging",
      "beta",
      "test",
      "raghav",
      "yashvardhan",
      "nikhil",
      "rupanshi",
      "rjain",
      "nbakshi",
    ];

    if (restrictedSubdomains.includes(subdomain)) {
      res.status(200).json({
        available: false,
      });
    } else {
      const subdomainList = await getSubdomainList();
      if (subdomainList.includes(subdomain + ".servatom.com")) {
        res.status(200).json({
          available: false,
        });
      } else {
        res.status(200).json({
          available: true,
        });
      }
    }
  }
});

const getSubdomainList = async () => {
  const subdomainList = [];
  await axios
    .get("/dns_records")
    .then((response) => {
      response.data.result.forEach((record) => {
        subdomainList.push(record.name);
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return subdomainList;
};

module.exports = router;
