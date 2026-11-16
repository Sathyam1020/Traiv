"""Extra original sections for Phase 5d. Prices from content/tools/platforms.ts (checked 2026-11-16)."""
from phase5_common import s

EXTRA = {
"coaching-platform-cost-calculator": [
    s("How prices move with client count",
      ("table", ["Platform", "10 clients", "60 clients", "100 clients"], [["Trainero (US page)", "USD 30", "USD 30", "USD 30"], ["HubFit", "USD 39", "USD 69", "USD 69"], ["Hevy Coach", "USD 25", "USD 160", "USD 160"], ["Kahunas", "USD 50", "USD 120", "USD 150"], ["Practice Better", "USD 35", "USD 69", "USD 69"], ["Everfit", "USD 29", "USD 120", "USD 140"], ["FitBudd", "USD 79", "USD 159", "USD 239"], ["Coachway", "EUR 114", "EUR 564", "EUR 924"]]),
      "Flat and banded prices stay steady across wide ranges, while base-plus-per-client pricing climbs with every client. Kahunas's per-seat rate falls as seats rise, so its total grows more slowly. Plans that stop at a client limit, such as PT Distinction at 50 or TrueCoach at 50 active clients, show as above the largest published tier once you pass it."),
    s("Thinking a year ahead",
      "Choose a platform for where your business is heading, not only where it is today. If you have 15 clients now and aim for 50 within a year, compare prices at both numbers. A platform that's cheap today but doubles in price at your target size may not be the best long-term choice, especially once you add the cost of switching later."),
    s("Free tiers",
      "Several platforms offer free plans for a small number of clients: Everfit's Starter plan for up to 5 clients, Practice Better's Sprout plan for up to 3 and HubFit's Free plan for up to 2. They're useful for testing a platform with real clients, but most coaches outgrow them quickly. Check what the first paid tier costs at your client count before building your business on a free plan."),
    s("Currency and where you're based",
      "Many vendors show prices in different currencies depending on where you visit from, and some charge tax on top. The table shows the currency the vendor's page displayed when checked. If you pay in another currency, your bank's exchange rate and any card fees will change the final cost. Nothing in the calculator is converted."),
    s("Annual billing",
      "Many platforms offer discounts for paying a year in advance, often 15 to 20%. The table uses monthly billing where the page shows it, so annual prices may be lower. Annual billing saves money but locks you in; it's worth it once you're confident a platform suits you."),
    s("Questions to ask vendors",
      ("ul", [
          "What exactly counts as an active client?",
          "What happens to the price when I pass my plan's client limit?",
          "Is a branded client app included, and on which plan?",
          "How are client payments processed, and where do payouts go?",
          "What's included in support, and how quickly do they respond?",
          "How easy is it to export my data if I leave?",
      ]),
      "Clear answers to these questions often matter more than a small difference in price."),
    s("Comparing with Traiv",
      "Traiv's Trainer plan is ₹999 a month for one trainer, with workout plans, diet plans, check-ins and your name and logo in the client app; its Gym plan is ₹2,499 a month for gyms with three or more trainers. Because Traiv prices in rupees, compare it in INR rather than converting. For several platforms, there's a dedicated comparison page linked from the table."),
    s("Privacy",
      "The calculator runs in your browser. Your client count isn't stored or sent anywhere."),
],
"coaching-tool-stack-cost-calculator": [
    s("Stacks for different coaches",
      ("table", ["Coach", "Typical stack"], [["Online training coach", "Workout builder, form builder, scheduler, file storage"], ["Nutrition coach", "Meal planner, form builder, scheduler, video calls"], ["Hybrid coach", "Workout builder, meal planner, forms, scheduler, community"], ["Group programme coach", "Workout builder, community platform, email, payments"]]),
      "Untick the tools you don't use and add up what you actually pay. Most coaches find at least one subscription they'd forgotten about."),
    s("Per-client tools",
      "Some tools in a stack charge per client or per seat, such as a workout builder with client limits or a scheduler priced per seat. As you grow, those costs rise too, which moves the break-even point. Check each tool's pricing page for limits, and update the price in the calculator when you move up a tier. The default workout builder, TrueCoach Standard, covers up to 20 active clients; above that, its Pro plan is USD 136.99 a month."),
    s("Break-even, explained",
      "The break-even is the client count where the chosen all-in-one platform starts to cost more each month than your stack. With a flat-priced platform, there may be no break-even at all within 500 clients. With per-client pricing, it can arrive quickly. Drag the client slider to see how the comparison changes as you grow."),
    s("Time saved",
      "Using one platform instead of several often saves time each week: fewer logins, no copying data between tools, one place to review check-ins and reply. If you save even two hours a week and value your time at USD 40 an hour, that's about USD 350 a month, more than many stacks cost. The subscription total is only part of the picture."),
    s("Client experience",
      "Clients notice when they have to use several apps. A workout in one place, meals in another, a form link for check-ins and messages in a chat app can feel disjointed, and some clients stop engaging. One app where everything lives together is usually easier for clients to follow, which supports results and retention."),
    s("When to switch",
      "Switching from a stack to an all-in-one makes most sense when the all-in-one is cheaper or similar in price at your client count, covers the features you rely on, and you have time to move clients carefully. Plan the move: rebuild templates first, move a few clients, then the rest. Cancel the old subscriptions only once everyone is settled."),
    s("Keeping a stack well organised",
      "If you keep a stack, make it work smoothly. Use the same login email for every tool, link them where integrations exist, keep a simple document of which tool does what, and review costs once a year. A well-organised stack can work well; a disorganised one costs time every day."),
    s("Comparing with Traiv",
      "Traiv's Trainer plan is ₹999 a month for one trainer and covers workout plans, diet plans and check-ins, with your name and logo in the client app. It's the default comparison, so the result shows how much your stack costs against it straight away. Replace the default tool prices with your own invoices for an exact figure."),
    s("A worked comparison at 40 clients",
      "With the default stack at USD 235.98 a month, Everfit Pro at 40 clients is USD 95 a month for up to 50 clients, still well under the stack. Hevy Coach at 40 clients is USD 90. The default workout builder in the stack, TrueCoach Standard, covers only 20 active clients, so a coach with 40 clients would need TrueCoach Pro at USD 136.99 instead, raising the stack to USD 314.98."),
    s("Privacy",
      "The calculator runs entirely in your browser. Your prices and choices aren't stored or sent."),
],
"coaching-platform-fit-finder": [
    s("When Traiv is the suggestion",
      "The finder suggests Traiv when you coach training, nutrition or both, want a paid all-in-one rather than a free tier, aren't working in US clinical settings, don't yet have an established roster of 60 or more, and want a branded app. Traiv's Trainer plan, at ₹999 a month, covers workout plans, diet plans and check-ins with your name and logo in the client app, and it's priced in rupees."),
    s("When another platform is better",
      "If you work in US clinical or insurance settings, a practice-management platform will suit you better than any fitness coaching app. If you only coach training and don't care about branding, a workout-first app may be simpler and cheaper. If you want to test for free with a few clients, a free tier is a sensible start. If you have a large roster, per-seat pricing can be very economical. The finder points you to these options when they fit."),
    s("The second option",
      "Every suggestion includes a second option, because no single platform suits everyone perfectly. If the first suggestion doesn't feel right after a trial, the second is a good next step. Shortlisting two platforms and testing both with a few clients is often the quickest way to decide."),
    s("Questions to ask in a trial",
      ("ul", [
          "How long does it take to build a programme or meal plan?",
          "How easy is it for clients to log workouts and food?",
          "How quickly can you review a check-in and reply?",
          "Do clients find the app easy to use?",
          "What does it cost at your client count in a year's time?",
      ]),
      "Answering these with real clients tells you more than any comparison table."),
    s("Thinking about growth",
      "Choose a platform that suits your next year as well as today. If you plan to add a group programme, hire an assistant coach or double your client count, check how the platform handles those changes and what it will cost. The platform cost calculator compares prices at any client count."),
    s("Training, nutrition or both",
      "Coaches who programme training only need a strong workout builder, an exercise library with demonstrations and easy logging for clients. Nutrition coaches need meal plans, recipes, food logging and check-ins focused on habits. Coaches who do both benefit most from one platform that handles both well, so plans, logs and check-ins live in the same app. The finder weighs your answer to the first question heavily for this reason."),
    s("Client count and pricing",
      "If you're just starting, a free tier or a low flat price keeps costs down while you build. If you're growing, look at how the price changes between 15 and 60 clients. If you're established, per-seat pricing or plans with high client limits often work out cheapest per client. The platform cost calculator shows each platform's price at any client count."),
    s("Starting fresh versus switching",
      "If you're choosing your first platform, you can pick on fit alone. If you're switching, weigh the move itself: rebuilding programmes, moving client data and helping clients onto a new app. A platform that fits slightly better may not be worth a disruptive move. If you're mostly happy where you are, it may be better to stay and use the finder again when your needs change."),
    s("Privacy",
      "The finder runs in your browser. Your answers aren't stored or sent anywhere."),
],
}

EXTRA["coaching-tool-stack-cost-calculator"] += [
    s("Annual versus monthly billing",
      "Several tools in a typical stack show lower prices for annual billing. The community default, Circle Professional, is listed on an annual billing basis, and Calendly's page suggests its listed per-seat price may also reflect yearly billing. If you pay monthly, your real costs may be higher than the defaults. Check your invoices and enter what you actually pay."),
    s("Taxes",
      "Many software subscriptions add VAT or sales tax depending on where you are. List prices usually exclude it. If you want the calculator to reflect what leaves your account, enter prices including tax for every tool, and compare with an all-in-one price that includes tax too."),
]

EXTRA["coaching-platform-cost-calculator"] += [
    s("Branding and your business",
      "When a client opens their coaching app every day, the name they see matters. A platform's own brand reminds them they're using someone else's product; your name and logo remind them they're working with you. For many coaches that difference shows up in referrals and retention, which is why the calculator lets you hide platforms that don't offer client-app branding at all."),
    s("Reading the table on a phone",
      "On a small screen, the table scrolls sideways. Platform and price stay at the left, followed by what the price covers, the branding position and the source with its check date. Tap 'vendor page' to open the pricing page the figure came from, and 'Compare with Traiv' where a detailed comparison page exists."),
    s("Platforms we couldn't price",
      "Six platforms show 'Check vendor price'. My PT Hub's and Paperbell's pages couldn't be read when checked. FitSW calculates its price in the page itself, so no fixed figure was readable. Trainerize's page showed conflicting figures for the same plans. Exercise.com and Virtuagym give prices only on request. Rather than guess, we link to each page so you can see the current figure yourself."),
    s("Price is one part of the decision",
      "A cheaper platform that your clients find hard to use can cost you more in churn than it saves in subscriptions. Use the price table to shortlist, then judge the shortlist on the things clients feel every week: how easy the app is, how quickly they can log a session or a meal, and how check-ins and messages work."),
]

EXTRA["coaching-tool-stack-cost-calculator"] += [
    s("Comparing with other platforms",
      "Choose any platform with published pricing from the list to compare with it instead of Traiv. Platforms priced in USD or EUR are calculated at your client count, with the saving and break-even shown once your currency matches theirs. Set the currency, enter your tool costs in it, and the comparison updates as you drag the client slider."),
    s("The yearly view",
      "Monthly costs can look small; yearly totals show the real scale. At the default prices, the stack is about ₹2,66,100 a year. Even if your own invoices are half the defaults, that's still well over ₹1,00,000 a year on subscriptions. Seeing the yearly figure is often what prompts coaches to review their tools."),
    s("Starting this week",
      "List every subscription you pay for, untick the defaults you don't use, and replace each price with the figure on your last invoice. Note the monthly and yearly totals, compare them with an all-in-one, and decide whether any tool can go."),
]

EXTRA["coaching-platform-fit-finder"] += [
    s("A worked example",
      "A coach who programmes both training and nutrition, has 15 to 60 clients, wants a branded app, prefers to keep payments in their own account, wants a paid all-in-one and coaches outside US clinical settings gets Traiv as the suggestion, with PT Distinction as the second option. Change the market to US clinical and the suggestion becomes Practice Better. Change the start to free and it becomes Everfit's free Starter plan."),
    s("Confirm before you commit",
      "Prices, plans and features change. Every reason shown comes from vendor pages checked on 16 November 2026, but always open the vendor's pricing page and start a trial before moving clients. The platform cost calculator links each vendor's page with its check date."),
]

EXTRA["coaching-platform-cost-calculator"] += [
    s("Why prices differ so much",
      "Coaching platforms serve different coaches. Some are built for solo online coaches and price low for small rosters. Some target studios and gyms, with higher prices and more staff features. Some are practice-management tools for dietitians and therapists. Some focus on one thing, such as workouts, and keep the price low by doing less. When two prices differ a lot, it's usually because the platforms are aimed at different coaches, not because one is overcharging."),
    s("Prices in rupees",
      "Most platforms in the table price in US dollars or euros. Traiv prices in rupees: the Trainer plan is ₹999 a month and the Gym plan ₹2,499 a month for gyms with three or more trainers. Choose INR in the currency filter to see rupee-priced plans on their own. If you pay a USD or EUR platform from an Indian card, the amount charged will depend on your bank's exchange rate and any foreign transaction fee."),
    s("Using the calculator",
      ("ol", [
          "Set your current number of active clients.",
          "Filter by the currency you'd pay in, if you like.",
          "Tick the branding filter if a branded client app matters to you.",
          "Note the three or four lowest prices that meet your needs.",
          "Open each vendor page to confirm the current price and plan details.",
          "Repeat at the client count you expect in a year.",
      ]),
      "That gives you a realistic shortlist to trial."),
]

EXTRA["coaching-tool-stack-cost-calculator"] += [
    s("What each default covers",
      ("ul", [
          "**Workout builder:** TrueCoach Standard, which lists up to 20 active clients at USD 57.99 a month.",
          "**Meal planning:** That Clean Life Starter at USD 30 a month, billed monthly.",
          "**Check-in forms:** Typeform Basic at USD 39 a month, billed monthly.",
          "**Scheduling:** Calendly Standard at USD 10 per seat, as listed.",
          "**File storage:** Dropbox Plus with 2 TB at USD 9.99 a month, billed monthly.",
          "**Community:** Circle Professional at USD 89 a month, listed on an annual billing basis.",
          "**Payments:** most processors charge per transaction rather than monthly, so the default is zero.",
      ]),
      "Each is converted to rupees at 93.97 INR per USD as a starting point. Replace them with your own figures."),
    s("Gyms and teams",
      "If several coaches work under one business, many separate tools charge per seat, so the stack grows with each coach. Traiv's Gym plan is ₹2,499 a month for gyms with three or more trainers. To compare, multiply the per-seat tools in your stack by the number of coaches, and compare the total with the gym plan you're considering."),
    s("Questions to ask before cancelling a tool",
      ("ul", [
          "Does the all-in-one do this job as well, or well enough?",
          "Will clients lose anything they use every week?",
          "Can you export your data, such as programmes, forms or videos, before cancelling?",
          "Is there a contract or annual renewal date to plan around?",
      ]),
      "Cancel only once clients are settled in the new setup and your data is safe."),
]

EXTRA["coaching-platform-fit-finder"] += [
    s("Why the market question matters",
      "Coaching in a healthcare setting, especially in the US where insurance billing is common, needs software built for clinical practice: notes, intake, compliance and billing features most fitness platforms don't have. Coaching outside those settings usually needs strong programme and nutrition tools, check-ins, messaging and a good client app instead. That's why the finder changes its answer so much on the last question."),
    s("Branded app: yes, nice to have or no",
      "If you answer yes or nice to have, the finder leans towards platforms that include branding on the plan you'd use, such as Traiv's Trainer plan or PT Distinction's Pro plan. If you answer no and coach training only, it can suggest a workout-first app such as Hevy Coach, where clients use the standard Hevy app. Branding isn't essential for every coach, but for many it helps clients see the coaching as part of your business."),
]

EXTRA["coaching-platform-cost-calculator"] += [
    s("Free trials",
      "Most platforms offer either a free plan or a free trial. Traiv offers a 14-day free trial of the Trainer plan. Use a trial to rebuild one real programme, run a check-in and ask a client to use the app for a week. That tells you more about value than the price alone, and it shows whether the platform will actually save you time."),
    s("Hidden costs to watch for",
      ("ul", [
          "One-time setup fees for branded apps.",
          "Apple and Google developer account fees for white-label apps.",
          "Extra charges per client above a plan's limit.",
          "Payment processing fees on client payments.",
          "Taxes added at checkout.",
      ]),
      "None of these are in the base price shown. Add the ones that apply to you when comparing."),
    s("When the cheapest isn't the best",
      "The lowest price at your client count is a good starting point, not a decision. A platform that saves USD 20 a month but costs you two hours a week in workarounds, or makes clients less likely to log their sessions, is more expensive in practice. Weigh price against the time it saves you and how well your clients use it."),
]

EXTRA["coaching-tool-stack-cost-calculator"] += [
    s("Why the stack stays flat",
      "Most tools in a typical stack charge per account rather than per client, so their price doesn't change whether you coach 10 clients or 40. That's why the stack line is flat in the calculator. Many coaching platforms charge more as clients grow, which is why break-even exists. Traiv's Trainer plan is a single monthly price for one trainer, so the comparison with Traiv doesn't change as you drag the client slider."),
    s("Hours across several tools",
      "Every extra tool adds small tasks: logging in, copying a client's details, sending a link, checking another inbox. Spread across a week and a full roster, those minutes add up. Coaches who move to one platform often say the biggest gain wasn't the subscription saving but the time they got back for coaching."),
    s("Privacy and data",
      "When client information is spread across several tools, it's stored in several places, each with its own privacy terms. Fewer tools means fewer places holding personal and health data, which is simpler to manage and easier to explain to clients."),
]

EXTRA["coaching-platform-fit-finder"] += [
    s("Starting this week",
      "Answer the six questions honestly for where your business is now, note the suggestion and the second option, and open both pricing pages. Start a trial with the one that fits best, rebuild one real programme and invite two clients to try it for two weeks."),
]

EXTRA["coaching-platform-cost-calculator"] += [
    s("Starting this week",
      "Set your client count, note the platforms that fit your budget and branding needs, then open two or three vendor pages to confirm today's prices. Try the one that fits best with a few clients before deciding."),
]

EXTRA["coaching-tool-stack-cost-calculator"] += [
    s("A worked comparison with your own numbers",
      "Suppose you pay ₹2,500 a month for a workout app, ₹1,200 for a form builder and ₹800 for scheduling, and don't use the other tools. Untick meal planning, storage and community, and enter those three figures. Your stack becomes ₹4,500 a month, or ₹54,000 a year. Against Traiv at ₹999 a month, that's ₹3,501 a month less, or ₹42,012 a year, before counting the time saved by using one app."),
    s("What to do with the result",
      "If the all-in-one is clearly cheaper and covers what you need, plan a move: rebuild your templates, trial it with a few clients, then switch the rest and cancel the old tools. If your stack is cheaper or does something you can't replace, keep it, but review it each year. Either way, you'll know exactly what your tools cost."),
]

EXTRA["coaching-platform-fit-finder"] += [
    s("Coaching both training and nutrition",
      "Coaches who handle both training and nutrition often run into the biggest stack problem: one app for workouts, another for meal plans and a third for check-ins. A platform that covers both in one place saves time and gives clients a single app to follow. That's one reason the finder leans towards an all-in-one for this answer, when a branded app and a paid start are also chosen."),
    s("Group and online programmes",
      "If most of your income comes from group programmes or self-led plans, check how each platform handles groups: shared programmes, group messaging or community features, and pricing when many clients join at once. The finder's suggestions focus on one-to-one coaching; for group-heavy businesses, compare group features directly on each vendor's site."),
]

EXTRA["coaching-platform-cost-calculator"] += [
    s("Keeping prices honest",
      "We'd rather show 'Check vendor price' than a figure we can't stand behind. If you spot a price that has changed since the check date, the vendor page linked in that row is the place to confirm it."),
]

EXTRA["coaching-tool-stack-cost-calculator"] += [
    s("Exchange rates",
      "The default rupee figures use one dated rate, 93.97 INR per USD from x-rates.com on 16 November 2026. Your card may charge a different rate plus a foreign transaction fee, so your real rupee cost for USD tools is often a little higher. Enter the amount that actually leaves your account."),
    s("Reviewing again later",
      "Revisit the calculator when you add a tool, when a vendor changes its price or when your client count changes a lot. Keeping the numbers current turns it into a quick yearly check on what your business spends to run."),
]

EXTRA["coaching-platform-fit-finder"] += [
    s("Revisit as you grow",
      "Your answers will change as your business does. A coach who starts with a free plan may want a branded all-in-one a year later; a growing roster may make per-seat pricing attractive. Take the finder again whenever your client count, offer or market changes."),
]

EXTRA["coaching-tool-stack-cost-calculator"] += [
    s("Keeping it simple for clients",
      "Every tool you cut is one less app, login or link for your clients. Fewer moving parts means fewer missed check-ins and fewer 'where do I find my plan?' messages, which is good for them and for you."),
]
EXTRA["coaching-platform-fit-finder"] += [
    s("Honest by design",
      "The finder only recommends Traiv when it genuinely fits. In most other combinations of answers, it points you elsewhere, with the reasons and the vendor's pricing page."),
]

EXTRA["coaching-tool-stack-cost-calculator"] += [s("Nothing leaves this page", "Prices you edit, tools you untick and the platform you pick stay on your device. Reload the page to start again from the defaults.")]
