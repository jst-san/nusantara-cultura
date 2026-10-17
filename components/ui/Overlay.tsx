"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { useMotionEnabled } from "@/lib/hooks";

/** Dialog tengah layar dengan penanganan fokus & tombol Escape. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const motionOn = useMotionEnabled();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
    node?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Tab" && node) {
        const focusables = node.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionOn ? 0.2 : 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "panel relative z-10 w-full overflow-hidden rounded-b-none rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-lg)]",
              widths[size],
            )}
            initial={motionOn ? { opacity: 0, y: 24, scale: 0.98 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionOn ? { opacity: 0, y: 18, scale: 0.98 } : { opacity: 0 }}
            transition={{ duration: motionOn ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hairline-top px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg text-[var(--ink)]">{title}</h2>
                  {description ? <p className="mt-1 text-sm text-[var(--ink-muted)]">{description}</p> : null}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} aria-label="Tutup dialog" silent className="-mr-2 -mt-1">
                  Tutup
                </Button>
              </div>
            </div>
            {children ? <div className="max-h-[60vh] overflow-y-auto px-5 py-4 sm:px-6 scroll-thin">{children}</div> : null}
            {footer ? <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--line)] px-5 py-4 sm:px-6">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Panel samping (desktop) / lembar bawah (mobile).
 * Dipakai untuk detail koleksi, jurnal cerita, dan informasi tambahan.
 */
export function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const motionOn = useMotionEnabled();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionOn ? 0.2 : 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "panel relative z-10 flex h-full w-full flex-col overflow-hidden rounded-none border-y-0 border-r-0",
              "sm:max-w-xl",
            )}
            initial={motionOn ? { x: "6%", opacity: 0 } : { opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={motionOn ? { x: "6%", opacity: 0 } : { opacity: 0 }}
            transition={{ duration: motionOn ? 0.3 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hairline-top flex items-start justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
                <h2 className="font-display mt-1 truncate text-lg text-[var(--ink)]">{title}</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Tutup panel" silent>
                Tutup
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6 scroll-thin">{children}</div>
            {footer ? <div className="border-t border-[var(--line)] px-5 py-4">{footer}</div> : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
