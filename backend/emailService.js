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
const sendWelcomeEmail = async (userEmail, username) => {
  try {
    if (!userEmail || !username) {
      throw new Error("Email and username are required");
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Welcome to Our Service!",
      html: `
        <h1>Welcome ${username}!</h1>
        <p>Thank you for registering with our service. We're excited to have you on board!</p>
        <p>You can now start using our platform to connect with customers.</p>
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

module.exports = {
  sendWelcomeEmail,
  sendAdminNotification,
};
