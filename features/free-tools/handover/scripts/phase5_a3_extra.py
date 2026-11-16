"""Extra original sections for Phase 5a batch 3."""
from phase5_common import s

EXTRA = {
"client-capacity-calculator": [
    s("Signs you're over capacity",
      ("ul", [
          "**Check-in replies slip** from same day to two or three days.",
          "**Feedback gets shorter** and more generic.",
          "**Programmes stay the same** for longer than they should.",
          "**You dread opening messages** or work most evenings to keep up.",
          "**Churn rises** even though marketing is working.",
          "**New client onboarding** feels rushed.",
      ]),
      "If several of these sound familiar, you're probably past your sustainable capacity, whatever the number says. Re-run the calculator with honest minutes per client and admin overhead, and compare with your current client count."),
    s("Capacity for in-person trainers",
      "For in-person trainers, capacity is set mainly by session slots. A trainer working 30 hours with 60-minute sessions and 20% admin has 24 session hours a week. With a 15% buffer, that's about 20 clients training once a week, or 10 training twice. Travel between locations, set-up and cleaning all reduce usable time, so include them in minutes per client.",
          "Peak times, such as early mornings and evenings, fill first. Practical capacity is often lower than the calculation suggests, because clients want the same popular slots. Offering off-peak prices or small-group sessions at busy times can help."),
    s("Capacity for online coaches",
      "Online coaches have more flexibility in when they work, which makes capacity both larger and easier to overstretch. Messages arrive at all hours, and without boundaries, they fill every gap in the day. Setting fixed times for check-in reviews and replies, and telling clients when to expect responses, protects both your time and the quality of your coaching.",
          "Online capacity also depends heavily on systems. A coach with good templates, a consistent check-in form and a single platform for plans and messages can serve far more clients well than one juggling spreadsheets, chat apps and email."),
    s("Planning growth around capacity",
      "Use capacity as a planning tool. If you're at 30 clients and capacity is 40, you have room for ten more. If you sign three a month and lose one, you'll reach capacity in about five months. That's the time you have to decide what comes next: a price rise, an assistant, a group offer or a waiting list.",
          "The coaching revenue projector shows how quickly you'll reach a given client count, and the capacity calculator shows whether you can serve them. Use both together."),
    s("A worked example",
      "An online coach works 35 hours a week, spends 25 minutes per client, loses 25% to admin and keeps a 15% buffer. Coaching time is 35 × 0.75 = 26.25 hours, or 1,575 minutes. The ceiling is 1,575 ÷ 25 = 63 clients; sustainable capacity is about 53. At €180 a month, revenue at capacity is about €9,540 a month.",
      "If the coach builds templates that cut time per client to 20 minutes, the ceiling rises to 78 and sustainable capacity to about 66, worth about €2,340 more a month at the same price, without longer hours."),
    s("For coaches: a quarterly capacity check",
      "Once a quarter, time a typical week, re-estimate minutes per client and admin overhead, and re-run the calculator. Compare sustainable capacity with your current clients and your growth plan. If you'll reach capacity within three months, start planning the next step now, so you're not forced into a rushed decision when you're already overwhelmed."),
    s("Capacity and wellbeing",
      "Capacity isn't only a business number. Coaching is demanding work, and many coaches burn out by taking on more than they can sustain. Choosing a capacity that leaves room for rest, learning and your own training is a business decision as well as a personal one: rested coaches coach better, and their clients stay longer."),
],
"group-vs-1on1-coaching-calculator": [
    s("Group formats",
      ("table", ["Format", "What it involves", "Typical time"], [["Live group calls", "Weekly video call for teaching and Q&A", "1 to 2 hours a week"], ["Small-group training", "In-person sessions for 3 to 8 people", "Several hours a week"], ["Programme with community", "Shared plan, group chat, occasional calls", "2 to 5 hours a week"], ["Cohort programme", "Fixed start date, set length, group progress", "Varies by length"]]),
      "Each format has a different time cost and price. Enter the real hours for the format you're considering, including preparation and community time."),
    s("Retention in groups",
      "Groups can have higher churn than one-to-one coaching, because members feel less personally connected and the price is lower, making it easier to leave. Strong groups counter this with a clear start and end, regular wins shared in the community, and some personal contact, such as a short individual check-in each month.",
      "Track churn for the group separately. A group with high hourly revenue but high churn may need more marketing effort than its hourly rate suggests."),
    s("Moving from 1:1 to group",
      "If you're considering adding a group, start small. Invite a handful of existing or past clients who would benefit, run a short pilot programme, and gather feedback. Use their results and testimonials to fill the next round. Many coaches find their best group members are people who couldn't afford one-to-one coaching but wanted their approach."),
    s("Small-group personal training",
      "In-person trainers often use small groups of two to six people as a middle ground. Each client pays less than for one-to-one sessions, but the trainer earns more per hour. A session with four clients at €25 each earns €100 an hour, compared with €60 for one client. Clients often enjoy training with others and stay motivated longer.",
      "Enter small-group sessions in the group column with the total hours you spend on them each week."),
    s("Your own preferences",
      "Hourly rate is one factor. Your own preferences matter too. Some coaches love the energy of a group and find one-to-one sessions tiring; others prefer depth with a few clients. Coaching in a way you enjoy tends to produce better results, better retention and a business you want to keep running. Use the numbers to inform the decision, not to make it for you."),
    s("A worked transition",
      "A coach has 15 one-to-one clients at €400, working 15 hours a week, earning €6,000 a month at about €92 an hour. They launch a group of 20 at €150, taking 3 hours a week, which brings €3,000 a month at about €231 an hour. Their total becomes €9,000 a month for 18 hours, an average of about €115 an hour.",
      "They haven't replaced one-to-one coaching; they've added a higher-hourly offer alongside it. That's often the most practical path."),
    s("For coaches: comparing models before launching",
      "Before launching a group, estimate realistic numbers: how many people could you fill it with in the first round, at what price, and how many hours it would really take. Enter them in the calculator next to your current one-to-one numbers. If the group's hourly rate is only slightly higher, the extra work of launching and marketing it may not be worth it yet. If it's much higher, plan the launch."),
],
"no-show-cost-calculator": [
    s("Reminders that work",
      "A good reminder system is the simplest fix. Send a message the day before with the time and location or link, and a short note an hour before. Ask clients to reply to confirm. Many scheduling tools can send these automatically. Trainers who start sending reminders often see no-shows fall noticeably within weeks.",
      "Keep reminders friendly and brief. A reminder that feels like a warning can make clients defensive; one that feels like a helpful nudge works better."),
    s("Prepaid packages",
      "When clients pay for a block of sessions in advance, they're more likely to attend, because each missed session feels like wasted money. Packages also protect your income: if a client misses a session without notice, the session is used under your policy. Many trainers move from pay-per-session to packages specifically to reduce no-shows and smooth income."),
    s("Recurring bookings",
      "Clients with the same slot every week treat sessions as part of their routine, like a standing meeting. Ad hoc bookings are easier to forget or move. Encouraging clients to book a regular time, and keeping that slot for them, reduces both no-shows and late cancellations."),
    s("Talking to repeat no-shows",
      "If a client misses several sessions, talk to them directly and kindly. Ask what's getting in the way. Often there's a reason you can help with: a time that no longer works, a change at home or work, or a loss of motivation. A different time slot, a shorter session or a fresh goal can solve the problem.",
      "If the pattern continues, it may be better for both of you to pause the coaching or change the format. A client who repeatedly misses sessions isn't getting results, and that reflects on your coaching."),
    s("The real cost includes churn",
      "The calculator shows direct revenue lost. The indirect cost is often larger. Clients who miss sessions get fewer results, feel less connected and are more likely to cancel. A client worth €2,000 over their lifetime who leaves after a run of missed sessions costs far more than the sessions themselves.",
      "That's why reducing no-shows is as much a retention strategy as a revenue one."),
    s("For coaches: a monthly no-show review",
      "At the end of each month, count no-shows and late cancellations, and note which clients and time slots were involved. Enter the weekly averages into the calculator. Identify one change for next month: a reminder tweak, a policy reminder, a conversation with a repeat no-show or moving a problem slot. Compare next month's numbers.",
      "Small changes usually make a visible difference within one or two months."),
    s("No-shows and group sessions",
      "In group sessions, one absence doesn't lose the session, but it lowers the energy and, over time, the group's value. Track attendance for groups as well. Members who miss several sessions in a row are at high risk of leaving, and a personal message often brings them back."),
],
"assistant-coach-roi-calculator": [
    s("Hiring your first assistant",
      "Many coaches hire their first assistant from among former clients, coaching students or newly qualified coaches who share their philosophy. Start with a trial period and a small number of clients. Agree on how the assistant will be paid, what they're responsible for, how often you'll review their work and how client communication will be handled.",
      "Put the agreement in writing, including what happens if either of you wants to end it. Check the employment or contractor rules where you work, as they differ by country."),
    s("Training an assistant",
      "An assistant will only coach your way if you show them how. Record short videos or write simple guides on how you build programmes, review check-ins, adjust plans and handle common questions. Share examples of good feedback. Review their first few weeks closely and give clear, constructive notes.",
      "Time spent training an assistant early saves far more time later and protects your reputation with clients."),
    s("When hiring isn't the answer",
      "If your margin after hiring is small, the freed hours have no clear use, or you're not sure you can maintain quality, hiring may not be the right step yet. Raising prices, improving systems or limiting client numbers might achieve your goals with less risk. The calculator's price-rise comparison helps weigh that option."),
    s("A worked comparison",
      "A coach with 40 clients at €200 is near capacity. Option one: hand 15 clients to an assistant at €60 each, keeping €2,100 a month and freeing 7.5 hours. Option two: raise prices by €25 for all 40 clients, adding €1,000 a month, and accept that 2 or 3 might leave, which frees about 1 to 1.5 hours. Option three: do both.",
      "The best option depends on what the coach wants: more income, more time or both. Running the numbers side by side makes the choice clearer."),
],
}

MORE = {
"client-capacity-calculator": [
    s("Capacity with mixed client types",
      "Most coaches don't have one type of client. A roster might include a few premium clients who take an hour a week, many standard clients at 25 minutes and some light-touch clients at 10. To estimate capacity for a mix, add up the weekly minutes for each group and compare with your coaching time. For example, 5 premium clients at 60 minutes, 30 standard at 25 and 10 light at 10 minutes total 1,150 minutes, about 19 hours, leaving room within 24 hours of coaching time.",
      "Running the calculator for each group separately also shows which clients are the most time-efficient for their price."),
    s("Holidays and capacity",
      "Coaches need time off too. If you take four weeks of holiday a year and don't hand clients to anyone, those weeks either need covering in advance or the workload piles up before and after. Including some buffer for holidays, or arranging cover with another coach, keeps capacity realistic across the year rather than just in a typical week."),
    s("Capacity and client results",
      "The depth of coaching affects results. Clients who get detailed feedback, timely plan changes and personal attention tend to progress faster and stay longer. Squeezing time per client to raise capacity can backfire if results suffer. Before cutting minutes per client, ask which parts of your time clients value most, and protect those."),
    s("A quick summary",
      ("ul", [
          "**Coaching time** = weekly hours × (1 − admin %).",
          "**Ceiling** = coaching minutes ÷ minutes per client.",
          "**Sustainable** = ceiling × (1 − buffer %).",
          "**Raise capacity** with templates, structured check-ins, batching and help, not by cutting the attention clients value.",
      ]),
      "Measure your real minutes per client, plan growth around your sustainable number and decide your next step before you reach it."),
],
"group-vs-1on1-coaching-calculator": [
    s("Marketing a group",
      "Groups need more members to work, which means more marketing. A clear promise, a specific audience, a start date and a limited number of places help fill a group. Existing clients, your email list and social followers are the easiest places to start. A group that fills from warm audiences is far cheaper to run than one that relies on cold ads.",
      "Factor marketing time and cost into your decision. A group with a high hourly rate but heavy marketing needs may earn less overall than it seems."),
    s("Group coaching and results",
      "Clients in groups often get good results, partly because of peer accountability and shared motivation. But clients with specific needs, such as injuries, medical conditions or very particular goals, may need more individual attention than a group provides. Screening members, or offering a one-to-one add-on, helps make sure everyone in the group is well served."),
    s("A quick summary",
      ("ul", [
          "**Effective hourly rate** = monthly revenue ÷ (weekly hours × 4.33).",
          "**Groups** usually earn more per hour once reasonably full.",
          "**1:1** usually earns more per client and builds deeper relationships.",
          "**Count all the time,** including preparation, community and check-ins.",
      ]),
      "Compare both with realistic numbers, then choose the mix that fits your goals, your clients and the coaching you enjoy."),
],
"no-show-cost-calculator": [
    s("Writing a fair cancellation policy",
      ("ol", [
          "State the notice period clearly, for example 24 hours.",
          "Say what happens with late cancellations: the session is counted, a fee applies or it can be rescheduled once.",
          "Say what happens with no-shows.",
          "Explain any exceptions, such as illness or emergencies.",
          "Share it at the start, in writing, and ask clients to confirm they've read it.",
      ]),
      "Clients usually accept a clear, fair policy without complaint, especially when it's explained as a way to protect everyone's time."),
    s("No-shows and pricing",
      "If no-shows are common, part of your effective price is being lost. A trainer charging €40 a session with 10% of sessions lost effectively earns €36 a booked slot. Raising prices to account for expected losses is one approach, but reducing no-shows is better: it raises income and improves client results at the same time."),
    s("Rescheduling versus cancelling",
      "Offering easy rescheduling, such as moving a session within the same week, often reduces outright no-shows. Clients who can move a session are less likely to skip it. Set limits, such as one reschedule per month, so flexibility doesn't become disruption."),
    s("A quick summary",
      ("ul", [
          "**Lost per week** = (no-shows + late cancellations) × session value.",
          "**Per year** = weekly loss × 52.",
          "**Capacity lost** = lost sessions ÷ booked sessions.",
          "**Fixes:** reminders, a clear policy, prepaid packages and recurring slots.",
      ]),
      "Track them for a month, enter the averages and pick one fix to try first."),
],
"assistant-coach-roi-calculator": [
    s("Telling clients about the change",
      "Clients choose coaches partly for the person. When you hand a client to an assistant, explain why and what they gain: more frequent contact, faster replies, the same programming approach, and your continued oversight. Introduce the assistant personally, and stay in touch occasionally yourself. Clients who feel valued through the change are much more likely to stay."),
    s("A quick summary",
      ("ul", [
          "**Margin** = handed-off revenue − assistant pay − platform fees.",
          "**Hours freed** = hours per client × clients handed off.",
          "**Salary break-even** = salary ÷ net revenue per client.",
          "**Alternative:** the price rise across all clients that earns the same margin.",
      ]),
      "Hire when the margin is healthy, you know what the freed time is for, and you can keep quality high."),
],
}
for k, v in MORE.items():
    EXTRA[k] = EXTRA[k] + v

MORE2 = {
"client-capacity-calculator": [
    s("Waiting lists",
      "When you reach capacity, a waiting list keeps demand warm without overloading you. Ask interested people for their details and goals, tell them roughly when space might open, and send a short update every few weeks. When a place opens, offer it to the person at the top of the list. Many coaches find waiting lists also raise conversion, because people who wait for a place arrive committed.",
      "A long waiting list is a clear signal that your price can rise, or that it's time to add capacity through help or a group programme."),
    s("Capacity and onboarding",
      "New clients take more time than established ones. An onboarding call, reviewing a detailed intake form, building the first plan and the extra messages of the first few weeks can easily triple the usual weekly time. If you sign several clients in the same week, that spike can push you over capacity even when your total client count looks fine.",
      "Staggering start dates, for example by starting new clients on set days each fortnight, spreads onboarding time out and keeps weekly workload steadier."),
],
"group-vs-1on1-coaching-calculator": [
    s("Pricing tiers that combine both",
      "A common structure is a group programme as the entry tier, one-to-one coaching as the premium tier, and a hybrid in between: group calls plus a monthly individual check-in. Each tier is priced from its own time and value. Clients can start in the group and move up as their needs or budget change.",
      "Enter each tier in the calculator separately to make sure every option earns a reasonable hourly rate. A hybrid tier with too much individual time can end up earning less per hour than either pure model."),
    s("Testing demand before committing",
      "Before building a full group programme, gauge demand. Ask your email list or followers whether they'd be interested, describe the idea and the price range, and invite them to register interest. If enough people say yes, run a short pilot. If interest is low, you've saved weeks of work, and you can adjust the offer or focus on one-to-one."),
],
"no-show-cost-calculator": [
    s("Deposits for new clients",
      "New clients have the highest no-show rates, because they haven't yet built the habit or the relationship. Taking a small deposit or the first payment before the first session reduces no-shows sharply. Credit the deposit against their package so it doesn't feel like an extra charge."),
    s("Time slots and no-shows",
      "No-shows often cluster at particular times. Early mornings may see more missed sessions in winter; late evenings may suffer after long workdays; Mondays and Fridays may be worse than mid-week. Tracking no-shows by time slot shows where the problem is concentrated. Moving clients who often miss a certain slot to a time that suits them better, or keeping riskier slots for flexible clients, can cut the overall rate."),
    s("A worked improvement",
      "A trainer with 40 booked sessions a week sees 4 no-shows and 2 late cancellations at €50 a session: €300 a week, €1,300 a month and €15,600 a year, or 15% of capacity. After introducing reminders, a 24-hour policy and prepaid packages, no-shows fall to 2 and late cancellations to 1. Lost revenue falls to €150 a week, saving about €650 a month and €7,800 a year.",
      "The changes took an afternoon to set up. Few business improvements pay back as quickly."),
    s("Starting this week",
      "Count last week's no-shows and late cancellations, enter them with your session value and booked sessions, and note the yearly figure. Then set up a day-before reminder for every session this week. Next week, compare."),
],
"assistant-coach-roi-calculator": [
    s("Measuring the handoff after three months",
      "Three months after handing clients over, review the results. Compare churn for handed-off clients with your own clients. Check whether the freed hours went where you planned. Re-run the calculator with real margins and any changes in client numbers. If retention held and the freed time produced new revenue, consider handing over more. If not, fix quality or adjust the arrangement before expanding."),
],
}
for k, v in MORE2.items():
    EXTRA[k] = EXTRA[k] + v

MORE3 = {
"client-capacity-calculator": [
    s("Capacity in hours versus energy",
      "Two coaches with the same hours can have very different capacity because of energy. Reviewing check-ins well needs focus. After a long day of sessions or several hours of messaging, quality drops even if there's time left on the clock. Schedule the most demanding coaching tasks when you're freshest, and count only focused time as coaching time in the calculator.",
      "If your best work happens in the morning, that's where check-in reviews and programming belong. Admin and simpler messages can fill the rest."),
    s("Starting this week",
      "Time how long you spend on three typical clients this week, including messages. Enter the average, your real hours and an honest admin share. Compare the sustainable number with your current client count, and decide what you'll do when you reach it."),
],
"group-vs-1on1-coaching-calculator": [
    s("Starting this week",
      "Enter your current one-to-one numbers, then sketch a realistic group: how many people you could invite from your current audience, a price you'd be comfortable with and the true weekly hours. If the group's hourly rate is clearly higher, ask a few clients or followers whether they'd join. Their answers will tell you more than any projection."),
],
"no-show-cost-calculator": [
    s("When the client isn't the problem",
      "Sometimes no-shows reflect the schedule rather than the client. Slots that clash with school runs, commutes or shift patterns are missed more often. If several clients struggle with the same time, consider changing your availability. A slightly less convenient schedule for you can be worth it if it cuts missed sessions and keeps clients longer."),
],
"assistant-coach-roi-calculator": [
    s("Starting this week",
      "Enter your real price, client count and time per client. Try each pay model with a realistic amount and note the margin and hours freed. Then write down what you'd do with those hours. If the answer is clear and valuable, start a conversation with a potential assistant."),
],
}
for k, v in MORE3.items():
    EXTRA[k] = EXTRA[k] + v

MORE4 = {
"client-capacity-calculator": [
    s("Capacity is a choice",
      "The calculator gives a number, but the right client count is a decision about the kind of coaching you want to offer. Some coaches choose fewer clients at a higher price and deeper support. Others choose more clients with a lighter, more systemised service. Both can work well. Choose deliberately, price for it and tell clients what to expect."),
],
"group-vs-1on1-coaching-calculator": [
    s("Currency and comparisons",
      "Both models use the same currency, and the switch only changes the symbol. If you sell to clients in different countries, enter prices in the currency you actually charge, so the comparison reflects real income. Exchange rates and payment fees can affect what you receive, so check them separately if they matter to your decision."),
],
"no-show-cost-calculator": [
    s("Online check-ins as the online no-show",
      "For online coaches, a missed check-in plays the role of a no-show. It doesn't cost a slot, but it breaks the rhythm that keeps clients progressing. Treat missed check-ins with the same care: a reminder the day before, a friendly nudge the day after, and a personal conversation if two are missed in a row. Clients who keep checking in tend to keep paying.",
      "Counting missed check-ins each week gives online coaches an early warning system as useful as a trainer's no-show log."),
    s("Talking about attendance at onboarding",
      "The best time to set expectations about attendance is the first conversation. Explain why consistency matters for their results, how reminders work, what the cancellation policy is and how to reschedule. Clients who understand the reasons are far more likely to show up, and far less likely to feel surprised if the policy is applied later."),
],
"assistant-coach-roi-calculator": [
    s("Contractor or employee",
      "Many assistants start as contractors paid per client, which keeps costs flexible. As the arrangement grows, some coaches move to employment for stability and commitment. The rules differ by country, so check what applies before choosing."),
],
}
for k, v in MORE4.items():
    EXTRA[k] = EXTRA[k] + v

EXTRA["group-vs-1on1-coaching-calculator"] += [
    s("When 1:1 is the better choice",
      "One-to-one coaching often makes more sense for specialist work: rehabilitation, competition preparation, complex nutrition needs or clients with medical conditions. These clients need individual judgement that a group can't provide, and they usually value it enough to pay for it. If most of your enquiries come from people like this, focus on one-to-one and price it well."),
]
EXTRA["no-show-cost-calculator"] += [
    s("Recording the result",
      "Write down this year's estimated loss and set a target, such as halving it within three months. Re-run the calculator monthly with real numbers. Seeing the figure fall is a strong motivator to keep reminders and policies in place."),
]
EXTRA["assistant-coach-roi-calculator"] += [
    s("Platform fees and margin",
      "Even a small platform share adds up: at 5% on €3,000 of handed-off revenue, that's €150 a month or €1,800 a year. Check what your current platform takes before deciding whether a handoff is worth it."),
]

EXTRA["no-show-cost-calculator"] += [
    s("Thanking clients who show up",
      "Attendance is a habit worth reinforcing. Noticing when a client has made every session for a month, and saying so, encourages them to keep going. Positive attention tends to work better than penalties for keeping clients consistent."),
]
