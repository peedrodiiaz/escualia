export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background rounded square */}
        <rect width="36" height="36" rx="10" fill="var(--brand)" />

        {/* Road path: a winding route from bottom-left to top-right */}
        <path
          d="M7 27 Q10 27 12 23 Q14 19 18 18 Q22 17 24 13 Q26 9 29 9"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.4"
        />
        {/* Road dashes (center line) */}
        <path
          d="M7 28.5 Q10 28.5 12 24.5 Q14 20.5 18 19.5 Q22 18.5 24 14.5 Q26 10.5 29 10.5"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 3"
          fill="none"
          opacity="0.3"
        />

        {/* Checkmark circle at the destination (top-right) */}
        <circle cx="26" cy="10" r="6" fill="var(--accent)" />
        <path
          d="M23.5 10 L25.2 11.8 L28.5 8.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Start dot (bottom-left) */}
        <circle cx="7" cy="27" r="2.5" fill="white" opacity="0.7" />
      </svg>

      <span
        style={{
          fontWeight: 800,
          fontSize: "1.25rem",
          letterSpacing: "-0.02em",
          color: "var(--text)",
          lineHeight: 1,
        }}
      >
        Escua<span style={{ color: "var(--brand)" }}>lia</span>
      </span>
    </div>
  );
}
