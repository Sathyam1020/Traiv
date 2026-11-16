import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Cycle Phase Calculator: Your Menstrual Cycle Phase Today",
  description:
    "Cycle phase calculator. Enter your last period's first day and cycle length to see today's estimated phase, your next period and training and nutrition notes.",
  eyebrow: "Free tool · Nutrition",
  h1: "Cycle phase calculator",
  intro: (
    <>
      <p>
        Hormones change across the menstrual cycle, and many people notice changes in energy,
        appetite, mood and training as a result. Enter the first day of your last period and your
        average cycle length, and this calculator estimates which phase you are in today, which days
        each phase covers and when your next period is likely to start.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you know what phase of your cycle you are in?",
    answer: (
      <>
        <p>
          Count from the first day of your last period, which is day 1. In a typical 28-day cycle,
          days 1 to 5 are the menstrual phase, days 6 to about 12 are the follicular phase,
          ovulation happens around day 14, and the luteal phase runs from about day 16 until your
          next period.
        </p>
        <p>
          The luteal phase is usually the more consistent half, typically lasting about 14 days, so
          ovulation is estimated by counting back 14 days from the expected start of your next
          period. These are estimates for a regular cycle; individual cycles vary, and this is not a
          fertility or contraception tool.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "The four phases",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Phase</th>
                  <th scope="col">Days (28-day cycle)</th>
                  <th scope="col">What is happening</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Menstrual</td>
                  <td>1 to 5</td>
                  <td>The uterine lining sheds; oestrogen and progesterone are low</td>
                </tr>
                <tr>
                  <td>Follicular</td>
                  <td>6 to 12</td>
                  <td>Oestrogen rises as follicles in the ovary develop</td>
                </tr>
                <tr>
                  <td>Ovulation</td>
                  <td>13 to 15</td>
                  <td>An egg is released; oestrogen peaks and luteinising hormone surges</td>
                </tr>
                <tr>
                  <td>Luteal</td>
                  <td>16 to 28</td>
                  <td>Progesterone rises, then both hormones fall before the next period</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            In shorter or longer cycles, the follicular phase changes length while the luteal phase
            stays roughly the same, which is why the calculator anchors ovulation to the next period
            rather than to a fixed day.
          </p>
        </>
      ),
    },
    {
      heading: "How the calculator works",
      body: (
        <>
          <ol>
            <li>
              It counts the days since the first day of your last period to find today's cycle day.
            </li>
            <li>
              It places ovulation 14 days before your next expected period, with a window of a day
              either side.
            </li>
            <li>
              Days 1 to 5 are treated as the menstrual phase, the days up to ovulation as
              follicular, and the days after ovulation as luteal.
            </li>
            <li>It projects your next period from your average cycle length.</li>
          </ol>
          <p>
            If the date you enter is more than one cycle ago, the calculator projects forward and
            tells you so. For the most accurate estimate, use your most recent period.
          </p>
        </>
      ),
    },
    {
      heading: "Training across the cycle",
      body: (
        <>
          <p>
            Research on training and the menstrual cycle is still developing, and studies often
            disagree. Overall, the effects of cycle phase on strength and performance appear small
            for most people, and individual experience varies far more than any average pattern.
            Some people notice more energy and better sessions in the follicular phase and feel more
            fatigue or discomfort in the late luteal and early menstrual phases; others notice
            little difference.
          </p>
          <p>
            The practical advice is to track how you feel and perform across a few cycles. If you
            see a consistent pattern, you can plan harder sessions for days when you usually feel
            strongest and lighter sessions when you usually feel worse. If you see no pattern, there
            is no need to change your training around the cycle.
          </p>
        </>
      ),
    },
    {
      heading: "Appetite, cravings and weight",
      body: (
        <>
          <p>
            Appetite often rises in the luteal phase, particularly in the days before a period, and
            resting energy expenditure increases slightly, by around 5 to 10 percent according to
            some studies. Cravings for sweet or high-carbohydrate foods are common. Planning for
            this, for example by allowing a little more food in the late luteal phase or including
            more filling, higher-fibre options, can make it easier to stay on track.
          </p>
          <p>
            Water retention also tends to rise in the luteal phase, which can add 0.5 to 2 kg on the
            scale. This is temporary and usually falls once the period starts. Comparing weight at
            the same point in each cycle, or using longer averages, gives a clearer picture of real
            progress.
          </p>
        </>
      ),
    },
    {
      heading: "Irregular cycles",
      body: (
        <>
          <p>
            Many people do not have a perfectly regular cycle. Cycle length can vary from month to
            month with stress, illness, travel, changes in training or diet, and life stage. Cycles
            shorter than 21 days or longer than 35 days, very irregular cycles, or missed periods
            can sometimes indicate a health issue and are worth discussing with a doctor.
          </p>
          <p>
            In athletes, missed or irregular periods can be a sign of low energy availability, where
            food intake is too low for the amount of training. This is associated with reduced bone
            density, impaired performance and other health effects, and should be taken seriously
            rather than treated as a normal part of training.
          </p>
        </>
      ),
    },
    {
      heading: "Hormonal contraception",
      body: (
        <>
          <p>
            Hormonal contraceptives, such as the combined pill, hormonal implants and hormonal
            intrauterine devices, change or suppress the natural hormonal cycle. Bleeding on the
            combined pill is usually a withdrawal bleed rather than a true period, and the phases
            described here do not apply in the same way. If you use hormonal contraception, this
            calculator will not reflect your hormone levels accurately.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking your own pattern",
      body: (
        <>
          <p>
            The most useful information comes from your own data. Alongside period dates, consider
            noting energy, mood, sleep, hunger, cravings, training performance and any symptoms each
            day or week. After two or three cycles, patterns usually become clear. Many
            cycle-tracking apps make this easier, and sharing the information with a coach helps
            them plan training and nutrition around what you actually experience.
          </p>
        </>
      ),
    },
    {
      heading: "Nutrition across the cycle",
      body: (
        <>
          <p>
            Nutritional needs do not change dramatically across the cycle, but some practical
            adjustments can help. In the luteal phase, a slightly higher calorie intake, roughly 100
            to 300 kcal a day for some people, can match the small rise in energy expenditure and
            reduce cravings. Prioritising protein and fibre at meals helps with fullness, and
            planning satisfying snacks can make it easier to resist highly processed foods when
            cravings strike.
          </p>
          <p>
            During menstruation, iron losses increase, particularly for people with heavy periods.
            Including iron-rich foods such as red meat, lentils, beans, tofu, leafy greens and
            fortified cereals, ideally alongside vitamin C, supports iron levels. People who often
            feel tired or have very heavy periods should ask a doctor about checking their iron
            status.
          </p>
        </>
      ),
    },
    {
      heading: "Symptoms and how to manage them",
      body: (
        <>
          <ul>
            <li>
              <strong>Cramps:</strong> gentle movement, heat, and anti-inflammatory painkillers if
              appropriate can help. Some people find light exercise eases cramps.
            </li>
            <li>
              <strong>Bloating:</strong> often linked to water retention in the late luteal phase.
              Reducing very salty foods and staying hydrated may help.
            </li>
            <li>
              <strong>Fatigue:</strong> prioritise sleep and consider lighter training on days when
              energy is low.
            </li>
            <li>
              <strong>Mood changes:</strong> regular exercise, sleep and stress management can help.
              Severe mood symptoms before periods should be discussed with a doctor.
            </li>
            <li>
              <strong>Cravings:</strong> plan for them with satisfying snacks and slightly higher
              intake rather than strict restriction.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Cycle tracking for athletes",
      body: (
        <>
          <p>
            Elite sports teams increasingly track menstrual cycles to understand individual patterns
            in performance, recovery and injury risk. Some research suggests that injury risk for
            certain injuries, such as anterior cruciate ligament tears, may vary across the cycle,
            although findings are mixed. The most consistent recommendation is individualisation:
            understanding how each athlete feels and performs across her cycle and adjusting
            training load, recovery and nutrition accordingly.
          </p>
          <p>
            For recreational athletes, the same principle applies on a smaller scale. Tracking
            symptoms and performance for a few cycles provides the information needed to make
            sensible adjustments.
          </p>
        </>
      ),
    },
    {
      heading: "Perimenopause and changing cycles",
      body: (
        <>
          <p>
            In the years before menopause, often starting in the 40s, cycles commonly become less
            regular, with changes in length and flow. Hormone levels fluctuate more widely, and
            symptoms such as hot flushes, sleep disturbance and mood changes may appear. Cycle-based
            estimates become less reliable during this time. Strength training, adequate protein,
            good sleep and regular physical activity support health through this transition, and a
            doctor can advise on symptom management.
          </p>
        </>
      ),
    },
    {
      heading: "Using the calculator with coaching",
      body: (
        <>
          <p>
            For coaches working with women, understanding where a client is in her cycle can help
            interpret check-in data. A sudden jump in weight, lower energy or reduced performance in
            the week before a period often reflects normal hormonal changes rather than a problem
            with the plan. Asking clients to note their cycle day in check-ins, if they are
            comfortable doing so, makes these patterns easier to spot and discuss.
          </p>
        </>
      ),
    },
    {
      heading: "How cycle length affects the phases",
      body: (
        <>
          <p>
            Because ovulation tends to happen about 14 days before the next period, the follicular
            phase is what changes in shorter and longer cycles. In a 24-day cycle, ovulation is
            estimated around day 10, and the follicular phase is short. In a 32-day cycle, ovulation
            is estimated around day 18, and the follicular phase is longer. The luteal phase stays
            close to 14 days in both. Entering your own average cycle length lets the calculator
            place the phases more accurately for you than a generic 28-day calendar would.
          </p>
          <p>
            If your cycle length varies from month to month, use an average of your last three to
            six cycles, and treat the phase estimate as approximate, particularly around ovulation.
          </p>
        </>
      ),
    },
    {
      heading: "Sleep and recovery across the cycle",
      body: (
        <>
          <p>
            Many people find sleep quality changes across the cycle, with more disturbed sleep in
            the days before a period. Body temperature is slightly higher in the luteal phase, which
            can affect how easily some people fall asleep. A cool bedroom, consistent sleep times
            and limiting caffeine later in the day can help. Because recovery depends heavily on
            sleep, a few nights of poor sleep in the late luteal phase may explain why training
            feels harder at that point, and adjusting training load for those days can be a sensible
            response.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping it simple",
      body: (
        <>
          <p>
            Cycle awareness does not need to make training or nutrition complicated. For most
            people, a few simple adjustments are enough: expecting the scale to rise in the late
            luteal phase, allowing a little more food when hunger rises, choosing lighter sessions
            on days when energy is low, and paying attention to iron intake. Over time, tracking
            your own pattern shows which of these adjustments actually help you.
          </p>
        </>
      ),
    },
    {
      heading: "Why the follicular phase can feel like the easiest time",
      body: (
        <>
          <p>
            In the follicular phase, oestrogen rises steadily, and many people report better mood,
            more energy and easier recovery. Some studies suggest the body may handle carbohydrate a
            little more efficiently and that perceived effort during exercise may be slightly lower
            in this phase. These effects are modest and vary between individuals, but for people who
            notice them, the follicular phase can be a good time to schedule harder training
            sessions, try for personal bests or take on demanding projects.
          </p>
          <p>
            It is worth emphasising that these are tendencies, not rules. Plenty of people perform
            well across the whole cycle, and good sleep, nutrition and training consistency matter
            far more for progress than timing sessions to particular phases.
          </p>
        </>
      ),
    },
    {
      heading: "The late luteal phase and premenstrual symptoms",
      body: (
        <>
          <p>
            In the days before a period, both oestrogen and progesterone fall, and many people
            experience premenstrual symptoms such as irritability, low mood, bloating, breast
            tenderness, headaches, food cravings and fatigue. For most, these are mild to moderate
            and manageable with sleep, regular activity, balanced meals and stress management. For
            some, symptoms are severe enough to affect daily life, a condition known as premenstrual
            dysphoric disorder, and medical support can make a significant difference.
          </p>
          <p>
            Knowing when this phase is coming allows you to plan around it: scheduling lighter
            training, preparing easy meals in advance and being kind to yourself about scale weight
            and energy levels.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking with a coach",
      body: (
        <>
          <p>
            If you work with a coach, sharing your cycle information can make their advice more
            relevant. A coach who knows you are in the late luteal phase will interpret a heavier
            weigh-in, lower training numbers or a tough week differently, and may suggest
            adjustments that suit you better. Many people prefer to keep this information private,
            which is entirely their choice; the calculator works just as well for personal use.
          </p>
        </>
      ),
    },
    {
      heading: "When to see a doctor",
      body: (
        <>
          <p>
            Most variation in cycles is normal, but some signs are worth discussing with a doctor:
            cycles that are consistently shorter than 21 days or longer than 35 days, periods that
            stop for three months or more when not pregnant, very heavy bleeding that soaks through
            protection every hour or two, periods that last longer than seven days, severe pain that
            interferes with daily life, bleeding between periods, and new or worsening symptoms
            around menopause. These can have many causes, most of them treatable, and getting them
            checked early is always worthwhile.
          </p>
          <p>
            For athletes and people who diet frequently, missed periods deserve particular
            attention, because they may signal that energy intake is too low for the amount of
            training and that bone health could be affected over time.
          </p>
        </>
      ),
    },
    {
      heading: "Weighing yourself across the cycle",
      body: (
        <>
          <p>
            Because water retention changes across the cycle, a single weigh-in can be misleading.
            Many women find their weight is lowest in the follicular phase and highest in the days
            just before their period. Comparing your weight on the same cycle day each month, or
            comparing monthly averages rather than weekly ones, gives a much clearer view of real
            change in body fat. If you track weight daily, marking your period on the chart makes
            these patterns easy to see and reduces worry about temporary jumps.
          </p>
        </>
      ),
    },
    {
      heading: "Your cycle is a vital sign",
      body: (
        <>
          <p>
            Many doctors describe the menstrual cycle as a vital sign, because changes in its
            regularity, length or symptoms can reflect wider changes in health, stress, nutrition
            and training load. Paying attention to it is useful well beyond planning workouts.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using cycle phases with clients",
    body: (
      <>
        <p>
          Use cycle awareness to explain, not to prescribe. Helping a client understand why the
          scale jumped or why sessions felt harder in a particular week reduces frustration and
          keeps them consistent.
        </p>
        <p>
          Let each client's own experience lead. Avoid generic rules about what to do in each phase;
          ask clients to track how they feel and adapt from there.
        </p>
        <p>
          Take missed periods seriously. A client who stops menstruating while training hard and
          dieting may be under-fuelling, and should be referred to a doctor.
        </p>
      </>
    ),
  },
  pitch: {
    key: "check-ins",
    heading: "Track symptoms and progress alongside each client's plan",
    body: (
      <>
        <p>
          In Traiv, weekly check-ins collect each client's notes, weight and measurements, so
          patterns linked to their cycle, such as water retention or energy changes, are visible
          over time.
        </p>
      </>
    ),
  },
  next: [
    { label: "Plan calories that flex across the week", href: "/tools/calorie-cycling-calculator" },
    { label: "Estimate your daily water needs", href: "/tools/water-intake-calculator" },
  ],
  nextPitch:
    "Coaching women through training and diet phases? Traiv keeps check-in notes and trends together.",
  faq: [
    {
      q: "How do I know which phase I am in?",
      a: "Count from the first day of your last period. In a 28-day cycle, days 1 to 5 are menstrual, about 6 to 12 follicular, around 14 ovulation, and the rest luteal.",
    },
    {
      q: "Can I use this to plan or avoid pregnancy?",
      a: "No. It gives estimates for a regular cycle and is not a fertility or contraception tool.",
    },
    {
      q: "Should I train differently in each phase?",
      a: "Only if you notice a consistent pattern in how you feel and perform. Average effects of cycle phase on performance are small.",
    },
    {
      q: "Why am I hungrier before my period?",
      a: "Hormonal changes in the luteal phase can increase appetite and cravings, and energy expenditure rises slightly.",
    },
    {
      q: "Why does my weight go up before my period?",
      a: "Water retention often increases in the luteal phase and usually falls once your period starts.",
    },
    {
      q: "Does this work with the pill?",
      a: "Not accurately. Hormonal contraception changes or suppresses the natural cycle, so these phases do not apply in the same way.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice, and is not a contraception or
        fertility tool. See a doctor about cycles shorter than 21 or longer than 35 days, missed
        periods, very heavy or painful periods, or any symptoms that concern you.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Calorie cycling calculator", href: "/tools/calorie-cycling-calculator" },
    { label: "Water intake calculator", href: "/tools/water-intake-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "How check-ins work in Traiv", href: "/features/check-ins" },
  ],
  close: {
    heading: "Coaching that accounts for each client's real experience",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
