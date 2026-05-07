"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/get-user-role";

export type ClassActionState = { error: string } | null;

export async function createClass(
  _prev: ClassActionState,
  formData: FormData
): Promise<ClassActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role === "student") return { error: "No autorizado" };

  const date = (formData.get("date") as string)?.trim();
  const time = (formData.get("time") as string)?.trim();
  const duration = parseInt((formData.get("duration_minutes") as string) ?? "60", 10);
  const lesson_type = (formData.get("lesson_type") as string) ?? "práctica";
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!date) return { error: "La fecha es obligatoria" };
  if (!time) return { error: "La hora es obligatoria" };
  if (isNaN(duration) || duration < 30) return { error: "La duración mínima es 30 minutos" };
  if (!["práctica", "teoría"].includes(lesson_type)) return { error: "Tipo de clase no válido" };

  const tz_offset = (formData.get("tz_offset") as string)?.trim() || "+00:00";
  const start_time = new Date(`${date}T${time}:00${tz_offset}`).toISOString();
  const student_id = (formData.get("student_id") as string)?.trim() || null;

  const supabase = await createClient();

  // Si se asigna alumno, verificar que no tiene otra clase solapada
  if (student_id) {
    const clsStart = new Date(start_time);
    const clsEnd = new Date(clsStart.getTime() + duration * 60 * 1000);

    const { data: candidates } = await supabase
      .from("classes")
      .select("id, start_time, duration_minutes")
      .eq("school_id", user.schoolId)
      .eq("student_id", student_id)
      .neq("status", "cancelled")
      .lt("start_time", clsEnd.toISOString());

    const hasOverlap = (candidates ?? []).some((c) => {
      const cEnd = new Date(new Date(c.start_time).getTime() + c.duration_minutes * 60 * 1000);
      return cEnd > clsStart;
    });

    if (hasOverlap) {
      return { error: "El alumno ya tiene una clase en ese horario" };
    }
  }

  const { error } = await supabase.from("classes").insert({
    school_id: user.schoolId,
    instructor_id: user.id,
    start_time,
    duration_minutes: duration,
    lesson_type: lesson_type as "práctica" | "teoría",
    notes,
    student_id,
    status: student_id ? "booked" : "available",
  });

  if (error) return { error: "Error al crear la clase. Inténtalo de nuevo." };

  revalidatePath("/dashboard/agenda");
  return null;
}

export async function updateClass(
  id: string,
  _prev: ClassActionState,
  formData: FormData
): Promise<ClassActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role === "student") return { error: "No autorizado" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("classes")
    .select("id")
    .eq("id", id)
    .eq("school_id", user.schoolId)
    .single();

  if (!existing) return { error: "Clase no encontrada" };

  const date = (formData.get("date") as string)?.trim();
  const time = (formData.get("time") as string)?.trim();
  const duration = parseInt((formData.get("duration_minutes") as string) ?? "60", 10);
  const lesson_type = (formData.get("lesson_type") as string) ?? "práctica";
  const notes = (formData.get("notes") as string)?.trim() || null;
  const status = (formData.get("status") as string) ?? "available";

  if (!date) return { error: "La fecha es obligatoria" };
  if (!time) return { error: "La hora es obligatoria" };
  if (isNaN(duration) || duration < 30) return { error: "La duración mínima es 30 minutos" };

  const tz_offset = (formData.get("tz_offset") as string)?.trim() || "+00:00";
  const start_time = new Date(`${date}T${time}:00${tz_offset}`).toISOString();

  const { error } = await supabase
    .from("classes")
    .update({
      start_time,
      duration_minutes: duration,
      lesson_type: lesson_type as "práctica" | "teoría",
      status: status as "available" | "booked" | "completed" | "cancelled",
      notes,
    })
    .eq("id", id);

  if (error) return { error: "Error al actualizar la clase. Inténtalo de nuevo." };

  revalidatePath("/dashboard/agenda");
  return null;
}

export async function deleteClass(id: string): Promise<ClassActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role === "student") return { error: "No autorizado" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("classes")
    .select("id")
    .eq("id", id)
    .eq("school_id", user.schoolId)
    .single();

  if (!existing) return { error: "Clase no encontrada" };

  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) return { error: "Error al eliminar la clase." };

  revalidatePath("/dashboard/agenda");
  return null;
}

export async function bookStudent(
  classId: string,
  studentId: string
): Promise<ClassActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role === "student") return { error: "No autorizado" };

  const supabase = await createClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("id, status, start_time, duration_minutes")
    .eq("id", classId)
    .eq("school_id", user.schoolId)
    .single();

  if (!cls) return { error: "Clase no encontrada" };
  if (cls.status !== "available") return { error: "La clase no está disponible" };

  // Verificar solapamiento: la nueva clase solapa con otra si empieza antes de que acabe Y acaba después de que empiece
  // Condición: existing.start_time < new.end AND existing.end > new.start
  // Supabase no tiene computed columns, así que filtramos: existing.start_time < clsEnd (la otra empieza antes de que acabe esta)
  // y existing.start_time + duration > cls.start_time (la otra acaba después de que empiece esta) — esto lo hacemos en JS
  const clsStart = new Date(cls.start_time);
  const clsEnd = new Date(clsStart.getTime() + cls.duration_minutes * 60 * 1000);

  const { data: candidates } = await supabase
    .from("classes")
    .select("id, start_time, duration_minutes")
    .eq("school_id", user.schoolId)
    .eq("student_id", studentId)
    .neq("status", "cancelled")
    .neq("id", classId)
    .lt("start_time", clsEnd.toISOString());

  const hasOverlap = (candidates ?? []).some((c) => {
    const cEnd = new Date(new Date(c.start_time).getTime() + c.duration_minutes * 60 * 1000);
    return cEnd > clsStart;
  });

  if (hasOverlap) {
    return { error: "El alumno ya tiene una clase en ese horario" };
  }

  const { error } = await supabase
    .from("classes")
    .update({ student_id: studentId, status: "booked" })
    .eq("id", classId);

  if (error) return { error: "Error al asignar el alumno." };

  revalidatePath("/dashboard/agenda");
  return null;
}

export async function unassignStudent(classId: string): Promise<ClassActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role === "student") return { error: "No autorizado" };

  const supabase = await createClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("id")
    .eq("id", classId)
    .eq("school_id", user.schoolId)
    .single();

  if (!cls) return { error: "Clase no encontrada" };

  const { error } = await supabase
    .from("classes")
    .update({ student_id: null, status: "available" })
    .eq("id", classId);

  if (error) return { error: "Error al desasignar el alumno." };

  revalidatePath("/dashboard/agenda");
  return null;
}
