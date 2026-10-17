/**
 * Label manusiawi untuk flag cerita & rangkuman efek.
 *
 * Dipakai oleh kartu konsekuensi, kartu hadiah, dan jurnal supaya pemain
 * melihat bahasa biasa ("Memilih mengamati") alih-alih nama flag teknis
 * ("observed_scene_clue").
 */

import type { MotifKey } from "@/components/brand/Motif";
import { getAchievement, getCollectionItem, getJournalEntry, getQuest } from "@/data";
import type { Effects, FlagValue } from "./types";

/** Nama resmi setiap flag yang muncul di cerita Bab 1. */
export const FLAG_LABELS: Record<string, string> = {
  tone_bold: "Berani langsung",
  tone_careful: "Mengamati lebih dulu",
  tone_friendly: "Mulai dari sapaan",
  met_ndari: "Berkenalan dengan Ndari",
  met_dalang: "Berkenalan dengan Pak Wagiman",
  met_sinden: "Berkenalan dengan Bu Rukmini",
  asked_about_tradition: "Memilih bertanya",
  observed_scene_clue: "Memilih mengamati",
  offered_help: "Memilih membantu",
  heard_guyub: "Mendengar kata “guyub”",
  discovered_hidden_term: "Menemukan kata tersembunyi",
  notebook_examined: "Memeriksa buku Kakek Wira",
  notebook_understood: "Tulisan Kakek Wira mulai dipahami",
  ringgit_explained: "Arti “ringgit” dijelaskan",
  guyub_explained: "Arti “guyub” dijelaskan",
  learned_greeting: "Belajar sapaan desa",
  listened_to_tale: "Mendengar cerita rakyat",
  chosen_game_branch: "Menelusuri permainan desa",
  chosen_gamelan_branch: "Menelusuri gamelan",
  chosen_story_branch: "Menelusuri cerita",
  heard_origin_story: "Mendengar cerita asal-usul",
  met_local_storyteller: "Bertemu penutur cerita",
  practice_greeting_done: "Latihan menyapa dijalankan",
  practice_game_done: "Latihan mencatat permainan dijalankan",
  practice_source_done: "Latihan menelusuri sumber dijalankan",
  practice_interview_done: "Latihan wawancara kecil dijalankan",
  quiz_dalang_done: "Tantangan tentang dalang dijawab",
  chapter1_complete: "Bab 1 selesai",
};

/** Flag internal (dipakai mesin cerita) — tidak perlu ditampilkan. */
export function isInternalFlag(flag: string): boolean {
  if (flag.startsWith("episode_") || flag.startsWith("chapter_")) return true;
  if (flag.startsWith("quest_") && flag.endsWith("_done")) return true;
  return false;
}

function humanize(flag: string): string {
  const text = flag.replaceAll("_", " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function flagLabel(flag: string): string {
  return FLAG_LABELS[flag] ?? humanize(flag);
}

export type EffectTone = "knowledge" | "practice" | "gold" | "collection" | "quest" | "achievement" | "journal";

export interface EffectChip {
  id: string;
  label: string;
  tone: EffectTone;
  motif: MotifKey;
}

const TONE: Record<EffectTone, MotifKey> = {
  knowledge: "book",
  practice: "thread",
  gold: "star",
  collection: "kawung",
  quest: "star",
  achievement: "gong",
  journal: "lamp",
};

function chip(tone: EffectTone, id: string, label: string): EffectChip {
  return { id, label, tone, motif: TONE[tone] };
}

/** Mengubah struktur Effects menjadi daftar chip yang bisa dibaca pemain. */
export function describeEffects(effects?: Effects): EffectChip[] {
  if (!effects) return [];
  const chips: EffectChip[] = [];

  if (effects.knowledgeXp) chips.push(chip("knowledge", "xp-knowledge", `+${effects.knowledgeXp} XP pengetahuan`));
  if (effects.practiceXp) chips.push(chip("practice", "xp-practice", `+${effects.practiceXp} XP praktik`));

  for (const flag of Object.keys(effects.flags ?? {})) {
    if (isInternalFlag(flag)) continue;
    chips.push(chip("gold", `flag-${flag}`, flagLabel(flag)));
  }

  for (const itemId of effects.unlockCollection ?? []) {
    const item = getCollectionItem(itemId);
    chips.push(chip("collection", `col-${itemId}`, `Catatan: ${item?.title ?? itemId}`));
  }

  for (const questId of effects.unlockQuests ?? []) {
    const quest = getQuest(questId);
    chips.push(chip("quest", `quest-${questId}`, `Misi terbuka: ${quest?.title ?? questId}`));
  }

  for (const achievementId of effects.unlockAchievements ?? []) {
    const achievement = getAchievement(achievementId);
    chips.push(chip("achievement", `ach-${achievementId}`, `Pencapaian: ${achievement?.title ?? achievementId}`));
  }

  for (const entryId of effects.journal ?? []) {
    const entry = getJournalEntry(entryId);
    chips.push(chip("journal", `jr-${entryId}`, `Jurnal: ${entry?.title ?? entryId}`));
  }

  return chips;
}

/** Daftar flag "pilihan sikap" yang layak ditampilkan sebagai penanda keputusan. */
export const STANCE_FLAGS = [
  "tone_bold",
  "tone_careful",
  "tone_friendly",
  "asked_about_tradition",
  "observed_scene_clue",
  "offered_help",
] as const;

export function stanceLabel(flags: Record<string, FlagValue>): string | undefined {
  for (const flag of STANCE_FLAGS) {
    if (flags[flag]) return FLAG_LABELS[flag];
  }
  return undefined;
}
