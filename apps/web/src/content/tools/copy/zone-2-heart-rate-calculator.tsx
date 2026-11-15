import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Zone 2 heart rate calculator",
  description:
    "Find your zone 2 heart rate range by % of max, the Karvonen heart rate reserve method or the MAF 180 formula, with a talk test to check it.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Zone 2 heart rate calculator",
  intro: (
    <>
      <p>
        Enter your age and resting heart rate to find your zone 2 range. Compare three methods,
        percentage of max, Karvonen and MAF, and add a tested maximum if you have one.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate my zone 2 heart rate?",
    answer: (
      <>
        <p>
          The most common method is 60 to 70% of maximum heart rate, with max estimated as 220 −
          age. For a 40-year-old that is 180 × 0.6 to 0.7, or 108 to 126 bpm. Karvonen, using a
          resting rate of 60, gives 132 to 144 bpm. The MAF method gives a ceiling of 180 − 40 = 140
          bpm, with a range of 130 to 140.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What zone 2 is",
      body: (
        <>
          <p>
            Zone 2 is steady, easy aerobic exercise: hard enough to raise your breathing and heart
            rate, easy enough to keep going for a long time while holding a conversation. It is the
            effort of a relaxed jog, a brisk walk uphill or an easy ride where you could chat with a
            partner. In laboratory terms, it sits around or just below the first lactate threshold,
            the point where lactate in the blood starts to rise above resting levels.
          </p>
          <p>
            At this intensity the body relies mainly on fat and aerobic metabolism to produce
            energy. Training here builds the systems that support all endurance performance: more
            mitochondria in muscle cells, more capillaries delivering blood, a stronger heart and
            better use of fat as fuel. These adaptations take time, which is why zone 2 work is done
            in longer, frequent sessions.
          </p>
        </>
      ),
    },
    {
      heading: "Three ways to calculate it",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Age 40, resting 60</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>% of max HR</td>
                  <td>60 to 70% of (220 − age)</td>
                  <td>108 to 126 bpm</td>
                </tr>
                <tr>
                  <td>Karvonen</td>
                  <td>Resting + 60 to 70% of (max − resting)</td>
                  <td>132 to 144 bpm</td>
                </tr>
                <tr>
                  <td>MAF</td>
                  <td>180 − age as the ceiling, 10 beats below as the floor</td>
                  <td>130 to 140 bpm</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The percentage-of-max method is simple but ignores fitness. Karvonen adds the resting
            heart rate, which lifts the range for fitter people with low resting rates. Phil
            Maffetone's MAF method takes 180 minus age as an aerobic ceiling, with adjustments he
            recommends for illness, injury, beginners and very consistent athletes. The calculator
            uses the basic MAF figure.
          </p>
          <p>
            The methods disagree by design: they come from different coaching traditions and
            different definitions of zone 2. None is definitively right. Use the talk test to choose
            the one that matches your experience.
          </p>
        </>
      ),
    },
    {
      heading: "The talk test",
      body: (
        <>
          <p>
            The simplest check of zone 2 is whether you can talk. At the right effort, you can speak
            in full sentences, though you would notice your breathing. If you can only manage a few
            words at a time, you are above zone 2. If you could sing, you are probably below it.
          </p>
          <p>
            Research comparing the talk test with laboratory measures has found it a reliable marker
            of the first ventilatory threshold, which sits close to the top of zone 2. That makes it
            a valuable cross-check when a formula gives a number that feels too easy or too hard.
            Over time, many people learn to recognise zone 2 effort without looking at a watch.
          </p>
        </>
      ),
    },
    {
      heading: "Why zone 2 matters",
      body: (
        <>
          <p>
            For endurance athletes, zone 2 builds the aerobic base that supports faster work. Elite
            runners, cyclists and rowers often spend 75 to 80% of their training time at low
            intensity. That volume of easy work allows them to recover and absorb the harder
            sessions that make up the rest.
          </p>
          <p>
            For general health, regular moderate aerobic exercise is linked with lower risk of heart
            disease, type 2 diabetes and early death. Zone 2 sessions fit within the widely
            recommended 150 to 300 minutes of moderate activity a week. They are also easier to
            recover from than hard sessions, so they can be done more often, and they are accessible
            to people of most fitness levels.
          </p>
        </>
      ),
    },
    {
      heading: "How much zone 2 to do",
      body: (
        <>
          <p>
            A common starting point is two to four sessions a week of 30 to 60 minutes, building
            towards longer sessions over months. Endurance athletes may do much more, with sessions
            of two hours or longer. The key is consistency: zone 2 adaptations build over weeks and
            months of regular work.
          </p>
          <ul>
            <li>
              <strong>Beginners:</strong> two or three sessions of 20 to 30 minutes, walking if
              needed to stay in zone.
            </li>
            <li>
              <strong>Regular exercisers:</strong> three or four sessions of 40 to 60 minutes, plus
              one harder session.
            </li>
            <li>
              <strong>Endurance athletes:</strong> most weekly volume in zone 2, with one or two
              hard sessions.
            </li>
          </ul>
          <p>
            Walking uphill, cycling, rowing, swimming and elliptical training all work. Choose
            activities that let you hold a steady effort.
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
      heading: "Common zone 2 mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Going too hard.</strong> Zone 2 often feels too easy at first, and many people
              drift into zone 3.
            </li>
            <li>
              <strong>Ignoring drift.</strong> Heart rate rises slowly during long sessions; slow
              down to stay in range.
            </li>
            <li>
              <strong>Using short intervals.</strong> Zone 2 benefits come from sustained,
              continuous effort.
            </li>
            <li>
              <strong>Judging by pace.</strong> Pace in zone 2 varies with heat, hills and fatigue.
              Follow heart rate and the talk test.
            </li>
            <li>
              <strong>Expecting fast results.</strong> Aerobic adaptations take weeks to show.
            </li>
          </ul>
          <p>
            For many runners, staying in zone 2 means running more slowly than they expect, or
            walking hills, at least at first. Over months, the pace at the same heart rate usually
            improves, which is one of the clearest signs that aerobic fitness is growing.
          </p>
        </>
      ),
    },
    {
      heading: "Zone 2 by age",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">% of max (220 − age)</th>
                  <th scope="col">MAF (180 − age)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>25</td>
                  <td>117–137 bpm</td>
                  <td>145–155 bpm</td>
                </tr>
                <tr>
                  <td>35</td>
                  <td>111–130 bpm</td>
                  <td>135–145 bpm</td>
                </tr>
                <tr>
                  <td>45</td>
                  <td>105–123 bpm</td>
                  <td>125–135 bpm</td>
                </tr>
                <tr>
                  <td>55</td>
                  <td>99–116 bpm</td>
                  <td>115–125 bpm</td>
                </tr>
                <tr>
                  <td>65</td>
                  <td>93–109 bpm</td>
                  <td>105–115 bpm</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            MAF ranges sit higher than the simple percentage method at every age. Karvonen ranges
            depend on resting heart rate and often fall between the two. Your own zone 2 is the
            range where the talk test holds.
          </p>
        </>
      ),
    },
    {
      heading: "Zone 2 and metabolic health",
      body: (
        <>
          <p>
            Zone 2 has drawn attention for its effects on metabolic health. Regular moderate aerobic
            exercise improves insulin sensitivity, helps muscles take up glucose from the blood, and
            increases the number and function of mitochondria. These changes are linked with lower
            risk of type 2 diabetes and heart disease.
          </p>
          <p>
            Many of these benefits come from regular moderate activity in general, not only from
            staying in a precise heart rate band. Brisk walking, easy cycling and steady swimming
            all count. The value of a zone 2 target is that it keeps the effort easy enough to do
            often, which is what drives the long-term change.
          </p>
        </>
      ),
    },
    {
      heading: "Zone 2 versus higher intensity",
      body: (
        <>
          <p>
            Harder training, such as intervals in zones 4 and 5, improves VO2 max more quickly than
            zone 2 alone. But it is more tiring, harder to recover from and less suitable for daily
            use. Most well-designed plans combine both: a large base of easy work with one or two
            harder sessions a week.
          </p>
          <p>
            For beginners, most fitness gains will come from simply doing more moderate exercise,
            and zone 2 is an easy way to structure that. As fitness improves, adding a weekly
            session of harder intervals accelerates progress.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking zone 2 progress",
      body: (
        <>
          <p>
            One of the best ways to see aerobic progress is to track pace or power at a fixed zone 2
            heart rate. Run or ride a familiar route every two to four weeks, keeping heart rate in
            the same range, and note the pace. Over months, most people see their zone 2 pace
            improve noticeably.
          </p>
          <p>
            Another sign is heart rate drift. Early on, heart rate may climb several beats during a
            long zone 2 session. As fitness builds, it stays steadier for longer. Both changes show
            the aerobic system is adapting.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: programming zone 2",
      body: (
        <>
          <p>
            Write zone 2 sessions with both the heart rate range and the talk test as cues, so
            clients have a fallback when the watch reads oddly. Expect new clients to need reminding
            to slow down; many feel they are not working hard enough. Explain the reason, and show
            them their pace improving at the same heart rate over time.
          </p>
          <p>
            Review heart rate logs after each zone 2 session. If average heart rate sits above the
            range, the client is going too hard; if well below, the range may be set too high for
            them. Adjust the method or max as needed.
          </p>
        </>
      ),
    },
    {
      heading: "Zone 2 for different activities",
      body: (
        <>
          <p>
            Zone 2 heart rate is a few beats lower in cycling and swimming than in running for the
            same effort, because less muscle mass is working against gravity. If you set your zone
            from running, you may find it hard to reach on the bike; aim for the lower end of the
            range, or trust the talk test.
          </p>
          <p>
            Walking uphill, especially on a treadmill incline, is one of the easiest ways for
            beginners to hold zone 2 without running. Rowing and elliptical machines also work well.
            Choose an activity you can sustain at a steady effort for 30 minutes or more.
          </p>
        </>
      ),
    },
    {
      heading: "A sample zone 2 week",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Session</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monday</td>
                  <td>45 minutes zone 2 run or ride</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>Strength training</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>30 minutes zone 2, plus 4 × 4 minutes in zone 4</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>Rest or easy walk</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>45 minutes zone 2</td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>Strength training</td>
                </tr>
                <tr>
                  <td>Sunday</td>
                  <td>60 to 90 minutes zone 2</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            This week includes about three hours of zone 2 and one harder session, a common balance
            for people training for health and endurance. Fewer sessions still bring benefits; the
            key is regular, easy aerobic work.
          </p>
        </>
      ),
    },
    {
      heading: "When the methods give very different numbers",
      body: (
        <>
          <p>
            For some people, the percentage-of-max range and the MAF range barely overlap. A
            30-year-old with a resting heart rate of 50 gets 114 to 133 bpm by percentage of max,
            134 to 148 by Karvonen and 140 to 150 by MAF. These differences reflect different
            definitions of zone 2, from conservative to generous.
          </p>
          <p>
            Start with the lowest range that still lets you hold a steady effort, then check against
            the talk test. If you can easily sing at the top of the range, move up to the next
            method. Over time, a lab or field test can pin down your first lactate or ventilatory
            threshold more precisely.
          </p>
        </>
      ),
    },
    {
      heading: "Is zone 2 the same as the fat-burning zone?",
      body: (
        <>
          <p>
            Gym machines often label a fat-burning zone at a similar intensity. At zone 2 effort, a
            larger share of energy comes from fat than at higher intensities. Total calories,
            though, are higher at harder efforts. For body fat, total energy balance across the week
            matters most; zone 2 is useful because it can be done often without much fatigue.
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
    { label: "Max heart rate calculator", href: "/tools/max-heart-rate-calculator" },
    { label: "Interval walking calculator", href: "/tools/interval-walking-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "What is my zone 2 heart rate?",
      a: "Commonly 60 to 70% of maximum heart rate. For a 40-year-old using 220 − age, that is 108 to 126 bpm. Karvonen and MAF give higher ranges.",
    },
    {
      q: "Which zone 2 method is best?",
      a: "None is definitively right. Use the one that matches the talk test: in zone 2 you can speak in full sentences.",
    },
    {
      q: "Why is my zone 2 pace so slow?",
      a: "Aerobic fitness takes time to build. Many people start slower than they expect; pace at the same heart rate improves over months.",
    },
    {
      q: "How long should zone 2 sessions be?",
      a: "Usually 30 to 60 minutes for general fitness, building to longer sessions for endurance goals.",
    },
    {
      q: "Is zone 2 good for fat loss?",
      a: "It burns a high share of fat during the session and is easy to recover from, so it supports fat loss alongside diet. Total energy balance matters most.",
    },
    {
      q: "What is the MAF method?",
      a: "Phil Maffetone's approach uses 180 − age as an aerobic ceiling, with adjustments for health and training history.",
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
