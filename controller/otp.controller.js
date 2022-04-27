const otpService = require("../service/otp.service");

const sendOTP = async (req, res) => {
  const { username, mobile, name } = req.body;
  const response = await otpService.sendOTP(username, mobile, name);

  res.status(200).send({ data: response });
};

const reSendOTP = async (req, res) => {
  const { username, mobile, name } = req.body;
  const response = await otpService.reSendOTP(username, mobile, name);

  res.status(200).send({ data: response });
};

const verifyOTP = async (req, res) => {
  const { username, otp } = req.body;
  const response = await otpService.verifyOTP(username, otp);

  res.status(200).send({ data: response });
};

module.exports = {
  sendOTP,
  reSendOTP,
  verifyOTP,
};
