import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

const requiredFields = [
  "name",
  "email",
  "eventDate",
  "eventType",
  "streetAddress",
  "city",
  "state",
  "zipCode",
  "country",
  "numberOfPeople",
  "budget",
  "cateringDetails"
];

const clean = (value: unknown) => String(value ?? "").trim();

export const POST: APIRoute = async ({ request }) => {
  const smtpHost = import.meta.env.SMTP_HOST;
  const smtpPort = Number(import.meta.env.SMTP_PORT || "587");
  const smtpUser = import.meta.env.SMTP_USER;
  const smtpPass = import.meta.env.SMTP_PASS;
  const emailFrom = import.meta.env.CATERING_EMAIL_FROM || smtpUser;
  const emailTo = import.meta.env.CATERING_EMAIL_TO;

  if (!smtpHost || !smtpUser || !smtpPass || !emailTo || !emailFrom) {
    return new Response(JSON.stringify({ error: "Missing SMTP configuration." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON payload." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  for (const field of requiredFields) {
    if (!clean(body[field])) {
      return new Response(JSON.stringify({ error: `Missing required field: ${field}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass }
  });

  const lines = [
    `Name: ${clean(body.name)}`,
    `Email: ${clean(body.email)}`,
    `Event Date: ${clean(body.eventDate)}`,
    `Type of Event: ${clean(body.eventType)}`,
    "",
    "Event Address:",
    `Street Address: ${clean(body.streetAddress)}`,
    `Address Line 2: ${clean(body.addressLine2)}`,
    `City: ${clean(body.city)}`,
    `State: ${clean(body.state)}`,
    `Zip Code: ${clean(body.zipCode)}`,
    `Country: ${clean(body.country)}`,
    "",
    `Number of People: ${clean(body.numberOfPeople)}`,
    `Budget: ${clean(body.budget)}`,
    "",
    "What would you like to have for your catering?",
    clean(body.cateringDetails),
    "",
    "Messages & Requests:",
    clean(body.messages)
  ];

  await transporter.sendMail({
    from: emailFrom,
    to: emailTo,
    replyTo: clean(body.email),
    subject: `New Catering Request - ${clean(body.name)}`,
    text: lines.join("\n")
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
