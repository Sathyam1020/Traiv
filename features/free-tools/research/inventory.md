# Coachway tool inventory (structural, extracted 2026-11-15)

Source: every `/tools/*` page in coachway.io's sitemap, parsed by control markup.
Machine-readable version with every field: `coachway-tool-specs.json`.
Holds control labels, defaults, options and section structure only. No body copy is kept,
and **none of this is meant to be reproduced as prose**. Our copy is written fresh.

## Totals

- Tools: **109**
- With ChatGPT prompt export: 27
- With 'Researching with AI?' links: 17
- With demo button: 70
- With sources list: 11 · with author byline: 109
- FAQ questions: median 6, range 4–13
- Words per page: median 2686, range 1773–4560
- Title length median 57 chars; meta median 155 chars
- Pages with WebApplication schema: 95 · FAQPage: 109 · BreadcrumbList: 109 · Article: 95 · Speakable: 109

## Calories & nutrition (28)

| # | Slug | Kind | Inputs / defaults | FAQ | Prompt | Words |
|---|---|---|---|---|---|---|
| 1 | `bmr-calculator` | calculator | Sex: 2 opts | 7 | — | 2408 |
| 2 | `bulking-calorie-calculator` | calculator | Maintenance calories=2500; Bodyweight=170; toggles on: lb, Moderate +15% | 11 | yes | 3499 |
| 3 | `calorie-cycling-calculator` | calculator | Average daily calories (kcal)=2400; Maintenance calories (kcal)=2600; Goal: 4 opts (default Maintain (0%)); Training days per week: 5 opts (default 4); toggles on: Moderate (20%) | 6 | — | 2608 |
| 4 | `calorie-deficit-calculator` | calculator | Sex: 2 opts; Activity level: 5 opts (default Moderate - exercise 3-5 days/week); Weekly weight-loss goal: 4 opts (default Steady (recommended)) | 13 | — | 3372 |
| 5 | `calorie-surplus-calculator` | calculator | Sex: 2 opts; Activity level: 5 opts (default Moderate - exercise 3-5 days/week); Surplus size: 3 opts (default Standard (+375 kcal)) | 8 | — | 3367 |
| 6 | `calories-burned-calculator` | calculator | Bodyweight=170; Duration (minutes)=30; Activity: 12 opts (default Walking (3.5 mph, brisk)); toggles on: Imperial (lb) | 5 | — | 2162 |
| 7 | `calories-per-meal-calculator` | calculator | Daily calorie target=2200; Number of meals: 5 opts (default 4 meals); Which meal is post-workout?: 0 opts; toggles on: Even | 6 | — | 2465 |
| 8 | `carb-cycling-calculator` | calculator | Maintenance calories (kcal)=2600; Bodyweight (kg)=80; Goal: 4 opts (default Fat loss (-20%)); Training days per week: 5 opts (default 4); toggles on: kg, Moderate (50%) | 6 | — | 2658 |
| 9 | `creatine-dosage-calculator` | calculator | Loading approach: 2 opts (default Skip loading (slower, gentler)) | 13 | yes | 3702 |
| 10 | `cut-length-calculator` | calculator | Sex: 2 opts; Weekly loss pace: 3 opts (default Steady - 0.75% of bodyweight/week (recommended)) | 6 | — | 2539 |
| 11 | `cycle-phase-calculator` | calculator | Average cycle length=28 | 6 | — | 2764 |
| 12 | `fiber-intake-calculator` | calculator | Age=35; Daily calories (optional)=2000; toggles on: Female, General health | 6 | — | 3090 |
| 13 | `goal-weight-date-calculator` | calculator | Weekly rate of change: 6 opts (default Steady (recommended) - 0.5 lb/week) | 10 | yes | 3420 |
| 14 | `intermittent-fasting-calculator` | calculator | Last meal time=20:00; Protocol: 5 opts (default 16:8 - fast 16 hours, eat 8) | 6 | — | 3217 |
| 15 | `keto-macro-calculator` | calculator | Age=30; kc-height-ft=5; kc-height-in=10; kc-height-cm=178; Weight=175; Activity level: 5 opts (default Moderate - exercise 3-5 days/week); toggles on: 30 g standard, Maintain | 6 | — | 2502 |
| 16 | `macro-calculator` | calculator | Age=30; mc-height-ft=5; mc-height-in=10; mc-height-cm=178; Weight=175; Activity level: 5 opts (default Moderate - exercise 3-5 days/week); toggles on: Maintain | 6 | — | 2319 |
| 17 | `macro-split-by-body-type-calculator` | calculator | Age=30; mc-height-ft=5; mc-height-in=10; mc-height-cm=178; Weight=175; Activity level: 5 opts (default Moderate - exercise 3-5 days/week); toggles on: Mesomorph, Maintain | 6 | — | 2616 |
| 18 | `maintenance-calorie-calculator` | calculator | Activity level: 5 opts (default Moderately active - exercise 3-5 days/week); toggles on: Male, Imperial (lb, ft) | 7 | — | 2719 |
| 19 | `protein-calculator` | calculator | Goal: 3 opts; Activity level: 3 opts (default Active / trains regularly) | 6 | — | 2277 |
| 20 | `protein-per-meal-calculator` | calculator | Bodyweight=80; Protein meals per day: 5 opts (default 4 meals); toggles on: kg, Build muscle | 6 | — | 2491 |
| 21 | `recipe-macro-calculator` | calculator | Ingredient name=Chicken breast; Grams used=200; Protein per 100 g=23; Carbs per 100 g=0; Fat per 100 g=1.5; Ingredient name=White rice (dry); Grams used=150; Protein per 100 g=7; Carbs per 100 g=78; Fat per 100 g=0.6; Ingredient name=Olive oil; Grams used=15; toggles on: Whole recipe | 7 | yes | 3167 |
| 22 | `refeed-day-calculator` | calculator | Maintenance calories (kcal)=2600; Daily deficit (kcal below maintenance)=500; Weeks in the deficit=8; Protein basis: 3 opts (default Standard (30% of maintenance)) | 8 | — | 2834 |
| 23 | `reverse-diet-calculator` | calculator | Current daily calories=1500; Maintenance calories=2100; Weekly calorie increase=75; Bodyweight=160; toggles on: lb | 6 | — | 2357 |
| 24 | `steps-to-calories-calculator` | calculator | Step count=10000; Bodyweight=170; Height=67; Walking pace: 4 opts (default Average (3.0 mph / 4.8 km/h)); toggles on: Imperial (lb, in) | 11 | yes | 3553 |
| 25 | `sweat-rate-calculator` | calculator | Pre-session bodyweight=176; Post-session bodyweight=173; Fluid consumed during session=20; Session duration (minutes)=60; toggles on: Imperial (lb, fl oz) | 6 | — | 2324 |
| 26 | `tdee-calculator` | calculator | Age=30; Height in feet=5; Height in inches=10; tdee-height-cm=178; Weight=170; Activity level: 5 opts (default Moderate - exercise 3-5 days/week); toggles on: Imperial (lb / ft), Male | 8 | yes | 2886 |
| 27 | `water-intake-calculator` | calculator | Bodyweight=170; Exercise today (minutes)=45; toggles on: Imperial (lb) | 6 | — | 2173 |
| 28 | `weight-loss-phase-calculator` | calculator | Sex: 2 opts; Activity level: 5 opts (default Moderate - exercise 3-5 days/week); Daily deficit: 3 opts (default Steady - 500 kcal/day (recommended)) | 6 | — | 2991 |

## Strength & programming (19)

| # | Slug | Kind | Inputs / defaults | FAQ | Prompt | Words |
|---|---|---|---|---|---|---|
| 1 | `bench-press-calculator` | calculator | Weight lifted (lb)=185; Reps performed=5; Formula: 2 opts (default Epley) | 9 | — | 2799 |
| 2 | `deadlift-calculator` | calculator | Weight lifted (lb)=315; Reps performed=5; Formula: 2 opts (default Epley) | 11 | yes | 3232 |
| 3 | `dots-calculator` | calculator | Bodyweight (kg)=90; Total lifted (kg)=600 | 7 | yes | 3160 |
| 4 | `injury-exercise-swap` | reader | toggles on: Shoulder, Twinge, fine under load, Hypertrophy, Full gym | 4 | — | 1998 |
| 5 | `ipf-gl-points-calculator` | calculator | Bodyweight (kg)=90; Total lifted (kg)=700 | 10 | yes | 3943 |
| 6 | `one-rep-max-calculator` | calculator | Weight lifted (lb)=225; Reps performed=5 | 13 | yes | 3551 |
| 7 | `overhead-press-calculator` | calculator | Weight lifted (lb)=185; Reps performed=5; Formula: 2 opts (default Epley) | 7 | — | 2367 |
| 8 | `plate-loading-calculator` | calculator | Target weight (kg)=102.5; ?=25; ?=20; ?=15; ?=10; ?=5; ?=2.5; ?=1.25; ?=45; ?=35; ?=25; ?=10; Bar weight: 3 opts (default 20 kg - standard bar) | 13 | yes | 3593 |
| 9 | `rir-calculator` | calculator | Reps performed=8; Reps in reserve: 6 opts (default 2 - 2 reps left (RPE 8)) | 6 | — | 3355 |
| 10 | `rpe-calculator` | calculator | Reps=5; Target RPE: 9 opts (default 8 - 2 reps left) | 8 | — | 2903 |
| 11 | `sinclair-calculator` | calculator | Bodyweight (kg)=89; Snatch (kg)=150; Clean & jerk (kg)=185 | 6 | — | 3101 |
| 12 | `squat-calculator` | calculator | Weight lifted (lb)=225; Reps performed=5; Formula: 2 opts (default Epley) | 8 | yes | 2682 |
| 13 | `strength-standards-calculator` | calculator | 1RM (lb)=275; Bodyweight (lb)=180; Lift: 4 opts (default Back squat) | 8 | yes | 2887 |
| 14 | `tempo-calculator` | calculator | Eccentriclower=3; Bottompause=1; Concentriclift / X=2; Toppause=0; Reps per set=8; Sets=3 | 6 | — | 2970 |
| 15 | `warm-up-set-calculator` | calculator | Working weight (lb)=225; Working set reps=5 | 6 | — | 2456 |
| 16 | `weekly-training-volume-calculator` | calculator | MEV=10; MAV=15; MRV=20; Chest sets per session=5; Chest sessions per week=4; Back sets per session=6; Back sessions per week=4; Shoulders sets per session=4; Shoulders sessions per week=3; Biceps sets per session=3; Biceps sessions per week=3; Triceps sets per session=3 | 6 | — | 2878 |
| 17 | `wilks-calculator` | calculator | Bodyweight (kg)=90; Total lifted (kg)=500 | 5 | — | 2659 |
| 18 | `wilks-dots-calculator` | calculator | Bodyweight (kg)=82.5; Total lifted (kg)=500 | 8 | — | 2581 |
| 19 | `workout-plan-builder` | generator | Training days / week: 5 opts (default 4 days); Primary goal: 4 opts (default Build muscle); Experience: 3 opts (default Intermediate) | 5 | — | 2954 |

## Body composition (11)

| # | Slug | Kind | Inputs / defaults | FAQ | Prompt | Words |
|---|---|---|---|---|---|---|
| 1 | `bmi-calculator` | calculator |  | 6 | — | 2252 |
| 2 | `body-fat-calculator` | calculator | Sex: 2 opts | 6 | — | 2401 |
| 3 | `body-recomposition-calculator` | calculator | Bodyweight=180; Current body fat=22; Target body fat=15; Activity level: 4 opts (default Moderately active - 3-5 workouts a week); toggles on: lb | 6 | yes | 2823 |
| 4 | `ffmi-calculator` | calculator |  | 7 | — | 2588 |
| 5 | `ideal-weight-calculator` | calculator | iw-height-ft=5; iw-height-in=11; iw-height-cm=180; toggles on: Imperial (ft / lb), Male | 6 | — | 2269 |
| 6 | `lean-body-mass-calculator` | calculator | Weight=185; lbm-height-ft=5; lbm-height-in=10; lbm-height-cm=178; Body fat %=18; toggles on: Body fat %, Imperial (lb / ft), Male | 7 | — | 2730 |
| 7 | `muscle-mass-calculator` | calculator | Age=30; Weight=185; mm-height-ft=5; mm-height-in=10; mm-height-cm=178; toggles on: Imperial (lb / ft), Male | 10 | yes | 3933 |
| 8 | `navy-body-fat-calculator` | calculator | Sex: 2 opts | 9 | yes | 3556 |
| 9 | `waist-to-height-ratio-calculator` | calculator | Waist (cm)=80; Height (cm)=180 | 6 | — | 2302 |
| 10 | `waist-to-hip-ratio-calculator` | calculator | Waist (cm)=90; Hip (cm)=100; Sex: 2 opts | 6 | — | 2273 |
| 11 | `weight-loss-percentage-calculator` | calculator | Starting weight=90; Current weight=84 | 8 | yes | 3704 |

## Heart rate & cardio (11)

| # | Slug | Kind | Inputs / defaults | FAQ | Prompt | Words |
|---|---|---|---|---|---|---|
| 1 | `beep-test-calculator` | calculator | Level reached (1 - 21)=9; Shuttle at that level=5; Age (years) - for the rating=30 | 10 | yes | 4444 |
| 2 | `cooper-test-calculator` | calculator | Age (years)=30; Distance covered in 12 minutes (m)=2400 | 9 | yes | 3793 |
| 3 | `heart-rate-zone-calculator` | calculator | Age=30; toggles on: % of max HR | 6 | — | 2336 |
| 4 | `interval-walking-calculator` | calculator | Bodyweight=175; Brisk min=3; Easy min=3; Rounds=5; Sessions per week=4; Brisk pace: 2 opts (default Fast - 4.0 mph / 6.4 km/h); Easy pace: 2 opts (default Comfortable - 2.5 mph / 4.0 km/h); toggles on: Japanese 3-3 x5 | 6 | — | 2275 |
| 5 | `max-heart-rate-calculator` | calculator | Age=30 | 8 | — | 3145 |
| 6 | `race-time-predictor` | calculator | Hours=0; Minutes=25; Seconds=0; Recent race distance: 8 opts (default 5K) | 7 | yes | 3162 |
| 7 | `rucking-calorie-calculator` | calculator | Bodyweight=175; Pack / vest load=30; Average grade (uphill, %)=0; Duration=60; Walking pace: 4 opts (default Steady - 3.0 mph / 4.8 km/h); Terrain: 5 opts (default Pavement / track) | 6 | — | 2280 |
| 8 | `running-pace-calculator` | calculator | Distance (km)=10; Hours=0; Minutes=50; Seconds=0; toggles on: 5K, 10K, Half, Marathon | 6 | — | 2300 |
| 9 | `vo2-max-calculator` | calculator | Age (years)=30; Distance covered in 12 minutes (m)=2400; 1.5-mile time - minutes=12; Seconds=30; Resting heart rate (bpm)=60 | 12 | yes | 3712 |
| 10 | `workout-timer` | timer | Total minutes=10; Minutes on the clock=12; Work (seconds)=20; Rest (seconds)=10; Rounds=8; Work (seconds)=40; Rest (seconds)=20; Rounds=6 | 4 | — | 2724 |
| 11 | `zone-2-heart-rate-calculator` | calculator | Age=40; Resting heart rate (for Karvonen)=60; toggles on: %HRmax | 6 | — | 2406 |

## For your coaching business (40)

| # | Slug | Kind | Inputs / defaults | FAQ | Prompt | Words |
|---|---|---|---|---|---|---|
| 1 | `ad-spend-breakeven-calculator` | calculator | Monthly ad budget=1000; Cost per lead=20; Lead-to-client rate=10; Package price per client=900; Gross margin=70; Currency: 3 opts (default EUR (€)) | 5 | — | 2569 |
| 2 | `ai-writing-checker` | generator |  | 7 | yes | 3265 |
| 3 | `assistant-coach-roi-calculator` | calculator | ac-price=200; ac-handoff=15; ac-total=40; ac-hours=0.5; ac-amount=60; ac-feepct=5; toggles on: Flat / client, Coachway (2.4%) | 4 | — | 2000 |
| 4 | `client-capacity-calculator` | calculator | Coaching hours available per week=30; Minutes per client per week=30; Admin overhead (%)=20; No-show or churn buffer (%)=15; Price per client / month - optional=120 | 5 | — | 2766 |
| 5 | `client-check-in-builder` | generator | toggles on: Fat loss, Standard | 5 | — | 1908 |
| 6 | `client-check-in-reader` | reader | cr-weeks=3; cr-adherence=85; cr-tdone=3; cr-tplan=4; cr-sleep=7; toggles on: kg, 3, 2, Fat loss, Warm | 4 | — | 1924 |
| 7 | `client-churn-rate-calculator` | calculator | Clients at start of month=40; Clients lost this month=2; Clients added this month=4 | 7 | — | 2705 |
| 8 | `client-churn-risk-reader` | reader | chr-tenure=12; toggles on: On time, Responsive, Steady, On track, Positive, Current | 4 | — | 1965 |
| 9 | `client-ltv-calculator` | calculator | Monthly price per client=300; Average retention=6; Monthly churn rate=16.67; Currency: 3 opts (default EUR (€)); toggles on: Avg months | 5 | — | 2362 |
| 10 | `client-onboarding-builder` | generator | toggles on: Fat loss, First week | 5 | — | 1887 |
| 11 | `coaching-business-health-check` | reader | toggles on: 3-8 hrs, 3-4, A rough checklist, Freeform but regular, 6-12 months, 1-2 years ago | 4 | — | 1773 |
| 12 | `coaching-offer-builder` | generator | toggles on: 1:1 coaching, Monthly | 4 | — | 1807 |
| 13 | `coaching-package-pricing-calculator` | calculator | Target revenue per delivery-hour=60; Core coaching time per week=0.4; pkg-ext-checkin-hrs=0.15; pkg-ext-meal-hrs=0.1; pkg-ext-msg-hrs=0.1; 12-week=10; 24-week=15; toggles on: EUR (€) | 5 | — | 3268 |
| 14 | `coaching-platform-cost-calculator` | calculator | Active clients: 25=25; Or type it=25; Currency: 3 opts | 5 | — | 2686 |
| 15 | `coaching-platform-fit-finder` | reader |  | 6 | — | 2370 |
| 16 | `coaching-profit-calculator` | calculator | Number of clients=20; Price per client / month=300; Software & subscriptions=150; Ads & marketing=800; Contractors or VA=400; Other costs=150; toggles on: EUR (€) | 5 | — | 2304 |
| 17 | `coaching-prompt-generator` | generator | Your niche=busy parents losing fat; One thing about the client (goal, level or constraint)=new to training, trains twice a week; toggles on: Client check-in reply, Warm, Standard | 7 | yes | 4560 |
| 18 | `coaching-rate-calculator` | calculator | Target monthly income (your pay)=6000; Business costs per month=800; Hours per client per week=0.75; Hours available per week for coaching=25; Expected monthly churn=6; toggles on: EUR (€), Online async | 5 | — | 3384 |
| 19 | `coaching-revenue-projector` | calculator | Starting clients=20; New clients per month=5; Monthly churn=5; Price per client / month=300; toggles on: EUR (€) | 5 | — | 2502 |
| 20 | `coaching-tool-stack-cost-calculator` | calculator | Number of clients=15; Workout builder monthly price in euro=30; Meal planning monthly price in euro=30; Check-in forms monthly price in euro=39; Scheduling monthly price in euro=10; File storage monthly price in euro=10 | 5 | — | 2830 |
| 21 | `customer-acquisition-cost-calculator` | calculator | Monthly marketing spend=600; New clients per month=4; Monthly price per client=150; Average client lifetime (months)=6 | 6 | — | 2889 |
| 22 | `difficult-client-responder` | reader | toggles on: Messages at all hours | 4 | — | 2020 |
| 23 | `discovery-call-calculator` | calculator | Discovery calls per month=20; Close rate=30; Average client value=1500; toggles on: EUR (€) | 5 | — | 2402 |
| 24 | `email-list-value-calculator` | calculator | Subscribers on your list=500; Open rate=40; Click rate (of openers)=8; Purchase conversion (of clickers)=5; Offer price=300; Currency: 3 opts (default EUR (€)) | 5 | — | 2503 |
| 25 | `free-trial-conversion-calculator` | calculator | Trials started per month=40; Trials that become paying clients=10; Price per client / month=300; Monthly churn=5; Ad spend per month=1600; toggles on: EUR (€) | 6 | — | 2616 |
| 26 | `glp1-client-coaching-planner` | generator | g1-days=3; toggles on: Just starting the medication, Beginner, Can't eat enough protein | 4 | — | 1946 |
| 27 | `group-vs-1on1-coaching-calculator` | calculator | Price per client / month=400; Number of 1:1 clients=15; Hours per client / week=1; Price per member / month=150; Members in the group=30; Total coaching hours / week=4; toggles on: EUR € | 5 | — | 2487 |
| 28 | `instagram-caption-generator` | generator | Your niche=strength coaching for women over 40; Who the post is for=anyone who trains four times a week and sees nothing change; The one point of this post=the weekend is where the calories go; One specific detail from this week=27 of the last 30 food logs were at maintenance on Saturday; Keyword (f | 11 | yes | 3604 |
| 29 | `instagram-hook-generator` | generator | Your topic (a short noun phrase, 3 to 5 words)=rest-day weight jumps; Who it is for=women over 40 who lift; One number from your coaching=2 kg; One client question this week (their words)=Why did I gain 2 kg overnight?; toggles on: Reel | 7 | yes | 3757 |
| 30 | `lift-progression-reader` | reader | lp-lift=squat; toggles on: kg, Strength, Intermediate, Sleep & food on point | 4 | — | 2059 |
| 31 | `no-show-cost-calculator` | calculator | No-shows per week=2; Late cancellations per week=1; Average session value=40; Booked sessions per week=30; toggles on: EUR (€) | 5 | — | 2601 |
| 32 | `personal-trainer-bio-generator` | generator | Who you help=busy parents; Outcome you deliver=lose fat without crash diets; Method or what makes you different=custom training + weekly check-ins; Proof point (optional)=; toggles on: Link click, Direct | 6 | — | 3075 |
| 33 | `personal-trainer-income-calculator` | calculator | Session rate=50; Sessions per week=25; Gym split (optional)=20; Monthly price per client=150; Number of clients=30; Hours per client per week=0.75; Working weeks per year=48; Monthly business costs=300 | 9 | yes | 3750 |
| 34 | `personal-training-business-name-generator` | generator | Your name (optional)=; Niche or audience word=strength; Location word (optional)= | 6 | — | 3312 |
| 35 | `price-increase-calculator` | calculator | Current price per client / month=150; Active clients=20; New price per client / month=180; Expected cancellations=2 | 6 | — | 2811 |
| 36 | `reel-script-generator` | generator | Topic (a short noun phrase)=protein at breakfast; Who it is for=women over 40 who lift; The one point (a full sentence)=the first meal decides the snacking at four; One number or client question=30 g of protein by 9am; Keyword (comment ask)=BREAKFAST; toggles on: Direct, Follow | 7 | yes | 3174 |
| 37 | `referral-value-calculator` | calculator | Active clients=20; Referrals per client per year=1.5; Referral conversion rate=40; Average client lifetime value=900; Cost per client from paid ads=120; Currency: 3 opts (default EUR (€)) | 5 | — | 2692 |
| 38 | `sales-objection-handler` | reader | toggles on: Too expensive | 4 | — | 1993 |
| 39 | `scope-of-practice-check` | reader | toggles on: Healthy adult, general training | 4 | — | 1842 |
| 40 | `weight-trend-reader` | reader | wt-adherence=85; toggles on: kg, Weekly, Cut, Flat, Flat | 4 | — | 1997 |
