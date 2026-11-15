import sys

sys.path.insert(0, sys.argv[1] + "/scripts")
import copygen  # noqa: E402

OUT = sys.argv[2]
WK = "In Traiv you build workout plans for each client, set weights from their numbers, and see every set and rep they log, so progress on each lift is visible week by week."
CW = {"wilks-calculator": 2659, "dots-calculator": 3160, "wilks-dots-calculator": 2581, "ipf-gl-points-calculator": 3943, "sinclair-calculator": 3101}
TARGET = {k: v - 150 for k, v in CW.items()}
DATA = {}


def P(h, *b):
    return (h, list(b))


RELATIVE = [
    P("Why relative strength scores exist",
      "A heavier lifter can usually lift more weight than a lighter one, simply because they carry more muscle. That makes raw totals a poor way to compare lifters across weight classes. Relative strength formulas solve this by multiplying a lifter's total by a coefficient that depends on body weight: lighter lifters get a larger coefficient, heavier lifters a smaller one. The result is a single score that estimates how strong a lifter is for their size.",
      "These scores are used to award best-lifter prizes at competitions, rank lifters across weight classes, and help individual lifters track whether their strength is rising faster than their body weight."),
    P("Strength does not scale in a straight line with body weight",
      "If strength rose in direct proportion to body weight, a 100 kg lifter would lift exactly twice as much as a 50 kg lifter. In reality, the heavier lifter usually lifts less than twice as much. Muscle cross-sectional area, which largely determines strength, grows more slowly than body mass as people get bigger, and very heavy lifters carry more non-muscle mass. Every relative strength formula is an attempt to model this curve as fairly as possible, using data from real competition results."),
    P("Using scores to track your own progress",
      "Even if you never compete, a relative score is a useful way to see whether you are getting stronger for your size. If you gain body weight and your total rises, your score shows whether strength increased faster than weight. If you lose weight while your total stays the same, your score rises, reflecting a genuine improvement in relative strength. Tracking a score every few months alongside body weight gives a clearer picture than raw numbers alone."),
    P("Limitations to keep in mind",
      ("ul", [
          "**Scores are estimates.** They are fitted to past competition data and are less reliable at the extremes of body weight.",
          "**Different formulas, different winners.** Wilks, DOTS and IPF GL can rank the same lifters in a slightly different order.",
          "**Equipment matters.** Raw and equipped totals are not directly comparable, even with the same formula.",
          "**Age is not included.** Masters and junior lifters often use additional age coefficients in competition.",
      ])),
]

DATA["wilks-calculator"] = dict(
    title="Wilks Calculator: Wilks Score for Powerlifting",
    description="Free Wilks calculator. Enter body weight and powerlifting total to get your Wilks score and compare strength across body weights, in kg or lb.",
    eyebrow="Free tool · Strength",
    h1="Wilks calculator",
    intro="The Wilks score is a long-standing way to compare powerlifters of different body weights. Enter your body weight and your total (squat, bench press and deadlift combined), choose your sex, and this calculator gives your Wilks score using the original Wilks coefficients.",
    short_q="What is a Wilks score?",
    short_a=[
        "A Wilks score multiplies your powerlifting total by a coefficient based on your body weight, so lifters of different sizes can be compared on one scale. A 90 kg man with a 500 kg total scores about 319 Wilks.",
        "For men, roughly 300 marks a strong gym lifter, 400 a nationally competitive lifter and 500 or more an elite one. The original formula was replaced in many federations by newer versions and by DOTS and IPF GL points, but it is still widely used and understood.",
    ],
    sections=[
        P("How the Wilks score is calculated",
          "The score is your total multiplied by 500, divided by a fifth-order polynomial of your body weight in kilograms. The polynomial's coefficients were fitted by Robert Wilks to competition results, with separate sets for men and women. The calculator applies the formula directly and converts pounds to kilograms first if you enter imperial values.",
          "Because the polynomial is fitted to typical competitive body weights, results at very light or very heavy body weights are less reliable. The calculator limits body weight to the range the formula was designed for."),
        *RELATIVE,
        P("Wilks score benchmarks",
          ("table", ["Wilks (men)", "Typical level"], [
              ["Under 200", "Beginner"], ["200 to 300", "Intermediate gym lifter"], ["300 to 350", "Strong, experienced lifter"],
              ["350 to 400", "Competitive at local or regional level"], ["400 to 450", "Nationally competitive"], ["Over 450", "Elite"],
          ]),
          "These ranges are rough and vary by federation and era. Women's scores on the original formula tend to run a little higher than men's at a similar relative level of strength, one of the reasons newer formulas were developed."),
        P("The history of the Wilks formula",
          "Robert Wilks, an Australian powerlifting official, developed the formula in the 1990s, and it was adopted by the International Powerlifting Federation and many national federations as the standard for best-lifter awards. Over time, analysts found it favoured some weight classes over others, particularly middle-weight men and certain women's classes. An updated version was released in 2020, and many federations moved to DOTS or IPF GL points. The original Wilks remains the score most lifters recognise, which is why it is still useful for comparison with historical results."),
        P("A worked example",
          "Two men compete at the same meet. One weighs 75 kg and totals 520 kg; the other weighs 110 kg and totals 640 kg. The heavier lifter has the bigger total, but the Wilks scores tell a different story: the 75 kg lifter scores about 371, and the 110 kg lifter about 377. Despite a 120 kg difference in totals, they are very close in strength for their size."),
        P("Wilks versus DOTS",
          "DOTS was developed later using more recent competition data, and it is designed to treat lifters at the extremes of body weight more evenly. For most lifters in the middle of the body-weight range, Wilks and DOTS scores are similar in scale and give similar rankings. The Wilks and DOTS calculator shows both side by side if you want to compare."),
        P("Raising your Wilks score",
          "There are two ways to raise your score: increase your total, or increase it more than your body weight. For most lifters, the most effective approach is to get stronger at a stable body weight, or to gain weight slowly while making sure strength rises faster. Losing body fat while maintaining your total also raises the score. Rapid weight cuts before competition can raise a score on the day but often reduce performance, so they need careful management."),
    ],
    coaches_h="Using Wilks with clients",
    coaches=[
        "Wilks scores give clients a simple way to see progress in relative strength, particularly during weight changes. A client who loses 5 kg and keeps the same total will see their score rise, a motivating result.",
        "Use the score to set goals across weight changes. Instead of a raw total target, a target Wilks score lets clients choose whether to gain strength, lose weight or both.",
        "Compare against the right reference. If your clients compete, use the formula their federation uses; for general tracking, any consistent formula works.",
    ],
    pitch_key="workouts",
    pitch_h="Track every client's strength over time",
    pitch=WK,
    next=[("Compare with DOTS", "/tools/dots-calculator"), ("See Wilks and DOTS together", "/tools/wilks-dots-calculator")],
    next_pitch="Coaching powerlifters? Traiv keeps every client's lifts and plans together.",
    faq=[
        ("What is a good Wilks score?", "For men, around 300 is a strong gym lifter, 400 nationally competitive and 500 elite. Women's scores on the original formula run slightly higher at a similar level."),
        ("How is the Wilks score calculated?", "Total × 500 ÷ a polynomial of body weight in kilograms, with different coefficients for men and women."),
        ("Is Wilks still used?", "Some federations still use it, but many have moved to DOTS or IPF GL points. It remains widely understood for comparison."),
        ("Should I enter my total in kg or lb?", "Either. The calculator converts to kilograms, which the formula uses."),
        ("Does Wilks account for age?", "No. Age adjustments are applied separately in masters and junior competitions."),
    ],
    keep=[("DOTS calculator", "/tools/dots-calculator"), ("IPF GL points calculator", "/tools/ipf-gl-points-calculator"), ("One-rep max calculator", "/tools/one-rep-max-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Relative strength, tracked for every client",
)

DATA["dots-calculator"] = dict(
    title="DOTS Calculator: DOTS Score for Powerlifting",
    description="Free DOTS calculator. Enter body weight and total to get your DOTS score, compare lifters across weight classes and see how your score changes with your total.",
    eyebrow="Free tool · Strength",
    h1="DOTS calculator",
    intro="DOTS is a modern relative strength score used by many powerlifting federations to compare lifters of different body weights. Enter your body weight and total, choose your sex, and this calculator gives your DOTS score and a table showing how it would change with a bigger or smaller total.",
    short_q="What is a DOTS score?",
    short_a=[
        "DOTS multiplies your powerlifting total by a coefficient based on your body weight, producing a score that compares lifters of different sizes fairly. A 90 kg man with a 600 kg total scores about 388 DOTS.",
        "Roughly, 300 marks a strong gym lifter, 400 a nationally competitive lifter and 500 or more a world-class one. DOTS was introduced to fix imbalances in the original Wilks formula, especially at the lightest and heaviest body weights.",
    ],
    sections=[
        P("How DOTS is calculated",
          "DOTS divides 500 by a fourth-order polynomial of body weight in kilograms, with separate coefficients for men and women, and multiplies the result by your total. The coefficients were fitted to a large set of modern competition results. The calculator limits body weight to the range the formula was built for, roughly 40 to 210 kg for men and 40 to 150 kg for women."),
        *RELATIVE,
        P("DOTS benchmarks",
          ("table", ["DOTS", "Typical level"], [
              ["Under 250", "Beginner to early intermediate"], ["250 to 300", "Intermediate"], ["300 to 350", "Strong, experienced lifter"],
              ["350 to 400", "Regionally competitive"], ["400 to 450", "Nationally competitive"], ["Over 450", "Elite"],
          ]),
          "These ranges are guides, not official standards. Scores vary by federation, equipment and era."),
        P("Why DOTS replaced Wilks in many federations",
          "Analysts found that the original Wilks formula gave some body weights an advantage, which affected best-lifter awards. DOTS, short for Dynamic Objective Team Scoring, was developed using more recent data and a different curve shape, aiming to treat all body weights more evenly. Several federations adopted it from around 2019, while the International Powerlifting Federation developed its own system, IPF GL points."),
        P("A worked example",
          "A 60 kg woman totals 360 kg. Her DOTS score is about 399, which is regionally competitive. A 90 kg woman with a 430 kg total scores about 383. Even though the heavier lifter has a bigger total, the lighter lifter is stronger relative to her size. The table under the result lets you see how adding 50 or 100 kg to your total would change your score."),
        P("Using the total table",
          "The table under your result shows your DOTS score at your current total and at totals 50 and 100 kg higher and lower. It is a quick way to see how much progress a given increase represents, and to set goals. For many lifters, each additional 10 kg on the total adds roughly six to eight DOTS points, though the exact amount depends on body weight."),
        P("Improving your DOTS score",
          "Like any relative score, DOTS rises when your total grows faster than your body weight. Focus on the lift with the most room to improve, which is often the bench press for men and the bench press or squat for women. Small improvements in each lift add up: 5 kg on each of the three lifts adds 15 kg to the total."),
        P("Choosing a weight class",
          "Competitive lifters sometimes use DOTS to decide whether to move up or down a weight class. If gaining 5 kg would let you add 30 kg to your total, your DOTS score would likely rise, suggesting the move could pay off. If gaining weight adds little strength, staying in your current class is usually better. Running a few scenarios through the calculator helps make that decision with numbers rather than guesswork."),
    ],
    prompt=dict(
        heading="Plan how to raise your DOTS score",
        when="When you want a realistic plan to improve your score over the next few months.",
        paste="Your body weight, your best squat, bench and deadlift, your DOTS score and your target.",
        text="""My powerlifting numbers:
Body weight: [weight]
Squat: [kg], Bench: [kg], Deadlift: [kg]
Current DOTS: [score]
Target DOTS: [score] by [date]

1. Tell me which lift has the most room to improve for my body weight.
2. Suggest how many kg I need to add to my total to hit the target at my current body weight.
3. Compare the effect of staying at this body weight with gaining or losing 3 kg.
4. Outline a 12-week training focus to get there.""",
    ),
    coaches_h="Using DOTS with clients",
    coaches=[
        "DOTS gives competitive lifters a clear target that accounts for body weight, which is useful when planning weight class changes or deciding where to focus training.",
        "Use the total table to set realistic goals. Showing a client that 20 kg on their total adds about 14 points makes progress feel concrete.",
        "For non-competitive clients, a DOTS score tracked every few months is a simple measure of strength relative to body weight, especially during diets.",
    ],
    pitch_key="workouts",
    pitch_h="Programme and track strength for every client",
    pitch=WK,
    next=[("Compare with Wilks", "/tools/wilks-dots-calculator"), ("Calculate IPF GL points", "/tools/ipf-gl-points-calculator")],
    next_pitch="Coaching competitive lifters? Traiv keeps every client's lifts in one place.",
    faq=[
        ("What is a good DOTS score?", "Around 300 is a strong gym lifter, 400 nationally competitive and 500 elite."),
        ("How is DOTS different from Wilks?", "DOTS uses a newer curve fitted to recent data and treats very light and very heavy lifters more evenly."),
        ("Which federations use DOTS?", "Several national and international federations outside the IPF use it for best-lifter awards."),
        ("Does DOTS work for women?", "Yes. It has separate coefficients for men and women."),
        ("Can I use DOTS for a single lift?", "It is designed for full totals, but some lifters use it informally for single lifts to compare relative strength."),
        ("How many points is 10 kg on my total worth?", "Roughly six to eight DOTS points for most lifters, depending on body weight."),
        ("Is DOTS better than IPF GL points?", "Neither is objectively better. Use the system your federation uses; for personal tracking, pick one and stay consistent."),
    ],
    keep=[("Wilks calculator", "/tools/wilks-calculator"), ("IPF GL points calculator", "/tools/ipf-gl-points-calculator"), ("Strength standards calculator", "/tools/strength-standards-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Strength scores and programmes for every client",
)

DATA["wilks-dots-calculator"] = dict(
    title="Wilks and DOTS Calculator: Both Scores Side by Side",
    description="Free Wilks and DOTS calculator. Enter body weight and total once and get both relative strength scores side by side, in kg or lb.",
    eyebrow="Free tool · Strength",
    h1="Wilks and DOTS calculator",
    intro="Wilks and DOTS are the two most widely recognised scores for comparing powerlifters across body weights. Enter your body weight and total once, choose your sex, and this calculator shows both scores side by side so you can compare them or match whichever your federation uses.",
    short_q="What is the difference between Wilks and DOTS?",
    short_a=[
        "Both multiply your total by a coefficient based on body weight. Wilks is the older formula, used for decades; DOTS is newer and fitted to more recent competition data, designed to treat very light and very heavy lifters more fairly.",
        "For most lifters in the middle of the body-weight range, the two scores are similar in size and give similar rankings. At the extremes, they can differ by enough to change who wins a best-lifter award.",
    ],
    sections=[
        P("How each score is calculated",
          "Wilks multiplies your total by 500 divided by a fifth-order polynomial of body weight; DOTS uses 500 divided by a fourth-order polynomial with different coefficients. Both have separate versions for men and women. The calculator converts pounds to kilograms first if needed, then applies each formula."),
        *RELATIVE,
        P("When the two scores differ most",
          "The formulas agree most closely for men between about 75 and 105 kg and women between about 55 and 80 kg. For lighter and heavier lifters, the differences grow. In general, the original Wilks tended to favour middle-weight men compared with DOTS, while DOTS gives relatively better scores to the lightest and heaviest classes. If your two scores differ a lot, it is likely because your body weight sits toward one of those extremes."),
        P("A worked example",
          "An 82.5 kg man with a 500 kg total scores about 335 Wilks and about 339 DOTS, nearly identical. A 125 kg man with a 750 kg total scores about 427 Wilks and about 425 DOTS. A 52 kg woman with a 300 kg total scores noticeably differently on the two formulas, because women's coefficients diverge more at lower body weights. Running your own numbers through both shows how much the choice of formula matters for you."),
        P("Which score should you use?",
          "If you compete, use the formula your federation uses for awards. If you are tracking your own progress, either works, as long as you stay consistent. DOTS is the more modern choice and is increasingly common; Wilks is useful for comparing with older results and records. Many lifters simply note both."),
        P("Other scoring systems",
          "Besides Wilks and DOTS, the International Powerlifting Federation uses IPF GL points, which have separate formulas for raw and equipped lifting. Olympic weightlifting uses the Sinclair coefficient. Each system has its own scale, so scores from different systems cannot be compared directly. The IPF GL points and Sinclair calculators cover those systems."),
        P("Tracking both over time",
          "Recording both scores every few months gives a fuller picture of progress. If both rise, your relative strength is clearly improving. If one rises while the other barely moves, it usually reflects a body-weight change that the two formulas weight slightly differently. Either way, the trend matters more than any single result."),
    ],
    coaches_h="Using both scores with clients",
    coaches=[
        "Showing both scores helps clients understand that relative strength scoring is an estimate with more than one reasonable method, not a single truth.",
        "For competitive lifters, focus on the score their federation uses, but keep both in your records for context.",
        "For general clients, pick one score and use it consistently as a simple measure of strength relative to body weight.",
    ],
    pitch_key="workouts",
    pitch_h="Track strength and plans for every client",
    pitch=WK,
    next=[("Calculate IPF GL points", "/tools/ipf-gl-points-calculator"), ("See where each lift ranks", "/tools/strength-standards-calculator")],
    next_pitch="Coaching lifters? Traiv keeps every client's lifts and programmes together.",
    faq=[
        ("Are Wilks and DOTS scores the same?", "They are similar in scale for most lifters but use different formulas, so they can differ, especially at very light or heavy body weights."),
        ("Which is more accurate?", "DOTS was fitted to more recent data and is designed to be fairer across body weights, but neither is perfect."),
        ("Why are my two scores so different?", "Usually because your body weight is near one end of the range, where the formulas diverge most."),
        ("Can I compare a Wilks score with a DOTS score?", "Roughly, for lifters in the middle of the body-weight range. For precise comparisons, use the same formula."),
        ("Do these scores work for women?", "Yes. Both formulas have separate coefficients for women."),
        ("Which one does the IPF use?", "Neither. The IPF uses its own IPF GL points system."),
        ("Can I use these for single lifts?", "They are designed for totals, though some lifters use them informally for single lifts."),
        ("How often should I check my scores?", "After each meet or every few months of training is enough to see meaningful change."),
    ],
    keep=[("Wilks calculator", "/tools/wilks-calculator"), ("DOTS calculator", "/tools/dots-calculator"), ("IPF GL points calculator", "/tools/ipf-gl-points-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Every client's strength, measured fairly",
)

DATA["ipf-gl-points-calculator"] = dict(
    title="IPF GL Points Calculator: IPF Goodlift Score",
    description="Free IPF GL points calculator. Enter body weight and total, choose classic or equipped, and get your IPF Goodlift points as used for IPF rankings.",
    eyebrow="Free tool · Strength",
    h1="IPF GL points calculator",
    intro="IPF GL points, also called IPF Goodlift points, are the scoring system the International Powerlifting Federation uses to compare lifters across body weights and rank best lifters. Enter your body weight and total, choose classic or equipped and your sex, and this calculator gives your IPF GL points.",
    short_q="What are IPF GL points?",
    short_a=[
        "IPF GL points divide 100 times your total by a curve based on your body weight, with separate formulas for men and women, and for classic (raw) and equipped lifting. A 90 kg man with a 700 kg classic total scores about 93 points.",
        "As a rough guide, around 70 points is a capable gym lifter, 90 to 100 regionally competitive and more than 110 international level. The IPF introduced the formula in 2020 to replace an earlier system.",
    ],
    sections=[
        P("How IPF GL points are calculated",
          "The formula is: points = total × 100 ÷ (A − B × e^(−C × body weight)), where A, B and C are constants that differ for men and women and for classic and equipped lifting. The curve rises steeply at lower body weights and flattens at higher ones, reflecting how strength increases with size. The calculator applies the formula for your category directly."),
        P("Classic versus equipped",
          "Classic, or raw, powerlifting allows only a belt, knee sleeves, wrist wraps and a singlet. Equipped powerlifting allows supportive suits, bench shirts and knee wraps, which can add a great deal of weight to each lift. Because equipped totals are much higher, the IPF uses separate coefficients so that classic and equipped lifters are scored on comparable scales within their own divisions. Always choose the division you actually lifted in."),
        *RELATIVE,
        P("IPF GL benchmarks",
          ("table", ["IPF GL points", "Typical level"], [
              ["Under 60", "Beginner to early intermediate"], ["60 to 75", "Intermediate gym lifter"], ["75 to 90", "Strong, experienced lifter"],
              ["90 to 100", "Regionally competitive"], ["100 to 110", "Nationally competitive"], ["Over 110", "International level"],
          ]),
          "These ranges are approximate and can vary between federations and divisions."),
        P("A worked example",
          "A 74 kg man totals 600 kg in classic lifting, scoring about 88 IPF GL points. A 105 kg man totalling 760 kg scores about 94 points. The heavier lifter's total is 160 kg higher, but his relative strength is only slightly greater. A 63 kg woman with a classic total of 400 kg scores about 88 points, the same level as the 74 kg man."),
        P("Using sub-lifts",
          "The calculator lets you enter your squat, bench and deadlift separately as well as your total. Scoring individual lifts with the same formula is not official, but it can show which lift is relatively strongest or weakest for your body weight, which helps decide where to focus training."),
        P("Why the IPF changed its formula",
          "For many years, the IPF used the Wilks formula, then briefly an earlier IPF points system. Analysis of competition results showed both favoured some weight classes. The GL formula was introduced in 2020 using a large dataset of international results, aiming to make best-lifter awards as fair as possible across classes and divisions. Because it is fitted to elite results, it is designed for competitive totals and is less precise for very new lifters."),
        P("Planning for competition",
          "Competitive lifters often use IPF GL points to set meet goals, compare themselves with qualifying standards and plan attempts. Running a few totals through the calculator shows how many points each additional kilogram is worth, which helps decide whether a riskier third attempt is worth it. For many lifters, every 10 kg on the total adds roughly 1.3 to 1.5 points, depending on body weight."),
        P("Making weight",
          "Weight classes in IPF competitions have fixed upper limits, and many lifters manage body weight in the weeks before a meet. Because points depend on body weight, weighing in a little lighter can slightly increase your score at the same total. Aggressive weight cuts, however, can reduce strength on the day. Most coaches recommend competing close to your natural body weight, especially in the early years of competition."),
        P("Masters and juniors",
          "IPF competitions include age categories, from sub-juniors to masters. IPF GL points themselves do not adjust for age, but lifters compete for awards within their age category. If you are a masters lifter comparing your score with open lifters, remember that strength typically declines gradually with age, so a given score represents a higher level of achievement."),
    ],
    prompt=dict(
        heading="Plan meet attempts from your GL points",
        when="When you are preparing for a meet and want attempts that target a points goal.",
        paste="Your body weight, recent best lifts, division, and the GL points you want to reach.",
        text="""I'm preparing for an IPF meet.
Division: [classic / equipped], Sex: [male / female]
Body weight: [kg]
Recent best: Squat [kg], Bench [kg], Deadlift [kg]
Goal: [GL points]

1. Calculate the total I need for the goal at my body weight.
2. Suggest openers, second and third attempts for each lift that make the goal realistic.
3. Explain which lift gives the most points per kilogram of improvement for me.
4. Flag any attempt that looks too aggressive given my recent training.""",
    ),
    coaches_h="Using IPF GL points with clients",
    coaches=[
        "For IPF lifters, GL points are the most relevant measure of competitive standing. Use them to set meet goals and plan attempt selection.",
        "Use the sub-lift option to identify weak points. A lift that scores noticeably lower than the others is often the best place to focus the next training block.",
        "For non-competitive clients, any relative score works, but IPF GL points are a good choice if they follow IPF competitions or want to compare with IPF results.",
    ],
    pitch_key="workouts",
    pitch_h="Plan meet preparation for every client",
    pitch=WK,
    next=[("Compare with DOTS", "/tools/dots-calculator"), ("Load the bar for each attempt", "/tools/plate-loading-calculator")],
    next_pitch="Coaching IPF lifters? Traiv keeps every client's training and lifts together.",
    faq=[
        ("What are IPF GL points?", "The International Powerlifting Federation's scoring system for comparing lifters across body weights, introduced in 2020."),
        ("What is a good IPF GL score?", "Around 75 is a strong gym lifter, 90 to 100 regionally competitive and over 110 international level."),
        ("What is the difference between classic and equipped?", "Classic allows only a belt, sleeves and wraps; equipped allows supportive suits and shirts. They use different coefficients."),
        ("How is IPF GL different from DOTS?", "It uses a different formula and separate coefficients for classic and equipped lifting, fitted to IPF results."),
        ("Can I calculate points for one lift?", "The official formula is for totals, but scoring single lifts informally can show relative strengths and weaknesses."),
        ("Does body weight change my score?", "Yes. A lower body weight at the same total gives a slightly higher score."),
        ("Do IPF GL points adjust for age?", "No. Age categories are handled separately in competition."),
        ("Why did the IPF replace Wilks?", "Analysis showed Wilks favoured some weight classes; the GL formula aims to be fairer across classes and divisions."),
        ("Are IPF GL points comparable with DOTS?", "No. They use different scales. Compare scores within the same system."),
        ("Is it worth cutting weight for a higher score?", "Small, well-managed reductions can help slightly, but aggressive cuts often reduce strength on the day."),
    ],
    keep=[("DOTS calculator", "/tools/dots-calculator"), ("Wilks calculator", "/tools/wilks-calculator"), ("Plate loading calculator", "/tools/plate-loading-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Meet preparation and training for every client",
)

DATA["sinclair-calculator"] = dict(
    title="Sinclair Calculator: Sinclair Total for Weightlifting",
    description="Free Sinclair calculator. Enter body weight, snatch and clean and jerk to get your Sinclair total and coefficient for comparing Olympic weightlifters.",
    eyebrow="Free tool · Strength",
    h1="Sinclair calculator",
    intro="The Sinclair coefficient is used in Olympic weightlifting to compare lifters of different body weights. Enter your body weight, your best snatch and clean and jerk, and your sex, and this calculator gives your Sinclair total: what your total would be at the heaviest body weight.",
    short_q="What is a Sinclair total?",
    short_a=[
        "The Sinclair total is your weightlifting total (snatch plus clean and jerk) multiplied by a coefficient based on your body weight. It estimates what you would lift if you were as heavy as the heaviest competitors, so lifters of all sizes can be compared. An 89 kg man with a 335 kg total has a Sinclair total of about 405 kg.",
        "Lifters at or above the reference body weight have a coefficient of 1, so their Sinclair total equals their actual total. Lighter lifters have coefficients above 1.",
    ],
    sections=[
        P("How the Sinclair coefficient is calculated",
          "For lifters below a reference body weight, the coefficient is 10 raised to the power of A × (log10(body weight ÷ b))², where A and b are constants set for men and women. The reference weight b is based on the heaviest world-record holders. Lifters at or above b have a coefficient of 1. The constants are updated after each Olympic cycle to reflect current records; this calculator uses the coefficients in use since 2021."),
        P("Why weightlifting uses a different formula",
          "Olympic weightlifting tests speed, power and technique as well as strength, and the relationship between body weight and performance differs from powerlifting. The Sinclair formula was developed by Canadian statistician Robert Sinclair specifically for weightlifting, and it has been the standard for decades. Powerlifting scores such as Wilks and DOTS are not designed for weightlifting totals, and vice versa."),
        *RELATIVE,
        P("A worked example",
          "A 73 kg lifter snatches 130 kg and clean and jerks 160 kg, a 290 kg total. His coefficient is about 1.35, giving a Sinclair total of around 391 kg. A 102 kg lifter with a 340 kg total has a coefficient of about 1.14 and a Sinclair total of around 387 kg. Despite a 50 kg difference in totals, they are rated as almost equally strong for their size."),
        P("Sinclair benchmarks",
          "For men, Sinclair totals around 250 to 300 kg are typical of recreational lifters with some training, 350 to 400 kg of strong national-level competitors, and above 450 kg of international elite lifters. For women, totals around 180 to 220 kg are typical of recreational lifters, 260 to 300 kg of national competitors, and above 320 kg of international elite. These are rough guides that vary between countries and eras."),
        P("Masters lifters and the Meltzer-Faber coefficient",
          "Masters weightlifting competitions often add an age adjustment, known as the Sinclair-Meltzer-Faber or SMF coefficient for men and SMHF for women, which multiplies the Sinclair total by a factor that rises with age. This lets older lifters compare their performances with younger ones. This calculator gives the standard Sinclair total; masters lifters can apply their age factor separately."),
        P("Improving your Sinclair total",
          "Weightlifting totals improve through a combination of technique, speed, mobility and strength. Many lifters find that technical refinement on the snatch and clean and jerk, rather than raw strength gains, produces the fastest improvement in their total. Strength work such as front squats, back squats and pulls supports long-term progress. Because body weight affects the coefficient, gaining muscle can raise your total but lower your coefficient, so the Sinclair total shows whether the trade-off is worth it."),
        P("Comparing snatch and clean and jerk",
          "A common benchmark is that the snatch is around 80 percent of the clean and jerk. If your snatch is much lower than that, technique or mobility in the snatch may be holding you back; if it is higher, your clean and jerk may have room to improve. Checking this ratio alongside your Sinclair total helps decide which lift to prioritise."),
    ],
    coaches_h="Using Sinclair with clients",
    coaches=[
        "Sinclair totals let you compare lifters in a mixed-weight group, such as a club or team, on a single scale, which is useful for team selection and motivating friendly competition.",
        "Track each lifter's Sinclair total across training cycles, especially if body weight changes. It shows whether gains in the total are keeping pace with weight gain.",
        "Check the snatch-to-clean-and-jerk ratio alongside the Sinclair total to identify which lift needs attention.",
    ],
    pitch_key="workouts",
    pitch_h="Plan and track weightlifting training for every athlete",
    pitch=WK,
    next=[("Estimate a one-rep max", "/tools/one-rep-max-calculator"), ("Load the bar for each lift", "/tools/plate-loading-calculator")],
    next_pitch="Coaching weightlifters? Traiv keeps every athlete's training and lifts together.",
    faq=[
        ("What is the Sinclair coefficient?", "A number based on body weight that adjusts a weightlifting total so lifters of different sizes can be compared."),
        ("What is a good Sinclair total?", "For men, around 350 to 400 kg is strong national level; for women, around 260 to 300 kg."),
        ("Does Sinclair work for powerlifting?", "No. It was designed for Olympic weightlifting totals. Powerlifting uses Wilks, DOTS or IPF GL points."),
        ("Why is my coefficient 1?", "Lifters at or above the reference body weight have a coefficient of 1, so their Sinclair total equals their actual total."),
        ("How often are the coefficients updated?", "After each Olympic cycle, based on the current world records."),
        ("Is there an age adjustment?", "Masters competitions use an additional age factor, the Meltzer-Faber coefficient, applied to the Sinclair total."),
    ],
    keep=[("One-rep max calculator", "/tools/one-rep-max-calculator"), ("Plate loading calculator", "/tools/plate-loading-calculator"), ("Wilks and DOTS calculator", "/tools/wilks-dots-calculator"), ("How workout plans work in Traiv", "/features/plan-builder")],
    close_h="Training, lifts and progress for every athlete",
)

sys.path.insert(0, sys.argv[1])
try:
    from d2_extra import EXTRA  # noqa: E402
except ImportError:
    EXTRA = {}
for _slug, _secs in EXTRA.items():
    DATA[_slug]["sections"] = list(DATA[_slug]["sections"]) + _secs

ok = all([copygen.write_checked(f"{OUT}/{s}.tsx", d, TARGET[s]) for s, d in DATA.items()])
print("ALL OK" if ok else "SOME SHORT")
