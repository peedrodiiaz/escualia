import Image from "next/image";

interface LogoProps {
  className?: string;
  height?: number;
}

export function Logo({ className = "", height = 36 }: LogoProps) {
  const iconSize = Math.round(height * 0.92);

  return (
    <div className={`flex items-center gap-2.5 ${className}`} aria-label="Escualia">
      <Image
        src="/logo.png"
        alt=""
        width={iconSize}
        height={iconSize}
        style={{ objectFit: "contain" }}
        aria-hidden="true"
        priority
      />
      <span
        style={{
          fontWeight: 800,
          fontSize: Math.round(height * 0.56),
          letterSpacing: "-0.02em",
          color: "#1B2D5B",
          lineHeight: 1,
        }}
      >
        Escualia
      </span>
    </div>
  );
}
