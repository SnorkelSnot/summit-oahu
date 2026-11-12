"use client";

import { useRef, type ReactNode } from "react";

/**
 * Tick — makes any button or link on /admin give the iPhone's haptic "tick"
 * (Nov 12, 2026).
 *
 * Safari won't let a page buzz the phone, but flipping a real on/off switch
 * (<input type="checkbox" switch>) gives the system tick (System Haptics must
 * be on in Settings). Trey tested six ways of hiding a switch on iOS 26.6 and
 * all ticked, so: an invisible switch lies over the wrapped button. Your tap
 * flips the switch (tick), and the switch passes the tap on to the real button
 * or link underneath, which then does exactly what it always did.
 *
 * On computers (mouse/trackpad) the switch steps aside (pointer-events: none),
 * so clicks and hover go straight to the button. Keyboards and screen readers
 * use the real button; the switch is hidden from them.
 */
export default function Tick({
  children,
  className = "",
  block = false,
}: {
  children: ReactNode;
  className?: string;
  /** true when the wrapped button should fill its space (grid cells, full-width rows) */
  block?: boolean;
}) {
  const wrap = useRef<HTMLSpanElement>(null);

  function forward() {
    const target = wrap.current?.querySelector<HTMLElement>(
      'button, a[href], [role="tab"], [role="menuitem"], input[type="submit"]'
    );
    if (!target) return;
    if ((target as HTMLButtonElement).disabled) return;
    target.click();
  }

  return (
    <span ref={wrap} className={`relative ${block ? "block" : "inline-block"} ${className}`}>
      {children}
      <input
        type="checkbox"
        {...({ switch: "" } as Record<string, string>)}
        aria-hidden="true"
        tabIndex={-1}
        className="tick-overlay"
        onChange={forward}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          margin: 0,
          opacity: 0,
          cursor: "pointer",
          zIndex: 1,
        }}
      />
    </span>
  );
}
