const nodemailer = require("nodemailer");

// Create transporter function - creates fresh connection for each email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });
};

// Test connection on startup
console.log("📧 Checking email configuration...");
const testTransporter = createTransporter();
testTransporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email setup failed:", error.message);
  } else {
    console.log("✅ Email transporter ready to send");
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  console.log(`\n📧 SENDING OTP EMAIL to ${email}`);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification - OTP",
    html: `
      <h2>Email Verification</h2>
      <p>Your One-Time Password (OTP) is:</p>
      <h1 style="color: #007bff; letter-spacing: 2px;">${otp}</h1>
      <p>This OTP will expire in <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr>
      <p style="font-size: 12px; color: #666;">Please do not share this OTP with anyone.</p>
    `,
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP EMAIL SENT - MessageID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`EMAIL FAILED:`, error.message);
    return false;
  }
};

module.exports = { generateOTP, sendOTPEmail };
