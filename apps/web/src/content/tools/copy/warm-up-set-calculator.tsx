import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Warm-Up Set Calculator: Build a Warm-Up Ramp",
  description:
    "Free warm-up set calculator. Enter your working weight and reps to get a set-by-set warm-up ramp, full or quick, rounded to loadable plates.",
  eyebrow: "Free tool · Strength",
  h1: "Warm-up set calculator",
  intro: (
    <>
      <p>
        A good warm-up prepares you for heavy sets without tiring you out. Enter your working weight
        and reps, choose a full or quick ramp, and this calculator gives you a set-by-set warm-up
        with weights rounded to loadable plates.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How many warm-up sets should you do?",
    answer: (
      <>
        <p>
          For heavy compound lifts, three to five warm-up sets is typical: start with the empty bar
          or a light weight for several reps, then build through roughly 40, 60, 75 and 85 percent
          of your working weight with fewer reps as you go.
        </p>
        <p>
          For a 225 lb working set, a full ramp might be 45 lb × 10, 90 × 5, 135 × 3, 170 × 2 and
          190 × 1, then your work sets. The quick ramp skips some steps for lighter days or later
          exercises.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the ramp is built",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Ramp</th>
                  <th scope="col">Steps</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Full (5 steps)</td>
                  <td>Bar × 10, 40% × 5, 60% × 3, 75% × 2, 85% × 1</td>
                </tr>
                <tr>
                  <td>Quick (3 steps)</td>
                  <td>40% × 5, 65% × 3, 85% × 1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Weights are rounded to the nearest 5 lb or 2.5 kg, and never drop below the bar. The
            calculator assumes a 45 lb or 20 kg bar.
          </p>
        </>
      ),
    },
    {
      heading: "Why warm up before lifting?",
      body: (
        <>
          <p>
            Warming up raises muscle temperature, increases blood flow and improves nerve
            signalling, all of which help muscles produce force. It also lets you rehearse the
            movement pattern with lighter loads, so your technique is sharp when the weight gets
            heavy. Studies generally find that a specific warm-up improves performance on heavy sets
            compared with no warm-up, and it may reduce the risk of strains.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping warm-ups from becoming fatigue",
      body: (
        <>
          <p>
            The goal of a warm-up is preparation, not training. Reps should fall as the weight
            rises, so the heaviest warm-up sets are singles or doubles that prime the movement
            without tiring the muscles. Doing sets of eight or ten at 75 percent before a heavy set
            of five would leave you fatigued before your work sets even start.
          </p>
        </>
      ),
    },
    {
      heading: "Full or quick ramp?",
      body: (
        <>
          <p>
            Use the full ramp for the first heavy lift of the session, especially squats and
            deadlifts, heavy singles and doubles, or when you feel stiff or cold. Use the quick ramp
            for lighter working sets, for later exercises after the body is already warm, or for
            lifts that use smaller muscles and less weight.
          </p>
        </>
      ),
    },
    {
      heading: "General warm-up first",
      body: (
        <>
          <p>
            Before the lift-specific warm-up, spend five to ten minutes on general movement: brisk
            walking, cycling or rowing, followed by a few dynamic movements such as leg swings, hip
            openers, arm circles and bodyweight squats. This raises body temperature and prepares
            joints for the range of motion of the lift. Long static stretches right before heavy
            lifting are generally not necessary and can slightly reduce strength for a short time.
          </p>
        </>
      ),
    },
    {
      heading: "Rest between warm-up sets",
      body: (
        <>
          <p>
            Short rests of 30 to 60 seconds are fine for the lighter warm-up sets. Take a little
            longer, around one to two minutes, before the heaviest warm-ups and your first work set.
            Resting too long between warm-ups can let the body cool down again, while rushing the
            heavier sets can leave you slightly fatigued.
          </p>
        </>
      ),
    },
    {
      heading: "Adjusting for how you feel",
      body: (
        <>
          <p>
            On days when you feel stiff, tired or sore, add an extra light set or two to the ramp.
            On days when you feel great, the standard ramp is enough. The warm-up is also a useful
            check-in: if a weight that normally feels light feels heavy, it may be a day to reduce
            the working weight slightly.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example in kilograms",
      body: (
        <>
          <p>
            Your working weight for the deadlift is 140 kg for sets of three. The full ramp gives
            the 20 kg bar for 10 reps, then 55 kg × 5, 85 kg × 3, 105 kg × 2 and 120 kg × 1, with
            each percentage rounded to a loadable weight. Many lifters replace the empty-bar set
            with a light pull at around 60 kg, because the bar alone sits too close to the floor for
            a normal deadlift start. With rests of 45 to 90 seconds, the whole warm-up takes around
            eight to ten minutes, and you start your work sets with the movement grooved and the
            muscles ready.
          </p>
        </>
      ),
    },
    {
      heading: "Warm-ups for different lifts",
      body: (
        <>
          <ul>
            <li>
              <strong>Squats and deadlifts:</strong> use the full ramp, especially for the first
              lift of the day. These lifts involve large muscles and big ranges of motion.
            </li>
            <li>
              <strong>Bench press and overhead press:</strong> the full ramp suits heavy sessions;
              add a few light shoulder exercises beforehand, such as band pull-aparts or external
              rotations.
            </li>
            <li>
              <strong>Accessory lifts:</strong> one or two light sets are usually enough after the
              main lifts.
            </li>
            <li>
              <strong>Olympic lifts:</strong> often need more sets with an empty bar or technique
              work before loading.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Warming up for heavy singles",
      body: (
        <>
          <p>
            If you are working up to a heavy single or testing a max, add a couple of extra steps
            above 85 percent: for example a single at 90 percent and sometimes one at 95 percent
            before your top attempt. Rest longer between these heavy warm-up singles, around two to
            three minutes, so you arrive at your top set fresh. Keep reps at one for everything
            above about 80 percent.
          </p>
        </>
      ),
    },
    {
      heading: "Warming up when time is short",
      body: (
        <>
          <p>
            If time is tight, shorten the general warm-up rather than the specific one, and use the
            quick ramp. Three good warm-up sets are better than rushing straight into heavy work. If
            you are really short on time, consider reducing the number of working sets instead of
            cutting the warm-up, because a poor warm-up increases the chance of a bad session or a
            strain.
          </p>
        </>
      ),
    },
    {
      heading: "Warming up as you age",
      body: (
        <>
          <p>
            Many lifters find they need a longer warm-up as they get older, with more general
            movement and an extra light set or two. Joints and tissues often take longer to feel
            ready, and a thorough warm-up helps heavy sets feel smoother. If you find your first
            working set always feels rough, add another warm-up step at around 70 percent.
          </p>
        </>
      ),
    },
    {
      heading: "Cold environments",
      body: (
        <>
          <p>
            In a cold gym or garage, muscles and joints take longer to warm up. Wear extra layers
            for the first part of the session, extend the general warm-up, and consider adding an
            extra light set to the ramp. Feeling warm and loose before your first heavy set is a
            better guide than following a fixed number of sets.
          </p>
        </>
      ),
    },
    {
      heading: "Warm-up sets and your training log",
      body: (
        <>
          <p>
            Most lifters do not log warm-up sets, which is fine. But noting how the heaviest warm-up
            felt can be useful: if your 85 percent single feels unusually heavy, it is a sign to
            keep the working sets conservative that day. Over time, this simple check helps you
            adjust training to how you actually feel, rather than following the plan blindly.
          </p>
        </>
      ),
    },
    {
      heading: "Mobility and activation drills",
      body: (
        <>
          <p>
            Before heavy lifting, a few targeted drills can help: hip circles and goblet squats
            before squatting, glute bridges before deadlifts, band pull-aparts and light presses
            before benching. Keep these short and easy; they are meant to wake up the right muscles
            and improve range of motion, not to tire you out. Five minutes is usually plenty.
          </p>
        </>
      ),
    },
    {
      heading: "Common warm-up mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Skipping the warm-up entirely</strong> and starting with working weight.
            </li>
            <li>
              <strong>Doing too many reps</strong> on heavier warm-up sets, causing fatigue.
            </li>
            <li>
              <strong>Jumping too fast</strong> from very light to very heavy weights.
            </li>
            <li>
              <strong>Long static stretching</strong> right before heavy lifting.
            </li>
            <li>
              <strong>Resting too long</strong> between warm-ups, letting the body cool down.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Check the starting load against your equipment",
      body: (
        <>
          <p>
            The first row assumes a standard bar in the selected unit system. If you use a different
            bar, a machine with a starting resistance, or a dumbbell movement, account for that
            difference before following the ramp. A percentage that is mathematically sensible can
            still be impossible to load. Confirm the actual bar weight rather than assuming every
            bar in the gym is identical.
          </p>
          <p>
            When the working load is close to the empty bar, several calculated warm-up steps may
            round to the same weight. You do not need to perform every duplicate row merely because
            it appears in a table. The table describes a general progression, and a coach can
            simplify it for a light working set. Do not add weight just to create a more
            impressive-looking ladder.
          </p>
          <p>
            For machines, check whether the stack labels describe total resistance, plates added, or
            a manufacturer-specific setting. Cable ratios can change the relationship between the
            selected number and force at the handle. Keep the machine and setup consistent for
            tracking. Do not treat a machine number as interchangeable with the same number on a
            barbell.
          </p>
        </>
      ),
    },
    {
      heading: "Keep warm-up repetitions deliberate and comfortable",
      body: (
        <>
          <p>
            The early sets provide a chance to check position, balance and range before the heavier
            work. Use the same basic execution standard you intend for the working sets. Rushing an
            empty bar with a different movement pattern gives less useful information about
            readiness for the loaded version. A short technical cue can make the early repetitions
            purposeful without turning them into a separate workout.
          </p>
          <p>
            The later warm-up sets use fewer repetitions because the goal is preparation rather than
            exhausting the target muscles. If a final warm-up feels unexpectedly difficult, pause
            before committing to the working load. Review the setup, rest and recent training. A
            calculator-generated target is not a requirement to complete a difficult set regardless
            of how the preceding work went.
          </p>
          <p>
            Tell your coach about pain, dizziness or an unusual change in how you feel. Do not treat
            another warm-up set as a way to prove that symptoms can be ignored. The tool cannot
            distinguish ordinary effort from a reason to stop. Adjust or postpone the session when
            appropriate and seek professional advice for concerning symptoms.
          </p>
        </>
      ),
    },
    {
      heading: "Use the full and quick ramps in context",
      body: (
        <>
          <p>
            The full version gives more steps between the empty bar and the working load. The quick
            version uses fewer. Neither option guarantees readiness. A person returning to an
            unfamiliar lift may need extra rehearsal, while someone already warm from related
            exercises may need less. Use the selection to organise the transition rather than as a
            rule that overrides experience and coaching judgement.
          </p>
          <p>
            Consider exercise order. A bench press after another pressing movement is different from
            the first lift after sitting all day. The specific warm-up still needs to introduce the
            exact movement, but general preparation may already be partly complete. Record the
            context when comparing how a load feels across sessions.
          </p>
          <p>
            In a busy gym, plan plate changes before starting. Put the required plates nearby when
            permitted and keep both sides balanced while loading. A warm-up can become unnecessarily
            long if every step requires searching for a small plate. Rounding to available
            increments helps make the plan usable, but it should never replace checking that the bar
            is evenly loaded.
          </p>
        </>
      ),
    },
    {
      heading: "Preserve the working set as the main task",
      body: (
        <>
          <p>
            A warm-up is successful when it helps you begin the planned work with useful information
            and without unnecessary fatigue. More warm-up volume is not automatically better. If the
            early sets routinely leave you tired, review repetitions and spacing with your coach
            instead of adding another step because the working weight feels heavy.
          </p>
          <p>
            After the first working set, record the actual performance. That gives the next session
            a stronger reference than the warm-up formula alone. If the planned load repeatedly
            needs adjustment, update the plan rather than repeat the same mismatch indefinitely. The
            ramp should follow a realistic working target, not conceal that the target is out of
            date.
          </p>
        </>
      ),
    },
    {
      heading: "Save the ramp with the session",
      body: (
        <>
          <p>
            Put the preparation beside the working exercise rather than in a separate message the
            client must search for at the rack. Label warm-up sets clearly so they are not mistaken
            for additional working sets. Include the actual unit and the bar assumption. If the
            client uses another gym, ask them to confirm equipment before following the same
            numbers.
          </p>
          <p>
            After several sessions, review whether the ramp helped. A client who understands the
            sequence and reaches the working sets comfortably needs a usable routine, not constant
            new calculations. Recalculate when the working target changes enough to make the old
            steps unsuitable, or when equipment and experience justify a different approach.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using warm-up ramps with clients",
    body: (
      <>
        <p>
          Writing warm-up sets into clients' programmes removes guesswork and stops them from either
          skipping the warm-up or turning it into extra training.
        </p>
        <p>
          Use the warm-up to check technique. Coaching cues on light sets carry over to heavy ones.
        </p>
        <p>
          Encourage clients to treat the warm-up as a readiness check. Unusual heaviness on warm-ups
          is a good reason to adjust the plan for the day.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Build complete sessions for every client",
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
    { label: "Load the plates for each set", href: "/tools/plate-loading-calculator" },
    { label: "Estimate your one-rep max", href: "/tools/one-rep-max-calculator" },
  ],
  nextPitch:
    "Writing full sessions for clients? Traiv keeps warm-ups, work sets and logs together.",
  faq: [
    {
      q: "How many warm-up sets do I need?",
      a: "Three to five for heavy compound lifts; fewer for lighter or later exercises.",
    },
    {
      q: "How heavy should my last warm-up be?",
      a: "Around 85 to 90 percent of your working weight, for a single or double.",
    },
    {
      q: "Should I stretch before lifting?",
      a: "Dynamic movements are better before lifting. Long static stretches can briefly reduce strength.",
    },
    {
      q: "How much rest do warm-up sets need?",
      a: "30 to 60 seconds for light sets, one to two minutes before your heaviest warm-ups.",
    },
    {
      q: "Do I need to warm up for every exercise?",
      a: "The first heavy lift needs the most. Later exercises usually need one or two lighter sets.",
    },
    {
      q: "Can warm-ups make me weaker?",
      a: "Only if they are too long or too many reps. Low reps at heavier warm-up weights avoid fatigue.",
    },
  ],
  keepGoing: [
    { label: "Plate loading calculator", href: "/tools/plate-loading-calculator" },
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "RPE calculator", href: "/tools/rpe-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Complete sessions, from warm-up to last set",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
