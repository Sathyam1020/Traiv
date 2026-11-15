import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Running pace calculator",
  description:
    "Work out your running pace per km and per mile, and your speed in km/h and mph, from any distance and time. See finish times at that pace for common races.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Running pace calculator",
  intro: (
    <>
      <p>
        Type in how far you ran and how long it took to get your pace per kilometre and per mile,
        your speed, and the finish times you would run at that pace over 5K, 10K, the half marathon
        and the marathon.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate my running pace?",
    answer: (
      <>
        <p>
          Divide your time by the distance. Running 10 km in 50:00 is 50 minutes ÷ 10 km = 5:00 per
          km, which equals 8:03 per mile, or 12.0 km/h (7.5 mph). At that pace, a 5K takes 25:00, a
          half marathon 1:45:29 and a marathon 3:30:59.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Pace and speed",
      body: (
        <>
          <p>
            Pace is the time it takes to cover a unit of distance, usually a kilometre or a mile.
            Speed is the distance covered in a unit of time, usually an hour. They are two ways of
            describing the same thing. Runners mostly think in pace, because it maps directly onto
            splits and race plans: a 5:00 per km pace means passing each kilometre marker five
            minutes after the last.
          </p>
          <p>
            Converting is simple. Pace in minutes per km equals 60 divided by speed in km/h. A speed
            of 12 km/h is a pace of 60 ÷ 12 = 5:00 per km. One mile is 1.609 km, so pace per mile is
            pace per km × 1.609. A 5:00 per km pace is 8:03 per mile.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Distance and time</th>
                  <th scope="col">Pace /km</th>
                  <th scope="col">Pace /mi</th>
                  <th scope="col">Speed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>5 km in 30:00</td>
                  <td>6:00</td>
                  <td>9:39</td>
                  <td>10.0 km/h</td>
                </tr>
                <tr>
                  <td>10 km in 50:00</td>
                  <td>5:00</td>
                  <td>8:03</td>
                  <td>12.0 km/h</td>
                </tr>
                <tr>
                  <td>Half marathon in 2:00:00</td>
                  <td>5:41</td>
                  <td>9:09</td>
                  <td>10.5 km/h</td>
                </tr>
                <tr>
                  <td>Marathon in 4:00:00</td>
                  <td>5:41</td>
                  <td>9:09</td>
                  <td>10.5 km/h</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A 2-hour half marathon and a 4-hour marathon happen to need the same pace, because the
            marathon is exactly twice the distance. For most runners, holding a 2-hour half marathon
            pace for the full marathon would be a major challenge.
          </p>
        </>
      ),
    },
    {
      heading: "Common pace targets",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Pace /km</th>
                  <th scope="col">Pace /mi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>30-minute 5K</td>
                  <td>6:00</td>
                  <td>9:39</td>
                </tr>
                <tr>
                  <td>25-minute 5K</td>
                  <td>5:00</td>
                  <td>8:03</td>
                </tr>
                <tr>
                  <td>20-minute 5K</td>
                  <td>4:00</td>
                  <td>6:26</td>
                </tr>
                <tr>
                  <td>1-hour 10K</td>
                  <td>6:00</td>
                  <td>9:39</td>
                </tr>
                <tr>
                  <td>50-minute 10K</td>
                  <td>5:00</td>
                  <td>8:03</td>
                </tr>
                <tr>
                  <td>2-hour half marathon</td>
                  <td>5:41</td>
                  <td>9:09</td>
                </tr>
                <tr>
                  <td>4-hour marathon</td>
                  <td>5:41</td>
                  <td>9:09</td>
                </tr>
                <tr>
                  <td>3:30 marathon</td>
                  <td>4:59</td>
                  <td>8:01</td>
                </tr>
                <tr>
                  <td>Sub-3 marathon</td>
                  <td>4:16</td>
                  <td>6:52</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Use these as reference points when setting goals. A target pace you have held in
            training for meaningful distances is far more realistic than one you have never run.
          </p>
        </>
      ),
    },
    {
      heading: "Why predicted race times are optimistic",
      body: (
        <>
          <p>
            The table in the calculator multiplies your pace by each race distance. That assumes you
            could hold the same pace for every distance, which few runners can. Pace naturally slows
            as races get longer, because fatigue builds and energy stores fall. A runner who covers
            10 km at 5:00 per km is more likely to run a half marathon at around 5:15 to 5:25 per km
            than at 5:00.
          </p>
          <p>
            For more realistic race predictions, the race time predictor on this site uses Riegel's
            formula, which adds time for longer distances. The pace calculator's table is best for
            answering a simpler question: if I run at this pace, what will my time be?
          </p>
        </>
      ),
    },
    {
      heading: "Using pace in training",
      body: (
        <>
          <p>
            Different sessions need different paces. Easy runs, which make up most of a runner's
            week, are usually 60 to 90 seconds per kilometre slower than 5K race pace, at a
            conversational effort. Threshold runs are a little slower than 10K pace. Intervals for
            VO2 max are around 3K to 5K pace. Long runs are often 30 to 90 seconds per kilometre
            slower than marathon goal pace.
          </p>
          <ul>
            <li>
              <strong>Easy:</strong> conversational, often 6:00 to 6:30 per km for a 25-minute 5K
              runner.
            </li>
            <li>
              <strong>Threshold:</strong> comfortably hard, around 5:10 to 5:20 per km.
            </li>
            <li>
              <strong>Intervals:</strong> hard, around 4:50 to 5:00 per km.
            </li>
            <li>
              <strong>Long run:</strong> relaxed, 6:00 to 6:45 per km.
            </li>
          </ul>
          <p>
            Many runners run their easy days too fast, which leaves them too tired to hit the right
            pace on hard days. A pace calculator helps set and stick to the right numbers.
          </p>
        </>
      ),
    },
    {
      heading: "Pacing a race",
      body: (
        <>
          <p>
            Even pacing, or a slightly faster second half, usually gives the best result. Starting
            too fast uses energy you'll need later, and the slow-down at the end costs more time
            than was gained. Break your target time into kilometre or mile splits, and aim to pass
            each marker within a few seconds of your target.
          </p>
          <p>
            Hills, wind and crowded starts all affect pace. On a hilly course, aim for even effort
            rather than even pace: slower uphill, faster downhill. In wind, run behind others where
            you can. In a crowded start, accept a slow first kilometre and make up the time
            gradually.
          </p>
        </>
      ),
    },
    {
      heading: "Treadmill pace and speed",
      body: (
        <>
          <p>
            Treadmills usually show speed in km/h or mph. To run a 5:00 per km pace, set 12 km/h;
            for 6:00 per km, set 10 km/h. In miles, 8:00 per mile is 7.5 mph. Many runners set a 1%
            incline to better match the effort of running outdoors, where wind resistance and varied
            ground add a little work.
          </p>
        </>
      ),
    },
    {
      heading: "Negative splits",
      body: (
        <>
          <p>
            A negative split means running the second half of a race faster than the first. It is
            how most world records are set, and it works for recreational runners too. Starting
            slightly under target pace saves energy, and finishing strong feels much better than
            fading.
          </p>
          <p>
            For a 50:00 10K, a negative split might be 25:15 for the first 5 km and 24:45 for the
            second, or 5:03 per km then 4:57 per km. The total is the same, but the race feels more
            controlled. Practise in training with progression runs, where each section is a little
            faster than the last.
          </p>
        </>
      ),
    },
    {
      heading: "Pace and heart rate together",
      body: (
        <>
          <p>
            Pace tells you how fast you are going; heart rate tells you how hard your body is
            working. On a hot, windy or hilly day, holding target pace may push heart rate much
            higher than usual. On those days, it is often better to run by effort or heart rate, and
            accept a slower pace.
          </p>
          <p>
            Over months, your pace at the same heart rate should improve. A runner who runs 6:30 per
            km at 140 bpm in January and 6:00 per km at 140 bpm in May has become fitter. Tracking
            both numbers gives a clear picture of progress.
          </p>
        </>
      ),
    },
    {
      heading: "Pace for walking and run-walk",
      body: (
        <>
          <p>
            Walking pace is usually between 9:00 and 12:00 per km, or 14:30 to 19:20 per mile. Brisk
            walking is around 9:00 to 10:00 per km. Run-walk methods, such as running for four
            minutes and walking for one, give an average pace between the two and are a good way to
            build up to continuous running or complete long races comfortably.
          </p>
          <p>
            Enter the total distance and time of a run-walk session to find your average pace. That
            average is the most useful number for planning races and comparing sessions.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: setting paces for clients",
      body: (
        <>
          <p>
            Use a recent race or time trial to set a client's training paces, and write them into
            each session as a range, such as 6:10 to 6:30 per km for easy runs. Ranges allow for
            hills, weather and how the client feels, while still giving clear guidance.
          </p>
          <p>
            Review logged paces each week. If easy runs are consistently faster than the range, the
            client may be running too hard on easy days. If interval paces are slower than target,
            the session may be too long or the client too tired. Small adjustments keep training on
            track.
          </p>
        </>
      ),
    },
    {
      heading: "Converting between km and miles",
      body: (
        <>
          <p>
            To convert pace per km to pace per mile, multiply by 1.609. To convert pace per mile to
            pace per km, divide by 1.609. A 6:00 per km pace is 9:39 per mile; an 8:00 per mile pace
            is 4:58 per km. The calculator shows both, so you can follow plans written in either
            unit.
          </p>
          <p>
            Race distances follow the same logic. A 5K is 3.11 miles, a 10K 6.21 miles, a half
            marathon 13.1 miles and a marathon 26.2 miles.
          </p>
        </>
      ),
    },
    {
      heading: "Pace on hills and trails",
      body: (
        <>
          <p>
            Hills change pace far more than effort. Running uphill at your usual flat pace takes a
            much higher effort, while downhill pace can be quicker for the same effort. On hilly
            routes, judge by effort or heart rate and accept slower uphill splits. Your average pace
            for a hilly run will be slower than for a flat run of the same effort.
          </p>
          <p>
            Trails add uneven ground, mud, rocks and technical sections, which slow pace further.
            Many trail runners ignore pace altogether and focus on time on feet and effort.
          </p>
        </>
      ),
    },
    {
      heading: "Using pace to plan a race",
      body: (
        <>
          <p>
            Decide your target time, then use the calculator to find the pace you need. For a 25:00
            5K, that is 5:00 per km. Break the race into segments: a controlled first kilometre,
            steady middle kilometres at target pace and a strong finish.
          </p>
          <p>
            Run some of your training at target race pace, so it feels familiar. If you can hold it
            comfortably for half the race distance in training, the full distance on race day is
            realistic.
          </p>
        </>
      ),
    },
    {
      heading: "Pace for beginners",
      body: (
        <>
          <p>
            If you are new to running, don't worry about pace at first. Run at an effort that lets
            you talk in full sentences, even if that means walking breaks. Your pace will improve
            naturally as fitness builds. Many beginners improve their 5K pace by a minute or more
            per kilometre in their first few months.
          </p>
          <p>
            Track your pace for the same route every few weeks. A faster time at the same effort is
            a clear sign of progress, and a good motivator.
          </p>
        </>
      ),
    },
    {
      heading: "Pace and cadence",
      body: (
        <>
          <p>
            Pace depends on cadence, the number of steps per minute, and stride length. Most runners
            naturally increase both as they speed up. Very low cadence with long, reaching strides
            can increase impact and injury risk. Many coaches suggest a modest increase in cadence,
            around 5 to 10%, for runners who overstride, without forcing a specific number.
          </p>
          <p>
            Small changes to cadence rarely change pace much on their own, but they can make running
            feel smoother and more efficient. Combine them with regular easy running and strength
            work for the best results.
          </p>
        </>
      ),
    },
    {
      heading: "A quick summary",
      body: (
        <>
          <ul>
            <li>
              <strong>Pace:</strong> time ÷ distance, in minutes per km or per mile.
            </li>
            <li>
              <strong>Speed:</strong> distance ÷ time, in km/h or mph.
            </li>
            <li>
              <strong>Convert:</strong> pace per mile = pace per km × 1.609.
            </li>
            <li>
              <strong>Race times:</strong> multiply pace by distance, remembering that pace usually
              slows over longer races.
            </li>
          </ul>
          <p>
            Use pace to plan sessions and races, check your splits and track progress on familiar
            routes.
          </p>
        </>
      ),
    },
    {
      heading: "Recording your runs",
      body: (
        <>
          <p>
            Log distance, time and average pace for each run, along with the route and how it felt.
            Comparing the same route every few weeks is the simplest way to see progress. Note the
            weather too: a slower run on a hot or windy day isn't a sign of lost fitness.
          </p>
        </>
      ),
    },
    {
      heading: "Pace and age",
      body: (
        <>
          <p>
            Pace naturally slows with age, by roughly 0.5 to 1% a year after the mid-30s for most
            runners. Age-graded scores let you compare your pace with standards for your age, which
            is a fairer measure of progress for older runners than raw pace.
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
    { label: "Race time predictor", href: "/tools/race-time-predictor" },
    { label: "Heart rate zone calculator", href: "/tools/heart-rate-zone-calculator" },
    { label: "Cooper test calculator", href: "/tools/cooper-test-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "How do I calculate running pace?",
      a: "Divide your time by the distance. Running 10 km in 50 minutes is 5:00 per km, or 8:03 per mile.",
    },
    {
      q: "How do I convert pace to speed?",
      a: "Divide 60 by your pace in minutes. A 5:00 per km pace is 60 ÷ 5 = 12 km/h.",
    },
    { q: "What pace is a 25-minute 5K?", a: "5:00 per km, or 8:03 per mile." },
    { q: "What pace do I need for a 4-hour marathon?", a: "About 5:41 per km, or 9:09 per mile." },
    {
      q: "Why are my race predictions faster than my actual times?",
      a: "The pace calculator assumes you hold the same pace for every distance. Most runners slow down as distance increases.",
    },
    {
      q: "What is a good running pace for beginners?",
      a: "Any pace that lets you run comfortably and keep a conversation. For many beginners, that is 6:30 to 8:00 per km or slower.",
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
