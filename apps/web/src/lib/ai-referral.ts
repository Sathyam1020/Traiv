const providers = [
  ["chatgpt", ["chatgpt.com", "chat.openai.com"]],
  ["perplexity", ["perplexity.ai"]],
  ["gemini", ["gemini.google.com"]],
  ["copilot", ["copilot.microsoft.com"]],
  ["claude", ["claude.ai"]],
] as const;

export function aiReferral(referrer: string) {
  try {
    const { hostname, protocol } = new URL(referrer);
    if (protocol !== "https:" && protocol !== "http:") return undefined;
    const host = hostname.replace(/^www\./, "");
    return providers.find(([, domains]) => domains.some((domain) => domain === host))?.[0];
  } catch {
    return undefined;
  }
}
