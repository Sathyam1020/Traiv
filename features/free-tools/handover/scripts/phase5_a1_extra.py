"""Extra original sections for Phase 5a batch 1."""
from phase5_common import s

EXTRA = {
"ad-spend-breakeven-calculator": [
    s("Breakeven by package type",
      ("table", ["Package", "Price", "Margin", "Breakeven cost per client"], [["Monthly, avg 4 months at €150", "€600", "80%", "€480"], ["12-week programme", "€750", "75%", "€563"], ["6 months at €200", "€1,200", "70%", "€840"], ["In-person, 3 months at €400", "€1,200", "50%", "€600"]]),
      "Higher-value packages can carry a higher cost per client. That is one reason longer commitments and better retention make ads more viable: the same lead costs can be absorbed by more revenue."),
    s("Tracking the right numbers each month",
      ("ul", [
          "**Spend:** the total charged by every ad platform.",
          "**Leads:** counted the same way each month.",
          "**New clients from ads:** ask every new client where they came from, and check against ad tracking.",
          "**Revenue per client:** what they actually paid, updated as they renew or leave.",
      ]),
      "A simple monthly row in a spreadsheet with these four numbers lets you re-run the calculator with real figures and see the trend over a quarter."),
    s("Ads and attribution",
      "Ad platforms often take credit for clients who would have found you anyway, for example someone who followed you for months and clicked an ad on the day they decided. Others under-count, missing people who saw an ad, then searched for you by name a week later.",
      "Asking new clients how they heard about you, and comparing that with the platform's figures, gives a more honest view. If both agree that ads brought five clients, you can trust the calculation. If they disagree sharply, use the more conservative number until you know more."),
    s("For coaches: a monthly ads review",
      "Once a month, enter last month's real spend, leads, clients and package value into the calculator. Compare cost per client with breakeven. If it is well below, consider a modest budget increase. If it is close to or above breakeven, pause the weakest ads and look at conversion before spending more.",
      "Keep notes on what changed each month: new creative, a different audience, a new offer, a seasonal shift. Over a year, those notes show which changes actually moved cost per client."),
    s("Seasonality",
      "Coaching demand rises and falls through the year. Many coaches see more interest in January, before summer and after holidays, and less during holiday periods. Cost per lead and conversion often shift with these seasons. Compare months with the same month last year where possible, and plan budgets around the busier periods."),
],
"customer-acquisition-cost-calculator": [
    s("CAC for different business models",
      ("table", ["Model", "Typical price", "Typical lifetime", "LTV", "CAC for 3 to 1"], [["Online monthly coaching", "€150", "6 months", "€900", "€300 or less"], ["Premium online coaching", "€300", "8 months", "€2,400", "€800 or less"], ["In-person personal training", "€400", "5 months", "€2,000", "€667 or less"], ["12-week programme", "€600", "1 programme", "€600", "€200 or less"]]),
      "These figures are illustrations, not benchmarks. Your own prices and retention set your targets. The point is that higher-value, longer-lasting clients can justify much higher acquisition costs."),
    s("Blended and paid CAC",
      "Blended CAC divides all marketing spend by all new clients, including those from referrals and organic channels. Paid CAC divides only paid spend by only paid clients. Blended CAC is usually lower and looks better, but it can hide an expensive ads channel subsidised by free referrals.",
      "Track both if you run ads. Blended CAC tells you the health of acquisition overall. Paid CAC tells you whether the ads themselves are worth it, which is the number that matters when deciding whether to increase ad spend."),
    s("When CAC rises",
      "CAC often creeps up over time. Ad costs increase, audiences become saturated, competition grows. If CAC rises while LTV stays the same, the ratio falls and margins shrink. Watch the trend over several months rather than a single month, which can be distorted by holidays or one-off campaigns.",
      "If CAC keeps rising, look at conversion first. Improving how leads are followed up, how calls are run and how the offer is presented often brings CAC back down faster than changing ads."),
    s("Using the ratio to decide on growth",
      "A healthy ratio and short payback mean that each new client is profitable quickly, so investing more in acquisition is likely to pay off. A low ratio or long payback means growth costs more than it returns, and spending more would make things worse.",
      "Before increasing spend, check capacity. If you can't deliver well to more clients, lower retention will reduce LTV and undo the gains. The client capacity calculator helps check that."),
    s("For coaches: a quarterly review",
      "Every quarter, gather spend, new clients by source, average price and average lifetime. Enter the totals into the calculator, then repeat for each major channel. Note which channel has the best ratio and payback, and decide where to put more effort and where to cut back.",
      "Revisit average lifetime with real data. Many coaches overestimate how long clients stay. Using your actual figure makes the ratio more honest and the decisions better."),
    s("Common mistakes",
      ("ul", [
          "**Counting only ad spend:** tools, help and discounts are acquisition costs too.",
          "**Using an optimistic lifetime:** use real retention data, not a hope.",
          "**Mixing currencies:** enter every figure in the same currency.",
          "**Judging one month:** use several months to smooth out noise.",
          "**Ignoring delivery costs:** a 3 to 1 ratio on revenue may be thin if margins are low.",
      ]),
      "Avoiding these keeps CAC a useful guide rather than a reassuring but misleading number."),
    s("CAC and pricing",
      "Raising prices increases LTV and improves the ratio, as long as conversion and retention hold. A 20% price rise with no change in conversion improves the ratio by 20%. If conversion falls, the effect depends on how much. The price increase calculator can help model existing clients' response; for new clients, test a higher price on a share of new leads and compare cost per client."),
],
"discovery-call-calculator": [
    s("Calls by lead source",
      ("table", ["Source", "Example close rate", "What it suggests"], [["Client referrals", "50 to 70%", "Warm, trusting leads; prioritise these"], ["Long-time social followers", "30 to 50%", "Content is doing much of the selling"], ["Paid ads", "15 to 30%", "Colder leads; qualification and follow-up matter most"], ["Cold outreach", "Under 15%", "Low intent; often not worth the time"]]),
      "These are illustrations, not benchmarks. Your own figures will differ. What matters is comparing your sources and noticing which bring the calls most likely to convert."),
    s("Handling common objections",
      ("ul", [
          "**'It's too expensive.'** Ask what they compared it with, restate what's included, and, if it fits, offer a payment plan rather than a discount.",
          "**'I need to think about it.'** Ask what they want to think through, and offer to answer it now or follow up on a set day.",
          "**'I don't have time.'** Explain how much time the coaching actually takes each week and how it fits around their schedule.",
          "**'I've tried before and failed.'** Ask what didn't work and explain what will be different this time.",
      ]),
      "Objections are often questions in disguise. Answering them honestly builds trust, even when the person doesn't sign straight away."),
    s("Call length and format",
      "Most coaching discovery calls run 20 to 45 minutes. Shorter calls suit lower-priced offers and warm leads; longer calls suit premium coaching where more needs to be understood. Video calls feel more personal than phone calls and let you show your app or a sample plan.",
      "Whatever the length, keep a consistent structure. It is easier to improve a call when each one follows the same steps."),
    s("Measuring call quality",
      "Close rate is the headline number, but other measures help. Show-up rate shows how many booked calls actually happen; a low rate suggests reminders or a booking deposit may help. Average client value shows whether calls are converting into the right package. Time per call shows the real cost of each one.",
      "Tracking these together makes it clear where to focus. If show-up is low, fix reminders. If close is low, work on the call. If client value is low, look at the offer."),
    s("For coaches: a monthly calls review",
      "At the end of each month, enter your calls, close rate and average client value. Compare with the previous month. Listen back to one call that closed and one that didn't, if you recorded them with permission, and note one thing to change. Small, steady improvements in close rate add up to a lot of revenue over a year."),
    s("Raising client value",
      "Client value is the third lever. Offering a longer package, a premium tier with more support, or a clear path from a starter programme to ongoing coaching can raise average value without changing calls or close rate.",
      "Be careful not to push clients into packages they don't need. The right package for each person retains better, which raises lifetime value in the long run."),
],
"email-list-value-calculator": [
    s("What different list sizes are worth",
      ("table", ["Subscribers", "Buyers per campaign", "Revenue per campaign", "With 12 campaigns a year"], [["250", "0.4", "€120", "€1,440"], ["500", "0.8", "€240", "€2,880"], ["1,000", "1.6", "€480", "€5,760"], ["2,500", "4.0", "€1,200", "€14,400"], ["5,000", "8.0", "€2,400", "€28,800"]]),
      "At the default rates, value scales directly with size. In reality, larger lists often have slightly lower engagement, so treat these as upper estimates."),
    s("Offer price and list value",
      "The offer price has a direct effect. Selling a €300 package at these rates brings €240 a campaign. Selling a €100 starter programme brings €80, unless the lower price raises conversion enough to compensate. Many coaches use a low-priced offer to turn subscribers into first-time buyers, then invite them to full coaching.",
      "If you sell several offers, run the calculator for each and compare. The best offer for the list is the one that brings the most revenue over time, including follow-on sales."),
    s("Segmenting the list",
      "Not everyone on the list wants the same thing. Segmenting by interest, such as fat loss, strength or nutrition, or by stage, such as new subscribers or past clients, lets you send more relevant emails. Relevant emails get more opens, more clicks and more sales.",
      "Even simple segmentation, such as asking new subscribers one question about their goal, can lift results noticeably."),
    s("Past clients on the list",
      "Past clients are often the most valuable subscribers. They know your coaching, trust you and may return or refer others. Keep them on the list with their permission, send them useful content and let them know when you have space or a new offer. Many coaches find a meaningful share of new clients come from people who coached with them before."),
    s("For coaches: a simple email rhythm",
      ("ol", [
          "Week 1: a useful tip or short story.",
          "Week 2: a client result, with permission.",
          "Week 3: a useful tip or recipe.",
          "Week 4: a clear offer email with one call to action.",
      ]),
      "This rhythm keeps the list engaged and makes offer emails feel natural. Track clicks and sales each month and enter them into the calculator to see how the list's value changes as it grows."),
    s("Email and social media together",
      "Social media is good for reach, email for conversion. Use social posts to invite people onto your list with a useful free resource, then use email to build trust and make offers. Many coaches find that clients who joined the list first and bought later stay longer than those who bought straight from a post.",
      "Mentioning your newsletter in posts, stories and your profile link steadily grows the list without paid ads."),
],
"free-trial-conversion-calculator": [
    s("The first three days",
      "What happens in the first three days of a trial predicts conversion more than anything else. Clients who receive their plan, complete a first workout or check-in, and get a personal message from you in that window are far more likely to continue. Clients who sign up and hear nothing for days often never engage.",
      ("ol", [
          "Day 1: a welcome message and their first plan.",
          "Day 2: a quick check that they've started, with a tip.",
          "Day 3: a short check-in on how it's going.",
      ]),
      "Automating parts of this, while keeping a personal touch, keeps early engagement high without taking hours."),
    s("Conversion by trial length",
      "Longer trials give people more time to see results, but they also delay revenue and let urgency fade. Shorter trials keep momentum but may not show enough value. Many coaches find 7 to 14 days the sweet spot.",
      "Test lengths if you are unsure. Compare not only conversion rate but cost per paying client and how long converted clients stay. The best trial length is the one that produces the most long-term clients for the effort."),
    s("Turning the trial end into a conversation",
      "In the last few days of a trial, invite the client to a short review call or message exchange. Look back at what they've done, show their progress, and explain how full coaching continues from here. Then ask clearly if they would like to continue.",
      "Clients who have a conversation at the end of a trial convert at much higher rates than those who simply receive a reminder email. It also gives you useful feedback from those who don't continue."),
    s("Free trial or money-back guarantee?",
      "Some coaches replace trials with a guarantee: clients pay from the start, but can get a refund within a set period if it isn't right for them. This brings in more committed clients and avoids the work of trials that never convert. It also signals confidence in the coaching.",
      "Guarantees and trials both reduce risk for the client. Choose the one that fits your offer and test it against the other if you're unsure."),
    s("For coaches: a monthly trial review",
      "Each month, enter trials, conversions, price, churn and ad spend into the calculator. Note your conversion rate and cost per paying client. Look at which trials converted and what they had in common. Make one change to the trial experience and compare next month's numbers.",
      "Over a few months, small, focused changes to onboarding and the end-of-trial conversation usually lift conversion more than increasing ad spend."),
    s("Common trial mistakes",
      ("ul", [
          "**No onboarding:** trial clients who don't start in the first days rarely convert.",
          "**No ask:** waiting for clients to decide on their own loses many who would have continued.",
          "**Too many trials at once:** quality drops when you can't give each person attention.",
          "**A trial that doesn't match the full product:** clients who convert expecting something different leave quickly.",
      ]),
      "Fixing these is often the quickest way to a higher conversion rate."),
],
"referral-value-calculator": [
    s("Building a simple referral programme",
      ("ol", [
          "Decide when you'll ask: after milestones, at review points, or both.",
          "Write a short, specific ask you can adapt for each client.",
          "Create a shareable link or message for clients to send.",
          "Decide whether to offer a reward, and keep it simple.",
          "Track every referral and who sent it.",
          "Thank every referrer personally.",
      ]),
      "A programme like this takes an hour to set up and a few minutes a week to run. At the default numbers, even a small lift in referrals per client is worth thousands a year."),
    s("Referral conversion rate",
      "Referral conversion is the share of referred people who become clients. It is usually higher than for other leads, because trust is already there. If yours is low, the problem is often the first contact: a slow reply, a generic message, or a process that feels like a sales funnel rather than a personal recommendation.",
      "Reply to referrals quickly and personally. Mention the person who referred them, ask about their goals and offer a friendly conversation rather than a hard sell."),
    s("Referrals from people who aren't clients",
      "Referrals don't only come from clients. Physiotherapists, doctors, dietitians, gym owners and other professionals can refer people who need coaching. Building relationships with a few local or online professionals can bring a steady flow of well-matched clients.",
      "Be clear about what you offer and who it suits, keep referrers updated with permission, and refer to them in return where appropriate."),
    s("Lifetime value for referred clients",
      "If referred clients stay longer than average in your business, use their actual lifetime value in the calculator. Many coaches find referred clients stay longer because they have a friend in a similar situation and arrived with realistic expectations. Even a modest difference in lifetime makes referrals more valuable still."),
    s("For coaches: a quarterly referral review",
      "Every quarter, count referrals, conversions and the clients who referred. Enter the totals into the calculator. Compare with the previous quarter and with your paid acquisition cost. Note which moments produced the most referrals and plan more of them.",
      "Share the results with your clients, too. Thanking them and telling them their friend is doing well reinforces the habit of referring."),
],
}

MORE = {
"ad-spend-breakeven-calculator": [
    s("Leads, calls and clients: the full path",
      "For many coaches, an ad lead doesn't become a client directly. It books a call, the call happens, and some calls close. Each step loses people. If 50 leads book 25 calls, 20 people show up and 5 sign, the lead-to-client rate is 10%, but the weak points are booking and show-up, not the call itself.",
      "Breaking the conversion rate into its steps shows where to focus. Faster replies raise booking. Reminders and a small deposit raise show-up. A clearer offer raises close rate. Each improvement lowers cost per client without touching the ads."),
    s("Margin examples for different coaches",
      ("table", ["Coach", "Main delivery costs", "Typical gross margin"], [["Solo online coach", "Software, payment fees", "80 to 90%"], ["Online coach with assistant", "Software, fees, assistant pay", "55 to 70%"], ["In-person trainer, own studio", "Rent share, equipment, fees", "50 to 70%"], ["Trainer renting gym space", "Rent per session, fees", "40 to 60%"]]),
      "Use your own costs rather than these ranges. Work out what it costs to deliver one client for the length of their package, divide by the price, and subtract from 100%."),
    s("Stopping ads that don't work",
      "If cost per client stays above breakeven for several weeks despite changes to creative and targeting, pause the ads and look at the offer and conversion process. Continuing to spend on ads that lose money only makes the loss bigger. Many coaches restart later with a clearer offer, better follow-up and a known conversion rate, and find the same ads now pay."),
],
"customer-acquisition-cost-calculator": [
    s("A worked improvement plan",
      "Start: €1,200 spend, 3 clients, €150 price, 6-month lifetime. CAC is €400, LTV €900, ratio 2.25 to 1, payback 2.7 months. Step one: improve follow-up so conversion rises and 4 clients come from the same spend. CAC falls to €300, ratio 3 to 1. Step two: improve retention so clients stay 8 months. LTV rises to €1,200, ratio 4 to 1, payback 2 months.",
      "Neither step needs more ad spend. Together they turn a marginal business into a healthy one. That is the typical shape of improvement: conversion first, then retention."),
    s("CAC for in-person trainers",
      "In-person trainers often win clients through the gym floor, word of mouth and local partnerships rather than ads. Their cash CAC can be very low, but the time cost is real: hours spent on the floor, free sessions and consultations. If you want a fuller picture, estimate the hours spent winning clients each month, put a value on them, and add that to marketing spend.",
      "That doesn't mean these channels are bad. Often they are the best channels available. Counting their time cost simply makes it easier to compare them fairly with paid options."),
    s("Payback and upfront payment",
      "Asking clients to pay for a block upfront, such as 12 weeks, shortens payback immediately. A €400 CAC against a €450 upfront payment is repaid on day one. Monthly billing at €150 takes nearly three months. Offering a small discount for upfront payment can be worth it for both cash flow and commitment.",
      "Upfront packages also tend to improve completion, because clients have committed to the full period."),
    s("When the ratio looks too good",
      "A ratio above 8 or 10 to 1 can mean you are underinvesting in growth, but it can also mean the inputs are off. Check that spend includes every cost, that clients counted really came from marketing, and that lifetime reflects real retention. If the ratio holds up, it may be time to test a larger budget carefully."),
],
"discovery-call-calculator": [
    s("Show-up rate",
      "A call that never happens is worth nothing. If 25 calls are booked and only 20 happen, a fifth of your potential revenue disappears before the conversation starts. Send a confirmation straight after booking, a reminder the day before and a short message an hour before. Ask people to reschedule rather than miss the call if something comes up.",
      "Some coaches ask for a short questionnaire when booking. People who complete it are more likely to show up, and you arrive better prepared."),
    s("After the call",
      "Whether they sign or not, send a summary within a few hours: what you discussed, what you recommended and the next step. For those who sign, start onboarding straight away while motivation is high. For those who don't, follow up once or twice over the next week, then add them to your email list with their permission.",
      "A surprising number of clients sign weeks or months after a call, once timing suits them. Staying in touch costs little and keeps you in mind."),
],
"email-list-value-calculator": [
    s("Click rate and offer clarity",
      "The click rate depends heavily on how clear and relevant the offer is. An email with one clear purpose and one link tends to get more clicks than a newsletter with ten links. Explain who the offer is for, what changes for them and what to do next. Put the link early and again at the end.",
      "If click rate is low despite good open rates, the email isn't making a strong enough case. If clicks are healthy but sales are low, the page they land on needs work."),
    s("Landing page conversion",
      "Purchase conversion happens on the page subscribers click to. That page should match the email: same offer, same promise, same tone. Include who it's for, what's included, price, proof and a clear button. Remove distractions such as menus and unrelated links.",
      "Test the page on a phone. Most subscribers read email on mobile, and a page that is slow or hard to use on a small screen loses sales."),
    s("Tracking list growth",
      "Each month, record subscribers gained, subscribers lost and the main sources of new sign-ups. Enter your current list size and rates into the calculator to see how the value per campaign changes. Over time, this shows which sign-up sources bring subscribers who actually buy."),
],
"free-trial-conversion-calculator": [
    s("Trials and capacity",
      "Forty trials a month means forty new people to onboard, guide and talk to. If each needs an hour across the trial, that is ten hours a week on trials alone. Check your client capacity before scaling trial volume. A smaller number of well-run trials often produces more clients than a flood of trials you can't support properly."),
    s("Lifetime value of each cohort",
      "The calculator estimates what each month's converted clients are worth over their lifetime, based on churn. At €3,000 of new monthly revenue and 5% churn, that cohort is worth about €60,000. At 10% churn, it is worth €30,000. Halving churn doubles the value of every trial you convert, which is why retention and conversion should be improved together.",
      "Compare that lifetime value with the ad spend that produced it. €1,600 of ads producing €60,000 of lifetime revenue is an excellent return, even before improving anything."),
    s("Reading a low conversion rate",
      "If conversion is low, ask the people who didn't continue why. Common answers are price, timing, not seeing enough progress, or the trial feeling impersonal. Each points to a different fix: clearer pricing upfront, better onboarding, a quick early win, or more personal contact. Even a handful of answers is usually enough to see a pattern."),
],
"referral-value-calculator": [
    s("Referrals and capacity",
      "A successful referral programme can bring more clients than you can comfortably serve. Before pushing referrals hard, check your capacity. If you are near full, consider a waiting list, a price increase or bringing in help. A waiting list can itself increase demand, because people value what others are waiting for."),
    s("A worked year",
      "A coach with 20 clients starts asking for referrals at milestones and review points. Over the year, referrals per client rise from 1.0 to 2.0 and conversion stays at 40%. New referral clients rise from 8 to 16. At a lifetime value of €900, referral revenue grows from €7,200 to €14,400. At a paid acquisition cost of €120, the coach avoids €1,920 in ad spend.",
      "The only investment was a few minutes per client asking at the right time, and a simple way to share the booking link."),
    s("Referrals in online coaching",
      "Online clients can refer people anywhere, which widens the pool. Shareable progress, such as a before-and-after photo with permission or a message about how they feel, often prompts friends to ask who their coach is. Make it easy for clients to pass on your details when that happens: a short link to a booking page or a friendly intro message they can forward.",
      "Online communities, such as a client group, also generate referrals as members share their experience with friends."),
    s("Measuring referral quality",
      "Not all referrals are equal. Track how long referred clients stay and what they pay, compared with clients from other sources. If referred clients stay noticeably longer, use their lifetime value in the calculator. The higher value strengthens the case for investing in referrals over paid acquisition."),
],
}
for k, v in MORE.items():
    EXTRA[k] = EXTRA[k] + v

MORE2 = {
"ad-spend-breakeven-calculator": [
    s("A quick summary",
      ("ul", [
          "**Breakeven cost per client** = package price × gross margin.",
          "**Your cost per client** = budget ÷ clients won.",
          "**Profit per client** = breakeven minus your cost per client.",
          "**Breakeven ROAS** = 1 ÷ margin.",
          "**Biggest lever:** conversion rate, then package value, then cost per lead.",
      ]),
      "Run the numbers monthly with real figures, and only scale ads that sit comfortably below breakeven with room for a slow month."),
],
"customer-acquisition-cost-calculator": [
    s("CAC and the client experience",
      "The cheapest client to acquire is the one you already have. Clients who stay longer spread their acquisition cost over more months, and clients who are happy refer others at almost no cost. Investing in the coaching experience, such as regular check-ins, clear plans, fast replies and visible progress, lowers CAC indirectly by raising retention and referrals.",
      "When CAC feels too high, it's worth asking whether the fix is in marketing at all, or in what happens after a client signs."),
    s("A quick summary",
      ("ul", [
          "**CAC** = marketing spend ÷ new clients.",
          "**LTV** = monthly price × average months retained.",
          "**Healthy ratio:** around 3 to 1 or better.",
          "**Payback:** CAC ÷ monthly price; shorter is safer for cash flow.",
          "**Levers:** conversion and retention usually beat cheaper ads.",
      ]),
      "Recalculate every quarter with real data, by channel, and invest where the ratio and payback are strongest."),
],
"discovery-call-calculator": [
    s("Group calls and webinars",
      "Some coaches replace individual calls with a group information session or webinar, followed by short one-to-one calls for those interested. This can save time when demand is high, though close rates for webinar attendees are often lower than for individual calls. Compare revenue per hour spent rather than close rate alone when choosing between the two."),
    s("A quick summary",
      ("ul", [
          "**New clients** = calls × close rate.",
          "**Monthly revenue** = new clients × client value.",
          "**Value per call** = revenue ÷ calls.",
          "**Biggest lever:** close rate, which applies to every call.",
      ]),
      "Track your calls for a month, enter the real numbers, and choose one change to the call or follow-up to test next month."),
],
"email-list-value-calculator": [
    s("How many campaigns to send",
      "Revenue per campaign multiplied by the number of offer campaigns gives annual list revenue. Sending more offers raises revenue up to a point, then unsubscribes and fatigue start to cut into it. Most coaches find one or two offer emails a month, between useful content emails, a sustainable balance.",
      "Watch unsubscribe rates after offer emails. A small rise is normal. A large, sustained rise suggests emails are too frequent or too salesy."),
    s("A quick summary",
      ("ul", [
          "**Buyers** = subscribers × open × click × conversion.",
          "**Revenue per campaign** = buyers × offer price.",
          "**Revenue per subscriber** = revenue ÷ subscribers.",
          "**Levers:** list quality, click rate and landing page conversion.",
      ]),
      "Use the value per subscriber to decide how much list growth is worth, and improve each stage of the funnel one at a time."),
],
"free-trial-conversion-calculator": [
    s("What to say at the end of a trial",
      "A simple structure works well: remind them of their goal, show what they did and what changed, explain how full coaching continues, state the price and what's included, and ask whether they'd like to continue. Keep it personal and honest. If the coaching isn't right for them, say so and point them elsewhere; that honesty builds your reputation and often brings referrals later."),
    s("A quick summary",
      ("ul", [
          "**Conversion** = converted ÷ trials.",
          "**New monthly revenue** = converted × price.",
          "**Payback** = (ad spend ÷ converted) ÷ price.",
          "**Cohort value** = new monthly revenue ÷ churn.",
          "**Levers:** the first three days, the end-of-trial conversation and churn after conversion.",
      ]),
      "Improve onboarding first, then the ask, then scale trials once conversion is reliable."),
],
"referral-value-calculator": [
    s("What makes clients refer",
      "Clients refer when three things are true: they are getting results, they feel looked after, and they know someone who would benefit. You can influence all three. Results come from a good plan and consistency. Feeling looked after comes from regular check-ins, quick replies and noticing their progress. Knowing someone comes up naturally if you ask the right question at the right time.",
      "Of the three, feeling looked after is the one coaches most often underestimate. A client who gets fair results but feels personally supported often refers more than one with great results who feels like a number."),
    s("Referral etiquette",
      "Respect privacy. Never share a client's details or results with a referred person without permission. When a referral becomes a client, thank the referrer without revealing private information about their friend. If the referral doesn't sign, still thank the referrer; they did you a favour."),
    s("A quick summary",
      ("ul", [
          "**New clients** = clients × referrals per client × conversion.",
          "**Referral revenue** = new clients × lifetime value.",
          "**Ad spend avoided** = new clients × paid acquisition cost.",
          "**Levers:** asking at milestones, making sharing easy and replying quickly to referrals.",
      ]),
      "Track referrals for a quarter, enter real numbers and set a target for the next quarter."),
],
}
for k, v in MORE2.items():
    EXTRA[k] = EXTRA[k] + v

MORE3 = {
"ad-spend-breakeven-calculator": [
    s("Ad creative that converts for coaches",
      "Ads that work for coaches usually speak to one specific person and one specific problem: a busy parent who wants to feel strong again, a runner stuck at the same 10K time, a new lifter who doesn't know where to start. They show a real result or a real moment from coaching, and they make the next step clear and low-pressure, such as a short application or a free call.",
      "Generic ads promising transformation for everyone tend to bring cheap but poorly matched leads. Specific ads cost more per lead but often far less per paying client, which is the number breakeven is built on. Test two or three specific angles against each other and keep the one with the lowest cost per client, not the lowest cost per click."),
],
"customer-acquisition-cost-calculator": [
    s("Tracking where clients come from",
      "Accurate CAC by channel depends on knowing where each client came from. The simplest method is a required question on your intake or booking form: 'How did you hear about me?', with options for each channel and a free-text 'other'. Combine that with tracking links on your ads and social profiles, and check both when a new client signs.",
      "Record the answer next to the client's start date and price. After a few months, you can total clients and revenue per channel, divide each channel's spend by its clients, and see a reliable CAC for each. That turns budget decisions from guesswork into a straightforward comparison."),
    s("Time as part of acquisition",
      "Content, outreach and calls take time even when they cost no money. If you spend eight hours a week on marketing and value your time at €40 an hour, that is about €1,390 a month. Adding it to spend gives a fuller CAC. You don't have to include it in every calculation, but knowing the figure helps decide whether to outsource some tasks or switch to channels that take less time."),
],
"discovery-call-calculator": [
    s("Pricing on the call",
      "State your price clearly and confidently, after you have explained how the coaching addresses their goals. Hesitating or apologising for the price makes it feel bigger. If you offer payment options, such as paying monthly or upfront with a small discount, mention them once and let the person choose.",
      "If price objections are common, look at whether the call is building enough value first, whether the leads match your price point, and whether a lower-priced entry option would help some people start. Don't drop your price on the call; that teaches prospects to negotiate and undervalues your existing clients."),
    s("Using the result to plan your week",
      "If each call is worth €450 on average, protecting time for calls is worth it. Many coaches block two or three fixed call windows a week, so calls don't fragment client work. Knowing the value also helps decide whether to spend money on getting more calls: an ad that books a call for €50 is a bargain if calls are worth €450 and you have capacity for the clients."),
],
"email-list-value-calculator": [
    s("Lead magnets that attract the right subscribers",
      "The free resource that brings people onto your list shapes who they are. A generic 'free workout plan' attracts anyone. A specific 'three-day meal prep guide for busy parents' or 'beginner's guide to the first month of lifting' attracts people close to your ideal client. Specific lead magnets usually bring fewer subscribers, but those subscribers open, click and buy far more often.",
      "Match the lead magnet to the offer you plan to sell. If you coach strength for women over 40, a resource on that exact topic brings subscribers who are a natural fit for your coaching."),
    s("A worked growth example",
      "A coach with 500 subscribers sends one offer a month, earning about €240 per campaign, or €2,880 a year. Over twelve months, a specific lead magnet adds 1,000 well-matched subscribers, and clearer emails raise the click rate from 8% to 10%. At 1,500 subscribers and the new click rate, each campaign brings 1,500 × 40% × 10% × 5% = 3 buyers, or €900. Annual list revenue rises to about €10,800, nearly four times the start."),
],
"free-trial-conversion-calculator": [
    s("Measuring engagement during the trial",
      "Conversion is the result; engagement is the leading indicator. Track simple signals during each trial: did they open the plan, log a workout, reply to messages, complete a check-in? Clients who do three or more of these in the first week convert far more often than those who do none.",
      "Use these signals to step in early. A client who hasn't logged anything by day three might need a quick personal message, a simpler first workout or a short call. A few minutes at the right moment often turns a silent trial into a paying client."),
    s("Pricing the continuation",
      "The price after the trial should be clear from the start. Clients who discover the price only at the end feel surprised, and surprise lowers conversion. State the price on the sign-up page and in the welcome message, along with what continues: the plan, check-ins and messaging.",
      "Some coaches offer a small incentive for continuing straight after the trial, such as a reduced first month. Use this carefully. It can lift conversion, but if it attracts clients who leave once the price rises, it lowers lifetime value. Track how long incentive clients stay before keeping the offer."),
],
"referral-value-calculator": [
    s("Words that make the ask easier",
      "Many coaches avoid asking for referrals because it feels awkward. A natural, specific phrasing makes it easier for both sides. After a client shares a win, something like this works well: 'That's a brilliant result. If you know anyone who's been wanting to do something similar, I've got space for a couple of new clients this month, and I'd love to help them too.'",
      "Mentioning limited space is honest if true, and it tells clients you are selective. Naming the kind of person you help, such as someone returning to training after a break, helps clients think of a specific friend rather than a vague anyone."),
    s("Referral rewards that fit coaching",
      ("ul", [
          "**A free week or month** of coaching for the referrer when the friend signs up.",
          "**A discount on the next block** of coaching.",
          "**A small gift,** such as a branded water bottle or a book.",
          "**A shared reward,** such as a discount for both the referrer and the new client.",
      ]),
      "Whatever you choose, keep it simple to explain and include its cost when comparing referrals with paid acquisition. A free month worth €150 per new client is still cheaper than most paid acquisition."),
    s("Testimonials and referrals",
      "Testimonials and referrals come from the same moments: when a client feels their progress. Asking for both at the same time works well. A client who writes a short testimonial has just put their experience into words, which makes it easier for them to recommend you to someone specific. With permission, testimonials also help referred people decide to sign."),
],
}
for k, v in MORE3.items():
    EXTRA[k] = EXTRA[k] + v

MORE4 = {
"ad-spend-breakeven-calculator": [
    s("Retargeting",
      "Retargeting shows ads to people who already visited your site, watched your videos or engaged with your posts. These audiences are warmer, so cost per client is often much lower than for cold audiences. A small retargeting budget alongside cold ads can bring the average cost per client down noticeably. Enter each campaign separately to see which one carries the profit."),
],
"customer-acquisition-cost-calculator": [
    s("Benchmarks versus your own trend",
      "It's tempting to compare your CAC with published averages, but coaching businesses vary too much for those figures to mean much. A premium coach with a long average client lifetime can afford a CAC that would ruin a low-priced programme. The most useful comparison is your own CAC over time, alongside your own LTV. If the ratio improves quarter after quarter, acquisition is getting healthier, whatever the averages say."),
],
"discovery-call-calculator": [
    s("Recording calls to improve",
      "With the prospect's permission, recording calls lets you listen back and spot patterns: where you talk too much, which questions open people up, where objections appear. Ten minutes reviewing one recording a week often improves close rate faster than any script. Delete recordings once you've reviewed them, and tell prospects why you record."),
],
"email-list-value-calculator": [
    s("Email and retention",
      "A list isn't only for new clients. Current clients on the list receive useful content between check-ins, which keeps them engaged and reminds them of the value of coaching. Past clients receive reminders that you're there when they're ready to return. Both effects raise lifetime value, which this calculator doesn't capture but which often matters as much as direct campaign sales."),
    s("Automations worth setting up",
      "A welcome sequence for new subscribers, a short sequence for people who clicked an offer but didn't buy, and a re-engagement email for subscribers who've gone quiet for months cover most coaches' needs. Once set up, they run without effort and usually lift revenue per subscriber."),
],
"free-trial-conversion-calculator": [
    s("Following up with trials that didn't convert",
      "People who finish a trial without continuing aren't a lost cause. Ask them briefly why, thank them, and, with permission, add them to your email list. Some return weeks or months later when timing suits. A short message a month after the trial, sharing a useful tip and a gentle invitation, often brings a few back.",
      "Their answers to 'why not?' are also the best guide to improving the trial. Patterns across a few months show exactly what to change."),
    s("Trials for in-person coaching",
      "In-person trainers often offer a free first session rather than a multi-day trial. The same principles apply: make the first session feel like real coaching, show a quick win, explain the plan from here, state the price and ask for the decision. Track first-session conversion the same way as trial conversion to see how it improves."),
],
"referral-value-calculator": [
    s("When referrals dry up",
      "If referrals slow down, look at the client experience first. Are check-ins regular? Are clients seeing progress? Do they feel heard? Referrals fall when clients feel neglected, often before cancellations rise, so a drop in referrals can be an early warning.",
      "Then look at the ask. Have you stopped asking? Busy periods often crowd out the small habits that bring referrals. Re-start the ask at milestones and review points, and the numbers usually recover within a couple of months."),
    s("Referral revenue in context",
      "At the default figures, referrals bring €10,800 a year from 20 clients. For a coach earning €6,000 a month, that is about 15% of annual revenue at almost no acquisition cost. Raising it is one of the highest-return activities available to a small coaching business."),
],
}
for k, v in MORE4.items():
    EXTRA[k] = EXTRA[k] + v

MORE5 = {
"customer-acquisition-cost-calculator": [
    s("Free channels still have a cost",
      "Organic social, a podcast or a YouTube channel can bring clients with no ad spend, which makes their cash CAC look close to zero. But they need equipment, editing tools, sometimes paid help and, above all, time. Count the cash costs in spend, and keep a separate note of the hours. A channel that brings two clients a month for 20 hours of work may be worth less than one that brings two clients for €300 of ads and two hours of setup."),
],
"email-list-value-calculator": [
    s("Plain text or designed emails?",
      "Many coaches find that short, plain emails written like a personal message get more replies and clicks than heavily designed newsletters. They feel like a note from a person rather than a brochure. Test both with your own list: send the same offer in each style to half the list and compare clicks and sales."),
],
"free-trial-conversion-calculator": [
    s("Comparing trial sources",
      "Trials from different sources convert very differently. A referral who starts a trial already trusts you; a stranger from a cold ad doesn't. Split the calculator inputs by source: run it once for referral trials, once for ad trials, once for social trials. The comparison shows where trial spend works hardest and which sources need a different first step, such as a call before the trial rather than straight sign-up."),
],
"referral-value-calculator": [
    s("Referral clients per month",
      "Spread across the year, 12 referral clients is one a month. That steady flow is valuable in itself: it smooths out busy and quiet months, keeps the calendar full without ads, and makes revenue more predictable. Coaches with a reliable referral stream often find they can be more selective about new clients and pricing, because they're not dependent on a single acquisition channel."),
],
}
for k, v in MORE5.items():
    EXTRA[k] = EXTRA[k] + v

EXTRA["free-trial-conversion-calculator"] += [
    s("When to stop offering trials",
      "If conversion stays low after several rounds of improvement, or trial clients consistently leave within a couple of months, a trial may not suit your offer. Many coaches switch to a paid starter programme or a guarantee at that point and find both conversion and retention improve."),
]
EXTRA["referral-value-calculator"] += [
    s("Combining referrals with other channels",
      "Referrals work best alongside other channels rather than instead of them. Content and email keep you visible so that when a client mentions you, the friend can look you up and find something useful. Ads can then fill gaps in quieter months. Track each channel's clients and lifetime value, and you'll see that referral clients usually cost the least and stay the longest, which is a good reason to protect the habits that produce them."),
]

EXTRA["referral-value-calculator"] += [
    s("Starting this week",
      "Pick three clients who have had a recent win. In your next message or check-in, congratulate them and make a specific, friendly ask. Note any referrals in a simple list. Repeat each week, and after a month, enter your real numbers into the calculator."),
]
