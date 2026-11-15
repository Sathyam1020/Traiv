import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Body recomposition calculator",
  description:
    "Set calories, protein and a timeline for losing fat while keeping or building muscle, from your weight, body fat, target body fat and activity.",
  eyebrow: "Free tool · Body composition",
  h1: "Body recomposition calculator",
  intro: (
    <>
      <p>
        Enter your weight, current and target body fat and activity level to get a daily calorie
        target, a protein target based on lean mass, your weight at the target body fat and a rough
        timeline.
      </p>
    </>
  ),
  sources: [
    {
      label:
        "Barakat C et al. Body recomposition: can trained individuals build muscle and lose fat at the same time? (Strength and Conditioning Journal, 2020)",
      href: "https://journals.lww.com/nsca-scj/fulltext/2020/10000/body_recomposition__can_trained_individuals_build.3.aspx",
    },
    {
      label:
        "Morton RW et al. Protein supplementation and resistance training: a systematic review and meta-analysis (British Journal of Sports Medicine, 2018)",
      href: "https://bjsm.bmj.com/content/52/6/376",
    },
    {
      label:
        "McArdle WD, Katch FI, Katch VL. Exercise Physiology: Nutrition, Energy, and Human Performance (Katch-McArdle equation)",
      href: "https://shop.lww.com/Exercise-Physiology/p/9781975217297",
    },
  ],
  shortAnswer: {
    question: "How do I calculate calories for body recomposition?",
    answer: (
      <>
        <p>
          Estimate maintenance from lean mass, then eat about 10% below it. At 180 lb and 22% body
          fat, lean mass is 140.4 lb (63.7 kg). Katch-McArdle gives a BMR of 370 + 21.6 × 63.7 ≈
          1,746 kcal, and moderate activity (× 1.55) gives maintenance of about 2,706 kcal. A 10%
          deficit is about 2,435 kcal.
        </p>
        <p>
          Protein at 2.2 g per kg of lean mass is about 140 g. Reaching 15% body fat with lean mass
          held would mean about 165 lb, roughly 15 lb of fat to lose over around 18 weeks.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What body recomposition means",
      body: (
        <>
          <p>
            Body recomposition means changing what your body is made of: losing fat and keeping or
            gaining muscle at the same time. Weight may change only a little, or not at all, while
            waist measurements drop, strength rises and the mirror shows a leaner, more muscular
            shape.
          </p>
          <p>
            The traditional approach separates the two goals into phases: a bulk to gain muscle,
            then a cut to lose fat. Recomposition tries to do both together, with a small deficit,
            high protein and hard resistance training. It is slower than a dedicated cut for fat
            loss and slower than a bulk for muscle gain, but it avoids the fat gain of a bulk and
            the muscle loss risk of an aggressive cut.
          </p>
        </>
      ),
    },
    {
      heading: "Who recomposition works for",
      body: (
        <>
          <p>Research suggests recomposition works best for certain groups:</p>
          <ul>
            <li>
              <strong>Beginners.</strong> New lifters respond strongly to training and can build
              muscle even in a slight deficit.
            </li>
            <li>
              <strong>People returning after a break.</strong> Muscle regained after time off comes
              back faster than it was first built.
            </li>
            <li>
              <strong>People with higher body fat.</strong> More stored energy is available to
              support muscle growth during a deficit.
            </li>
            <li>
              <strong>People who have been under-eating protein or under-training.</strong> Fixing
              those alone can drive recomposition.
            </li>
          </ul>
          <p>
            For lean, experienced lifters, recomposition is much slower and harder to see. They
            usually do better with separate phases of muscle gain and fat loss. A 2020 review by
            Barakat and colleagues found that trained people can recompose, but the effect is modest
            and depends on high protein and well-structured training.
          </p>
        </>
      ),
    },
    {
      heading: "How the calculator works",
      body: (
        <>
          <p>
            The calculator starts from lean body mass: weight multiplied by (1 − body fat). It
            estimates resting metabolism with the Katch-McArdle equation, 370 + 21.6 × lean mass in
            kg, then multiplies by an activity factor to estimate maintenance calories.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Activity level</th>
                  <th scope="col">Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sedentary: desk job, little exercise</td>
                  <td>1.2</td>
                </tr>
                <tr>
                  <td>Lightly active: 1 to 3 workouts a week</td>
                  <td>1.375</td>
                </tr>
                <tr>
                  <td>Moderately active: 3 to 5 workouts a week</td>
                  <td>1.55</td>
                </tr>
                <tr>
                  <td>Very active: 6 or 7 workouts a week</td>
                  <td>1.725</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            It sets calories at about 10% below maintenance, a small enough deficit to support
            training and muscle while still losing fat. Protein is set at 2.2 g per kg of lean mass.
            The target weight is lean mass divided by (1 − target body fat), assuming lean mass
            stays the same. The timeline assumes fat falls at about 0.5% of body weight a week.
          </p>
        </>
      ),
    },
    {
      heading: "Working through an example",
      body: (
        <>
          <p>
            Take someone at 180 lb (81.6 kg) and 22% body fat who wants to reach 15% and trains
            three to five times a week. Lean mass is 81.6 × 0.78 = 63.7 kg, or 140.4 lb.
          </p>
          <p>
            Katch-McArdle gives 370 + 21.6 × 63.7 ≈ 1,746 kcal at rest. Multiplying by 1.55 for
            moderate activity gives maintenance of about 2,706 kcal. Eating 10% below that gives
            about 2,435 kcal a day. Protein at 2.2 g per kg of lean mass is about 140 g a day.
          </p>
          <p>
            At 15% body fat with the same lean mass, weight would be 63.7 ÷ 0.85 = 74.9 kg, or about
            165 lb. That is about 15 lb of fat to lose. At 0.5% of body weight a week, that takes
            around 18 weeks. In practice, if muscle is gained along the way, the end weight will be
            a little higher and the body fat target reached at a heavier weight.
          </p>
        </>
      ),
    },
    {
      heading: "Training for recomposition",
      body: (
        <>
          <p>
            Training is the signal that tells the body to keep and build muscle while in a deficit.
            Without it, a calorie deficit leads to a mix of fat and muscle loss. With it, the body
            has a reason to hold on to muscle and even add some.
          </p>
          <ul>
            <li>
              <strong>Lift three to five times a week</strong>, covering each muscle group at least
              twice.
            </li>
            <li>
              <strong>Focus on compound lifts</strong> such as squats, presses, rows and hinges,
              with accessory work for weaker areas.
            </li>
            <li>
              <strong>Progress over time</strong> by adding weight or reps, keeping most sets one to
              three reps short of failure.
            </li>
            <li>
              <strong>Keep cardio moderate.</strong> Walking and some conditioning help with fat
              loss and health, but too much hard cardio can interfere with recovery.
            </li>
          </ul>
          <p>
            Track your lifts. If strength is rising or holding while body fat falls, recomposition
            is working.
          </p>
        </>
      ),
    },
    {
      heading: "Why protein is set so high",
      body: (
        <>
          <p>
            Protein provides the building blocks for muscle and helps protect it during a deficit.
            Studies on people losing weight while training find that higher protein intakes, around
            2.0 to 2.4 g per kg of lean mass, help preserve muscle. Protein also keeps you fuller,
            which makes a deficit easier to sustain.
          </p>
          <p>
            Setting protein by lean mass rather than total weight avoids overshooting for people
            with higher body fat. Split it across three to five meals, with 25 to 40 g in each, for
            the best muscle-building response. Lean meat, fish, eggs, dairy, legumes and soy all
            help reach the target.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking recomposition",
      body: (
        <>
          <p>
            Because weight may barely move, the scale alone is a poor guide. Track several markers
            instead:
          </p>
          <ol>
            <li>
              <strong>Waist circumference</strong> every two to four weeks, measured the same way.
            </li>
            <li>
              <strong>Body fat estimate</strong> every four weeks, with the same method.
            </li>
            <li>
              <strong>Strength</strong> in the main lifts, from your training log.
            </li>
            <li>
              <strong>Progress photos</strong> monthly, in the same light and pose.
            </li>
            <li>
              <strong>Weekly average weight</strong>, to make sure intake is close to target.
            </li>
          </ol>
          <p>
            If the waist falls and strength holds or rises over two to three months, the plan is
            working even if the scale has hardly changed.
          </p>
        </>
      ),
    },
    {
      heading: "Recomposition versus cutting and bulking",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Approach</th>
                  <th scope="col">Calories</th>
                  <th scope="col">Best for</th>
                  <th scope="col">Trade-off</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Recomposition</td>
                  <td>About 10% below maintenance</td>
                  <td>Beginners, returners, higher body fat</td>
                  <td>Slower change in each direction</td>
                </tr>
                <tr>
                  <td>Cut</td>
                  <td>15 to 25% below maintenance</td>
                  <td>Fat loss with a clear deadline</td>
                  <td>Muscle gain unlikely; some loss possible</td>
                </tr>
                <tr>
                  <td>Bulk</td>
                  <td>5 to 15% above maintenance</td>
                  <td>Lean, experienced lifters building muscle</td>
                  <td>Some fat gain</td>
                </tr>
                <tr>
                  <td>Maintenance</td>
                  <td>At maintenance</td>
                  <td>Holding results, building habits</td>
                  <td>Slow change</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Many people move between these over a year. A recomposition phase can lead into a short
            cut for an event, followed by a period at maintenance or a lean bulk. The right choice
            depends on body fat, training experience and goals.
          </p>
        </>
      ),
    },
    {
      heading: "When recomposition stalls",
      body: (
        <>
          <p>
            Recomposition progress slows as body fat falls and training experience grows. If waist
            measurements, strength and photos have not changed for six to eight weeks, check the
            basics: Is protein consistently on target? Is training progressing? Is sleep adequate?
            Is the calorie target being hit?
          </p>
          <p>
            If those are all in place, it may be time to switch approach. A dedicated cut of eight
            to twelve weeks can speed up fat loss, followed by a period at maintenance or a small
            surplus to focus on muscle. Alternating phases often works better than a long
            recomposition for intermediate and advanced lifters.
          </p>
        </>
      ),
    },
    {
      heading: "Body fat estimates and recomposition",
      body: (
        <>
          <p>
            The calculator relies on body fat to estimate lean mass, maintenance and targets. An
            error of a few percentage points changes lean mass by a couple of kilograms and
            maintenance by about 50 to 100 kcal a day. That is a small error, but worth knowing
            about.
          </p>
          <p>
            Use the best body fat estimate you have and update it every four to eight weeks with the
            same method. As body fat changes, recalculate calories, protein and the target weight,
            so the plan stays matched to your body.
          </p>
        </>
      ),
    },
    {
      heading: "Adjusting calories over time",
      body: (
        <>
          <p>
            The calorie target is an estimate. Track your weekly average weight for two to three
            weeks. In recomposition, weight should fall slowly, by about 0.25 to 0.5% a week, or
            stay stable while the waist shrinks. If weight is falling faster than 0.5% a week, eat a
            little more. If it is rising and the waist is not shrinking, eat a little less.
          </p>
          <p>
            Adjust by about 100 to 150 kcal at a time and give each change two weeks before judging
            it. Small, steady changes are easier to sustain and reduce the risk of overcorrecting.
          </p>
        </>
      ),
    },
    {
      heading: "A sample day of eating",
      body: (
        <>
          <p>
            Here is how 2,435 kcal and 140 g of protein might look across a day. Portions vary with
            food choices; the aim is to show how protein is spread out.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Meal</th>
                  <th scope="col">Example</th>
                  <th scope="col">Protein</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Breakfast</td>
                  <td>Eggs, toast and fruit</td>
                  <td>About 30 g</td>
                </tr>
                <tr>
                  <td>Lunch</td>
                  <td>Chicken, rice and vegetables</td>
                  <td>About 40 g</td>
                </tr>
                <tr>
                  <td>Snack</td>
                  <td>Greek yoghurt with nuts</td>
                  <td>About 20 g</td>
                </tr>
                <tr>
                  <td>Dinner</td>
                  <td>Fish or tofu, potatoes and salad</td>
                  <td>About 40 g</td>
                </tr>
                <tr>
                  <td>Evening</td>
                  <td>Milk or a protein shake</td>
                  <td>About 10 to 20 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Any eating pattern that hits the calorie and protein targets and fits your preferences
            can work. Consistency over weeks matters more than meal timing.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: running a recomposition with clients",
      body: (
        <>
          <p>
            Set clear expectations at the start: recomposition is slow, the scale may barely move,
            and progress will show in measurements, strength and photos. Agree on the markers you
            will track and how often, so the client knows what to look for.
          </p>
          <p>
            Review the training log each week to make sure lifts are progressing. Check protein
            intake regularly, since it is the most commonly missed target. At each check-in, look at
            the waist, body fat and strength trends together. Celebrate rising strength and a
            shrinking waist, even when weight stays flat.
          </p>
        </>
      ),
    },
    {
      heading: "Common recomposition mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Too large a deficit.</strong> A deep cut makes muscle gain unlikely. Keep it
              to around 10%.
            </li>
            <li>
              <strong>Too little protein.</strong> Recomposition depends on high protein; missing
              the target most days stalls progress.
            </li>
            <li>
              <strong>Training without progression.</strong> Doing the same weights and reps for
              months gives the body no reason to build muscle.
            </li>
            <li>
              <strong>Judging by the scale alone.</strong> Weight may barely move. Track waist,
              strength and photos too.
            </li>
            <li>
              <strong>Too much hard cardio.</strong> It can blunt recovery and strength gains; keep
              most cardio easy.
            </li>
            <li>
              <strong>Expecting fast results.</strong> Recomposition takes months, not weeks.
            </li>
          </ul>
          <p>
            Avoiding these is often the difference between a recomposition that works and one that
            stalls after a few weeks.
          </p>
        </>
      ),
    },
    {
      heading: "Recomposition for women",
      body: (
        <>
          <p>
            Women can recompose just as effectively as men, with the same principles of a small
            deficit, high protein and progressive resistance training. Absolute muscle gains are
            usually smaller, but relative changes in strength and shape are often similar.
          </p>
          <p>
            Water retention across the menstrual cycle can mask changes on the scale and in waist
            measurements for a week or more. Comparing measurements from the same point in the cycle
            gives a clearer view. Women in perimenopause or after the menopause may find
            recomposition slower and benefit especially from resistance training to protect muscle
            and bone.
          </p>
        </>
      ),
    },
    {
      heading: "What a realistic result looks like",
      body: (
        <>
          <p>
            Over three to six months of consistent recomposition, a beginner might lose 3 to 6 kg of
            fat and gain 2 to 4 kg of muscle, with weight dropping only a few kilograms overall.
            Waist size might fall by 4 to 8 cm and strength in the main lifts could rise
            substantially.
          </p>
          <p>
            Experienced lifters will see smaller changes, perhaps 2 to 3 kg of fat lost and a
            kilogram or less of muscle gained over the same period. These are still meaningful
            changes, especially when measured against the risk of losing muscle in a deeper cut.
          </p>
        </>
      ),
    },
    {
      heading: "Sleep and recovery",
      body: (
        <>
          <p>
            Recomposition asks a lot of the body: building muscle while in a deficit. Sleep is when
            much of that repair happens. Research on people dieting with short sleep found they lost
            more muscle and less fat than those sleeping a full night. Aim for seven to nine hours,
            a regular schedule and a dark, cool bedroom.
          </p>
          <p>
            Recovery also means managing training stress. Plan easier weeks every four to eight
            weeks, avoid adding extra hard sessions on top of the plan, and watch for signs of
            under-recovery, such as falling strength, poor sleep or persistent soreness.
          </p>
        </>
      ),
    },
    {
      heading: "Is recomposition right for you?",
      body: (
        <>
          <p>
            Recomposition suits you if you are new to lifting or returning after a break, carry
            moderate to higher body fat, and prefer a steady approach over separate bulk and cut
            phases. If you are already lean and have trained consistently for years, a dedicated
            phase toward one goal at a time will usually get you there faster. A coach can help you
            decide, based on your history, body fat and timeline.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use your result with ChatGPT",
    whenToUse: "After calculating your targets and checking your body fat estimate.",
    pasteIn: "Paste your inputs, targets and current training.",
    text: `I am planning a body recomposition. Weight: [weight]. Body fat: [current] with a target of [target]. Activity: [activity]. The calculator suggests [calories] kcal a day, [protein] g of protein and a target weight of [target weight] over about [weeks] weeks. I currently train [training] and eat [eating pattern]. Help me turn this into a weekly plan: a sample day of eating that hits the protein target, a training split that suits my schedule, and how to track progress beyond the scale. List three questions to ask my coach before I start.`,
  },
  forCoaches: {
    heading: "Use the result with your clients",
    body: (
      <>
        <p>
          A single body measurement tells you where a client is today. A series of them, taken the
          same way, tells you which direction they are moving. Agree on a measuring routine at the
          first check-in: same time of day, same tape or scale, same landmarks. Then repeat it every
          two to four weeks rather than every few days, so normal day-to-day swings in water and
          food volume don't crowd out the real trend.
        </p>
        <p>
          Talk about the number with care. Many clients carry years of history with the scale and
          with words like overweight. Explain what the measure can and cannot see, pair it with
          something the client can feel, such as energy, strength or how clothes fit, and keep the
          conversation on the next useful action rather than the label.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set calories and protein, then see what happens",
    body: (
      <>
        <p>
          In Traiv you write each client's diet plan with calorie and protein targets, build their
          training, and review their check-in measurements beside both, so recomposition progress is
          visible.
        </p>
      </>
    ),
  },
  next: [
    { label: "Lean body mass calculator", href: "/tools/lean-body-mass-calculator" },
    { label: "Protein calculator", href: "/tools/protein-calculator" },
    { label: "Body fat calculator", href: "/tools/body-fat-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "Is body recomposition possible?",
      a: "Yes, especially for beginners, people returning to training and those with higher body fat. It is slower and harder for lean, experienced lifters.",
    },
    {
      q: "How many calories should I eat for recomposition?",
      a: "A small deficit, about 10% below maintenance, is typical. The calculator estimates maintenance from lean mass and activity.",
    },
    {
      q: "How much protein do I need for recomposition?",
      a: "About 2.0 to 2.4 g per kg of lean mass a day. The calculator uses 2.2 g per kg.",
    },
    {
      q: "How long does body recomposition take?",
      a: "Months rather than weeks. The calculator gives a rough timeline assuming fat falls by about 0.5% of body weight a week.",
    },
    {
      q: "Why isn't the scale moving?",
      a: "During recomposition, muscle gain can offset fat loss. Track waist, strength and photos alongside weight.",
    },
    {
      q: "Should I bulk and cut instead?",
      a: "If you are lean and experienced, separate phases usually work better. If you are newer to training or have more body fat to lose, recomposition is a good option.",
    },
  ],
  keepGoing: [
    { label: "Diet plans in Traiv", href: "/features/nutrition" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Track every client's progress under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
