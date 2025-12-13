import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async ({ to, subject, html }) => {
  await apiInstance.sendTransacEmail({
    sender: {
      name: "Aghakarim Hamidzada",
      email: "support@aghakarim.info",
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });
};