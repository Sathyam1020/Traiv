import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import webpush from "web-push";

const file = resolve(import.meta.dirname, "../../../.env");
const text = await readFile(file, "utf8").catch(() => "");
if (/^WEB_PUSH_PUBLIC_KEY=.+/m.test(text) || /^WEB_PUSH_PRIVATE_KEY=.+/m.test(text))
  console.info("Existing Web Push keys preserved.");
else {
  const keys = webpush.generateVAPIDKeys();
  await appendFile(
    file,
    `\nWEB_PUSH_PUBLIC_KEY=${keys.publicKey}\nWEB_PUSH_PRIVATE_KEY=${keys.privateKey}\n`,
  );
  console.info("Web Push keys saved to the local .env (not printed).");
}
