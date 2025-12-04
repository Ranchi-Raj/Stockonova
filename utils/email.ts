import nodemailer from "nodemailer";

// Create Nodemailer SMTP transport for Amazon SES
const transporter = nodemailer.createTransport({
  host: "email-smtp.ap-south-1.amazonaws.com", // SES SMTP endpoint
  port: 587,                                   // or 587 (TLS)
  secure: false,                                // true for port 465
  auth: {
    user: process.env.SES_USER!,               // your SMTP username
    pass: process.env.SES_PASS!,               // your SMTP password
  },
});

export async function sendMail({
  to, subject, text
}: {
    to: string;
    subject: string;
    text: string;
}
) {
  const mailOptions = {
    from: "adhinsasidharofficial@gmail.com",   // must be a verified SES email
    to,
    subject,
    text
    // subject: "Test email via Amazon SES (SMTP)",
    // text: "Hello! Email sent successfully using SES SMTP and Nodemailer.",
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Mail sent:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
