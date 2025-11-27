const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Initialize client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, html }) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: { name: "Homes & Land Goa", email: "info@homesandlandgoa.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent to ${to} successfully via Brevo`);
  } catch (error) {
    console.error("❌ Failed to send email via Brevo:", error);
  }
};

module.exports = sendEmail;
