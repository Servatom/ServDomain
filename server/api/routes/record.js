const express = require("express");
const stripe = require("stripe")(process.env);
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
          .then((x) => {
            return res.status(201).json({
              message: "Subdomain Reserved!",
              recordId: result._id,
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

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (request, response, next) => {
    const { type, data } = request.body;
    // if status = success

    // get record from db

    if (type === "invoice.payment_succeeded") {
      try {
        const { recordId, firebaseId, plan } =
          data.object.lines.data[0].metadata;
        console.log(recordId, firebaseId, plan);
        const reservedRecord = await ReservedRecord.findOne({
          recordID: recordId,
        });

        console.log(reservedRecord);

        if (reservedRecord) {
          const record = await Record.findOne({ _id: recordId }).then(
            (res) => res
          );

          const cf_resp = await axios
            .post("/dns_records", {
              type: record.type,
              name: record.name,
              content: record.content,
              ttl: 1,
              proxied: false,
              comment: `ServDomain: Created by ${firebaseId} for ${plan} plan`,
            })
            .then((resp) => resp.data);

          if (cf_resp.success) {
            //update status, expiry, cloudflareId and cloudflareZoneId in record
            // remove record from reserved records

            console.log(new Date(data.object.lines.data[0].period.end * 1000));

            record.status = "active";
            record.expiry = new Date(
              data.object.lines.data[0].period.end * 1000
            );
            record.cloudflareId = cf_resp.result.id;
            record.cloudflareZoneId = cf_resp.result.zone_id;
            record
              .save()
              .then((result) => {
                ReservedRecord.deleteOne({ recordID: recordId })
                  .then((result) => {
                    console.log(result);
                  })
                  .catch((err) => {
                    console.log(err);
                    throw err;
                  });
              })
              .catch((err) => {
                console.log(err);
                throw err;
              });
          }
        } else {
          const record = await Record.findOneAndUpdate(
            { _id: recordId },
            {
              status: "active",
              expiry: new Date(data.object.lines.data[0].period.end * 1000),
            }
          );
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      }
    } else if (type === "customer.subscription.updated") {
      try {
        const { recordId, firebaseId, plan } = data.object.metadata;
        if (data.object.status.includes("expired")) {
          await ReservedRecord.deleteOne({ recordID: recordId });
          await Record.findOneAndUpdate(
            { _id: recordId },
            { status: "expired" },
            { new: true }
          );
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      }
    }

    response.status(200).json({
      received: true,
    });
  }
);

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
