import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Goal Weight Date Calculator: When Will You Reach Your Goal?",
  description:
    "Free goal weight date calculator. Enter your current and goal weight and a weekly rate to get a target date, the daily deficit or surplus it needs, and a safety check.",
  eyebrow: "Free tool · Nutrition",
  h1: "Goal weight date calculator",
  intro: (
    <>
      <p>
        How long will it take to reach your goal weight? Enter where you are, where you want to be
        and how quickly you want to change, and this calculator gives you an estimated date, the
        daily calorie deficit or surplus that pace requires, and whether that pace is gentle,
        sensible or too fast for your size.
      </p>
    </>
  ),
  method: "Weekly rate × 7,700 kcal per kg (3,500 per lb), with pace checked against body weight",
  sources: [
    {
      label:
        "Hall KD, et al. Quantification of the effect of energy imbalance on bodyweight. The Lancet, 2011.",
      href: "https://pubmed.ncbi.nlm.nih.gov/21872751/",
    },
    {
      label:
        "Garthe I, et al. Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes. Int J Sport Nutr Exerc Metab, 2011.",
      href: "https://pubmed.ncbi.nlm.nih.gov/21558571/",
    },
    {
      label:
        "Thomas DM, et al. Can a weight loss of one pound a week be achieved with a 3500-kcal deficit? Int J Obes, 2013.",
      href: "https://pubmed.ncbi.nlm.nih.gov/24113251/",
    },
  ],
  shortAnswer: {
    question: "How long will it take to reach my goal weight?",
    answer: (
      <>
        <p>
          Divide the amount you want to lose or gain by your weekly rate. Losing 20 lb at 1 lb a
          week takes about 20 weeks, roughly five months. That rate needs a daily calorie deficit of
          about 500 kcal, using the long-standing rule that a pound of body weight holds about 3,500
          kcal.
        </p>
        <p>
          Real progress usually slows over time, because a smaller body burns less and the body
          adapts slightly to dieting. Treat the date as the earliest likely finish, recalculate
          every 10 lb or so, and expect the final stretch to take longer than the first.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the date is worked out",
      body: (
        <>
          <ol>
            <li>
              <strong>Distance:</strong> the difference between your current and goal weight.
            </li>
            <li>
              <strong>Weeks:</strong> that distance divided by your weekly rate.
            </li>
            <li>
              <strong>Date:</strong> the number of weeks counted forward from today.
            </li>
            <li>
              <strong>Daily energy gap:</strong> the weekly rate converted to calories. Each
              kilogram is treated as 7,700 kcal and each pound as 3,500 kcal, then divided by seven.
            </li>
            <li>
              <strong>Safety check:</strong> the weekly rate as a percentage of your current weight.
              Under 0.5 percent is gentle, 0.5 to 1 percent is the commonly recommended range, 1 to
              1.5 percent is fast, and above that is too fast for most people.
            </li>
          </ol>
          <p>
            The calculator works in both directions. If your goal is above your current weight, the
            daily figure is the surplus you need to gain at that rate.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a weekly rate",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Rate</th>
                  <th scope="col">Per week</th>
                  <th scope="col">Daily deficit</th>
                  <th scope="col">Who it suits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Very gradual</td>
                  <td>0.25 lb / 0.1 kg</td>
                  <td>about 125 kcal</td>
                  <td>Small adjustments; near goal; very lean people</td>
                </tr>
                <tr>
                  <td>Steady</td>
                  <td>0.5 lb / 0.25 kg</td>
                  <td>about 250 kcal</td>
                  <td>Smaller people; long-term habit change</td>
                </tr>
                <tr>
                  <td>Faster</td>
                  <td>0.75 lb / 0.35 kg</td>
                  <td>about 375 kcal</td>
                  <td>Most people starting a diet</td>
                </tr>
                <tr>
                  <td>Aggressive</td>
                  <td>1 lb / 0.5 kg</td>
                  <td>about 500 kcal</td>
                  <td>Average to larger bodies; a classic starting point</td>
                </tr>
                <tr>
                  <td>Very aggressive</td>
                  <td>1.5 lb / 0.7 kg</td>
                  <td>about 750 kcal</td>
                  <td>Larger bodies; short, defined phases</td>
                </tr>
                <tr>
                  <td>Extreme</td>
                  <td>2 lb / 0.9 kg</td>
                  <td>about 1,000 kcal</td>
                  <td>Very large bodies or supervised plans only</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Because a fixed rate means different things at different sizes, the safety check
            compares it with your body weight. One pound a week is 0.5 percent of body weight for
            someone at 200 lb and nearly 0.8 percent for someone at 130 lb. The same number on the
            label can be easy for one person and demanding for another.
          </p>
        </>
      ),
    },
    {
      heading: "Why the 3,500 kcal rule overestimates long-term loss",
      body: (
        <>
          <p>
            The idea that a pound of fat holds 3,500 kcal is a reasonable approximation of the
            energy stored in adipose tissue, and it works well for the first weeks of a diet. It
            becomes less accurate over months, and researchers have shown that applying it naively
            overpredicts weight loss over a year or more, sometimes by a large margin.
          </p>
          <p>
            The main reason is that the body is not static. As you lose weight, you have less tissue
            to maintain and move, so you burn less every day. The same daily intake that created a
            500 kcal deficit at the start may create only a 300 kcal deficit after several months.
            There is also some adaptive thermogenesis: people tend to move a little less during a
            diet without noticing, and resting metabolism can fall slightly more than weight loss
            alone predicts.
          </p>
          <p>
            Dynamic models that account for these changes, such as the one developed by Kevin Hall
            and colleagues, suggest that a sustained daily change of 10 kcal eventually shifts body
            weight by about 1 lb, with half of that change happening in the first year. That is a
            far cry from the simple rule, which would predict that the same 10 kcal a day adds up to
            about 1 lb every year indefinitely.
          </p>
          <p>
            None of this means the calculator is wrong to use the simple rule. It gives a clear,
            easy estimate that is close enough for planning the first phase of a diet. The practical
            fix is to recalculate regularly and adjust intake as you go, which keeps the deficit
            close to the one you planned.
          </p>
        </>
      ),
    },
    {
      heading: "A realistic timeline",
      body: (
        <>
          <p>
            Most real weight-loss journeys follow a similar shape. The first week or two show a
            large drop, often 2 to 5 lb, because stored carbohydrate and the water held with it are
            lost as intake falls. Then loss slows to the true rate. Over the following months,
            progress continues but gradually slows as the body gets smaller. Plateaus of one to
            three weeks are common, often caused by water retention that masks continuing fat loss,
            and they usually break without any change in plan.
          </p>
          <p>To keep the timeline realistic:</p>
          <ul>
            <li>Ignore the first week when judging your rate.</li>
            <li>Use weekly averages of daily weigh-ins, not single days.</li>
            <li>Recalculate your calorie target every 10 lb (4 to 5 kg) lost.</li>
            <li>Expect the second half of the journey to take longer than the first.</li>
            <li>
              Plan breaks at maintenance for longer diets, and add their length to the timeline.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Gaining weight on a timeline",
      body: (
        <>
          <p>
            If your goal weight is higher than your current weight, the calculator works the same
            way, but expectations need to be different. Weight gain includes muscle, fat, glycogen
            and water, and the proportion that is muscle depends heavily on training experience and
            the size of the surplus. Beginners can build muscle relatively quickly; experienced
            lifters gain much more slowly. A rate of 0.25 to 0.5 percent of body weight a week is a
            sensible target for most people trying to build muscle while keeping fat gain modest.
          </p>
          <p>
            As with weight loss, the date is a best case. Not all of a surplus is stored, because
            eating more slightly increases the energy you spend digesting food and moving around.
          </p>
        </>
      ),
    },
    {
      heading: "Setting a goal weight",
      body: (
        <>
          <p>
            A goal weight is a useful anchor, but the number itself matters less than the habits
            needed to reach and keep it. A few things help choose a sensible one:
          </p>
          <ul>
            <li>
              <strong>Think in stages.</strong> A first goal of 5 to 10 percent of body weight is
              achievable for most people and brings real health benefits. You can set the next goal
              once you reach it.
            </li>
            <li>
              <strong>Consider body composition.</strong> Two people at the same weight can look and
              feel very different. Waist measurement, strength and how clothes fit are useful
              alongside weight.
            </li>
            <li>
              <strong>Be realistic about maintenance.</strong> The weight you can comfortably
              maintain while living your normal life is usually a better long-term goal than the
              lowest weight you can reach for a short time.
            </li>
            <li>
              <strong>Avoid BMI-only targets.</strong> BMI can be misleading for muscular people and
              does not account for where fat is stored.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "What to do if you fall behind schedule",
      body: (
        <>
          <p>
            Missing the projected timeline is normal and does not mean the plan has failed. Before
            changing anything, check three things: whether your tracking has drifted, especially on
            weekends; whether your daily activity has dropped; and whether you are retaining water
            because of stress, sleep, salt, a new training programme or the menstrual cycle. If none
            of those explain it after two to three weeks, reduce intake by 100 to 200 kcal a day or
            increase daily steps, and give the change two more weeks.
          </p>
          <p>
            It also helps to update the date rather than trying to catch up. A diet that slows to
            0.7 lb a week still reaches the goal; it simply takes longer. Trying to recover lost
            time with a much larger deficit increases hunger, fatigue and the risk of giving up
            altogether.
          </p>
        </>
      ),
    },
    {
      heading: "Small changes, compounded",
      body: (
        <>
          <p>
            Even small sustained differences add up. A daily deficit of 250 kcal, roughly a large
            latte and a biscuit, removes about half a pound a week at first, around 10 to 15 lb over
            six months once the slowdown is taken into account. Changes of this size are often
            easier to keep for long enough to matter than dramatic diets, which is why many coaches
            start with modest targets and adjust from there.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <p>Three people, three goals, worked through the same way:</p>
          <ul>
            <li>
              <strong>A man at 230 lb aiming for 200 lb at 1 lb a week.</strong> Thirty pounds at
              one pound a week is 30 weeks, about seven months. One pound a week is under 0.5
              percent of his body weight, a gentle pace. His daily deficit is about 500 kcal.
            </li>
            <li>
              <strong>A woman at 150 lb aiming for 135 lb at 1 lb a week.</strong> Fifteen pounds is
              15 weeks. One pound a week is about 0.67 percent of her body weight, within the
              recommended range, but toward the faster side for a smaller person. A rate of 0.75 lb
              a week would take 20 weeks and be easier to sustain.
            </li>
            <li>
              <strong>A man at 70 kg aiming to gain to 75 kg at 0.25 kg a week.</strong> Five
              kilograms is 20 weeks. The daily surplus is about 275 kcal. Because not every surplus
              calorie is stored, reaching the goal may take closer to six months.
            </li>
          </ul>
          <p>
            In each case the estimate gives a sensible planning horizon. The checkpoints along the
            way, and how the body responds, determine the real finish date.
          </p>
        </>
      ),
    },
    {
      heading: "Checkpoints keep a long goal manageable",
      body: (
        <>
          <p>
            A goal six months away is easy to lose sight of. Breaking it into monthly checkpoints
            makes progress visible and gives natural points to review the plan. For a 30 lb goal at
            1 lb a week, monthly checkpoints might sit at roughly 4 lb, 8 lb, 12 lb and so on,
            allowing for the faster first month and slower later months.
          </p>
          <p>
            At each checkpoint, compare the weekly average with the checkpoint. If you are close,
            carry on. If you are well ahead, consider whether the pace is sustainable; fast early
            progress sometimes comes at the cost of energy or muscle. If you are behind, review
            tracking and activity before changing intake. Checkpoints also give you something to
            celebrate along the way, which matters more for long-term success than it might seem.
          </p>
        </>
      ),
    },
    {
      heading: "When to stop and maintain",
      body: (
        <>
          <p>
            Reaching the goal is one moment; staying there is the long-term task. When you get close
            to your goal weight, plan the transition to maintenance before you arrive. Recalculate
            your maintenance calories at the new weight, which will be lower than when you started.
            Expect a small rise on the scale when you increase intake, as stored carbohydrate and
            water return, and decide in advance that this is normal rather than a reason to keep
            dieting.
          </p>
          <p>
            Some people find their goal weight is harder to maintain than expected, or that they
            feel better a few pounds above it. That is useful information. The weight you can hold
            comfortably while eating normally and training well is often the right long-term target,
            even if it differs slightly from the number you first chose.
          </p>
        </>
      ),
    },
    {
      heading: "Goal dates for events",
      body: (
        <>
          <p>
            Many people set goals around an event: a wedding, a holiday, a competition. Working
            backwards from the date is a good use of this calculator. Enter your current weight and
            goal, then try different rates until the date lands a week or two before the event,
            leaving a buffer for slower weeks. If the required rate is above 1 percent of body
            weight a week, the goal may be too ambitious for the time available. Either adjust the
            goal, accept a less aggressive outcome, or start sooner next time. Crash dieting for an
            event often leaves people tired, hungry and quick to regain afterward.
          </p>
        </>
      ),
    },
    {
      heading: "Why the scale does not move in a straight line",
      body: (
        <>
          <p>
            Even when fat loss is steady, the scale rarely shows a smooth line. Water retention can
            rise with stress, poor sleep, a salty meal, a hard workout or hormonal changes, and it
            can hide a week or more of fat loss before suddenly dropping. Many people experience
            what looks like a plateau followed by a sudden drop of a couple of pounds, sometimes
            called a whoosh. Understanding this pattern helps you avoid changing a plan that is
            actually working.
          </p>
          <p>
            Daily weighing averaged into a weekly figure smooths out much of this noise. Some apps
            and spreadsheets plot a trend line for you, which is the clearest way to see whether you
            are on track for your goal date.
          </p>
        </>
      ),
    },
    {
      heading: "Weight goals and health",
      body: (
        <>
          <p>
            For people carrying excess weight, even modest loss brings measurable health benefits.
            Losing around 5 to 10 percent of body weight is associated with improvements in blood
            pressure, blood sugar control, cholesterol, joint pain and sleep quality. Those benefits
            arrive long before most people reach the goal weight they first had in mind, which is a
            good reason to celebrate early progress rather than waiting for the final number.
          </p>
          <p>
            For people already in a healthy range, further weight loss offers fewer health benefits
            and can become counterproductive if it requires very restrictive eating. In that case,
            goals focused on strength, fitness, energy or body composition are often more useful
            than a lower number on the scale.
          </p>
        </>
      ),
    },
    {
      heading: "Pairing the date with a calorie target",
      body: (
        <>
          <p>
            A date on its own does not tell you what to eat. Once you have chosen a rate, use the
            calorie deficit calculator to turn it into a daily calorie target based on your body and
            activity level. That target, combined with the daily deficit shown here, gives you a
            complete plan: what to eat, how fast to expect progress and when to expect to arrive.
            Recalculate both every 10 lb or so, because your maintenance calories fall as you lose
            weight and the same intake produces a smaller deficit over time.
          </p>
          <p>
            Keeping protein high throughout, around 1.6 to 2.2 g per kg of body weight, and
            continuing strength training help ensure that most of the weight you lose on the way to
            your goal is fat rather than muscle. That makes the result look and feel better, and it
            makes the new weight easier to maintain.
          </p>
        </>
      ),
    },
    {
      heading: "Planning around life",
      body: (
        <>
          <p>
            Very few people diet in a straight line for months without interruption. Holidays,
            celebrations, illness, busy periods at work and family events all interrupt the plan.
            Rather than treating these as setbacks, build them into the timeline. Plan a week at
            maintenance around a holiday, or accept a slower rate during a demanding month. The
            overall date moves slightly later, but the plan stays realistic and you avoid the cycle
            of strict dieting followed by a complete break that many people fall into.
          </p>
          <p>
            A useful habit is to add a buffer of 10 to 20 percent to any timeline longer than three
            months. If the calculator suggests 20 weeks, plan for 22 to 24. If you finish early,
            that is a bonus; if life gets in the way, you are still on schedule.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring progress beyond the scale",
      body: (
        <>
          <p>
            Weight is one measure of progress, but not the only one. Waist measurements, progress
            photos, how clothes fit, strength in the gym and energy levels all show change,
            sometimes when the scale does not. Recording a waist measurement and a set of photos
            every four weeks alongside your weight gives a fuller picture and keeps motivation up
            during slower weeks.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Turn your goal date into a week-by-week plan",
    whenToUse:
      "When you have a target date and want checkpoints, a calorie target and a plan for when progress slows.",
    pasteIn:
      "Your current and goal weight, the rate and date from the calculator, your maintenance calories if you know them, and your training schedule.",
    text: `I want to reach a goal weight. From a goal date calculator:
Current weight: [weight]
Goal weight: [weight]
Rate: [per week]
Estimated date: [date]
Daily deficit or surplus: [kcal]

My maintenance calories (estimate): [kcal]
Training: [what and how often]

1. Give me monthly checkpoint weights between now and the goal date.
2. Suggest a daily calorie and protein target to start with.
3. Tell me when to recalculate and by how much to adjust if I fall behind.
4. Suggest one or two planned breaks at maintenance if the timeline is longer than 12 weeks.`,
  },
  forCoaches: {
    heading: "Using goal dates with clients",
    body: (
      <>
        <p>
          Clients love a date, and it can be a powerful motivator. The risk is that a date becomes a
          deadline, and every slow week feels like failure. Present the date as an estimate based on
          today's numbers, and show the checkpoints along the way so progress is visible long before
          the end.
        </p>
        <p>
          Recalculate together every month. Showing a client that the date has moved by a week
          because their maintenance has fallen, not because they did anything wrong, builds trust
          and keeps them engaged.
        </p>
        <p>
          Use the safety check to steer pace. Clients often want the fastest rate; showing that it
          is more than 1 percent of their body weight a week, and what that means for hunger and
          muscle, makes it easier to agree on something sustainable.
        </p>
      </>
    ),
  },
  pitch: {
    key: "check-ins",
    heading: "Track every client's progress toward their goal",
    body: (
      <>
        <p>
          In Traiv you set each client's daily calories and protein, carbohydrate and fat targets,
          build their diet plan from recipes, and see the food they log against those targets,
          alongside their weekly check-ins and weight trend.
        </p>
      </>
    ),
  },
  next: [
    {
      label: "Get the daily calorie target for this pace",
      href: "/tools/calorie-deficit-calculator",
    },
    { label: "Plan the whole diet in phases", href: "/tools/weight-loss-phase-calculator" },
  ],
  nextPitch:
    "Coaching clients toward a goal weight? Traiv shows each client's trend at every check-in.",
  faq: [
    {
      q: "How long does it take to lose 20 pounds?",
      a: "At 1 lb a week, about 20 weeks; at 2 lb a week, about 10 weeks. In practice, loss slows over time, so expect the later pounds to take a little longer.",
    },
    {
      q: "Is losing 2 pounds a week safe?",
      a: "For larger bodies it can be, for short periods. For most people, 0.5 to 1 percent of body weight a week is more sustainable and preserves more muscle.",
    },
    {
      q: "How many calories should I cut to lose 1 pound a week?",
      a: "About 500 kcal a day below maintenance, using the 3,500 kcal per pound rule. The exact figure varies, so check progress over two to three weeks.",
    },
    {
      q: "Why am I losing weight slower than predicted?",
      a: "Usually because maintenance falls as you lose weight, daily activity drops slightly, or water retention is masking fat loss. Recalculate and use weekly averages.",
    },
    {
      q: "Why did I lose so much in the first week?",
      a: "Most early loss is water and stored carbohydrate. It is real weight but not fat, and the rate slows once it settles.",
    },
    {
      q: "Can I use this for weight gain?",
      a: "Yes. Enter a goal above your current weight and the calculator shows the daily surplus and date for your chosen rate.",
    },
    {
      q: "How accurate is the goal date?",
      a: "It is a reasonable estimate for the first few months but becomes optimistic over long periods. Recalculate every 10 lb or so.",
    },
    {
      q: "What is a healthy weekly rate?",
      a: "For most people, 0.5 to 1 percent of body weight a week for weight loss, and 0.25 to 0.5 percent for gaining.",
    },
    {
      q: "Should I take breaks during a long diet?",
      a: "Many people benefit from one to two weeks at maintenance every 8 to 12 weeks. Add those weeks to your timeline.",
    },
    {
      q: "What if I hit a plateau?",
      a: "Wait two to three weeks, check tracking and activity, then reduce intake by 100 to 200 kcal or add daily steps if weight still has not moved.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. If you are pregnant,
        breastfeeding, under 18, managing a medical condition or have a history of disordered
        eating, talk to a doctor or registered dietitian before changing what you eat or setting a
        weight goal.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "Weight loss phase calculator", href: "/tools/weight-loss-phase-calculator" },
    { label: "TDEE calculator", href: "/tools/tdee-calculator" },
    { label: "How check-ins work in Traiv", href: "/features/check-ins" },
  ],
  close: {
    heading: "Every client's goal, with the trend to show how close they are",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
