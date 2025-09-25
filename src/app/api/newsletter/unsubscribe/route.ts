import { NextResponse } from "next/server";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import { readSubscribers } from "@/lib/storage/newsletter";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "newsletter.json");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const normalized = normalizeEmail(String(email || ""));
    if (!isValidEmail(normalized)) {
      return NextResponse.json({ ok: false, error: "Email inválido" }, { status: 400 });
    }
    const subs = readSubscribers();
    const filtered = subs.filter((s) => s.email !== normalized);
    if (filtered.length === subs.length) {
      return NextResponse.json({ ok: true, message: "El email no estaba suscrito" });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify({ subscribers: filtered }, null, 2));
    return NextResponse.json({ ok: true, message: "Te has dado de baja del newsletter" });
  } catch (err) {
    console.error("/api/newsletter/unsubscribe error", err);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
