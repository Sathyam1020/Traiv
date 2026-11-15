import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Workout plan builder",
  description:
    "Choose two to six training days, a goal and your experience level. Build a repeatable weekly split with exercises, sets and repetitions, then adapt it with",
  eyebrow: "Free tool · Strength",
  h1: "Workout plan builder",
  intro: (
    <>
      <p>
        Choose two to six training days, a goal and your experience level. Build a repeatable weekly
        split with exercises, sets and repetitions, then adapt it with your coach.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How does the workout plan builder work?",
    answer: (
      <>
        <p>
          The builder selects a fixed split for your chosen frequency, applies goal-specific sets
          and repetitions, and adjusts the number of main-lift sets for experience. It is a
          transparent starting template, not an individual assessment or an AI-generated
          prescription.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Make the schedule decision first",
      body: (
        <>
          <p>
            Choose days you can attend repeatedly, including the time needed for travel, setup and
            recovery between exercises. The most detailed plan is not useful if it assumes a
            schedule that rarely happens. Start with a realistic frequency, then distribute the work
            across those days. This builder supports two through six sessions and changes the split
            accordingly.
          </p>
          <p>
            Training days are not necessarily consecutive calendar days. The output numbers sessions
            in sequence, leaving you and your coach to place them in the week. Consider work, other
            sport and the demands of neighbouring sessions before assigning dates. A six-session
            template should not be interpreted as a requirement to train hard every day
            indefinitely.
          </p>
          <p>
            If your schedule varies, agree on how to resume after a missed session. Continuing with
            the next planned session can be more practical than cramming several workouts into the
            remaining days. Keep the completed record so your coach knows which work happened. A
            missed day is information for planning, not a reason to double everything without
            review.
          </p>
        </>
      ),
    },
    {
      heading: "Understand which split the builder selects",
      body: (
        <>
          <p>
            Two days uses full body A and B. Three days adds full body C. These sessions combine
            upper- and lower-body movements so the plan does not depend on a separate day for every
            body part. A lower frequency can still provide a clear structure, provided the exercises
            and workload suit the person using it.
          </p>
          <p>
            Four days uses upper A, lower A, upper B and lower B. Five days combines an upper/lower
            pair with push, pull and legs. Six days repeats push, pull and legs twice. These are
            fixed template choices, not conclusions from an assessment. Review the resulting weekly
            work rather than assuming a longer split is automatically more appropriate.
          </p>
          <p>
            The template does not ask about available equipment, injuries, session length or
            exercise preferences. It includes movements using a typical gym setup. If you do not
            have that equipment, adapt the exercise list with your coach before starting. Do not
            assume an unfamiliar machine or free-weight lift can be substituted without changing the
            intended movement and load.
          </p>
        </>
      ),
    },
    {
      heading: "Read goal-specific sets and repetitions",
      body: (
        <>
          <p>
            The muscle-building option uses four sets of six to ten repetitions for main lifts and
            three sets of ten to fifteen for accessories before the experience adjustment. The
            strength option uses five sets of three to five on main lifts and three sets of six to
            ten on accessories. General fitness and fat loss use three sets of eight to twelve on
            main lifts and three sets of twelve to fifteen on accessories.
          </p>
          <p>
            These are template rules, not a claim that a repetition range serves only one goal. The
            goal selection provides a starting emphasis. Loads still need to match technique,
            experience and intended effort. The builder does not calculate a weight for each
            exercise because it has no recent performance data for you.
          </p>
          <p>
            General fitness adds a short bike or rower interval suggestion; fat loss adds a brisk
            incline-walking suggestion. Neither guarantees a body-weight outcome. Adapt or omit
            these additions when your equipment, capacity or other activity makes them unsuitable. A
            coach should review the whole week rather than treating an optional finisher as the
            defining part of the plan.
          </p>
        </>
      ),
    },
    {
      heading: "Use experience as a modest template adjustment",
      body: (
        <>
          <p>
            For beginners, the builder removes the last accessory and subtracts one main-lift set,
            with at least two remaining. Intermediate keeps the base template. Advanced adds one
            main-lift set. This is a transparent adjustment to the starting workload, not a
            validated classification of readiness based on years spent in a gym.
          </p>
          <p>
            Choose experience in the context of the movements you will perform. Someone returning
            after a long break may need a more conservative plan despite years of earlier training.
            A person experienced in one sport may still be learning these lifts. The dropdown cannot
            replace that context, so review the output honestly rather than selecting Advanced as a
            badge.
          </p>
          <p>
            More sets are not automatically a better use of an experienced person’s time. Technique
            practice, exercise order, load and the capacity to recover all matter. If the template
            becomes impractical, reduce or adapt it with your coach. The output is intended to be
            understandable enough that those changes can be made deliberately.
          </p>
        </>
      ),
    },
    {
      heading: "Turn the list into a session you can follow",
      body: (
        <>
          <p>
            Name the exact exercise and show a demonstration when needed. Specify whether
            repetitions are a target range, whether warm-up sets are separate and what to do when
            equipment is unavailable. A list of exercise names is only the beginning. Clients need
            to understand how to perform the session and how to report the completed work.
          </p>
          <p>
            Write rest and effort in ordinary terms. This builder suggests longer rests for
            strength-focused main lifts and a shorter general range for other goals. The correct
            practical rest still depends on the exercise and person. Avoid rushing a difficult set
            solely to fit a timer when that compromises technique or the planned effort.
          </p>
          <p>
            Use recent sessions to choose a starting load. If there is no reliable reference, begin
            conservatively and use the first sessions to establish one. Do not derive a maximal
            attempt from the template’s set count. A coach can help select an appropriate load and
            adjust it after reviewing actual repetitions and execution.
          </p>
        </>
      ),
    },
    {
      heading: "Review the first week before changing the whole plan",
      body: (
        <>
          <p>
            After the first week, compare the planned sessions with what happened. Identify
            unavailable equipment, confusing cues, exercises that took longer than expected and
            loads that did not fit the target. Fix those practical issues before deciding that the
            entire split needs replacement. A usable plan becomes better through specific feedback.
          </p>
          <p>
            Keep a stable core long enough to understand performance. Replacing every exercise each
            week makes progress hard to interpret. You can change a movement when there is a clear
            reason, but record the change and establish a new baseline. Consistency makes the
            training log informative rather than a list of unrelated workouts.
          </p>
          <p>
            Choose a review rule with your coach. It might involve completed repetitions at a
            consistent effort and technique, rather than automatically adding weight every week.
            Progress is not guaranteed to follow a fixed calendar. A plan should explain the next
            decision when a session is easier, harder or incomplete, so the client knows how to
            continue.
          </p>
        </>
      ),
    },
    {
      heading: "A two- or three-day full-body starting point",
      body: (
        <>
          <p>
            Full body A starts with a back squat and bench press, then includes a barbell row,
            Romanian deadlift and plank before the beginner adjustment. This combines several
            movement patterns in one session. Check that the client knows the exercises and has the
            equipment before treating the list as ready to use. The builder cannot inspect technique
            or decide which variation best suits an individual.
          </p>
          <p>
            Full body B starts with a deadlift and overhead press, followed by a lat pulldown,
            walking lunge and cable crunch. Those exercises require different setup and skills from
            day A. Review the transition between stations and how much time the session is likely to
            take. A workable sequence matters as much as a complete list of movement patterns.
          </p>
          <p>
            The three-day version adds full body C: front squat, incline dumbbell press, seated
            cable row, hip thrust and farmer’s carry. A beginner version omits the last accessory.
            The plan therefore changes with both frequency and experience. Read the actual generated
            sessions rather than assuming that adding a day simply repeats the first one.
          </p>
          <p>
            Place the sessions in a realistic week with your coach. The numbered days express
            sequence, not fixed weekdays. If a session is missed, agree on how the sequence
            continues. Avoid squeezing two demanding sessions together just to preserve the original
            calendar when a simpler adjustment would keep the work more consistent.
          </p>
        </>
      ),
    },
    {
      heading: "A four-day upper and lower split",
      body: (
        <>
          <p>
            Upper A includes bench press and barbell row as main movements, followed by overhead
            press, lat pulldown, biceps curl and triceps pushdown before adjustments. Upper B uses
            incline dumbbell press and pull-up as main movements, then seated dumbbell press, seated
            cable row, lateral raise and hammer curl. This provides different sessions rather than
            two identical upper-body days.
          </p>
          <p>
            Lower A includes back squat and Romanian deadlift as main movements, with leg press, leg
            curl and standing calf raise. Lower B starts with deadlift and front squat, then walking
            lunge, hip thrust and seated calf raise. Review how these sessions interact with other
            activity. The template does not know whether the client also runs, plays sport or has a
            demanding physical schedule.
          </p>
          <p>
            The four-day selection can make each appointment more focused, but it still requires
            four attendances. If the client consistently completes only two or three, reconsider the
            schedule rather than letting the missing days become a permanent gap. A simpler
            frequency that is completed may be more useful than a split whose lower-body sessions
            are repeatedly missed.
          </p>
          <p>
            Use the weekly volume calculator to inspect the selected work, applying a consistent
            rule for direct and overlapping sets. Do not assume the split name alone establishes an
            appropriate workload. The exercise list, sets, effort and actual attendance determine
            what the client does.
          </p>
        </>
      ),
    },
    {
      heading: "Five and six days require a review of the whole week",
      body: (
        <>
          <p>
            The five-day option combines upper A and lower A with push, pull and legs. The six-day
            version repeats push, pull and legs twice. These higher-frequency choices are convenient
            templates, but frequency itself is not proof of readiness. Read the weekly set count and
            consider whether the client can repeat the sessions with the intended technique and
            effort.
          </p>
          <p>
            The push session includes bench press and overhead press, then incline dumbbell press,
            lateral raise and triceps pushdown. Pull includes deadlift and pull-up, then barbell
            row, face pull and biceps curl. Legs includes back squat and Romanian deadlift, then leg
            press, leg curl and standing calf raise. The ordering can produce substantial work
            across neighbouring sessions.
          </p>
          <p>
            Check recovery and scheduling rather than assuming a six-day selection is a more serious
            version of the same plan. A client may have ample training experience but limited time
            or additional sport demands. Another may prefer short frequent sessions. Those
            individual reasons matter more than the label in the dropdown.
          </p>
          <p>
            If the generated work is too much, adapt it deliberately with your coach. Do not simply
            perform every main lift to failure while skipping the remaining exercises unpredictably.
            A revised plan with clear priorities produces a more interpretable log and gives the
            client a better instruction for the next attendance.
          </p>
        </>
      ),
    },
    {
      heading: "Write the rules for an incomplete or unexpectedly difficult session",
      body: (
        <>
          <p>
            Clients need to know what to do when the day differs from the plan. An exercise station
            may be occupied, a load may feel unusually hard, or available time may be shorter. Agree
            on priorities and communication before those situations occur. The builder does not
            choose an automatic response for every interruption.
          </p>
          <p>
            For a load that misses the target repetitions, record what was completed and the effort
            rather than editing the log to match the prescription. The coach can then decide whether
            to repeat, reduce or change the target. An honest incomplete set is more useful
            information than a completed checkbox with no explanation.
          </p>
          <p>
            For time-limited sessions, identify which work is essential and which can be omitted
            after discussion. Do not turn every missed accessory into extra work at the next
            appointment. The next session already has its own demands. A clear plan for
            interruptions helps the client continue without improvising large changes.
          </p>
          <p>
            When pain or concerning symptoms occur, stop the relevant movement and seek appropriate
            advice. The template is not a medical assessment and does not make an exercise
            appropriate for every person. Keep that boundary clear even when the exercise appears in
            a familiar split.
          </p>
        </>
      ),
    },
    {
      heading: "Use a stable record to guide the next block",
      body: (
        <>
          <p>
            After several comparable sessions, review more than the largest weight lifted. Look at
            attendance, completed repetitions, technique, effort and whether instructions were
            understood. If the client follows the plan consistently, you have a better basis for a
            small progression. If practical problems dominate the record, solve those before adding
            complexity.
          </p>
          <p>
            Preserve the original prescription alongside the completed work. This lets a coach
            distinguish a load that was intentionally reduced from one entered incorrectly. Keep
            notes short and specific, such as different machine or shortened session, so the next
            review does not depend on memory.
          </p>
          <p>
            The builder provides structure, while the training record supplies individual evidence.
            Use both. The goal is not to keep regenerating a new split every time progress slows,
            but to understand the current plan well enough to make the next useful change.
          </p>
        </>
      ),
    },
    {
      heading: "A final checklist before the first session",
      body: (
        <>
          <p>
            Confirm the exact exercise variations and the equipment available. Check that the client
            understands the set and repetition notation, which sets are warm-ups, and how the target
            effort should feel. Make sure they know how to ask about an unfamiliar exercise before
            loading it. The builder does not supply an individual movement assessment.
          </p>
          <p>
            Confirm the time available for the complete session, including rest and setup. A session
            with five exercises can take very different amounts of time depending on equipment
            changes and rest between demanding sets. If the schedule is tight, revise the plan in
            advance rather than expecting the client to rush the final half.
          </p>
          <p>
            Confirm the reporting rule. Record completed loads and repetitions, not just whether the
            session was opened. Add a short note when the exercise or equipment changed. This gives
            the coach something concrete to review and helps prevent the same confusion from
            appearing in the next session.
          </p>
          <p>
            Confirm when the plan will be reviewed and what to do before then if it is too easy, too
            hard or incomplete. The review date is a point to examine evidence, not a guaranteed
            date for a heavier lift or a particular body-weight result. A client should understand
            how to continue while the coach uses the log to make the next adjustment.
          </p>
          <p>
            These checks turn a template into an understandable starting plan. Keep them visible and
            concise in the session instructions. More explanation is helpful only when it resolves a
            real question; the client should be able to recognise the next exercise and follow it
            without searching through separate messages.
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
      q: "How do I build a workout plan from scratch?",
      a: "Decide which days you can attend, choose a primary goal, select movements suited to your equipment and experience, then write sets, repetitions and a review rule. Use the generated split as a starting point.",
    },
    {
      q: "How many days should I train?",
      a: "Choose a frequency you can repeat. This builder supports two to six days. More sessions are not automatically better, and an achievable schedule is more useful than an ambitious plan you regularly miss.",
    },
    {
      q: "Which split is best?",
      a: "There is no universal best split. The builder uses full body for two or three days, upper/lower for four, a combined split for five and push/pull/legs for six. Review the resulting workload before using it.",
    },
    {
      q: "How many exercises should each session contain?",
      a: "The template uses four to six exercises depending on the split and experience. The right number for your session also depends on setup time, rest, technique and the work you can complete well.",
    },
    {
      q: "How do I make the plan usable for clients?",
      a: "Name the exact exercises, write clear set and repetition targets, explain effort and rest, and provide a way to log the completed work. Review that record before changing the next session.",
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
