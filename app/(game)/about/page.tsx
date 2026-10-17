import { Motif } from "@/components/brand/Motif";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Bits";

const HONEST_STATUS: { label: string; body: string }[] = [
  {
    label: "1 bab dapat dimainkan",
    body: "Bab 1 (7 episode) lengkap dari pembuka sampai penutup. Bab 2–4 masih berupa rencana garis besar di peta perjalanan dan belum bisa dimainkan.",
  },
  {
    label: "Tanpa backend & tanpa akun",
    body: "Prototipe ini tidak punya server data maupun sistem akun. Tidak ada pendaftaran, email, atau profil daring.",
  },
  {
    label: "Progres hanya di perangkatmu",
    body: "Semua progres tersimpan di localStorage peramban. Tidak ada data yang dikirim ke mana pun; salinan berkas (JSON) tersedia lewat Pengaturan.",
  },
  {
    label: "Bunyi disintesis aplikasi",
    body: "Semua efek suara dan instrumen adalah simulasi Web Audio API — bukan rekaman gamelan asli dan tidak diklaim mewakili versi mana pun.",
  },
  {
    label: "Tidak ada sitasi yang dikarang",
    body: "Catatan budaya diberi label keandalan dan catatan sumber apa adanya. Bila sesuatu belum diperiksa silang, labelnya mengatakan “perlu diverifikasi”.",
  },
];

const CONTENT_POLICY: { title: string; motif: "lamp" | "book" | "eye" | "thread"; body: string }[] = [
  {
    title: "Tokoh & desa fiksi",
    motif: "lamp",
    body: "Tara, Ndari, Pak Wagiman, Bu Rukmini, Kakek Wira, dan Desa Candrageni adalah tokoh dan tempat fiktif yang dibuat untuk prototipe ini. Mereka bukan penggambaran orang atau komunitas tertentu yang nyata.",
  },
  {
    title: "Label untuk setiap catatan",
    motif: "book",
    body: "Koleksi membedakan tiga hal: “terdokumentasi umum” untuk pengetahuan yang tercatat di banyak sumber, “perlu diverifikasi” untuk hal yang belum diperiksa silang, dan “fiksi cerita” untuk bagian rekaan. Ada juga label “bantuan perangkat” untuk materi yang dibantu suara perangkat, bukan penutur asli.",
  },
  {
    title: "Koreksi & sumber tepercaya",
    motif: "eye",
    body: "Prototipe ini tidak mengklaim sudah mewakili semua daerah atau komunitas. Bila kamu menemukan kekeliruan, cara terbaik adalah mencatatnya dan memeriksanya ke sumber tepercaya: penutur yang menjalankan tradisinya, komunitas budaya, atau pustaka yang kredibel. Catatan seperti itu justru bagian dari tujuan belajar.",
  },
  {
    title: "Laporan praktik itu apa adanya",
    motif: "thread",
    body: "Misi praktik dijalankan di dunia nyata dan hanya dilaporkan sendiri oleh pemain; aplikasi tidak memverifikasinya. Itulah sebabnya XP praktik terpisah dari XP pengetahuan dan setiap misi menyediakan cara alternatif yang setara.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-7">
      {/* ---------- Kepala ---------- */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Tentang</div>
          <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">Tentang TARA</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
            TARA: Nusantara Story Quest adalah prototype belajar budaya berbentuk permainan cerita. Kamu menemani Tara,
            burung garuda kecil, mengenal tradisi Nusantara dengan cara yang jujur — bertanya kepada yang menjalankan,
            mengamati hal kecil, dan mengakui apa yang belum dipahami. Prototipe ini dibuat untuk menguji alur cerita
            dan mekanik belajar, bukan sebagai rujukan budaya.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="gold" motif="spiral">
            Versi 0.1.0 · prototipe
          </Chip>
          <Chip motif="lamp">Bab 1 dapat dimainkan</Chip>
        </div>
      </header>

      {/* ---------- Status jujur ---------- */}
      <section aria-label="Status jujur" className="space-y-3">
        <h2 className="font-display flex items-center gap-2 text-xl text-[var(--ink)]">
          <Motif motif="eye" className="h-5 w-5 text-[var(--gold)]" />
          Status jujur
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
          Apa yang sudah ada, apa yang belum, dan apa yang sengaja tidak dibuat — supaya kamu tidak menduga-duga.
        </p>
        <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {HONEST_STATUS.map((item) => (
            <li key={item.label} className="panel-soft flex items-start gap-3 p-4 sm:p-5">
              <Motif motif="star" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-[var(--ink)]">{item.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Kebijakan konten ---------- */}
      <section aria-label="Kebijakan konten" className="space-y-3">
        <h2 className="font-display flex items-center gap-2 text-xl text-[var(--ink)]">
          <Motif motif="book" className="h-5 w-5 text-[var(--gold)]" />
          Kebijakan konten
        </h2>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {CONTENT_POLICY.map((policy) => (
            <article key={policy.title} className="panel p-4 sm:p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--gold)]">
                  <Motif motif={policy.motif} className="h-4 w-4" />
                </span>
                <h3 className="font-display text-base text-[var(--ink)]">{policy.title}</h3>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-muted)]">{policy.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Catatan teknis ---------- */}
      <section aria-label="Cara prototipe dibangun" className="panel-soft p-4 sm:p-5">
        <h2 className="font-display flex items-center gap-2 text-lg text-[var(--ink)]">
          <Motif motif="kawung" className="h-4 w-4 text-[var(--gold)]" />
          Cara prototipe ini dibangun
        </h2>
        <div className="mt-2 max-w-3xl space-y-2 text-sm leading-relaxed text-[var(--ink-muted)]">
          <p>
            Seluruh cerita disimpan sebagai data terstruktur (bab → episode → node), terpisah dari tampilannya.
            Menambah cerita berarti menambah data, bukan menulis ulang antarmuka — pendekatan ini dipilih supaya
            konten budaya mudah ditinjau, dikoreksi, dan dipindahkan ke sistem lain di masa depan.
          </p>
          <p>
            Antarmuka dibuat dengan Next.js App Router dan TypeScript; status permainan dikelola di klien dan
            dipersistensikan ke localStorage. Tidak ada panggilan jaringan untuk data pemain.
          </p>
        </div>
      </section>

      {/* ---------- Kredit & catatan ornamen ---------- */}
      <section aria-label="Kredit dan catatan ornamen" className="panel p-4 sm:p-5">
        <h2 className="font-display flex items-center gap-2 text-lg text-[var(--ink)]">
          <Motif motif="leaf" className="h-4 w-4 text-[var(--gold)]" />
          Kredit &amp; catatan ornamen
        </h2>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[var(--ink-muted)]">
          <li className="flex items-start gap-2.5">
            <Motif motif="kawung" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
            <span>
              Motif ornamen pada prototipe ini adalah <strong className="text-[var(--ink)]">interpretasi geometris
              sederhana, bukan reproduksi akurat motif tertentu</strong> dari daerah mana pun.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Motif motif="star" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
            <span>
              Ilustrasi tokoh dan latar digambar tangan sebagai SVG sederhana langsung di dalam kode; sengaja bergaya
              datar agar jelas bahwa tokohnya fiktif.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Motif motif="gong" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
            <span>
              Bunyi dan instrumen disintesis sendiri dengan Web Audio API sebagai simulasi; tidak ada rekaman pihak
              lain yang dipakai.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Motif motif="lamp" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
            <span>
              Teks cerita, nama tokoh, dan Desa Candrageni ditulis khusus untuk prototipe ini dan merupakan fiksi.
            </span>
          </li>
        </ul>
      </section>

      {/* ---------- Tautan ---------- */}
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink href="/help" variant="secondary" motif="thread">
          Buka bantuan &amp; cara bermain
        </ButtonLink>
        <span className="text-xs text-[var(--ink-subtle)]">
          Versi 0.1.0 · dibangun sebagai prototipe belajar, bukan rujukan budaya.
        </span>
      </div>
    </div>
  );
}
