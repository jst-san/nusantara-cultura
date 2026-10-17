"use client";

import { Backdrop } from "@/components/brand/Backdrop";
import { Motif } from "@/components/brand/Motif";
import { Tara } from "@/components/brand/Tara";
import { ReliabilityBadge, Chip, ProgressBar, StatTile, EmptyState } from "@/components/ui/Bits";
import { ButtonLink } from "@/components/ui/Button";
import { getChapter, getEpisode } from "@/data";
import {
  counts,
  levelFromSave,
  latestJournalEntry,
  recommendation,
  recentCollection,
  resumeTarget,
  taraMood,
  taraMoodLabel,
  visibleQuestViews,
} from "@/lib/progression";
import { useGameStore } from "@/lib/store";
import { useMotionEnabled } from "@/lib/hooks";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const save = useGameStore();
  const motionOn = useMotionEnabled();

  const level = levelFromSave(save);
  const stats = counts(save);
  const resume = resumeTarget(save);
  const tip = recommendation(save);
  const quests = visibleQuestViews(save);
  const activeQuests = quests.filter((view) => view.status === "active").slice(0, 2);
  const availableQuests = quests.filter((view) => view.status === "available").slice(0, 2);
  const shownQuests = activeQuests.length > 0 ? activeQuests : availableQuests;
  const collection = recentCollection(save, 3);
  const journalEntry = latestJournalEntry(save);
  const mood = taraMood(save);
  const levelPercent = Math.round((level.episodesIntoLevel / level.episodesForLevel) * 100);

  const resumeChapter = resume ? (getChapter(resume.chapter.id) ?? resume.chapter) : null;
  const resumeEpisode = resume ? (getEpisode(resume.chapter.id, resume.episode.id) ?? resume.episode) : null;

  return (
    <div className="space-y-6">
      {/* ---------- Salam ---------- */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Beranda</div>
          <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">
            Halo, {save.player.name}.
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-[var(--ink-muted)]">
            <Motif motif="kawung" className="h-4 w-4 text-[var(--gold)]" />
            {taraMoodLabel(save)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="gold" motif="star">
            Level {level.level} · {level.title}
          </Chip>
          <Chip tone="knowledge" motif="book">
            {save.xp.knowledge} XP pengetahuan
          </Chip>
          <Chip tone="practice" motif="thread">
            {save.xp.practice} XP praktik
          </Chip>
        </div>
      </header>

      {/* ---------- Lanjutkan cerita + ringkasan ---------- */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.section
          aria-label="Lanjutkan cerita"
          className="panel relative overflow-hidden"
          initial={motionOn ? { opacity: 0, y: 14 } : { opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionOn ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 opacity-70">
            <Backdrop scene={resumeEpisode?.scene ?? "village_square"} />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--surface)_94%,transparent)_18%,color-mix(in_oklab,var(--surface)_55%,transparent))]" />
          </div>
          <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:p-6">
            <Tara expression={mood} className="h-28 w-28 shrink-0 drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]" idle />
            <div className="min-w-0 flex-1">
              {resumeChapter && resumeEpisode ? (
                <>
                  <div className="eyebrow">
                    {resumeChapter.title} · Episode {resumeEpisode.index}
                  </div>
                  <h2 className="font-display mt-1 text-xl text-[var(--ink)] sm:text-2xl">{resumeEpisode.title}</h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--ink-muted)]">
                    {resumeEpisode.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <ButtonLink
                      href={`/play/${resumeChapter.id}/${resumeEpisode.id}`}
                      variant="primary"
                      size="lg"
                      motif="lamp"
                    >
                      {save.completedEpisodes.length === 0 ? "Mulai episode pertama" : "Lanjutkan cerita"}
                    </ButtonLink>
                    <ButtonLink href={`/journey/${resumeChapter.id}`} variant="secondary" motif="spiral">
                      Daftar episode
                    </ButtonLink>
                  </div>
                </>
              ) : (
                <>
                  <div className="eyebrow">Semua episode tersedia sudah selesai</div>
                  <h2 className="font-display mt-1 text-xl text-[var(--ink)] sm:text-2xl">
                    Bab 1 tamat — bab berikutnya masih rencana
                  </h2>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--ink-muted)]">
                    Kamu sudah menyelesaikan seluruh konten yang dapat dimainkan di prototipe ini. Lihat peta perjalanan
                    untuk membaca rencana Bab 2–4, atau buka kembali koleksi dan jurnalmu.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <ButtonLink href="/journey" variant="primary" size="lg" motif="spiral">
                      Buka peta perjalanan
                    </ButtonLink>
                    <ButtonLink href="/collection" variant="secondary" motif="kawung">
                      Buka koleksi
                    </ButtonLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.section>

        <div className="space-y-4">
          <div className="panel p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <div className="eyebrow">Perkembangan Tara</div>
              <span className="text-xs tabular-nums text-[var(--ink-subtle)]">
                {save.completedEpisodes.length}/{stats.episodesTotal} episode
              </span>
            </div>
            <p className="font-display mt-1.5 text-lg text-[var(--ink)]">{level.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">{level.blurb}</p>
            <ProgressBar
              value={levelPercent}
              label={level.nextTitle ? `Menuju: ${level.nextTitle}` : "Tingkat tertinggi"}
              tone="gold"
              className="mt-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Koleksi"
              value={`${stats.collectionFound}/${stats.collectionTotal}`}
              motif="kawung"
              tone="gold"
              sub={stats.fragments > 0 ? `${stats.fragments} perlu diverifikasi` : "catatan perjalanan"}
            />
            <StatTile
              label="Misi"
              value={`${stats.questsCompleted}/${stats.questsTotal}`}
              motif="star"
              tone="default"
              sub={stats.questsActive > 0 ? `${stats.questsActive} sedang berjalan` : "belum ada yang berjalan"}
            />
            <StatTile
              label="Pencapaian"
              value={`${stats.achievementsUnlocked}/${stats.achievementsTotal}`}
              motif="gong"
              tone="gold"
              sub="dari aktivitas di aplikasi"
            />
            <StatTile
              label="Praktik"
              value={`${stats.practiceCompleted}/${stats.practiceTotal}`}
              motif="thread"
              tone="practice"
              sub="latihan nyata dilaporkan"
            />
          </div>
        </div>
      </div>

      {/* ---------- Satu rekomendasi ---------- */}
      <section aria-label="Saran berikutnya" className="panel-soft flex flex-wrap items-center gap-4 p-4 sm:p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--gold)_45%,transparent)] bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] text-[var(--gold)]">
          <Motif motif="eye" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="eyebrow">{tip.eyebrow}</div>
          <h2 className="font-display mt-0.5 text-lg text-[var(--ink)]">{tip.title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[var(--ink-muted)]">{tip.body}</p>
        </div>
        <ButtonLink href={tip.href} variant="secondary" motif="spiral">
          {tip.cta}
        </ButtonLink>
      </section>

      {/* ---------- Tiga kolom: misi / koleksi / jurnal ---------- */}
      <div className="grid gap-5 lg:grid-cols-3">
        <section aria-label="Misi" className="panel p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display flex items-center gap-2 text-lg text-[var(--ink)]">
              <Motif motif="star" className="h-4 w-4 text-[var(--gold)]" />
              Misi
            </h2>
            <ButtonLink href="/quests" variant="quiet" size="sm">
              Semua
            </ButtonLink>
          </div>
          {shownQuests.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-subtle)]">
              Belum ada misi yang terbuka. Misi muncul dari hal-hal yang Tara temui di dalam cerita — beberapa
              di antaranya tersembunyi.
            </p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {shownQuests.map((view) => (
                <li key={view.quest.id}>
                  <ButtonLink
                    href={`/quests/${view.quest.id}`}
                    variant="secondary"
                    block
                    className="flex-col !items-start gap-1.5 !py-3 text-left"
                  >
                    <span className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-medium text-[var(--ink)]">{view.quest.title}</span>
                      <span
                        className={cn(
                          "text-[0.65rem] tracking-wide uppercase",
                          view.status === "active" ? "text-[var(--knowledge)]" : "text-[var(--ink-subtle)]",
                        )}
                      >
                        {view.status === "active" ? "berjalan" : "terbuka"}
                      </span>
                    </span>
                    <span className="text-xs leading-relaxed text-[var(--ink-subtle)]">{view.quest.tagline}</span>
                  </ButtonLink>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Koleksi terbaru" className="panel p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display flex items-center gap-2 text-lg text-[var(--ink)]">
              <Motif motif="kawung" className="h-4 w-4 text-[var(--gold)]" />
              Koleksi terbaru
            </h2>
            <ButtonLink href="/collection" variant="quiet" size="sm">
              Semua
            </ButtonLink>
          </div>
          {collection.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-subtle)]">
              Belum ada catatan. Kata dan hal baru akan tersimpan di sini saat Tara menemukannya di dalam cerita.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {collection.map((item) => (
                <li key={item.id} className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[var(--ink)]">{item.title}</span>
                    <ReliabilityBadge reliability={item.reliability} />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">{item.subtitle}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Jurnal Tara" className="panel flex flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display flex items-center gap-2 text-lg text-[var(--ink)]">
              <Motif motif="book" className="h-4 w-4 text-[var(--gold)]" />
              Jurnal Tara
            </h2>
            <ButtonLink href="/journal" variant="quiet" size="sm">
              Buka
            </ButtonLink>
          </div>
          {journalEntry ? (
            <div className="mt-3 flex-1">
              <div className="text-[0.68rem] tracking-wide text-[var(--ink-subtle)] uppercase">{journalEntry.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-muted)]">{journalEntry.text}</p>
            </div>
          ) : (
            <div className="mt-3 flex-1">
              <EmptyState
                className="!border-0 !bg-transparent !p-0 !shadow-none"
                motif="lamp"
                title="Masih kosong"
                body="Tara belum menulis apa pun. Catatan pertama muncul setelah ia menjumpai sesuatu yang layak dikenang."
              />
            </div>
          )}
          {save.journal.reflections.length > 0 ? (
            <p className="mt-3 border-t border-[var(--line)] pt-3 text-xs text-[var(--ink-subtle)]">
              {save.journal.reflections.length} refleksimu tersimpan di perangkat ini.
            </p>
          ) : null}
        </section>
      </div>

      {/* ---------- Catatan kejujuran tingkat rumah ---------- */}
      <section aria-label="Catatan cara belajar" className="panel-soft p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Motif motif="book" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
          <div className="text-sm leading-relaxed text-[var(--ink-muted)]">
            <p className="font-medium text-[var(--ink)]">Cara membaca angka di halaman ini</p>
            <p className="mt-1">
              <strong className="text-[var(--knowledge)]">XP pengetahuan</strong> bertambah dari cerita dan tantangan di
              dalam aplikasi. <strong className="text-[var(--practice)]">XP praktik</strong> bertambah dari misi latihan
              yang kamu <em>laporkan sendiri</em> sudah dijalankan — aplikasi tidak bisa memverifikasi aktivitas di luar.
              Tidak ada streak dan tidak ada hukuman karena jeda; semua catatan menunggu dengan tenang.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
