import express from "express";
import mailService from "../services/mail.service";

const router = express.Router();

router.get("/verify-email-config", async (req, res) => {
  try {
    const isVerified = await mailService.verifyConnection();
    res.json({ success: isVerified });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Unknown error occurred" });
  }
});

router.get("/send-test-email", async (req, res) => {
  try {
    const isSent = await mailService.sendTestEmail();
    res.json({ success: isSent });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Unknown error occurred" });
  }
});

export default router;
