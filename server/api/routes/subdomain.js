const express = require("express");
const router = express.Router();
const axios = require("../../axios");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /subdomain",
  });
});

router.post("/", (req, res, next) => {
  if (!req.body.subdomain) {
    return res.status(400).json({
      error: "Must pass subdomain",
    });
  } else {
    const subdomain = req.body.subdomain;
    return res.status(201).json({
      message: "Handling POST requests to /subdomain",
      createdSubdomain: subdomain,
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
