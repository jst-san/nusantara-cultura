import type { Condition, FlagValue, SaveState } from "./types";

/** Gabungan className sederhana (tanpa dependensi tambahan). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percent(part: number, total: number): number {
  if (total <= 0) return 0;
  return clamp(Math.round((part / total) * 100), 0, 100);
}

/** PRNG deterministik supaya urutan acak identik di server dan klien. */
export function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const rand = seededRandom(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s} detik`;
  return `${m} menit ${s} detik`;
}

/** Mengganti token {player} pada teks cerita dengan nama pemain. */
export function interpolate(text: string, playerName: string): string {
  return text.replaceAll("{player}", playerName);
}

/* ============================================================
 * Evaluasi kondisi cerita
 * ============================================================ */

interface ConditionContext {
  flags: Record<string, FlagValue>;
  completedEpisodes: string[];
  quests: SaveState["quests"];
  collection: SaveState["collection"];
  achievements: SaveState["achievements"];
  xp: SaveState["xp"];
}

function flagMatches(value: FlagValue | undefined, expected?: FlagValue): boolean {
  if (expected === undefined) return Boolean(value);
  return value === expected;
}

export function evaluateCondition(condition: Condition | undefined, state: ConditionContext): boolean {
  if (!condition) return true;
  switch (condition.kind) {
    case "always":
      return true;
    case "flag":
      return flagMatches(state.flags[condition.flag], condition.value);
    case "notFlag":
      return !flagMatches(state.flags[condition.flag], condition.value);
    case "all":
      return condition.of.every((c) => evaluateCondition(c, state));
    case "any":
      return condition.of.some((c) => evaluateCondition(c, state));
    case "none":
      return condition.of.every((c) => !evaluateCondition(c, state));
    case "episodeDone":
      return state.completedEpisodes.includes(condition.episodeId);
    case "chapterDone": {
      const prefix = `${condition.chapterId}_`;
      return state.completedEpisodes.some((episodeId) => episodeId.startsWith(prefix));
    }
    case "questDone":
      return state.quests[condition.questId]?.status === "completed";
    case "collectionFound":
      return Boolean(state.collection[condition.itemId]?.found);
    case "achievement":
      return Boolean(state.achievements[condition.achievementId]?.unlocked);
    case "knowledgeXpAtLeast":
      return state.xp.knowledge >= condition.amount;
    default:
      return true;
  }
}

/* ============================================================
 * Label & ikon kecil
 * ============================================================ */

export const TONE_META: Record<string, { label: string; motif: string }> = {
  ask: { label: "Bertanya", motif: "wave" },
  observe: { label: "Mengamati", motif: "eye" },
  help: { label: "Membantu", motif: "thread" },
  reflect: { label: "Merenung", motif: "spiral" },
  neutral: { label: "Langkah", motif: "star" },
};
