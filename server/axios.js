const axios = require("axios");
require("dotenv").config();

const axiosInstance = axios.create({
  baseURL: process.env.CLOUDFLARE_API_BASE_URL + `/zones`,
});

module.exports = { axiosInstance };
