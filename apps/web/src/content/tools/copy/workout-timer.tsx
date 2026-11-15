import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Workout timer",
  description:
    "A free interval timer for EMOM, AMRAP, Tabata and custom work and rest intervals, with beeps, a countdown, fullscreen mode and space bar control.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Workout timer: EMOM, AMRAP, Tabata and interval timer",
  intro: (
    <>
      <p>
        Choose EMOM, AMRAP, Tabata or a custom interval, set the numbers and press start. The timer
        counts each work and rest period, beeps at every change and in the last three seconds, and
        runs fullscreen.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How does the workout timer work?",
    answer: (
      <>
        <p>
          Pick a mode and set the numbers. EMOM starts a new interval every minute for the minutes
          you choose. AMRAP counts down a single block. Tabata defaults to 20 seconds of work and 10
          of rest for 8 rounds, 4 minutes in total. Custom lets you set any work, rest and rounds.
          Press start or the space bar, and the timer beeps at each change.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "The four timer modes",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Mode</th>
                  <th scope="col">How it works</th>
                  <th scope="col">Typical use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>EMOM</td>
                  <td>A new interval starts every minute, on the minute</td>
                  <td>Strength, skill work, controlled conditioning</td>
                </tr>
                <tr>
                  <td>AMRAP</td>
                  <td>One countdown; complete as many rounds as possible</td>
                  <td>Circuits, conditioning tests</td>
                </tr>
                <tr>
                  <td>Tabata</td>
                  <td>20 s work, 10 s rest, 8 rounds by default</td>
                  <td>Short, very hard intervals</td>
                </tr>
                <tr>
                  <td>Custom</td>
                  <td>Any work, rest and number of rounds</td>
                  <td>Interval runs, circuits, rehab, walking intervals</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Each mode suits a different kind of session. All of them run entirely in your browser,
            with no account or download.
          </p>
        </>
      ),
    },
    {
      heading: "EMOM: every minute on the minute",
      body: (
        <>
          <p>
            In an EMOM, you start a set amount of work at the beginning of each minute, then rest
            for whatever time is left. If you finish 10 kettlebell swings in 25 seconds, you rest
            for 35. As fatigue builds, the work takes longer and the rest gets shorter, which makes
            EMOMs self-regulating: the harder you work, the less recovery you get.
          </p>
          <p>
            EMOMs work well for strength and skill practice, such as a set of heavy squats or a few
            pull-ups each minute, because they enforce consistent rest. They also suit conditioning,
            alternating exercises across minutes. A common format is 10 to 20 minutes, sometimes
            alternating two or three exercises: minute one swings, minute two push-ups, minute three
            rest, and repeat.
          </p>
          <p>
            Choose work that takes 20 to 40 seconds at the start. If you can't finish the work
            within the minute by the end, reduce the reps or load next time.
          </p>
        </>
      ),
    },
    {
      heading: "AMRAP: as many rounds as possible",
      body: (
        <>
          <p>
            An AMRAP sets a fixed time and asks you to complete as many rounds of a circuit as you
            can. For example, a 12-minute AMRAP of 10 squats, 10 push-ups and 10 sit-ups. You record
            the rounds and extra reps completed, and that score becomes a benchmark to beat next
            time.
          </p>
          <p>
            AMRAPs are good for conditioning and for testing work capacity. Pacing matters: starting
            too fast leads to long rests later. Most people do best with a steady, sustainable
            effort, speeding up only in the last few minutes.
          </p>
        </>
      ),
    },
    {
      heading: "Tabata",
      body: (
        <>
          <p>
            The Tabata protocol comes from a 1996 study by Izumi Tabata and colleagues at Japan's
            National Institute of Fitness and Sports. Trained athletes cycled at a very high
            intensity, about 170% of the power at their VO2 max, for 20 seconds, then rested for 10
            seconds, repeated 8 times. After six weeks of training five days a week, both their
            aerobic and anaerobic capacity improved significantly.
          </p>
          <p>
            The original protocol was extremely hard, done on a bike at an intensity few people
            reach in everyday workouts. Today, Tabata is often used more loosely for any 20-on,
            10-off interval set, with exercises like burpees, squats or kettlebell swings. Those
            sessions are still useful, but they rarely reach the intensity of the original study.
            The timer's default of 20, 10 and 8 rounds gives the classic 4-minute block, and all
            three numbers can be changed.
          </p>
        </>
      ),
    },
    {
      heading: "Custom intervals",
      body: (
        <>
          <p>
            Custom mode lets you set any work and rest periods and any number of rounds. Some common
            examples:
          </p>
          <ul>
            <li>
              <strong>Running intervals:</strong> 60 s fast, 60 s easy, 10 rounds.
            </li>
            <li>
              <strong>Circuit training:</strong> 40 s work, 20 s rest, 6 rounds per circuit.
            </li>
            <li>
              <strong>Japanese interval walking:</strong> 180 s brisk, 180 s easy, 5 rounds.
            </li>
            <li>
              <strong>Norwegian 4 × 4:</strong> 240 s hard, 180 s easy, 4 rounds.
            </li>
            <li>
              <strong>Back-to-back stations:</strong> set rest to 0 to move straight from one
              station to the next.
            </li>
          </ul>
          <p>
            The timer includes rest after every round, so total time is work plus rest times the
            number of rounds. For a 40-second work and 20-second rest set of 6 rounds, that is 6
            minutes.
          </p>
        </>
      ),
    },
    {
      heading: "How to use the timer",
      body: (
        <>
          <ol>
            <li>Choose a mode and set the numbers.</li>
            <li>Check the total time shown under the clock.</li>
            <li>Press Start, or the space bar, to begin. Press again to pause.</li>
            <li>
              Listen for the beeps: a higher tone starts work, a lower tone starts rest, and short
              beeps count down the last three seconds.
            </li>
            <li>Press Reset to start over, or change the settings to reset automatically.</li>
            <li>Use Fullscreen to make the clock easy to read across a room.</li>
            <li>Turn the sound off if you prefer silence.</li>
          </ol>
          <p>
            While the timer runs, the page asks the browser to keep the screen awake, so your phone
            or laptop doesn't dim mid-workout. Some browsers don't support this; if yours dims,
            change your device's screen timeout before you start.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing work and rest periods",
      body: (
        <>
          <p>
            The ratio of work to rest shapes the session. Short work with long rest, such as 20
            seconds on and 40 off, allows near-maximal effort each round and suits sprint and power
            work. Equal work and rest, such as 60 on and 60 off, suits hard aerobic intervals. Long
            work with short rest, such as Tabata's 20 on and 10 off, builds fatigue quickly and
            suits short, very intense blocks.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Example work and rest</th>
                  <th scope="col">Rounds</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Speed and power</td>
                  <td>15 s work, 45 s rest</td>
                  <td>6 to 10</td>
                </tr>
                <tr>
                  <td>Aerobic intervals</td>
                  <td>60 s work, 60 s rest</td>
                  <td>8 to 12</td>
                </tr>
                <tr>
                  <td>VO2 max</td>
                  <td>3 to 4 min work, 2 to 3 min rest</td>
                  <td>4 to 6</td>
                </tr>
                <tr>
                  <td>Muscular endurance</td>
                  <td>40 s work, 20 s rest</td>
                  <td>6 to 8</td>
                </tr>
                <tr>
                  <td>Very intense finisher</td>
                  <td>20 s work, 10 s rest</td>
                  <td>8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Choose the structure that fits the goal of the session, not only the one that feels
            hardest.
          </p>
        </>
      ),
    },
    {
      heading: "Sample sessions",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Session</th>
                  <th scope="col">Mode</th>
                  <th scope="col">Settings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kettlebell EMOM</td>
                  <td>EMOM</td>
                  <td>12 min: odd minutes 12 swings, even minutes 8 goblet squats</td>
                </tr>
                <tr>
                  <td>Bodyweight circuit</td>
                  <td>AMRAP</td>
                  <td>15 min: 10 push-ups, 15 squats, 20 mountain climbers</td>
                </tr>
                <tr>
                  <td>Bike Tabata</td>
                  <td>Tabata</td>
                  <td>20 s all-out, 10 s easy, 8 rounds</td>
                </tr>
                <tr>
                  <td>Track intervals</td>
                  <td>Custom</td>
                  <td>90 s hard, 90 s jog, 8 rounds</td>
                </tr>
                <tr>
                  <td>Circuit stations</td>
                  <td>Custom</td>
                  <td>45 s work, 15 s change, 10 rounds</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Adjust the work and rest to your fitness. A session should be challenging but leave you
            able to finish with good technique.
          </p>
        </>
      ),
    },
    {
      heading: "Programming interval workouts",
      body: (
        <>
          <p>
            Intervals are powerful, but they are also tiring. Most people do best with one to three
            interval or circuit sessions a week, separated by easier days or strength sessions. Very
            short, very intense formats such as Tabata are best kept to a few blocks per session,
            with full recovery between blocks.
          </p>
          <p>
            Warm up for 5 to 10 minutes before any interval session, with easy movement and some
            practice of the exercises at lower intensity. Cool down afterwards with a few minutes of
            easy movement. Both reduce injury risk and help the session feel better.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing exercises for each format",
      body: (
        <>
          <ul>
            <li>
              <strong>EMOM:</strong> exercises that take 20 to 40 seconds to complete, such as a set
              of swings, push-ups or a short row.
            </li>
            <li>
              <strong>AMRAP:</strong> a circuit of three to five simple exercises that can be done
              safely when tired.
            </li>
            <li>
              <strong>Tabata:</strong> full-body or cyclical exercises such as bike sprints, rowing,
              burpees or jump squats.
            </li>
            <li>
              <strong>Custom:</strong> any exercise, depending on the goal; long intervals suit
              running, rowing or cycling.
            </li>
          </ul>
          <p>
            Avoid complex, technical lifts in high-fatigue formats. Technique tends to break down
            when tired, which raises injury risk. Save heavy or technical lifts for EMOMs with
            plenty of rest.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking timer workouts",
      body: (
        <>
          <p>
            Record each session: the format, exercises, loads, and your score. For AMRAPs, note
            rounds and extra reps. For EMOMs, note whether you finished the work each minute. For
            Tabata and custom intervals, note distance, reps or calories per round if your equipment
            shows them.
          </p>
          <p>
            Over time, these records show progress. Completing an extra round in the same AMRAP, or
            keeping more rest time in an EMOM, are clear signs of improved fitness.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: using the timer with clients",
      body: (
        <>
          <p>
            The timer works well for group classes, in-person sessions and remote clients. Put it in
            fullscreen on a laptop or TV for groups, or send a client the settings so they can run
            the same session at home. Pair it with a written plan so the client knows exactly which
            exercises fill each interval.
          </p>
          <p>
            Ask clients to log their scores after each session. Reviewing them every week shows
            whether the plan is working and when to increase the challenge, for example by adding
            rounds, reducing rest or increasing load.
          </p>
        </>
      ),
    },
    {
      heading: "Accessibility and settings",
      body: (
        <>
          <p>
            The clock is large and high contrast for easy reading. Status changes, such as work,
            rest and done, are announced to screen readers. The space bar starts and pauses the
            timer when focus isn't in a text field. Sound can be turned off for quiet spaces, and
            the clock keeps accurate time if you switch tabs for music, though some browsers delay
            beeps in background tabs.
          </p>
          <p>
            If your browser blocks sound until you interact with the page, press Start once to
            enable it. Some phones mute web audio when the ringer is silent; check your device
            settings if you hear no beeps.
          </p>
        </>
      ),
    },
    {
      heading: "Safety",
      body: (
        <>
          <p>
            High-intensity intervals are demanding. If you are new to exercise, have a heart
            condition, high blood pressure, joint problems or other health concerns, speak to a
            doctor before starting. Build up gradually: start with fewer rounds, longer rest and
            moderate intensity, and increase over weeks.
          </p>
          <p>
            Stop and rest if you feel dizzy, light-headed, short of breath beyond normal exertion,
            or feel chest pain. Technique should stay good throughout; if it slips, lower the
            intensity or take extra rest.
          </p>
        </>
      ),
    },
    {
      heading: "EMOM, AMRAP or Tabata: which to choose",
      body: (
        <>
          <p>
            Choose EMOM when you want controlled, repeatable work with built-in rest, such as
            strength or skill practice. Choose AMRAP when you want a measurable conditioning test or
            a continuous circuit. Choose Tabata for a short, very intense finisher at the end of a
            session. Choose custom when you need specific work and rest periods, such as running
            intervals or a programme from your coach.
          </p>
          <p>
            Mixing formats across the week keeps training varied and works different qualities. A
            week might include an EMOM strength session, a custom interval run and a short AMRAP
            circuit.
          </p>
        </>
      ),
    },
    {
      heading: "How the timer counts",
      body: (
        <>
          <p>
            The timer counts down each work and rest period separately and shows the current round.
            For EMOM, each minute is one round. For AMRAP, there is a single round lasting the whole
            block. For Tabata and custom modes, each round includes a work period followed by a rest
            period, unless rest is set to zero.
          </p>
          <p>
            The total shown under the clock is the full length of the session. A Tabata of 8 rounds
            at 20 and 10 seconds is 4:00; a custom session of 6 rounds at 40 and 20 seconds is 6:00;
            an EMOM of 10 minutes is 10:00. Changing any setting resets the clock.
          </p>
        </>
      ),
    },
    {
      heading: "Using the timer for rehabilitation and mobility",
      body: (
        <>
          <p>
            Timed intervals are useful beyond hard training. Physiotherapists often prescribe
            exercises for set times, such as 30-second holds or 45 seconds of a movement followed by
            rest. Custom mode handles these easily: set the hold time as work, the rest as rest, and
            the number of sets as rounds.
          </p>
          <p>
            Mobility and stretching routines also suit custom mode, with 30 to 60 seconds per
            position and a few seconds between. The beeps let you focus on the movement rather than
            the clock.
          </p>
        </>
      ),
    },
    {
      heading: "Building a session around the timer",
      body: (
        <>
          <p>
            A full session might include a 10-minute warm-up, a strength block, a conditioning block
            using the timer and a short cool-down. For example: warm-up, then a 12-minute EMOM of
            alternating squats and rows, then two Tabata blocks of bike sprints with two minutes of
            easy pedalling between, then five minutes of easy movement and stretching.
          </p>
          <p>
            Planning the whole session in advance, with the timer settings for each block, keeps the
            workout moving and the effort where you intended it.
          </p>
        </>
      ),
    },
    {
      heading: "Group and class use",
      body: (
        <>
          <p>
            For classes, the fullscreen clock and loud beeps let everyone follow the same intervals.
            Set the timer before the class starts, explain each format briefly, and demonstrate the
            exercises. For mixed-ability groups, give scaled options for each exercise, such as
            lighter loads, fewer reps or lower-impact movements, so everyone can work within the
            same intervals.
          </p>
          <p>
            In circuit formats, set rest to the time needed for people to move between stations,
            usually 10 to 20 seconds.
          </p>
        </>
      ),
    },
    {
      heading: "Why a dedicated timer helps",
      body: (
        <>
          <p>
            Watching a clock while training breaks concentration and leads to sloppy intervals: rest
            periods creep longer and work periods get cut short. A timer with clear beeps keeps the
            structure honest, so the session you planned is the session you complete. That
            consistency is what makes progress measurable from week to week.
          </p>
        </>
      ),
    },
    {
      heading: "Keyboard and screen tips",
      body: (
        <>
          <p>
            Click anywhere outside the input fields, then press the space bar to start or pause. Use
            the Tab key to move between controls; each one shows a visible focus outline. Fullscreen
            mode can be exited with the Escape key. On phones, rotate to landscape for a larger
            clock, and turn on Do Not Disturb so notifications don't interrupt the session.
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
    { label: "Interval walking calculator", href: "/tools/interval-walking-calculator" },
    { label: "Heart rate zone calculator", href: "/tools/heart-rate-zone-calculator" },
    { label: "Workout plan builder", href: "/tools/workout-plan-builder" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "What is an EMOM workout?",
      a: "Every minute on the minute: you start a set amount of work at the start of each minute and rest for the remaining time. The timer beeps each new minute.",
    },
    {
      q: "What is the difference between AMRAP and EMOM?",
      a: "An AMRAP is one countdown in which you complete as many rounds as possible. An EMOM restarts the work every minute, with rest built in.",
    },
    {
      q: "How long is a Tabata workout?",
      a: "A classic Tabata is 8 rounds of 20 seconds work and 10 seconds rest, 4 minutes in total. Many sessions repeat several Tabata blocks.",
    },
    {
      q: "Does the timer work offline and on my phone?",
      a: "It runs in your browser on phones, tablets and computers, with no account. Once the page has loaded, the timer itself doesn't need a connection.",
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
