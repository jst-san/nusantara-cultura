"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/brand/Motif";
import { cn, interpolate } from "@/lib/utils";
import type { ReflectionNode } from "@/lib/types";

const DRAFT_PREFIX = "tara-nusantara-refleksi:";

/**
 * Formulir refleksi. Tulisan pemain disimpan di perangkat sendiri
 * (localStorage lewat store) — tidak dikirim ke mana pun.
 *
 * Draf setengah jadi disimpan sementara di sessionStorage supaya tidak hilang
 * ketika pemain membuka panel catatan atau keluar sebentar dari layar.
 */
export function ReflectionForm({
  node,
  onSubmit,
  playerName,
}: {
  node: ReflectionNode;
  onSubmit: (text: string, chipsUsed: string[]) => void;
  playerName: string;
}) {
  const [text, setText] = useState(() => {
    try {
      return window.sessionStorage.getItem(`${DRAFT_PREFIX}${node.id}`) ?? "";
    } catch {
      return "";
    }
  });
  const [submitted, setSubmitted] = useState(false);
  const minimum = node.minLength ?? 20;

  useEffect(() => {
    try {
      window.sessionStorage.setItem(`${DRAFT_PREFIX}${node.id}`, text);
    } catch {
      // abaikan
    }
  }, [node.id, text]);

  const chips = node.chips ?? [];
  const usedChips = chips.filter((chip) => text.includes(chip));
  const length = text.trim().length;
  const ready = length >= minimum;

  const toggleChip = (chip: string) => {
    if (usedChips.includes(chip)) {
      setText((prev) => prev.replace(chip, "").replace(/\s{2,}/g, " ").trim());
      return;
    }
    setText((prev) => (prev.trim() === "" ? chip : `${prev.trimEnd()} ${chip}`));
  };

  return (
    <div className="space-y-4">
      <div className="panel-soft p-4">
        <div className="flex items-center gap-2">
          <Motif motif="spiral" className="h-4 w-4 text-[var(--gold)]" />
          <span className="eyebrow">Refleksi bersama Tara</span>
        </div>
        <p className="story-text mt-2 text-[var(--ink)]">{interpolate(node.prompt, playerName)}</p>
        {node.helper ? (
          <p className="mt-2 text-xs leading-relaxed text-[var(--ink-subtle)]">{interpolate(node.helper, playerName)}</p>
        ) : null}
      </div>

      {chips.length > 0 ? (
        <div>
          <div className="eyebrow mb-2">Kalau bingung mau mulai dari mana</div>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const used = usedChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  aria-pressed={used}
                  className={cn(
                    "focus-ring rounded-full border px-3 py-1.5 text-xs transition-all",
                    used
                      ? "border-[color-mix(in_oklab,var(--gold)_55%,transparent)] bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] text-[var(--gold-soft)]"
                      : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-muted)] hover:border-[var(--gold)] hover:text-[var(--ink)]",
                  )}
                >
                  {used ? "✓ " : "+ "}
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor={`refleksi-${node.id}`} className="eyebrow">
          Tulisanmu
        </label>
        <textarea
          id={`refleksi-${node.id}`}
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          maxLength={1200}
          disabled={submitted}
          placeholder="Tulis bebas dengan bahasamu sendiri. Tidak ada jawaban yang dinilai…"
          className="focus-ring mt-2 w-full resize-y rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-4 story-text text-[var(--ink)] placeholder:text-[var(--ink-subtle)] disabled:opacity-70"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className={cn("tabular-nums", ready ? "text-[var(--success)]" : "text-[var(--ink-subtle)]")}>
            {length}/{minimum} huruf minimum
          </span>
          <span className="text-[var(--ink-subtle)]">
            Tersimpan hanya di perangkat ini — tidak ada yang dikirim ke mana pun.
          </span>
        </div>
      </div>

      {submitted ? (
        <div
          className="rounded-[var(--radius-md)] border border-[color-mix(in_oklab,var(--success)_45%,transparent)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] p-4 text-sm text-[var(--ink)]"
          role="status"
        >
          <span className="flex items-center gap-2 font-medium">
            <Motif motif="star" className="h-4 w-4 text-[var(--success)]" />
            Catatanmu sudah tersimpan.
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          size="lg"
          motif="book"
          disabled={!ready || submitted}
          onClick={() => {
            setSubmitted(true);
            try {
              window.sessionStorage.removeItem(`${DRAFT_PREFIX}${node.id}`);
            } catch {
              // abaikan
            }
            onSubmit(text.trim(), usedChips);
          }}
        >
          Simpan catatan & lanjut
        </Button>
        {!ready ? (
          <span className="text-xs text-[var(--ink-subtle)]">
            Tulis sedikit lagi — minimal {minimum} huruf supaya catatannya cukup berarti saat dibaca ulang.
          </span>
        ) : null}
      </div>
    </div>
  );
}
