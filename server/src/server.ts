// const http = require("http");
// const app = require("./app");
// require("dotenv").config();

import http from "http";
import app from "./app";
import dotenv from "dotenv";
import mongoose, { set } from "mongoose";

dotenv.config();
const port = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

async function startServer() {
  try {
    await mongoose
      .connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWD}@${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`
      )
      .then(() => {
        console.log("Connected to database 🚀");
      });

    server.listen(port, "0.0.0.0", 100, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
    setTimeout(startServer, 1500);
  }

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB Error", err);
    process.exit(1);
  });
}

startServer();
