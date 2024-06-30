import { Record } from "../models/record";
import { CreateRecordRequest } from "../routes/types";
import { TRecordUpdateConfig } from "../../utils/types";
import { Domain } from "../models/domain";
import { axiosInstance } from "../../axios";
import { decrypt } from "../../utils/utils";

export const cloudflareService = {
  createRecord: async (
    record: CreateRecordRequest["body"],
    ownerID: string
  ) => {
    try {
      const domain = await Domain.findOne({ _id: record.domainID }).then(
        (res) => res
      );

      if (!domain) {
        throw new Error("Domain not found");
      }

      const cf_resp = await axiosInstance //TODO: dynamically add zone id and auth token for each domain
        .post(
          `/${domain.cfZoneID}/dns_records`,
          {
            type: record.type,
            name: record.name,
            content: record.content,
            ttl: 1,
            proxied: false,
            comment: `ServDomain: Created by ${ownerID} for ${record.planID} plan`,
          },
          {
            headers: {
              Authorization: `Bearer ${decrypt(domain.cfAuthToken)}`,
            },
          }
        )
        .then((resp) => resp.data);

      return cf_resp;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  getSubdomainList: async (cfZoneID: string, cfAuthToken: string) => {
    const subdomainList: string[] = [];
    try {
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
        });
      return subdomainList;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  },
  deleteRecord: async (recordID: string) => {
    try {
      const record = await Record.findOne({ _id: recordID }).then((res) => res);
      const domain = await Domain.findOne({ _id: record?.domainID }).then(
        (res) => res
      );

      if (!record || !domain) {
        throw new Error("Record or Domain not found");
      }

      const cf_resp = await axiosInstance
        .delete(`/${domain.cfZoneID}/dns_records/${record.cloudflareID}`, {
          headers: {
            Authorization: `Bearer ${decrypt(domain.cfAuthToken)}`,
          },
        })
        .then((resp) => resp.data);

      return cf_resp;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  updateRecord: async (recordID: string, recordConfig: TRecordUpdateConfig) => {
    try {
      const record = await Record.findOne({ _id: recordID }).then((res) => res);
      const domain = await Domain.findOne({ _id: record?.domainID }).then(
        (res) => res
      );

      if (!record || !domain) {
        throw new Error("Record or Domain not found");
      }

      const cf_resp = await axiosInstance
        .put(
          `/${domain.cfZoneID}/dns_records/${record.cloudflareID}`,
          {
            type: recordConfig.type || record.type,
            content: recordConfig.content || record.content,
            ttl: recordConfig.ttl || record.ttl,
            proxied: recordConfig.proxied || record.proxied,
          },
          {
            headers: {
              Authorization: `Bearer ${decrypt(domain.cfAuthToken)}`,
            },
          }
        )
        .then((resp) => resp.data);

      return cf_resp;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
};
