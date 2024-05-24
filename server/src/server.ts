// const http = require("http");
// const app = require("./app");
// require("dotenv").config();

import http from "http";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

server.listen(port, "0.0.0.0", 100, () => {
  console.log(`Server running on port ${port}`);
});
