const { CourierClient } = require("@trycourier/courier");
const otpGenerator = require("otp-generator");

const OTPModel = require("../model/otp.model");
const UserModel = require("../model/user.model");

require("dotenv").config();

const courier = CourierClient({
  authorizationToken: process.env.COURIER_TOKEN,
});

const sendOTP = async (username, mobile, name) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await addNewOTP(otp, 15, username, "PENDING");
    await sendVerificationMessage(
      {
        name,
        otp,
      },
      mobile
    );
    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const reSendOTP = async (username, mobile, name) => {
  try {
    await rejectPendingOTP(username);
    return await sendOTP(username, mobile, name);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const verifyOTP = async (username, otp) => {
  try {
    const validOTP = await OTPModel.findOne({
      otp,
      username,
      status: "PENDING",
      expireIn: { $gte: new Date().getTime() },
    });

    if (validOTP) {
      await OTPModel.updateOne(
        { _id: validOTP._id },
        { $set: { status: "CONFIRMED" } }
      );
      await UserModel.updateOne({ username }, { $set: { status: "VERIFIED" } });
      return {
        success: true,
        message: "User verified",
      };
    }
    throw new Error("Invalid OTP");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const sendVerificationMessage = (params, mobileNumber) => {
  return courier.send({
    message: {
      to: {
        data: params,
        phone_number: mobileNumber,
      },
      content: {
        title: "XYZ Verification",
        body: "Hi {{name}},\nYour verification code for XYZ is {{otp}}.",
      },
      routing: {
        method: "single",
        channels: ["sms"],
      },
    },
  });
};

const addMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

const addNewOTP = (otp, expirationTime, username, status) => {
  const otpModel = new OTPModel({
    otp,
    expireIn: addMinutesToDate(new Date(), expirationTime),
    username,
    status,
  });
  return otpModel.save();
};

const rejectPendingOTP = (username) => {
  return OTPModel.updateMany(
    { username, status: "PENDING" },
    { $set: { status: "REJECTED" } }
  );
};

module.exports = {
  sendOTP,
  reSendOTP,
  verifyOTP,
};
