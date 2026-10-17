"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/brand/Motif";
import { cn, seededShuffle } from "@/lib/utils";
import type { MatchPair } from "@/lib/types";

/** Latihan mencocokkan istilah dengan maknanya. */
export function MatchingGame({
  instruction,
  pairs,
  caveat,
  onComplete,
  seed,
  restartKey,
}: {
  instruction: string;
  pairs: MatchPair[];
  caveat?: string;
  onComplete: () => void;
  seed: string;
  /** perubahan nilai ini mereset permainan */
  restartKey?: string;
}) {
  const shuffledRight = useMemo(
    () => seededShuffle(pairs, `${seed}-right`),
    [pairs, seed],
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [rk, setRk] = useState(restartKey);

  if (rk !== restartKey) {
    setRk(restartKey);
    setSelectedLeft(null);
    setMatched([]);
    setWrong(null);
    setAttempts(0);
  }

  const done = matched.length === pairs.length;

  const handleRight = (rightId: string) => {
    if (!selectedLeft || done) return;
    setAttempts((a) => a + 1);
    if (selectedLeft === rightId) {
      setMatched((prev) => [...prev, rightId]);
      setSelectedLeft(null);
      setWrong(null);
    } else {
      setWrong(rightId);
      window.setTimeout(() => setWrong(null), 900);
    }
  };

  return (
    <div className="space-y-4">
      <div className="panel-soft p-4">
        <p className="story-text text-[var(--ink)]">{instruction}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--ink-subtle)]">
          <span className="tabular-nums">
            {matched.length}/{pairs.length} cocok
          </span>
          <span>·</span>
          <span className="tabular-nums">{attempts} percobaan</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="eyebrow mb-2">Istilah</div>
          <ul className="space-y-2">
            {pairs.map((pair) => {
              const isMatched = matched.includes(pair.id);
              const isSelected = selectedLeft === pair.id;
              return (
                <li key={pair.id}>
                  <button
                    type="button"
                    disabled={isMatched}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedLeft(isSelected ? null : pair.id)}
                    className={cn(
                      "focus-ring w-full rounded-[var(--radius-sm)] border px-3.5 py-3 text-left text-sm transition-all",
                      isMatched
                        ? "border-[color-mix(in_oklab,var(--success)_50%,transparent)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-[var(--ink-muted)]"
                        : isSelected
                          ? "border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] text-[var(--ink)]"
                          : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink)] hover:border-[var(--gold)]",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span>{pair.left}</span>
                      {isMatched ? <Motif motif="star" className="h-4 w-4 text-[var(--success)]" /> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-2">Makna</div>
          <ul className="space-y-2">
            {shuffledRight.map((pair) => {
              const isMatched = matched.includes(pair.id);
              return (
                <li key={pair.id}>
                  <button
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleRight(pair.id)}
                    className={cn(
                      "focus-ring w-full rounded-[var(--radius-sm)] border px-3.5 py-3 text-left text-sm transition-all",
                      isMatched
                        ? "border-[color-mix(in_oklab,var(--success)_50%,transparent)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-[var(--ink-muted)]"
                        : wrong === pair.id
                          ? "animate-rise border-[color-mix(in_oklab,var(--warning)_60%,transparent)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]"
                          : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-muted)] hover:border-[var(--gold)] hover:text-[var(--ink)]",
                    )}
                  >
                    {pair.right}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {matched.length > 0 ? (
        <ul className="space-y-2">
          {pairs
            .filter((pair) => matched.includes(pair.id) && pair.note)
            .map((pair) => (
              <li
                key={pair.id}
                className="animate-rise rounded-[var(--radius-sm)] border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_8%,transparent)] p-3 text-sm"
              >
                <span className="font-medium text-[var(--ink)]">{pair.left}: </span>
                <span className="text-[var(--ink-muted)]">{pair.note}</span>
              </li>
            ))}
        </ul>
      ) : null}

      {caveat ? (
        <p className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
          {caveat}
        </p>
      ) : null}

      {done ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-[var(--success)]">
            <Motif motif="star" className="h-4 w-4" />
            Semua pasangan sudah cocok.
          </div>
          <Button variant="primary" size="lg" motif="spiral" onClick={onComplete}>
            Lanjutkan
          </Button>
        </div>
      ) : null}
    </div>
  );
}
