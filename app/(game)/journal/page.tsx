"use client";

import { useState } from "react";
import { Motif, type MotifKey } from "@/components/brand/Motif";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, EmptyState, StatTile } from "@/components/ui/Bits";
import { FilterPills } from "@/components/ui/Controls";
import { JOURNAL_ENTRIES, getChapter, getJournalEntry } from "@/data";
import { journalEntryIds } from "@/lib/progression";
import { useGameStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import type { DecisionRecord, JournalEntry } from "@/lib/types";

/* ------------------------------------------------------------------
 * Meta kecil
 * ------------------------------------------------------------------ */

type JournalTab = "tara" | "reflections" | "decisions";

const DECISION_KIND_META: Record<
  DecisionRecord["kind"],
  { label: string; motif: MotifKey; tone: "default" | "gold" | "knowledge" | "practice" | "muted" }
> = {
  choice: { label: "Pilihan cerita", motif: "spiral", tone: "gold" },
  quiz: { label: "Tantangan", motif: "book", tone: "knowledge" },
  matching: { label: "Menjodohkan", motif: "thread", tone: "knowledge" },
  ordering: { label: "Menyusun urutan", motif: "kawung", tone: "knowledge" },
  listening: { label: "Mendengar", motif: "wave", tone: "default" },
  observation: { label: "Pengamatan", motif: "eye", tone: "default" },
  reflection: { label: "Refleksi", motif: "lamp", tone: "practice" },
  quest: { label: "Misi ditandai selesai", motif: "star", tone: "practice" },
};

/** Label bab yang aman untuk catatan dari luar cerita (mis. misi). */
function chapterLabel(chapterId: string): string {
  const chapter = getChapter(chapterId);
  return chapter ? `Bab ${chapter.index} · ${chapter.title}` : "Jurnal perjalanan";
}

const TAB_BLURB: Record<JournalTab, string> = {
  tara: "Catatan yang ditulis Tara sendiri di dalam cerita. Terbuka satu per satu mengikuti kejadian yang ia alami.",
  reflections:
    "Refleksi yang kamu tuliskan saat cerita memintanya. Tersimpan hanya di perangkat ini — tidak dikirim ke mana pun dan tidak dinilai siapa pun.",
  decisions:
    "Rekam jejak pilihanmu di dalam aplikasi: opsi yang kamu ambil, tantangan yang kamu jawab, dan misi yang kamu tandai. Ini catatan keikutsertaan, bukan penilaian atas sikapmu di dunia nyata.",
};

/* ------------------------------------------------------------------
 * Halaman
 * ------------------------------------------------------------------ */

export default function JournalPage() {
  const save = useGameStore((s) => s);
  const [tab, setTab] = useState<JournalTab>("tara");

  const entries = journalEntryIds(save)
    .map((id) => getJournalEntry(id))
    .filter((entry): entry is JournalEntry => Boolean(entry));
  const reflections = [...save.journal.reflections].sort((a, b) => b.createdAt - a.createdAt);
  const decisions = [...save.decisions].sort((a, b) => b.createdAt - a.createdAt);

  const counts = {
    tara: entries.length,
    reflections: reflections.length,
    decisions: decisions.length,
  };

  return (
    <div className="space-y-6">
      {/* ---------- Kepala ---------- */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Jurnal</div>
          <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">Jurnal perjalanan Tara</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
            Tiga lapis catatan dari perjalananmu: apa yang Tara tuliskan, apa yang kamu tuliskan, dan pilihan yang kamu
            ambil di dalam cerita.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="gold" motif="book">
            {counts.tara}/{JOURNAL_ENTRIES.length} catatan Tara
          </Chip>
          {reflections.length > 0 ? (
            <Chip tone="practice" motif="spiral">
              {reflections.length} refleksimu
            </Chip>
          ) : null}
        </div>
      </header>

      {/* ---------- Statistik ---------- */}
      <section aria-label="Ringkasan jurnal" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile label="Catatan Tara" value={counts.tara} motif="book" tone="gold" sub="ditulis di dalam cerita" />
        <StatTile label="Refleksimu" value={counts.reflections} motif="spiral" tone="practice" sub="hanya di perangkat ini" />
        <StatTile label="Keputusan" value={counts.decisions} motif="thread" tone="default" sub="pilihan di dalam aplikasi" />
      </section>

      {/* ---------- Catatan kejujuran ---------- */}
      <section aria-label="Cara membaca jurnal" className="panel-soft p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Motif motif="eye" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
          <div className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
            <p className="font-medium text-[var(--ink)]">Tiga jenis catatan, tiga makna</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                <strong className="text-[var(--ink)]">Catatan Tara</strong> adalah tulisan tokoh cerita, bukan laporan
                faktual — tempatnya Tara mengakui hal yang belum ia pahami.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Refleksimu</strong> adalah tulisanmu sendiri, tersimpan di
                perangkat ini dan tidak pernah dikirim atau dinilai.
              </li>
              <li>
                <strong className="text-[var(--ink)]">Keputusan</strong> mencatat apa yang kamu pilih di dalam
                aplikasi; ini bukan rekaman perilaku nyata dan tidak bisa dibandingkan dengan pemain lain — karena
                memang tidak ada fitur semacam itu.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Tab ---------- */}
      <section aria-label="Saring jurnal" className="space-y-3">
        <FilterPills<JournalTab>
          value={tab}
          onChange={setTab}
          label="Pilih bagian jurnal"
          options={[
            { value: "tara", label: "Catatan Tara", motif: "book" },
            { value: "reflections", label: "Refleksimu", motif: "spiral" },
            { value: "decisions", label: "Keputusan", motif: "thread" },
          ]}
          counts={counts}
        />
        <p className="max-w-3xl text-xs leading-relaxed text-[var(--ink-subtle)]">{TAB_BLURB[tab]}</p>
      </section>

      {/* ---------- Catatan Tara ---------- */}
      {tab === "tara" ? (
        entries.length === 0 ? (
          <EmptyState
            motif="book"
            title="Tara belum menulis apa pun"
            body="Catatan pertama muncul setelah Tara mengalami sesuatu yang layak dikenang: kedatangan di desa, kata yang membingungkan, atau malam pertamanya di pendopo. Mulai dari episode pertama."
            action={
              <ButtonLink href="/journey" variant="primary" motif="spiral">
                Buka peta perjalanan
              </ButtonLink>
            }
          />
        ) : (
          <ol className="space-y-4">
            {entries.map((entry, index) => (
              <li key={entry.id}>
                <article className="panel relative overflow-hidden p-4 sm:p-5">
                  <Motif
                    motif="book"
                    className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 text-[var(--gold)] opacity-[0.07]"
                  />
                  <div className="relative">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="eyebrow">{chapterLabel(entry.chapterId)}</span>
                      <span className="text-xs tabular-nums text-[var(--ink-subtle)]">
                        Catatan {index + 1} dari {entries.length}
                      </span>
                    </div>
                    <h2 className="font-display mt-1.5 text-lg text-[var(--ink)]">{entry.title}</h2>
                    <p className="story-text mt-2 text-[var(--ink-muted)]">{entry.text}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )
      ) : null}

      {/* ---------- Refleksimu ---------- */}
      {tab === "reflections" ? (
        reflections.length === 0 ? (
          <EmptyState
            motif="spiral"
            title="Belum ada refleksi"
            body="Cerita kadang berhenti sejenak dan meminta pendapatmu. Saat itu terjadi, tulisanmu tersimpan di sini — dan hanya di perangkat ini."
            action={
              <ButtonLink href="/journey" variant="primary" motif="spiral">
                Lanjutkan cerita
              </ButtonLink>
            }
          />
        ) : (
          <ol className="space-y-4">
            {reflections.map((reflection) => (
              <li key={reflection.id}>
                <article className="panel p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Chip tone="practice" motif="lamp">
                      Refleksimu
                    </Chip>
                    <span className="text-xs text-[var(--ink-subtle)]">{formatDateTime(reflection.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-xs italic leading-relaxed text-[var(--ink-subtle)]">
                    {reflection.prompt}
                  </p>
                  <p className="story-text mt-2 whitespace-pre-line text-[var(--ink)]">{reflection.text}</p>
                  {reflection.chips.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {reflection.chips.map((chip) => (
                        <Chip key={chip} tone="muted">
                          {chip}
                        </Chip>
                      ))}
                    </div>
                  ) : null}
                  <p className="mt-3 border-t border-[var(--line)] pt-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
                    {chapterLabel(reflection.chapterId)} · tersimpan hanya di perangkat ini
                  </p>
                </article>
              </li>
            ))}
          </ol>
        )
      ) : null}

      {/* ---------- Keputusan ---------- */}
      {tab === "decisions" ? (
        decisions.length === 0 ? (
          <EmptyState
            motif="thread"
            title="Belum ada keputusan tercatat"
            body="Saat kamu memilih opsi di dalam cerita, menjawab tantangan, atau menandai misi selesai, catatannya muncul di sini. Tidak ada yang dinilai — ini hanya jejak perjalananmu."
            action={
              <ButtonLink href="/journey" variant="primary" motif="spiral">
                Buka peta perjalanan
              </ButtonLink>
            }
          />
        ) : (
          <ol className="space-y-3.5">
            {decisions.map((decision) => {
              const meta = DECISION_KIND_META[decision.kind];
              return (
                <li key={decision.id}>
                  <article className="panel-soft p-3.5 sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Chip tone={meta.tone} motif={meta.motif}>
                        {meta.label}
                      </Chip>
                      <span className="text-xs text-[var(--ink-subtle)]">{formatDateTime(decision.createdAt)}</span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink)]">{decision.question}</p>
                    <p className="mt-1 flex items-start gap-2 text-sm leading-relaxed text-[var(--gold-soft)]">
                      <span aria-hidden="true">→</span>
                      <span>{decision.answerLabel}</span>
                    </p>
                    <p className="mt-2 text-xs text-[var(--ink-subtle)]">{chapterLabel(decision.chapterId)}</p>
                  </article>
                </li>
              );
            })}
          </ol>
        )
      ) : null}

      {decisions.length > 0 || reflections.length > 0 ? (
        <section className="panel-soft p-4 text-xs leading-relaxed text-[var(--ink-subtle)] sm:p-5">
          Catatan: jurnal ini menyimpan paling banyak 80 keputusan terakhir dan hanya ada di perangkatmu. Tidak ada
          fitur berbagi, peringkat, atau perbandingan dengan pemain lain.
        </section>
      ) : null}
    </div>
  );
}
