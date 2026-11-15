"""Extra original sections for Phase 4 batch A."""
from phase4_common import s

EXTRA = {
"heart-rate-zone-calculator": [
    s("Zones by age at a glance",
      "Using Tanaka's formula and the simple percentage method, here is how zones shift with age. Add a resting heart rate in the calculator to see your Karvonen zones.",
      ("table", ["Age", "Max HR", "Z2 (60–70%)", "Z4 (80–90%)"], [["20", "194 bpm", "116–136 bpm", "155–175 bpm"], ["30", "187 bpm", "112–131 bpm", "150–168 bpm"], ["40", "180 bpm", "108–126 bpm", "144–162 bpm"], ["50", "173 bpm", "104–121 bpm", "138–156 bpm"], ["60", "166 bpm", "100–116 bpm", "133–149 bpm"]]),
      "Every zone falls by about five beats a decade. A 60-year-old's threshold zone sits close to a 20-year-old's tempo zone. That is normal, and it is why zones should be recalculated as clients age."),
    s("Heart rate, pace and perceived effort",
      "Heart rate is one of three common ways to judge intensity. Pace or power tells you the work being done. Perceived effort, often on a 1 to 10 scale, tells you how hard it feels. Each has strengths: pace is precise for racing, heart rate is good for keeping easy days easy, and perceived effort works anywhere, with no device.",
      "Using them together catches problems that one alone misses. If heart rate is unusually high for an easy pace, the client may be tired, unwell, dehydrated or training in heat. If the pace feels much harder than usual at a normal heart rate, fatigue may be building. Teaching clients to note all three makes their training logs far more useful."),
    s("For coaches: setting zones for clients",
      "Start new clients with formula-based zones and check them against perceived effort over the first two weeks. If a client reports that zone 2 feels hard, or that they can chat easily in zone 4, adjust the max or switch methods. Write the zone ranges into each session, not just the zone name, so the target is clear when they train.",
      "Recheck zones every few months. As fitness improves, resting heart rate often falls, which changes Karvonen zones, and a client may complete a race or hard session that reveals a higher max than the formula predicted."),
],
"max-heart-rate-calculator": [
    s("Max heart rate by age",
      ("table", ["Age", "220 − age", "Tanaka", "Gellish"], [["20", "200", "194", "193"], ["30", "190", "187", "186"], ["40", "180", "180", "179"], ["50", "170", "173", "172"], ["60", "160", "166", "165"], ["70", "150", "159", "158"]]),
      "The formulas agree closely around 40. Below that, the classic rule gives higher numbers; above it, lower ones. For a 70-year-old, the difference reaches nine beats, which shifts every training zone."),
    s("Why max heart rate falls with age",
      "The decline is linked to changes in the heart's natural pacemaker, the sinoatrial node, and to reduced sensitivity to the hormones that speed the heart during exercise. These changes happen whether or not someone trains. Fit older adults keep a strong heart that pumps more blood with each beat, but their maximum beat rate still falls.",
      "This is one reason older athletes can stay remarkably fit. Aerobic capacity depends on both heart rate and how much blood the heart pumps with each beat, as well as how well muscles use oxygen. Training improves the latter two even as max heart rate declines."),
    s("Max heart rate in different sports",
      "Your measured max can differ between activities. Running usually produces the highest heart rates, because it uses a lot of muscle and carries body weight. Cycling often produces a max a few beats lower, and swimming lower still, partly because of body position and water cooling. Rowing can approach running values.",
      "If you train in several sports, consider using sport-specific maximums, or set zones from running and adjust them down a few beats for cycling. A heart rate that is easy to reach on the run may be impossible on the bike."),
    s("What resting and maximum heart rate say about fitness",
      "Resting heart rate is a better fitness signal than max. As aerobic fitness improves, the heart pumps more blood per beat, so it needs fewer beats at rest. A fall of five to ten beats over several months of training is common. Lower resting heart rate is also linked with lower risk of heart disease in large population studies.",
      "Heart rate recovery, how quickly heart rate falls after hard effort, is another useful sign. A drop of more than 12 beats in the first minute after stopping is considered normal; fitter people often drop by 20 or more. Both measures improve with training, while max stays largely unchanged."),
    s("When to see a doctor",
      "See a doctor before starting vigorous exercise if you have chest pain, unexplained breathlessness, dizziness, a known heart condition, high blood pressure, diabetes, or a family history of early heart disease. Stop exercising and seek advice if you notice chest discomfort, palpitations, light-headedness or a heart rate that stays unusually high long after you stop.",
      "A very high heart rate at rest, an irregular pulse or a heart rate that jumps suddenly during exercise also warrant a check. A doctor can arrange an ECG or exercise test if needed."),
    s("For coaches: using max heart rate with clients",
      "For most clients, a formula max is good enough to start. Use Tanaka for adults over 40, where the classic rule underestimates. Record which formula you used so zones stay consistent. Over the first few weeks, compare the client's logged heart rates with their perceived effort and adjust if they don't match.",
      "Reserve field tests for clients who are healthy, experienced and motivated to train by heart rate. For older clients, beginners and anyone with health concerns, perceived effort and the talk test are safer and nearly as useful. If a client is on medication that affects heart rate, base their training on effort rather than numbers."),
],
"zone-2-heart-rate-calculator": [
    s("Zone 2 by age",
      ("table", ["Age", "% of max (220 − age)", "MAF (180 − age)"], [["25", "117–137 bpm", "145–155 bpm"], ["35", "111–130 bpm", "135–145 bpm"], ["45", "105–123 bpm", "125–135 bpm"], ["55", "99–116 bpm", "115–125 bpm"], ["65", "93–109 bpm", "105–115 bpm"]]),
      "MAF ranges sit higher than the simple percentage method at every age. Karvonen ranges depend on resting heart rate and often fall between the two. Your own zone 2 is the range where the talk test holds."),
    s("Zone 2 and metabolic health",
      "Zone 2 has drawn attention for its effects on metabolic health. Regular moderate aerobic exercise improves insulin sensitivity, helps muscles take up glucose from the blood, and increases the number and function of mitochondria. These changes are linked with lower risk of type 2 diabetes and heart disease.",
      "Many of these benefits come from regular moderate activity in general, not only from staying in a precise heart rate band. Brisk walking, easy cycling and steady swimming all count. The value of a zone 2 target is that it keeps the effort easy enough to do often, which is what drives the long-term change."),
    s("Zone 2 versus higher intensity",
      "Harder training, such as intervals in zones 4 and 5, improves VO2 max more quickly than zone 2 alone. But it is more tiring, harder to recover from and less suitable for daily use. Most well-designed plans combine both: a large base of easy work with one or two harder sessions a week.",
      "For beginners, most fitness gains will come from simply doing more moderate exercise, and zone 2 is an easy way to structure that. As fitness improves, adding a weekly session of harder intervals accelerates progress."),
    s("Tracking zone 2 progress",
      "One of the best ways to see aerobic progress is to track pace or power at a fixed zone 2 heart rate. Run or ride a familiar route every two to four weeks, keeping heart rate in the same range, and note the pace. Over months, most people see their zone 2 pace improve noticeably.",
      "Another sign is heart rate drift. Early on, heart rate may climb several beats during a long zone 2 session. As fitness builds, it stays steadier for longer. Both changes show the aerobic system is adapting."),
    s("For coaches: programming zone 2",
      "Write zone 2 sessions with both the heart rate range and the talk test as cues, so clients have a fallback when the watch reads oddly. Expect new clients to need reminding to slow down; many feel they are not working hard enough. Explain the reason, and show them their pace improving at the same heart rate over time.",
      "Review heart rate logs after each zone 2 session. If average heart rate sits above the range, the client is going too hard; if well below, the range may be set too high for them. Adjust the method or max as needed."),
],
"interval-walking-calculator": [
    s("Interval walking for different goals",
      ("ul", [
          "**Fitness:** the full protocol, five rounds four or more days a week, with fast intervals at a somewhat hard effort.",
          "**Blood pressure:** the same protocol; research shows meaningful falls in systolic blood pressure over several months.",
          "**Weight management:** combine interval walking with a daily step goal and a moderate calorie deficit.",
          "**Returning to exercise:** start with three rounds, two or three days a week, and build up over weeks.",
          "**Older adults:** the protocol was designed for them and is generally well tolerated, with intervals adjusted to ability.",
      ]),
      "Whatever the goal, consistency over months matters more than any single session."),
    s("Progressing your sessions",
      "Once five rounds four times a week feels comfortable, there are several ways to progress. Add a sixth or seventh round. Walk the fast intervals on a gentle incline. Shorten the slow intervals to two minutes. Or add a fifth session each week. Change one thing at a time and give it two or three weeks before changing another.",
      "Some people eventually find that their fast intervals turn into jogging. That is a sign of improved fitness, and a jog-walk programme is a natural next step for those who want it."),
    s("Safety and comfort",
      "Wear supportive shoes and choose a route with good footing. Start each session with a few minutes of easy walking, and finish with a few minutes of easy walking to cool down. Drink water on warm days and avoid the hottest part of the day.",
      "If you have a heart condition, high blood pressure, diabetes, joint problems or have been inactive for a long time, speak to a doctor before starting. Stop and seek advice if you notice chest pain, dizziness, unusual breathlessness or joint pain that persists."),
    s("Interval walking versus running",
      "Running burns more calories per minute and builds fitness faster, but it places much greater impact on the joints. Interval walking offers a middle ground: a meaningful training effect with impact closer to normal walking. For people who cannot or prefer not to run, it is one of the most effective forms of exercise available.",
      "Runners can also use interval walking as an active recovery session or during a return from injury, keeping some aerobic work without the strain of running."),
    s("Tracking interval walking",
      "Record each session: rounds completed, the pace or route, and how hard the fast intervals felt. Every few weeks, walk a familiar route at your usual fast-interval effort and note your pace or distance. A faster pace at the same effort is a clear sign of improvement.",
      "If you track blood pressure at home, measure it at the same time of day every week or two. Many people see a gradual fall over the first few months of regular interval walking."),
],
}

EXTRA["heart-rate-zone-calculator"] += [
    s("Zones for different goals",
      ("table", ["Goal", "Weekly emphasis"], [["General health", "150+ minutes in zones 2 and 3, some brief zone 4 efforts"], ["Fat loss", "Regular zone 2 sessions, daily walking, one harder session"], ["5K or 10K race", "Mostly zone 2, plus weekly zone 4 and zone 5 intervals"], ["Half or full marathon", "High zone 2 volume, long runs, steady zone 3 and some zone 4"], ["Strength athletes", "Two or three short zone 2 sessions for recovery and work capacity"]]),
      "These are starting points. A coach will adjust the mix to the client's schedule, history and how they respond."),
    s("Choosing a heart rate monitor",
      "Chest straps measure the heart's electrical signal and respond quickly to changes in effort. Wrist and arm monitors use light to detect blood flow, which works well at steady efforts but can lag or misread during intervals, cold weather or strength work. For zone training, either can work; for intervals and accurate peak readings, a chest strap is the better tool. Wear wrist monitors snug, just above the wrist bone, for the best results."),
]
EXTRA["max-heart-rate-calculator"] += [
    s("Other formulas you may see",
      "Several other equations exist. Nes and colleagues (2013) proposed 211 − 0.64 × age from a large Norwegian study of healthy adults. Some researchers have proposed separate formulas for women, such as Gulati's 206 − 0.88 × age, from a study of over 5,000 women. Each gives slightly different numbers, and none removes the individual spread of about 10 beats.",
      "The calculator shows the three most widely used formulas. If a coach or programme you follow uses a different one, the differences are usually small compared with the natural variation between people. Consistency matters more than which formula you pick."),
    s("A worked example",
      "Take a 45-year-old with a resting heart rate of 62. The classic rule gives 175 bpm, Tanaka 176.5 and Gellish 175.5, so all three agree at about 175 to 177. Using Tanaka, heart rate reserve is about 114.5 beats. Zone 2 by the simple method is 106 to 124 bpm; by Karvonen it is 131 to 142 bpm.",
      "If this client completes a hard hill test and sees a peak of 184 bpm, their real max is likely around 185. Their zones would then rise by about five to seven beats. That change matters: easy runs set from the formula would have been slightly too easy, and threshold intervals slightly too gentle."),
    s("Heart rate and medicines",
      "Beta blockers slow the heart and blunt its response to exercise, often lowering both resting and maximum heart rate by 20 to 30%. Some calcium channel blockers have a similar effect. Thyroid medication, decongestants and stimulants can raise heart rate. For anyone taking these, age-based formulas do not apply.",
      "In these cases, use perceived exertion: moderate exercise feels like 4 to 6 out of 10, vigorous like 7 to 8. The talk test is also reliable. A doctor or cardiac rehabilitation team can provide personalised heart rate ranges if needed."),
]
EXTRA["zone-2-heart-rate-calculator"] += [
    s("Zone 2 for different activities",
      "Zone 2 heart rate is a few beats lower in cycling and swimming than in running for the same effort, because less muscle mass is working against gravity. If you set your zone from running, you may find it hard to reach on the bike; aim for the lower end of the range, or trust the talk test.",
      "Walking uphill, especially on a treadmill incline, is one of the easiest ways for beginners to hold zone 2 without running. Rowing and elliptical machines also work well. Choose an activity you can sustain at a steady effort for 30 minutes or more."),
    s("A sample zone 2 week",
      ("table", ["Day", "Session"], [["Monday", "45 minutes zone 2 run or ride"], ["Tuesday", "Strength training"], ["Wednesday", "30 minutes zone 2, plus 4 × 4 minutes in zone 4"], ["Thursday", "Rest or easy walk"], ["Friday", "45 minutes zone 2"], ["Saturday", "Strength training"], ["Sunday", "60 to 90 minutes zone 2"]]),
      "This week includes about three hours of zone 2 and one harder session, a common balance for people training for health and endurance. Fewer sessions still bring benefits; the key is regular, easy aerobic work."),
]
EXTRA["interval-walking-calculator"] += [
    s("Walking METs and body weight",
      "Calories from walking rise with body weight, because moving a heavier body takes more energy. A 70 kg person doing the same Japanese session burns about 147 calories; an 80 kg person about 168. The time and paces are the same, but the energy cost scales with mass.",
      "MET-based estimates assume average walking efficiency. People who walk often, or with a long, smooth stride, may use slightly less energy than the estimate; those new to brisk walking may use slightly more. The numbers are best used to compare sessions, not as exact measures."),
    s("For coaches: programming interval walking",
      "Interval walking is a good fit for clients who are new to exercise, older, carrying extra weight, or recovering from injury. Write the session in the plan with clear cues: three minutes at a pace that makes conversation hard, three minutes at a stroll, five times. Ask clients to log how many rounds they completed and how the fast intervals felt.",
      "Check in after two weeks. If the fast intervals feel easy, suggest a faster pace or a slight incline. If clients are struggling to complete five rounds, start with three and build up."),
]

EXTRA["heart-rate-zone-calculator"] += [
    s("When to recalculate your zones",
      "Recalculate when your resting heart rate changes by five beats or more, after a field test or race that shows a higher maximum, or every couple of years as you age. Also revisit zones if sessions consistently feel easier or harder than the zone suggests. Zones are a tool to guide effort, so they should match what you feel, not override it.",
      "Keep a note of the method and max you used, so you can compare training from one season to the next on the same scale."),
]
EXTRA["max-heart-rate-calculator"] += [
    s("Common myths about max heart rate",
      ("ul", [
          "**Exceeding the formula is dangerous.** Many healthy people reach heart rates above their age-predicted max. The formula is an average, not a limit.",
          "**A lower max means lower fitness.** Max heart rate does not predict performance. Elite athletes have a wide range of maximums.",
          "**You should never train near your max.** Short, hard intervals near max are a normal part of training for healthy, prepared people.",
          "**Max heart rate is the same for every sport.** Running often produces higher peaks than cycling or swimming.",
          "**Fitter people have a higher max.** Fitness lowers resting heart rate; max changes little.",
      ]),
      "Understanding these points helps clients use heart rate data calmly and sensibly, rather than worrying about a number that is mostly set by age and genetics."),
    s("Measuring heart rate accurately during exercise",
      "Chest straps give the most reliable readings during hard efforts, because they measure the electrical signal directly. Optical sensors on the wrist can be thrown off by movement, sweat, cold skin and a loose fit, and sometimes lock onto running cadence instead of heart rate, giving a false high. If you see a sudden spike that doesn't match the effort, it is probably a sensor error rather than your heart."),
]
EXTRA["zone-2-heart-rate-calculator"] += [
    s("When the methods give very different numbers",
      "For some people, the percentage-of-max range and the MAF range barely overlap. A 30-year-old with a resting heart rate of 50 gets 114 to 133 bpm by percentage of max, 134 to 148 by Karvonen and 140 to 150 by MAF. These differences reflect different definitions of zone 2, from conservative to generous.",
      "Start with the lowest range that still lets you hold a steady effort, then check against the talk test. If you can easily sing at the top of the range, move up to the next method. Over time, a lab or field test can pin down your first lactate or ventilatory threshold more precisely."),
]
EXTRA["interval-walking-calculator"] += [
    s("A first four weeks",
      ("table", ["Week", "Sessions", "Rounds per session"], [["1", "3", "3"], ["2", "3", "4"], ["3", "4", "4"], ["4", "4", "5"]]),
      "By week four, this plan reaches the full protocol of five rounds four times a week. If a week feels too hard, repeat it before moving on. Adding a strength session or two alongside gives the broadest benefits for health and fitness."),
]

EXTRA["heart-rate-zone-calculator"] += [
    s("A note on safety",
      "Heart rate zones are for healthy adults. If you have a heart condition, high blood pressure, take medication that changes heart rate, or are returning after illness, speak to a doctor before using higher zones. Stop and seek advice if you feel chest pain, dizziness or an irregular heartbeat during exercise."),
]
EXTRA["max-heart-rate-calculator"] += [
    s("Recording your result",
      "Write down your estimated or tested max, the formula or test you used, and the date. Add your resting heart rate from the same week. These three facts let you, or a coach, rebuild your zones exactly at any time and compare training from one year to the next on the same scale. If you later test and find a different max, note the new number and the date rather than overwriting the old one, so changes stay traceable."),
]
EXTRA["zone-2-heart-rate-calculator"] += [
    s("Is zone 2 the same as the fat-burning zone?",
      "Gym machines often label a fat-burning zone at a similar intensity. At zone 2 effort, a larger share of energy comes from fat than at higher intensities. Total calories, though, are higher at harder efforts. For body fat, total energy balance across the week matters most; zone 2 is useful because it can be done often without much fatigue."),
]
EXTRA["interval-walking-calculator"] += [
    s("Using a timer",
      "The changes every three minutes are easy to miss when walking outdoors. A timer that beeps at each change keeps the intervals honest and lets you focus on the walk. The workout timer on this site can be set to custom intervals: 180 seconds of work, 180 seconds of rest, five rounds."),
]

EXTRA["max-heart-rate-calculator"] += [
    s("Max heart rate in children and teenagers",
      "Young people have higher maximum heart rates than adults, often above 200 bpm, and the adult formulas are less reliable for them. For under-18s, effort-based guidance and the talk test are usually more practical than heart rate targets. School and club coaches often use perceived exertion for this reason."),
]
