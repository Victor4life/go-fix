// backend/routes/serviceRequests.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/service-requests/notify", async (req, res) => {
  try {
    const { professionalEmail, serviceName, professionalName } = req.body;

    // Create transporter using your existing email config
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: professionalEmail,
      subject: "New Service Request",
      html: `
        <h2>New Service Request</h2>
        <p>Hello ${professionalName},</p>
        <p>You have received a new service request for: ${serviceName}</p>
        <p>Please log in to your account to view more details and respond to this request.</p>
        <p>Best regards,<br>Your Platform Team</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
});

module.exports = router;
