"""Extra original sections for Phase 4 batch C."""
from phase4_common import s

EXTRA = {
"race-time-predictor": [
    s("Predicting from a half marathon",
      "A half marathon is the best single predictor of marathon fitness for most runners, because it tests sustained endurance over 90 minutes or more. From a 1:50:00 half marathon, Riegel predicts a marathon of about 3:49:21. From a 2:00:00 half, about 4:10:12. Even so, many first-time marathoners run 5 to 10 minutes slower than these predictions, especially if their long runs have been shorter than about 30 km.",
      "For a marathon goal, combine the half marathon prediction with your training. If you have done several long runs of 30 to 35 km, consistent weekly mileage and practised fuelling, the prediction is a reasonable target. If not, add time."),
    s("Fitness versus training for a distance",
      "The predictor tells you what your current fitness could produce at each distance, if you had trained specifically for it. Specific training changes which predictions you can actually achieve. A runner moving from 5K to the half marathon needs longer runs and more weekly volume. A runner moving from the marathon down to the 5K needs faster intervals and more speed work.",
      "This is why many runners find their predicted times are easier to hit at some distances than others. Your strongest distance is usually the one you train for most. Over time, a balanced plan brings the predictions and your actual results closer together."),
    s("How age and sex affect predictions",
      "Riegel's formula applies equally to men and women and to runners of all ages, because it describes how time grows with distance rather than absolute speed. Some research suggests older runners and women slow slightly less over long distances than younger men, but the differences are small for most recreational runners.",
      "To compare performances across ages and sexes, age-grading is more useful. It expresses a time as a percentage of the world-record standard for your age and sex. A 25:00 5K is a stronger age-graded performance for a 60-year-old than for a 30-year-old, though Riegel predicts the same 10K time for both."),
    s("Conditions that change race times",
      ("ul", [
          "**Heat and humidity:** can slow long races by several per cent; above about 20 °C, marathon times rise noticeably.",
          "**Hills:** a hilly course can add minutes to a half or full marathon.",
          "**Wind:** a headwind on exposed sections costs time that a tailwind doesn't fully return.",
          "**Altitude:** reduces oxygen availability and slows longer races.",
          "**Course accuracy:** GPS and course measurement differ; certified courses are the most reliable for comparison.",
      ]),
      "When you enter a race into the predictor, consider how its conditions compare with your target race. A result from a cool, flat race will predict faster times than one from a hot, hilly race."),
    s("For coaches: using predictions with clients",
      "Race predictions help set realistic goals and training paces. After a client races or time-trials, enter the result, review the predicted times together and choose a target for their next race. Explain that longer predictions assume training for that distance, and agree on a goal that reflects their current preparation.",
      "Use the predicted paces to write sessions: intervals at 3K to 5K pace, threshold work at 10K to half marathon pace and easy runs well slower than marathon pace. Update the input race every 6 to 12 weeks so the paces keep pace with improving fitness."),
    s("A worked training example",
      "Take a runner with a 25:00 5K preparing for a 10K in 12 weeks. Riegel predicts 52:07, or 5:13 per km. A realistic goal might be 52 to 53 minutes. Their week could include one interval session of 5 × 1 km at 4:55 to 5:00 per km, one threshold run of 20 minutes at about 5:15 per km, a long run of 10 to 14 km at around 6:15 per km, and two easy runs.",
      "After six weeks, they run another 5K in 24:15. The new prediction for 10K is 50:34, and their training paces drop by about 10 to 15 seconds per kilometre. This is how predictions and training paces evolve together through a training block."),
    s("Ultra-distance and very short races",
      "Riegel's 1.06 exponent fits races from roughly 3.5 minutes to 4 hours. Beyond the marathon, in ultra-marathons, runners slow much more than the formula predicts, because of fatigue, terrain, fuelling and walking breaks. For very short races such as the 400 m and 800 m, sprint speed and anaerobic capacity play a larger role, and the formula is less reliable.",
      "For these distances, use specialised tables or your own race history instead. The predictor works best from 1500 m to the marathon."),
    s("Pacing your target race",
      "Once you have a target time, turn it into splits. For a 52:07 10K, that is 5:13 per km, or about 26:03 at halfway. Aim to run the first kilometre no faster than target pace, settle in, and pick up the pace in the final 2 to 3 km if you feel strong.",
      "For a marathon, an even or slightly negative split is the goal. Starting even 10 seconds per kilometre too fast can cost minutes in the final 10 km. Practise target pace in training so it feels familiar on race day."),
    s("How often to update your predictions",
      "Re-run the predictor whenever you set a new best or complete a race in good conditions. During a structured training block, a time trial every 6 to 8 weeks keeps predictions and paces current. If a race goes badly because of heat, illness or a poor start, don't let it lower your training paces; wait for a better result."),
],
"running-pace-calculator": [
    s("Negative splits",
      "A negative split means running the second half of a race faster than the first. It is how most world records are set, and it works for recreational runners too. Starting slightly under target pace saves energy, and finishing strong feels much better than fading.",
      "For a 50:00 10K, a negative split might be 25:15 for the first 5 km and 24:45 for the second, or 5:03 per km then 4:57 per km. The total is the same, but the race feels more controlled. Practise in training with progression runs, where each section is a little faster than the last."),
    s("Pace and heart rate together",
      "Pace tells you how fast you are going; heart rate tells you how hard your body is working. On a hot, windy or hilly day, holding target pace may push heart rate much higher than usual. On those days, it is often better to run by effort or heart rate, and accept a slower pace.",
      "Over months, your pace at the same heart rate should improve. A runner who runs 6:30 per km at 140 bpm in January and 6:00 per km at 140 bpm in May has become fitter. Tracking both numbers gives a clear picture of progress."),
    s("Pace for walking and run-walk",
      "Walking pace is usually between 9:00 and 12:00 per km, or 14:30 to 19:20 per mile. Brisk walking is around 9:00 to 10:00 per km. Run-walk methods, such as running for four minutes and walking for one, give an average pace between the two and are a good way to build up to continuous running or complete long races comfortably.",
      "Enter the total distance and time of a run-walk session to find your average pace. That average is the most useful number for planning races and comparing sessions."),
    s("For coaches: setting paces for clients",
      "Use a recent race or time trial to set a client's training paces, and write them into each session as a range, such as 6:10 to 6:30 per km for easy runs. Ranges allow for hills, weather and how the client feels, while still giving clear guidance.",
      "Review logged paces each week. If easy runs are consistently faster than the range, the client may be running too hard on easy days. If interval paces are slower than target, the session may be too long or the client too tired. Small adjustments keep training on track."),
    s("Converting between km and miles",
      "To convert pace per km to pace per mile, multiply by 1.609. To convert pace per mile to pace per km, divide by 1.609. A 6:00 per km pace is 9:39 per mile; an 8:00 per mile pace is 4:58 per km. The calculator shows both, so you can follow plans written in either unit.",
      "Race distances follow the same logic. A 5K is 3.11 miles, a 10K 6.21 miles, a half marathon 13.1 miles and a marathon 26.2 miles."),
],
"rucking-calorie-calculator": [
    s("Rucking versus walking and running",
      ("table", ["Activity, 175 lb person, 60 min", "Approximate calories"], [["Walking 3 mph, no load", "287"], ["Rucking 3 mph, 30 lb, flat", "323"], ["Rucking 3 mph, 30 lb, 5% grade", "511"], ["Rucking 4 mph, 30 lb, flat", "491"], ["Running 6 mph (10:00 per mile)", "About 815"]]),
      "Running burns the most calories per minute, but rucking on hills closes much of the gap with far less impact on the joints. The walking and rucking figures come from the Pandolf equation; the running figure uses a MET value of about 9.8 from the Compendium of Physical Activities."),
    s("Benefits beyond calories",
      "Rucking builds muscular endurance in the legs, glutes, back and core, because they work to carry and stabilise the load. It improves posture when the pack is fitted well, and places a mild load on the bones, which supports bone density. It also raises heart rate enough to improve aerobic fitness, often into zone 2 or 3 on flat ground and higher on hills.",
      "Because it is low impact and easy to scale, rucking suits a wide range of people, from beginners to athletes. It is also social and outdoor-friendly, which helps many people stick with it."),
    s("Choosing a pack and load",
      "A purpose-built rucking pack with a plate pocket keeps the weight high and close to the back, which is easier on the shoulders and spine. A sturdy hiking backpack with a hip belt also works. Weight plates, sandbags or water bottles wrapped in a towel can provide the load; make sure it doesn't shift as you walk.",
      "Weighted vests spread the load around the torso and suit shorter sessions and gym work. For longer walks, a backpack with a hip belt is often more comfortable, because it transfers some weight to the hips."),
    s("A sample progression",
      ("table", ["Weeks", "Load (175 lb person)", "Session"], [["1–2", "15 lb", "2 × 30 min flat"], ["3–4", "20 lb", "3 × 30 to 40 min, some gentle hills"], ["5–6", "25 lb", "3 × 40 to 50 min, mixed terrain"], ["7–8", "30 lb", "2 × 45 min plus one 60 to 75 min walk"]]),
      "Increase one variable at a time: time, then terrain, then load. If you feel pain in your back, knees or feet, step back a week."),
    s("For coaches: programming rucking",
      "Rucking can replace or complement a client's cardio sessions, especially for those who dislike running or need low-impact options. Write sessions with clear targets for load, time and route, and ask clients to log distance, pace and how their back and feet felt afterwards.",
      "Pair rucking with strength training for the back, hips and core, such as deadlifts, rows, carries and planks. Those muscles carry the load, and building their strength makes rucking safer and more comfortable."),
],
"workout-timer": [
    s("Sample sessions",
      ("table", ["Session", "Mode", "Settings"], [["Kettlebell EMOM", "EMOM", "12 min: odd minutes 12 swings, even minutes 8 goblet squats"], ["Bodyweight circuit", "AMRAP", "15 min: 10 push-ups, 15 squats, 20 mountain climbers"], ["Bike Tabata", "Tabata", "20 s all-out, 10 s easy, 8 rounds"], ["Track intervals", "Custom", "90 s hard, 90 s jog, 8 rounds"], ["Circuit stations", "Custom", "45 s work, 15 s change, 10 rounds"]]),
      "Adjust the work and rest to your fitness. A session should be challenging but leave you able to finish with good technique."),
    s("Programming interval workouts",
      "Intervals are powerful, but they are also tiring. Most people do best with one to three interval or circuit sessions a week, separated by easier days or strength sessions. Very short, very intense formats such as Tabata are best kept to a few blocks per session, with full recovery between blocks.",
      "Warm up for 5 to 10 minutes before any interval session, with easy movement and some practice of the exercises at lower intensity. Cool down afterwards with a few minutes of easy movement. Both reduce injury risk and help the session feel better."),
    s("Choosing exercises for each format",
      ("ul", [
          "**EMOM:** exercises that take 20 to 40 seconds to complete, such as a set of swings, push-ups or a short row.",
          "**AMRAP:** a circuit of three to five simple exercises that can be done safely when tired.",
          "**Tabata:** full-body or cyclical exercises such as bike sprints, rowing, burpees or jump squats.",
          "**Custom:** any exercise, depending on the goal; long intervals suit running, rowing or cycling.",
      ]),
      "Avoid complex, technical lifts in high-fatigue formats. Technique tends to break down when tired, which raises injury risk. Save heavy or technical lifts for EMOMs with plenty of rest."),
    s("Tracking timer workouts",
      "Record each session: the format, exercises, loads, and your score. For AMRAPs, note rounds and extra reps. For EMOMs, note whether you finished the work each minute. For Tabata and custom intervals, note distance, reps or calories per round if your equipment shows them.",
      "Over time, these records show progress. Completing an extra round in the same AMRAP, or keeping more rest time in an EMOM, are clear signs of improved fitness."),
    s("For coaches: using the timer with clients",
      "The timer works well for group classes, in-person sessions and remote clients. Put it in fullscreen on a laptop or TV for groups, or send a client the settings so they can run the same session at home. Pair it with a written plan so the client knows exactly which exercises fill each interval.",
      "Ask clients to log their scores after each session. Reviewing them every week shows whether the plan is working and when to increase the challenge, for example by adding rounds, reducing rest or increasing load."),
    s("Accessibility and settings",
      "The clock is large and high contrast for easy reading. Status changes, such as work, rest and done, are announced to screen readers. The space bar starts and pauses the timer when focus isn't in a text field. Sound can be turned off for quiet spaces, and the clock keeps accurate time if you switch tabs for music, though some browsers delay beeps in background tabs.",
      "If your browser blocks sound until you interact with the page, press Start once to enable it. Some phones mute web audio when the ringer is silent; check your device settings if you hear no beeps."),
],
}

MORE = {
"race-time-predictor": [
    s("Common questions about predictions",
      ("ul", [
          "**Should I use my best ever time?** Use a recent result that reflects your current fitness, ideally from the last two to three months.",
          "**What if I only have a parkrun time?** A parkrun is a 5K and works well, as long as you ran it hard and the course is accurate.",
          "**Can I predict a trail race?** Not reliably. Elevation, surface and technical terrain change times far more than distance alone.",
          "**Why do predictions differ between apps?** Some use different exponents or methods such as VDOT. Differences are usually small up to the half marathon.",
      ]),
      "If two methods give different marathon predictions, the slower one is usually the safer target for a first attempt."),
    s("A summary",
      "Riegel's formula, T2 = T1 × (D2 ÷ D1)^1.06, turns one race into equivalent times at other distances. It works best for races of similar length and assumes training for each distance. Use a recent, all-out result on an accurate course, treat long-distance predictions as a best case, and update them as your fitness improves.",
      "Used this way, a race time predictor helps set realistic goals, choose training paces and plan race-day splits, with fewer surprises on the start line."),
    s("Predictions and race-day decisions",
      "On race day, the prediction becomes a pacing plan. Check the weather and course; if it is hot or hilly, start 5 to 10 seconds per kilometre slower than target and adjust as you go. If you feel strong past halfway, increase the pace gradually rather than surging. A prediction is a guide to what is possible, but your body on the day has the final say."),
],
"running-pace-calculator": [
    s("Pace on hills and trails",
      "Hills change pace far more than effort. Running uphill at your usual flat pace takes a much higher effort, while downhill pace can be quicker for the same effort. On hilly routes, judge by effort or heart rate and accept slower uphill splits. Your average pace for a hilly run will be slower than for a flat run of the same effort.",
      "Trails add uneven ground, mud, rocks and technical sections, which slow pace further. Many trail runners ignore pace altogether and focus on time on feet and effort."),
    s("Using pace to plan a race",
      "Decide your target time, then use the calculator to find the pace you need. For a 25:00 5K, that is 5:00 per km. Break the race into segments: a controlled first kilometre, steady middle kilometres at target pace and a strong finish.",
      "Run some of your training at target race pace, so it feels familiar. If you can hold it comfortably for half the race distance in training, the full distance on race day is realistic."),
    s("Pace for beginners",
      "If you are new to running, don't worry about pace at first. Run at an effort that lets you talk in full sentences, even if that means walking breaks. Your pace will improve naturally as fitness builds. Many beginners improve their 5K pace by a minute or more per kilometre in their first few months.",
      "Track your pace for the same route every few weeks. A faster time at the same effort is a clear sign of progress, and a good motivator."),
],
"rucking-calorie-calculator": [
    s("Rucking for weight loss",
      "Rucking is a useful addition to a weight loss plan because it raises the energy cost of walking while staying low impact. Three one-hour rucks a week at the flat-pavement figure above add up to nearly 1,000 calories. With hills, that rises quickly. It also builds muscle, which helps preserve lean mass during a calorie deficit.",
      "As with any exercise, the calories burned matter less than the overall energy balance from food. Rucking works best alongside a moderate calorie deficit, enough protein and strength training."),
    s("Common rucking mistakes",
      ("ul", [
          "**Too heavy, too soon:** the most common cause of back, hip and foot pain.",
          "**A loose pack:** a load that swings or sits low strains the lower back.",
          "**Poor footwear:** thin soles and no grip make long rucks uncomfortable.",
          "**Leaning forward:** stand tall and keep the pack close to your back.",
          "**Skipping recovery:** heavy rucking on consecutive days can overload the feet and joints.",
      ]),
      "Avoiding these keeps rucking comfortable and sustainable as you progress."),
    s("Hydration and conditions",
      "Carrying a load raises body heat and sweat rate. On warm days, carry water and drink regularly, and consider a lighter load or a cooler time of day. In cold or wet weather, layers and a waterproof pack cover keep you comfortable. Use a reflective layer or light when rucking in low light near roads."),
],
"workout-timer": [
    s("Safety",
      "High-intensity intervals are demanding. If you are new to exercise, have a heart condition, high blood pressure, joint problems or other health concerns, speak to a doctor before starting. Build up gradually: start with fewer rounds, longer rest and moderate intensity, and increase over weeks.",
      "Stop and rest if you feel dizzy, light-headed, short of breath beyond normal exertion, or feel chest pain. Technique should stay good throughout; if it slips, lower the intensity or take extra rest."),
    s("EMOM, AMRAP or Tabata: which to choose",
      "Choose EMOM when you want controlled, repeatable work with built-in rest, such as strength or skill practice. Choose AMRAP when you want a measurable conditioning test or a continuous circuit. Choose Tabata for a short, very intense finisher at the end of a session. Choose custom when you need specific work and rest periods, such as running intervals or a programme from your coach.",
      "Mixing formats across the week keeps training varied and works different qualities. A week might include an EMOM strength session, a custom interval run and a short AMRAP circuit."),
    s("How the timer counts",
      "The timer counts down each work and rest period separately and shows the current round. For EMOM, each minute is one round. For AMRAP, there is a single round lasting the whole block. For Tabata and custom modes, each round includes a work period followed by a rest period, unless rest is set to zero.",
      "The total shown under the clock is the full length of the session. A Tabata of 8 rounds at 20 and 10 seconds is 4:00; a custom session of 6 rounds at 40 and 20 seconds is 6:00; an EMOM of 10 minutes is 10:00. Changing any setting resets the clock."),
    s("Using the timer for rehabilitation and mobility",
      "Timed intervals are useful beyond hard training. Physiotherapists often prescribe exercises for set times, such as 30-second holds or 45 seconds of a movement followed by rest. Custom mode handles these easily: set the hold time as work, the rest as rest, and the number of sets as rounds.",
      "Mobility and stretching routines also suit custom mode, with 30 to 60 seconds per position and a few seconds between. The beeps let you focus on the movement rather than the clock."),
],
}
for k, v in MORE.items():
    EXTRA[k] = EXTRA[k] + v

EXTRA["race-time-predictor"] += [
    s("Predictions for the mile and 1500 m",
      "Shorter predictions from a longer race tend to be conservative for runners with good speed and optimistic for runners who mostly train for endurance. A marathoner who rarely runs fast may find their predicted mile time hard to reach, because the mile relies heavily on anaerobic capacity and running economy at high speed.",
      "If you want to race a mile or 1500 m, include short, fast repetitions such as 200 m and 400 m at mile pace, with full recovery, for several weeks before the race. That speed work often brings your actual time close to, or faster than, the prediction."),
    s("Tracking progress with predictions",
      "Keep a log of each race or time trial and the predictions it gives. Over a season, you can see how your fitness changes at every distance from a handful of results. If predictions from your recent 5K and 10K are converging, your training is balanced; if one lags, it shows which quality, speed or endurance, needs more attention.",
      "For coaches, a simple table of a client's results and predictions over time is one of the clearest ways to show progress and explain changes to the plan."),
]
EXTRA["running-pace-calculator"] += [
    s("Pace and cadence",
      "Pace depends on cadence, the number of steps per minute, and stride length. Most runners naturally increase both as they speed up. Very low cadence with long, reaching strides can increase impact and injury risk. Many coaches suggest a modest increase in cadence, around 5 to 10%, for runners who overstride, without forcing a specific number.",
      "Small changes to cadence rarely change pace much on their own, but they can make running feel smoother and more efficient. Combine them with regular easy running and strength work for the best results."),
    s("A quick summary",
      ("ul", [
          "**Pace:** time ÷ distance, in minutes per km or per mile.",
          "**Speed:** distance ÷ time, in km/h or mph.",
          "**Convert:** pace per mile = pace per km × 1.609.",
          "**Race times:** multiply pace by distance, remembering that pace usually slows over longer races.",
      ]),
      "Use pace to plan sessions and races, check your splits and track progress on familiar routes."),
]
EXTRA["rucking-calorie-calculator"] += [
    s("Calories per mile",
      "Because rucking is slow, it can help to think in calories per mile. In the flat-pavement example at 3 mph, the 175 lb walker with 30 lb burns about 108 calories per mile. On a 5% grade, that rises to about 170 calories per mile. Without the pack, flat walking costs about 96 calories per mile.",
      "Calories per mile make it easy to plan a route: a 4-mile flat ruck at this load is roughly 430 calories, and a 4-mile hilly ruck roughly 680. The calculator gives precise figures for your own weight, load and route."),
    s("Rucking and heart rate",
      "Rucking on flat ground at a steady pace often keeps heart rate in zone 2, making it a good aerobic base session. Hills and heavier loads push heart rate higher, into zone 3 or 4. Wearing a heart rate monitor helps you choose the right load and route for the session you want: easy and long, or shorter and harder."),
]
EXTRA["workout-timer"] += [
    s("Building a session around the timer",
      "A full session might include a 10-minute warm-up, a strength block, a conditioning block using the timer and a short cool-down. For example: warm-up, then a 12-minute EMOM of alternating squats and rows, then two Tabata blocks of bike sprints with two minutes of easy pedalling between, then five minutes of easy movement and stretching.",
      "Planning the whole session in advance, with the timer settings for each block, keeps the workout moving and the effort where you intended it."),
    s("Group and class use",
      "For classes, the fullscreen clock and loud beeps let everyone follow the same intervals. Set the timer before the class starts, explain each format briefly, and demonstrate the exercises. For mixed-ability groups, give scaled options for each exercise, such as lighter loads, fewer reps or lower-impact movements, so everyone can work within the same intervals.",
      "In circuit formats, set rest to the time needed for people to move between stations, usually 10 to 20 seconds."),
    s("Why a dedicated timer helps",
      "Watching a clock while training breaks concentration and leads to sloppy intervals: rest periods creep longer and work periods get cut short. A timer with clear beeps keeps the structure honest, so the session you planned is the session you complete. That consistency is what makes progress measurable from week to week."),
]

EXTRA["race-time-predictor"] += [
    s("When a prediction feels too slow",
      "If your predicted time at a shorter distance looks slower than you expect, your input race may have been held back by conditions, pacing or fatigue. It may also mean that speed is a relative weakness. A few weeks of shorter, faster intervals often bring short-race times ahead of the prediction. Run a short time trial after that block and enter the new result to see how the predictions change across every distance."),
]
EXTRA["running-pace-calculator"] += [
    s("Recording your runs",
      "Log distance, time and average pace for each run, along with the route and how it felt. Comparing the same route every few weeks is the simplest way to see progress. Note the weather too: a slower run on a hot or windy day isn't a sign of lost fitness."),
]
EXTRA["rucking-calorie-calculator"] += [
    s("A quick summary",
      "Rucking calories depend most on grade and pace, then terrain, then load. Start light, progress gradually and use the Pandolf estimate to compare routes and sessions rather than as an exact measure."),
]
EXTRA["workout-timer"] += [
    s("Keyboard and screen tips",
      "Click anywhere outside the input fields, then press the space bar to start or pause. Use the Tab key to move between controls; each one shows a visible focus outline. Fullscreen mode can be exited with the Escape key. On phones, rotate to landscape for a larger clock, and turn on Do Not Disturb so notifications don't interrupt the session."),
]

EXTRA["race-time-predictor"] += [
    s("Predictions for walkers",
      "Riegel's formula was fitted to running and race walking records, so it also works reasonably for walkers. A walker who completes 5 km in 45 minutes would get a predicted 10 km of about 1:33:49. Walkers tend to slow less over distance than runners, so long walking predictions can be closer to reality than long running predictions."),
]
EXTRA["running-pace-calculator"] += [
    s("Pace and age",
      "Pace naturally slows with age, by roughly 0.5 to 1% a year after the mid-30s for most runners. Age-graded scores let you compare your pace with standards for your age, which is a fairer measure of progress for older runners than raw pace."),
]
