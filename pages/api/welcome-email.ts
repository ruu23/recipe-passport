import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  const html = `
    <div style="font-family: Arial; line-height:1.6">
      <p>This is <strong>Arwa</strong> from <strong>Recipe Passport</strong> 🍽️</p>

      <h2>Welcome${name ? `, ${name}` : ""}!</h2>

      <p>
        You’ve just joined a world of recipes from different cultures,
        stories behind every dish, and daily inspiration.
      </p>

      <p>
        Every day, I’ll send you a special recipe to discover 🌍
      </p>

      <p>Happy cooking,<br/>Arwa</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Welcome to Recipe Passport 🍲",
    html,
  });

  res.status(200).json({ success: true });
}
