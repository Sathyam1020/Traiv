import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "RIR Calculator: Reps in Reserve to RPE and % of 1RM",
  description:
    "Free RIR calculator. Convert reps and reps in reserve into RPE and a percentage of your one-rep max, estimate your max, or get a working weight for any target.",
  eyebrow: "Free tool · Strength",
  h1: "RIR calculator",
  intro: (
    <>
      <p>
        Reps in reserve, or RIR, is the number of extra reps you could have done at the end of a
        set. It is one of the simplest ways to describe effort. Enter your reps and RIR, and this
        calculator converts them to RPE and a percentage of your one-rep max, estimates your max if
        you add the weight you used, or gives you a working weight for a target set.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What does reps in reserve mean?",
    answer: (
      <>
        <p>
          Reps in reserve is how many more reps you could have done with good form. Stopping a set
          with two reps left is 2 RIR, which is the same as RPE 8. Zero RIR means you reached
          failure.
        </p>
        <p>
          Eight reps with 2 RIR is about 74 percent of your one-rep max. If you used 60 kg, your
          estimated max is about 81 kg. Most effective training sets end with between zero and three
          reps in reserve.
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
            RIR converts to RPE by subtracting it from 10: 2 RIR is RPE 8, 1 RIR is RPE 9. The
            calculator then uses the standard reps-and-RPE chart to find the percentage of your
            one-rep max. Add the weight you used to estimate your max, or switch to working-weight
            mode and enter your max to get the load for a target set.
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
      heading: "Why RIR is easy to use",
      body: (
        <>
          <p>
            Many lifters find reps in reserve more intuitive than RPE because it asks a concrete
            question: how many more could you have done? That makes it easier to teach to beginners
            and easier to apply consistently across different exercises. Coaches often use RIR
            language with clients and RPE in their own programming notes, since the two convert
            directly.
          </p>
        </>
      ),
    },
    {
      heading: "How close to failure should you train?",
      body: (
        <>
          <p>
            Research comparing sets taken to failure with sets stopped a few reps short generally
            finds similar muscle growth when total volume is matched, as long as sets are reasonably
            close to failure, roughly zero to three reps in reserve. Training to failure on every
            set adds fatigue and can reduce the quality of later sets, while stopping too far from
            failure, with five or more reps left, tends to produce less growth.
          </p>
          <p>
            A practical approach is to keep most sets at one to three reps in reserve, take the last
            set of an exercise closer to failure on safe movements, and avoid failure on heavy
            compound lifts where form breakdown carries more risk.
          </p>
        </>
      ),
    },
    {
      heading: "RIR for different goals",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Goal</th>
                  <th scope="col">Typical RIR</th>
                  <th scope="col">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Muscle growth</td>
                  <td>0 to 3</td>
                  <td>3 sets of 10 at 1 to 2 RIR</td>
                </tr>
                <tr>
                  <td>Strength</td>
                  <td>1 to 3</td>
                  <td>5 sets of 3 at 2 RIR</td>
                </tr>
                <tr>
                  <td>Power and speed</td>
                  <td>3 to 5</td>
                  <td>Fast reps, stopping well before slowing</td>
                </tr>
                <tr>
                  <td>Technique work</td>
                  <td>3 to 5</td>
                  <td>Smooth, controlled reps</td>
                </tr>
                <tr>
                  <td>Deload</td>
                  <td>4 or more</td>
                  <td>Light, easy sets</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "RIR on isolation and compound lifts",
      body: (
        <>
          <p>
            Rating reps in reserve is usually more accurate on compound lifts like squats and
            presses, where bar speed gives clear feedback, than on isolation exercises like curls
            and lateral raises, where the burn can make sets feel harder than they are. Many lifters
            underestimate how many reps they have left on isolation work. Occasionally taking an
            isolation set to true failure helps recalibrate.
          </p>
        </>
      ),
    },
    {
      heading: "Progressing with RIR",
      body: (
        <>
          <p>
            A simple progression is to choose a rep target and an RIR target, such as eight reps at
            2 RIR. When you can do the set with three or more reps left, add weight. When the set
            drops to one rep left or fewer, keep the weight and aim to improve reps. Over a training
            block, some programmes reduce RIR week by week, starting at 3 and finishing at 0 or 1,
            before a lighter week resets fatigue.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            You do 10 reps of Romanian deadlifts with 70 kg and feel you could have managed three
            more. That is 3 RIR, or RPE 7. Ten reps at RPE 7 is about 66 percent of your one-rep
            max, giving an estimated max of about 105.4 kg. Next week, aiming for 10 reps at 2 RIR,
            you might add 2.5 to 5 kg, since the same reps at a slightly harder effort means a
            slightly heavier load.
          </p>
        </>
      ),
    },
    {
      heading: "RIR and muscle growth research",
      body: (
        <>
          <p>
            Several studies have compared training to failure with stopping one or more reps short.
            When the total amount of work is similar, the results for muscle growth are generally
            similar too, as long as sets are taken reasonably close to failure. Some analyses
            suggest that growth may begin to fall off once sets end more than about four or five
            reps from failure. This supports a practical target of zero to three reps in reserve for
            most muscle-building work.
          </p>
          <p>
            Training to failure more often may slightly help experienced lifters on some exercises,
            but it also produces more fatigue, which can reduce the quality of later sets and
            sessions. Saving true failure for the last set of an exercise, and for safe movements,
            is a sensible compromise.
          </p>
        </>
      ),
    },
    {
      heading: "Using RIR to manage fatigue",
      body: (
        <>
          <p>
            Reps in reserve helps manage fatigue across a week of training. If your main lifts are
            prescribed at 2 to 3 RIR, you leave enough in the tank to recover by the next session.
            As a programme progresses, gradually reducing RIR, for example from 3 to 2 to 1 over
            several weeks, increases the training stimulus while fatigue builds in a controlled way.
            A lighter week, with sets at 4 RIR or more, then lets fatigue clear before the next
            block.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes with RIR",
      body: (
        <>
          <ul>
            <li>
              <strong>Underestimating reps left,</strong> especially on isolation exercises and in
              high-rep sets.
            </li>
            <li>
              <strong>Counting reps with broken form</strong> as reps in reserve. A rep that changes
              technique marks the limit.
            </li>
            <li>
              <strong>Using the same RIR for every exercise</strong> regardless of risk. Heavy
              squats and deadlifts usually deserve a bigger margin than curls.
            </li>
            <li>
              <strong>Forgetting fatigue across sets.</strong> Later sets at the same weight usually
              have fewer reps in reserve.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "RIR for beginners",
      body: (
        <>
          <p>
            New lifters may be unsure about reps in reserve because the movement and effort scale
            are unfamiliar. Use conservative targets, clear technique cues and a coach review of
            comparable sets. Do not require a failure test or promise that everyone will learn the
            scale within a set number of weeks. The useful information is whether the completed
            repetitions met the intended standard and how the client describes the final repetition.
            Review that evidence before making the next change.
          </p>
        </>
      ),
    },
    {
      heading: "RIR and rep ranges",
      body: (
        <>
          <p>
            The same RIR means different things in different rep ranges. Two reps in reserve on a
            set of three is close to a maximal effort; two reps in reserve on a set of fifteen
            leaves the lifter tired and burning but further from their maximal strength. For heavy,
            low-rep strength work, slightly larger margins, such as two to three reps, help keep
            technique sharp. For moderate and high-rep work, smaller margins are usually fine.
          </p>
        </>
      ),
    },
    {
      heading: "Combining RIR with progressive overload",
      body: (
        <>
          <p>
            Progressive overload means gradually increasing the demand on your muscles over time,
            usually by adding weight or reps. RIR provides a simple rule for when to progress. If a
            target such as eight reps at 2 RIR starts to feel like 3 or 4 RIR, the weight has become
            relatively lighter and it is time to add a little. If it starts to feel like 0 or 1 RIR,
            hold the weight and work on adding reps. This keeps progress steady without guesswork.
          </p>
        </>
      ),
    },
    {
      heading: "RIR for different populations",
      body: (
        <>
          <p>
            For older adults and people returning from injury, larger reps-in-reserve targets of
            three or four are often a safer starting point, while still providing enough stimulus to
            build strength. For experienced lifters chasing muscle growth, targets of zero to two
            are common. For athletes in season, larger margins help manage fatigue alongside sport
            training. Adjusting the target to the person and their situation is part of what makes
            RIR so useful.
          </p>
        </>
      ),
    },
    {
      heading: "Recording RIR in a training log",
      body: (
        <>
          <p>
            Writing your reps in reserve next to each set, such as '100 kg × 5 @ 2 RIR', turns a
            simple log into a much richer record. You can see when the same weight starts to feel
            easier, which is a sign of progress, and when sets feel harder than usual, which may
            signal fatigue or a need for more recovery. Over months, this record makes it easy to
            plan training blocks and set realistic goals.
          </p>
        </>
      ),
    },
    {
      heading: "Define what a remaining repetition means",
      body: (
        <>
          <p>
            A repetition in reserve must use the same technique as the repetitions already
            completed. If another rep would require bouncing, changing the range or asking a spotter
            to help, it does not belong in the reserve count for a strict set. Agree on that
            definition before comparing sessions. Two clients can use the same number while
            imagining very different standards, and no conversion table can correct that
            disagreement afterwards.
          </p>
          <p>
            Reserve is specific to the exercise and the set. Being able to estimate two repetitions
            left on a familiar leg press does not guarantee the same accuracy on a new squat
            variation. Treat a newly introduced movement as a learning task. Start with conservative
            loads, review the movement, and build a reference from repeatable sessions instead of
            assuming the rating is already calibrated.
          </p>
          <p>
            Technical failure is also exercise dependent. A free-weight lift may become unsafe or
            lose its intended pattern before the target muscle is unable to move anything at all.
            Stop at the agreed technical boundary. The calculator does not require you to reach
            failure to prove the estimate, and you should not deliberately compromise technique to
            test whether one more repetition was possible.
          </p>
        </>
      ),
    },
    {
      heading: "Interpret a range rather than a false exact point",
      body: (
        <>
          <p>
            A target of one to three repetitions in reserve gives useful room for normal
            uncertainty. A client who reports two may really have had one or three. That does not
            make the set worthless. It means the coach should interpret the report alongside
            repetition speed, technique, recent training and the rest of the session. Treat small
            differences as observations to investigate rather than immediate proof that the plan is
            wrong.
          </p>
          <p>
            Half-point RPE values express an in-between judgement. RPE 8.5 maps to roughly one to
            two repetitions remaining, not to a literal half repetition that must be demonstrated.
            Use that precision only if it helps you describe the set. Someone learning the scale may
            provide better information with whole-number reserve targets and a short note about
            where the set became difficult.
          </p>
          <p>
            High reserve estimates are particularly uncertain because the lifter stops far from the
            point they are estimating. The chart can still provide a starting weight, but it should
            not be treated as a measurement of a true maximum. A controlled set comfortably short of
            failure can be good training even when its calculated one-rep maximum has a wide margin
            of uncertainty.
          </p>
        </>
      ),
    },
    {
      heading: "Progress without turning every session into a test",
      body: (
        <>
          <p>
            Choose a repetition range and keep the reserve target consistent. If the plan says eight
            to ten repetitions with two left, first aim to perform the upper end cleanly at the
            intended effort. A small increase in load can then bring repetitions back toward the
            lower end. This is a coaching convention, not a promise that every session will improve.
            Record the actual result and let repeated performance guide the next change.
          </p>
          <p>
            Do not add repetitions merely to make the calculator show a larger maximum. The useful
            observation is what happened under the plan you intended to follow. If you change the
            target halfway through every session, the log becomes a collection of different tests.
            Consistency makes comparisons easier and helps distinguish a productive increase from a
            change in execution.
          </p>
          <p>
            Keep rest intervals reasonably comparable too. A short rest may lower repetition
            performance without indicating that underlying strength has fallen. If time is limited,
            record that constraint and choose fewer good sets rather than reinterpret every
            difficult set as a loss of fitness. The reserve target helps control effort, but it
            cannot erase the effect of fatigue accumulated earlier.
          </p>
        </>
      ),
    },
    {
      heading: "Discuss ratings without making the client defend a number",
      body: (
        <>
          <p>
            When a report looks surprising, ask what the final repetition felt like and whether the
            client thought another repetition would look the same. That conversation usually
            provides more useful detail than telling them their rating was wrong. A person who is
            worried about disappointing a coach may report the target rather than their experience.
            Make accurate reporting the goal, including when a set feels much harder than expected.
          </p>
          <p>
            Video can support the discussion, but bar speed alone is not a universal reserve meter.
            Some people grind slowly before failure; others lose the movement abruptly. Use videos
            to compare the same person performing the same exercise over time. Avoid assigning
            everyone an exact reserve value from a single visual cue.
          </p>
          <p>
            For remote coaching, put the cue beside the exercise in the plan and review the returned
            log. Keep the language identical across weeks. Changing between stop before it gets
            hard, RPE 8 and two reps left without explaining the relationship can create unnecessary
            confusion even though the intention is similar.
          </p>
        </>
      ),
    },
    {
      heading: "Account for exercise order and indirect fatigue",
      body: (
        <>
          <p>
            An accessory lift performed after several demanding compound movements may reach the
            same reserve target at a lower load. That is expected context, not necessarily a reason
            to replace the exercise. Compare it with earlier sessions in the same position. If you
            move it to the beginning, establish a new baseline instead of claiming an immediate
            strength increase.
          </p>
          <p>
            A weekly review should include whether the target was achievable across the whole
            session. If the first exercise is consistently on target but later work becomes much
            harder, consider the total work, rest and exercise order. Adding more sets to compensate
            for lower loads can make the original fatigue problem worse. Change one part of the plan
            at a time so the effect is understandable.
          </p>
        </>
      ),
    },
    {
      heading: "Keep the result in its proper role",
      body: (
        <>
          <p>
            RIR describes effort in a resistance-training set. It is not a medical clearance, a
            measure of motivation or a diagnosis of poor recovery. Stop and seek appropriate advice
            when pain or other concerning symptoms appear. A client should never feel required to
            finish a reserve target through symptoms because a calculator predicted the load was
            manageable.
          </p>
          <p>
            The strongest use of this tool is a shared vocabulary. The client reports a set in
            ordinary terms, the coach converts that information into the next prescription, and both
            can see the reasoning. The percentage is a starting estimate; the completed repetitions,
            technique and experience remain the evidence that matters in the next session.
          </p>
        </>
      ),
    },
    {
      heading: "Use the completed set as the record",
      body: (
        <>
          <p>
            The planned reserve target and the reported reserve are separate fields in your
            thinking, even if your training log displays them together. Preserve the target so you
            know what was intended, and record what happened without editing it to match. That
            distinction makes a second attempt useful: you can adjust the next session from a real
            observation instead of repeating an assumption.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using RIR with clients",
    body: (
      <>
        <p>
          RIR is often the easiest effort scale to teach new clients. Ask them to note how many more
          reps they could have done at the end of each set, and review videos together to check
          accuracy.
        </p>
        <p>
          Program with RIR targets rather than fixed weights for remote clients. A target of 8 reps
          at 2 RIR works on good and bad days alike.
        </p>
        <p>
          Watch for chronically conservative ratings. Clients who always report 3 RIR or more may be
          leaving progress on the table.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Program by reps in reserve for every client",
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
    { label: "Convert RPE to percentages", href: "/tools/rpe-calculator" },
    { label: "Check weekly sets per muscle", href: "/tools/weekly-training-volume-calculator" },
  ],
  nextPitch: "Coaching remotely? Traiv keeps every client's plans, sets and notes together.",
  faq: [
    {
      q: "What is RIR in weightlifting?",
      a: "Reps in reserve: the number of extra reps you could have done with good form at the end of a set.",
    },
    { q: "How does RIR relate to RPE?", a: "RPE = 10 − RIR. Two reps in reserve is RPE 8." },
    {
      q: "How many reps in reserve should I leave?",
      a: "Most effective training sets end with 0 to 3 reps in reserve.",
    },
    {
      q: "Is training to failure necessary?",
      a: "No. Sets stopped one to three reps short produce similar muscle growth with less fatigue.",
    },
    {
      q: "How accurate are RIR ratings?",
      a: "With practice, most lifters are accurate to within about one rep, especially on compound lifts.",
    },
    {
      q: "Can beginners use RIR?",
      a: "Yes. It is simple to learn, though beginners often underestimate how many reps they have left at first.",
    },
  ],
  keepGoing: [
    { label: "RPE calculator", href: "/tools/rpe-calculator" },
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "Tempo calculator", href: "/tools/tempo-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Programmes that adapt to how clients feel each day",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
