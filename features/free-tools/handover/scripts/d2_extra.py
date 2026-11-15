"""Extra original sections for the strength scoring pages."""


def _s(h, *blocks):
    return (h, list(blocks))


EXTRA = {}

EXTRA["wilks-calculator"] = [
    _s("How a powerlifting total works",
       "A powerlifting total is the sum of a lifter's best successful squat, bench press and deadlift in a single competition. Each lifter gets three attempts at each lift, and only the heaviest successful attempt counts. If a lifter fails all three attempts on any lift, they do not post a total. The Wilks score is calculated from that total and the lifter's official body weight at weigh-in, usually taken between two and twenty-four hours before lifting, depending on the federation."),
    _s("Calculating Wilks outside competition",
       "Most lifters who use a Wilks calculator are not at a meet. A gym total can be built from your best recent single in each lift, or from estimated one-rep maxes. Estimated totals are useful for tracking progress, but they usually run a little higher than competition totals, because competition lifts must meet strict standards for depth, pauses and lockout, and because the pressure of a meet affects performance. Treat a gym Wilks as a guide and a competition Wilks as the official measure."),
    _s("Wilks for women",
       "The women's coefficients in the original Wilks formula were fitted to a smaller dataset of women's results, and later analysis found they tended to give women's scores a slight boost compared with men's at similar relative strength. This was one reason the formula was revised in 2020 and why many federations moved to DOTS or IPF GL points. For comparing women with other women of different body weights, Wilks still works reasonably well."),
    _s("Using Wilks in a training group",
       "Gyms and teams sometimes use Wilks to run friendly competitions between members of different sizes, such as a monthly total day where the highest Wilks score wins. This keeps lighter and heavier members on a level playing field and rewards improvement relative to body weight. Recording each member's score over time also gives coaches a simple measure of the whole group's progress."),
    _s("Converting between kilograms and pounds",
       "The Wilks formula works in kilograms. If you enter your body weight and total in pounds, the calculator divides by 2.2046 before applying the formula. The score itself has no unit, so it is the same whichever unit you start with. Be careful to convert both body weight and total; mixing units is a common source of wildly wrong scores in spreadsheets."),
    _s("What a score cannot tell you",
       "A Wilks score summarises strength relative to body weight in a single number, but it says nothing about which lift is strong or weak, how a lifter performs under pressure, or how much potential they have left. Two lifters with the same score may have very different lift profiles. Use the score alongside individual lift numbers, training history and technique assessments for a complete picture."),
]

EXTRA["dots-calculator"] = [
    _s("What DOTS stands for",
       "DOTS is short for Dynamic Objective Team Scoring. The name reflects its original purpose: providing an objective way to score lifters across weight classes for team and best-lifter competitions. It was developed by powerlifting enthusiasts using modern competition data and has since been adopted by several federations as their primary relative strength measure."),
    _s("DOTS for women",
       "DOTS uses a separate set of coefficients for women, fitted to women's competition results. Because the curve is designed to be fair across the whole body-weight range, it tends to give lighter and heavier women more balanced scores than the original Wilks formula did. Women who compare their scores with older Wilks-based rankings may notice differences, especially at the lightest and heaviest body weights."),
    _s("Gym totals versus meet totals",
       "If you calculate DOTS from gym lifts, use your best recent single in each lift performed to competition standards: below parallel in the squat, a pause on the chest in the bench, and full lockout in the deadlift. Estimated maxes from rep sets are useful for tracking, but they tend to give slightly higher totals than you would achieve in competition. Meet totals, performed under judges, are the most reliable basis for comparison."),
    _s("Setting a DOTS goal",
       "A DOTS goal gives you a target that stays meaningful whether your body weight goes up or down. For example, a lifter aiming for 400 DOTS can use the calculator to see what total they would need at different body weights, then decide whether to focus on strength, weight management or both. Breaking the goal into smaller steps, such as 10 to 20 points per training cycle, keeps it achievable."),
    _s("DOTS in team competitions",
       "Some events score teams by adding up members' DOTS scores, allowing teams with lifters of different sizes to compete fairly. Coaches selecting team members can use DOTS to identify which lifters contribute most to the team score, rather than simply choosing the lifters with the biggest totals."),
    _s("Tested and untested federations",
       "Powerlifting federations differ in whether they test athletes for performance-enhancing drugs. Totals and DOTS scores in tested federations are generally lower at the top level than in untested ones. If you compare your score with published rankings, check which type of federation the rankings come from, so you compare like with like."),
    _s("How much of your score comes from each lift",
       "For most lifters, the deadlift contributes the largest share of the total, followed by the squat, then the bench press. A typical split might be about 35 to 40 percent from the deadlift, 35 percent from the squat and 25 to 30 percent from the bench. If one lift contributes much less than expected, improving it can raise your total and score efficiently."),
]

EXTRA["wilks-dots-calculator"] = [
    _s("Why there are so many scoring systems",
       "Powerlifting has several federations, and each has chosen the scoring system it believes is fairest. Over the decades, new data and better statistical methods have led to revised formulas, but older systems remain in use because lifters and officials know them well and because historical records are tied to them. Having more than one system is mainly a sign of ongoing efforts to make comparisons fairer."),
    _s("Which lifters benefit from each formula",
       "In general, the original Wilks formula tended to favour middle-weight men compared with very light or very heavy men, while DOTS spreads advantages more evenly across body weights. For women, differences between the formulas are larger at the lightest weights. If you are a very light or very heavy lifter, you may find your DOTS score compares more favourably with others than your Wilks score does."),
    _s("A quick comparison table",
       ("table", ["Feature", "Wilks", "DOTS"], [
           ["Introduced", "1990s", "Around 2019"],
           ["Curve", "Fifth-order polynomial", "Fourth-order polynomial"],
           ["Data", "Older competition results", "More recent competition results"],
           ["Main users", "Historical records, some federations", "Several modern federations"],
           ["Strength at extremes", "Less even", "More even"],
       ])),
    _s("Tracking progress with both",
       "Because both scores respond to the same things, total and body weight, they usually move in the same direction. If you get stronger at the same body weight, both rise. If you lose weight and keep your total, both rise. If you gain weight without adding much to your total, both fall. Watching both over time confirms that changes are real rather than an artefact of one formula."),
    _s("Using the scores to choose a weight class",
       "Before competing, some lifters run their expected totals at a few possible body weights through both formulas to decide which weight class gives them the best chance of placing well. If moving up a class would add a lot to the total, the scores can show whether the extra weight is worth it. If both scores fall with the extra weight, staying in the lighter class is usually the better choice."),
]

EXTRA["ipf-gl-points-calculator"] = [
    _s("The IPF and its competitions",
       "The International Powerlifting Federation is the largest international powerlifting body and runs world championships in both classic and equipped divisions, with age categories from sub-juniors to masters. It is a tested federation, meaning athletes are subject to anti-doping rules. National federations affiliated with the IPF use the same rules and scoring, so IPF GL points from a national meet are directly comparable with international results."),
    _s("IPF weight classes",
       "The IPF uses fixed weight classes for men and women. Men's classes range from 59 kg up to 120 kg and over, and women's from 47 kg up to 84 kg and over, with some additional junior classes. Lifters must weigh in at or below the class limit. Within each class, the heaviest total wins; across classes, IPF GL points decide best-lifter awards."),
    _s("Competition standards that affect your total",
       ("ul", [
           "**Squat:** the hip crease must go below the top of the knee, with commands to start and rack.",
           "**Bench press:** the bar must pause motionless on the chest before the press command, with head, shoulders and buttocks in contact with the bench.",
           "**Deadlift:** the lift must be completed with knees locked and shoulders back, without hitching or supporting the bar on the thighs.",
       ]),
       "Training to these standards ensures that gym totals translate to the platform."),
    _s("Attempt selection and points",
       "A common strategy is to open with a weight you could lift for two or three reps on a bad day, take a confident personal best or close to it on the second attempt, and use the third attempt to push for a new best if the first two went well. Missing attempts has a big effect on the total, so conservative openers protect your score. For lifters chasing a points target, calculating the required total before the meet helps plan third attempts precisely."),
    _s("Equipped lifting explained",
       "Equipped lifters wear supportive gear: a squat suit and knee wraps for the squat, a bench shirt for the bench press and a deadlift suit for the deadlift. This gear stores elastic energy and can add tens or even hundreds of kilograms to a lifter's total. Because the difference is so large, equipped and classic results are scored with different coefficients and ranked separately. Lifters who switch between the two should track their GL points in each division separately."),
    _s("A worked comparison across divisions",
       "A 93 kg man who totals 720 kg classic scores about 94 points. If he trained equipped and totalled 850 kg, his equipped GL points would be similar, around 92, reflecting that equipped totals are expected to be higher. The separate coefficients allow the IPF to compare lifters fairly within each division."),
    _s("Building toward a higher points score",
       "Raising IPF GL points comes down to adding kilograms to the total at a stable or lower body weight. For most lifters, that means steady progressive training on the three lifts, with technique practice to meet competition standards, and supporting accessory work for weak points. Because the points curve is relatively flat for heavier lifters, they may need larger total increases to gain the same number of points as lighter lifters."),
    _s("Using IPF GL points for qualifying totals",
       "Many national federations set qualifying standards for championships as minimum totals in each weight class, while some events and selection processes consider GL points. Checking your projected points against previous winners and qualifiers helps set realistic competition goals and shows how far you are from the next level."),
    _s("Common mistakes when calculating points",
       ("ul", [
           "**Using the wrong division.** Classic and equipped coefficients differ greatly.",
           "**Using gym body weight instead of weigh-in weight.** Points depend on the official body weight.",
           "**Mixing units.** Make sure body weight and total are both in kilograms or both converted from pounds.",
           "**Including failed lifts.** Only successful attempts count toward the total.",
       ])),
    _s("IPF GL points for women",
       "The women's coefficients were fitted to women's competition results, so scores for women are directly comparable with men's on the same scale. This allows mixed-gender best-lifter comparisons at events that use them. As with men, lighter women receive a larger multiplier, reflecting how strength scales with body size."),
]

EXTRA["sinclair-calculator"] = [
    _s("How a weightlifting total works",
       "In Olympic weightlifting, each lifter has three attempts at the snatch and three at the clean and jerk. The best successful attempt in each lift is added to give the total. If a lifter fails all three attempts in either lift, they do not post a total. The Sinclair total is calculated from this official total and the lifter's body weight at weigh-in."),
    _s("The snatch and the clean and jerk",
       "The snatch lifts the bar from the floor to overhead in one continuous movement, usually catching it in a deep squat before standing up. The clean and jerk is done in two parts: the clean brings the bar to the shoulders, usually catching it in a front squat, and the jerk drives it overhead. Both demand speed, flexibility, coordination and strength, which is why weightlifting totals do not scale with body weight in the same way as powerlifting totals."),
    _s("Weightlifting weight classes",
       "International weightlifting uses a set of weight categories for men and women that has changed several times over the years, most recently to reduce the number of classes. Lifters must weigh in at or below their category limit. Sinclair totals let coaches and officials compare lifters across categories, for example to award a best-lifter prize at a competition with many classes."),
    _s("Using Sinclair for team scoring",
       "Club and university weightlifting competitions often score teams using Sinclair totals, so that teams with lifters of different sizes can compete fairly. A team's score is usually the sum of its members' Sinclair totals. Coaches can use the calculator to estimate team scores and decide which lifters to enter."),
    _s("Technique matters more than in most strength sports",
       "Small technical improvements can add more to a weightlifting total than months of strength training. Bar path, timing of the second pull, speed under the bar and receiving position all affect how much a lifter can successfully lift. Many coaches recommend that newer lifters spend a large share of their training on technique with moderate weights, and track their Sinclair total to see the combined effect of technical and strength gains."),
    _s("Mobility for weightlifting",
       "Catching a snatch or clean in a deep squat, and holding a bar overhead in a stable position, requires good ankle, hip, thoracic and shoulder mobility. Limited mobility often caps how much weight a lifter can receive safely, even if they are strong enough to pull it. Regular mobility work, overhead squats, and paused squats in the receiving positions help improve the ranges needed. Weightlifting shoes with a raised heel make deep positions easier for most lifters."),
    _s("Strength work that supports weightlifting",
       "Front squats, back squats, clean and snatch pulls, push presses and overhead squats are common strength exercises for weightlifters. A strong front squat in particular supports the clean, because the lifter must stand up from a deep clean. A typical guideline is that the best clean is about 85 to 90 percent of the best front squat. If your clean is much lower than that, technique may be the limit; if it is close to your front squat, more leg strength will help."),
    _s("Sinclair for women",
       "Women's Sinclair coefficients use a lower reference body weight, based on the heaviest women's world-record holders. This means coefficients for women at a given body weight differ from men's, and the calculator applies the correct set based on your selection. Women's Sinclair totals are compared with other women's, not with men's."),
    _s("Tracking progress over a season",
       "Recording your Sinclair total after each competition, or after each training block using your best lifts, shows whether your relative performance is improving. Because weightlifters often manage body weight closely for competition, the Sinclair total is particularly useful for separating real progress from changes caused by moving between weight classes."),
]

EXTRA["wilks-calculator"] += [
    _s("Preparing for your first meet",
       "If a Wilks score has made you curious about competing, a local meet is the best place to start. Choose a meet several months away, learn the rules for each lift, practise commands with a training partner and train to competition standards. Pick conservative openers you could lift on a bad day. Most first-time lifters find meets far more welcoming than expected, and the total you post becomes the baseline for every score that follows."),
    _s("How body weight changes affect your score",
       "Because the coefficient falls as body weight rises, every kilogram you gain needs to bring extra strength with it to keep your score steady. For a 90 kg man, gaining 5 kg without adding to the total lowers the Wilks score by about 8 points. Adding around 20 kg to the total over the same period would more than make up for it. Running these scenarios helps decide whether a gaining phase is worth it for your goals."),
    _s("Scores across a lifting career",
       "Most lifters see their score rise quickly in the first few years as strength grows faster than body weight, then more slowly as they approach their potential. Comparing your score each year with the year before is a satisfying way to see long-term progress, and it remains meaningful even as your body weight changes through different phases of training and life."),
]

EXTRA["dots-calculator"] += [
    _s("Body weight scenarios",
       "DOTS makes it easy to compare plans. A 90 kg man with a 600 kg total scores about 388. If he loses 5 kg and keeps the same total, his score rises to roughly 400. If he gains 5 kg and adds 30 kg to his total, it rises to about 397. Both routes improve the score, but in different ways, and seeing the numbers helps a lifter choose which suits their goals and preferences."),
    _s("How often to update your score",
       "Recalculating after each competition, or at the end of each training block using your best singles, gives a clear record of progress. Weekly recalculation from gym estimates tends to be noisy and can be discouraging when normal day-to-day variation shows up as falling scores. Look for the trend across several months."),
    _s("DOTS and powerlifting rankings",
       "Online databases that collect results from many federations often allow sorting by DOTS, making it a convenient way to see how a performance compares with lifters around the world. When reading these rankings, check the federation, equipment and testing status, since these affect totals, and remember that rankings only include lifters who have competed."),
    _s("Starting points for new lifters",
       "Many new lifters score between 150 and 250 DOTS after their first months of training. That is a normal starting point, and the early years often bring rapid improvement as technique and strength develop together. Setting a goal of 50 more points over the next year is ambitious but realistic for many beginners training consistently."),
]

EXTRA["wilks-dots-calculator"] += [
    _s("Scores in practice: a few examples",
       ("table", ["Lifter", "Total", "Wilks", "DOTS"], [
           ["Man, 82.5 kg", "500 kg", "about 335", "about 339"],
           ["Man, 125 kg", "750 kg", "about 427", "about 425"],
           ["Woman, 60 kg", "360 kg", "about 401", "about 399"],
       ]),
       "For most men in the middle weight classes, the two scores sit within a few points of each other. For women and for lifters at the extremes, the gap can be larger."),
    _s("Why your federation's choice matters",
       "Best-lifter awards, team scoring and some qualifying standards depend on the scoring system a federation uses. If you are aiming for an award, calculate your score with the right formula, because a lifter who wins on DOTS might place second on Wilks, or the other way round. For personal tracking, the choice matters much less than consistency."),
    _s("Gym totals and meet totals",
       "If you calculate both scores from gym lifts, use your best recent single in each lift performed to competition standards. Estimated maxes from rep sets are fine for tracking, but competition totals are usually a little lower than gym estimates because of strict standards and the pressure of the day. Note which kind of total you used so later comparisons are fair."),
    _s("Setting goals with both scores",
       "A simple approach is to set your goal on the formula your federation uses and record the other for interest. If both rise over a training year, you know your relative strength has improved regardless of the method. If they move differently, look at your body weight change, since that is usually where the formulas disagree."),
]

EXTRA["ipf-gl-points-calculator"] += [
    _s("How many points is a personal best worth?",
       "For a 90 kg man in classic lifting, each 10 kg added to the total is worth about 1.3 points. For lighter lifters, each kilogram is worth slightly more; for heavier lifters, slightly less. Knowing this helps put progress in context: a 30 kg increase in total over a year, a very good result for an intermediate lifter, adds roughly 4 points."),
    _s("Training for a points goal",
       "A points goal turns into a total goal at a given body weight. Once you know the total you need, divide the increase between the three lifts based on where you have the most room to improve. Many lifters find their bench press improves most slowly, so a realistic plan might ask for larger gains on the squat and deadlift. Spread the target across several training blocks rather than expecting it in one."),
    _s("Recovery before a meet",
       "In the final one to two weeks before a competition, most lifters reduce training volume while keeping some heavy work, a process called a taper. This lets fatigue fall while strength stays high, so the lifter arrives at the meet fresh. A good taper can add several kilograms to a total and a point or two to GL points compared with arriving tired."),
    _s("Masters lifting and points",
       "Masters lifters compete in age categories starting at 40, and many set personal bests well into their fifties and beyond, especially if they started lifting later in life. Comparing GL points within your age category gives a fairer picture than comparing with open lifters, and tracking your own points across years shows how training is slowing or reversing age-related strength decline."),
    _s("Using points to plan weight class changes",
       "If you are considering moving up a weight class, calculate your points at your current body weight and total, then at the higher body weight with the total you expect to reach there. If the points rise, the move is likely worthwhile. If they fall or stay flat, the extra body weight is not adding enough strength to justify the change."),
]

EXTRA["sinclair-calculator"] += [
    _s("Competition format",
       "A weightlifting competition starts with the snatch, with each lifter taking up to three attempts, followed by the clean and jerk with another three. Lifters choose their opening weights in advance and the bar increases through the session, with lifters taking their attempts as the weight reaches their chosen numbers. Lifters often open conservatively, because missing all three attempts in either lift means no total and no Sinclair score."),
    _s("Typical progress for new lifters",
       "New weightlifters often improve their totals quickly as technique develops, sometimes adding 10 to 20 kg to their total within the first few months. Because technique improvements rather than strength drive much of this early progress, Sinclair totals can climb steeply at first and then level off to steadier gains as lifters become more experienced."),
    _s("Using Sinclair alongside powerlifting scores",
       "Some athletes train both weightlifting and powerlifting. Their Sinclair total and their Wilks, DOTS or IPF GL points measure different qualities: the Sinclair reflects speed, technique and power as well as strength, while powerlifting scores mainly reflect maximal strength. Tracking both gives a fuller picture of an athlete's development, but the numbers cannot be compared directly."),
    _s("Common mistakes when calculating Sinclair",
       ("ul", [
           "**Using a training total that mixes days.** Use your best lifts from the same session or competition for an official comparison.",
           "**Using gym body weight rather than weigh-in weight.** The coefficient depends on official body weight.",
           "**Using powerlifting totals.** The Sinclair coefficient is designed only for snatch plus clean and jerk.",
       ])),
]

EXTRA["wilks-calculator"] += [
    _s("Wilks and weight classes",
       "Powerlifting competitions group lifters into weight classes, and within each class the biggest total wins. Wilks is used across classes, typically to decide an overall best lifter. That means a lifter who wins their class may not win best lifter, and a lifter who finishes second in a strong class might still have the highest Wilks score of the day. Knowing your score helps you understand where you stand beyond your own class."),
    _s("A note on the 2020 Wilks update",
       "In 2020, an updated version of the formula, sometimes called Wilks 2 or the new Wilks, was released with revised coefficients and a different scale. Scores from the new version are not directly comparable with the original. This calculator uses the original coefficients, because they remain the most widely recognised and are tied to decades of historical results. If your federation uses the updated formula, check which version a published score refers to before comparing."),
    _s("Using Wilks to compare training partners",
       "Training partners of different sizes often wonder who is really stronger. Wilks gives a fair, simple answer. It also makes friendly rivalry more motivating, because a lighter lifter can beat a heavier partner on score even with a smaller total, and both have a clear way to measure improvement against each other."),
]

EXTRA["dots-calculator"] += [
    _s("A worked example across a training year",
       "A 75 kg woman starts the year with a 300 kg total, scoring about 292 DOTS. Over twelve months, she adds 30 kg to her total while her body weight rises to 77 kg. Her new score is about 317, a gain of roughly 25 points. Her total rose 10 percent while her body weight rose under 3 percent, which the DOTS score captures neatly in a single number."),
    _s("DOTS for lifters who do not compete",
       "Plenty of people lift for health, strength and enjoyment without ever stepping on a platform. For them, DOTS offers a simple, objective way to see whether they are getting stronger relative to their size. Calculating it every few months from your best gym lifts, performed with good technique, is enough to track progress and set motivating goals."),
    _s("Limitations of single-number scores",
       "A single score is useful but incomplete. Two lifters with the same DOTS may have very different strengths: one might have a strong deadlift and weak bench, the other the reverse. Looking at individual lifts alongside the score helps identify where training should focus. The strength standards calculator ranks each lift against body weight separately."),
    _s("Federations and records",
       "Different federations keep their own records, and DOTS-based rankings are common in some federations' databases. If you look up how your score compares with others, use rankings from federations with similar rules and testing policies to your own. Comparing a tested classic total with untested equipped results, for example, gives a misleading picture."),
    _s("Body composition and DOTS",
       "Because DOTS uses total body weight, it does not distinguish between muscle and fat. Two lifters of the same weight and total score the same, even if one carries much more muscle. Over time, improving body composition, adding muscle and losing fat while keeping body weight similar, tends to raise strength and therefore the score."),
]

EXTRA["wilks-dots-calculator"] += [
    _s("How the formulas were built",
       "Both formulas were created by fitting a curve to the totals of strong competitors across many weight classes. The idea is that the best lifters at each body weight represent a similar level of achievement, so the curve through their totals shows how strength naturally changes with size. A lifter's score then reflects how close they come to that curve. Wilks was fitted to older data and DOTS to more recent results, which partly explains why they differ."),
    _s("Scores for very light and very heavy lifters",
       "At the lightest body weights, small differences in weight change the coefficient a lot, so scores can swing noticeably with a kilogram or two of weight change. At the heaviest, the curves flatten, and adding body weight barely changes the coefficient. Lifters at either extreme should be especially careful to use their official weigh-in weight when calculating scores."),
    _s("Recording your scores",
       "Keep a simple log with the date, body weight, the three lifts, total, Wilks score and DOTS score. Over a year or two, this record shows how your relative strength has developed, which lifts drove the improvement and how body weight changes affected your scores. It also makes it easy to answer the common question of whether a gaining or cutting phase helped or hurt your strength."),
]

EXTRA["ipf-gl-points-calculator"] += [
    _s("A worked example: comparing two lifters",
       "Two women compete at the same meet. One weighs 57 kg and totals 370 kg classic; the other weighs 84 kg and totals 470 kg. The lighter lifter scores about 87 points and the heavier about 89, so despite a 100 kg difference in totals they are close, with the heavier lifter slightly stronger for her size. If the best-lifter award goes to the highest GL points, the heavier lifter would win by a narrow margin."),
    _s("Points and personal records",
       "Setting a new personal record at a lower body weight can produce a bigger jump in points than the extra kilograms alone suggest. A lifter who adds 10 kg to their total while dropping 2 kg of body weight gains points from both directions. That is one reason careful body composition work alongside strength training can be so rewarding for competitive lifters."),
    _s("Classic lifting gear",
       "Classic lifters may use a belt, knee sleeves, wrist wraps and a singlet, and sometimes specific shoes and socks for the deadlift. These items help with stability and support but do not store elastic energy the way equipped suits and shirts do. Using the same gear in training as on the platform keeps gym totals realistic estimates of competition totals."),
    _s("Understanding the curve",
       "The GL formula uses an exponential curve that rises steeply for lighter lifters and flattens for heavier ones. In practical terms, a lighter lifter needs a smaller total to score the same points as a heavier lifter. The steepness of the curve differs between men and women, and between classic and equipped divisions, which is why each category has its own constants."),
    _s("IPF GL points for coaches",
       "Coaches of IPF lifters can use points to rank a squad across weight classes, set realistic meet goals, and decide which lifters to send to championships. Reviewing each lifter's points after every meet, alongside notes on preparation and attempt selection, builds a valuable record of what works for each athlete."),
]

EXTRA["sinclair-calculator"] += [
    _s("A worked example: two women",
       "A 59 kg woman snatches 80 kg and clean and jerks 100 kg, a 180 kg total. Her Sinclair coefficient is much larger than for a heavier lifter, giving a Sinclair total well above her actual total. An 81 kg woman with a 210 kg total has a smaller coefficient. The calculator shows both coefficients and Sinclair totals, making it easy to see which lifter is relatively stronger, even though the heavier one has the bigger actual total."),
    _s("Why the reference weight changes",
       "The Sinclair formula's reference body weight is based on the heaviest world-record holders. When records change and the governing body updates its weight classes, the reference weight and the A constant are recalculated, usually once per Olympic cycle. That is why Sinclair totals from different eras are not perfectly comparable. When comparing your total with older results, check which coefficients were in use."),
    _s("Building a stronger total",
       "Most weightlifting programmes combine three types of work: the competition lifts and their variations for technique and speed, strength work such as squats and pulls, and accessory work for the upper back, core and shoulders. Beginners usually benefit most from frequent technique practice; experienced lifters often need more strength work to keep improving. Tracking the Sinclair total over months shows how the balance of training is paying off."),
    _s("Sinclair for youth lifters",
       "Young weightlifters are still growing, so their body weight and strength change quickly. The Sinclair total helps coaches judge whether improvements reflect real progress or simply growth. For youth and junior lifters, the focus should stay on technique, mobility and safe progression, with competition results seen as part of long-term development rather than ends in themselves."),
]

EXTRA["wilks-calculator"] += [
    _s("Building your total lift by lift",
       "Raising a Wilks score means raising your total, and the total responds best when all three lifts improve together. Many lifters find their deadlift progresses fastest, their squat steadily, and their bench press slowest. A balanced programme trains each lift at least once or twice a week, with heavier and lighter days, and adds accessory work for the muscles that limit each lift. Small, regular gains on all three add up to a meaningful rise in score over a training year.",
       "Tracking each lift's estimated max alongside the score shows which lift is driving progress and which is holding it back."),
    _s("When to recalculate",
       "Recalculate your Wilks score after each competition, or at the end of a training block if you test or estimate your best singles. Recalculating weekly from gym estimates tends to be noisy, because normal day-to-day variation in strength and body weight moves the score up and down without reflecting real change."),
]

EXTRA["dots-calculator"] += [
    _s("Why heavier lifters have lower coefficients",
       "A heavier body carries more muscle, but also more bone, organs and often more fat, none of which add directly to lifting strength. In addition, muscle strength depends on cross-sectional area, which grows more slowly than body mass as people get larger. The DOTS curve captures this: as body weight rises, the coefficient falls, so a heavier lifter needs a proportionally larger total to earn the same score as a lighter lifter.",
       "This is why a lighter lifter with a smaller total can outscore a heavier one, and why relative scores reward getting stronger without simply getting heavier."),
    _s("How accurate is DOTS?",
       "No formula perfectly captures the relationship between body weight and strength for every individual. DOTS was designed to be as fair as possible across the range of competitive body weights, using a large set of results. It works well for most lifters in typical weight ranges and less precisely at the very lightest and heaviest weights, where fewer lifters compete. Treat small differences of a few points between lifters as essentially equal."),
    _s("Tracking DOTS during a diet",
       "During a fat-loss phase, a stable or rising DOTS score is one of the clearest signs that you are keeping strength while losing weight. If your total stays the same while body weight falls, your score rises. If your score drops noticeably, your total may be falling faster than your body weight, which can signal that the deficit is too large or recovery too poor. Checking your score every few weeks during a diet helps catch this early."),
]

EXTRA["wilks-dots-calculator"] += [
    _s("Should you switch formulas?",
       "If you have years of results recorded in Wilks, there is no need to abandon them. Keep recording Wilks for continuity and add DOTS alongside it. Over time, you will have both histories, which makes it easy to compare with older results and with lifters who use the newer system. If you are just starting out, DOTS is the more modern default, but recording both costs nothing."),
    _s("What both formulas leave out",
       "Neither formula accounts for age, height, limb length, training history or equipment differences beyond the basic raw and equipped split. A tall, long-limbed lifter may be at a leverage disadvantage in some lifts that no formula captures. Age adjustments are handled separately in masters and junior categories. Keep these factors in mind when comparing your score with someone else's, especially if their situation differs a lot from yours."),
]

EXTRA["ipf-gl-points-calculator"] += [
    _s("Why GL points use an exponential curve",
       "Earlier formulas like Wilks used polynomials, which can behave strangely at the edges of the body-weight range, bending up or down in ways that do not reflect real strength. The exponential curve used in IPF GL points rises smoothly and flattens toward a limit, a shape that better matches how strength tends to increase with body size. This makes the formula more stable at very light and very heavy body weights, where polynomial curves tend to struggle."),
    _s("Planning a competition year",
       "Many IPF lifters plan two or three competitions a year, with training blocks between them. A common structure is a longer building phase focused on volume and technique, followed by a strength phase with heavier work, a peak with near-maximal singles, a taper, and the meet itself. Calculating projected GL points at each stage keeps goals realistic and helps decide which meets to target.",
       "After each meet, a short recovery phase with lighter training and variety helps lifters return fresh for the next cycle."),
    _s("GL points and lifter development",
       "For developing lifters, GL points provide a clear, comparable measure of progress across years, even as body weight changes and lifters move between weight classes. A young lifter who grows from the 66 kg class to the 83 kg class over several years can compare their points directly to see whether their strength has kept pace with their growth. Coaches often use this to identify promising lifters for national squads."),
    _s("Reading published results",
       "Meet results published by IPF-affiliated federations usually list each lifter's body weight, attempts, total and points. When comparing your points with published results, check the division, the age category and the year, since rules and coefficients can change. Results from the same federation and division in recent years give the most meaningful comparisons."),
]

EXTRA["sinclair-calculator"] += [
    _s("How the coefficient behaves",
       "The Sinclair coefficient rises steeply for lighter lifters and approaches 1 as body weight nears the reference weight. In practice, a 55 kg lifter might have a coefficient around 1.6 to 1.7, an 81 kg lifter around 1.27, and a 109 kg lifter close to 1.1. Above the reference weight, the coefficient is exactly 1. This shape reflects how weightlifting performance increases with size, but at a decreasing rate as lifters get heavier."),
    _s("Snatch and clean and jerk ratios",
       "Coaches often compare the snatch with the clean and jerk to identify technical gaps. A snatch around 78 to 82 percent of the clean and jerk is typical. A much lower ratio suggests the snatch needs technical attention; a higher ratio may mean the jerk or the clean is limiting the total. Because the Sinclair total depends on both lifts together, closing a gap in the weaker lift is often the fastest way to raise it."),
    _s("Recording your lifts",
       "For each training session or competition, record the weights you made and missed for both lifts, along with body weight. Over time, this record shows how your total, coefficient and Sinclair total change, and which lift is improving fastest. It also helps you choose sensible openers for competitions, based on what you reliably make in training."),
]

EXTRA["wilks-calculator"] += [
    _s("Scores and motivation",
       "A single number that summarises your strength can be surprisingly motivating. Setting a target score, such as 300 or 350, gives training a clear focus and makes every personal best feel like progress toward something. It also helps when progress on a single lift stalls: improvements elsewhere still move the score."),
]
EXTRA["dots-calculator"] += [
    _s("Choosing your best lifts",
       "For a gym DOTS calculation, use the heaviest single you have completed to competition standards in each lift within the last few months. If you have not tested singles recently, estimates from sets of three to five reps are a reasonable substitute, but note them as estimates. Mixing a recent squat with a bench from two years ago gives a total that does not reflect your current strength.",
       "Recalculating with fresh numbers after each training block keeps the score honest and useful for planning."),
]
EXTRA["wilks-dots-calculator"] += [
    _s("Scores for beginners",
       "New lifters often score between 150 and 250 on both formulas in their first months of training. That is a normal starting point, and both scores usually rise quickly over the first year or two as technique improves and strength builds. Watching both climb is a motivating way to see progress, even before you think about competing."),
]
EXTRA["ipf-gl-points-calculator"] += [
    _s("Using points to compare across weight classes",
       "Within a single weight class, the heaviest total decides the placings. Points matter when comparing across classes, for best-lifter awards, team scores and national rankings. Knowing your points tells you how your performance compares with lifters in every other class, not just your own, which is useful for setting goals and understanding where you stand nationally."),
    _s("Common questions from new IPF lifters",
       "New lifters often ask whether they need equipment to compete, whether they need to be strong to enter a meet, and how points are used. Classic lifting needs only a belt, sleeves, wrist wraps and a singlet, and many lifters compete without a belt. There is no minimum strength to enter most local meets. Points are used mainly for best-lifter awards and rankings; for most first-time lifters, the goal is simply to post a total and enjoy the day."),
]
EXTRA["sinclair-calculator"] += [
    _s("Sinclair and body weight changes",
       "Moving up a weight category usually increases a lifter's actual total but lowers their coefficient. The Sinclair total shows whether the trade-off was worthwhile. If the Sinclair total rises after moving up, the extra body weight added more strength than the coefficient took away. If it falls, the lifter may perform better in the lighter category. Many coaches use this check when deciding whether an athlete should change categories."),
]

EXTRA["wilks-calculator"] += [
    _s("Wilks for masters lifters",
       "Masters lifters, those aged 40 and over, often use Wilks alongside an age coefficient that adjusts for the natural decline in strength with age. Without the age adjustment, a 55-year-old lifter's Wilks score compares directly with younger lifters, which can understate their achievement. Many masters lifters track their own Wilks score year to year, which is meaningful regardless of age adjustments, and use it to see how training is slowing or reversing age-related strength loss."),
]
EXTRA["dots-calculator"] += [
    _s("DOTS for masters and juniors",
       "DOTS does not include age adjustments, so a 60-year-old and a 25-year-old with the same total and body weight receive the same score. In competition, age categories handle this, and some events apply separate age coefficients on top of DOTS for masters awards. For personal tracking, comparing your own score across years is meaningful at any age, and steady scores into later decades are a genuine achievement."),
    _s("Using DOTS to set realistic expectations",
       "Seeing where your score sits on the benchmark ranges helps set expectations. A lifter at 280 DOTS aiming for 450 within a year is likely to be disappointed, but aiming for 320 is ambitious and achievable for many. Setting goals in steps of 20 to 40 points per year for intermediate lifters keeps training focused and motivating without setting up frustration."),
]
EXTRA["wilks-dots-calculator"] += [
    _s("Scoring single lifts informally",
       "Both formulas are designed for full totals, but some lifters apply the same coefficient to a single lift to see which lift is relatively strongest. For example, multiplying each lift by the same coefficient shows how much each contributes to the score. This is not an official use, and single-lift scores cannot be compared with total-based scores, but it can help identify the lift with the most room to improve.",
       "For a more detailed look at each lift relative to body weight, the strength standards calculator ranks individual lifts from beginner to elite."),
]
EXTRA["ipf-gl-points-calculator"] += [
    _s("A sample progression across meets",
       ("table", ["Meet", "Body weight", "Total", "GL points (classic, men)"], [
           ["First meet", "88 kg", "560 kg", "about 75"],
           ["Six months later", "89 kg", "600 kg", "about 80"],
           ["One year later", "90 kg", "640 kg", "about 85"],
           ["Two years later", "92 kg", "700 kg", "about 92"],
       ]),
       "This kind of steady progress is realistic for a committed intermediate lifter. Each meet adds a few points, and over two years the lifter moves from a solid gym level to a regionally competitive one."),
    _s("Points and nutrition",
       "Strength responds to eating enough, and especially to eating enough protein, around 1.6 to 2.2 g per kg of body weight. Lifters who try to cut too much body weight before a meet often lose strength, which can lower points even if their body weight falls. A steady, moderate approach to body weight, with most of the effort on strength, usually produces the best long-term points."),
]
EXTRA["sinclair-calculator"] += [
    _s("Sinclair benchmarks by experience",
       "Rough Sinclair totals for men: beginners in their first year often score 180 to 250 kg, intermediate club lifters 250 to 330 kg, national-level competitors 350 kg and up, and international elite above 450 kg. For women, beginners often score 120 to 180 kg, club lifters 180 to 240 kg, national competitors around 260 kg and up, and international elite above 320 kg. These ranges are broad and vary between countries."),
    _s("Recovery and weightlifting",
       "Weightlifting is technically demanding, and fatigue quickly degrades technique. Many weightlifters train frequently but keep most sessions below maximal weights, saving heavy singles for selected days. Good sleep, adequate food and planned lighter weeks help lifters perform their best on the days that matter, which is reflected in higher totals and Sinclair scores."),
]

EXTRA["wilks-calculator"] += [
    _s("Scores are a snapshot",
       "A Wilks score reflects your total and body weight on one day. Sleep, food, stress and how well a meet goes all affect it. Look at the trend across several scores rather than reading too much into any single result."),
]
EXTRA["dots-calculator"] += [
    _s("Scores are a snapshot",
       "Any DOTS score reflects one day's lifting at one body weight. A poor night's sleep, a missed attempt or a slightly heavier weigh-in can move it by several points. Judge progress by the trend across several meets or training blocks, and celebrate steady improvement rather than chasing a single number."),
]
EXTRA["wilks-dots-calculator"] += [
    _s("Scores are a snapshot",
       "Both scores reflect one day's lifting at one body weight. A missed attempt, a poor night's sleep or a slightly heavier weigh-in can move them by several points. Look at the trend across several meets or training blocks rather than reading too much into a single result, and keep notes on the conditions so you can explain any surprises later."),
]
EXTRA["ipf-gl-points-calculator"] += [
    _s("What a points goal does not capture",
       "Points summarise performance on the day, but they leave out much of what makes a lifter successful: consistency across meets, attempt selection, technique under pressure and long-term health. A lifter who reliably goes nine for nine with steady totals may be better placed for long-term progress than one who posts an occasional big score with many misses. Use points as one useful measure among several.",
       "Recording attempts made and missed, how each lift felt and what you would change next time, alongside points, builds a much richer picture of your development as a lifter."),
    _s("Converting pounds for IPF calculations",
       "IPF competitions use kilograms, and the GL formula expects kilograms. If you train in pounds, the calculator converts both body weight and total before applying the formula. Be careful when estimating totals from gym lifts in pounds: rounding each lift separately can shift the total by a kilogram or two, which makes a small difference to points."),
]
EXTRA["sinclair-calculator"] += [
    _s("Scores are a snapshot",
       "A Sinclair total reflects one session or competition. Missed attempts, fatigue or a heavier weigh-in can change it noticeably. Track it across several competitions to see the real trend."),
]

EXTRA["dots-calculator"] += [_s("Sharing your score", "DOTS is widely understood in powerlifting communities, so it is a convenient number to share with training partners, coaches and online groups when discussing progress across different body weights.")]
EXTRA["wilks-dots-calculator"] += [_s("Sharing your scores", "When you share a score, say which formula it uses and whether the total came from a meet or the gym. That small detail prevents a lot of confusing comparisons.")]
EXTRA["ipf-gl-points-calculator"] += [_s("Sharing your points", "When you share a GL points score, include your division, sex and whether the total came from a meet or the gym. Those three details make the number meaningful to anyone reading it, and they make comparisons with other lifters fair.")]
EXTRA["sinclair-calculator"] += [_s("Sharing your total", "When sharing a Sinclair total, mention your body weight and whether the lifts came from a competition or training, so others can interpret it correctly.")]
