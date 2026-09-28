/**
 * Google Sheets integration via Apps Script web app.
 *
 * No Google Cloud project needed — just a simple deployed Apps Script
 * that reads/writes to the Bookings sheet.
 *
 * Env vars:
 *   GOOGLE_SCRIPT_URL  — the deployed web app URL
 *   GOOGLE_SCRIPT_SECRET — the shared secret token
 */

export type SheetBooking = {
  bookingId: string;
  date: string;
  status: "CONFIRMED" | "MANUAL_BLOCK" | "CANCELLED" | "PENDING";
  tourType: "private" | "small-group" | "BLOCK";
  vehicle: "mercedes" | "van" | "ALL";
  partySize: number;
  name: string;
  email: string;
  phone: string;
  hotel: string;
  comments: string;
  concierge: string;
  stripeSessionId: string;
  total: number;
  createdAt: string;
};

function getScriptUrl(): string {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) throw new Error("Missing GOOGLE_SCRIPT_URL env var");
  return url;
}

function getSecret(): string {
  const s = process.env.GOOGLE_SCRIPT_SECRET;
  if (!s) throw new Error("Missing GOOGLE_SCRIPT_SECRET env var");
  return s;
}

/**
 * Google Apps Script web apps return a 302 redirect to
 * script.googleusercontent.com which serves the actual JSON.
 *
 * Node.js fetch follows redirects by default but can sometimes
 * fail on the redirected response (CORS, cookies, etc).
 *
 * This helper:
 *  1. Follows redirects explicitly (redirect: "follow")
 *  2. Retries once if the first attempt fails
 *  3. Validates we actually got JSON back (not an HTML error page)
 */
async function robustFetch(
  url: string,
  opts: RequestInit,
  label: string
): Promise<any> {
  const maxRetries = 2;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        ...opts,
        redirect: "follow",
        cache: "no-store",
      });

      // Google Apps Script sometimes returns 200 with an HTML error page
      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      if (!res.ok) {
        console.error(
          `[sheets] ${label} attempt ${attempt} HTTP ${res.status}: ${text.slice(0, 200)}`
        );
        if (attempt < maxRetries) continue;
        throw new Error(`Apps Script ${label} failed: HTTP ${res.status}`);
      }

      // Make sure it's actually JSON, not an HTML login/error page
      if (
        !contentType.includes("application/json") &&
        !text.trim().startsWith("{") &&
        !text.trim().startsWith("[")
      ) {
        console.error(
          `[sheets] ${label} attempt ${attempt} got non-JSON (${contentType}): ${text.slice(0, 200)}`
        );
        if (attempt < maxRetries) continue;
        throw new Error(
          `Apps Script ${label} returned non-JSON response`
        );
      }

      const data = JSON.parse(text);

      // Apps Script can return { error: "..." } with a 200 status
      if (data.error) {
        console.error(`[sheets] ${label} returned error: ${data.error}`);
        if (attempt < maxRetries) continue;
        throw new Error(`Apps Script error: ${data.error}`);
      }

      return data;
    } catch (err: any) {
      console.error(
        `[sheets] ${label} attempt ${attempt} exception: ${err.message}`
      );
      if (attempt < maxRetries) {
        // Brief pause before retry
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      throw err;
    }
  }
}

async function scriptGet(params: Record<string, string>): Promise<any> {
  const url = new URL(getScriptUrl());
  url.searchParams.set("secret", getSecret());
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return robustFetch(
    url.toString(),
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
    `GET:${params.action || "unknown"}`
  );
}

async function scriptPost(body: Record<string, any>): Promise<any> {
  return robustFetch(
    getScriptUrl(),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, secret: getSecret() }),
    },
    `POST:${body.action || "unknown"}`
  );
}

function normalizeBooking(raw: any): SheetBooking {
  return {
    bookingId: raw.bookingId || "",
    date: raw.date || "",
    status: (raw.status || "CONFIRMED") as SheetBooking["status"],
    tourType: (raw.tourType || "small-group") as SheetBooking["tourType"],
    vehicle: (raw.vehicle || "van") as SheetBooking["vehicle"],
    partySize: Number(raw.partySize) || 0,
    name: raw.name || "",
    email: raw.email || "",
    phone: raw.phone || "",
    hotel: raw.hotel || "",
    comments: raw.comments || "",
    concierge: raw.concierge || "",
    stripeSessionId: raw.stripeSessionId || "",
    total: Number(raw.total) || 0,
    createdAt: raw.createdAt || "",
  };
}

export async function getAllBookings(): Promise<SheetBooking[]> {
  const data = await scriptGet({ action: "getAll" });
  return (data.bookings || []).map(normalizeBooking);
}

export async function getBookingsForDate(
  date: string
): Promise<SheetBooking[]> {
  const data = await scriptGet({ action: "getByDate", date });
  return (data.bookings || [])
    .map(normalizeBooking)
    .filter((b: SheetBooking) => b.status !== "CANCELLED");
}

export async function getBookingsForMonth(
  year: number,
  month: number
): Promise<SheetBooking[]> {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const data = await scriptGet({ action: "getByMonth", prefix });
  return (data.bookings || [])
    .map(normalizeBooking)
    .filter((b: SheetBooking) => b.status !== "CANCELLED");
}

export async function appendBooking(b: SheetBooking): Promise<void> {
  const result = await scriptPost({ action: "addBooking", booking: b });
  if (result.error) {
    throw new Error(`Failed to append booking: ${result.error}`);
  }
}
