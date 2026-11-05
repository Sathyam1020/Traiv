# Native client and PWA

The web client remains a Next.js app and installable PWA. Capacitor iOS/Android projects load this same first-party hosted client, because its dynamic server routes cannot be exported as a static bundle.

## Running on a phone

1. Deploy the Next.js client and API on HTTPS, with the normal API origin and session cookie configuration. For a physical development device, use your machine's LAN URL instead of localhost.
2. Set `TRAIV_NATIVE_URL` in the shell when running `pnpm --filter @traiv/client native:sync`. This value is consumed by the Capacitor CLI, not Next.js. Use the deployed HTTPS client origin for release; production rejects HTTP.
3. Open with `pnpm --filter @traiv/client native:ios` or `native:android`.
4. Configure an Apple development team/signing in Xcode and Android signing for release. Build and install on a device. Neither project has been signed or validated on a physical device by this change.

The app identifier is `app.traiv.client`; change the bundle/application identifiers if your registered identifier differs.

## Health integration

- iOS: HealthKit read access to steps and workouts. `NSHealthShareUsageDescription` and the HealthKit entitlement are included. Enable HealthKit for the app identifier in your Apple account. No health write permissions are requested.
- Android: Health Connect on Android 8+ (API 26); install Health Connect on supported pre-Android-14 devices. Only `READ_STEPS` and `READ_EXERCISE` remain after manifest merging. A health permission rationale is bundled as `privacypolicy.html`. Complete the Play Console health-data declaration before distribution.
- Connect through Profile → Integrations. Sync reads the last 30 days and runs on reconnect/foreground or Sync now. Imported workouts are separate from training-program sessions. Existing manual step overrides are preserved.
- A PWA cannot access these native health stores and shows an explicit unavailable state. HealthKit intentionally cannot reveal read-denial status; an empty import is not reported as proof of granted read permissions.
- Disconnect stops new imports; revoke OS access through Health/Health Connect. Existing imported history remains.

## Notifications

- Preferences are persisted in the API. Chat, published workout/meal-plan content, assigned vault resources and daily open check-in reminders use those preferences. Community delivery awaits the communities feature.
- Web/PWA: Web Push VAPID keys live on the API, with the public key exposed by the authenticated push config endpoint. Generate local keys using `pnpm --filter @traiv/api exec tsx src/setup-push.ts`; configure `WEB_PUSH_SUBJECT` before deployment. On iPhone, install to the Home Screen for Web Push.
- iOS: supply `APNS_KEY`, `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_BUNDLE_ID` and `APNS_SANDBOX` on the API. Entitlements use development for Debug and production for Release. Remote notification registration hooks are included.
- Android: supply `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, `FCM_PRIVATE_KEY` on the API. Place Firebase's `google-services.json` at `android/app/google-services.json` (ignored by Git). Configure the matching Firebase app identifier.
- Device registration is disabled with a clear error while delivery credentials are absent. Never commit service-account keys, APNs signing keys or Firebase configuration from your real project.
- The API process scans due check-ins every minute and deduplicates reminders per user/check-in/local day. Run one API process for a single active reminder scanner; database claims prevent duplicate delivery across processes. This is not a durable delivery outbox: process termination during an in-flight delivery can lose that notification.
- Email preferences persist, but no email service is enabled; the UI states this explicitly.

## PWA

`/manifest.webmanifest` provides installation metadata and icons. `/sw.js` handles push and an offline fallback. It does not cache authenticated API responses or health data. This is an online-first PWA, not offline editing/sync.

## Personal information

Email/phone changes save directly, clear verification timestamps, and revoke other sessions. The UI displays the temporary no-verification notice. Phone numbers are normalized and duplicate contacts are rejected. Full birth date, language, timezone, unit preference and height are stored. English is the only translated language currently available. Unit selection is stored as a preference; existing coaching records remain in canonical kg/cm units. Accounts use the existing phone/Google authentication; no unused password field is presented.
