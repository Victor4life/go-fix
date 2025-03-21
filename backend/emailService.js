const nodemailer = require("nodemailer");

// Check required environment variables
const checkRequiredEnvVars = () => {
  const required = [
    "EMAIL_SERVICE",
    "EMAIL_USER",
    "EMAIL_APP_PASSWORD",
    "ADMIN_EMAIL",
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// Call it when the module loads
checkRequiredEnvVars();

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

// Email templates
const emailTemplates = {
  welcome: (username, verificationUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h1 style="color: #333; text-align: center;">Welcome ${username}!</h1>
      <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
        <p style="color: #666;">Thank you for joining us. Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">If the button doesn't work, copy and paste this link into your browser: ${verificationUrl}</p>
      </div>
    </div>
  `,

  passwordReset: (resetUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
      <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
        <p style="color: #666;">You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, please ignore this email.</p>
        <p style="color: #999; font-size: 12px; text-align: center;">This link will expire in 1 hour.</p>
      </div>
    </div>
  `,

  adminNotification: (userData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center;">New Service Provider Registration</h2>
      <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
        <p><strong>Business Name:</strong> ${userData.businessName}</p>
        <p><strong>Service Type:</strong> ${userData.serviceType || "N/A"}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Phone:</strong> ${userData.phoneNumber || "N/A"}</p>
      </div>
    </div>
  `,
};

// Email validation function
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }
};

// Send email with retry mechanism
const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully on attempt ${attempt}`);
      return info;
    } catch (error) {
      console.error(`Email attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Basic email sending function
const sendEmail = async (to, subject, htmlContent) => {
  try {
    validateEmail(to);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };
    await sendEmailWithRetry(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

// Welcome email function
const sendWelcomeEmail = async (userEmail, username, verificationToken) => {
  try {
    if (!userEmail || !username || !verificationToken) {
      throw new Error("Missing required fields for welcome email");
    }

    const verificationUrl = `http://localhost:3000/verify/${verificationToken}`;
    const htmlContent = emailTemplates.welcome(username, verificationUrl);

    return await sendEmail(
      userEmail,
      "Welcome - Please Verify Your Email",
      htmlContent
    );
  } catch (error) {
    console.error("Welcome email failed:", error.message);
    throw error;
  }
};

// Password reset email function
const sendPasswordResetEmail = async (userEmail, resetToken) => {
  try {
    if (!userEmail || !resetToken) {
      throw new Error("Missing required fields for password reset email");
    }

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const htmlContent = emailTemplates.passwordReset(resetUrl);

    return await sendEmail(userEmail, "Password Reset Request", htmlContent);
  } catch (error) {
    console.error("Password reset email failed:", error.message);
    throw error;
  }
};

// Admin notification function
const sendAdminNotification = async (userData) => {
  try {
    if (!userData.email || !userData.businessName) {
      throw new Error("Missing required user data");
    }

    const htmlContent = emailTemplates.adminNotification(userData);

    return await sendEmail(
      process.env.ADMIN_EMAIL,
      "New Service Provider Registration",
      htmlContent
    );
  } catch (error) {
    console.error("Admin notification failed:", error.message);
    throw error;
  }
};

// Email queue for handling bulk emails
class EmailQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  add(emailData) {
    this.queue.push(emailData);
    if (!this.processing) {
      this.process();
    }
  }

  async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const { to, subject, html } = this.queue.shift();
      try {
        await sendEmail(to, subject, html);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }
    this.processing = false;
  }
}

const emailQueue = new EmailQueue();

// Test function
const testEmails = async () => {
  try {
    // Test welcome email
    await sendWelcomeEmail(
      "test@example.com",
      "Test User",
      "test-verification-token"
    );
    console.log("Welcome email test passed");

    // Test admin notification
    await sendAdminNotification({
      email: "test@example.com",
      businessName: "Test Business",
      serviceType: "Test Service",
      phoneNumber: "1234567890",
    });
    console.log("Admin notification test passed");

    // Test password reset email
    await sendPasswordResetEmail("test@example.com", "test-reset-token");
    console.log("Password reset email test passed");
  } catch (error) {
    console.error("Email test failed:", error.message);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendAdminNotification,
  sendPasswordResetEmail,
  testEmails,
  emailQueue,
};
