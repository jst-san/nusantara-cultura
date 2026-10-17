"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AppNotification,
  DecisionRecord,
  Effects,
  FlagValue,
  QuestStatus,
  Reflection,
  SaveState,
  Settings,
} from "./types";
import { QUEST_COMPLETION_FLAGS, levelFromSave } from "./progression";
import { JOURNAL_ENTRIES } from "@/data/journal";
import { QUESTS } from "@/data/quests";
import { COLLECTION_ITEMS } from "@/data/collection";
import { ACHIEVEMENTS } from "@/data/achievements";

const SAVE_VERSION = 1;

function now(): number {
  return Date.now();
}

let notificationSeq = 0;
function nextNotificationId(): string {
  notificationSeq += 1;
  return `n-${notificationSeq}-${now().toString(36)}`;
}

export const DEFAULT_SETTINGS: Settings = {
  sfx: true,
  ambience: false,
  volume: 0.7,
  animations: "system",
  textSize: "normal",
  theme: "night",
  tutorialHints: true,
};

function createInitialState(): Omit<SaveState, "version"> {
  return {
    player: { name: "Sahabat Tara", avatar: "feather", createdAt: now() },
    onboardingComplete: false,
    flags: {},
    xp: { knowledge: 0, practice: 0 },
    completedEpisodes: [],
    episodeResume: {},
    visited: {},
    lastPlayed: undefined,
    awarded: {},
    quests: {},
    collection: {},
    achievements: {},
    journal: { entries: [], reflections: [] },
    decisions: [],
    settings: { ...DEFAULT_SETTINGS },
    stats: {
      choiceCount: 0,
      quizAttempts: 0,
      quizCorrect: 0,
      hotspotsFound: 0,
      episodesStarted: 0,
      playSeconds: 0,
    },
  };
}

export interface EffectsContext {
  sourceId: string;
  chapterId?: string;
  episodeId?: string;
  questId?: string;
}

export interface CompleteQuestPayload {
  reflection?: string;
  method?: string;
  note?: string;
  declared?: boolean;
  exerciseDone?: boolean;
}

interface GameStore extends SaveState {
  hydrated: boolean;
  notifications: AppNotification[];
  /** antrean kartu hadiah di dalam Story Mode */
  pendingReveal: EffectsContext | null;
  setHydrated: (value: boolean) => void;
  updatePlayer: (patch: Partial<SaveState["player"]>) => void;
  completeOnboarding: (name: string, avatar: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  toggleSetting: (key: "sfx" | "ambience" | "tutorialHints") => void;
  applyEffects: (effects: Effects | undefined, context: EffectsContext) => void;
  markVisited: (episodeId: string, chapterId: string, nodeId: string) => void;
  completeEpisode: (episodeId: string, chapterId: string) => void;
  recordDecision: (decision: Omit<DecisionRecord, "id" | "createdAt">) => void;
  addReflection: (reflection: Omit<Reflection, "id" | "createdAt">) => void;
  setQuestStatus: (questId: string, status: QuestStatus, revealedBy?: string) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string, payload: CompleteQuestPayload) => void;
  updateQuestDraft: (questId: string, patch: Partial<CompleteQuestPayload>) => void;
  countQuizAttempt: (correct: boolean) => void;
  countChoice: () => void;
  countHotspot: () => void;
  addPlaySeconds: (seconds: number) => void;
  pushNotification: (notification: Omit<AppNotification, "id" | "createdAt">) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  setPendingReveal: (context: EffectsContext | null) => void;
  exportSave: () => string;
  importSave: (json: string) => { ok: boolean; error?: string };
  resetProgress: (keepPlayer: boolean) => void;
}

const STORAGE_KEY = "tara-nusantara-save-v1";

/** Jumlah koleksi & pencapaian yang tercatat — dipakai beberapa aksi. */
function totalQuestsCompleted(quests: SaveState["quests"]): number {
  return Object.values(quests).filter((q) => q.status === "completed").length;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      version: SAVE_VERSION,
      hydrated: false,
      notifications: [],
      pendingReveal: null,

      setHydrated: (value) => set({ hydrated: value }),

      updatePlayer: (patch) => set((s) => ({ player: { ...s.player, ...patch } })),

      completeOnboarding: (name, avatar) =>
        set((s) => ({
          onboardingComplete: true,
          player: { ...s.player, name: name.trim() === "" ? "Sahabat Tara" : name.trim(), avatar },
        })),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      toggleSetting: (key) =>
        set((s) => ({ settings: { ...s.settings, [key]: !s.settings[key] } })),

      applyEffects: (effects, context) => {
        if (!effects) return;
        const state = get();
        const flags = { ...state.flags };
        const awarded = { ...state.awarded };
        const collection = { ...state.collection };
        const achievements = { ...state.achievements };
        const quests = { ...state.quests };
        const journalEntries = [...state.journal.entries];
        let { knowledge, practice } = { ...state.xp };
        const notifications: AppNotification[] = [];

        // 1. Flags
        if (effects.flags) {
          for (const [key, value] of Object.entries(effects.flags)) {
            flags[key] = value;
          }
        }

        // 2. XP (diberikan sekali per sourceId supaya replay tidak menanam XP)
        const xpKey = `xp:${context.sourceId}`;
        if ((effects.knowledgeXp || effects.practiceXp) && !awarded[xpKey]) {
          awarded[xpKey] = true;
          if (effects.knowledgeXp) knowledge += effects.knowledgeXp;
          if (effects.practiceXp) practice += effects.practiceXp;
        }

        // 3. Quest terbuka
        if (effects.unlockQuests) {
          for (const questId of effects.unlockQuests) {
            const existing = quests[questId];
            if (!existing || existing.status === "locked") {
              quests[questId] = {
                ...(existing ?? { status: "available" as QuestStatus }),
                status: existing?.status === "completed" ? "completed" : "available",
                revealedBy: context.sourceId,
              };
              notifications.push({
                id: nextNotificationId(),
                kind: "quest",
                title: "Misi baru terbuka",
                body: QUESTS.find((q) => q.id === questId)?.title ?? questId,
                meta: context.chapterId,
                createdAt: now(),
              });
            }
          }
        }

        // 4. Koleksi
        if (effects.unlockCollection) {
          for (const itemId of effects.unlockCollection) {
            if (!collection[itemId]?.found) {
              collection[itemId] = {
                found: true,
                foundAt: now(),
                fromEpisode: context.episodeId,
              };
              notifications.push({
                id: nextNotificationId(),
                kind: "collection",
                title: "Catatan baru di jurnal perjalanan",
                body: COLLECTION_ITEMS.find((item) => item.id === itemId)?.title ?? itemId,
                meta: context.episodeId,
                createdAt: now(),
              });
            }
          }
        }

        // 5. Pencapaian
        if (effects.unlockAchievements) {
          for (const achievementId of effects.unlockAchievements) {
            if (!achievements[achievementId]?.unlocked) {
              achievements[achievementId] = { unlocked: true, unlockedAt: now() };
              notifications.push({
                id: nextNotificationId(),
                kind: "achievement",
                title: "Pencapaian terbuka",
                body: ACHIEVEMENTS.find((entry) => entry.id === achievementId)?.title ?? achievementId,
                createdAt: now(),
              });
            }
          }
        }

        // 6. Jurnal Tara
        if (effects.journal) {
          for (const entryId of effects.journal) {
            if (journalEntries.includes(entryId)) continue;
            // Id jurnal yang tidak dikenal dilewati supaya tidak ada catatan hantu.
            const entry = JOURNAL_ENTRIES.find((candidate) => candidate.id === entryId);
            if (!entry) continue;
            journalEntries.push(entryId);
            notifications.push({
              id: nextNotificationId(),
              kind: "journal",
              title: "Catatan Tara bertambah",
              body: entry.title,
              createdAt: now(),
            });
          }
        }

        const previousLevel = levelFromSave(state).level;

        set({
          flags,
          awarded,
          collection,
          achievements,
          quests,
          xp: { knowledge, practice },
          journal: { ...state.journal, entries: journalEntries },
          notifications: [...state.notifications, ...notifications].slice(-6),
        });

        const nextLevel = levelFromSave(get()).level;
        if (nextLevel > previousLevel) {
          get().pushNotification({
            kind: "level",
            title: `Level perjalanan naik: ${nextLevel}`,
            body: "Tara berkembang seiring cerita yang dijalaninya.",
          });
        }
      },

      markVisited: (episodeId, chapterId, nodeId) =>
        set((s) => {
          const visited = { ...s.visited };
          const list = visited[episodeId] ? [...visited[episodeId]] : [];
          if (!list.includes(nodeId)) list.push(nodeId);
          visited[episodeId] = list;
          const episodeResume = {
            ...s.episodeResume,
            [episodeId]: { nodeId, updatedAt: now() },
          };
          const alreadyStarted = Boolean(s.episodeResume[episodeId]);
          return {
            visited,
            episodeResume,
            lastPlayed: { chapterId, episodeId, nodeId, updatedAt: now() },
            stats: {
              ...s.stats,
              episodesStarted: alreadyStarted ? s.stats.episodesStarted : s.stats.episodesStarted + 1,
            },
          };
        }),

      completeEpisode: (episodeId, chapterId) =>
        set((s) => {
          const completedEpisodes = s.completedEpisodes.includes(episodeId)
            ? s.completedEpisodes
            : [...s.completedEpisodes, episodeId];
          const flags = { ...s.flags, [`episode_${episodeId}_done`]: true, [`chapter_${chapterId}_active`]: true };
          return {
            completedEpisodes,
            flags,
            lastPlayed: s.lastPlayed
              ? { ...s.lastPlayed, updatedAt: now() }
              : { chapterId, episodeId, nodeId: "", updatedAt: now() },
          };
        }),

      recordDecision: (decision) =>
        set((s) => ({
          decisions: [
            { ...decision, id: `d-${now().toString(36)}-${s.decisions.length}`, createdAt: now() },
            ...s.decisions,
          ].slice(0, 80),
        })),

      addReflection: (reflection) => {
        const state = get();
        set((s) => ({
          journal: {
            ...s.journal,
            reflections: [
              { ...reflection, id: `r-${now().toString(36)}`, createdAt: now() },
              ...s.journal.reflections,
            ],
          },
        }));
        // Refleksi kedua membuka pencapaian penulis catatan.
        const total = state.journal.reflections.length + 1;
        if (total >= 2) {
          get().applyEffects({ unlockAchievements: ["ach_reflective_writer"] }, { sourceId: `reflection:${reflection.nodeId}` });
        }
      },

      setQuestStatus: (questId, status, revealedBy) =>
        set((s) => ({
          quests: {
            ...s.quests,
            [questId]: {
              ...(s.quests[questId] ?? {}),
              status,
              revealedBy: revealedBy ?? s.quests[questId]?.revealedBy,
            },
          },
        })),

      startQuest: (questId) =>
        set((s) => {
          const current = s.quests[questId];
          return {
            quests: {
              ...s.quests,
              [questId]: {
                ...(current ?? { status: "active" }),
                status: "active",
                startedAt: current?.startedAt ?? now(),
              },
            },
          };
        }),

      updateQuestDraft: (questId, patch) =>
        set((s) => ({
          quests: {
            ...s.quests,
            [questId]: { ...(s.quests[questId] ?? { status: "active" as QuestStatus }), ...patch },
          },
        })),

      completeQuest: (questId, payload) => {
        const state = get();
        const progress = state.quests[questId];
        if (!progress) return;
        set((s) => ({
          quests: {
            ...s.quests,
            [questId]: {
              ...s.quests[questId],
              status: "completed",
              completedAt: s.quests[questId]?.completedAt ?? now(),
              reflection: payload.reflection ?? s.quests[questId]?.reflection,
              declared: payload.declared ?? s.quests[questId]?.declared,
              method: payload.method ?? s.quests[questId]?.method,
              note: payload.note ?? s.quests[questId]?.note,
              exerciseDone: payload.exerciseDone ?? s.quests[questId]?.exerciseDone,
            },
          },
          stats: {
            ...s.stats,
            choiceCount: s.stats.choiceCount,
          },
        }));
        const flags: Record<string, FlagValue> = { [`quest_${questId}_done`]: true };
        for (const flag of QUEST_COMPLETION_FLAGS[questId] ?? []) flags[flag] = true;
        get().applyEffects({ flags }, { sourceId: `quest-complete:${questId}`, questId });

        // Hadiah misi diberikan sekali per misi (XP dijaga oleh kunci sourceId di applyEffects).
        const quest = QUESTS.find((entry) => entry.id === questId);
        if (quest) {
          get().applyEffects(
            {
              knowledgeXp: quest.reward.knowledgeXp,
              practiceXp: quest.reward.practiceXp,
              unlockCollection: quest.reward.collection,
              unlockAchievements: quest.reward.achievements,
              journal: quest.reward.journal,
            },
            { sourceId: `quest-reward:${questId}`, questId },
          );
        }

        get().recordDecision({
          nodeId: questId,
          episodeId: "quest",
          chapterId: "quest",
          question: `Menyelesaikan misi: ${quest?.title ?? questId}`,
          answer: payload.method ?? "selesai",
          answerLabel: payload.method ?? "Selesai",
          kind: "quest",
          outcome: payload.reflection?.slice(0, 140),
        });
      },

      countQuizAttempt: (correct) =>
        set((s) => ({
          stats: {
            ...s.stats,
            quizAttempts: s.stats.quizAttempts + 1,
            quizCorrect: s.stats.quizCorrect + (correct ? 1 : 0),
          },
        })),

      countChoice: () => set((s) => ({ stats: { ...s.stats, choiceCount: s.stats.choiceCount + 1 } })),

      countHotspot: () => set((s) => ({ stats: { ...s.stats, hotspotsFound: s.stats.hotspotsFound + 1 } })),

      addPlaySeconds: (seconds) =>
        set((s) => ({ stats: { ...s.stats, playSeconds: s.stats.playSeconds + seconds } })),

      pushNotification: (notification) =>
        set((s) => ({
          notifications: [
            ...s.notifications,
            { ...notification, id: nextNotificationId(), createdAt: now() },
          ].slice(-6),
        })),

      dismissNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      clearNotifications: () => set({ notifications: [] }),

      setPendingReveal: (context) => set({ pendingReveal: context }),

      exportSave: () => {
        const s = get();
        const payload: SaveState = {
          version: SAVE_VERSION,
          player: s.player,
          onboardingComplete: s.onboardingComplete,
          flags: s.flags,
          xp: s.xp,
          completedEpisodes: s.completedEpisodes,
          episodeResume: s.episodeResume,
          visited: s.visited,
          lastPlayed: s.lastPlayed,
          awarded: s.awarded,
          quests: s.quests,
          collection: s.collection,
          achievements: s.achievements,
          journal: s.journal,
          decisions: s.decisions,
          settings: s.settings,
          stats: s.stats,
        };
        return JSON.stringify(payload, null, 2);
      },

      importSave: (json) => {
        try {
          const parsed = JSON.parse(json) as Partial<SaveState>;
          if (!parsed || typeof parsed !== "object" || !parsed.player) {
            return { ok: false, error: "Berkas tidak dikenali." };
          }
          const base = createInitialState();
          set({
            ...base,
            ...parsed,
            player: { ...base.player, ...parsed.player },
            settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
            xp: { ...base.xp, ...parsed.xp },
            journal: { ...base.journal, ...parsed.journal },
            stats: { ...base.stats, ...parsed.stats },
            version: SAVE_VERSION,
          });
          return { ok: true };
        } catch {
          return { ok: false, error: "Berkas bukan JSON yang sah." };
        }
      },

      resetProgress: (keepPlayer) => {
        const state = get();
        const fresh = createInitialState();
        set({
          ...fresh,
          player: keepPlayer ? { ...state.player, createdAt: now() } : fresh.player,
          onboardingComplete: keepPlayer ? state.onboardingComplete : false,
          settings: state.settings,
          notifications: [],
          hydrated: true,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      version: SAVE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: SAVE_VERSION,
        player: state.player,
        onboardingComplete: state.onboardingComplete,
        flags: state.flags,
        xp: state.xp,
        completedEpisodes: state.completedEpisodes,
        episodeResume: state.episodeResume,
        visited: state.visited,
        lastPlayed: state.lastPlayed,
        awarded: state.awarded,
        quests: state.quests,
        collection: state.collection,
        achievements: state.achievements,
        journal: state.journal,
        decisions: state.decisions,
        settings: state.settings,
        stats: state.stats,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      /**
       * Simpanan lama bisa saja tidak memuat semua kunci (mis. `settings`
       * sebagian). Gabungkan per bagian supaya nilai bawaan tidak hilang dan
       * tidak ada nilai `undefined` yang bocor ke UI atau audio.
       */
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SaveState>;
        return {
          ...current,
          ...saved,
          player: { ...current.player, ...(saved.player ?? {}) },
          xp: { ...current.xp, ...(saved.xp ?? {}) },
          journal: {
            entries: saved.journal?.entries ?? current.journal.entries,
            reflections: saved.journal?.reflections ?? current.journal.reflections,
          },
          settings: { ...current.settings, ...(saved.settings ?? {}) },
          stats: { ...current.stats, ...(saved.stats ?? {}) },
        };
      },
      migrate: (persisted, version) => {
        if (version === SAVE_VERSION) return persisted as GameStore;
        return { ...createInitialState(), version: SAVE_VERSION } as GameStore;
      },
    },
  ),
);

/** Utilitas kecil yang dipakai di beberapa komponen. */
export function useTotalQuestsCompleted(): number {
  return useGameStore((s) => totalQuestsCompleted(s.quests));
}
