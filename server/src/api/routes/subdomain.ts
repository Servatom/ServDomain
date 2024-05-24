import express, { NextFunction, Response } from "express";
import { axiosInstance } from "../../axios";
import { decrypt } from "../../utils/utils";
import { ReservedRecord } from "../models/record";
import { Domain } from "../models/domain";
import { SubdomainCheckRequest } from "./types";

const router = express.Router();

router.get(
  "/check",
  async (req: SubdomainCheckRequest, res: Response, next: NextFunction) => {
    if (!req.query)
      res.status(400).json({
        error: "Must pass subdomain",
      });
    else {
      const subdomain = req.query.subdomain;
      const domainID = req.query.domainID;

      const domain = await Domain.findOne({ _id: domainID }).then((result) => {
        return result;
      });

      if (!domain) {
        return res.status(400).json({
          error: "Invalid domain",
        });
      }

      const restrictedSubdomains = [
        // "www",
        // "api",
        // "app",
        // "mail",
        // "blog",
        // "dev",
        // "staging",
        // "beta",
        // "test",
        // "prod",
        // "raghav",
        // "raghavtinker",
        // "yashvardhan",
        // "yarora",
        // "nikhil",
        // "rupanshi",
        // "rjain",
        // "nbakshi",
        // "nikhilbksi",
        "fuck",
        "mdc",
        "bkl",
        "chutiya",
        "chutiye",
        "chuthiya",
        "porn",
        "sex",
        "lund",
        "loda",
        "chut",
        "gand",
        "gandu",
        ...domain.restrictedSubdomains,
      ];

      const isReserved = await ReservedRecord.findOne({
        name: subdomain + "." + domain.domainName,
      })
        .then((result) => {
          if (result != null) {
            console.log("found in reserved");
            return true;
          } else {
            return false;
          }
        })
        .catch(() => {
          return true;
        });
      console.log(isReserved);

      if (isReserved || restrictedSubdomains.includes(subdomain)) {
        res.status(200).json({
          available: false,
        });
      } else {
        const subdomainList = await getSubdomainList(
          domain.cfZoneID,
          domain.cfAuthToken
        );
        if (subdomainList.includes(subdomain + "." + domain.domainName)) {
          res.status(200).json({
            isAvailable: false,
          });
        } else {
          res.status(200).json({
            isAvailable: true,
          });
        }
      }
    }
  }
);

const getSubdomainList = async (cfZoneID: string, cfAuthToken: string) => {
  const subdomainList: string[] = [];
  await axiosInstance
    .get(`/${cfZoneID}/dns_records`, {
      headers: {
        Authorization: `Bearer ${decrypt(cfAuthToken)}`,
      },
    })
    .then((response) => {
      response.data.result.forEach((record: { name: string }) => {
        subdomainList.push(record.name);
      });
    })
    .catch((error: any) => {
      console.log(error);
    });

  return subdomainList;
};

export default router;
