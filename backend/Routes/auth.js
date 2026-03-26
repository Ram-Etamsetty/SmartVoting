const express = require("express");
const router = express.Router();
const {
  register,
  loginUser,
  verifyOTP,
  resendOTP,
  changePassword,
} = require("../Controllers/authController");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);
router.post("/change-password", changePassword);

module.exports = router;
