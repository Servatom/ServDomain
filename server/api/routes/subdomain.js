const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /subdomain",
  });
});

router.post("/", (req, res, next) => {
  if (!req.body)
    res.status(403).json({
      error: "Must pass subdomain",
    });
  else {
    const subdomain = {
      subdomain: req.body.subdomain,
    };
    res.status(201).json({
      message: "Handling POST requests to /subdomain",
      createdSubdomain: subdomain,
    });
  }
});

router.get("/check", (req, res, next) => {
  console.log(req.query);
  if (!req.query)
    res.status(400).json({
      error: "Must pass subdomain",
    });
  else {
    const subdomain = req.query.subdomain;

    res.status(200).json({
      status: true,
      createdSubdomain: subdomain,
    });
  }
});

module.exports = router;
