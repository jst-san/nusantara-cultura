"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Bits";
import { Motif } from "@/components/brand/Motif";
import { Tara } from "@/components/brand/Tara";
import { useMotionEnabled } from "@/lib/hooks";
import { interpolate } from "@/lib/utils";
import type { EffectChip } from "@/lib/labels";
import type { RewardNode } from "@/lib/types";

/** Kartu hadiah di akhir rangkaian node — daftar apa yang baru tercatat. */
export function RewardReveal({
  node,
  chips,
  alreadyOwned,
  onContinue,
  playerName,
}: {
  node: RewardNode;
  chips: EffectChip[];
  /** true bila node ini diputar ulang dan XP-nya tidak diberikan lagi */
  alreadyOwned?: boolean;
  onContinue: () => void;
  playerName: string;
}) {
  const motionOn = useMotionEnabled();

  return (
    <motion.div
      initial={motionOn ? { opacity: 0, scale: 0.97 } : { opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: motionOn ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
      className="panel relative overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(233,185,73,0.22),transparent_65%)]" />
      <div className="hairline-top relative px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-center gap-5">
          <span className="animate-quest-pop flex h-20 w-20 shrink-0 items-center justify-center">
            <Tara expression="happy" className="h-full w-full" idle={false} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="eyebrow">Tercatat di buku Tara</div>
            <h3 className="font-display mt-1 text-xl text-[var(--ink)] sm:text-2xl">{node.title}</h3>
            {node.subtitle ? (
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-muted)]">
                {interpolate(node.subtitle, playerName)}
              </p>
            ) : null}
          </div>
        </div>

        {chips.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Chip
                key={chip.id}
                motif={chip.motif}
                tone={
                  chip.tone === "knowledge"
                    ? "knowledge"
                    : chip.tone === "practice"
                      ? "practice"
                      : chip.tone === "gold" || chip.tone === "quest" || chip.tone === "achievement"
                        ? "gold"
                        : "default"
                }
              >
                {chip.label}
              </Chip>
            ))}
          </div>
        ) : null}

        {alreadyOwned ? (
          <p className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
            <Motif motif="book" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
            Bagian ini pernah kamu buka sebelumnya, jadi XP-nya tidak ditambahkan lagi. Membaca ulang tetap berguna —
            tapi hadiah hanya diberikan sekali.
          </p>
        ) : null}

        <div className="mt-5">
          <Button variant="primary" size="lg" motif="star" onClick={onContinue}>
            Lanjut
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
