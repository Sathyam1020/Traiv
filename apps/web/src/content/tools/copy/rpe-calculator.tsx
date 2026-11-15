import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "RPE Calculator: Convert RPE and Reps to % of 1RM",
  description:
    "Free RPE calculator. Turn reps and RPE into a percentage of your one-rep max, estimate your max from a set, or find the working weight for a target RPE.",
  eyebrow: "Free tool · Strength",
  h1: "RPE calculator",
  intro: (
    <>
      <p>
        RPE, the rate of perceived exertion, describes how hard a set felt on a scale from 6 to 10,
        where 10 means you could not have done another rep. This calculator converts reps and RPE
        into a percentage of your one-rep max, so you can estimate your max from a set or work out
        how heavy to go for a target effort.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How does the RPE scale work?",
    answer: (
      <>
        <p>
          In strength training, RPE 10 means maximal effort, with no reps left. RPE 9 means one rep
          left, RPE 8 two reps left, RPE 7 three reps left, and half points mean you might have
          managed one more. Combining reps with RPE tells you roughly what percentage of your max
          you used.
        </p>
        <p>
          Five reps at RPE 8 is about 81 percent of your one-rep max. If you did that set with 100
          kg, your estimated max is about 123 kg. To hit five reps at RPE 8 next week with a 123 kg
          max, load about 100 kg.
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
            In the default mode, enter your reps and RPE to get the percentage of your one-rep max
            that combination represents. If you also enter the weight you used, the calculator
            divides it by that percentage to estimate your max. In working-weight mode, enter your
            one-rep max instead, and the calculator multiplies it by the percentage to give the load
            for that set, rounded to the nearest 5 lb or 2.5 kg.
          </p>
        </>
      ),
    },
    {
      heading: "The RPE chart in practice",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Reps</th>
                  <th scope="col">RPE 10</th>
                  <th scope="col">RPE 9</th>
                  <th scope="col">RPE 8</th>
                  <th scope="col">RPE 7</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>100%</td>
                  <td>95.5%</td>
                  <td>92.2%</td>
                  <td>89.2%</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>92.2%</td>
                  <td>89.2%</td>
                  <td>86.3%</td>
                  <td>83.7%</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>86.3%</td>
                  <td>83.7%</td>
                  <td>81.1%</td>
                  <td>78.6%</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>78.6%</td>
                  <td>76.2%</td>
                  <td>73.9%</td>
                  <td>70.7%</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>73.9%</td>
                  <td>70.7%</td>
                  <td>68.0%</td>
                  <td>66.4%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Each step down in RPE behaves like adding a rep to the set: five reps at RPE 8 sits at
            the same percentage as seven reps at RPE 10. The calculator uses this relationship,
            interpolating for half-point RPEs and extending the chart beyond 12 effective reps with
            the Epley curve.
          </p>
        </>
      ),
    },
    {
      heading: "Why effort-based training works",
      body: (
        <>
          <p>
            Strength varies from day to day. Sleep, stress, food, illness and the training you did
            earlier in the week all affect how strong you are today. A fixed percentage of your max
            can feel easy on a good day and crushing on a bad one. Effort-based targets, such as RPE
            8 or two reps in reserve, adjust automatically: on a strong day the weight goes up, on a
            weak day it comes down, but the effort and training effect stay consistent.
          </p>
          <p>
            This approach is called autoregulation, and it is widely used by strength coaches
            because it matches training to what the body can actually do on the day, rather than
            what a spreadsheet predicted weeks earlier.
          </p>
        </>
      ),
    },
    {
      heading: "Learning to rate effort accurately",
      body: (
        <>
          <p>
            Rating effort takes practice, and uncertainty is normal when learning a movement. Review
            the final repetitions with your coach and describe whether another repetition could use
            the same technique. A video and notes about the set can support that discussion. You do
            not need to deliberately reach failure to prove a rating, and no particular exercise is
            universally safe for a failure test. Compare repeatable sets over time rather than
            promising a fixed calibration deadline. Keep the target effort and the reported effort
            separate in your training record.
          </p>
          <ul>
            <li>
              <strong>Bar speed slows noticeably:</strong> usually two or three reps left.
            </li>
            <li>
              <strong>Grinding, very slow rep:</strong> usually zero or one rep left.
            </li>
            <li>
              <strong>Form starts to change:</strong> you are close to technical failure; stop.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Using effort with percentages",
      body: (
        <>
          <p>
            Many programmes combine both methods. A plan might call for sets of five at about 80
            percent with a cap of RPE 8. If 80 percent feels like RPE 7, you add a little weight; if
            it feels like RPE 9, you take some off. Percentages give a starting point, and effort
            fine-tunes it. Over time, the relationship between your percentages and your RPEs also
            tells you whether your estimated max is accurate.
          </p>
        </>
      ),
    },
    {
      heading: "Where RPE came from",
      body: (
        <>
          <p>
            The original Borg scale of perceived exertion was developed for endurance exercise and
            ran from 6 to 20. Strength coaches later adapted the idea into a 1 to 10 scale tied to
            reps in reserve, popularised by powerlifting coach Mike Tuchscherer. Linking each RPE to
            a specific number of reps left made the scale far more precise for lifting, and it is
            now one of the most common ways to program strength training.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing RPE targets",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Typical RPE</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Technique practice</td>
                  <td>6 to 7</td>
                  <td>Crisp reps, plenty left in reserve</td>
                </tr>
                <tr>
                  <td>Muscle growth</td>
                  <td>7 to 9</td>
                  <td>Most sets close to failure</td>
                </tr>
                <tr>
                  <td>Strength</td>
                  <td>7 to 9</td>
                  <td>Heavy but not grinding</td>
                </tr>
                <tr>
                  <td>Peaking for a meet</td>
                  <td>8 to 10</td>
                  <td>Heavy singles and doubles</td>
                </tr>
                <tr>
                  <td>Deload week</td>
                  <td>5 to 6</td>
                  <td>Recovery with light work</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Most training sets for strength and muscle growth fall between RPE 7 and 9. Regular sets
            at RPE 10 add fatigue without much extra benefit and increase the risk of breaking
            technique.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes with RPE",
      body: (
        <>
          <ul>
            <li>
              <strong>Rating too low</strong> because sets feel hard; most beginners have more reps
              left than they think.
            </li>
            <li>
              <strong>Rating the whole session</strong> instead of each set.
            </li>
            <li>
              <strong>Ignoring technique:</strong> a rep with broken form counts as failure for RPE
              purposes.
            </li>
            <li>
              <strong>Using RPE on unstable or risky exercises</strong> where reaching true failure
              is dangerous.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "A worked example: estimating your max from a set",
      body: (
        <>
          <p>
            You bench 80 kg for 6 reps and rate it RPE 8.5, meaning you probably had one or two reps
            left. Six reps at RPE 8.5 behaves like seven and a half reps at RPE 10, which the chart
            places at 79.85 percent of your one-rep max. Dividing 80 kg by 0.7985 gives an estimated
            max of roughly 100.2 kg. You did not need to test a heavy single to get a useful number,
            and you can update it every week from your normal training sets.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example: choosing a load",
      body: (
        <>
          <p>
            Your programme asks for three sets of five at RPE 8 on the squat, and your estimated max
            is 140 kg. Five reps at RPE 8 is about 81 percent, so 140 × 0.81 = 113.4 kg, rounded to
            112.5 kg. Load that for your first set. If it feels like RPE 7, add 2.5 to 5 kg for the
            next set; if it feels like RPE 9, drop 2.5 to 5 kg. This combination of a calculated
            start and a feel-based adjustment is how most lifters use RPE in practice.
          </p>
        </>
      ),
    },
    {
      heading: "RPE for different exercises",
      body: (
        <>
          <p>
            RPE is easiest to rate on compound lifts with clear feedback from bar speed, such as
            squats, bench presses and deadlifts. It is harder on isolation exercises, where burning
            sensations can make a set feel harder than it really is, and on exercises with a lot of
            balance demand, where technique fails before the muscles do. Many coaches use precise
            RPE targets for main lifts and simpler instructions, such as 'one or two reps short of
            failure', for accessories.
          </p>
        </>
      ),
    },
    {
      heading: "RPE and fatigue over a session",
      body: (
        <>
          <p>
            As a session goes on, the same weight tends to feel harder. A set of five at 100 kg
            might be RPE 7 on the first set and RPE 8.5 by the fourth. Many programmes use this
            deliberately: a top set at a target RPE, followed by back-off sets at a lower weight,
            keeps the effort manageable across the session. If the RPE of your sets climbs much
            faster than usual, it is a sign of accumulated fatigue, and reducing the number of sets
            that day can be wise.
          </p>
        </>
      ),
    },
    {
      heading: "RPE over a training block",
      body: (
        <>
          <p>
            A common structure is to start a training block at moderate RPEs, such as 6 to 7, and
            gradually increase the target over three to five weeks to 8 or 9, before a lighter week.
            This builds fitness and strength steadily while managing fatigue. Tracking the weight
            you lift at each RPE across the block shows whether you are getting stronger: lifting
            more at the same RPE, or the same weight at a lower RPE, are both clear signs of
            progress.
          </p>
        </>
      ),
    },
    {
      heading: "When RPE is not the right tool",
      body: (
        <>
          <p>
            RPE relies on honest, accurate self-assessment. It works less well for complete
            beginners who have never trained near failure, for people who tend to push too hard
            regardless of the target, and for exercises where approaching failure is risky. In those
            cases, fixed weights and reps with conservative progression may be safer, with RPE
            introduced gradually once the lifter has more experience.
          </p>
        </>
      ),
    },
    {
      heading: "RPE and conditioning",
      body: (
        <>
          <p>
            The original Borg scale and its simplified 1 to 10 versions are also used to rate whole
            sessions or conditioning work, where they describe overall breathlessness and effort
            rather than reps in reserve. Some coaches multiply a session RPE by its duration in
            minutes to estimate training load, a method called session RPE. This calculator uses the
            strength-training version tied to reps in reserve, which is a different scale even
            though it uses the same name.
          </p>
        </>
      ),
    },
    {
      heading: "Building the habit",
      body: (
        <>
          <p>
            Rate every working set as you finish it, while the feeling is fresh, and write it down
            alongside the weight and reps. After a few weeks, compare your ratings with your actual
            performance on later sets or tests. Most lifters find their accuracy improves quickly
            once they start paying attention. Over time, a log of weights and RPEs becomes one of
            the most useful records you have, because it shows not just what you lifted but how hard
            it was.
          </p>
        </>
      ),
    },
    {
      heading: "Separate the rating from the load decision",
      body: (
        <>
          <p>
            A rating describes the set you just completed. It is not an instruction to increase the
            next set automatically. Before changing weight, check whether the plan calls for
            repeated sets at a fixed load, a top set followed by lighter work, or an effort target
            for every set. Those are different prescriptions. An RPE 7 first set could be exactly
            right when the next three sets are expected to become harder as fatigue accumulates.
            Adding weight immediately might make the final set substantially harder than intended.
          </p>
          <p>
            For a top-set approach, record the actual load, repetitions and rating together. Use the
            estimate as one piece of evidence for the back-off work. If the top set contains a
            missed pause or shortened range, do not let its apparently strong estimate determine the
            whole session. The calculator cannot recognise those changes. A coach reviewing the
            video may reasonably hold the load steady even when the arithmetic suggests an increase.
          </p>
          <p>
            When repeated sets are prescribed at the same RPE, a small load reduction later in the
            session is not a failure. It can be the expected consequence of doing work. Record the
            reduction so that you can compare equivalent sets next time. Comparing the first set
            this week with the final set last week confuses fatigue with progress.
          </p>
        </>
      ),
    },
    {
      heading: "Use a consistent question after every set",
      body: (
        <>
          <p>
            Ask how many additional repetitions you could have completed with the same range,
            control and technique. That wording is more useful than asking whether a set felt hard.
            A long set can feel unpleasant because of breathing or local burning while several
            technically sound repetitions remain. Conversely, a heavy single can feel brief but
            leave no realistic second repetition. The rating should describe remaining repetitions,
            not how much you disliked the exercise.
          </p>
          <p>
            Give the rating before opening the calculator result. Otherwise the predicted percentage
            can anchor your judgement: you may decide the set must have been RPE 8 because that is
            what the planned load implied. Keep the observation independent, then compare
            observation with prediction. A repeated mismatch is a reason to review the estimate,
            technique or exercise setup rather than force the rating to fit the chart.
          </p>
          <p>
            Use the same convention for assisted repetitions. A spotter touching the bar changes
            what you completed independently. Do not record an assisted final repetition as an
            unassisted rep when estimating a max. Note the assistance and use the last clearly
            independent set instead. The same applies to a change in equipment, such as moving from
            a paused barbell bench to a machine chest press.
          </p>
        </>
      ),
    },
    {
      heading: "A practical review at the end of the week",
      body: (
        <>
          <p>
            Look for a pattern across comparable sessions. If the same load and repetitions
            repeatedly feel easier with consistent technique, that supports a modest progression. If
            one unusually strong session is followed by two difficult ones, a large jump based on
            the best estimate is harder to justify. The purpose of recording effort is to make the
            next decision better, not to produce the largest possible estimated maximum.
          </p>
          <p>
            Write down what changed before interpreting the trend. A longer rest interval, different
            exercise order, straps, a belt, a new machine or a shorter range can all change
            performance. You can still use the session, but label it accurately. A simple note such
            as first exercise instead of third prevents a misleading comparison months later when
            the context is easy to forget.
          </p>
          <p>
            For a client, keep the instruction short: finish the planned repetitions, stop when
            technique changes, and report how many good repetitions remained. The coach can handle
            the conversion into percentages. Giving the client several competing numerical targets
            at once often makes the session harder to follow without improving the information
            returned.
          </p>
        </>
      ),
    },
    {
      heading: "When to leave the estimate out of the decision",
      body: (
        <>
          <p>
            Do not use an effort estimate to clear pain, return from injury or justify a maximal
            attempt after an interruption. It estimates a relationship between load and repetitions
            under assumed conditions; it does not assess readiness or health. If symptoms, illness
            or an unfamiliar movement make the set unrepresentative, preserve the note and choose a
            more appropriate session with your coach.
          </p>
          <p>
            A missing estimate is better than a precise-looking number built from poor inputs. You
            can still record the completed work and return to the calculation after a few consistent
            sessions. Keeping the conditions stable gives future ratings a useful reference and
            makes any eventual progression easier to explain.
          </p>
        </>
      ),
    },
    {
      heading: "Keep the estimate attached to its exercise",
      body: (
        <>
          <p>
            A squat estimate belongs to the squat variation you performed. It should not become a
            front-squat, leg-press or deadlift maximum through a change of label. Even closely
            related lifts can differ enough to make that shortcut misleading. Keep separate records
            for movements with different technique requirements, and use a new baseline when you
            make a lasting change to the exercise.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using RPE with clients",
    body: (
      <>
        <p>
          RPE lets you program for clients you cannot see train every day. A target of RPE 8 adjusts
          automatically to their state on the day, which makes remote coaching far more effective
          than fixed weights.
        </p>
        <p>
          Teach clients the scale gradually. Start with simple reps-in-reserve language, check their
          ratings against videos, and refine over a few weeks.
        </p>
        <p>
          Use logged RPEs to spot trends. If a client's RPE at the same weight is rising week after
          week, fatigue may be building; if it is falling, they are getting stronger.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Program by effort for every client",
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
    { label: "Work in reps in reserve instead", href: "/tools/rir-calculator" },
    { label: "Estimate your one-rep max", href: "/tools/one-rep-max-calculator" },
  ],
  nextPitch:
    "Programming by RPE for clients? Traiv keeps every client's plans and logged sets together.",
  faq: [
    {
      q: "What does RPE mean in lifting?",
      a: "Rate of perceived exertion: how hard a set felt on a scale where 10 means no more reps were possible.",
    },
    { q: "What is RPE 8?", a: "A set where you could have done about two more reps." },
    {
      q: "What percentage of my one-rep max is a given RPE?",
      a: "Combine reps and RPE: for example, 5 reps at RPE 8 is about 81 percent of your one-rep max.",
    },
    {
      q: "Is RPE accurate?",
      a: "With practice, most lifters rate within about one rep. Beginners often underestimate how many reps they have left.",
    },
    {
      q: "What RPE should I train at?",
      a: "Most strength and muscle-building sets fall between RPE 7 and 9.",
    },
    {
      q: "What is the difference between RPE and RIR?",
      a: "They describe the same thing from different angles: RPE 8 equals two reps in reserve.",
    },
    {
      q: "Can I use RPE for every exercise?",
      a: "It works best for lifts where you can safely approach failure. For risky lifts, keep a margin.",
    },
    {
      q: "Why does the same weight feel different on different days?",
      a: "Sleep, stress, food and fatigue all change your strength from day to day, which is why RPE-based training is useful.",
    },
  ],
  keepGoing: [
    { label: "RIR calculator", href: "/tools/rir-calculator" },
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    {
      label: "Weekly training volume calculator",
      href: "/tools/weekly-training-volume-calculator",
    },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Effort-based programmes for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
