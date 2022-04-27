const express = require("express");

const otpController = require("../controller/otp.controller");

const router = express.Router();

router.post("/", otpController.sendOTP);
router.post("/resend", otpController.reSendOTP);
router.post("/verify", otpController.verifyOTP);

module.exports = router;
