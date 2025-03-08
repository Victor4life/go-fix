require("dotenv").config();
const { testEmailService } = require("./emailService");

console.log("Starting email test...");

testEmailService()
  .then((result) => {
    console.log("Test result:", result);
    if (result) {
      console.log(
        "✅ Email test successful! Check your inbox at emekav233@gmail.com"
      );
    } else {
      console.log("❌ Email test failed. Check the error messages above.");
    }
  })
  .catch((error) => {
    console.error("Test failed with error:", error);
  });
