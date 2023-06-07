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
  const plans = ["personal", "student", "annual"];
  const { name, content, type, plan } = req.body;
  console.log(name, content, type, plan);
  if (
    !name ||
    !content ||
    !validTypes.includes(type) ||
    !plans.includes(plan)
  ) {
    return res.status(400).json({
      error: "Bad Request",
    });
  } else {
    //post to cloudflare and on success save to db
    axios
      .post("/dns_records", {
        type: type,
        name: name,
        content: content,
        ttl: 1,
        proxied: false,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          let expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          const subdomain = new Subdomain({
            _id: new mongoose.Types.ObjectId(),
            cloudflareId: response.data.result.id,
            cloudflareZoneId: response.data.result.zone_id,
            ownerID: req.userData.userID,
            name: name,
            content: content,
            type: type,
            plan: plan,
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
        } else {
          return res.status(500).json({
            message: "Internal Server Error",
            error: response.data.errors,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          message: "Internal Server Error",
          error: error,
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
      "raghavtinker",
      "yashvardhan",
      "yarora",
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
