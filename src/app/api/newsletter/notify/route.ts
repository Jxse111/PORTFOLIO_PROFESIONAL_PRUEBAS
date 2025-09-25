import { NextResponse } from "next/server";
import { readSubscribers } from "@/lib/storage/newsletter";
import { sendPostNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, url, summary, secret } = body || {};

    if (!secret || secret !== process.env.NEWSLETTER_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!title || !url) {
      return NextResponse.json({ ok: false, error: "Faltan campos: title y url son obligatorios" }, { status: 400 });
    }

    const subs = readSubscribers();
    const toEmails = subs.map((s) => s.email);

    if (toEmails.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: "No hay suscriptores" });
    }

    const res = await sendPostNotification(toEmails, { title, url, summary });
    if ((res as any).skipped) {
      return NextResponse.json({ ok: true, sent: 0, skipped: true, message: "SMTP no configurado" });
    }

    return NextResponse.json({ ok: true, sent: toEmails.length });
  } catch (err) {
    console.error("/api/newsletter/notify error", err);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
