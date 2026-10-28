/**
 * "Did you mean …?" for guest email addresses (Oct 28, 2026).
 *
 * Why: Maria Estrada booked Oct 27 as despachomjec2019@gmail.CON. The
 * confirmation went out on time — to an address that does not exist — and she
 * had to email in to ask whether her booking was real. A one-character slip in
 * the domain silently loses the confirmation, so the form now suggests a fix.
 *
 * Deliberately gentle: it only SUGGESTS. A guest whose address really is
 * unusual taps "No, it's correct" and carries on. Two kinds of slip are caught:
 *   1. a near-miss of a common mail provider ("gmial.com", "hotmial.com",
 *      "yahoo.con", "gmail.co") — up to 2 typed characters off;
 *   2. a mistyped ".com" on ANY domain (".con", ".cpm", ".vom", ".comm"...),
 *      none of which are real endings.
 * Real country endings (.co, .cm, .om) are only corrected when the rest of the
 * address is a near-miss of a known provider, never on their own.
 */

const PROVIDERS = [
  "gmail.com", "googlemail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "live.com", "msn.com", "icloud.com", "me.com", "mac.com", "aol.com",
  "comcast.net", "att.net", "sbcglobal.net", "verizon.net", "cox.net",
  "charter.net", "bellsouth.net", "protonmail.com", "proton.me", "gmx.com",
  "ymail.com", "rocketmail.com", "hawaii.rr.com", "hawaiiantel.net",
  "yahoo.co.uk", "hotmail.co.uk", "btinternet.com", "outlook.co.uk",
  "yahoo.ca", "shaw.ca", "rogers.com", "sympatico.ca", "telus.net",
  "bigpond.com", "optusnet.com.au", "outlook.com.au", "xtra.co.nz",
  "gmx.de", "gmx.net", "web.de", "t-online.de", "gmx.at", "bluewin.ch",
  "orange.fr", "free.fr", "laposte.net", "libero.it", "hotmail.it",
  "yahoo.co.jp", "docomo.ne.jp", "naver.com", "hanmail.net", "daum.net",
  "qq.com", "163.com", "126.com", "mail.com", "email.com", "aim.com",
  "yahoo.fr", "yahoo.de", "yahoo.es", "yahoo.it", "yahoo.com.au", "yahoo.co.in",
  "hotmail.fr", "hotmail.de", "hotmail.es", "live.co.uk", "live.ca", "live.fr",
  "outlook.de", "outlook.fr", "outlook.es", "gmx.ch",
];

const BAD_COM = /\.(con|cpm|vom|xom|cmo|ocm|comm|coom|c0m|cim|clm|vcom)$/i;

function distance(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 3;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      // swapped neighbours ("gmial") count as one slip
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[m][n];
}

/** A corrected address to suggest, or "" when nothing looks wrong. */
export function suggestEmail(raw: string): string {
  const email = (raw || "").trim();
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return "";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (PROVIDERS.includes(domain)) return "";

  // 1. Near-miss of a common provider (also fixes "gmail.con" -> "gmail.com").
  let best = "", bestD = 3;
  for (const p of PROVIDERS) {
    const dd = distance(domain, p);
    if (dd < bestD) { best = p; bestD = dd; }
  }
  // Same provider name, different real country ending (yahoo.ca vs yahoo.fr,
  // hotmail.be): that is a real address, not a slip. Only .co/.cm/.om are
  // treated as fat-fingered ".com" here.
  const base = (x: string) => x.split(".")[0];
  const tld = domain.split(".").slice(1).join(".");
  const realCountry = /^(?!co$|cm$|om$)[a-z]{2}$|^co\.[a-z]{2}$|^com\.[a-z]{2}$/.test(tld);
  const sameNameOtherCountry = best && base(best) === base(domain) && realCountry;
  // One slip on any address of 5+ characters; two slips only on longer ones.
  const close = bestD === 1 ? domain.length >= 5 : bestD === 2 && domain.length >= 8;
  if (best && close && !sameNameOtherCountry) return `${local}@${best}`;

  // 2. Any other domain with a mistyped ".com".
  if (BAD_COM.test(domain)) return `${local}@${domain.replace(BAD_COM, ".com")}`;

  return "";
}
