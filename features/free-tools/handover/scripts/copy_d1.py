import sys

sys.path.insert(0, sys.argv[1] + "/scripts")
import copygen  # noqa: E402

OUT = sys.argv[2]
WK = "In Traiv you build workout plans for each client, set weights from their numbers, and see every set and rep they log, so progress on each lift is visible week by week."
DISC = "This calculator gives general training information, not medical advice. Test heavy singles only with good technique, a spotter or safety arms, and stop if you feel pain. If you have an injury or medical condition, check with a doctor or physiotherapist before lifting heavy."
CW = {"one-rep-max-calculator": 3551, "bench-press-calculator": 2799, "squat-calculator": 2682, "deadlift-calculator": 3232, "overhead-press-calculator": 2367}
TARGET = {k: v - 150 for k, v in CW.items()}
DATA = {}


def formula_section(lift_word, example_w, example_unit):
    e = example_w * (1 + 5 / 30)
    b = example_w * 36 / 32
    return ("How the estimate is worked out", [
        f"The calculator uses one of two well-tested formulas to turn a set of several reps into an estimated single. Epley multiplies the weight by one plus the reps divided by 30. Brzycki multiplies the weight by 36 and divides by 37 minus the reps. For a {lift_word} of {example_w} {example_unit} for 5 reps, Epley gives about {e:.0f} {example_unit} and Brzycki about {b:.0f} {example_unit}.",
        "The two formulas agree closely for sets of three to six reps and drift apart as reps climb. Epley tends to give slightly higher estimates from higher-rep sets, Brzycki slightly lower ones. Neither is right for everyone: lifters with more slow-twitch muscle or excellent endurance often do more reps at a given percentage than the formulas expect, so their estimates run high.",
        "The table under the result turns the estimate into training weights at each percentage, rounded to the nearest 5 lb or 2.5 kg so they can be loaded with standard plates, and shows roughly how many reps you should manage at each.",
    ])


DATA["one-rep-max-calculator"] = dict(
    title="One-rep max calculator: estimate your 1RM (Epley, Brzycki)",
    description="Free one-rep max calculator. Enter a weight and reps to estimate your 1RM with Epley or Brzycki, plus a percentage table of working weights and expected reps.",
    eyebrow="Free tool · Strength",
    h1="One-rep max calculator",
    intro="Your one-rep max is the heaviest weight you can lift once with good form. You do not need to test it to know it. Enter the weight and reps from a recent hard set, choose a formula, and this calculator estimates your 1RM and builds a table of working weights for every common training percentage.",
    method="Epley (1985) and Brzycki (1993) one-rep max equations",
    sources=[
        ("Epley B. Poundage chart. Boyd Epley Workout. Lincoln, NE: Body Enterprises, 1985.", ""),
        ("Brzycki M. Strength testing: predicting a one-rep max from reps-to-fatigue. J Phys Educ Recreat Dance, 1993.", "https://doi.org/10.1080/07303084.1993.10606684"),
        ("LeSuer DA, et al. The accuracy of prediction equations for estimating 1-RM performance in the bench press, squat, and deadlift. J Strength Cond Res, 1997.", "https://journals.lww.com/nsca-jscr/abstract/1997/11000/the_accuracy_of_prediction_equations_for.5.aspx"),
    ],
    short_q="How do you calculate your one-rep max?",
    short_a=[
        "Take a set you performed close to failure and apply a formula. Epley: weight × (1 + reps ÷ 30). For 225 lb for 5 reps, that gives an estimated one-rep max of about 263 lb. Brzycki gives a slightly lower 253 lb for the same set.",
        "Estimates are most reliable from sets of 10 reps or fewer, taken within a rep or two of failure. Beyond that, individual differences in muscular endurance make the result less accurate.",
    ],
    sections=[
        formula_section("lift", 225, "lb"),
        ("Why estimate instead of testing?", [
            "Testing a true one-rep max is demanding. It takes a long warm-up, carries a higher risk of form breaking down, and leaves you fatigued for days. For most lifters, testing every few weeks interferes with training more than it helps. An estimate from a normal working set gives a number accurate enough to program from, without the cost.",
            "Estimates also update naturally. If you squat 225 for 6 reps this week instead of 5, your estimated max has risen, and the next block's percentages can rise with it. Many coaches use rolling estimates from top sets for exactly this reason.",
        ]),
        ("How accurate are 1RM formulas?", [
            "Studies comparing prediction equations with tested maxes generally find them accurate to within a few percent for sets of three to eight reps in trained lifters. Accuracy falls for sets above ten reps, for untrained people whose technique varies from rep to rep, and for lifts that involve a lot of skill or a large range of motion.",
            "Accuracy also depends on how hard the set really was. If you stopped with three reps left, the formula has no way of knowing and will underestimate. For the best estimate, use a set that genuinely ended within one or two reps of failure, performed with consistent technique.",
        ]),
        ("Using percentages to plan training", [
            "Once you have an estimate, percentages let you set loads for any rep range. Common bands:",
            ("table", ["% of 1RM", "Typical reps", "Used for"], [
                ["90–100%", "1–3", "Peak strength, heavy singles and doubles"],
                ["80–90%", "3–6", "Strength development"],
                ["70–80%", "6–10", "Strength and muscle growth"],
                ["60–70%", "10–15", "Muscle growth, technique practice"],
                ["Below 60%", "15+", "Warm-ups, endurance, rehabilitation"],
            ]),
            "Percentages are a starting point. On days when sleep, stress or recovery are poor, the same percentage can feel much harder. Many lifters combine percentages with an effort scale such as RPE, adjusting the load so the set feels as hard as intended.",
        ]),
        ("How to test a true one-rep max safely", [
            "If you do want to test, prepare properly:",
            ("ol", [
                "Warm up thoroughly with general movement, then several light sets of the lift.",
                "Work up in singles: roughly 50, 70, 80, 90 and 95 percent of your estimate, resting more as weights get heavier.",
                "Attempt your estimated max with good technique. If it moves well, add a small amount and try once more.",
                "Stop when form breaks down or speed slows dramatically. A grinding, ugly rep is not a useful max.",
                "Use spotters, safety bars or a rack for squats and bench presses.",
            ]),
            "Rest three to five minutes between heavy singles. Most lifters reach their max within three or four attempts after warming up; more attempts usually mean diminishing returns from fatigue.",
        ]),
        ("Training max: programming from a little less", [
            "Many popular programmes set percentages from a training max rather than a true max, typically 85 to 90 percent of the estimated one-rep max. This leaves a margin for bad days, keeps sets crisp rather than grinding, and allows steady progress over many weeks. If a programme asks for a training max, enter your set here, then multiply the result by 0.9.",
        ]),
        ("Common mistakes", [
            ("ul", [
                "**Using a set that was not hard.** A comfortable set of five underestimates your max.",
                "**Using very high-rep sets.** Sets above about ten reps give unreliable estimates.",
                "**Mixing technique standards.** A paused bench and a touch-and-go bench produce different maxes; use the same standard you train with.",
                "**Testing too often.** Estimating from training sets is usually enough; test maxes occasionally, not weekly.",
                "**Chasing the number.** A higher estimate from looser form does not reflect real strength gain.",
            ]),
        ]),
        ("Tracking progress over time", [
            "Logging your top sets and their estimated maxes gives a simple, motivating picture of progress. Plot the estimate for each main lift every few weeks. Early in training, it may rise by several percent a month; after a few years, small increases over a whole training cycle are normal. Flat or falling estimates over several weeks can signal that recovery, sleep, nutrition or programme design need attention.",
        ]),
    ],
    prompt=dict(
        heading="Turn your estimate into a four-week training block",
        when="When you have a fresh one-rep max estimate and want a structured block of training built from it.",
        paste="Your estimated 1RM, the lift, your training days, and whether your goal is strength or muscle growth.",
        text="""I estimated my one-rep max from a recent set:
Lift: [lift]
Estimated 1RM: [weight]
Training days per week for this lift: [number]
Goal: [strength / muscle growth]

1. Write a four-week block for this lift with sets, reps and percentages each week.
2. Base percentages on a training max of 90% of my estimate.
3. Include one lighter week or a deload at the end.
4. Tell me how to adjust if a set feels much harder or easier than planned.""",
    ),
    coaches_h="Using one-rep max estimates with clients",
    coaches=[
        "Estimated maxes let you program heavy work without testing. Ask clients to report the weight and reps of their top set each week, and update their working percentages from the estimate.",
        "Keep technique standards consistent. Agree on depth for squats, a pause or touch on bench, and lockout for deadlifts, so estimates reflect real strength changes rather than looser reps.",
        "Use estimates to show progress. Clients who see their estimated max rise steadily stay motivated, even on weeks when the scale or mirror does not change.",
    ],
    pitch_key="workouts",
    pitch_h="Program from every client's numbers",
    pitch=WK,
    next=[("Turn reps and effort into a working weight", "/tools/rpe-calculator"), ("See how your lift compares", "/tools/strength-standards-calculator")],
    next_pitch="Programming for clients? Traiv keeps every client's lifts and plans together.",
    faq=[
        ("What is a one-rep max?", "The heaviest weight you can lift for a single repetition with good technique."),
        ("Which formula is more accurate, Epley or Brzycki?", "They are very similar for sets of 3 to 6 reps. Epley tends to give higher estimates from higher-rep sets; Brzycki is a little more conservative."),
        ("How many reps should I use to estimate my max?", "Sets of 3 to 8 reps taken close to failure give the most reliable estimates. Above 10 reps, accuracy falls."),
        ("Is it safe to test a one-rep max?", "It can be with a proper warm-up, good technique and spotters or safety bars. Many lifters prefer to estimate instead."),
        ("How often should I test my max?", "Every 8 to 12 weeks at most for most lifters. Estimating from training sets works well in between."),
        ("What is a training max?", "A slightly lower number, usually 85 to 90 percent of your estimated max, used to set percentages so training stays manageable."),
        ("Why is my estimate higher than what I can actually lift?", "Formulas assume average muscular endurance. If you are better at reps than singles, your estimate will run high."),
        ("Can beginners use a one-rep max calculator?", "Yes, but estimates are less reliable while technique is still developing. Use them as a rough guide."),
        ("Do I need different formulas for different lifts?", "The same formulas are commonly used for all major lifts, though accuracy can vary slightly between them."),
        ("What percentage of my max should I train at?", "Roughly 70 to 85 percent for most strength and muscle-building work, with heavier and lighter days as programmes require."),
        ("Should I use kilograms or pounds?", "Either. The calculation is the same; working weights are rounded to 2.5 kg or 5 lb steps."),
        ("How quickly does a one-rep max improve?", "Beginners can gain several percent a month; experienced lifters may gain a few percent over a whole training cycle."),
        ("Does an estimated max count for competition?", "No. Competitions require lifts performed to federation standards under judges."),
    ],
    disclaimer=DISC,
    keep=[("RPE calculator", "/tools/rpe-calculator"), ("Warm-up set calculator", "/tools/warm-up-set-calculator"), ("Strength standards calculator", "/tools/strength-standards-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Every client's lifts, programmed and tracked",
)


def lift_page(slug, lift, h1, title, desc, weight, intro, technique, standards_note, programming, mistakes, faq, src=None, prompt=None, extra=None):
    d = dict(
        title=title,
        description=desc,
        eyebrow="Free tool · Strength",
        h1=h1,
        intro=intro,
        short_q=f"How do you estimate your {lift} max?",
        short_a=[
            f"Take a recent hard set of {lift} and apply a one-rep max formula. With Epley, {weight} lb for 5 reps gives an estimated max of about {weight * (1 + 5 / 30):.0f} lb; Brzycki gives about {weight * 36 / 32:.0f} lb.",
            f"Use a set of 3 to 8 reps taken within one or two reps of failure, performed with the same technique you use in training. The result gives you a reliable number to set {lift} percentages from without testing a heavy single.",
        ],
        sections=[formula_section(lift, weight, "lb"), *technique, *standards_note, *programming, *mistakes, *(extra or [])],
        coaches_h=f"Using {lift} estimates with clients",
        coaches=[
            f"Ask clients to log their top {lift} set each session or week. The estimated max gives you a running measure of strength without regular testing.",
            "Agree technique standards before you start tracking, so improvements reflect strength rather than changes in range of motion.",
            f"Use the percentage table to set loads, then adjust by feel. If a client's {lift} feels heavy on a given day, reduce the load rather than forcing the planned number.",
        ],
        pitch_key="workouts",
        pitch_h=f"Program {lift} for every client",
        pitch=WK,
        next=[("See where this lift ranks", "/tools/strength-standards-calculator"), ("Build a warm-up for your working weight", "/tools/warm-up-set-calculator")],
        next_pitch="Coaching lifters? Traiv keeps every client's plans and logged sets together.",
        faq=faq,
        disclaimer=DISC,
        keep=[("One-rep max calculator", "/tools/one-rep-max-calculator"), ("RPE calculator", "/tools/rpe-calculator"), ("Plate loading calculator", "/tools/plate-loading-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
        close_h="Strength programmes built from each client's numbers",
    )
    if src:
        d["method"] = "Epley (1985) and Brzycki (1993) one-rep max equations"
        d["sources"] = src
    if prompt:
        d["prompt"] = prompt
    DATA[slug] = d


SRC = [
    ("Brzycki M. Strength testing: predicting a one-rep max from reps-to-fatigue. J Phys Educ Recreat Dance, 1993.", "https://doi.org/10.1080/07303084.1993.10606684"),
    ("LeSuer DA, et al. The accuracy of prediction equations for estimating 1-RM performance in the bench press, squat, and deadlift. J Strength Cond Res, 1997.", "https://journals.lww.com/nsca-jscr/abstract/1997/11000/the_accuracy_of_prediction_equations_for.5.aspx"),
]

lift_page(
    "bench-press-calculator", "bench press", "Bench press calculator",
    "Bench Press Calculator: Estimate Your Bench 1RM",
    "Free bench press calculator. Estimate your bench one-rep max from any set with Epley or Brzycki, and get working weights for every training percentage.",
    185,
    "The bench press is the most popular test of upper-body strength, and the easiest to estimate badly. Enter the weight and reps from a recent hard set, and this calculator estimates your bench one-rep max and gives you working weights for every common training percentage, rounded to loadable plates.",
    technique=[("Bench technique that makes estimates reliable", [
        "Estimates only mean something if every rep is performed the same way. A consistent bench press has a stable setup: feet planted, shoulder blades pulled back and down, a slight arch, and the bar lowered under control to the lower chest. The bar should touch the chest on every rep, without bouncing, and finish at full lockout.",
        "Many lifters train touch-and-go but compete or test with a pause. A pause typically reduces the weight you can lift by a few percent, so estimate from the style you will actually use. If you train both, track them separately.",
        "Grip width changes the lift too. A wider grip shortens the range of motion and often allows more weight; a closer grip shifts work to the triceps and usually reduces the maximum. Keep grip width consistent between the sets you compare.",
    ])],
    standards_note=[("What is a good bench press?", [
        "Relative to body weight, a bench press of around 0.75 times body weight is a common milestone for men in their first year of training, with a bodyweight bench marking solid intermediate strength and 1.5 times body weight a strong, experienced lifter. For women, around half of body weight is a common early milestone and three quarters of body weight a strong intermediate result. These are rough benchmarks; the strength standards calculator ranks your lift in more detail.",
    ])],
    programming=[("Programming the bench press", [
        "The bench responds well to frequency. Many lifters bench two or three times a week at different intensities: a heavier day with sets of three to five at 80 to 87 percent, a volume day with sets of eight to ten at 65 to 75 percent, and sometimes a variation day using close-grip, paused or incline benching. Accessory work for triceps, shoulders and upper back supports progress, because these muscles both move and stabilise the bar.",
        "Progress on bench is slower than on squat or deadlift for most people, because the muscles involved are smaller. Adding 2.5 kg or 5 lb every week or two is realistic for beginners; experienced lifters may add a similar amount over a whole training block.",
    ])],
    mistakes=[("Common bench press mistakes", [
        ("ul", [
            "**Bouncing the bar off the chest,** which inflates numbers and stresses the sternum and shoulders.",
            "**Flaring the elbows straight out,** which places more strain on the shoulders. A moderate tuck of about 45 to 70 degrees suits most people.",
            "**Lifting the hips off the bench,** which changes the angle and would not count in competition.",
            "**Losing upper-back tightness** as the bar comes down.",
            "**Benching without a spotter or safety arms** when working near your limit.",
        ]),
    ])],
    faq=[
        ("How do I calculate my bench press max?", "Use a hard set of 3 to 8 reps and a formula such as Epley: weight × (1 + reps ÷ 30)."),
        ("Is a paused bench lower than a touch-and-go bench?", "Usually by a few percent. Estimate from the style you train and test with."),
        ("What is a good bench press for my body weight?", "About 1 × body weight is a solid intermediate milestone for men and about 0.75 × for women."),
        ("How often should I bench to increase my max?", "Two or three times a week at varying intensities works well for most lifters."),
        ("Why has my bench stalled?", "Common causes are too little weekly volume, weak triceps or upper back, inconsistent technique, or poor recovery."),
        ("Should I use a wide or close grip?", "A moderate grip, with forearms roughly vertical at the bottom, suits most people. Keep it consistent when comparing numbers."),
        ("Do I need a spotter?", "When working near your limit, yes, or use a rack with safety arms set just below chest height."),
        ("How fast can I improve my bench?", "Beginners can add weight most weeks; experienced lifters progress more slowly, often a few kilograms per training cycle."),
        ("Does arching the back help?", "A moderate arch improves stability and shoulder position for most lifters. It also shortens the range of motion slightly."),
    ],
    extra=[("Accessory work that builds a bigger bench", [
        "The bench press is limited by its weakest link, which for many lifters is the triceps near lockout or the shoulders and chest off the bottom. Close-grip bench press, dips and overhead triceps extensions build lockout strength. Paused bench, spoto press and incline press build strength from the chest. Rows, face pulls and rear-delt work strengthen the upper back, which acts as the platform you press from. Most programmes include two to four accessory movements after the main bench work.",
    ])],
)

lift_page(
    "squat-calculator", "squat", "Squat calculator",
    "Squat Calculator: Estimate Your Squat 1RM",
    "Free squat calculator. Estimate your back squat one-rep max from any set using Epley or Brzycki, with a table of working weights for every training percentage.",
    225,
    "The back squat is often called the king of lower-body lifts, and it is one of the most useful numbers to track. Enter a recent hard set, choose a formula, and this calculator estimates your squat one-rep max and lays out working weights for each training percentage.",
    technique=[("Depth and technique standards", [
        "Squat estimates are only comparable if depth is consistent. Powerlifting rules require the hip crease to drop below the top of the knee; many lifters train to that depth or a little lower. Half squats allow far more weight, which makes them a poor basis for estimating a full squat.",
        "Bar position matters too. A high-bar squat, with the bar on top of the traps, keeps the torso more upright and usually allows a little less weight than a low-bar squat, where the bar sits lower on the upper back and the lifter leans further forward. Estimate from the style you train.",
        "Equipment such as knee sleeves, wraps and belts also affects numbers. Note what you used for each set so comparisons stay fair.",
    ])],
    standards_note=[("What is a good squat?", [
        "For men, squatting body weight for a single is a common early milestone, 1.5 times body weight solid intermediate strength, and twice body weight a strong, experienced lifter. For women, around 0.75 times body weight is a common early milestone and 1.25 times a strong intermediate result. The strength standards calculator gives a more detailed ranking.",
    ])],
    programming=[("Programming the squat", [
        "Most lifters squat two or three times a week. A typical structure combines a heavier day of three to five reps at 80 to 87 percent with a lighter or volume day of six to ten reps at 65 to 75 percent. Front squats, paused squats and tempo squats are useful variations that build position and strength out of the bottom.",
        "Squats are demanding on recovery because they involve so much muscle. If you also deadlift heavily, plan the two lifts so that the hardest sessions are spread through the week. Accessory work for the quads, hamstrings, glutes and core supports progress.",
    ])],
    mistakes=[("Common squat mistakes", [
        ("ul", [
            "**Cutting depth as the weight rises,** which makes estimates look better than they are.",
            "**Knees collapsing inward** under heavy loads.",
            "**Losing upper-back tightness,** letting the chest fall and the bar drift forward.",
            "**Rising hips first out of the bottom,** turning the squat into a good morning.",
            "**Squatting heavy without safety pins** or spotters.",
        ]),
    ])],
    faq=[
        ("How do I estimate my squat one-rep max?", "Use a hard set of 3 to 8 reps and a formula such as Epley: weight × (1 + reps ÷ 30)."),
        ("Does squat depth affect my max?", "Yes. Deeper squats allow less weight; use the depth you train at consistently."),
        ("Is high-bar or low-bar squat stronger?", "Most lifters can lift slightly more with a low-bar position, but both are valid."),
        ("What is a good squat for my body weight?", "About 1.5 × body weight is a solid intermediate milestone for men and about 1.25 × for women."),
        ("How often should I squat?", "Two or three times a week with varied intensity suits most lifters."),
        ("Should I wear a belt?", "A belt can help bracing on heavy sets. Track belted and unbelted numbers separately."),
        ("Why does my squat feel harder some days?", "Sleep, stress, nutrition and recent training all affect performance. Adjust load by feel on those days."),
        ("How fast does a squat improve?", "Beginners can add weight most sessions at first; progress slows to small gains per training cycle with experience."),
    ],
    src=SRC,
    prompt=dict(
        heading="Build a squat block from your estimate",
        when="When you have a squat estimate and want a structured few weeks of training.",
        paste="Your estimated squat max, how many days a week you squat, and your goal.",
        text="""My estimated squat one-rep max is [weight]. I squat [days] times a week. My goal is [strength / muscle / both].

1. Write a four-week squat plan with sets, reps and percentages for each session.
2. Use a training max of 90% of my estimate.
3. Include one variation (front, paused or tempo squat).
4. Suggest two accessory exercises for each session.""",
    ),
)

lift_page(
    "deadlift-calculator", "deadlift", "Deadlift calculator",
    "Deadlift Calculator: Estimate Your Deadlift 1RM",
    "Free deadlift calculator. Estimate your deadlift one-rep max from a recent set with Epley or Brzycki, and get working weights for every percentage.",
    315,
    "The deadlift is usually the heaviest of the main lifts, and the one where a grinding max attempt carries the most risk. Estimating from a hard set is a safer way to know your number. Enter the weight and reps, choose a formula, and this calculator estimates your deadlift one-rep max and builds a percentage table for training.",
    technique=[("Technique standards for reliable estimates", [
        "A consistent deadlift starts with the bar over the middle of the foot, a flat back, the hips set at a height that suits your build, and the bar kept close to the legs all the way up. Each rep should start from a dead stop on the floor, with no bouncing, and finish with the hips and knees fully locked.",
        "Touch-and-go deadlifts, where the plates tap the floor and rebound into the next rep, allow more reps at a given weight than dead-stop reps, which inflates estimates. For a reliable number, reset briefly on the floor between reps.",
        "Conventional and sumo deadlifts are different lifts with different leverages. Many lifters are noticeably stronger in one style; track them separately.",
    ])],
    standards_note=[("What is a good deadlift?", [
        "For men, deadlifting 1.5 times body weight is a solid intermediate milestone, and twice body weight is a strong, experienced lifter. For women, around body weight is a common early-to-intermediate milestone, and 1.5 times body weight is strong. The strength standards calculator ranks your lift in more detail.",
    ])],
    programming=[("Programming the deadlift", [
        "Because heavy deadlifts are so demanding, most lifters pull heavy only once a week, sometimes with a lighter variation on another day. A typical heavy session uses sets of two to five reps at 80 to 90 percent. Romanian deadlifts, deficit deadlifts, block pulls and paused deadlifts are common variations that build specific parts of the lift.",
        "Grip often limits the deadlift before the legs and back do. Mixed grip, hook grip or straps for lighter back-off sets can help, as can direct grip training. Plan heavy deadlifts away from heavy squat days to manage recovery.",
    ])],
    mistakes=[("Common deadlift mistakes", [
        ("ul", [
            "**Rounding the lower back** under heavy loads.",
            "**Letting the bar drift away** from the legs, which increases the load on the back.",
            "**Jerking the bar off the floor** instead of building tension first.",
            "**Hyperextending at lockout** by leaning back excessively.",
            "**Bouncing reps,** which makes estimates unreliable.",
        ]),
    ])],
    faq=[
        ("How do I estimate my deadlift max?", "Use a hard set of 3 to 6 dead-stop reps and a formula such as Epley: weight × (1 + reps ÷ 30)."),
        ("Are touch-and-go reps okay for estimating?", "They tend to inflate estimates. Reset each rep on the floor for a reliable number."),
        ("Is sumo or conventional stronger?", "It depends on your build. Many lifters are stronger in one; track them separately."),
        ("What is a good deadlift for my body weight?", "About 2 × body weight is strong for men and about 1.5 × for women."),
        ("How often should I deadlift heavy?", "Once a week for most lifters, with lighter variations on other days if desired."),
        ("Why does my grip fail before my back?", "Grip strength often lags. Use a hook or mixed grip for heavy sets and train grip directly."),
        ("Should I use straps?", "Straps are useful for back-off and high-rep sets. Test maxes are usually done without them."),
        ("Is it safe to test a deadlift max?", "It can be with good technique and a proper warm-up, but estimating from sets is often safer."),
        ("Why are my deadlift reps slower than my squat?", "The deadlift starts from a dead stop without a stretch reflex, so the first part is often the slowest."),
        ("How quickly does the deadlift improve?", "Beginners often progress quickly; experienced lifters may add a few kilograms per cycle."),
        ("Does a belt help the deadlift?", "Many lifters lift more with a belt. Track belted and unbelted numbers separately."),
    ],
    src=SRC,
    prompt=dict(
        heading="Plan your deadlift training from your estimate",
        when="When you have a deadlift estimate and want a block that builds without beating you up.",
        paste="Your estimated deadlift max, your stance, and how often you can train it.",
        text="""My estimated deadlift one-rep max is [weight], pulling [conventional / sumo]. I can deadlift [times] a week.

1. Write a four-week deadlift plan with sets, reps and percentages.
2. Base it on a training max of 90% of my estimate.
3. Include one deadlift variation and two accessory exercises.
4. Explain how to manage fatigue if I also squat heavy.""",
    ),
    extra=[("Grip, straps and equipment", [
        "Grip is a common limiting factor in heavy deadlifts. A double overhand grip is the most balanced but usually fails first at heavy loads. A mixed grip, with one palm facing forward and one back, holds more weight but loads the arms unevenly. A hook grip, wrapping the thumb under the fingers, is very secure once you get used to it. Chalk improves any grip. For estimating your max, use the grip you would use for a heavy single.",
        "A lifting belt helps many lifters brace and lift more on heavy sets. Whatever equipment you use, record it with each set so that estimates over time compare like with like.",
    ])],
)

lift_page(
    "overhead-press-calculator", "overhead press", "Overhead press calculator",
    "Overhead Press Calculator: Estimate Your Press 1RM",
    "Free overhead press calculator. Estimate your strict press one-rep max from any set with Epley or Brzycki, plus working weights for every percentage.",
    185,
    "The strict overhead press is a demanding test of shoulder and upper-body strength. Enter a recent hard set, choose a formula, and this calculator estimates your overhead press one-rep max and gives working weights for each training percentage, rounded to loadable plates.",
    technique=[("Strict press standards", [
        "A strict press starts with the bar resting on the front of the shoulders, elbows slightly in front of the bar, and finishes with the bar locked out over the middle of the foot. The legs stay straight: any knee bend turns it into a push press, which allows significantly more weight. Keep the glutes and core tight to avoid leaning back excessively, which shifts the lift toward an incline press.",
        "Estimates from push presses or heavily leaned-back presses will overstate strict pressing strength. Keep the standard consistent from set to set.",
    ])],
    standards_note=[("What is a good overhead press?", [
        "For men, pressing around 0.55 times body weight is a common intermediate milestone, and pressing body weight is an impressive long-term goal reached by relatively few lifters. For women, around 0.35 times body weight is a common intermediate milestone. The overhead press typically progresses more slowly than other lifts.",
    ])],
    programming=[("Programming the overhead press", [
        "Most lifters press two or three times a week, often alternating with the bench press. Sets of three to six reps at 75 to 87 percent build strength; sets of eight to twelve with dumbbells or lighter barbell work build the shoulders and triceps. Push presses can be used as a heavier variation to overload the lockout.",
        "Upper-back and rotator cuff work, such as face pulls, rows and external rotations, helps keep the shoulders healthy with frequent pressing.",
    ])],
    mistakes=[("Common overhead press mistakes", [
        ("ul", [
            "**Leaning back too far,** which turns the press into an incline press and strains the lower back.",
            "**Using leg drive** without noticing, which inflates estimates.",
            "**Pressing the bar forward** instead of moving the head out of the way so the bar travels straight up.",
            "**Flaring the elbows wide** at the start.",
        ]),
    ])],
    faq=[
        ("How do I estimate my overhead press max?", "Use a hard set of 3 to 8 strict reps and a formula such as Epley: weight × (1 + reps ÷ 30)."),
        ("Does a push press count?", "No. Push presses use the legs and allow much more weight; estimate strict and push press separately."),
        ("What is a good overhead press?", "Around 0.55 × body weight is a solid intermediate milestone for men and about 0.35 × for women."),
        ("Why is my overhead press so much weaker than my bench?", "The press uses smaller muscles and a longer range of motion. Pressing about 60 to 70 percent of your bench is common."),
        ("How often should I overhead press?", "Two or three times a week works well for most lifters."),
        ("Should I press seated or standing?", "Both build strength. Standing presses involve more of the body; keep the style consistent when comparing numbers."),
        ("How fast does the overhead press improve?", "Slowly for most lifters. Small, regular increases are normal."),
    ],
    extra=[("Building a stronger press", [
        "The overhead press tends to respond to frequency and patience. Pressing two or three times a week with a mix of heavier and lighter days, and using small increments of 1 to 2.5 kg, allows steady progress where big jumps would stall. Microplates help here. Building the triceps with close-grip bench and dips, and the upper back with rows and face pulls, supports a stronger press. Some lifters find that a few weeks of push presses, which let them handle heavier weights overhead, help the strict press when they return to it.",
    ])],
)

sys.path.insert(0, sys.argv[1])
try:
    from d1_extra import EXTRA  # noqa: E402
except ImportError:
    EXTRA = {}
for _slug, _secs in EXTRA.items():
    DATA[_slug]["sections"] = list(DATA[_slug]["sections"]) + _secs

ok = all([copygen.write_checked(f"{OUT}/{s}.tsx", d, TARGET[s]) for s, d in DATA.items()])
print("ALL OK" if ok else "SOME SHORT")
