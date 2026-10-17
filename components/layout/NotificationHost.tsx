"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Motif, type MotifKey } from "@/components/brand/Motif";
import { useGameStore } from "@/lib/store";
import { getAchievement, getCollectionItem, getJournalEntry, getQuest } from "@/data";
import { playSfx } from "@/lib/audio";
import type { AppNotification } from "@/lib/types";

const KIND_META: Record<AppNotification["kind"], { motif: MotifKey; label: string; href?: string }> = {
  quest: { motif: "star", label: "Misi baru", href: "/quests" },
  collection: { motif: "book", label: "Koleksi baru", href: "/collection" },
  achievement: { motif: "gong", label: "Pencapaian", href: "/profile" },
  journal: { motif: "thread", label: "Jurnal Tara", href: "/journal" },
  level: { motif: "spiral", label: "Level naik", href: "/profile" },
  xp: { motif: "star", label: "Pengalaman", href: "/profile" },
  info: { motif: "leaf", label: "Info" },
};

/** Mengubah id data menjadi judul yang bisa dibaca pemain. */
export function notificationTitle(notification: AppNotification): { title: string; body?: string } {
  const id = notification.body;
  if (!id) return { title: notification.title };
  switch (notification.kind) {
    case "quest": {
      const quest = getQuest(id);
      return {
        title: quest ? `Misi baru: ${quest.title}` : notification.title,
        body: quest?.goal,
      };
    }
    case "collection": {
      const item = getCollectionItem(id);
      return {
        title: item ? `Catatan baru: ${item.title}` : notification.title,
        body: item?.subtitle,
      };
    }
    case "achievement": {
      const achievement = getAchievement(id);
      return {
        title: achievement ? `Pencapaian: ${achievement.title}` : notification.title,
        body: achievement?.description,
      };
    }
    case "journal": {
      const entry = getJournalEntry(id);
      return { title: entry ? `Catatan Tara: ${entry.title}` : notification.title };
    }
    default:
      return { title: notification.title, body: notification.body };
  }
}

export function NotificationHost() {
  const notifications = useGameStore((s) => s.notifications);
  const dismiss = useGameStore((s) => s.dismissNotification);
  const lastSoundRef = useRef(0);

  useEffect(() => {
    const newest = notifications[notifications.length - 1];
    if (!newest) return;
    if (newest.createdAt <= lastSoundRef.current) return;
    lastSoundRef.current = newest.createdAt;
    if (newest.kind === "achievement") playSfx("achievement");
    else if (newest.kind === "quest" || newest.kind === "collection" || newest.kind === "level") playSfx("unlock");
  }, [notifications]);

  useEffect(() => {
    if (notifications.length === 0) return;
    const oldest = notifications[0];
    const timer = window.setTimeout(() => dismiss(oldest.id), 6500);
    return () => window.clearTimeout(timer);
  }, [notifications, dismiss]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-3 sm:items-end sm:px-5"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {notifications.map((notification) => {
          const meta = KIND_META[notification.kind];
          const { title, body } = notificationTitle(notification);
          const content = (
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--gold)_45%,transparent)] bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] text-[var(--gold)]">
                <Motif motif={meta.motif} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[0.68rem] font-semibold tracking-[0.14em] text-[var(--ink-subtle)] uppercase">
                  {meta.label}
                </div>
                <div className="mt-0.5 text-sm font-medium text-[var(--ink)]">{title}</div>
                {body ? <div className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--ink-muted)]">{body}</div> : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(notification.id)}
                className="focus-ring ml-1 shrink-0 rounded-md px-1.5 text-xs text-[var(--ink-subtle)] hover:text-[var(--ink)]"
                aria-label="Tutup notifikasi"
              >
                ×
              </button>
            </div>
          );
          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass animate-quest-pop pointer-events-auto w-full max-w-sm rounded-[var(--radius-md)] p-3 shadow-[var(--shadow-panel)]"
            >
              {meta.href ? (
                <Link href={meta.href} onClick={() => dismiss(notification.id)} className="focus-ring block rounded-[var(--radius-sm)]">
                  {content}
                </Link>
              ) : (
                content
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
