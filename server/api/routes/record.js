const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const axios = require("../../axios");
const { Record, ReservedRecord } = require("../models/record");
const checkAuth = require("../middleware/check-auth");
const { stripePaymentLinks } = require("../../config");

router.get("/", checkAuth, (req, res, next) => {
  const ownerID = req.userData.userID;
  Record.find({ ownerID: ownerID })
    .sort({ updated_at: -1 })
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
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const record = new Record({
      _id: new mongoose.Types.ObjectId(),
      cloudflareId: "x",
      cloudflareZoneId: "x",
      ownerID: req.userData.userID,
      name: name,
      content: content,
      type: type,
      plan: plan,
      expiry: expiryDate, // calculate expiry date from now
    });

    record
      .save()
      .then((result) => {
        console.log(result);
        const reservedRecord = new ReservedRecord({
          _id: new mongoose.Types.ObjectId(),
          recordID: result._id,
          ownerID: req.userData.userID,
          name: name,
        });
        reservedRecord
          .save()
          .then((result) => {
            return res.status(201).json({
              message: "Subdomain Reserved!",
              payment_url: stripePaymentLinks[plan] + "?recordID=" + result._id,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({
              message: "Internal Server Error",
              error: err,
            });
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

router.post("/webhook", (req, res, next) => {
  console.log(req.body);
  res.status(200).json({
    message: "Webhook received",
  });

  // if status = success

  // get record from db

  // if status = processing
  //post to cloudflare
  //   axios
  //     .post("/dns_records", {
  //       type: type,
  //       name: name,
  //       content: content,
  //       ttl: 1,
  //       proxied: false,
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       if (response.data.success) {
  //         //update status, expiry, cloudflareId and cloudflareZoneId in record
  //         // remove record from reserved records
  //       } else {
  //         return res.status(500).json({
  //           message: "Internal Server Error",
  //           error: response.data.errors,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return res.status(500).json({
  //         message: "Internal Server Error",
  //         error: error,
  //       });
  //     });
});

router.delete("/:recordId", checkAuth, async (req, res, next) => {
  const ownerID = req.userData.userID;
  const recordID = req.params.recordId;
  // find record in db
  let record = await Record.findOne({ _id: recordID, ownerID: ownerID }).then(
    (result) => {
      return result;
    }
  );

  axios.delete(`/dns_records/${record.cloudflareId}`).then((response) => {
    console.log(response.data);
    if (response.data.success) {
      // remove record from reserved records
      Record.deleteOne({ recordID: recordID, ownerID: ownerID })
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
    } else {
      return res.status(500).json({
        message: "Cloudflare Error",
        error: response.data.errors,
      });
    }
  });
});

module.exports = router;
