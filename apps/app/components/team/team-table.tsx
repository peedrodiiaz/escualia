"use client";

import { useState } from "react";
import { revokeInvitation, removeMember } from "@/app/dashboard/team/actions";
import { InviteModal } from "./invite-modal";

type Member = {
  id: string;
  user_id: string;
  role: "admin" | "instructor" | "student";
  email: string;
  created_at: string;
};

type Invitation = {
  id: string;
  email: string;
  role: "instructor" | "admin";
  status: "pending" | "accepted" | "revoked";
  expires_at: string;
  created_at: string;
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  instructor: "Instructor",
  student: "Alumno",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  instructor: "bg-blue-100 text-blue-700",
  student: "bg-gray-100 text-gray-600",
};

export function TeamTable({
  members,
  invitations,
  currentUserId,
  isAdmin,
}: {
  members: Member[];
  invitations: Invitation[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const [showInvite, setShowInvite] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const pendingInvitations = invitations.filter((i) => i.status === "pending");

  async function handleRemove(memberId: string) {
    setRemovingId(memberId);
    await removeMember(memberId);
    setRemovingId(null);
  }

  async function handleRevoke(invitationId: string) {
    setRevokingId(invitationId);
    await revokeInvitation(invitationId);
    setRevokingId(null);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          <p className="mt-1 text-sm text-gray-500">
            {members.length} {members.length === 1 ? "miembro" : "miembros"}
            {pendingInvitations.length > 0 && ` · ${pendingInvitations.length} invitación${pendingInvitations.length > 1 ? "es" : ""} pendiente${pendingInvitations.length > 1 ? "s" : ""}`}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invitar instructor
          </button>
        )}
      </div>

      {/* Miembros activos */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="divide-y divide-gray-100">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                  {member.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.email}</p>
                  <p className="text-xs text-gray-400">
                    Desde {new Date(member.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[member.role]}`}>
                  {ROLE_LABELS[member.role]}
                </span>
                {isAdmin && member.user_id !== currentUserId && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    disabled={removingId === member.id}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Eliminar del equipo"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invitaciones pendientes */}
      {pendingInvitations.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Invitaciones pendientes
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="divide-y divide-gray-100">
              {pendingInvitations.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-sm">
                      ✉️
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inv.email}</p>
                      <p className="text-xs text-gray-400">
                        Expira {new Date(inv.expires_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Pendiente
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => handleRevoke(inv.id)}
                        disabled={revokingId === inv.id}
                        className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Revocar invitación"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
