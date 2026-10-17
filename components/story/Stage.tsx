"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Backdrop } from "@/components/brand/Backdrop";
import { Tara } from "@/components/brand/Tara";
import { SpeakerAvatar } from "@/components/brand/Avatar";
import { Motif } from "@/components/brand/Motif";
import { CHARACTERS } from "@/data";
import { useMotionEnabled } from "@/lib/hooks";
import type { SceneKey, SpeakerId, TaraExpression } from "@/lib/types";
import { cn } from "@/lib/utils";

const SCENE_LABEL: Record<SceneKey, string> = {
  hills_dawn: "Perbukitan · menjelang pagi",
  village_gate: "Gerbang Desa Candrageni",
  village_square: "Halaman desa",
  pendopo_dusk: "Pendopo · sore",
  pendopo_night: "Pendopo · malam pertunjukan",
  screen_glow: "Di balik layar",
  workbench: "Meja kerja dalang",
  banyan_dusk: "Bawah pohon beringin · senja",
  fields_morning: "Sawah desa · pagi",
  sky_night: "Langit malam",
};

export function StageView({
  scene,
  expression,
  speaker,
  cast = [],
  showTara = true,
  caption,
  children,
  overlay,
  compact,
}: {
  scene: SceneKey;
  expression: TaraExpression;
  speaker: SpeakerId;
  cast?: SpeakerId[];
  showTara?: boolean;
  caption?: string;
  children?: React.ReactNode;
  overlay?: React.ReactNode;
  compact?: boolean;
}) {
  const motionOn = useMotionEnabled();
  const visibleCast = cast.filter((id) => id !== "tara" && id !== "narrator" && id !== "player");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--stage)]",
        compact ? "h-[26vh] min-h-[170px] sm:h-[32vh]" : "h-[34vh] min-h-[210px] sm:h-[40vh]",
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: motionOn ? 1.04 : 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionOn ? 0.8 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <Backdrop scene={scene} />
        </motion.div>
      </AnimatePresence>

      {/* vignette + horizon light */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(0,0,0,0.65),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(3,5,12,0.85)] to-transparent" />

      {/* label adegan */}
      <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[rgba(246,239,226,0.18)] bg-[rgba(5,7,16,0.5)] px-3 py-1 text-[0.68rem] tracking-wide text-[#F4EADB] backdrop-blur-sm">
          {SCENE_LABEL[scene] ?? "Desa Candrageni"}
        </span>
        {caption ? (
          <span className="rounded-full border border-[rgba(246,239,226,0.14)] bg-[rgba(5,7,16,0.4)] px-3 py-1 text-[0.68rem] text-[#E7D9C4] backdrop-blur-sm">
            {caption}
          </span>
        ) : null}
      </div>

      {/* Tara */}
      {showTara ? (
        <AnimatePresence>
          <motion.div
            key={expression}
            className="pointer-events-none absolute bottom-[-2%] left-[3%] h-[62%] max-h-[240px] sm:left-[6%]"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: motionOn ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tara expression={expression} className="h-full w-auto drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]" idle />
          </motion.div>
        </AnimatePresence>
      ) : null}

      {/* tokoh pendukung */}
      {visibleCast.length > 0 ? (
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1.5">
          {visibleCast.map((id) => {
            const character = CHARACTERS[id];
            const active = speaker === id;
            return (
              <div
                key={id}
                className={cn(
                  "flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 backdrop-blur-sm transition-all",
                  active
                    ? "border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-[rgba(5,7,16,0.72)]"
                    : "border-[rgba(246,239,226,0.14)] bg-[rgba(5,7,16,0.42)] opacity-80",
                )}
              >
                <SpeakerAvatar speaker={id} size="sm" />
                <span className="text-[0.7rem] text-[#F4EADB]">{character?.name ?? id}</span>
                {active ? <Motif motif="wave" className="h-3.5 w-3.5 text-[var(--gold)]" /> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {overlay}
      {children}
    </div>
  );
}
