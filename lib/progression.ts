/**
 * Logika progres: level, kunci bab/episode/quest, dan rekomendasi.
 *
 * Semua fungsi di sini murni (menerima bagian SaveState, mengembalikan nilai)
 * sehingga mudah diuji dan dipindahkan ke backend.
 */

import { CHAPTERS, getChapter, getEpisode } from "@/data/chapters";
import { QUESTS } from "@/data/quests";
import { COLLECTION_ITEMS } from "@/data/collection";
import { ACHIEVEMENTS } from "@/data/achievements";
import { JOURNAL_ENTRIES } from "@/data/journal";
import { evaluateCondition } from "./utils";
import type {
  Chapter,
  Condition,
  Episode,
  Quest,
  QuestStatus,
  SaveState,
  TaraExpression,
} from "./types";

export type SaveSlice = Pick<
  SaveState,
  "flags" | "completedEpisodes" | "quests" | "collection" | "achievements" | "xp"
>;

export function slice(save: SaveState): SaveSlice {
  return {
    flags: save.flags,
    completedEpisodes: save.completedEpisodes,
    quests: save.quests,
    collection: save.collection,
    achievements: save.achievements,
    xp: save.xp,
  };
}

export function conditionMet(save: SaveState, condition?: Condition): boolean {
  return evaluateCondition(condition, slice(save));
}

/* ============================================================
 * Level perjalanan (dihitung dari episode yang diselesaikan)
 * ============================================================ */

export interface LevelInfo {
  level: number;
  title: string;
  blurb: string;
  episodesIntoLevel: number;
  episodesForLevel: number;
  nextTitle?: string;
}

const LEVEL_TITLES: { title: string; blurb: string }[] = [
  { title: "Pendatang Baru", blurb: "Tara baru membuka halaman pertama bukunya." },
  { title: "Pengamat", blurb: "Tara mulai memperhatikan hal-hal kecil di sekitarnya." },
  { title: "Pendengar", blurb: "Tara belajar bahwa bertanya lebih berguna daripada menebak." },
  { title: "Juru Tanya", blurb: "Tara berani bertanya kepada orang yang menjalankan tradisi." },
  { title: "Penolong Kecil", blurb: "Tara menemukan bahwa membantu membuka banyak percakapan." },
  { title: "Pencatat", blurb: "Tara mulai menulis ulang hal-hal yang belum ia pahami." },
  { title: "Penjelajah Desa", blurb: "Tara mengenal lebih dari satu wajah di desa ini." },
  { title: "Juru Cerita Muda", blurb: "Tara mulai bisa menceritakan kembali apa yang ia pelajari." },
  { title: "Sahabat Candrageni", blurb: "Warga desa tahu namanya dan menyapanya pulang." },
  { title: "Penjaga Cerita", blurb: "Tara menjaga catatan, pertanyaan, dan orang-orang yang menjawabnya." },
];

export function levelFromSave(save: SaveState): LevelInfo {
  const completed = save.completedEpisodes.length;
  const level = Math.min(LEVEL_TITLES.length, 1 + Math.floor(completed / 1.5));
  const episodesIntoLevel = completed - (level - 1) * 1.5;
  const info = LEVEL_TITLES[Math.max(0, level - 1)];
  return {
    level,
    title: info.title,
    blurb: info.blurb,
    episodesIntoLevel: Math.max(0, Math.min(1.5, episodesIntoLevel)),
    episodesForLevel: 1.5,
    nextTitle: LEVEL_TITLES[level]?.title,
  };
}

/* ============================================================
 * Bab & episode
 * ============================================================ */

export function isChapterUnlocked(save: SaveState, chapter: Chapter): boolean {
  if (!chapter.unlock.requires) return true;
  return conditionMet(save, chapter.unlock.requires);
}

export type EpisodeStatus = "locked" | "available" | "in-progress" | "completed";

export function episodeStatus(save: SaveState, chapter: Chapter, episode: Episode): EpisodeStatus {
  if (save.completedEpisodes.includes(episode.id)) return "completed";
  if (!isChapterUnlocked(save, chapter)) return "locked";
  const index = chapter.episodes.findIndex((e) => e.id === episode.id);
  if (index <= 0) return save.episodeResume[episode.id] ? "in-progress" : "available";
  const previous = chapter.episodes[index - 1];
  const previousDone = save.completedEpisodes.includes(previous.id);
  if (!previousDone) return "locked";
  return save.episodeResume[episode.id] ? "in-progress" : "available";
}

export function episodeLockedReason(save: SaveState, chapter: Chapter, episode: Episode): string | undefined {
  if (episodeStatus(save, chapter, episode) !== "locked") return undefined;
  if (!isChapterUnlocked(save, chapter)) return chapter.unlock.reason;
  const index = chapter.episodes.findIndex((e) => e.id === episode.id);
  const previous = chapter.episodes[index - 1];
  return previous
    ? `Selesaikan episode sebelumnya, "${previous.title}", untuk membuka episode ini.`
    : chapter.unlock.reason;
}

export function episodeProgressPercent(save: SaveState, episode: Episode): number {
  const visited = save.visited[episode.id]?.length ?? 0;
  if (save.completedEpisodes.includes(episode.id)) return 100;
  const total = Math.max(1, episode.nodes.length);
  return Math.min(99, Math.round((visited / total) * 100));
}

export function chapterProgressPercent(save: SaveState, chapter: Chapter): number {
  if (chapter.episodes.length === 0) return 0;
  const done = chapter.episodes.filter((e) => save.completedEpisodes.includes(e.id)).length;
  if (done === chapter.episodes.length) return 100;
  const partial = chapter.episodes.reduce(
    (acc, episode) => acc + Math.min(1, (save.visited[episode.id]?.length ?? 0) / Math.max(1, episode.nodes.length)),
    0,
  );
  return Math.min(99, Math.round((partial / chapter.episodes.length) * 100));
}

export interface ResumeTarget {
  chapter: Chapter;
  episode: Episode;
  nodeId?: string;
}

/** Titik lanjut bermain: episode terakhir yang dibuka tetapi belum selesai. */
export function resumeTarget(save: SaveState): ResumeTarget | null {
  const last = save.lastPlayed;
  if (last) {
    const chapter = getChapter(last.chapterId);
    const episode = chapter ? getEpisode(last.chapterId, last.episodeId) : undefined;
    if (chapter && episode && !save.completedEpisodes.includes(episode.id)) {
      return { chapter, episode, nodeId: save.episodeResume[episode.id]?.nodeId ?? last.nodeId };
    }
  }
  for (const chapter of CHAPTERS) {
    if (!isChapterUnlocked(save, chapter)) continue;
    for (const episode of chapter.episodes) {
      if (!save.completedEpisodes.includes(episode.id)) {
        return {
          chapter,
          episode,
          nodeId: save.episodeResume[episode.id]?.nodeId,
        };
      }
    }
  }
  return null;
}

/** Episode yang baru saja selesai (untuk ringkasan dan rekomendasi lanjutan). */
export function latestCompletedEpisode(save: SaveState): { chapter: Chapter; episode: Episode } | null {
  for (let c = CHAPTERS.length - 1; c >= 0; c -= 1) {
    const chapter = CHAPTERS[c];
    for (let e = chapter.episodes.length - 1; e >= 0; e -= 1) {
      const episode = chapter.episodes[e];
      if (save.completedEpisodes.includes(episode.id)) return { chapter, episode };
    }
  }
  return null;
}

/* ============================================================
 * Quest
 * ============================================================ */

/** Flag yang ditulis ketika quest tertentu selesai (dipakai jurnal & cerita). */
export const QUEST_COMPLETION_FLAGS: Record<string, string[]> = {
  sq_makna_bayangan: ["quiz_dalang_done"],
  sq_biji_petak: [],
  sq_cerita_rakyat: [],
  hq_kata_tertinggal: ["guyub_explained"],
  hq_halaman_lipat: ["notebook_understood"],
  pq_suara_pertama: ["practice_greeting_done"],
  pq_petak_halaman: ["practice_game_done"],
  pq_cari_sumber: ["practice_source_done"],
  pq_wawancara_kecil: ["practice_interview_done"],
};

export interface QuestView {
  quest: Quest;
  status: QuestStatus;
  lockedReason?: string;
  hint?: string;
  revealed: boolean;
  progressPercent: number;
}

export function questView(save: SaveState, quest: Quest): QuestView {
  const stored = save.quests[quest.id];
  const revealed = Boolean(stored) || conditionMet(save, quest.unlock.requires);
  let status: QuestStatus = stored?.status ?? "locked";
  if (!stored) {
    status = conditionMet(save, quest.unlock.requires) ? "available" : "locked";
  }
  const lockedReason = status === "locked" ? quest.unlock.reason : undefined;
  const progressPercent =
    status === "completed" ? 100 : status === "active" ? (stored?.exerciseDone ? 60 : 25) : 0;
  return {
    quest,
    status,
    lockedReason,
    hint: status === "locked" ? quest.unlock.hint : undefined,
    revealed,
    progressPercent,
  };
}

export function allQuestViews(save: SaveState): QuestView[] {
  return QUESTS.map((quest) => questView(save, quest));
}

/** Hidden quest hanya muncul di daftar setelah ditemukan (revealed). */
export function visibleQuestViews(save: SaveState): QuestView[] {
  return allQuestViews(save).filter((view) => view.quest.category !== "hidden" || view.revealed);
}

export function hiddenQuestCount(save: SaveState): { total: number; discovered: number } {
  const hidden = QUESTS.filter((q) => q.category === "hidden");
  const discovered = hidden.filter((q) => questView(save, q).revealed).length;
  return { total: hidden.length, discovered };
}

export function counts(save: SaveState) {
  const collectionFound = COLLECTION_ITEMS.filter((item) => save.collection[item.id]?.found).length;
  const achievementsUnlocked = ACHIEVEMENTS.filter((a) => save.achievements[a.id]?.unlocked).length;
  const questsCompleted = QUESTS.filter((q) => save.quests[q.id]?.status === "completed").length;
  const questsActive = QUESTS.filter((q) => save.quests[q.id]?.status === "active").length;
  const practiceCompleted = QUESTS.filter(
    (q) => q.category === "practice" && save.quests[q.id]?.status === "completed",
  ).length;
  const practiceTotal = QUESTS.filter((q) => q.category === "practice").length;
  const fragments = COLLECTION_ITEMS.filter(
    (item) => save.collection[item.id]?.found && item.reliability === "needs-verification",
  ).length;
  return {
    collectionFound,
    collectionTotal: COLLECTION_ITEMS.length,
    achievementsUnlocked,
    achievementsTotal: ACHIEVEMENTS.length,
    questsCompleted,
    questsTotal: QUESTS.length,
    questsActive,
    practiceCompleted,
    practiceTotal,
    fragments,
    episodesCompleted: save.completedEpisodes.length,
    episodesTotal: CHAPTERS.reduce((acc, c) => acc + c.episodes.length, 0),
    journalEntries: 0,
  };
}

export function journalEntryIds(save: SaveState): string[] {
  return JOURNAL_ENTRIES.filter((entry) => {
    if (save.journal.entries.includes(entry.id)) return true;
    return entry.requires ? conditionMet(save, entry.requires) : false;
  })
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.id);
}

export function latestJournalEntry(save: SaveState) {
  const ids = journalEntryIds(save);
  const lastId = ids[ids.length - 1];
  return JOURNAL_ENTRIES.find((entry) => entry.id === lastId);
}

export function recentCollection(save: SaveState, limit = 3) {
  return COLLECTION_ITEMS.filter((item) => save.collection[item.id]?.found)
    .sort((a, b) => (save.collection[b.id]?.foundAt ?? 0) - (save.collection[a.id]?.foundAt ?? 0))
    .slice(0, limit);
}

/* ============================================================
 * Mud sikap Tara (dipakai ilustrasi)
 * ============================================================ */

export function taraMood(save: SaveState): TaraExpression {
  if (!save.onboardingComplete) return "curious";
  if (counts(save).questsActive > 0) return "determined";
  if (save.completedEpisodes.length === 0) return "curious";
  if (save.completedEpisodes.length >= 5) return "proud";
  if (save.journal.reflections.length > 0) return "reflective";
  return "warm";
}

export function taraMoodLabel(save: SaveState): string {
  const mood = taraMood(save);
  const labels: Record<TaraExpression, string> = {
    curious: "Tara sedang penasaran",
    confused: "Tara sedang bingung",
    happy: "Tara sedang senang",
    sad: "Tara sedang murung",
    surprised: "Tara terkejut",
    thinking: "Tara sedang berpikir",
    proud: "Tara bangga pada perjalanannya",
    reflective: "Tara sedang merenung",
    determined: "Tara siap melanjutkan",
    warm: "Tara senang bertemu lagi",
  };
  return labels[mood];
}

/* ============================================================
 * Rekomendasi aktivitas lanjutan (satu saja, relevan)
 * ============================================================ */

export interface Recommendation {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}

export function recommendation(save: SaveState): Recommendation {
  const stats = counts(save);
  const resume = resumeTarget(save);
  const views = visibleQuestViews(save);
  const activePractice = views.find(
    (v) => v.quest.category === "practice" && v.status !== "completed" && v.status !== "locked",
  );
  const lockedSide = views.find((v) => v.status === "available" && v.quest.category === "side");

  if (stats.fragments > 0) {
    const fragment = COLLECTION_ITEMS.find(
      (item) => save.collection[item.id]?.found && item.reliability === "needs-verification",
    );
    if (fragment) {
      return {
        eyebrow: "Masih perlu diverifikasi",
        title: `Cari tahu makna "${fragment.title}"`,
        body:
          "Ada catatan di koleksimu yang belum punya penjelasan lengkap. Kamu bisa menanyakan atau menelusurinya sendiri, lalu menuliskan temuanmu.",
        href: `/collection?item=${fragment.id}`,
        cta: "Buka catatan",
      };
    }
  }

  if (activePractice) {
    return {
      eyebrow: "Misi praktik menunggu",
      title: activePractice.quest.title,
      body: activePractice.quest.goal,
      href: `/quests/${activePractice.quest.id}`,
      cta: "Buka misi",
    };
  }

  if (lockedSide) {
    return {
      eyebrow: `Misi tambahan · ${lockedSide.quest.duration}`,
      title: lockedSide.quest.title,
      body: lockedSide.quest.goal,
      href: `/quests/${lockedSide.quest.id}`,
      cta: "Lihat misi",
    };
  }

  if (save.journal.reflections.length === 0 && save.completedEpisodes.length >= 2) {
    return {
      eyebrow: "Jurnal Tara",
      title: "Tulis satu refleksi singkat",
      body:
        "Tara mencatat hal-hal yang belum ia pahami. Kamu bisa ikut menulis di jurnalnya, dan itu membantu kamu mengingat apa yang sudah dipelajari.",
      href: "/journal",
      cta: "Buka jurnal",
    };
  }

  if (resume) {
    return {
      eyebrow: "Lanjutkan cerita",
      title: `${resume.chapter.title} — ${resume.episode.title}`,
      body: resume.episode.summary,
      href: `/play/${resume.chapter.id}/${resume.episode.id}`,
      cta: "Lanjutkan",
    };
  }

  return {
    eyebrow: "Jelajahi koleksi",
    title: "Baca kembali catatan perjalanan Tara",
    body: "Semua yang Tara temukan tersimpan di koleksi, lengkap dengan catatan sumber dan hal yang masih perlu diverifikasi.",
    href: "/collection",
    cta: "Buka koleksi",
  };
}
