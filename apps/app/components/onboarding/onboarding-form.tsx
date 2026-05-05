"use client";

import { useActionState } from "react";
import { createSchool } from "@/app/onboarding/actions";
import { Building2 } from "lucide-react";

export function OnboardingForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(createSchool, null);

  return (
    <form
      action={action}
      className="rounded-xl p-8"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <input type="hidden" name="userId" value={userId} />

      <div className="mb-6">
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text)" }}
        >
          Nombre de tu autoescuela
        </label>
        <div className="relative">
          <Building2
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-subtle)" }}
          />
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Autoescuela García"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none"
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
        {state?.error && (
          <p className="mt-2 text-xs" style={{ color: "var(--error, #ef4444)" }}>
            {state.error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
        style={{ background: "var(--brand)", color: "#fff" }}
      >
        {pending ? "Creando..." : "Crear mi espacio de trabajo"}
      </button>
    </form>
  );
}
