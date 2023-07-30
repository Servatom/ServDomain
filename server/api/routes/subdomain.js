const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const axios = require("../../axios");
const { ReservedRecord } = require("../models/record");
const checkAuth = require("../middleware/check-auth");

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
      "raghavtinker",
      "yashvardhan",
      "yarora",
      "nikhil",
      "rupanshi",
      "rjain",
      "nbakshi",
      "fuck",
      "mdc",
      "bkl",
      "chutiya",
      "chutiye",
      "chuthiya",
    ];

    let isReserved = false;
    ReservedRecord.findOne({ name: subdomain })
      .then((result) => {
        if (result != null) {
          isReserved = true;
        } else isReserved = false;

        return;
      })
      .catch(() => {
        isReserved = true;
        return;
      });

    if (restrictedSubdomains.includes(subdomain) || isReserved) {
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
