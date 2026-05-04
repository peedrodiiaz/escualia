import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

// NOTE: This route has no rate limiting. In production, add rate limiting via
// middleware (e.g. Upstash Ratelimit + Redis) or at the edge (Vercel WAF).
// Without it, the endpoint is vulnerable to spam and DoS attacks.

const LEADS_FILE = join(process.cwd(), "leads.json");

const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254; // RFC 5321

// Strip control characters (null bytes, CRLF injection, etc.)
function sanitizeString(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

interface Lead {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

async function readLeads(): Promise<Lead[]> {
  try {
    const content = await readFile(LEADS_FILE, "utf-8");
    return JSON.parse(content) as Lead[];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    // Reject bodies larger than 1 KB to prevent memory exhaustion
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 1024) {
      return NextResponse.json({ error: "Solicitud demasiado grande" }, { status: 413 });
    }

    const body = await req.json() as { name?: unknown; email?: unknown };

    // Type-guard: must be strings
    if (typeof body.name !== "string" || typeof body.email !== "string") {
      return NextResponse.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
    }

    const name = sanitizeString(body.name);
    const email = sanitizeString(body.email).toLowerCase();

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
    }

    if (name.length > NAME_MAX_LENGTH) {
      return NextResponse.json({ error: "El nombre es demasiado largo" }, { status: 400 });
    }

    if (email.length > EMAIL_MAX_LENGTH) {
      return NextResponse.json({ error: "El email es demasiado largo" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }

    const leads = await readLeads();

    if (leads.some((l) => l.email === email)) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 });
    }

    const lead: Lead = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    leads.push(lead);
    await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
