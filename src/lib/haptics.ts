/**
 * Little taps you can feel on the admin page (Nov 9, 2026 — Trey).
 *
 * Phones don't let websites use the real vibration motor freely:
 *  - Android (Chrome, Samsung Internet): navigator.vibrate() — works.
 *  - iPhone: Safari has no vibrate(), but since iOS 18 a checkbox drawn as a
 *    switch (<input type="checkbox" switch>) gives the system "tick" when it is
 *    toggled. We keep one hidden switch on the page and toggle it. This only
 *    works straight from a tap, so the "saved" / "didn't save" patterns that
 *    come after a network wait may be silent on iPhone.
 *  - Computers: nothing happens (no motor), and nothing breaks.
 * Every call is wrapped so a haptic can never break a button.
 */
export type HapticKind = "tap" | "success" | "error";

const PATTERN: Record<HapticKind, number | number[]> = {
  tap: 10,
  success: [12, 70, 18],
  error: [40, 60, 40, 60, 40],
};

let label: HTMLLabelElement | null = null;

function isIOS(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

function iosTick() {
  if (!label || !label.isConnected) {
    const id = "summit-haptic-switch";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.setAttribute("switch", "");
    input.setAttribute("aria-hidden", "true");
    input.tabIndex = -1;
    input.style.display = "none";
    label = document.createElement("label");
    label.htmlFor = id;
    label.setAttribute("aria-hidden", "true");
    label.style.display = "none";
    label.appendChild(input);
    document.body.appendChild(label);
  }
  label.click();
}

export function haptic(kind: HapticKind = "tap") {
  if (typeof window === "undefined") return;
  try {
    if (!isIOS() && typeof navigator.vibrate === "function") {
      navigator.vibrate(PATTERN[kind]);
      return;
    }
    if (!isIOS()) return;
    // iPhone taps already tick through the invisible switch on each button
    // (components/admin/Tick.tsx), so only the saved / didn't-save patterns run here.
    if (kind === "tap") return;
    iosTick();
    if (kind === "success") setTimeout(iosTick, 110);
    if (kind === "error") { setTimeout(iosTick, 120); setTimeout(iosTick, 240); }
  } catch {
    /* never let a haptic break the page */
  }
}
