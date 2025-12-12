import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "9ddecc001@smtp-brevo.com",
        pass: process.env.BREVO_API_KEY,
      },
      tls: {
        rejectUnauthorized: false, // bəzən server self-signed sertifikatla problem olur, bunu əlavə et
      },
    });

    await transporter.sendMail({
      from: '"Notes App" <9ddecc001@smtp-brevo.com>',
      to: "hemidzade1010@gmail.com", // sınaq üçün öz emailin
      subject: "Test Email",
      text: "Hello! This is a test.",
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.log("Error:", err.message);
  }
};

test();
