"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SpeakerAvatar } from "@/components/brand/Avatar";
import { Motif, type MotifKey } from "@/components/brand/Motif";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Bits";
import { CHARACTERS } from "@/data";
import { describeEffects } from "@/lib/labels";
import { useMotionEnabled } from "@/lib/hooks";
import { TONE_META, cn, interpolate } from "@/lib/utils";
import type { ChoiceOption, Line } from "@/lib/types";

/* ------------------------------------------------------------------
 * Kotak dialog
 * ------------------------------------------------------------------ */

/**
 * Menampilkan satu baris dialog. Pemain menekan "Lanjut" (atau Spasi/Enter)
 * untuk membaca baris berikutnya — supaya tempo membaca ada di tangan pemain.
 */
export function DialogueBox({
  line,
  playerName,
  index,
  total,
  onAdvance,
  disabled,
}: {
  line: Line;
  playerName: string;
  index: number;
  total: number;
  onAdvance: () => void;
  disabled?: boolean;
}) {
  const motionOn = useMotionEnabled();
  const character = CHARACTERS[line.speaker];
  const narrator = line.speaker === "narrator";
  const text = interpolate(line.text, playerName);

  return (
    <div aria-live="polite" className="relative">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`${line.speaker}-${index}-${line.text.slice(0, 24)}`}
          initial={motionOn ? { opacity: 0, y: 8 } : { opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionOn ? 0.22 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-start gap-3">
            {!narrator ? <SpeakerAvatar speaker={line.speaker} size="md" className="mt-0.5 shrink-0" /> : null}
            <div className="min-w-0 flex-1">
              {!narrator ? (
                <div className="flex flex-wrap items-baseline gap-2">
                  <span
                    className="font-display text-base"
                    style={{ color: character?.color ?? "var(--ink)" }}
                  >
                    {character?.name ?? line.speaker}
                  </span>
                  {character?.fictional ? (
                    <span className="text-[0.65rem] tracking-wide text-[var(--ink-subtle)] uppercase">
                      tokoh fiksi
                    </span>
                  ) : null}
                </div>
              ) : null}
              <p
                className={cn(
                  "story-text mt-1 text-[var(--ink)]",
                  narrator && "text-[var(--ink-muted)] italic",
                )}
              >
                {text}
              </p>
              {line.cue ? (
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-subtle)] italic">{line.cue}</p>
              ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs tabular-nums text-[var(--ink-subtle)]">
          Baris {index + 1} dari {total}
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-[var(--ink-subtle)] sm:inline">Spasi / Enter</span>
          <Button variant="primary" onClick={onAdvance} disabled={disabled} motif="spiral">
            {index + 1 === total ? "Lanjut" : "Berikutnya"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Daftar pilihan
 * ------------------------------------------------------------------ */

export function ChoiceList({
  prompt,
  footnote,
  options,
  onChoose,
  previouslyChosen = [],
  disabled,
}: {
  prompt: string;
  footnote?: string;
  options: ChoiceOption[];
  onChoose: (option: ChoiceOption) => void;
  /** opsi yang sudah pernah dipilih pemain di perjalanan sebelumnya */
  previouslyChosen?: string[];
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="panel-soft p-4">
        <div className="flex items-center gap-2">
          <Motif motif="spiral" className="h-4 w-4 text-[var(--gold)]" />
          <span className="eyebrow">Pilihanmu</span>
        </div>
        <p className="story-text mt-2 text-[var(--ink)]">{prompt}</p>
        {footnote ? <p className="mt-2 text-xs leading-relaxed text-[var(--ink-subtle)]">{footnote}</p> : null}
      </div>

      <ul className="mt-4 space-y-2.5">
        {options.map((option, index) => {
          const tone = TONE_META[option.tone ?? "neutral"] ?? TONE_META.neutral;
          const chosenBefore = previouslyChosen.includes(option.id);
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChoose(option)}
                className={cn(
                  "focus-ring group flex w-full items-start gap-3.5 rounded-[var(--radius-md)] border p-4 text-left transition-all",
                  "border-[var(--line)] bg-[var(--surface-2)] hover:-translate-y-[1px] hover:border-[var(--gold)]",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-xs font-semibold text-[var(--ink-subtle)] tabular-nums group-hover:border-[var(--gold)] group-hover:text-[var(--gold)]">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.95rem] leading-relaxed text-[var(--ink)]">{option.label}</span>
                    {chosenBefore ? (
                      <Chip tone="muted" motif="spiral">
                        pernah dipilih
                      </Chip>
                    ) : null}
                  </span>
                  {option.hint ? (
                    <span className="mt-1 block text-xs leading-relaxed text-[var(--ink-subtle)]">{option.hint}</span>
                  ) : null}
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-wide text-[var(--gold-soft)] uppercase">
                    <Motif motif={tone.motif as MotifKey} className="h-3.5 w-3.5" />
                    {option.tag ?? tone.label}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
        Kamu bisa menekan angka 1–{options.length} di papan ketik untuk memilih.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Kartu konsekuensi
 * ------------------------------------------------------------------ */

export function ConsequenceCard({
  option,
  onContinue,
  playerName,
}: {
  option: ChoiceOption;
  onContinue: () => void;
  playerName: string;
}) {
  const motionOn = useMotionEnabled();
  const chips = describeEffects(option.effects);
  const tone = TONE_META[option.tone ?? "neutral"] ?? TONE_META.neutral;

  return (
    <motion.div
      initial={motionOn ? { opacity: 0, y: 14 } : { opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionOn ? 0.32 : 0, ease: [0.22, 1, 0.36, 1] }}
      className="panel overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="hairline-top flex items-center gap-3 px-4 py-3 sm:px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--gold)_45%,transparent)] bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] text-[var(--gold)]">
          <Motif motif={tone.motif as MotifKey} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="eyebrow">Yang terjadi setelah pilihanmu</div>
          <div className="font-display truncate text-base text-[var(--ink)]">{option.label}</div>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4 sm:px-5">
        {option.reaction ? (
          <p className="story-text text-[var(--ink)]">{interpolate(option.reaction.text, playerName)}</p>
        ) : null}

        {chips.length > 0 ? (
          <>
            <div className="gold-rule" />
            <div className="flex flex-wrap gap-2">
              {chips.map((item) => (
                <Chip
                  key={item.id}
                  motif={item.motif}
                  tone={
                    item.tone === "knowledge"
                      ? "knowledge"
                      : item.tone === "practice"
                        ? "practice"
                        : item.tone === "quest" || item.tone === "gold"
                          ? "gold"
                          : "default"
                  }
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          </>
        ) : null}

        <p className="text-xs leading-relaxed text-[var(--ink-subtle)]">
          Catatan desain: tidak ada pilihan yang salah di sini. Setiap sikap membuka percakapan yang berbeda, dan
          cerita tetap bisa diselesaikan dengan cara apa pun.
        </p>

        <Button variant="primary" size="lg" motif="spiral" onClick={onContinue}>
          Lanjutkan cerita
        </Button>
      </div>
    </motion.div>
  );
}
