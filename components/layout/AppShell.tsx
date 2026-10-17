"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Motif, type MotifKey } from "@/components/brand/Motif";
import { Tara } from "@/components/brand/Tara";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Overlay";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/lib/store";
import { resumeTarget, levelFromSave, counts } from "@/lib/progression";
import { configureAudio, playSfx } from "@/lib/audio";
import { getChapter, getEpisode } from "@/data";

export interface NavItem {
  href: string;
  label: string;
  motif: MotifKey;
  match: (path: string) => boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: "/home", label: "Beranda", motif: "lamp", match: (p) => p === "/home" || p === "/" },
  { href: "/journey", label: "Perjalanan", motif: "spiral", match: (p) => p.startsWith("/journey") },
  { href: "/quests", label: "Misi", motif: "star", match: (p) => p.startsWith("/quests") },
  { href: "/collection", label: "Koleksi", motif: "kawung", match: (p) => p.startsWith("/collection") },
  { href: "/profile", label: "Profil", motif: "eye", match: (p) => p.startsWith("/profile") },
];

const SECONDARY_NAV: NavItem[] = [
  { href: "/journal", label: "Jurnal Tara", motif: "book", match: (p) => p.startsWith("/journal") },
  { href: "/settings", label: "Pengaturan", motif: "gong", match: (p) => p.startsWith("/settings") },
  { href: "/help", label: "Bantuan", motif: "thread", match: (p) => p.startsWith("/help") },
  { href: "/about", label: "Tentang", motif: "leaf", match: (p) => p.startsWith("/about") },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/home" className="focus-ring flex items-center gap-3 rounded-lg" aria-label="TARA — kembali ke Beranda">
      <Tara expression="curious" className={compact ? "h-8 w-8" : "h-10 w-10"} />
      <span className="leading-none">
        <span className="font-display block text-lg tracking-[0.16em] text-[var(--gold-soft)]">TARA</span>
        {!compact ? (
          <span className="block text-[0.62rem] tracking-[0.14em] text-[var(--ink-subtle)] uppercase">
            Nusantara Story Quest
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export function AudioQuickToggle({ compact = false }: { compact?: boolean }) {
  const sfx = useGameStore((s) => s.settings.sfx);
  const setSettings = useGameStore((s) => s.setSettings);
  const ambience = useGameStore((s) => s.settings.ambience);
  return (
    <button
      type="button"
      onClick={() => {
        const next = !sfx;
        setSettings({ sfx: next, ambience: next ? ambience : false });
        if (next) playSfx("select");
      }}
      aria-pressed={sfx}
      className="focus-ring inline-flex h-9 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 text-xs text-[var(--ink-muted)] hover:text-[var(--ink)]"
      title={sfx ? "Matikan suara" : "Nyalakan suara"}
    >
      <Motif motif={sfx ? "gong" : "eye"} className="h-4 w-4" />
      <span className={compact ? "sr-only" : "hidden sm:inline"}>{sfx ? "Suara aktif" : "Suara mati"}</span>
    </button>
  );
}

function ContinueWidget() {
  const save = useGameStore();
  const ready = save.onboardingComplete;
  if (!ready) return null;
  const target = resumeTarget(save);
  if (!target) {
    return (
      <ButtonLink href="/journey" variant="secondary" size="sm" block motif="spiral">
        Buka peta perjalanan
      </ButtonLink>
    );
  }
  const chapter = getChapter(target.chapter.id);
  const episode = getEpisode(target.chapter.id, target.episode.id);
  if (!chapter || !episode) return null;
  return (
    <ButtonLink href={`/play/${chapter.id}/${episode.id}`} variant="primary" size="sm" block motif="lamp">
      Lanjutkan: {episode.title}
    </ButtonLink>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // Berlangganan seluruh state (referensi stabil) lalu turunkan nilai dengan
  // fungsi murni — selector yang mengembalikan objek baru akan memicu
  // peringatan getSnapshot zustand dan loop render.
  const save = useGameStore();
  const settings = save.settings;
  const level = levelFromSave(save);
  const stats = counts(save);

  useEffect(() => {
    configureAudio({ sfx: settings.sfx, ambience: settings.ambience, volume: settings.volume });
  }, [settings.sfx, settings.ambience, settings.volume]);

  return (
    <div className="relative z-10 min-h-dvh">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[16.5rem] flex-col border-r border-[var(--line)] bg-[color-mix(in_oklab,var(--surface)_86%,transparent)] backdrop-blur-xl lg:flex">
        <div className="px-5 py-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Navigasi utama">
          {PRIMARY_NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-ring group flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] text-[var(--gold-soft)]"
                    : "text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
                )}
              >
                <Motif motif={item.motif} className="h-[1.15rem] w-[1.15rem]" />
                {item.label}
                {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /> : null}
              </Link>
            );
          })}
          <div className="pt-3">
            <div className="px-3 pb-1.5">
              <span className="eyebrow">Lainnya</span>
            </div>
            {SECONDARY_NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-ring flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-all",
                    active
                      ? "bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] text-[var(--gold-soft)]"
                      : "text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
                  )}
                >
                  <Motif motif={item.motif} className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="space-y-3 border-t border-[var(--line)] px-4 py-4">
          <ContinueWidget />
          <div className="flex items-center justify-between gap-2 text-xs text-[var(--ink-subtle)]">
            <span className="inline-flex items-center gap-1.5">
              <Motif motif="star" className="h-3.5 w-3.5 text-[var(--gold)]" />
              Level {level.level} · {level.title}
            </span>
            <span className="tabular-nums">{stats.collectionFound}/{stats.collectionTotal}</span>
          </div>
          <AudioQuickToggle />
        </div>
      </aside>

      {/* Topbar mobile */}
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Logo compact />
          <div className="flex items-center gap-2">
            <AudioQuickToggle />
            <Button variant="ghost" size="sm" onClick={() => setMenuOpen(true)} aria-label="Buka menu lainnya">
              <Motif motif="kawung" className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="lg:pl-[16.5rem]">
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:pb-16 lg:pt-8">{children}</main>
      </div>

      {/* Bottom nav mobile */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        aria-label="Navigasi utama"
      >
        <ul className="grid grid-cols-5">
          {PRIMARY_NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "focus-ring flex flex-col items-center gap-1 py-2.5 text-[0.68rem] transition-colors",
                    active ? "text-[var(--gold)]" : "text-[var(--ink-subtle)]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                      active && "bg-[color-mix(in_oklab,var(--gold)_16%,transparent)]",
                    )}
                  >
                    <Motif motif={item.motif} className="h-[1.15rem] w-[1.15rem]" />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu lainnya" eyebrow="Navigasi tambahan">
        <div className="space-y-2">
          <ContinueWidget />
          <ul className="mt-4 space-y-1">
            {SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="focus-ring flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-3 text-sm text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                >
                  <Motif motif={item.motif} className="h-4 w-4 text-[var(--gold)]" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
            Progres perjalananmu disimpan di perangkat ini (localStorage). Tidak ada akun dan tidak ada data yang
            dikirim ke server.
          </div>
        </div>
      </Sheet>
    </div>
  );
}

/** Animasikan judul halaman saat berpindah rute. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
