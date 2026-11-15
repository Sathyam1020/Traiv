import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Interval walking calculator",
  description:
    "Calculate calories for Japanese interval walking or a custom brisk and easy walking session, and compare it with a steady walk of the same length.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Interval walking calculator",
  intro: (
    <>
      <p>
        Plan a Japanese walking session, three minutes brisk and three minutes easy repeated five
        times, or set your own intervals. See calories for each part, a steady-walk comparison and
        your weekly total.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How many calories does Japanese interval walking burn?",
    answer: (
      <>
        <p>
          At 175 lb (79 kg), a 30-minute session of five rounds of three minutes fast (4.0 mph) and
          three minutes comfortable (2.5 mph) burns about 167 calories: 104 in the brisk intervals
          and 63 in the easy ones. A steady 3 mph walk for the same 30 minutes burns about 146. Four
          sessions a week add up to about 667 calories.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What Japanese interval walking is",
      body: (
        <>
          <p>
            Interval walking training, often called Japanese walking, alternates three minutes of
            fast walking with three minutes of slow walking, repeated for about 30 minutes. It was
            developed by Hiroshi Nose and colleagues at Shinshu University in Matsumoto, Japan, as a
            practical way for middle-aged and older adults to improve fitness without a gym.
          </p>
          <p>
            In the original protocol, the fast intervals are at about 70% of each person's peak
            aerobic capacity, a pace that feels somewhat hard, and the slow intervals at about 40%,
            a comfortable stroll. Participants aim for at least five sets per session and at least
            four days a week. The simplicity is the point: it needs only a watch and a place to
            walk.
          </p>
        </>
      ),
    },
    {
      heading: "What the research found",
      body: (
        <>
          <p>
            In a five-month study published in 2007, Nose's team compared interval walking with
            continuous moderate walking in adults aged around 60. The interval group improved their
            aerobic capacity and thigh muscle strength more, and saw larger falls in blood pressure.
            The continuous walking group, despite walking for similar time, saw smaller changes.
          </p>
          <p>
            Later studies in Japan and elsewhere, including people with type 2 diabetes, have
            generally supported these benefits, particularly for blood pressure, blood sugar control
            and fitness. The method has been used with thousands of participants in community
            programmes in Matsumoto. Its main advantage is not extra calories but a stronger
            training effect for the same time spent walking.
          </p>
        </>
      ),
    },
    {
      heading: "How the calculator works",
      body: (
        <>
          <p>
            The calculator uses MET values, multiples of resting energy use, from the Compendium of
            Physical Activities, a widely used reference that lists energy costs for hundreds of
            activities. Calories per minute are MET × 3.5 × body weight in kg ÷ 200.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Walking pace</th>
                  <th scope="col">MET</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Stroll, 2.0 mph (3.2 km/h)</td>
                  <td>2.8</td>
                </tr>
                <tr>
                  <td>Comfortable, 2.5 mph (4.0 km/h)</td>
                  <td>3.0</td>
                </tr>
                <tr>
                  <td>Steady, 3.0 mph (4.8 km/h)</td>
                  <td>3.5</td>
                </tr>
                <tr>
                  <td>Brisk, 3.5 mph (5.6 km/h)</td>
                  <td>4.3</td>
                </tr>
                <tr>
                  <td>Fast, 4.0 mph (6.4 km/h)</td>
                  <td>5.0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            It multiplies each pace's calories per minute by the time spent at that pace, adds the
            two, and compares the total with a steady 3 mph walk for the same duration. The weekly
            figure multiplies the session total by the number of sessions.
          </p>
        </>
      ),
    },
    {
      heading: "Worked example",
      body: (
        <>
          <p>
            Take someone weighing 175 lb, or 79.4 kg. At 4.0 mph, 5.0 METs gives 5.0 × 3.5 × 79.4 ÷
            200 = 6.9 calories a minute. Fifteen minutes of fast intervals is about 104 calories. At
            2.5 mph, 3.0 METs gives 4.2 calories a minute, so fifteen minutes of easy intervals is
            about 63 calories. The session total is about 167 calories.
          </p>
          <p>
            A steady walk at 3.0 mph for 30 minutes, at 3.5 METs, burns about 146 calories. The
            interval session burns about 21 more, roughly 15%. Over four sessions a week, the
            interval sessions total about 667 calories.
          </p>
          <p>
            Choosing the brisk 3.5 mph option and a 2.0 mph stroll lowers the session to about 148
            calories, barely more than steady walking. The fast intervals are where the extra
            effort, and most of the training benefit, comes from.
          </p>
        </>
      ),
    },
    {
      heading: "How fast is fast?",
      body: (
        <>
          <p>
            In the research, fast intervals were set at about 70% of each person's measured peak
            aerobic capacity. Without a lab test, use effort: the fast intervals should feel
            somewhat hard, around 6 or 7 on a 10-point scale. Breathing becomes noticeably heavier,
            and you can speak only in short phrases. The slow intervals should feel easy, around 3
            out of 10.
          </p>
          <p>
            For many people, fast means 4 mph or a little more, a pace close to the transition to
            jogging. Older or less fit walkers may reach the right effort at 3.5 mph, or on a slight
            incline. Arms swinging and a slightly shorter, quicker stride help increase speed
            without strain.
          </p>
        </>
      ),
    },
    {
      heading: "Fitting it into a week",
      body: (
        <>
          <ul>
            <li>
              <strong>Start with three sessions a week</strong> of three to five rounds, then build
              to four or more sessions of five rounds.
            </li>
            <li>
              <strong>Warm up</strong> with a few minutes of easy walking before the first fast
              interval.
            </li>
            <li>
              <strong>Use a timer</strong> with a beep at each change, so you don't need to watch
              the clock.
            </li>
            <li>
              <strong>Choose a flat, safe route</strong> at first; hills can be added later for
              extra challenge.
            </li>
            <li>
              <strong>Combine with strength training</strong> twice a week for the broadest health
              benefits.
            </li>
          </ul>
          <p>
            Japanese walking suits people who find running hard on the joints, are returning to
            exercise, or want a structured walk with a clear goal. It also works well as a recovery
            or easy day for people who run or lift.
          </p>
        </>
      ),
    },
    {
      heading: "Calories in context",
      body: (
        <>
          <p>
            A difference of 20 to 30 calories a session is small. Over a week of four sessions, it
            adds up to around 100 calories, about the energy in a banana. Interval walking is best
            seen as a way to improve fitness and blood pressure efficiently, not as a major calorie
            burner.
          </p>
          <p>
            For weight loss, overall eating and total daily activity matter far more than the choice
            between interval and steady walking. A daily step target, consistent strength training
            and a moderate calorie deficit will move the scale more than any change of walking
            pattern.
          </p>
        </>
      ),
    },
    {
      heading: "Interval walking for different goals",
      body: (
        <>
          <ul>
            <li>
              <strong>Fitness:</strong> the full protocol, five rounds four or more days a week,
              with fast intervals at a somewhat hard effort.
            </li>
            <li>
              <strong>Blood pressure:</strong> the same protocol; research shows meaningful falls in
              systolic blood pressure over several months.
            </li>
            <li>
              <strong>Weight management:</strong> combine interval walking with a daily step goal
              and a moderate calorie deficit.
            </li>
            <li>
              <strong>Returning to exercise:</strong> start with three rounds, two or three days a
              week, and build up over weeks.
            </li>
            <li>
              <strong>Older adults:</strong> the protocol was designed for them and is generally
              well tolerated, with intervals adjusted to ability.
            </li>
          </ul>
          <p>Whatever the goal, consistency over months matters more than any single session.</p>
        </>
      ),
    },
    {
      heading: "Progressing your sessions",
      body: (
        <>
          <p>
            Once five rounds four times a week feels comfortable, there are several ways to
            progress. Add a sixth or seventh round. Walk the fast intervals on a gentle incline.
            Shorten the slow intervals to two minutes. Or add a fifth session each week. Change one
            thing at a time and give it two or three weeks before changing another.
          </p>
          <p>
            Some people eventually find that their fast intervals turn into jogging. That is a sign
            of improved fitness, and a jog-walk programme is a natural next step for those who want
            it.
          </p>
        </>
      ),
    },
    {
      heading: "Safety and comfort",
      body: (
        <>
          <p>
            Wear supportive shoes and choose a route with good footing. Start each session with a
            few minutes of easy walking, and finish with a few minutes of easy walking to cool down.
            Drink water on warm days and avoid the hottest part of the day.
          </p>
          <p>
            If you have a heart condition, high blood pressure, diabetes, joint problems or have
            been inactive for a long time, speak to a doctor before starting. Stop and seek advice
            if you notice chest pain, dizziness, unusual breathlessness or joint pain that persists.
          </p>
        </>
      ),
    },
    {
      heading: "Interval walking versus running",
      body: (
        <>
          <p>
            Running burns more calories per minute and builds fitness faster, but it places much
            greater impact on the joints. Interval walking offers a middle ground: a meaningful
            training effect with impact closer to normal walking. For people who cannot or prefer
            not to run, it is one of the most effective forms of exercise available.
          </p>
          <p>
            Runners can also use interval walking as an active recovery session or during a return
            from injury, keeping some aerobic work without the strain of running.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking interval walking",
      body: (
        <>
          <p>
            Record each session: rounds completed, the pace or route, and how hard the fast
            intervals felt. Every few weeks, walk a familiar route at your usual fast-interval
            effort and note your pace or distance. A faster pace at the same effort is a clear sign
            of improvement.
          </p>
          <p>
            If you track blood pressure at home, measure it at the same time of day every week or
            two. Many people see a gradual fall over the first few months of regular interval
            walking.
          </p>
        </>
      ),
    },
    {
      heading: "Walking METs and body weight",
      body: (
        <>
          <p>
            Calories from walking rise with body weight, because moving a heavier body takes more
            energy. A 70 kg person doing the same Japanese session burns about 147 calories; an 80
            kg person about 168. The time and paces are the same, but the energy cost scales with
            mass.
          </p>
          <p>
            MET-based estimates assume average walking efficiency. People who walk often, or with a
            long, smooth stride, may use slightly less energy than the estimate; those new to brisk
            walking may use slightly more. The numbers are best used to compare sessions, not as
            exact measures.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: programming interval walking",
      body: (
        <>
          <p>
            Interval walking is a good fit for clients who are new to exercise, older, carrying
            extra weight, or recovering from injury. Write the session in the plan with clear cues:
            three minutes at a pace that makes conversation hard, three minutes at a stroll, five
            times. Ask clients to log how many rounds they completed and how the fast intervals
            felt.
          </p>
          <p>
            Check in after two weeks. If the fast intervals feel easy, suggest a faster pace or a
            slight incline. If clients are struggling to complete five rounds, start with three and
            build up.
          </p>
        </>
      ),
    },
    {
      heading: "A first four weeks",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Week</th>
                  <th scope="col">Sessions</th>
                  <th scope="col">Rounds per session</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>3</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            By week four, this plan reaches the full protocol of five rounds four times a week. If a
            week feels too hard, repeat it before moving on. Adding a strength session or two
            alongside gives the broadest benefits for health and fitness.
          </p>
        </>
      ),
    },
    {
      heading: "Using a timer",
      body: (
        <>
          <p>
            The changes every three minutes are easy to miss when walking outdoors. A timer that
            beeps at each change keeps the intervals honest and lets you focus on the walk. The
            workout timer on this site can be set to custom intervals: 180 seconds of work, 180
            seconds of rest, five rounds.
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
    { label: "Zone 2 heart rate calculator", href: "/tools/zone-2-heart-rate-calculator" },
    { label: "Rucking calorie calculator", href: "/tools/rucking-calorie-calculator" },
    { label: "Steps to calories calculator", href: "/tools/steps-to-calories-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "What is Japanese interval walking?",
      a: "Three minutes of fast walking alternated with three minutes of slow walking, repeated about five times, at least four days a week. It was developed at Shinshu University in Japan.",
    },
    {
      q: "Does interval walking burn more calories than steady walking?",
      a: "A little. For a 175 lb person, a 30-minute session burns about 167 calories, compared with about 146 for a steady 3 mph walk.",
    },
    {
      q: "How fast should the fast intervals be?",
      a: "Somewhat hard, around 6 or 7 out of 10 in effort. For many people that is about 4 mph, close to the pace where walking turns into jogging.",
    },
    {
      q: "What are the main benefits?",
      a: "In the research, bigger improvements in aerobic fitness, leg strength and blood pressure than steady walking for the same time.",
    },
    {
      q: "How often should I do it?",
      a: "The original protocol aims for at least four sessions a week of five rounds. Start with three sessions and build up.",
    },
    {
      q: "How accurate are the calorie numbers?",
      a: "They are MET-based estimates. Individual calorie use varies with fitness, body composition, terrain and walking technique.",
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
