"use client";

import { useId } from "react";
import type { SpeakerId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Motif, type MotifKey } from "./Motif";

/**
 * Potret tokoh. Tokoh manusia digambar sebagai ilustrasi datar sederhana
 * (bukan potret realistis) supaya jelas bahwa mereka tokoh fiksi.
 */

interface AvatarProps {
  speaker: SpeakerId | "player";
  className?: string;
  size?: "sm" | "md" | "lg";
  muted?: boolean;
}

const SIZE = { sm: "h-9 w-9", md: "h-12 w-12", lg: "h-16 w-16" } as const;

export function SpeakerAvatar({ speaker, className, size = "md", muted = false }: AvatarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clip = `avatar-clip-${uid}`;
  const dim = muted ? "opacity-45 grayscale" : "";

  const content = () => {
    switch (speaker) {
      case "ndari":
        return (
          <>
            <rect width="100" height="100" fill="#1E3A5F" />
            <circle cx="50" cy="54" r="26" fill="#E7B08A" />
            <path d="M24 46c2-16 14-24 26-24s24 8 26 24c-6-6-14-9-26-9s-20 3-26 9Z" fill="#2F2018" />
            <circle cx="20" cy="50" r="7" fill="#2F2018" />
            <circle cx="80" cy="50" r="7" fill="#2F2018" />
            <circle cx="41" cy="54" r="3" fill="#241A10" />
            <circle cx="59" cy="54" r="3" fill="#241A10" />
            <path d="M42 66q8 7 16 0" stroke="#A05A3A" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M20 100c4-16 16-22 30-22s26 6 30 22Z" fill="#7DD3FC" opacity="0.5" />
          </>
        );
      case "wagiman":
        return (
          <>
            <rect width="100" height="100" fill="#2A2550" />
            <path d="M20 100c4-18 16-24 30-24s26 6 30 24Z" fill="#3B3568" />
            <circle cx="50" cy="56" r="25" fill="#DDA377" />
            <path d="M25 44h50c0-12-10-18-25-18S25 32 25 44Z" fill="#1F1A33" />
            <path d="M25 44h50v6H25Z" fill="#151129" />
            <path d="M34 66q16 10 32 0" stroke="#3A2A1C" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M30 60q6-3 12 0M58 60q6-3 12 0" stroke="#241A10" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <circle cx="43" cy="55" r="2.6" fill="#241A10" />
            <circle cx="57" cy="55" r="2.6" fill="#241A10" />
            <path d="M33 46q5-3 10-1M57 45q5-2 10 1" stroke="#4A4038" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        );
      case "rukmini":
        return (
          <>
            <rect width="100" height="100" fill="#123B36" />
            <path d="M20 100c4-17 16-23 30-23s26 6 30 23Z" fill="#0F5F51" />
            <path d="M28 74c4-14 12-20 22-20s18 6 22 20c-6 6-14 9-22 9s-16-3-22-9Z" fill="#6EE7B7" opacity="0.35" />
            <circle cx="50" cy="56" r="24" fill="#E2A97A" />
            <path d="M26 46c1-14 11-20 24-20s23 6 24 20c-3-8-11-12-24-12s-21 4-24 12Z" fill="#241A10" />
            <circle cx="50" cy="26" r="9" fill="#241A10" />
            <circle cx="43" cy="55" r="2.6" fill="#241A10" />
            <circle cx="57" cy="55" r="2.6" fill="#241A10" />
            <path d="M41 66q9 7 18 0" stroke="#A05A3A" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M33 46q5-3 10 1M57 47q5-4 10-1" stroke="#241A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        );
      case "kakek":
        return (
          <>
            <rect width="100" height="100" fill="#3A2F1A" />
            <path d="M20 100c4-18 16-24 30-24s26 6 30 24Z" fill="#5C4A26" />
            <circle cx="50" cy="56" r="24" fill="#D9A277" />
            <path d="M26 46c2-14 12-20 24-20s22 6 24 20c-6-6-14-9-24-9s-18 3-24 9Z" fill="#C9C4B8" />
            <circle cx="43" cy="55" r="7" fill="none" stroke="#8B7A3F" strokeWidth="2.2" />
            <circle cx="57" cy="55" r="7" fill="none" stroke="#8B7A3F" strokeWidth="2.2" />
            <path d="M50 55h0" stroke="#8B7A3F" strokeWidth="2" />
            <circle cx="43" cy="55" r="2.4" fill="#241A10" />
            <circle cx="57" cy="55" r="2.4" fill="#241A10" />
            <path d="M38 70q12 8 24 0" stroke="#B9B4A8" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </>
        );
      case "tara":
        return (
          <>
            <rect width="100" height="100" fill="#2C1F0B" />
            <circle cx="50" cy="62" r="26" fill="#E9B949" />
            <path d="M50 22l6 12 12 2-9 9 2 12-11-6-11 6 2-12-9-9 12-2Z" fill="#F8E3A6" />
            <circle cx="41" cy="58" r="4.4" fill="#FFFDF6" />
            <circle cx="59" cy="58" r="4.4" fill="#FFFDF6" />
            <circle cx="41.6" cy="58.4" r="2.2" fill="#3A2413" />
            <circle cx="59.6" cy="58.4" r="2.2" fill="#3A2413" />
            <path d="M50 66l6 6-6 6-6-6Z" fill="#D98F1F" />
          </>
        );
      case "player":
        return (
          <>
            <rect width="100" height="100" fill="#242A54" />
            <circle cx="50" cy="52" r="20" fill="none" stroke="#F4EADB" strokeWidth="3" opacity="0.7" />
            <path d="M36 74h28" stroke="#F4EADB" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            <path d="M50 32v-8M30 52h-8M78 52h-8" stroke="#F4EADB" strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
          </>
        );
      default:
        return (
          <>
            <rect width="100" height="100" fill="#20264B" />
            <circle cx="50" cy="52" r="18" fill="none" stroke="#C6C0DD" strokeWidth="2.6" />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={cn(SIZE[size], "shrink-0 rounded-full", dim, className)} aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>{content()}</g>
      <circle cx="50" cy="50" r="48.5" fill="none" stroke="var(--line-strong)" strokeWidth="2" />
    </svg>
  );
}

/** Pilihan identitas pemain (bukan data pribadi). */
export const PLAYER_AVATARS: { id: string; label: string; motif: MotifKey }[] = [
  { id: "feather", label: "Bulu", motif: "leaf" },
  { id: "lamp", label: "Lampu", motif: "lamp" },
  { id: "star", label: "Bintang", motif: "star" },
  { id: "gong", label: "Gong", motif: "gong" },
  { id: "thread", label: "Benang", motif: "thread" },
  { id: "book", label: "Buku", motif: "book" },
];

export function PlayerAvatar({ id, className }: { id: string; className?: string }) {
  const motif = PLAYER_AVATARS.find((a) => a.id === id)?.motif ?? "star";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface-2)] text-[var(--gold)]",
        "h-12 w-12",
        className,
      )}
      aria-hidden="true"
    >
      <Motif motif={motif} className="h-6 w-6" />
    </span>
  );
}
