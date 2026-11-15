import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Heart rate zone calculator",
  description:
    "Work out your five heart rate training zones from your age, by percentage of max heart rate or with the Karvonen heart rate reserve method.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Heart rate zone calculator",
  intro: (
    <>
      <p>
        Enter your age to see five training zones in beats per minute, based on an estimated maximum
        heart rate. Adding your resting heart rate moves the zones onto heart rate reserve
        (Karvonen), which fits them more closely to your fitness.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate my heart rate zones?",
    answer: (
      <>
        <p>
          Estimate your maximum heart rate, then take a percentage of it for each zone. With
          Tanaka's formula (208 − 0.7 × age), a 30-year-old's max is 187 bpm. Zone 2, at 60 to 70%,
          is 112 to 131 bpm. With a resting rate of 60, the Karvonen method moves zone 2 to 136 to
          149 bpm.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What heart rate zones are",
      body: (
        <>
          <p>
            Heart rate zones divide the range between easy and maximal effort into bands, each
            linked with a different kind of training. Low zones build the aerobic base and help
            recovery. Middle zones develop stamina at a steady, sustainable pace. High zones push
            the lactate threshold and the top end of aerobic capacity. Training across the zones, in
            the right proportions, develops all of these qualities.
          </p>
          <p>
            Zones are useful because heart rate is an objective, real-time signal of effort. Pace
            changes with hills, wind, heat and fatigue; heart rate reflects how hard your body is
            working regardless of the conditions. A zone gives a client a clear target on an easy
            day, when the temptation is to go too fast, and on a hard day, when they need to know
            they have reached the intended effort.
          </p>
        </>
      ),
    },
    {
      heading: "The five zones",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Zone</th>
                  <th scope="col">% of max HR</th>
                  <th scope="col">Feels like</th>
                  <th scope="col">Used for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Z1 Recovery</td>
                  <td>50 to 60%</td>
                  <td>Very easy, relaxed breathing</td>
                  <td>Warm-ups, cool-downs, recovery days</td>
                </tr>
                <tr>
                  <td>Z2 Aerobic</td>
                  <td>60 to 70%</td>
                  <td>Easy, can hold a conversation</td>
                  <td>Aerobic base, long steady sessions</td>
                </tr>
                <tr>
                  <td>Z3 Tempo</td>
                  <td>70 to 80%</td>
                  <td>Comfortably hard, short sentences</td>
                  <td>Stamina and steady-state work</td>
                </tr>
                <tr>
                  <td>Z4 Threshold</td>
                  <td>80 to 90%</td>
                  <td>Hard, a few words at a time</td>
                  <td>Lactate threshold, race-pace intervals</td>
                </tr>
                <tr>
                  <td>Z5 VO2 max</td>
                  <td>90 to 100%</td>
                  <td>Very hard, can't talk</td>
                  <td>Short intervals for top-end fitness</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These percentages are one common scheme. Some coaching systems use three zones, others
            seven, and the boundaries differ. What matters is choosing one scheme and using it
            consistently, so that a zone 2 session means the same thing every week.
          </p>
        </>
      ),
    },
    {
      heading: "Estimating maximum heart rate",
      body: (
        <>
          <p>
            Every zone depends on maximum heart rate, so the estimate matters. The calculator uses
            Tanaka's formula, 208 − 0.7 × age, published in 2001 from a meta-analysis of 351 studies
            and later confirmed in a laboratory study. It also shows the older 220 − age rule for
            comparison. For a 30-year-old, Tanaka gives 187 bpm and 220 − age gives 190.
          </p>
          <p>
            Both formulas describe averages. Real maximum heart rates vary widely between people of
            the same age, with a typical spread of 10 to 12 beats either way and some people 20
            beats away. If your zones feel wrong in practice, for example if zone 2 feels like hard
            work or zone 4 feels easy, your true max is probably different from the estimate. A
            field test, done carefully, gives a better number.
          </p>
        </>
      ),
    },
    {
      heading: "Percentage of max versus Karvonen",
      body: (
        <>
          <p>
            The simplest method multiplies maximum heart rate by each zone's percentage. It works
            without any other information, but it ignores fitness. Two people with the same max but
            very different resting heart rates get the same zones, even though their easy and hard
            efforts sit at different heart rates.
          </p>
          <p>
            The Karvonen method, published by Martti Karvonen in 1957, uses heart rate reserve:
            maximum heart rate minus resting heart rate. Each zone is the resting rate plus a
            percentage of the reserve. For a 30-year-old with a max of 187 and a resting rate of 60,
            the reserve is 127 beats. Zone 2 at 60 to 70% becomes 60 + 76 to 60 + 89, or 136 to 149
            bpm, compared with 112 to 131 bpm on the simple method.
          </p>
          <p>
            Karvonen zones sit higher, especially in the lower zones, and tend to match how the
            effort feels for fitter people with low resting heart rates. For beginners, the simple
            percentage method often feels more comfortable in the easy zones. Pick the method that
            best matches your perceived effort, and keep using it.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring resting heart rate",
      body: (
        <>
          <p>
            Resting heart rate is easiest to measure in the morning, before you get out of bed and
            before coffee. Lie still for a minute, then count your pulse at the wrist or neck for 30
            seconds and double it, or read it from a chest strap or watch. Repeat on three or four
            mornings and use the average, because a single reading can move by five beats or more
            with sleep, stress, alcohol or a hard session the day before.
          </p>
          <p>
            Most adults sit between 60 and 80 beats per minute at rest. Endurance athletes often sit
            in the 40s or low 50s. A resting rate that rises by several beats above your usual for a
            few days in a row can be a sign of poor recovery, illness or stress, and is a reasonable
            cue to take an easier day.
          </p>
        </>
      ),
    },
    {
      heading: "How to train with zones",
      body: (
        <>
          <p>
            Most endurance coaches favour a polarised or pyramid distribution: a large share of
            training, often around 75 to 80%, in the easy zones 1 and 2, and a smaller share in
            zones 4 and 5. Zone 3 is used for some steady work but is easy to overuse, because it
            feels productive while being too hard to recover from quickly and not hard enough to
            drive top-end gains.
          </p>
          <ul>
            <li>
              <strong>Easy days:</strong> keep heart rate in zone 1 or 2 for the whole session, even
              if it means walking hills.
            </li>
            <li>
              <strong>Long sessions:</strong> mostly zone 2, with heart rate allowed to drift a few
              beats late in the session.
            </li>
            <li>
              <strong>Threshold sessions:</strong> intervals of 5 to 20 minutes in zone 4, with easy
              recovery between.
            </li>
            <li>
              <strong>VO2 max sessions:</strong> short intervals of 2 to 5 minutes in zone 5, with
              full recovery.
            </li>
          </ul>
          <p>
            For general fitness, two or three zone 2 sessions a week plus one harder session is a
            sound starting point.
          </p>
        </>
      ),
    },
    {
      heading: "Why heart rate drifts and lags",
      body: (
        <>
          <p>
            Heart rate takes a minute or two to catch up with a change in effort, so short intervals
            may finish before heart rate reaches the target zone. For intervals under two minutes,
            use pace or perceived effort instead.
          </p>
          <p>
            During long sessions, heart rate tends to rise slowly even at a steady pace, especially
            in heat or when dehydrated. This cardiac drift is normal. Heat, caffeine, stress, poor
            sleep and illness can all raise heart rate for the same effort, which is why a session
            can feel easier or harder than the number suggests. Use heart rate together with how the
            effort feels, not as the only guide.
          </p>
        </>
      ),
    },
    {
      heading: "Zones by age at a glance",
      body: (
        <>
          <p>
            Using Tanaka's formula and the simple percentage method, here is how zones shift with
            age. Add a resting heart rate in the calculator to see your Karvonen zones.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">Max HR</th>
                  <th scope="col">Z2 (60–70%)</th>
                  <th scope="col">Z4 (80–90%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>20</td>
                  <td>194 bpm</td>
                  <td>116–136 bpm</td>
                  <td>155–175 bpm</td>
                </tr>
                <tr>
                  <td>30</td>
                  <td>187 bpm</td>
                  <td>112–131 bpm</td>
                  <td>150–168 bpm</td>
                </tr>
                <tr>
                  <td>40</td>
                  <td>180 bpm</td>
                  <td>108–126 bpm</td>
                  <td>144–162 bpm</td>
                </tr>
                <tr>
                  <td>50</td>
                  <td>173 bpm</td>
                  <td>104–121 bpm</td>
                  <td>138–156 bpm</td>
                </tr>
                <tr>
                  <td>60</td>
                  <td>166 bpm</td>
                  <td>100–116 bpm</td>
                  <td>133–149 bpm</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Every zone falls by about five beats a decade. A 60-year-old's threshold zone sits close
            to a 20-year-old's tempo zone. That is normal, and it is why zones should be
            recalculated as clients age.
          </p>
        </>
      ),
    },
    {
      heading: "Heart rate, pace and perceived effort",
      body: (
        <>
          <p>
            Heart rate is one of three common ways to judge intensity. Pace or power tells you the
            work being done. Perceived effort, often on a 1 to 10 scale, tells you how hard it
            feels. Each has strengths: pace is precise for racing, heart rate is good for keeping
            easy days easy, and perceived effort works anywhere, with no device.
          </p>
          <p>
            Using them together catches problems that one alone misses. If heart rate is unusually
            high for an easy pace, the client may be tired, unwell, dehydrated or training in heat.
            If the pace feels much harder than usual at a normal heart rate, fatigue may be
            building. Teaching clients to note all three makes their training logs far more useful.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: setting zones for clients",
      body: (
        <>
          <p>
            Start new clients with formula-based zones and check them against perceived effort over
            the first two weeks. If a client reports that zone 2 feels hard, or that they can chat
            easily in zone 4, adjust the max or switch methods. Write the zone ranges into each
            session, not just the zone name, so the target is clear when they train.
          </p>
          <p>
            Recheck zones every few months. As fitness improves, resting heart rate often falls,
            which changes Karvonen zones, and a client may complete a race or hard session that
            reveals a higher max than the formula predicted.
          </p>
        </>
      ),
    },
    {
      heading: "Zones for different goals",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Weekly emphasis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>General health</td>
                  <td>150+ minutes in zones 2 and 3, some brief zone 4 efforts</td>
                </tr>
                <tr>
                  <td>Fat loss</td>
                  <td>Regular zone 2 sessions, daily walking, one harder session</td>
                </tr>
                <tr>
                  <td>5K or 10K race</td>
                  <td>Mostly zone 2, plus weekly zone 4 and zone 5 intervals</td>
                </tr>
                <tr>
                  <td>Half or full marathon</td>
                  <td>High zone 2 volume, long runs, steady zone 3 and some zone 4</td>
                </tr>
                <tr>
                  <td>Strength athletes</td>
                  <td>Two or three short zone 2 sessions for recovery and work capacity</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These are starting points. A coach will adjust the mix to the client's schedule, history
            and how they respond.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a heart rate monitor",
      body: (
        <>
          <p>
            Chest straps measure the heart's electrical signal and respond quickly to changes in
            effort. Wrist and arm monitors use light to detect blood flow, which works well at
            steady efforts but can lag or misread during intervals, cold weather or strength work.
            For zone training, either can work; for intervals and accurate peak readings, a chest
            strap is the better tool. Wear wrist monitors snug, just above the wrist bone, for the
            best results.
          </p>
        </>
      ),
    },
    {
      heading: "When to recalculate your zones",
      body: (
        <>
          <p>
            Recalculate when your resting heart rate changes by five beats or more, after a field
            test or race that shows a higher maximum, or every couple of years as you age. Also
            revisit zones if sessions consistently feel easier or harder than the zone suggests.
            Zones are a tool to guide effort, so they should match what you feel, not override it.
          </p>
          <p>
            Keep a note of the method and max you used, so you can compare training from one season
            to the next on the same scale.
          </p>
        </>
      ),
    },
    {
      heading: "A note on safety",
      body: (
        <>
          <p>
            Heart rate zones are for healthy adults. If you have a heart condition, high blood
            pressure, take medication that changes heart rate, or are returning after illness, speak
            to a doctor before using higher zones. Stop and seek advice if you feel chest pain,
            dizziness or an irregular heartbeat during exercise.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Use the result with your clients",
    body: (
      <>
        <p>
          Cardio numbers are most useful when they turn into a session a client can actually follow.
          Translate the result into something concrete: a heart rate range for this week's easy
          runs, a pace for the long run, a retest date for the field test. Put it in the plan, not
          only in a message, so the client sees it at the moment they train.
        </p>
        <p>
          Then review what came back. Ask clients to log the session with the numbers that matter,
          such as average heart rate, distance, time or how hard it felt, and compare them with the
          target. A pattern across three or four sessions tells you far more than one workout, and
          it gives you an honest basis for changing the plan.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Put the numbers into the plan",
    body: (
      <>
        <p>
          In Traiv you write each client's cardio and strength sessions with the targets that
          matter, and see what they logged in the app beside it. The plan and the evidence stay in
          one place.
        </p>
      </>
    ),
  },
  next: [
    { label: "Max heart rate calculator", href: "/tools/max-heart-rate-calculator" },
    { label: "Zone 2 heart rate calculator", href: "/tools/zone-2-heart-rate-calculator" },
    { label: "VO2 max calculator", href: "/tools/vo2-max-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "What are the five heart rate zones?",
      a: "Zone 1 recovery (50 to 60% of max), zone 2 aerobic (60 to 70%), zone 3 tempo (70 to 80%), zone 4 threshold (80 to 90%) and zone 5 VO2 max (90 to 100%).",
    },
    {
      q: "Which max heart rate formula does this calculator use?",
      a: "Tanaka, 208 − 0.7 × age, with the classic 220 − age shown for comparison. Both are averages and can be 10 to 20 bpm away from your real max.",
    },
    {
      q: "Should I use percentage of max or Karvonen?",
      a: "Karvonen uses your resting heart rate and often fits fitter people better. The simple method needs only age. Choose the one that matches how the efforts feel.",
    },
    {
      q: "How much time should I spend in each zone?",
      a: "Many coaches suggest around three quarters of training in zones 1 and 2, with the rest in harder zones. Zone 3 is useful but easy to overdo.",
    },
    {
      q: "Why does my heart rate go up during a steady run?",
      a: "Cardiac drift: heart rate rises slowly over long sessions, especially in heat or when dehydrated, even at the same pace.",
    },
    {
      q: "Are wrist heart rate monitors accurate enough?",
      a: "For steady sessions they are usually close. For intervals and fast changes, a chest strap is more accurate.",
    },
  ],
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Programme every client's training under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
