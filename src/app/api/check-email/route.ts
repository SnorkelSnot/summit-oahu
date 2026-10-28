import { NextRequest, NextResponse } from "next/server";
import { domainAcceptsMail } from "@/lib/emailDomain";

export const dynamic = "force-dynamic";

/** GET /api/check-email?email=… -> { ok: true | false | null }. See emailDomain.ts. */
export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get("email") || "";
  const ok = await domainAcceptsMail(email.slice(0, 254));
  return NextResponse.json({ ok }, { headers: { "Cache-Control": "no-store" } });
}
