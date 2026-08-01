"use client";

import {
  useCallback,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface DisclosureProps {
  /** Uncontrolled default. */
  defaultOpen?: boolean;
  /** Controlled - used by Faq, where exactly one row is open at a time. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render prop so every consumer gets identical a11y wiring with its own visual. */
  children: (state: {
    open: boolean;
    toggle: () => void;
    triggerProps: ButtonHTMLAttributes<HTMLButtonElement>;
    panelProps: HTMLAttributes<HTMLDivElement>;
  }) => ReactNode;
}

/**
 * The one disclosure implementation - accordion rows, nav dropdowns, the mobile
 * sheet and the help sidebar all wire through this so the a11y contract is
 * written once.
 *
 * The trigger is ALWAYS a `<button>`, never an `<a>`. It is not a navigation;
 * it has no href, it does not belong in the link list, and a screen-reader user
 * tabbing the links should not meet it there. A native button already fires on
 * click, Enter and Space, so no key handling is re-implemented; the handler
 * only adds Escape-to-close, which the native element does not give you.
 *
 * Panel height animates via `grid-template-rows: 0fr -> 1fr` at the CONSUMER
 * (components.md S10.5), never `max-height` guesswork - a guessed max-height
 * either clips a long answer or stalls a short one.
 *
 * NOTE on `panelProps.hidden`: the props contract in components.md S4.11 lists
 * `hidden` among the panel props, and it is supplied here as written. It is
 * mutually exclusive with the grid-rows transition, because `display: none`
 * cannot animate. A consumer that needs the animation should spread
 * `panelProps` and then override `hidden={undefined}`, driving visibility from
 * the `open` flag instead. Raised in this agent's open_questions.
 */
export function Disclosure({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
}: DisclosureProps) {
  const reactId = useId();
  const triggerId = `${reactId}-trigger`;
  const panelId = `${reactId}-panel`;

  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Escape" && open) {
        event.stopPropagation();
        setOpen(false);
      }
    },
    [open, setOpen],
  );

  return (
    <>
      {children({
        open,
        toggle,
        triggerProps: {
          id: triggerId,
          "aria-expanded": open,
          "aria-controls": panelId,
          onClick: toggle,
          onKeyDown,
          type: "button",
        },
        panelProps: {
          id: panelId,
          role: "region",
          "aria-labelledby": triggerId,
          hidden: !open,
        },
      })}
    </>
  );
}
