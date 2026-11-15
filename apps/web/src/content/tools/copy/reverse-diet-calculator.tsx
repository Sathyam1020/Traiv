import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Reverse Diet Calculator: Week-by-Week Schedule",
  description:
    "Free reverse diet calculator. Build a weekly schedule to raise calories from your diet level back to maintenance in steps of 50 to 150 kcal.",
  eyebrow: "Free tool · Nutrition",
  h1: "Reverse diet calculator",
  intro: (
    <>
      <p>
        Reverse dieting means raising calories gradually after a diet instead of jumping straight
        back to maintenance. Enter where you are now, where you are heading and how fast you want to
        step up, and this calculator lays out a week-by-week schedule with a protein target to go
        with it.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How does a reverse diet work?",
    answer: (
      <>
        <p>
          Add a small, fixed amount of calories each week, usually 50 to 150 kcal, until you reach
          your maintenance level. Going from 1,500 to 2,100 kcal at 75 kcal a week takes eight
          weeks.
        </p>
        <p>
          The aim is to let hunger, energy and training recover while keeping the scale reasonably
          stable and avoiding the rebound that often follows a diet. Protein stays high throughout.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the schedule is built",
      body: (
        <>
          <p>
            The calculator takes the gap between your current intake and maintenance, divides it by
            your weekly step, and rounds up to whole weeks. Each week adds one step, and the last
            week lands exactly on maintenance so you never overshoot. Protein is set at 1.8 g per kg
            of body weight.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Step size</th>
                  <th scope="col">1,500 → 2,100 kcal</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>50 kcal/week</td>
                  <td>12 weeks</td>
                  <td>Very cautious; small bodies; long or aggressive diets</td>
                </tr>
                <tr>
                  <td>75 kcal/week</td>
                  <td>8 weeks</td>
                  <td>A balanced default for most</td>
                </tr>
                <tr>
                  <td>100 kcal/week</td>
                  <td>6 weeks</td>
                  <td>Moderate diets; people keen to eat more</td>
                </tr>
                <tr>
                  <td>150 kcal/week</td>
                  <td>4 weeks</td>
                  <td>Short diets; larger, active people</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "What reverse dieting can and cannot do",
      body: (
        <>
          <p>
            Reverse dieting is sometimes promoted as a way to 'repair' metabolism or raise
            maintenance above where it was before a diet. The evidence for that is weak. After a
            diet, some metabolic adaptation does occur: people burn slightly less than their new
            weight predicts, mostly because they move less without noticing. That adaptation largely
            recovers as calories return to maintenance, whether quickly or slowly.
          </p>
          <p>
            What a gradual increase does well is behavioural. It gives you time to adjust to eating
            more, keeps the habits and structure from the diet in place, and reduces the risk that a
            sudden end to restriction turns into weeks of overeating. For many people that alone is
            worth the extra weeks.
          </p>
          <p>
            If you have only dieted for a short time or with a small deficit, there is little need
            to reverse slowly. Moving to maintenance in one or two steps is fine.
          </p>
        </>
      ),
    },
    {
      heading: "What to expect on the scale",
      body: (
        <>
          <p>
            Weight usually rises by 1 to 2 kg in the first couple of weeks as stored carbohydrate
            and the water held with it return, and as more food sits in the gut. That is not fat
            gain. After that, weight should settle. If the weekly average keeps climbing by more
            than about 0.5 kg a week for two weeks in a row, hold your current intake for an extra
            week before taking the next step. That is a sign you have reached your real maintenance
            earlier than the estimate.
          </p>
        </>
      ),
    },
    {
      heading: "Where to add the calories",
      body: (
        <>
          <p>
            Keep protein steady and add most of the new calories as carbohydrate, especially around
            training. Carbohydrate tends to bring the clearest improvements in energy and workout
            quality after a diet. Add some fat too, so meals feel more satisfying, but measure it,
            because small additions of oils and spreads can add up faster than planned.
          </p>
        </>
      ),
    },
    {
      heading: "Finding your maintenance target",
      body: (
        <>
          <p>
            The maintenance figure you enter is an estimate. Use the maintenance or TDEE calculator
            at your current, lower weight, not your weight before the diet. If you tracked carefully
            during the diet, you can also work it out from your data: the intake at which your
            weight was falling, plus the deficit implied by your rate of loss. Your true maintenance
            may turn out a little lower than either estimate in the first weeks after a long diet,
            which is why the hold-a-week rule matters.
          </p>
        </>
      ),
    },
    {
      heading: "Reverse dieting after a competition",
      body: (
        <>
          <p>
            Physique athletes often finish a contest preparation at very low body fat and on low
            calories after months of dieting. Hunger is high, energy is low and the temptation to
            eat everything at once is strong. A structured reverse helps manage that transition, but
            for very lean athletes a faster return toward maintenance is often recommended, because
            staying in a large deficit longer than necessary prolongs the physical and psychological
            effects of the diet.
          </p>
          <p>
            A common approach is a larger first step, for example raising calories by 300 to 500
            kcal in the first week to relieve the most severe hunger, followed by smaller weekly
            steps until maintenance is reached. Some weight regain toward a healthier off-season
            level is expected and appropriate.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing between reversing and a direct return",
      body: (
        <>
          <p>
            There is no single right answer. A direct return to maintenance is quicker and avoids
            weeks of eating below maintenance after the diet has ended, which some researchers argue
            is preferable for recovery. A gradual reverse gives more control and may suit people who
            worry about regaining or who have a history of overeating after diets.
          </p>
          <p>
            A sensible middle ground is to make the first step larger, covering half or more of the
            gap, and then reverse the remainder gradually. That relieves hunger quickly while still
            giving structure to the final approach to maintenance. Whichever you choose, recalculate
            maintenance at your new weight and judge success by the weekly average over a month.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping training consistent",
      body: (
        <>
          <p>
            Training matters as much as food during a reverse. Keep lifting with the same intensity,
            and expect sessions to feel better as carbohydrate returns. Strength often improves
            noticeably in the first few weeks after a diet, which is a good sign that the extra food
            is being used well. If you reduced training volume during the diet, the reverse is a
            good time to build it back up gradually.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking during a reverse",
      body: (
        <>
          <p>
            Keep tracking intake and weight throughout the reverse, even if you plan to stop
            afterward. The data shows you where your real maintenance sits, which is valuable
            information for the future. Many people are surprised to find their maintenance is
            higher than they assumed during the diet, especially if their activity and training have
            increased. Once you reach maintenance and your weight has been stable for a few weeks,
            you can loosen tracking with confidence.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A woman finishes a 14-week diet at 1,450 kcal a day and 62 kg. Her estimated maintenance
            at the new weight is about 2,000 kcal. She chooses steps of 75 kcal a week:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Week</th>
                  <th scope="col">Calories</th>
                  <th scope="col">What she watches</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>1,525</td>
                  <td>Expect 0.5 to 1 kg of water; ignore it</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>1,600</td>
                  <td>Energy and training improve</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>1,675</td>
                  <td>Weekly average should settle</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>1,750</td>
                  <td>Hunger noticeably lower</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>1,825</td>
                  <td>Check average is stable</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>1,900</td>
                  <td>Hold here if weight is rising quickly</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>1,975</td>
                  <td>Near maintenance</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>2,000</td>
                  <td>Maintenance; stay here for a few weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            If her weekly average climbs more than about 0.5 kg in a week after week three, she
            holds the current step for another week before continuing.
          </p>
        </>
      ),
    },
    {
      heading: "Life after the reverse",
      body: (
        <>
          <p>
            Reaching maintenance is the beginning of the next phase, not the end. Spend at least a
            few weeks there before deciding what comes next, whether that is another fat-loss phase,
            a muscle-building phase or simply maintaining. Many people find that this period of
            stable eating and good training is when they feel and look their best, because the extra
            food improves training quality and energy while body fat stays low.
          </p>
        </>
      ),
    },
    {
      heading: "Why the end of a diet is risky",
      body: (
        <>
          <p>
            Studies of weight-loss programmes consistently find that much of the weight lost is
            regained within a few years, and the period immediately after a diet is when much of
            that regain begins. Several things combine: hunger hormones are elevated, the body burns
            slightly less than before, the structure that supported the diet disappears, and the
            motivation that drove it fades. Without a plan, intake often overshoots maintenance by a
            wide margin, and weight returns quickly.
          </p>
          <p>
            A reverse diet addresses the last two problems directly by keeping structure in place
            and giving intake a clear destination. It does not remove hunger or adaptation, but it
            gives you a framework for handling them while they settle, which is why many coaches use
            it even though its metabolic benefits are modest.
          </p>
        </>
      ),
    },
    {
      heading: "How reverse dieting fits with long-term maintenance",
      body: (
        <>
          <p>
            Once you reach maintenance, the skills that make long-term maintenance work become the
            focus: regular weigh-ins with a clear rule for when to act, a stable pattern of meals
            for most days, continued strength training and plenty of daily activity. Treat the
            reverse as a bridge to those habits rather than a separate phase with its own rules.
          </p>
        </>
      ),
    },
    {
      heading: "Signs it is time to move faster or slower",
      body: (
        <>
          <p>
            Move faster if hunger is still intense several weeks into the reverse, training is
            struggling, sleep is poor, or your weekly average weight is falling even as calories
            rise, which suggests you are still well below maintenance. Larger steps of 150 to 200
            kcal are fine in that situation.
          </p>
          <p>
            Move more slowly if your weekly average weight is rising by more than 0.5 kg a week
            after the first two weeks, if you feel uncomfortably full, or if you are anxious about
            regaining weight and a gentler pace helps you feel in control. Holding a step for an
            extra week costs little and gives the body time to settle.
          </p>
          <p>
            There is no prize for following the schedule exactly. It is a guide to keep the process
            structured, and the best schedule is the one that gets you to a stable, sustainable
            maintenance with your training, energy and relationship with food intact.
          </p>
        </>
      ),
    },
    {
      heading: "Reverse dieting for people who have dieted for years",
      body: (
        <>
          <p>
            Some people have been in a deficit, on and off, for years, and are not sure what their
            true maintenance even is. For them, a reverse diet can be a way to rediscover it.
            Increasing intake gradually while tracking weight shows where weight begins to
            stabilise, and that level is often higher than expected once training and daily activity
            are accounted for. Finding it can be a relief, because it reveals that sustainable
            eating involves more food than years of dieting suggested.
          </p>
          <p>
            This process can feel uncomfortable at first for people who are used to restriction.
            Working with a coach or dietitian who can provide reassurance and perspective helps, as
            does focusing on measures other than weight, such as energy, training performance, sleep
            and mood.
          </p>
        </>
      ),
    },
    {
      heading: "Protein during a reverse",
      body: (
        <>
          <p>
            The calculator sets protein at 1.8 g per kg of body weight, a little lower than many
            fat-loss targets but still well within the range that supports muscle. As calories rise,
            protein can stay the same while carbohydrate and fat absorb the increases. There is no
            need to raise protein further, because extra calories themselves help protect muscle
            once you are out of a deficit.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring success",
      body: (
        <>
          <p>
            A reverse diet has worked when you are eating at or near maintenance, your weekly
            average weight has settled within a kilogram or so of where it was at the end of the
            diet, training feels strong and hunger is manageable. Those four signs together mean you
            have a stable base to build from, whatever your next goal is.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using reverse diets with clients",
    body: (
      <>
        <p>
          Plan the reverse before the diet ends. Clients are far more likely to stick to a
          structured return to maintenance if they know it is coming and why, rather than having it
          introduced the day they hit their goal.
        </p>
        <p>
          Frame the first-week weight gain in advance. A client who expects 1 to 2 kg of water will
          not panic; a client who does not may start restricting again.
        </p>
        <p>
          Use check-ins to decide each step. If energy, hunger and the weekly average are all
          stable, take the next step. If weight is climbing quickly, hold. The schedule is a guide,
          not a contract.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Step targets up week by week, and watch the trend",
    body: (
      <>
        <p>
          In Traiv you set each client's daily calories and protein, carbohydrate and fat targets,
          build their diet plan from recipes, and see the food they log against those targets.
        </p>
      </>
    ),
  },
  next: [
    { label: "Find your maintenance calories", href: "/tools/maintenance-calorie-calculator" },
    { label: "Plan refeed days during a diet", href: "/tools/refeed-day-calculator" },
  ],
  nextPitch: "Coaching clients after a diet? Traiv keeps targets and food logs together.",
  faq: [
    {
      q: "What is a reverse diet?",
      a: "A planned, gradual increase in calories after a diet, usually 50 to 150 kcal a week, until you reach maintenance.",
    },
    {
      q: "Does reverse dieting speed up your metabolism?",
      a: "Not beyond its normal level. It allows the small slowdown from dieting to recover while keeping eating structured, but evidence that it raises metabolism above normal is weak.",
    },
    {
      q: "How fast should I increase calories?",
      a: "75 to 100 kcal a week suits most people. Go slower after a long or aggressive diet, faster after a short one.",
    },
    {
      q: "Will I gain weight during a reverse diet?",
      a: "Expect 1 to 2 kg early on from glycogen and water. After that, weight should be fairly stable if you are not exceeding maintenance.",
    },
    {
      q: "Do I need to reverse diet?",
      a: "Not always. After a short or moderate diet, moving to maintenance in one or two steps is fine. A gradual approach helps most after long diets or for people who tend to overeat when restriction ends.",
    },
    {
      q: "What if my weight keeps going up?",
      a: "Hold your current intake for an extra week. If the weekly average still rises, you have probably reached maintenance already.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. If you are pregnant,
        breastfeeding, under 18, managing a medical condition such as kidney disease, or have a
        history of disordered eating, talk to a doctor or registered dietitian before changing what
        you eat.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Maintenance calorie calculator", href: "/tools/maintenance-calorie-calculator" },
    { label: "Refeed day calculator", href: "/tools/refeed-day-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "The end of the diet, planned as carefully as the start",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
