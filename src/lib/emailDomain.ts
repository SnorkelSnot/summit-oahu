import { promises as dns } from "dns";

/**
 * Does the domain after the @ actually accept email? (Oct 28, 2026)
 *
 * Maria Estrada's confirmation to "gmail.con" did not even bounce — the domain
 * doesn't exist, so the email simply vanished. Asking DNS for the domain's mail
 * servers (MX records) before payment catches every such address.
 *
 *   true  -> the domain has mail servers (or at least an address record)
 *   false -> the domain does not exist / cannot receive mail
 *   null  -> couldn't tell (DNS slow or down) — callers must NOT block on this
 *
 * It cannot tell whether the NAME part exists (no provider will say); the
 * bounce alert in Channel Sync covers that case after the fact.
 */
// SAFETY: a broken DNS resolver answers "not found" for EVERY domain, which
// would block every guest. So a "no" is only trusted if a domain that surely
// exists (gmail.com) still resolves. Checked at most once per 5 minutes.
let resolverOkAt = 0;
async function resolverWorks(): Promise<boolean> {
  if (Date.now() - resolverOkAt < 5 * 60 * 1000) return true;
  try {
    const mx = await Promise.race([
      dns.resolveMx("gmail.com"),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000)),
    ]);
    if (mx.length) { resolverOkAt = Date.now(); return true; }
  } catch {}
  return false;
}

export async function domainAcceptsMail(email: string): Promise<boolean | null> {
  const at = (email || "").lastIndexOf("@");
  const domain = at > 0 ? email.slice(at + 1).trim().toLowerCase() : "";
  if (!/^[a-z0-9.-]+\.[a-z0-9-]{2,}$/.test(domain)) return false; // not an address at all
  const r = await rawDomainCheck(email);
  if (r === false && !(await resolverWorks())) return null;
  return r;
}

async function rawDomainCheck(email: string): Promise<boolean | null> {
  const at = (email || "").lastIndexOf("@");
  const domain = at > 0 ? email.slice(at + 1).trim().toLowerCase() : "";
  if (!/^[a-z0-9.-]+\.[a-z0-9-]{2,}$/.test(domain)) return false;

  const withTimeout = <T,>(p: Promise<T>) =>
    Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000))]);

  try {
    const mx = await withTimeout(dns.resolveMx(domain));
    if (mx.some((r) => r.exchange && r.exchange !== ".")) return true;
    // A "null MX" (exchange ".") means the domain explicitly takes no mail.
    if (mx.length) return false;
  } catch (e: any) {
    if (e?.message === "timeout") return null;
    if (e?.code !== "ENOTFOUND" && e?.code !== "ENODATA") return null;
    if (e?.code === "ENOTFOUND") return false; // domain does not exist at all
  }
  // No MX: mail falls back to the domain's own address record, if any.
  try {
    const a = await withTimeout(dns.resolve4(domain));
    return a.length > 0;
  } catch (e: any) {
    return e?.code === "ENOTFOUND" || e?.code === "ENODATA" ? false : null;
  }
}
