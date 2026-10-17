/**
 * TARA: Nusantara Story Quest
 * Data quest: sampingan (latihan di aplikasi), tersembunyi, dan praktik dunia nyata.
 * Semua teks ditulis dalam Bahasa Indonesia.
 */

import type { Quest, QuestCategory } from "@/lib/types";

/* ============================================================
 * Kategori quest
 * ============================================================ */

export const QUEST_CATEGORY_META: { id: QuestCategory; label: string; blurb: string }[] = [
  {
    id: "side",
    label: "Quest Sampingan",
    blurb: "Latihan singkat di aplikasi yang tumbuh dari percakapan Tara dengan warga desa.",
  },
  {
    id: "hidden",
    label: "Quest Tersembunyi",
    blurb: "Terbuka saat kamu memperhatikan hal kecil yang hampir terlewat, seperti satu kata atau satu halaman.",
  },
  {
    id: "practice",
    label: "Quest Praktik",
    blurb: "Aktivitas nyata dengan beberapa pilihan cara, dari yang bersama orang lain sampai yang bisa dilakukan sendiri.",
  },
];

/* ============================================================
 * Daftar quest
 * ============================================================ */

export const QUESTS: Quest[] = [
  /* ---------- 1. SIDE: Makna di Balik Bayangan ---------- */
  {
    id: "sq_makna_bayangan",
    category: "side",
    title: "Makna di Balik Bayangan",
    tagline: "Bayangan, suara, dan cerita yang menyatu di malam pertunjukan.",
    motif: "lamp",
    goal: "Memahami peran-peran dalam pertunjukan wayang supaya Tara bisa mengikuti malam pertunjukan dengan lebih paham.",
    storyLink: "Tara baru saja bertanya kepada Pak Wagiman tentang pertunjukan yang sedang disiapkan warga.",
    duration: "±6 menit",
    activityType: "Latihan mencocokkan di aplikasi",
    completion: "exercise",
    unlock: {
      requires: { kind: "flag", flag: "asked_about_tradition" },
      reason: "Terkunci sampai Tara bertanya tentang pertunjukan wayang; latihan ini tumbuh dari rasa ingin tahunya.",
      hint: "Buka Bab 1, Episode 3 (e3_pilihan) dan pilih untuk bertanya kepada Pak Wagiman tentang pertunjukan wayang.",
    },
    reward: {
      knowledgeXp: 40,
      collection: ["perf_wayang_kulit"],
      achievements: ["ach_curious_mind"],
      journal: ["j8_dalang_bukan_boneka"],
    },
    steps: [
      {
        id: "bayangan_learn",
        title: "Dengar dulu istilahnya",
        body: "Pak Wagiman menyebut beberapa istilah saat menjelaskan pertunjukan nanti. Tidak perlu hafal semuanya, cukup kenali perannya.",
        kind: "learn",
      },
      {
        id: "bayangan_do",
        title: "Cocokkan istilah dan maknanya",
        body: "Cocokkan lima istilah dengan makna yang paling sesuai. Boleh mencoba beberapa kali tanpa takut salah.",
        kind: "do",
      },
      {
        id: "bayangan_note",
        title: "Ingat soal variasi",
        body: "Kebiasaan dan istilah pertunjukan bisa berbeda antar daerah. Jadikan catatan ini pintu masuk, bukan patokan tunggal.",
        kind: "note",
      },
      {
        id: "bayangan_reflect",
        title: "Simpan satu pertanyaan",
        body: "Tulis satu bagian pertunjukan yang paling ingin kamu lihat dengan matamu sendiri.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "matching",
      instruction: "Cocokkan setiap istilah dengan makna yang paling sesuai.",
      pairs: [
        {
          id: "dalang",
          left: "dalang",
          right: "Orang yang memainkan boneka dan menuturkan cerita",
          note: "Dalang mengatur jalannya cerita sekaligus mengisi suara para tokoh.",
        },
        {
          id: "kelir",
          left: "kelir",
          right: "Layar kain tempat bayangan boneka ditampilkan",
          note: "Kelir dibentangkan di depan penonton, dan boneka berada di belakangnya.",
        },
        {
          id: "gamelan",
          left: "gamelan",
          right: "Ansambel musik yang mengiringi pertunjukan",
          note: "Gamelan memberi suasana pada setiap adegan dan gerak dalang.",
        },
        {
          id: "sinden",
          left: "sinden",
          right: "Penyanyi yang mengiringi pertunjukan dengan tembang",
          note: "Sinden menyanyikan lagu yang menyatu dengan jalannya cerita.",
        },
        {
          id: "gedebog",
          left: "gedebog",
          right: "Batang pisang tempat boneka ditancapkan",
          note: "Gedebog menjadi panggung sederhana bagi boneka wayang.",
        },
      ],
      caveat: "Istilah dan susunan pertunjukan bisa berbeda antar daerah dan antar kelompok pemain, jadi anggap ini gambaran umum.",
    },
    reflectionPrompt: "Bagian mana dari pertunjukan wayang yang paling ingin kamu lihat sendiri? Mengapa?",
    reflectionHelper: "Boleh mulai dari hal kecil: bayangan boneka di kelir, suara gamelan, atau cerita yang dibawakan dalang.",
    requiresReflection: true,
    alternatives: [
      {
        label: "Ulangi sambil membaca catatan",
        body: "Buka lagi setiap pasangan yang sudah benar, lalu baca catatannya sekali lagi.",
      },
      {
        label: "Bagikan satu istilah baru",
        body: "Ceritakan satu istilah yang baru kamu pelajari kepada keluarga atau teman dengan bahasamu sendiri.",
      },
    ],
    honestyNote: "Latihan ini berlangsung di dalam aplikasi dan tidak memeriksa pengetahuanmu di dunia nyata. Istilah pertunjukan bisa berbeda antar daerah, jadi anggap ini langkah awal.",
  },

  /* ---------- 2. SIDE: Biji dan Petak ---------- */
  {
    id: "sq_biji_petak",
    category: "side",
    title: "Biji dan Petak",
    tagline: "Permainan halaman desa yang masih hidup sampai hari ini.",
    motif: "star",
    goal: "Mengenali beberapa permainan tradisional dan cara memainkannya secara umum.",
    storyLink: "Ndari mengajak Tara bermain engklek pada pagi hari.",
    duration: "±5 menit",
    activityType: "Latihan mencocokkan dan menyusun di aplikasi",
    completion: "exercise",
    unlock: {
      requires: { kind: "flag", flag: "met_ndari" },
      reason: "Terkunci sampai Tara berkenalan dengan Ndari; ajakan bermain itulah yang membuka latihan ini.",
      hint: "Buka Bab 1, Episode 2 (e2_berkumpul) dan sapa Ndari saat ia mengajak bermain di halaman.",
    },
    reward: {
      knowledgeXp: 40,
      collection: ["game_engklek", "game_congklak"],
      journal: ["j11_pagi_di_halaman"],
    },
    steps: [
      {
        id: "biji_learn",
        title: "Permainan pagi di halaman",
        body: "Ndari menyebut beberapa permainan yang akrab baginya. Beberapa mungkin juga kamu kenal dengan nama lain.",
        kind: "learn",
      },
      {
        id: "biji_do",
        title: "Cocokkan nama dan cara mainnya",
        body: "Pasangkan setiap permainan dengan gambaran cara memainkannya.",
        kind: "do",
      },
      {
        id: "biji_reflect",
        title: "Bayangkan memainkannya",
        body: "Pilih satu permainan yang paling menarik bagimu dan bayangkan halaman tempat kamu akan memainkannya.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "matching",
      instruction: "Cocokkan setiap permainan dengan cara memainkannya.",
      pairs: [
        {
          id: "engklek",
          left: "engklek",
          right: "Melompat dari satu petak ke petak lain dengan satu kaki",
          note: "Petaknya digambar di tanah dengan kapur atau ranting.",
        },
        {
          id: "congklak",
          left: "congklak",
          right: "Memindahkan biji ke lubang papan secara bergiliran",
          note: "Setiap pemain berusaha mengumpulkan biji di lubang miliknya.",
        },
        {
          id: "gobak_sodor",
          left: "gobak sodor",
          right: "Melewati penjaga untuk sampai ke garis akhir",
          note: "Dua tim bergantian menjaga dan menerobos barisan.",
        },
        {
          id: "egrang",
          left: "egrang",
          right: "Berjalan di atas tongkat panjang yang dipijak",
          note: "Diperlukan keseimbangan, dan biasanya dimainkan di tempat lapang.",
        },
      ],
      caveat: "Nama dan aturan permainan bisa berbeda antar daerah, bahkan antar kampung; yang dicocokkan di sini adalah gambaran umumnya.",
    },
    alternatives: [
      {
        label: "Bayangkan halaman rumah dulu",
        body: "Sebelum mencocokkan, bayangkan halaman rumahmu; permainan apa yang cocok dimainkan di situ?",
      },
      {
        label: "Tanya permainan keluarga",
        body: "Tanyakan permainan apa yang dulu dimainkan keluargamu, lalu bandingkan dengan daftar ini.",
      },
    ],
    honestyNote: "Latihan ini hanya berlangsung di aplikasi dan tidak memeriksa keadaan di daerahmu. Nama serta aturan permainan bisa berbeda, dan itu wajar.",
  },

  /* ---------- 3. SIDE: Cerita dari Mulut ke Mulut ---------- */
  {
    id: "sq_cerita_rakyat",
    category: "side",
    title: "Cerita dari Mulut ke Mulut",
    tagline: "Kisah yang berpindah dari satu penutur ke penutur lain.",
    motif: "spiral",
    goal: "Mengenali tokoh dan urutan peristiwa dalam cerita rakyat yang diceritakan Pak Wagiman.",
    storyLink: "Pak Wagiman menceritakan kisah Timun Mas sambil menunggu malam.",
    duration: "±6 menit",
    activityType: "Latihan pemahaman cerita di aplikasi",
    completion: "exercise",
    unlock: {
      requires: { kind: "flag", flag: "listened_to_tale" },
      reason: "Terkunci sampai Tara mendengarkan cerita Pak Wagiman; urutan peristiwa itu yang nanti kamu susun.",
      hint: "Di Bab 1, Episode 4 (e4_petunjuk), duduk dan dengarkan cerita Timun Mas dari Pak Wagiman sampai selesai.",
    },
    reward: {
      knowledgeXp: 45,
      collection: ["folk_timun_mas"],
      journal: ["j9_cerita_dari_wagiman"],
    },
    steps: [
      {
        id: "cerita_learn",
        title: "Kisah sambil menunggu malam",
        body: "Pak Wagiman bercerita dengan gaya penuturnya sendiri, lengkap dengan jeda dan penekanan.",
        kind: "learn",
      },
      {
        id: "cerita_do",
        title: "Susun urutan peristiwanya",
        body: "Susun lima peristiwa sesuai urutan dalam versi cerita yang kamu dengar.",
        kind: "do",
      },
      {
        id: "cerita_reflect",
        title: "Ingat cerita lain",
        body: "Pikirkan satu cerita rakyat lain yang pernah kamu dengar dan bagian mana yang paling kamu ingat.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "ordering",
      instruction: "Susun peristiwa berikut sesuai urutan versi cerita yang paling banyak diceritakan.",
      items: [
        { id: "item_temuan", text: "Sepasang petani menemukan bayi perempuan di dalam timun raksasa." },
        { id: "item_permintaan", text: "Seorang raksasa meminta anak itu setelah ia besar." },
        { id: "item_kabur", text: "Anak itu melarikan diri dari sang raksasa." },
        { id: "item_bekal", text: "Ia melemparkan biji timun, jarum, dan garam ke arah raksasa." },
        { id: "item_selamat", text: "Rintangan itu menghentikan raksasa, dan anak itu selamat." },
      ],
      correctOrder: ["item_temuan", "item_permintaan", "item_kabur", "item_bekal", "item_selamat"],
      caveat: "Urutan dan rincian cerita berbeda antara penutur dan daerah; ini hanya salah satu versi yang banyak diceritakan.",
    },
    alternatives: [
      {
        label: "Dengar ulang ceritanya",
        body: "Buka kembali catatan kisah Pak Wagiman sebelum menyusun urutannya.",
      },
      {
        label: "Ceritakan ulang dengan versimu",
        body: "Setelah selesai, ceritakan ulang kisah ini dengan bahasamu sendiri kepada teman atau keluarga.",
      },
    ],
    honestyNote: "Urutan ini berasal dari salah satu versi yang banyak diceritakan dan tidak diverifikasi aplikasi sebagai satu-satunya versi yang benar.",
  },

  /* ---------- 4. HIDDEN: Kata yang Tertinggal ---------- */
  {
    id: "hq_kata_tertinggal",
    category: "hidden",
    title: "Kata yang Tertinggal",
    tagline: "Satu kata yang menggantung di ingatan Tara.",
    motif: "thread",
    goal: "Mencari makna kata \"guyub\" yang Tara dengar tetapi belum paham, dan menentukan sumber yang layak ditanya.",
    storyLink: "Tara mencatat kata itu di buku Kakek Wira agar tidak lupa.",
    duration: "±7 menit",
    activityType: "Penelusuran sumber + refleksi",
    completion: "exercise",
    unlock: {
      requires: { kind: "flag", flag: "discovered_hidden_term" },
      reason: "Terkunci sampai Tara menemukan kata yang belum ia pahami; penelusuran ini berawal dari kata itu.",
      hint: "Perhatikan kata yang membingungkan Tara di Bab 1, Episode 4 (e4_petunjuk), lalu selesaikan adegannya sampai kata itu dicatat.",
    },
    reward: {
      knowledgeXp: 50,
      practiceXp: 0,
      collection: ["vocab_guyub"],
      achievements: ["ach_culture_connector"],
      journal: ["j6_guyub_misteri"],
    },
    steps: [
      {
        id: "kata_learn",
        title: "Satu kata yang menggantung",
        body: "Tara mendengar kata \"guyub\" saat warga berbincang, tetapi ia belum yakin dengan maknanya.",
        kind: "learn",
      },
      {
        id: "kata_do",
        title: "Pilih langkah yang paling masuk akal",
        body: "Tentukan cara mencari makna kata ini dari pilihan yang tersedia.",
        kind: "do",
      },
      {
        id: "kata_note",
        title: "Perhatikan siapa yang berbicara",
        body: "Makna sebuah kata bisa terasa berbeda tergantung siapa yang mengucapkannya dan di daerah mana kata itu dipakai.",
        kind: "note",
      },
      {
        id: "kata_reflect",
        title: "Catat temuanmu",
        body: "Tulis temuanmu dalam satu atau dua kalimat singkat; catatan sementara juga tidak apa-apa.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "quiz",
      intro: "Tara menuliskan kata \"guyub\" di buku Kakek Wira, tetapi ia belum tahu makna tepatnya.",
      question: "Kalau kamu ingin memahami kata \"guyub\" dengan lebih tepat, langkah mana yang paling masuk akal?",
      options: [
        {
          id: "opt_tanya_dan_bandingkan",
          label: "Bertanya kepada orang yang hidup dalam budaya itu, lalu membandingkan jawabannya dengan buku atau artikel dari lembaga yang jelas nama penerbitnya.",
          correct: true,
          feedback: "Bagus. Membandingkan jawaban penutur dan sumber tertulis membuat pemahamanmu lebih utuh.",
        },
        {
          id: "opt_tebak_meme",
          label: "Menebak maknanya dari meme lucu yang kebetulan lewat di layar.",
          correct: false,
          feedback: "Meme memang menghibur, tetapi maknanya sering dipotong agar lucu. Belum cukup untuk memahami sebuah kata.",
        },
        {
          id: "opt_percaya_komentar",
          label: "Percaya pada satu komentar anonim karena tulisannya terdengar meyakinkan.",
          correct: false,
          feedback: "Komentar anonim sulit dilacak asalnya. Lebih aman memilih sumber yang bisa kamu tanyai kembali.",
        },
        {
          id: "opt_anggap_sama",
          label: "Menganggap artinya sama persis di semua daerah.",
          correct: false,
          feedback: "Makna kata bisa bergeser antar daerah dan antar generasi. Memeriksa konteksnya membuatmu lebih tepat.",
        },
      ],
    },
    requiresDeclaration: true,
    declarationLabel: "Saya sudah mencari tahu makna kata ini dan mencatat temuan saya",
    alternatives: [
      {
        label: "Mulai dari kamus atau buku",
        body: "Catat nama kamus atau buku yang kamu pakai, lalu bandingkan dengan jawaban orang yang biasa memakai kata itu.",
      },
      {
        label: "Tulis dugaan dulu",
        body: "Tulis dugaanmu sebelum bertanya, lalu periksa apakah dugaan itu berubah setelah mendengar jawaban.",
      },
    ],
    honestyNote: "Aplikasi hanya mencatat apa yang kamu laporkan; aplikasi tidak memeriksa hasil pencarianmu di dunia nyata. Karena itu, tulis temuanmu sejujur mungkin.",
  },

  /* ---------- 5. HIDDEN: Halaman yang Terlipat ---------- */
  {
    id: "hq_halaman_lipat",
    category: "hidden",
    title: "Halaman yang Terlipat",
    tagline: "Rencana kecil untuk melanjutkan pencarian makna.",
    motif: "leaf",
    goal: "Menemukan cara Tara dan pemain melanjutkan pencarian makna dari catatan Kakek Wira, termasuk kemungkinan menemui orang atau lembaga yang tepat.",
    storyLink: "Halaman buku Kakek Wira yang terlipat memuat satu paragraf yang belum terbaca.",
    duration: "±8 menit",
    activityType: "Menyusun rencana belajar lanjutan",
    completion: "exercise",
    unlock: {
      requires: { kind: "flag", flag: "notebook_examined" },
      reason: "Terkunci sampai Tara memeriksa halaman terlipat di buku Kakek Wira; rencana belajar ini melanjutkan isi halaman itu.",
      hint: "Buka Bab 1, Episode 5 (e5_pemahaman_baru) dan pilih untuk memeriksa halaman buku Kakek Wira.",
    },
    reward: {
      knowledgeXp: 35,
      practiceXp: 25,
      collection: ["mem_buku_kakek"],
      journal: ["j15_rencana_lanjut"],
    },
    steps: [
      {
        id: "halaman_learn",
        title: "Halaman yang belum terbaca",
        body: "Satu paragraf di buku Kakek Wira masih terlipat. Tara ingin melanjutkan dari tempat ia berhenti.",
        kind: "learn",
      },
      {
        id: "halaman_do",
        title: "Susun rencana kecil",
        body: "Pilih langkah yang bisa kamu lakukan untuk mencari makna lanjutan dari catatan itu.",
        kind: "do",
      },
      {
        id: "halaman_note",
        title: "Tidak perlu langsung besar",
        body: "Rencana belajar boleh sederhana: satu istilah, satu sumber, dan satu pertanyaan.",
        kind: "note",
      },
      {
        id: "halaman_reflect",
        title: "Tulis rencanamu",
        body: "Simpan satu tujuan kecil dan satu orang atau tempat yang ingin kamu tanyai.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "checklist",
      instruction: "Centang langkah yang sudah kamu siapkan untuk melanjutkan pencarian makna.",
      items: [
        { id: "halaman_tulis_istilah", text: "Menuliskan istilah yang belum kamu pahami dalam satu daftar singkat." },
        { id: "halaman_pilih_sumber", text: "Memilih satu sumber tepercaya yang akan kamu tanyai." },
        { id: "halaman_siapkan_pertanyaan", text: "Menyiapkan dua pertanyaan yang ingin kamu ajukan." },
        { id: "halaman_rencanakan_waktu", text: "Merencanakan waktu dan cara untuk menanyakan hal itu." },
      ],
    },
    reflectionPrompt: "Apa istilah atau tradisi di sekitarmu yang ingin kamu pahami lebih baik? Siapa yang bisa kamu tanyakan?",
    requiresReflection: true,
    alternatives: [
      {
        label: "Mulai dari satu istilah",
        body: "Pilih satu istilah yang paling sering terlintas di pikiranmu dan fokus pada istilah itu.",
      },
      {
        label: "Susun rencana bersama",
        body: "Ajak teman atau keluarga menyusun rencana belajar bersama agar saling mengingatkan.",
      },
    ],
    honestyNote: "Rencana belajar ini disimpan di perangkatmu sendiri dan tidak diverifikasi oleh aplikasi. Kamu bebas mengubah isinya kapan saja.",
  },

  /* ---------- 6. PRACTICE: Suara Pertama ---------- */
  {
    id: "pq_suara_pertama",
    category: "practice",
    title: "Suara Pertama",
    tagline: "Berlatih tiga sapaan Jawa dengan cara yang nyaman bagimu.",
    motif: "wave",
    goal: "Mencoba mengucapkan tiga sapaan Jawa yang Tara dengar di desa, dengan cara yang paling nyaman bagi pemain.",
    storyLink: "Sejak tiba di Desa Candrageni, Tara mendengar sapaan Jawa hangat dari warga.",
    duration: "±10 menit",
    activityType: "Latihan pelafalan (boleh sendiri)",
    completion: "report",
    unlock: {
      requires: { kind: "flag", flag: "learned_greeting" },
      reason: "Terkunci sampai Tara belajar sapaan Jawa; latihan ini memakai sapaan yang ia dengar di desa.",
      hint: "Di Bab 1, Episode 1 (e1_kedatangan), pilih untuk belajar sapaan Jawa bersama Rukmini.",
    },
    reward: {
      practiceXp: 60,
      collection: ["vocab_sugeng_rawuh", "vocab_matur_nuwun"],
      achievements: ["ach_first_practice"],
      journal: ["j10_suara_pertama"],
    },
    steps: [
      {
        id: "suara_learn",
        title: "Tiga sapaan dari desa",
        body: "Tara mendengar sapaan ini di jalan desa dan di pendopo. Sekarang giliranmu mencobanya.",
        kind: "learn",
      },
      {
        id: "suara_do",
        title: "Dengarkan dan ucapkan",
        body: "Putar bunyinya, lalu ucapkan setiap sapaan dengan kecepatanmu sendiri. Tidak ada target kecepatan.",
        kind: "do",
      },
      {
        id: "suara_note",
        title: "Pilih cara yang nyaman",
        body: "Boleh bersama orang lain, boleh sendiri. Keduanya sama-sama sah.",
        kind: "note",
      },
      {
        id: "suara_reflect",
        title: "Tulis kesanmu",
        body: "Catat bagian yang paling sulit dan bagian yang ternyata lebih mudah dari dugaanmu.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "pronunciation",
      instruction: "Dengarkan dan ucapkan setiap sapaan dengan tempo yang nyaman bagimu.",
      entries: [
        {
          id: "sugeng_rawuh",
          label: "sugeng rawuh",
          phonetics: "su-geng ra-wuh",
          meaning: "sapaan selamat datang",
          note: "Pelafalan bisa sedikit berbeda antar daerah; ikuti cara orang di sekitarmu mengucapkannya.",
          sound: "speech",
        },
        {
          id: "matur_nuwun",
          label: "matur nuwun",
          phonetics: "ma-tur nu-wun",
          meaning: "terima kasih",
          note: "Dipakai saat menerima bantuan atau pemberian dari orang lain.",
          sound: "speech",
        },
        {
          id: "sugeng_enjing",
          label: "sugeng enjing",
          phonetics: "su-geng en-jing",
          meaning: "selamat pagi",
          note: "Biasa diucapkan saat bertemu tetangga di jalan desa pada pagi hari.",
          sound: "speech",
        },
      ],
    },
    reflectionPrompt: "Bagaimana rasanya mencoba kata baru? Bagian mana yang paling sulit?",
    requiresReflection: true,
    requiresDeclaration: true,
    declarationLabel: "Saya sudah mencoba mengucapkan ketiga sapaan ini",
    alternatives: [
      {
        label: "Bersama teman atau keluarga",
        body: "Ucapkan ketiga sapaan ini bersama teman atau keluarga, lalu saling mendengarkan.",
      },
      {
        label: "Latihan sendiri, tiga kali",
        body: "Ucapkan setiap sapaan dengan pelan sebanyak tiga kali tanpa perlu ada yang mendengarkan.",
      },
      {
        label: "Cek lewat sumber tepercaya",
        body: "Tanyakan pelafalan yang biasa di daerahmu kepada guru, tetangga, atau penutur yang kamu kenal.",
      },
    ],
    honestyNote: "Latihan ini kamu laporkan sendiri dan tidak diverifikasi aplikasi. Kejujuran soal apa yang benar-benar kamu coba lebih berharga daripada terlihat mengesankan.",
    selfReported: true,
  },

  /* ---------- 7. PRACTICE: Petak di Halaman ---------- */
  {
    id: "pq_petak_halaman",
    category: "practice",
    title: "Petak di Halaman",
    tagline: "Mencoba permainan tradisional di halaman nyata.",
    motif: "star",
    goal: "Mencoba satu permainan tradisional, idealnya bersama orang lain, atau versi yang bisa dilakukan sendirian.",
    storyLink: "Ndari mengajak Tara bermain engklek, dan Tara ingin mencobanya dengan kaki dan tanah sungguhan.",
    duration: "±20 menit",
    activityType: "Permainan bersama orang lain (atau versi mandiri)",
    completion: "report",
    unlock: {
      requires: { kind: "flag", flag: "met_ndari" },
      reason: "Terkunci sampai Tara bertemu Ndari; permainan itulah yang sekarang kamu coba di dunia nyata.",
      hint: "Buka Bab 1, Episode 2 (e2_berkumpul) dan terima ajakan Ndari untuk bermain engklek di halaman.",
    },
    reward: {
      practiceXp: 60,
      collection: ["game_engklek", "mem_petak_di_tanah"],
    },
    steps: [
      {
        id: "petak_learn",
        title: "Dari halaman desa ke halaman rumah",
        body: "Ndari mengajak Tara bermain engklek. Kini Tara ingin mencobanya di dunia nyata, dan kamu bisa ikut.",
        kind: "learn",
      },
      {
        id: "petak_do",
        title: "Coba satu putaran",
        body: "Gambar petaknya, lalu mainkan satu putaran dengan aturan yang kamu pilih.",
        kind: "do",
      },
      {
        id: "petak_note",
        title: "Utamakan keselamatan",
        body: "Pilih tempat yang aman dan jangan mengganggu orang lain di sekitarmu.",
        kind: "note",
      },
      {
        id: "petak_reflect",
        title: "Bandingkan aturan",
        body: "Tulis perbedaan antara aturan yang kamu coba dan aturan yang dikenal di keluargamu.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "checklist",
      instruction: "Centang hal-hal yang sudah kamu lakukan saat mencoba permainan ini.",
      items: [
        { id: "petak_gambar_petak", text: "Menggambar petak engklek dengan kapur, ranting, atau alat lain yang aman." },
        { id: "petak_jelaskan_aturan", text: "Menjelaskan aturan permainan kepada teman atau keluarga." },
        { id: "petak_coba_putaran", text: "Mencoba satu putaran permainan sampai selesai." },
        { id: "petak_catat_versi", text: "Mencatat aturan versi daerahmu sendiri dan siapa yang mengajarkannya." },
        { id: "petak_tulis_seru", text: "Menuliskan satu hal yang lucu atau seru selama bermain." },
      ],
    },
    reflectionPrompt: "Apa yang berbeda antara aturan yang kamu coba dan aturan yang dikenal di keluargamu?",
    requiresReflection: true,
    requiresDeclaration: true,
    declarationLabel: "Saya sudah mencoba memainkan atau menggambar permainan ini",
    alternatives: [
      {
        label: "Main bersama teman atau keluarga",
        body: "Ajak teman atau keluarga bermain engklek di halaman atau tanah lapang dekat rumah.",
      },
      {
        label: "Ajari orang lain",
        body: "Tunjukkan cara bermain kepada adik, kakak, atau teman yang belum pernah mencobanya.",
      },
      {
        label: "Versi mandiri",
        body: "Gambar petaknya, lalu coba satu putaran sendiri. Tidak perlu ada yang menonton.",
      },
      {
        label: "Belajar dari tutorial",
        body: "Tonton tutorial dari sumber yang menyebutkan asalnya, lalu catat apa yang berbeda dari versi daerahmu.",
      },
    ],
    honestyNote: "Permainan ini kamu laporkan sendiri dan tidak diverifikasi aplikasi. Laporkan dengan jujur; pengalaman nyata lebih berharga daripada laporan yang terdengar hebat.",
    selfReported: true,
  },

  /* ---------- 8. PRACTICE: Mencari Sumber Tepercaya ---------- */
  {
    id: "pq_cari_sumber",
    category: "practice",
    title: "Mencari Sumber Tepercaya",
    tagline: "Menemukan satu sumber yang bisa dipercaya.",
    motif: "star",
    goal: "Menemukan satu sumber tepercaya tentang satu tradisi di sekitar pemain, seperti perpustakaan, museum, sanggar, komunitas, tokoh setempat, atau sumber resmi.",
    storyLink: "Setelah memahami satu hal baru di Episode 5, Tara ingin melangkah ke sumber yang bisa ditanya balik.",
    duration: "±15 menit",
    activityType: "Penelusuran sumber budaya nyata",
    completion: "report",
    unlock: {
      requires: { kind: "episodeDone", episodeId: "e5_pemahaman_baru" },
      reason: "Terkunci sampai Bab 1, Episode 5 selesai; penelusuran sumber sebaiknya dimulai setelah Tara memahami satu hal baru.",
      hint: "Selesaikan Bab 1, Episode 5 (e5_pemahaman_baru) lebih dulu, lalu buka kembali quest ini.",
    },
    reward: {
      practiceXp: 50,
      collection: ["note_belajar_dari_pelaku"],
      achievements: ["ach_culture_connector"],
    },
    steps: [
      {
        id: "sumber_learn",
        title: "Sumber bisa bermacam-macam",
        body: "Sumber bisa berupa buku, dokumenter, museum, sanggar, komunitas, atau orang yang menggeluti tradisi itu.",
        kind: "learn",
      },
      {
        id: "sumber_do",
        title: "Cari dan catat satu sumber",
        body: "Telusuri satu tradisi, lalu catat sumber yang kamu temukan beserta nama orang atau lembaganya.",
        kind: "do",
      },
      {
        id: "sumber_note",
        title: "Satu sumber yang jelas cukup",
        body: "Satu sumber yang bisa disebutkan namanya lebih berguna daripada banyak sumber tanpa asal yang jelas.",
        kind: "note",
      },
      {
        id: "sumber_reflect",
        title: "Tulis alasannya",
        body: "Jelaskan mengapa kamu menganggap sumber itu cukup tepercaya.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "checklist",
      instruction: "Centang langkah yang sudah kamu lakukan dalam penelusuran ini.",
      items: [
        { id: "sumber_pilih_tradisi", text: "Memilih satu tradisi yang ingin kamu telusuri." },
        { id: "sumber_cari", text: "Mencari atau menghubungi satu sumber yang membahas tradisi itu." },
        { id: "sumber_catat_nama", text: "Mencatat nama sumbernya dengan lengkap, bukan hanya menulis kata internet." },
        { id: "sumber_hal_baru", text: "Menuliskan satu hal baru yang kamu pelajari dari sumber itu." },
      ],
    },
    reflectionPrompt: "Sumber apa yang kamu temukan, dan mengapa kamu menganggapnya cukup tepercaya?",
    requiresReflection: true,
    requiresDeclaration: true,
    declarationLabel: "Saya sudah mencari dan mencatat satu sumber",
    alternatives: [
      {
        label: "Baca buku atau artikel resmi",
        body: "Kunjungi perpustakaan atau baca artikel dari lembaga resmi yang mencantumkan penulis dan penerbitnya.",
      },
      {
        label: "Tonton dokumenter",
        body: "Pilih dokumenter yang menyebutkan narasumbernya, lalu catat nama mereka.",
      },
      {
        label: "Ikut komunitas daring",
        body: "Bergabung dengan komunitas budaya lokal di internet dan perhatikan siapa yang aktif menjawab.",
      },
      {
        label: "Tanya keluarga",
        body: "Tanyakan tradisi dari kampung halaman keluargamu, lalu catat siapa yang bercerita.",
      },
    ],
    honestyNote: "Sumber ini kamu catat sendiri dan tidak diverifikasi aplikasi. Kejujuran laporanmu lebih penting daripada membuat temuan yang terlihat mengesankan.",
    selfReported: true,
  },

  /* ---------- 9. PRACTICE: Wawancara Kecil ---------- */
  {
    id: "pq_wawancara_kecil",
    category: "practice",
    title: "Wawancara Kecil",
    tagline: "Bertanya dengan sopan dan mendengarkan dengan penuh perhatian.",
    motif: "thread",
    goal: "Bertanya dengan sopan kepada satu orang yang mengenal sebuah tradisi, atau menonton dan membaca wawancara tepercaya bila bertanya langsung belum memungkinkan.",
    storyLink: "Tara menawarkan bantuan menyiapkan pertunjukan, dan warga bersedia bercerita lebih banyak.",
    duration: "±25 menit",
    activityType: "Berbincang dengan orang yang memahami tradisi",
    completion: "report",
    unlock: {
      requires: { kind: "flag", flag: "offered_help" },
      reason: "Terkunci sampai Tara menawarkan bantuan kepada warga; keberanian bertanya itu yang membuka quest ini.",
      hint: "Di Bab 1, Episode 6 (e6_undangan), pilih untuk menawarkan bantuan kepada warga yang bersiap untuk pertunjukan.",
    },
    reward: {
      practiceXp: 65,
      collection: ["note_belajar_dari_pelaku"],
      achievements: ["ach_open_hands"],
    },
    steps: [
      {
        id: "wawancara_learn",
        title: "Bertanya dengan sopan",
        body: "Warga desa senang bercerita asalkan kita bertanya dengan hormat dan benar-benar mendengarkan.",
        kind: "learn",
      },
      {
        id: "wawancara_do",
        title: "Siapkan lalu mulai berbincang",
        body: "Siapkan pertanyaan terbuka, minta izin dulu, lalu mulai berbincang atau menyimak wawancara tepercaya.",
        kind: "do",
      },
      {
        id: "wawancara_note",
        title: "Ada cerita yang tidak untuk dibagikan",
        body: "Tanyakan lebih dulu apakah pengalaman yang kamu dengar boleh dicatat dan dibagikan.",
        kind: "note",
      },
      {
        id: "wawancara_reflect",
        title: "Tulis kejutan kecilnya",
        body: "Catat hal paling mengejutkan yang kamu pelajari dari orang lain.",
        kind: "reflect",
      },
    ],
    exercise: {
      kind: "checklist",
      instruction: "Centang langkah yang sudah kamu lakukan saat berbincang atau menyimak wawancara.",
      items: [
        { id: "wawancara_pilih_tradisi", text: "Memilih satu tradisi yang ingin kamu tanyakan." },
        { id: "wawancara_siapkan_pertanyaan", text: "Menyiapkan pertanyaan terbuka, misalnya yang dimulai dengan kata bagaimana atau mengapa." },
        { id: "wawancara_minta_izin", text: "Meminta izin dulu sebelum mulai bertanya." },
        { id: "wawancara_catat_jawaban", text: "Mencatat jawaban dengan bahasamu sendiri." },
        { id: "wawancara_tanya_batas", text: "Menanyakan apakah ada hal yang sebaiknya tidak dibagikan ke publik." },
      ],
    },
    reflectionPrompt: "Apa hal paling mengejutkan yang kamu pelajari dari orang lain?",
    requiresReflection: true,
    requiresDeclaration: true,
    declarationLabel: "Saya sudah berbincang atau mendengarkan wawancara dari sumber tepercaya",
    alternatives: [
      {
        label: "Berbincang berhadapan langsung",
        body: "Duduk berbincang dengan orang yang kamu kenal memahami tradisi itu.",
      },
      {
        label: "Lewat pesan atau telepon",
        body: "Kirim pesan atau telepon bila bertemu langsung belum memungkinkan.",
      },
      {
        label: "Ikuti wawancara tepercaya",
        body: "Tonton atau baca wawancara dari sumber yang jelas, lalu catat siapa narasumbernya.",
      },
      {
        label: "Tanya anggota keluarga",
        body: "Tanyakan tradisi dari kampung halaman keluargamu kepada anggota keluarga.",
      },
    ],
    honestyNote: "Wawancara ini kamu laporkan sendiri dan tidak diverifikasi aplikasi. Laporkan dengan jujur, termasuk bila kamu hanya sempat menyimak wawancara; itu tetap berarti.",
    selfReported: true,
  },
];
