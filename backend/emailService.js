const nodemailer = require("nodemailer");

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Validation helper
const validateEmailData = (userData) => {
  if (!userData.email || !userData.businessName) {
    throw new Error("Missing required email data");
  }
};

// Retry mechanism
const sendEmailWithRetry = async (mailOptions, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully: %s", info.messageId);
      return info;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry attempt ${i + 1} of ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Send welcome email to user
const sendWelcomeEmail = async (userEmail, username, verificationToken) => {
  try {
    if (!userEmail || !username || !verificationToken) {
      throw new Error("Email, username, and verification token are required");
    }

    // Use your existing frontend URL
    const verificationUrl = `http://localhost:3000/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Welcome - Please Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome ${username}!</h1>
          <p>Thank you for registering with our service. We're excited to have you on board!</p>
          
          <div style="margin: 25px 0;">
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 12px 25px; 
                      text-decoration: none; 
                      display: inline-block; 
                      border-radius: 4px;">
              Verify Email Address
            </a>
          </div>
          
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666;">${verificationUrl}</p>
          
          <p style="color: #666; font-size: 14px;">
            This verification link will expire in 24 hours.
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      `,
    };

    const info = await sendEmailWithRetry(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

// Send notification email to admin
const sendAdminNotification = async (newUserData) => {
  try {
    validateEmailData(newUserData);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Service Provider Registration",
      html: `
        <h2>New Service Provider Registered</h2>
        <p>Business Name: ${newUserData.businessName}</p>
        <p>Service Type: ${newUserData.serviceType}</p>
        <p>Email: ${newUserData.email}</p>
        <p>Phone: ${newUserData.phoneNumber}</p>
      `,
    };

    const info = await sendEmailWithRetry(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending admin notification:", error);
    throw error; // Re-throwing to handle it in the calling function
  }
};

// Test function
const testEmailService = async () => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Test Email",
      html: "<h1>Test Email</h1><p>This is a test email to verify the configuration</p>",
    };

    const info = await sendEmailWithRetry(mailOptions);
    console.log("Test email sent successfully:", info);
    return true;
  } catch (error) {
    console.error("Error in test email:", error);
    return false;
  }
};

// Add this to your exports
module.exports = {
  sendWelcomeEmail,
  sendAdminNotification,
  testEmailService, // Add this line
};
