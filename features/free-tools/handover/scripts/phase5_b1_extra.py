"""Extra original sections for Phase 5b batch 1."""
from phase5_common import s

EXTRA = {
"client-check-in-reader": [
    s("Using the reader across your roster",
      "The reader handles one check-in at a time, but its real value comes from using the same order for every client, every week. When each check-in is read the same way, decisions become consistent, faster and easier to explain. Clients notice that changes have reasons, and you spend less time agonising over borderline cases.",
      "Many coaches review check-ins in a set block each week. Working through the same questions in the same order, safety, recovery, consistency, then the trend, keeps each review to a few minutes without cutting corners."),
    s("When the reader and your judgement disagree",
      "You know your client; the reader only knows the numbers you entered. If it says push but you know the client is about to start a stressful project at work, hold instead. If it says hold but the client has asked for a challenge and is recovering well, a small progression may be right. Use the verdict as a structured second opinion, not a rule."),
],
"client-churn-risk-reader": [
    s("Retention conversations that work",
      "When you reach out to an at-risk client, the aim isn't to sell them on staying. It's to find out what's changed and whether coaching still fits. Ask an open question, listen and respond to what they actually say. Often the answer is practical: a schedule change, a plan that's too demanding, a plateau that needs explaining. Fixing that one thing keeps many clients.",
      "If the coaching genuinely isn't right for them anymore, say so kindly. Clients who leave on good terms often return, refer friends and speak well of you."),
    s("Offering a pause",
      "A pause can be a good option for clients facing a temporary problem, such as travel, a busy period at work or a short-term money squeeze. Offer it with a clear end date and a plan to keep them moving in the meantime, such as a simple maintenance routine. Clients who pause with a plan are much more likely to return than those who simply cancel.",
      "Don't offer a pause to every client who goes quiet. For some, the honest conversation is more useful than a delay."),
    s("Tracking what works",
      "Keep a short note each time you reach out to an at-risk client: the signals, the message, and whether they stayed. After a few months, patterns appear. You may find that a quick voice note works better than text for some clients, or that a reset call keeps more clients than a message. Use what you learn to refine your outreach."),
],
"weight-trend-reader": [
    s("A worked example",
      "The default example is six weekly weigh-ins on a cut: 82.1, 81.4, 81.6, 81.5, 81.3 and 81.4 kg. The first week dropped 0.7 kg, mostly water from a new plan, and the next four weeks barely moved. The trend line through all six is about −0.1 kg a week, around 0.14% of body weight. That's well below the 0.25% a cut needs. With the waist flat and strength flat, the read is a genuine stall.",
      "If the client had reported their waist coming down over the same five weeks, the read would be recomposition instead, and the right move would be to hold the plan."),
    s("Weekly or daily weigh-ins?",
      "Daily weigh-ins give more data and a smoother trend, as long as the client can see the number without anxiety. Weekly weigh-ins are simpler and suit clients who find daily numbers stressful, but a single weekly reading is more affected by that day's water. Either works with the reader. For daily data, paste at least two to three weeks for a reliable trend."),
    s("When to change the plan",
      "Change the plan only when the read is a genuine stall, too fast or a drift, adherence is good, and the trend has held for at least two to three weeks. Make one change at a time, such as about 150 kcal less a day or 2,000 to 3,000 more steps, and keep everything else the same. Re-read after two weeks. Changing several things at once makes it impossible to know which one worked."),
],
"lift-progression-reader": [
    s("Changing the driver",
      "When a lift stalls, the progression method has usually run its course. Changing the driver means changing what makes the lift progress, not just adding effort.",
      ("ul", [
          "**Rep range:** move from sets of 5 to sets of 8, or the other way.",
          "**Volume:** add a working set for a few weeks.",
          "**Frequency:** train the lift twice a week instead of once.",
          "**Variation:** swap to a close variation, such as a paused squat or close-grip bench, for a block.",
          "**Intensity method:** add a top set followed by back-off sets.",
      ]),
      "Choose one change and give it three to six weeks before judging it."),
    s("Deloads",
      "A deload is a planned lighter week: fewer sets, lighter loads or both. It lets fatigue drop while fitness stays, and it often reveals strength that fatigue was hiding. Many intermediate and advanced lifters deload every four to eight weeks. If a lift is regressing, a deload is usually the first step before changing anything else.",
      "A typical deload keeps the same exercises with about half the sets and loads around 10% lighter."),
    s("Talking to clients about stalls",
      "Clients often feel a stall is a failure. Explain that every lifter stalls, that it's a normal signal to change something, and that the trend over months matters more than any single session. Showing the estimated 1RM trend, rather than just the latest set, helps them see progress in context.",
      "Celebrate other wins too: better technique, more consistent attendance, a new rep record at a lighter weight. Strength rarely moves in a straight line."),
    s("Tracking several lifts",
      "Run the reader for each main lift separately. It's common for one lift to progress while another stalls, especially when training focuses more on one movement. Reading them side by side helps decide where to adjust and where to leave the programme alone.",
      "If every lift is stalling at once, the cause is usually recovery, nutrition or overall training load rather than any one exercise."),
],
}

MORE = {
"client-check-in-reader": [
    s("Check-in questions that make reading easier",
      "The reader works best when check-ins capture the same few numbers every week: weight change, adherence, sessions done and planned, sleep, energy, stress and a short note. If your check-in form asks for these consistently, each review becomes quick and comparable. The client check-in builder on this site can help design a form around them."),
],
"client-churn-risk-reader": [
    s("Churn risk and capacity",
      "When churn risk rises across several clients at once, look at your own workload before blaming the clients. A coach stretched over too many clients replies more slowly, gives shorter feedback and notices less, and clients feel it. If many clients are at watch level at the same time, the client capacity calculator can help check whether it's time to raise prices, pause new sign-ups or bring in help."),
    s("Signals in group coaching",
      "In groups, the same signals apply but are easier to miss: a member who stops posting, skips live calls or stops logging. Run the reader for group members who have gone quiet, and send a personal message rather than a group reminder. A direct, individual note often brings a drifting member back far more effectively than any group announcement."),
],
"weight-trend-reader": [
    s("Reading lb weigh-ins",
      "The reader works the same way in pounds. Paste readings in lb and choose lb as the unit; the trend and range are shown in lb, and the percentage of body weight is the same either way. For a 180 lb client on a cut, the on-track range of 0.25% to 1% a week is roughly 0.45 to 1.8 lb."),
    s("When the trend moves too fast",
      "Fast loss can feel like good news, but losing more than about 1% of body weight a week for several weeks usually means a large share of the loss is muscle and water, energy and training suffer, and the result is harder to keep. Adding 100 to 200 kcal a day, often as carbohydrate around training, usually slows the pace to something sustainable without stopping progress."),
],
"lift-progression-reader": [
    s("Pounds and kilograms",
      "The reader works in either unit. The estimated 1RM and the percentage change are the same whatever unit you use; only the displayed numbers differ. Enter all sessions in the same unit, and don't mix kilograms and pounds in one series."),
    s("How many sessions to paste",
      "Three sessions is the minimum, but five to eight give a far more reliable read. With only three, one unusual day has a big effect on the trend. With eight, a single off day barely moves it, and real stalls or progressions stand out clearly. Use the top working set from each session rather than warm-ups or back-off sets."),
    s("Bodyweight and strength",
      "If a client is losing weight on a cut, holding strength is often a win in itself. A flat estimated 1RM while bodyweight falls means relative strength is rising. During a cut, a stall is usually expected; a regression is the signal to watch for, because it can mean the deficit is too large or recovery is poor."),
],
}
for k, v in MORE.items():
    EXTRA[k] = EXTRA[k] + v

MORE2 = {
"client-check-in-reader": [
    s("Privacy",
      "Check-ins often contain personal and health information. The reader runs entirely in your browser, and nothing you type is stored or sent anywhere. In your own systems, keep client check-ins in a secure place, share them only with people who need to see them, and follow the data protection rules where you and your clients live."),
],
"client-churn-risk-reader": [
    s("What not to do",
      ("ul", [
          "**Don't guilt-trip.** Messages like 'I haven't heard from you' put clients on the defensive.",
          "**Don't send a generic reminder** to a client who has gone quiet; it's easy to ignore.",
          "**Don't argue** with a client who wants to leave or pile on discounts to keep them.",
          "**Don't wait** for the next scheduled check-in if signals are already high.",
      ]),
      "A short, kind, specific message sent early does more than any retention offer sent late."),
],
"weight-trend-reader": [
    s("Using the read in a check-in",
      "Paste the latest weigh-ins before each weekly review, read the verdict, and use it alongside the check-in reader. If the trend says hold and the check-in says push, keep nutrition steady and progress training. If the trend says stall and adherence is solid, make the one small change and tell the client exactly what you've changed and when you'll review it. Consistent reads build client trust in the process."),
],
"lift-progression-reader": [
    s("Reading accessory lifts",
      "The reader works for any lift logged as weight × reps, including accessories such as rows, lunges or curls. For accessories, small stalls matter less; they're usually there to support the main lifts or add volume. Focus the reader on the lifts your client's goal depends on, and use accessory trends mainly to spot fatigue across the whole programme."),
    s("When to get help",
      "If a client's lift regresses alongside pain, unusual fatigue, poor sleep that doesn't improve, or a loss of appetite, look beyond the programme. Persistent fatigue can have medical causes, and pain needs assessment. Encourage them to see a doctor or physiotherapist, and lighten training while they do."),
],
}
for k, v in MORE2.items():
    EXTRA[k] = EXTRA[k] + v

MORE3 = {
"client-churn-risk-reader": [
    s("Privacy",
      "The reader runs in your browser and stores nothing. The note you paste stays on your device. When you keep notes about clients' circumstances in your own systems, store them securely and only as long as you need them."),
    s("The cost of a lost client",
      "Every client who leaves takes their remaining lifetime value with them. If an average client is worth €1,800 over their time with you and early outreach keeps even one extra client a month, that's over €20,000 a year. The client LTV calculator shows what each client is worth in your business."),
],
"weight-trend-reader": [
    s("Privacy",
      "Weigh-ins are personal data. The reader runs entirely in your browser and nothing is saved or sent. Keep client weights in a secure system, and share trends with clients in a way that focuses on progress rather than the number itself, especially for clients who find the scale stressful."),
],
"lift-progression-reader": [
    s("A worked read of the default example",
      "The example sessions are 100×5, 100×5, 102.5×5, 102.5×4 and 105×3. Their estimated 1RMs are about 116.7, 116.7, 119.6, 116.2 and 115.5 kg. The load rose by 5 kg, but reps fell from 5 to 3, and estimated strength actually dipped slightly. For an intermediate lifter, the move is to hold the load until reps recover, or use smaller increments, rather than adding more weight next session.",
      "A client message explaining this in plain words, 'the weight's gone up, but the extra load isn't adding strength yet', helps them accept a small step back."),
],
}
for k, v in MORE3.items():
    EXTRA[k] = EXTRA[k] + v

EXTRA["weight-trend-reader"] += [
    s("Trend over target",
      "Clients often focus on a goal weight. Shifting the focus to the weekly trend makes progress feel steadier: a client who sees a consistent downward line is far less discouraged by a single high reading than one who only checks whether they've hit their number yet."),
]
EXTRA["lift-progression-reader"] += [
    s("Effort ratings",
      "If your clients log how hard each top set felt, on an RPE or reps-in-reserve scale, add that to the picture. A flat estimated 1RM at a lower effort rating means strength is actually rising; the same numbers at a higher rating suggest fatigue is building."),
]
