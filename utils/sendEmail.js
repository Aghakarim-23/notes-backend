// import Brevo from "@getbrevo/brevo";

// const apiInstance = new Brevo.TransactionalEmailsApi();
// apiInstance.setApiKey(
//   Brevo.TransactionalEmailsApiApiKeys.apiKey,
//   process.env.BREVO_API_KEY
// );

// export const sendEmail = async ({ to, subject, html }) => {
//   await apiInstance.sendTransacEmail({
//     sender: {
//       name: "Aghakarim Hamidzada",
//       email: "support@aghakarim.info",
//     },
//     to: [{ email: to }],
//     subject,
//     htmlContent: html,
//   });
// };


// import Brevo from "@getbrevo/brevo";

// const config = new Brevo.Configuration({
//   apiKey: process.env.BREVO_API_KEY,
// });

// const apiInstance = new Brevo.TransactionalEmailsApi(config);

// export const sendEmail = async ({ to, subject, html }) => {
//   await apiInstance.sendTransacEmail({
//     sender: {
//       name: "Aghakarim Hamidzada",
//       email: "support@aghakarim.info",
//     },
//     to: [{ email: to }],
//     subject,
//     htmlContent: html,
//   });
// };

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Aghakarim Hamidzada", email: "support@aghakarim.info" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Brevo email error:", error.response?.data || error.message);
    throw error;
  }
};

