"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/get-user-role";

export type StudentActionState = { error: string } | null;

export async function createStudent(
  _prev: StudentActionState,
  formData: FormData
): Promise<StudentActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const dni = (formData.get("dni") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!first_name) return { error: "El nombre es obligatorio" };
  if (!last_name) return { error: "Los apellidos son obligatorios" };
  if (!email) return { error: "El email es obligatorio" };

  const supabase = await createClient();
  const { error } = await supabase.from("students").insert({
    school_id: user.schoolId,
    first_name,
    last_name,
    email,
    phone,
    dni,
    notes,
    status: "active",
  });

  if (error) return { error: "Error al crear el alumno. Inténtalo de nuevo." };

  revalidatePath("/dashboard/students");
  return null;
}

export async function updateStudent(
  id: string,
  _prev: StudentActionState,
  formData: FormData
): Promise<StudentActionState> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("students")
    .select("id")
    .eq("id", id)
    .eq("school_id", user.schoolId)
    .single();

  if (!existing) return { error: "Alumno no encontrado" };

  const first_name = (formData.get("first_name") as string)?.trim();
  const last_name = (formData.get("last_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const dni = (formData.get("dni") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const status = formData.get("status") as string;

  if (!first_name) return { error: "El nombre es obligatorio" };
  if (!last_name) return { error: "Los apellidos son obligatorios" };
  if (!email) return { error: "El email es obligatorio" };

  const { error } = await supabase
    .from("students")
    .update({ first_name, last_name, email, phone, dni, notes, status })
    .eq("id", id);

  if (error) return { error: "Error al actualizar el alumno. Inténtalo de nuevo." };

  revalidatePath("/dashboard/students");
  revalidatePath(`/dashboard/students/${id}`);
  return null;
}

export async function deleteStudent(id: string): Promise<{ error: string } | void> {
  const user = await getSessionUser();
  if (!user) return { error: "No autenticado" };
  if (user.role !== "admin") return { error: "No autorizado" };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("students")
    .select("id")
    .eq("id", id)
    .eq("school_id", user.schoolId)
    .single();

  if (!existing) return { error: "Alumno no encontrado" };

  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) return { error: "Error al eliminar el alumno." };

  revalidatePath("/dashboard/students");
  redirect("/dashboard/students");
}
