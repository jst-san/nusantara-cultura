"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { playSfx } from "@/lib/audio";
import { Motif, type MotifKey } from "@/components/brand/Motif";

/* ------------------------------------------------------------------
 * Saklar
 * ------------------------------------------------------------------ */

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <label htmlFor={id} className={cn("text-sm font-medium text-[var(--ink)]", disabled && "opacity-50")}>
          {label}
        </label>
        {description ? <p className="mt-0.5 text-xs leading-relaxed text-[var(--ink-subtle)]">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => {
          playSfx("select");
          onChange(!checked);
        }}
        className={cn(
          "focus-ring relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors",
          checked
            ? "border-[color-mix(in_oklab,var(--gold)_60%,transparent)] bg-[color-mix(in_oklab,var(--gold)_38%,transparent)]"
            : "border-[var(--line-strong)] bg-[var(--surface-3)]",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4.5 w-4.5 rounded-full bg-[var(--ink)] transition-all",
            checked ? "left-[1.45rem] bg-[var(--gold-soft)]" : "left-0.5 bg-[var(--ink-subtle)]",
          )}
          style={{ height: "1.1rem", width: "1.1rem" }}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Slider
 * ------------------------------------------------------------------ */

export function Slider({
  value,
  onChange,
  label,
  min = 0,
  max = 1,
  step = 0.05,
  disabled,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className={cn("py-2.5", disabled && "opacity-50")}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-[var(--ink)]">
          {label}
        </label>
        <span className="text-xs tabular-nums text-[var(--ink-subtle)]">{Math.round(value * 100)}%</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-3)] accent-[var(--gold)]"
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Pilihan tersegmentasi
 * ------------------------------------------------------------------ */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: string; description?: string }[];
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              playSfx("select");
              onChange(option.value);
            }}
            title={option.description}
            className={cn(
              "focus-ring rounded-full border transition-all",
              size === "sm" ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
              active
                ? "border-[color-mix(in_oklab,var(--gold)_60%,transparent)] bg-[color-mix(in_oklab,var(--gold)_18%,transparent)] text-[var(--gold-soft)]"
                : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Filter pill dengan ikon
 * ------------------------------------------------------------------ */

export function FilterPills<T extends string>({
  value,
  onChange,
  options,
  label,
  counts,
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: string; motif?: MotifKey }[];
  label: string;
  counts?: Partial<Record<T, number>>;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value;
        const count = counts?.[option.value];
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => {
              playSfx("select");
              onChange(option.value);
            }}
            className={cn(
              "focus-ring inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all",
              active
                ? "border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] text-[var(--gold-soft)]"
                : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-muted)] hover:text-[var(--ink)]",
            )}
          >
            {option.motif ? <Motif motif={option.motif} className="h-4 w-4" /> : null}
            <span>{option.label}</span>
            {typeof count === "number" ? (
              <span className="rounded-full bg-[color-mix(in_oklab,var(--surface-3)_80%,transparent)] px-1.5 text-[0.7rem] tabular-nums text-[var(--ink-subtle)]">
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Input teks
 * ------------------------------------------------------------------ */

const FIELD_CLASS =
  "w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[color-mix(in_oklab,var(--surface-2)_80%,transparent)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-subtle)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--gold)_35%,transparent)]";

export function TextField({
  label,
  hint,
  error,
  className,
  ...rest
}: { label: string; hint?: string; error?: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
        {label}
      </label>
      <input id={id} className={FIELD_CLASS} aria-describedby={hint ? `${id}-hint` : undefined} {...rest} />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-[var(--ink-subtle)]">
          {hint}
        </p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}

export function TextArea({
  label,
  hint,
  counter,
  className,
  ...rest
}: {
  label: string;
  hint?: string;
  counter?: ReactNode;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-[var(--ink)]">
          {label}
        </label>
        {counter}
      </div>
      <textarea id={id} className={cn(FIELD_CLASS, "min-h-28 resize-y leading-relaxed")} {...rest} />
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-subtle)]">{hint}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------
 * Kartu umum
 * ------------------------------------------------------------------ */

export function Card({
  children,
  className,
  interactive,
  motif,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  motif?: MotifKey;
  as?: "div" | "li" | "article" | "section";
}) {
  return (
    <Tag
      className={cn(
        "panel relative overflow-hidden p-4 sm:p-5",
        interactive && "transition-all hover:-translate-y-0.5 hover:border-[var(--line-strong)]",
        className,
      )}
    >
      {motif ? (
        <Motif motif={motif} className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 text-[var(--gold)] opacity-[0.08]" />
      ) : null}
      {children}
    </Tag>
  );
}
