const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const axios = require("../../axios");
const Subdomain = require("../models/subdomain");

router.get("/", (req, res, next) => {
  const ownerID = req.headers.authorization;
  Subdomain.$where({ ownerID: ownerID })
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
  res.status(200).json({
    message: "Handling GET requests to /subdomain",
  });
});

router.post("/", (req, res, next) => {
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
      ownerID: req.headers.authorization,
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

router.get("/check", async (req, res, next) => {
  if (!req.query)
    res.status(400).json({
      error: "Must pass subdomain",
    });
  else {
    const subdomain = req.query.subdomain;

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
