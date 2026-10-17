import type { Character, SpeakerId } from "@/lib/types";

/**
 * Tokoh yang bisa berbicara dalam cerita.
 * Lima tokoh pertama (tara, ndari, wagiman, rukmini, kakek) adalah tokoh
 * fiktif untuk prototype ini; penanda `fictional` dipakai UI untuk
 * memberi label kejujuran kepada pemain.
 */
export const CHARACTERS: Record<SpeakerId, Character> = {
  tara: {
    id: "tara",
    name: "Tara",
    role: "Garuda kecil, juru cerita yang sedang belajar",
    blurb:
      "Garuda kecil yang penasaran, suka melucu, dan mudah ikut merasa saat orang lain bercerita. Ia belum banyak tahu soal budaya Nusantara dan memilih jujur soal itu daripada berpura-pura paham.",
    color: "#E9B949",
    avatar: "tara",
    fictional: true,
  },
  ndari: {
    id: "ndari",
    name: "Ndari",
    role: "Anak desa, 10 tahun",
    blurb:
      "Anak desa sepuluh tahun yang bicara cepat dan sulit berhenti bertanya. Ia mengoleksi cerita rakyat dari siapa pun yang mau bercerita, termasuk versi-versi yang berbeda-beda.",
    color: "#7DD3FC",
    avatar: "ndari",
    fictional: true,
  },
  wagiman: {
    id: "wagiman",
    name: "Pak Wagiman",
    role: "Dalang dan penjaga cerita desa",
    blurb:
      "Dalang desa yang sabar dan lebih sering balik bertanya daripada menceramahi. Ia menjaga cerita-cerita Candrageni dan senang kalau ada orang yang benar-benar ingin belajar.",
    color: "#C4B5FD",
    avatar: "wagiman",
    fictional: true,
  },
  rukmini: {
    id: "rukmini",
    name: "Bu Rukmini",
    role: "Pemain gamelan dan sinden",
    blurb:
      "Pemain gamelan dan sinden yang praktis, teliti soal bunyi, dan tajam dalam berkelakar. Ilmu bermusiknya ia pelajari langsung dari ibunya, bukan dari buku.",
    color: "#6EE7B7",
    avatar: "rukmini",
    fictional: true,
  },
  kakek: {
    id: "kakek",
    name: "Kakek Wira",
    role: "Juru cerita yang sudah berpulang (kenangan Tara)",
    blurb:
      "Juru cerita keluarga Tara yang sudah berpulang dan kini hadir lewat kenangan serta buku catatan tuanya. Kalimat-kalimatnya selalu muncul kembali saat Tara paling membutuhkannya.",
    color: "#FCD34D",
    avatar: "kakek",
    fictional: true,
  },
  narrator: {
    id: "narrator",
    name: "Narasi",
    role: "Suara penutur",
    blurb: "Suara penutur yang menemani adegan-adegan dalam cerita.",
    color: "#CBD5E1",
    avatar: "none",
    fictional: false,
  },
  player: {
    id: "player",
    name: "Kamu",
    role: "Pendamping Tara",
    blurb: "Suara pendamping Tara, tempatmu ikut bereaksi di tengah cerita.",
    color: "#F4EADB",
    avatar: "none",
    fictional: false,
  },
};

/** Tokoh yang ikut tampil di panggung cerita utama. */
export const STORY_CAST: SpeakerId[] = ["tara", "ndari", "wagiman", "rukmini"];
