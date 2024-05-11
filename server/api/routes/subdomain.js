const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { axiosInstance } = require("../../axios");
const { ReservedRecord } = require("../models/record");
const { Domain } = require("../models/domain");
const checkAuth = require("../middleware/check-auth");
const { decrypt } = require("../../utils/utils");
router.get("/check", async (req, res, next) => {
  if (!req.query)
    res.status(400).json({
      error: "Must pass subdomain",
    });
  else {
    const subdomain = req.query.subdomain;
    const domainID = req.query.domainID;

    const domain = await Domain.findOne({ _id: domainID }).then((result) => {
      return result;
    });

    if (!domain) {
      res.status(400).json({
        error: "Invalid domain",
      });
    }

    const restrictedSubdomains = [
      // "www",
      // "api",
      // "app",
      // "mail",
      // "blog",
      // "dev",
      // "staging",
      // "beta",
      // "test",
      // "prod",
      // "raghav",
      // "raghavtinker",
      // "yashvardhan",
      // "yarora",
      // "nikhil",
      // "rupanshi",
      // "rjain",
      // "nbakshi",
      // "nikhilbksi",
      "fuck",
      "mdc",
      "bkl",
      "chutiya",
      "chutiye",
      "chuthiya",
      "porn",
      "sex",
      "lund",
      "loda",
      "chut",
      "gand",
      "gandu",
      ...domain.restrictedSubdomains,
    ];

    const isReserved = await ReservedRecord.findOne({ name: subdomain })
      .then((result) => {
        if (result != null) {
          console.log("found in reserved");
          return true;
        } else {
          return false;
        }
      })
      .catch(() => {
        return true;
      });
    console.log(isReserved);

    if (isReserved || restrictedSubdomains.includes(subdomain)) {
      res.status(200).json({
        available: false,
      });
    } else {
      const subdomainList = await getSubdomainList(
        domain.cfZoneID,
        domain.cfAuthToken
      );
      if (subdomainList.includes(subdomain + domain.domainName)) {
        res.status(200).json({
          isAvailable: false,
        });
      } else {
        res.status(200).json({
          isAvailable: true,
        });
      }
    }
  }
});

const getSubdomainList = async (cfZoneID, cfAuthToken) => {
  const subdomainList = [];
  await axiosInstance
    .get(`/${cfZoneID}/dns_records`, {
      headers: {
        Authorization: `Bearer ${decrypt(cfAuthToken)}`,
      },
    })
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
