"use server";
import nodemailer from "nodemailer";

interface MailData {
  actionByName: string;
  actionToName: string;
  match: string;
}

async function sendEmail(email: string, message: string, data: MailData) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yfw111realone@gmail.com",
        pass: process.env.EMAIL_PASS,
      },
    });

    const matchPercentage = parseFloat(data.match)
      .toString()
      .replace(/\.00$/, "");
    const matchEmoji = parseFloat(data.match) > 70 ? "😍" : "😔";
    const matchMessage =
      parseFloat(data.match) > 70
        ? `<a href="https://imageDump.vercel.app/p/${encodeURIComponent(
            data.actionByName
          )}" style="text-decoration: none; font-weight: bold;">${
            data.actionByName
          }</a> thinks you're a perfect match with a compatibility score of ${matchPercentage}%!`
        : `Oops! <a href="https://imageDump.vercel.app/p/${encodeURIComponent(
            data.actionByName
          )}" style="text-decoration: none; font-weight: bold;">${
            data.actionByName
          }</a> matched with you at ${matchPercentage}%. Better luck next time!`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.actionByName} Matched Your Profile!</title>
  <style>
    body {
      font-family: 'Comic Sans MS', sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
      text-align: center;
      color: #333333; /* Default text color */
    }
    .notification-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    h1 {
      color: #333333;
      font-size: 28px;
    }
    p {
      color: #555555;
      margin-bottom: 20px;
      font-size: 18px;
    }
    .discover-button {
      background-color: #333333;
      padding: 10px 20px;
      text-decoration: none;
      color: #ffffff;
      border-radius: 5px;
      display: inline-block;
      font-size: 16px;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      color: #777777;
      font-size: 12px;
      text-align: center;
    }
    a {
      text-decoration: none;
      font-weight: bold;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #333333; /* Dark mode background */
        color: #ffffff; /* Dark mode text color */
      }
      .notification-container {
        background-color: #444444; /* Dark mode container background */
      }
      p {
        color: #cccccc; /* Dark mode paragraph text color */
      }
      .footer {
        color: #999999; /* Dark mode footer text color */
      }
    }
  </style>
</head>
<body>
  <div class="notification-container">
    <h1>${matchPercentage}% Match! ${matchEmoji}</h1>
    <p>Hey ${data.actionToName},</p>
    <p>${matchMessage}</p>
    <a href="https://imageDump.vercel.app/discover" class="discover-button">Discover</a>
  </div>
  <div class="footer">
    <p>❤️ From imageDump</p>
  </div>
</body>
</html>
`;

    const mailOptions = {
      from: '"imageDump" <yfw111realone@gmail.com>',
      to: email,
      subject: message,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendEmail;
