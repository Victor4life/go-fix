require("dotenv").config();
const {
  sendWelcomeEmail,
  sendAdminNotification,
  sendPasswordResetEmail,
} = require("./emailService");

const TEST_EMAIL = "emekav233@gmail.com"; // Your email address

console.log("Starting email tests...");

async function runTests() {
  try {
    // Test welcome email
    console.log("\nTesting welcome email...");
    await sendWelcomeEmail(TEST_EMAIL, "Test User", "test-token-123");
    console.log("✅ Welcome email sent successfully!");

    // Test admin notification
    console.log("\nTesting admin notification...");
    await sendAdminNotification({
      email: TEST_EMAIL,
      businessName: "Test Business",
      serviceType: "Test Service",
      phoneNumber: "1234567890",
    });
    console.log("✅ Admin notification sent successfully!");

    // Test password reset
    console.log("\nTesting password reset email...");
    await sendPasswordResetEmail(TEST_EMAIL, "reset-token-123");
    console.log("✅ Password reset email sent successfully!");

    console.log("\n✅ All email tests completed successfully!");
    console.log(`Check your inbox at ${TEST_EMAIL}`);
  } catch (error) {
    console.error("\n❌ Test failed with error:", error.message);
  }
}

runTests();
