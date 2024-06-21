// create a record

import mongoose from "mongoose";
import { Record } from "../models/record";
import { Plan } from "../models/plan";
import { CreateRecordRequest } from "../routes/types";
import { TPlanName } from "../../utils/types";

export const recordService = {
  createRecord: async (
    record: CreateRecordRequest["body"],
    ownerID: string
  ) => {
    // create a record
    try {
      const newRecord = new Record({
        _id: new mongoose.Types.ObjectId(),
        ownerID: ownerID,
        ...record,
      });
      const result = await newRecord.save();
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getRecord: async () => {
    // get a record
  },
  deleteRecord: async () => {
    // delete a record
  },
  updateRecord: async () => {
    // update a record
  },
  getRecordsByUser: async (ownerID: string) => {
    // get all records by user
    try {
      const records = await Record.find({ ownerID });
      return records;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getRecordsByPlan: async (planID: string) => {
    // get all records by plan
    try {
      const records = await Record.find({ planID });
      return records;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getRecordsByUserandPlanType: async (planType: TPlanName, ownerID: string) => {
    try {
      // find all plans by user and plan type
      // for each plan, find all records

      const plans = await Plan.find({ ownerID, planType });

      const records = await Promise.all(
        plans.map(async (plan) => {
          return await Record.find({ planID: plan._id });
        })
      );

      return records;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};
