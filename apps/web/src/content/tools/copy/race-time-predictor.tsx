import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Race time predictor",
  description:
    "Predict your 1500 m, mile, 5K, 10K, half marathon and marathon times from one recent race, using Riegel's formula, with pace per km and per mile.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Race time predictor",
  intro: (
    <>
      <p>
        Enter a recent race distance and time to predict your equivalent times from 1500 m to the
        marathon. Each row shows the predicted time and the pace per kilometre and per mile to aim
        for.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I predict my race time at another distance?",
    answer: (
      <>
        <p>
          Apply Riegel's formula, T2 = T1 × (D2 ÷ D1)^1.06, with T1 the time you ran over distance
          D1. A 25:00 5K predicts a 10K in 52:07, a half marathon in 1:55:00 and a marathon in
          3:59:47.
        </p>
        <p>
          The exponent of 1.06 accounts for slowing down over longer distances. Predictions far
          beyond the race you entered are a best case, not a guarantee.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Riegel's formula",
      body: (
        <>
          <p>
            In 1977, the American engineer and runner Peter Riegel published a simple equation that
            described how race times grow with distance. He noticed that, across many sports and
            distances, time rose a little faster than distance. Doubling the distance more than
            doubled the time, by a consistent amount. His formula, T2 = T1 × (D2 ÷ D1)^1.06,
            captures that pattern with a single number, the exponent 1.06.
          </p>
          <p>
            Riegel later refined the work in a 1981 paper in American Scientist, comparing world
            records in running, swimming, cycling and walking. The 1.06 exponent fitted running
            records between about 3.5 minutes and 4 hours remarkably well. It has since become the
            most widely used race prediction formula, built into many calculators and training apps.
          </p>
        </>
      ),
    },
    {
      heading: "How the exponent works",
      body: (
        <>
          <p>
            If the exponent were 1.0, you would hold the same pace at every distance, and a 25:00 5K
            would predict a 50:00 10K. The exponent of 1.06 adds a little extra time for each
            increase in distance. Doubling the distance multiplies the time by 2^1.06, about 2.085,
            so the 10K prediction becomes 52:07.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Distance ratio</th>
                  <th scope="col">Time multiplier</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2× (5K to 10K)</td>
                  <td>2.085</td>
                </tr>
                <tr>
                  <td>4.22× (5K to half)</td>
                  <td>4.60</td>
                </tr>
                <tr>
                  <td>8.44× (5K to marathon)</td>
                  <td>9.59</td>
                </tr>
                <tr>
                  <td>2× (half to marathon)</td>
                  <td>2.085</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Some coaches use a slightly higher exponent, around 1.07 or 1.08, for less experienced
            runners, who tend to slow more over long distances. The calculator uses Riegel's
            original 1.06.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <p>From a 25:00 5K, the predictions are:</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Distance</th>
                  <th scope="col">Predicted time</th>
                  <th scope="col">Pace /km</th>
                  <th scope="col">Pace /mi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1500 m</td>
                  <td>6:59</td>
                  <td>4:39</td>
                  <td>7:29</td>
                </tr>
                <tr>
                  <td>1 mile</td>
                  <td>7:31</td>
                  <td>4:40</td>
                  <td>7:31</td>
                </tr>
                <tr>
                  <td>3K</td>
                  <td>14:33</td>
                  <td>4:51</td>
                  <td>7:48</td>
                </tr>
                <tr>
                  <td>5K</td>
                  <td>25:00 (your time)</td>
                  <td>5:00</td>
                  <td>8:03</td>
                </tr>
                <tr>
                  <td>10K</td>
                  <td>52:07</td>
                  <td>5:13</td>
                  <td>8:23</td>
                </tr>
                <tr>
                  <td>Half marathon</td>
                  <td>1:55:00</td>
                  <td>5:27</td>
                  <td>8:46</td>
                </tr>
                <tr>
                  <td>Marathon</td>
                  <td>3:59:47</td>
                  <td>5:41</td>
                  <td>9:09</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            From a 50:00 10K, the predictions are a 23:59 5K, a 1:50:19 half marathon and a 3:50:01
            marathon. Notice that the 10K runner's predicted 5K is a minute faster than the first
            runner's actual 5K, consistent with the 10K being a stronger performance.
          </p>
        </>
      ),
    },
    {
      heading: "Why predictions get less accurate with distance",
      body: (
        <>
          <p>
            Riegel's formula assumes that you are equally well trained for every distance. In
            practice, that is rarely true. A runner who trains for 5K races may have excellent speed
            but limited endurance; their marathon prediction assumes endurance they haven't built.
            Most recreational runners run slower in a marathon than a 5K-based prediction suggests,
            often by 5 to 10% or more.
          </p>
          <p>
            The marathon also brings challenges that shorter races don't: fuelling, hydration,
            glycogen depletion and the muscular fatigue of running for three or four hours. A 10K or
            half marathon result predicts a marathon much better than a 5K does. For the most
            reliable prediction, use a race no more than about four times shorter than your target.
          </p>
        </>
      ),
    },
    {
      heading: "Equivalent times, not targets",
      body: (
        <>
          <p>
            The predictions are best read as equivalent performances: the same fitness expressed
            across different distances. They show what a well-prepared runner of your fitness might
            achieve, given training for that distance. They are not a promise of what you will run
            if you enter a race tomorrow.
          </p>
          <p>
            Coaches use equivalent times in the same way as Jack Daniels' VDOT tables or similar
            systems: to compare races, set realistic goals and choose training paces. If your
            predicted marathon is 3:59:47 but you have never run more than 15 km, a first marathon
            target of around 4:15 to 4:30 may be more realistic, with the faster time as a
            longer-term goal.
          </p>
        </>
      ),
    },
    {
      heading: "Using predictions to set training paces",
      body: (
        <>
          <p>
            Your predicted times give useful training paces. Threshold runs are often done at
            roughly half marathon to 10K pace, VO2 max intervals at around 3K to 5K pace, and easy
            runs well slower than marathon pace. From a 25:00 5K, that suggests threshold work
            around 5:13 to 5:27 per km, intervals around 4:51 to 5:00 per km, and easy running from
            about 6:15 per km or slower.
          </p>
          <p>
            As fitness improves, update the input race and the paces with it. Racing or
            time-trialling every 6 to 12 weeks keeps the numbers current.
          </p>
        </>
      ),
    },
    {
      heading: "Other prediction methods",
      body: (
        <>
          <ul>
            <li>
              <strong>VDOT (Jack Daniels):</strong> tables based on oxygen cost, giving equivalent
              times and training paces.
            </li>
            <li>
              <strong>Cameron's formula:</strong> an alternative curve fitted to elite and age-group
              records.
            </li>
            <li>
              <strong>Marathon-specific models:</strong> some use weekly mileage or long-run history
              alongside a shorter race to predict the marathon more realistically.
            </li>
            <li>
              <strong>Age-grading:</strong> adjusts times for age and sex using world-record
              standards, useful for comparing performances.
            </li>
          </ul>
          <p>
            For most distances from 1500 m to the half marathon, these methods give results close to
            Riegel. They diverge most for the marathon, where training history matters most.
          </p>
        </>
      ),
    },
    {
      heading: "Getting a reliable input",
      body: (
        <>
          <p>
            The prediction is only as good as the race you enter. Use a recent, all-out effort on an
            accurately measured course, run in reasonable conditions. A parkrun or certified road
            race works well. A training run, a race on a hilly course or a race in heat will give
            slower predictions than your true fitness.
          </p>
          <p>
            If you have several recent results, enter each and compare. If a 10K predicts a faster
            half marathon than your 5K does, your endurance may be relatively strong; if the 5K
            predicts faster, your speed may be the stronger quality. That information can shape your
            training.
          </p>
        </>
      ),
    },
    {
      heading: "Predicting from a half marathon",
      body: (
        <>
          <p>
            A half marathon is the best single predictor of marathon fitness for most runners,
            because it tests sustained endurance over 90 minutes or more. From a 1:50:00 half
            marathon, Riegel predicts a marathon of about 3:49:21. From a 2:00:00 half, about
            4:10:12. Even so, many first-time marathoners run 5 to 10 minutes slower than these
            predictions, especially if their long runs have been shorter than about 30 km.
          </p>
          <p>
            For a marathon goal, combine the half marathon prediction with your training. If you
            have done several long runs of 30 to 35 km, consistent weekly mileage and practised
            fuelling, the prediction is a reasonable target. If not, add time.
          </p>
        </>
      ),
    },
    {
      heading: "Fitness versus training for a distance",
      body: (
        <>
          <p>
            The predictor tells you what your current fitness could produce at each distance, if you
            had trained specifically for it. Specific training changes which predictions you can
            actually achieve. A runner moving from 5K to the half marathon needs longer runs and
            more weekly volume. A runner moving from the marathon down to the 5K needs faster
            intervals and more speed work.
          </p>
          <p>
            This is why many runners find their predicted times are easier to hit at some distances
            than others. Your strongest distance is usually the one you train for most. Over time, a
            balanced plan brings the predictions and your actual results closer together.
          </p>
        </>
      ),
    },
    {
      heading: "How age and sex affect predictions",
      body: (
        <>
          <p>
            Riegel's formula applies equally to men and women and to runners of all ages, because it
            describes how time grows with distance rather than absolute speed. Some research
            suggests older runners and women slow slightly less over long distances than younger
            men, but the differences are small for most recreational runners.
          </p>
          <p>
            To compare performances across ages and sexes, age-grading is more useful. It expresses
            a time as a percentage of the world-record standard for your age and sex. A 25:00 5K is
            a stronger age-graded performance for a 60-year-old than for a 30-year-old, though
            Riegel predicts the same 10K time for both.
          </p>
        </>
      ),
    },
    {
      heading: "Conditions that change race times",
      body: (
        <>
          <ul>
            <li>
              <strong>Heat and humidity:</strong> can slow long races by several per cent; above
              about 20 °C, marathon times rise noticeably.
            </li>
            <li>
              <strong>Hills:</strong> a hilly course can add minutes to a half or full marathon.
            </li>
            <li>
              <strong>Wind:</strong> a headwind on exposed sections costs time that a tailwind
              doesn't fully return.
            </li>
            <li>
              <strong>Altitude:</strong> reduces oxygen availability and slows longer races.
            </li>
            <li>
              <strong>Course accuracy:</strong> GPS and course measurement differ; certified courses
              are the most reliable for comparison.
            </li>
          </ul>
          <p>
            When you enter a race into the predictor, consider how its conditions compare with your
            target race. A result from a cool, flat race will predict faster times than one from a
            hot, hilly race.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: using predictions with clients",
      body: (
        <>
          <p>
            Race predictions help set realistic goals and training paces. After a client races or
            time-trials, enter the result, review the predicted times together and choose a target
            for their next race. Explain that longer predictions assume training for that distance,
            and agree on a goal that reflects their current preparation.
          </p>
          <p>
            Use the predicted paces to write sessions: intervals at 3K to 5K pace, threshold work at
            10K to half marathon pace and easy runs well slower than marathon pace. Update the input
            race every 6 to 12 weeks so the paces keep pace with improving fitness.
          </p>
        </>
      ),
    },
    {
      heading: "A worked training example",
      body: (
        <>
          <p>
            Take a runner with a 25:00 5K preparing for a 10K in 12 weeks. Riegel predicts 52:07, or
            5:13 per km. A realistic goal might be 52 to 53 minutes. Their week could include one
            interval session of 5 × 1 km at 4:55 to 5:00 per km, one threshold run of 20 minutes at
            about 5:15 per km, a long run of 10 to 14 km at around 6:15 per km, and two easy runs.
          </p>
          <p>
            After six weeks, they run another 5K in 24:15. The new prediction for 10K is 50:34, and
            their training paces drop by about 10 to 15 seconds per kilometre. This is how
            predictions and training paces evolve together through a training block.
          </p>
        </>
      ),
    },
    {
      heading: "Ultra-distance and very short races",
      body: (
        <>
          <p>
            Riegel's 1.06 exponent fits races from roughly 3.5 minutes to 4 hours. Beyond the
            marathon, in ultra-marathons, runners slow much more than the formula predicts, because
            of fatigue, terrain, fuelling and walking breaks. For very short races such as the 400 m
            and 800 m, sprint speed and anaerobic capacity play a larger role, and the formula is
            less reliable.
          </p>
          <p>
            For these distances, use specialised tables or your own race history instead. The
            predictor works best from 1500 m to the marathon.
          </p>
        </>
      ),
    },
    {
      heading: "Pacing your target race",
      body: (
        <>
          <p>
            Once you have a target time, turn it into splits. For a 52:07 10K, that is 5:13 per km,
            or about 26:03 at halfway. Aim to run the first kilometre no faster than target pace,
            settle in, and pick up the pace in the final 2 to 3 km if you feel strong.
          </p>
          <p>
            For a marathon, an even or slightly negative split is the goal. Starting even 10 seconds
            per kilometre too fast can cost minutes in the final 10 km. Practise target pace in
            training so it feels familiar on race day.
          </p>
        </>
      ),
    },
    {
      heading: "How often to update your predictions",
      body: (
        <>
          <p>
            Re-run the predictor whenever you set a new best or complete a race in good conditions.
            During a structured training block, a time trial every 6 to 8 weeks keeps predictions
            and paces current. If a race goes badly because of heat, illness or a poor start, don't
            let it lower your training paces; wait for a better result.
          </p>
        </>
      ),
    },
    {
      heading: "Common questions about predictions",
      body: (
        <>
          <ul>
            <li>
              <strong>Should I use my best ever time?</strong> Use a recent result that reflects
              your current fitness, ideally from the last two to three months.
            </li>
            <li>
              <strong>What if I only have a parkrun time?</strong> A parkrun is a 5K and works well,
              as long as you ran it hard and the course is accurate.
            </li>
            <li>
              <strong>Can I predict a trail race?</strong> Not reliably. Elevation, surface and
              technical terrain change times far more than distance alone.
            </li>
            <li>
              <strong>Why do predictions differ between apps?</strong> Some use different exponents
              or methods such as VDOT. Differences are usually small up to the half marathon.
            </li>
          </ul>
          <p>
            If two methods give different marathon predictions, the slower one is usually the safer
            target for a first attempt.
          </p>
        </>
      ),
    },
    {
      heading: "A summary",
      body: (
        <>
          <p>
            Riegel's formula, T2 = T1 × (D2 ÷ D1)^1.06, turns one race into equivalent times at
            other distances. It works best for races of similar length and assumes training for each
            distance. Use a recent, all-out result on an accurate course, treat long-distance
            predictions as a best case, and update them as your fitness improves.
          </p>
          <p>
            Used this way, a race time predictor helps set realistic goals, choose training paces
            and plan race-day splits, with fewer surprises on the start line.
          </p>
        </>
      ),
    },
    {
      heading: "Predictions and race-day decisions",
      body: (
        <>
          <p>
            On race day, the prediction becomes a pacing plan. Check the weather and course; if it
            is hot or hilly, start 5 to 10 seconds per kilometre slower than target and adjust as
            you go. If you feel strong past halfway, increase the pace gradually rather than
            surging. A prediction is a guide to what is possible, but your body on the day has the
            final say.
          </p>
        </>
      ),
    },
    {
      heading: "Predictions for the mile and 1500 m",
      body: (
        <>
          <p>
            Shorter predictions from a longer race tend to be conservative for runners with good
            speed and optimistic for runners who mostly train for endurance. A marathoner who rarely
            runs fast may find their predicted mile time hard to reach, because the mile relies
            heavily on anaerobic capacity and running economy at high speed.
          </p>
          <p>
            If you want to race a mile or 1500 m, include short, fast repetitions such as 200 m and
            400 m at mile pace, with full recovery, for several weeks before the race. That speed
            work often brings your actual time close to, or faster than, the prediction.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking progress with predictions",
      body: (
        <>
          <p>
            Keep a log of each race or time trial and the predictions it gives. Over a season, you
            can see how your fitness changes at every distance from a handful of results. If
            predictions from your recent 5K and 10K are converging, your training is balanced; if
            one lags, it shows which quality, speed or endurance, needs more attention.
          </p>
          <p>
            For coaches, a simple table of a client's results and predictions over time is one of
            the clearest ways to show progress and explain changes to the plan.
          </p>
        </>
      ),
    },
    {
      heading: "When a prediction feels too slow",
      body: (
        <>
          <p>
            If your predicted time at a shorter distance looks slower than you expect, your input
            race may have been held back by conditions, pacing or fatigue. It may also mean that
            speed is a relative weakness. A few weeks of shorter, faster intervals often bring
            short-race times ahead of the prediction. Run a short time trial after that block and
            enter the new result to see how the predictions change across every distance.
          </p>
        </>
      ),
    },
    {
      heading: "Predictions for walkers",
      body: (
        <>
          <p>
            Riegel's formula was fitted to running and race walking records, so it also works
            reasonably for walkers. A walker who completes 5 km in 45 minutes would get a predicted
            10 km of about 1:33:49. Walkers tend to slow less over distance than runners, so long
            walking predictions can be closer to reality than long running predictions.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use your result with ChatGPT",
    whenToUse: "After entering a recent race and reviewing your predicted times.",
    pasteIn: "Paste your race result, predictions and training history.",
    text: `I recently ran [distance] in [time]. Riegel's formula predicts [10K time], [half marathon time] and [marathon time]. I currently run [weekly distance] over [number] sessions a week, with a longest run of [long run]. My target race is [race] on [date]. Explain how realistic the prediction is for my target, given my training. Suggest a goal time, the paces I should use for easy runs, threshold sessions and intervals, and the main changes my training needs before race day. List questions for my coach.`,
  },
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
    { label: "Running pace calculator", href: "/tools/running-pace-calculator" },
    { label: "VO2 max calculator", href: "/tools/vo2-max-calculator" },
    { label: "Heart rate zone calculator", href: "/tools/heart-rate-zone-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "How accurate are race time predictions?",
      a: "For distances close to your input race, often within a few per cent. For much longer races, especially the marathon, predictions are usually optimistic unless you have trained for that distance.",
    },
    {
      q: "What is Riegel's formula?",
      a: "T2 = T1 × (D2 ÷ D1)^1.06. It predicts a time at a new distance from a known time, adding extra time for longer races.",
    },
    {
      q: "What will my marathon time be from my 5K?",
      a: "From a 25:00 5K, Riegel predicts 3:59:47. Most recreational runners run slower in their first marathon, so treat it as a best case.",
    },
    {
      q: "Which race should I use for a marathon prediction?",
      a: "A half marathon or 10K predicts the marathon much better than a 5K or mile.",
    },
    {
      q: "Why is my predicted pace slower for longer races?",
      a: "Pace naturally falls with distance as fatigue builds. The 1.06 exponent accounts for this.",
    },
    {
      q: "Can I use a training run?",
      a: "It's better to use a race or time trial at full effort. Training runs usually give slower predictions than your true fitness.",
    },
    {
      q: "Can I use an AI assistant to plan from my predictions?",
      a: "Yes, to draft a training plan for your coach. Share your race, predictions, weekly mileage and target race, and ask for realistic goals.",
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
