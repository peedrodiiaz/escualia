import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

const LEADS_FILE = join(process.cwd(), "leads.json");

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
    const body = await req.json() as { name?: string; email?: string };
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email son obligatorios" }, { status: 400 });
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
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    leads.push(lead);
    await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
