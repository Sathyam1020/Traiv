# Free exercise video libraries for Traiv

Research checked 4 November 2026. Primary official sources unless explicitly marked otherwise. No implementation performed.

## Which libraries genuinely offer free commercial exercise video?

### Takeaway
YMove's 25 free MP4s are the clearest verified starter library. wger offers genuine downloadable videos under item-specific open licenses, but its current usable video coverage needs an inventory. Most other familiar "free exercise databases" are images/GIFs, noncommercial, or evaluation access.

### Cited Findings

| Provider | Actual video / coverage | Free commercial suitability | Storage / conditions |
|---|---|---|---|
| YMove free clips | 25 filmed 720p portrait MP4s: 11 studio, 14 real gym; compound lifts plus machine/isolation exercises | Explicit free use in apps, websites and client materials; no signup | MP4 download expressly permitted; attribution optional; no standalone resale/library redistribution. [Official library and license](https://ymove.app/free-exercise-videos) |
| wger | Genuine uploaded video files, supported MP4/MOV/WebM/Ogg; historical release credits a batch of 150 videos, not a current count | Potentially free commercial use under each video's license | Download/sync tooling exists; preserve each author's attribution and exact license. [Video model](https://github.com/wger-project/wger/blob/master/wger/exercises/models/video.py), [historical changelog](https://wger.readthedocs.io/en/latest/changelog.html), [download commands](https://wger.readthedocs.io/en/latest/administration/commands.html) |
| ExerciseDB free V1 | 1,500 exercise records, 180p GIFs; no actual video | No commercial products/SaaS/monetized use without paid RapidAPI plan | Strict rate limits (numeric limit not stated); AscendAPI credit required. [Official free docs](https://oss.exercisedb.dev/docs) |
| MuscleWiki API | 1,988 exercises, 7,700+ MP4 URLs, generally front/side and male/female | Free Basic is browser Playground only, 500 calls/month; no app integration | Direct API begins Testing $10/month / 1,000 calls; videos streamed, no download/rehost. [FAQ](https://api.musclewiki.com/faq), [pricing](https://api.musclewiki.com/pricing) |
| free-exercise-db | 800+ exercise JSON records with JPG start/end images; no videos | Dataset claims public domain / Unlicense, but images have unresolved provenance | Maintainer explicitly does not know image origin or whether royalty-free. [Repository](https://github.com/yuhonas/free-exercise-db), [maintainer issue #2](https://github.com/yuhonas/free-exercise-db/issues/2) |
| Programme | Exercise videos, embed/share license; no count established here | Commercial embedding allowed but compiling videos to replicate similar/competing service forbidden | No explicit download/self-host grant; attribution appreciated. [License](https://programme.app/license) |
| VFE free creator pack | 305 animated MP4s, male, 1080x1350, watermark | Explicitly NOT usable as app/web-app/software assets | Content creation/monetized social allowed, product integration requires paid commercial license. [Official usage rules](https://vectorfitexercises.com/for-content-creators) |

### Inferences
- For a small initial catalog, YMove is the most immediately practical free filmed-video option because its own page expressly names app use and downloads. Self-hosting to deliver those clips inside Traiv follows naturally from that grant, but it is not an explicit separately worded CDN clause. [License](https://ymove.app/free-exercise-videos)
- wger is the strongest open-video route among the major databases researched, provided Traiv selects files whose license/author/source can be preserved. [Per-item licensing model](https://raw.githubusercontent.com/wger-project/wger/master/wger/utils/models.py)
- Programme's competing-service exclusion makes it unsuitable to assume a wholesale library for a coaching/workout app is permitted. Seek a scoped grant if considering it. [License](https://programme.app/license)

### Gaps
- No verified comprehensive, uniform, free commercial filmed-video library emerged. wger's live website/API was blocked to this research client; exact current video count and exercise coverage remain unverified.
- A search surfaced ZenithFits claiming 317 exercises/593 videos, but its official site returned HTTP 410; current availability, ownership and media licenses were not verified. Do not recommend on the search snippet alone.

## What licensing distinctions matter, especially for ExerciseDB, wger and MuscleWiki?

### Takeaway
Code licenses do not establish rights to hosted media. A database's public GitHub presence or free viewing does not grant commercial app redistribution.

### Cited Findings
- **ExerciseDB versions must be separated.** AscendAPI's current GitHub README advertises 11,000+ exercises, 15,000+ videos, 20,000+ images and 5,000+ GIFs, and has AGPL-3.0 on the repository, not MIT. The README describes exploratory endpoints as unstable/rate-limited and not recommended for production. These are vendor claims, not an independently audited usable-video count. [Repository](https://github.com/ExerciseDB/exercisedb-api)
- **AscendAPI API media are proprietary.** Its terms reserve rights to metadata, images, GIFs and videos; subscriber use is revocable and ends with subscription. Persistent storage is prohibited, including databases/cloud storage; temporary operational caching may not exceed one hour. Bulk download/scraping is forbidden. An MIT/AGPL fork cannot override these media terms. [API terms](https://exercisedb.notion.site/ExerciseDB-API-Terms-of-Use-226983b728ca8090bf7be79564e4b356)
- **ExerciseDB.io is another product**, not an API: 1,394 downloadable exercise entries/GIFs; Starter offers 180/360px GIFs and Pro higher resolutions. Do not conflate it with AscendAPI's current API or assume it is a free actual-video source. [Official FAQ](https://exercisedb.io/faq)
- **wger separates software/content licensing:** application AGPL-3.0-or-later; initial exercise/ingredient data CC BY-SA 3.0; some images from Wikipedia have individual sources. [Official docs](https://wger.readthedocs.io/en/latest/)
- wger's `ExerciseVideo` inherits `AbstractLicenseModel`; the shared model records Title/Author/Source/License attribution. This supports per-file verification rather than applying the application's AGPL to all video files. [Video source](https://github.com/wger-project/wger/blob/master/wger/exercises/models/video.py), [license model](https://raw.githubusercontent.com/wger-project/wger/master/wger/utils/models.py)
- CC BY-SA permits copying, redistribution and adaptation commercially; requires credit, license link and change indication, plus same-license distribution of adaptations and no added legal/technical restrictions. The license does not promise publicity/privacy permissions. [Creative Commons](https://creativecommons.org/licenses/by-sa/4.0/)
- **MuscleWiki website free sharing is non-profit/academic only**, with branding and links; commercial app use should follow its separate API terms. [Website terms](https://musclewiki.com/terms)
- **MuscleWiki paid API**: stream videos in the app; no downloading, offline storage, CDN storage or rehosting; metadata caching 30 days, thumbnails/bodymap images 24 hours, video transient buffers only. A transparent non-storing backend proxy is permitted. Required attribution is the exact legal-document line “Exercise data and videos provided by MuscleWiki.com”, plus preserving embedded branding; visible in-app credit is optional. Video Range requests count in quota. [API terms, updated 8 October 2026](https://api.musclewiki.com/api-terms)
- **free-exercise-db image rights unresolved:** the owner states he does not know image origins or royalty-free status; later issue #12 directs commercial-use questions back to that warning. This is a direct maintainer admission, not proof of infringement. [Issue #2](https://github.com/yuhonas/free-exercise-db/issues/2), [Issue #12](https://github.com/yuhonas/free-exercise-db/issues/12)

### Inferences
- wger's CC media obligations concern the licensed media/adaptations; they should not automatically be described as forcing all independently written Traiv app code open-source. Incorporating AGPL application code is a separate decision. [Code/content distinction](https://wger.readthedocs.io/en/latest/), [CC terms](https://creativecommons.org/licenses/by-sa/4.0/)
- Do not convert a GIF into MP4 and call it a cleared video library: format conversion does not resolve the original usage restriction. [ExerciseDB free restrictions](https://oss.exercisedb.dev/docs)

### Gaps
- No current numeric public wger hosted-service rate limit or SLA was verified. Avoid claiming unlimited access. Self-hosting removes dependence on its shared API, subject to hosting costs and licenses.
- Exact per-video wger license versions, author/source completeness, model releases and quality require an asset inventory before selection.
- ExerciseDB paid RapidAPI quota/pricing not verified; irrelevant to a strictly zero-cost production choice.

## What should Traiv choose?

### Takeaway
Use YMove's free sample for an initial core filmed-video set, evaluate a selected wger subset to expand free coverage, and fill gaps with original coach-shot videos. If broad consistent filmed coverage is mandatory now, budget for a licensed supplier rather than assume a free tier covers production.

### Cited Findings
- YMove's free list includes squat, bench, deadlift, dumbbell rows/presses/raises, swing, pulldown, cable work, leg press/extensions/curls and other common gym movements. Its full library advertises 2,005+ videos but is separately licensed. [Official library](https://ymove.app/free-exercise-videos)
- wger provides `sync-exercises` and `download-exercise-videos` commands, supporting a locally maintained licensed subset rather than relying on third-party playback URLs. [Official commands](https://wger.readthedocs.io/en/latest/administration/commands.html)
- If paying later, MuscleWiki Growth is $39.99/month for 30,000 calls; Professional $99.99/100,000; Enterprise $199.99/300,000. Testing $10/1,000 is positioned for integration work. Media streaming consumes quota too, so exercise catalog calls alone understate cost. [Official pricing](https://api.musclewiki.com/pricing), [API terms](https://api.musclewiki.com/api-terms)

### Inferences
- Recommended order: (1) select the core exercises Traiv actually needs, (2) match the 25 clearly licensed YMove clips, (3) assess wger file licenses/quality for remaining exercises, (4) commission or record missing demos. Keep a media ledger with source, author, precise license, retrieved date and any edits.
- Exclude ExerciseDB free V1, MuscleWiki free tier and VFE free creator pack from a free commercial app shortlist. Exclude free-exercise-db as a video solution entirely and do not treat its imagery as cleared.

### Gaps
- Traiv's precise required movement list was not inspected in this research assignment. Coverage matching remains a future implementation/planning step.
