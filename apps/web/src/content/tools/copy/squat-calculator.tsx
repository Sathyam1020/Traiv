import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Squat Calculator: Estimate Your Squat 1RM",
  description:
    "Free squat calculator. Estimate your back squat one-rep max from any set using Epley or Brzycki, with a table of working weights for every training percentage.",
  eyebrow: "Free tool · Strength",
  h1: "Squat calculator",
  intro: (
    <>
      <p>
        The back squat is often called the king of lower-body lifts, and it is one of the most
        useful numbers to track. Enter a recent hard set, choose a formula, and this calculator
        estimates your squat one-rep max and lays out working weights for each training percentage.
      </p>
    </>
  ),
  method: "Epley (1985) and Brzycki (1993) one-rep max equations",
  sources: [
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
    question: "How do you estimate your squat max?",
    answer: (
      <>
        <p>
          Take a recent hard set of squat and apply a one-rep max formula. With Epley, 225 lb for 5
          reps gives an estimated max of about 262 lb; Brzycki gives about 253 lb.
        </p>
        <p>
          Use a set of 3 to 8 reps taken within one or two reps of failure, performed with the same
          technique you use in training. The result gives you a reliable number to set squat
          percentages from without testing a heavy single.
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
            Brzycki multiplies the weight by 36 and divides by 37 minus the reps. For a squat of 225
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
      heading: "Depth and technique standards",
      body: (
        <>
          <p>
            Squat estimates are only comparable if depth is consistent. Powerlifting rules require
            the hip crease to drop below the top of the knee; many lifters train to that depth or a
            little lower. Half squats allow far more weight, which makes them a poor basis for
            estimating a full squat.
          </p>
          <p>
            Bar position matters too. A high-bar squat, with the bar on top of the traps, keeps the
            torso more upright and usually allows a little less weight than a low-bar squat, where
            the bar sits lower on the upper back and the lifter leans further forward. Estimate from
            the style you train.
          </p>
          <p>
            Equipment such as knee sleeves, wraps and belts also affects numbers. Note what you used
            for each set so comparisons stay fair.
          </p>
        </>
      ),
    },
    {
      heading: "What is a good squat?",
      body: (
        <>
          <p>
            For men, squatting body weight for a single is a common early milestone, 1.5 times body
            weight solid intermediate strength, and twice body weight a strong, experienced lifter.
            For women, around 0.75 times body weight is a common early milestone and 1.25 times a
            strong intermediate result. The strength standards calculator gives a more detailed
            ranking.
          </p>
        </>
      ),
    },
    {
      heading: "Programming the squat",
      body: (
        <>
          <p>
            Most lifters squat two or three times a week. A typical structure combines a heavier day
            of three to five reps at 80 to 87 percent with a lighter or volume day of six to ten
            reps at 65 to 75 percent. Front squats, paused squats and tempo squats are useful
            variations that build position and strength out of the bottom.
          </p>
          <p>
            Squats are demanding on recovery because they involve so much muscle. If you also
            deadlift heavily, plan the two lifts so that the hardest sessions are spread through the
            week. Accessory work for the quads, hamstrings, glutes and core supports progress.
          </p>
        </>
      ),
    },
    {
      heading: "Common squat mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Cutting depth as the weight rises,</strong> which makes estimates look better
              than they are.
            </li>
            <li>
              <strong>Knees collapsing inward</strong> under heavy loads.
            </li>
            <li>
              <strong>Losing upper-back tightness,</strong> letting the chest fall and the bar drift
              forward.
            </li>
            <li>
              <strong>Rising hips first out of the bottom,</strong> turning the squat into a good
              morning.
            </li>
            <li>
              <strong>Squatting heavy without safety pins</strong> or spotters.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Muscles the squat works",
      body: (
        <>
          <p>
            The squat trains the quadriceps, glutes and adductors as the main movers, with the
            hamstrings, lower back and core working hard to stabilise the trunk. Calves and upper
            back contribute to balance and bar support. Front squats shift more of the work to the
            quadriceps and upper back; low-bar squats involve more of the hips and posterior chain.
          </p>
        </>
      ),
    },
    {
      heading: "Squat variations",
      body: (
        <>
          <ul>
            <li>
              <strong>Front squat:</strong> the bar sits on the front of the shoulders, demanding an
              upright torso and strong upper back.
            </li>
            <li>
              <strong>Paused squat:</strong> a pause at the bottom builds strength out of the hole
              and reinforces position.
            </li>
            <li>
              <strong>Box squat:</strong> sitting back onto a box teaches control and consistent
              depth.
            </li>
            <li>
              <strong>Tempo squat:</strong> a slow descent builds control and muscle under tension.
            </li>
            <li>
              <strong>Safety bar squat:</strong> a padded bar with handles reduces shoulder strain
              and shifts work toward the upper back.
            </li>
            <li>
              <strong>Goblet squat:</strong> a dumbbell or kettlebell held at the chest, useful for
              learning the pattern.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A lifter squats 140 kg for 5 reps at about RPE 9. Epley gives 140 × (1 + 5 ÷ 30) ≈ 163
            kg. A training max at 90 percent is roughly 147 kg. A four-week block might use sets of
            five at 75, 80 and 85 percent of the training max, about 110, 117.5 and 125 kg, before a
            lighter week. At the end of the block, a new top set gives a fresh estimate for the next
            cycle.
          </p>
        </>
      ),
    },
    {
      heading: "Squat mobility",
      body: (
        <>
          <p>
            Many people struggle to reach full depth because of limited ankle, hip or thoracic
            mobility. Heel-elevated shoes or small plates under the heels make depth easier for
            people with stiff ankles. A slightly wider stance and turned-out toes help many people
            with tight hips. Goblet squats and paused bodyweight squats are good ways to practise
            the bottom position. Working on mobility does not need to be complicated: consistent
            practice through a full range under light load is often the most effective approach.
          </p>
        </>
      ),
    },
    {
      heading: "Squat and knee health",
      body: (
        <>
          <p>
            Squatting with good technique is generally safe for healthy knees, and stronger legs
            often reduce knee pain over time. Common sources of discomfort include sudden jumps in
            volume or load, knees collapsing inward, and poor recovery. If squats aggravate your
            knees, reducing depth temporarily, using a box, switching to goblet or Spanish squats,
            and building back gradually usually helps. Persistent pain, swelling or instability
            should be assessed by a professional.
          </p>
        </>
      ),
    },
    {
      heading: "Squat numbers by experience",
      body: (
        <>
          <p>
            New lifters often increase their squat rapidly, sometimes adding weight every session
            for the first few months as technique improves and the nervous system adapts. After
            that, progress slows to weekly or monthly increases, and experienced lifters may gain
            only a few percent over a year. Comparing your estimated max against your own past
            numbers is more meaningful than comparing with others, because body size, limb length
            and training history vary so much.
          </p>
        </>
      ),
    },
    {
      heading: "Squat competition rules",
      body: (
        <>
          <p>
            In powerlifting, the lifter must squat until the top of the hip at the crease is below
            the top of the knee, then return to a standing position with knees locked, waiting for
            referee commands to start and to rack. Squatting consistently to that depth in training,
            and estimating your max from sets at that depth, gives a number that will hold up in
            competition.
          </p>
        </>
      ),
    },
    {
      heading: "A sample weekly squat plan",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Main work</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Day 1</td>
                  <td>Back squat 4 × 5 at about 80%</td>
                  <td>Strength</td>
                </tr>
                <tr>
                  <td>Day 2</td>
                  <td>Front squat or paused squat 3 × 6 at about 65 to 70%</td>
                  <td>Position and volume</td>
                </tr>
                <tr>
                  <td>Day 3</td>
                  <td>Back squat 5 × 3 at about 85% (optional)</td>
                  <td>Heavy practice</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Many lifters run two of these days rather than three, especially if they also deadlift
            heavily. Add lunges, leg press, hamstring curls and core work as accessories.
          </p>
        </>
      ),
    },
    {
      heading: "Breathing and bracing in the squat",
      body: (
        <>
          <p>
            Before each rep, take a big breath into the belly, brace the trunk, and hold it through
            the descent and most of the way up. Releasing the breath at the bottom often causes the
            chest to collapse and the bar to drift forward. A belt can help on heavy sets by giving
            the abdominal muscles something to push against. Practising the same breathing on every
            warm-up set makes it automatic on heavy ones.
          </p>
        </>
      ),
    },
    {
      heading: "Footwear for squatting",
      body: (
        <>
          <p>
            Weightlifting shoes with a raised, firm heel help many lifters stay upright and reach
            depth, especially in high-bar and front squats. Flat, firm shoes or bare feet suit many
            low-bar squatters. Soft running shoes are the least stable option, because the
            cushioning compresses unevenly under load. Whatever you choose, keep it consistent so
            estimates compare like with like.
          </p>
        </>
      ),
    },
    {
      heading: "Squat and the rest of your training",
      body: (
        <>
          <p>
            The squat affects, and is affected by, everything else in a programme. Heavy deadlifts,
            lunges, running and sports all draw on the same leg muscles and recovery. If your squat
            stalls while you are doing a lot of other leg work or conditioning, reducing some of
            that work, or scheduling it further from your heavy squat days, often helps. Equally,
            adding a second squat day with lighter weights can improve technique and strength
            without much extra fatigue.
          </p>
        </>
      ),
    },
    {
      heading: "Squatting at home",
      body: (
        <>
          <p>
            If you train at home without a rack, goblet squats, dumbbell squats, split squats and
            Bulgarian split squats can build considerable leg strength. They cannot be converted
            directly into a barbell squat max, but you can estimate a max for each variation and
            track progress the same way. Many lifters returning to the barbell after training at
            home find their squat recovers quickly once technique is refreshed.
          </p>
        </>
      ),
    },
    {
      heading: "Squat for older lifters",
      body: (
        <>
          <p>
            Squatting remains valuable later in life for leg strength, balance and the ability to
            get up from a chair or the floor easily. Older lifters often do well with goblet squats,
            box squats and moderate-rep sets, which build strength with less joint stress and lower
            risk than heavy singles. Estimating a max from sets of six to ten reps is a safe way to
            track progress, and even small improvements in squat strength can make everyday
            movements noticeably easier.
          </p>
        </>
      ),
    },
    {
      heading: "Squat and sport",
      body: (
        <>
          <p>
            For athletes, a stronger squat supports sprinting, jumping and changes of direction,
            though the relationship is not one-to-one: technique and power in the sport matter too.
            Many strength coaches aim for athletes to squat around 1.5 to 2 times body weight, then
            shift focus to power and speed work once that level is reached. Tracking the estimated
            max helps show when an athlete has built enough strength to prioritise other qualities.
          </p>
        </>
      ),
    },
    {
      heading: "Common causes of a stalled squat",
      body: (
        <>
          <ul>
            <li>
              <strong>Too little practice:</strong> squatting only once a week may not give enough
              exposure for technique and strength.
            </li>
            <li>
              <strong>Too much fatigue:</strong> heavy squats plus heavy deadlifts plus running can
              exceed recovery.
            </li>
            <li>
              <strong>Weak positions:</strong> if you always miss in the same place, a variation
              such as paused or front squats can target it.
            </li>
            <li>
              <strong>Under-eating:</strong> strength gains slow in a large calorie deficit.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Long-term squat goals",
      body: (
        <>
          <p>
            Common long-term squat goals include a body-weight squat for reps, then 1.5 times body
            weight, then double body weight for men or around 1.5 times for women. Breaking each
            into smaller targets, such as adding 5 kg to your estimated max each training block,
            makes them achievable. Tracking the estimate every few weeks keeps you honest about
            progress and helps you adjust the programme before a plateau sets in.
          </p>
        </>
      ),
    },
    {
      heading: "Squat equipment checklist",
      body: (
        <>
          <p>
            For heavy squatting, a solid rack with safety pins set just below your bottom position
            is the most important piece of equipment. A belt helps many lifters brace on heavy sets.
            Knee sleeves keep the joints warm and can add a little support. Stable footwear with a
            firm sole, and chalk on the upper back to stop the bar sliding, round out the list. None
            of these replace good technique, but they make heavy training safer and more consistent.
          </p>
        </>
      ),
    },
    {
      heading: "Filming your squat",
      body: (
        <>
          <p>
            A phone propped at hip height, side-on, is the easiest way to check depth and bar path.
            Comparing videos of the same weight over weeks shows whether technique is holding up as
            loads rise.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Build a squat block from your estimate",
    whenToUse: "When you have a squat estimate and want a structured few weeks of training.",
    pasteIn: "Your estimated squat max, how many days a week you squat, and your goal.",
    text: `My estimated squat one-rep max is [weight]. I squat [days] times a week. My goal is [strength / muscle / both].

1. Write a four-week squat plan with sets, reps and percentages for each session.
2. Use a training max of 90% of my estimate.
3. Include one variation (front, paused or tempo squat).
4. Suggest two accessory exercises for each session.`,
  },
  forCoaches: {
    heading: "Using squat estimates with clients",
    body: (
      <>
        <p>
          Ask clients to log their top squat set each session or week. The estimated max gives you a
          running measure of strength without regular testing.
        </p>
        <p>
          Agree technique standards before you start tracking, so improvements reflect strength
          rather than changes in range of motion.
        </p>
        <p>
          Use the percentage table to set loads, then adjust by feel. If a client's squat feels
          heavy on a given day, reduce the load rather than forcing the planned number.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Program squat for every client",
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
    { label: "See where this lift ranks", href: "/tools/strength-standards-calculator" },
    { label: "Build a warm-up for your working weight", href: "/tools/warm-up-set-calculator" },
  ],
  nextPitch: "Coaching lifters? Traiv keeps every client's plans and logged sets together.",
  faq: [
    {
      q: "How do I estimate my squat one-rep max?",
      a: "Use a hard set of 3 to 8 reps and a formula such as Epley: weight × (1 + reps ÷ 30).",
    },
    {
      q: "Does squat depth affect my max?",
      a: "Yes. Deeper squats allow less weight; use the depth you train at consistently.",
    },
    {
      q: "Is high-bar or low-bar squat stronger?",
      a: "Most lifters can lift slightly more with a low-bar position, but both are valid.",
    },
    {
      q: "How much should I squat relative to my body weight?",
      a: "About 1.5 × body weight is a solid intermediate milestone for men and about 1.25 × for women.",
    },
    {
      q: "How often should I squat?",
      a: "Two or three times a week with varied intensity suits most lifters.",
    },
    {
      q: "Should I wear a belt?",
      a: "A belt can help bracing on heavy sets. Track belted and unbelted numbers separately.",
    },
    {
      q: "Why does my squat feel harder some days?",
      a: "Sleep, stress, nutrition and recent training all affect performance. Adjust load by feel on those days.",
    },
    {
      q: "How fast does a squat improve?",
      a: "Beginners can add weight most sessions at first; progress slows to small gains per training cycle with experience.",
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
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "RPE calculator", href: "/tools/rpe-calculator" },
    { label: "Plate loading calculator", href: "/tools/plate-loading-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Strength programmes built from each client's numbers",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
