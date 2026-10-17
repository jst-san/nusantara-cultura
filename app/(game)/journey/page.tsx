"use client";

import { Backdrop } from "@/components/brand/Backdrop";
import { Motif } from "@/components/brand/Motif";
import { SpeakerAvatar } from "@/components/brand/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, ProgressBar } from "@/components/ui/Bits";
import { CHAPTERS, CHARACTERS } from "@/data";
import { chapterProgressPercent, counts, isChapterUnlocked } from "@/lib/progression";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function JourneyPage() {
  const save = useGameStore((s) => s);
  const stats = counts(save);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Peta perjalanan</div>
          <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">Jejak yang Tara lalui</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
            Satu bab dapat dimainkan penuh di prototipe ini. Tiga bab berikutnya masih berupa rencana — ditampilkan apa
            adanya supaya tidak ada yang terlihat lebih siap daripada kenyataannya.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="gold" motif="spiral">
            {stats.episodesCompleted}/{stats.episodesTotal} episode selesai
          </Chip>
          <Chip motif="kawung">
            {stats.collectionFound}/{stats.collectionTotal} koleksi
          </Chip>
        </div>
      </header>

      <ol className="space-y-5">
        {CHAPTERS.map((chapter) => {
          const unlocked = isChapterUnlocked(save, chapter);
          const progress = chapterProgressPercent(save, chapter);
          const playable = chapter.episodes.length > 0;
          const done = playable
            ? chapter.episodes.filter((episode) => save.completedEpisodes.includes(episode.id)).length
            : 0;
          const cast = chapter.cast.filter((id) => id !== "tara" && id !== "narrator" && id !== "player").slice(0, 4);

          return (
            <li key={chapter.id}>
              <article
                className={cn(
                  "panel relative overflow-hidden transition-colors",
                  !unlocked && "opacity-90",
                )}
              >
                <div className="absolute inset-0">
                  <Backdrop scene={chapter.scene} />
                  <div className="absolute inset-0 bg-[linear-gradient(105deg,color-mix(in_oklab,var(--surface)_95%,transparent)_30%,color-mix(in_oklab,var(--surface)_62%,transparent))]" />
                </div>

                <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="eyebrow">Bab {chapter.index}</span>
                      <Chip tone={playable ? "gold" : "muted"} motif={playable ? "spiral" : "lamp"}>
                        {playable ? (done === chapter.episodes.length ? "selesai dimainkan" : "dapat dimainkan") : "rencana — belum dapat dimainkan"}
                      </Chip>
                      {chapter.contentNote.kind === "fiction" ? (
                        <Chip tone="muted" motif="book">
                          tokoh & desa fiksi
                        </Chip>
                      ) : null}
                    </div>

                    <h2 className="display-title mt-2 text-xl text-[var(--ink)] sm:text-2xl">{chapter.title}</h2>
                    <p className="text-sm text-[var(--gold-soft)]">{chapter.subtitle}</p>
                    <p className="mt-1 text-xs text-[var(--ink-subtle)]">{chapter.region}</p>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-muted)]">
                      {playable ? chapter.premise : chapter.teaser}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {chapter.themes.map((theme) => (
                        <Chip key={theme} motif="leaf">
                          {theme}
                        </Chip>
                      ))}
                    </div>

                    {cast.length > 0 ? (
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {cast.map((id) => {
                          const character = CHARACTERS[id];
                          if (!character) return null;
                          return (
                            <span key={id} className="inline-flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                              <SpeakerAvatar speaker={id} size="sm" />
                              {character.name}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}

                    {!playable && chapter.plannedEpisodes ? (
                      <div className="mt-4 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[color-mix(in_oklab,var(--surface-2)_70%,transparent)] p-3.5">
                        <div className="eyebrow">Garis besar rencana ({chapter.plannedEpisodes.length} episode)</div>
                        <ul className="mt-2 space-y-2">
                          {chapter.plannedEpisodes.map((episode) => (
                            <li key={episode.title} className="text-sm">
                              <span className="font-medium text-[var(--ink)]">{episode.title}</span>
                              <span className="text-[var(--ink-subtle)]"> — {episode.summary}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="w-full shrink-0 space-y-3 lg:w-64">
                    {playable ? (
                      <>
                        <ProgressBar
                          value={progress}
                          label={`${done}/${chapter.episodes.length} episode`}
                          tone={done === chapter.episodes.length ? "success" : "gold"}
                          showValue
                        />
                        <ButtonLink
                          href={`/journey/${chapter.id}`}
                          variant={unlocked ? "primary" : "secondary"}
                          size="lg"
                          block
                          motif="spiral"
                        >
                          {done === 0 ? "Buka bab" : done === chapter.episodes.length ? "Lihat ringkasan" : "Lanjutkan bab"}
                        </ButtonLink>
                      </>
                    ) : (
                      <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[color-mix(in_oklab,var(--surface-2)_70%,transparent)] p-3.5">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--ink-subtle)] uppercase">
                          <Motif motif="lamp" className="h-4 w-4" />
                          Belum tersedia
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">{chapter.unlock.reason}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-subtle)]">
                          {chapter.unlock.hint}
                        </p>
                      </div>
                    )}
                    {playable && !unlocked ? (
                      <p className="text-xs leading-relaxed text-[var(--ink-subtle)]">{chapter.unlock.reason}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <section className="panel-soft p-4 text-xs leading-relaxed text-[var(--ink-subtle)] sm:p-5">
        Catatan: garis besar Bab 2–4 di atas adalah rencana cerita, bukan materi budaya yang sudah siap dipelajari.
        Prototipe ini hanya memuat satu bab yang benar-benar dapat dimainkan: Bab 1 “Jejak Pertama”.
      </section>
    </div>
  );
}
