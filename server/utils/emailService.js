import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
console.log("email", process.env.EMAIL);
console.log("password", process.env.EMAIL_PASSWORD);

// Function to send an email
export const sendEmail = async (to, subject, text) => {
  try {
    // Create a transporter for sending emails

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
