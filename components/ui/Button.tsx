"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { playSfx } from "@/lib/audio";
import { Motif, type MotifKey } from "@/components/brand/Motif";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "quiet";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  motif?: MotifKey;
  icon?: ReactNode;
  block?: boolean;
  silent?: boolean;
  className?: string;
  children?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[var(--gold)] text-[#24180A] hover:bg-[var(--gold-soft)] active:bg-[var(--gold-deep)] shadow-[0_14px_34px_-16px_rgba(233,185,73,0.7)] font-semibold",
  secondary:
    "bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line-strong)] hover:border-[var(--gold)] hover:text-[var(--gold-soft)]",
  ghost: "bg-transparent text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
  danger:
    "bg-transparent border border-[var(--danger)] text-[var(--danger)] hover:bg-[color-mix(in_oklab,var(--danger)_16%,transparent)]",
  quiet:
    "bg-[color-mix(in_oklab,var(--surface-2)_70%,transparent)] text-[var(--ink-muted)] hover:text-[var(--ink)] border border-transparent hover:border-[var(--line)]",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)] gap-1.5",
  md: "px-4 py-2.5 text-[0.95rem] rounded-[var(--radius-sm)] gap-2",
  lg: "px-6 py-3.5 text-base rounded-[var(--radius-md)] gap-2.5",
};

function classes({ variant = "secondary", size = "md", block, className }: BaseProps) {
  return cn(
    "inline-flex items-center justify-center transition-all duration-200 focus-ring",
    "disabled:cursor-not-allowed disabled:opacity-45",
    "hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]",
    VARIANTS[variant],
    SIZES[size],
    block && "w-full",
    className,
  );
}

function Inner({ motif, icon, children, size = "md" }: BaseProps) {
  return (
    <>
      {motif ? <Motif motif={motif} className={size === "sm" ? "h-4 w-4" : "h-[1.15rem] w-[1.15rem]"} /> : icon}
      {children}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, BaseProps & ButtonHTMLAttributes<HTMLButtonElement>>(
  function Button({ variant, size, motif, icon, block, silent, className, children, onClick, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={classes({ variant, size, block, className })}
        onClick={(event) => {
          if (!silent) playSfx("click");
          onClick?.(event);
        }}
        {...rest}
      >
        <Inner motif={motif} icon={icon} size={size} block={block}>
          {children}
        </Inner>
      </button>
    );
  },
);

interface ButtonLinkProps extends BaseProps {
  href: string;
  prefetch?: boolean;
  "aria-label"?: string;
}

export function ButtonLink({ variant, size, motif, icon, block, className, children, href, ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} className={classes({ variant, size, block, className })} {...rest}>
      <Inner motif={motif} icon={icon} size={size} block={block}>
        {children}
      </Inner>
    </Link>
  );
}
