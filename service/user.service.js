const UserModel = require("../model/user.model");

const otpService = require("../service/otp.service");

const signUp = async ({ username, password, mobileNo, name }) => {
  try {
    const user = new UserModel({
      username,
      password,
      mobileNo,
      name,
      status: "PENDING",
    });

    const savedUser = await user.save();
    await otpService.sendOTP(username, mobileNo, name);
    return savedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  signUp,
};
