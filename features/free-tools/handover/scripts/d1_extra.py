"""Extra original sections for the lift family pages."""


def _s(h, *blocks):
    return (h, list(blocks))


EXTRA = {}

EXTRA["one-rep-max-calculator"] = [
    _s("A worked example",
       "A lifter squats 100 kg for 6 reps, finishing with about one rep left in the tank. Using Epley, 100 × (1 + 6 ÷ 30) = 120 kg. Using Brzycki, 100 × 36 ÷ (37 − 6) = 116 kg. Either estimate is a sensible basis for training. A training max at 90 percent of the Epley figure would be 108 kg, so a set of five at 80 percent of the training max would be about 86 kg, and a heavy triple at 90 percent about 97 kg.",
       "If the same lifter manages 100 kg for 8 reps a month later, the Epley estimate rises to about 127 kg, a gain of roughly 6 percent. That kind of steady improvement is what estimated maxes are best at showing."),
    _s("Reps to percentage: a quick reference",
       "The table below uses Epley to show roughly how many reps most lifters can perform at each share of their max. Use it to choose loads for a target rep range, or to sanity-check whether a set was close to failure.",
       ("table", ["% of 1RM", "Approximate reps to failure"], [
           ["100%", "1"], ["95%", "2"], ["90%", "3 to 4"], ["85%", "5 to 6"], ["80%", "7 to 8"],
           ["75%", "10"], ["70%", "12 to 13"], ["65%", "16"], ["60%", "20"],
       ]),
       "Individual results vary. Some lifters can do noticeably more reps at a given percentage, others fewer, and the gap widens at lower percentages."),
    _s("Upper-body and lower-body lifts behave differently",
       "Research comparing prediction equations across lifts suggests they tend to be slightly more accurate for upper-body lifts such as the bench press than for large lower-body lifts such as the squat and deadlift, where fatigue in the back, grip and cardiovascular system can limit reps before the target muscles do. Lower-body lifts also allow more reps at a given percentage for many people. In practice, this means an estimated squat or deadlift max from a high-rep set may run a little high, and using sets of five or fewer for those lifts gives more reliable numbers."),
    _s("Using estimates for every lift in a programme",
       "Most strength programmes are built on a few main lifts: squat, bench press, deadlift and overhead press, sometimes with variations such as front squats, paused bench or Romanian deadlifts. Estimating a max for each main lift gives you a complete set of numbers to program from. Accessory lifts, such as rows, lunges and curls, are usually programmed by reps and effort rather than percentages, because their maxes change quickly and are rarely tested.",
       "Keep a simple record for each main lift: date, weight, reps, estimated max and any notes about technique or how the set felt. Over months, this becomes one of the most useful records of your training."),
    _s("When estimates and reality disagree",
       "Occasionally, an estimate will be clearly wrong for you. If you consistently fail to reach your estimated max when testing, you may have better muscular endurance than average, and Brzycki or a lower training max will suit you better. If you regularly exceed your estimate, you may be stronger at low reps than at high reps, which is common in experienced powerlifters. Adjust which formula you use, or apply a personal correction factor, based on how estimates compare with your tested lifts."),
    _s("Strength and age",
       "Strength typically peaks between the late twenties and late thirties and declines gradually afterward, faster from the sixties onward if training stops. Regular strength training slows that decline substantially, and older lifters can still make meaningful gains. For older adults, estimating maxes from sets of six to ten reps, rather than testing heavy singles, is a sensible and safer way to track progress."),
]

EXTRA["bench-press-calculator"] = [
    _s("Muscles the bench press works",
       "The bench press mainly trains the chest (pectoralis major), the front of the shoulders (anterior deltoids) and the triceps. The upper back, lats and forearms work to stabilise the bar and the shoulders. Grip width and bench angle change the balance: a wider grip emphasises the chest, a closer grip the triceps, and an incline bench shifts more of the work to the upper chest and front shoulders."),
    _s("Bench press variations",
       ("ul", [
           "**Paused bench:** a one- to two-second pause on the chest removes the stretch reflex and builds strength from the bottom.",
           "**Close-grip bench:** hands about shoulder-width apart, with more triceps involvement.",
           "**Incline bench:** a 30 to 45 degree bench angle targets the upper chest and shoulders.",
           "**Dumbbell bench:** a larger range of motion and independent arms, useful for balancing strength between sides.",
           "**Spoto press:** pausing just above the chest to build control and strength through the mid-range.",
           "**Floor press:** a shortened range that builds lockout strength and is kind to some shoulders.",
       ]),
       "Each variation has its own max. If you track them, estimate each separately rather than converting between them."),
    _s("A worked example",
       "A lifter benches 80 kg for 6 reps with one rep in reserve. The Epley estimate is 80 × (1 + 6 ÷ 30) = 96 kg. For a strength block, sets of five at about 80 percent of 96 kg is roughly 77.5 kg; heavy triples at about 87 percent is around 82.5 kg. A volume day of sets of eight at 70 percent would be around 67.5 kg. As top sets improve, the estimate and all the percentages rise with them."),
    _s("Bench press and shoulder health",
       "The bench press places considerable demand on the shoulders, and shoulder discomfort is one of the most common complaints among lifters. A few habits help: keep the shoulder blades pulled back and down, avoid flaring the elbows wide, warm up the rotator cuff before heavy sessions, and balance pressing with plenty of rowing and pulling. If a particular grip or angle causes pain, a neutral-grip dumbbell press or floor press is often better tolerated while the shoulder settles."),
    _s("Bench press for women",
       "Women typically have less upper-body muscle relative to body weight than men, so bench press numbers are lower in absolute and relative terms. That is no barrier to steady progress. Using smaller increments, such as 1 to 1.25 kg plates or microplates, helps avoid stalls, and many women find that frequent benching with moderate volume produces consistent gains. The relative strength standards for women reflect these differences, so compare your numbers with those rather than with men's benchmarks."),
    _s("Setting up for a heavy single",
       "On a heavy attempt, the setup is half the lift. Set the bench height so your eyes are under the bar, grip evenly, pull the shoulder blades together, plant the feet and create a stable arch before unracking. Take a breath, brace, lower the bar under control to the same point on your chest every time, and drive it back up and slightly toward your face. Practising this exact sequence on every working set makes heavy singles feel familiar rather than chaotic."),
]

EXTRA["squat-calculator"] = [
    _s("Muscles the squat works",
       "The squat trains the quadriceps, glutes and adductors as the main movers, with the hamstrings, lower back and core working hard to stabilise the trunk. Calves and upper back contribute to balance and bar support. Front squats shift more of the work to the quadriceps and upper back; low-bar squats involve more of the hips and posterior chain."),
    _s("Squat variations",
       ("ul", [
           "**Front squat:** the bar sits on the front of the shoulders, demanding an upright torso and strong upper back.",
           "**Paused squat:** a pause at the bottom builds strength out of the hole and reinforces position.",
           "**Box squat:** sitting back onto a box teaches control and consistent depth.",
           "**Tempo squat:** a slow descent builds control and muscle under tension.",
           "**Safety bar squat:** a padded bar with handles reduces shoulder strain and shifts work toward the upper back.",
           "**Goblet squat:** a dumbbell or kettlebell held at the chest, useful for learning the pattern.",
       ])),
    _s("A worked example",
       "A lifter squats 140 kg for 5 reps at about RPE 9. Epley gives 140 × (1 + 5 ÷ 30) ≈ 163 kg. A training max at 90 percent is roughly 147 kg. A four-week block might use sets of five at 75, 80 and 85 percent of the training max, about 110, 117.5 and 125 kg, before a lighter week. At the end of the block, a new top set gives a fresh estimate for the next cycle."),
    _s("Squat mobility",
       "Many people struggle to reach full depth because of limited ankle, hip or thoracic mobility. Heel-elevated shoes or small plates under the heels make depth easier for people with stiff ankles. A slightly wider stance and turned-out toes help many people with tight hips. Goblet squats and paused bodyweight squats are good ways to practise the bottom position. Working on mobility does not need to be complicated: consistent practice through a full range under light load is often the most effective approach."),
    _s("Squat and knee health",
       "Squatting with good technique is generally safe for healthy knees, and stronger legs often reduce knee pain over time. Common sources of discomfort include sudden jumps in volume or load, knees collapsing inward, and poor recovery. If squats aggravate your knees, reducing depth temporarily, using a box, switching to goblet or Spanish squats, and building back gradually usually helps. Persistent pain, swelling or instability should be assessed by a professional."),
    _s("Squat numbers by experience",
       "New lifters often increase their squat rapidly, sometimes adding weight every session for the first few months as technique improves and the nervous system adapts. After that, progress slows to weekly or monthly increases, and experienced lifters may gain only a few percent over a year. Comparing your estimated max against your own past numbers is more meaningful than comparing with others, because body size, limb length and training history vary so much."),
]

EXTRA["deadlift-calculator"] = [
    _s("Muscles the deadlift works",
       "The deadlift trains almost the entire back of the body: glutes, hamstrings, the spinal erectors along the lower back, and the upper back and traps that keep the bar close and the shoulders set. The quadriceps help break the bar from the floor, especially in sumo and trap-bar variations, and the forearms and grip work hard to hold the bar. Few exercises load as much muscle at once."),
    _s("Deadlift variations",
       ("ul", [
           "**Romanian deadlift:** starting from the top and lowering to mid-shin with soft knees, emphasising the hamstrings and glutes.",
           "**Deficit deadlift:** standing on a low platform to increase range and strength off the floor.",
           "**Block or rack pull:** starting from a raised position to overload the top of the lift.",
           "**Paused deadlift:** pausing just below the knee to reinforce position.",
           "**Trap-bar deadlift:** a more upright pull that many find easier on the lower back and easier to learn.",
           "**Sumo deadlift:** a wide stance with hands inside the knees, shortening the range of motion for many lifters.",
       ]),
       "Estimate a separate max for each variation you track."),
    _s("A worked example",
       "A lifter pulls 180 kg for 4 reps, resetting each rep on the floor, with about one rep left. Epley gives 180 × (1 + 4 ÷ 30) = 204 kg. Brzycki gives 180 × 36 ÷ 33 ≈ 196 kg. For deadlifts, many coaches prefer the more conservative estimate. A training max of 90 percent of 196 kg is about 176 kg, so heavy triples at 90 percent of that would be around 158 kg."),
    _s("Recovery and the deadlift",
       "Heavy deadlifts create a lot of fatigue, both in the muscles and in the nervous system. Many lifters find they need more recovery after a heavy pull than after any other session. That is why programmes often deadlift heavy just once a week, use submaximal loads with crisp technique, and rely on variations and accessory work for additional volume. Pulling heavy singles every week tends to stall progress and raise injury risk."),
    _s("Deadlifting with back concerns",
       "Lower-back discomfort is common among lifters, and the deadlift is often blamed. Most of the time, the cause is a jump in load or volume, fatigue, or a technique change rather than the exercise itself. Reducing load, using a trap bar or block pulls, strengthening the back with lighter variations, and building back up gradually is usually effective. Sharp pain, pain that spreads down the leg, numbness or weakness should be assessed by a professional before continuing."),
    _s("Deadlift records and context",
       "Elite powerlifters can deadlift three times their body weight or more, and the heaviest lifts ever recorded exceed 500 kg. Those numbers reflect years of specialised training, favourable leverages and competition equipment rules. For most people, a deadlift of around twice body weight for men or 1.5 times for women represents years of consistent training and is a strong, healthy target."),
    _s("Conventional or sumo?",
       "Your build often decides which stance suits you. Lifters with long arms and a shorter torso often do well with conventional deadlifts, while those with longer legs, a shorter torso relative to their legs, or limited hip hinge mobility may find sumo more comfortable and stronger. Both are legitimate. Try each for a few weeks with moderate loads and estimate your max in each to compare."),
]

EXTRA["overhead-press-calculator"] = [
    _s("Muscles the overhead press works",
       "The overhead press works the shoulders, especially the front and side deltoids, and the triceps to lock the bar out. The upper chest assists early in the lift, while the upper back, core and glutes work hard to keep the body stable under the bar. Because the whole body must stay tight, the press is as much a test of stability as of shoulder strength."),
    _s("Overhead press variations",
       ("ul", [
           "**Seated press:** removes the legs and reduces lower-back involvement.",
           "**Dumbbell press:** allows each arm to move freely and balances strength between sides.",
           "**Push press:** uses a dip and drive from the legs to move heavier loads overhead.",
           "**Z press:** pressing while seated on the floor, demanding strong core control.",
           "**Landmine press:** a diagonal pressing path that suits many sore shoulders.",
       ]),
       "Estimate each variation separately; they are different lifts with different maxes."),
    _s("A worked example",
       "A lifter presses 50 kg for 6 reps with good form. Epley gives 50 × (1 + 6 ÷ 30) = 60 kg. Because the press progresses slowly, a training max of 90 percent, about 54 kg, keeps sessions manageable. Sets of five at 80 percent of the training max would be about 43 kg, and heavy triples at 90 percent about 48.5 kg. Adding 1 kg to the top set every week or two is realistic progress."),
    _s("Overhead mobility",
       "Pressing overhead comfortably requires enough shoulder and upper-back mobility to get the arms straight above the head without arching the lower back. If you find yourself leaning back a lot, mobility may be limiting you. Working on thoracic extension, lat flexibility and shoulder flexion, and temporarily using landmine or slight-incline presses, can help. Forcing a strict overhead position before you have the mobility for it often leads to lower-back strain."),
    _s("Press relative to bench",
       "Most lifters press roughly 60 to 70 percent of their bench press. If your press is much lower than that, it may be a weak point worth extra attention, such as pressing more often, adding overhead accessory work or improving mobility. If your press is unusually high relative to your bench, your bench may have room to improve. Comparing the two estimates is a quick way to spot imbalances."),
    _s("Pressing for shoulder health",
       "Done with good technique and balanced with plenty of pulling work, the overhead press can support shoulder health by strengthening the muscles that control the shoulder through a full range. Common problems arise from pressing with poor posture, excessive volume or ignoring pain. If pressing overhead hurts, a landmine press or a neutral-grip dumbbell press is often a comfortable alternative while you build strength and mobility."),
]

EXTRA["one-rep-max-calculator"] += [
    _s("Bracing and breathing for heavy sets",
       "How you breathe on a heavy set affects how much you can lift and how safely. Most lifters use a braced breath: a deep breath into the belly before each rep, held while tightening the trunk as if preparing to be pushed, and released at or near the top. This increases pressure inside the abdomen, which stiffens the trunk and supports the spine under load. A belt gives the abdominal muscles something to brace against and can help on the heaviest sets. People with high blood pressure or other cardiovascular conditions should take medical advice before using maximal breath-holding efforts."),
    _s("Plateaus and how to break them",
       "Almost every lifter eventually reaches a point where the estimated max stops rising. Common causes include doing the same sets and reps for too long, too little or too much training volume, poor sleep, eating too little, and stress outside the gym. Useful responses include changing the rep range for a few weeks, adding a variation that targets a weak point, taking a lighter week to recover, and checking that food and sleep support training. A plateau that lasts a month or two is normal; one that lasts six months usually means something in the programme or recovery needs to change.",
       "Small changes compound. Adding one rep to a set, or 1 to 2.5 kg to the bar, every week or two may feel slow, but it adds up to large improvements over a year."),
    _s("How strength is built",
       "Early strength gains come largely from the nervous system learning to coordinate the lift: recruiting more muscle fibres, firing them more efficiently and refining technique. This is why beginners often get stronger quickly without visibly larger muscles. Over months and years, muscle growth contributes more, because a bigger muscle can produce more force. Both processes respond to lifting reasonably heavy weights with good technique, regularly, with enough recovery between sessions. Estimated maxes capture the combined result, which is why tracking them over time is so useful."),
    _s("Choosing between estimating and testing",
       "Estimating works best for regular programming and tracking progress between training blocks, for lifters who want to manage fatigue, and for anyone where a heavy single carries more risk than reward, such as beginners, older lifters and people returning from injury. Testing works best for competitive lifters preparing for a meet, for checking whether estimates are accurate for you, and occasionally as a motivating milestone. Many experienced lifters estimate most of the year and test only at the end of a long training cycle."),
]

EXTRA["bench-press-calculator"] += [
    _s("Bench press competition rules",
       "In powerlifting competitions, the bench press must be lowered to the chest, held motionless until the referee calls press, pressed to full lockout, and held until the rack command. The head, shoulders and buttocks must stay in contact with the bench and the feet flat on the floor throughout, with slight variations between federations. Training with a pause prepares you for these rules. If you plan to compete, practise paused reps regularly and estimate your competition max from paused sets."),
    _s("A sample weekly bench plan",
       ("table", ["Day", "Main work", "Purpose"], [
           ["Day 1", "Bench 4 × 5 at about 80%", "Strength"],
           ["Day 2", "Close-grip or incline bench 3 × 8 at about 70%", "Volume and triceps"],
           ["Day 3", "Paused bench 5 × 3 at about 75 to 80%", "Strength from the chest"],
       ]),
       "Add two or three accessory exercises each day, such as rows, dips, dumbbell presses or triceps extensions. Increase weights gradually when all sets feel solid. A lighter week every four to six weeks helps recovery."),
    _s("Leg drive and setup",
       "Although it is an upper-body lift, the legs play a role in the bench press. Pressing the feet into the floor and driving the body back toward the head, without lifting the hips, creates tension from the feet through to the upper back and makes the lift feel more stable. Learning to use leg drive often adds a few kilograms to a lifter's max without any change in upper-body strength."),
    _s("Tracking bench progress",
       "Bench press progress is often slow and steady. Logging your top set each session and estimating your max every week or two shows trends that are hard to see day to day. If the estimate has not moved for four to six weeks, look at total weekly sets, whether accessory work supports the bench, sleep and food. Small changes, like adding a third weekly bench session or a set of close-grip work, often restart progress."),
]

EXTRA["squat-calculator"] += [
    _s("Squat competition rules",
       "In powerlifting, the lifter must squat until the top of the hip at the crease is below the top of the knee, then return to a standing position with knees locked, waiting for referee commands to start and to rack. Squatting consistently to that depth in training, and estimating your max from sets at that depth, gives a number that will hold up in competition."),
    _s("A sample weekly squat plan",
       ("table", ["Day", "Main work", "Purpose"], [
           ["Day 1", "Back squat 4 × 5 at about 80%", "Strength"],
           ["Day 2", "Front squat or paused squat 3 × 6 at about 65 to 70%", "Position and volume"],
           ["Day 3", "Back squat 5 × 3 at about 85% (optional)", "Heavy practice"],
       ]),
       "Many lifters run two of these days rather than three, especially if they also deadlift heavily. Add lunges, leg press, hamstring curls and core work as accessories."),
    _s("Breathing and bracing in the squat",
       "Before each rep, take a big breath into the belly, brace the trunk, and hold it through the descent and most of the way up. Releasing the breath at the bottom often causes the chest to collapse and the bar to drift forward. A belt can help on heavy sets by giving the abdominal muscles something to push against. Practising the same breathing on every warm-up set makes it automatic on heavy ones."),
    _s("Footwear for squatting",
       "Weightlifting shoes with a raised, firm heel help many lifters stay upright and reach depth, especially in high-bar and front squats. Flat, firm shoes or bare feet suit many low-bar squatters. Soft running shoes are the least stable option, because the cushioning compresses unevenly under load. Whatever you choose, keep it consistent so estimates compare like with like."),
]

EXTRA["deadlift-calculator"] += [
    _s("Deadlift competition rules",
       "In competition, the deadlift must be lifted in one continuous movement until the lifter stands upright with knees locked and shoulders back, then lowered under control on the referee's command. Any downward movement of the bar before completion, or supporting the bar on the thighs, is a fail. Estimating your max from controlled, dead-stop reps that would meet these standards gives the most realistic competition number."),
    _s("A sample weekly deadlift plan",
       ("table", ["Day", "Main work", "Purpose"], [
           ["Day 1", "Deadlift 3 × 3 at about 82 to 87%", "Heavy strength"],
           ["Day 2", "Romanian deadlift 3 × 8 at a moderate weight", "Hamstrings and glutes"],
       ]),
       "Accessory work such as back extensions, rows, hip thrusts and grip training supports the main lift. Keep at least two days between the heavy deadlift session and a heavy squat session where possible."),
    _s("Starting position by build",
       "There is no single correct hip height. Lifters with long legs and short arms often start with their hips higher; lifters with short legs and long arms can start lower. The goal is to begin with the bar over the middle of the foot, shoulders slightly in front of the bar, and back flat. Filming a set from the side and comparing with your best reps helps you find a consistent starting position, which makes estimates more reliable."),
    _s("Building the lockout and the floor",
       "Most deadlift failures happen either off the floor or near the knees. If you struggle to break the bar from the floor, deficit deadlifts, paused deadlifts and more quad work help. If you get stuck near the knees or lockout, block pulls, Romanian deadlifts, hip thrusts and upper-back work help. Identifying where your heavy reps slow down tells you which variation to add."),
    _s("Nutrition and the deadlift",
       "Heavy deadlift sessions demand a lot of energy and recovery. Eating enough total calories, and enough protein, at around 1.6 to 2.2 g per kg of body weight, supports strength gains and recovery. Lifters who try to deadlift heavy while in a large calorie deficit often find their numbers stall or drop. During a diet, maintaining strength on the deadlift is a good sign that muscle is being preserved."),
]

EXTRA["overhead-press-calculator"] += [
    _s("A sample weekly press plan",
       ("table", ["Day", "Main work", "Purpose"], [
           ["Day 1", "Overhead press 4 × 5 at about 80%", "Strength"],
           ["Day 2", "Dumbbell or seated press 3 × 10 at a moderate weight", "Volume and shoulders"],
       ]),
       "Pair pressing with plenty of pulling work, such as pull-ups, rows and face pulls, and add triceps and lateral-raise work for balanced shoulder development."),
    _s("Breathing and body position",
       "Take a breath and brace before each rep, squeeze the glutes and keep the ribs down. This creates a solid base and prevents excessive leaning back. As the bar passes the forehead, move the head forward slightly so the bar finishes directly over the middle of the foot, with the arms locked and the shoulders shrugged up a little at the top. Practising this sequence on light sets makes heavy reps much smoother."),
    _s("Progressing slowly but surely",
       "Because the press uses smaller muscles, standard 2.5 kg or 5 lb jumps can be too large, especially for smaller lifters and women. Microplates of 0.5 to 1.25 kg allow steady progress, and adding a rep before adding weight is another effective approach. A press that improves by just a kilogram a month adds up to a big difference over a year."),
]

EXTRA["one-rep-max-calculator"] += [
    _s("Beginner, intermediate and advanced progression",
       "How quickly your one-rep max can rise depends heavily on training age. Beginners, in roughly their first six to twelve months of consistent lifting, can often add weight to the bar every session or every week, a pattern known as linear progression. Intermediate lifters usually need weekly or monthly cycles, with heavier and lighter days, to keep progressing. Advanced lifters may need several months of structured training to add a small amount to their max. Knowing which stage you are in helps you set realistic expectations and choose a suitable programme.",
       "A practical sign that you have moved from beginner to intermediate is that adding weight every session no longer works, even with good sleep and food. At that point, programmes that vary intensity across the week or month usually work better."),
    _s("Strength and body weight",
       "Absolute strength usually rises with body weight, because more muscle can produce more force. That is why heavier lifters tend to lift more in absolute terms, and why relative measures such as Wilks and DOTS scores exist to compare lifters of different sizes. If you are losing weight, holding your estimated max steady is a strong result. If you are gaining weight, an estimated max that rises faster than your body weight shows that much of the gain is useful muscle."),
    _s("How to read your percentage table",
       "Each row in the table shows a percentage of your estimated max, the weight that represents for loading, and roughly how many reps most people can do at that weight. Use it in two directions. To pick a weight for a target rep range, find the row whose rep estimate matches and load that weight. To check effort, compare the reps you actually managed at a given weight with the estimate: doing many more reps than predicted means your max is probably higher than the estimate, and doing fewer means it is probably lower."),
]

EXTRA["bench-press-calculator"] += [
    _s("Bench press and body weight changes",
       "Bench press strength is closely linked to body weight. Many lifters see their bench rise during a muscle-gaining phase and dip slightly during a diet, even when training stays the same. Losing weight while holding your bench steady is a sign you are keeping muscle. If your bench drops sharply during a diet, the deficit may be too large, protein too low or recovery too poor. Tracking your estimated max alongside body weight gives you a clearer picture of what is happening."),
    _s("Dumbbell and machine pressing",
       "Dumbbell bench press and machine chest press are useful partners for the barbell bench. Dumbbells allow a greater range of motion and let each arm work independently, which can reveal and correct imbalances. Machines provide a stable path that lets you push hard with less need for balance, making them useful for higher-rep work and for training around minor shoulder discomfort. Neither converts directly to a barbell max, so estimate them separately if you track them."),
]

EXTRA["squat-calculator"] += [
    _s("Squat and the rest of your training",
       "The squat affects, and is affected by, everything else in a programme. Heavy deadlifts, lunges, running and sports all draw on the same leg muscles and recovery. If your squat stalls while you are doing a lot of other leg work or conditioning, reducing some of that work, or scheduling it further from your heavy squat days, often helps. Equally, adding a second squat day with lighter weights can improve technique and strength without much extra fatigue."),
    _s("Squatting at home",
       "If you train at home without a rack, goblet squats, dumbbell squats, split squats and Bulgarian split squats can build considerable leg strength. They cannot be converted directly into a barbell squat max, but you can estimate a max for each variation and track progress the same way. Many lifters returning to the barbell after training at home find their squat recovers quickly once technique is refreshed."),
]

EXTRA["deadlift-calculator"] += [
    _s("Deadlift for beginners",
       "New lifters often learn the deadlift with a trap bar or from blocks, which reduces the range of motion and makes it easier to keep a flat back. Practising the hip hinge with a dowel or light Romanian deadlifts builds the pattern before heavier pulls. Many beginners can add weight to the deadlift quickly at first, so estimate your max from regular sets rather than testing heavy singles early on, and prioritise consistent technique over fast progress."),
    _s("Deadlift for women",
       "Many women find the deadlift is their strongest lift relative to body weight, because it relies heavily on the hips and legs, where women tend to carry a larger share of their muscle. Strength standards for women reflect this. Using the same principles as any lifter, consistent technique, gradual progression and adequate recovery, women can make excellent long-term progress on the deadlift."),
    _s("How often to update your estimate",
       "Because heavy deadlifts are usually done once a week, updating your estimate from each week's top set gives a steady record of progress. If the estimate rises for several weeks in a row, your programme is working. If it falls, check recovery, sleep, food and stress before changing the programme. A single bad session is not a trend; look at three or four weeks together."),
    _s("Deadlifts and other back exercises",
       "Rows, pull-ups, back extensions and good mornings all strengthen muscles that support the deadlift, and many lifters find that building the upper back in particular helps keep the bar close and the back flat on heavy pulls. Balance heavy pulling with enough recovery: if your lower back feels fatigued for several days after deadlifting, reduce the volume of other back-loading exercises that week."),
]

EXTRA["overhead-press-calculator"] += [
    _s("Overhead pressing for athletes",
       "Strong overhead pressing supports performance in sports that involve throwing, pushing or reaching overhead, such as volleyball, swimming, combat sports and many field sports. Athletes often favour push presses and dumbbell variations that build power and stability, alongside strict pressing for strength. Estimating separate maxes for strict and push presses helps athletes track both strength and power."),
    _s("Overhead press for women",
       "The overhead press often progresses most slowly for women, because the shoulders and arms typically carry less muscle relative to body weight. Small increments, frequent pressing and plenty of shoulder and triceps accessory work help maintain progress. Dumbbell pressing can also be a useful way to build strength when barbell increments feel too large."),
]

EXTRA["one-rep-max-calculator"] += [
    _s("Rest between sets and your estimate",
       "How long you rest before a set affects how many reps you can do, and therefore your estimate. Short rest periods leave you partly fatigued, so you manage fewer reps and the estimate comes out lower than your true capability. For the most accurate estimate, rest three to five minutes before the set you use, especially for heavy compound lifts. For general training, shorter rest is fine, but be aware that estimates from those sets may run a little low.",
       "The same applies to where the set falls in a session. A top set done first, when you are fresh, gives a better estimate than a set done after several hard exercises. If you want to track progress accurately, estimate from a set done at a similar point in the session each time."),
    _s("Machines and free weights",
       "One-rep max formulas were developed and tested mainly on free-weight lifts, but they work reasonably well on machines too, such as leg press, chest press and cable rows. Machine maxes do not convert to free-weight maxes, because the movement and stability demands differ, but tracking an estimated max on a machine is a perfectly good way to measure progress on that machine. This can be particularly useful for beginners and for people training around injuries."),
]

EXTRA["bench-press-calculator"] += [
    _s("Bench press for beginners",
       "New lifters often make rapid progress on the bench in the first few months, adding weight most weeks as they learn to set up, stay tight and control the bar. During this stage, focus on consistent technique and modest increases, and use sets of five to eight reps to estimate your max rather than testing singles. Push-ups and dumbbell presses are useful supporting exercises that build the same muscles with less demand on technique.",
       "If you train alone, a power rack with safety arms set just below chest height lets you train close to failure without needing a spotter, and makes estimating from hard sets much safer."),
    _s("How grip and arch change your numbers",
       "Small changes in setup can change your bench numbers by several percent. A wider grip and a higher arch both shorten the distance the bar travels, making the lift easier. That is fine, and many competitive lifters use both, but it means estimates from different setups are not comparable. If you change your setup, start a fresh line of estimates from that point."),
]

EXTRA["squat-calculator"] += [
    _s("Squat for older lifters",
       "Squatting remains valuable later in life for leg strength, balance and the ability to get up from a chair or the floor easily. Older lifters often do well with goblet squats, box squats and moderate-rep sets, which build strength with less joint stress and lower risk than heavy singles. Estimating a max from sets of six to ten reps is a safe way to track progress, and even small improvements in squat strength can make everyday movements noticeably easier."),
    _s("Squat and sport",
       "For athletes, a stronger squat supports sprinting, jumping and changes of direction, though the relationship is not one-to-one: technique and power in the sport matter too. Many strength coaches aim for athletes to squat around 1.5 to 2 times body weight, then shift focus to power and speed work once that level is reached. Tracking the estimated max helps show when an athlete has built enough strength to prioritise other qualities."),
    _s("Common causes of a stalled squat",
       ("ul", [
           "**Too little practice:** squatting only once a week may not give enough exposure for technique and strength.",
           "**Too much fatigue:** heavy squats plus heavy deadlifts plus running can exceed recovery.",
           "**Weak positions:** if you always miss in the same place, a variation such as paused or front squats can target it.",
           "**Under-eating:** strength gains slow in a large calorie deficit.",
       ])),
]

EXTRA["deadlift-calculator"] += [
    _s("Warming up for heavy deadlifts",
       "A good deadlift warm-up starts with general movement such as walking, cycling or light hip hinges, then several progressively heavier sets of the deadlift itself. A typical progression might be the empty bar or a light weight for five reps, then sets at roughly 40, 60, 75 and 85 percent of your working weight, with fewer reps as the weight rises. The warm-up set calculator builds this ramp automatically from your working weight.",
       "Warm-up sets are also a good time to rehearse your setup, breathing and bar path, so that heavy sets feel familiar."),
    _s("Deadlifts and conditioning",
       "Very high-rep deadlifts, such as those used in some conditioning workouts, are a different challenge from heavy strength work. Fatigue changes technique, and the risk of the back rounding rises as reps accumulate. If you use deadlifts for conditioning, keep the weight moderate, use a trap bar or kettlebells where possible, and stop sets before form breaks down. Estimates from high-rep conditioning sets will not reflect your true one-rep max."),
    _s("Long-term deadlift goals",
       "Setting long-term goals around body-weight multiples can be motivating: for example, pulling 1.5 times body weight, then twice body weight. Breaking these into smaller steps, such as adding 5 to 10 kg to your estimated max each training block, makes them more achievable. Reviewing progress every few months and celebrating each milestone keeps training enjoyable over the years it takes to build a strong deadlift."),
]

EXTRA["overhead-press-calculator"] += [
    _s("Estimating from dumbbell presses",
       "If you mainly press with dumbbells, you can use the calculator with the weight of one dumbbell to estimate a single-dumbbell max for that movement. It does not convert directly to a barbell press, because each arm works alone and must stabilise its own weight, but it is a good way to track progress. Many lifters find that their combined dumbbell weight for a set of eight is a little below their barbell weight for the same reps."),
    _s("Common causes of a stalled press",
       ("ul", [
           "**Pressing only once a week,** which often is not enough frequency for this lift.",
           "**Weak triceps,** limiting lockout.",
           "**Limited shoulder mobility,** forcing a leaned-back position.",
           "**Jumps that are too big** for the lift's slow rate of progress.",
       ]),
       "Addressing one of these at a time, for four to six weeks, usually gets the press moving again."),
    _s("Pressing safely at home",
       "Without a rack, getting a barbell into position for the press means cleaning it from the floor, which adds technique demands. Dumbbell and kettlebell presses are safer options at home, and landmine presses can be set up with a barbell wedged into a corner. Track estimated maxes for whichever variation you use."),
]

EXTRA["one-rep-max-calculator"] += [
    _s("Logging sets for better estimates",
       "Write down the weight, reps and how hard the set felt for every top set, using a simple scale such as reps left in reserve. Over a few weeks, this record lets you choose the most reliable sets to estimate from and spot trends early. It also shows whether a high estimate came from one unusually good day or a consistent pattern."),
]

EXTRA["bench-press-calculator"] += [
    _s("Long-term bench goals",
       "Popular long-term goals include benching body weight for a single, then for a set of five, and eventually pressing 1.25 or 1.5 times body weight. These milestones take many lifters several years. Breaking them into smaller steps, such as adding 2.5 kg to your estimated max each training block, keeps progress visible and motivating. Celebrate each step; a steadily rising bench is the result of hundreds of well-executed sets."),
]

EXTRA["squat-calculator"] += [
    _s("Long-term squat goals",
       "Common long-term squat goals include a body-weight squat for reps, then 1.5 times body weight, then double body weight for men or around 1.5 times for women. Breaking each into smaller targets, such as adding 5 kg to your estimated max each training block, makes them achievable. Tracking the estimate every few weeks keeps you honest about progress and helps you adjust the programme before a plateau sets in."),
]

EXTRA["deadlift-calculator"] += [
    _s("Choosing the right formula for deadlifts",
       "Because deadlift sets of more than five or six reps are often limited by grip, breathing and lower-back fatigue rather than the muscles that lift the bar, many coaches prefer the more conservative Brzycki estimate for the deadlift, or estimates from sets of one to five reps only. If your Epley estimate seems too high when you test it, switch to Brzycki or use lower-rep sets. Consistency matters more than which formula you choose; stick with one so trends over time are meaningful.",
       "If you find your tested deadlift max regularly beats both estimates, you may simply be stronger at low reps than average, which is common among lifters who train heavy singles and doubles frequently."),
]

EXTRA["overhead-press-calculator"] += [
    _s("Long-term pressing goals",
       "A body-weight overhead press is a rare and impressive achievement, and most lifters set more modest milestones along the way, such as pressing half or three quarters of body weight for a single, or pressing their body weight split across two dumbbells. Small, consistent increases are the path to all of them. Reviewing your estimated max every few weeks keeps progress visible even when each session feels the same."),
]

EXTRA["one-rep-max-calculator"] += [
    _s("Rounding and plate maths",
       "The table rounds each working weight to the nearest 5 lb or 2.5 kg, the smallest jump most gyms can load with standard plates. If your gym has smaller plates, you can load closer to the exact percentages, which helps on lifts like the overhead press where small jumps matter."),
]
EXTRA["bench-press-calculator"] += [
    _s("Bench press and recovery",
       "The chest, shoulders and triceps recover fairly quickly, which is why the bench responds well to two or three sessions a week. Even so, stacking heavy bench work with lots of other pressing, dips and shoulder work can overload the shoulders and elbows. If joints feel sore rather than the muscles, reduce total pressing volume for a week and build back gradually. Sleep, food and stress management matter as much for the bench as for any other lift; a well-recovered lifter will almost always beat a tired one."),
]
EXTRA["squat-calculator"] += [
    _s("Squat equipment checklist",
       "For heavy squatting, a solid rack with safety pins set just below your bottom position is the most important piece of equipment. A belt helps many lifters brace on heavy sets. Knee sleeves keep the joints warm and can add a little support. Stable footwear with a firm sole, and chalk on the upper back to stop the bar sliding, round out the list. None of these replace good technique, but they make heavy training safer and more consistent."),
]
EXTRA["deadlift-calculator"] += [
    _s("Deadlift equipment checklist",
       "For deadlifts, flat, firm shoes or bare feet keep you close to the floor and stable. Chalk improves grip, and straps help on high-rep or back-off sets. A belt helps many lifters brace on heavy pulls. Long socks or leggings protect the shins from the bar. Bumper plates or a platform protect the floor if you train at home. Record what you used for each estimate so you compare like with like over time."),
]
EXTRA["overhead-press-calculator"] += [
    _s("Overhead press and recovery",
       "The shoulders are involved in almost every upper-body exercise, from bench press to rows, so they can accumulate fatigue quickly. If pressing feels heavy and joints feel achy, reduce total upper-body volume for a week before changing the programme. Warming up the shoulders with light band work and a few progressively heavier press sets before each session helps keep them healthy over the long term."),
]

EXTRA["squat-calculator"] += [
    _s("Filming your squat",
       "A phone propped at hip height, side-on, is the easiest way to check depth and bar path. Comparing videos of the same weight over weeks shows whether technique is holding up as loads rise."),
]
EXTRA["deadlift-calculator"] += [
    _s("Filming your deadlift",
       "Recording heavy sets from the side shows whether the bar stays over the middle of the foot, whether the back stays flat and whether the hips and shoulders rise together. Reviewing a few reps each week catches small technique changes before they become habits, and makes it easier to tell whether a heavier estimate reflects real strength or looser form."),
]
EXTRA["overhead-press-calculator"] += [
    _s("Filming your press",
       "A side-on video shows whether the bar travels in a straight line and how much you lean back. Small changes in body position can make a big difference to pressing strength."),
]
EXTRA["deadlift-calculator"][-1] = _s("Filming your deadlift",
    "Recording heavy sets from the side shows whether the bar stays over the middle of the foot, whether the back stays flat and whether the hips and shoulders rise together. Reviewing a few reps each week catches small technique changes before they become habits, and makes it easier to tell whether a heavier estimate reflects real strength or looser form. Keep the camera in the same spot each time so videos are easy to compare.")
