const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { encryptDescriptor } = require("../utils/faceCrypto");
const { generateOTP, sendOTPEmail } = require("../utils/emailOtp");

const register = async (req, res) => {
  const { name, email, password, jobTitle, faceDescriptor } = req.body;
  console.log("\n🔐 REGISTER REQUEST RECEIVED");
  console.log(`   Email: ${email}`);
  console.log(`   Name: ${name}`);

  try {
    // Check duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters and include letters, numbers, and a special character",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    console.log(`   Generated OTP: ${otp}`);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const encryptedDescriptor = faceDescriptor
      ? encryptDescriptor(faceDescriptor)
      : null;

    // Create or update user with OTP (not verified yet)
    let user = await User.findOne({ email });
    if (user) {
      // Update existing unverified account
      user.name = name;
      user.password = hashedPassword;
      user.jobTitle = jobTitle;
      user.faceDescriptor = encryptedDescriptor || null;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        jobTitle,
        faceDescriptor: encryptedDescriptor || null,
        otp,
        otpExpiry,
        isEmailVerified: false,
      });
    }

    // Send OTP email
    console.log(`   Calling sendOTPEmail...`);
    const emailSent = await sendOTPEmail(email, otp);
    console.log(`   Email send result: ${emailSent ? "SUCCESS" : "FAILED"}`);

    if (!emailSent) {
      console.error(`❌ REGISTER FAILED: Email send returned false`);
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }

    console.log(`✅ User created and OTP email sent to ${email}`);
    res.status(200).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
      email: email,
      expiresIn: "10 minutes",
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please register first.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
      });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "7d" });

    res.status(200).json({
      message: "Email verified successfully. Registration complete!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userAvailable = await User.findOne({ email });
    if (!userAvailable) {
      return res.status(400).json({ message: "User not Exists" });
    }

    if (!userAvailable.isEmailVerified) {
      return res.status(400).json({
        message: "Please verify your email first before logging in",
      });
    }

    const correctPassword = await bcrypt.compare(
      password,
      userAvailable.password,
    );
    if (!correctPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: userAvailable._id }, "secret123", {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: userAvailable._id,
        name: userAvailable.name,
        email: userAvailable.email,
        jobTitle: userAvailable.jobTitle,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please register first.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(200).json({
      message: "OTP resent successfully to your email",
      email: email,
      expiresIn: "10 minutes",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    // Validate inputs
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Email, old password, and new password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Verify old password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, loginUser, verifyOTP, resendOTP, changePassword };
