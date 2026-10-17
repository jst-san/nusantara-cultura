"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Motif, type MotifKey } from "@/components/brand/Motif";
import { Tara } from "@/components/brand/Tara";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip, EmptyState, ProgressBar, StatusDot } from "@/components/ui/Bits";
import { TextArea, Toggle } from "@/components/ui/Controls";
import { ChecklistCard } from "@/components/games/ChecklistCard";
import { MatchingGame } from "@/components/games/MatchingGame";
import { OrderingGame } from "@/components/games/OrderingGame";
import { PronunciationPractice } from "@/components/games/ListeningPlayer";
import { QuizCard } from "@/components/games/QuizCard";
import { getQuest } from "@/data";
import { describeEffects, type EffectChip } from "@/lib/labels";
import { questView, visibleQuestViews } from "@/lib/progression";
import { useGameStore } from "@/lib/store";
import { playSfx } from "@/lib/audio";
import { cn, formatDateTime } from "@/lib/utils";
import type { Quest, QuestCategory, QuestStatus, QuestStep } from "@/lib/types";

/* ------------------------------------------------------------------
 * Meta kecil
 * ------------------------------------------------------------------ */

const CATEGORY_MOTIF: Record<QuestCategory, MotifKey> = {
  side: "star",
  hidden: "eye",
  practice: "thread",
};

const CATEGORY_LABEL: Record<QuestCategory, string> = {
  side: "Misi cerita",
  hidden: "Misi tersembunyi",
  practice: "Misi praktik",
};

const STATUS_LABEL: Record<QuestStatus, string> = {
  locked: "Terkunci",
  available: "Terbuka",
  active: "Berjalan",
  completed: "Selesai",
};

const STEP_META: Record<QuestStep["kind"], { label: string; motif: MotifKey }> = {
  learn: { label: "Pelajari", motif: "book" },
  do: { label: "Lakukan", motif: "thread" },
  reflect: { label: "Renungkan", motif: "spiral" },
  note: { label: "Catatan", motif: "eye" },
};

const METHOD_BY_COMPLETION: Record<Quest["completion"], string> = {
  exercise: "latihan aplikasi",
  reflection: "refleksi tertulis",
  report: "laporan aktivitas",
};

function effectTone(tone: EffectChip["tone"]): "knowledge" | "practice" | "gold" | "default" {
  if (tone === "knowledge") return "knowledge";
  if (tone === "practice") return "practice";
  if (tone === "gold" || tone === "quest") return "gold";
  return "default";
}

/* ------------------------------------------------------------------
 * Bagian yang dipakai berulang
 * ------------------------------------------------------------------ */

function QuestSteps({ steps }: { steps: QuestStep[] }) {
  return (
    <ol className="space-y-2.5">
      {steps.map((step, index) => {
        const meta = STEP_META[step.kind];
        return (
          <li key={step.id} className="panel-soft flex items-start gap-3 p-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--gold)]">
              <Motif motif={meta.motif} className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-sm text-[var(--ink)]">
                  {index + 1}. {step.title}
                </span>
                <span className="text-[0.65rem] tracking-wide text-[var(--ink-subtle)] uppercase">{meta.label}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">{step.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Latihan interaktif sesuai jenis exercise quest. */
function ExerciseBlock({
  quest,
  restartKey,
  onComplete,
}: {
  quest: Quest;
  restartKey: string;
  onComplete: (patch?: { note?: string }) => void;
}) {
  const countQuizAttempt = useGameStore((s) => s.countQuizAttempt);
  const exercise = quest.exercise;
  if (!exercise) return null;

  switch (exercise.kind) {
    case "quiz":
      return (
        <QuizCard
          question={exercise.question}
          context={exercise.intro}
          options={exercise.options}
          restartKey={restartKey}
          onAttempt={(correct) => countQuizAttempt(correct)}
          onResolved={() => onComplete()}
        />
      );
    case "matching":
      return (
        <MatchingGame
          instruction={exercise.instruction}
          pairs={exercise.pairs}
          caveat={exercise.caveat}
          seed={`${quest.id}-matching`}
          restartKey={restartKey}
          onComplete={() => onComplete()}
        />
      );
    case "ordering":
      return (
        <OrderingGame
          instruction={exercise.instruction}
          items={exercise.items}
          correctOrder={exercise.correctOrder}
          caveat={exercise.caveat}
          seed={`${quest.id}-ordering`}
          restartKey={restartKey}
          onComplete={() => onComplete()}
        />
      );
    case "pronunciation":
      return (
        <div className="space-y-3">
          <PronunciationPractice entries={exercise.entries} />
          <p className="text-xs leading-relaxed text-[var(--ink-subtle)]">
            Latihan pelafalan tidak dinilai aplikasi. Kamu bisa menandai misi selesai kapan pun kamu merasa cukup —
            atau mengulangnya nanti.
          </p>
        </div>
      );
    case "checklist":
      return (
        <ChecklistCard
          instruction={exercise.instruction}
          items={exercise.items}
          restartKey={restartKey}
          onComplete={(checked) => onComplete({ note: checked.join(",") })}
        />
      );
  }
}

/* ------------------------------------------------------------------
 * Halaman
 * ------------------------------------------------------------------ */

export default function QuestDetailPage() {
  const params = useParams<{ questId: string }>();
  const questId = typeof params.questId === "string" ? params.questId : "";
  const quest = getQuest(questId);

  if (!quest) {
    return (
      <EmptyState
        title="Misi tidak ditemukan"
        body="Alamat ini tidak cocok dengan misi mana pun di prototipe. Kembali ke pusat misi untuk melihat misi yang tersedia."
        motif="star"
        action={
          <ButtonLink href="/quests" variant="primary" motif="star">
            Kembali ke pusat misi
          </ButtonLink>
        }
      />
    );
  }

  return <QuestDetailView quest={quest} />;
}

function QuestDetailView({ quest }: { quest: Quest }) {
  const save = useGameStore((s) => s);
  const startQuest = useGameStore((s) => s.startQuest);
  const updateQuestDraft = useGameStore((s) => s.updateQuestDraft);
  const completeQuest = useGameStore((s) => s.completeQuest);

  const [replaying, setReplaying] = useState(false);
  const [replayVersion, setReplayVersion] = useState(0);

  const view = questView(save, quest);
  const progress = save.quests[quest.id];
  const status = view.status;

  /** Misi tersembunyi yang belum ditemukan tidak membocorkan judul, tujuan, atau langkahnya. */
  const spoiler = quest.category === "hidden" && !view.revealed;

  const reflection = progress?.reflection ?? "";
  const declared = Boolean(progress?.declared);
  const exerciseKind = quest.exercise?.kind;
  const exerciseRequired = Boolean(quest.exercise) && exerciseKind !== "pronunciation";
  const exerciseDone = Boolean(progress?.exerciseDone);
  const reflectionReady = reflection.trim().length >= 20;

  const canFinish =
    status === "active" &&
    (!exerciseRequired || exerciseDone) &&
    (!quest.requiresReflection || reflectionReady) &&
    (!quest.requiresDeclaration || declared);

  const method = METHOD_BY_COMPLETION[quest.completion];
  const checklist = quest.exercise?.kind === "checklist" ? quest.exercise : undefined;
  const checkedIds = progress?.note
    ? progress.note
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  const rewardChips = describeEffects({
    knowledgeXp: quest.reward.knowledgeXp,
    practiceXp: quest.reward.practiceXp,
    unlockCollection: quest.reward.collection,
    unlockAchievements: quest.reward.achievements,
    journal: quest.reward.journal,
  });

  const nextView = visibleQuestViews(save).find(
    (entry) => entry.quest.id !== quest.id && (entry.status === "active" || entry.status === "available"),
  );

  const honestyChip = quest.selfReported
    ? { tone: "practice" as const, motif: "thread" as const, label: "laporan aktivitas nyata · tidak diverifikasi" }
    : quest.exercise
      ? { tone: "knowledge" as const, motif: "book" as const, label: "latihan di aplikasi · diperiksa aplikasi" }
      : { tone: "muted" as const, motif: "spiral" as const, label: "refleksi tertulis · tidak dinilai" };

  const finishQuest = () => {
    completeQuest(quest.id, {
      reflection: reflection.trim() === "" ? undefined : reflection.trim(),
      method,
      declared: quest.requiresDeclaration ? declared : undefined,
      exerciseDone: exerciseDone || undefined,
    });
    playSfx("achievement");
  };

  return (
    <div className="space-y-6">
      <nav aria-label="Remah navigasi">
        <ButtonLink href="/quests" variant="quiet" size="sm">
          ← Pusat misi
        </ButtonLink>
      </nav>

      {/* ---------- Kepala misi ---------- */}
      <header className="panel relative overflow-hidden">
        <Motif
          motif={CATEGORY_MOTIF[quest.category]}
          className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 text-[var(--gold)] opacity-[0.08]"
        />
        <div className="relative p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="gold" motif={CATEGORY_MOTIF[quest.category]}>
              {CATEGORY_LABEL[quest.category]}
            </Chip>
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-wide text-[var(--ink-subtle)] uppercase">
              <StatusDot status={status} />
              {STATUS_LABEL[status]}
            </span>
            <Chip tone={honestyChip.tone} motif={honestyChip.motif}>
              {honestyChip.label}
            </Chip>
          </div>

          <h1 className="display-title mt-2 text-2xl text-[var(--ink)] sm:text-3xl">
            {spoiler ? "Misi tersembunyi" : quest.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--gold-soft)]">
            {spoiler ? "Misi ini belum ditemukan — petunjuk membukanya ada di bawah." : quest.tagline}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip motif="lamp">{quest.duration}</Chip>
            {!spoiler ? <Chip motif="kawung">{quest.activityType}</Chip> : null}
          </div>

          {!spoiler ? (
            <>
              <p className="story-text mt-4 max-w-3xl text-[var(--ink-muted)]">{quest.goal}</p>
              <p className="mt-3 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
                <Motif motif="thread" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
                <span>
                  <span className="font-medium text-[var(--ink-muted)]">Dari cerita: </span>
                  {quest.storyLink}
                </span>
              </p>
            </>
          ) : null}

          {status === "active" ? (
            <div className="mt-4 max-w-md">
              <ProgressBar value={view.progressPercent} label="Kemajuan misi" tone="gold" showValue />
            </div>
          ) : null}
        </div>
      </header>

      {/* ---------- Terkunci ---------- */}
      {status === "locked" ? (
        <>
          <section aria-label="Cara membuka misi" className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--gold)]">
              <Motif motif="lamp" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
              <p className="font-display text-base text-[var(--ink)]">Misi ini belum terbuka</p>
              <p className="mt-1">{quest.unlock.reason}</p>
              <p className="mt-2 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs text-[var(--ink-subtle)]">
                <Motif motif="eye" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
                <span>
                  <span className="font-medium text-[var(--ink-muted)]">Petunjuk: </span>
                  {quest.unlock.hint}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <ButtonLink href="/journey" variant="primary" motif="spiral">
                Buka peta perjalanan
              </ButtonLink>
              <ButtonLink href="/quests" variant="ghost" motif="star">
                Pusat misi
              </ButtonLink>
            </div>
          </section>

          {!spoiler ? (
            <section aria-label="Gambaran langkah" className="space-y-3">
              <h2 className="font-display text-xl text-[var(--ink)]">Gambaran langkah</h2>
              <QuestSteps steps={quest.steps} />
              <p className="text-xs leading-relaxed text-[var(--ink-subtle)]">
                Ini hanya pratinjau. Tombol mulai muncul setelah misi terbuka — kamu tidak perlu menghafal langkahnya.
              </p>
            </section>
          ) : null}
        </>
      ) : null}

      {/* ---------- Alternatif & catatan jujur (sebelum melakukan apa pun) ---------- */}
      {!spoiler && status !== "completed" ? (
        <>
          <section aria-label="Cara lain yang setara" className="panel-soft p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Motif motif="thread" className="h-4 w-4 text-[var(--gold)]" />
              <h2 className="eyebrow">Cara lain yang setara</h2>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-muted)]">
              Semua cara di bawah sama sahnya. Pilih yang paling nyaman bagimu — termasuk yang bisa dilakukan
              sendirian.
            </p>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {quest.alternatives.map((alternative) => (
                <li key={alternative.label} className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3.5">
                  <p className="text-sm font-medium text-[var(--ink)]">{alternative.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--ink-subtle)]">{alternative.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-label="Catatan jujur misi"
            className="panel-soft flex items-start gap-3 p-4 text-sm leading-relaxed text-[var(--ink-muted)] sm:p-5"
          >
            <Motif motif="eye" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
            <div>
              <p className="font-medium text-[var(--ink)]">Catatan jujur misi ini</p>
              <p className="mt-1">{quest.honestyNote}</p>
            </div>
          </section>

          <section aria-label="Hadiah misi" className="panel-soft p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="eyebrow flex items-center gap-2">
                <Motif motif="star" className="h-3.5 w-3.5 text-[var(--gold)]" />
                Hadiah misi
              </h2>
              <span className="text-xs text-[var(--ink-subtle)]">diberikan sekali saat misi ditandai selesai</span>
            </div>
            {rewardChips.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {rewardChips.map((effect) => (
                  <Chip key={effect.id} motif={effect.motif} tone={effectTone(effect.tone)}>
                    {effect.label}
                  </Chip>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--ink-subtle)]">Misi ini tidak memberi hadiah tercatat.</p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
              {quest.category === "practice"
                ? "Misi praktik memberi XP praktik dari laporanmu sendiri. Aplikasi tidak bisa memeriksa apa yang kamu lakukan di luar."
                : "XP pengetahuan berasal dari latihan di dalam aplikasi, bukan penilaian atas pengetahuanmu di dunia nyata."}
            </p>
          </section>
        </>
      ) : null}

      {/* ---------- Terbuka ---------- */}
      {status === "available" ? (
        <>
          <section aria-label="Langkah misi" className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">Langkah misi</h2>
            <QuestSteps steps={quest.steps} />
          </section>
          <section aria-label="Mulai misi" className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <Tara expression="determined" className="h-16 w-16 shrink-0" idle />
            <div className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
              <p className="font-display text-base text-[var(--ink)]">Misi ini siap dijalankan.</p>
              <p className="mt-1">
                Semua bagian disimpan di perangkat ini, jadi kamu boleh berhenti kapan saja dan melanjutkan lagi
                nanti.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              motif="spiral"
              className="shrink-0"
              onClick={() => startQuest(quest.id)}
            >
              Mulai misi
            </Button>
          </section>
        </>
      ) : null}

      {/* ---------- Berjalan ---------- */}
      {status === "active" ? (
        <>
          <section aria-label="Langkah misi" className="space-y-3">
            <h2 className="font-display text-xl text-[var(--ink)]">Langkah misi</h2>
            <QuestSteps steps={quest.steps} />
          </section>

          {quest.exercise ? (
            <section aria-label="Latihan misi" className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl text-[var(--ink)]">Latihan</h2>
                <Chip tone={quest.selfReported ? "practice" : "knowledge"} motif={quest.selfReported ? "thread" : "book"}>
                  {quest.selfReported
                    ? "aktivitas nyata · laporan sendiri"
                    : "latihan di aplikasi · diperiksa aplikasi"}
                </Chip>
              </div>
              {exerciseDone && !replaying ? (
                <div className="panel-soft flex flex-wrap items-center gap-3 p-4">
                  <Motif motif="star" className="h-5 w-5 shrink-0 text-[var(--success)]" />
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {exerciseKind === "pronunciation"
                      ? "Pelafalannya sudah kamu coba. Boleh diulang kapan saja — tidak dinilai."
                      : "Latihan ini sudah kamu selesaikan. Boleh diulang kapan saja tanpa mengubah hadiah."}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    motif="spiral"
                    onClick={() => {
                      setReplaying(true);
                      setReplayVersion((value) => value + 1);
                    }}
                  >
                    Ulangi latihan
                  </Button>
                </div>
              ) : (
                <ExerciseBlock
                  quest={quest}
                  restartKey={`${quest.id}-${replayVersion}`}
                  onComplete={(patch) => {
                    updateQuestDraft(quest.id, { exerciseDone: true, ...patch });
                    playSfx("success");
                    setReplaying(false);
                  }}
                />
              )}
            </section>
          ) : null}

          {quest.reflectionPrompt ? (
            <section aria-label="Refleksi misi" className="space-y-3">
              <div className="panel-soft p-4">
                <div className="flex items-center gap-2">
                  <Motif motif="spiral" className="h-4 w-4 text-[var(--gold)]" />
                  <span className="eyebrow">Refleksi</span>
                </div>
                <p className="story-text mt-2 text-[var(--ink)]">{quest.reflectionPrompt}</p>
              </div>
              <TextArea
                label="Tulisanmu"
                hint={
                  quest.reflectionHelper ??
                  "Tersimpan hanya di perangkat ini — tidak ada yang dikirim ke mana pun."
                }
                value={reflection}
                rows={5}
                maxLength={1200}
                placeholder="Tulis bebas dengan bahasamu sendiri. Tidak ada jawaban yang dinilai."
                onChange={(event) => updateQuestDraft(quest.id, { reflection: event.target.value })}
                counter={
                  quest.requiresReflection ? (
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        reflectionReady ? "text-[var(--success)]" : "text-[var(--ink-subtle)]",
                      )}
                    >
                      {reflection.trim().length}/20 huruf minimum
                    </span>
                  ) : (
                    <span className="text-xs tabular-nums text-[var(--ink-subtle)]">
                      {reflection.trim().length} huruf
                    </span>
                  )
                }
              />
            </section>
          ) : null}

          {quest.requiresDeclaration ? (
            <section aria-label="Pernyataan misi" className="panel-soft px-4 sm:px-5">
              <Toggle
                checked={declared}
                onChange={(next) => updateQuestDraft(quest.id, { declared: next })}
                label={quest.declarationLabel ?? "Saya sudah mencoba ini"}
                description="Pernyataan ini adalah laporanmu sendiri; aplikasi tidak memverifikasi apa yang kamu lakukan di luar. Kejujuranmu lebih berharga daripada laporan yang terdengar hebat."
              />
            </section>
          ) : null}

          <section aria-label="Menandai misi selesai" className="panel p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" motif="star" disabled={!canFinish} onClick={finishQuest}>
                Tandai selesai
              </Button>
              <span className="text-xs text-[var(--ink-subtle)]">Metode penyelesaian: {method}.</span>
            </div>
            {!canFinish ? (
              <ul className="mt-3 space-y-1 text-xs leading-relaxed text-[var(--ink-subtle)]">
                {exerciseRequired && !exerciseDone ? <li>· Selesaikan latihan di atas dulu.</li> : null}
                {quest.requiresReflection && !reflectionReady ? (
                  <li>· Tulis refleksi minimal 20 huruf supaya cukup terbaca saat dibuka lagi.</li>
                ) : null}
                {quest.requiresDeclaration && !declared ? (
                  <li>· Tandai pernyataan bahwa kamu sudah mencoba — dengan cara mana pun yang setara.</li>
                ) : null}
                {!exerciseRequired && exerciseKind === "pronunciation" ? (
                  <li>· Latihan pelafalan tidak wajib diselesaikan; tandai selesai kapan pun kamu merasa cukup.</li>
                ) : null}
              </ul>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
                Hadiah diberikan satu kali. Setelah selesai, misi ini tetap bisa dibuka untuk dibaca ulang.
              </p>
            )}
          </section>
        </>
      ) : null}

      {/* ---------- Selesai ---------- */}
      {status === "completed" ? (
        <>
          <section aria-label="Ringkasan misi selesai" className="panel relative overflow-hidden">
            <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(233,185,73,0.16),transparent_65%)]" />
            <div className="relative flex flex-wrap items-start gap-5 p-5 sm:p-6">
              <Tara expression="proud" className="h-24 w-24 shrink-0" idle />
              <div className="min-w-0 flex-1">
                <div className="eyebrow">Misi selesai</div>
                <h2 className="display-title mt-1 text-xl text-[var(--ink)] sm:text-2xl">{quest.title}</h2>
                {progress?.completedAt ? (
                  <p className="mt-1 text-xs text-[var(--ink-subtle)]">
                    Ditandai selesai {formatDateTime(progress.completedAt)} · metode: {progress.method ?? method}
                  </p>
                ) : null}
                {rewardChips.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {rewardChips.map((effect) => (
                      <Chip key={effect.id} motif={effect.motif} tone={effectTone(effect.tone)}>
                        {effect.label}
                      </Chip>
                    ))}
                  </div>
                ) : null}
                <p className="mt-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
                  Hadiah hanya diberikan sekali saat misi pertama kali ditandai selesai — mengulang latihan tidak
                  menambah XP.
                </p>
              </div>
            </div>
          </section>

          <section aria-label="Langkah yang dijalani" className="panel-soft p-4 sm:p-5">
            <div className="eyebrow">Langkah yang kamu jalani</div>
            <ol className="mt-2 space-y-1.5">
              {quest.steps.map((step, index) => (
                <li key={step.id} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                  <span className="text-[var(--ink-subtle)] tabular-nums">{index + 1}.</span>
                  <span>
                    <span className="text-[var(--ink)]">{step.title}</span>
                    <span className="text-[var(--ink-subtle)]"> — {STEP_META[step.kind].label}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {quest.reflectionPrompt && reflection.trim() !== "" ? (
            <section aria-label="Refleksimu" className="panel-soft p-4 sm:p-5">
              <div className="eyebrow">Refleksimu</div>
              <p className="mt-1 text-xs italic text-[var(--ink-subtle)]">{quest.reflectionPrompt}</p>
              <p className="story-text mt-2 whitespace-pre-line text-[var(--ink)]">{reflection}</p>
            </section>
          ) : null}

          {quest.requiresDeclaration ? (
            <section
              aria-label="Status pernyataan"
              className="panel-soft flex items-start gap-3 p-4 text-sm leading-relaxed text-[var(--ink-muted)] sm:p-5"
            >
              <Motif
                motif={declared ? "star" : "eye"}
                className={cn("mt-0.5 h-4 w-4 shrink-0", declared ? "text-[var(--success)]" : "text-[var(--ink-subtle)]")}
              />
              <p>
                <span className="font-medium text-[var(--ink)]">Pernyataan: </span>
                {declared ? quest.declarationLabel ?? "Saya sudah mencoba ini" : "Tidak dicatat saat menyelesaikan."}
                {declared ? (
                  <span className="text-[var(--ink-subtle)]">
                    {" "}
                    — ini laporanmu sendiri, bukan hasil verifikasi aplikasi.
                  </span>
                ) : null}
              </p>
            </section>
          ) : null}

          {checklist && checkedIds.length > 0 ? (
            <section aria-label="Langkah yang ditandai" className="panel-soft p-4 sm:p-5">
              <div className="eyebrow">Langkah yang kamu tandai</div>
              <ul className="mt-2 space-y-1.5">
                {checklist.items
                  .filter((item) => checkedIds.includes(item.id))
                  .map((item) => (
                    <li key={item.id} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                      <Motif motif="star" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                      {item.text}
                    </li>
                  ))}
              </ul>
            </section>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/quests" variant="secondary" motif="star">
              Kembali ke pusat misi
            </ButtonLink>
            {quest.reward.collection && quest.reward.collection.length > 0 ? (
              <ButtonLink href="/collection" variant="secondary" motif="kawung">
                Lihat koleksi
              </ButtonLink>
            ) : null}
            {quest.reward.journal && quest.reward.journal.length > 0 ? (
              <ButtonLink href="/journal" variant="secondary" motif="book">
                Buka jurnal
              </ButtonLink>
            ) : null}
            {nextView ? (
              <ButtonLink href={`/quests/${nextView.quest.id}`} variant="primary" motif="spiral">
                Misi berikutnya: {nextView.quest.title}
              </ButtonLink>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
