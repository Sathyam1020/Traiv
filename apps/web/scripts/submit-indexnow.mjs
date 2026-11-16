const origin = "https://www.traiv.fit";
const [action, ...paths] = process.argv.slice(2);
if (!["--dry-run", "--submit"].includes(action) || !paths.length) {
  throw new Error(
    "Usage: node scripts/submit-indexnow.mjs --dry-run|--submit /tools [ /tools/slug ... ]",
  );
}

const urlList = [...new Set(paths)].map((path) => {
  if (!/^\/tools(?:\/[a-z0-9-]+)?$/.test(path)) throw new Error(`Invalid tool path: ${path}`);
  return new URL(path, origin).href;
});

async function get(url) {
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}

const sitemap = await get(`${origin}/sitemap.xml`);
for (const url of urlList) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`Missing from live sitemap: ${url}`);
}
if (action === "--dry-run") {
  process.stdout.write(`${urlList.join("\n")}\n`);
} else {
  const key = process.env.INDEXNOW_KEY;
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("Set a valid INDEXNOW_KEY.");
  const keyLocation = `${origin}/indexnow-key.txt`;
  if ((await get(keyLocation)).trim() !== key)
    throw new Error("Published IndexNow key differs from configuration.");
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(origin).hostname, key, keyLocation, urlList }),
    signal: AbortSignal.timeout(15000),
  });
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow returned HTTP ${response.status}`);
  }
  process.stdout.write(`IndexNow HTTP ${response.status}; submitted ${urlList.length} URL(s).\n`);
}
