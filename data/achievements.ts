import type { Achievement } from "@/lib/types";

/**
 * Pencapaian prototype.
 * `description` adalah hal yang dilihat pemain, `criterion` adalah catatan
 * jujur tentang apa yang sebenarnya terekam di aplikasi.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach_curious_mind",
    title: "Pikiran Penasaran",
    description:
      "Satu tantangan pengetahuan sudah kamu lewati — langkah pertama yang bagus.",
    criterion:
      "Mencatat bahwa kamu menyelesaikan tantangan pengetahuan pertama di aplikasi ini — bukan bukti keahlian budaya.",
    motif: "star",
  },
  {
    id: "ach_careful_observer",
    title: "Pengamat Teliti",
    description:
      "Ada petunjuk kecil yang hanya terlihat oleh mata yang sabar, dan kamu menemukannya.",
    criterion:
      "Mencatat bahwa kamu menemukan petunjuk tersembunyi pertama di sebuah adegan pengamatan — bukan penilaian atas ketelitianmu sehari-hari.",
    motif: "eye",
  },
  {
    id: "ach_detail_hunter",
    title: "Mata Elang",
    description: "Kamu menyisir satu adegan sampai tak ada detail yang tertinggal.",
    criterion:
      "Mencatat bahwa kamu menemukan semua detail yang tersedia dalam satu adegan pengamatan — bukan ukuran kemampuan mengamati secara umum.",
    motif: "kawung",
    hidden: true,
  },
  {
    id: "ach_good_listener",
    title: "Pendengar Baik",
    description: "Kamu memilih mendengar dulu sebelum menilai.",
    criterion:
      "Mencatat bahwa kamu memilih mendengarkan atau meminta penjelasan dari tokoh cerita — ini pilihan di dalam cerita, bukan perilaku nyata yang terukur.",
    motif: "wave",
  },
  {
    id: "ach_open_hands",
    title: "Sayap yang Terbuka",
    description: "Kamu mengulurkan bantuan tanpa diminta.",
    criterion:
      "Mencatat pilihan cerita saat kamu menawarkan bantuan kepada warga — bukan bukti kontribusi nyata di dunia luar.",
    motif: "leaf",
  },
  {
    id: "ach_first_practice",
    title: "Praktik Pertama",
    description:
      "Latihan pertamamu sudah dilaporkan — kebiasaan baik dimulai dari satu langkah.",
    criterion:
      "Mencatat laporanmu sendiri bahwa satu practice quest selesai; aplikasi tidak memverifikasi apa yang kamu lakukan di luar.",
    motif: "gong",
  },
  {
    id: "ach_culture_connector",
    title: "Penghubung Budaya",
    description:
      "Kamu mulai mencatat sumber dan komunitas budaya yang bisa kamu hubungi lagi.",
    criterion:
      "Mencatat bahwa kamu menuliskan satu sumber atau komunitas budaya — aplikasi tidak menilai ketepatan sumber tersebut.",
    motif: "thread",
  },
  {
    id: "ach_story_keeper",
    title: "Penjaga Cerita",
    description: "Satu bab selesai dan kamu ikut duduk sebentar di refleksi Tara.",
    criterion:
      "Mencatat bahwa kamu menyelesaikan satu bab dan membaca refleksi Tara — bukan tanda pemahaman menyeluruh atas isi bab.",
    motif: "book",
  },
  {
    id: "ach_reflective_writer",
    title: "Penulis Catatan",
    description: "Dua catatan kecil sudah kamu tuliskan di jurnalmu.",
    criterion:
      "Mencatat bahwa kamu menulis dua refleksi di jurnal — bukan penilaian atas mutu tulisanmu.",
    motif: "lamp",
    hidden: true,
  },
  {
    id: "ach_journey_collector",
    title: "Jejak Penjelajah",
    description: "Sepuluh jejak sudah tersimpan rapi di koleksimu.",
    criterion:
      "Mencatat bahwa sepuluh item koleksi sudah terkumpul di aplikasi ini — bukan ukuran keluasan pengetahuanmu.",
    motif: "spiral",
  },
];
