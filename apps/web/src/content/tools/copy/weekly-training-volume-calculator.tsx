import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Weekly training volume calculator",
  description:
    "Add sets per session and sessions per week for each muscle group. Compare weekly totals with adjustable MEV, MAV and MRV landmarks before changing a traini",
  eyebrow: "Free tool · Strength",
  h1: "Weekly training volume calculator",
  intro: (
    <>
      <p>
        Add sets per session and sessions per week for each muscle group. Compare weekly totals with
        adjustable MEV, MAV and MRV landmarks before changing a training block.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate weekly sets?",
    answer: (
      <>
        <p>
          Multiply sets per session by sessions per week for each muscle group. Five chest sets
          across four sessions produce twenty weekly sets. The default landmarks are ten, fifteen
          and twenty, but they are editable planning assumptions, not personal recovery
          measurements.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Count a week before judging a session",
      body: (
        <>
          <p>
            A session can look modest while the week contains a large amount of repeated work. Five
            chest sets on four days add to twenty, even though no single day appears unusually long.
            The calculator makes that multiplication visible for each muscle group. This helps when
            a split spreads work across several sessions or when new accessories have accumulated
            over time.
          </p>
          <p>
            Use the actual week you intend to perform. If you train a muscle twice on some weeks and
            three times on others, record those weeks separately or calculate a clearly labelled
            average. An average can be useful for a repeating rotation, but it should not conceal a
            very different workload on individual weeks. The tool assumes the same entered set count
            for every listed session.
          </p>
          <p>
            If sessions differ, add the sets directly before interpreting the result. Six sets on
            Monday and four on Thursday produce ten weekly sets. Entering five sets across two
            sessions represents that total, but the distribution still matters. Keep the actual
            session details in your plan, because the calculator summarises quantity rather than
            reconstructing the whole split.
          </p>
        </>
      ),
    },
    {
      heading: "Treat volume landmarks as adjustable assumptions",
      body: (
        <>
          <p>
            MEV, MAV and MRV are coaching terms for minimum effective, maximum adaptive and maximum
            recoverable volume. The default values are landmarks for comparing a total, not
            measurements taken from your body. Entering twenty as MRV does not establish that
            twenty-one sets are unsafe or that nineteen are guaranteed to be recoverable.
          </p>
          <p>
            The result bands are mechanical. Below MEV means the total is below your first entered
            landmark. Productive lies from MEV to MAV, High lies above MAV through MRV, and Above
            MRV exceeds the last value. Those names help organise the plan, but the calculator has
            no information about technique, effort, sleep, stress or whether performance is
            improving.
          </p>
          <p>
            Keep the landmarks in order and review them with your coach. If you change them simply
            to turn every row into a reassuring colour, you remove the point of the audit. Choose a
            consistent framework, record the assumption and compare it with the work you actually
            complete over several sessions. The tool supports that review; it does not discover
            personal physiological limits.
          </p>
        </>
      ),
    },
    {
      heading: "Decide which sets you are counting",
      body: (
        <>
          <p>
            Working sets, warm-up sets and easy technique rehearsal serve different purposes. Use a
            consistent convention for hard working sets so the weekly total remains interpretable.
            If you count every empty-bar warm-up as equivalent to a demanding set, the arithmetic
            will be correct but the comparison will not mean what you intended.
          </p>
          <p>
            Effort matters too. A set stopped very early and a set close to the planned repetition
            limit are not identical stimuli merely because both contain ten repetitions. This tool
            counts sets; it does not weight them by effort. Keep the target and reported effort in
            the session record when using a weekly total to make training decisions.
          </p>
          <p>
            Indirect work needs an explicit convention. Rows involve elbow flexors and presses
            involve triceps, but that does not make every compound set equivalent to a direct
            isolation set. You can track direct work here and keep overlapping work as context, or
            use another consistent coach-agreed approach. Avoid changing the counting rule midway
            through a comparison.
          </p>
        </>
      ),
    },
    {
      heading: "Audit distribution before adding more work",
      body: (
        <>
          <p>
            A weekly total does not show whether all the sets occur on one day or are spread across
            several. Distribution affects how the session feels, how much time it needs and how well
            later sets can be performed. When a client struggles to finish the final exercises,
            review session structure rather than looking only at whether the weekly number is below
            a landmark.
          </p>
          <p>
            Exercise order also matters. Direct arm work after several pulling or pressing movements
            happens under different fatigue than the same exercise performed first. If you move it,
            establish a new reference rather than treating the immediate load increase as proof that
            more volume was required. Quantity and context need to be read together.
          </p>
          <p>
            Look for duplicated work introduced by separate changes. A new upper-body day, an extra
            arm exercise and an optional weekend session may each look reasonable individually.
            Together they can alter the week substantially. Recount after changing the plan and
            confirm which optional sessions the client actually attends.
          </p>
        </>
      ),
    },
    {
      heading: "Use performance and experience to review the totals",
      body: (
        <>
          <p>
            Compare several recognisable sessions. Ask whether loads or repetitions are progressing
            at the intended effort, whether technique remains consistent, and whether the client can
            complete the schedule. A weekly total is one part of that review. It should not
            automatically overrule a client who reports that the current plan is not manageable.
          </p>
          <p>
            Change one variable deliberately. If you add sets, preserve enough of the exercise
            selection and execution to understand what happens next. Simultaneously adding
            frequency, sets and harder effort makes it difficult to identify why performance or
            recovery changed. A clear record makes the next adjustment easier to explain.
          </p>
          <p>
            A lighter week or a reduced schedule changes the interpretation of the audit. Do not
            compare it with a normal training week as though the reduction were an accidental
            failure. Label planned changes and review whether they served their purpose. The
            calculator can summarise either week, but the coach supplies the reason behind it.
          </p>
        </>
      ),
    },
    {
      heading: "Keep weekly sets distinct from other volume measures",
      body: (
        <>
          <p>
            Some logs use load multiplied by repetitions as a volume measure. Others use total
            repetitions or session duration. These are different summaries. This calculator uses
            weekly set counts for named muscle groups and does not compute tonnage. A heavier load
            can increase tonnage without adding a set, while more sets can raise this result even if
            total load lifted changes differently.
          </p>
          <p>
            Do not compare a set-count target with a tonnage target as if their units matched. Write
            the measure explicitly when communicating with a client or another coach. Clear units
            prevent a phrase such as increase volume from becoming several different instructions at
            once.
          </p>
          <p>
            The result should lead back to the session plan. Confirm what the client will do, which
            sets count, how effort is described and when the plan will be reviewed. That is more
            useful than pursuing a weekly total without a clear connection to the completed work.
          </p>
        </>
      ),
    },
    {
      heading: "Review the upper-body rows",
      body: (
        <>
          <p>
            Chest: count the planned chest-focused working sets across the week and check how they
            are distributed. Bench pressing, incline pressing and fly variations may all appear on
            different days. Confirm which movements you are counting directly. If you add an
            optional pressing session, update the weekly total instead of continuing to read the old
            split as though nothing changed.
          </p>
          <p>
            Back: pulling work can include different patterns with different fatigue and setup
            demands. Six sets across four sessions produce twenty-four weekly sets in the default
            example. That single number does not distinguish rows from pulldowns or reveal whether
            demanding deadlifts also appear nearby. Review the exercise list before deciding that
            every set serves the same purpose or costs the same amount of recovery.
          </p>
          <p>
            Shoulders: identify the direct shoulder work separately from overlapping pressing. Four
            sets on three days produce twelve weekly sets. If you count pressing toward another row
            as well, write that convention down so the totals remain understandable. Do not treat
            twelve direct sets plus considerable overlapping work as identical to twelve isolated
            sets in an otherwise different programme.
          </p>
          <p>
            Biceps: three sets on three days produce nine weekly direct sets in the default row.
            Rows and pulldowns may add indirect work. The calculator does not estimate the size of
            that contribution. When elbows become uncomfortable or performance falls, look at the
            entire pulling schedule rather than adding curls simply because the direct-set row falls
            below a chosen landmark.
          </p>
          <p>
            Triceps: three sets across three sessions also produce nine sets. Check the amount and
            order of pressing in those sessions before interpreting that total. Isolation work
            performed after hard bench and overhead pressing is not the same context as triceps work
            performed first. The arithmetic is useful, but exercise order and overlap explain more
            of the actual experience.
          </p>
        </>
      ),
    },
    {
      heading: "Review the lower-body and trunk rows",
      body: (
        <>
          <p>
            Quads: five sets on three days produce fifteen weekly sets. Check whether squats, leg
            presses and split squats have been included under a consistent rule. A session
            containing several of those exercises can become lengthy even when each individual
            prescription looks modest. Consider the time and technique demands of the complete
            session before increasing the weekly number.
          </p>
          <p>
            Hamstrings: four sets across two sessions produce eight weekly sets. Hinge work and
            knee-flexion work are different patterns, even when both involve the same muscle group.
            The total does not tell you whether the plan includes both or whether one movement is
            unfamiliar. Use the exercise record alongside the number when reviewing the next block.
          </p>
          <p>
            Glutes: three sets on two days produce six direct sets in this summary. Squatting and
            hinging may also involve the glutes, depending on execution and exercise. Do not
            automatically conclude that six means the muscle receives only six sets of relevant
            work. Decide what the row is intended to represent and retain that definition across
            reviews.
          </p>
          <p>
            Calves: three sets twice weekly produce six sets. Repetition range, range of motion,
            exercise choice and effort still matter. Recording only a weekly count can conceal that
            the client is using a different machine or shortening the movement. Keep a clear
            execution cue and a completed log so a change in the total can be interpreted against
            stable work.
          </p>
          <p>
            Abs: four sets twice weekly produce eight direct sets. Other exercises also require
            trunk work, but this row does not quantify it. Do not combine every squat or carry with
            direct trunk sets under an unstated counting rule. If a coach chooses to track several
            forms of trunk training, label them clearly rather than treating them as interchangeable
            repetitions.
          </p>
        </>
      ),
    },
    {
      heading: "A practical audit after a schedule change",
      body: (
        <>
          <p>
            Suppose a client changes from four sessions to three but keeps the same exercises.
            Recalculate the weekly sets before simply compressing the old schedule. Moving all the
            work into fewer days preserves quantity on paper but can create longer, harder sessions.
            The first task is to decide which work remains important and feasible, not to preserve
            every old number at any cost.
          </p>
          <p>
            If the client adds a sport practice or a physically demanding job shift, that work will
            not appear in these muscle rows. It can still affect the week. Ask about the broader
            schedule and interpret changes in performance with that context. The absence of an
            activity from the calculator does not mean it has no effect.
          </p>
          <p>
            After an interruption, avoid using the old weekly total as an automatic return target.
            Review current capacity, recent sessions and any professional guidance. This tool has no
            return-from-injury or detraining model. You can enter a reduced week and compare it with
            a later one, but the progression between them needs an individual decision.
          </p>
        </>
      ),
    },
    {
      heading: "Keep the audit actionable",
      body: (
        <>
          <p>
            End with a specific decision that can be reviewed. You might remove duplicated accessory
            work, spread sets more evenly, retain the plan while collecting better effort notes, or
            reduce the session length to fit attendance. Each decision has a reason that should be
            visible in the record.
          </p>
          <p>
            Keep the earlier totals when changing the plan. Overwriting them loses the comparison
            that explains why the new block differs. A simple record of sets, sessions and landmark
            assumptions is enough to distinguish a deliberate change from a data-entry mistake.
            Revisit the actual sessions after the change rather than assuming the revised table
            alone proves the problem is solved.
          </p>
        </>
      ),
    },
    {
      heading: "Check the entries before interpreting a flag",
      body: (
        <>
          <p>
            Confirm whether each number means sets in one session or sets across the whole week.
            Entering a weekly total in the per-session field and then multiplying it by frequency
            counts the work twice. For example, ten sets split across two days could be represented
            as five sets per session and two sessions. Entering ten and two would report twenty
            instead.
          </p>
          <p>
            A zero can be a deliberate choice. A muscle group may have no direct work in the week
            being reviewed, or you may be counting its involvement elsewhere under an agreed
            convention. A blank entry is different: it means the input is incomplete. Finish the
            entry before using the output as evidence for a plan change.
          </p>
          <p>
            Inspect the landmarks as well as the rows. Accidentally entering a larger minimum than
            maximum makes the comparison incoherent. Keep MEV, MAV and MRV in increasing order and
            write down the reason if you change them. The numbers are editable so a coach can apply
            a documented framework, not so a misleading flag can be hidden.
          </p>
          <p>
            Finally, compare the audit with the completed record. Optional sessions may not have
            happened, an exercise may have been substituted, or sets may have been stopped early.
            The planned total and actual total can both be useful, but they answer different
            questions. One describes the intended block; the other describes work performed.
          </p>
          <p>
            Use the gap to improve the next instruction. If a client repeatedly misses the final
            exercises because the appointment runs out of time, adding more planned sets will not
            solve it. Review priorities, session length and attendance first. A smaller completed
            plan is easier to assess than a larger table whose totals rarely reflect the week.
          </p>
        </>
      ),
    },
    {
      heading: "Retain the assumptions for the next review",
      body: (
        <>
          <p>
            Save the counting convention and landmark values with the week you reviewed. When you
            return later, use those same assumptions before deciding whether the plan changed.
            Otherwise a new counting method can look like a large training increase even when the
            client performed exactly the same work.
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
          Keep the calculation beside the completed training record. Review what the client actually
          performed, which equipment they used and how the session felt before changing the next
          prescription. A numerical result is easier to interpret when the exercise and execution
          remain consistent.
        </p>
        <p>
          Discuss one practical next step rather than giving the client several competing targets.
          Put that instruction in the session and review the returned log. The useful outcome is a
          plan the client can follow and a record that helps you decide what to do next.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Keep the plan and the completed work together",
    body: (
      <>
        <p>
          In Traiv you build workout plans, prescribe sets and repetitions, and review the work
          clients log in their app. Keep the next session alongside the history that explains it.
        </p>
      </>
    ),
  },
  next: [
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "RPE calculator", href: "/tools/rpe-calculator" },
    {
      label: "Weekly training volume calculator",
      href: "/tools/weekly-training-volume-calculator",
    },
  ],
  nextPitch: "Use these tools to check a number, then review the full plan with your coach.",
  faq: [
    {
      q: "How do I calculate weekly training volume?",
      a: "For the set-based measure here, multiply sets per session by sessions per week. If sessions differ, add the actual sets across those sessions and use an equivalent average or calculate the total separately.",
    },
    {
      q: "How many weekly sets should I use?",
      a: "There is no single number that suits every client, muscle and training block. Start from work you can complete and recover from, then review performance and experience with your coach.",
    },
    {
      q: "What do MEV, MAV and MRV mean?",
      a: "They refer to minimum effective, maximum adaptive and maximum recoverable volume in a coaching framework. The editable values are comparison landmarks; this tool does not measure those physiological limits.",
    },
    {
      q: "What counts as a hard set?",
      a: "Use a consistent convention for purposeful working sets near your intended effort. Do not count easy rehearsal sets as though they were equivalent working sets. The exact convention should be agreed with your coach.",
    },
    {
      q: "Should indirect sets count?",
      a: "Decide how to record overlapping work and apply that rule consistently. A row can involve the biceps without being equivalent to a direct curl set. This tool does not assign automatic fractional credit.",
    },
    {
      q: "When should I review weekly volume?",
      a: "Review after changing a split, adding exercises, returning from a break or seeing repeated recovery or performance problems. Use several comparable sessions rather than one difficult day.",
    },
  ],
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Write the next session with the last one in view",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
