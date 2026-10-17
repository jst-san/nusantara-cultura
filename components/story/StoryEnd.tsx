"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip, StatTile } from "@/components/ui/Bits";
import { Motif } from "@/components/brand/Motif";
import { Tara } from "@/components/brand/Tara";
import { OrnamentDivider } from "@/components/brand/Motif";
import type { Chapter, Episode } from "@/lib/types";

/* ------------------------------------------------------------------
 * Ringkasan akhir episode
 * ------------------------------------------------------------------ */

export interface EpisodeSummary {
  knowledgeXp: number;
  practiceXp: number;
  decisions: number;
  collectionFound: number;
  visited: number;
  total: number;
}

export function EpisodeResult({
  chapter,
  episode,
  summary,
  replayed,
  next,
  onReplay,
}: {
  chapter: Chapter;
  episode: Episode;
  summary: EpisodeSummary;
  replayed: boolean;
  next:
    | { episode: Episode; href: string }
    | { episode: Episode; lockedReason: string }
    | null;
  onReplay: () => void;
}) {
  const gainedNothing = summary.knowledgeXp === 0 && summary.practiceXp === 0;

  return (
    <div className="panel relative overflow-hidden">
      <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(233,185,73,0.18),transparent_65%)]" />
      <div className="hairline-top relative px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-start gap-6">
          <Tara expression="proud" className="h-28 w-28 shrink-0 drop-shadow-[0_16px_26px_rgba(0,0,0,0.5)]" idle />
          <div className="min-w-0 flex-1">
            <div className="eyebrow">
              {chapter.title} · Episode {episode.index} selesai
            </div>
            <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">{episode.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">{episode.summary}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="XP pengetahuan"
            value={`+${summary.knowledgeXp}`}
            motif="book"
            tone="knowledge"
            sub="dari cerita & tantangan"
          />
          <StatTile
            label="XP praktik"
            value={`+${summary.practiceXp}`}
            motif="thread"
            tone="practice"
            sub="dari aktivitas nyata"
          />
          <StatTile label="Keputusan" value={summary.decisions} motif="spiral" tone="default" sub="tercatat di perjalanan" />
          <StatTile
            label="Koleksi baru"
            value={summary.collectionFound}
            motif="kawung"
            tone="gold"
            sub={`${summary.visited}/${summary.total} adegan dilihat`}
          />
        </div>

        {replayed || gainedNothing ? (
          <p className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
            <Motif motif="eye" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
            {replayed
              ? "Episode ini kamu ulang. XP tidak ditambahkan lagi — tapi pilihan lain tetap bisa kamu jelajahi dan catatan baru tetap bisa ditemukan."
              : "Tidak ada XP baru di sesi ini, biasanya karena bagian yang memberi XP sudah pernah terbuka sebelumnya."}
          </p>
        ) : null}

        <OrnamentDivider motif="kawung" className="my-6" />

        <div className="flex flex-wrap items-center gap-3">
          {next && "href" in next ? (
            <ButtonLink href={next.href} variant="primary" size="lg" motif="spiral">
              Episode berikutnya: {next.episode.title}
            </ButtonLink>
          ) : null}
          {next && "lockedReason" in next ? (
            <span className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-2.5 text-xs leading-relaxed text-[var(--ink-muted)]">
              Episode berikutnya dalam bab ini: <strong className="text-[var(--ink)]">{next.episode.title}</strong>.
              Akan terbuka setelah episode ini tercatat selesai — muat ulang peta perjalanan bila belum muncul.
            </span>
          ) : null}
          {!next ? (
            <span className="text-sm text-[var(--ink-muted)]">
              Ini episode terakhir di bab ini. Bab berikutnya belum dapat dimainkan di prototipe.
            </span>
          ) : null}
          <Button variant="secondary" onClick={onReplay} motif="spiral">
            Ulangi episode ini
          </Button>
          <ButtonLink href={`/journey/${chapter.id}`} variant="ghost" motif="kawung">
            Kembali ke daftar episode
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Penutup bab
 * ------------------------------------------------------------------ */

export function ChapterEndScreen({
  chapter,
  foundCollections,
  questsUnlocked,
  achievements,
  reflections,
  onReplay,
}: {
  chapter: Chapter;
  foundCollections: number;
  questsUnlocked: number;
  achievements: number;
  reflections: number;
  onReplay: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="panel relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_100%_at_50%_0%,rgba(233,185,73,0.2),transparent_70%)]" />
        <div className="relative px-5 py-8 text-center sm:px-8">
          <span className="mx-auto flex h-24 w-24 items-center justify-center">
            <Tara expression="warm" className="h-full w-full animate-float-slow" idle />
          </span>
          <div className="eyebrow mt-4">Bab {chapter.index} selesai</div>
          <h1 className="display-title mt-2 text-3xl text-[var(--ink)] sm:text-4xl">{chapter.title}</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[var(--ink-muted)]">{chapter.subtitle}</p>
          <p className="mx-auto mt-5 max-w-2xl story-text text-[var(--ink-muted)]">
            Tara menutup buku catatannya untuk malam ini. Terima kasih sudah menemani — cerita yang kamu pilih akan
            tetap tinggal di catatannya, dan bisa kamu buka lagi kapan saja.
          </p>

          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            <Chip tone="gold" motif="kawung">
              {foundCollections} catatan koleksi dari bab ini
            </Chip>
            <Chip tone="gold" motif="star">
              {questsUnlocked} misi terbuka
            </Chip>
            <Chip tone="gold" motif="gong">
              {achievements} pencapaian
            </Chip>
            <Chip tone="gold" motif="lamp">
              {reflections} refleksi ditulis
            </Chip>
          </div>
        </div>
      </div>

      <div className="panel-soft p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Motif motif="book" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
          <div className="text-sm leading-relaxed text-[var(--ink-muted)]">
            <p className="font-medium text-[var(--ink)]">Apa yang sesungguhnya baru terjadi?</p>
            <p className="mt-1">
              Di prototipe ini, hanya Bab 1 yang dapat dimainkan sepenuhnya. Bab 2–4 masih berupa rencana episode yang
              bisa kamu lihat di peta perjalanan. Semua isi cerita ditulis untuk prototype ini — tokoh dan desa
              Candrageni adalah fiksi, sedangkan istilah budaya yang muncul diberi catatan sumber di Koleksi.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/journey" variant="primary" size="lg" motif="spiral">
          Buka peta perjalanan
        </ButtonLink>
        <ButtonLink href="/journal" variant="secondary" size="lg" motif="book">
          Baca jurnal Tara
        </ButtonLink>
        <ButtonLink href="/quests" variant="secondary" size="lg" motif="star">
          Lihat misi terbuka
        </ButtonLink>
        <Button variant="ghost" size="lg" motif="gong" onClick={onReplay}>
          Ulangi episode terakhir
        </Button>
      </div>
    </div>
  );
}
