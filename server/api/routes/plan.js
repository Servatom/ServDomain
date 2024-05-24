const express = require("express");
const stripe = require("stripe")(process.env);
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { axiosInstance } = require("../../axios");
const { Record, ReservedRecord } = require("../models/record");
const { Domain } = require("../models/domain");
const checkAuth = require("../middleware/check-auth");
const { decrypt } = require("../../utils/utils");
const { Plan } = require("../models/plan");

router.get("/", checkAuth, (req, res, next) => {
  const ownerID = req.userData.userID;
  Plan.find({ ownerID: ownerID })
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

router.post("/", checkAuth, async (req, res, next) => {
  const validPlanTypes = ["personal", "vercel", "annual"];
  const ownerID = req.userData.userID;
  const { stripeSubscriptionId, planType, domainID, label } = req.body;
  if (
    !stripeSubscriptionId ||
    !validPlanTypes.includes(planType) ||
    !domainID ||
    !label
  ) {
    return res.status(400).json({
      error: "Bad Request",
    });
  } else {
    try {
      let expiryDate = new Date();
      // find domain with domainId in db
      const domain = await Domain.findOne({ _id: domainID }).then((res) => res);

      console.log(domain);

      if (!domain) {
        return res.status(404).json({
          message: "Domain not found",
        });
      }

      expiryDate.setDate(expiryDate.getDate() + 30);
      const plan = new Plan({
        _id: new mongoose.Types.ObjectId(),
        ownerID: ownerID,
        domainID: domainID,
        planType: planType,
        planLabel: label + "." + domain.domainName,
        stripeSubscriptionId: stripeSubscriptionId,
        expiry: expiryDate, // calculate expiry date from now
      });

      plan
        .save()
        .then((result) => {
          console.log(result);
          const reservedRecord = new ReservedRecord({
            _id: new mongoose.Types.ObjectId(),
            recordID: result._id,
            ownerID: req.userData.userID,
            // name: name + "." + domain.domainName,
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
              throw err;
            });
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }
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
          data.object.subscription_details.metadata;
        console.log(recordId, firebaseId, plan);
        const reservedRecord = await ReservedRecord.findOne({
          recordID: recordId,
        });

        console.log(reservedRecord);

        if (reservedRecord) {
          const record = await Record.findOne({ _id: recordId }).then(
            (res) => res
          );

          const domain = await Domain.findOne({ _id: record.domainID }).then(
            (res) => res
          );

          const cf_resp = await axiosInstance //TODO: dynamically add zone id and auth token for each domain
            .post(
              `/${domain.cfZoneID}/dns_records`,
              {
                type: record.type,
                name: record.name,
                content: record.content,
                ttl: 1,
                proxied: false,
                comment: `ServDomain: Created by ${firebaseId} for ${plan} plan`,
              },
              {
                headers: {
                  Authorization: `Bearer ${decrypt(domain.cfAuthToken)}`,
                },
              }
            )
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
            record.stripeSubscriptionId = data.object.subscription;
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
          console.log(record);
        }
      } catch (err) {
        console.log(err);
        return response.status(500).json({
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
        } else if (data.object.status == "past_due") {
          await Record.findOneAndUpdate(
            { _id: recordId },
            { status: "overdue" },
            { new: true }
          );
        } else if (data.object.status == "canceled") {
          let record = await Record.findOne({ _id: recordId });
          const domain = await Domain.findOne({ _id: record.domainID }).then(
            (res) => res
          );
          const cf_resp = await axiosInstance
            .delete(`/${domain.cfZoneID}/dns_records/${record.cloudflareId}`, {
              headers: {
                Authorization: `Bearer ${decrypt(domain.cfAuthToken)}`,
              },
            })
            .then((resp) => resp.data);
          if (cf_resp.success) {
            record.status = "cancelled";
            record.save().then((result) => result);
          } else {
            throw cf_resp.errors;
          }
        }
      } catch (err) {
        console.log(err);
        return response.status(500).json({
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

router.patch("/:recordId", checkAuth, async (req, res, next) => {
  const ownerID = req.userData.userID;
  const recordID = req.params.recordId;
  const validTypes = ["A", "CNAME"];
  const { content, type } = req.body;
  console.log(content, type);
  if (!content || !validTypes.includes(type)) {
    return res.status(400).json({
      error: "Bad Request",
    });
  } else {
    try {
      const record = await Record.findOne({ _id: recordID }).then((res) => res);
      const domain = await Domain.findOne({ _id: record.domainID }).then(
        (res) => res
      );

      // update on cloudflare

      const cf_resp = await axiosInstance
        .patch(
          `/${domain.cfZoneID}/dns_records/${record.cloudflareId}`,
          {
            content: content,
            type: type,
          },
          {
            headers: {
              Authorization: `Bearer ${decrypt(domain.cfAuthToken)}`,
            },
          }
        )
        .then((resp) => resp.data);

      if (cf_resp.success) {
        //then
        record.content = content;
        record.type = type;
        record
          .save()
          .then((result) => {
            return res.status(200).json({
              message: "Record Updated",
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
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: JSON.stringify(err),
      });
    }
  }
});

router.delete("/:subscriptionId", checkAuth, async (req, res, next) => {
  const ownerID = req.userData.userID;
  const subscriptionId = req.params.subscriptionId;
  try {
    // find record in db
    let record = await Record.findOne({
      stripeSubscriptionId: subscriptionId,
    }).then((result) => {
      return result;
    });
    const domain = await Domain.findOne({ _id: record.domainID }).then(
      (res) => res
    );

    if (!record) {
      return res.status(404).json({
        message: "Record not found.",
      });
    }

    // delete record from cloudflare
    let cf_resp = await axiosInstance
      .delete(`/${domain.cfZoneID}/dns_records/${record.cloudflareId}`, {
        headers: {
          Authorization: `Bearer ${decrypt(domain.cfAuthToken)}`,
        },
      })
      .then((resp) => resp.data);
    if (!cf_resp.success) throw cf_resp.errors;
    else {
      // update record in db with status = cancelled,
      record.status = "cancelled";
      record
        .save()
        .then((result) => {
          res.status(200).json({
            message: "Subscription cancelled successfully",
            data: result,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            message: err,
          });
        });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
});

router.delete("/incomplete/:recordId", checkAuth, async (req, res, next) => {
  // delete record from records and reservedRecord collection
  const recordId = req.params.recordId;
  console.log(recordId);
  try {
    await Record.deleteOne({ _id: recordId });
    await ReservedRecord.deleteOne({ recordID: recordId });
    res.status(200).json({
      message: "Record Deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
});

module.exports = router;
