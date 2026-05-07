/**
 * Genera seed_questions.sql a partir del banco público de preguntas DGT tipo B.
 * Fuente: https://github.com/NiciusB/test-conducir-app (MIT License)
 *
 * Uso: npx tsx supabase/seed-questions.ts
 * Prerequisito: migración 008_tests.sql ejecutada en Supabase.
 * Resultado: supabase/seed_questions.sql — ejecutar con service_role key.
 */

import fs from "fs";
import path from "path";

const OUTPUT_FILE = path.join(__dirname, "seed_questions.sql");

const SOURCE_URL =
  "https://raw.githubusercontent.com/NiciusB/test-conducir-app/master/server/assets/questions.json";

// Formato real del JSON:
// { id, urlImagen, enunciado, respuestas: [{ id, contenido, correcta }], explicacion }
type RawAnswer = {
  id: string;
  contenido: string;
  correcta: boolean;
};

type RawQuestion = {
  id: string;
  urlImagen?: string;
  enunciado: string;
  respuestas: RawAnswer[];
  explicacion?: string;
};

function escape(str: string): string {
  return str.replace(/'/g, "''");
}

function nullable(val: string | undefined | null): string {
  if (!val) return "NULL";
  return `'${escape(val)}'`;
}

function buildInsert(q: RawQuestion, index: number): string | null {
  if (!q.enunciado || !q.respuestas || q.respuestas.length < 3) return null;

  // Garantizamos exactamente 3 opciones
  const [a, b, c] = q.respuestas.slice(0, 3);
  if (!a || !b || !c) return null;

  // Encontrar cuál es la correcta (a, b o c)
  const correctIndex = q.respuestas.slice(0, 3).findIndex((r) => r.correcta === true);
  if (correctIndex === -1) return null;
  const correctOption = (["a", "b", "c"] as const)[correctIndex];

  const externalId = q.id ?? `B_${String(index + 1).padStart(4, "0")}`;
  const imageUrl = q.urlImagen ?? null;

  return (
    `  ('${escape(externalId)}', 'B', NULL, '${escape(q.enunciado)}', ` +
    `${nullable(imageUrl)}, '${escape(a.contenido)}', '${escape(b.contenido)}', '${escape(c.contenido)}', '${correctOption}')`
  );
}

async function main() {
  console.log("Descargando preguntas DGT desde NiciusB/test-conducir-app...");

  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar el JSON`);

  const data: RawQuestion[] = await res.json();
  console.log(`  Descargadas ${data.length} preguntas`);

  const inserts: string[] = [];
  let skipped = 0;

  for (let i = 0; i < data.length; i++) {
    const insert = buildInsert(data[i], i);
    if (insert) {
      inserts.push(insert);
    } else {
      skipped++;
    }
  }

  if (inserts.length === 0) {
    console.error("No se generó ningún insert válido. Revisa el formato del JSON.");
    process.exit(1);
  }

  console.log(`Generando SQL: ${inserts.length} preguntas válidas, ${skipped} omitidas.`);

  const sql = `-- Seed: Banco de preguntas DGT tipo B
-- Fuente: github.com/NiciusB/test-conducir-app (MIT License)
-- Generado automáticamente por seed-questions.ts
-- Ejecutar con service_role key DESPUÉS de la migración 008_tests.sql
-- Idempotente: ON CONFLICT (external_id) DO NOTHING

BEGIN;

INSERT INTO public.questions (external_id, category, subcategory, text, image_url, option_a, option_b, option_c, correct_option)
VALUES
${inserts.join(",\n")}
ON CONFLICT (external_id) DO NOTHING;

COMMIT;

-- Verificar: SELECT COUNT(*) FROM public.questions WHERE category = 'B';
`;

  fs.writeFileSync(OUTPUT_FILE, sql, "utf8");
  console.log(`Archivo generado: ${OUTPUT_FILE}`);
  console.log("Siguiente paso: ejecuta seed_questions.sql en Supabase con la service_role key.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
