"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tara } from "@/components/brand/Tara";
import { Motif } from "@/components/brand/Motif";
import { useAppearanceSync, useMotionEnabled, useSaveReady } from "@/lib/hooks";
import { configureAudio, unlockAudioOnFirstGesture } from "@/lib/audio";
import { useGameStore } from "@/lib/store";
import { NotificationHost } from "@/components/layout/NotificationHost";

function Splash({ message = "Menyiapkan perjalanan…" }: { message?: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Tara expression="curious" className="h-28 w-28" idle />
      </motion.div>
      <div className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
        <Motif motif="kawung" className="h-4 w-4 animate-pulse-soft text-[var(--gold)]" />
        {message}
      </div>
    </div>
  );
}

/** Membungkus aplikasi: sinkronisasi preferensi, audio, dan gerbang hidrasi. */
export function Providers({ children }: { children: React.ReactNode }) {
  const ready = useSaveReady();
  const motionOn = useMotionEnabled();
  const settings = useGameStore((s) => s.settings);
  useAppearanceSync();

  useEffect(() => {
    unlockAudioOnFirstGesture();
  }, []);

  useEffect(() => {
    configureAudio({ sfx: settings.sfx, ambience: settings.ambience, volume: settings.volume });
  }, [settings.sfx, settings.ambience, settings.volume]);

  return (
    <>
      <AnimatePresence mode="wait">
        {ready ? (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: motionOn ? 0.35 : 0 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div key="splash" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Splash />
          </motion.div>
        )}
      </AnimatePresence>
      <NotificationHost />
    </>
  );
}
