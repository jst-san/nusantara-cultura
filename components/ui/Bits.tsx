"use client";

import type { ReactNode } from "react";
import { cn, percent } from "@/lib/utils";
import { Motif, type MotifKey } from "@/components/brand/Motif";

/* ------------------------------------------------------------------
 * Chip, Badge, Tag
 * ------------------------------------------------------------------ */

export function Chip({
  children,
  motif,
  tone = "default",
  className,
}: {
  children: ReactNode;
  motif?: MotifKey;
  tone?: "default" | "gold" | "knowledge" | "practice" | "danger" | "success" | "muted";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "",
    gold: "border-[color-mix(in_oklab,var(--gold)_45%,transparent)] text-[var(--gold-soft)]",
    knowledge: "border-[color-mix(in_oklab,var(--knowledge)_45%,transparent)] text-[var(--knowledge)]",
    practice: "border-[color-mix(in_oklab,var(--practice)_45%,transparent)] text-[var(--practice)]",
    danger: "border-[color-mix(in_oklab,var(--danger)_45%,transparent)] text-[var(--danger)]",
    success: "border-[color-mix(in_oklab,var(--success)_45%,transparent)] text-[var(--success)]",
    muted: "text-[var(--ink-subtle)]",
  };
  return (
    <span className={cn("chip", tones[tone], className)}>
      {motif ? <Motif motif={motif} className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  );
}

export function StatusDot({ status }: { status: "locked" | "available" | "in-progress" | "completed" | "active" }) {
  const map = {
    locked: "bg-[var(--ink-subtle)]",
    available: "bg-[var(--gold)]",
    "in-progress": "bg-[var(--gold-soft)] animate-pulse-soft",
    active: "bg-[var(--knowledge)]",
    completed: "bg-[var(--success)]",
  } as const;
  return <span className={cn("inline-block h-2 w-2 rounded-full", map[status])} aria-hidden="true" />;
}

/** Lencana keandalan informasi — inti kejujuran produk. */
export function ReliabilityBadge({ reliability }: { reliability: string }) {
  const map: Record<string, { label: string; tone: "default" | "gold" | "knowledge" | "practice" | "danger" | "success" | "muted"; motif: MotifKey }> = {
    documented: { label: "Terdokumentasi umum", tone: "success", motif: "book" },
    "needs-verification": { label: "Perlu diverifikasi", tone: "gold", motif: "eye" },
    fiction: { label: "Fiksi cerita", tone: "muted", motif: "lamp" },
    "device-borrowed": { label: "Bantuan perangkat", tone: "knowledge", motif: "wave" },
  };
  const meta = map[reliability] ?? map.documented;
  return (
    <Chip tone={meta.tone} motif={meta.motif}>
      {meta.label}
    </Chip>
  );
}

/* ------------------------------------------------------------------
 * Progress
 * ------------------------------------------------------------------ */

export function ProgressBar({
  value,
  max = 100,
  label,
  tone = "gold",
  size = "md",
  showValue = false,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  tone?: "gold" | "knowledge" | "practice" | "danger" | "success";
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}) {
  const pct = percent(value, max);
  const colors: Record<string, string> = {
    gold: "from-[var(--gold-deep)] via-[var(--gold)] to-[var(--gold-soft)]",
    knowledge: "from-[#3A5FC8] via-[var(--knowledge)] to-[#CFE0FF]",
    practice: "from-[#0F7A66] via-[var(--practice)] to-[#B6F5E5]",
    danger: "from-[#8C2E24] via-[var(--danger)] to-[#FFCFC7]",
    success: "from-[#2F7D46] via-[var(--success)] to-[#D6F5DE]",
  };
  return (
    <div className={className}>
      {label ? (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-xs font-medium tracking-wide text-[var(--ink-muted)]">{label}</span>
          {showValue ? <span className="text-xs tabular-nums text-[var(--ink-subtle)]">{pct}%</span> : null}
        </div>
      ) : null}
      <div
        className={cn(
          "overflow-hidden rounded-full border border-[var(--line)] bg-[color-mix(in_oklab,var(--surface-3)_70%,transparent)]",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progres"}
      >
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out", colors[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Statistik
 * ------------------------------------------------------------------ */

export function StatTile({
  label,
  value,
  sub,
  motif,
  tone = "gold",
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  motif: MotifKey;
  tone?: "gold" | "knowledge" | "practice" | "default";
  className?: string;
}) {
  const tones: Record<string, string> = {
    gold: "text-[var(--gold)]",
    knowledge: "text-[var(--knowledge)]",
    practice: "text-[var(--practice)]",
    default: "text-[var(--ink-muted)]",
  };
  return (
    <div className={cn("panel-soft px-3.5 py-3", className)}>
      <div className="flex items-center gap-2">
        <Motif motif={motif} className={cn("h-4 w-4", tones[tone])} />
        <span className="text-[0.7rem] font-semibold tracking-wide text-[var(--ink-subtle)] uppercase">{label}</span>
      </div>
      <div className={cn("mt-1.5 font-display text-xl leading-none", tones[tone])}>{value}</div>
      {sub ? <div className="mt-1 text-xs text-[var(--ink-subtle)]">{sub}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Keadaan kosong
 * ------------------------------------------------------------------ */

export function EmptyState({
  title,
  body,
  motif = "star",
  action,
  className,
}: {
  title: string;
  body: string;
  motif?: MotifKey;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("panel flex flex-col items-center gap-3 px-6 py-10 text-center", className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-2)] text-[var(--gold)]">
        <Motif motif={motif} className="h-6 w-6" />
      </span>
      <h3 className="font-display text-lg text-[var(--ink)]">{title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-[var(--ink-muted)]">{body}</p>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Judul bagian
 * ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  motif,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  motif?: MotifKey;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <div className="flex items-center gap-2">
            {motif ? <Motif motif={motif} className="h-3.5 w-3.5 text-[var(--gold)]" /> : null}
            <span className="eyebrow">{eyebrow}</span>
          </div>
        ) : null}
        <h2 className="font-display mt-1 text-xl text-[var(--ink)] sm:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
