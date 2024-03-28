const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const axios = require("axios");
const checkAuth = require("../middleware/check-auth");
const { Domain } = require("../models/domain");
const { encrypt } = require("../../utils/utils");

router.post("/", checkAuth, async (req, res, next) => {
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
        cfAuthToken: encrypt(
          cfAuthToken,
          process.env.CIPHER_KEY,
          process.env.CIPHER_IV
        ),
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
});

module.exports = router;
