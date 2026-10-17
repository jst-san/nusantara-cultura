"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/brand/Motif";
import { cn } from "@/lib/utils";
import { playInstrument, speak, speechAvailable, stopSpeech } from "@/lib/audio";
import type { ListeningEntry } from "@/lib/types";

/**
 * Pemutar bunyi & pelafalan.
 *
 * Kejujuran teknis:
 * - Bunyi instrumen adalah SIMULASI yang dibuat aplikasi (bukan rekaman).
 * - Pelafalan memakai pembaca suara bawaan perangkat, kalau tersedia.
 *   Kalau tidak tersedia, panduan pelafalan tetap ditampilkan.
 */
export function ListeningPlayer({
  instruction,
  entries,
  onComplete,
  completeLabel = "Lanjutkan",
  requireAll = true,
  restartKey,
}: {
  instruction: string;
  entries: ListeningEntry[];
  onComplete?: () => void;
  completeLabel?: string;
  requireAll?: boolean;
  restartKey?: string;
}) {
  const [played, setPlayed] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rk, setRk] = useState(restartKey);
  const voices = speechAvailable();

  if (rk !== restartKey) {
    setRk(restartKey);
    setPlayed([]);
    setActiveId(null);
  }

  const play = (entry: ListeningEntry) => {
    setActiveId(entry.id);
    if (!played.includes(entry.id)) setPlayed((prev) => [...prev, entry.id]);
    if (entry.sound === "speech") {
      const ok = speak(entry.label);
      if (!ok) setActiveId(null);
      window.setTimeout(() => setActiveId(null), 1600);
    } else if (entry.sound && entry.sound !== "none") {
      playInstrument(entry.sound);
      window.setTimeout(() => setActiveId(null), 1800);
    }
  };

  const enough = requireAll ? played.length >= entries.length : played.length >= 1;

  return (
    <div className="space-y-4">
      <div className="panel-soft p-4">
        <p className="story-text text-[var(--ink)]">{instruction}</p>
      </div>

      <ul className="space-y-2.5">
        {entries.map((entry) => {
          const isPlayed = played.includes(entry.id);
          return (
            <li
              key={entry.id}
              className={cn(
                "rounded-[var(--radius-md)] border p-3.5 transition-all",
                activeId === entry.id
                  ? "border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_12%,transparent)]"
                  : "border-[var(--line)] bg-[var(--surface-2)]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-display text-base text-[var(--ink)]">{entry.label}</span>
                    <span className="text-xs text-[var(--ink-subtle)]">({entry.phonetics})</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{entry.meaning}</p>
                  {entry.note ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-subtle)] italic">{entry.note}</p>
                  ) : null}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  motif="gong"
                  onClick={() => play(entry)}
                  aria-label={`Dengarkan ${entry.label}`}
                  className="shrink-0"
                >
                  Dengar
                </Button>
              </div>
              {isPlayed ? (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-[var(--success)]">
                  <Motif motif="star" className="h-3.5 w-3.5" /> sudah didengar
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {!voices ? (
        <p className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
          Pembaca suara perangkat tidak tersedia di peramban ini. Gunakan panduan pelafalan di atas — cara pengucapan
          bisa berbeda antar daerah, jadi tanyakan juga kepada penutur asli kalau ada kesempatan.
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-[var(--ink-subtle)]">
        Catatan: bunyi instrumen di sini adalah simulasi yang dibuat aplikasi, bukan rekaman gamelan. Suara pelafalan
        memakai pembaca suara perangkatmu.
      </p>

      {onComplete ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="lg" motif="spiral" disabled={!enough} onClick={() => { stopSpeech(); onComplete(); }}>
            {completeLabel}
          </Button>
          {!enough ? (
            <span className="self-center text-xs text-[var(--ink-subtle)]">
              {requireAll ? "Dengarkan semua dulu, ya." : "Dengarkan salah satu untuk melanjutkan."}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** Versi ringkas untuk latihan pelafalan di dalam quest: tanpa syarat menyelesaikan semua. */
export function PronunciationPractice({ entries }: { entries: ListeningEntry[] }) {
  return (
    <ListeningPlayer
      instruction="Ketuk setiap kata untuk mendengarkan pelafalannya. Coba ikuti dengan suaramu sendiri, pelan-pelan."
      entries={entries}
      requireAll={false}
      restartKey="quest-pronunciation"
    />
  );
}
