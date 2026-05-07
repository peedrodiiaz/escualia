import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;

function sanitize(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

export async function POST(req: NextRequest) {
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

  // Rate limiting global basado en Supabase (funciona en serverless).
  // Rechaza si se recibieron más de 20 registros en el último minuto.
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { count: recentCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneMinuteAgo);

  if (recentCount !== null && recentCount >= 20) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Espera un momento." }, { status: 429 });
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
