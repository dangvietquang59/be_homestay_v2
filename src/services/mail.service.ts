import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug logs
  logger: true, // Enable logger
});

// Verify transporter configuration
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("SMTP connection verification failed:", error);
    return false;
  }
};

// Test email sending
const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "2024801030007@student.tdmu.edu.vn",
      subject: "Test Email",
      text: "This is a test email to verify email sending functionality",
      html: "<b>This is a test email to verify email sending functionality</b>",
    });
    console.log("Test email sent successfully:", info);
    return true;
  } catch (error) {
    console.error("Failed to send test email:", error);
    return false;
  }
};

export default {
  verifyConnection,
  sendTestEmail,
  transporter,
};
