import mongoose from "mongoose";
import { IPlan, Plan } from "../models/plan";
import { TPlanStatus } from "../../utils/types";

export const planService = {
  createPlan: async (plan: IPlan) => {
    try {
      const newPlan = new Plan({
        ...plan,
        _id: new mongoose.Types.ObjectId(),
        status: "processing",
        hasTxtRecord: false,
        expiry: new Date(),
      });
      const result = await newPlan.save();
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getPlanByID: async (id: string) => {
    try {
      const plan = await Plan.findById(id);
      return plan;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  activePlan: async (razorpaySubscriptionID: string, expiry: Date) => {
    try {
      const plan = await Plan.findOneAndUpdate(
        { razorpaySubscriptionID },
        { status: "active", expiry }
      );
      return plan;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  deletePlan: async () => {
    // delete a plan
  },

  updatePlanStatus: async (planID: string, status: TPlanStatus) => {
    // update a plan
    try {
      const plan = await Plan.findByIdAndUpdate(planID, { status });
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getPlansByUser: async (userID: string) => {
    // get all plans by user
    try {
      const plans = await Plan.find({ ownerID: userID });
      return plans;
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getPlansByDomain: async () => {
    // get all plans by domain
  },
};
