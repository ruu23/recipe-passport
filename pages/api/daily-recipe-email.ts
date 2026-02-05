import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase/client";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler() {
  // 1️⃣ get random recipe
  const { data: recipes } = await supabase
    .from("recipes")
    .select("id, name, description")
    .order("random()")
    .limit(1);


  if (!recipes?.length) return;

  const recipe = recipes[0];

  // 2️⃣ get users
  const { data: users } = await supabase
    .from("profiles")
    .select("email");

  if (!users?.length) return;

  // 3️⃣ send emails
  for (const user of users) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Today's Recipe: ${recipe.name} 🍲`,
      html: `
        <p>This is <strong>Arwa</strong> from <strong>Recipe Passport</strong> 🌍</p>

        <h2>${recipe.name}</h2>
        <p>${recipe.description ?? ""}</p>

        <p>
          Discover today’s recipe and explore its story inside the app.
        </p>

        <p>Warm wishes,<br/>Arwa</p>
      `,
    });
  }
}
