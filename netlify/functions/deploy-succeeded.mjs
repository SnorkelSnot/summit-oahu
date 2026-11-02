/**
 * IndexNow ping — runs by itself after every successful Netlify deploy
 * (Netlify calls any function named "deploy-succeeded" automatically).
 *
 * IndexNow tells Bing (which feeds ChatGPT search and Copilot), Yandex,
 * Naver, Seznam and others "these pages changed, come re-read them" instead
 * of waiting for them to crawl. Google does not use IndexNow; Search Console
 * + the sitemap cover Google.
 *
 * The key is NOT a secret: IndexNow proves ownership by finding the same key
 * in a file at the site root (public/<key>.txt). Added Nov 1, 2026.
 * Only production deploys ping; previews and branch deploys are skipped.
 * A failure here never affects the site — it only logs.
 */
const KEY = "9de762f6b09bfc28bbb91d460c84c724";
const SITE = "https://summitoahu.com";

export default async (req) => {
  try {
    const { payload } = await req.json().catch(() => ({}));
    const context = payload?.context;
    if (context && context !== "production") {
      console.log(`IndexNow: skipped (${context} deploy)`);
      return new Response("skipped");
    }
    const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
    const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    if (!urlList.length) throw new Error("no URLs found in sitemap.xml");
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "summitoahu.com",
        key: KEY,
        keyLocation: `${SITE}/${KEY}.txt`,
        urlList,
      }),
    });
    console.log(`IndexNow: sent ${urlList.length} URLs, answer ${res.status}`);
  } catch (err) {
    console.log(`IndexNow: not sent — ${err?.message || err}`);
  }
  return new Response("ok");
};
