# TARA: Nusantara Story Quest

Prototipe game cerita edukasi berbahasa Indonesia. Kamu menemani **Tara**, burung garuda kecil,
belajar tentang tradisi Nusantara dengan cara yang jujur: bertanya kepada orang yang menjalankannya,
mengamati hal kecil, dan mencatat apa yang belum dipahami.

Repositori ini berisi satu bab yang benar-benar bisa dimainkan (Bab 1 — *Jejak Pertama*), pusat misi
dengan latihan dan misi praktik, koleksi, jurnal, profil, pencapaian, dan pengaturan. Semuanya
berjalan tanpa server: progres tersimpan di `localStorage` peramban.

> **Fiksional, bukan sumber rujukan budaya.** Desa Candrageni, Tara, dan tokoh-tokohnya adalah rekaan
> prototipe. Catatan budaya di dalam game diberi label keandalan (`Terdokumentasi umum`,
> `Perlu diverifikasi`, `Fiksi cerita`, `Bantuan perangkat`) dan tidak ada sitasi yang dikarang.

---

## 1. Menjalankan proyek

Kebutuhan: **Node.js 22+** dan npm. Tidak ada layanan eksternal, akun, atau basis data.

```bash
npm install
npm run dev        # buka http://localhost:3000
```

Perintah lain:

```bash
npm run build      # build produksi (mulai Next 16, folder .next)
npm run start      # menjalankan hasil build
npx tsc --noEmit   # pemeriksaan tipe ketat
npx eslint app components lib data --quiet
```

Untuk menjalankan server dev dan build secara bersamaan, arahkan salah satunya ke folder lain
supaya tidak berebut folder `.next`:

```bash
NEXT_DIST_DIR=.next-dev npx next dev --port 3100
```

Semua font dihosting sendiri (`public/fonts`), jadi prototipe tetap utuh tanpa internet.

---

## 2. Apa yang sudah nyata dan apa yang belum

Bagian ini penting supaya ekspektasi tidak melebihi isi prototipe.

| Sudah bisa dimainkan | Keterangan |
| --- | --- |
| Bab 1 *Jejak Pertama* | 7 episode penuh dengan 10 jenis node: narasi, pilihan, pilihan ganda, mencocokkan, menyusun urutan, mendengarkan, mengamati, refleksi, pemicu misi, dan penutup bab. |
| Bab 2–4 | Tampil di peta perjalanan sebagai teaser **terkunci** — belum ada isinya. |
| Pusat misi | 9 misi: 3 misi cerita, 2 misi tersembunyi (muncul setelah ditemukan di cerita), 4 misi praktik. |
| Koleksi | 36 catatan dengan label keandalan, catatan sumber, dan bagian "yang terjelaskan kemudian". |
| Jurnal | Catatan Tara (fiksi tokoh), Refleksimu (tulisanmu, hanya di perangkat ini), Keputusan (jejak pilihan di dalam aplikasi). |
| Profil, pencapaian, pengaturan | Termasuk ekspor/impor berkas JSON dan reset progres. |

Yang **tidak** ada: backend, akun, papan peringkat, verifikasi aktivitas nyata, streak/tenggat, dan
klaim bahwa pelafalan sintetis mewakili penutur asli. Semua bunyi disintesis dengan Web Audio API.

---

## 3. Arsitektur

Data terpisah dari tampilan. Isi cerita, misi, koleksi, jurnal, dan pencapaian semuanya berupa
struktur data murni sehingga mudah diuji atau dipindahkan ke backend nanti.

```
app/                     Route Next.js App Router
  page.tsx               Halaman pembuka + onboarding (nama & lambang)
  (game)/                Semua halaman setelah onboarding (AppShell)
    home/                Beranda: sapaan, rekomendasi, kartu progres
    journey/             Peta perjalanan + detail bab
    play/[chapterId]/      Mesin story mode
      [episodeId]/
    quests/              Pusat misi + detail misi
    collection/ journal/ profile/ settings/ help/ about/
components/
  story/                 StoryPlayer (mesin node), Stage, Panels, ReflectionForm, dst.
  games/                 QuizCard, MatchingGame, OrderingGame, ChecklistCard, ListeningPlayer
  layout/ ui/ brand/     AppShell, komponen dasar, ornamen dan ilustrasi SVG
data/                    Konten murni (tanpa React)
  story/chapter-1.ts     7 episode Bab 1: node, syarat, efek, pilihan
  chapters.ts quests.ts collection.ts journal.ts achievements.ts characters.ts index.ts
lib/
  types.ts               Semua tipe data (sayap kanan kebenaran)
  store.ts               Zustand + persist: aksi progres, hadiah, undo-replay
  progression.ts         Level, kunci bab/episode, status misi, rekomendasi (fungsi murni)
  labels.ts utils.ts     Pemetaan label efek, evaluasi kondisi
  audio.ts hooks.ts      Sintesis suara, hook appearance/motion
tools/smoke.mjs          Pemeriksa alur berbasis Chrome DevTools Protocol
```

### Mesin cerita (`components/story/StoryPlayer.tsx`)

- Node yang syaratnya tidak terpenuhi dilewati, jadi satu episode bisa punya cabang yang berbeda
  untuk setiap pemain.
- Efek (flag, XP, koleksi, jurnal, pencapaian, misi baru) diberikan **sekali per `sourceId`** —
  mengulang episode tidak menambah XP.
- Pilihan yang tersimpan (flag) memengaruhi dialog, misi, dan refleksi di episode berikutnya.
- Kalau pemain keluar di tengah episode, titik terakhir ditawarkan saat kembali ("Lanjutkan dari
  titik terakhir" / "Mulai dari awal") — bukan langsung dilanjutkan diam-diam.

### Dua jenis XP

- **XP pengetahuan** dari latihan yang benar-benar diperiksa aplikasi (kuis, mencocokkan, urutan,
  mengamati).
- **XP praktik** dari misi praktik yang **kamu laporkan sendiri** sudah dijalankan; aplikasi tidak
  memverifikasi aktivitas di luar. Setiap misi praktik punya cara alternatif yang setara, termasuk
  versi yang bisa dilakukan sendirian.

Tidak ada streak, tenggat, atau hukuman karena berhenti.

---

## 4. Kontrol dan aksesibilitas

| Kontrol | Fungsi |
| --- | --- |
| `Spasi` / `Enter` | Memajukan dialog dan melanjutkan antaradegan |
| `1`–`9` | Memilih opsi saat pilihan atau tantangan muncul |
| `Esc` | Menutup dialog, panel detail, atau menu |
| `Tab` / `Shift+Tab` | Berpindah antarelemen; semua tujuan punya penanda fokus |

- Mengikuti `prefers-reduced-motion` dan punya pengaturan gerakan sendiri (Penuh / Dikurangi / Ikut
  sistem); atribut `data-motion` di `<html>` menandai mode aktif.
- Ukuran teks bisa diperbesar lewat Pengaturan; tata letak bekerja mulai lebar 360 px.
- Semua tombol bersifat semantik, dapat dijangkau papan tombol, dan tidak ada tombol dekoratif tanpa
  fungsi.

---

## 5. Menyimpan dan mengatur progres

- Kunci penyimpanan: `tara-nusantara-save-v1` di `localStorage`.
- Halaman **Pengaturan** menyediakan ekspor (unduh JSON), impor, dan reset (dengan atau tanpa
  menghapus profil).
- Karena tidak ada server, menghapus data peramban berarti progres ikut hilang.

---

## 6. Pemeriksa alur otomatis

`tools/smoke.mjs` mengendalikan Chrome headless lewat CDP, menjalankan langkah-langkah di dalam
halaman sungguhan, lalu melaporkan kegagalan, galat konsol, dan respons HTTP yang buruk.

```bash
node tools/smoke.mjs http://localhost:3100 onboarding
node tools/smoke.mjs http://localhost:3100 play-e1
node tools/smoke.mjs http://localhost:3100 full-chapter
node tools/smoke.mjs http://localhost:3100 resume
node tools/smoke.mjs http://localhost:3100 replay
node tools/smoke.mjs http://localhost:3100 mobile
node tools/smoke.mjs http://localhost:3100 reduced-motion
node tools/smoke.mjs http://localhost:3100 secondary-pages
node tools/smoke.mjs http://localhost:3100 divergent-paths
```

Skenario yang tersedia: `default`, `storage`, `onboarding`, `play-e1`, `full-chapter`, `resume`,
`replay`, `mobile`, `reduced-motion`, `secondary-pages`, `divergent-paths`, serta beberapa `debug-*`
untuk diagnosis.
Pemutar otomatis (`window.__auto`) menyelesaikan kuis, urutan, pencocokan, dan refleksi supaya bab
penuh bisa diuji ujung ke ujung. Setiap langkah yang gagal melaporkan cuplikan teks halaman.

`CDP_PORT=9333 SMOKE_HEADLESS=false node tools/smoke.mjs …` menjalankan Chrome dengan jendela
terlihat untuk menonton alurnya secara langsung.

---

## 7. Etika konten

Aturan yang dipakai di seluruh isi prototipe:

- Tidak ada klaim budaya yang diberi sitasi karangan. Yang belum jelas diberi label
  `Perlu diverifikasi`, dan bagian rekaan diberi label `Fiksi cerita`.
- Misi praktik selalu punya alternatif yang setara dan bisa dilakukan sendirian; laporan pemain
  dibedakan dari aktivitas yang diperiksa aplikasi.
- Pencapaian dan statistik hanya mencerminkan aktivitas di dalam aplikasi, tidak mengklaim apa pun
  tentang perilaku nyata pemain.
- Karakter yang menjalankan tradisi ditulis sebagai orang yang berpengetahuan, bukan sekadar latar.
