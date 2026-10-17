"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/brand/Motif";
import { cn } from "@/lib/utils";

/** Daftar langkah/centang untuk quest praktik. */
export function ChecklistCard({
  instruction,
  items,
  onComplete,
  completeLabel = "Simpan langkah-langkah ini",
  restartKey,
  storageKey,
}: {
  instruction: string;
  items: { id: string; text: string }[];
  onComplete: (checked: string[]) => void;
  completeLabel?: string;
  restartKey?: string;
  storageKey?: string;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [rk, setRk] = useState(restartKey);

  if (rk !== restartKey) {
    setRk(restartKey);
    setChecked([]);
  }

  const toggle = (id: string) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-4">
      <div className="panel-soft p-4">
        <p className="story-text text-[var(--ink)]">{instruction}</p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => {
          const isChecked = checked.includes(item.id);
          return (
            <li key={item.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border p-3.5 text-sm transition-all",
                  isChecked
                    ? "border-[color-mix(in_oklab,var(--practice)_50%,transparent)] bg-[color-mix(in_oklab,var(--practice)_10%,transparent)]"
                    : "border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--line-strong)]",
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                  className="mt-0.5 h-4.5 w-4.5 shrink-0 accent-[var(--practice)]"
                  style={{ height: "1.1rem", width: "1.1rem" }}
                />
                <span className="leading-relaxed text-[var(--ink)]">{item.text}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          motif="thread"
          disabled={checked.length === 0}
          onClick={() => onComplete(checked)}
        >
          {completeLabel}
        </Button>
        <span className="text-xs text-[var(--ink-subtle)]">
          {checked.length}/{items.length} langkah ditandai
          {storageKey ? " · tersimpan di perangkatmu" : ""}
        </span>
      </div>
      {checked.length === 0 ? (
        <p className="flex items-center gap-2 text-xs text-[var(--ink-subtle)]">
          <Motif motif="leaf" className="h-3.5 w-3.5" />
          Tandai minimal satu langkah. Kamu tidak harus menyelesaikan semuanya sekarang.
        </p>
      ) : null}
    </div>
  );
}
