import type { ToolCopy } from "../types";

/*
 * Original copy, written for Traiv (ADR 0036). Facts about Traiv in `pitch` come from
 * `content/features.ts` (nutrition): daily calorie and macro targets, diet plans built
 * from recipes, clients logging food, coaches reviewing logs.
 */

export const copy: ToolCopy = {
  title: "TDEE Calculator: Maintenance, Cut and Bulk Calories (2026)",
  description:
    "Free TDEE calculator. Get maintenance calories from Mifflin-St Jeor BMR and your activity level, plus a cut and a bulk target. Imperial or metric.",
  eyebrow: "Free tool · Nutrition",
  h1: "TDEE calculator",
  intro: (
    <p>
      Total daily energy expenditure is the number of calories a body burns in a day, all in. This
      calculator estimates it from age, sex, height, weight and how active the person is, using the
      Mifflin-St Jeor equation, and turns it into three starting targets: one to lose, one to hold
      and one to gain.
    </p>
  ),
  method: "Mifflin-St Jeor BMR × activity factor",
  sources: [
    {
      label:
        "Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr, 1990.",
      href: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
    },
    {
      label:
        "Frankenfield D, Roth-Yousey L, Compher C. Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults: a systematic review. J Am Diet Assoc, 2005.",
      href: "https://pubmed.ncbi.nlm.nih.gov/15883556/",
    },
  ],
  shortAnswer: {
    question: "What is TDEE, in one paragraph?",
    answer: (
      <>
        <p>
          TDEE is resting metabolic rate plus everything a person does on top of it: walking,
          training, fidgeting and digesting food. Work out the resting rate (BMR) with Mifflin-St
          Jeor, then multiply it by an activity factor between 1.2 for a desk-bound week and 1.9 for
          hard training on top of a physical job.
        </p>
        <p>
          For a 30-year-old man who is 5 ft 10 in, weighs 170 lb and trains three to five times a
          week, that comes to a BMR of about 1,737 kcal and a TDEE of about 2,693 kcal. Eating 500
          below that is a sensible place to start a cut, and 300 above it a sensible place to start
          a lean bulk.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the number is worked out",
      body: (
        <>
          <p>
            There are two steps, and the calculator shows both so the result can be checked by hand.
          </p>
          <p>
            <strong>Step one: resting rate.</strong> Mifflin-St Jeor predicts the calories burned at
            complete rest from weight in kilograms, height in centimetres and age in years:
          </p>
          <ul>
            <li>
              Men: <code>10 × weight + 6.25 × height − 5 × age + 5</code>
            </li>
            <li>
              Women: <code>10 × weight + 6.25 × height − 5 × age − 161</code>
            </li>
          </ul>
          <p>
            <strong>Step two: movement.</strong> Multiply the resting rate by the activity factor
            that fits the person's normal week. The result is TDEE: the intake at which weight
            should stay roughly where it is.
          </p>
          <p>
            Imperial inputs are converted before anything else: pounds × 0.4536 for kilograms, and
            total inches × 2.54 for centimetres. The calculator keeps the exact figures and rounds
            only the final result, so switching between imperial and metric never changes the
            answer.
          </p>
          <p>
            <strong>Why Mifflin-St Jeor and not Harris-Benedict?</strong> When the American Dietetic
            Association compared the common equations against measured resting rates, Mifflin-St
            Jeor landed within 10% for more people than any of the others. Harris-Benedict dates
            from 1919 and tends to run high for today's less active adults. Neither one is exact:
            roughly one person in three falls outside 10% whichever equation you use, which is why
            the result is a starting point and not a verdict.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing the activity factor",
      body: (
        <>
          <p>
            The factor matters more than any other input. Moving one step up the scale on a 1,700
            kcal resting rate adds about 300 kcal a day, which is more than most deficits are made
            of.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Factor</th>
                  <th scope="col">Level</th>
                  <th scope="col">A typical week</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1.2</td>
                  <td>Sedentary</td>
                  <td>Desk job, a car commute, no planned exercise</td>
                </tr>
                <tr>
                  <td>1.375</td>
                  <td>Light</td>
                  <td>One to three short sessions, or a lot of walking</td>
                </tr>
                <tr>
                  <td>1.55</td>
                  <td>Moderate</td>
                  <td>Three to five proper training sessions</td>
                </tr>
                <tr>
                  <td>1.725</td>
                  <td>Very active</td>
                  <td>Training six or seven days, or a job on your feet plus training</td>
                </tr>
                <tr>
                  <td>1.9</td>
                  <td>Extra active</td>
                  <td>Hard daily training on top of manual work</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These multipliers come from the long-standing Harris-Benedict activity scale, and they
            are the same ones almost every calculator uses. People nearly always pick a level too
            high: they count the sessions they plan, not the ones they did, and forget that an hour
            of training sits inside a day of sitting.{" "}
            <strong>When two levels both seem to fit, choose the lower one</strong> and let the
            scale say otherwise.
          </p>
        </>
      ),
    },
    {
      heading: "Reading the three targets",
      body: (
        <>
          <p>
            <strong>Cut: TDEE − 500.</strong> A daily gap of about 500 kcal works out to roughly
            3,500 kcal a week, which has long been used as a rule of thumb for half a kilo (about a
            pound) of loss. Real loss slows as the body gets smaller and adapts, so expect the first
            weeks to move faster than the later ones.
          </p>
          <p>
            <strong>Maintain: TDEE.</strong> Useful after a diet, during a busy period, or as the
            baseline for a body recomposition phase where protein and training do most of the work.
          </p>
          <p>
            <strong>Bulk: TDEE + 300.</strong> A small surplus. Bigger surpluses add fat faster than
            they add muscle, especially for anyone past their first year of training.
          </p>
          <p>
            None of these should take an adult below their resting rate for long. If the cut number
            lands close to or under the BMR shown in the working, the deficit is too aggressive for
            that person.
          </p>
        </>
      ),
    },
    {
      heading: "Three worked examples",
      body: (
        <>
          <p>
            The same two steps give very different answers for different people. These three are
            worked through in full so you can see where each number comes from, and where the cut
            target needs a second look.
          </p>
          <p>
            <strong>A 35-year-old woman, 165 cm, 68 kg, light activity.</strong> Resting rate: 10 ×
            68 + 6.25 × 165 − 5 × 35 − 161 = 1,375 kcal. Multiply by 1.375 for light activity and
            her TDEE is about 1,891 kcal. A 500 kcal cut would put her at 1,391, barely above her
            resting rate. For her, a 300 kcal gap (about 1,590) is the better place to start. It is
            slower on paper and far easier to keep up.
          </p>
          <p>
            <strong>A 45-year-old man, 180 cm, 95 kg, desk job.</strong> Resting rate: 10 × 95 +
            6.25 × 180 − 5 × 45 + 5 = 1,855 kcal. At the sedentary factor of 1.2 his TDEE is about
            2,226. Here the standard cut lands at 1,726, which is <em>below</em> his resting rate.
            The answer is not a bigger deficit. It is more movement: a daily walk that lifts him to
            the light factor adds roughly 325 kcal of expenditure and lets him eat more while still
            losing.
          </p>
          <p>
            <strong>A 24-year-old woman, 5 ft 4 in, 130 lb, training six days a week.</strong> In
            metric that is 162.6 cm and 59 kg. Resting rate: about 1,325 kcal. At 1.725 her TDEE is
            about 2,285. If her goal is performance rather than weight loss, maintenance is the
            number to plan around, and protein and carbohydrate matter more than the calorie total.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Person</th>
                  <th scope="col">BMR</th>
                  <th scope="col">Factor</th>
                  <th scope="col">TDEE</th>
                  <th scope="col">Cut (−500)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Woman, 35, 165 cm, 68 kg</td>
                  <td>1,375</td>
                  <td>1.375</td>
                  <td>1,891</td>
                  <td>1,391 (too close to BMR)</td>
                </tr>
                <tr>
                  <td>Man, 45, 180 cm, 95 kg</td>
                  <td>1,855</td>
                  <td>1.2</td>
                  <td>2,226</td>
                  <td>1,726 (below BMR)</td>
                </tr>
                <tr>
                  <td>Woman, 24, 5 ft 4 in, 130 lb</td>
                  <td>1,325</td>
                  <td>1.725</td>
                  <td>2,285</td>
                  <td>1,785</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "Why the first week on the scale won't match the maths",
      body: (
        <>
          <p>
            Someone who starts a 500 kcal deficit and loses 2 kg in the first week has not found a
            better formula. Most of that drop is water. Stored carbohydrate (glycogen) holds roughly
            three grams of water for every gram, and the first days of eating less, especially less
            carbohydrate, empty some of that store.
          </p>
          <p>
            The reverse happens too. A heavy training week, a salty meal, a poor night's sleep or
            the days before a period can each add a kilo that has nothing to do with fat. That is
            why a single weigh-in tells you almost nothing and a weekly average tells you a lot.
          </p>
          <ul>
            <li>
              Weigh on waking, after the toilet, before food or drink, on most days of the week.
            </li>
            <li>Compare this week's average with last week's, never one morning with another.</li>
            <li>Ignore the first week of any new target. Judge it from week two onward.</li>
          </ul>
        </>
      ),
    },
    {
      heading: "Adjusting the target from real weigh-ins",
      body: (
        <>
          <p>
            The formula gets you close. Two weeks of honest data gets you the rest of the way. Once
            the first week has settled, compare weekly averages and adjust in small steps:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">What the weekly average does</th>
                  <th scope="col">What to change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lose fat</td>
                  <td>Drops 0.5 to 1% of body weight a week</td>
                  <td>Nothing. The target is working.</td>
                </tr>
                <tr>
                  <td>Lose fat</td>
                  <td>Flat for two weeks running</td>
                  <td>Take off 100 to 200 kcal, or add daily steps</td>
                </tr>
                <tr>
                  <td>Lose fat</td>
                  <td>Drops more than 1% a week after week two</td>
                  <td>Add 100 to 200 kcal back</td>
                </tr>
                <tr>
                  <td>Maintain</td>
                  <td>Moves less than 0.5 kg either way over a month</td>
                  <td>Nothing</td>
                </tr>
                <tr>
                  <td>Gain</td>
                  <td>Rises 0.25 to 0.5% a week</td>
                  <td>Nothing</td>
                </tr>
                <tr>
                  <td>Gain</td>
                  <td>Flat for two weeks</td>
                  <td>Add 100 to 150 kcal</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Before cutting calories, check that the intake is what you think it is. A missed cooking
            oil, weekend meals out and liquid calories account for more stalls than a slow
            metabolism does.
          </p>
        </>
      ),
    },
    {
      heading: "When the estimate tends to run high or low",
      body: (
        <>
          <p>
            Mifflin-St Jeor was built from measurements of ordinary adults, so it is least reliable
            for people who are not ordinary in one of a few specific ways:
          </p>
          <ul>
            <li>
              <strong>Very lean or very muscular people</strong> usually burn more than predicted,
              because the equation sees only weight, not what that weight is made of. If body fat is
              known with reasonable confidence, the Katch-McArdle equation, which works from lean
              mass, is a useful cross-check.
            </li>
            <li>
              <strong>People carrying a lot of body fat</strong> can be overestimated slightly,
              because fat tissue burns less than the same weight of muscle.
            </li>
            <li>
              <strong>Older adults</strong> often move less outside training than they think, so the
              activity factor, not the BMR, is where the error comes from.
            </li>
            <li>
              <strong>Anyone after a long diet</strong> may run a little below prediction for a
              while, as the body moves less and spends less without anyone noticing.
            </li>
          </ul>
          <p>
            The biggest single variable is everyday movement outside the gym: walking, standing,
            taking the stairs. Between two people of the same size it can differ by several hundred
            calories a day, which is why daily steps are worth tracking alongside weight.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes with TDEE",
      body: (
        <ul>
          <li>
            <strong>Counting planned sessions as done ones.</strong> Pick the activity level from
            the last month, not from next month's plan.
          </li>
          <li>
            <strong>Adding exercise calories back on top.</strong> The activity factor already
            includes training. Eating back a fitness tracker's estimate counts it twice.
          </li>
          <li>
            <strong>Never recalculating.</strong> After 10 lb or 4 to 5 kg of change, the old number
            is out of date.
          </li>
          <li>
            <strong>Treating a deficit as a race.</strong> A bigger gap brings more hunger, worse
            training and a higher chance of giving up in week four. Steady beats fast for almost
            everyone.
          </li>
          <li>
            <strong>Judging it in week one.</strong> Water moves first. Give any new target two
            weeks before deciding it is wrong.
          </li>
        </ul>
      ),
    },
    {
      heading: "TDEE, fitness trackers and calorie apps",
      body: (
        <>
          <p>
            Watches and phone apps also estimate daily burn, and their number rarely matches this
            one. They are measuring something slightly different, in a slightly different way, and
            neither is the truth.
          </p>
          <ul>
            <li>
              <strong>A tracker estimates movement from heart rate and motion.</strong> It is good
              at noticing that Tuesday was busier than Monday and weaker at the absolute number.
              Studies of wrist devices regularly find energy estimates off by 20 percent or more,
              usually on the high side.
            </li>
            <li>
              <strong>This calculator estimates a typical day from a formula.</strong> It has no
              idea what happened yesterday, but it does not drift with a loose strap or a hot room.
            </li>
            <li>
              <strong>Calorie apps often add exercise on top of a baseline.</strong> If that
              baseline already includes an activity level, logged workouts get counted twice and the
              "calories left" figure grows to match.
            </li>
          </ul>
          <p>
            The practical answer is to pick one estimate, eat to it consistently for two weeks, and
            let the scale settle the argument. A tracker is most useful for its trend: if daily
            steps fall by half over a month, expenditure has fallen too, whatever the absolute
            number says.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Turn the estimate into a plan with a built-in check",
    whenToUse:
      "After you have a TDEE and want a starting target, a protein figure and a simple rule for when to adjust.",
    pasteIn:
      "Your TDEE, goal, weight, training days and how many weeks you want to run this phase.",
    text: `I'm a coach setting up a nutrition phase for a client.

TDEE from a Mifflin-St Jeor calculator: [TDEE] kcal/day
Client: [age], [sex], [weight], trains [days] days a week
Goal: [lose fat / maintain / gain muscle] over [weeks] weeks

1. Suggest a daily calorie target and explain the size of the deficit or surplus.
2. Give a daily protein target in grams, with the per-kg or per-lb figure you used.
3. Write a two-week check: what average weight change would mean the target is right, too high or too low, and how many calories to adjust by in each case.
4. List anything about this client that would make you want a doctor or dietitian involved first.`,
  },
  forCoaches: {
    heading: "Using TDEE with a client",
    body: (
      <>
        <p>
          A calculator gives you a first guess. What makes it a good target is the next fortnight of
          weigh-ins. Set the client's intake from the calculated number, ask for a weigh-in on most
          mornings, and compare the two-week average with the week before it. If the average moves
          the way the target predicts, the estimate was close. If it doesn't, adjust by 100 to 200
          kcal and look again in two weeks.
        </p>
        <p>
          Writing the number down with how you got it saves an argument later. When a client asks
          why their target is 2,190 and not 2,500, "BMR 1,737 × 1.55, minus 500" is an answer they
          can follow. "The app said so" is not.
        </p>
        <p>
          Recalculate after every 4 to 5 kg (about 10 lb) of change. A smaller body burns less, and
          the target that worked at the start of a cut will be a maintenance number by the end of
          it.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set this target for a client, and see what they actually eat",
    body: (
      <p>
        In Traiv you set each client's daily calories and their protein, carbohydrate and fat split,
        build their diet plan from recipes, and see the food they log against it. When the two-week
        average says the target was off, you change it in one place.
      </p>
    ),
  },
  next: [
    { label: "Split these calories into protein, carbs and fat", href: "/tools/macro-calculator" },
    { label: "Plan a deficit with a goal date", href: "/tools/calorie-deficit-calculator" },
  ],
  nextPitch: "Coaching clients on this? Traiv keeps each client's targets and food logs together.",
  faq: [
    {
      q: "What does TDEE stand for?",
      a: "Total daily energy expenditure: every calorie the body uses in a day, including resting metabolism, digestion, daily movement and exercise.",
    },
    {
      q: "Is TDEE the same as BMR?",
      a: "No. BMR is the resting part only, what the body burns lying still. TDEE is BMR multiplied by an activity factor, so it is always higher. For most people BMR is 55 to 75 percent of TDEE.",
    },
    {
      q: "How accurate is this calculator?",
      a: "Mifflin-St Jeor predicts resting rate within about 10 percent for most adults, but around one person in three falls outside that, and the activity factor adds its own error. Treat the result as a starting estimate and check it against two to three weeks of weigh-ins.",
    },
    {
      q: "Should I eat my TDEE to lose weight?",
      a: "No. Eating at TDEE should hold weight steady. To lose weight, eat below it; a 500 kcal gap a day is a common starting point, which this calculator shows as the cut target.",
    },
    {
      q: "Which activity level should I pick if I train but sit all day?",
      a: "Usually light or moderate rather than very active. An hour in the gym sits inside a day that is mostly sitting. If two levels both seem to fit, pick the lower one and adjust after a couple of weeks.",
    },
    {
      q: "Does muscle change my TDEE?",
      a: "Yes, but less than people expect. Muscle burns more than fat at rest, though only by a few calories per kilo a day. Mifflin-St Jeor does not ask for body fat, so very lean or very muscular people may find their real TDEE runs a little higher than the estimate.",
    },
    {
      q: "How often should TDEE be recalculated?",
      a: "After every 4 to 5 kg (about 10 lb) of weight change, or when training volume changes for more than a few weeks. A smaller body burns less, so a cut target slowly turns into maintenance.",
    },
    {
      q: "Can I use this for a teenager or during pregnancy?",
      a: "The calculator accepts ages from 14, but growing teenagers and pregnant or breastfeeding women have different energy needs. Their intake should be set with a doctor or registered dietitian, not from a formula.",
    },
  ],
  disclaimer: (
    <p>
      This calculator gives general information, not medical advice. It does not know anyone's
      medical history. If you are pregnant, breastfeeding, under 18, managing a medical condition or
      have a history of disordered eating, talk to a doctor or registered dietitian before changing
      what you eat.
    </p>
  ),
  keepGoing: [
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "BMR calculator", href: "/tools/bmr-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Your clients' targets, plans and food logs in one place",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
