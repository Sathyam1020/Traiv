"""Extra original sections for Phase 3 batch A."""
from phase3_common import s

EXTRA = {
"bmi-calculator": [
    s("BMI and health risk",
      "Large population studies link both low and high BMI with higher risk of illness. At the upper end, risk of type 2 diabetes, high blood pressure, heart disease, some cancers, sleep apnoea and joint problems rises as BMI climbs, especially above 30. At the lower end, being underweight is linked with weaker bones, a less robust immune system, fertility problems and, in older adults, frailty.",
      "These are averages across many people. For one person, the risk attached to a given BMI depends heavily on where their fat sits, how fit they are, whether they smoke, their family history and their blood markers. A fit person at a BMI of 27 with a modest waist may be at lower risk than an inactive person at 23 with a large one. That is why doctors combine BMI with other checks rather than relying on it alone."),
    s("Setting a weight goal from your result",
      "If you want to change your weight, the healthy range for your height gives a broad frame, but the most useful first goal is usually smaller. For people carrying excess weight, losing 5 to 10% of current body weight brings measurable improvements in blood pressure, blood sugar and cholesterol, long before BMI reaches the healthy band.",
      "A pace of about 0.5 to 1% of body weight a week is sustainable for most people. For someone at 90 kg, that is roughly 0.45 to 0.9 kg a week. Faster loss is possible but tends to cost more muscle and is harder to maintain. Pair the scale with a waist measurement, so you can see fat coming off even in weeks when water hides it.",
      "If you are underweight, the aim is gradual gain with enough protein and some resistance training, so that new weight includes muscle. Unplanned weight loss, or difficulty gaining weight despite eating well, is worth raising with a doctor."),
    s("BMI at different stages of life",
      "The adult bands assume a fully grown body. In children and teenagers, BMI is converted to a percentile for their age and sex, because healthy proportions change as they grow. A BMI of 22 might be typical for one fifteen-year-old and high for a ten-year-old.",
      "In older adults, some research suggests that a BMI slightly above 25 is not linked with higher mortality and may even be protective, possibly because reserves help during illness. Muscle loss with age also means BMI says less about body fat later in life. Strength, walking speed and the ability to get up from a chair often tell a doctor more than the ratio does.",
      "During pregnancy BMI is not used to judge current weight. Clinicians use the pre-pregnancy BMI to guide how much weight gain is expected, which is a separate conversation with a midwife or doctor."),
],
"body-fat-calculator": [
    s("Why body fat matters for health",
      "Body fat is not simply stored energy. Fat tissue releases hormones and signalling molecules that affect appetite, blood sugar control and inflammation. A healthy amount supports hormone production, protects organs and keeps the body warm. Too little disrupts menstrual cycles, weakens bones and lowers resilience to illness. Too much, particularly around the abdomen, raises the risk of type 2 diabetes, heart disease and fatty liver.",
      "Where fat is stored matters as much as how much there is. Visceral fat, packed around the organs inside the abdomen, is the type most closely linked with metabolic disease. Subcutaneous fat under the skin of the hips and thighs carries less risk. A tape measurement at the waist picks up visceral fat in a way that a weight-based measure cannot, which is part of why circumference methods remain useful."),
    s("How body fat changes with age",
      "Body fat tends to rise with age even when weight stays the same, because muscle mass falls from around the age of 30 unless it is trained. For women, the menopause brings a shift of fat toward the abdomen. For men, fat around the middle often increases through middle age.",
      "Reference ranges that ignore age can therefore look harsher for older adults. A 55-year-old at 24% body fat is close to typical for his age group; the same figure in a 25-year-old sits higher within the average band. Resistance training and enough protein slow the loss of muscle, which keeps body fat lower for the same weight and supports strength and independence later in life."),
    s("Losing fat without losing muscle",
      "When people diet hard without training, a large share of the weight they lose can come from muscle. That makes the scale look good while body fat percentage barely moves. Three habits change the outcome:",
      ("ul", [
          "**Lift weights two to four times a week.** Training gives the body a reason to keep its muscle during a deficit.",
          "**Eat enough protein.** Around 1.6 to 2.2 g per kilogram of body weight a day is a common range for people trying to keep muscle while losing fat.",
          "**Keep the deficit moderate.** Aim for about 0.5 to 1% of body weight a week rather than the fastest possible loss.",
      ]),
      "Measured this way, a client might lose four kilograms over two months while body fat falls by three or four points. That is a far better result than losing six kilograms and keeping the same percentage."),
    s("Common measuring mistakes",
      ("ul", [
          "**Pulling the tape too tight.** The tape should sit flat on the skin without denting it.",
          "**Measuring over clothing.** Even a thin shirt adds width and lowers precision.",
          "**Holding the breath or sucking in.** Measure at the end of a normal, relaxed breath out.",
          "**Letting the tape tilt.** A tape that dips at the back reads longer. Use a mirror or a helper.",
          "**Changing the landmark.** For men, keep to the navel; for women, the narrowest point. Moving between them changes the result.",
          "**Measuring after a large meal or a workout.** Both temporarily change the waist reading.",
      ]),
      "Fixing these makes the estimate repeatable, which is what lets you trust a change from one month to the next."),
],
"navy-body-fat-calculator": [
    s("Using the result to set a target",
      "A body fat estimate becomes useful when it points to a goal you can reach and measure. Start from lean mass: if a 180 lb man at 17.5% has about 148.5 lb of lean mass and wants to reach 13%, divide 148.5 by 0.87 to get a target weight of about 171 lb, if lean mass holds steady. That is roughly 9 lb of fat to lose.",
      "At a pace of 0.5 to 1% of body weight a week, that is about two to three months of work. Writing it this way, as a target weight and a timeframe tied to a measurable lean mass, gives a coach and client something concrete to review, rather than a vague wish to get leaner.",
      "Check the target against the person's sport, health and life. Very low body fat is hard to sustain, can disrupt hormones and sleep, and is not required for most goals. For many people, moving from the average to the fitness range is the change that makes the most difference."),
    s("Measuring women accurately",
      "The women's equation uses three sites, so there is more room for small errors to add up. The hip measurement in particular varies with stance: feet together, weight on both feet and the tape level around the widest part of the buttocks. A partner or a mirror makes this much easier.",
      "Hormonal cycles can shift water retention by a kilogram or more, which can change the waist and hip readings slightly. Measuring at the same point in the cycle each month gives a cleaner comparison. After pregnancy, the hip and waist can take many months to settle, so treat estimates in that period as rough.",
      "Women's healthy ranges sit higher than men's for good reason. Essential fat supports reproductive and hormonal health, and a reading in the low teens for a woman is closer to an athletic extreme than a general target."),
    s("A worked tracking example",
      "Here is how a twelve-week fat loss phase might look for a man at 5 ft 10 in, measured every four weeks with the same tape and routine.",
      ("table", ["Week", "Weight", "Neck", "Waist", "Body fat", "Lean mass"], [["0", "180 lb", "15 in", "34 in", "17.5%", "148.5 lb"], ["4", "177 lb", "15 in", "33.25 in", "16.0%", "148.7 lb"], ["8", "174 lb", "15 in", "32.5 in", "14.4%", "148.9 lb"], ["12", "172 lb", "15 in", "32 in", "13.4%", "149.0 lb"]]),
      "The scale fell by eight pounds and the waist by two inches. Lean mass, calculated from the estimate, held steady and even edged up by half a pound, which is within measuring error. Read together, the numbers say that the loss was almost entirely fat, and that the training and protein targets were doing their job."),
    s("What the estimate cannot tell you",
      "A tape method gives a single whole-body percentage. It cannot show how much of your fat is visceral, whether you have lost bone density, how much water you are holding or where in the body muscle has changed. It also does not measure fitness, blood pressure or blood markers, which matter more for health than any body fat figure.",
      "Treat the result as a practical tracking tool. For a medical question, such as concerns about weight-related illness, a doctor will use their own measurements and tests."),
],
"_more": None,
}

MORE = {
"bmi-calculator": [
    s("Metric or imperial: the same answer",
      "BMI is defined in kilograms and metres. In pounds and inches, the formula multiplies by 703 to give the same number: weight in pounds divided by height in inches squared, times 703. For the 6 ft, 200 lb example, 200 divided by 5,184 is 0.0386, and multiplying by 703 gives 27.1, matching the metric result.",
      "The calculator handles the conversion when you switch units, carrying your height and weight across so you don't need to re-enter them. Rounding in the conversion can move the result by a tenth at most, which makes no difference to the category."),
],
"body-fat-calculator": [
    s("Body fat for athletes and lifters",
      "Athletes in different sports settle at very different body fat levels. Endurance runners and cyclists often sit low because extra mass costs energy over distance. Strength athletes, throwers and rugby forwards often carry more because mass helps them produce and absorb force. Neither is wrong; the right level depends on the demands of the sport.",
      "For lifters, the tape method's error grows when the neck is unusually thick from training. A heavily developed neck lowers the waist-minus-neck figure and can make the estimate read lean. If you train your neck or carry a lot of upper-body muscle, compare the tape with a scan once, then use the tape for trends.",
      "Very low body fat is a short-term state for most athletes, reached for a competition and then relaxed. Holding it year-round can affect hormones, sleep, mood and performance. A coach can help plan when to push lower and when to ease off."),
],
"navy-body-fat-calculator": [
    s("Why the neck is in the formula",
      "It can seem odd that the neck appears in a body fat equation. The neck acts as a stand-in for frame size and lean mass. A larger neck usually belongs to a larger, more muscular frame, which would carry a bigger waist even at the same body fat. Subtracting the neck from the waist adjusts for that, so a broad-framed person is not marked down simply for being big.",
      "Height plays a similar role. A tall person naturally has a longer torso and larger circumferences, so the height term lowers the estimate for a given waist. Together, the neck and height terms let the equations compare people of different builds on the same scale."),
    s("Frequently confused terms",
      ("ul", [
          "**Body fat percentage:** fat mass as a share of total body weight.",
          "**Fat mass:** the weight of the fat itself, in pounds or kilograms.",
          "**Lean body mass:** total weight minus fat mass, including muscle, bone, organs and water.",
          "**Fat-free mass:** often used as a synonym for lean body mass in calculators, though in research it excludes the small amount of essential lipid in cell membranes.",
          "**Skeletal muscle mass:** only the muscles attached to the skeleton, roughly half of lean mass for most adults.",
          "**Visceral fat:** fat stored around the internal organs. The tape method cannot measure it directly.",
      ]),
      "Keeping these straight helps when comparing results from different tools. A lean mass of 148 lb does not mean 148 lb of muscle; skeletal muscle would typically be closer to half of that figure."),
    s("Choosing how often to measure",
      "Fat changes slowly. Even a well-run fat loss phase removes only around half a kilogram to a kilogram of fat a week, which might move the waist by a few millimetres. Day-to-day variation from food, water and posture is often larger than that. Measuring daily therefore mostly records noise and can make progress look erratic.",
      "Every two weeks suits people in an active fat loss or muscle gain phase who want closer feedback. Every four weeks is enough for most people, and it pairs naturally with a monthly coaching review. Between measurements, a weekly average of morning weights fills in the picture."),
    s("For coaches: making the tape part of check-ins",
      "The Navy method suits remote coaching because clients can do it at home with a cheap tape. Send a short guide with the landmarks, ask for the raw measurements as well as the result, and request them on the same day of the month. Review the trend in each site, not only the percentage, because a falling waist with a steady neck is the clearest sign of fat loss.",
      "If a client's numbers jump in a way that does not match their weight or photos, ask how and where they measured before changing anything in the plan. Most surprises turn out to be a slipped landmark or a tape pulled tighter than usual."),
],
}

for k, v in MORE.items():
    EXTRA[k] = EXTRA[k] + v
EXTRA.pop("_more")

EXTRA["body-fat-calculator"] = EXTRA["body-fat-calculator"] + [
    s("Body fat, photos and the scale together",
      "No single measure tells the whole story. The scale moves fastest but mixes fat, muscle, water and food. Body fat estimates move slowly and carry a margin of error. Progress photos show changes in shape that numbers miss, such as a narrower waist or more definition in the shoulders.",
      "Used together, they correct one another. If the scale stalls for two weeks while the waist shrinks and the photos look leaner, fat is still coming off and water or muscle is masking it. If all three stall for a month, the plan probably needs adjusting. Take photos in the same light, pose and clothing each time so they can be compared fairly."),
]

EXTRA["navy-body-fat-calculator"] = EXTRA["navy-body-fat-calculator"] + [
    s("Navy estimate versus a DEXA scan",
      "DEXA, dual-energy X-ray absorptiometry, scans the body with two low-dose X-ray beams and separates fat, lean tissue and bone region by region. It is often treated as the practical reference in sports science, though it too has a margin of error of a point or two and is sensitive to hydration and the machine used.",
      "When people compare the two, the tape method tends to read a little high for lean, muscular men and a little low for people carrying more abdominal fat, though individual results vary in both directions. A useful approach is to get one DEXA scan, take tape measurements on the same morning, and note the gap. Later tape readings can then be read with that offset in mind, while you keep the low cost and convenience of measuring at home.",
      "A scan is not needed for most people. If the goal is to see whether fat is coming down, the tape measured consistently answers that question well."),
    s("Body fat and health targets",
      "For health rather than appearance, the most important shift is usually out of the above-average range. Moving a man from 28% to 22%, or a woman from 36% to 30%, typically comes with a smaller waist and improvements in blood pressure, blood sugar and cholesterol. Going from 15% to 10% changes how someone looks far more than it changes their health risk.",
      "Fitness, strength and activity matter alongside body fat. People who are physically fit tend to have lower health risk at every body fat level than those who are not. A coaching plan that builds regular training and better sleep often improves health faster than one focused on the percentage alone."),
]

EXTRA["navy-body-fat-calculator"] = EXTRA["navy-body-fat-calculator"] + [
    s("What to do with a high reading",
      "A reading in the above-average range is a starting point, not a verdict. Begin with the habits that move body fat steadily: regular resistance training, a modest calorie deficit, plenty of protein, daily walking and enough sleep. Re-measure in four weeks and look for the waist to come down.",
      "If the reading is high and you also have symptoms such as breathlessness, very high blood pressure or excessive thirst, or a family history of diabetes or heart disease, see a doctor before starting a demanding plan. They can check the markers a tape cannot."),
]
