import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Tempo Calculator: Time Under Tension Per Set",
  description:
    "Free tempo calculator. Enter a lifting tempo, reps and sets to see seconds per rep, time under tension per set and total time under tension for the session.",
  eyebrow: "Free tool · Strength",
  h1: "Tempo calculator",
  intro: (
    <>
      <p>
        Lifting tempo describes how fast you move through each part of a rep. A four-number code
        such as 3-1-2-0 sets the seconds for lowering, pausing at the bottom, lifting and pausing at
        the top. Enter a tempo, reps and sets, and this calculator gives you time under tension per
        rep, per set and for the whole exercise.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you read a lifting tempo?",
    answer: (
      <>
        <p>
          A tempo like 3-1-2-0 means three seconds to lower the weight, a one-second pause at the
          bottom, two seconds to lift it, and no pause at the top. An X means lift explosively,
          counted here as one second.
        </p>
        <p>
          At 3-1-2-0, each rep takes six seconds, so a set of eight takes 48 seconds and three sets
          give 144 seconds, or 2.4 minutes, of time under tension.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator works",
      body: (
        <>
          <p>
            Each rep's time is the sum of the four tempo numbers. Multiply by reps for time per set,
            and by sets for total time. The calculator shows all three, plus a reminder of the
            typical time-under-tension range for muscle-building work.
          </p>
        </>
      ),
    },
    {
      heading: "The four phases of a rep",
      body: (
        <>
          <ol>
            <li>
              <strong>Eccentric (first number):</strong> lowering the weight, such as the descent in
              a squat or bench press.
            </li>
            <li>
              <strong>Bottom pause (second number):</strong> holding the stretched position.
            </li>
            <li>
              <strong>Concentric (third number):</strong> lifting the weight. X means as fast as
              possible.
            </li>
            <li>
              <strong>Top pause (fourth number):</strong> holding the contracted or locked-out
              position.
            </li>
          </ol>
          <p>
            Some coaches write tempos starting with the concentric for lifts such as pull-ups and
            deadlifts, which begin with lifting. Always check how a programme defines its tempo
            before using it.
          </p>
        </>
      ),
    },
    {
      heading: "Does time under tension build muscle?",
      body: (
        <>
          <p>
            Time under tension is a popular idea, but research suggests it matters less than how
            close to failure you train and how much total work you do. Studies comparing slow and
            fast tempos with similar effort generally find similar muscle growth across a wide range
            of rep speeds, roughly from half a second to eight seconds per rep. Very slow reps,
            beyond about ten seconds, tend to reduce growth because the weight has to be so light.
          </p>
          <p>
            That does not make tempo useless. Controlled lowering improves technique, reduces
            bouncing and momentum, and helps lifters feel the target muscle. Pauses build strength
            in the hardest positions. Tempo is a tool for quality and specific goals rather than a
            magic number for growth.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a tempo for your goal",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Example tempo</th>
                  <th scope="col">Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>General muscle growth</td>
                  <td>2-0-1-0 to 3-0-1-0</td>
                  <td>Controlled lowering, normal lifting speed</td>
                </tr>
                <tr>
                  <td>Technique and control</td>
                  <td>3-1-1-0 or 4-1-1-0</td>
                  <td>Slow lowering and a pause reinforce position</td>
                </tr>
                <tr>
                  <td>Strength</td>
                  <td>2-0-X-0</td>
                  <td>Controlled down, explosive up</td>
                </tr>
                <tr>
                  <td>Strength from the bottom</td>
                  <td>2-2-X-0</td>
                  <td>Pauses remove the stretch reflex</td>
                </tr>
                <tr>
                  <td>Rehabilitation</td>
                  <td>3-1-3-1</td>
                  <td>Slow and controlled through the whole range</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "Time under tension ranges",
      body: (
        <>
          <p>
            Sets lasting roughly 20 to 70 seconds cover most muscle-building work. Sets under about
            20 seconds are typical of heavy strength work, while sets longer than about 70 seconds
            lean toward muscular endurance. These ranges are guides, not rules; effort and total
            weekly volume remain the main drivers of results.
          </p>
        </>
      ),
    },
    {
      heading: "Common tempo mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Counting too fast:</strong> saying three quickly is often closer to one and a
              half seconds.
            </li>
            <li>
              <strong>Using tempo on every exercise:</strong> tempo is most useful on a few key
              lifts.
            </li>
            <li>
              <strong>Losing control under heavier loads:</strong> if you cannot hold the tempo, the
              weight is too heavy for that tempo.
            </li>
            <li>
              <strong>Forgetting tempo reduces the load:</strong> slow tempos mean lighter weights
              than you use at normal speed.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Using a tempo in practice",
      body: (
        <>
          <p>
            Count out loud or in your head with a steady rhythm, or use a metronome app set to one
            beat per second. Film a set to check your actual speed. Start with lighter weights than
            usual, especially with long pauses or slow eccentrics, then build up over a few sessions
            as you get used to the tempo.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A programme prescribes 4 sets of 6 Romanian deadlifts at a tempo of 3-1-1-1. Each rep
            takes 3 + 1 + 1 + 1 = 6 seconds. Each set of six takes 36 seconds, and four sets total
            144 seconds, about two and a half minutes of time under tension. If you normally do
            these at a quicker pace with more weight, expect to use around 10 to 20 percent less
            load at this tempo.
          </p>
        </>
      ),
    },
    {
      heading: "Tempo on common exercises",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Exercise</th>
                  <th scope="col">Typical tempo</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Back squat</td>
                  <td>3-1-X-0</td>
                  <td>Control on the way down, power on the way up</td>
                </tr>
                <tr>
                  <td>Bench press</td>
                  <td>2-1-X-0</td>
                  <td>Pause on the chest builds strength from the bottom</td>
                </tr>
                <tr>
                  <td>Romanian deadlift</td>
                  <td>3-0-1-1</td>
                  <td>Slow stretch on the hamstrings, squeeze at the top</td>
                </tr>
                <tr>
                  <td>Pull-up</td>
                  <td>X-1-3-0 (concentric first)</td>
                  <td>Strong pull, controlled lowering</td>
                </tr>
                <tr>
                  <td>Biceps curl</td>
                  <td>2-0-1-1</td>
                  <td>Controlled reps without swinging</td>
                </tr>
                <tr>
                  <td>Split squat</td>
                  <td>3-1-1-0</td>
                  <td>Balance and control</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These are examples, not rules. Many lifters use normal, controlled reps for most work
            and save specific tempos for a few key lifts.
          </p>
        </>
      ),
    },
    {
      heading: "Eccentric training",
      body: (
        <>
          <p>
            The eccentric, or lowering, phase is where muscles can handle the most load and where
            much of the mechanical tension that drives growth occurs. Slow eccentrics, around three
            to five seconds, can increase muscle damage and soreness, especially when they are new.
            Some research suggests eccentric-focused training is particularly good for tendon health
            and for building strength at long muscle lengths. Introduce slow eccentrics gradually,
            with lighter loads, and expect more soreness for the first week or two.
          </p>
        </>
      ),
    },
    {
      heading: "Pauses and the stretch reflex",
      body: (
        <>
          <p>
            When a muscle is stretched quickly and then contracts, it can produce more force thanks
            to the stretch reflex and the elastic energy stored in muscles and tendons. That bounce
            makes lifting easier. A pause at the bottom of a squat or bench press removes much of
            that benefit, making the lift harder from the bottom and building strength in that
            position. Paused lifts are popular among powerlifters for exactly this reason,
            especially the paused bench press, which is required in competition.
          </p>
        </>
      ),
    },
    {
      heading: "Explosive concentrics",
      body: (
        <>
          <p>
            Lifting the weight as fast as possible, the X in a tempo, increases the number of muscle
            fibres recruited and helps develop power. Even when the bar moves slowly because it is
            heavy, the intention to move it fast matters. Many strength coaches recommend explosive
            intent on all concentric reps, combined with controlled lowering, as a simple default
            for most lifts.
          </p>
        </>
      ),
    },
    {
      heading: "Tempo for beginners",
      body: (
        <>
          <p>
            Beginners often benefit from slightly slower, controlled reps, around two to three
            seconds on the way down, because it helps them learn positions and avoid bouncing out of
            the bottom. As technique becomes consistent, they can move toward normal speeds with
            explosive intent on the way up. Tempo work is also helpful when returning from injury,
            because slower reps with lighter loads let the lifter build confidence and control.
          </p>
        </>
      ),
    },
    {
      heading: "Time under tension and hypertrophy",
      body: (
        <>
          <p>
            A common recommendation is to aim for 40 to 60 seconds of time under tension per set for
            muscle growth. Research does not strongly support a specific number. What seems to
            matter most is taking sets reasonably close to failure and doing enough total hard sets
            per week. Time under tension is better seen as a by-product of choosing a sensible
            weight and rep range than as a target in its own right. Still, tracking it can be useful
            when comparing programmes or checking that sets are neither too short nor too long.
          </p>
        </>
      ),
    },
    {
      heading: "Using a metronome",
      body: (
        <>
          <p>
            Counting seconds accurately is harder than it sounds, especially when a set gets tough.
            A metronome app set to 60 beats per minute gives one beat per second, making tempos easy
            to follow. Some lifters prefer to count aloud, and others use a training partner to
            count for them. Filming a set and timing it afterwards is a good way to check how
            accurately you are following the prescribed tempo.
          </p>
        </>
      ),
    },
    {
      heading: "Total session time under tension",
      body: (
        <>
          <p>
            Adding up time under tension across a whole session gives a rough picture of total work.
            A session with five exercises, each three sets of eight at a 3-0-1-0 tempo, adds up to
            about 8 minutes of time under tension. Sessions focused on heavy strength work will have
            less, while high-volume bodybuilding sessions can have much more. This is one more way
            to compare sessions, alongside total sets and the weights used.
          </p>
        </>
      ),
    },
    {
      heading: "Start counting from the correct phase",
      body: (
        <>
          <p>
            The four numbers describe lowering, the pause in the stretched position, lifting and the
            pause in the shortened position. They do not necessarily describe the chronological
            order of the first repetition. A squat commonly starts by lowering, while a deadlift
            starts by lifting from the floor. Read the phase labels before beginning instead of
            applying the first number to whichever movement happens first.
          </p>
          <p>
            For an exercise that begins on the floor, explain how the start and reset fit the
            prescription. A controlled reset between repetitions is different from a long rest with
            the load fully supported. If the plan depends on continuous tension, make that intention
            explicit. The calculator adds the written phase durations; it cannot determine whether a
            particular pause keeps the target muscle working.
          </p>
          <p>
            Count with a steady rhythm rather than trying to watch a clock during a demanding set.
            The aim is repeatable control. If the count varies slightly, record the completed
            repetitions honestly rather than pretending that every repetition lasted exactly the
            calculated number of seconds. A timing estimate is useful without being a laboratory
            measurement.
          </p>
        </>
      ),
    },
    {
      heading: "Separate repetition time from session time",
      body: (
        <>
          <p>
            The result counts the time spent performing repetitions. It does not include rest
            between sets, changing weights, setting up equipment, waiting for a station or warming
            up. For example, a set lasting forty-eight seconds followed by a two-minute rest
            occupies more than forty-eight seconds of the appointment. Build those other tasks into
            your session plan before deciding how much work fits.
          </p>
          <p>
            Supersets can reduce some waiting time, but they do not eliminate fatigue or setup. Two
            exercises that need the same unavailable station may be impractical even when their
            repetition times look short. Use the calculator to understand the movement portion of a
            session, then review the actual gym conditions. A plan that fits on paper but requires
            constant rushing is difficult to follow well.
          </p>
          <p>
            When comparing two tempos, hold repetitions and sets steady first. That shows the effect
            of timing alone. Then decide whether the extra duration is worth a change in load or
            total work. Altering tempo, repetitions and sets together makes it harder to identify
            what changed the session and whether that change served the intended purpose.
          </p>
        </>
      ),
    },
    {
      heading: "Teach the cue before prescribing several numbers",
      body: (
        <>
          <p>
            A beginner may understand lower for three counts, pause briefly, then stand up more
            easily than a four-digit code. Put both versions in the plan until the notation becomes
            familiar. The important part is that the client performs the intended movement.
            Correctly repeating a code without knowing which phase it refers to does not improve the
            exercise.
          </p>
          <p>
            Demonstrate the pause position. On a squat, hovering just above the intended depth is
            different from holding the bottom position. On a row, pausing with the shoulder drifting
            forward is different from finishing the pull under control. The timer cannot decide
            whether the position meets your technical goal, so use a clear cue or demonstration when
            that distinction matters.
          </p>
          <p>
            Give the client a way to report difficulty. If a prescribed pause makes balance or
            position deteriorate, they should be able to stop the set and ask for a change. Do not
            use a longer duration to force a position that is uncomfortable. A coach can shorten the
            pause, reduce the load or choose another exercise after reviewing what happened.
          </p>
        </>
      ),
    },
    {
      heading: "Read explosive notation as an intention",
      body: (
        <>
          <p>
            An X in the lifting phase usually asks for fast intent rather than an exact one-second
            duration. The actual movement speed depends on load, fatigue and the exercise. A heavy
            but deliberately fast attempt may still move slowly. This calculator represents the
            phase numerically for time estimates; that representation is not a promise about the
            actual time of every explosive repetition.
          </p>
          <p>
            If measuring actual movement time matters for a specific training task, record it
            separately with an appropriate method. Do not infer bar velocity from the four tempo
            numbers. Two sets can use the same written tempo and have different movement speeds,
            pauses and technique. The notation is an instruction, not a sensor.
          </p>
          <p>
            Keep explosive intent within the exercise and skill level you can perform safely. Fast
            lifting is not the same as losing control of the load or skipping the intended range.
            When a client is still learning the movement, a clear controlled repetition may be a
            more useful instruction than a speed target they cannot yet interpret.
          </p>
        </>
      ),
    },
    {
      heading: "Review tempo alongside the other training variables",
      body: (
        <>
          <p>
            Load, repetitions, range, rest and effort all affect the session. A longer set does not
            automatically provide a better stimulus than a shorter one. If slowing the movement
            means using substantially less weight or completing fewer technically sound repetitions,
            consider whether that trade serves the goal. Avoid selecting a tempo solely because it
            produces a larger time-under-tension total.
          </p>
          <p>
            For progress tracking, keep the execution standard recognisable. If last month used a
            pause and this month does not, label the change. A larger load may partly reflect the
            easier execution rather than a pure increase in strength. Both sessions can be useful,
            but combining them into one trend without context makes the log less informative.
          </p>
          <p>
            Use the result as a planning aid. It can help explain why a set feels long, compare two
            prescriptions and estimate how much movement time a session contains. It cannot tell you
            how much muscle you will gain, whether a tendon has recovered or which tempo is
            medically appropriate for an injury. Those questions require information beyond
            arithmetic.
          </p>
        </>
      ),
    },
    {
      heading: "Three timing checks before using the result",
      body: (
        <>
          <p>
            First, check that every field is in seconds. Entering a count of three while actually
            lowering for roughly one second creates a different set from the written prescription.
            If the client counts quickly, teach a steadier rhythm or simplify the instruction. The
            calculation assumes the entered durations, not the words used while counting.
          </p>
          <p>
            Second, check repetitions and sets separately. Eight repetitions across three sets means
            twenty-four repetitions in total. The calculator multiplies each repetition duration by
            eight for the set result, then by three for the session result. It does not assume that
            a pause between sets is part of the four-phase tempo. Add recovery time separately when
            scheduling the appointment.
          </p>
          <p>
            Third, distinguish a prescribed pause from an unplanned interruption. Reracking midway
            through a set, adjusting a grip, or waiting for assistance changes the session but
            should not be hidden inside a tempo number. Record the interruption as a note. If it
            happens repeatedly, review whether the chosen load, setup or instruction is practical
            for the client.
          </p>
          <p>
            These checks make the output easier to use in a real plan. The result should explain the
            intended execution in terms the client can follow, with a coach available to review
            differences. It should not turn every repetition into a timing exam or encourage a
            person to continue when control has been lost.
          </p>
        </>
      ),
    },
    {
      heading: "Recheck after changing the prescription",
      body: (
        <>
          <p>
            When you change the number of sets or repetitions, read the new total before saving the
            plan. A small timing change repeated across many sets can noticeably change how long the
            movement portion takes.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using tempo with clients",
    body: (
      <>
        <p>
          Tempo is a powerful teaching tool. A slow lowering phase shows clients where they lose
          position, and pauses make it obvious when the bar path drifts.
        </p>
        <p>
          Use tempo selectively. Prescribe it for one or two key lifts per session rather than every
          exercise.
        </p>
        <p>
          Write tempos clearly in programmes and explain the notation once, so clients are not
          confused by four-digit codes.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Prescribe tempo and track every set",
    body: (
      <>
        <p>
          In Traiv you build workout plans for each client, set weights from their numbers, and see
          every set and rep they log, so progress on each lift is visible week by week.
        </p>
      </>
    ),
  },
  next: [
    { label: "Check weekly sets per muscle", href: "/tools/weekly-training-volume-calculator" },
    { label: "Set effort targets with RIR", href: "/tools/rir-calculator" },
  ],
  nextPitch: "Writing detailed programmes? Traiv lets you add notes like tempo to every exercise.",
  faq: [
    {
      q: "What does 3-1-2-0 tempo mean?",
      a: "Three seconds lowering, one-second pause at the bottom, two seconds lifting, no pause at the top.",
    },
    {
      q: "What does X mean in a tempo?",
      a: "Lift as fast as possible. The calculator counts it as one second.",
    },
    {
      q: "Is slow lifting better for muscle growth?",
      a: "Not necessarily. Effort and total volume matter more than speed, within a broad range of tempos.",
    },
    {
      q: "How long should a set last?",
      a: "Roughly 20 to 70 seconds covers most muscle-building work.",
    },
    {
      q: "Should I use tempo on every exercise?",
      a: "No. Tempo is most useful on a few key lifts for technique, control or specific strength goals.",
    },
    {
      q: "Why do I need lighter weights with tempo?",
      a: "Slower reps and pauses make each rep harder, so the same weight feels much heavier.",
    },
  ],
  keepGoing: [
    {
      label: "Weekly training volume calculator",
      href: "/tools/weekly-training-volume-calculator",
    },
    { label: "RIR calculator", href: "/tools/rir-calculator" },
    { label: "Workout plan builder", href: "/tools/workout-plan-builder" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Detailed programmes and logged sets for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
