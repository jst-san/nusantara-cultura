"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip, ProgressBar } from "@/components/ui/Bits";
import { Modal, Sheet } from "@/components/ui/Overlay";
import { Motif } from "@/components/brand/Motif";
import { AudioQuickToggle } from "@/components/layout/AppShell";
import { getJournalEntry } from "@/data";
import { journalEntryIds } from "@/lib/progression";
import { useGameStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import type { Chapter, Episode } from "@/lib/types";

/**
 * Bilah atas Story Mode: keluar dengan aman, progres episode, XP, suara,
 * dan panel "Buku Catatan Tara".
 */
export function StoryHud({
  chapter,
  episode,
  visited,
  total,
  currentLabel,
  playerName,
}: {
  chapter: Chapter;
  episode: Episode;
  visited: number;
  total: number;
  currentLabel?: string;
  playerName: string;
}) {
  const router = useRouter();
  const [exitOpen, setExitOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const xp = useGameStore((s) => s.xp);
  const save = useGameStore();

  const entryIds = journalEntryIds(save).filter((id) => {
    const entry = getJournalEntry(id);
    return entry?.chapterId === chapter.id;
  });
  const reflections = save.journal.reflections.filter((r) => r.episodeId === episode.id);
  const decisions = save.decisions.filter((d) => d.episodeId === episode.id);
  const sessionHours = Math.floor(save.stats.playSeconds / 3600);

  return (
    <>
      <div className="glass sticky top-0 z-40 -mx-4 mb-4 border-x-0 border-t-0 px-4 py-2.5 sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2">
          <Button variant="ghost" size="sm" onClick={() => setExitOpen(true)} aria-label="Keluar dari cerita">
            <Motif motif="thread" className="h-4 w-4" />
            Keluar
          </Button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="eyebrow">
                Bab {chapter.index} · Episode {episode.index}/{chapter.episodes.length}
              </span>
              <span className="font-display truncate text-sm text-[var(--ink)] sm:text-base">{episode.title}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <ProgressBar value={visited} max={Math.max(1, total)} size="sm" tone="gold" className="w-36 sm:w-52" />
              <span className="hidden text-[0.68rem] text-[var(--ink-subtle)] sm:inline">
                {currentLabel ? `${currentLabel} · ` : ""}
                {visited}/{total} adegan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Chip tone="knowledge" motif="book">
              <span className="tabular-nums">{xp.knowledge} XP</span>
            </Chip>
            <Chip tone="practice" motif="thread">
              <span className="tabular-nums">{xp.practice} XP</span>
            </Chip>
            <AudioQuickToggle compact />
            <Button variant="secondary" size="sm" motif="book" onClick={() => setNotesOpen(true)}>
              Catatan
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={exitOpen}
        onClose={() => setExitOpen(false)}
        title="Keluar dari cerita?"
        description="Progresmu tersimpan otomatis di perangkat ini. Kamu bisa melanjutkan episode ini kapan saja dari titik terakhir."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setExitOpen(false)}>
              Lanjut bermain
            </Button>
            <Button variant="primary" motif="spiral" onClick={() => router.push(`/journey/${chapter.id}`)}>
              Simpan & keluar
            </Button>
          </>
        }
      >
        <div className="space-y-2 text-sm text-[var(--ink-muted)]">
          <p>
            Episode ini baru {visited} dari {total} adegan. Pilihan yang sudah kamu buat tidak akan hilang.
          </p>
          <p className="text-xs text-[var(--ink-subtle)]">
            Tidak ada pengatur waktu dan tidak ada hukuman karena berhenti — cerita menunggu, bukan mengejar.
          </p>
        </div>
      </Modal>

      <Sheet
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        title="Buku Catatan Tara"
        eyebrow={`${chapter.title} · ${episode.title}`}
      >
        <div className="space-y-6">
          <section>
            <h3 className="eyebrow">Entri jurnal dari bab ini</h3>
            {entryIds.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--ink-subtle)]">
                Belum ada entri. Entri pertama muncul setelah Tara menjumpai hal yang layak dicatat.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {entryIds.map((id) => {
                  const entry = getJournalEntry(id);
                  if (!entry) return null;
                  return (
                    <li key={id} className="panel-soft p-3.5">
                      <div className="flex items-center gap-2 text-[0.7rem] tracking-wide text-[var(--ink-subtle)] uppercase">
                        <Motif motif="lamp" className="h-3.5 w-3.5 text-[var(--gold)]" />
                        {entry.title}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-muted)]">{entry.text}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section>
            <h3 className="eyebrow">Refleksimu di episode ini</h3>
            {reflections.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--ink-subtle)]">Belum ada tulisan di episode ini.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {reflections.map((reflection) => (
                  <li key={reflection.id} className="panel-soft p-3.5">
                    <div className="text-[0.7rem] tracking-wide text-[var(--ink-subtle)] uppercase">
                      {formatDateTime(reflection.createdAt)}
                    </div>
                    <p className="mt-1 text-xs italic text-[var(--ink-subtle)]">{reflection.prompt}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink)]">{reflection.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="eyebrow">Keputusanmu di episode ini</h3>
            {decisions.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--ink-subtle)]">Belum ada keputusan tercatat di episode ini.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {decisions.slice(0, 8).map((decision) => (
                  <li key={decision.id} className="flex items-start gap-2 text-sm text-[var(--ink-muted)]">
                    <Motif motif="spiral" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
                    <span>
                      <span className="text-[var(--ink)]">{decision.answerLabel}</span>
                      <span className="block text-xs text-[var(--ink-subtle)]">{decision.question}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
            Catatan ini bagian dari cerita fiksi bersama Tara. {playerName}, semua tulisan dan pilihanmu tersimpan hanya
            di perangkat ini{sessionHours > 0 ? ` — total waktu bermain sekitar ${sessionHours} jam.` : "."}
          </p>

          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/journal" variant="secondary" motif="book">
              Buka jurnal lengkap
            </ButtonLink>
            <ButtonLink href={`/journey/${chapter.id}`} variant="ghost" motif="kawung">
              Daftar episode
            </ButtonLink>
          </div>
        </div>
      </Sheet>
    </>
  );
}
