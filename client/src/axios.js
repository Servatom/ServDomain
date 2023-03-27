import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL +
    `/zones/${process.env.REACT_APP_CLOUDFLARE_ZONE_ID}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_CLOUDFLARE_AUTH_TOKEN}`,
    "X-Auth-Email": process.env.REACT_APP_CLOUDFLARE_AUTH_EMAIL,
    "X-Auth-Key": process.env.REACT_APP_CLOUDFLARE_AUTH_KEY,
  },
});

export default instance;
