"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useGameStore } from "./store";

const subscribeNoop = () => () => {};

/** True setelah komponen ter-mount di klien (mencegah mismatch SSR). */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

/**
 * Progres hanya boleh dibaca setelah store selesai rehidrasi dari localStorage,
 * supaya tampilan server dan klien tidak berbeda.
 */
export function useSaveReady(): boolean {
  const hydrated = useGameStore((s) => s.hydrated);
  const mounted = useMounted();
  return mounted && hydrated;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Menentukan apakah animasi penuh boleh dimainkan. */
export function useMotionEnabled(): boolean {
  const pref = useGameStore((s) => s.settings.animations);
  const systemReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (pref === "reduced") return false;
  if (pref === "full") return true;
  return !systemReduced;
}

/** Menyinkronkan preferensi tampilan ke atribut <html>. */
export function useAppearanceSync(): void {
  const theme = useGameStore((s) => s.settings.theme);
  const textSize = useGameStore((s) => s.settings.textSize);
  const animations = useGameStore((s) => s.settings.animations);
  const systemReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.textSize = textSize;
    const reduced = animations === "reduced" || (animations === "system" && systemReduced);
    root.dataset.motion = reduced ? "reduced" : "full";
  }, [theme, textSize, animations, systemReduced, mounted]);
}

/** Menghitung waktu bermain (dipakai di Story Mode). */
export function usePlaytimeCounter(active: boolean): void {
  const addPlaySeconds = useGameStore((s) => s.addPlaySeconds);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => addPlaySeconds(15), 15000);
    return () => window.clearInterval(id);
  }, [active, addPlaySeconds]);
}

/** Melacak tombol Escape untuk dialog. */
export function useEscape(handler: () => void, active = true): void {
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, active]);
}
