"use client";

import { useState } from "react";
import { Motif, type MotifKey } from "@/components/brand/Motif";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, EmptyState, ProgressBar, StatusDot } from "@/components/ui/Bits";
import { FilterPills } from "@/components/ui/Controls";
import { QUEST_CATEGORY_META } from "@/data";
import { hiddenQuestCount, visibleQuestViews } from "@/lib/progression";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { QuestCategory, QuestStatus } from "@/lib/types";

type QuestFilter = "all" | QuestCategory;

const CATEGORY_MOTIF: Record<QuestCategory, MotifKey> = {
  side: "star",
  hidden: "eye",
  practice: "thread",
};

const STATUS_META: Record<QuestStatus, { label: string; tone: "muted" | "gold" | "knowledge" | "success" }> = {
  locked: { label: "Terkunci", tone: "muted" },
  available: { label: "Terbuka", tone: "gold" },
  active: { label: "Berjalan", tone: "knowledge" },
  completed: { label: "Selesai", tone: "success" },
};

function categoryLabel(category: QuestCategory): string {
  return QUEST_CATEGORY_META.find((meta) => meta.id === category)?.label ?? category;
}

function linkLabel(status: QuestStatus): string {
  if (status === "locked") return "Cara membuka";
  if (status === "active") return "Lanjutkan misi";
  if (status === "completed") return "Lihat ringkasan";
  return "Buka misi";
}

export default function QuestCenterPage() {
  const save = useGameStore((s) => s);
  const [filter, setFilter] = useState<QuestFilter>("all");

  const views = visibleQuestViews(save);
  const hidden = hiddenQuestCount(save);

  const filterCounts: Record<QuestFilter, number> = {
    all: views.length,
    side: views.filter((view) => view.quest.category === "side").length,
    hidden: views.filter((view) => view.quest.category === "hidden").length,
    practice: views.filter((view) => view.quest.category === "practice").length,
  };

  const shown = filter === "all" ? views : views.filter((view) => view.quest.category === filter);
  const activeFilterMeta = QUEST_CATEGORY_META.find((meta) => meta.id === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Pusat misi</div>
          <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">Misi untuk Tara</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
            Misi tumbuh dari hal-hal yang Tara jumpai di dalam cerita: satu percakapan, satu kata yang membingungkan,
            atau satu halaman buku. Ada juga misi yang tersembunyi sampai kamu menemukan petunjuknya.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="knowledge" motif="book">
            {save.xp.knowledge} XP pengetahuan
          </Chip>
          <Chip tone="practice" motif="thread">
            {save.xp.practice} XP praktik
          </Chip>
        </div>
      </header>

      {/* ---------- Catatan kejujuran + progres misi tersembunyi ---------- */}
      <section aria-label="Cara membaca halaman misi" className="panel-soft p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Motif motif="eye" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gold)]" />
          <div className="min-w-0 flex-1 text-sm leading-relaxed text-[var(--ink-muted)]">
            <p className="font-medium text-[var(--ink)]">Dua jenis XP, dua cara berbeda</p>
            <p className="mt-1">
              <strong className="text-[var(--knowledge)]">XP pengetahuan</strong> diberikan oleh latihan di dalam
              aplikasi. <strong className="text-[var(--practice)]">XP praktik</strong> diberikan oleh misi praktik yang
              kamu <em>laporkan sendiri</em> sudah dijalankan — aplikasi tidak memverifikasi aktivitas nyata. Setiap
              misi praktik punya cara alternatif yang setara, termasuk versi yang bisa dilakukan sendirian.
            </p>
            <div className="mt-3 max-w-md">
              <ProgressBar
                value={hidden.discovered}
                max={hidden.total}
                label={`Misi tersembunyi ditemukan: ${hidden.discovered}/${hidden.total}`}
                tone="gold"
                showValue
              />
            </div>
          </div>
        </div>
      </section>

      {views.length === 0 ? (
        <EmptyState
          motif="star"
          title="Belum ada misi yang terbuka"
          body="Misi muncul dari cerita: kenalan baru, kata yang membuat Tara penasaran, atau hal yang ia janjikan pada dirinya sendiri. Beberapa misi juga tersembunyi dan hanya muncul setelah kamu menemukannya. Jalani bab pertama dulu, lalu kembali ke sini."
          action={
            <ButtonLink href="/journey" variant="primary" motif="spiral">
              Buka peta perjalanan
            </ButtonLink>
          }
        />
      ) : (
        <>
          {/* ---------- Filter ---------- */}
          <section aria-label="Saring misi" className="space-y-3">
            <FilterPills<QuestFilter>
              value={filter}
              onChange={setFilter}
              label="Saring misi berdasarkan jenis"
              options={[
                { value: "all", label: "Semua", motif: "kawung" },
                { value: "side", label: "Misi cerita", motif: "star" },
                { value: "hidden", label: "Misi tersembunyi", motif: "eye" },
                { value: "practice", label: "Misi praktik", motif: "thread" },
              ]}
              counts={filterCounts}
            />
            <p className="max-w-3xl text-xs leading-relaxed text-[var(--ink-subtle)]">
              {activeFilterMeta
                ? activeFilterMeta.blurb
                : "Semua misi yang saat ini terlihat di perjalananmu. Misi tersembunyi hanya muncul setelah ditemukan."}
            </p>
          </section>

          {/* ---------- Daftar misi ---------- */}
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((view) => {
              const quest = view.quest;
              const locked = view.status === "locked";
              const status = STATUS_META[view.status];
              return (
                <li key={quest.id} className="h-full">
                  <article
                    className={cn(
                      "panel relative flex h-full flex-col overflow-hidden p-4 sm:p-5",
                      locked && "border-dashed opacity-85",
                    )}
                  >
                    <Motif
                      motif={CATEGORY_MOTIF[quest.category]}
                      className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 text-[var(--gold)] opacity-[0.07]"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip tone={locked ? "muted" : "gold"} motif={CATEGORY_MOTIF[quest.category]}>
                        {categoryLabel(quest.category)}
                      </Chip>
                      <span className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-wide text-[var(--ink-subtle)] uppercase">
                        <StatusDot status={view.status} />
                        {status.label}
                      </span>
                    </div>

                    <h2 className="font-display mt-2 text-lg leading-snug text-[var(--ink)]">{quest.title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--gold-soft)]">{quest.tagline}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--ink-muted)]">{quest.goal}</p>

                    {locked ? (
                      <p className="mt-3 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs leading-relaxed text-[var(--ink-subtle)]">
                        <Motif motif="lamp" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
                        {quest.unlock.hint}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Chip motif="lamp">{quest.duration}</Chip>
                      {typeof quest.reward.knowledgeXp === "number" && quest.reward.knowledgeXp > 0 ? (
                        <Chip tone="knowledge" motif="book">
                          +{quest.reward.knowledgeXp} XP pengetahuan
                        </Chip>
                      ) : null}
                      {typeof quest.reward.practiceXp === "number" && quest.reward.practiceXp > 0 ? (
                        <Chip tone="practice" motif="thread">
                          +{quest.reward.practiceXp} XP praktik
                        </Chip>
                      ) : null}
                    </div>

                    {view.status === "active" || view.status === "completed" ? (
                      <ProgressBar
                        value={view.progressPercent}
                        size="sm"
                        tone={view.status === "completed" ? "success" : "gold"}
                        className="mt-3"
                      />
                    ) : null}

                    <div className="mt-auto pt-4">
                      <ButtonLink
                        href={`/quests/${quest.id}`}
                        variant={locked ? "secondary" : "primary"}
                        block
                        motif={CATEGORY_MOTIF[quest.category]}
                      >
                        {linkLabel(view.status)}
                      </ButtonLink>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          <section className="panel-soft p-4 text-xs leading-relaxed text-[var(--ink-subtle)] sm:p-5">
            Catatan jujur: misi praktik adalah laporanmu sendiri dan tidak diverifikasi aplikasi. Misi berlabel
            tersembunyi tetap bisa dibuka halamannya, tetapi isinya baru muncul setelah ditemukan di dalam cerita —
            supaya petunjuknya tidak jadi bocoran.
          </section>
        </>
      )}
    </div>
  );
}
