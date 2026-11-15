import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Overhead Press Calculator: Estimate Your Press 1RM",
  description:
    "Free overhead press calculator. Estimate your strict press one-rep max from any set with Epley or Brzycki, plus working weights for every percentage.",
  eyebrow: "Free tool · Strength",
  h1: "Overhead press calculator",
  intro: (
    <>
      <p>
        The strict overhead press is a demanding test of shoulder and upper-body strength. Enter a
        recent hard set, choose a formula, and this calculator estimates your overhead press one-rep
        max and gives working weights for each training percentage, rounded to loadable plates.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you estimate your overhead press max?",
    answer: (
      <>
        <p>
          Take a recent hard set of overhead press and apply a one-rep max formula. With Epley, 185
          lb for 5 reps gives an estimated max of about 216 lb; Brzycki gives about 208 lb.
        </p>
        <p>
          Use a set of 3 to 8 reps taken within one or two reps of failure, performed with the same
          technique you use in training. The result gives you a reliable number to set overhead
          press percentages from without testing a heavy single.
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
            Brzycki multiplies the weight by 36 and divides by 37 minus the reps. For a overhead
            press of 185 lb for 5 reps, Epley gives about 216 lb and Brzycki about 208 lb.
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
      heading: "Strict press standards",
      body: (
        <>
          <p>
            A strict press starts with the bar resting on the front of the shoulders, elbows
            slightly in front of the bar, and finishes with the bar locked out over the middle of
            the foot. The legs stay straight: any knee bend turns it into a push press, which allows
            significantly more weight. Keep the glutes and core tight to avoid leaning back
            excessively, which shifts the lift toward an incline press.
          </p>
          <p>
            Estimates from push presses or heavily leaned-back presses will overstate strict
            pressing strength. Keep the standard consistent from set to set.
          </p>
        </>
      ),
    },
    {
      heading: "What is a good overhead press?",
      body: (
        <>
          <p>
            For men, pressing around 0.55 times body weight is a common intermediate milestone, and
            pressing body weight is an impressive long-term goal reached by relatively few lifters.
            For women, around 0.35 times body weight is a common intermediate milestone. The
            overhead press typically progresses more slowly than other lifts.
          </p>
        </>
      ),
    },
    {
      heading: "Programming the overhead press",
      body: (
        <>
          <p>
            Most lifters press two or three times a week, often alternating with the bench press.
            Sets of three to six reps at 75 to 87 percent build strength; sets of eight to twelve
            with dumbbells or lighter barbell work build the shoulders and triceps. Push presses can
            be used as a heavier variation to overload the lockout.
          </p>
          <p>
            Upper-back and rotator cuff work, such as face pulls, rows and external rotations, helps
            keep the shoulders healthy with frequent pressing.
          </p>
        </>
      ),
    },
    {
      heading: "Common overhead press mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Leaning back too far,</strong> which turns the press into an incline press and
              strains the lower back.
            </li>
            <li>
              <strong>Using leg drive</strong> without noticing, which inflates estimates.
            </li>
            <li>
              <strong>Pressing the bar forward</strong> instead of moving the head out of the way so
              the bar travels straight up.
            </li>
            <li>
              <strong>Flaring the elbows wide</strong> at the start.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Building a stronger press",
      body: (
        <>
          <p>
            The overhead press tends to respond to frequency and patience. Pressing two or three
            times a week with a mix of heavier and lighter days, and using small increments of 1 to
            2.5 kg, allows steady progress where big jumps would stall. Microplates help here.
            Building the triceps with close-grip bench and dips, and the upper back with rows and
            face pulls, supports a stronger press. Some lifters find that a few weeks of push
            presses, which let them handle heavier weights overhead, help the strict press when they
            return to it.
          </p>
        </>
      ),
    },
    {
      heading: "Muscles the overhead press works",
      body: (
        <>
          <p>
            The overhead press works the shoulders, especially the front and side deltoids, and the
            triceps to lock the bar out. The upper chest assists early in the lift, while the upper
            back, core and glutes work hard to keep the body stable under the bar. Because the whole
            body must stay tight, the press is as much a test of stability as of shoulder strength.
          </p>
        </>
      ),
    },
    {
      heading: "Overhead press variations",
      body: (
        <>
          <ul>
            <li>
              <strong>Seated press:</strong> removes the legs and reduces lower-back involvement.
            </li>
            <li>
              <strong>Dumbbell press:</strong> allows each arm to move freely and balances strength
              between sides.
            </li>
            <li>
              <strong>Push press:</strong> uses a dip and drive from the legs to move heavier loads
              overhead.
            </li>
            <li>
              <strong>Z press:</strong> pressing while seated on the floor, demanding strong core
              control.
            </li>
            <li>
              <strong>Landmine press:</strong> a diagonal pressing path that suits many sore
              shoulders.
            </li>
          </ul>
          <p>Estimate each variation separately; they are different lifts with different maxes.</p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A lifter presses 50 kg for 6 reps with good form. Epley gives 50 × (1 + 6 ÷ 30) = 60 kg.
            Because the press progresses slowly, a training max of 90 percent, about 54 kg, keeps
            sessions manageable. Sets of five at 80 percent of the training max would be about 43
            kg, and heavy triples at 90 percent about 48.5 kg. Adding 1 kg to the top set every week
            or two is realistic progress.
          </p>
        </>
      ),
    },
    {
      heading: "Overhead mobility",
      body: (
        <>
          <p>
            Pressing overhead comfortably requires enough shoulder and upper-back mobility to get
            the arms straight above the head without arching the lower back. If you find yourself
            leaning back a lot, mobility may be limiting you. Working on thoracic extension, lat
            flexibility and shoulder flexion, and temporarily using landmine or slight-incline
            presses, can help. Forcing a strict overhead position before you have the mobility for
            it often leads to lower-back strain.
          </p>
        </>
      ),
    },
    {
      heading: "Press relative to bench",
      body: (
        <>
          <p>
            Most lifters press roughly 60 to 70 percent of their bench press. If your press is much
            lower than that, it may be a weak point worth extra attention, such as pressing more
            often, adding overhead accessory work or improving mobility. If your press is unusually
            high relative to your bench, your bench may have room to improve. Comparing the two
            estimates is a quick way to spot imbalances.
          </p>
        </>
      ),
    },
    {
      heading: "Pressing for shoulder health",
      body: (
        <>
          <p>
            Done with good technique and balanced with plenty of pulling work, the overhead press
            can support shoulder health by strengthening the muscles that control the shoulder
            through a full range. Common problems arise from pressing with poor posture, excessive
            volume or ignoring pain. If pressing overhead hurts, a landmine press or a neutral-grip
            dumbbell press is often a comfortable alternative while you build strength and mobility.
          </p>
        </>
      ),
    },
    {
      heading: "A sample weekly press plan",
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
                  <td>Overhead press 4 × 5 at about 80%</td>
                  <td>Strength</td>
                </tr>
                <tr>
                  <td>Day 2</td>
                  <td>Dumbbell or seated press 3 × 10 at a moderate weight</td>
                  <td>Volume and shoulders</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Pair pressing with plenty of pulling work, such as pull-ups, rows and face pulls, and
            add triceps and lateral-raise work for balanced shoulder development.
          </p>
        </>
      ),
    },
    {
      heading: "Breathing and body position",
      body: (
        <>
          <p>
            Take a breath and brace before each rep, squeeze the glutes and keep the ribs down. This
            creates a solid base and prevents excessive leaning back. As the bar passes the
            forehead, move the head forward slightly so the bar finishes directly over the middle of
            the foot, with the arms locked and the shoulders shrugged up a little at the top.
            Practising this sequence on light sets makes heavy reps much smoother.
          </p>
        </>
      ),
    },
    {
      heading: "Progressing slowly but surely",
      body: (
        <>
          <p>
            Because the press uses smaller muscles, standard 2.5 kg or 5 lb jumps can be too large,
            especially for smaller lifters and women. Microplates of 0.5 to 1.25 kg allow steady
            progress, and adding a rep before adding weight is another effective approach. A press
            that improves by just a kilogram a month adds up to a big difference over a year.
          </p>
        </>
      ),
    },
    {
      heading: "Overhead pressing for athletes",
      body: (
        <>
          <p>
            Strong overhead pressing supports performance in sports that involve throwing, pushing
            or reaching overhead, such as volleyball, swimming, combat sports and many field sports.
            Athletes often favour push presses and dumbbell variations that build power and
            stability, alongside strict pressing for strength. Estimating separate maxes for strict
            and push presses helps athletes track both strength and power.
          </p>
        </>
      ),
    },
    {
      heading: "Overhead press for women",
      body: (
        <>
          <p>
            The overhead press often progresses most slowly for women, because the shoulders and
            arms typically carry less muscle relative to body weight. Small increments, frequent
            pressing and plenty of shoulder and triceps accessory work help maintain progress.
            Dumbbell pressing can also be a useful way to build strength when barbell increments
            feel too large.
          </p>
        </>
      ),
    },
    {
      heading: "Estimating from dumbbell presses",
      body: (
        <>
          <p>
            If you mainly press with dumbbells, you can use the calculator with the weight of one
            dumbbell to estimate a single-dumbbell max for that movement. It does not convert
            directly to a barbell press, because each arm works alone and must stabilise its own
            weight, but it is a good way to track progress. Many lifters find that their combined
            dumbbell weight for a set of eight is a little below their barbell weight for the same
            reps.
          </p>
        </>
      ),
    },
    {
      heading: "Common causes of a stalled press",
      body: (
        <>
          <ul>
            <li>
              <strong>Pressing only once a week,</strong> which often is not enough frequency for
              this lift.
            </li>
            <li>
              <strong>Weak triceps,</strong> limiting lockout.
            </li>
            <li>
              <strong>Limited shoulder mobility,</strong> forcing a leaned-back position.
            </li>
            <li>
              <strong>Jumps that are too big</strong> for the lift's slow rate of progress.
            </li>
          </ul>
          <p>
            Addressing one of these at a time, for four to six weeks, usually gets the press moving
            again.
          </p>
        </>
      ),
    },
    {
      heading: "Pressing safely at home",
      body: (
        <>
          <p>
            Without a rack, getting a barbell into position for the press means cleaning it from the
            floor, which adds technique demands. Dumbbell and kettlebell presses are safer options
            at home, and landmine presses can be set up with a barbell wedged into a corner. Track
            estimated maxes for whichever variation you use.
          </p>
        </>
      ),
    },
    {
      heading: "Long-term pressing goals",
      body: (
        <>
          <p>
            A body-weight overhead press is a rare and impressive achievement, and most lifters set
            more modest milestones along the way, such as pressing half or three quarters of body
            weight for a single, or pressing their body weight split across two dumbbells. Small,
            consistent increases are the path to all of them. Reviewing your estimated max every few
            weeks keeps progress visible even when each session feels the same.
          </p>
        </>
      ),
    },
    {
      heading: "Overhead press and recovery",
      body: (
        <>
          <p>
            The shoulders are involved in almost every upper-body exercise, from bench press to
            rows, so they can accumulate fatigue quickly. If pressing feels heavy and joints feel
            achy, reduce total upper-body volume for a week before changing the programme. Warming
            up the shoulders with light band work and a few progressively heavier press sets before
            each session helps keep them healthy over the long term.
          </p>
        </>
      ),
    },
    {
      heading: "Filming your press",
      body: (
        <>
          <p>
            A side-on video shows whether the bar travels in a straight line and how much you lean
            back. Small changes in body position can make a big difference to pressing strength.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using overhead press estimates with clients",
    body: (
      <>
        <p>
          Ask clients to log their top overhead press set each session or week. The estimated max
          gives you a running measure of strength without regular testing.
        </p>
        <p>
          Agree technique standards before you start tracking, so improvements reflect strength
          rather than changes in range of motion.
        </p>
        <p>
          Use the percentage table to set loads, then adjust by feel. If a client's overhead press
          feels heavy on a given day, reduce the load rather than forcing the planned number.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Program overhead press for every client",
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
      q: "How do I estimate my overhead press max?",
      a: "Use a hard set of 3 to 8 strict reps and a formula such as Epley: weight × (1 + reps ÷ 30).",
    },
    {
      q: "Does a push press count?",
      a: "No. Push presses use the legs and allow much more weight; estimate strict and push press separately.",
    },
    {
      q: "What is a good overhead press?",
      a: "Around 0.55 × body weight is a solid intermediate milestone for men and about 0.35 × for women.",
    },
    {
      q: "Why is my overhead press so much weaker than my bench?",
      a: "The press uses smaller muscles and a longer range of motion. Pressing about 60 to 70 percent of your bench is common.",
    },
    {
      q: "How often should I overhead press?",
      a: "Two or three times a week works well for most lifters.",
    },
    {
      q: "Should I press seated or standing?",
      a: "Both build strength. Standing presses involve more of the body; keep the style consistent when comparing numbers.",
    },
    {
      q: "How fast does the overhead press improve?",
      a: "Slowly for most lifters. Small, regular increases are normal.",
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
