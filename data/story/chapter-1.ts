/**
 * BAB 1 — "Jejak Pertama"
 * Desa Candrageni (desa fiktif) · konteks wayang kulit (informasi umum)
 *
 * Semua tokoh dan desa dalam bab ini adalah fiksi. Informasi budaya yang
 * muncul dijaga tetap umum dan diberi label sumber di dalam Collection.
 */

import type { Chapter, Episode, StoryNode } from "@/lib/types";

const CHAPTER_ID = "ch1";

/* ============================================================
 * EPISODE 1 — Kedatangan
 * ============================================================ */

const e1: StoryNode[] = [
  {
    id: "e1-n1",
    episodeId: "e1_kedatangan",
    type: "script",
    scene: "hills_dawn",
    showTara: true,
    label: "Pembuka: langit pagi",
    lines: [
      {
        speaker: "narrator",
        text: "Langit timur masih pucat ketika Tara menembus kabut terakhir di atas perbukitan.",
      },
      {
        speaker: "narrator",
        text: "Sayapnya berat. Perutnya kosong. Dan di dalam tas kecilnya, sebuah buku catatan tua bergoyang mengikuti angin.",
      },
      {
        speaker: "tara",
        expression: "curious",
        text: "Kakek Wira bilang, perjalanan ini bukan tentang mencari tempat baru.",
      },
      {
        speaker: "tara",
        expression: "confused",
        text: "Katanya aku sedang mencari arti dari kata-kata yang belum kupahami. Sayangnya… aku belum tahu harus mulai dari mana, {player}.",
      },
    ],
    next: "e1-n2",
  },
  {
    id: "e1-n2",
    episodeId: "e1_kedatangan",
    type: "script",
    scene: "hills_dawn",
    showTara: true,
    lines: [
      {
        speaker: "narrator",
        text: "Di bawah sana, beberapa atap kayu mengeluarkan asap tipis. Ada cahaya lampu bergerak di antara pepohonan.",
      },
      {
        speaker: "tara",
        expression: "curious",
        text: "Sebuah desa. Kecil, tapi hidup. Ada bunyi… seperti logam dipukul pelan, lalu berhenti.",
      },
      {
        speaker: "tara",
        expression: "warm",
        text: "Aku mendarat sebentar. Kalau ternyata mereka tidak suka burung besar datang tanpa diundang, aku masih bisa terbang lagi.",
      },
    ],
    next: "e1-n3",
  },
  {
    id: "e1-n3",
    episodeId: "e1_kedatangan",
    type: "choice",
    scene: "hills_dawn",
    showTara: true,
    label: "Pilihan pendekatan pertama",
    lines: [
      {
        speaker: "narrator",
        text: "Angin membawa bau kayu bakar dan dedaunan. Tara menajamkan pandangan.",
      },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Bagaimana cara terbaik masuk ke tempat baru?",
      },
    ],
    prompt: "Bagaimana Tara mendekati desa ini?",
    footnote: "Tidak ada pilihan yang salah. Setiap cara membuka percakapan yang berbeda.",
    options: [
      {
        id: "land_tree",
        label: "Bertengger di pohon besar dan mengamati dulu",
        hint: "Dengarkan situasinya sebelum masuk",
        tone: "observe",
        effects: { flags: { tone_careful: true } },
        reaction: {
          expression: "thinking",
          text: "Tara memilih menunggu. Sayapnya terlipat rapi, matanya mengikuti setiap gerak di bawah sana. Tidak ada yang menyadari ia ada di sana — untuk sekarang.",
        },
        next: "e1-n4a",
      },
      {
        id: "dive",
        label: "Terbang langsung ke halaman desa",
        hint: "Berani, tanpa banyak menunggu",
        tone: "neutral",
        effects: { flags: { tone_bold: true } },
        reaction: {
          expression: "surprised",
          text: "Tara menukik cepat dan mendarat dengan bunyi berdebum kecil. Debu beterbangan. Beberapa orang menoleh — dan Tara langsung menyesuaikan bulunya seolah tidak terjadi apa-apa.",
        },
        next: "e1-n4b",
      },
      {
        id: "seek_person",
        label: "Mencari seseorang yang tampak ramah",
        hint: "Mulai dari wajah, bukan dari tempat",
        tone: "ask",
        effects: { flags: { tone_friendly: true } },
        reaction: {
          expression: "warm",
          text: "Tara terbang rendah, memilih satu orang yang sedang tersenyum sendirian. Cara paling aman untuk memulai percakapan.",
        },
        next: "e1-n4c",
      },
    ],
  },
  {
    id: "e1-n4a",
    episodeId: "e1_kedatangan",
    type: "script",
    scene: "village_gate",
    showTara: true,
    condition: { kind: "flag", flag: "tone_careful" },
    lines: [
      {
        speaker: "narrator",
        text: "Dari balik daun-daun beringin, Tara melihat orang-orang mengangkat sesuatu yang panjang dan putih.",
      },
      {
        speaker: "tara",
        expression: "curious",
        text: "Kain? Layar? Mereka menyimpannya di bawah pendopo. Ada juga batang besar yang dipotong-potong.",
      },
      {
        speaker: "tara",
        expression: "warm",
        text: "Dari sini aku bisa mendengar nada bicaranya: santai, seperti sesuatu yang sudah biasa mereka kerjakan.",
      },
    ],
    next: "e1-n5",
  },
  {
    id: "e1-n4b",
    episodeId: "e1_kedatangan",
    type: "script",
    scene: "village_gate",
    showTara: true,
    condition: { kind: "flag", flag: "tone_bold" },
    lines: [
      {
        speaker: "narrator",
        text: "Kepulan debu merata di halaman. Seorang perempuan berhenti mengelap bilah logam dan menatap Tara tanpa kedip.",
      },
      {
        speaker: "narrator",
        text: "Tara mengangkat satu sayap, berusaha terdengar sopan.",
      },
      {
        speaker: "tara",
        expression: "warm",
        text: "Selamat pagi! Aku lewat, dan… kebetulan melihat ada persiapan. Boleh aku melihat sebentar?",
      },
    ],
    next: "e1-n5",
  },
  {
    id: "e1-n4c",
    episodeId: "e1_kedatangan",
    type: "script",
    scene: "village_gate",
    showTara: true,
    condition: { kind: "flag", flag: "tone_friendly" },
    lines: [
      {
        speaker: "narrator",
        text: "Di tepi halaman, seorang anak sedang menggambar sesuatu di tanah dengan ranting, lalu menghapusnya dengan kaki.",
      },
      {
        speaker: "tara",
        expression: "curious",
        text: "Anak itu terlihat seperti orang yang paling banyak tahu, tapi paling sedikit ditanyai.",
      },
      {
        speaker: "tara",
        expression: "warm",
        text: "Aku akan mulai dari dia.",
      },
    ],
    next: "e1-n5",
  },
  {
    id: "e1-n5",
    episodeId: "e1_kedatangan",
    type: "script",
    scene: "village_gate",
    showTara: true,
    cast: ["ndari"],
    lines: [
      { speaker: "ndari", text: "Waaa! Burung! Burung besar datang dari mana?" },
      { speaker: "tara", expression: "surprised", text: "Aku… bukan burung besar biasa. Namaku Tara." },
      { speaker: "ndari", text: "Tara! Aku Ndari. Kau datang tepat pada hari yang ramai. Nanti malam ada pertunjukan ringgit." },
      {
        speaker: "tara",
        expression: "confused",
        text: "Ringgit? Itu… bukan nama uang?",
      },
      {
        speaker: "ndari",
        text: "Bukan! Ringgit itu yang di layar itu — yang bergerak-gerak. Kalau kau sabar, sebentar lagi kau akan lihat sendiri.",
      },
      {
        speaker: "narrator",
        text: "Tara mengangguk pelan, lalu diam-diam mengusap kantong tasnya. Ada satu kata baru, dan ia belum tahu artinya.",
      },
    ],
    next: "e1-n6",
  },
  {
    id: "e1-n6",
    episodeId: "e1_kedatangan",
    type: "reward",
    scene: "village_gate",
    showTara: true,
    label: "Kata baru & pertemuan",
    title: "Satu kata masuk ke buku catatan",
    subtitle: "Kata yang belum dipahami itu tetap dicatat. Tara senang mencatat, walau isinya masih tanda tanya.",
    lines: [
      { speaker: "tara", expression: "curious", text: "Ringgit. Baiklah. Aku belum tahu artinya, tapi aku tidak akan pura-pura tahu." },
    ],
    effects: {
      flags: { met_ndari: true },
      knowledgeXp: 10,
      unlockCollection: ["vocab_ringgit"],
      journal: ["j1_hari_pertama"],
    },
    next: "e1-n7",
  },
  {
    id: "e1-n7",
    episodeId: "e1_kedatangan",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["ndari"],
    lines: [
      {
        speaker: "narrator",
        text: "Hari masih muda. Ndari menyeret Tara ke arah halaman desa, sambil menjelaskan hal-hal yang sebenarnya tidak ditanyakan siapa pun.",
      },
      {
        speaker: "ndari",
        text: "Hari ini semua jadi sibuk. Kau belum pernah lihat persiapan cara orang sini, kan?",
      },
      { speaker: "tara", expression: "determined", text: "Belum. Ajar aku melihatnya dengan benar." },
    ],
    next: null,
  },
];

const episode1: Episode = {
  id: "e1_kedatangan",
  chapterId: CHAPTER_ID,
  index: 1,
  title: "Kedatangan",
  summary:
    "Tara tiba di Desa Candrageni dengan tas berisi buku catatan Kakek Wira dan satu kata yang belum ia pahami.",
  scene: "hills_dawn",
  duration: "±4 menit",
  nodes: e1,
};

/* ============================================================
 * EPISODE 2 — Berkumpul
 * ============================================================ */

const e2: StoryNode[] = [
  {
    id: "e2-n1",
    episodeId: "e2_berkumpul",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["ndari"],
    lines: [
      {
        speaker: "narrator",
        text: "Halaman desa ramai. Orang mengangkat batang kayu, menata tikar, dan seorang perempuan mengelap bilah-bilah logam dengan kain kering.",
      },
      {
        speaker: "tara",
        expression: "curious",
        text: "Jadi ini yang disebut bersiap. Semua bergerak, tapi tidak ada yang tampak kebingungan.",
      },
      {
        speaker: "ndari",
        text: "Cepat lihat! Kalau kau berkedip, mereka selesai sebelum kau sempat menyadarinya.",
      },
    ],
    next: "e2-n2a",
  },
  {
    id: "e2-n2a",
    episodeId: "e2_berkumpul",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["ndari"],
    condition: { kind: "flag", flag: "tone_bold" },
    lines: [
      {
        speaker: "ndari",
        text: "Tadi kau mendarat di tengah halaman dengan bunyi gedebum. Berani sekali. Semua orang mengira ada gerobak jatuh.",
      },
      { speaker: "tara", expression: "happy", text: "Aku akan menganggap itu pujian." },
    ],
    next: "e2-n2b",
  },
  {
    id: "e2-n2b",
    episodeId: "e2_berkumpul",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["ndari"],
    condition: { kind: "flag", flag: "tone_careful" },
    lines: [
      {
        speaker: "ndari",
        text: "Aku melihat kau di pohon itu sejak pagi. Kau mengamati lama sekali.",
      },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Di tempat baru, aku lebih suka tahu dulu ke mana orang berjalan sebelum ikut berjalan.",
      },
      { speaker: "ndari", text: "Hm. Orang dewasa di sini juga begitu sebelum bicara." },
    ],
    next: "e2-n2c",
  },
  {
    id: "e2-n2c",
    episodeId: "e2_berkumpul",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["ndari"],
    condition: { kind: "flag", flag: "tone_friendly" },
    lines: [
      {
        speaker: "ndari",
        text: "Kau memilihku karena aku sedang sendirian, ya? Aku memang paling ramah di desa ini. Menurutku sendiri.",
      },
      { speaker: "tara", expression: "happy", text: "Menurutku pun begitu." },
    ],
    next: "e2-n3",
  },
  {
    id: "e2-n3",
    episodeId: "e2_berkumpul",
    type: "observation",
    scene: "village_square",
    showTara: true,
    cast: ["ndari"],
    label: "Adegan pengamatan pertama",
    lines: [
      {
        speaker: "ndari",
        text: "Kalau kau ingin tahu sesuatu, jangan lihat yang paling besar saja. Yang penting biasanya kecil.",
      },
      { speaker: "tara", expression: "curious", text: "Baik. Aku akan memperhatikan yang kecil." },
    ],
    instruction: "Ketuk bagian gambar yang ingin kamu periksa. Cukup temukan tiga untuk melanjutkan.",
    backdrop: "village_square",
    requiredCount: 3,
    hotspots: [
      {
        id: "kelir",
        label: "Kain yang dibentangkan",
        x: 52,
        y: 38,
        kind: "info",
        text: "Sebuah kain lebar dibentangkan pada bingkai kayu. Orang-orang menyebutnya kelir. Nanti malam, bayangan akan jatuh di permukaannya.",
        effects: { unlockCollection: ["vocab_kelir"] },
      },
      {
        id: "gamelan",
        label: "Deretan bilah logam",
        x: 76,
        y: 62,
        kind: "info",
        text: "Bilah logam yang ditata di atas rak kayu. Seorang perempuan bergantian memukulnya pelan, mendengarkan, lalu memutar sedikit pasaknya.",
        effects: { unlockCollection: ["perf_gamelan"] },
      },
      {
        id: "gedebog",
        label: "Batang pisang yang dipotong",
        x: 26,
        y: 70,
        kind: "clue",
        text: "Sebuah batang pisang dipotong memanjang dan dibaringkan di depan layar. Permukaannya penuh lubang kecil. Tara belum tahu untuk apa lubang itu.",
        effects: { flags: { observed_scene_clue: true }, unlockCollection: ["craft_gedebog"] },
      },
      {
        id: "kothak",
        label: "Kotak kayu panjang",
        x: 16,
        y: 52,
        kind: "info",
        text: "Satu kotak kayu panjang ditutup rapat dengan kain. Sebagian orang lewat dan menyentuhnya pelan, seperti menyapa.",
        effects: { unlockCollection: ["craft_kothak"] },
      },
      {
        id: "tangan_dalang",
        label: "Tangan yang sibuk di balik layar",
        x: 50,
        y: 22,
        kind: "clue",
        text: "Di balik layar, seorang laki-laki tua memeriksa bilah-bilah tipis pada tangan sebuah boneka. Ia menggerakkannya naik turun, lalu mengangguk puas.",
        effects: { flags: { observed_scene_clue: true }, unlockCollection: ["vocab_cempurit"] },
      },
    ],
    effects: {
      knowledgeXp: 25,
    },
    next: "e2-n4",
  },
  {
    id: "e2-n4",
    episodeId: "e2_berkumpul",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["wagiman"],
    label: "Perkenalan Pak Wagiman",
    lines: [
      {
        speaker: "narrator",
        text: "Laki-laki tua itu keluar dari balik layar sambil mengelap tangannya.",
      },
      {
        speaker: "wagiman",
        text: "Kau tamu kami, ya? Aku Wagiman. Orang di sini memanggilku dalang — orang yang nanti bercerita di balik layar.",
      },
      { speaker: "tara", expression: "curious", text: "Dalang. Jadi… bukan bonekanya yang bercerita?" },
      {
        speaker: "wagiman",
        text: "Boneka tidak bisa bicara. Ia hanya bergerak. Yang bicara dan yang menjaga alur cerita itu tanganku.",
      },
    ],
    effects: { flags: { met_dalang: true } },
    next: "e2-n5",
  },
  {
    id: "e2-n5",
    episodeId: "e2_berkumpul",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["wagiman"],
    condition: { kind: "flag", flag: "observed_scene_clue" },
    lines: [
      {
        speaker: "wagiman",
        text: "Tapi kau mengamati batang pisang dan tanganku lebih lama daripada layarnya. Itu jarang terjadi.",
      },
      {
        speaker: "tara",
        expression: "happy",
        text: "Aku belum tahu namanya, tapi lubang-lubang itu membuatku penasaran.",
      },
      { speaker: "wagiman", text: "Orang yang penasaran pada hal kecil biasanya belajar lebih banyak. Duduk sebentar nanti, aku jelaskan." },
    ],
    next: "e2-n6",
  },
  {
    id: "e2-n6",
    episodeId: "e2_berkumpul",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["rukmini"],
    label: "Perkenalan Bu Rukmini",
    lines: [
      {
        speaker: "narrator",
        text: "Perempuan yang tadi mengelap bilah logam mendekat, membawa satu bilah kecil di tangan.",
      },
      {
        speaker: "rukmini",
        text: "Rukmini. Aku yang memukul alat-alat ini, dan kadang aku yang menyanyi di belakang dalang. Kau boleh duduk dekat, tapi jangan duduk di atas gamelan.",
      },
      { speaker: "tara", expression: "surprised", text: "Aku… tidak bermaksud duduk di mana pun. Aku hanya ingin tahu." },
      { speaker: "rukmini", text: "Bagus. Yang duduk diam dan bertanya itu jarang dikirim pulang." },
    ],
    effects: { flags: { met_sinden: true } },
    next: "e2-n7",
  },
  {
    id: "e2-n7",
    episodeId: "e2_berkumpul",
    type: "reward",
    scene: "village_square",
    showTara: true,
    label: "Nama-nama baru",
    title: "Tiga nama tercatat di buku",
    subtitle: "Dalang, gamelan, kelir — semuanya masih istilah. Tara harus mencari tahu artinya satu per satu.",
    lines: [
      {
        speaker: "tara",
        expression: "thinking",
        text: "Kalau aku mencatat namanya lebih dulu, setidaknya aku tidak perlu malu bertanya nanti.",
      },
    ],
    effects: {
      knowledgeXp: 15,
      unlockCollection: ["vocab_dalang", "vocab_sinden"],
    },
    next: "e2-n8",
  },
  {
    id: "e2-n8",
    episodeId: "e2_berkumpul",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["wagiman"],
    lines: [
      {
        speaker: "wagiman",
        text: "Pertunjukan mulai nanti menjelang malam. Sementara kami menyiapkan semuanya, apa yang ingin kau lakukan?",
      },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Bertanya, mengamati, atau membantu. Semuanya terdengar sama menariknya.",
      },
    ],
    next: null,
  },
];

const episode2: Episode = {
  id: "e2_berkumpul",
  chapterId: CHAPTER_ID,
  index: 2,
  title: "Berkumpul",
  summary:
    "Warga desa menyiapkan pertunjukan malam ini. Tara berkenalan dengan Pak Wagiman si dalang dan Bu Rukmini yang mengurus gending.",
  scene: "village_square",
  duration: "±6 menit",
  nodes: e2,
};

/* ============================================================
 * EPISODE 3 — Pilihan
 * ============================================================ */

const e3: StoryNode[] = [
  {
    id: "e3-n1",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["wagiman", "rukmini", "ndari"],
    lines: [
      {
        speaker: "narrator",
        text: "Sore mengubah warna halaman desa menjadi keemasan. Tara berdiri di antara tiga kemungkinan yang sama menariknya.",
      },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Tidak ada yang salah dari ketiganya. Tapi yang kupilih sekarang akan menentukan apa yang aku bawa pulang nanti.",
      },
    ],
    next: "e3-n2",
  },
  {
    id: "e3-n2",
    episodeId: "e3_pilihan",
    type: "choice",
    scene: "village_square",
    showTara: true,
    cast: ["wagiman", "rukmini", "ndari"],
    label: "Pilihan inti bab 1",
    prompt: "Apa yang Tara lakukan sambil menunggu pertunjukan dimulai?",
    footnote:
      "Pilihan ini tidak mengunci cerita. Yang berubah adalah apa yang Tara pahami, siapa yang ia kenal, dan misi yang terbuka untukmu.",
    options: [
      {
        id: "ask",
        label: "Bertanya kepada Pak Wagiman tentang pertunjukan ini",
        hint: "Kadang jawaban hanya datang pada orang yang berani bertanya",
        tone: "ask",
        tag: "Pertanyaan",
        effects: { flags: { asked_about_tradition: true } },
        reaction: {
          expression: "curious",
          text: "Tara menghampiri Pak Wagiman dan bertanya sebelum sempat mengatur napas. Ia memilih kata-katanya hati-hati, supaya tidak terdengar seperti orang yang tahu segalanya.",
        },
        next: "e3-ask1",
      },
      {
        id: "observe",
        label: "Mengamati persiapan dari dekat",
        hint: "Perhatikan hal kecil yang mungkin tidak dibahas orang",
        tone: "observe",
        tag: "Pengamatan",
        effects: { flags: { observed_scene_clue: true } },
        reaction: {
          expression: "thinking",
          text: "Tara duduk di palang kayu rendah dan mulai menghitung: berapa kali orang mengelap alat musik, di mana lampu diletakkan, apa yang diperiksa Pak Wagiman berulang-ulang.",
        },
        next: "e3-obs1",
      },
      {
        id: "offer_help",
        label: "Menawarkan bantuan kepada warga",
        hint: "Sayapnya kecil, tapi ia punya tenaga",
        tone: "help",
        tag: "Bantuan",
        effects: { flags: { offered_help: true } },
        reaction: {
          expression: "determined",
          text: "Tara melangkah ke tengah kesibukan dan mengangkat satu ujung tali. Tidak ada yang memintanya. Bu Rukmini menoleh, menahan senyum, lalu menunjuk tumpukan kain.",
        },
        next: "e3-help1",
      },
    ],
  },

  /* --- Cabang: BERTANYA --- */
  {
    id: "e3-ask1",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["wagiman"],
    condition: { kind: "flag", flag: "asked_about_tradition" },
    lines: [
      { speaker: "tara", expression: "curious", text: "Pak Wagiman, apa yang sebenarnya terjadi nanti malam?" },
      {
        speaker: "wagiman",
        text: "Orang menyebutnya wayang kulit. Aku memainkan wayang, menceritakan kisahnya, dan memberi tanda kepada para pengiring musik supaya kami berhenti dan mulai pada waktu yang sama.",
      },
      { speaker: "tara", expression: "surprised", text: "Kau melakukan semuanya sekaligus?" },
      {
        speaker: "wagiman",
        text: "Pertunjukan bisa berjalan dari sore sampai pagi. Kalau penontonnya masih duduk, kenapa harus cepat?",
      },
    ],
    next: "e3-ask2",
  },
  {
    id: "e3-ask2",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["wagiman"],
    condition: { kind: "flag", flag: "asked_about_tradition" },
    lines: [
      { speaker: "tara", expression: "curious", text: "Dan kenapa layarnya harus putih, sedangkan lampunya di belakang?" },
      {
        speaker: "wagiman",
        text: "Karena penonton melihat bayangannya, bukan bonekanya. Kain itu namanya kelir. Lampu menentukan bayangan mana yang tampak jelas dan mana yang samar.",
      },
      {
        speaker: "wagiman",
        text: "Jadi bayangan pun bisa dipakai bercerita. Kalau aku menggeser wayangnya sedikit saja, bayangannya berubah, dan penonton tahu ada yang sedang bergerak.",
      },
    ],
    next: "e3-ask3",
  },
  {
    id: "e3-ask3",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["wagiman"],
    condition: { kind: "flag", flag: "asked_about_tradition" },
    lines: [
      { speaker: "tara", expression: "curious", text: "Kisah apa yang kau mainkan malam ini?" },
      {
        speaker: "wagiman",
        text: "Banyak cerita wayang datang dari kisah lama: Ramayana dan Mahabharata. Kisah itu sudah berjalan jauh dari tempat asalnya, lalu berubah di sini lewat generasi demi generasi.",
      },
      {
        speaker: "wagiman",
        text: "Di sini mereka bertemu tokoh-tokoh yang tidak ada di kisah aslinya. Para pelayan yang lucu, kadang lebih bijak dari rajanya. Orang desa suka mereka.",
      },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Jadi ceritanya bukan hanya diwarisi… tapi juga ditambahkan. Dicatat.",
      },
    ],
    next: "e3-ask4",
  },
  {
    id: "e3-ask4",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["wagiman"],
    condition: { kind: "flag", flag: "asked_about_tradition" },
    lines: [
      {
        speaker: "wagiman",
        text: "Wayang ini dibuat dari kulit yang dikeringkan, lalu ditatah diukir dan disungging diwarnai. Butuh berhari-hari, kadang berminggu-minggu untuk satu tokoh.",
      },
      { speaker: "tara", expression: "surprised", text: "Satu tokoh saja?" },
      {
        speaker: "wagiman",
        text: "Karena waktu tidak boleh dipaksa. Kalau kerajinannya mengerjakan tiga sekaligus tanpa melihat, hasilnya kelihatan di bayangannya.",
      },
    ],
    effects: {
      flags: { learned_craft_note: true },
      unlockCollection: ["craft_tatah_sungging"],
    },
    next: "e3-ask5",
  },
  {
    id: "e3-ask5",
    episodeId: "e3_pilihan",
    type: "reward",
    scene: "pendopo_dusk",
    showTara: true,
    label: "Cabang bertanya selesai",
    title: "Paham sedikit — lalu ingin lebih banyak",
    subtitle:
      "Tara mengerti kerangka besarnya sekarang. Tapi masih banyak istilah yang perlu dicocokkan dengan maknanya.",
    lines: [
      { speaker: "tara", expression: "determined", text: "Aku perlu menuliskan nama-nama itu dengan benar sebelum lupa." },
    ],
    effects: {
      knowledgeXp: 20,
      unlockQuests: ["sq_makna_bayangan"],
      unlockCollection: ["perf_wayang_kulit"],
    },
    next: "e3-join",
  },

  /* --- Cabang: MENGAMATI --- */
  {
    id: "e3-obs1",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["rukmini"],
    condition: { kind: "flag", flag: "observed_scene_clue" },
    lines: [
      {
        speaker: "narrator",
        text: "Tara duduk jauh dari keramaian. Dari sana ia bisa melihat sesuatu yang hilang ketika orang sibuk: bunyi.",
      },
      { speaker: "tara", expression: "curious", text: "Alat itu dipukul dua kali sebelum dimainkan. Kenapa?" },
    ],
    next: "e3-obs2",
  },
  {
    id: "e3-obs2",
    episodeId: "e3_pilihan",
    type: "listening",
    scene: "pendopo_dusk",
    showTara: true,
    label: "Adegan mendengarkan",
    condition: { kind: "flag", flag: "observed_scene_clue" },
    lines: [
      {
        speaker: "narrator",
        text: "Bunyi-bunyi persiapan datang satu per satu, seperti percakapan yang tidak memakai kata.",
      },
    ],
    instruction:
      "Ketuk setiap bunyi untuk mendengarkannya. Bunyi ini disintesis oleh aplikasi, jadi ini pendekatan, bukan rekaman asli desa.",
    entries: [
      {
        id: "saron_tune",
        label: "Bilah logam yang disetel",
        phonetics: "saron",
        meaning: "Bilah logam, dipukul dengan pemukul kayu",
        note: "Yang tadi Tara dengar dua kali sebelum dimainkan: pemain mengecek bunyinya.",
        sound: "saron",
      },
      {
        id: "gong_test",
        label: "Bunyi rendah yang panjang",
        phonetics: "gong",
        meaning: "Gong, dipakai untuk menandai bagian penting pertunjukan",
        note: "Bunyinya membuat dada Tara bergetar walau dipukul pelan.",
        sound: "gong",
      },
      {
        id: "kenong_tune",
        label: "Gemuruh kecil yang menggantung",
        phonetics: "kenong",
        meaning: "Kenong, berbentuk seperti bejana kecil dan ditumpuk",
        note: "Bu Rukmini memukulnya sekali, lalu menunggu sampai bunyinya habis sebelum bicara.",
        sound: "kenong",
      },
      {
        id: "kepyak_test",
        label: "Bunyi kayu dipukul berirama",
        phonetics: "kepyak",
        meaning: "Seperangkat lempeng yang diinjak dalang untuk menjaga tempo",
        note: "Bunyi ini datang dari bawah kaki Pak Wagiman, bukan dari tangannya.",
        sound: "kepyak",
      },
    ],
    effects: { unlockCollection: ["perf_kepyak"], knowledgeXp: 15 },
    next: "e3-obs3",
  },
  {
    id: "e3-obs3",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["rukmini"],
    condition: { kind: "flag", flag: "observed_scene_clue" },
    lines: [
      {
        speaker: "tara",
        expression: "confused",
        text: "Bu Rukmini, tadi ada bunyi dari bawah kaki Pak Wagiman. Seperti alat makan dipukul-pukulkan.",
      },
      { speaker: "rukmini", text: "Alat makan! Jangan bilang itu di depan dalang dari desa sebelah." },
      {
        speaker: "rukmini",
        text: "Itu kepyak. Ia menginjaknya dengan kaki supaya tempo tetap jalan, sementara kedua tangannya memegang wayang.",
      },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Jadi dalang itu memakai tangan, kaki, suara, dan ingatan sekaligus.",
      },
      { speaker: "rukmini", text: "Sekarang kau mengerti kenapa dalang boleh minum teh dulu sebelum mulai." },
    ],
    next: "e3-obs4",
  },
  {
    id: "e3-obs4",
    episodeId: "e3_pilihan",
    type: "reward",
    scene: "pendopo_dusk",
    showTara: true,
    label: "Cabang mengamati selesai",
    title: "Telinga menemukan hal yang mata lewatkan",
    subtitle: "Tara mencatat bunyi yang belum ada namanya, lalu mendapatkan namanya satu per satu.",
    lines: [
      {
        speaker: "tara",
        expression: "curious",
        text: "Besok aku mau tahu, apa lagi yang orang sini dengar tapi tidak mereka sebutkan.",
      },
    ],
    effects: {
      knowledgeXp: 20,
      unlockQuests: ["sq_makna_bayangan"],
    },
    next: "e3-join",
  },

  /* --- Cabang: MEMBANTU --- */
  {
    id: "e3-help1",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["rukmini"],
    condition: { kind: "flag", flag: "offered_help" },
    lines: [
      {
        speaker: "narrator",
        text: "Bu Rukmini menunjuk tumpukan kain panjang dan dua utas tali. Tidak ada yang menawar pekerjaan itu — Tara mengambilnya sendiri.",
      },
      {
        speaker: "rukmini",
        text: "Bawa kain ini ke dekat layar, lipat dua kali, jangan sampai ujungnya menyentuh tanah. Tanah sini lembap.",
      },
      {
        speaker: "tara",
        expression: "determined",
        text: "Aku bisa mengangkatnya dengan satu kaki. Mungkin. Kita lihat saja.",
      },
    ],
    next: "e3-help2",
  },
  {
    id: "e3-help2",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["rukmini", "wagiman"],
    condition: { kind: "flag", flag: "offered_help" },
    lines: [
      {
        speaker: "narrator",
        text: "Bersama dua warga lain, Tara merentangkan kain layar sampai tegang. Ternyata kain itu berat, dan ternyata ada cara membuatnya tidak berkerut: ditarik bersama-sama, sama rata.",
      },
      {
        speaker: "wagiman",
        text: "Kalau satu orang menarik terlalu keras, layarnya miring. Jadi kami tidak pernah memasangnya sendiri.",
      },
      {
        speaker: "tara",
        expression: "curious",
        text: "Jadi pekerjaan yang paling penting justru yang dikerjakan beramai-ramai?",
      },
      { speaker: "wagiman", text: "Di desa ini, begitu caranya hal-hal berat diselesaikan." },
    ],
    effects: { flags: { helped_carry: true }, unlockCollection: ["note_gotong_royong"] },
    next: "e3-help3",
  },
  {
    id: "e3-help3",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["rukmini"],
    condition: { kind: "flag", flag: "offered_help" },
    label: "Cerita Bu Rukmini",
    lines: [
      {
        speaker: "narrator",
        text: "Setelah kain terpasang, Bu Rukmini duduk di tepi tangga dan memutar pergelangan tangannya seperti sedang menghitung.",
      },
      {
        speaker: "rukmini",
        text: "Aku mulai belajar memukul alat ini dari ibuku. Dia main di acara-acara desa, dan aku dibawa serta karena tidak ada yang menjaga di rumah.",
      },
      { speaker: "tara", expression: "warm", text: "Jadi kau belajar dengan cara mendengarkan?" },
      {
        speaker: "rukmini",
        text: "Dengan cara salah dulu, lalu diperbaiki. Ibuku tidak menjelaskan banyak. Dia hanya bilang, dengar lagi.",
      },
      {
        speaker: "rukmini",
        text: "Menurutku itu sebabnya aku tidak suka orang yang bicara terlalu cepat soal tradisi. Semua ini panjang prosesnya.",
      },
    ],
    effects: {
      flags: { heard_origin_story: true, met_local_storyteller: true },
      unlockCollection: ["note_belajar_dari_pelaku"],
    },
    next: "e3-help4",
  },
  {
    id: "e3-help4",
    episodeId: "e3_pilihan",
    type: "reward",
    scene: "pendopo_dusk",
    showTara: true,
    label: "Cabang membantu selesai",
    title: "Berguna, dan jadi tahu banyak",
    subtitle:
      "Tara menemukan bahwa ikut bekerja membuat orang bercerita tanpa diminta. Ia punya satu misi praktik baru untuk dicoba di dunia nyata.",
    lines: [
      {
        speaker: "tara",
        expression: "happy",
        text: "Aku datang sebagai tamu, tapi rasanya seperti ikut menjaga sesuatu.",
      },
    ],
    effects: {
      knowledgeXp: 15,
      unlockQuests: ["pq_wawancara_kecil"],
    },
    next: "e3-join",
  },

  /* --- Titik gabung --- */
  {
    id: "e3-join",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["ndari"],
    lines: [
      {
        speaker: "narrator",
        text: "Matahari tenggelam. Lampu-lampu kecil dinyalakan satu per satu, dan halaman desa mulai penuh orang.",
      },
      {
        speaker: "ndari",
        text: "Lihat itu! Semua datang. Yang jauh, yang sibuk, semua pulang. Di sini itu namanya guyub.",
      },
      { speaker: "tara", expression: "confused", text: "Guyub?" },
      {
        speaker: "ndari",
        text: "Ya! Pokoknya… ramai, tapi tidak berisik di hati. Aku juga tidak tahu cara menjelaskannya yang benar.",
      },
      {
        speaker: "narrator",
        text: "Tara membuka bukunya. Halaman itu masih kosong, dan kata tadi terasa seperti batu kecil di dalam sepatu. Terasa, tapi belum bisa dijelaskan.",
      },
    ],
    effects: { flags: { heard_guyub: true } },
    next: "e3-n3",
  },
  {
    id: "e3-n3",
    episodeId: "e3_pilihan",
    type: "choice",
    scene: "pendopo_dusk",
    showTara: true,
    label: "Petunjuk tersembunyi",
    prompt: "Apa yang Tara lakukan dengan kata yang belum ia pahami?",
    footnote: "Ini contoh petunjuk tersembunyi: perhatikan hal kecil, dan cerita memberi jalan tambahan.",
    options: [
      {
        id: "record_ask_later",
        label: "Menulis kata itu di buku, lalu mencari tahu nanti",
        hint: "Mencatat dulu, jangan menebak",
        tone: "reflect",
        effects: { flags: { discovered_hidden_term: true } },
        reaction: {
          expression: "thinking",
          text: "Tara menulis dengan huruf besar di halaman kosong: GUYUB. Di sebelahnya, tanda tanya yang sama besar.",
        },
        next: "e3-n4a",
      },
      {
        id: "ask_now",
        label: "Bertanya sekarang juga kepada Ndari",
        hint: "Sekalian saja, selagi ia ada di depan mata",
        tone: "ask",
        effects: { flags: { discovered_hidden_term: true } },
        reaction: {
          expression: "curious",
          text: "Tara bertanya langsung. Ndari menjawab dengan yakin, lalu ragu di tengah kalimat — dan itu justru membuat Tara makin ingin tahu.",
        },
        next: "e3-n4b",
      },
      {
        id: "let_go",
        label: "Membiarkannya dulu",
        hint: "Mungkin nanti akan terjawab sendiri",
        tone: "neutral",
        reaction: {
          expression: "reflective",
          text: "Tara menutup bukunya. Kata itu tetap tinggal di kepalanya, seperti halaman yang belum dibuka.",
        },
        next: "e3-n4c",
      },
    ],
  },
  {
    id: "e3-n4a",
    episodeId: "e3_pilihan",
    type: "reward",
    scene: "pendopo_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "discovered_hidden_term" },
    title: "Petunjuk tersembunyi tercatat",
    subtitle:
      "Kata yang belum dipahami tersimpan di buku Tara. Sekarang ada misi rahasia untuk mencari maknanya dari sumber yang layak dipercaya.",
    lines: [
      {
        speaker: "ndari",
        text: "Kau menulis apa itu? Aku belum pernah lihat burung yang menulis sambil mengerutkan bulu.",
      },
      { speaker: "tara", expression: "warm", text: "Aku sedang mengumpulkan hal yang belum aku pahami. Jumlahnya lumayan." },
    ],
    effects: {
      knowledgeXp: 10,
      unlockQuests: ["hq_kata_tertinggal"],
      journal: ["j6_guyub_misteri"],
    },
    next: "e3-n5",
  },
  {
    id: "e3-n4b",
    episodeId: "e3_pilihan",
    type: "reward",
    scene: "pendopo_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "discovered_hidden_term" },
    title: "Jawaban setengah, pertanyaan penuh",
    subtitle:
      "Ndari menjawab dengan caranya sendiri, dan Tara sadar penjelasan dari satu orang belum cukup untuk benar-benar paham.",
    lines: [
      { speaker: "ndari", text: "Katanya kalau guyub, pekerjaan berat jadi ringan. Aku belum pernah kerja berat, jadi aku tidak bisa memastikan." },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Berarti aku harus bertanya kepada orang yang lebih tua. Atau mencari catatan yang bisa dipercaya.",
      },
    ],
    effects: {
      knowledgeXp: 10,
      unlockQuests: ["hq_kata_tertinggal"],
      journal: ["j6_guyub_misteri"],
    },
    next: "e3-n5",
  },
  {
    id: "e3-n4c",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "heard_guyub" },
    lines: [
      {
        speaker: "narrator",
        text: "Tara memilih melanjutkan hari tanpa mencatat. Tetapi kata itu tetap kembali, pelan-pelan, setiap kali ia melihat orang bekerja bersama.",
      },
      {
        speaker: "tara",
        expression: "reflective",
        text: "Kadang hal yang belum kupahami menunggu di tempat lain. Mungkin nanti aku menemukannya di buku Kakek Wira.",
      },
    ],
    next: "e3-n5",
  },
  {
    id: "e3-n5",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_night",
    showTara: true,
    lines: [
      {
        speaker: "narrator",
        text: "Lampu minyak di belakang layar dinyalakan. Untuk sesaat, seluruh halaman desa tampak menahan napas.",
      },
      { speaker: "narrator", text: "Lalu gong pertama dipukul." },
      { speaker: "tara", expression: "surprised", text: "Buluku berdiri. Semuanya. Aku tidak mengaturnya." },
    ],
    effects: { knowledgeXp: 5 },
    next: "e3-n6",
  },
  {
    id: "e3-n6",
    episodeId: "e3_pilihan",
    type: "script",
    scene: "pendopo_night",
    showTara: true,
    cast: ["wagiman"],
    lines: [
      {
        speaker: "narrator",
        text: "Layar itu hidup. Bayangan-bayangan mulai berjalan, duduk, dan berbicara — semuanya dari tangan seorang tua di balik kain.",
      },
      { speaker: "tara", expression: "curious", text: "Bagaimana caranya satu orang bisa menghidupkan sebanyak ini?" },
    ],
    next: null,
  },
];

const episode3: Episode = {
  id: "e3_pilihan",
  chapterId: CHAPTER_ID,
  index: 3,
  title: "Pilihan",
  summary:
    "Tiga cara untuk mendekati tradisi: bertanya, mengamati, atau membantu. Pilihan Tara mengubah apa yang ia pahami — dan misi yang terbuka.",
  scene: "pendopo_dusk",
  duration: "±8 menit",
  nodes: e3,
};

/* ============================================================
 * EPISODE 4 — Petunjuk yang Hilang
 * ============================================================ */

const e4: StoryNode[] = [
  {
    id: "e4-n1",
    episodeId: "e4_petunjuk",
    type: "script",
    scene: "pendopo_night",
    showTara: true,
    cast: ["wagiman"],
    lines: [
      {
        speaker: "narrator",
        text: "Bayangan-bayangan bergerak di kelir. Suara Pak Wagiman berubah-ubah mengikuti setiap tokoh, dan Bu Rukmini menyanyi di belakangnya.",
      },
      {
        speaker: "narrator",
        text: "Tara duduk di palang kayu paling ujung. Ia mencoba menghitung berapa banyak suara berbeda yang keluar dari satu orang.",
      },
      { speaker: "tara", expression: "thinking", text: "Satu orang bercerita. Tapi yang terdengar seperti sepuluh." },
    ],
    next: "e4-n2",
  },
  {
    id: "e4-n2",
    episodeId: "e4_petunjuk",
    type: "quiz",
    scene: "pendopo_night",
    showTara: true,
    label: "Tantangan pengetahuan",
    lines: [
      {
        speaker: "tara",
        expression: "curious",
        text: "Sebelum aku mencatat sesuatu yang salah, aku mau memastikan satu hal dulu.",
      },
    ],
    question: "Menurut apa yang baru kamu lihat dan dengar, apa tugas utama seorang dalang?",
    context: "Pilih jawaban yang menurutmu paling tepat. Kalau salah, kamu akan mendapat penjelasan.",
    options: [
      {
        id: "a",
        label: "Menggerakkan wayang sambil menceritakan dan menjaga jalannya kisah",
        correct: true,
        feedback:
          "Tepat. Dalang menggerakkan wayang, berbicara untuk setiap tokoh, menjaga alur cerita, dan memberi tanda kepada para pengiring musik. Itu sebabnya satu orang bisa terasa seperti banyak suara.",
      },
      {
        id: "b",
        label: "Memainkan seluruh alat musik gamelan",
        correct: false,
        feedback:
          "Belum tepat, tapi masuk akal — karena dalang memang bekerja sama erat dengan musiknya. Gamelan dimainkan oleh beberapa orang sekaligus. Dalang memberi tanda, bukan memukul semuanya.",
      },
      {
        id: "c",
        label: "Menyalakan lampu dan mengatur bayangan di layar",
        correct: false,
        feedback:
          "Itu bagian dari pekerjaan panggung dan memang penting: lampu menentukan bayangan yang dilihat penonton. Tetapi tugas utama dalang adalah bercerita dan memainkan wayangnya.",
      },
      {
        id: "d",
        label: "Menyanyikan semua lagu sepanjang pertunjukan",
        correct: false,
        feedback:
          "Nyanyian biasanya dibawakan sinden, walaupun dalang juga bersuara untuk tokoh-tokohnya. Jadi keduanya bersuara, dengan peran yang berbeda.",
      },
    ],
    aftermath:
      "Tara mencatat jawabannya di buku dengan huruf yang lebih rapi dari biasanya, lalu menambahkan satu kalimat kecil di bawahnya: orang yang bercerita.",
    effects: { knowledgeXp: 30 },
    next: "e4-n3",
  },
  {
    id: "e4-n3",
    episodeId: "e4_petunjuk",
    type: "script",
    scene: "pendopo_night",
    showTara: true,
    cast: ["wagiman", "rukmini"],
    lines: [
      {
        speaker: "narrator",
        text: "Malam berjalan lambat dan panjang. Beberapa penonton tertidur, beberapa datang membawa tikar, dan anak-anak duduk paling depan.",
      },
      {
        speaker: "narrator",
        text: "Ketika pertunjukan berhenti untuk jeda, Pak Wagiman menepuk debu dari tangannya dan melambai ke arah Tara.",
      },
      { speaker: "wagiman", text: "Kau yang tadi mengamati batang pisang itu, ya? Mari, lihat dari sisi yang tidak dilihat penonton." },
    ],
    next: "e4-n4",
  },
  {
    id: "e4-n4",
    episodeId: "e4_petunjuk",
    type: "matching",
    scene: "screen_glow",
    showTara: true,
    cast: ["wagiman"],
    label: "Latihan mencocokkan",
    lines: [
      {
        speaker: "wagiman",
        text: "Aku sebutkan nama benda, kau tebak apa pekerjaannya. Kalau lupa, tidak apa-apa — di sini tidak ada ujian.",
      },
      { speaker: "tara", expression: "determined", text: "Siap." },
    ],
    instruction: "Ketuk satu istilah di kolom kiri, lalu ketuk artinya di kolom kanan.",
    caveat:
      "Catatan: nama benda dan istilah bisa berbeda antar daerah. Yang penting kamu tahu fungsi dan bisa menanyakan nama setempat.",
    pairs: [
      {
        id: "kelir",
        left: "Kelir",
        right: "Kain layar tempat bayangan jatuh",
        note: "Ada di depan penonton. Menentukan apa yang mereka lihat.",
      },
      {
        id: "sinden",
        left: "Sinden",
        right: "Penyanyi yang mengiringi pertunjukan",
        note: "Suaranya menyatu dengan musik dan menguatkan suasana cerita.",
      },
      {
        id: "kepyak",
        left: "Kepyak",
        right: "Lempeng yang diinjak dalang untuk menjaga tempo",
        note: "Bunyinya dari bawah kaki, bukan dari tangan.",
      },
      {
        id: "cempurit",
        left: "Cempurit",
        right: "Tangkai tipis penggerak tangan wayang",
        note: "Kalau tangkai digerakkan, tangan wayang ikut bergerak.",
      },
      {
        id: "kothak",
        left: "Kothak",
        right: "Kotak kayu penyimpan wayang",
        note: "Ditutup kain, diletakkan hati-hati.",
      },
    ],
    effects: { knowledgeXp: 35 },
    next: "e4-n5",
  },
  {
    id: "e4-n5",
    episodeId: "e4_petunjuk",
    type: "script",
    scene: "screen_glow",
    showTara: true,
    cast: ["wagiman"],
    lines: [
      {
        speaker: "wagiman",
        text: "Kami menyimpan semuanya di meja belakang setelah selesai. Kalau kau ingin melihat bagaimana wayang dibuat, ke sini besok pagi — dan jangan lupa bawa buku itu.",
      },
      { speaker: "tara", expression: "surprised", text: "Kau memperhatikan bukuku?" },
      {
        speaker: "wagiman",
        text: "Sulit tidak memperhatikan. Kaulah satu-satunya tamu yang menulis sambil mengangguk-angguk sendiri.",
      },
    ],
    next: "e4-n6",
  },
  {
    id: "e4-n6",
    episodeId: "e4_petunjuk",
    type: "observation",
    scene: "workbench",
    showTara: true,
    cast: ["wagiman"],
    label: "Adegan pengamatan: meja kerja",
    lines: [
      {
        speaker: "narrator",
        text: "Pagi berikutnya, meja kayu panjang di belakang pendopo masih menyimpan sisa-sisa pertunjukan semalam.",
      },
      { speaker: "tara", expression: "curious", text: "Meja kerja selalu bercerita lebih jujur daripada panggungnya." },
    ],
    instruction:
      "Ketuk bagian meja yang ingin kamu periksa. Ada satu petunjuk yang hanya muncul kalau kita cukup teliti.",
    backdrop: "workbench",
    requiredCount: 3,
    hotspots: [
      {
        id: "kothak",
        label: "Kotak kayu yang terbuka",
        x: 28,
        y: 62,
        kind: "info",
        text: "Kotak penyimpanan wayang itu dijejali boneka-boneka dengan hati-hati. Beberapa wayang dibungkus kain, beberapa bersandar rapi.",
        effects: { unlockCollection: ["craft_kothak"] },
      },
      {
        id: "cempurit",
        label: "Tangkai tipis di atas meja",
        x: 56,
        y: 48,
        kind: "clue",
        text: "Dua bilah tangkai tipis tergeletak di atas meja. Salah satunya hampir patah — Tara baru tahu bahwa tangan wayang digerakkan dari tangkai ini, bukan dari bonekanya.",
        effects: { flags: { observed_scene_clue: true }, unlockCollection: ["vocab_cempurit"] },
      },
      {
        id: "lampu",
        label: "Lampu minyak yang masih hangat",
        x: 72,
        y: 34,
        kind: "info",
        text: "Lampu minyak di belakang layar menyala sepanjang malam. Tempatnya ditentukan dengan hati-hati — sedikit saja bergeser, bayangan di kelir akan berubah.",
      },
      {
        id: "buku_kakek",
        label: "Buku catatan yang terbuka sendiri",
        x: 20,
        y: 40,
        kind: "clue",
        text: "Buku Kakek Wira terbuka di halaman yang terlipat. Di sudutnya, satu kata ditulis dengan huruf besar: guyub. Ternyata Kakek Wira juga pernah mengejar kata itu.",
        effects: {
          flags: { notebook_examined: true, discovered_hidden_term: true, observed_scene_clue: true },
          unlockCollection: ["mem_buku_kakek"],
          unlockQuests: ["hq_halaman_lipat", "hq_kata_tertinggal"],
          journal: ["j12_buku_kakek"],
        },
      },
      {
        id: "tumpukan_kain",
        label: "Kain layar yang dilipat",
        x: 82,
        y: 68,
        kind: "info",
        text: "Kain kelir dilipat memanjang, masih menyimpan bau minyak. Ada satu bagian yang berbeda warna karena sering terkena cahaya lampu.",
      },
    ],
    effects: { knowledgeXp: 25 },
    next: "e4-n7",
  },
  {
    id: "e4-n7",
    episodeId: "e4_petunjuk",
    type: "script",
    scene: "workbench",
    showTara: true,
    lines: [
      {
        speaker: "narrator",
        text: "Halaman yang terlipat itu hanya berisi dua baris. Tulisannya miring, dan paruh akhirnya sudah tidak terbaca.",
      },
      {
        speaker: "kakek",
        text: "Yang membuat pertunjukan hidup bukan wayangnya, tetapi orang yang bercerita…",
      },
      { speaker: "tara", expression: "reflective", text: "Kalimatnya putus di situ. Seperti semua halaman lainnya." },
      {
        speaker: "narrator",
        text: "Tara menutup buku itu pelan. Ada bagian dari dirinya yang ingin menuliskan akhir kalimat itu sendiri — dan ada bagian lain yang tahu bahwa itu tugas yang berbeda.",
      },
    ],
    effects: { knowledgeXp: 10 },
    next: "e4-n8",
  },
  {
    id: "e4-n8",
    episodeId: "e4_petunjuk",
    type: "script",
    scene: "workbench",
    showTara: true,
    cast: ["wagiman"],
    lines: [
      {
        speaker: "wagiman",
        text: "Orang datang ke pertunjukan karena ceritanya. Boneka kami bagus, tapi boneka tidak bisa menahan orang sampai pagi.",
      },
      { speaker: "tara", expression: "curious", text: "Lalu apa yang menahannya?" },
      {
        speaker: "wagiman",
        text: "Biasanya rasa ingin tahu: apa yang terjadi setelah ini. Kakekku dulu bilang, dalang itu bukan yang paling banyak bicara, tapi yang paling tahu kapan harus berhenti.",
      },
      { speaker: "tara", expression: "thinking", text: "Kalimat itu terlalu bagus untuk tidak kucatat." },
    ],
    effects: { flags: { heard_dalang_lesson: true } },
    next: "e4-n9",
  },
  {
    id: "e4-n9",
    episodeId: "e4_petunjuk",
    type: "reward",
    scene: "workbench",
    showTara: true,
    title: "Buku Kakek Wira mulai bicara",
    subtitle:
      "Ternyata halaman itu menyimpan petunjuk. Sekarang kamu punya misi rahasia kedua: melanjutkan pencarian yang pernah dimulai Kakek Wira.",
    lines: [
      {
        speaker: "tara",
        expression: "determined",
        text: "Kalau Kakek Wira pernah mengejar kata itu, aku tidak akan berhenti di setengah jalan.",
      },
    ],
    effects: {
      knowledgeXp: 15,
      unlockQuests: ["hq_kata_tertinggal", "hq_halaman_lipat"],
      unlockCollection: ["note_fiksi_vs_fakta"],
    },
    next: "e4-n10",
  },
  {
    id: "e4-n10",
    episodeId: "e4_petunjuk",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["ndari"],
    lines: [
      {
        speaker: "narrator",
        text: "Matahari naik. Pertunjukan telah selesai, dan desa kembali menjadi desa: sibuk, tenang, dan biasa saja.",
      },
      {
        speaker: "ndari",
        text: "Hei, burung! Nanti sore aku dan anak-anak lain main di halaman belakang. Kau ikut, kan? Kau belum pernah main engklek, pasti.",
      },
      { speaker: "tara", expression: "surprised", text: "Engklek itu apa lagi…" },
    ],
    next: null,
  },
];

const episode4: Episode = {
  id: "e4_petunjuk",
  chapterId: CHAPTER_ID,
  index: 4,
  title: "Petunjuk yang Hilang",
  summary:
    "Malam pertunjukan: Tara menguji dugaannya, belajar nama-nama benda, dan menemukan halaman terlipat di buku Kakek Wira.",
  scene: "pendopo_night",
  duration: "±10 menit",
  nodes: e4,
};

/* ============================================================
 * EPISODE 5 — Pemahaman Baru
 * ============================================================ */

const e5: StoryNode[] = [
  {
    id: "e5-n1",
    episodeId: "e5_pemahaman_baru",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["wagiman"],
    label: "Menyelesaikan salah paham pertama",
    lines: [
      { speaker: "tara", expression: "curious", text: "Pak Wagiman, aku mau mengakui sesuatu. Aku mengira 'ringgit' itu nama uang." },
      {
        speaker: "wagiman",
        text: "Kau tidak salah seluruhnya. Di tempat lain, kata itu memang dipakai untuk uang. Tapi di sini, kata itu juga nama lama untuk pertunjukan wayang.",
      },
      { speaker: "tara", expression: "surprised", text: "Satu kata bisa berarti dua hal yang jauh berbeda?" },
      {
        speaker: "wagiman",
        text: "Satu kata bisa berarti banyak hal, tergantung siapa yang mengucapkannya dan di mana. Itu sebabnya kalau kau mencatat sesuatu, tulis juga siapa yang mengatakannya.",
      },
    ],
    effects: {
      flags: { ringgit_explained: true },
      knowledgeXp: 15,
    },
    next: "e5-n2",
  },
  {
    id: "e5-n2",
    episodeId: "e5_pemahaman_baru",
    type: "ordering",
    scene: "workbench",
    showTara: true,
    cast: ["wagiman"],
    label: "Latihan menyusun urutan",
    lines: [
      {
        speaker: "narrator",
        text: "Di meja kerja, sebuah wayang setengah jadi tergeletak di atas kain. Kulitnya masih pucat, beberapa bagian belum diwarnai.",
      },
      { speaker: "wagiman", text: "Kau mau tahu bagaimana benda ini lahir? Susun sendiri urutannya." },
    ],
    instruction:
      "Geser urutan tahapan dengan tombol panah sampai menurutmu benar, lalu periksa jawabanmu.",
    caveat:
      "Tahapan ini gambaran umum yang sering dijelaskan. Setiap perajin bisa punya urutan, alat, dan cara yang berbeda.",
    items: [
      { id: "kulit", text: "Menyiapkan kulit yang sudah dikeringkan dan dibersihkan" },
      { id: "pola", text: "Menggambar pola tokoh di atas kulit" },
      { id: "tatah", text: "Menatah, yaitu mengukir bagian detail hingga berlubang" },
      { id: "sungging", text: "Menyungging, yaitu mewarnai bagian-bagian wayang" },
      { id: "tangkai", text: "Memasang tangkai dan pegangan supaya wayang bisa digerakkan" },
    ],
    correctOrder: ["kulit", "pola", "tatah", "sungging", "tangkai"],
    effects: { knowledgeXp: 30 },
    next: "e5-n3",
  },
  {
    id: "e5-n3",
    episodeId: "e5_pemahaman_baru",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["rukmini"],
    lines: [
      {
        speaker: "rukmini",
        text: "Anak burung. Kau sudah belajar banyak kata kemarin, tapi belum ada yang kau ucapkan.",
      },
      {
        speaker: "tara",
        expression: "confused",
        text: "Aku takut salah. Burung yang salah bicara itu… kedengaran lucu sekali.",
      },
      {
        speaker: "rukmini",
        text: "Justru karena itu kau harus mencoba. Salah itu bagian dari belajar, bukan tanda kau gagal.",
      },
    ],
    effects: { flags: { learned_greeting: true } },
    next: "e5-n4",
  },
  {
    id: "e5-n4",
    episodeId: "e5_pemahaman_baru",
    type: "listening",
    scene: "village_square",
    showTara: true,
    cast: ["rukmini"],
    label: "Latihan mendengarkan & mengucapkan",
    lines: [
      { speaker: "rukmini", text: "Dengar dulu, jangan buru-buru. Aku ucapkan tiga hal yang paling sering dipakai orang sini." },
    ],
    instruction:
      "Ketuk tombol dengar untuk mendengarkan pelafalan. Suara memakai pembaca suara di perangkatmu — kalau tidak tersedia, gunakan panduan pelafalan di bawahnya.",
    entries: [
      {
        id: "sugeng_rawuh",
        label: "Sugeng rawuh",
        phonetics: "su-geng ra-wuh",
        meaning: "Sapaan selamat datang, biasanya untuk tamu.",
        note: "Bu Rukmini mengucapkannya sambil menepuk bahu Tara.",
        sound: "speech",
      },
      {
        id: "matur_nuwun",
        label: "Matur nuwun",
        phonetics: "ma-tur nu-wun",
        meaning: "Terima kasih. Dipakai untuk berterima kasih dengan sopan.",
        note: "Tara mengucapkannya tiga kali karena yang pertama terlalu pelan.",
        sound: "speech",
      },
      {
        id: "sugeng_enjing",
        label: "Sugeng enjing",
        phonetics: "su-geng en-jing",
        meaning: "Selamat pagi.",
        note: "Ndari menyahut dengan versi yang lebih cepat, lalu tertawa.",
        sound: "speech",
      },
    ],
    effects: {
      knowledgeXp: 20,
      unlockCollection: ["vocab_sugeng_rawuh", "vocab_matur_nuwun"],
    },
    next: "e5-n5a",
  },
  {
    id: "e5-n5a",
    episodeId: "e5_pemahaman_baru",
    type: "script",
    scene: "village_square",
    showTara: true,
    condition: { kind: "flag", flag: "asked_about_tradition" },
    lines: [
      {
        speaker: "tara",
        expression: "reflective",
        text: "Pak Wagiman mengatakan bahwa bayangan bisa dipakai bercerita. Aku masih mengingat kalimatnya: kalau wayangnya digeser sedikit, penonton tahu ada yang sedang bergerak.",
      },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Jadi yang aku lihat semalam bukan hanya gambar. Ada keputusan di setiap gerakan.",
      },
    ],
    next: "e5-n5b",
  },
  {
    id: "e5-n5b",
    episodeId: "e5_pemahaman_baru",
    type: "script",
    scene: "village_square",
    showTara: true,
    condition: { kind: "flag", flag: "observed_scene_clue" },
    lines: [
      {
        speaker: "tara",
        expression: "reflective",
        text: "Aku hanya mendengarkan tadi. Tapi sekarang aku bisa menyebut nama bunyi-bunyi itu: ada gong, ada bilah logam, ada lempeng di bawah kaki dalang.",
      },
      {
        speaker: "tara",
        expression: "warm",
        text: "Dulu semuanya hanya 'bunyi'. Sekarang punya nama dan pekerjaan masing-masing.",
      },
    ],
    next: "e5-n5c",
  },
  {
    id: "e5-n5c",
    episodeId: "e5_pemahaman_baru",
    type: "script",
    scene: "village_square",
    showTara: true,
    condition: { kind: "flag", flag: "offered_help" },
    lines: [
      {
        speaker: "tara",
        expression: "warm",
        text: "Ternyata kain layar itu berat. Aku baru tahu setelah ikut menariknya. Kalau aku hanya menonton, aku akan mengira itu pekerjaan ringan.",
      },
      {
        speaker: "tara",
        expression: "reflective",
        text: "Bu Rukmini bilang dia belajar dari kesalahan dulu, baru diperbaiki. Rasanya aku juga begitu.",
      },
    ],
    next: "e5-n6",
  },
  {
    id: "e5-n6",
    episodeId: "e5_pemahaman_baru",
    type: "reflection",
    scene: "village_square",
    showTara: true,
    label: "Refleksi cerita",
    lines: [
      {
        speaker: "narrator",
        text: "Tara duduk di bawah pohon, membuka bukunya di halaman kosong, dan menekan paruh pada ujung pena.",
      },
      { speaker: "tara", expression: "reflective", text: "Bagian ini bukan tentang nama atau istilah. Bagian ini tentang apa yang aku rasakan." },
    ],
    prompt: "Setelah semalam, apa yang menurutmu membuat sebuah pertunjukan terasa hidup?",
    helper:
      "Tidak ada jawaban benar atau salah di sini. Tulis dengan bahasamu sendiri — satu atau dua kalimat sudah cukup.",
    chips: [
      "Orang yang bercerita",
      "Suara musiknya",
      "Cerita yang dibawakan",
      "Suasana penonton",
      "Cara bayangan bergerak",
      "Belum tahu",
    ],
    minLength: 12,
    effects: { knowledgeXp: 30 },
    next: "e5-n7",
  },
  {
    id: "e5-n7",
    episodeId: "e5_pemahaman_baru",
    type: "reward",
    scene: "village_square",
    showTara: true,
    title: "Dua misi praktik terbuka",
    subtitle:
      "Pengetahuan Tara bertambah. Sekarang saatnya mencoba hal yang sama di dunia nyata — dengan cara yang paling nyaman untukmu.",
    lines: [
      {
        speaker: "tara",
        expression: "determined",
        text: "Aku sudah tahu kata-katanya. Yang belum: berani mengucapkannya di luar kepalaku.",
      },
    ],
    effects: {
      unlockQuests: ["pq_suara_pertama", "pq_cari_sumber"],
      journal: ["j10_suara_pertama"],
    },
    next: "e5-n8",
  },
  {
    id: "e5-n8",
    episodeId: "e5_pemahaman_baru",
    type: "script",
    scene: "village_square",
    showTara: true,
    cast: ["ndari", "rukmini", "wagiman"],
    lines: [
      {
        speaker: "narrator",
        text: "Siang itu desa menawarkan tiga hal sekaligus, seperti biasa: ajakan bermain, bunyi alat musik, dan cerita dari orang tua.",
      },
      {
        speaker: "tara",
        expression: "happy",
        text: "Aku datang ke sini untuk satu kata yang belum kupahami. Sekarang ada tiga hal yang belum sempat kucoba.",
      },
    ],
    next: null,
  },
];

const episode5: Episode = {
  id: "e5_pemahaman_baru",
  chapterId: CHAPTER_ID,
  index: 5,
  title: "Pemahaman Baru",
  summary:
    "Tara menyelesaikan salah paham pertamanya, menyusun tahapan pembuatan wayang, dan mencoba mengucapkan kata-kata baru.",
  scene: "village_square",
  duration: "±9 menit",
  nodes: e5,
};

/* ============================================================
 * EPISODE 6 — Undangan
 * ============================================================ */

const e6: StoryNode[] = [
  {
    id: "e6-n1",
    episodeId: "e6_undangan",
    type: "script",
    scene: "fields_morning",
    showTara: true,
    cast: ["ndari", "rukmini", "wagiman"],
    lines: [
      {
        speaker: "ndari",
        text: "Burung! Anak-anak sedang menggambar petak di tanah. Ikut! Kau harus ikut!",
      },
      { speaker: "rukmini", text: "Atau kau duduk di sini. Alat-alat ini belum aku rapikan." },
      { speaker: "wagiman", text: "Keduanya boleh menunggu. Aku punya satu cerita yang cocok untuk pagi seperti ini." },
      {
        speaker: "tara",
        expression: "surprised",
        text: "Aku baru belajar bahwa di desa ini, satu waktu tidak pernah cukup untuk semua yang menarik.",
      },
    ],
    next: "e6-n2",
  },
  {
    id: "e6-n2",
    episodeId: "e6_undangan",
    type: "choice",
    scene: "fields_morning",
    showTara: true,
    cast: ["ndari", "rukmini", "wagiman"],
    label: "Undangan opsional",
    prompt: "Apa yang Tara pilih pagi ini?",
    footnote: "Pilihan ini membuka konten tambahan. Yang lain bisa kamu buka lewat Quest Center.",
    options: [
      {
        id: "games",
        label: "Ikut Ndari menggambar petak di tanah",
        hint: "Permainan, aturan, dan tawa",
        tone: "help",
        tag: "Permainan",
        effects: { flags: { chosen_game_branch: true } },
        reaction: {
          expression: "happy",
          text: "Tara mengikuti Ndari ke halaman belakang. Untuk pertama kalinya sejak tiba, ia tidak sedang berusaha memahami apa pun — ia hanya ikut.",
        },
        next: "e6-games1",
      },
      {
        id: "gamelan",
        label: "Duduk dekat Bu Rukmini dan dengarkan alat musiknya",
        hint: "Bunyi yang punya urusan masing-masing",
        tone: "observe",
        tag: "Bunyi",
        effects: { flags: { chosen_gamelan_branch: true } },
        reaction: {
          expression: "curious",
          text: "Tara duduk di soret yang masih kosong dan menunggu. Bu Rukmini mulai memukul satu bilah, lalu bilah lain, seperti sedang memanggil sesuatu.",
        },
        next: "e6-gamelan1",
      },
      {
        id: "tale",
        label: "Duduk di dekat Pak Wagiman dan minta satu cerita",
        hint: "Cerita yang tidak ada di panggung",
        tone: "ask",
        tag: "Cerita",
        effects: { flags: { chosen_story_branch: true } },
        reaction: {
          expression: "warm",
          text: "Tara meregangkan sayap dan duduk di tikar. Pak Wagiman menyeruput minumannya, menatap kejauhan, lalu mulai bercerita tanpa upacara apa pun.",
        },
        next: "e6-tale1",
      },
    ],
  },

  /* --- Cabang: permainan --- */
  {
    id: "e6-games1",
    episodeId: "e6_undangan",
    type: "script",
    scene: "fields_morning",
    showTara: true,
    cast: ["ndari"],
    condition: { kind: "flag", flag: "chosen_game_branch" },
    lines: [
      {
        speaker: "narrator",
        text: "Ndari mengambil ranting dan menggambar kotak-kotak di tanah. Anak-anak lain berkerumun, saling menyalahkan garis yang miring.",
      },
      {
        speaker: "ndari",
        text: "Ini petaknya. Kau melompat dari satu kotak ke kotak lain dengan satu kaki. Kalau kakimu menyentuh garis, kau gantian.",
      },
      {
        speaker: "tara",
        expression: "confused",
        text: "Aku punya dua kaki, dan tidak satu pun dirancang untuk melompat-lompat begini.",
      },
      {
        speaker: "narrator",
        text: "Percobaan pertama Tara berakhir dengan bulu-bulu beterbangan dan anak-anak yang tertawa sampai menahan perut. Tara tidak marah. Ia justru tertawa paling keras.",
      },
    ],
    next: "e6-games2",
  },
  {
    id: "e6-games2",
    episodeId: "e6_undangan",
    type: "script",
    scene: "fields_morning",
    showTara: true,
    cast: ["ndari"],
    condition: { kind: "flag", flag: "chosen_game_branch" },
    lines: [
      { speaker: "ndari", text: "Di kampung sebelah, katanya aturannya beda. Ada yang boleh dua kaki, ada yang petaknya lebih panjang." },
      {
        speaker: "tara",
        expression: "thinking",
        text: "Jadi permainan yang sama bisa punya aturan berbeda hanya karena beda jalan?",
      },
      {
        speaker: "ndari",
        text: "Iya! Makanya kalau main di tempat baru, tanya dulu. Jangan asal menang sendiri.",
      },
      { speaker: "tara", expression: "warm", text: "Itu saran yang berguna untuk mencari tahu budaya, sepertinya." },
    ],
    next: "e6-games3",
  },
  {
    id: "e6-games3",
    episodeId: "e6_undangan",
    type: "reward",
    scene: "fields_morning",
    showTara: true,
    condition: { kind: "flag", flag: "chosen_game_branch" },
    title: "Dua misi permainan terbuka",
    subtitle:
      "Tara mengenal satu permainan hari ini. Kamu bisa mencobanya sendiri — dengan aturan versi daerahmu, atau versi yang bisa dilakukan sendirian.",
    lines: [
      { speaker: "tara", expression: "happy", text: "Besok aku akan menang. Atau paling tidak, tidak jatuh lagi." },
    ],
    effects: {
      flags: { heard_game_variants: true },
      knowledgeXp: 20,
      unlockQuests: ["sq_biji_petak", "pq_petak_halaman"],
      unlockCollection: ["game_engklek", "mem_petak_di_tanah"],
      journal: ["j11_pagi_di_halaman"],
    },
    next: "e6-join",
  },

  /* --- Cabang: bunyi --- */
  {
    id: "e6-gamelan1",
    episodeId: "e6_undangan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["rukmini"],
    condition: { kind: "flag", flag: "chosen_gamelan_branch" },
    lines: [
      {
        speaker: "rukmini",
        text: "Sebelum kau bertanya: tidak semua alat ini dipukul dengan cara yang sama. Ada yang dipukul keras, ada yang hanya disentuh.",
      },
      {
        speaker: "tara",
        expression: "curious",
        text: "Kalau begitu, yang membedakan bukan bunyinya saja, tapi juga cara memainkannya.",
      },
      { speaker: "rukmini", text: "Bagus. Duduk di sana, jangan bergerak. Aku mainkan empat yang paling mudah dikenali." },
    ],
    next: "e6-gamelan2",
  },
  {
    id: "e6-gamelan2",
    episodeId: "e6_undangan",
    type: "listening",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["rukmini"],
    label: "Mengenal bunyi alat",
    condition: { kind: "flag", flag: "chosen_gamelan_branch" },
    lines: [
      {
        speaker: "rukmini",
        text: "Empat bunyi ini yang biasanya paling cepat diingat orang. Dengarkan satu per satu.",
      },
    ],
    instruction:
      "Ketuk setiap alat untuk mendengarkan bunyi. Bunyi di sini adalah simulasi yang dibuat aplikasi, bukan rekaman asli gamelan desa.",
    entries: [
      {
        id: "gong",
        label: "Gong",
        phonetics: "gong",
        meaning: "Berbunyi paling rendah dan panjang. Sering menandai bagian penting cerita.",
        note: "Kalau gong dipukul, penonton tahu ada babak baru.",
        sound: "gong",
      },
      {
        id: "saron",
        label: "Saron",
        phonetics: "sa-ron",
        meaning: "Bilah logam yang dipukul dengan pemukul kayu. Nada cepat dan cerah.",
        note: "Ini yang tadi berbunyi dua kali sebelum dimainkan: pengecekan nada.",
        sound: "saron",
      },
      {
        id: "kenong",
        label: "Kenong",
        phonetics: "ke-nong",
        meaning: "Bejana logam yang ditumpuk dengan bunyi menggantung.",
        note: "Bunyinya baru habis kalau ditunggu. Bu Rukmini tidak pernah terburu-buru.",
        sound: "kenong",
      },
      {
        id: "bonang",
        label: "Bonang",
        phonetics: "bo-nang",
        meaning: "Deretan gong kecil di atas rak kayu. Bunyinya lebih ringan dari gong.",
        note: "Tara menyebutnya 'gong untuk anak-anak' dan langsung ditegur setengah bercanda.",
        sound: "bonang",
      },
    ],
    effects: { unlockCollection: ["perf_gamelan"], knowledgeXp: 25 },
    next: "e6-gamelan3",
  },
  {
    id: "e6-gamelan3",
    episodeId: "e6_undangan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["rukmini"],
    condition: { kind: "flag", flag: "chosen_gamelan_branch" },
    lines: [
      {
        speaker: "narrator",
        text: "Tara mencoba menirukan pola bunyi dengan suaranya. Ia mengira sudah mendekati, sampai Bu Rukmini menahan tawa.",
      },
      {
        speaker: "rukmini",
        text: "Kau salah nada, tapi jangan berhenti. Suara yang salah itu masih lebih hidup daripada diam.",
      },
      {
        speaker: "tara",
        expression: "happy",
        text: "Kalau begitu aku akan terus salah, pelan-pelan, sampai tidak terlalu salah.",
      },
    ],
    next: "e6-gamelan4",
  },
  {
    id: "e6-gamelan4",
    episodeId: "e6_undangan",
    type: "reward",
    scene: "pendopo_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "chosen_gamelan_branch" },
    title: "Catatan bunyi bertambah",
    subtitle: "Tara tidak bisa memainkan alat musik, tetapi ia mulai bisa mengenali siapa yang berbicara di dalam musik.",
    lines: [
      { speaker: "tara", expression: "reflective", text: "Musik itu ternyata juga bercerita. Hanya tidak memakai kata." },
    ],
    effects: {
      knowledgeXp: 15,
      journal: ["j13_bunyi_jadi_cerita"],
    },
    next: "e6-join",
  },

  /* --- Cabang: cerita --- */
  {
    id: "e6-tale1",
    episodeId: "e6_undangan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["wagiman"],
    condition: { kind: "flag", flag: "chosen_story_branch" },
    label: "Kisah Timun Mas",
    lines: [
      { speaker: "wagiman", text: "Ada pasangan yang sudah lama menunggu anak. Suatu hari, seorang pertapa memberi mereka biji mentimun untuk ditanam." },
      { speaker: "wagiman", text: "Benih itu tumbuh, dan di antara buah-buahnya ada satu mentimun besar sekali. Ketika dibelah, ada bayi perempuan di dalamnya. Mereka menamainya Timun Mas." },
      {
        speaker: "wagiman",
        text: "Tahun-tahun berjalan, sampai datang raksasa yang mengaku memiliki anak itu. Sebelum Timun Mas tumbuh besar, raksasa akan menagih janji.",
      },
      {
        speaker: "tara",
        expression: "surprised",
        text: "Ini kisah untuk anak-anak?",
      },
      {
        speaker: "wagiman",
        text: "Kisah lama memang begitu: menyenangkan di depan, tapi menyimpan perkara yang tidak kecil di belakang. Yang penting bukan raksasanya, tetapi pilihan Timun Mas.",
      },
      { speaker: "wagiman", text: "Saat raksasa datang, Timun Mas tidak berdiam diri. Ia berlari, dan melempar apa yang ada di tangannya." },
      { speaker: "wagiman", text: "Sekali ia melempar biji mentimun, tumbuhlah kebun mentimun. Ia melempar jarum, tumbuh hutan bambu. Ia melempar garam, terbentang laut. Ia melempar terasi, muncul lumpur yang luas." },
      { speaker: "wagiman", text: "Akhirnya raksasa tidak bisa melewatinya. Di banyak versi yang aku dengar, ia tenggelam di lumpur itu, dan Timun Mas pulang." },
      {
        speaker: "ndari",
        text: "Versi punyaku lebih seru! Raksasanya kena BATU juga!",
      },
      { speaker: "wagiman", text: "Lihat. Aku baru selesai bercerita, dan ceritanya sudah berubah." },
    ],
    effects: { flags: { listened_to_tale: true }, knowledgeXp: 15 },
    next: "e6-tale2",
  },
  {
    id: "e6-tale2",
    episodeId: "e6_undangan",
    type: "quiz",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["wagiman", "ndari"],
    condition: { kind: "flag", flag: "chosen_story_branch" },
    label: "Tantangan cerita rakyat",
    lines: [
      { speaker: "wagiman", text: "Sekarang aku uji sedikit. Bukan untuk menilai, hanya untuk tahu apa yang kau bawa pulang." },
    ],
    question: "Dalam cerita yang baru kamu dengar, bagaimana Timun Mas menghadapi raksasa yang mengejarnya?",
    context: "Ingat versi yang diceritakan Pak Wagiman, lalu pilih jawaban yang paling dekat.",
    options: [
      {
        id: "a",
        label: "Ia berlari dan melempar benda-benda yang berubah menjadi penghalang",
        correct: true,
        feedback:
          "Tepat. Biji mentimun, jarum, garam, dan terasi menjadi penghalang di belakangnya. Dalam banyak versi yang diceritakan, cara itu yang membuat raksasa tertahan.",
      },
      {
        id: "b",
        label: "Ia bersembunyi dan menunggu raksasa pergi",
        correct: false,
        feedback:
          "Belum sesuai dengan versi ini. Timun Mas memang ketakutan, tapi ia bergerak: berlari, lalu bertindak dengan benda yang ada di tangannya.",
      },
      {
        id: "c",
        label: "Ia meminta bantuan pertapa yang dulu memberi biji mentimun",
        correct: false,
        feedback:
          "Pertapa memang tokoh penting — biasanya justru yang membekali Timun Mas lebih dulu. Tetapi pada bagian pengejaran, versi ini bercerita tentang Timun Mas yang bertindak sendiri.",
      },
      {
        id: "d",
        label: "Ia berubah menjadi mentimun emas",
        correct: false,
        feedback:
          "Menarik, tapi tidak ada di versi ini. Nama 'Timun Mas' memang menunjuk pada mentimun, namun tidak berarti ia berubah wujud. Cerita lisan sering punya versi berbeda, jadi selalu aman untuk menyebutkan versi siapa yang kamu dengar.",
      },
    ],
    aftermath:
      "Ndari menambahkan satu versi lagi yang ia dengar dari kakeknya, dan Pak Wagiman mengangkat tangan tanda menyerah dengan senyum.",
    effects: { knowledgeXp: 30 },
    next: "e6-tale3",
  },
  {
    id: "e6-tale3",
    episodeId: "e6_undangan",
    type: "script",
    scene: "pendopo_dusk",
    showTara: true,
    cast: ["wagiman", "ndari"],
    condition: { kind: "flag", flag: "chosen_story_branch" },
    lines: [
      { speaker: "tara", expression: "thinking", text: "Kalau setiap orang mengubah sedikit ceritanya, bagaimana cerita aslinya tetap hidup?" },
      {
        speaker: "wagiman",
        text: "Mungkin justru karena berubah, ia tetap hidup. Yang berbahaya itu kalau semua orang bercerita persis sama karena tidak ada yang berani bertanya.",
      },
      {
        speaker: "tara",
        expression: "reflective",
        text: "Jadi kalau aku mencatat cerita, aku harus menuliskan siapa yang bercerita.",
      },
      { speaker: "wagiman", text: "Itu kalimat paling penting yang kau ucapkan sejak datang." },
    ],
    next: "e6-tale4",
  },
  {
    id: "e6-tale4",
    episodeId: "e6_undangan",
    type: "reward",
    scene: "pendopo_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "chosen_story_branch" },
    title: "Satu cerita rakyat tercatat",
    subtitle: "Kamu bisa berlatih menyusun urutan peristiwa cerita ini sambil belajar menghargai versi yang berbeda.",
    lines: [
      { speaker: "tara", expression: "warm", text: "Ndari bilang versinya lebih seru. Aku belum bisa memilih, dan sepertinya tidak perlu memilih." },
    ],
    effects: {
      knowledgeXp: 15,
      unlockQuests: ["sq_cerita_rakyat"],
      unlockCollection: ["folk_timun_mas", "folk_punakawan"],
      journal: ["j9_cerita_dari_wagiman"],
    },
    next: "e6-join",
  },

  /* --- Titik gabung --- */
  {
    id: "e6-join",
    episodeId: "e6_undangan",
    type: "script",
    scene: "village_square",
    showTara: true,
    lines: [
      {
        speaker: "narrator",
        text: "Sore itu Tara duduk lama sekali di bawah pohon. Bukunya bertambah tebal dengan catatan, tanda tanya, dan satu halaman yang belum selesai.",
      },
      {
        speaker: "tara",
        expression: "reflective",
        text: "Aku datang mencari arti satu kata. Sekarang ada lima kata, tiga nama orang, dan dua hal yang masih belum kupahami.",
      },
    ],
    next: "e6-n3",
  },
  {
    id: "e6-n3",
    episodeId: "e6_undangan",
    type: "script",
    scene: "banyan_dusk",
    showTara: true,
    cast: ["ndari"],
    lines: [
      {
        speaker: "ndari",
        text: "Kau akan tinggal berapa lama? Kazan bilang kau selalu pergi waktu matahari tenggelam.",
      },
      {
        speaker: "tara",
        expression: "warm",
        text: "Besok pagi aku lanjut lagi. Tapi sebelum pergi, ada satu halaman yang harus aku tulis dulu.",
      },
      {
        speaker: "ndari",
        text: "Halaman tentang apa?",
      },
      {
        speaker: "tara",
        expression: "reflective",
        text: "Tentang apa yang aku pahami di sini. Kalau tidak aku tulis, aku takut lupa kenapa aku datang.",
      },
    ],
    next: null,
  },
];

const episode6: Episode = {
  id: "e6_undangan",
  chapterId: CHAPTER_ID,
  index: 6,
  title: "Undangan",
  summary:
    "Tiga undangan, satu pagi: bermain di halaman, mendengarkan alat musik, atau mendengarkan cerita rakyat. Semuanya membuka jalan yang berbeda.",
  scene: "fields_morning",
  duration: "±8 menit",
  nodes: e6,
};

/* ============================================================
 * EPISODE 7 — Refleksi
 * ============================================================ */

const e7: StoryNode[] = [
  {
    id: "e7-n1",
    episodeId: "e7_refleksi",
    type: "script",
    scene: "banyan_dusk",
    showTara: true,
    lines: [
      {
        speaker: "narrator",
        text: "Matahari terakhir di Desa Candrageni berwarna jingga. Tara duduk di dahan beringin besar, dengan buku di pangkuannya.",
      },
      {
        speaker: "tara",
        expression: "reflective",
        text: "Kakek Wira selalu bilang: perjalanan belum selesai sebelum ditulis. Kalau tidak ditulis, ia hanya jadi kabar.",
      },
    ],
    next: "e7-n2a",
  },
  {
    id: "e7-n2a",
    episodeId: "e7_refleksi",
    type: "script",
    scene: "banyan_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "asked_about_tradition" },
    lines: [
      {
        speaker: "tara",
        expression: "warm",
        text: "Aku menemukan bahwa bertanya lebih baik daripada berpura-pura tahu. Pak Wagiman tidak sekali pun membuatku merasa bodoh — ia hanya menambahkan bagian yang belum aku tahu.",
      },
    ],
    next: "e7-n2b",
  },
  {
    id: "e7-n2b",
    episodeId: "e7_refleksi",
    type: "script",
    scene: "banyan_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "observed_scene_clue" },
    lines: [
      {
        speaker: "tara",
        expression: "thinking",
        text: "Aku juga belajar bahwa diam sebentar bisa membuat sesuatu terlihat. Bunyi dari bawah kaki Pak Wagiman tidak akan pernah aku temukan kalau aku terus bicara.",
      },
    ],
    next: "e7-n2c",
  },
  {
    id: "e7-n2c",
    episodeId: "e7_refleksi",
    type: "script",
    scene: "banyan_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "offered_help" },
    lines: [
      {
        speaker: "tara",
        expression: "warm",
        text: "Dan ternyata membantu membuat orang bercerita tanpa diminta. Bu Rukmini menceritakan ibunya hanya karena aku ikut menarik kain layar.",
      },
    ],
    next: "e7-n2d",
  },
  {
    id: "e7-n2d",
    episodeId: "e7_refleksi",
    type: "script",
    scene: "banyan_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "discovered_hidden_term" },
    lines: [
      {
        speaker: "tara",
        expression: "determined",
        text: "Kata 'guyub' masih belum selesai. Tapi aku sudah tahu siapa yang akan aku tanyakan dan di mana aku akan mencarinya. Itu sudah lebih baik daripada kemarin.",
      },
    ],
    next: "e7-n2e",
  },
  {
    id: "e7-n2e",
    episodeId: "e7_refleksi",
    type: "script",
    scene: "banyan_dusk",
    showTara: true,
    condition: { kind: "flag", flag: "notebook_examined" },
    lines: [
      {
        speaker: "tara",
        expression: "reflective",
        text: "Buku Kakek Wira masih banyak yang kosong dan pudar. Untuk pertama kalinya, aku tidak merasa itu menyedihkan. Mungkin itu sebabnya ia memberikannya kepadaku.",
      },
    ],
    next: "e7-n3",
  },
  {
    id: "e7-n3",
    episodeId: "e7_refleksi",
    type: "reflection",
    scene: "banyan_dusk",
    showTara: true,
    label: "Refleksi penutup bab",
    lines: [
      {
        speaker: "narrator",
        text: "Tara membuka halaman baru, dan menuliskan tanggal dengan hati-hati.",
      },
      {
        speaker: "tara",
        expression: "reflective",
        text: "Kau mau menulis bagian ini bersamaku, {player}? Aku suka mendengar versi orang lain.",
      },
    ],
    prompt: "Satu hal apa yang kamu bawa pulang dari Desa Candrageni?",
    helper:
      "Bisa berupa pengetahuan baru, kebiasaan kecil, atau pertanyaan yang masih menggantung. Tulisanmu tersimpan di perangkatmu sendiri.",
    chips: [
      "Cara bertanya yang lebih baik",
      "Mengamati hal kecil",
      "Makna membantu orang lain",
      "Kata yang belum kupahami",
      "Cerita yang ingin kuceritakan lagi",
      "Masih ragu",
    ],
    minLength: 20,
    effects: { knowledgeXp: 40 },
    next: "e7-n4",
  },
  {
    id: "e7-n4",
    episodeId: "e7_refleksi",
    type: "chapterEnd",
    scene: "sky_night",
    showTara: true,
    chapterId: CHAPTER_ID,
    label: "Penutup bab",
    effects: {
      flags: { chapter1_complete: true },
      knowledgeXp: 25,
      unlockCollection: ["mem_refleksi_bab1"],
      unlockAchievements: ["ach_story_keeper"],
      journal: ["j14_refleksi_bab_satu"],
    },
    next: null,
  },
];

const episode7: Episode = {
  id: "e7_refleksi",
  chapterId: CHAPTER_ID,
  index: 7,
  title: "Refleksi",
  summary: "Sebelum melanjutkan perjalanan, Tara menuliskan apa yang ia pahami — bersama pemain.",
  scene: "banyan_dusk",
  duration: "±5 menit",
  nodes: e7,
};

/* ============================================================
 * Bab
 * ============================================================ */

export const CHAPTER_1: Chapter = {
  id: CHAPTER_ID,
  index: 1,
  title: "Jejak Pertama",
  subtitle: "Kata yang belum dipahami",
  region: "Desa Candrageni (fiktif) · konteks Jawa",
  theme: "Wayang kulit, kebersamaan warga, dan cara belajar bertanya",
  premise:
    "Tara tiba di Desa Candrageni tepat ketika warga menyiapkan pertunjukan wayang kulit. Ia membawa buku catatan Kakek Wira yang belum bisa dibacanya, dan satu kebiasaan buruk: berpura-pura mengerti. Selama beberapa hari, Tara harus memilih antara bertanya, mengamati, atau ikut membantu.",
  teaser:
    "Perkenalan dengan tradisi pertunjukan wayang, kosakata baru, dan petunjuk pertama dari buku Kakek Wira.",
  scene: "hills_dawn",
  motif: "lamp",
  cast: ["tara", "ndari", "wagiman", "rukmini", "kakek"],
  themes: [
    "Wayang kulit sebagai pertunjukan bercerita",
    "Peran dalang, sinden, dan pengiring",
    "Kebersamaan warga saat menyiapkan acara",
    "Kerajinan tatah sungging (gambaran umum)",
    "Permainan tradisional dan cerita rakyat",
  ],
  collections: [
    "vocab_ringgit",
    "vocab_dalang",
    "vocab_kelir",
    "vocab_sinden",
    "vocab_cempurit",
    "vocab_guyub",
    "perf_wayang_kulit",
    "perf_gamelan",
    "perf_kepyak",
    "craft_tatah_sungging",
    "craft_gedebog",
    "craft_kothak",
    "game_engklek",
    "folk_timun_mas",
    "folk_punakawan",
    "note_gotong_royong",
    "mem_buku_kakek",
  ],
  quests: [
    "sq_makna_bayangan",
    "sq_biji_petak",
    "sq_cerita_rakyat",
    "hq_kata_tertinggal",
    "hq_halaman_lipat",
    "pq_suara_pertama",
    "pq_petak_halaman",
    "pq_cari_sumber",
    "pq_wawancara_kecil",
  ],
  contentNote: {
    kind: "mixed",
    text: "Desa, warga, dan tokoh dalam bab ini adalah fiksi. Informasi budaya yang muncul (wayang kulit, gamelan, tatah sungging, permainan tradisional, cerita rakyat) ditulis secara umum dari pengetahuan yang terdokumentasi luas, dengan catatan bahwa nama, aturan, dan makna dapat berbeda antar daerah. Setiap catatan budaya di Collection mencantumkan tingkat keandalan dan saran verifikasi.",
  },
  unlock: {
    reason: "Bab pertama sudah terbuka.",
    hint: "Mulai dari episode pertama.",
  },
  episodes: [episode1, episode2, episode3, episode4, episode5, episode6, episode7],
};
