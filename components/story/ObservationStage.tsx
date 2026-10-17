"use client";

import { AnimatePresence, motion } from "framer-motion";
import { StageView } from "@/components/story/Stage";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Bits";
import { Motif } from "@/components/brand/Motif";
import { describeEffects } from "@/lib/labels";
import { useMotionEnabled } from "@/lib/hooks";
import { cn, interpolate } from "@/lib/utils";
import type { Hotspot, ObservationNode } from "@/lib/types";

/**
 * Adegan pengamatan: pemain mengetuk bagian panggung untuk memeriksa detail.
 * Petunjuk penting ditandai baru SETELAH ditemukan — supaya tetap ada rasa
 * "menemukan sendiri".
 */
export function ObservationStage({
  node,
  found,
  activeId,
  onFind,
  onComplete,
  onReopen,
  playerName,
}: {
  node: ObservationNode;
  found: string[];
  activeId: string | null;
  onFind: (hotspot: Hotspot) => void;
  onReopen: (hotspot: Hotspot) => void;
  onComplete: () => void;
  playerName: string;
}) {
  const motionOn = useMotionEnabled();
  const active = node.hotspots.find((h) => h.id === activeId) ?? null;
  const enough = found.length >= node.requiredCount;
  const allFound = found.length === node.hotspots.length;
  const foundHotspots = node.hotspots.filter((h) => found.includes(h.id));

  return (
    <div className="space-y-4">
      <div className="panel-soft p-4">
        <p className="story-text text-[var(--ink)]">{interpolate(node.instruction, playerName)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--ink-subtle)]">
          <span className="tabular-nums">
            {found.length}/{node.hotspots.length} diperiksa
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">minimal {node.requiredCount} untuk lanjut</span>
        </div>
      </div>

      <StageView
        scene={node.backdrop}
        expression={active ? "surprised" : "curious"}
        speaker={active ? "tara" : "narrator"}
        cast={node.cast}
        showTara={node.showTara ?? true}
        caption="Ketuk titik untuk memeriksa"
        overlay={
          <div className="absolute inset-0">
            {node.hotspots.map((hotspot) => {
              const isFound = found.includes(hotspot.id);
              const isActive = activeId === hotspot.id;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => (isFound ? onReopen(hotspot) : onFind(hotspot))}
                  aria-label={`${isFound ? "Baca lagi" : "Periksa"}: ${hotspot.label}`}
                  aria-pressed={isActive}
                  title={isFound ? hotspot.label : "Ada sesuatu di sini?"}
                  className={cn(
                    "focus-ring group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all",
                    isFound
                      ? "border-[color-mix(in_oklab,var(--gold)_65%,transparent)] bg-[rgba(5,7,16,0.66)] text-[var(--gold)] backdrop-blur-sm"
                      : "border-dashed border-[rgba(246,239,226,0.6)] bg-[rgba(5,7,16,0.35)] text-[#F4EADB] backdrop-blur-sm hover:scale-110 hover:border-[var(--gold)]",
                    isActive && "scale-110 border-[var(--gold)]",
                  )}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full",
                      isFound && "bg-[color-mix(in_oklab,var(--gold)_18%,transparent)]",
                    )}
                  >
                    {isFound ? (
                      <Motif motif={hotspot.kind === "clue" ? "star" : "eye"} className="h-4 w-4" />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-current animate-pulse-soft" />
                    )}
                  </span>
                  <span className="sr-only">{hotspot.label}</span>
                </button>
              );
            })}
          </div>
        }
      />

      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          <motion.div
            key={active.id}
            initial={motionOn ? { opacity: 0, y: 10 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionOn ? 0.24 : 0 }}
            className="panel-soft p-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-base text-[var(--ink)]">{active.label}</span>
              {active.kind === "clue" ? (
                <Chip tone="gold" motif="star">
                  petunjuk
                </Chip>
              ) : (
                <Chip tone="muted" motif="eye">
                  keterangan
                </Chip>
              )}
            </div>
            <p className="story-text mt-2 text-[var(--ink)]">{interpolate(active.text, playerName)}</p>
            {describeEffects(active.effects).length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {describeEffects(active.effects).map((item) => (
                  <Chip
                    key={item.id}
                    motif={item.motif}
                    tone={item.tone === "collection" ? "gold" : "default"}
                  >
                    {item.label}
                  </Chip>
                ))}
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {foundHotspots.length > 0 ? (
        <div className="panel-soft p-4">
          <div className="eyebrow">Yang sudah kamu periksa</div>
          <ul className="mt-2 space-y-1.5">
            {foundHotspots.map((hotspot) => (
              <li key={hotspot.id} className="flex items-start gap-2 text-sm text-[var(--ink-muted)]">
                <Motif
                  motif={hotspot.kind === "clue" ? "star" : "eye"}
                  className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", hotspot.kind === "clue" && "text-[var(--gold)]")}
                />
                <span>{hotspot.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" size="lg" motif="spiral" disabled={!enough} onClick={onComplete}>
          {enough ? "Lanjutkan cerita" : `Periksa ${node.requiredCount - found.length} lagi`}
        </Button>
        {allFound ? (
          <span className="flex items-center gap-2 text-sm text-[var(--success)]">
            <Motif motif="kawung" className="h-4 w-4" />
            Semua detail di adegan ini sudah kamu temukan.
          </span>
        ) : enough ? (
          <span className="text-xs text-[var(--ink-subtle)]">
            Kamu boleh memeriksa bagian lain dulu, tidak ada yang hilang.
          </span>
        ) : null}
      </div>
    </div>
  );
}
