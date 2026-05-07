"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar";
import type { SessionUser } from "@/lib/auth/get-user-role";

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — visible on lg+ */}
      <div className="hidden lg:block shrink-0">
        <Sidebar user={user} />
      </div>

      {/* Mobile: backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile: slide-in drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 lg:hidden"
        style={{
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Sidebar user={user} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center justify-between px-4 shrink-0"
          style={{
            height: 52,
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-sidebar)",
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className="rounded-lg p-1.5"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <Menu size={20} />
          </button>

          {/* Logo centrado en mobile */}
          <div className="flex items-center gap-2" aria-label="Escualia">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
            <span style={{ color: "white", fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>
              Escualia
            </span>
          </div>

          {/* Spacer para centrado */}
          <div style={{ width: 32 }} />
        </div>

        {/* Page content */}
        <main
          className="flex-1 overflow-auto"
          style={{ background: "var(--bg-subtle)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
