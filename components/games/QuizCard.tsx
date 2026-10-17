"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/brand/Motif";
import { cn } from "@/lib/utils";
import type { QuizOption } from "@/lib/types";

/**
 * Tantangan pilihan ganda dengan umpan balik edukatif.
 * Jawaban salah tidak menghukum: pemain mendapat penjelasan lalu boleh mencoba lagi.
 */
export function QuizCard({
  question,
  context,
  options,
  aftermath,
  onResolved,
  restartKey,
  onAttempt,
}: {
  question: string;
  context?: string;
  options: QuizOption[];
  aftermath?: string;
  onResolved: (correctFirstTry: boolean) => void;
  /** perubahan nilai ini mereset kartu (dipakai saat berpindah node) */
  restartKey?: string;
  onAttempt?: (correct: boolean) => void;
}) {
  const [triedIds, setTriedIds] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [key, setKey] = useState(restartKey);

  if (key !== restartKey) {
    setKey(restartKey);
    setTriedIds([]);
    setSolved(false);
    setLastFeedback(null);
  }

  const letters = ["A", "B", "C", "D", "E"];

  const handle = (option: QuizOption) => {
    if (solved) return;
    onAttempt?.(option.correct);
    setLastFeedback(option.feedback);
    if (option.correct) {
      setSolved(true);
      return;
    }
    setTriedIds((prev) => (prev.includes(option.id) ? prev : [...prev, option.id]));
  };

  const correctFirstTry = solved && triedIds.length === 0;

  return (
    <div className="space-y-4">
      <div className="panel-soft p-4">
        {context ? <p className="mb-2 text-xs leading-relaxed text-[var(--ink-subtle)]">{context}</p> : null}
        <p className="story-text text-[var(--ink)]">{question}</p>
      </div>

      <ul className="space-y-2.5" role="list">
        {options.map((option, index) => {
          const tried = triedIds.includes(option.id);
          const isSolvedOption = solved && option.correct;
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={solved || tried}
                aria-pressed={isSolvedOption}
                onClick={() => handle(option)}
                className={cn(
                  "focus-ring flex w-full items-start gap-3 rounded-[var(--radius-md)] border p-3.5 text-left transition-all",
                  "disabled:cursor-default",
                  isSolvedOption
                    ? "border-[color-mix(in_oklab,var(--success)_65%,transparent)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)]"
                    : tried
                      ? "border-[color-mix(in_oklab,var(--warning)_40%,transparent)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] opacity-70"
                      : "border-[var(--line)] bg-[var(--surface-2)] hover:-translate-y-[1px] hover:border-[var(--gold)]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    isSolvedOption
                      ? "border-[var(--success)] text-[var(--success)]"
                      : "border-[var(--line-strong)] text-[var(--ink-muted)]",
                  )}
                >
                  {isSolvedOption ? <Motif motif="star" className="h-4 w-4" /> : letters[index]}
                </span>
                <span className="text-sm leading-relaxed text-[var(--ink)]">{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {lastFeedback ? (
        <div
          className={cn(
            "animate-rise rounded-[var(--radius-md)] border p-4",
            solved
              ? "border-[color-mix(in_oklab,var(--success)_45%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)]"
              : "border-[color-mix(in_oklab,var(--gold)_45%,transparent)] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)]",
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <Motif motif={solved ? "star" : "eye"} className="h-4 w-4 text-[var(--gold)]" />
            <span className="text-xs font-semibold tracking-wide text-[var(--ink-muted)] uppercase">
              {solved ? "Penjelasan" : "Belum tepat — ini konteksnya"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{lastFeedback}</p>
          {!solved ? <p className="mt-2 text-xs text-[var(--ink-subtle)]">Kamu boleh mencoba pilihan lain.</p> : null}
        </div>
      ) : null}

      {solved ? (
        <div className="space-y-3">
          {aftermath ? <p className="story-text text-[var(--ink-muted)] italic">{aftermath}</p> : null}
          <Button variant="primary" size="lg" onClick={() => onResolved(correctFirstTry)} motif="spiral">
            Lanjutkan cerita
          </Button>
        </div>
      ) : null}
    </div>
  );
}
