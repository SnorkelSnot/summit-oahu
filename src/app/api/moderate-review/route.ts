// Summit O'ahu — One-Click Review Moderation
// GET /api/moderate-review?id=...&action=approve|reject&token=...
// Token is an HMAC signed with ADMIN_SECRET — only links from the
// notification email will work.

import { NextRequest } from "next/server";
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import { moderationToken } from "@/lib/reviewToken";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  const action = url.searchParams.get("action") || "";
  const token = url.searchParams.get("token") || "";

  if (!process.env.ADMIN_SECRET) {
    return page("Setup needed", "ADMIN_SECRET environment variable is not set in Netlify.", false);
  }
  if (!id || !["approve", "reject"].includes(action)) {
    return page("Invalid link", "This moderation link is malformed.", false);
  }

  const expected = moderationToken(id, action);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return page("Not authorized", "This moderation link is invalid or has been tampered with.", false);
  }

  const store = getStore("reviews");
  const review = (await store.get(id, { type: "json" })) as any;
  if (!review) {
    return page("Not found", "This review no longer exists.", false);
  }

  if (action === "approve") {
    review.status = "approved";
    review.approvedAt = new Date().toISOString();
    await store.setJSON(id, review);
    return page(
      "Review published! 🤙",
      `The ${review.rating}-star review from <strong>${esc(review.name)}</strong> is now live on summitoahu.com.`,
      true
    );
  } else {
    review.status = "rejected";
    await store.setJSON(id, review);
    return page(
      "Review rejected",
      `The review from <strong>${esc(review.name)}</strong> will not be shown on the site.`,
      true
    );
  }
}

function esc(s: string) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function page(title: string, message: string, ok: boolean) {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex"><title>${title} — Summit O'ahu</title>
    <style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#0d1f0d;color:#fdfbf7;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;}
    .card{background:#fdfbf7;color:#1e1c1b;border-radius:16px;padding:40px;max-width:440px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.4);}
    h1{margin:0 0 12px;font-size:1.5rem;color:#1a3a1a;} p{color:#55524b;line-height:1.6;margin:0 0 20px;}
    .icon{font-size:3rem;margin-bottom:12px;} a{color:#c57818;font-weight:600;}</style></head>
    <body><div class="card"><div class="icon">${ok ? "✅" : "⚠️"}</div><h1>${title}</h1><p>${message}</p>
    <a href="https://summitoahu.com/testimonials">View the reviews page →</a></div></body></html>`,
    { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
