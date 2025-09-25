import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import { addSubscriber } from "@/lib/storage/newsletter";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalized = normalizeEmail(String(email || ""));

    if (!isValidEmail(normalized)) {
      return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
    }

    const { added } = addSubscriber(normalized);
    if (!added) {
      return NextResponse.json({ ok: true, duplicated: true, message: "Ya estabas suscrito" });
    }

    return NextResponse.json({ ok: true, message: "Suscripción realizada con éxito" });
  } catch (err) {
    console.error("/api/newsletter/subscribe error", err);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
