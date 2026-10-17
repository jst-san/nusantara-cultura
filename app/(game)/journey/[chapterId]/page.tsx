"use client";

import { useParams } from "next/navigation";
import { Backdrop } from "@/components/brand/Backdrop";
import { Motif } from "@/components/brand/Motif";
import { SpeakerAvatar } from "@/components/brand/Avatar";
import { Tara } from "@/components/brand/Tara";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, EmptyState, ProgressBar, ReliabilityBadge, StatusDot } from "@/components/ui/Bits";
import { getChapter, getCollectionItem, getQuest, CHARACTERS } from "@/data";
import {
  chapterProgressPercent,
  episodeLockedReason,
  episodeProgressPercent,
  episodeStatus,
  isChapterUnlocked,
  questView,
} from "@/lib/progression";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  locked: "terkunci",
  available: "siap dimainkan",
  "in-progress": "sedang dijalani",
  completed: "selesai",
};

export default function ChapterDetailPage() {
  const params = useParams<{ chapterId: string }>();
  const chapterId = typeof params.chapterId === "string" ? params.chapterId : "";
  const save = useGameStore((s) => s);
  const chapter = getChapter(chapterId);

  if (!chapter) {
    return (
      <EmptyState
        title="Bab tidak ditemukan"
        body="Alamat ini tidak cocok dengan bab mana pun di prototipe. Kembali ke peta perjalanan untuk memilih bab yang tersedia."
        motif="spiral"
        action={
          <ButtonLink href="/journey" variant="primary" motif="spiral">
            Buka peta perjalanan
          </ButtonLink>
        }
      />
    );
  }

  const unlocked = isChapterUnlocked(save, chapter);
  const progress = chapterProgressPercent(save, chapter);
  const playable = chapter.episodes.length > 0;
  const doneCount = chapter.episodes.filter((episode) => save.completedEpisodes.includes(episode.id)).length;
  const allDone = playable && doneCount === chapter.episodes.length;
  const lastEpisode = chapter.episodes[chapter.episodes.length - 1];

  const collections = chapter.collections.map((id) => getCollectionItem(id)).filter((item) => item !== undefined);
  const quests = chapter.quests.map((id) => getQuest(id)).filter((quest) => quest !== undefined);

  return (
    <div className="space-y-6">
      <nav aria-label="Remah navigasi" className="text-xs text-[var(--ink-subtle)]">
        <ButtonLink href="/journey" variant="quiet" size="sm">
          ← Peta perjalanan
        </ButtonLink>
      </nav>

      {/* ---------- Kepala bab ---------- */}
      <header className="panel relative overflow-hidden">
        <div className="absolute inset-0 opacity-80">
          <Backdrop scene={chapter.scene} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface)_35%,transparent),color-mix(in_oklab,var(--surface)_92%,transparent)_78%)]" />
        </div>
        <div className="relative px-5 pb-6 pt-24 sm:px-7 sm:pt-32">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">Bab {chapter.index}</span>
            <Chip tone={unlocked ? "gold" : "muted"} motif={unlocked ? "spiral" : "lamp"}>
              {playable ? (allDone ? "selesai dimainkan" : `dapat dimainkan · ${doneCount}/${chapter.episodes.length} episode`) : "rencana — belum dapat dimainkan"}
            </Chip>
          </div>
          <h1 className="display-title mt-2 text-3xl text-[var(--ink)] sm:text-4xl">{chapter.title}</h1>
          <p className="mt-1 text-base text-[var(--gold-soft)]">{chapter.subtitle}</p>
          <p className="mt-1 text-xs text-[var(--ink-subtle)]">{chapter.region}</p>
          <p className="mt-4 max-w-3xl story-text text-[var(--ink-muted)]">{chapter.premise}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {chapter.themes.map((theme) => (
              <Chip key={theme} motif="leaf">
                {theme}
              </Chip>
            ))}
          </div>

          {playable ? (
            <div className="mt-5 max-w-md">
              <ProgressBar value={progress} label="Kemajuan bab" tone={allDone ? "success" : "gold"} showValue />
            </div>
          ) : null}
        </div>
      </header>

      {/* ---------- Catatan konten ---------- */}
      <section className="panel-soft flex items-start gap-3 p-4 sm:p-5" aria-label="Catatan konten">
        <Motif motif="eye" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
        <div className="text-sm leading-relaxed text-[var(--ink-muted)]">
          <p className="font-medium text-[var(--ink)]">
            {chapter.contentNote.kind === "fiction"
              ? "Konten fiksi"
              : chapter.contentNote.kind === "documented"
                ? "Informasi umum terdokumentasi"
                : "Campuran fiksi & informasi umum"}
          </p>
          <p className="mt-1">{chapter.contentNote.text}</p>
        </div>
      </section>

      {!playable ? (
        <EmptyState
          motif="lamp"
          title="Bab ini belum dapat dimainkan"
          body={`${chapter.unlock.reason} ${chapter.unlock.hint}`}
          action={
            <ButtonLink href="/journey" variant="primary" motif="spiral">
              Kembali ke peta perjalanan
            </ButtonLink>
          }
        />
      ) : (
        <>
          {/* ---------- Episode ---------- */}
          <section aria-label="Daftar episode">
            <h2 className="font-display mb-3 flex items-center gap-2 text-xl text-[var(--ink)]">
              <Motif motif="spiral" className="h-5 w-5 text-[var(--gold)]" />
              Episode
            </h2>
            <ol className="space-y-3">
              {chapter.episodes.map((episode) => {
                const status = episodeStatus(save, chapter, episode);
                const locked = status === "locked";
                const percent = episodeProgressPercent(save, episode);
                const isNext =
                  status === "available" &&
                  save.completedEpisodes.filter((id) => chapter.episodes.some((e) => e.id === id)).length ===
                    episode.index;
                return (
                  <li key={episode.id}>
                    <article
                      className={cn(
                        "panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5",
                        locked && "opacity-80",
                        isNext && "border-[color-mix(in_oklab,var(--gold)_45%,transparent)]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-lg",
                          status === "completed"
                            ? "border-[color-mix(in_oklab,var(--success)_55%,transparent)] text-[var(--success)]"
                            : "border-[var(--line-strong)] text-[var(--ink-muted)]",
                        )}
                      >
                        {episode.index}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg text-[var(--ink)]">{episode.title}</h3>
                          <span className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-wide text-[var(--ink-subtle)] uppercase">
                            <StatusDot status={status} />
                            {STATUS_LABEL[status]}
                          </span>
                          {isNext ? (
                            <Chip tone="gold" motif="star">
                              lanjutkan dari sini
                            </Chip>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{episode.summary}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--ink-subtle)]">
                          <span>{episode.duration}</span>
                          <span aria-hidden="true">·</span>
                          <span>{episode.nodes.length} adegan</span>
                          {!locked && percent > 0 && status !== "completed" ? (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{percent}% dilihat</span>
                            </>
                          ) : null}
                        </div>
                        {locked ? (
                          <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-[var(--ink-subtle)]">
                            <Motif motif="lamp" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            {episodeLockedReason(save, chapter, episode)}
                          </p>
                        ) : null}
                      </div>

                      <div className="shrink-0 sm:w-44">
                        {locked ? (
                          <span className="block rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-2.5 text-center text-xs text-[var(--ink-subtle)]">
                            Terkunci
                          </span>
                        ) : (
                          <ButtonLink
                            href={`/play/${chapter.id}/${episode.id}`}
                            variant={status === "completed" ? "secondary" : "primary"}
                            block
                            motif="lamp"
                          >
                            {status === "completed" ? "Mainkan ulang" : status === "in-progress" ? "Lanjutkan" : "Mulai"}
                          </ButtonLink>
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          </section>

          {allDone && lastEpisode ? (
            <section className="panel flex flex-wrap items-center gap-4 p-5" aria-label="Bab selesai">
              <Tara expression="proud" className="h-20 w-20 shrink-0" idle />
              <div className="min-w-0 flex-1">
                <div className="eyebrow">Bab {chapter.index} selesai</div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                  Semua episode bab ini sudah kamu jalani. Kamu bisa membaca ulang penutupnya, menjelajahi pilihan lain,
                  atau membuka koleksi dan jurnal untuk melihat apa yang tercatat.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonLink href={`/play/${chapter.id}/${lastEpisode.id}`} variant="secondary" motif="spiral">
                  Baca ulang penutup
                </ButtonLink>
                <ButtonLink href="/collection" variant="ghost" motif="kawung">
                  Buka koleksi
                </ButtonLink>
              </div>
            </section>
          ) : null}

          {/* ---------- Tokoh ---------- */}
          <section aria-label="Tokoh bab ini">
            <h2 className="font-display mb-3 flex items-center gap-2 text-xl text-[var(--ink)]">
              <Motif motif="thread" className="h-5 w-5 text-[var(--gold)]" />
              Tokoh
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {chapter.cast
                .filter((id) => id !== "narrator" && id !== "player")
                .map((id) => {
                  const character = CHARACTERS[id];
                  if (!character) return null;
                  return (
                    <div key={id} className="panel-soft flex items-start gap-3 p-3.5">
                      <SpeakerAvatar speaker={id} size="md" className="shrink-0" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-base text-[var(--ink)]">{character.name}</span>
                          {character.fictional ? (
                            <Chip tone="muted" motif="lamp">
                              tokoh fiksi
                            </Chip>
                          ) : null}
                        </div>
                        <p className="text-xs text-[var(--gold-soft)]">{character.role}</p>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">{character.blurb}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* ---------- Koleksi bab ---------- */}
          {collections.length > 0 ? (
            <section aria-label="Koleksi dari bab ini">
              <h2 className="font-display mb-3 flex items-center gap-2 text-xl text-[var(--ink)]">
                <Motif motif="kawung" className="h-5 w-5 text-[var(--gold)]" />
                Catatan yang bisa ditemukan
              </h2>
              <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map((item) => {
                  const found = Boolean(save.collection[item.id]?.found);
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "panel-soft p-3.5",
                        !found && "border-dashed opacity-80",
                      )}
                    >
                      {found ? (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-medium text-[var(--ink)]">{item.title}</span>
                            <ReliabilityBadge reliability={item.reliability} />
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">{item.subtitle}</p>
                        </>
                      ) : (
                        <div className="flex items-start gap-2 text-xs text-[var(--ink-subtle)]">
                          <Motif motif="lamp" className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>
                            Belum ditemukan. Cari di dalam episode — sebagian tersembunyi di adegan pengamatan.
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {/* ---------- Misi bab ---------- */}
          {quests.length > 0 ? (
            <section aria-label="Misi dari bab ini">
              <h2 className="font-display mb-3 flex items-center gap-2 text-xl text-[var(--ink)]">
                <Motif motif="star" className="h-5 w-5 text-[var(--gold)]" />
                Misi dari bab ini
              </h2>
              <ul className="space-y-2.5">
                {quests.map((quest) => {
                  const view = questView(save, quest);
                  return (
                    <li key={quest.id}>
                      <ButtonLink
                        href={`/quests/${quest.id}`}
                        variant="secondary"
                        block
                        className="!items-start gap-3 !py-3.5 text-left"
                      >
                        <Motif
                          motif={quest.category === "hidden" ? "eye" : quest.category === "practice" ? "thread" : "star"}
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-[var(--ink)]">
                              {view.revealed || view.status !== "locked" ? quest.title : "Misi tersembunyi"}
                            </span>
                            <Chip
                              tone={
                                view.status === "completed" ? "success" : view.status === "active" ? "knowledge" : "muted"
                              }
                            >
                              {view.status === "completed"
                                ? "selesai"
                                : view.status === "active"
                                  ? "berjalan"
                                  : view.status === "available"
                                    ? "terbuka"
                                    : "belum terbuka"}
                            </Chip>
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-[var(--ink-subtle)]">
                            {view.status === "locked" ? quest.unlock.hint : quest.tagline}
                          </span>
                        </span>
                      </ButtonLink>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
