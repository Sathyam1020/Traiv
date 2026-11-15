import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Strength standards calculator",
  description:
    "Compare a squat, bench press, deadlift or overhead press with published bodyweight-ratio benchmarks. See your current band and the next threshold in kg or ",
  eyebrow: "Free tool · Strength",
  h1: "Strength standards calculator",
  intro: (
    <>
      <p>
        Compare a squat, bench press, deadlift or overhead press with published bodyweight-ratio
        benchmarks. See your current band and the next threshold in kg or lb.
      </p>
    </>
  ),
  method:
    "Strength Level aggregate bodyweight ratios, checked 15 November 2026. Simplified coaching reference; not age-adjusted norms.",
  sources: [
    {
      label: "Strength Level: squat standards",
      href: "https://strengthlevel.com/strength-standards/squat/lb",
    },
    {
      label: "Strength Level: bench press standards",
      href: "https://strengthlevel.com/strength-standards/bench-press/lb",
    },
    {
      label: "Strength Level: deadlift standards",
      href: "https://strengthlevel.com/strength-standards/deadlift/lb",
    },
    {
      label: "Strength Level: shoulder press standards",
      href: "https://strengthlevel.com/strength-standards/shoulder-press/lb",
    },
  ],
  shortAnswer: {
    question: "How is my strength level calculated?",
    answer: (
      <>
        <p>
          Divide your one-rep max by your body weight, then compare that ratio with the selected
          lift and sex category. At 180 lb body weight, a 275 lb squat is 1.53 times body weight:
          Novice in these sourced bands. The Intermediate threshold is 315 lb.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What a strength standard describes",
      body: (
        <>
          <p>
            A strength standard compares a named performance with a particular reference. In this
            tool, the performance is a one-rep maximum divided by body weight. The reference is a
            set of published aggregate bodyweight-ratio bands from Strength Level. The output is
            deliberately narrower than a claim about how strong every person of your age should be.
            It does not assess movement quality, health, athletic skill or the work you have done to
            reach the number.
          </p>
          <p>
            The source population matters. People who log lifting results are not a random sample of
            everyone who could lift. The labels describe that lifting context. A beginner label can
            include someone with extensive experience in another sport, and an advanced label on one
            lift says little about an unfamiliar movement. Read the label as a reference for this
            specific input rather than as an identity.
          </p>
          <p>
            The simplified ratio method also differs from a detailed weight-class table. A fixed
            ratio produces a straight-line target when multiplied by body weight. Real performance
            does not necessarily scale in a straight line across all body sizes. Use the bands for a
            broad coaching comparison and use the relevant competition rules or detailed source
            tables when a more specific comparison is needed.
          </p>
        </>
      ),
    },
    {
      heading: "Check the lift before entering a maximum",
      body: (
        <>
          <p>
            Choose the exercise that matches the completed lift. A back squat is not a leg press, a
            bench press is not a machine press, and a standing overhead press is not a seated
            dumbbell press. Substituting a different exercise can produce a convincing number with
            the wrong interpretation. Keep variations separate in your log and compare like with
            like.
          </p>
          <p>
            Agree on range and technique. Squat depth, pauses on the bench, deadlift lockout and
            assistance can change the performance. A heavier partial repetition is not directly
            comparable with a full repetition under another standard. If you change the execution
            intentionally, record it as a new variation or make the difference clear beside the
            result.
          </p>
          <p>
            A maximum can be tested or estimated. An estimate from a recent repetition set avoids
            requiring a maximal attempt, but it introduces uncertainty. A set performed far from
            failure, an unfamiliar lift or a change in technique makes the estimate harder to
            interpret. If the result is close to a band boundary, do not treat a tiny change as a
            decisive promotion.
          </p>
        </>
      ),
    },
    {
      heading: "Read the next threshold as a reference",
      body: (
        <>
          <p>
            The next threshold is the load corresponding to the next ratio at the body weight you
            entered. It is not a load to attempt in your next session. The calculator does not know
            your current working sets, recent training, equipment or recovery. Those details
            determine how a coach might turn a broad benchmark into a practical plan.
          </p>
          <p>
            At 180 lb body weight, a 275 lb squat produces a ratio of about 1.53. Using the
            published male squat ratios in this tool, that is above the Novice threshold of 1.25 and
            below Intermediate at 1.75. Multiplying 180 by 1.75 gives 315 lb. The forty-pound gap
            describes the benchmark difference, not a promise about how quickly it can be closed.
          </p>
          <p>
            If body weight changes, the threshold changes too. A higher ratio can come from a larger
            lift, a lower body weight or both. Do not assume weight loss is the right way to improve
            the label. The appropriate goal depends on the person, their health and their training.
            Track the actual lift and body weight alongside the ratio so the reason for a change
            remains visible.
          </p>
        </>
      ),
    },
    {
      heading: "Use separate standards for separate lifts",
      body: (
        <>
          <p>
            The four exercises have different mechanics and typical loading. A deadlift ratio should
            not be used to judge a bench press. Select the correct lift before reading the band. If
            one result looks much lower than another, consider practice, technique, exercise
            selection and training emphasis before deciding that it represents a problem.
          </p>
          <p>
            An overhead press often progresses in smaller absolute increments than a squat or
            deadlift. Plate availability can make those increments awkward. Keep a realistic working
            progression rather than letting a broad benchmark push you into a jump you cannot
            control. The next category is a reference point; consistent sessions and sound technique
            are the work that make progress possible.
          </p>
          <p>
            Differences between lifts can help organise a conversation. A client may practise the
            bench often while doing little overhead work. That explains part of the comparison
            without needing a diagnosis of imbalance. Review the training record before adding more
            volume to the lower-ranked movement, because changing frequency, technique practice and
            total work all have consequences.
          </p>
        </>
      ),
    },
    {
      heading: "Turn a benchmark into a reviewable goal",
      body: (
        <>
          <p>
            Begin with the recent sessions rather than the category name. Write down the exercise,
            normal working loads, repetitions, effort and any technical issue the coach is
            addressing. Decide which observation would count as progress over the next block. More
            controlled repetitions at the same load may be more relevant than a new estimated
            maximum on a day with altered technique.
          </p>
          <p>
            Choose a review date without guaranteeing a result by that date. At the review, inspect
            attendance, completed work and whether the movement became more repeatable. A goal can
            remain useful even when the estimate has not crossed the next boundary. Conversely,
            crossing a threshold once does not prove that a new working weight is appropriate every
            session.
          </p>
          <p>
            Keep the calculation consistent. Use the same unit for maximum and body weight, the same
            sex category and the same source version. If the source changes later, distinguish a
            recalculated benchmark from an actual change in performance. Preserving those details
            avoids a misleading before-and-after comparison.
          </p>
        </>
      ),
    },
    {
      heading: "What the calculator leaves out",
      body: (
        <>
          <p>
            Age, training age, disability, injury history, limb proportions, equipment and technique
            are not inputs. The output therefore cannot adjust for them. Do not read an age-specific
            expectation into a result simply because another standards website offers age tables.
            This implementation uses the published aggregate ratios described in its method note.
          </p>
          <p>
            The result is not a percentile of the general population. It does not say that you are
            stronger than a particular percentage of all people, and it does not determine whether
            someone is healthy enough to train. It is also not a competition qualifying total.
            Federations use their own divisions, rules and qualifying standards.
          </p>
          <p>
            Use a coach or relevant professional when the decision requires more than a comparison.
            Returning after injury, selecting a maximal attempt or planning weight change needs
            individual context. A benchmark can help organise that discussion, but it cannot replace
            it.
          </p>
        </>
      ),
    },
    {
      heading: "How to read each lift in context",
      body: (
        <>
          <p>
            For the back squat, establish a consistent depth and setup before comparing ratios. A
            change in bar position, footwear or range can alter the load you can lift. The category
            does not tell you whether the repetition met your intended standard. Keep that technical
            standard in the plan, and use a video or coach review when you are unsure whether recent
            performances are comparable.
          </p>
          <p>
            For the bench press, distinguish a paused repetition from touch-and-go work and note any
            assistance. A spotter helping through the final portion changes what was lifted
            independently. Use a recent unassisted maximum or estimate from a clearly completed set.
            The reference does not know whether a repetition was paused, whether the hips stayed on
            the bench or whether the range changed.
          </p>
          <p>
            For the deadlift, keep the variation consistent. A conventional deadlift, sumo deadlift,
            Romanian deadlift and trap-bar pull are different movements. Select Deadlift here only
            for the matching barbell lift you intend to compare. A higher starting position or
            straps can alter the performance, so preserve those details in your log rather than
            assuming the ratio explains the whole result.
          </p>
          <p>
            For the overhead press, use the same strictness convention each time. Leg drive can turn
            a strict press into a push press. Sitting on a supported bench also changes the task
            compared with a standing barbell press. If the movement changes, the resulting maximum
            belongs to a different baseline. A lower number with a stricter standard can be better
            information than a higher ambiguous one.
          </p>
        </>
      ),
    },
    {
      heading: "Two useful ways to track progress",
      body: (
        <>
          <p>
            First, track the actual performance: a maximum, or a recent set recorded with load,
            repetitions and effort. This preserves the task you completed. Second, track the
            bodyweight ratio used by the calculator. Together they distinguish a stronger lift from
            a change in the denominator. If you only retain the category name, you lose that
            distinction and make later decisions harder.
          </p>
          <p>
            Imagine the same 275 lb squat recorded at 180 lb and then at 175 lb body weight. The
            ratios are approximately 1.53 and 1.57. The ratio rose even though the lift did not
            change. That may be relevant to a particular goal, but it does not show an increase in
            the load lifted. Keep both observations instead of describing every higher ratio as an
            increase in absolute strength.
          </p>
          <p>
            Now imagine increasing the squat from 275 to 285 lb while staying at 180 lb. The ratio
            moves from about 1.53 to 1.58. That is a clear increase in load under the assumed same
            technique, even though both results remain inside the same band. The broad category
            hides a useful improvement, which is why it should not be the only measure of progress.
          </p>
        </>
      ),
    },
    {
      heading: "Review a result close to a boundary",
      body: (
        <>
          <p>
            An estimated maximum can vary enough to cross a nearby threshold without a meaningful
            change in training. A different formula, a slightly different effort rating or rounding
            can move the estimate. If the result sits near the next band, confirm the input and look
            for repeated comparable performance before making a large programme change.
          </p>
          <p>
            The next-load display is rounded for readability. It is not a plate-loading instruction.
            A theoretical threshold might fall between the increments your equipment supports. Use
            the plate-loading tool to understand available loads, then decide on a session target
            from the planned repetitions and effort. Do not attempt an awkward or excessive load
            just to clear a label.
          </p>
          <p>
            A result well inside a band is not a reason to train without review either. The same
            category can contain a wide range of experience, and progress within the category still
            matters. A coach can choose a smaller performance target that is appropriate for the
            current block rather than treating the next threshold as the only worthwhile outcome.
          </p>
        </>
      ),
    },
    {
      heading: "Use a source you can identify later",
      body: (
        <>
          <p>
            The source and checked date are part of the result’s meaning. This calculator uses
            published aggregate bodyweight ratios checked on 15 November 2026. It does not claim
            that those ratios are a new population study or that they reproduce every detailed table
            on the publisher’s site. The linked source pages let you inspect the context and compare
            the simplified method with other presentations.
          </p>
          <p>
            If you bring a result from another calculator, compare methods before comparing labels.
            One site may use age groups, another may use competition results and another may use
            fixed ratios. Intermediate on one scale does not necessarily mean the same thing on
            another. Ask which lift, source population, units and thresholds were used before
            interpreting a difference as a mistake.
          </p>
          <p>
            For a training group, keep one documented method during a block. If you change it later,
            record that change explicitly. A new label after a formula update is not the same event
            as a new personal best. Good records preserve enough context that a client can
            understand why the number or category changed without guessing.
          </p>
        </>
      ),
    },
    {
      heading: "Explain the result without making a promise",
      body: (
        <>
          <p>
            When sharing a result, include the lift, maximum, body weight, unit and whether the
            maximum was tested or estimated. Add the source method and the current band. This is
            enough context for another coach to understand the calculation without guessing. A
            screenshot containing only the word Intermediate loses most of the useful information.
          </p>
          <p>
            Use the next threshold to frame a question: what training would help this lift progress
            while fitting the client’s actual schedule? That question invites a plan grounded in
            recent work. Saying the client must reach the next level within four weeks would add a
            deadline the calculator cannot justify.
          </p>
          <p>
            If the client is disappointed by a label, bring the discussion back to their own record.
            A first consistent month, improved technique or a repeatable set can be meaningful
            progress before a broad band changes. The category is a reference that should support
            the training discussion, not replace the client’s reason for training.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use this result with ChatGPT",
    whenToUse: "After checking the lift, unit and source.",
    pasteIn: "Paste your result and recent training notes.",
    text: `Help me discuss a strength goal with my coach. My lift is [lift], body weight [weight and unit], and tested or estimated 1RM [load]. The calculator uses Strength Level aggregate bodyweight ratios, not population percentiles. My current band is [band] and next threshold [load]. My available training days, equipment and recent sessions are [details]. Explain the gap without promising a deadline or treating the threshold as a working load. Ask for missing context before proposing changes.`,
  },
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
      q: "What are strength standards?",
      a: "They are reference benchmarks for a named lift and comparison group. They describe performance under stated assumptions, not health, personal worth or a universal training timeline.",
    },
    {
      q: "How does this calculator rank a lift?",
      a: "It divides one-rep max by body weight and compares the result with Strength Level’s published aggregate ratio thresholds for the selected lift and sex category. It does not reproduce the publisher’s detailed weight-by-weight or age tables.",
    },
    {
      q: "How strong should my main lifts be for my size?",
      a: "Choose the lift, enter your numbers and inspect the next threshold. A useful personal target also depends on experience, technique and the training you can consistently complete.",
    },
    {
      q: "Are these standards accurate for everyone?",
      a: "No. The source describes a lifting community. These simplified bands do not adjust for age, disability, limb proportions, equipment or training history and are not general-population percentiles.",
    },
    {
      q: "Do I need to test a maximum?",
      a: "No. You can enter an estimated one-rep max from a recent set, provided you label it as estimated. Formula uncertainty can move a result across a nearby band boundary.",
    },
    {
      q: "How should a coach use the result?",
      a: "Use it as a conversation about the current lift and a realistic next step. Keep the exercise standard stable, inspect the session record and avoid promising a level within a fixed number of weeks.",
    },
    {
      q: "How much weight should I lift?",
      a: "The next threshold is a reference, not your next working weight. Select a session load from the planned repetitions, effort and technique with your coach.",
    },
    {
      q: "Can I use an AI assistant to plan from the result?",
      a: "Yes, for organising questions and a draft discussion. Include the source, unit, exercise, current maximum and training constraints. Ask it to distinguish a benchmark from a safe session prescription.",
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
