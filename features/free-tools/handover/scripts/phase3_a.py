"""Phase 3 copy, batch A: BMI, body fat, US Navy body fat. Original prose (ADR 0036)."""
from phase3_common import base, emit, s
from phase3_a_extra import EXTRA

D = {}

D["bmi-calculator"] = base(
    "bmi-calculator",
    title="BMI calculator",
    h1="BMI calculator",
    description="Work out body mass index from height and weight in metric or imperial units, see the WHO category and the healthy weight range for your height.",
    intro="Enter your height and weight to get your body mass index, the WHO adult category it falls in and the weight range that counts as healthy for your height. Switch between centimetres and kilograms or feet, inches and pounds.",
    q="How is BMI calculated?",
    a="Divide weight in kilograms by height in metres squared. At 175 cm and 70 kg, height squared is 3.0625, and 70 divided by 3.0625 is 22.9: inside the healthy band of 18.5 to 24.9. For that height, the healthy band runs from about 57 to 76 kg.",
    sections=[
        s("What body mass index measures",
          "Body mass index is weight scaled for height. It answers a narrow question: is this person heavy or light for how tall they are? It does not know what the weight is made of. Two people with the same height and weight get the same BMI whether one carries a lot of muscle and the other a lot of fat. That limit is the main thing to understand before reading any result.",
          "The measure dates back to the nineteenth century, when the Belgian statistician Adolphe Quetelet noticed that, across adult populations, weight tended to rise with roughly the square of height. Researchers in the 1970s adopted his ratio as a quick way to sort large groups by size, and it became the standard screening measure because it needs nothing more than a scale and a tape.",
          "That history explains both its strength and its weakness. BMI is excellent for describing populations and spotting broad trends. It is far weaker for judging one person, because individuals vary in muscle, bone, fat distribution and build in ways that a ratio of two numbers cannot capture."),
        s("The WHO adult categories",
          "The World Health Organization uses four main bands for adults aged 20 and over. They apply to both sexes and are the categories this calculator reports.",
          ("table", ["BMI", "Category"], [["Below 18.5", "Underweight"], ["18.5 to 24.9", "Healthy weight"], ["25 to 29.9", "Overweight"], ["30 and above", "Obese"]]),
          "The obese band is often split further into classes I (30 to 34.9), II (35 to 39.9) and III (40 and above), which clinicians use when weighing treatment options. Some health bodies also suggest lower action points for people of South Asian, Chinese, Middle Eastern, Black African or African-Caribbean background, because risk of type 2 diabetes tends to rise at a lower BMI in those groups. If that applies to you, ask a doctor which thresholds they use.",
          "The bands are not designed for children and teenagers, whose BMI is read against age- and sex-specific growth charts instead. They are also less reliable in pregnancy, in older adults who have lost muscle, and in people with conditions that change fluid balance."),
        s("Working through an example",
          "Take someone who is 6 ft tall and weighs 200 lb. Converting to metric gives 182.9 cm and 90.7 kg. Height in metres squared is 1.829 × 1.829, which is about 3.345. Dividing 90.7 by 3.345 gives a BMI of 27.1, in the overweight band.",
          "The calculator also turns the healthy band back into weights for that height. Multiplying 3.345 by 18.5 and by 24.9 gives roughly 62 to 83 kg, or about 136 to 184 lb. That range is often more useful than the BMI itself, because it is expressed in a unit people already track.",
          "If the same person trained hard and carried a lot of muscle, the 27.1 might describe a lean, strong body rather than excess fat. This is where a waist measurement or a body fat estimate earns its place: it can tell you whether the extra weight sits around the middle, where it matters most for health."),
        s("Where BMI misleads",
          ("ul", [
              "**Muscular people.** Lifters, rugby players and many manual workers often score as overweight or obese with little body fat. BMI reads their muscle as excess weight.",
              "**Older adults.** Muscle declines with age. Someone can keep the same BMI for decades while losing muscle and gaining fat, so a stable number can hide a meaningful change.",
              "**Fat distribution.** Fat stored around the organs carries more health risk than fat on the hips and thighs. BMI cannot tell the two apart; waist-based measures can.",
              "**Very tall and very short people.** Because the formula squares height, it tends to overstate BMI for tall people and understate it for short people slightly.",
              "**Ethnic background.** Risk at a given BMI differs between populations, which is why some guidelines use lower cut-offs for certain groups.",
          ]),
          "None of this makes BMI useless. It is a reasonable first look, and at the extremes, very low or very high, it is a dependable signal that a conversation with a doctor is worthwhile. In the middle ranges, treat it as one data point to be read alongside others."),
        s("Measures that add context",
          "Waist circumference is the simplest addition. A waist-to-height ratio under 0.5, meaning a waist less than half your height, is a widely used guide that tracks abdominal fat better than BMI does. The waist-to-hip ratio is another option, with WHO thresholds of 0.90 for men and 0.85 for women.",
          "Body fat percentage, estimated with a tape measure method such as the US Navy formula, or measured with DEXA, bioimpedance or skinfold calipers, tells you what share of your weight is fat. For someone who trains, it is usually the more informative number. Lean mass and FFMI go further and describe how much muscle a person carries for their height.",
          "Health markers matter more than any of these: blood pressure, blood sugar, cholesterol, fitness and how well someone sleeps and moves. A doctor can check them. Body size measures are useful because they are cheap and repeatable, not because they replace a medical assessment."),
        s("How to measure accurately",
          "Weigh yourself in the morning, after using the toilet and before eating, in light clothing or none. Use the same scale on a hard, flat floor each time. Measure height without shoes, standing straight against a wall with heels together, and mark the top of your head with a flat object held level.",
          "Weight moves by a kilogram or more across a day and from one day to the next, mostly from water, food and salt. A single weigh-in can therefore shift BMI by a few tenths without any real change. Averaging several morning weights across a week gives a steadier figure to put into the calculator.",
          "Recalculate every few weeks rather than every day. If you are working toward a weight goal, the healthy range shown for your height is a broad reference, not a precise target; where inside it you feel and perform best is an individual question."),
    ],
    faq=[
        ("What is a healthy BMI for adults?", "The WHO healthy band is 18.5 to 24.9 for adults of both sexes. Some guidelines use lower action points for people of certain ethnic backgrounds, so ask a doctor which thresholds suit you."),
        ("Is BMI accurate for people who lift weights?", "Often not. BMI cannot separate muscle from fat, so muscular people regularly score as overweight. A waist measurement or body fat estimate gives a better picture for them."),
        ("Is BMI the same for men and women?", "The adult formula and categories are the same for both. At the same BMI, women typically carry more body fat than men, which is one reason body fat percentage uses separate ranges."),
        ("Can children use this BMI calculator?", "No. Children's and teenagers' BMI must be read against age- and sex-specific growth charts. Use a paediatric calculator or ask a health professional."),
        ("Why does my BMI change from day to day?", "Body weight swings with water, food and salt intake. Weigh in the morning under the same conditions and average a week of readings for a steadier result."),
        ("What should I do if my BMI is outside the healthy range?", "Treat it as a prompt, not a diagnosis. Check your waist measurement and talk to a doctor, who can look at blood pressure, blood sugar and other markers before suggesting any change."),
    ],
    nxt=[("Body fat calculator", "/tools/body-fat-calculator"), ("Waist-to-height ratio calculator", "/tools/waist-to-height-ratio-calculator"), ("Ideal weight calculator", "/tools/ideal-weight-calculator")],
    disclaimer="General information only, not medical advice. BMI is a screening measure and does not diagnose any condition. Speak to a doctor about your weight and health.",
)

NAVY_HOW = [
    s("How the US Navy method works",
      "The US Navy method estimates body fat from a few tape measurements and your height. It was developed by Hodgdon and Beckett at the Naval Health Research Center in 1984, who measured sailors with underwater weighing, then the reference method, and found which circumferences best predicted the result. The aim was a test that any recruiter could run with a tape measure in a couple of minutes.",
      "The equations work on logarithms of the measurements. For men, the key term is waist minus neck: a larger waist relative to the neck suggests more abdominal fat. For women, the hip is added to the waist before the neck is subtracted, because women store more fat on the hips and thighs. In each case, a taller frame lowers the estimate for the same circumferences.",
      ("ul", [
          "**Men:** %BF = 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76",
          "**Women:** %BF = 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387",
      ]),
      "These are the inch forms of the equations. The calculator converts centimetres to inches before applying them, so you can measure in either unit."),
    s("Where to put the tape",
      "Accuracy depends far more on where and how you measure than on the formula. Use a flexible, non-stretch tape, measure on bare skin, and keep the tape level and snug without pressing into the skin.",
      ("ul", [
          "**Neck:** just below the larynx (Adam's apple), with the tape angled slightly down toward the front. Look straight ahead and keep your shoulders relaxed rather than shrugged.",
          "**Waist, men:** horizontally at the level of the navel, at the end of a normal breath out. Do not pull the stomach in.",
          "**Waist, women:** at the narrowest point of the torso, usually a little above the navel, again after a normal breath out.",
          "**Hip, women only:** around the widest part of the buttocks, with feet together.",
          "**Height:** without shoes, standing straight against a wall.",
      ]),
      "Repeat every site at least twice and work from the mean. If two readings differ by more than about half a centimetre, measure again. Having someone else hold the tape helps, especially for the hip."),
    s("Reading your result",
      "The calculator places your estimate in the American Council on Exercise categories, which are among the most widely used reference ranges.",
      ("table", ["Category", "Men", "Women"], [["Essential fat", "2 to 5%", "10 to 13%"], ["Athletes", "6 to 13%", "14 to 20%"], ["Fitness", "14 to 17%", "21 to 24%"], ["Average", "18 to 24%", "25 to 31%"], ["Above average", "25% and above", "32% and above"]]),
      "Women carry more essential fat than men, linked to hormonal and reproductive function, so every band sits higher. Essential fat is the minimum the body needs to function; sitting near it for long periods is not a healthy goal for most people.",
      "These categories are descriptions, not targets. Many people feel and perform well in the fitness or average ranges, and the right place for someone depends on their sport, health, age and what they can sustain."),
]

NAVY_ACC = [
    s("How accurate is a tape measure estimate?",
      "Against laboratory reference methods, the Navy equations are usually off by no more than three or four points for most adults. That is similar to a good consumer bioimpedance scale and less precise than DEXA. Error grows at the extremes: very lean, very muscular and very heavy people tend to see larger gaps.",
      "The bigger source of error is usually the measuring itself. Placing the waist tape two centimetres higher or lower, or pulling it tighter, can shift the estimate by a couple of points on its own. That is why a consistent routine matters more than the absolute number.",
      "For tracking change, the method does well. If you measure the same way each time, a falling waist with a steady neck reliably reflects fat loss, even if the absolute percentage is a few points off. Use the trend across several weeks rather than any single reading."),
    s("Comparing body fat methods",
      ("table", ["Method", "What it needs", "Typical use"], [["Tape measure (US Navy)", "A tape and two minutes", "Home tracking, coaching check-ins"], ["Skinfold calipers", "Calipers and a trained tester", "Gyms and sports teams"], ["Bioimpedance scale", "A smart scale", "Daily home readings, sensitive to hydration"], ["DEXA scan", "A clinic visit", "Detailed reference measurement"], ["Underwater weighing", "A specialist lab", "Research"]]),
      "No method is perfect, and they rarely agree to the decimal. Pick one, use it consistently, and compare a reading only with earlier readings from the same method. Switching from a scale to a tape to a scan and comparing the numbers mostly measures the difference between the methods."),
]

D["body-fat-calculator"] = base(
    "body-fat-calculator",
    title="Body fat calculator",
    h1="Body fat calculator",
    description="Estimate body fat percentage with the US Navy tape-measure method. Enter height, neck and waist (plus hip for women) in inches or centimetres.",
    intro="Estimate your body fat percentage with nothing more than a tape measure. Enter your sex, height, neck and waist, plus your hip if you are a woman, and see where the result sits against common reference ranges.",
    q="How do I calculate body fat percentage at home?",
    a="Measure your neck and waist (and hip, for women), then apply the US Navy equations. A man who is 5 ft 10 in with a 15 in neck and 34 in waist comes out at about 17.5%, in the fitness range for men. The calculator does the logarithms for you.",
    sections=NAVY_HOW + NAVY_ACC + [
        s("Body fat versus BMI",
          "BMI looks only at height and weight, so it cannot tell muscle from fat. Body fat percentage describes what your weight is made of. Two people at 80 kg and the same height can have very different body fat, and therefore very different health and performance pictures.",
          "For anyone who trains, body fat is usually the more useful measure. It shows whether a change on the scale came from fat, from muscle or from water, and it stops a muscular person being told they are overweight when they are not."),
        s("Changing your body fat",
          "Fat loss comes from a sustained energy deficit, supported by enough protein and some form of resistance training to protect muscle. A loss of around 0.5 to 1% of body weight a week is a common, sustainable pace. Faster than that tends to cost more muscle and is harder to keep up.",
          "Measure every two to four weeks under the same conditions: morning, before eating, same tape, same landmarks. Expect the trend to wobble; water and food in the gut can move the waist reading by a centimetre from day to day."),
    ],
    faq=[
        ("Is the US Navy body fat method accurate?", "For most people it lands within about three to four percentage points of lab methods. Consistent measuring matters more than the formula, and it is reliable for tracking change over time."),
        ("Why do women need a hip measurement?", "Women tend to store more fat on the hips and thighs, so the women's equation adds the hip to the waist. Without it the estimate would miss much of that fat."),
        ("What is a healthy body fat percentage?", "Common ranges are about 14 to 24% for men and 21 to 31% for women. Where someone feels and performs best depends on their sport, age and health."),
        ("Should I measure in inches or centimetres?", "Either works. The calculator converts centimetres to inches before applying the original equations, so the result is the same."),
        ("Why did my body fat go up when I lost weight?", "Small shifts are usually measuring error or water. Check you measured at the same landmarks and time of day, and look at the trend across a few weeks."),
        ("Can I use this if I am very muscular?", "You can, but expect a larger margin of error at the extremes. A DEXA scan gives a better reference reading if you need one."),
    ],
    nxt=[("Navy body fat calculator", "/tools/navy-body-fat-calculator"), ("Lean body mass calculator", "/tools/lean-body-mass-calculator"), ("BMI calculator", "/tools/bmi-calculator")],
    disclaimer="General information only, not medical advice. Tape-measure estimates have a margin of error. Speak to a doctor about your weight and health.",
)

D["navy-body-fat-calculator"] = base(
    "navy-body-fat-calculator",
    title="US Navy body fat calculator",
    h1="US Navy body fat calculator",
    description="Estimate body fat with the US Navy circumference method. Add your weight to see fat mass and lean mass in pounds or kilograms.",
    intro="Run the US Navy circumference method with a tape measure: height, neck and waist, plus hip for women. Add your weight if you want the result split into fat mass and lean mass.",
    q="How does the US Navy body fat calculator work?",
    a=["It applies the Hodgdon and Beckett equations to your height and tape measurements. A man at 5 ft 10 in with a 15 in neck and a 34 in waist gets about 17.5%. A woman at 5 ft 5 in with a 13 in neck, 30 in waist and 38 in hip gets about 28.6%.",
       "If you enter weight, the calculator multiplies it by the percentage to give fat mass, and the remainder is lean mass."],
    sections=NAVY_HOW + [
        s("Fat mass and lean mass from the same tape",
          "A percentage on its own can be hard to act on. Adding your weight turns it into two quantities you can track: fat mass, the weight of the fat itself, and lean mass, everything else, including muscle, bone, organs and water.",
          "Take the man in the example above at 180 lb. At 17.5% body fat, fat mass is about 31.5 lb and lean mass about 148.5 lb. If, eight weeks later, he weighs 174 lb at 15%, fat mass has dropped to about 26 lb while lean mass sits near 148 lb. The scale shows six pounds lost; the split shows that almost all of it was fat, which is what a well-run fat loss phase aims for.",
          "Lean mass also feeds other calculations. Katch-McArdle BMR and protein targets set per kilogram of lean mass both start from it, so a reasonable estimate makes those numbers more personal than ones based on total weight."),
        s("The method's place in the military",
          "The US armed forces have used circumference methods for decades to check that service members meet body composition standards. Each branch sets its own maximum body fat by age and sex, and the tape test is the usual way to check it when someone exceeds the weight-for-height screening table.",
          "In 2023 the US Army moved to a simpler one-site abdominal tape equation for most soldiers, and other branches have reviewed their methods. The two- and three-site equations on this page remain the most widely known version and the one most civilian calculators use."),
    ] + NAVY_ACC + [
        s("Making your readings consistent",
          ("ol", [
              "Measure first thing in the morning, after using the toilet and before eating or drinking much.",
              "Use the same flexible tape every time and keep it level all the way round.",
              "Measure on bare skin, with relaxed posture and a normal breath out.",
              "Take each site two or three times and average the readings.",
              "Record the numbers, not only the percentage, so you can see which site changed.",
              "Repeat every two to four weeks, not daily.",
          ]),
          "Keeping the raw circumferences is worth the small effort. If the estimate moves, you can see whether the waist came down, the neck went up or a measurement slipped. That makes the trend easier to trust and the coaching conversation more specific."),
        s("When the number looks wrong",
          "If an estimate seems far from what you expect, check the inputs before the body. A waist measured at the narrowest point rather than the navel, for a man, will read low. A neck measured too high, under the jaw, will also lower the result. Entering centimetres while the unit is set to inches produces nonsense, and the calculator will usually refuse a waist smaller than the neck.",
          "Some people are simply outliers. Those with a very muscular neck, a large rib cage or an unusual fat distribution can get estimates several points away from a scan. If the tape says one thing and a DEXA scan says another, trust the scan for the absolute number and keep using the tape for the trend."),
    ],
    faq=[
        ("What measurements does the US Navy calculator need?", "Height, neck and waist for men; height, neck, waist and hip for women. Weight is optional and only used to split the result into fat mass and lean mass."),
        ("How accurate is the Navy body fat formula?", "It usually lands within about three to four percentage points of lab methods for most people, with larger errors for very lean, very muscular or very heavy people."),
        ("Where exactly should I measure my waist?", "Men measure horizontally at the navel. Women measure at the narrowest point of the torso. In both cases measure after a normal breath out, without pulling the stomach in."),
        ("Why does the formula use logarithms?", "Body fat does not rise in a straight line with circumference. The log terms let the equations fit the curved relationship Hodgdon and Beckett found in their data."),
        ("What is lean mass in the result?", "Everything that is not fat: muscle, bone, organs, connective tissue and water. It is not the same as muscle mass."),
        ("Is this the test the military uses?", "It is the long-standing two- and three-site Navy method. Branches set their own limits and some have since adopted different tape equations."),
        ("How often should I measure?", "Every two to four weeks, in the morning and under the same conditions. Daily readings mostly track water and food, not fat."),
        ("Can I compare this with my smart scale?", "Not directly. Different methods give different numbers. Compare each method only with its own earlier readings."),
        ("Can I use an AI assistant to plan from my result?", "Yes, to organise questions for your coach or doctor. Include the raw measurements, the method and its margin of error, and ask it not to treat the estimate as exact."),
    ],
    prompt=dict(
        heading="Use your result with ChatGPT",
        when="Once you have measured carefully and calculated your estimate.",
        paste="Paste your measurements, your result and your goal.",
        text="I estimated my body fat with the US Navy tape method. Sex: [sex]. Height: [height]. Neck: [neck]. Waist: [waist]. Hip (if female): [hip]. Weight: [weight]. Estimate: [percent] body fat, with fat mass [fat] and lean mass [lean]. My goal is [goal] and I currently train [training]. Explain what this estimate does and does not tell me, given a typical error of three to four percentage points. Suggest a sensible measuring routine and three questions to discuss with my coach. Do not give me a calorie target without asking about my eating and activity first.",
    ),
    nxt=[("Body fat calculator", "/tools/body-fat-calculator"), ("Lean body mass calculator", "/tools/lean-body-mass-calculator"), ("FFMI calculator", "/tools/ffmi-calculator")],
    disclaimer="General information only, not medical advice. Tape-measure estimates have a margin of error. Speak to a doctor about your weight and health.",
)

for k, v in EXTRA.items():
    D[k]["sections"] = D[k]["sections"] + v
emit(D)
