import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "One-Rep Max Calculator: Estimate Your 1RM (Epley and Brzycki)",
  description:
    "Free one-rep max calculator. Enter a weight and reps to estimate your 1RM with Epley or Brzycki, plus a percentage table of working weights and expected reps.",
  eyebrow: "Free tool · Strength",
  h1: "One-rep max calculator",
  intro: (
    <>
      <p>
        Your one-rep max is the heaviest weight you can lift once with good form. You do not need to
        test it to know it. Enter the weight and reps from a recent hard set, choose a formula, and
        this calculator estimates your 1RM and builds a table of working weights for every common
        training percentage.
      </p>
    </>
  ),
  method: "Epley (1985) and Brzycki (1993) one-rep max equations",
  sources: [
    {
      label: "Epley B. Poundage chart. Boyd Epley Workout. Lincoln, NE: Body Enterprises, 1985.",
      href: "",
    },
    {
      label:
        "Brzycki M. Strength testing: predicting a one-rep max from reps-to-fatigue. J Phys Educ Recreat Dance, 1993.",
      href: "https://doi.org/10.1080/07303084.1993.10606684",
    },
    {
      label:
        "LeSuer DA, et al. The accuracy of prediction equations for estimating 1-RM performance in the bench press, squat, and deadlift. J Strength Cond Res, 1997.",
      href: "https://journals.lww.com/nsca-jscr/abstract/1997/11000/the_accuracy_of_prediction_equations_for.5.aspx",
    },
  ],
  shortAnswer: {
    question: "How do you calculate your one-rep max?",
    answer: (
      <>
        <p>
          Take a set you performed close to failure and apply a formula. Epley: weight × (1 + reps ÷
          30). For 225 lb for 5 reps, that gives an estimated one-rep max of about 263 lb. Brzycki
          gives a slightly lower 253 lb for the same set.
        </p>
        <p>
          Estimates are most reliable from sets of 10 reps or fewer, taken within a rep or two of
          failure. Beyond that, individual differences in muscular endurance make the result less
          accurate.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the estimate is worked out",
      body: (
        <>
          <p>
            The calculator uses one of two well-tested formulas to turn a set of several reps into
            an estimated single. Epley multiplies the weight by one plus the reps divided by 30.
            Brzycki multiplies the weight by 36 and divides by 37 minus the reps. For a lift of 225
            lb for 5 reps, Epley gives about 262 lb and Brzycki about 253 lb.
          </p>
          <p>
            The two formulas agree closely for sets of three to six reps and drift apart as reps
            climb. Epley tends to give slightly higher estimates from higher-rep sets, Brzycki
            slightly lower ones. Neither is right for everyone: lifters with more slow-twitch muscle
            or excellent endurance often do more reps at a given percentage than the formulas
            expect, so their estimates run high.
          </p>
          <p>
            The table under the result turns the estimate into training weights at each percentage,
            rounded to the nearest 5 lb or 2.5 kg so they can be loaded with standard plates, and
            shows roughly how many reps you should manage at each.
          </p>
        </>
      ),
    },
    {
      heading: "Why estimate instead of testing?",
      body: (
        <>
          <p>
            Testing a true one-rep max is demanding. It takes a long warm-up, carries a higher risk
            of form breaking down, and leaves you fatigued for days. For most lifters, testing every
            few weeks interferes with training more than it helps. An estimate from a normal working
            set gives a number accurate enough to program from, without the cost.
          </p>
          <p>
            Estimates also update naturally. If you squat 225 for 6 reps this week instead of 5,
            your estimated max has risen, and the next block's percentages can rise with it. Many
            coaches use rolling estimates from top sets for exactly this reason.
          </p>
        </>
      ),
    },
    {
      heading: "How accurate are 1RM formulas?",
      body: (
        <>
          <p>
            Studies comparing prediction equations with tested maxes generally find them accurate to
            within a few percent for sets of three to eight reps in trained lifters. Accuracy falls
            for sets above ten reps, for untrained people whose technique varies from rep to rep,
            and for lifts that involve a lot of skill or a large range of motion.
          </p>
          <p>
            Accuracy also depends on how hard the set really was. If you stopped with three reps
            left, the formula has no way of knowing and will underestimate. For the best estimate,
            use a set that genuinely ended within one or two reps of failure, performed with
            consistent technique.
          </p>
        </>
      ),
    },
    {
      heading: "Using percentages to plan training",
      body: (
        <>
          <p>
            Once you have an estimate, percentages let you set loads for any rep range. Common
            bands:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">% of 1RM</th>
                  <th scope="col">Typical reps</th>
                  <th scope="col">Used for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>90–100%</td>
                  <td>1–3</td>
                  <td>Peak strength, heavy singles and doubles</td>
                </tr>
                <tr>
                  <td>80–90%</td>
                  <td>3–6</td>
                  <td>Strength development</td>
                </tr>
                <tr>
                  <td>70–80%</td>
                  <td>6–10</td>
                  <td>Strength and muscle growth</td>
                </tr>
                <tr>
                  <td>60–70%</td>
                  <td>10–15</td>
                  <td>Muscle growth, technique practice</td>
                </tr>
                <tr>
                  <td>Below 60%</td>
                  <td>15+</td>
                  <td>Warm-ups, endurance, rehabilitation</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Percentages are a starting point. On days when sleep, stress or recovery are poor, the
            same percentage can feel much harder. Many lifters combine percentages with an effort
            scale such as RPE, adjusting the load so the set feels as hard as intended.
          </p>
        </>
      ),
    },
    {
      heading: "How to test a true one-rep max safely",
      body: (
        <>
          <p>If you do want to test, prepare properly:</p>
          <ol>
            <li>Warm up thoroughly with general movement, then several light sets of the lift.</li>
            <li>
              Work up in singles: roughly 50, 70, 80, 90 and 95 percent of your estimate, resting
              more as weights get heavier.
            </li>
            <li>
              Attempt your estimated max with good technique. If it moves well, add a small amount
              and try once more.
            </li>
            <li>
              Stop when form breaks down or speed slows dramatically. A grinding, ugly rep is not a
              useful max.
            </li>
            <li>Use spotters, safety bars or a rack for squats and bench presses.</li>
          </ol>
          <p>
            Rest three to five minutes between heavy singles. Most lifters reach their max within
            three or four attempts after warming up; more attempts usually mean diminishing returns
            from fatigue.
          </p>
        </>
      ),
    },
    {
      heading: "Training max: programming from a little less",
      body: (
        <>
          <p>
            Many popular programmes set percentages from a training max rather than a true max,
            typically 85 to 90 percent of the estimated one-rep max. This leaves a margin for bad
            days, keeps sets crisp rather than grinding, and allows steady progress over many weeks.
            If a programme asks for a training max, enter your set here, then multiply the result by
            0.9.
          </p>
        </>
      ),
    },
    {
      heading: "Common mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Using a set that was not hard.</strong> A comfortable set of five
              underestimates your max.
            </li>
            <li>
              <strong>Using very high-rep sets.</strong> Sets above about ten reps give unreliable
              estimates.
            </li>
            <li>
              <strong>Mixing technique standards.</strong> A paused bench and a touch-and-go bench
              produce different maxes; use the same standard you train with.
            </li>
            <li>
              <strong>Testing too often.</strong> Estimating from training sets is usually enough;
              test maxes occasionally, not weekly.
            </li>
            <li>
              <strong>Chasing the number.</strong> A higher estimate from looser form does not
              reflect real strength gain.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Tracking progress over time",
      body: (
        <>
          <p>
            Logging your top sets and their estimated maxes gives a simple, motivating picture of
            progress. Plot the estimate for each main lift every few weeks. Early in training, it
            may rise by several percent a month; after a few years, small increases over a whole
            training cycle are normal. Flat or falling estimates over several weeks can signal that
            recovery, sleep, nutrition or programme design need attention.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A lifter squats 100 kg for 6 reps, finishing with about one rep left in the tank. Using
            Epley, 100 × (1 + 6 ÷ 30) = 120 kg. Using Brzycki, 100 × 36 ÷ (37 − 6) = 116 kg. Either
            estimate is a sensible basis for training. A training max at 90 percent of the Epley
            figure would be 108 kg, so a set of five at 80 percent of the training max would be
            about 86 kg, and a heavy triple at 90 percent about 97 kg.
          </p>
          <p>
            If the same lifter manages 100 kg for 8 reps a month later, the Epley estimate rises to
            about 127 kg, a gain of roughly 6 percent. That kind of steady improvement is what
            estimated maxes are best at showing.
          </p>
        </>
      ),
    },
    {
      heading: "Reps to percentage: a quick reference",
      body: (
        <>
          <p>
            The table below uses Epley to show roughly how many reps most lifters can perform at
            each share of their max. Use it to choose loads for a target rep range, or to
            sanity-check whether a set was close to failure.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">% of 1RM</th>
                  <th scope="col">Approximate reps to failure</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>100%</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>95%</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>90%</td>
                  <td>3 to 4</td>
                </tr>
                <tr>
                  <td>85%</td>
                  <td>5 to 6</td>
                </tr>
                <tr>
                  <td>80%</td>
                  <td>7 to 8</td>
                </tr>
                <tr>
                  <td>75%</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>70%</td>
                  <td>12 to 13</td>
                </tr>
                <tr>
                  <td>65%</td>
                  <td>16</td>
                </tr>
                <tr>
                  <td>60%</td>
                  <td>20</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Individual results vary. Some lifters can do noticeably more reps at a given percentage,
            others fewer, and the gap widens at lower percentages.
          </p>
        </>
      ),
    },
    {
      heading: "Upper-body and lower-body lifts behave differently",
      body: (
        <>
          <p>
            Research comparing prediction equations across lifts suggests they tend to be slightly
            more accurate for upper-body lifts such as the bench press than for large lower-body
            lifts such as the squat and deadlift, where fatigue in the back, grip and cardiovascular
            system can limit reps before the target muscles do. Lower-body lifts also allow more
            reps at a given percentage for many people. In practice, this means an estimated squat
            or deadlift max from a high-rep set may run a little high, and using sets of five or
            fewer for those lifts gives more reliable numbers.
          </p>
        </>
      ),
    },
    {
      heading: "Using estimates for every lift in a programme",
      body: (
        <>
          <p>
            Most strength programmes are built on a few main lifts: squat, bench press, deadlift and
            overhead press, sometimes with variations such as front squats, paused bench or Romanian
            deadlifts. Estimating a max for each main lift gives you a complete set of numbers to
            program from. Accessory lifts, such as rows, lunges and curls, are usually programmed by
            reps and effort rather than percentages, because their maxes change quickly and are
            rarely tested.
          </p>
          <p>
            Keep a simple record for each main lift: date, weight, reps, estimated max and any notes
            about technique or how the set felt. Over months, this becomes one of the most useful
            records of your training.
          </p>
        </>
      ),
    },
    {
      heading: "When estimates and reality disagree",
      body: (
        <>
          <p>
            Occasionally, an estimate will be clearly wrong for you. If you consistently fail to
            reach your estimated max when testing, you may have better muscular endurance than
            average, and Brzycki or a lower training max will suit you better. If you regularly
            exceed your estimate, you may be stronger at low reps than at high reps, which is common
            in experienced powerlifters. Adjust which formula you use, or apply a personal
            correction factor, based on how estimates compare with your tested lifts.
          </p>
        </>
      ),
    },
    {
      heading: "Strength and age",
      body: (
        <>
          <p>
            Strength typically peaks between the late twenties and late thirties and declines
            gradually afterward, faster from the sixties onward if training stops. Regular strength
            training slows that decline substantially, and older lifters can still make meaningful
            gains. For older adults, estimating maxes from sets of six to ten reps, rather than
            testing heavy singles, is a sensible and safer way to track progress.
          </p>
        </>
      ),
    },
    {
      heading: "Bracing and breathing for heavy sets",
      body: (
        <>
          <p>
            How you breathe on a heavy set affects how much you can lift and how safely. Most
            lifters use a braced breath: a deep breath into the belly before each rep, held while
            tightening the trunk as if preparing to be pushed, and released at or near the top. This
            increases pressure inside the abdomen, which stiffens the trunk and supports the spine
            under load. A belt gives the abdominal muscles something to brace against and can help
            on the heaviest sets. People with high blood pressure or other cardiovascular conditions
            should take medical advice before using maximal breath-holding efforts.
          </p>
        </>
      ),
    },
    {
      heading: "Plateaus and how to break them",
      body: (
        <>
          <p>
            Almost every lifter eventually reaches a point where the estimated max stops rising.
            Common causes include doing the same sets and reps for too long, too little or too much
            training volume, poor sleep, eating too little, and stress outside the gym. Useful
            responses include changing the rep range for a few weeks, adding a variation that
            targets a weak point, taking a lighter week to recover, and checking that food and sleep
            support training. A plateau that lasts a month or two is normal; one that lasts six
            months usually means something in the programme or recovery needs to change.
          </p>
          <p>
            Small changes compound. Adding one rep to a set, or 1 to 2.5 kg to the bar, every week
            or two may feel slow, but it adds up to large improvements over a year.
          </p>
        </>
      ),
    },
    {
      heading: "How strength is built",
      body: (
        <>
          <p>
            Early strength gains come largely from the nervous system learning to coordinate the
            lift: recruiting more muscle fibres, firing them more efficiently and refining
            technique. This is why beginners often get stronger quickly without visibly larger
            muscles. Over months and years, muscle growth contributes more, because a bigger muscle
            can produce more force. Both processes respond to lifting reasonably heavy weights with
            good technique, regularly, with enough recovery between sessions. Estimated maxes
            capture the combined result, which is why tracking them over time is so useful.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing between estimating and testing",
      body: (
        <>
          <p>
            Estimating works best for regular programming and tracking progress between training
            blocks, for lifters who want to manage fatigue, and for anyone where a heavy single
            carries more risk than reward, such as beginners, older lifters and people returning
            from injury. Testing works best for competitive lifters preparing for a meet, for
            checking whether estimates are accurate for you, and occasionally as a motivating
            milestone. Many experienced lifters estimate most of the year and test only at the end
            of a long training cycle.
          </p>
        </>
      ),
    },
    {
      heading: "Beginner, intermediate and advanced progression",
      body: (
        <>
          <p>
            How quickly your one-rep max can rise depends heavily on training age. Beginners, in
            roughly their first six to twelve months of consistent lifting, can often add weight to
            the bar every session or every week, a pattern known as linear progression. Intermediate
            lifters usually need weekly or monthly cycles, with heavier and lighter days, to keep
            progressing. Advanced lifters may need several months of structured training to add a
            small amount to their max. Knowing which stage you are in helps you set realistic
            expectations and choose a suitable programme.
          </p>
          <p>
            A practical sign that you have moved from beginner to intermediate is that adding weight
            every session no longer works, even with good sleep and food. At that point, programmes
            that vary intensity across the week or month usually work better.
          </p>
        </>
      ),
    },
    {
      heading: "Strength and body weight",
      body: (
        <>
          <p>
            Absolute strength usually rises with body weight, because more muscle can produce more
            force. That is why heavier lifters tend to lift more in absolute terms, and why relative
            measures such as Wilks and DOTS scores exist to compare lifters of different sizes. If
            you are losing weight, holding your estimated max steady is a strong result. If you are
            gaining weight, an estimated max that rises faster than your body weight shows that much
            of the gain is useful muscle.
          </p>
        </>
      ),
    },
    {
      heading: "How to read your percentage table",
      body: (
        <>
          <p>
            Each row in the table shows a percentage of your estimated max, the weight that
            represents for loading, and roughly how many reps most people can do at that weight. Use
            it in two directions. To pick a weight for a target rep range, find the row whose rep
            estimate matches and load that weight. To check effort, compare the reps you actually
            managed at a given weight with the estimate: doing many more reps than predicted means
            your max is probably higher than the estimate, and doing fewer means it is probably
            lower.
          </p>
        </>
      ),
    },
    {
      heading: "Rest between sets and your estimate",
      body: (
        <>
          <p>
            How long you rest before a set affects how many reps you can do, and therefore your
            estimate. Short rest periods leave you partly fatigued, so you manage fewer reps and the
            estimate comes out lower than your true capability. For the most accurate estimate, rest
            three to five minutes before the set you use, especially for heavy compound lifts. For
            general training, shorter rest is fine, but be aware that estimates from those sets may
            run a little low.
          </p>
          <p>
            The same applies to where the set falls in a session. A top set done first, when you are
            fresh, gives a better estimate than a set done after several hard exercises. If you want
            to track progress accurately, estimate from a set done at a similar point in the session
            each time.
          </p>
        </>
      ),
    },
    {
      heading: "Machines and free weights",
      body: (
        <>
          <p>
            One-rep max formulas were developed and tested mainly on free-weight lifts, but they
            work reasonably well on machines too, such as leg press, chest press and cable rows.
            Machine maxes do not convert to free-weight maxes, because the movement and stability
            demands differ, but tracking an estimated max on a machine is a perfectly good way to
            measure progress on that machine. This can be particularly useful for beginners and for
            people training around injuries.
          </p>
        </>
      ),
    },
    {
      heading: "Logging sets for better estimates",
      body: (
        <>
          <p>
            Write down the weight, reps and how hard the set felt for every top set, using a simple
            scale such as reps left in reserve. Over a few weeks, this record lets you choose the
            most reliable sets to estimate from and spot trends early. It also shows whether a high
            estimate came from one unusually good day or a consistent pattern.
          </p>
        </>
      ),
    },
    {
      heading: "Rounding and plate maths",
      body: (
        <>
          <p>
            The table rounds each working weight to the nearest 5 lb or 2.5 kg, the smallest jump
            most gyms can load with standard plates. If your gym has smaller plates, you can load
            closer to the exact percentages, which helps on lifts like the overhead press where
            small jumps matter.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Turn your estimate into a four-week training block",
    whenToUse:
      "When you have a fresh one-rep max estimate and want a structured block of training built from it.",
    pasteIn:
      "Your estimated 1RM, the lift, your training days, and whether your goal is strength or muscle growth.",
    text: `I estimated my one-rep max from a recent set:
Lift: [lift]
Estimated 1RM: [weight]
Training days per week for this lift: [number]
Goal: [strength / muscle growth]

1. Write a four-week block for this lift with sets, reps and percentages each week.
2. Base percentages on a training max of 90% of my estimate.
3. Include one lighter week or a deload at the end.
4. Tell me how to adjust if a set feels much harder or easier than planned.`,
  },
  forCoaches: {
    heading: "Using one-rep max estimates with clients",
    body: (
      <>
        <p>
          Estimated maxes let you program heavy work without testing. Ask clients to report the
          weight and reps of their top set each week, and update their working percentages from the
          estimate.
        </p>
        <p>
          Keep technique standards consistent. Agree on depth for squats, a pause or touch on bench,
          and lockout for deadlifts, so estimates reflect real strength changes rather than looser
          reps.
        </p>
        <p>
          Use estimates to show progress. Clients who see their estimated max rise steadily stay
          motivated, even on weeks when the scale or mirror does not change.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Program from every client's numbers",
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
    { label: "Turn reps and effort into a working weight", href: "/tools/rpe-calculator" },
    { label: "See how your lift compares", href: "/tools/strength-standards-calculator" },
  ],
  nextPitch: "Programming for clients? Traiv keeps every client's lifts and plans together.",
  faq: [
    {
      q: "What is a one-rep max?",
      a: "The heaviest weight you can lift for a single repetition with good technique.",
    },
    {
      q: "Which formula is more accurate, Epley or Brzycki?",
      a: "They are very similar for sets of 3 to 6 reps. Epley tends to give higher estimates from higher-rep sets; Brzycki is a little more conservative.",
    },
    {
      q: "How many reps should I use to estimate my max?",
      a: "Sets of 3 to 8 reps taken close to failure give the most reliable estimates. Above 10 reps, accuracy falls.",
    },
    {
      q: "Is it safe to test a one-rep max?",
      a: "It can be with a proper warm-up, good technique and spotters or safety bars. Many lifters prefer to estimate instead.",
    },
    {
      q: "How often should I test my max?",
      a: "Every 8 to 12 weeks at most for most lifters. Estimating from training sets works well in between.",
    },
    {
      q: "What is a training max?",
      a: "A slightly lower number, usually 85 to 90 percent of your estimated max, used to set percentages so training stays manageable.",
    },
    {
      q: "Why is my estimate higher than what I can actually lift?",
      a: "Formulas assume average muscular endurance. If you are better at reps than singles, your estimate will run high.",
    },
    {
      q: "Can beginners use a one-rep max calculator?",
      a: "Yes, but estimates are less reliable while technique is still developing. Use them as a rough guide.",
    },
    {
      q: "Do I need different formulas for different lifts?",
      a: "The same formulas are commonly used for all major lifts, though accuracy can vary slightly between them.",
    },
    {
      q: "What percentage of my max should I train at?",
      a: "Roughly 70 to 85 percent for most strength and muscle-building work, with heavier and lighter days as programmes require.",
    },
    {
      q: "Should I use kilograms or pounds?",
      a: "Either. The calculation is the same; working weights are rounded to 2.5 kg or 5 lb steps.",
    },
    {
      q: "How quickly does a one-rep max improve?",
      a: "Beginners can gain several percent a month; experienced lifters may gain a few percent over a whole training cycle.",
    },
    {
      q: "Does an estimated max count for competition?",
      a: "No. Competitions require lifts performed to federation standards under judges.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general training information, not medical advice. Test heavy singles
        only with good technique, a spotter or safety arms, and stop if you feel pain. If you have
        an injury or medical condition, check with a doctor or physiotherapist before lifting heavy.
      </p>
    </>
  ),
  keepGoing: [
    { label: "RPE calculator", href: "/tools/rpe-calculator" },
    { label: "Warm-up set calculator", href: "/tools/warm-up-set-calculator" },
    { label: "Strength standards calculator", href: "/tools/strength-standards-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Every client's lifts, programmed and tracked",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
