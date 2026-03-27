const express = require("express");
const router = express.Router();
const {
  register,
  loginUser,
  verifyOTP,
  resendOTP,
  changePassword,
  verifyFace,
} = require("../Controllers/authController");
const { protect } = require("../Middleware/AuthMiddleWare");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);
router.post("/change-password", changePassword);
router.post("/verify-face", protect, verifyFace);

module.exports = router;
