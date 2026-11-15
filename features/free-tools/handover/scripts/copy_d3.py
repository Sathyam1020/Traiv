import sys

sys.path.insert(0, sys.argv[1] + "/scripts")
import copygen  # noqa: E402

OUT = sys.argv[2]
WK = "In Traiv you build workout plans for each client, set weights from their numbers, and see every set and rep they log, so progress on each lift is visible week by week."
CW = {"rpe-calculator": 2903, "rir-calculator": 3355, "tempo-calculator": 2970, "warm-up-set-calculator": 2456, "plate-loading-calculator": 3593}
TARGET = {k: v - 150 for k, v in CW.items()}
DATA = {}


def P(h, *b):
    return (h, list(b))


EFFORT_SHARED = [
    P("The RPE chart in practice",
      ("table", ["Reps", "RPE 10", "RPE 9", "RPE 8", "RPE 7"], [
          ["1", "100%", "95.5%", "92.2%", "89.2%"],
          ["3", "92.2%", "89.2%", "86.3%", "83.7%"],
          ["5", "86.3%", "83.7%", "81.1%", "78.6%"],
          ["8", "78.6%", "76.2%", "73.9%", "70.7%"],
          ["10", "73.9%", "70.7%", "68.0%", "66.4%"],
      ]),
      "Each step down in RPE behaves like adding a rep to the set: five reps at RPE 8 sits at the same percentage as seven reps at RPE 10. The calculator uses this relationship, interpolating for half-point RPEs and extending the chart beyond 12 effective reps with the Epley curve."),
    P("Why effort-based training works",
      "Strength varies from day to day. Sleep, stress, food, illness and the training you did earlier in the week all affect how strong you are today. A fixed percentage of your max can feel easy on a good day and crushing on a bad one. Effort-based targets, such as RPE 8 or two reps in reserve, adjust automatically: on a strong day the weight goes up, on a weak day it comes down, but the effort and training effect stay consistent.",
      "This approach is called autoregulation, and it is widely used by strength coaches because it matches training to what the body can actually do on the day, rather than what a spreadsheet predicted weeks earlier."),
    P("Learning to rate effort accurately",
      "Rating effort takes practice, and uncertainty is normal when learning a movement. Review the final repetitions with your coach and describe whether another repetition could use the same technique. A video and notes about the set can support that discussion. You do not need to deliberately reach failure to prove a rating, and no particular exercise is universally safe for a failure test. Compare repeatable sets over time rather than promising a fixed calibration deadline. Keep the target effort and the reported effort separate in your training record.",
      ("ul", [
          "**Bar speed slows noticeably:** usually two or three reps left.",
          "**Grinding, very slow rep:** usually zero or one rep left.",
          "**Form starts to change:** you are close to technical failure; stop.",
      ])),
    P("Using effort with percentages",
      "Many programmes combine both methods. A plan might call for sets of five at about 80 percent with a cap of RPE 8. If 80 percent feels like RPE 7, you add a little weight; if it feels like RPE 9, you take some off. Percentages give a starting point, and effort fine-tunes it. Over time, the relationship between your percentages and your RPEs also tells you whether your estimated max is accurate."),
]

DATA["rpe-calculator"] = dict(
    title="RPE Calculator: Convert RPE and Reps to % of 1RM",
    description="Free RPE calculator. Turn reps and RPE into a percentage of your one-rep max, estimate your max from a set, or find the working weight for a target RPE.",
    eyebrow="Free tool · Strength",
    h1="RPE calculator",
    intro="RPE, the rate of perceived exertion, describes how hard a set felt on a scale from 6 to 10, where 10 means you could not have done another rep. This calculator converts reps and RPE into a percentage of your one-rep max, so you can estimate your max from a set or work out how heavy to go for a target effort.",
    short_q="How does the RPE scale work?",
    short_a=[
        "In strength training, RPE 10 means maximal effort, with no reps left. RPE 9 means one rep left, RPE 8 two reps left, RPE 7 three reps left, and half points mean you might have managed one more. Combining reps with RPE tells you roughly what percentage of your max you used.",
        "Five reps at RPE 8 is about 81 percent of your one-rep max. If you did that set with 100 kg, your estimated max is about 123 kg. To hit five reps at RPE 8 next week with a 123 kg max, load about 100 kg.",
    ],
    sections=[
        P("How the calculator works",
          "In the default mode, enter your reps and RPE to get the percentage of your one-rep max that combination represents. If you also enter the weight you used, the calculator divides it by that percentage to estimate your max. In working-weight mode, enter your one-rep max instead, and the calculator multiplies it by the percentage to give the load for that set, rounded to the nearest 5 lb or 2.5 kg."),
        *EFFORT_SHARED,
        P("Where RPE came from",
          "The original Borg scale of perceived exertion was developed for endurance exercise and ran from 6 to 20. Strength coaches later adapted the idea into a 1 to 10 scale tied to reps in reserve, popularised by powerlifting coach Mike Tuchscherer. Linking each RPE to a specific number of reps left made the scale far more precise for lifting, and it is now one of the most common ways to program strength training."),
        P("Choosing RPE targets",
          ("table", ["Goal", "Typical RPE", "Notes"], [
              ["Technique practice", "6 to 7", "Crisp reps, plenty left in reserve"],
              ["Muscle growth", "7 to 9", "Most sets close to failure"],
              ["Strength", "7 to 9", "Heavy but not grinding"],
              ["Peaking for a meet", "8 to 10", "Heavy singles and doubles"],
              ["Deload week", "5 to 6", "Recovery with light work"],
          ]),
          "Most training sets for strength and muscle growth fall between RPE 7 and 9. Regular sets at RPE 10 add fatigue without much extra benefit and increase the risk of breaking technique."),
        P("Common mistakes with RPE",
          ("ul", [
              "**Rating too low** because sets feel hard; most beginners have more reps left than they think.",
              "**Rating the whole session** instead of each set.",
              "**Ignoring technique:** a rep with broken form counts as failure for RPE purposes.",
              "**Using RPE on unstable or risky exercises** where reaching true failure is dangerous.",
          ])),
    ],
    coaches_h="Using RPE with clients",
    coaches=[
        "RPE lets you program for clients you cannot see train every day. A target of RPE 8 adjusts automatically to their state on the day, which makes remote coaching far more effective than fixed weights.",
        "Teach clients the scale gradually. Start with simple reps-in-reserve language, check their ratings against videos, and refine over a few weeks.",
        "Use logged RPEs to spot trends. If a client's RPE at the same weight is rising week after week, fatigue may be building; if it is falling, they are getting stronger.",
    ],
    pitch_key="workouts",
    pitch_h="Program by effort for every client",
    pitch=WK,
    next=[("Work in reps in reserve instead", "/tools/rir-calculator"), ("Estimate your one-rep max", "/tools/one-rep-max-calculator")],
    next_pitch="Programming by RPE for clients? Traiv keeps every client's plans and logged sets together.",
    faq=[
        ("What does RPE mean in lifting?", "Rate of perceived exertion: how hard a set felt on a scale where 10 means no more reps were possible."),
        ("What is RPE 8?", "A set where you could have done about two more reps."),
        ("How do I convert RPE to a percentage of my max?", "Combine reps and RPE: for example, 5 reps at RPE 8 is about 81 percent of your one-rep max."),
        ("Is RPE accurate?", "With practice, most lifters rate within about one rep. Beginners often underestimate how many reps they have left."),
        ("What RPE should I train at?", "Most strength and muscle-building sets fall between RPE 7 and 9."),
        ("What is the difference between RPE and RIR?", "They describe the same thing from different angles: RPE 8 equals two reps in reserve."),
        ("Can I use RPE for every exercise?", "It works best for lifts where you can safely approach failure. For risky lifts, keep a margin."),
        ("Why does the same weight feel different on different days?", "Sleep, stress, food and fatigue all change your strength from day to day, which is why RPE-based training is useful."),
    ],
    keep=[("RIR calculator", "/tools/rir-calculator"), ("One-rep max calculator", "/tools/one-rep-max-calculator"), ("Weekly training volume calculator", "/tools/weekly-training-volume-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Effort-based programmes for every client",
)

DATA["rir-calculator"] = dict(
    title="RIR Calculator: Reps in Reserve to RPE and % of 1RM",
    description="Free RIR calculator. Convert reps and reps in reserve into RPE and a percentage of your one-rep max, estimate your max, or get a working weight for any target.",
    eyebrow="Free tool · Strength",
    h1="RIR calculator",
    intro="Reps in reserve, or RIR, is the number of extra reps you could have done at the end of a set. It is one of the simplest ways to describe effort. Enter your reps and RIR, and this calculator converts them to RPE and a percentage of your one-rep max, estimates your max if you add the weight you used, or gives you a working weight for a target set.",
    short_q="What does reps in reserve mean?",
    short_a=[
        "Reps in reserve is how many more reps you could have done with good form. Stopping a set with two reps left is 2 RIR, which is the same as RPE 8. Zero RIR means you reached failure.",
        "Eight reps with 2 RIR is about 74 percent of your one-rep max. If you used 60 kg, your estimated max is about 81 kg. Most effective training sets end with between zero and three reps in reserve.",
    ],
    sections=[
        P("How the calculator works",
          "RIR converts to RPE by subtracting it from 10: 2 RIR is RPE 8, 1 RIR is RPE 9. The calculator then uses the standard reps-and-RPE chart to find the percentage of your one-rep max. Add the weight you used to estimate your max, or switch to working-weight mode and enter your max to get the load for a target set."),
        *EFFORT_SHARED,
        P("Why RIR is easy to use",
          "Many lifters find reps in reserve more intuitive than RPE because it asks a concrete question: how many more could you have done? That makes it easier to teach to beginners and easier to apply consistently across different exercises. Coaches often use RIR language with clients and RPE in their own programming notes, since the two convert directly."),
        P("How close to failure should you train?",
          "Research comparing sets taken to failure with sets stopped a few reps short generally finds similar muscle growth when total volume is matched, as long as sets are reasonably close to failure, roughly zero to three reps in reserve. Training to failure on every set adds fatigue and can reduce the quality of later sets, while stopping too far from failure, with five or more reps left, tends to produce less growth.",
          "A practical approach is to keep most sets at one to three reps in reserve, take the last set of an exercise closer to failure on safe movements, and avoid failure on heavy compound lifts where form breakdown carries more risk."),
        P("RIR for different goals",
          ("table", ["Goal", "Typical RIR", "Example"], [
              ["Muscle growth", "0 to 3", "3 sets of 10 at 1 to 2 RIR"],
              ["Strength", "1 to 3", "5 sets of 3 at 2 RIR"],
              ["Power and speed", "3 to 5", "Fast reps, stopping well before slowing"],
              ["Technique work", "3 to 5", "Smooth, controlled reps"],
              ["Deload", "4 or more", "Light, easy sets"],
          ])),
        P("RIR on isolation and compound lifts",
          "Rating reps in reserve is usually more accurate on compound lifts like squats and presses, where bar speed gives clear feedback, than on isolation exercises like curls and lateral raises, where the burn can make sets feel harder than they are. Many lifters underestimate how many reps they have left on isolation work. Occasionally taking an isolation set to true failure helps recalibrate."),
        P("Progressing with RIR",
          "A simple progression is to choose a rep target and an RIR target, such as eight reps at 2 RIR. When you can do the set with three or more reps left, add weight. When the set drops to one rep left or fewer, keep the weight and aim to improve reps. Over a training block, some programmes reduce RIR week by week, starting at 3 and finishing at 0 or 1, before a lighter week resets fatigue."),
    ],
    coaches_h="Using RIR with clients",
    coaches=[
        "RIR is often the easiest effort scale to teach new clients. Ask them to note how many more reps they could have done at the end of each set, and review videos together to check accuracy.",
        "Program with RIR targets rather than fixed weights for remote clients. A target of 8 reps at 2 RIR works on good and bad days alike.",
        "Watch for chronically conservative ratings. Clients who always report 3 RIR or more may be leaving progress on the table.",
    ],
    pitch_key="workouts",
    pitch_h="Program by reps in reserve for every client",
    pitch=WK,
    next=[("Convert RPE to percentages", "/tools/rpe-calculator"), ("Check weekly sets per muscle", "/tools/weekly-training-volume-calculator")],
    next_pitch="Coaching remotely? Traiv keeps every client's plans, sets and notes together.",
    faq=[
        ("What is RIR in weightlifting?", "Reps in reserve: the number of extra reps you could have done with good form at the end of a set."),
        ("How does RIR relate to RPE?", "RPE = 10 − RIR. Two reps in reserve is RPE 8."),
        ("How many reps in reserve should I leave?", "Most effective training sets end with 0 to 3 reps in reserve."),
        ("Is training to failure necessary?", "No. Sets stopped one to three reps short produce similar muscle growth with less fatigue."),
        ("How accurate are RIR ratings?", "With practice, most lifters are accurate to within about one rep, especially on compound lifts."),
        ("Can beginners use RIR?", "Yes. It is simple to learn, though beginners often underestimate how many reps they have left at first."),
    ],
    keep=[("RPE calculator", "/tools/rpe-calculator"), ("One-rep max calculator", "/tools/one-rep-max-calculator"), ("Tempo calculator", "/tools/tempo-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Programmes that adapt to how clients feel each day",
)

DATA["tempo-calculator"] = dict(
    title="Tempo Calculator: Time Under Tension Per Set",
    description="Free tempo calculator. Enter a lifting tempo, reps and sets to see seconds per rep, time under tension per set and total time under tension for the session.",
    eyebrow="Free tool · Strength",
    h1="Tempo calculator",
    intro="Lifting tempo describes how fast you move through each part of a rep. A four-number code such as 3-1-2-0 sets the seconds for lowering, pausing at the bottom, lifting and pausing at the top. Enter a tempo, reps and sets, and this calculator gives you time under tension per rep, per set and for the whole exercise.",
    short_q="How do you read a lifting tempo?",
    short_a=[
        "A tempo like 3-1-2-0 means three seconds to lower the weight, a one-second pause at the bottom, two seconds to lift it, and no pause at the top. An X means lift explosively, counted here as one second.",
        "At 3-1-2-0, each rep takes six seconds, so a set of eight takes 48 seconds and three sets give 144 seconds, or 2.4 minutes, of time under tension.",
    ],
    sections=[
        P("How the calculator works",
          "Each rep's time is the sum of the four tempo numbers. Multiply by reps for time per set, and by sets for total time. The calculator shows all three, plus a reminder of the typical time-under-tension range for muscle-building work."),
        P("The four phases of a rep",
          ("ol", [
              "**Eccentric (first number):** lowering the weight, such as the descent in a squat or bench press.",
              "**Bottom pause (second number):** holding the stretched position.",
              "**Concentric (third number):** lifting the weight. X means as fast as possible.",
              "**Top pause (fourth number):** holding the contracted or locked-out position.",
          ]),
          "Some coaches write tempos starting with the concentric for lifts such as pull-ups and deadlifts, which begin with lifting. Always check how a programme defines its tempo before using it."),
        P("Does time under tension build muscle?",
          "Time under tension is a popular idea, but research suggests it matters less than how close to failure you train and how much total work you do. Studies comparing slow and fast tempos with similar effort generally find similar muscle growth across a wide range of rep speeds, roughly from half a second to eight seconds per rep. Very slow reps, beyond about ten seconds, tend to reduce growth because the weight has to be so light.",
          "That does not make tempo useless. Controlled lowering improves technique, reduces bouncing and momentum, and helps lifters feel the target muscle. Pauses build strength in the hardest positions. Tempo is a tool for quality and specific goals rather than a magic number for growth."),
        P("Choosing a tempo for your goal",
          ("table", ["Goal", "Example tempo", "Why"], [
              ["General muscle growth", "2-0-1-0 to 3-0-1-0", "Controlled lowering, normal lifting speed"],
              ["Technique and control", "3-1-1-0 or 4-1-1-0", "Slow lowering and a pause reinforce position"],
              ["Strength", "2-0-X-0", "Controlled down, explosive up"],
              ["Strength from the bottom", "2-2-X-0", "Pauses remove the stretch reflex"],
              ["Rehabilitation", "3-1-3-1", "Slow and controlled through the whole range"],
          ])),
        P("Time under tension ranges",
          "Sets lasting roughly 20 to 70 seconds cover most muscle-building work. Sets under about 20 seconds are typical of heavy strength work, while sets longer than about 70 seconds lean toward muscular endurance. These ranges are guides, not rules; effort and total weekly volume remain the main drivers of results."),
        P("Common tempo mistakes",
          ("ul", [
              "**Counting too fast:** saying three quickly is often closer to one and a half seconds.",
              "**Using tempo on every exercise:** tempo is most useful on a few key lifts.",
              "**Losing control under heavier loads:** if you cannot hold the tempo, the weight is too heavy for that tempo.",
              "**Forgetting tempo reduces the load:** slow tempos mean lighter weights than you use at normal speed.",
          ])),
        P("Using a tempo in practice",
          "Count out loud or in your head with a steady rhythm, or use a metronome app set to one beat per second. Film a set to check your actual speed. Start with lighter weights than usual, especially with long pauses or slow eccentrics, then build up over a few sessions as you get used to the tempo."),
    ],
    coaches_h="Using tempo with clients",
    coaches=[
        "Tempo is a powerful teaching tool. A slow lowering phase shows clients where they lose position, and pauses make it obvious when the bar path drifts.",
        "Use tempo selectively. Prescribe it for one or two key lifts per session rather than every exercise.",
        "Write tempos clearly in programmes and explain the notation once, so clients are not confused by four-digit codes.",
    ],
    pitch_key="workouts",
    pitch_h="Prescribe tempo and track every set",
    pitch=WK,
    next=[("Check weekly sets per muscle", "/tools/weekly-training-volume-calculator"), ("Set effort targets with RIR", "/tools/rir-calculator")],
    next_pitch="Writing detailed programmes? Traiv lets you add notes like tempo to every exercise.",
    faq=[
        ("What does 3-1-2-0 tempo mean?", "Three seconds lowering, one-second pause at the bottom, two seconds lifting, no pause at the top."),
        ("What does X mean in a tempo?", "Lift as fast as possible. The calculator counts it as one second."),
        ("Is slow lifting better for muscle growth?", "Not necessarily. Effort and total volume matter more than speed, within a broad range of tempos."),
        ("How long should a set last?", "Roughly 20 to 70 seconds covers most muscle-building work."),
        ("Should I use tempo on every exercise?", "No. Tempo is most useful on a few key lifts for technique, control or specific strength goals."),
        ("Why do I need lighter weights with tempo?", "Slower reps and pauses make each rep harder, so the same weight feels much heavier."),
    ],
    keep=[("Weekly training volume calculator", "/tools/weekly-training-volume-calculator"), ("RIR calculator", "/tools/rir-calculator"), ("Workout plan builder", "/tools/workout-plan-builder"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Detailed programmes and logged sets for every client",
)

DATA["warm-up-set-calculator"] = dict(
    title="Warm-Up Set Calculator: Build a Warm-Up Ramp",
    description="Free warm-up set calculator. Enter your working weight and reps to get a set-by-set warm-up ramp, full or quick, rounded to loadable plates.",
    eyebrow="Free tool · Strength",
    h1="Warm-up set calculator",
    intro="A good warm-up prepares you for heavy sets without tiring you out. Enter your working weight and reps, choose a full or quick ramp, and this calculator gives you a set-by-set warm-up with weights rounded to loadable plates.",
    short_q="How many warm-up sets should you do?",
    short_a=[
        "For heavy compound lifts, three to five warm-up sets is typical: start with the empty bar or a light weight for several reps, then build through roughly 40, 60, 75 and 85 percent of your working weight with fewer reps as you go.",
        "For a 225 lb working set, a full ramp might be 45 lb × 10, 90 × 5, 135 × 3, 170 × 2 and 190 × 1, then your work sets. The quick ramp skips some steps for lighter days or later exercises.",
    ],
    sections=[
        P("How the ramp is built",
          ("table", ["Ramp", "Steps"], [
              ["Full (5 steps)", "Bar × 10, 40% × 5, 60% × 3, 75% × 2, 85% × 1"],
              ["Quick (3 steps)", "40% × 5, 65% × 3, 85% × 1"],
          ]),
          "Weights are rounded to the nearest 5 lb or 2.5 kg, and never drop below the bar. The calculator assumes a 45 lb or 20 kg bar."),
        P("Why warm up before lifting?",
          "Warming up raises muscle temperature, increases blood flow and improves nerve signalling, all of which help muscles produce force. It also lets you rehearse the movement pattern with lighter loads, so your technique is sharp when the weight gets heavy. Studies generally find that a specific warm-up improves performance on heavy sets compared with no warm-up, and it may reduce the risk of strains."),
        P("Keeping warm-ups from becoming fatigue",
          "The goal of a warm-up is preparation, not training. Reps should fall as the weight rises, so the heaviest warm-up sets are singles or doubles that prime the movement without tiring the muscles. Doing sets of eight or ten at 75 percent before a heavy set of five would leave you fatigued before your work sets even start."),
        P("Full or quick ramp?",
          "Use the full ramp for the first heavy lift of the session, especially squats and deadlifts, heavy singles and doubles, or when you feel stiff or cold. Use the quick ramp for lighter working sets, for later exercises after the body is already warm, or for lifts that use smaller muscles and less weight."),
        P("General warm-up first",
          "Before the lift-specific warm-up, spend five to ten minutes on general movement: brisk walking, cycling or rowing, followed by a few dynamic movements such as leg swings, hip openers, arm circles and bodyweight squats. This raises body temperature and prepares joints for the range of motion of the lift. Long static stretches right before heavy lifting are generally not necessary and can slightly reduce strength for a short time."),
        P("Rest between warm-up sets",
          "Short rests of 30 to 60 seconds are fine for the lighter warm-up sets. Take a little longer, around one to two minutes, before the heaviest warm-ups and your first work set. Resting too long between warm-ups can let the body cool down again, while rushing the heavier sets can leave you slightly fatigued."),
        P("Adjusting for how you feel",
          "On days when you feel stiff, tired or sore, add an extra light set or two to the ramp. On days when you feel great, the standard ramp is enough. The warm-up is also a useful check-in: if a weight that normally feels light feels heavy, it may be a day to reduce the working weight slightly."),
    ],
    coaches_h="Using warm-up ramps with clients",
    coaches=[
        "Writing warm-up sets into clients' programmes removes guesswork and stops them from either skipping the warm-up or turning it into extra training.",
        "Use the warm-up to check technique. Coaching cues on light sets carry over to heavy ones.",
        "Encourage clients to treat the warm-up as a readiness check. Unusual heaviness on warm-ups is a good reason to adjust the plan for the day.",
    ],
    pitch_key="workouts",
    pitch_h="Build complete sessions for every client",
    pitch=WK,
    next=[("Load the plates for each set", "/tools/plate-loading-calculator"), ("Estimate your one-rep max", "/tools/one-rep-max-calculator")],
    next_pitch="Writing full sessions for clients? Traiv keeps warm-ups, work sets and logs together.",
    faq=[
        ("How many warm-up sets do I need?", "Three to five for heavy compound lifts; fewer for lighter or later exercises."),
        ("How heavy should my last warm-up be?", "Around 85 to 90 percent of your working weight, for a single or double."),
        ("Should I stretch before lifting?", "Dynamic movements are better before lifting. Long static stretches can briefly reduce strength."),
        ("How long should I rest between warm-up sets?", "30 to 60 seconds for light sets, one to two minutes before your heaviest warm-ups."),
        ("Do I need to warm up for every exercise?", "The first heavy lift needs the most. Later exercises usually need one or two lighter sets."),
        ("Can warm-ups make me weaker?", "Only if they are too long or too many reps. Low reps at heavier warm-up weights avoid fatigue."),
    ],
    keep=[("Plate loading calculator", "/tools/plate-loading-calculator"), ("One-rep max calculator", "/tools/one-rep-max-calculator"), ("RPE calculator", "/tools/rpe-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Complete sessions, from warm-up to last set",
)

DATA["plate-loading-calculator"] = dict(
    title="Plate Loading Calculator: Which Plates Go on the Bar",
    description="Free plate loading calculator. Enter a target weight, bar and the plates you have to see exactly which plates to load on each side, in kg or lb.",
    eyebrow="Free tool · Strength",
    h1="Plate loading calculator",
    intro="Working out which plates to put on the bar wastes time between sets, especially with unusual weights. Enter your target weight, choose your bar and tick the plates you have, and this calculator shows exactly which plates go on each side, and how close you can get if an exact match is not possible.",
    short_q="How do you calculate plates for a barbell?",
    short_a=[
        "Subtract the bar weight from your target, divide by two for each side, then load the heaviest plates that fit, working down to smaller ones. For 102.5 kg on a 20 kg bar, each side needs 41.25 kg: a 25, a 15 and a 1.25 kg plate.",
        "In pounds, 225 lb on a 45 lb bar needs 90 lb per side: two 45 lb plates. If you lack a plate size, the calculator finds the closest weight you can actually load.",
    ],
    sections=[
        P("How the calculator works",
          "The calculator subtracts the bar from your target, halves the result, and then fills each side with the heaviest available plates first, repeating plates as needed. If the remaining weight cannot be matched exactly with your plates, it shows the closest achievable total and how far short it is."),
        P("Standard bars and plates",
          ("table", ["Equipment", "Metric", "Imperial"], [
              ["Men's Olympic bar", "20 kg", "45 lb"],
              ["Women's Olympic bar", "15 kg", "35 lb"],
              ["Technique or training bar", "10 kg", "25 lb"],
              ["Large plates", "25, 20, 15, 10 kg", "45, 35, 25 lb"],
              ["Small plates", "5, 2.5, 1.25 kg", "10, 5, 2.5 lb"],
          ]),
          "Specialty bars, such as trap bars, safety squat bars and cambered bars, often weigh more or less than a standard bar. Weigh them or check the manufacturer's figure and enter the right value in the target if needed."),
        P("Competition colours",
          "In competition, metric plates are colour-coded: red for 25 kg, blue for 20 kg, yellow for 15 kg, green for 10 kg, white for 5 kg, and smaller change plates in other colours. Most gyms use black plates for training, but knowing the colours helps at meets and in gyms with competition plates."),
        P("Loading order and safety",
          ("ul", [
              "**Heaviest plates on first,** closest to the inside of the sleeve.",
              "**Load both sides evenly,** alternating sides on heavy loads so the bar does not tip off the rack.",
              "**Always use collars,** especially on squats, presses and anything moved off a rack.",
              "**Check both sides match** before lifting; uneven loading is a common cause of accidents.",
          ])),
        P("Microplates and small jumps",
          "Small plates of 0.5 to 1.25 kg, or 1 to 2.5 lb, allow tiny increases that keep progress going on lifts like the overhead press and bench press, where standard 2.5 kg or 5 lb jumps can be too big. If you have microplates, tick them in the calculator to reach weights in between standard increments."),
        P("Kilograms and pounds",
          "Many gyms mix kilogram and pound plates. A 20 kg plate is about 44.1 lb, slightly less than a 45 lb plate, and a 45 lb plate is about 20.4 kg. Over several plates, the difference adds up. Choose the unit that matches your plates, and if you mix them, convert carefully so your logged weights stay accurate."),
        P("Loading for percentages",
          "When a programme calls for a percentage of your max, round the result to a weight you can actually load. The one-rep max calculator rounds percentages to 5 lb or 2.5 kg steps; this calculator then shows exactly which plates to use. Using both together makes percentage-based training quick and accurate."),
        P("Common loading mistakes",
          ("ul", [
              "**Forgetting the bar weight** when adding up plates.",
              "**Counting plates for one side only** and doubling incorrectly.",
              "**Mixing kg and lb plates** without converting.",
              "**Assuming every bar is 20 kg or 45 lb.** Check specialty and lighter bars.",
          ])),
    ],
    prompt=dict(
        heading="Plan the plate changes for a whole session",
        when="When you have several working weights in a session and want to plan loading so plate changes are quick.",
        paste="Your bar weight, the plates available, and the list of weights for each set in the session.",
        text="""I'm planning a training session.
Bar: [weight]
Plates available: [list]
Sets in order: [weight × reps, weight × reps, ...]

1. Tell me which plates go on each side for every set.
2. Order the changes so I add or remove as few plates as possible between sets.
3. Flag any weight I cannot load exactly and suggest the closest option.""",
    ),
    coaches_h="Using plate loading with clients",
    coaches=[
        "Plate maths is a surprisingly common source of mistakes for newer clients. Showing them how to load the bar, or giving them the exact plates per side, prevents logging errors and uneven loading.",
        "In shared gyms, encourage clients to check bar weights, since many gyms have lighter bars that look like standard ones.",
        "Recommend microplates for lifts that progress slowly, so clients can keep adding weight in small steps.",
    ],
    pitch_key="workouts",
    pitch_h="Programmes with exact weights for every set",
    pitch=WK,
    next=[("Build a warm-up for your working weight", "/tools/warm-up-set-calculator"), ("Get working weights from your max", "/tools/one-rep-max-calculator")],
    next_pitch="Coaching in the gym? Traiv keeps every client's weights, sets and progress together.",
    faq=[
        ("How do I calculate plates per side?", "Subtract the bar weight from the target and divide by two, then load the heaviest plates that fit."),
        ("How much does a standard barbell weigh?", "A men's Olympic bar weighs 20 kg or 45 lb; a women's bar 15 kg or about 35 lb."),
        ("What plates do I need for 100 kg?", "On a 20 kg bar: a 25 kg and a 15 kg plate on each side."),
        ("What plates do I need for 225 lb?", "On a 45 lb bar: two 45 lb plates on each side."),
        ("What if I cannot load the exact weight?", "The calculator shows the closest weight you can load with your plates and how far short it is."),
        ("Do I need collars?", "Yes, especially for squats and presses. They stop plates sliding off unevenly."),
        ("Are kg and lb plates the same?", "No. A 20 kg plate is about 44.1 lb, slightly lighter than a 45 lb plate."),
        ("What are microplates?", "Very small plates, often 0.5 to 1.25 kg, used for small increases on slowly progressing lifts."),
        ("How much does a trap bar weigh?", "It varies by model, commonly 20 to 30 kg. Check the manufacturer's figure."),
        ("Which plates go on first?", "The heaviest plates go closest to the inside of the sleeve."),
        ("What are bumper plates?", "Rubber plates designed to be dropped, used in weightlifting and some gyms. They are thicker than iron plates."),
        ("What colour is a 25 kg plate?", "Red, in competition colour coding. Blue is 20 kg, yellow 15 kg, green 10 kg."),
        ("Can I mix kg and lb plates on one bar?", "You can, but convert the weights carefully so your total is accurate."),
    ],
    keep=[("Warm-up set calculator", "/tools/warm-up-set-calculator"), ("One-rep max calculator", "/tools/one-rep-max-calculator"), ("Strength standards calculator", "/tools/strength-standards-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Exact weights, every set, for every client",
)

sys.path.insert(0, sys.argv[1])
try:
    from d3_extra import EXTRA  # noqa: E402
except ImportError:
    EXTRA = {}
for _slug, _secs in EXTRA.items():
    DATA[_slug]["sections"] = list(DATA[_slug]["sections"]) + _secs

from phase2_extra import EXTRA as MORE
for slug, sections in MORE.items():
    DATA[slug]["sections"] += sections

ok = all([copygen.write_checked(f"{OUT}/{s}.tsx", d, TARGET[s]) for s, d in DATA.items()])
print("ALL OK" if ok else "SOME SHORT")
