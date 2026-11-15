import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Weight Loss Phase Calculator: A Multi-Phase Diet Plan",
  description:
    "Free weight loss phase calculator. Build a diet in phases that recalculate your calories as you lose weight, with maintenance breaks and a realistic finish date.",
  eyebrow: "Free tool · Nutrition",
  h1: "Weight loss phase calculator",
  intro: (
    <>
      <p>
        Most calculators give you one calorie target and one date. Real diets do not work like that:
        as you lose weight, you burn less, so the same intake does less over time. This calculator
        plans your diet in phases of up to twelve weeks, recalculates your calorie target at the
        start of each one, adds a two-week break at maintenance between them, and gives you a finish
        date that accounts for the slowdown.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How does a phased diet work?",
    answer: (
      <>
        <p>
          You diet in blocks. Each block starts by setting calories from your maintenance at your
          current weight, minus a fixed deficit such as 500 kcal. During the block you hold that
          target while your weight falls. At the end of the block you take a short break at
          maintenance, then recalculate and start the next block from your new, lower weight.
        </p>
        <p>
          Because each phase resets the target, the deficit is restored at the start of every block
          instead of shrinking month after month. The calorie number gets lower from phase to phase,
          but the pace of loss stays steady, and the breaks make a long diet far easier to sustain.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator builds your phases",
      body: (
        <>
          <ol>
            <li>
              <strong>Maintenance:</strong> your resting rate from the Mifflin-St Jeor equation at
              your current weight, multiplied by your activity factor.
            </li>
            <li>
              <strong>Phase target:</strong> maintenance minus your chosen daily deficit, never
              below 1,200 kcal for women or 1,500 kcal for men.
            </li>
            <li>
              <strong>Week by week:</strong> your weight is updated each week from the real deficit,
              which shrinks slightly as maintenance falls with your weight.
            </li>
            <li>
              <strong>Phase length:</strong> up to 12 weeks, or until you reach your goal.
            </li>
            <li>
              <strong>Break:</strong> two weeks at maintenance between phases.
            </li>
            <li>
              <strong>Repeat:</strong> a new target from your new weight, until you reach your goal
              or the plan reaches eight phases.
            </li>
          </ol>
          <p>
            The table shows each phase's daily target, how many weeks it lasts and the weight you
            start and finish it at. The finish date includes the breaks.
          </p>
        </>
      ),
    },
    {
      heading: "Why plan in phases?",
      body: (
        <>
          <p>
            A single long diet at a fixed calorie target runs into two problems. First, the deficit
            shrinks as you lose weight: a 500 kcal deficit at the start might be a 300 kcal deficit
            four months later, so progress slows and people assume the diet has stopped working.
            Second, motivation, energy and hunger all get harder to manage the longer a diet runs
            without a pause.
          </p>
          <p>
            Phases address both. Recalculating at the start of each phase restores the full deficit,
            so progress stays closer to the planned rate. And the breaks at maintenance give a
            planned pause where hunger settles, training recovers and life gets easier for a couple
            of weeks before the next push.
          </p>
        </>
      ),
    },
    {
      heading: "What the research says about diet breaks",
      body: (
        <>
          <p>
            The most cited study on this is the MATADOR trial, published in 2018. Men with obesity
            either dieted continuously for 16 weeks or alternated two weeks of dieting with two
            weeks at maintenance until they had completed 16 weeks of dieting. The intermittent
            group lost more fat during the programme and kept more of it off six months later.
            Although the diet took longer from start to finish, the breaks appeared to reduce some
            of the adaptation that normally makes weight loss slow down.
          </p>
          <p>
            Other studies have produced mixed results, and the benefit seems strongest in longer
            diets and when breaks are true maintenance rather than unstructured eating. At the very
            least, planned breaks appear to do no harm to fat loss and can make a diet more pleasant
            and sustainable, which is reason enough for many people to use them.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing the daily deficit",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Deficit</th>
                  <th scope="col">Typical first-week pace</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gentle: 250 kcal</td>
                  <td>About 0.25 kg (0.5 lb)</td>
                  <td>Smaller people, those near their goal, anyone prioritising training</td>
                </tr>
                <tr>
                  <td>Steady: 500 kcal</td>
                  <td>About 0.45 kg (1 lb)</td>
                  <td>Most people; the recommended default</td>
                </tr>
                <tr>
                  <td>Faster: 750 kcal</td>
                  <td>About 0.7 kg (1.5 lb)</td>
                  <td>Larger bodies; people with a lot to lose and good adherence</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For smaller people, a 750 kcal deficit may be held at the minimum intake, which the
            table marks. In that case the real deficit is smaller than chosen, and a gentler setting
            usually gives a more realistic plan.
          </p>
        </>
      ),
    },
    {
      heading: "What a maintenance break looks like",
      body: (
        <>
          <p>
            A break means eating at your estimated maintenance for the new, lower weight, not a
            holiday from all structure. Keep protein high, keep training, and keep your normal meal
            pattern, adding food mostly as carbohydrate. Expect the scale to rise by 1 to 2 kg in
            the first days as stored carbohydrate and water return. That is not fat, and it usually
            settles within the two weeks.
          </p>
          <p>
            Many people find breaks easier than expected. Hunger falls, training improves, and the
            next phase starts with fresh motivation. Using breaks around holidays or busy weeks is a
            practical way to fit a long diet into real life.
          </p>
        </>
      ),
    },
    {
      heading: "Why later phases have lower targets",
      body: (
        <>
          <p>
            Each phase starts from a lower weight, and a lighter body burns less, both at rest and
            when moving. So the calorie target for phase three is lower than for phase one, even
            though the deficit is the same. This is normal and expected. It is also why people who
            never recalculate often stall: they keep eating the phase-one target long after it has
            become close to their new maintenance.
          </p>
          <p>
            Seeing the targets laid out in advance helps set expectations. Knowing that phase three
            will be a few hundred calories lower than phase one, and why, makes it far easier to
            accept when it arrives.
          </p>
        </>
      ),
    },
    {
      heading: "Adjusting the plan as you go",
      body: (
        <>
          <p>
            The phases here are a projection. Your real progress will differ, because estimates of
            maintenance are never exact and life interrupts plans. At the end of each phase, compare
            your actual weight with the projected end weight. If you are close, carry on. If you
            lost noticeably less, your real maintenance may be lower than estimated, or tracking may
            have drifted; tighten tracking or reduce intake slightly for the next phase. If you lost
            noticeably more, you may be able to eat a little more and still progress well.
          </p>
          <p>
            Rerunning the calculator at the start of each phase with your current weight gives an
            updated plan that reflects what has actually happened.
          </p>
        </>
      ),
    },
    {
      heading: "Protein and training through the phases",
      body: (
        <>
          <p>
            Keeping muscle through a long diet depends on two things that do not change from phase
            to phase: enough protein, around 1.8 to 2.4 g per kg of body weight, and continued
            strength training. Muscle you keep supports your metabolism, your strength and how you
            look at the end. Phases and breaks help, but they cannot replace these basics.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A 35-year-old man is 180 cm tall, weighs 100 kg, trains three to five times a week and
            wants to reach 85 kg with a 500 kcal daily deficit.
          </p>
          <ul>
            <li>
              <strong>Phase 1:</strong> his maintenance at 100 kg is about 3,030 kcal, so his target
              is about 2,530 kcal. Over 12 weeks he loses about 5 kg, finishing near 95 kg.
            </li>
            <li>
              <strong>Break:</strong> two weeks at his new maintenance, about 2,950 kcal.
            </li>
            <li>
              <strong>Phase 2:</strong> maintenance at 95 kg is about 2,950 kcal, so the target
              drops to about 2,450 kcal. Another 12 weeks takes him to about 90 kg.
            </li>
            <li>
              <strong>Break:</strong> two more weeks at maintenance.
            </li>
            <li>
              <strong>Phase 3:</strong> the target drops to about 2,375 kcal and he reaches 85 kg
              after roughly 12 weeks.
            </li>
          </ul>
          <p>
            In total, the plan takes about 40 weeks, including two breaks. The weekly rate stays
            close to 0.4 to 0.45 kg throughout, and each phase's calorie target is a little lower
            than the last.
          </p>
        </>
      ),
    },
    {
      heading: "Phases for smaller bodies",
      body: (
        <>
          <p>
            For smaller people, the gap between maintenance and the minimum intake is narrower, so
            large deficits quickly run into the floor. A 160 cm woman weighing 62 kg with a light
            activity level may have a maintenance of only around 1,800 kcal. A 750 kcal deficit
            would put her at 1,050 kcal, below the 1,200 kcal minimum, so the calculator holds her
            at 1,200 and the real deficit is only about 600 kcal.
          </p>
          <p>
            In cases like this, a gentler deficit with more phases is often the better plan. A 250
            to 500 kcal deficit, longer phases and regular breaks may feel slower, but they are far
            more sustainable and protect muscle, energy and training. Increasing daily activity,
            such as steps, is also a useful way to widen the gap without eating less.
          </p>
        </>
      ),
    },
    {
      heading: "Planning phases around your calendar",
      body: (
        <>
          <p>
            One of the advantages of planning in phases is that you can line the breaks up with your
            life. If you have a holiday in four months, plan a phase to end just before it and use
            the holiday as your maintenance break. If you have a busy period at work, schedule a
            break then rather than trying to diet through it. The calculator assumes regular 12-week
            phases with 2-week breaks, but you can shorten a phase or lengthen a break to suit your
            calendar; the overall principle stays the same.
          </p>
          <p>
            Some people prefer shorter phases, such as six to eight weeks, with breaks between each.
            That increases the total time but can make each phase feel more achievable. Others
            prefer to diet for longer before a break. There is no single correct structure, and the
            best one is the one you can follow consistently.
          </p>
        </>
      ),
    },
    {
      heading: "When to stop the phases",
      body: (
        <>
          <p>
            Sometimes it makes sense to stop before reaching the original goal. If you find that
            dieting has become very difficult, with constant hunger, poor sleep, falling performance
            or low mood, a longer period at maintenance may be the better choice. Many people reach
            a weight that feels good and is easy to maintain before reaching the number they first
            chose, and stopping there is a success, not a failure.
          </p>
          <p>
            If you do continue, consider whether the final phases need a smaller deficit. People who
            are already lean often do better with slower loss, and the last few kilograms are
            typically the hardest to lose and the hardest to keep off.
          </p>
        </>
      ),
    },
    {
      heading: "How breaks affect your total timeline",
      body: (
        <>
          <p>
            Two-week breaks between phases add time. A plan with three phases and two breaks takes
            four weeks longer than continuous dieting for the same amount of dieting time. Some
            people see that as a cost; others see it as an investment that makes the result more
            likely to last. Studies that used breaks generally found that participants kept more of
            their weight off afterward, which matters more over years than finishing a diet a month
            sooner.
          </p>
          <p>
            If you want the shortest possible timeline, you can skip breaks, but expect hunger and
            fatigue to build over a long diet, and be prepared to recalculate the target regularly
            to keep progress steady.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing your activity level honestly",
      body: (
        <>
          <p>
            The activity level you choose sets maintenance for every phase, so it shapes the whole
            plan. Choose the level that matches your last month, not the one you hope to reach. If
            you train three times a week but sit most of the day, the light or moderate level is
            usually more accurate than very active. Overestimating activity makes every phase target
            too high, so weight loss is slower than the plan shows; underestimating it makes the
            targets lower than necessary, which can make the diet harder than it needs to be.
          </p>
          <p>
            If your activity changes during the plan, for example because you start walking more or
            take up a new sport, rerun the calculator at the start of the next phase with the new
            level. The phase targets will adjust to match.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking progress phase by phase",
      body: (
        <>
          <p>
            At the end of each phase, compare three things with the plan: your weekly average
            weight, your waist measurement and how training has gone. If weight is close to the
            projected end weight and training is holding up, the next phase can start as planned. If
            weight is well above the projection, review tracking and activity before cutting
            calories further. If strength has dropped noticeably, consider a slightly smaller
            deficit for the next phase or a longer break.
          </p>
          <p>
            Keeping a short note at the end of each phase, covering what went well, what was hard
            and what you would change, makes each phase easier than the last. Over a long diet,
            those notes become a personal guide to what works for you.
          </p>
        </>
      ),
    },
    {
      heading: "What happens after the final phase",
      body: (
        <>
          <p>
            When you reach your goal, the work shifts from losing weight to keeping it. Recalculate
            maintenance at your new weight and eat at that level, expecting a small rise on the
            scale in the first week as food volume and stored carbohydrate return. Keep the habits
            that served you through the phases: regular weigh-ins, high protein, strength training
            and plenty of daily movement. Many people find that holding their new weight for a few
            months, before deciding on any further goals, is the most valuable phase of all.
          </p>
        </>
      ),
    },
    {
      heading: "Why a fixed target eventually stops working",
      body: (
        <>
          <p>
            Imagine someone who starts a diet at 100 kg with a maintenance of 3,000 kcal and eats
            2,500 kcal a day. At the start, that is a 500 kcal deficit. By the time they weigh 90
            kg, their maintenance may have fallen to around 2,850 kcal, so the same 2,500 kcal is
            now a deficit of only 350 kcal. Loss slows by about a third, even though nothing about
            their eating has changed. If they reach 85 kg, the deficit may be under 300 kcal.
          </p>
          <p>
            This is the single most common reason people feel their diet has stopped working. They
            have not done anything wrong; the arithmetic has changed underneath them. Recalculating
            at the start of each phase resets the deficit to its planned size, which keeps progress
            closer to the pace you chose. That is the core idea behind this calculator, and it is
            why the phase targets step down over time.
          </p>
        </>
      ),
    },
    {
      heading: "Making each phase easier than the last",
      body: (
        <>
          <p>
            Each phase teaches you something. By the end of the first, most people know which meals
            keep them full, which times of day are hardest and which situations lead to unplanned
            eating. Use the maintenance break to plan around those lessons: stock easy high-protein
            foods, prepare meals for the hard days, and decide in advance how you will handle social
            events. People who treat each break as preparation for the next phase usually find later
            phases easier, even though the calorie targets are lower.
          </p>
        </>
      ),
    },
    {
      heading: "A note on accuracy",
      body: (
        <>
          <p>
            Every number in the phase table is an estimate built on other estimates: your
            maintenance, your activity level and the energy content of body weight. Real progress
            will differ, sometimes by a lot. Treat the table as a map that shows the overall shape
            of the journey, not a schedule you must match week by week. Rerun it whenever your
            weight, activity or goal changes.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using phases with clients",
    body: (
      <>
        <p>
          Show clients the whole plan at the start. A long diet feels far more manageable when they
          can see the breaks coming and know exactly when the next easier fortnight arrives.
        </p>
        <p>
          Recalculate with them at each phase. Explaining that the new, lower target is a sign of
          progress, because their body is now smaller, turns a potentially discouraging moment into
          a positive one.
        </p>
        <p>
          Treat breaks as part of the plan, not a reward. Clients who see maintenance weeks as a
          planned training tool are far less likely to drift into unstructured eating during them.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Plan the phases and adjust targets as clients progress",
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
    { label: "Get your goal date at a fixed rate", href: "/tools/goal-weight-date-calculator" },
    { label: "Plan a gradual return to maintenance", href: "/tools/reverse-diet-calculator" },
  ],
  nextPitch:
    "Running long fat-loss phases with clients? Traiv keeps targets, logs and check-ins together.",
  faq: [
    {
      q: "What is a weight loss phase?",
      a: "A block of dieting, usually 8 to 12 weeks, with a set calorie target. The target is recalculated at the start of each new phase from your current weight.",
    },
    {
      q: "Why take breaks between phases?",
      a: "Breaks at maintenance can reduce some of the adaptation to dieting, improve training and make a long diet easier to sustain. Some studies found better fat loss with planned breaks.",
    },
    {
      q: "Will I gain weight during a break?",
      a: "Usually 1 to 2 kg of water and stored carbohydrate in the first days. It is not fat and normally settles during the break.",
    },
    {
      q: "Why is each phase's calorie target lower?",
      a: "Because you weigh less, your maintenance falls. The same deficit from a lower maintenance gives a lower target.",
    },
    {
      q: "How long should a phase be?",
      a: "Eight to twelve weeks suits most people. Shorter phases with more frequent breaks can help if dieting feels very hard.",
    },
    {
      q: "What if I reach my goal before the last phase?",
      a: "Stop the diet, move to your new maintenance and hold your weight for a few weeks before deciding on your next goal.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. If you are pregnant,
        breastfeeding, under 18, managing a medical condition or have a history of disordered
        eating, talk to a doctor or registered dietitian before changing what you eat.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Goal weight date calculator", href: "/tools/goal-weight-date-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "Reverse diet calculator", href: "/tools/reverse-diet-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Long diets, planned in phases clients can finish",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
