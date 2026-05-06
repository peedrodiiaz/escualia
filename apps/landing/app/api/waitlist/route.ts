import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;

const ipRequests = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

function sanitize(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const entry = ipRequests.get(ip);

  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT) {
      return NextResponse.json({ error: "Demasiados intentos. Espera un momento." }, { status: 429 });
    }
    entry.count++;
  } else {
    ipRequests.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 1024) {
    return NextResponse.json({ error: "Solicitud demasiado grande" }, { status: 413 });
  }

  const body = await req.json().catch(() => null) as { name?: unknown; email?: unknown } | null;
  if (!body || typeof body.name !== "string" || typeof body.email !== "string") {
    return NextResponse.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
  }

  const name = sanitize(body.name);
  const email = sanitize(body.email).toLowerCase();

  if (!name || !email) {
    return NextResponse.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
  }
  if (name.length > NAME_MAX_LENGTH) {
    return NextResponse.json({ error: "El nombre es demasiado largo" }, { status: 400 });
  }
  if (email.length > EMAIL_MAX_LENGTH) {
    return NextResponse.json({ error: "El email es demasiado largo" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email no válido" }, { status: 400 });
  }

  const { error } = await supabase
    .from("leads")
    .insert({ name, email });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
