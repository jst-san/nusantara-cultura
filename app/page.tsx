"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Backdrop } from "@/components/brand/Backdrop";
import { Motif } from "@/components/brand/Motif";
import { Tara } from "@/components/brand/Tara";
import { PLAYER_AVATARS, PlayerAvatar } from "@/components/brand/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Bits";
import { TextField } from "@/components/ui/Controls";
import { useGameStore } from "@/lib/store";
import { useMotionEnabled, useSaveReady } from "@/lib/hooks";
import { playSfx } from "@/lib/audio";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    motif: "spiral" as const,
    title: "Cerita bercabang yang sungguh bercabang",
    body: "Pilihanmu benar-benar tercatat: siapa yang Tara kenal, apa yang ia pahami, dan misi yang terbuka mengikuti cara kamu bermain.",
  },
  {
    motif: "book" as const,
    title: "XP pengetahuan & XP praktik dipisah",
    body: "Pengetahuan dari cerita tidak pernah dicampur dengan latihan di dunia nyata — supaya jelas mana yang kamu baca dan mana yang kamu jalankan.",
  },
  {
    motif: "lamp" as const,
    title: "Jujur soal sumber & batasnya",
    body: "Setiap catatan diberi label: terdokumentasi umum, perlu diverifikasi, atau fiksi cerita. Tidak ada klaim budaya tanpa penjelasan.",
  },
];

const HONESTY_NOTES = [
  "Semua tokoh dan Desa Candrageni adalah fiksi untuk prototype ini.",
  "Misi praktik bersifat laporanmu sendiri — aplikasi tidak memverifikasi aktivitas di luar.",
  "Tidak ada streak, tidak ada batas waktu, dan berhenti bermain tidak menghukummu.",
  "Progres tersimpan di perangkat ini (localStorage). Tidak ada akun dan tidak ada data yang dikirim ke server.",
];

export default function WelcomePage() {
  const router = useRouter();
  const ready = useSaveReady();
  const motionOn = useMotionEnabled();
  const onboardingComplete = useGameStore((s) => s.onboardingComplete);
  const player = useGameStore((s) => s.player);
  const completeOnboarding = useGameStore((s) => s.completeOnboarding);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("feather");
  const [touched, setTouched] = useState(false);

  const trimmed = name.trim();
  const tooLong = trimmed.length > 24;

  const start = () => {
    setTouched(true);
    if (tooLong) return;
    playSfx("success");
    completeOnboarding(trimmed, avatar);
    router.push("/home");
  };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Latar perbukitan sebagai panggung pembuka */}
      <div className="absolute inset-0">
        <Backdrop scene="hills_dawn" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--bg)_35%,transparent),color-mix(in_oklab,var(--bg)_88%,transparent))]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,color-mix(in_oklab,var(--bg)_92%,transparent),transparent_65%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        {/* Kolom kiri: sambutan */}
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] backdrop-blur">
              <Tara expression="curious" className="h-9 w-9" />
            </span>
            <div>
              <div className="font-display text-lg tracking-[0.18em] text-[var(--gold-soft)]">TARA</div>
              <div className="text-[0.65rem] tracking-[0.16em] text-[var(--ink-subtle)] uppercase">
                Nusantara Story Quest
              </div>
            </div>
          </div>

          <motion.h1
            className="display-title mt-6 text-4xl leading-tight text-[var(--ink)] sm:text-5xl"
            initial={motionOn ? { opacity: 0, y: 16 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionOn ? 0.6 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            Cerita yang tumbuh dari rasa ingin tahu.
          </motion.h1>
          <p className="mt-4 max-w-xl story-text text-[var(--ink-muted)]">
            Temani <strong className="text-[var(--ink)]">Tara</strong>, burung garuda kecil, belajar tentang tradisi
            Nusantara dengan cara yang jujur: bertanya kepada orang yang menjalankannya, mengamati hal kecil, dan
            mencatat yang belum ia pahami — bukan pura-pura sudah tahu.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Chip tone="gold" motif="spiral">
              1 bab dapat dimainkan · 7 episode
            </Chip>
            <Chip motif="book">Cerita + tantangan + refleksi</Chip>
            <Chip motif="lamp">Tanpa akun · tanpa server</Chip>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="glass rounded-[var(--radius-md)] p-4">
                <Motif motif={feature.motif} className="h-5 w-5 text-[var(--gold)]" />
                <h2 className="font-display mt-2 text-sm leading-snug text-[var(--ink)]">{feature.title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom kanan: kartu onboarding */}
        <motion.section
          aria-label="Mulai perjalanan"
          className="panel relative overflow-hidden p-6 sm:p-7"
          initial={motionOn ? { opacity: 0, y: 22 } : { opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionOn ? 0.55 : 0, delay: motionOn ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(233,185,73,0.22),transparent_65%)]" />

          {ready && onboardingComplete ? (
            <div className="relative">
              <div className="eyebrow">Perjalananmu tersimpan</div>
              <h2 className="font-display mt-1 text-2xl text-[var(--ink)]">Selamat datang kembali, {player.name}</h2>
              <div className="mt-4 flex items-center gap-4">
                <PlayerAvatar id={player.avatar} className="h-14 w-14" />
                <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                  Catatan, koleksi, dan pilihanmu masih ada di perangkat ini. Tara sudah menunggu di desa.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/home" variant="primary" size="lg" motif="lamp">
                  Lanjutkan perjalanan
                </ButtonLink>
                <ButtonLink href="/journey" variant="secondary" size="lg" motif="spiral">
                  Buka peta perjalanan
                </ButtonLink>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[var(--ink-subtle)]">
                Ingin mengubah nama atau lambang? Buka <strong className="text-[var(--ink-muted)]">Profil</strong> kapan
                saja.
              </p>
            </div>
          ) : (
            <form
              className="relative"
              onSubmit={(event) => {
                event.preventDefault();
                start();
              }}
            >
              <div className="eyebrow">Sebelum berangkat</div>
              <h2 className="font-display mt-1 text-2xl text-[var(--ink)]">Siapa yang menemani Tara?</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                Nama ini dipakai Tara untuk menyapamu di dalam cerita. Boleh nama panggilan apa saja.
              </p>

              <div className="mt-5">
                <TextField
                  label="Nama panggilanmu"
                  placeholder="cth. Adi, Sari, atau nama bebas"
                  value={name}
                  maxLength={40}
                  onChange={(event) => setName(event.target.value)}
                  hint="Kosongkan pun juga boleh — Tara akan memanggilmu “Sahabat Tara”."
                  error={touched && tooLong ? "Maksimal 24 huruf, ya." : undefined}
                  autoComplete="off"
                />
              </div>

              <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-medium text-[var(--ink)]">Lambang penjelajah</legend>
                <div role="radiogroup" aria-label="Pilih lambang" className="flex flex-wrap gap-2">
                  {PLAYER_AVATARS.map((option) => {
                    const active = option.id === avatar;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={`Lambang ${option.label}`}
                        title={option.label}
                        onClick={() => {
                          playSfx("select");
                          setAvatar(option.id);
                        }}
                        className={cn(
                          "focus-ring flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-xs transition-all",
                          active
                            ? "border-[color-mix(in_oklab,var(--gold)_60%,transparent)] bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] text-[var(--gold-soft)]"
                            : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]",
                        )}
                      >
                        <PlayerAvatar id={option.id} className="h-8 w-8" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button type="submit" variant="primary" size="lg" motif="spiral">
                  Mulai perjalanan
                </Button>
                <span className="text-xs text-[var(--ink-subtle)]">±2 menit untuk episode pertama</span>
              </div>
            </form>
          )}
        </motion.section>
      </div>

      {/* Catatan kejujuran */}
      <section aria-label="Catatan kejujuran prototype" className="relative mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8">
        <div className="panel-soft p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Motif motif="eye" className="h-4 w-4 text-[var(--gold)]" />
            <h2 className="eyebrow">Apa yang prototype ini lakukan — dan tidak lakukan</h2>
          </div>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {HONESTY_NOTES.map((note) => (
              <li key={note} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                <Motif motif="leaf" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
                {note}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-[var(--ink-subtle)]">
            Prototipe ini dibuat untuk menguji alur cerita dan mekanik belajar. Istilah budaya yang muncul dijaga tetap
            umum dan diberi catatan sumber di Koleksi; bila kamu menemukan hal yang perlu dikoreksi, itu justru bagian
            dari tujuannya — catat dan verifikasi ke sumber tepercaya.
          </p>
        </div>
      </section>
    </main>
  );
}
