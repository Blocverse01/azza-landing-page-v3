import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Icon } from "./Icon";
import type { IconName } from "./Icon/types";

/**
 * Colour roles map 1:1 onto the `action.*` token families in tokens.json.
 * There is no way to pass a colour - that is the point.
 */
const VARIANT_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-action-primary text-action-primary-fg hoverable:bg-action-primary-hover focus-visible:bg-action-primary-hover active:bg-action-primary-active",
  brand:
    "bg-action-brand text-action-brand-fg hoverable:bg-action-brand-hover focus-visible:bg-action-brand-hover active:bg-action-brand-active",
  soft: "bg-action-soft text-action-soft-fg hoverable:bg-action-soft-hover focus-visible:bg-action-soft-hover active:bg-action-soft-active active:text-action-soft-fg-active",
  quiet:
    "bg-action-quiet text-action-quiet-fg hoverable:bg-action-quiet-hover focus-visible:bg-action-quiet-hover active:bg-action-quiet-active",
  chat: "bg-action-chat text-action-chat-fg hoverable:bg-action-chat-hover focus-visible:bg-action-chat-hover active:bg-action-chat-active",
  ghost:
    "bg-action-ghost text-action-ghost-fg hoverable:bg-action-ghost-hover focus-visible:bg-action-ghost-hover active:bg-action-ghost-active",
};

/*
 * Height + padding + type token.
 *   sm -> h-11 px-4 text-xs-btn  (QR badge CTA, 14px Semi Bold)
 *   md -> h-12 px-5 text-sm-btn  (nav CTA 144x43 -> 44, hero CTA 182x51)
 *   lg -> h-14 px-6 text-md      (253x56 "Get Started", 314x56 "Generate ...")
 *
 * The floor is 44x44 at every breakpoint (responsive.md S6.1); the nav CTA's
 * designed 43px height is padded to 44 and that is not a fidelity defect.
 */
const SIZE_CLASS: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-11 px-4 text-xs-btn",
  md: "h-12 px-5 text-sm-btn",
  lg: "h-14 px-6 text-md",
};

const DISABLED_CLASS =
  "disabled:bg-action-primary-disabled disabled:text-action-primary-fg-disabled disabled:pointer-events-none aria-disabled:bg-action-primary-disabled aria-disabled:text-action-primary-fg-disabled aria-disabled:pointer-events-none";

export interface ButtonProps {
  /** Colour role. Maps 1:1 onto the action.* token families in tokens.json. */
  variant?: "primary" | "brand" | "soft" | "quiet" | "chat" | "ghost";
  /** Height + padding + type token. */
  size?: "sm" | "md" | "lg";
  /** Renders <a> when href is present, <button> otherwise. Never both. */
  href?: string;
  type?: "button" | "submit";
  /** Trailing glyph. arrow-right on 412:1290/1224/1228/1231/1624. gap is 8px. */
  iconRight?: IconName;
  iconLeft?: IconName;
  /** Stretch to the container. Required at <sm on every CTA per responsive.md. */
  fullWidth?: boolean;
  disabled?: boolean;
  /** Required when the label is not descriptive on its own. */
  "aria-label"?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Radius is always `rounded-pill` (radius.pill, 100px - 33 nodes carry it).
 *
 * Motion, per components.md S10.6: hover recolours the background only, press
 * adds `translateY(1px)` and the active colour, and the release rides
 * `--ease-spring`. That spring is one of exactly two sanctioned uses in the
 * whole codebase (the other is the card-deck promotion). There is no
 * `transform: scale()` on hover anywhere, ever.
 *
 * Every hover style has a `:focus-visible` twin - no interactive state is
 * communicated by hover alone.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  iconRight,
  iconLeft,
  fullWidth = false,
  disabled = false,
  "aria-label": ariaLabel,
  className,
  children,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-pill",
    "min-h-11 select-none no-underline",
    "transition-[background-color,color,transform] duration-(--motion-fast) ease-spring",
    "active:translate-y-px active:duration-(--motion-instant) active:ease-out",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth ? "w-full" : undefined,
    DISABLED_CLASS,
    className,
  );

  const inner = (
    <>
      {iconLeft ? <Icon name={iconLeft} size="sm" /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size="sm" /> : null}
    </>
  );

  if (href) {
    const internal = href.startsWith("/") || href.startsWith("#");

    if (internal) {
      return (
        <Link
          href={href}
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          className={classes}
        >
          {inner}
        </Link>
      );
    }

    return (
      <a
        href={href}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {inner}
    </button>
  );
}
