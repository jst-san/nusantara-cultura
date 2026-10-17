/**
 * Daftar bab + helper pencarian data cerita.
 *
 * Bab 1 dapat dimainkan penuh. Bab 2–4 masih berupa teaser (belum ada konten),
 * dan itu ditulis apa adanya di UI: "Segera hadir", bukan dipalsukan.
 */

import type { Chapter, Episode, StoryNode } from "@/lib/types";
import { CHAPTER_1 } from "./story/chapter-1";

/** Bab yang direncanakan — belum dapat dimainkan, hanya teaser jalan cerita. */
function plannedChapter(input: {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  region: string;
  theme: string;
  premise: string;
  teaser: string;
  scene: Chapter["scene"];
  motif: string;
  requiresEpisode: string;
  reason: string;
  hint: string;
  themes: string[];
  plannedEpisodes: { title: string; summary: string }[];
}): Chapter {
  return {
    id: input.id,
    index: input.index,
    title: input.title,
    subtitle: input.subtitle,
    region: input.region,
    theme: input.theme,
    premise: input.premise,
    teaser: input.teaser,
    scene: input.scene,
    motif: input.motif,
    cast: ["tara"],
    themes: input.themes,
    collections: [],
    quests: [],
    contentNote: {
      kind: "fiction",
      text: "Bab ini masih dalam tahap perencanaan. Ringkasannya bersifat teaser cerita, bukan materi budaya yang sudah siap dipelajari.",
    },
    unlock: {
      requires: { kind: "episodeDone", episodeId: input.requiresEpisode },
      reason: input.reason,
      hint: input.hint,
    },
    episodes: [],
    plannedEpisodes: input.plannedEpisodes,
  };
}

const CHAPTER_2 = plannedChapter({
  id: "ch2",
  index: 2,
  title: "Suara dari Bambu",
  subtitle: "Nada yang dimainkan bersama",
  region: "Kampung Ciwaregu (fiktif) · konteks Sunda",
  theme: "Angklung, permainan bunyi, dan latihan bersama",
  premise:
    "Tara sampai di sebuah kampung yang sedang bersiap untuk acara panen. Setiap orang memegang satu alat, dan tidak ada yang boleh bermain sendiri-sendiri. Tara harus belajar menunggu nada masuk.",
  teaser: "Angklung dimainkan berkelompok: satu orang satu nada, dan giliran masuk adalah bagian dari permainan.",
  scene: "fields_morning",
  motif: "wave",
  requiresEpisode: "e7_refleksi",
  reason: "Bab 2 belum tersedia di prototipe ini.",
  hint: "Bab 1 selesai lebih dulu, lalu ikuti pengumuman di halaman Beranda.",
  themes: ["Angklung dan permainan ansambel", "Bahan bambu dan perawatan alat", "Latihan bersama"],
  plannedEpisodes: [
    { title: "Kampung yang Bersuara", summary: "Tara tiba saat warga melatih ansambel bambu untuk acara panen." },
    { title: "Satu Nada untuk Satu Orang", summary: "Pelajari cara bermain berkelompok, termasuk bagian yang paling sulit: menunggu." },
    { title: "Nada yang Hilang", summary: "Salah satu pemain berhalangan, dan latihan harus dilanjutkan tanpa mengganti orangnya." },
  ],
});

const CHAPTER_3 = plannedChapter({
  id: "ch3",
  index: 3,
  title: "Kain yang Bercerita",
  subtitle: "Motif, proses, dan adab",
  region: "Kampung Girilayu (fiktif) · konteks Jawa",
  theme: "Batik: proses membatik, makna motif, dan adab memakainya",
  premise:
    "Tara bertemu perajin batik yang menolak menjawab satu pertanyaan dengan sederhana: motif ini untuk siapa? Di situ Tara belajar bahwa ada hal yang lebih penting daripada bentuk motif, yaitu siapa yang berhak bercerita tentangnya.",
  teaser: "Batik bukan hanya motif yang dilihat, tetapi proses panjang dan aturan pemakaian yang berbeda-beda.",
  scene: "workbench",
  motif: "kawung",
  requiresEpisode: "e7_refleksi",
  reason: "Bab 3 belum tersedia di prototipe ini.",
  hint: "Selesaikan Bab 1 untuk melihat peta perjalanan lengkapnya.",
  themes: ["Proses membatik", "Makna dan adab pemakaian motif", "Motif yang dibatasi penggunaannya"],
  plannedEpisodes: [
    { title: "Kain Panas", summary: "Tara belajar tentang malam, canting, dan kesabaran tangan." },
    { title: "Motif yang Tidak untuk Semua", summary: "Pelajaran tentang adab: beberapa motif punya aturan siapa yang boleh memakainya." },
    { title: "Warna dari Tumbuhan", summary: "Mencari tahu bagaimana warna diperoleh dan mengapa resepnya bisa berbeda antar perajin." },
  ],
});

const CHAPTER_4 = plannedChapter({
  id: "ch4",
  index: 4,
  title: "Langkah dan Napas",
  subtitle: "Belajar menjaga diri",
  region: "Nagari Sungaibatu (fiktif) · konteks Minangkabau",
  theme: "Pencak silat: langkah, napas, dan adab di tempat latihan",
  premise:
    "Tara mengira silat adalah pertarungan. Ternyata pelajaran pertama yang ia terima adalah tentang menjaga lawan, bukan menjatuhkannya. Tara harus belajar berdiri dengan sabar di tepi gelanggang.",
  teaser: "Pencak silat melatih tubuh sekaligus sikap: siapa yang kamu hadapi dan untuk apa.",
  scene: "hills_dawn",
  motif: "spiral",
  requiresEpisode: "e7_refleksi",
  reason: "Bab 4 belum tersedia di prototipe ini.",
  hint: "Prototype ini berfokus pada Bab 1 terlebih dahulu.",
  themes: ["Langkah dasar dan kuda-kuda", "Adab sebelum dan sesudah berlatih", "Silat sebagai seni dan olah diri"],
  plannedEpisodes: [
    { title: "Gelanggang Pertama", summary: "Tara menyangka akan melihat pertarungan, lalu menemukan pelajaran tentang menghormati lawan." },
    { title: "Napas yang Sama", summary: "Mengapa tempo napas lebih penting daripada tenaga." },
    { title: "Hari Panas, Langkah Pendek", summary: "Belajar menerima bahwa kemampuan tumbuh pelan." },
  ],
});

export const CHAPTERS: Chapter[] = [CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4];

export function getChapter(chapterId: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.id === chapterId);
}

export function getEpisode(chapterId: string, episodeId: string): Episode | undefined {
  return getChapter(chapterId)?.episodes.find((episode) => episode.id === episodeId);
}

export function getNode(episode: Episode, nodeId: string): StoryNode | undefined {
  return episode.nodes.find((node) => node.id === nodeId);
}

export function startNodeOf(episode: Episode): StoryNode | undefined {
  if (episode.startNodeId) {
    const explicit = getNode(episode, episode.startNodeId);
    if (explicit) return explicit;
  }
  return episode.nodes[0];
}

export function allEpisodes(): { chapter: Chapter; episode: Episode }[] {
  return CHAPTERS.flatMap((chapter) => chapter.episodes.map((episode) => ({ chapter, episode })));
}

export function chapterOfEpisode(episodeId: string): Chapter | undefined {
  return CHAPTERS.find((chapter) => chapter.episodes.some((episode) => episode.id === episodeId));
}
