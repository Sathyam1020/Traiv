import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Bench Press Calculator: Estimate Your Bench 1RM",
  description:
    "Free bench press calculator. Estimate your bench one-rep max from any set with Epley or Brzycki, and get working weights for every training percentage.",
  eyebrow: "Free tool · Strength",
  h1: "Bench press calculator",
  intro: (
    <>
      <p>
        The bench press is the most popular test of upper-body strength, and the easiest to estimate
        badly. Enter the weight and reps from a recent hard set, and this calculator estimates your
        bench one-rep max and gives you working weights for every common training percentage,
        rounded to loadable plates.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you estimate your bench press max?",
    answer: (
      <>
        <p>
          Take a recent hard set of bench press and apply a one-rep max formula. With Epley, 185 lb
          for 5 reps gives an estimated max of about 216 lb; Brzycki gives about 208 lb.
        </p>
        <p>
          Use a set of 3 to 8 reps taken within one or two reps of failure, performed with the same
          technique you use in training. The result gives you a reliable number to set bench press
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
            Brzycki multiplies the weight by 36 and divides by 37 minus the reps. For a bench press
            of 185 lb for 5 reps, Epley gives about 216 lb and Brzycki about 208 lb.
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
      heading: "Bench technique that makes estimates reliable",
      body: (
        <>
          <p>
            Estimates only mean something if every rep is performed the same way. A consistent bench
            press has a stable setup: feet planted, shoulder blades pulled back and down, a slight
            arch, and the bar lowered under control to the lower chest. The bar should touch the
            chest on every rep, without bouncing, and finish at full lockout.
          </p>
          <p>
            Many lifters train touch-and-go but compete or test with a pause. A pause typically
            reduces the weight you can lift by a few percent, so estimate from the style you will
            actually use. If you train both, track them separately.
          </p>
          <p>
            Grip width changes the lift too. A wider grip shortens the range of motion and often
            allows more weight; a closer grip shifts work to the triceps and usually reduces the
            maximum. Keep grip width consistent between the sets you compare.
          </p>
        </>
      ),
    },
    {
      heading: "What is a good bench press?",
      body: (
        <>
          <p>
            Relative to body weight, a bench press of around 0.75 times body weight is a common
            milestone for men in their first year of training, with a bodyweight bench marking solid
            intermediate strength and 1.5 times body weight a strong, experienced lifter. For women,
            around half of body weight is a common early milestone and three quarters of body weight
            a strong intermediate result. These are rough benchmarks; the strength standards
            calculator ranks your lift in more detail.
          </p>
        </>
      ),
    },
    {
      heading: "Programming the bench press",
      body: (
        <>
          <p>
            The bench responds well to frequency. Many lifters bench two or three times a week at
            different intensities: a heavier day with sets of three to five at 80 to 87 percent, a
            volume day with sets of eight to ten at 65 to 75 percent, and sometimes a variation day
            using close-grip, paused or incline benching. Accessory work for triceps, shoulders and
            upper back supports progress, because these muscles both move and stabilise the bar.
          </p>
          <p>
            Progress on bench is slower than on squat or deadlift for most people, because the
            muscles involved are smaller. Adding 2.5 kg or 5 lb every week or two is realistic for
            beginners; experienced lifters may add a similar amount over a whole training block.
          </p>
        </>
      ),
    },
    {
      heading: "Common bench press mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Bouncing the bar off the chest,</strong> which inflates numbers and stresses
              the sternum and shoulders.
            </li>
            <li>
              <strong>Flaring the elbows straight out,</strong> which places more strain on the
              shoulders. A moderate tuck of about 45 to 70 degrees suits most people.
            </li>
            <li>
              <strong>Lifting the hips off the bench,</strong> which changes the angle and would not
              count in competition.
            </li>
            <li>
              <strong>Losing upper-back tightness</strong> as the bar comes down.
            </li>
            <li>
              <strong>Benching without a spotter or safety arms</strong> when working near your
              limit.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Accessory work that builds a bigger bench",
      body: (
        <>
          <p>
            The bench press is limited by its weakest link, which for many lifters is the triceps
            near lockout or the shoulders and chest off the bottom. Close-grip bench press, dips and
            overhead triceps extensions build lockout strength. Paused bench, spoto press and
            incline press build strength from the chest. Rows, face pulls and rear-delt work
            strengthen the upper back, which acts as the platform you press from. Most programmes
            include two to four accessory movements after the main bench work.
          </p>
        </>
      ),
    },
    {
      heading: "Muscles the bench press works",
      body: (
        <>
          <p>
            The bench press mainly trains the chest (pectoralis major), the front of the shoulders
            (anterior deltoids) and the triceps. The upper back, lats and forearms work to stabilise
            the bar and the shoulders. Grip width and bench angle change the balance: a wider grip
            emphasises the chest, a closer grip the triceps, and an incline bench shifts more of the
            work to the upper chest and front shoulders.
          </p>
        </>
      ),
    },
    {
      heading: "Bench press variations",
      body: (
        <>
          <ul>
            <li>
              <strong>Paused bench:</strong> a one- to two-second pause on the chest removes the
              stretch reflex and builds strength from the bottom.
            </li>
            <li>
              <strong>Close-grip bench:</strong> hands about shoulder-width apart, with more triceps
              involvement.
            </li>
            <li>
              <strong>Incline bench:</strong> a 30 to 45 degree bench angle targets the upper chest
              and shoulders.
            </li>
            <li>
              <strong>Dumbbell bench:</strong> a larger range of motion and independent arms, useful
              for balancing strength between sides.
            </li>
            <li>
              <strong>Spoto press:</strong> pausing just above the chest to build control and
              strength through the mid-range.
            </li>
            <li>
              <strong>Floor press:</strong> a shortened range that builds lockout strength and is
              kind to some shoulders.
            </li>
          </ul>
          <p>
            Each variation has its own max. If you track them, estimate each separately rather than
            converting between them.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A lifter benches 80 kg for 6 reps with one rep in reserve. The Epley estimate is 80 × (1
            + 6 ÷ 30) = 96 kg. For a strength block, sets of five at about 80 percent of 96 kg is
            roughly 77.5 kg; heavy triples at about 87 percent is around 82.5 kg. A volume day of
            sets of eight at 70 percent would be around 67.5 kg. As top sets improve, the estimate
            and all the percentages rise with them.
          </p>
        </>
      ),
    },
    {
      heading: "Bench press and shoulder health",
      body: (
        <>
          <p>
            The bench press places considerable demand on the shoulders, and shoulder discomfort is
            one of the most common complaints among lifters. A few habits help: keep the shoulder
            blades pulled back and down, avoid flaring the elbows wide, warm up the rotator cuff
            before heavy sessions, and balance pressing with plenty of rowing and pulling. If a
            particular grip or angle causes pain, a neutral-grip dumbbell press or floor press is
            often better tolerated while the shoulder settles.
          </p>
        </>
      ),
    },
    {
      heading: "Bench press for women",
      body: (
        <>
          <p>
            Women typically have less upper-body muscle relative to body weight than men, so bench
            press numbers are lower in absolute and relative terms. That is no barrier to steady
            progress. Using smaller increments, such as 1 to 1.25 kg plates or microplates, helps
            avoid stalls, and many women find that frequent benching with moderate volume produces
            consistent gains. The relative strength standards for women reflect these differences,
            so compare your numbers with those rather than with men's benchmarks.
          </p>
        </>
      ),
    },
    {
      heading: "Setting up for a heavy single",
      body: (
        <>
          <p>
            On a heavy attempt, the setup is half the lift. Set the bench height so your eyes are
            under the bar, grip evenly, pull the shoulder blades together, plant the feet and create
            a stable arch before unracking. Take a breath, brace, lower the bar under control to the
            same point on your chest every time, and drive it back up and slightly toward your face.
            Practising this exact sequence on every working set makes heavy singles feel familiar
            rather than chaotic.
          </p>
        </>
      ),
    },
    {
      heading: "Bench press competition rules",
      body: (
        <>
          <p>
            In powerlifting competitions, the bench press must be lowered to the chest, held
            motionless until the referee calls press, pressed to full lockout, and held until the
            rack command. The head, shoulders and buttocks must stay in contact with the bench and
            the feet flat on the floor throughout, with slight variations between federations.
            Training with a pause prepares you for these rules. If you plan to compete, practise
            paused reps regularly and estimate your competition max from paused sets.
          </p>
        </>
      ),
    },
    {
      heading: "A sample weekly bench plan",
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
                  <td>Bench 4 × 5 at about 80%</td>
                  <td>Strength</td>
                </tr>
                <tr>
                  <td>Day 2</td>
                  <td>Close-grip or incline bench 3 × 8 at about 70%</td>
                  <td>Volume and triceps</td>
                </tr>
                <tr>
                  <td>Day 3</td>
                  <td>Paused bench 5 × 3 at about 75 to 80%</td>
                  <td>Strength from the chest</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Add two or three accessory exercises each day, such as rows, dips, dumbbell presses or
            triceps extensions. Increase weights gradually when all sets feel solid. A lighter week
            every four to six weeks helps recovery.
          </p>
        </>
      ),
    },
    {
      heading: "Leg drive and setup",
      body: (
        <>
          <p>
            Although it is an upper-body lift, the legs play a role in the bench press. Pressing the
            feet into the floor and driving the body back toward the head, without lifting the hips,
            creates tension from the feet through to the upper back and makes the lift feel more
            stable. Learning to use leg drive often adds a few kilograms to a lifter's max without
            any change in upper-body strength.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking bench progress",
      body: (
        <>
          <p>
            Bench press progress is often slow and steady. Logging your top set each session and
            estimating your max every week or two shows trends that are hard to see day to day. If
            the estimate has not moved for four to six weeks, look at total weekly sets, whether
            accessory work supports the bench, sleep and food. Small changes, like adding a third
            weekly bench session or a set of close-grip work, often restart progress.
          </p>
        </>
      ),
    },
    {
      heading: "Bench press and body weight changes",
      body: (
        <>
          <p>
            Bench press strength is closely linked to body weight. Many lifters see their bench rise
            during a muscle-gaining phase and dip slightly during a diet, even when training stays
            the same. Losing weight while holding your bench steady is a sign you are keeping
            muscle. If your bench drops sharply during a diet, the deficit may be too large, protein
            too low or recovery too poor. Tracking your estimated max alongside body weight gives
            you a clearer picture of what is happening.
          </p>
        </>
      ),
    },
    {
      heading: "Dumbbell and machine pressing",
      body: (
        <>
          <p>
            Dumbbell bench press and machine chest press are useful partners for the barbell bench.
            Dumbbells allow a greater range of motion and let each arm work independently, which can
            reveal and correct imbalances. Machines provide a stable path that lets you push hard
            with less need for balance, making them useful for higher-rep work and for training
            around minor shoulder discomfort. Neither converts directly to a barbell max, so
            estimate them separately if you track them.
          </p>
        </>
      ),
    },
    {
      heading: "Bench press for beginners",
      body: (
        <>
          <p>
            New lifters often make rapid progress on the bench in the first few months, adding
            weight most weeks as they learn to set up, stay tight and control the bar. During this
            stage, focus on consistent technique and modest increases, and use sets of five to eight
            reps to estimate your max rather than testing singles. Push-ups and dumbbell presses are
            useful supporting exercises that build the same muscles with less demand on technique.
          </p>
          <p>
            If you train alone, a power rack with safety arms set just below chest height lets you
            train close to failure without needing a spotter, and makes estimating from hard sets
            much safer.
          </p>
        </>
      ),
    },
    {
      heading: "How grip and arch change your numbers",
      body: (
        <>
          <p>
            Small changes in setup can change your bench numbers by several percent. A wider grip
            and a higher arch both shorten the distance the bar travels, making the lift easier.
            That is fine, and many competitive lifters use both, but it means estimates from
            different setups are not comparable. If you change your setup, start a fresh line of
            estimates from that point.
          </p>
        </>
      ),
    },
    {
      heading: "Long-term bench goals",
      body: (
        <>
          <p>
            Popular long-term goals include benching body weight for a single, then for a set of
            five, and eventually pressing 1.25 or 1.5 times body weight. These milestones take many
            lifters several years. Breaking them into smaller steps, such as adding 2.5 kg to your
            estimated max each training block, keeps progress visible and motivating. Celebrate each
            step; a steadily rising bench is the result of hundreds of well-executed sets.
          </p>
        </>
      ),
    },
    {
      heading: "Bench press and recovery",
      body: (
        <>
          <p>
            The chest, shoulders and triceps recover fairly quickly, which is why the bench responds
            well to two or three sessions a week. Even so, stacking heavy bench work with lots of
            other pressing, dips and shoulder work can overload the shoulders and elbows. If joints
            feel sore rather than the muscles, reduce total pressing volume for a week and build
            back gradually. Sleep, food and stress management matter as much for the bench as for
            any other lift; a well-recovered lifter will almost always beat a tired one.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using bench press estimates with clients",
    body: (
      <>
        <p>
          Ask clients to log their top bench press set each session or week. The estimated max gives
          you a running measure of strength without regular testing.
        </p>
        <p>
          Agree technique standards before you start tracking, so improvements reflect strength
          rather than changes in range of motion.
        </p>
        <p>
          Use the percentage table to set loads, then adjust by feel. If a client's bench press
          feels heavy on a given day, reduce the load rather than forcing the planned number.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Program bench press for every client",
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
      q: "How do I calculate my bench press max?",
      a: "Use a hard set of 3 to 8 reps and a formula such as Epley: weight × (1 + reps ÷ 30).",
    },
    {
      q: "Is a paused bench lower than a touch-and-go bench?",
      a: "Usually by a few percent. Estimate from the style you train and test with.",
    },
    {
      q: "What is a good bench press for my body weight?",
      a: "About 1 × body weight is a solid intermediate milestone for men and about 0.75 × for women.",
    },
    {
      q: "How often should I bench to increase my max?",
      a: "Two or three times a week at varying intensities works well for most lifters.",
    },
    {
      q: "Why has my bench stalled?",
      a: "Common causes are too little weekly volume, weak triceps or upper back, inconsistent technique, or poor recovery.",
    },
    {
      q: "Should I use a wide or close grip?",
      a: "A moderate grip, with forearms roughly vertical at the bottom, suits most people. Keep it consistent when comparing numbers.",
    },
    {
      q: "Do I need a spotter?",
      a: "When working near your limit, yes, or use a rack with safety arms set just below chest height.",
    },
    {
      q: "How fast can I improve my bench?",
      a: "Beginners can add weight most weeks; experienced lifters progress more slowly, often a few kilograms per training cycle.",
    },
    {
      q: "Does arching the back help?",
      a: "A moderate arch improves stability and shoulder position for most lifters. It also shortens the range of motion slightly.",
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
