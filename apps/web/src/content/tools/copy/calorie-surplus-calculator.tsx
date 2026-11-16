import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Calorie Surplus Calculator: Calories to Build Muscle",
  description:
    "Calorie surplus calculator. Get maintenance, a daily target for lean, standard or aggressive gain, a protein range and a date to reach your goal weight.",
  eyebrow: "Free tool · Nutrition",
  h1: "Calorie surplus calculator",
  intro: (
    <p>
      To build muscle efficiently, most people need to eat a little more than they burn. This
      calculator estimates your maintenance calories, adds a surplus of the size you choose, gives
      you a daily protein range, and, if you enter a goal weight, the earliest date you could reach
      it.
    </p>
  ),
  shortAnswer: {
    question: "How big should a calorie surplus be?",
    answer: (
      <>
        <p>
          For most people who train, a surplus of about 200 to 400 kcal a day is enough to support
          muscle gain without adding much fat. Beginners can push toward the top of that range;
          experienced lifters gain muscle slowly and do better near the bottom.
        </p>
        <p>
          Aim for weight gain of roughly 0.25 to 0.5 percent of body weight a week, and pair the
          surplus with 1.6 to 2.2 g of protein per kg of body weight and a training programme that
          keeps getting harder.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator works",
      body: (
        <>
          <ol>
            <li>
              <strong>Maintenance:</strong> your resting rate from the Mifflin-St Jeor equation,
              times your activity factor.
            </li>
            <li>
              <strong>Surplus:</strong> one of three fixed sizes, added to maintenance.
            </li>
            <li>
              <strong>Protein:</strong> a range of 1.6 to 2.2 g per kg of body weight, the range
              supported by most research on muscle gain.
            </li>
            <li>
              <strong>Goal date:</strong> if you add a goal weight above your current one, the time
              to get there if all of the surplus were stored, at 7,700 kcal per kg. In practice it
              usually takes longer.
            </li>
          </ol>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Surplus</th>
                  <th scope="col">Daily extra</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lean gain</td>
                  <td>+200 kcal</td>
                  <td>Intermediate and advanced lifters; anyone who wants minimal fat gain</td>
                </tr>
                <tr>
                  <td>Standard</td>
                  <td>+375 kcal</td>
                  <td>Most people, especially in their first two years of training</td>
                </tr>
                <tr>
                  <td>Aggressive</td>
                  <td>+550 kcal</td>
                  <td>Very lean beginners, hard gainers, and people with very high activity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "How fast can you actually build muscle?",
      body: (
        <>
          <p>
            Muscle is built slowly, and the rate falls with training experience. Rough, commonly
            used estimates for men training well (women typically gain about half as much in
            absolute terms, a similar proportion of their size):
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Training age</th>
                  <th scope="col">Muscle gain per month</th>
                  <th scope="col">Per year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>First year</td>
                  <td>0.5 to 1 kg</td>
                  <td>6 to 10 kg</td>
                </tr>
                <tr>
                  <td>Second year</td>
                  <td>0.25 to 0.5 kg</td>
                  <td>3 to 5 kg</td>
                </tr>
                <tr>
                  <td>Third year</td>
                  <td>About 0.25 kg</td>
                  <td>2 to 3 kg</td>
                </tr>
                <tr>
                  <td>After that</td>
                  <td>Very little</td>
                  <td>0.5 to 1 kg</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Any weight gained faster than this is mostly fat and water. That is why a bigger surplus
            does not mean more muscle past a point; it means a longer cut afterward.
          </p>
        </>
      ),
    },
    {
      heading: "Where the surplus goes",
      body: (
        <>
          <p>
            Not all of a surplus becomes body tissue. Some of it is burned: eating more raises the
            energy used to digest food, and many people move a little more without noticing when
            they are well fed. What is stored is a mix of muscle, fat, glycogen and water.
          </p>
          <p>
            That is why the goal date in the results is a best case. If you are gaining more slowly
            than it suggests but the scale is still going up at 0.25 to 0.5 percent a week, the
            surplus is doing its job.
          </p>
        </>
      ),
    },
    {
      heading: "Adjusting the surplus from the scale",
      body: (
        <>
          <p>Weigh most mornings, average each week, and compare months rather than days:</p>
          <ul>
            <li>
              <strong>Gaining 0.25 to 0.5 percent of body weight a week:</strong> on target.
            </li>
            <li>
              <strong>Flat for three or more weeks:</strong> add 100 to 150 kcal a day.
            </li>
            <li>
              <strong>Gaining more than about 0.75 percent a week after the first month:</strong>{" "}
              reduce by 100 to 150 kcal. Fast gain is mostly fat for anyone past their first year.
            </li>
            <li>
              <strong>Waist growing quickly while lifts stall:</strong> the surplus is too big or
              the training is not progressing; fix the training first.
            </li>
          </ul>
          <p>
            Expect a jump of 0.5 to 1.5 kg in the first week or two as stored carbohydrate and water
            increase. That is not fat.
          </p>
        </>
      ),
    },
    {
      heading: "A surplus only works with the right training",
      body: (
        <>
          <p>
            Extra calories give the body the material to build; training gives it the reason.
            Without a programme that pushes the muscles progressively, a surplus mostly becomes fat.
            What matters most:
          </p>
          <ul>
            <li>Train each muscle group at least twice a week.</li>
            <li>Take most sets close to failure, within one to three reps of it.</li>
            <li>Add weight or reps over time and track them.</li>
            <li>Sleep seven to nine hours; muscle is built in recovery.</li>
          </ul>
        </>
      ),
    },
    {
      heading: "When eating enough is the hard part",
      body: (
        <>
          <p>
            Some people struggle more to eat a surplus than others do to eat a deficit. Practical
            fixes:
          </p>
          <ul>
            <li>
              Add calorie-dense foods to meals you already eat: oil on vegetables, nut butter on
              oats, cheese on eggs.
            </li>
            <li>Drink some calories: milk, smoothies with oats and fruit.</li>
            <li>Eat one more meal or snack a day rather than making every meal bigger.</li>
            <li>
              Choose fewer high-fibre, high-volume foods at main meals if fullness is the problem.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A 25-year-old woman, 165 cm and 58 kg, trains with weights four times a week and wants
            to build muscle, aiming for 62 kg:
          </p>
          <ol>
            <li>Resting rate: 10 × 58 + 6.25 × 165 − 5 × 25 − 161 = 1,325 kcal.</li>
            <li>Maintenance at the moderate factor: 1,325 × 1.55 = about 2,054 kcal.</li>
            <li>Lean surplus: +200 kcal, for a target of about 2,254 kcal a day.</li>
            <li>Protein: 1.6 to 2.2 g per kg, which is 93 to 128 g a day.</li>
            <li>
              Best-case timeline: 200 × 7 ÷ 7,700 = 0.18 kg a week, so 4 kg takes at least 22 weeks.
              In reality, closer to six to nine months is more likely, and a good share of the gain
              will be muscle if training is strong.
            </li>
          </ol>
          <p>
            For a smaller person, a lean surplus is the right default. A standard 375 kcal surplus
            would be about 18 percent above her maintenance, which for most women past their first
            year of training means more fat than muscle.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking progress beyond the scale",
      body: (
        <>
          <p>
            In a gaining phase, the scale tells you whether the surplus is real, but not what you
            are gaining. Add these to get a fuller picture:
          </p>
          <ul>
            <li>
              <strong>Strength.</strong> Log three or four key lifts. If weight is going up and the
              lifts are too, much of the gain is useful tissue.
            </li>
            <li>
              <strong>Waist measurement.</strong> Taken at the navel, in the morning, once a week. A
              waist that grows faster than the scale suggests the surplus is too large.
            </li>
            <li>
              <strong>Other measurements.</strong> Chest, upper arm and thigh grow with muscle.
            </li>
            <li>
              <strong>Photos.</strong> Same light, same time of day, every four weeks. Small changes
              are easier to see side by side than in the mirror.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Women and muscle gain",
      body: (
        <>
          <p>
            Women build muscle in response to training at a similar rate relative to their size as
            men, but from a lower starting point and in smaller absolute amounts. Two practical
            differences follow:
          </p>
          <ul>
            <li>
              <strong>Smaller surpluses.</strong> Because maintenance is usually lower, a fixed 375
              or 550 kcal surplus is a much larger percentage. The lean option is the better
              starting point for most women.
            </li>
            <li>
              <strong>More scale noise.</strong> Water shifts across the menstrual cycle can be 1 to
              2 kg, so compare the same week of the cycle month to month where possible.
            </li>
          </ul>
          <p>
            Fears about getting bulky are rarely realistic. Gaining a noticeable amount of muscle
            takes years of deliberate training and eating; it does not happen by accident.
          </p>
        </>
      ),
    },
    {
      heading: "Gaining when you are new to training",
      body: (
        <>
          <p>
            In the first year of lifting, the body responds so strongly that diet details matter
            less. Beginners who eat enough protein can build muscle at maintenance, and many with
            some body fat can do it while slowly losing fat. That is often called body
            recomposition.
          </p>
          <p>
            If you are new, you may not need a deliberate surplus at all. Start at maintenance with
            high protein, train consistently for three months, and add a surplus if your weight and
            strength both stall. If you are very lean and find it hard to gain, the standard surplus
            is a good starting point.
          </p>
        </>
      ),
    },
    {
      heading: "Surplus foods that are easy to eat",
      body: (
        <>
          <p>
            Hitting a surplus is easier with foods that add calories without adding much volume. A
            few that fit into ordinary meals:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Food</th>
                  <th scope="col">Portion</th>
                  <th scope="col">Roughly adds</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Olive oil</td>
                  <td>1 tablespoon</td>
                  <td>120 kcal</td>
                </tr>
                <tr>
                  <td>Peanut butter</td>
                  <td>2 tablespoons</td>
                  <td>190 kcal</td>
                </tr>
                <tr>
                  <td>Whole milk</td>
                  <td>300 ml</td>
                  <td>190 kcal, 10 g protein</td>
                </tr>
                <tr>
                  <td>Mixed nuts</td>
                  <td>30 g</td>
                  <td>180 kcal</td>
                </tr>
                <tr>
                  <td>Rolled oats</td>
                  <td>50 g dry</td>
                  <td>190 kcal</td>
                </tr>
                <tr>
                  <td>Dried fruit</td>
                  <td>40 g</td>
                  <td>120 kcal</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Adding one of these to two meals a day is a standard surplus without eating a single
            extra meal.
          </p>
        </>
      ),
    },
    {
      heading: "Why a small surplus beats a large one for most people",
      body: (
        <>
          <p>
            It is tempting to think that if a little extra food builds a little muscle, a lot of
            extra food builds a lot. The body does not work that way. Muscle protein synthesis, the
            process that adds new muscle tissue, is driven by training and supported by protein.
            Once there is enough energy and protein available, adding more calories does not make
            the process run faster. The extra energy has to go somewhere, and fat tissue is where
            the body puts it.
          </p>
          <p>
            That means the size of the surplus mainly decides how much fat you gain alongside the
            muscle. A beginner, whose muscles respond strongly to training, can make good use of a
            larger surplus. Someone with three or four years of training behind them builds muscle
            slowly whatever they eat, so a large surplus mostly becomes fat that has to be dieted
            off later. Every kilogram of unnecessary fat gained is several weeks of dieting added to
            the next cut.
          </p>
          <p>
            A smaller surplus also has a practical advantage: it is easier to eat. Many people find
            2,800 kcal of food a day manageable and 3,300 kcal a chore. A plan that you can follow
            without forcing food down will run for longer, and the length of the gaining phase
            matters more than its intensity.
          </p>
        </>
      ),
    },
    {
      heading: "What happens when you stop the surplus",
      body: (
        <>
          <p>
            At the end of a gaining phase, most people move to maintenance for a few weeks or start
            a short fat-loss phase. Either way, the scale usually drops by a kilogram or so in the
            first week as food volume and stored water come down. That is not muscle being lost.
            Muscle built through training is kept as long as you keep training and eat enough
            protein, even at a slight deficit.
          </p>
          <p>
            Taking a few weeks at maintenance before cutting is worth it for most people. It shows
            you your new maintenance level, which will be higher than before because you are heavier
            and carry more muscle, and it gives you a calm period to judge how much of the gain you
            want to keep. Moving straight from a surplus into a hard deficit makes it difficult to
            tell what the gaining phase actually achieved.
          </p>
        </>
      ),
    },
    {
      heading: "If you have a lot of body fat",
      body: (
        <p>
          A surplus is not always the right tool. If your main goal is to look and feel leaner, and
          you carry a fair amount of body fat, a modest deficit with high protein and good training
          often builds muscle and loses fat at the same time, particularly in your first year of
          lifting. Starting with a surplus in that situation adds fat you will need to lose before
          the muscle underneath shows. A common guide is to reach roughly 15 percent body fat for
          men or 25 percent for women before beginning a deliberate gaining phase, but treat that as
          a rough signpost rather than a rule. How you feel, how you perform and what you want
          matter as much as any number.
        </p>
      ),
    },
    {
      heading: "How the activity level affects your surplus",
      body: (
        <>
          <p>
            Because the surplus is added on top of maintenance, choosing the right activity level
            matters as much in a gaining phase as in a diet. If you choose a level that is too high,
            maintenance is overstated and the target may really be a small surplus or none at all,
            so weight stays flat for weeks. If you choose too low a level, the real surplus is
            bigger than intended and fat gain comes faster than you planned.
          </p>
          <p>
            The best approach is the same as for any target: choose the level that matches your last
            month, not your plans, and then let the first three weeks of weigh-ins guide
            adjustments. If you start a new training programme that adds a lot of volume, or take up
            a sport alongside lifting, recalculate with a higher activity level so the surplus keeps
            pace with what you are actually burning.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes in a gaining phase",
      body: (
        <>
          <p>
            The most frequent mistake is treating the surplus as permission to eat anything in any
            amount. A planned surplus of 375 kcal can easily become 1,000 kcal on days without
            structure, and those days add up to far more fat than muscle. A second is never
            adjusting: as you gain weight, your maintenance rises, so a surplus that worked at the
            start may shrink to almost nothing after a few months. A third is ignoring training.
            Without a programme that steadily asks more of the muscles, extra food has nowhere
            useful to go. Keeping meals planned, recalculating every few kilograms and tracking
            lifts as carefully as weight avoids all three.
          </p>
        </>
      ),
    },
    {
      heading: "How long it takes to see results",
      body: (
        <>
          <p>
            Muscle gain is slow enough that it is hard to see from week to week, which can make a
            gaining phase feel unrewarding at first. The scale will move first, partly from water
            and stored carbohydrate. Strength usually follows within a few weeks, as better-fed
            muscles handle more training. Visible changes in the mirror often take two to three
            months to become obvious, and they are easier to see in photos taken a month or more
            apart than in daily glances.
          </p>
          <p>
            Patience is part of the plan. A gaining phase that runs for four to six months with a
            steady, modest surplus and consistent training will usually produce noticeable results.
            One that is abandoned after six weeks because nothing seems to be happening will not.
            Measuring a few lifts and body measurements each month gives you evidence that progress
            is happening before it shows in the mirror.
          </p>
        </>
      ),
    },
    {
      heading: "Surplus and sleep, stress and recovery",
      body: (
        <>
          <p>
            Eating more only builds muscle if the body has the chance to recover and adapt. Short
            sleep, high stress and too little rest between hard sessions all reduce how much of a
            surplus goes into muscle and increase how much is stored as fat. Research on sleep
            restriction has found that people sleeping around five and a half hours a night lost a
            larger share of lean mass during a diet than those sleeping eight and a half hours, and
            the same principle applies when trying to gain. Aim for seven to nine hours of sleep,
            plan at least one or two full rest days each week, and treat recovery as part of the
            programme rather than an optional extra.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing between this calculator and the bulking calculator",
      body: (
        <>
          <p>
            This calculator starts from your body measurements and activity level, estimates
            maintenance for you, and adds a fixed surplus in calories. It suits people who do not
            yet know their maintenance and want a single sensible number to begin with. The bulking
            calorie calculator starts from a maintenance figure you already know, perhaps from weeks
            of tracking, and sizes the surplus as a percentage of it, so the extra scales with your
            size and activity.
          </p>
          <p>
            If you have tracked your intake and weight for a few weeks and know your true
            maintenance, the bulking calculator will usually give a more accurate target. If you are
            starting fresh, use this one first, run it for three or four weeks, and then switch to
            the bulking calculator with the maintenance figure your own data has confirmed. Both
            lead to the same place: a modest surplus, adjusted from the weekly trend.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using surpluses with clients",
    body: (
      <>
        <p>
          Set expectations before the first weigh-in. Clients who have spent years trying to lose
          weight can find a rising scale stressful, even when it is the plan. Show them the expected
          rate, explain the early water gain, and agree what you will track besides weight, such as
          lifts and a few measurements.
        </p>
        <p>
          Review the surplus monthly, not weekly. Muscle gain is slow, and reacting to every weekly
          wobble leads to constant adjustments that make the data harder to read.
        </p>
        <p>
          Plan how long the phase lasts and what comes next, whether that is maintenance or a short
          cut. A gaining phase without an end point tends to drift into fat gain.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set the surplus and track the gain",
    body: (
      <p>
        In Traiv you set each client's daily calories and macro targets, build their diet plan from
        recipes, and review their food log, so you can see whether a slow gain is the surplus or the
        eating.
      </p>
    ),
  },
  next: [
    { label: "Plan a bulk from your maintenance", href: "/tools/bulking-calorie-calculator" },
    { label: "Set your daily protein", href: "/tools/protein-calculator" },
  ],
  nextPitch: "Coaching muscle gain? Traiv keeps each client's targets and food logs together.",
  faq: [
    {
      q: "What is a calorie surplus?",
      a: "Eating more calories than your body uses in a day. The extra energy is stored, and with resistance training and enough protein, part of it is used to build muscle.",
    },
    {
      q: "Do I need a surplus to build muscle?",
      a: "Not always. Beginners, people returning to training and those with more body fat can build muscle at maintenance or even in a small deficit. For lean and experienced lifters, a modest surplus makes progress much easier.",
    },
    {
      q: "How much weight should I gain per week?",
      a: "About 0.25 to 0.5 percent of body weight a week for most people. Beginners can gain toward the top of that range; experienced lifters toward the bottom.",
    },
    {
      q: "Will a bigger surplus build muscle faster?",
      a: "Only up to a point. Muscle growth is limited by training and recovery, so past a modest surplus the extra mostly becomes fat.",
    },
    {
      q: "How much protein do I need in a surplus?",
      a: "About 1.6 to 2.2 g per kg of body weight a day. In a surplus, the lower half of that range is usually enough, because extra calories also spare protein.",
    },
    {
      q: "Why did I gain so much in the first week?",
      a: "More food in the gut and refilled glycogen stores, which hold water. An early jump of 0.5 to 1.5 kg is normal and is not fat.",
    },
    {
      q: "How long should a gaining phase last?",
      a: "Often three to six months, long enough to gain measurable muscle, followed by maintenance or a short fat-loss phase if needed.",
    },
    {
      q: "Is the goal date accurate?",
      a: "It is a best case that assumes every surplus calorie is stored. Real gain is usually slower, because some of the surplus is burned through digestion and extra movement.",
    },
  ],
  disclaimer: (
    <p>
      This calculator gives general information, not medical advice. If you are under 18, pregnant,
      managing a medical condition or have a history of disordered eating, talk to a doctor or
      registered dietitian before changing what you eat.
    </p>
  ),
  keepGoing: [
    { label: "Bulking calorie calculator", href: "/tools/bulking-calorie-calculator" },
    { label: "Protein calculator", href: "/tools/protein-calculator" },
    { label: "Maintenance calorie calculator", href: "/tools/maintenance-calorie-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Muscle-gain phases, planned and tracked",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
