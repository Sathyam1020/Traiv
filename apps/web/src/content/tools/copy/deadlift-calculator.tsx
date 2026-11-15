import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Deadlift Calculator: Estimate Your Deadlift 1RM",
  description:
    "Free deadlift calculator. Estimate your deadlift one-rep max from a recent set with Epley or Brzycki, and get working weights for every percentage.",
  eyebrow: "Free tool · Strength",
  h1: "Deadlift calculator",
  intro: (
    <>
      <p>
        The deadlift is usually the heaviest of the main lifts, and the one where a grinding max
        attempt carries the most risk. Estimating from a hard set is a safer way to know your
        number. Enter the weight and reps, choose a formula, and this calculator estimates your
        deadlift one-rep max and builds a percentage table for training.
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
    question: "How do you estimate your deadlift max?",
    answer: (
      <>
        <p>
          Take a recent hard set of deadlift and apply a one-rep max formula. With Epley, 315 lb for
          5 reps gives an estimated max of about 368 lb; Brzycki gives about 354 lb.
        </p>
        <p>
          Use a set of 3 to 8 reps taken within one or two reps of failure, performed with the same
          technique you use in training. The result gives you a reliable number to set deadlift
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
            Brzycki multiplies the weight by 36 and divides by 37 minus the reps. For a deadlift of
            315 lb for 5 reps, Epley gives about 368 lb and Brzycki about 354 lb.
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
      heading: "Technique standards for reliable estimates",
      body: (
        <>
          <p>
            A consistent deadlift starts with the bar over the middle of the foot, a flat back, the
            hips set at a height that suits your build, and the bar kept close to the legs all the
            way up. Each rep should start from a dead stop on the floor, with no bouncing, and
            finish with the hips and knees fully locked.
          </p>
          <p>
            Touch-and-go deadlifts, where the plates tap the floor and rebound into the next rep,
            allow more reps at a given weight than dead-stop reps, which inflates estimates. For a
            reliable number, reset briefly on the floor between reps.
          </p>
          <p>
            Conventional and sumo deadlifts are different lifts with different leverages. Many
            lifters are noticeably stronger in one style; track them separately.
          </p>
        </>
      ),
    },
    {
      heading: "What is a good deadlift?",
      body: (
        <>
          <p>
            For men, deadlifting 1.5 times body weight is a solid intermediate milestone, and twice
            body weight is a strong, experienced lifter. For women, around body weight is a common
            early-to-intermediate milestone, and 1.5 times body weight is strong. The strength
            standards calculator ranks your lift in more detail.
          </p>
        </>
      ),
    },
    {
      heading: "Programming the deadlift",
      body: (
        <>
          <p>
            Because heavy deadlifts are so demanding, most lifters pull heavy only once a week,
            sometimes with a lighter variation on another day. A typical heavy session uses sets of
            two to five reps at 80 to 90 percent. Romanian deadlifts, deficit deadlifts, block pulls
            and paused deadlifts are common variations that build specific parts of the lift.
          </p>
          <p>
            Grip often limits the deadlift before the legs and back do. Mixed grip, hook grip or
            straps for lighter back-off sets can help, as can direct grip training. Plan heavy
            deadlifts away from heavy squat days to manage recovery.
          </p>
        </>
      ),
    },
    {
      heading: "Common deadlift mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Rounding the lower back</strong> under heavy loads.
            </li>
            <li>
              <strong>Letting the bar drift away</strong> from the legs, which increases the load on
              the back.
            </li>
            <li>
              <strong>Jerking the bar off the floor</strong> instead of building tension first.
            </li>
            <li>
              <strong>Hyperextending at lockout</strong> by leaning back excessively.
            </li>
            <li>
              <strong>Bouncing reps,</strong> which makes estimates unreliable.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Grip, straps and equipment",
      body: (
        <>
          <p>
            Grip is a common limiting factor in heavy deadlifts. A double overhand grip is the most
            balanced but usually fails first at heavy loads. A mixed grip, with one palm facing
            forward and one back, holds more weight but loads the arms unevenly. A hook grip,
            wrapping the thumb under the fingers, is very secure once you get used to it. Chalk
            improves any grip. For estimating your max, use the grip you would use for a heavy
            single.
          </p>
          <p>
            A lifting belt helps many lifters brace and lift more on heavy sets. Whatever equipment
            you use, record it with each set so that estimates over time compare like with like.
          </p>
        </>
      ),
    },
    {
      heading: "Muscles the deadlift works",
      body: (
        <>
          <p>
            The deadlift trains almost the entire back of the body: glutes, hamstrings, the spinal
            erectors along the lower back, and the upper back and traps that keep the bar close and
            the shoulders set. The quadriceps help break the bar from the floor, especially in sumo
            and trap-bar variations, and the forearms and grip work hard to hold the bar. Few
            exercises load as much muscle at once.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlift variations",
      body: (
        <>
          <ul>
            <li>
              <strong>Romanian deadlift:</strong> starting from the top and lowering to mid-shin
              with soft knees, emphasising the hamstrings and glutes.
            </li>
            <li>
              <strong>Deficit deadlift:</strong> standing on a low platform to increase range and
              strength off the floor.
            </li>
            <li>
              <strong>Block or rack pull:</strong> starting from a raised position to overload the
              top of the lift.
            </li>
            <li>
              <strong>Paused deadlift:</strong> pausing just below the knee to reinforce position.
            </li>
            <li>
              <strong>Trap-bar deadlift:</strong> a more upright pull that many find easier on the
              lower back and easier to learn.
            </li>
            <li>
              <strong>Sumo deadlift:</strong> a wide stance with hands inside the knees, shortening
              the range of motion for many lifters.
            </li>
          </ul>
          <p>Estimate a separate max for each variation you track.</p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A lifter pulls 180 kg for 4 reps, resetting each rep on the floor, with about one rep
            left. Epley gives 180 × (1 + 4 ÷ 30) = 204 kg. Brzycki gives 180 × 36 ÷ 33 ≈ 196 kg. For
            deadlifts, many coaches prefer the more conservative estimate. A training max of 90
            percent of 196 kg is about 176 kg, so heavy triples at 90 percent of that would be
            around 158 kg.
          </p>
        </>
      ),
    },
    {
      heading: "Recovery and the deadlift",
      body: (
        <>
          <p>
            Heavy deadlifts create a lot of fatigue, both in the muscles and in the nervous system.
            Many lifters find they need more recovery after a heavy pull than after any other
            session. That is why programmes often deadlift heavy just once a week, use submaximal
            loads with crisp technique, and rely on variations and accessory work for additional
            volume. Pulling heavy singles every week tends to stall progress and raise injury risk.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlifting with back concerns",
      body: (
        <>
          <p>
            Lower-back discomfort is common among lifters, and the deadlift is often blamed. Most of
            the time, the cause is a jump in load or volume, fatigue, or a technique change rather
            than the exercise itself. Reducing load, using a trap bar or block pulls, strengthening
            the back with lighter variations, and building back up gradually is usually effective.
            Sharp pain, pain that spreads down the leg, numbness or weakness should be assessed by a
            professional before continuing.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlift records and context",
      body: (
        <>
          <p>
            Elite powerlifters can deadlift three times their body weight or more, and the heaviest
            lifts ever recorded exceed 500 kg. Those numbers reflect years of specialised training,
            favourable leverages and competition equipment rules. For most people, a deadlift of
            around twice body weight for men or 1.5 times for women represents years of consistent
            training and is a strong, healthy target.
          </p>
        </>
      ),
    },
    {
      heading: "Conventional or sumo?",
      body: (
        <>
          <p>
            Your build often decides which stance suits you. Lifters with long arms and a shorter
            torso often do well with conventional deadlifts, while those with longer legs, a shorter
            torso relative to their legs, or limited hip hinge mobility may find sumo more
            comfortable and stronger. Both are legitimate. Try each for a few weeks with moderate
            loads and estimate your max in each to compare.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlift competition rules",
      body: (
        <>
          <p>
            In competition, the deadlift must be lifted in one continuous movement until the lifter
            stands upright with knees locked and shoulders back, then lowered under control on the
            referee's command. Any downward movement of the bar before completion, or supporting the
            bar on the thighs, is a fail. Estimating your max from controlled, dead-stop reps that
            would meet these standards gives the most realistic competition number.
          </p>
        </>
      ),
    },
    {
      heading: "A sample weekly deadlift plan",
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
                  <td>Deadlift 3 × 3 at about 82 to 87%</td>
                  <td>Heavy strength</td>
                </tr>
                <tr>
                  <td>Day 2</td>
                  <td>Romanian deadlift 3 × 8 at a moderate weight</td>
                  <td>Hamstrings and glutes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Accessory work such as back extensions, rows, hip thrusts and grip training supports the
            main lift. Keep at least two days between the heavy deadlift session and a heavy squat
            session where possible.
          </p>
        </>
      ),
    },
    {
      heading: "Starting position by build",
      body: (
        <>
          <p>
            There is no single correct hip height. Lifters with long legs and short arms often start
            with their hips higher; lifters with short legs and long arms can start lower. The goal
            is to begin with the bar over the middle of the foot, shoulders slightly in front of the
            bar, and back flat. Filming a set from the side and comparing with your best reps helps
            you find a consistent starting position, which makes estimates more reliable.
          </p>
        </>
      ),
    },
    {
      heading: "Building the lockout and the floor",
      body: (
        <>
          <p>
            Most deadlift failures happen either off the floor or near the knees. If you struggle to
            break the bar from the floor, deficit deadlifts, paused deadlifts and more quad work
            help. If you get stuck near the knees or lockout, block pulls, Romanian deadlifts, hip
            thrusts and upper-back work help. Identifying where your heavy reps slow down tells you
            which variation to add.
          </p>
        </>
      ),
    },
    {
      heading: "Nutrition and the deadlift",
      body: (
        <>
          <p>
            Heavy deadlift sessions demand a lot of energy and recovery. Eating enough total
            calories, and enough protein, at around 1.6 to 2.2 g per kg of body weight, supports
            strength gains and recovery. Lifters who try to deadlift heavy while in a large calorie
            deficit often find their numbers stall or drop. During a diet, maintaining strength on
            the deadlift is a good sign that muscle is being preserved.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlift for beginners",
      body: (
        <>
          <p>
            New lifters often learn the deadlift with a trap bar or from blocks, which reduces the
            range of motion and makes it easier to keep a flat back. Practising the hip hinge with a
            dowel or light Romanian deadlifts builds the pattern before heavier pulls. Many
            beginners can add weight to the deadlift quickly at first, so estimate your max from
            regular sets rather than testing heavy singles early on, and prioritise consistent
            technique over fast progress.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlift for women",
      body: (
        <>
          <p>
            Many women find the deadlift is their strongest lift relative to body weight, because it
            relies heavily on the hips and legs, where women tend to carry a larger share of their
            muscle. Strength standards for women reflect this. Using the same principles as any
            lifter, consistent technique, gradual progression and adequate recovery, women can make
            excellent long-term progress on the deadlift.
          </p>
        </>
      ),
    },
    {
      heading: "How often to update your estimate",
      body: (
        <>
          <p>
            Because heavy deadlifts are usually done once a week, updating your estimate from each
            week's top set gives a steady record of progress. If the estimate rises for several
            weeks in a row, your programme is working. If it falls, check recovery, sleep, food and
            stress before changing the programme. A single bad session is not a trend; look at three
            or four weeks together.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlifts and other back exercises",
      body: (
        <>
          <p>
            Rows, pull-ups, back extensions and good mornings all strengthen muscles that support
            the deadlift, and many lifters find that building the upper back in particular helps
            keep the bar close and the back flat on heavy pulls. Balance heavy pulling with enough
            recovery: if your lower back feels fatigued for several days after deadlifting, reduce
            the volume of other back-loading exercises that week.
          </p>
        </>
      ),
    },
    {
      heading: "Warming up for heavy deadlifts",
      body: (
        <>
          <p>
            A good deadlift warm-up starts with general movement such as walking, cycling or light
            hip hinges, then several progressively heavier sets of the deadlift itself. A typical
            progression might be the empty bar or a light weight for five reps, then sets at roughly
            40, 60, 75 and 85 percent of your working weight, with fewer reps as the weight rises.
            The warm-up set calculator builds this ramp automatically from your working weight.
          </p>
          <p>
            Warm-up sets are also a good time to rehearse your setup, breathing and bar path, so
            that heavy sets feel familiar.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlifts and conditioning",
      body: (
        <>
          <p>
            Very high-rep deadlifts, such as those used in some conditioning workouts, are a
            different challenge from heavy strength work. Fatigue changes technique, and the risk of
            the back rounding rises as reps accumulate. If you use deadlifts for conditioning, keep
            the weight moderate, use a trap bar or kettlebells where possible, and stop sets before
            form breaks down. Estimates from high-rep conditioning sets will not reflect your true
            one-rep max.
          </p>
        </>
      ),
    },
    {
      heading: "Long-term deadlift goals",
      body: (
        <>
          <p>
            Setting long-term goals around body-weight multiples can be motivating: for example,
            pulling 1.5 times body weight, then twice body weight. Breaking these into smaller
            steps, such as adding 5 to 10 kg to your estimated max each training block, makes them
            more achievable. Reviewing progress every few months and celebrating each milestone
            keeps training enjoyable over the years it takes to build a strong deadlift.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing the right formula for deadlifts",
      body: (
        <>
          <p>
            Because deadlift sets of more than five or six reps are often limited by grip, breathing
            and lower-back fatigue rather than the muscles that lift the bar, many coaches prefer
            the more conservative Brzycki estimate for the deadlift, or estimates from sets of one
            to five reps only. If your Epley estimate seems too high when you test it, switch to
            Brzycki or use lower-rep sets. Consistency matters more than which formula you choose;
            stick with one so trends over time are meaningful.
          </p>
          <p>
            If you find your tested deadlift max regularly beats both estimates, you may simply be
            stronger at low reps than average, which is common among lifters who train heavy singles
            and doubles frequently.
          </p>
        </>
      ),
    },
    {
      heading: "Deadlift equipment checklist",
      body: (
        <>
          <p>
            For deadlifts, flat, firm shoes or bare feet keep you close to the floor and stable.
            Chalk improves grip, and straps help on high-rep or back-off sets. A belt helps many
            lifters brace on heavy pulls. Long socks or leggings protect the shins from the bar.
            Bumper plates or a platform protect the floor if you train at home. Record what you used
            for each estimate so you compare like with like over time.
          </p>
        </>
      ),
    },
    {
      heading: "Filming your deadlift",
      body: (
        <>
          <p>
            Recording heavy sets from the side shows whether the bar stays over the middle of the
            foot, whether the back stays flat and whether the hips and shoulders rise together.
            Reviewing a few reps each week catches small technique changes before they become
            habits, and makes it easier to tell whether a heavier estimate reflects real strength or
            looser form. Keep the camera in the same spot each time so videos are easy to compare.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Plan your deadlift training from your estimate",
    whenToUse:
      "When you have a deadlift estimate and want a block that builds without beating you up.",
    pasteIn: "Your estimated deadlift max, your stance, and how often you can train it.",
    text: `My estimated deadlift one-rep max is [weight], pulling [conventional / sumo]. I can deadlift [times] a week.

1. Write a four-week deadlift plan with sets, reps and percentages.
2. Base it on a training max of 90% of my estimate.
3. Include one deadlift variation and two accessory exercises.
4. Explain how to manage fatigue if I also squat heavy.`,
  },
  forCoaches: {
    heading: "Using deadlift estimates with clients",
    body: (
      <>
        <p>
          Ask clients to log their top deadlift set each session or week. The estimated max gives
          you a running measure of strength without regular testing.
        </p>
        <p>
          Agree technique standards before you start tracking, so improvements reflect strength
          rather than changes in range of motion.
        </p>
        <p>
          Use the percentage table to set loads, then adjust by feel. If a client's deadlift feels
          heavy on a given day, reduce the load rather than forcing the planned number.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Program deadlift for every client",
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
      q: "How do I estimate my deadlift max?",
      a: "Use a hard set of 3 to 6 dead-stop reps and a formula such as Epley: weight × (1 + reps ÷ 30).",
    },
    {
      q: "Are touch-and-go reps okay for estimating?",
      a: "They tend to inflate estimates. Reset each rep on the floor for a reliable number.",
    },
    {
      q: "Is sumo or conventional stronger?",
      a: "It depends on your build. Many lifters are stronger in one; track them separately.",
    },
    {
      q: "What is a good deadlift for my body weight?",
      a: "About 2 × body weight is strong for men and about 1.5 × for women.",
    },
    {
      q: "How often should I deadlift heavy?",
      a: "Once a week for most lifters, with lighter variations on other days if desired.",
    },
    {
      q: "Why does my grip fail before my back?",
      a: "Grip strength often lags. Use a hook or mixed grip for heavy sets and train grip directly.",
    },
    {
      q: "Should I use straps?",
      a: "Straps are useful for back-off and high-rep sets. Test maxes are usually done without them.",
    },
    {
      q: "Is it safe to test a deadlift max?",
      a: "It can be with good technique and a proper warm-up, but estimating from sets is often safer.",
    },
    {
      q: "Why are my deadlift reps slower than my squat?",
      a: "The deadlift starts from a dead stop without a stretch reflex, so the first part is often the slowest.",
    },
    {
      q: "How quickly does the deadlift improve?",
      a: "Beginners often progress quickly; experienced lifters may add a few kilograms per cycle.",
    },
    {
      q: "Does a belt help the deadlift?",
      a: "Many lifters lift more with a belt. Track belted and unbelted numbers separately.",
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
