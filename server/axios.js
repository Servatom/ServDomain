const axios = require("axios");
require("dotenv").config();

const instance = axios.create({
  baseURL:
    process.env.CLOUDFLARE_API_BASE_URL +
    `/zones/${process.env.DEFAULT_CLOUDFLARE_ZONE_ID}`,
  headers: {
    Authorization: `Bearer ${process.env.DEFAULT_CLOUDFLARE_AUTH_TOKEN}`,
  },
});

module.exports = instance;
