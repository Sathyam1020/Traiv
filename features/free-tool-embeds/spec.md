# Free-tool embeds

Status: Implemented and verified locally. Production response headers still need checking after deployment.

## Coach workflow

The first calculator is RPE. It fits a strength programming article, uses no account data, and can calculate from local inputs. The public RPE tool offers a copyable HTML snippet with a descriptive iframe title and an adjacent “Powered by Traiv” link to the canonical calculator. A coach can paste the snippet into a site that accepts custom HTML. The link remains usable when the iframe is blocked.

## Route and isolation

- Serve the calculator at a dedicated, allowlisted embed route using the same RPE widget and calculator engine. Return 404 for unknown or unsupported slugs. Regular tool pages remain the canonical search results.
- On the embed route set a noindex directive and omit it from the sitemap. Keep the current frame-denial policy everywhere except approved embed responses. Check both application and hosting headers in the deployed response because either can prevent framing.
- Render a standalone document containing the calculator and its accessible result. Public inputs remain in browser memory. Use no authenticated API, cross-window messaging, third-party script loader, or caller-provided markup or return URLs.
- Recommend a responsive iframe with scripts enabled and no extra sandbox privileges. The initial release uses an 850px frame height and native scrolling when content expands. Verify keyboard access and meaningful focus across the page and frame.
- Use existing tool attribution on the Traiv-bound link where supported. Count referrals and attributed signup events on Traiv. Keep calculator inputs out of links and analytics. Treat links as referrals and measure actual backlinks separately.

## Acceptance

- A separate-origin test page embeds the calculator and can calculate the same result as the canonical page for the same inputs.
- The snippet works without an account at 360px and desktop widths. Tab navigation enters and exits the iframe, all controls have visible focus, and results are announced.
- Unsupported routes return 404. The embed route is excluded from indexing and sitemap generation. The canonical route keeps its frame-denial header.
- The attribution link can be used even if iframe loading fails. The embed sends no inputs or personal data to Traiv.
