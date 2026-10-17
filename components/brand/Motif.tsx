import type { JSX, SVGProps } from "react";

/**
 * Ornamen geometris terinspirasi motif Nusantara.
 *
 * Catatan desain: bentuk di sini adalah interpretasi geometris sederhana,
 * bukan reproduksi akurat motif tertentu. Dipakai sebagai penanda kategori,
 * pembatas bagian, dan elemen dekoratif — bukan klaim budaya.
 */

export type MotifKey =
  | "kawung"
  | "spiral"
  | "wave"
  | "leaf"
  | "star"
  | "gong"
  | "thread"
  | "lamp"
  | "eye"
  | "book";

interface MotifProps extends SVGProps<SVGSVGElement> {
  motif: MotifKey;
  /** ukuran kelas Tailwind, mis. "h-5 w-5" */
  className?: string;
}

function shape(motif: MotifKey): JSX.Element {
  switch (motif) {
    case "kawung":
      return (
        <g>
          <circle cx="12" cy="8" r="3.4" />
          <circle cx="12" cy="16" r="3.4" />
          <circle cx="8" cy="12" r="3.4" />
          <circle cx="16" cy="12" r="3.4" />
          <circle cx="12" cy="12" r="1.4" />
        </g>
      );
    case "spiral":
      return (
        <path d="M12 12c0-2 1.6-3.4 3.4-3.4 2.6 0 4.6 2 4.6 4.6 0 3.6-3 6.4-6.6 6.4-4.6 0-8.4-3.6-8.4-8.2 0-5.4 4.4-9.4 9.8-9.4 3.2 0 6 1.2 8 3" />
      );
    case "wave":
      return (
        <g>
          <path d="M2 9c2.6-2.6 5.4-2.6 8 0s5.4 2.6 8 0 4-2 4-2" />
          <path d="M2 14c2.6-2.6 5.4-2.6 8 0s5.4 2.6 8 0 4-2 4-2" />
          <path d="M2 19c2.6-2.6 5.4-2.6 8 0s5.4 2.6 8 0 4-2 4-2" />
        </g>
      );
    case "leaf":
      return (
        <g>
          <path d="M12 3c5 3 7 6.6 7 10.2 0 4-3 7-7 7s-7-3-7-7C5 9.6 7 6 12 3Z" />
          <path d="M12 6v14M12 10l3.4-2.2M12 14l-3.4-2.2M12 17l3.2-2" />
        </g>
      );
    case "star":
      return (
        <path d="M12 2.5l2.4 6.2 6.6.4-5.1 4.1 1.7 6.4L12 16l-5.6 3.6 1.7-6.4L3 9.1l6.6-.4L12 2.5Z" />
      );
    case "gong":
      return (
        <g>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5.6" />
          <circle cx="12" cy="12" r="2" />
        </g>
      );
    case "thread":
      return (
        <g>
          <path d="M3 7c3 0 4 5 7 5s3.4-5 6.4-5S21 12 21 12" />
          <path d="M3 17c3 0 4-5 7-5s3.4 5 6.4 5S21 12 21 12" />
          <circle cx="3" cy="7" r="1.4" />
        </g>
      );
    case "lamp":
      return (
        <g>
          <path d="M12 3c2.6 2.6 4 4.8 4 7a4 4 0 0 1-8 0c0-2.2 1.4-4.4 4-7Z" />
          <path d="M7 14h10l-1.4 6H8.4L7 14Z" />
        </g>
      );
    case "eye":
      return (
        <g>
          <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="2.8" />
        </g>
      );
    case "book":
      return (
        <g>
          <path d="M3 5.5h6a3 3 0 0 1 3 3v10a2.6 2.6 0 0 0-2.6-2.6H3v-10.4Z" />
          <path d="M21 5.5h-6a3 3 0 0 0-3 3v10a2.6 2.6 0 0 1 2.6-2.6H21V5.5Z" />
        </g>
      );
    default:
      return <circle cx="12" cy="12" r="8" />;
  }
}

export function Motif({ motif, className = "h-5 w-5", ...rest }: MotifProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shape(motif)}
    </svg>
  );
}

/** Pembatas bagian dengan ornamen di tengah. */
export function OrnamentDivider({ motif = "kawung", className = "" }: { motif?: MotifKey; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent" />
      <Motif motif={motif} className="h-4 w-4 text-[var(--gold)]" />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent" />
    </div>
  );
}

/** Latar ornamen tipis untuk panel besar. */
export function MotifField({ motif = "kawung", className = "" }: { motif?: MotifKey; className?: string }) {
  const positions = [
    { left: "4%", top: "12%" },
    { left: "78%", top: "8%" },
    { left: "46%", top: "48%" },
    { left: "12%", top: "72%" },
    { left: "88%", top: "62%" },
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {positions.map((pos, i) => (
        <Motif
          key={i}
          motif={motif}
          className="absolute h-16 w-16 text-[var(--gold)] opacity-[0.07]"
          style={pos}
        />
      ))}
    </div>
  );
}
