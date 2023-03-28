const express = require("express");
const app = express();

const subdomainRoutes = require("./api/routes/subdomain");

app.use("/subdomain", subdomainRoutes);

module.exports = app;
