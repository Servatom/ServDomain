const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const subdomainRoutes = require("./api/routes/subdomain");
const userRoutes = require("./api/routes/user");
const recordRoutes = require("./api/routes/record");
const domainRoutes = require("./api/routes/domain");

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
app.use((req, res, next) => {
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

app.get("/health", (req, res, next) => {
  res.send("Up and Running!");
});
app.use("/user", userRoutes);
app.use("/record", recordRoutes);
app.use("/domain", domainRoutes);
app.use("/subdomain", subdomainRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
