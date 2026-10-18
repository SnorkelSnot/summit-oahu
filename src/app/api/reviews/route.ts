// Summit O'ahu — Guest Reviews API (mirrors the SnorkelSnot review pipeline)
//
// GET  /api/reviews        → { reviews: [...] } approved guest-submitted reviews
// POST /api/reviews        → submit a review; stored as "pending" in Netlify
//                            Blobs, then Trey is emailed one-click
//                            Approve / Reject links.
//
// REQUIRED ENV VARS (Netlify → Site settings → Environment variables):
//   ADMIN_SECRET     — any long random string; signs the approve/reject links
//   RESEND_API_KEY   — already used for booking emails
//   RESEND_FROM      — e.g. "Summit O'ahu <reviews@summitoahu.com>"
//   ADMIN_EMAIL      — where the moderation email goes

import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import { moderationToken } from "@/lib/reviewToken";

export const dynamic = "force-dynamic";

const MAX = { name: 60, location: 80, text: 1200 };

/* ---------- GET: approved reviews ---------- */

export async function GET() {
  let reviews: unknown[] = [];
  try {
    const store = getStore("reviews");
    const { blobs } = await store.list();
    const all = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: "json" }))
    );
    reviews = all
      .filter((r: any) => r && r.status === "approved")
      .map((r: any) => ({
        name: r.name,
        location: r.location || "",
        guide: r.guide || "",
        rating: r.rating,
        quote: r.text,
        source: (r.approvedAt || r.submittedAt || "").slice(0, 10),
      }))
      .sort((a: any, b: any) => (b.source || "").localeCompare(a.source || ""));
  } catch (err) {
    // Blobs unavailable (e.g. local dev) — return empty; seed reviews still render
    console.error("Blobs read failed:", err);
  }
  return NextResponse.json(
    { reviews },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}

/* ---------- POST: submit a review ---------- */

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot — bots fill the hidden "website" field
  if (body.website) return NextResponse.json({ ok: true });

  const name = privacyName(clean(body.name, MAX.name));
  const location = generalLocation(clean(body.location, MAX.location));
  const text = stripPII(clean(body.text, MAX.text));
  const email = validEmail(clean(body.email, 120));
  const guide = ["Trey", "Nehir"].includes(body.guide) ? body.guide : "";
  const rating = parseInt(body.rating, 10);

  if (!name || !text || !(rating >= 1 && rating <= 5)) {
    return NextResponse.json(
      { error: "Please provide your name, a rating, and your review." },
      { status: 400 }
    );
  }

  const id = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const review = {
    id,
    name,
    location,
    email, // PRIVATE — never shown in the public feed
    guide,
    rating,
    text,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  try {
    const store = getStore("reviews");
    await store.setJSON(id, review);
  } catch (err) {
    console.error("Blobs write failed:", err);
    return NextResponse.json(
      { error: "Could not save your review right now — please try again later." },
      { status: 500 }
    );
  }

  // Notify Trey (never block the guest on notification failure)
  try {
    await notifyEmail(review);
  } catch (err) {
    console.error("Review notification failed:", err);
  }

  return NextResponse.json({ ok: true });
}

/* ---------- helpers (same hygiene as SnorkelSnot) ---------- */

function clean(v: unknown, max: number) {
  return String(v || "").replace(/<[^>]*>/g, "").trim().slice(0, max);
}

// Only ever store/show first name + last initial.
function privacyName(v: string) {
  const parts = v.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
  const first = cap(parts[0]);
  if (parts.length === 1) return first;
  return `${first} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

// Keep location general (no street addresses / ZIPs).
function generalLocation(v: string) {
  let s = v.trim();
  s = s.replace(
    /\b\d{1,6}\s+[A-Za-z0-9.\s]*\b(st|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|way|ct|court|pl|place|hwy|highway)\b\.?/gi,
    ""
  );
  s = s.replace(/\b\d{5}(-\d{4})?\b/g, "");
  return s.replace(/\s{2,}/g, " ").replace(/^[,\s]+|[,\s]+$/g, "").slice(0, 80);
}

// Scrub emails and phone numbers out of free text.
function stripPII(v: string) {
  return v
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[removed]")
    .replace(/(\+?\d[\d\-().\s]{7,}\d)/g, "[removed]")
    .trim();
}

function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : "";
}

async function notifyEmail(review: {
  id: string;
  name: string;
  location: string;
  email: string;
  guide: string;
  rating: number;
  text: string;
}) {
  const { RESEND_API_KEY, RESEND_FROM, ADMIN_EMAIL } = process.env;
  if (!RESEND_API_KEY || !ADMIN_EMAIL) {
    console.warn("Resend not configured — skipping review email");
    return;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://summitoahu.com";
  const approve = `${siteUrl}/api/moderate-review?id=${review.id}&action=approve&token=${moderationToken(review.id, "approve")}`;
  const reject = `${siteUrl}/api/moderate-review?id=${review.id}&action=reject&token=${moderationToken(review.id, "reject")}`;
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM || "Summit O'ahu <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `⭐ New review pending — ${review.rating}/5 from ${review.name}`,
      html: `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#0d1f0d,#1a3a1a);padding:20px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fdfbf7;margin:0;font-size:20px;">⭐ New Review Pending Approval</h1>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e6dfd0;border-top:none;border-radius:0 0 12px 12px;">
          <p style="font-size:20px;color:#df9a20;margin:0 0 4px;">${stars}</p>
          <p style="margin:0 0 12px;color:#374151;"><strong>${esc(review.name)}</strong>${review.location ? " — " + esc(review.location) : ""}${review.guide ? " · Guide: " + esc(review.guide) : ""}</p>
          <blockquote style="margin:0 0 12px;padding:12px 16px;background:#f9fafb;border-left:4px solid #c57818;color:#374151;">${esc(review.text)}</blockquote>
          ${review.email ? `<p style="margin:0 0 20px;color:#6b7280;font-size:13px;">Contact (private): ${esc(review.email)}</p>` : ""}
          <a href="${approve}" style="display:inline-block;background:#2e6b3e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-right:12px;">✅ Approve &amp; Publish</a>
          <a href="${reject}" style="display:inline-block;background:#b3402e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">❌ Reject</a>
          <p style="font-size:12px;color:#9ca3af;margin-top:20px;">One click publishes it to summitoahu.com/testimonials. Review ID: ${review.id}</p>
        </div>
      </div>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
