"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/brand/Motif";
import { cn, seededShuffle } from "@/lib/utils";
import type { OrderItem } from "@/lib/types";

/** Latihan menyusun urutan dengan tombol (mudah dipakai di ponsel & keyboard). */
export function OrderingGame({
  instruction,
  items,
  correctOrder,
  caveat,
  onComplete,
  seed,
  restartKey,
}: {
  instruction: string;
  items: OrderItem[];
  correctOrder: string[];
  caveat?: string;
  onComplete: () => void;
  seed: string;
  restartKey?: string;
}) {
  const initial = useMemo(() => {
    const shuffled = seededShuffle(items, `${seed}-order`);
    // hindari urutan yang sudah benar sejak awal
    if (shuffled.map((i) => i.id).join("|") === correctOrder.join("|") && shuffled.length > 1) {
      return [...shuffled].reverse();
    }
    return shuffled;
  }, [items, correctOrder, seed]);

  const [order, setOrder] = useState<OrderItem[]>(initial);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [rk, setRk] = useState(restartKey);

  if (rk !== restartKey) {
    setRk(restartKey);
    setOrder(initial);
    setChecked(false);
    setShowHint(false);
    setAttempts(0);
  }

  const move = (index: number, direction: -1 | 1) => {
    const next = [...order];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setChecked(false);
  };

  const isCorrectAt = (itemId: string, index: number) => correctOrder[index] === itemId;
  const solved = checked && order.every((item, index) => isCorrectAt(item.id, index));

  return (
    <div className="space-y-4">
      <div className="panel-soft p-4">
        <p className="story-text text-[var(--ink)]">{instruction}</p>
        {attempts > 0 ? (
          <p className="mt-2 text-xs text-[var(--ink-subtle)]">
            Percobaan ke-{attempts}. Menyusun ulang adalah bagian dari belajar, bukan tanda gagal.
          </p>
        ) : null}
      </div>

      <ol className="space-y-2">
        {order.map((item, index) => {
          const correct = checked && isCorrectAt(item.id, index);
          const incorrect = checked && !isCorrectAt(item.id, index);
          return (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-sm)] border p-2.5 transition-all",
                correct
                  ? "border-[color-mix(in_oklab,var(--success)_55%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)]"
                  : incorrect
                    ? "border-[color-mix(in_oklab,var(--warning)_55%,transparent)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)]"
                    : "border-[var(--line)] bg-[var(--surface-2)]",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-xs font-semibold text-[var(--ink-muted)] tabular-nums">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--ink)]">{item.text}</span>
              <span className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Naikkan: ${item.text}`}
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--ink-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  aria-label={`Turunkan: ${item.text}`}
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--ink-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-30"
                >
                  ▼
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      {showHint ? (
        <div className="animate-rise rounded-[var(--radius-sm)] border border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-[color-mix(in_oklab,var(--gold)_8%,transparent)] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--gold-soft)] uppercase">
            <Motif motif="eye" className="h-4 w-4" />
            Petunjuk
          </div>
          <ol className="mt-2 space-y-1 text-sm text-[var(--ink-muted)]">
            {correctOrder.map((id, i) => {
              const item = items.find((entry) => entry.id === id);
              return (
                <li key={id}>
                  {i + 1}. {item?.text}
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {caveat ? (
        <p className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
          {caveat}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {!solved ? (
          <Button
            variant="secondary"
            onClick={() => {
              setChecked(true);
              setAttempts((a) => a + 1);
            }}
          >
            Periksa urutan
          </Button>
        ) : null}
        {!solved && attempts >= 2 && !showHint ? (
          <Button variant="ghost" onClick={() => setShowHint(true)} motif="eye">
            Tampilkan urutan yang disarankan
          </Button>
        ) : null}
        {solved ? (
          <Button variant="primary" size="lg" motif="spiral" onClick={onComplete}>
            Lanjutkan
          </Button>
        ) : null}
      </div>

      {checked && !solved ? (
        <p className="text-sm text-[var(--ink-muted)]">
          Tanda merah berarti posisinya belum tepat. Coba geser satu langkah dan periksa lagi.
        </p>
      ) : null}
      {solved ? (
        <p className="flex items-center gap-2 text-sm text-[var(--success)]">
          <Motif motif="star" className="h-4 w-4" /> Urutannya sudah tepat.
        </p>
      ) : null}
    </div>
  );
}
