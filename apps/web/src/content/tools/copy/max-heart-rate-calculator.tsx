import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Max heart rate calculator",
  description:
    "Estimate maximum heart rate by age with the 220 − age, Tanaka and Gellish formulas. Add a resting rate to see your heart rate reserve.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Max heart rate calculator",
  intro: (
    <>
      <p>
        Enter your age to compare three maximum heart rate formulas side by side. Add a resting
        heart rate to see your heart rate reserve, and get zone 2 and threshold ranges to start
        training with.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate my maximum heart rate?",
    answer: (
      <>
        <p>
          Use an age-based formula. The classic rule is 220 − age; Tanaka is 208 − 0.7 × age;
          Gellish is 207 − 0.7 × age. For a 30-year-old these give 190, 187 and 186 bpm. For a
          50-year-old they give 170, 173 and 172 bpm.
        </p>
        <p>
          These are averages. Your real maximum may be 10 or more beats away, and only a hard field
          test or lab test measures it.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What maximum heart rate is",
      body: (
        <>
          <p>
            Your maximum heart rate is the ceiling: the fastest your heart will beat in a minute
            when you are working flat out. It is set largely by genetics and age, and it falls
            gradually through adult life, by roughly seven beats a decade. Training does not raise
            it in any meaningful way. A fit 50-year-old and an unfit 50-year-old may have similar
            maximum heart rates; what differs is how much work they can do before they reach it.
          </p>
          <p>
            Maximum heart rate is not a measure of fitness. A high max does not mean someone is
            fitter, and a low one does not mean they are less fit. It is a reference point that
            defines the top of the heart rate range, so that training zones can be set as fractions
            of it. That is why a reasonable estimate matters, even though the number itself says
            little about performance.
          </p>
        </>
      ),
    },
    {
      heading: "The three formulas",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Formula</th>
                  <th scope="col">Equation</th>
                  <th scope="col">Origin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fox (classic)</td>
                  <td>220 − age</td>
                  <td>A 1971 rule of thumb from a summary of earlier studies</td>
                </tr>
                <tr>
                  <td>Tanaka</td>
                  <td>208 − 0.7 × age</td>
                  <td>2001 meta-analysis of 351 studies and 18,712 people, confirmed in the lab</td>
                </tr>
                <tr>
                  <td>Gellish</td>
                  <td>207 − 0.7 × age</td>
                  <td>2007 long-term study of the same adults tested repeatedly</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            220 − age is the best known but the least precise. It was never derived from a formal
            study, and it tends to overestimate max heart rate in younger adults and underestimate
            it in older adults. Tanaka and Gellish come from much larger, more careful data sets and
            give very similar results, within a beat or two of each other.
          </p>
          <p>
            For a 20-year-old, the formulas give 200, 194 and 193 bpm. For a 60-year-old, they give
            160, 166 and 165 bpm. The gap between the classic rule and the newer formulas grows with
            age, which matters most for older clients whose zones would otherwise be set too low.
          </p>
        </>
      ),
    },
    {
      heading: "How far off can a formula be?",
      body: (
        <>
          <p>
            Age explains only part of the variation in maximum heart rate. In the studies behind
            these formulas, the standard deviation is about 10 to 12 beats. In practical terms,
            roughly two thirds of people of a given age have a max within 10 to 12 beats of the
            formula, and about one in twenty sits more than 20 beats away.
          </p>
          <p>
            That spread is large enough to matter. If a 40-year-old's true max is 195 bpm rather
            than the 180 that 220 − age suggests, every zone set from the formula will be about 10
            beats too low. Easy runs will feel very easy and threshold sessions will feel like tempo
            runs. The reverse happens for someone whose true max is below the formula.
          </p>
          <p>
            If a formula-based zone feels wrong over several sessions, trust the feeling and
            consider a field test.
          </p>
        </>
      ),
    },
    {
      heading: "Testing your maximum heart rate",
      body: (
        <>
          <p>
            A field test can find a better number, but it is demanding. Only do it if you are
            healthy, already training regularly and have no heart, lung or blood pressure concerns.
            If you are unsure, speak to a doctor first.
          </p>
          <ol>
            <li>
              Warm up for 15 minutes with easy running or cycling, building to a few short, faster
              efforts.
            </li>
            <li>
              Run or ride hard for three minutes, at an effort you could only just hold for that
              long.
            </li>
            <li>Recover easily for two minutes.</li>
            <li>
              Repeat the three-minute effort, building to an all-out finish over the last 30
              seconds.
            </li>
            <li>The highest heart rate recorded in the final minute is close to your maximum.</li>
            <li>Cool down for at least 10 minutes.</li>
          </ol>
          <p>
            A hill makes it easier to reach a true max without very high speed. A chest strap
            records the peak more accurately than a wrist monitor. Do the test fresh, after an easy
            day, and expect the number to be a few beats under your absolute max; most people stop
            short of it.
          </p>
        </>
      ),
    },
    {
      heading: "Heart rate reserve",
      body: (
        <>
          <p>
            Heart rate reserve is the gap between your maximum and resting heart rates. If your
            estimated max is 187 and your resting rate is 60, your reserve is 127 beats. The
            Karvonen method sets training zones as a share of this reserve, added back to the
            resting rate, which tends to match how efforts feel better than a share of max alone.
          </p>
          <p>
            Reserve does change with fitness, because resting heart rate falls as aerobic fitness
            improves. A fall in resting heart rate from 70 to 60 over a few months of training adds
            ten beats to the reserve and is one of the simplest signs that fitness is improving.
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
      heading: "Using max heart rate in training",
      body: (
        <>
          <p>
            Once you have a max, the next step is training zones. The calculator shows two of the
            most used: zone 2, at 60 to 70% of max, for aerobic base work, and zone 4, at 80 to 90%,
            for threshold sessions. For a 30-year-old using Tanaka, those are 112 to 131 and 150 to
            168 bpm. The heart rate zone calculator gives all five.
          </p>
          <p>
            Recalculate every few years as you age, or sooner if you get a tested max. Keep using
            the same formula or test result so that your zones stay consistent from one block of
            training to the next.
          </p>
        </>
      ),
    },
    {
      heading: "Factors that change heart rate on the day",
      body: (
        <>
          <ul>
            <li>
              <strong>Heat and humidity:</strong> raise heart rate for the same effort, sometimes by
              10 beats or more.
            </li>
            <li>
              <strong>Dehydration:</strong> reduces blood volume, so the heart beats faster to
              compensate.
            </li>
            <li>
              <strong>Caffeine and stimulants:</strong> can raise heart rate at rest and during
              exercise.
            </li>
            <li>
              <strong>Altitude:</strong> raises heart rate at submaximal effort in the first days at
              height.
            </li>
            <li>
              <strong>Fatigue, stress and illness:</strong> can push heart rate up or, after heavy
              training, blunt it.
            </li>
            <li>
              <strong>Medication:</strong> beta blockers and some other drugs lower heart rate and
              make formula zones unreliable.
            </li>
          </ul>
          <p>
            If you take medication that affects heart rate, ask your doctor how to judge exercise
            intensity; perceived effort is often a better guide.
          </p>
        </>
      ),
    },
    {
      heading: "Max heart rate by age",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">220 − age</th>
                  <th scope="col">Tanaka</th>
                  <th scope="col">Gellish</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>20</td>
                  <td>200</td>
                  <td>194</td>
                  <td>193</td>
                </tr>
                <tr>
                  <td>30</td>
                  <td>190</td>
                  <td>187</td>
                  <td>186</td>
                </tr>
                <tr>
                  <td>40</td>
                  <td>180</td>
                  <td>180</td>
                  <td>179</td>
                </tr>
                <tr>
                  <td>50</td>
                  <td>170</td>
                  <td>173</td>
                  <td>172</td>
                </tr>
                <tr>
                  <td>60</td>
                  <td>160</td>
                  <td>166</td>
                  <td>165</td>
                </tr>
                <tr>
                  <td>70</td>
                  <td>150</td>
                  <td>159</td>
                  <td>158</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The formulas agree closely around 40. Below that, the classic rule gives higher numbers;
            above it, lower ones. For a 70-year-old, the difference reaches nine beats, which shifts
            every training zone.
          </p>
        </>
      ),
    },
    {
      heading: "Why max heart rate falls with age",
      body: (
        <>
          <p>
            The decline is linked to changes in the heart's natural pacemaker, the sinoatrial node,
            and to reduced sensitivity to the hormones that speed the heart during exercise. These
            changes happen whether or not someone trains. Fit older adults keep a strong heart that
            pumps more blood with each beat, but their maximum beat rate still falls.
          </p>
          <p>
            This is one reason older athletes can stay remarkably fit. Aerobic capacity depends on
            both heart rate and how much blood the heart pumps with each beat, as well as how well
            muscles use oxygen. Training improves the latter two even as max heart rate declines.
          </p>
        </>
      ),
    },
    {
      heading: "Max heart rate in different sports",
      body: (
        <>
          <p>
            Your measured max can differ between activities. Running usually produces the highest
            heart rates, because it uses a lot of muscle and carries body weight. Cycling often
            produces a max a few beats lower, and swimming lower still, partly because of body
            position and water cooling. Rowing can approach running values.
          </p>
          <p>
            If you train in several sports, consider using sport-specific maximums, or set zones
            from running and adjust them down a few beats for cycling. A heart rate that is easy to
            reach on the run may be impossible on the bike.
          </p>
        </>
      ),
    },
    {
      heading: "What resting and maximum heart rate say about fitness",
      body: (
        <>
          <p>
            Resting heart rate is a better fitness signal than max. As aerobic fitness improves, the
            heart pumps more blood per beat, so it needs fewer beats at rest. A fall of five to ten
            beats over several months of training is common. Lower resting heart rate is also linked
            with lower risk of heart disease in large population studies.
          </p>
          <p>
            Heart rate recovery, how quickly heart rate falls after hard effort, is another useful
            sign. A drop of more than 12 beats in the first minute after stopping is considered
            normal; fitter people often drop by 20 or more. Both measures improve with training,
            while max stays largely unchanged.
          </p>
        </>
      ),
    },
    {
      heading: "When to see a doctor",
      body: (
        <>
          <p>
            See a doctor before starting vigorous exercise if you have chest pain, unexplained
            breathlessness, dizziness, a known heart condition, high blood pressure, diabetes, or a
            family history of early heart disease. Stop exercising and seek advice if you notice
            chest discomfort, palpitations, light-headedness or a heart rate that stays unusually
            high long after you stop.
          </p>
          <p>
            A very high heart rate at rest, an irregular pulse or a heart rate that jumps suddenly
            during exercise also warrant a check. A doctor can arrange an ECG or exercise test if
            needed.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: using max heart rate with clients",
      body: (
        <>
          <p>
            For most clients, a formula max is good enough to start. Use Tanaka for adults over 40,
            where the classic rule underestimates. Record which formula you used so zones stay
            consistent. Over the first few weeks, compare the client's logged heart rates with their
            perceived effort and adjust if they don't match.
          </p>
          <p>
            Reserve field tests for clients who are healthy, experienced and motivated to train by
            heart rate. For older clients, beginners and anyone with health concerns, perceived
            effort and the talk test are safer and nearly as useful. If a client is on medication
            that affects heart rate, base their training on effort rather than numbers.
          </p>
        </>
      ),
    },
    {
      heading: "Other formulas you may see",
      body: (
        <>
          <p>
            Several other equations exist. Nes and colleagues (2013) proposed 211 − 0.64 × age from
            a large Norwegian study of healthy adults. Some researchers have proposed separate
            formulas for women, such as Gulati's 206 − 0.88 × age, from a study of over 5,000 women.
            Each gives slightly different numbers, and none removes the individual spread of about
            10 beats.
          </p>
          <p>
            The calculator shows the three most widely used formulas. If a coach or programme you
            follow uses a different one, the differences are usually small compared with the natural
            variation between people. Consistency matters more than which formula you pick.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            Take a 45-year-old with a resting heart rate of 62. The classic rule gives 175 bpm,
            Tanaka 176.5 and Gellish 175.5, so all three agree at about 175 to 177. Using Tanaka,
            heart rate reserve is about 114.5 beats. Zone 2 by the simple method is 106 to 124 bpm;
            by Karvonen it is 131 to 142 bpm.
          </p>
          <p>
            If this client completes a hard hill test and sees a peak of 184 bpm, their real max is
            likely around 185. Their zones would then rise by about five to seven beats. That change
            matters: easy runs set from the formula would have been slightly too easy, and threshold
            intervals slightly too gentle.
          </p>
        </>
      ),
    },
    {
      heading: "Heart rate and medicines",
      body: (
        <>
          <p>
            Beta blockers slow the heart and blunt its response to exercise, often lowering both
            resting and maximum heart rate by 20 to 30%. Some calcium channel blockers have a
            similar effect. Thyroid medication, decongestants and stimulants can raise heart rate.
            For anyone taking these, age-based formulas do not apply.
          </p>
          <p>
            In these cases, use perceived exertion: moderate exercise feels like 4 to 6 out of 10,
            vigorous like 7 to 8. The talk test is also reliable. A doctor or cardiac rehabilitation
            team can provide personalised heart rate ranges if needed.
          </p>
        </>
      ),
    },
    {
      heading: "Common myths about max heart rate",
      body: (
        <>
          <ul>
            <li>
              <strong>Exceeding the formula is dangerous.</strong> Many healthy people reach heart
              rates above their age-predicted max. The formula is an average, not a limit.
            </li>
            <li>
              <strong>A lower max means lower fitness.</strong> Max heart rate does not predict
              performance. Elite athletes have a wide range of maximums.
            </li>
            <li>
              <strong>You should never train near your max.</strong> Short, hard intervals near max
              are a normal part of training for healthy, prepared people.
            </li>
            <li>
              <strong>Max heart rate is the same for every sport.</strong> Running often produces
              higher peaks than cycling or swimming.
            </li>
            <li>
              <strong>Fitter people have a higher max.</strong> Fitness lowers resting heart rate;
              max changes little.
            </li>
          </ul>
          <p>
            Understanding these points helps clients use heart rate data calmly and sensibly, rather
            than worrying about a number that is mostly set by age and genetics.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring heart rate accurately during exercise",
      body: (
        <>
          <p>
            Chest straps give the most reliable readings during hard efforts, because they measure
            the electrical signal directly. Optical sensors on the wrist can be thrown off by
            movement, sweat, cold skin and a loose fit, and sometimes lock onto running cadence
            instead of heart rate, giving a false high. If you see a sudden spike that doesn't match
            the effort, it is probably a sensor error rather than your heart.
          </p>
        </>
      ),
    },
    {
      heading: "Recording your result",
      body: (
        <>
          <p>
            Write down your estimated or tested max, the formula or test you used, and the date. Add
            your resting heart rate from the same week. These three facts let you, or a coach,
            rebuild your zones exactly at any time and compare training from one year to the next on
            the same scale. If you later test and find a different max, note the new number and the
            date rather than overwriting the old one, so changes stay traceable.
          </p>
        </>
      ),
    },
    {
      heading: "Max heart rate in children and teenagers",
      body: (
        <>
          <p>
            Young people have higher maximum heart rates than adults, often above 200 bpm, and the
            adult formulas are less reliable for them. For under-18s, effort-based guidance and the
            talk test are usually more practical than heart rate targets. School and club coaches
            often use perceived exertion for this reason.
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
    { label: "Heart rate zone calculator", href: "/tools/heart-rate-zone-calculator" },
    { label: "Zone 2 heart rate calculator", href: "/tools/zone-2-heart-rate-calculator" },
    { label: "VO2 max calculator", href: "/tools/vo2-max-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "What is a normal maximum heart rate?",
      a: "It depends mainly on age. Tanaka's formula gives about 187 bpm at 30, 173 at 50 and 166 at 60, with individuals commonly 10 to 12 beats either side.",
    },
    {
      q: "Is 220 minus age accurate?",
      a: "It is a rough guide. It tends to overestimate max in young adults and underestimate it in older adults. Tanaka and Gellish are based on better data.",
    },
    {
      q: "Can training increase my maximum heart rate?",
      a: "Not meaningfully. Training lowers resting heart rate and increases how much work you can do, but max is set mainly by genetics and age.",
    },
    {
      q: "Is a high maximum heart rate good?",
      a: "Not in itself. A high or low max is neither better nor worse; it is a reference point for setting zones, not a fitness measure.",
    },
    {
      q: "How do I find my real max heart rate?",
      a: "With a hard field test after a thorough warm-up, or a lab test. Only test if you are healthy and already training, and speak to a doctor if unsure.",
    },
    {
      q: "Why does my watch show a higher max than the formula?",
      a: "Your true max may be higher than average for your age, or the watch may have recorded a brief error. Check against a chest strap if you can.",
    },
    {
      q: "Does max heart rate differ for men and women?",
      a: "Only slightly. Some formulas suggest small sex differences, but age explains far more of the variation.",
    },
    {
      q: "What if I take beta blockers?",
      a: "They lower heart rate, so age-based formulas and zones will be too high. Use perceived effort and ask your doctor for guidance.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only, not medical advice. Maximal exercise tests are not suitable for
        everyone. Speak to a doctor before hard exercise if you have a heart condition, high blood
        pressure, take medication that affects heart rate, or are unsure.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Programme every client's training under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
