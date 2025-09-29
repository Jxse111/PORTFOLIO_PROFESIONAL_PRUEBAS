import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalized = normalizeEmail(String(email || ""));

    if (!isValidEmail(normalized)) {
      return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
    }

    try {
      const response = await mailchimp.lists.addListMember(
        process.env.MAILCHIMP_AUDIENCE_ID,
        {
          email_address: normalized,
          status: "subscribed",
        }
      );

      return NextResponse.json({ ok: true, message: "Suscripción realizada con éxito" });
    } catch (mailchimpError: unknown) {
      // Si el email ya existe, considerarlo como éxito
      const error = mailchimpError as { response?: { body?: { title?: string } } };
      if (error?.response?.body?.title === "Member Exists") {
        return NextResponse.json({ ok: true, duplicated: true, message: "Ya estabas suscrito" });
      }

      console.error("Mailchimp error:", mailchimpError);
      return NextResponse.json({ ok: false, error: "Error al conectar con Mailchimp" }, { status: 500 });
    }
  } catch (err) {
    console.error("/api/newsletter/subscribe error", err);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
