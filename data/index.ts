/**
 * Titik akses tunggal untuk semua data konten.
 * Komponen UI sebaiknya mengimpor dari sini, bukan langsung dari berkas data.
 */

import { CHAPTERS, getChapter, getEpisode, getNode, startNodeOf, allEpisodes, chapterOfEpisode } from "./chapters";
import { QUESTS, QUEST_CATEGORY_META } from "./quests";
import { COLLECTION_ITEMS, COLLECTION_CATEGORY_META } from "./collection";
import { ACHIEVEMENTS } from "./achievements";
import { JOURNAL_ENTRIES } from "./journal";
import { CHARACTERS, STORY_CAST } from "./characters";
import type {
  Achievement,
  Chapter,
  CollectionItem,
  JournalEntry,
  Quest,
  SpeakerId,
} from "@/lib/types";

export {
  CHAPTERS,
  getChapter,
  getEpisode,
  getNode,
  startNodeOf,
  allEpisodes,
  chapterOfEpisode,
  QUESTS,
  QUEST_CATEGORY_META,
  COLLECTION_ITEMS,
  COLLECTION_CATEGORY_META,
  ACHIEVEMENTS,
  JOURNAL_ENTRIES,
  CHARACTERS,
  STORY_CAST,
};

const questIndex = new Map(QUESTS.map((q) => [q.id, q]));
const collectionIndex = new Map(COLLECTION_ITEMS.map((c) => [c.id, c]));
const achievementIndex = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
const journalIndex = new Map(JOURNAL_ENTRIES.map((j) => [j.id, j]));

export function getQuest(questId: string): Quest | undefined {
  return questIndex.get(questId);
}

export function getCollectionItem(itemId: string): CollectionItem | undefined {
  return collectionIndex.get(itemId);
}

export function getAchievement(achievementId: string): Achievement | undefined {
  return achievementIndex.get(achievementId);
}

export function getJournalEntry(entryId: string): JournalEntry | undefined {
  return journalIndex.get(entryId);
}

export function getCharacter(speakerId: SpeakerId) {
  return CHARACTERS[speakerId];
}

export function collectionByCategory(category: CollectionItem["category"]): CollectionItem[] {
  return COLLECTION_ITEMS.filter((item) => item.category === category);
}

export function questsByCategory(category: Quest["category"]): Quest[] {
  return QUESTS.filter((quest) => quest.category === category);
}

export function chaptersOfChapterIndex(index: number): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.index === index);
}
