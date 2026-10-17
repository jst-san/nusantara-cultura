import type { CollectionCategory, CollectionItem } from "@/lib/types";

export const COLLECTION_CATEGORY_META: { id: CollectionCategory; label: string; blurb: string; motif: string }[] = [
  {
    id: "vocabulary",
    label: "Kosakata",
    blurb: "Kata-kata baru dari desa yang dikumpulkan sambil belajar.",
    motif: "thread",
  },
  {
    id: "folklore",
    label: "Cerita Rakyat",
    blurb: "Cerita yang diwariskan dari mulut ke mulut.",
    motif: "spiral",
  },
  {
    id: "games",
    label: "Permainan Tradisional",
    blurb: "Permainan yang mengajak bergerak dan bekerja sama.",
    motif: "star",
  },
  {
    id: "crafts",
    label: "Kerajinan",
    blurb: "Keterampilan tangan pembuat wayang dan perlengkapannya.",
    motif: "leaf",
  },
  {
    id: "performing",
    label: "Seni Pertunjukan",
    blurb: "Panggung, bunyi, dan cerita yang dihidupkan bersama.",
    motif: "gong",
  },
  {
    id: "notes",
    label: "Catatan Budaya",
    blurb: "Catatan belajar tentang budaya dan cara memeriksanya.",
    motif: "kawung",
  },
  {
    id: "memories",
    label: "Kenangan & Refleksi",
    blurb: "Kenangan fiktif Tara selama mengembara di desa.",
    motif: "lamp",
  },
];

export const COLLECTION_ITEMS: CollectionItem[] = [
  /* ---------- Kosakata ---------- */
  {
    id: "vocab_ringgit",
    category: "vocabulary",
    title: "Ringgit",
    subtitle: "Kata lama untuk wayang",
    summary:
      "Ringgit adalah kata lama yang di beberapa daerah dipakai untuk menyebut wayang atau boneka pertunjukan. Kata yang sama juga dikenal sebagai nama mata uang Malaysia.",
    context:
      "Dalam naskah Jawa Kuno dan dalam tutur sebagian daerah, ringgit mengacu pada wayang atau pertunjukan boneka. Penutur bahasa Indonesia masa kini mengenal ringgit terutama sebagai nama mata uang Malaysia. Satu kata bisa membawa makna berbeda tergantung tempat dan zaman, sehingga istilah seperti ini sebaiknya dicatat lalu diperiksa. Di desa ini Pak Wagiman memakai kata ringgit ketika memperkenalkan pertunjukan malam.",
    region: "Jawa (umum)",
    reliability: "needs-verification",
    sourceNote:
      "Istilah ini dicatat dari percakapan di desa dalam cerita dan belum diperiksa silang. Jejak kata ringgit memang muncul dalam pembahasan bahasa dan naskah lama, tetapi sebaran serta makna persisnya berbeda antar sumber.",
    verifyHint:
      "Tanyakan kepada dalang atau pengajar bahasa Jawa, lalu periksa kamus bahasa Jawa dan kumpulan naskah lama di perpustakaan daerah.",
    motif: "wave",
    related: ["vocab_dalang", "perf_wayang_kulit", "mem_buku_kakek"],
    clarify: {
      flag: "ringgit_explained",
      text: "Di desa ini Pak Wagiman menyebut wayang kulit juga sebagai 'ringgit'. Nama tradisi memang sering berbeda antar daerah — catat istilahnya, lalu pastikan makna persisnya lewat sumber tepercaya.",
    },
    tags: ["bahasa", "wayang", "kata lama"],
  },
  {
    id: "vocab_guyub",
    category: "vocabulary",
    title: "Guyub",
    subtitle: "Kebersamaan yang terasa",
    summary:
      "Guyub adalah kata Jawa yang menggambarkan kebersamaan dan kerukunan warga. Rasanya berbeda-beda di setiap kampung.",
    context:
      "Guyub sering dipakai untuk menggambarkan semangat kebersamaan ketika warga bekerja atau berkumpul. Nilai ini dekat dengan praktik gotong royong yang hidup di banyak kampung. Karena kehidupan setiap kampung berbeda, cara orang menggambarkan dan menjalani guyub juga tidak sama.",
    region: "Jawa (umum)",
    reliability: "needs-verification",
    sourceNote:
      "Istilah ini dicatat dari percakapan di desa dalam cerita dan belum diperiksa silang. Sebagai kata Jawa, guyub dibahas dalam banyak sumber bahasa, tetapi contoh pengamalannya berbeda antar masyarakat.",
    verifyHint:
      "Ajak warga atau sesepuh kampung bercerita tentang kegiatan bersama, lalu catat contoh nyata yang kamu saksikan sendiri.",
    motif: "kawung",
    related: ["note_gotong_royong", "vocab_matur_nuwun", "mem_refleksi_bab1"],
    clarify: {
      flag: "guyub_explained",
      text: "Guyub adalah kata Jawa yang menggambarkan kebersamaan, kerukunan, dan rasa saling menjaga di dalam masyarakat. Bekerja bakti atau menyiapkan acara bersama sering dianggap sebagai wujud guyub, tetapi bentuk dan kadarnya berbeda di setiap kampung.",
    },
    tags: ["bahasa", "kebersamaan", "masyarakat"],
  },
  {
    id: "vocab_sugeng_rawuh",
    category: "vocabulary",
    title: "Sugeng rawuh",
    subtitle: "Sapaan selamat datang",
    summary:
      "Sugeng rawuh adalah sapaan Jawa untuk menyambut tamu, kira-kira berarti selamat datang. Biasanya diucapkan dengan sikap yang santun.",
    context:
      "Sapaan ini dipakai untuk menyambut orang yang datang, misalnya di pendapa atau di depan rumah. Ucapannya sering disertai sikap tubuh yang santun seperti menunduk ringan dan senyum. Tingkat bahasa Jawa memengaruhi pilihan kata sapaan, sehingga bentuknya bisa berbeda sesuai siapa yang berbicara dan kepada siapa.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Pengetahuan umum yang terdokumentasi luas dan diajarkan dalam banyak buku bahasa Jawa. Bentuk serta pemakaiannya dapat berbeda antar daerah dan tingkat bahasa.",
    verifyHint:
      "Perhatikan cara warga menyambut tamu di kampung atau acara budaya, lalu bandingkan dengan buku pelajaran bahasa Jawa.",
    motif: "leaf",
    related: ["vocab_matur_nuwun", "vocab_guyub", "note_nama_tradisi_berbeda"],
    tags: ["bahasa", "sapaan", "kesantunan"],
  },
  {
    id: "vocab_matur_nuwun",
    category: "vocabulary",
    title: "Matur nuwun",
    subtitle: "Terima kasih",
    summary:
      "Matur nuwun berarti terima kasih dalam bahasa Jawa krama. Diucapkan ketika menerima bantuan atau pemberian.",
    context:
      "Ungkapan ini termasuk krama, tingkat bahasa yang dipakai untuk menghormati lawan bicara. Biasanya diucapkan dengan nada lembut dan pandangan yang ramah. Ucapan terima kasih juga berbeda antar bahasa daerah, misalnya di wilayah berbahasa Sunda dikenal hatur nuhun, sehingga konteks selalu penting.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Pengetahuan umum yang terdokumentasi luas dan muncul dalam banyak buku bahasa Jawa. Ucapan terima kasih berbeda-beda antar bahasa daerah dan antar tingkat bahasa.",
    verifyHint:
      "Berlatihlah bersama penutur bahasa Jawa, atau dengarkan bagaimana warga mengucapkannya setelah menerima bantuan.",
    motif: "lamp",
    related: ["vocab_sugeng_rawuh", "vocab_guyub", "note_belajar_dari_pelaku"],
    tags: ["bahasa", "sapaan", "krama"],
  },
  {
    id: "vocab_dalang",
    category: "vocabulary",
    title: "Dalang",
    subtitle: "Orang yang bercerita di balik layar",
    summary:
      "Dalang adalah orang yang menggerakkan wayang dan menuturkan cerita sepanjang pertunjukan. Ia juga mengatur suara, nyanyian, dan irama bersama para pengrawit.",
    context:
      "Seorang dalang menggerakkan wayang, membedakan suara tiap tokoh, dan menandai irama dengan alat seperti kepyak. Ia kadang menyisipkan nasihat dan sindiran halus lewat percakapan para tokoh. Menjadi dalang memerlukan latihan bertahun-tahun serta hafalan cerita yang panjang.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Pengetahuan umum yang terdokumentasi luas tentang wayang. Peran dan gaya dalang dapat berbeda antar daerah dan tradisi.",
    verifyHint:
      "Tonton pertunjukan wayang secara langsung atau melalui rekaman, lalu perhatikan bagaimana dalang mengubah suara dan mengatur irama.",
    motif: "thread",
    related: ["perf_wayang_kulit", "perf_kepyak", "vocab_cempurit"],
    tags: ["wayang", "pertunjukan", "peran"],
  },
  {
    id: "vocab_kelir",
    category: "vocabulary",
    title: "Kelir",
    subtitle: "Layar pertunjukan",
    summary:
      "Kelir adalah layar tempat bayangan wayang tampak saat pertunjukan. Dalam bahasa Indonesia, kelir juga berarti warna atau kain penutup tertentu.",
    context:
      "Kelir dibentangkan di tengah panggung dengan lampu di belakangnya, sehingga wayang tampak sebagai bayangan bergerak. Penonton di sisi lain menyaksikan bayangan itu mengikuti gerak tangan dalang. Dalam pemakaian sehari-hari, kata kelir juga dipakai untuk warna, jadi maknanya bergantung pada konteks kalimat.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Pengetahuan umum yang terdokumentasi luas, termasuk dalam kamus besar bahasa Indonesia dan bahasan tentang wayang. Bahan dan ukuran kelir dapat berbeda antar kelompok seni.",
    verifyHint:
      "Amati kelir langsung pada pertunjukan wayang, atau tanyakan kepada perajin dan dalang tentang bahan serta ukurannya.",
    motif: "star",
    related: ["perf_wayang_kulit", "vocab_dalang", "craft_gedebog"],
    tags: ["wayang", "layar", "panggung"],
  },
  {
    id: "vocab_sinden",
    category: "vocabulary",
    title: "Sinden",
    subtitle: "Suara yang mengiringi",
    summary:
      "Sinden adalah penyanyi perempuan dalam kelompok gamelan yang mengiringi pertunjukan. Suaranya menjadi selingan di tengah alunan alat musik.",
    context:
      "Sebutan lain untuk sinden adalah pesinden. Ia menyanyi mengikuti nada gamelan dan sering berpadu dengan suara dalang. Dalam pertunjukan wayang, sinden duduk di antara para pengrawit dan mengiringi adegan tertentu dengan tembang.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Pengetahuan umum yang terdokumentasi luas dalam bahasan seni pertunjukan. Susunan dan peran sinden dapat berbeda antar kelompok gamelan dan antar daerah.",
    verifyHint:
      "Dengarkan pertunjukan gamelan atau wayang, lalu perhatikan bagian ketika sinden menyanyi dan cara pemain lain mengikutinya.",
    motif: "gong",
    related: ["perf_gamelan", "perf_wayang_kulit", "vocab_dalang"],
    tags: ["gamelan", "vokal", "pertunjukan"],
  },
  {
    id: "vocab_cempurit",
    category: "vocabulary",
    title: "Cempurit",
    subtitle: "Tangkai penggerak",
    summary:
      "Cempurit adalah tangkai tipis yang dipasang pada lengan wayang dan digerakkan oleh dalang. Bentuk dan jumlahnya mengikuti jenis wayangnya.",
    context:
      "Cempurit umumnya dibuat dari tanduk kerbau atau bambu yang diraut halus. Dalang memegang tangkai utamanya, sedangkan cempurit menggerakkan lengan wayang sehingga bayangan tampak hidup. Ketelitian pemasangan cempurit memperlihatkan bahwa pertunjukan wayang melibatkan kerja perajin sekaligus keterampilan dalang.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Pengetahuan umum yang terdokumentasi luas dalam bahasan tata rupa wayang kulit. Bahan dan istilahnya dapat berbeda antar perajin dan daerah.",
    verifyHint:
      "Tanyakan kepada perajin wayang atau dalang tentang bahan dan cara memasang cempurit pada lengan wayang.",
    motif: "spiral",
    related: ["vocab_dalang", "craft_tatah_sungging", "perf_wayang_kulit"],
    tags: ["wayang", "peralatan", "kerajinan"],
  },

  /* ---------- Cerita Rakyat ---------- */
  {
    id: "folk_timun_mas",
    category: "folklore",
    title: "Timun Mas",
    subtitle: "Anak dari dalam timun",
    summary:
      "Timun Mas berkisah tentang anak perempuan yang ditemukan di dalam timun besar dan menyelamatkan diri dari raksasa dengan bantuan beberapa benda. Versinya sangat banyak dan berbeda-beda.",
    context:
      "Menurut kisah yang paling banyak dituturkan di Jawa, sepasang suami istri yang lama belum dikaruniai anak menemukan bayi perempuan di dalam sebuah timun besar, lalu menamainya Timun Mas. Ketika ia tumbuh, raksasa yang menuntutnya datang, dan Timun Mas melarikan diri dengan menabur biji timun, jarum, garam, serta terasi yang berubah menjadi ladang timun, hutan bambu, laut, dan lumpur. Cerita ini diwariskan secara lisan sehingga jumlah benda dan urutan kejadiannya berbeda antar penutur dan daerah.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Merupakan cerita lisan yang memiliki banyak versi. Jumlah benda ajaib, urutan kejadian, dan akhir kisah dapat berbeda antar penutur dan antar daerah.",
    verifyHint:
      "Bandingkan setidaknya dua buku kumpulan cerita rakyat dari daerah berbeda, atau minta seorang sesepuh menuturkan versi yang ia kenal.",
    motif: "leaf",
    related: ["folk_punakawan", "note_nama_tradisi_berbeda", "mem_buku_kakek"],
    tags: ["cerita", "dongeng", "jawa"],
  },
  {
    id: "folk_punakawan",
    category: "folklore",
    title: "Punakawan",
    subtitle: "Para pembantu yang jenaka",
    summary:
      "Punakawan adalah para pembantu jenaka dalam wayang, seperti Semar, Gareng, Petruk, dan Bagong. Mereka menghibur sekaligus menyampaikan nasihat dan sindiran halus.",
    context:
      "Dalam pertunjukan, punakawan menjadi teman para kesatria dan tokoh yang paling dekat dengan penonton. Humor mereka sering menjadi jembatan untuk membicarakan soal kehidupan sehari-hari dan nasihat bijak. Walaupun sering disebut sebagai empat tokoh, susunan dan nama punakawan berbeda-beda menurut tradisi dan daerah.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Pengetahuan umum yang terdokumentasi luas dalam bahasan wayang. Jumlah serta nama para punakawan dapat berbeda antar tradisi dan daerah.",
    verifyHint:
      "Perhatikan adegan punakawan dalam sebuah pertunjukan wayang, lalu tanyakan kepada dalang mengapa mereka dianggap penting.",
    motif: "kawung",
    related: ["perf_wayang_kulit", "folk_epik_adaptasi", "vocab_dalang"],
    tags: ["wayang", "tokoh", "humor"],
  },
  {
    id: "folk_epik_adaptasi",
    category: "folklore",
    title: "Kisah epik yang diadaptasi",
    subtitle: "Dari Asia Selatan ke Nusantara",
    summary:
      "Banyak cerita wayang berasal dari epos Ramayana dan Mahabharata yang tumbuh di Asia Selatan, lalu diadopsi dan diadaptasi di Nusantara selama berabad-abad.",
    context:
      "Epos Ramayana dan Mahabharata berasal dari Asia Selatan dan tiba di Nusantara melalui perjalanan budaya yang panjang. Di tempat baru, kisah itu diterjemahkan, diringkas, dan disesuaikan dengan bahasa serta kebiasaan setempat. Tokoh dan adegan khas Nusantara pun ditambahkan, misalnya kehadiran punakawan dalam wayang Jawa. Karena itu, versi di Nusantara tidak sama persis dengan versi asalnya.",
    region: "Berbagai daerah",
    reliability: "documented",
    sourceNote:
      "Sejarah panjang ini terdokumentasi luas dalam kajian sastra dan seni pertunjukan. Rincian proses adaptasi berbeda antar daerah dan antar tradisi.",
    verifyHint:
      "Baca pengantar kumpulan cerita wayang di perpustakaan, lalu bandingkan bagaimana satu tokoh digambarkan dalam dua versi daerah.",
    motif: "wave",
    related: ["folk_punakawan", "perf_wayang_kulit", "vocab_dalang"],
    tags: ["wayang", "sastra", "adaptasi"],
  },

  /* ---------- Permainan Tradisional ---------- */
  {
    id: "game_engklek",
    category: "games",
    title: "Engklek",
    subtitle: "Melompat di petak tanah",
    summary:
      "Engklek dimainkan dengan menggambar petak di tanah, lalu melompat dari petak ke petak dengan satu kaki. Namanya berbeda-beda di berbagai daerah.",
    context:
      "Pemain menggambar petak dengan batu atau kayu, melempar penanda ke salah satu petak, lalu melompatinya. Di sebagian daerah permainan ini dikenal dengan nama lain, misalnya sunda manda. Jumlah petak, cara melempar, dan aturan melompat berbeda antara satu tempat dan tempat lain.",
    region: "Berbagai daerah",
    reliability: "documented",
    sourceNote:
      "Permainan ini terdokumentasi luas dengan nama dan aturan yang berbeda antar daerah, sehingga tidak ada satu versi yang paling benar.",
    verifyHint:
      "Ajak anak-anak atau warga kampung bermain, lalu catat nama dan aturan versi setempat sebagai bahan perbandingan.",
    motif: "thread",
    related: ["game_congklak", "game_gobak_sodor", "mem_petak_di_tanah"],
    tags: ["permainan", "melompat", "anak"],
  },
  {
    id: "game_congklak",
    category: "games",
    title: "Congklak",
    subtitle: "Biji yang berputar",
    summary:
      "Congklak adalah permainan papan kayu berlubang yang diisi biji atau batu kecil. Pemain bergiliran menyebarkan biji untuk mengumpulkan sebanyak mungkin.",
    context:
      "Papan congklak memiliki deretan lubang kecil dan dua lubang besar di kedua ujungnya. Setiap pemain memindahkan biji dari satu lubang ke lubang berikutnya secara berputar, dan jumlah biji di lubang besar menentukan kemenangan. Di beberapa daerah permainan ini disebut dakon, dengan aturan tambahan yang bisa berbeda.",
    region: "Berbagai daerah",
    reliability: "documented",
    sourceNote:
      "Permainan papan ini terdokumentasi luas di banyak daerah dengan nama dan aturan yang beragam. Sebagian versi memiliki aturan tambahan seperti menembak lubang lawan.",
    verifyHint:
      "Tanyakan papan congklak kepada warga atau kunjungi museum budaya untuk melihat contohnya, lalu mainkan satu ronde.",
    motif: "kawung",
    related: ["game_engklek", "game_gobak_sodor", "note_nama_tradisi_berbeda"],
    tags: ["permainan", "papan", "biji"],
  },
  {
    id: "game_gobak_sodor",
    category: "games",
    title: "Gobak Sodor",
    subtitle: "Menembus garis penjaga",
    summary:
      "Gobak sodor adalah permainan beregu di lapangan bergaris. Satu regu berusaha melewati garis penjaga, regu lain berusaha menghalangi.",
    context:
      "Lapangan dibagi dengan garis-garis menjadi beberapa kotak. Penjaga bergerak di sepanjang garis untuk menangkap anggota regu yang berusaha menembus hingga melewati garis terakhir. Permainan ini melatih kecepatan, kerja sama, dan kejelian membaca gerak lawan. Bentuk lapangan dan namanya bisa berbeda antar daerah.",
    region: "Berbagai daerah",
    reliability: "documented",
    sourceNote:
      "Terdokumentasi luas sebagai permainan tradisional beregu. Jumlah garis, aturan tangkap, dan namanya berbeda antar daerah.",
    verifyHint:
      "Coba mainkan bersama teman di halaman dengan aturan versi setempat, lalu tuliskan bedanya dari aturan yang kamu kenal.",
    motif: "star",
    related: ["game_engklek", "game_congklak", "note_gotong_royong"],
    tags: ["permainan", "beregu", "lapangan"],
  },
  {
    id: "game_egrang",
    category: "games",
    title: "Egrang",
    subtitle: "Berjalan di atas tongkat",
    summary:
      "Egrang adalah permainan berjalan dengan dua tongkat bambu yang dipijak. Keseimbangan menjadi tantangan utamanya.",
    context:
      "Pemain berdiri di atas pijakan egrang setinggi lutut hingga sepanjang badan, lalu melangkah tanpa jatuh. Di berbagai daerah egrang dibuat dari bambu atau kayu dan juga dipertandingkan dalam lomba atau arak-arakan. Bentuk dan nama permainan ini berbeda-beda antar daerah.",
    region: "Berbagai daerah",
    reliability: "documented",
    sourceNote:
      "Terdokumentasi luas sebagai permainan dan keterampilan tradisional. Bahan, ukuran, dan namanya berbeda antar daerah.",
    verifyHint:
      "Tanyakan kepada perajin bambu atau warga yang pernah ikut lomba egrang, dan bila aman, coba melangkah beberapa kali dengan pendampingan.",
    motif: "leaf",
    related: ["game_engklek", "craft_gedebog", "note_belajar_dari_pelaku"],
    tags: ["permainan", "bambu", "keseimbangan"],
  },

  /* ---------- Kerajinan ---------- */
  {
    id: "craft_tatah_sungging",
    category: "crafts",
    title: "Tatah sungging",
    subtitle: "Mengukir dan mewarnai wayang",
    summary:
      "Tatah sungging adalah keterampilan mengukir dan mewarnai wayang kulit. Hasilnya menentukan halus atau kasarnya bayangan yang tampil di kelir.",
    context:
      "Prosesnya secara umum dimulai dari menyiapkan kulit kering, menggambar pola, menatah atau melubangi bagian halus, menyungging atau mewarnai, lalu memasang tangkai penggerak seperti cempurit. Setiap perajin memiliki urutan dan cara yang bisa berbeda, termasuk pilihan bahan warna. Karena itu, uraian ini hanyalah gambaran umum dan bukan satu-satunya cara yang benar.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Terdokumentasi luas sebagai kerajinan wayang kulit, tetapi tahapan dan tekniknya berbeda antara perajin. Uraian di sini hanya gambaran umum.",
    verifyHint:
      "Kunjungi perajin wayang atau museum wayang, lalu minta penjelasan tahap demi tahap sambil mengamati alat yang dipakai.",
    motif: "spiral",
    related: ["vocab_cempurit", "perf_wayang_kulit", "craft_gedebog"],
    tags: ["kerajinan", "wayang", "ukir"],
  },
  {
    id: "craft_gedebog",
    category: "crafts",
    title: "Gedebog",
    subtitle: "Tempat menancapkan wayang",
    summary:
      "Gedebog adalah batang pisang atau kayu lunak yang menjadi tempat menancapkan wayang saat pertunjukan. Sederhana, tetapi penting bagi kelancaran panggung.",
    context:
      "Di bawah kelir diletakkan gedebog yang menjadi tempat tancapan tangkai wayang. Dengan begitu dalang dapat mencabut dan memindahkan wayang dengan cepat mengikuti adegan. Batang pisang dipilih karena lunak, mudah diganti, dan cukup kuat menahan wayang.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Terdokumentasi luas sebagai bagian panggung wayang. Bahan penggantinya bisa berbeda antar dalang dan antar daerah.",
    verifyHint:
      "Lihat langsung bagian panggung di balik kelir saat pertunjukan, atau tanyakan kepada dalang bagaimana ia menyiapkan gedebog.",
    motif: "leaf",
    related: ["vocab_kelir", "perf_wayang_kulit", "craft_kothak"],
    tags: ["panggung", "wayang", "peralatan"],
  },
  {
    id: "craft_kothak",
    category: "crafts",
    title: "Kothak",
    subtitle: "Peti penyimpan wayang",
    summary:
      "Kothak adalah peti kayu untuk menyimpan dan membawa wayang. Banyak dalang memperlakukannya dengan penuh perhatian.",
    context:
      "Wayang yang selesai dipakai ditata kembali ke dalam kothak agar tidak melengkung atau rusak. Kothak biasanya dijaga tetap kering dan kadang dihias ukiran sederhana. Sebagian dalang memperlakukan kothak sebagai bagian penting dari perangkat pertunjukan yang harus dirawat.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Terdokumentasi luas sebagai tempat penyimpanan wayang. Ukuran, bentuk, dan cara menatanya berbeda antara dalang dan daerah.",
    verifyHint:
      "Tanyakan kepada dalang atau kolektor wayang tentang cara menata wayang di dalam kothak agar tetap terjaga.",
    motif: "kawung",
    related: ["perf_wayang_kulit", "craft_tatah_sungging", "craft_gedebog"],
    tags: ["penyimpanan", "wayang", "kayu"],
  },

  /* ---------- Seni Pertunjukan ---------- */
  {
    id: "perf_wayang_kulit",
    category: "performing",
    title: "Wayang kulit",
    subtitle: "Bayangan yang bercerita",
    summary:
      "Wayang kulit adalah pertunjukan bayangan yang dimainkan sepanjang malam dengan iringan gamelan. UNESCO mencatatnya sebagai warisan budaya takbenda.",
    context:
      "Dalam pertunjukan wayang kulit, bayangan boneka kulit ditampilkan di kelir dan dihidupkan oleh dalang bersama para pengrawit. Cerita, musik, humor, dan nasihat berpadu dalam satu pertunjukan panjang yang sering berlangsung hingga menjelang pagi. Pada 2003 UNESCO menetapkannya melalui program Karya Agung Warisan Lisan dan Takbenda Kemanusiaan, lalu memasukkannya ke Daftar Representatif. Gaya pertunjukannya berbeda antar daerah.",
    region: "Jawa dan daerah lain",
    reliability: "documented",
    sourceNote:
      "Diakui UNESCO sebagai warisan budaya takbenda (ditetapkan 2003) dan terdokumentasi luas. Bentuk serta gaya pertunjukan berbeda antar daerah.",
    verifyHint:
      "Tonton pertunjukan wayang kulit bila ada kesempatan, lalu baca penjelasan resmi tentang warisan budaya takbenda dari laman lembaga kebudayaan.",
    motif: "lamp",
    related: ["perf_gamelan", "vocab_dalang", "folk_punakawan"],
    tags: ["wayang", "pertunjukan", "unesco"],
  },
  {
    id: "perf_gamelan",
    category: "performing",
    title: "Gamelan",
    subtitle: "Bunyi yang dimainkan bersama",
    summary:
      "Gamelan adalah ansambel musik yang didominasi alat pukul seperti gong, saron, dan kendang. Musiknya mengiringi wayang dan banyak tradisi lain.",
    context:
      "Gamelan dimainkan bersama-sama dengan pembagian peran yang jelas, dari penabuh gong hingga pengendali irama seperti kendang. Bunyinya menjadi pengiring utama pertunjukan wayang dan berbagai upacara. Pada 2021 UNESCO mencatat gamelan dari Indonesia sebagai warisan budaya takbenda. Susunan perangkat dan gaya permainannya berbeda antar daerah, misalnya antara Jawa dan Bali.",
    region: "Jawa dan Bali",
    reliability: "documented",
    sourceNote:
      "Diakui UNESCO sebagai warisan budaya takbenda (ditetapkan 2021) dan terdokumentasi luas. Susunan perangkat serta gaya permainannya berbeda antar daerah.",
    verifyHint:
      "Dengarkan pertunjukan gamelan, atau kunjungi sanggar budaya dan tanyakan nama serta peran setiap alat.",
    motif: "gong",
    related: ["perf_wayang_kulit", "vocab_sinden", "perf_kepyak"],
    tags: ["musik", "gamelan", "unesco"],
  },
  {
    id: "perf_kepyak",
    category: "performing",
    title: "Kepyak",
    subtitle: "Penanda irama dari kaki dalang",
    summary:
      "Kepyak adalah lempengan kayu atau perunggu yang ditepuk dengan kaki dalang untuk menjaga irama. Namanya berbeda-beda di tiap daerah.",
    context:
      "Kepyak diletakkan dekat kaki dalang dan ditepuk sesuai kebutuhan adegan, misalnya ketika suasana menjadi menegangkan. Bunyinya membantu dalang, sinden, dan para pengrawit tetap sejalan. Di beberapa tempat alat serupa disebut dengan nama lain, sehingga sebutannya perlu diperiksa setempat.",
    region: "Jawa (umum)",
    reliability: "documented",
    sourceNote:
      "Terdokumentasi luas sebagai alat penanda irama dalam pertunjukan wayang. Sebutan dan bahannya berbeda antar daerah dan tradisi.",
    verifyHint:
      "Saat menonton wayang, perhatikan gerak kaki dalang, lalu tanyakan nama alat itu di daerahnya.",
    motif: "wave",
    related: ["vocab_dalang", "perf_gamelan", "perf_wayang_kulit"],
    tags: ["wayang", "irama", "alat"],
  },

  /* ---------- Catatan Budaya ---------- */
  {
    id: "note_gotong_royong",
    category: "notes",
    title: "Gotong royong",
    subtitle: "Kerja bersama",
    summary:
      "Gotong royong adalah semangat bekerja bersama untuk kepentingan bersama. Bentuknya berbeda-beda di setiap masyarakat.",
    context:
      "Di banyak kampung, gotong royong terlihat saat membersihkan lingkungan, memperbaiki rumah, atau menyiapkan acara. Nilai ini sering dibahas sebagai bagian penting dari kehidupan bermasyarakat di Indonesia. Wujudnya bisa berbeda antara satu daerah dan daerah lain, dari kerja bakti hingga saling membantu saat panen.",
    region: "Berbagai daerah",
    reliability: "documented",
    sourceNote:
      "Nilai sosial ini terdokumentasi luas dalam pembahasan budaya Indonesia. Cara pelaksanaannya berbeda antar masyarakat dan tidak selalu sama seperti gambaran umum di buku.",
    verifyHint:
      "Ikut serta dalam satu kegiatan bersama di lingkunganmu, lalu catat siapa yang terlibat dan bagaimana keputusan dibuat.",
    motif: "thread",
    related: ["vocab_guyub", "note_belajar_dari_pelaku", "game_gobak_sodor"],
    tags: ["kebersamaan", "masyarakat", "kerja"],
  },
  {
    id: "note_nama_tradisi_berbeda",
    category: "notes",
    title: "Nama tradisi bisa berbeda",
    subtitle: "Satu hal, banyak sebutan",
    summary:
      "Satu tradisi yang sama bisa punya nama berbeda di tiap daerah, dan satu kata bisa berarti lain di tempat lain. Karena itu, bertanya kepada warga setempat adalah langkah penting.",
    context:
      "Sebutan untuk permainan, alat, atau seni pertunjukan sering berubah ketika berpindah daerah. Kata yang mirip pun belum tentu menunjuk hal yang sama. Catatan ini mengingatkan bahwa daftar nama bukan tujuan akhir, melainkan awal percakapan dengan orang yang menjalani tradisi itu.",
    region: "Berbagai daerah",
    reliability: "documented",
    sourceNote:
      "Pola ini terdokumentasi luas dalam catatan bahasa dan budaya. Contoh perbedaan antar daerah sangat banyak dan dapat berubah dari waktu ke waktu.",
    verifyHint:
      "Tuliskan nama versi daerahmu, lalu bandingkan dengan versi daerah lain melalui buku atau percakapan dengan warga.",
    motif: "spiral",
    related: ["vocab_ringgit", "game_engklek", "note_belajar_dari_pelaku"],
    tags: ["bahasa", "tradisi", "catatan"],
  },
  {
    id: "note_fiksi_vs_fakta",
    category: "notes",
    title: "Cerita fiktif, catatan nyata",
    subtitle: "Cara prototype memberi label",
    summary:
      "Prototipe ini memisahkan tiga hal: desa serta tokoh fiktif, informasi yang terdokumentasi, dan hal yang masih perlu diverifikasi. Setiap entri koleksi diberi label yang jelas.",
    context:
      "Desa Candrageni dan tokoh seperti Tara adalah bagian dari cerita fiktif, sehingga ditandai Fiksi. Penjelasan budaya yang tercatat umumnya ditandai Terdokumentasi, sedangkan yang masih perlu dipastikan ditandai Perlu diverifikasi. Label ini dibuat agar pemain belajar melihat bedanya cerita rekaan dan catatan budaya.",
    reliability: "documented",
    sourceNote:
      "Penjelasan ini menerangkan cara kerja prototype. Label dan aturannya adalah pilihan desain yang dapat disesuaikan kembali.",
    verifyHint:
      "Buka satu entri koleksi mana pun, baca labelnya, lalu putuskan apakah isinya sudah benar-benar terverifikasi bagimu.",
    motif: "star",
    related: ["note_belajar_dari_pelaku", "note_nama_tradisi_berbeda", "mem_buku_kakek"],
    tags: ["catatan", "label", "literasi"],
  },
  {
    id: "note_belajar_dari_pelaku",
    category: "notes",
    title: "Belajar dari pelaku budaya",
    subtitle: "Sumber yang disebut namanya",
    summary:
      "Konteks paling hidup sering datang dari orang yang menjalani tradisi: pemain, perajin, sesepuh, dan warga kampung. Sebutkan sumbernya agar tidak sekadar mengulang kabar.",
    context:
      "Buku dan arsip memberi gambaran umum, tetapi pengalaman pelaku budaya menjelaskan hal-hal yang jarang tertulis. Ketika memakai keterangan dari seseorang, sebutkan namanya atau perannya dengan izinnya. Dengan begitu catatan kita dapat diperiksa ulang dan tidak menyebar sebagai kabar tanpa asal.",
    region: "Berbagai daerah",
    reliability: "documented",
    sourceNote:
      "Praktik menyebut sumber ini dianjurkan dalam banyak panduan penelitian sosial dan penulisan warga. Cara penerapannya berbeda sesuai kesepakatan dengan narasumber.",
    verifyHint:
      "Wawancarai satu pelaku budaya di sekitarmu, catat nama atau perannya, dan mintalah izin sebelum menuliskannya.",
    motif: "lamp",
    related: ["note_gotong_royong", "note_nama_tradisi_berbeda", "note_fiksi_vs_fakta"],
    tags: ["sumber", "wawancara", "belajar"],
  },

  /* ---------- Kenangan & Refleksi ---------- */
  {
    id: "mem_buku_kakek",
    category: "memories",
    title: "Buku Catatan Kakek Wira",
    subtitle: "Halaman yang mulai pudar",
    summary:
      "Tara membawa buku catatan tua milik Kakek Wira. Sebagian besar halamannya sudah pudar dan sulit dibaca.",
    context:
      "Kakek Wira bekerja sebagai juru cerita yang berpindah dari satu tempat ke tempat lain. Dalam buku itu ia menuliskan kebiasaan yang ia temui dan ingin ia pahami lebih dalam. Karena banyak halaman telah pudar, Tara berusaha melengkapi catatan itu dengan bertanya dan mengamati sendiri.",
    region: "Fiksi — Desa Candrageni",
    reliability: "fiction",
    sourceNote:
      "Bagian dari cerita fiktif prototype ini. Desa, tokoh, dan buku tersebut tidak nyata.",
    verifyHint:
      "Buat buku catatanmu sendiri untuk menulis hal-hal yang ingin kamu pahami lebih dalam.",
    motif: "thread",
    related: ["mem_refleksi_bab1", "note_belajar_dari_pelaku", "mem_gong_pertama"],
    tags: ["fiksi", "catatan", "tara"],
  },
  {
    id: "mem_gong_pertama",
    category: "memories",
    title: "Gong pertama yang Tara dengar",
    subtitle: "Malam ketika desa menjadi hening",
    summary:
      "Gong pertama berbunyi pada malam pertunjukan, dan desa terasa hening sejenak. Tara mengingat bunyi itu sebagai awal dari segalanya.",
    context:
      "Malam itu warga berkumpul di pendapa menunggu pertunjukan dimulai. Ketika gong ditabuh, percakapan berhenti dan semua orang menoleh ke arah kelir. Tara merasa bahwa bunyi sederhana itu mampu menyatukan perhatian seisi kampung.",
    region: "Fiksi — Desa Candrageni",
    reliability: "fiction",
    sourceNote:
      "Bagian dari cerita fiktif prototype ini. Peristiwa dan tokohnya tidak nyata, meskipun bunyi gong dalam pertunjukan adalah hal yang lazim dijumpai.",
    verifyHint:
      "Dengarkan gong dalam pertunjukan gamelan atau upacara, lalu tuliskan kesanmu sendiri dengannya.",
    motif: "gong",
    related: ["perf_gamelan", "mem_buku_kakek", "perf_wayang_kulit"],
    tags: ["fiksi", "kenangan", "gong"],
  },
  {
    id: "mem_petak_di_tanah",
    category: "memories",
    title: "Petak di tanah",
    subtitle: "Pagi ketika Tara mencoba melompat",
    summary:
      "Suatu pagi Tara melihat anak-anak menggambar petak di tanah dan mencoba melompat dengan satu kaki. Ia belum pandai melakukannya.",
    context:
      "Anak-anak kampung menggambar kotak-kotak di tanah dengan batu, lalu bergiliran melompat. Tara diminta ikut, tetapi keseimbangannya belum terbentuk sehingga kakinya sering menyentuh tanah. Warga tertawa ramah, dan Tara menyadari bahwa permainan sederhana pun memerlukan latihan.",
    region: "Fiksi — Desa Candrageni",
    reliability: "fiction",
    sourceNote:
      "Bagian dari cerita fiktif prototype ini. Kejadiannya tidak nyata, tetapi permainan melompati petak adalah hal yang lazim dijumpai.",
    verifyHint:
      "Gambar sendiri beberapa petak di halaman dan berlatih, lalu tuliskan aturan versi daerahmu.",
    motif: "wave",
    related: ["game_engklek", "mem_refleksi_bab1", "mem_gong_pertama"],
    tags: ["fiksi", "permainan", "kenangan"],
  },
  {
    id: "mem_refleksi_bab1",
    category: "memories",
    title: "Refleksi pertama Tara",
    subtitle: "Catatan setelah bab pertama",
    summary:
      "Setelah bab pertama selesai, Tara menulis bahwa pemahaman tumbuh dari bertanya, mengamati, dan ikut membantu. Menebak-nebak saja tidak cukup.",
    context:
      "Catatan ini muncul setelah Tara menyelesaikan bab pertama. Ia mengakui bahwa banyak hal yang semula ia kira sudah diketahui ternyata perlu diperiksa lagi. Bertanya kepada warga, mengamati pertunjukan, dan membantu pekerjaan kecil membuat pemahamannya bertambah sedikit demi sedikit.",
    region: "Fiksi — Desa Candrageni",
    reliability: "fiction",
    sourceNote:
      "Bagian dari catatan fiktif Tara dalam prototype ini. Isinya adalah pesan pembelajaran, bukan pernyataan ilmiah.",
    verifyHint:
      "Tuliskan satu hal yang kamu yakini, lalu catat bagaimana cara memeriksanya kepada orang yang lebih tahu.",
    motif: "lamp",
    related: ["mem_buku_kakek", "note_belajar_dari_pelaku", "note_fiksi_vs_fakta"],
    tags: ["fiksi", "refleksi", "belajar"],
  },
];
