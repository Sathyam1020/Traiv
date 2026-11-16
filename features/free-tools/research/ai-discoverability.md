# Phase 8 launch and monthly checks

## At deployment

1. Set the web runtime's public verification token as INDEXNOW_KEY (8–128 letters, digits, or hyphens). Confirm the exact token is served at /indexnow-key.txt on the canonical host.
2. Check the public sitemap for 110 tool pages, check /robots.txt and /llms.txt, and spot-check Markdown and HTML for the same question and answer. Confirm the CDN permits crawler access. Verify the site and submit the sitemap in Bing Webmaster Tools.
3. From apps/web, run `node scripts/submit-indexnow.mjs --dry-run /tools /tools/rpe-calculator` with the release's deployed canonical tool paths. Rerun with `--submit` and the same configured key after confirming the list. Submit only new or materially changed URLs on subsequent releases. Record the response and check the IndexNow tab in Bing. An accepted notification does not confirm indexing.
4. Check the About page against its Organization schema. Add sameAs when an official Traiv profile URL is confirmed.

[IndexNow protocol](https://www.indexnow.org/documentation) · [Bing sitemap instructions](https://www.bing.com/webmasters/help/Sitemaps-3b5cf6ed)

## Monthly

- Record the period and report attributed pageviews by assistant and landing page from the existing marketing events. Use `name = 'pageview'` and group by `props->>'aiSource'` and `path`. Compare totals the same way month to month. Visits that omit a referrer are unattributed. Standard Google Search and AI Overviews cannot be separated reliably by referrer.
- Run the prompts below in fresh sessions. Record assistant, date, search mode, prompt, whether Traiv appears, canonical URL cited, and whether the cited answer matches the rendered page. Report citations separately from referral traffic.
- Recheck any missing or wrong citations against the page, /llms-full.txt, and the corresponding Markdown. Review server-rendered passages that depend on a previous paragraph before editing them. Keep the source, assumptions, and limits alongside numbers.

| Prompt | Page to check if cited |
| --- | --- |
| What percentage of my one-rep max is five reps at RPE 8? | /tools/rpe-calculator |
| How do I calculate monthly client churn as a personal trainer? | /tools/client-churn-rate-calculator |
| How do I estimate my daily energy expenditure? | /tools/tdee-calculator |
| What is Traiv and who is it for? | /about |

For the monthly referral check, run this read-only query against marketing analytics. It returns aggregate counts only.

```sql
SELECT props->>'aiSource' AS assistant, path, count(*) AS visits
FROM analytics_event
WHERE name = 'pageview'
  AND created_at >= date_trunc('month', now()) - interval '1 month'
  AND created_at < date_trunc('month', now())
  AND props->>'aiSource' IS NOT NULL
GROUP BY 1, 2
ORDER BY 3 DESC;
```

Citation log columns: date, assistant, search mode, prompt, Traiv mentioned, cited URL, answer matched page, notes.
