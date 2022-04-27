const express = require("express");
const bodyParser = require("body-parser");

const userRoute = require("./route/user.route");
const otpRoute = require("./route/otp.route");

const path = require("path");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/otp", otpRoute);

module.exports = app;
