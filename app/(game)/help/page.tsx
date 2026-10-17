import type { ReactNode } from "react";
import { Motif } from "@/components/brand/Motif";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Bits";

/* ------------------------------------------------------------------
 * Isi halaman — semua statis, jadi tidak butuh komponen klien.
 * ------------------------------------------------------------------ */

const HOW_TO_PLAY: { title: string; body: ReactNode }[] = [
  {
    title: "Ikuti ceritanya",
    body: (
      <>
        Tara, burung garuda kecil, tiba di Desa Candrageni dan belajar tentang tradisi dengan cara yang jujur:
        bertanya, mengamati, dan mencatat hal yang belum ia pahami. Majukan dialog dengan tombol{" "}
        <strong className="text-[var(--ink)]">Lanjut</strong> atau tombol <strong className="text-[var(--ink)]">Spasi</strong>.
      </>
    ),
  },
  {
    title: "Buat pilihan",
    body: (
      <>
        Di beberapa adegan, kamu memilih sikap Tara — bertanya, mengamati, atau membantu. Pilihanmu tercatat dan
        memengaruhi dialog berikutnya; tidak ada pilihan yang “kalah”, dan kamu bisa memilih dengan tenang.
      </>
    ),
  },
  {
    title: "Jawab tantangan dan amati",
    body: (
      <>
        Ada tantangan pengetahuan, permainan menjodohkan dan menyusun, serta adegan pengamatan dengan petunjuk
        tersembunyi. Jawaban salah tidak menghukum: kamu mendapat penjelasan lalu boleh mencoba lagi.
      </>
    ),
  },
  {
    title: "Jalani misi",
    body: (
      <>
        Misi tumbuh dari hal yang Tara jumpai di dalam cerita. Sebagian dikerjakan di dalam aplikasi, sebagian berupa
        latihan di dunia nyata yang <em>kamu laporkan sendiri</em>. Setiap misi punya cara alternatif yang setara,
        termasuk versi yang bisa dilakukan sendirian.
      </>
    ),
  },
  {
    title: "Kembali ke koleksi & jurnal",
    body: (
      <>
        Semua yang Tara temukan tersimpan di Koleksi lengkap dengan catatan sumber dan label keandalan. Jurnal
        menampung catatan Tara, refleksimu, dan rekam jejak keputusanmu. Tidak ada batas waktu dan tidak ada streak —
        semua menunggu dengan tenang.
      </>
    ),
  },
];

const KEYBOARD_CONTROLS: { keys: string; action: string }[] = [
  { keys: "Spasi / Enter", action: "Majukan dialog teks dan melanjutkan antaradegan." },
  { keys: "1 – 9", action: "Pilih opsi saat pilihan atau tantangan muncul." },
  { keys: "Esc", action: "Tutup dialog, panel detail, atau menu yang sedang terbuka." },
  { keys: "Tab / Shift+Tab", action: "Berpindah antartombol dan kolom isian; semua tujuan punya penanda fokus." },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Apakah TARA butuh akun atau sambungan internet?",
    a: "Tidak. Prototipe ini berjalan sepenuhnya di perangkatmu: tidak ada akun, tidak ada server, dan tidak ada data yang dikirim ke mana pun. Progres disimpan di localStorage peramban, dan kamu bisa mengunduh salinan berkas (JSON) dari halaman Pengaturan sebagai cadangan.",
  },
  {
    q: "Apakah semua catatan di Koleksi itu fakta yang sudah diperiksa?",
    a: "Tidak semuanya — dan itu dibuat terbuka. Setiap catatan diberi label: “Terdokumentasi umum” untuk pengetahuan yang tercatat di banyak sumber, “Perlu diverifikasi” untuk yang belum diperiksa silang, “Fiksi cerita” untuk bagian rekaan prototipe, dan “Bantuan perangkat” untuk yang dibantu suara perangkat. Prototipe ini tidak mengarang sitasi: bila sesuatu belum jelas, labelnya mengatakan begitu.",
  },
  {
    q: "Apakah misi praktik diperiksa oleh aplikasi?",
    a: "Tidak. Misi praktik adalah laporanmu sendiri tentang apa yang kamu jalani di luar aplikasi; TARA tidak bisa memverifikasinya. Karena itu XP praktik selalu terpisah dari XP pengetahuan, setiap misi menyediakan cara yang setara (termasuk versi sendirian), dan kejujuranmu lebih berharga daripada laporan yang terdengar hebat.",
  },
  {
    q: "Apakah ada streak, tenggat waktu, atau hukuman kalau berhenti?",
    a: "Tidak ada. Kamu boleh berhenti kapan saja dan kembali kapan saja; cerita, misi, dan catatan menunggu tanpa batas waktu. Tidak ada notifikasi yang menagih, tidak ada api yang padam, dan jeda tidak mengurangi apa pun.",
  },
  {
    q: "Apakah bunyi gamelan dan suaranya rekaman asli?",
    a: "Bukan. Semua bunyi dan instrumen disintesis oleh aplikasi dengan Web Audio API — jelas berupa simulasi, bukan rekaman gamelan, dan tidak diklaim mewakili versi mana pun. Beberapa latihan pelafalan dapat memakai suara perangkat (text-to-speech) yang juga bukan penutur asli.",
  },
];

const ACCESSIBILITY_NOTES: string[] = [
  "Semua tombol dan tautan bisa dijangkau dengan papan tombol dan memiliki penanda fokus yang terlihat.",
  "Gerakan dapat dikurangi lewat Pengaturan (Penuh / Dikurangi / Ikut sistem) dan selalu menghormati pengaturan perangkatmu.",
  "Ukuran teks bisa diperbesar tanpa merusak tata letak, dan halaman bekerja mulai dari layar 360 piksel.",
  "Efek suara dan suara latar bisa dimatikan dengan satu saklar; volume bisa diatur dari 0%.",
  "Latihan pelafalan bersifat opsional dan memakai suara perangkat bila tersedia — tidak wajib untuk menyelesaikan apa pun.",
];

export default function HelpPage() {
  return (
    <div className="space-y-7">
      {/* ---------- Kepala ---------- */}
      <header>
        <div className="eyebrow">Bantuan</div>
        <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">Cara bermain &amp; bantuan</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
          TARA adalah prototype permainan cerita untuk belajar budaya Nusantara dengan jujur: tanpa tekanan waktu,
          tanpa akun, dan tanpa klaim yang belum jelas sumbernya. Halaman ini menjelaskan cara bermain dan batas-batas
          prototipe ini apa adanya.
        </p>
      </header>

      {/* ---------- Cara bermain ---------- */}
      <section aria-label="Cara bermain" className="space-y-3">
        <h2 className="font-display flex items-center gap-2 text-xl text-[var(--ink)]">
          <Motif motif="spiral" className="h-5 w-5 text-[var(--gold)]" />
          Cara bermain
        </h2>
        <ol className="grid gap-3.5 sm:grid-cols-2">
          {HOW_TO_PLAY.map((step, index) => (
            <li key={step.title} className="panel-soft flex items-start gap-3 p-4 sm:p-5">
              <span className="font-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-sm text-[var(--gold)]">
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base text-[var(--ink)]">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Kontrol keyboard ---------- */}
      <section aria-label="Kontrol papan tombol" className="panel p-4 sm:p-5">
        <h2 className="font-display flex items-center gap-2 text-lg text-[var(--ink)]">
          <Motif motif="thread" className="h-4 w-4 text-[var(--gold)]" />
          Kontrol papan tombol
        </h2>
        <dl className="mt-3 divide-y divide-[var(--line)]">
          {KEYBOARD_CONTROLS.map((control) => (
            <div key={control.keys} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
              <dt className="shrink-0">
                <Chip tone="gold" className="font-mono">
                  {control.keys}
                </Chip>
              </dt>
              <dd className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">{control.action}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Pertanyaan yang sering muncul ---------- */}
      <section aria-label="Pertanyaan yang sering muncul" className="space-y-3">
        <h2 className="font-display flex items-center gap-2 text-xl text-[var(--ink)]">
          <Motif motif="eye" className="h-5 w-5 text-[var(--gold)]" />
          Pertanyaan yang sering muncul
        </h2>
        <div className="space-y-2.5">
          {FAQ.map((item) => (
            <details key={item.q} className="panel group overflow-hidden">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-medium text-[var(--ink)] sm:px-5 [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <Motif
                  motif="spiral"
                  className="h-4 w-4 shrink-0 text-[var(--gold)] transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="border-t border-[var(--line)] px-4 py-3.5 text-sm leading-relaxed text-[var(--ink-muted)] sm:px-5">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Aksesibilitas ---------- */}
      <section aria-label="Catatan aksesibilitas" className="panel-soft p-4 sm:p-5">
        <h2 className="font-display flex items-center gap-2 text-lg text-[var(--ink)]">
          <Motif motif="leaf" className="h-4 w-4 text-[var(--gold)]" />
          Aksesibilitas
        </h2>
        <ul className="mt-3 space-y-2">
          {ACCESSIBILITY_NOTES.map((note) => (
            <li key={note} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--ink-muted)]">
              <Motif motif="star" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
              {note}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Tautan ---------- */}
      <div className="flex flex-wrap gap-2">
        <ButtonLink href="/about" variant="secondary" motif="leaf">
          Tentang prototipe ini
        </ButtonLink>
        <ButtonLink href="/settings" variant="secondary" motif="gong">
          Buka pengaturan
        </ButtonLink>
      </div>
    </div>
  );
}
