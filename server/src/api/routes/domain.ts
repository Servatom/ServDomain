import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import axios from "axios";
import checkAuth from "../middleware/check-auth";
import { Domain } from "../models/domain";
import { encrypt } from "../../utils/utils";
import { AuthenticatedRequest } from "../../utils/types";
import { DomainPostRequest } from "./types";

const router = express.Router();

router.get(
  "/default",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const domain = await Domain.findOne({
        domainName: process.env.DEFAULT_DOMAIN_NAME,
      }).then((res) => res);

      if (!domain) {
        return res.status(404).json({
          error: "Default domain not found",
        });
      } else {
        return res.status(200).json({
          domainName: domain.domainName,
          domainID: domain._id,
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

router.post(
  "/",
  checkAuth,
  async (req: DomainPostRequest, res: Response, next: NextFunction) => {
    const userID = req.userData.userID;
    const { cfAuthToken, cfZoneID, restrictedSubdomains = [] } = req.body;
    try {
      let cf_response = await axios
        .get(`${process.env.CLOUDFLARE_API_BASE_URL}/zones/${cfZoneID}`, {
          headers: {
            Authorization: `Bearer ${cfAuthToken}`,
          },
        })
        .then((resp) => resp.data);

      if (cf_response.success) {
        let domain_name = cf_response.result.name;

        const domain = new Domain({
          _id: new mongoose.Types.ObjectId(),
          ownerID: userID,
          cfAuthToken: encrypt(cfAuthToken),
          cfZoneID: cfZoneID,
          domainName: domain_name,
          restrictedSubdomains: restrictedSubdomains,
        })
          .save()
          .then((x) => {
            return res.status(200).json({
              domain: domain_name,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              error: err,
            });
          });
      } else {
        return res.status(500).json({
          error: "Invalid Cloudflare Zone ID or Auth Token",
        });
      }
    } catch (error) {
      if (error.response.status === 403) {
        return res.status(500).json({
          error: "Invalid Cloudflare Auth Token",
        });
      } else if (error.response.status === 404) {
        return res.status(500).json({
          error: "Invalid Cloudflare Zone ID",
        });
      }
      return res.status(500).json({
        error: error.message,
      });
    }
  }
);

export default router;
