// const axios = require("axios");
// require("dotenv").config();

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosInstance = axios.create({
  baseURL: process.env.CLOUDFLARE_API_BASE_URL + `/zones`,
});

export { axiosInstance };
