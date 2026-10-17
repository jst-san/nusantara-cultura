"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Motif, type MotifKey } from "@/components/brand/Motif";
import { ButtonLink } from "@/components/ui/Button";
import { Chip, EmptyState, ProgressBar, ReliabilityBadge } from "@/components/ui/Bits";
import { FilterPills } from "@/components/ui/Controls";
import { Sheet } from "@/components/ui/Overlay";
import {
  COLLECTION_CATEGORY_META,
  COLLECTION_ITEMS,
  collectionByCategory,
  getChapter,
  getCollectionItem,
  getEpisode,
} from "@/data";
import { useGameStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import type { CollectionCategory, CollectionItem, Reliability, SaveState } from "@/lib/types";

type CollectionFilter = CollectionCategory | "all";

const RELIABILITY_ORDER: Reliability[] = ["documented", "needs-verification", "fiction", "device-borrowed"];

const RELIABILITY_INFO: Record<Reliability, { label: string; note: string }> = {
  documented: {
    label: "Terdokumentasi umum",
    note: "Pengetahuan umum yang tercatat di banyak sumber. Rinciannya tetap bisa berbeda antar daerah.",
  },
  "needs-verification": {
    label: "Perlu diverifikasi",
    note: "Catatan yang belum diperiksa silang. Jangan dianggap final sebelum kamu verifikasi sendiri.",
  },
  fiction: {
    label: "Fiksi cerita",
    note: "Bagian dari cerita fiktif prototipe ini — bukan klaim budaya.",
  },
  "device-borrowed": {
    label: "Bantuan perangkat",
    note: "Dibantu perangkat, misalnya suara bacaan — bukan rekaman atau penutur asli.",
  },
};

function categoryLabel(category: CollectionCategory): string {
  return COLLECTION_CATEGORY_META.find((meta) => meta.id === category)?.label ?? category;
}

function categoryMotif(category: CollectionCategory): MotifKey {
  return (COLLECTION_CATEGORY_META.find((meta) => meta.id === category)?.motif as MotifKey) ?? "kawung";
}

export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="panel p-6 text-sm text-[var(--ink-subtle)]" role="status">
          Memuat koleksi…
        </div>
      }
    >
      <CollectionView />
    </Suspense>
  );
}

function CollectionView() {
  const save = useGameStore((s) => s);
  const searchParams = useSearchParams();
  const queryItem = searchParams.get("item");

  const [filter, setFilter] = useState<CollectionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Tautan langsung /collection?item=<id> (mis. dari rekomendasi beranda)
  // membuka panel detail tanpa efek samping: nilai ini dihitung saat render.
  // Item yang tertutup ditandai, supaya tidak langsung terbuka lagi selama
  // alamatnya masih sama.
  const [dismissedQueryItem, setDismissedQueryItem] = useState<string | null>(null);

  const querySelectedId =
    queryItem && queryItem !== dismissedQueryItem && save.collection[queryItem]?.found ? queryItem : null;
  const activeSelectedId = selectedId ?? querySelectedId;

  const closeSheet = () => {
    setSelectedId(null);
    if (queryItem) setDismissedQueryItem(queryItem);
  };

  const foundCount = COLLECTION_ITEMS.filter((item) => save.collection[item.id]?.found).length;

  const categoryCounts = Object.fromEntries(
    COLLECTION_CATEGORY_META.map((meta) => [
      meta.id,
      collectionByCategory(meta.id).filter((item) => save.collection[item.id]?.found).length,
    ]),
  ) as Record<CollectionCategory, number>;

  const filterCounts: Record<CollectionFilter, number> = { all: foundCount, ...categoryCounts };

  const reliabilityCounts = RELIABILITY_ORDER.reduce<Record<Reliability, number>>(
    (acc, reliability) => {
      acc[reliability] = COLLECTION_ITEMS.filter(
        (item) => save.collection[item.id]?.found && item.reliability === reliability,
      ).length;
      return acc;
    },
    { documented: 0, "needs-verification": 0, fiction: 0, "device-borrowed": 0 },
  );

  const items = filter === "all" ? COLLECTION_ITEMS : collectionByCategory(filter);
  const rawSelected = activeSelectedId ? getCollectionItem(activeSelectedId) : undefined;
  const selected = rawSelected && save.collection[rawSelected.id]?.found ? rawSelected : undefined;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Koleksi</div>
          <h1 className="display-title mt-1 text-2xl text-[var(--ink)] sm:text-3xl">Catatan perjalanan Tara</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
            Semua yang Tara temukan tersimpan di sini: kosakata, cerita rakyat, permainan, kerajinan, seni
            pertunjukan, serta kenangan dari cerita. Setiap catatan diberi label keandalan supaya jelas mana yang
            terdokumentasi umum, mana yang masih perlu diverifikasi, dan mana yang bagian dari fiksi.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip tone="gold" motif="kawung">
            {foundCount}/{COLLECTION_ITEMS.length} ditemukan
          </Chip>
          {reliabilityCounts["needs-verification"] > 0 ? (
            <Chip tone="gold" motif="eye">
              {reliabilityCounts["needs-verification"]} perlu diverifikasi
            </Chip>
          ) : null}
        </div>
      </header>

      <section aria-label="Kemajuan koleksi" className="panel-soft p-4 sm:p-5">
        <ProgressBar
          value={foundCount}
          max={COLLECTION_ITEMS.length}
          label={`Koleksi ditemukan: ${foundCount}/${COLLECTION_ITEMS.length}`}
          tone="gold"
          showValue
        />
        <p className="mt-2 text-xs leading-relaxed text-[var(--ink-subtle)]">
          Catatan ditemukan lewat cerita, adegan pengamatan, dan misi. Tidak ada yang bisa dibeli atau dipercepat — isi
          koleksi bertambah seiring perjalananmu.
        </p>
      </section>

      {/* ---------- Legenda label keandalan ---------- */}
      <section aria-label="Arti label keandalan" className="space-y-3">
        <h2 className="font-display flex items-center gap-2 text-xl text-[var(--ink)]">
          <Motif motif="book" className="h-5 w-5 text-[var(--gold)]" />
          Arti label catatan
        </h2>
        <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {RELIABILITY_ORDER.map((reliability) => {
            const info = RELIABILITY_INFO[reliability];
            return (
              <li key={reliability} className="panel-soft p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <ReliabilityBadge reliability={reliability} />
                  <span className="text-xs tabular-nums text-[var(--ink-subtle)]">
                    {reliabilityCounts[reliability]} catatan
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--ink-subtle)]">{info.note}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {foundCount === 0 ? (
        <EmptyState
          motif="kawung"
          title="Koleksimu masih kosong"
          body="Catatan pertama muncul saat Tara menemukan sesuatu di dalam cerita: kata baru dari warga, istilah pertunjukan, atau kenangan dari malam di pendopo. Mulai dari Bab 1, lalu kembali ke sini."
          action={
            <ButtonLink href="/journey" variant="primary" motif="spiral">
              Buka peta perjalanan
            </ButtonLink>
          }
        />
      ) : (
        <>
          <section aria-label="Saring koleksi" className="space-y-3">
            <FilterPills<CollectionFilter>
              value={filter}
              onChange={setFilter}
              label="Saring koleksi berdasarkan kategori"
              options={[
                { value: "all", label: "Semua", motif: "kawung" },
                ...COLLECTION_CATEGORY_META.map((meta) => ({
                  value: meta.id,
                  label: meta.label,
                  motif: meta.motif as MotifKey,
                })),
              ]}
              counts={filterCounts}
            />
            <p className="max-w-3xl text-xs leading-relaxed text-[var(--ink-subtle)]">
              {filter === "all"
                ? COLLECTION_CATEGORY_META.find((meta) => meta.id === "notes")?.blurb
                : COLLECTION_CATEGORY_META.find((meta) => meta.id === filter)?.blurb}
            </p>
          </section>

          <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const foundAt = save.collection[item.id]?.foundAt;
              if (save.collection[item.id]?.found) {
                return (
                  <li key={item.id} className="h-full">
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      aria-label={`Buka catatan ${item.title}`}
                      className="panel focus-ring relative h-full w-full overflow-hidden p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--line-strong)] sm:p-5"
                    >
                      <Motif
                        motif={item.motif as MotifKey}
                        className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 text-[var(--gold)] opacity-[0.08]"
                      />
                      <div className="relative">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Chip motif={categoryMotif(item.category)}>{categoryLabel(item.category)}</Chip>
                          <ReliabilityBadge reliability={item.reliability} />
                        </div>
                        <h3 className="font-display mt-2 text-base text-[var(--ink)]">{item.title}</h3>
                        <p className="mt-0.5 text-xs text-[var(--gold-soft)]">{item.subtitle}</p>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                          {item.summary}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--ink-subtle)]">
                          {item.region ? <span>{item.region}</span> : null}
                          {foundAt ? <span>Tersimpan {formatDateTime(foundAt)}</span> : null}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              }
              return (
                <li key={item.id} className="h-full">
                  <div className="panel-soft relative flex h-full flex-col overflow-hidden border-dashed p-4 sm:p-5">
                    <Motif
                      motif={categoryMotif(item.category)}
                      className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 text-[var(--ink-subtle)] opacity-[0.12]"
                    />
                    <div className="relative">
                      <Chip tone="muted" motif={categoryMotif(item.category)}>
                        {categoryLabel(item.category)}
                      </Chip>
                      <div className="mt-3 flex items-center gap-2 text-sm text-[var(--ink-subtle)]">
                        <Motif motif="lamp" className="h-4 w-4" />
                        Belum ditemukan
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-subtle)]">
                        Catatan ini menunggu ditemukan di dalam cerita, misi, atau adegan pengamatan.
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <Sheet
        open={Boolean(selected)}
        onClose={closeSheet}
        title={selected?.title ?? "Catatan koleksi"}
        eyebrow={selected ? categoryLabel(selected.category) : undefined}
      >
        {selected ? (
          <CollectionDetail item={selected} save={save} onSelect={setSelectedId} />
        ) : (
          <p className="text-sm text-[var(--ink-subtle)]">Catatan ini belum kamu temukan.</p>
        )}
      </Sheet>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Isi panel detail
 * ------------------------------------------------------------------ */

function CollectionDetail({
  item,
  save,
  onSelect,
}: {
  item: CollectionItem;
  save: SaveState;
  onSelect: (id: string) => void;
}) {
  const foundAt = save.collection[item.id]?.foundAt;
  const foundChapter = item.foundIn ? getChapter(item.foundIn.chapterId) : undefined;
  const foundEpisode = item.foundIn?.episodeId
    ? getEpisode(item.foundIn.chapterId, item.foundIn.episodeId)
    : undefined;

  const relatedItems = (item.related ?? [])
    .map((id) => getCollectionItem(id))
    .filter((entry): entry is CollectionItem => Boolean(entry));
  const foundRelated = relatedItems.filter((entry) => save.collection[entry.id]?.found);

  const clarifyMet = item.clarify ? Boolean(save.flags[item.clarify.flag]) : false;

  return (
    <div className="space-y-5 pb-2">
      {/* Kepala */}
      <div className="flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--gold)]">
          <Motif motif={item.motif as MotifKey} className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg text-[var(--ink)]">{item.title}</h3>
          <p className="text-sm text-[var(--gold-soft)]">{item.subtitle}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ReliabilityBadge reliability={item.reliability} />
            {item.region ? <Chip motif="wave">{item.region}</Chip> : null}
            {foundAt ? <span className="text-xs text-[var(--ink-subtle)]">Ditemukan {formatDateTime(foundAt)}</span> : null}
          </div>
        </div>
      </div>

      <p className="story-text text-[var(--ink)]">{item.summary}</p>

      <section aria-label="Konteks">
        <h4 className="eyebrow">Konteks</h4>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.context}</p>
      </section>

      <section
        aria-label="Catatan sumber"
        className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3.5"
      >
        <div className="flex items-center gap-2">
          <Motif motif="book" className="h-4 w-4 text-[var(--gold)]" />
          <span className="eyebrow">Catatan sumber</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.sourceNote}</p>
      </section>

      {item.verifyHint ? (
        <section
          aria-label="Cara memeriksa"
          className="rounded-[var(--radius-sm)] border border-[color-mix(in_oklab,var(--gold)_35%,transparent)] bg-[color-mix(in_oklab,var(--gold)_8%,transparent)] p-3.5"
        >
          <div className="flex items-center gap-2">
            <Motif motif="eye" className="h-4 w-4 text-[var(--gold)]" />
            <span className="eyebrow">Cara memeriksa sendiri</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.verifyHint}</p>
        </section>
      ) : null}

      {clarifyMet && item.clarify ? (
        <section
          aria-label="Yang terjelaskan kemudian"
          className="animate-rise rounded-[var(--radius-sm)] border border-[color-mix(in_oklab,var(--success)_45%,transparent)] bg-[color-mix(in_oklab,var(--success)_8%,transparent)] p-3.5"
        >
          <div className="flex items-center gap-2">
            <Motif motif="star" className="h-4 w-4 text-[var(--success)]" />
            <span className="eyebrow">Yang terjelaskan kemudian</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{item.clarify.text}</p>
        </section>
      ) : null}

      {foundChapter ? (
        <section aria-label="Ditemukan di" className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface-2)] p-3.5">
          <span className="eyebrow">Ditemukan di</span>
          <p className="mt-1.5 text-sm text-[var(--ink)]">
            Bab {foundChapter.index} · {foundChapter.title}
            {foundEpisode ? <span className="text-[var(--ink-subtle)]"> — {foundEpisode.title}</span> : null}
          </p>
          <ButtonLink href={`/journey/${foundChapter.id}`} variant="secondary" size="sm" motif="spiral" className="mt-2.5">
            Buka bab
          </ButtonLink>
        </section>
      ) : null}

      {relatedItems.length > 0 ? (
        <section aria-label="Catatan terkait">
          <h4 className="eyebrow">Catatan terkait</h4>
          {foundRelated.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {foundRelated.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onSelect(entry.id)}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--ink-muted)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-soft)]"
                >
                  <Motif motif={entry.motif as MotifKey} className="h-3.5 w-3.5" />
                  {entry.title}
                </button>
              ))}
            </div>
          ) : null}
          {foundRelated.length < relatedItems.length ? (
            <p className="mt-2 text-xs text-[var(--ink-subtle)]">
              {relatedItems.length - foundRelated.length} catatan terkait belum kamu temukan.
            </p>
          ) : null}
        </section>
      ) : null}

      <p className="text-xs leading-relaxed text-[var(--ink-subtle)]">
        Label keandalan menjelaskan status informasi ini. Untuk penjelasan lengkap tiap label, buka halaman Bantuan.
      </p>
    </div>
  );
}
