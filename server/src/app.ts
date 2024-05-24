// const express = require("express");
// const morgan = require("morgan");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const subdomainRoutes = require("./api/routes/subdomain");
// const userRoutes = require("./api/routes/user");
// const recordRoutes = require("./api/routes/record");
// const domainRoutes = require("./api/routes/domain");
// const planRoutes = require("./api/routes/plan");

import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {
  subdomainRoutes,
  userRoutes,
  recordRoutes,
  domainRoutes,
  planRoutes,
} from "./api/routes";
import { CustomError } from "./utils/types";

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWD}@${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database 🚀");
  });

const app = express();

app.use(morgan("dev")); // middleware for logging requests
app.use(bodyParser.urlencoded({ extended: false })); // middleware for parsing body of requests
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*"); // Handling CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/health", (req: Request, res: Response, next: NextFunction) => {
  res.send("Up and Running!");
});
app.use("/user", userRoutes);
app.use("/record", recordRoutes);
app.use("/domain", domainRoutes);
app.use("/subdomain", subdomainRoutes);
app.use("/plan", planRoutes);

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: CustomError = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
);

export default app;
