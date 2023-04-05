const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const subdomainRoutes = require("./api/routes/subdomain");
const userRoutes = require("./api/routes/user");

mongoose.connect(
  `mongodb+srv://yash22arora:${process.env.MONGODB_PASSWD}@servdomain.e6tn8tj.mongodb.net/?retryWrites=true&w=majority`
);

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

app.use("/user", userRoutes);
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
