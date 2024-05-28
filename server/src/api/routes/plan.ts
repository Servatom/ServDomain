import { NextFunction, Request, Response, Router } from "express";
import checkAuth from "../middleware/check-auth";
import { CreatePlanRequest, PaymentVerifyRequest } from "./types";
import { Plan } from "../models/plan";
import crypto from "crypto";
import { AuthenticatedRequest } from "../../utils/types";
import mongoose from "mongoose";

const router = Router();

router.post(
  "/",
  checkAuth,
  (req: CreatePlanRequest, res: Response, next: NextFunction) => {
    const ownerID = req.userData?.userID || "x";
    const { domainID, planType, planLabel, razorpaySubscriptionID } = req.body;

    try {
      const plan = new Plan({
        _id: new mongoose.Types.ObjectId(),
        ownerID: ownerID,
        domainID: domainID,
        planType: planType,
        planLabel: planLabel,
        status: "processing",
        hasTxtRecord: false,
        expiry: new Date(),
        razorpaySubscriptionID: razorpaySubscriptionID,
      });

      plan.save().then((result) => {
        res.status(201).json({
          message: "Plan Created",
          data: result,
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    }
  }
);

router.post(
  "/verify",
  checkAuth,
  (req: PaymentVerifyRequest, res: Response, next: NextFunction) => {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_payment_id + "|" + razorpay_subscription_id)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // update plan status to active
      try {
        Plan.updateOne(
          { razorpaySubscriptionID: razorpay_subscription_id },
          {
            status: "active",
            expiry: new Date() /* fetch expiry from razorpay */,
          }
        ).then((result) => {
          res.status(200).json({
            message: "Payment Verified",
          });
        });

        // find domainID from plan, create record on cloudflare, delete reservedRecord
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: err,
        });
      }
    }
  }
);

router.get(
  "/",
  checkAuth,
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const ownerID = req.userData?.userID;
    try {
      Plan.find({ ownerID: ownerID }).then((result) => {
        res.status(200).json({
          data: result,
        });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    }
  }
);

router.post("/webhook", (req: Request, res: Response) => {
  if (req.body.event === "subscription.charged") {
    const subscriptionEntity = req.body.payload.subscription.entity;
    console.log({ ...subscriptionEntity });

    // log:
    // {
    //   id: 'sub_OG2chJoM9DRdum',
    //   entity: 'subscription',
    //   plan_id: 'plan_OEj5fUJpj4yfEs',
    //   customer_id: 'cust_OG1uBmOH673KZI',
    //   status: 'active',
    //   current_start: 1716927176,
    //   current_end: 1719599400,
    //   ended_at: null,
    //   quantity: 1,
    //   notes: {
    //     ownerID: '664bb289832407580571bf7b',
    //     domainID: '663be1d6162c5e1e2fa35985',
    //     planLabel: 'hbd1.663be1d6162c5e1e2fa35985',
    //     planType: 'vercel'
    //   },
    //   charge_at: 1719599400,
    //   start_at: 1716927176,
    //   end_at: 1745865000,
    //   auth_attempts: 0,
    //   total_count: 12,
    //   paid_count: 1,
    //   customer_notify: true,
    //   created_at: 1716927160,
    //   expire_by: null,
    //   short_url: null,
    //   has_scheduled_changes: false,
    //   change_scheduled_at: null,
    //   source: 'api',
    //   payment_method: 'card',
    //   offer_id: null,
    //   remaining_count: 11
    // }
  }
  res.status(200).send("ok");
});

// router.delete("/incomplete/:recordId", checkAuth, async (req, res, next) => {
//   // delete record from records and reservedRecord collection
//   const recordId = req.params.recordId;
//   console.log(recordId);
//   try {
//     await Record.deleteOne({ _id: recordId });
//     await ReservedRecord.deleteOne({ recordID: recordId });
//     res.status(200).json({
//       message: "Record Deleted",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: err,
//     });
//   }
// });

export default router;
