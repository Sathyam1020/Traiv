import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Cut Length Calculator: How Long Your Cut Will Take",
  description:
    "Free cut length calculator. Enter your weight, current and target body fat and weekly pace to see how many weeks your cut will take, how much fat to lose and when to take diet breaks.",
  eyebrow: "Free tool · Nutrition",
  h1: "Cut length calculator",
  intro: (
    <>
      <p>
        If you know roughly how lean you are now and how lean you want to be, you can work out how
        long it will take to get there. Enter your weight, current and target body fat, and a weekly
        pace, and this calculator estimates your end weight, how much fat you need to lose, how many
        weeks of dieting that takes, and how many diet breaks to plan along the way.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How long should a cut take?",
    answer: (
      <>
        <p>
          Work out the weight you would be at your target body fat if you kept all your lean mass:
          lean mass divided by (1 minus target body fat). The difference between that and your
          current weight is the fat to lose. At a pace of 0.5 to 1 percent of body weight a week,
          most people need 8 to 20 weeks.
        </p>
        <p>
          For example, an 84 kg person at 20 percent body fat has about 67 kg of lean mass. At 12
          percent body fat, they would weigh about 76 kg, so they need to lose around 8 kg of fat.
          At 0.75 percent of body weight a week, that takes about 13 weeks of dieting, plus one diet
          break.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator works",
      body: (
        <>
          <ol>
            <li>
              <strong>Lean mass:</strong> current weight × (1 − current body fat ÷ 100).
            </li>
            <li>
              <strong>End weight:</strong> lean mass ÷ (1 − target body fat ÷ 100), assuming you
              keep your lean mass.
            </li>
            <li>
              <strong>Fat to lose:</strong> current weight minus end weight.
            </li>
            <li>
              <strong>Weeks:</strong> at your chosen pace, weight falls by a fixed share each week,
              so the weekly loss gets smaller as you get lighter. The calculator accounts for that.
            </li>
            <li>
              <strong>Diet breaks:</strong> one two-week break at maintenance for every ten weeks of
              dieting.
            </li>
            <li>
              <strong>Total:</strong> dieting weeks plus break weeks.
            </li>
          </ol>
        </>
      ),
    },
    {
      heading: "Choosing a pace",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Pace</th>
                  <th scope="col">Per week</th>
                  <th scope="col">Who it suits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Relaxed</td>
                  <td>0.5% of body weight</td>
                  <td>Already lean; prioritising strength and muscle</td>
                </tr>
                <tr>
                  <td>Steady</td>
                  <td>0.75% of body weight</td>
                  <td>Most people; the recommended default</td>
                </tr>
                <tr>
                  <td>Faster</td>
                  <td>1% of body weight</td>
                  <td>More body fat to lose; shorter deadlines</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Research on lean athletes found that slower loss, around 0.7 percent of body weight a
            week, preserved strength and lean mass better than faster loss at about 1.4 percent. The
            leaner you are, the more a slower pace matters, because there is less fat available and
            the body is more inclined to use muscle for energy.
          </p>
        </>
      ),
    },
    {
      heading: "Estimating your body fat",
      body: (
        <>
          <p>
            The result is only as good as your body fat estimates, and most methods have significant
            error. Common options:
          </p>
          <ul>
            <li>
              <strong>DEXA scans:</strong> among the more accurate consumer options, but still with
              a margin of a few percent and some variation between machines.
            </li>
            <li>
              <strong>Skinfold calipers:</strong> reasonably consistent when done by the same
              experienced person, less so when self-measured.
            </li>
            <li>
              <strong>Bioelectrical impedance scales:</strong> convenient but strongly affected by
              hydration; best for trends, not absolute values.
            </li>
            <li>
              <strong>Tape measure formulas,</strong> such as the US Navy method: free and quick,
              often within a few percent for average builds.
            </li>
            <li>
              <strong>Visual comparison</strong> with reference photos: rough, but surprisingly
              useful when nothing else is available.
            </li>
          </ul>
          <p>
            Whichever you use, use the same method for both current and target estimates, and treat
            the result as a range rather than an exact figure. The target body fat in particular is
            best thought of as a look you are aiming for rather than a precise number.
          </p>
        </>
      ),
    },
    {
      heading: "Why the calculator assumes you keep lean mass",
      body: (
        <>
          <p>
            The end weight assumes all lost weight is fat. In practice, some lean mass is usually
            lost too, especially in long or aggressive diets and in people who are already lean.
            High protein intake, around 1.8 to 2.4 g per kg of body weight, continued heavy strength
            training and a moderate pace keep this loss small, but rarely zero. If you lose some
            lean mass, you will reach your target body fat at a slightly lower weight than the
            calculator shows.
          </p>
          <p>
            That is why many coaches use body fat targets and visual progress rather than a scale
            weight as the finish line for a cut.
          </p>
        </>
      ),
    },
    {
      heading: "How lean is too lean?",
      body: (
        <>
          <p>
            There is a minimum amount of fat the body needs for normal function, often called
            essential fat: around 3 to 5 percent for men and 10 to 13 percent for women. Below about
            8 percent for men and 16 percent for women, most people experience significant effects
            on hormones, energy, mood, sleep and performance, and these levels are usually held only
            briefly by physique competitors. The calculator warns you if your target falls below
            those levels.
          </p>
          <p>
            For most people, a target in the range of 10 to 15 percent for men and 18 to 25 percent
            for women is lean, healthy and sustainable, and many people look and feel their best
            within that range.
          </p>
        </>
      ),
    },
    {
      heading: "Cutting with diet breaks",
      body: (
        <>
          <p>
            The calculator adds a two-week maintenance break for every ten weeks of dieting. These
            breaks help manage hunger, restore training performance and may reduce some of the
            adaptation that slows fat loss over long diets. They add time to the cut but often make
            the whole process more sustainable. For shorter cuts under ten weeks, a break is usually
            not necessary.
          </p>
        </>
      ),
    },
    {
      heading: "After the cut",
      body: (
        <>
          <p>
            At the end of the cut, move to your new maintenance rather than straight back to your
            old intake. Your maintenance will be lower than before because you weigh less. Expect a
            small rise on the scale as food volume and stored carbohydrate return. Many people
            choose to increase calories gradually over a few weeks, which the reverse diet
            calculator can help plan. Holding your new body composition for a while before starting
            a muscle-building phase helps you see what you achieved and makes the next phase easier
            to judge.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A woman weighs 68 kg at about 28 percent body fat and wants to reach about 22 percent at
            a steady pace of 0.75 percent of body weight a week.
          </p>
          <ol>
            <li>Lean mass: 68 × 0.72 = about 49 kg.</li>
            <li>End weight at 22 percent: 49 ÷ 0.78 = about 62.8 kg.</li>
            <li>Fat to lose: about 5.2 kg.</li>
            <li>First week's loss: 68 × 0.0075 = about 0.5 kg.</li>
            <li>
              Weeks of dieting: about 10 to 11, as the weekly loss shrinks slightly with her weight.
            </li>
            <li>Diet breaks: one, adding two weeks, for a total of about 12 to 13 weeks.</li>
          </ol>
          <p>
            If she chose the relaxed pace instead, the same cut would take about 16 weeks of dieting
            plus a break, but she would likely keep more strength and find it easier to sustain.
          </p>
        </>
      ),
    },
    {
      heading: "Cutting for a competition or photoshoot",
      body: (
        <>
          <p>
            Physique competitors and people preparing for photoshoots often cut to much lower body
            fat than they would maintain day to day. Contest preparation commonly lasts 16 to 24
            weeks or longer, starting from a reasonably lean position and progressing slowly so that
            muscle is preserved. Coaches often recommend aiming to be at stage condition a few weeks
            early, allowing time for fine-tuning rather than a last-minute rush.
          </p>
          <p>
            These very lean states are temporary by design. Planning the period after the event,
            with a structured return to maintenance and a more comfortable body fat level, is as
            important as the cut itself for long-term health and wellbeing.
          </p>
        </>
      ),
    },
    {
      heading: "Training during a cut",
      body: (
        <>
          <p>
            Training is what tells the body to keep muscle while you lose fat. During a cut, the
            most important principle is to keep lifting heavy relative to your strength. You may
            need to reduce total volume a little as recovery becomes harder, but maintaining
            intensity, the weight on the bar, is key. Many lifters find their strength holds well
            for most of a cut and only declines in the final, leanest stages.
          </p>
          <p>
            Cardio can be added to increase the deficit, but too much, especially high-intensity
            work, can interfere with recovery from lifting. Daily walking is often the most
            practical addition: it burns meaningful calories without much fatigue.
          </p>
        </>
      ),
    },
    {
      heading: "Signs your cut is too aggressive",
      body: (
        <>
          <ul>
            <li>
              <strong>Strength drops quickly</strong> across several lifts, not just in one bad
              session.
            </li>
            <li>
              <strong>Sleep gets worse,</strong> with difficulty falling asleep or frequent waking.
            </li>
            <li>
              <strong>Persistent fatigue and low mood</strong> affect work and daily life.
            </li>
            <li>
              <strong>Hunger becomes overwhelming,</strong> leading to binges that undo progress.
            </li>
            <li>
              <strong>For women, periods become irregular or stop.</strong>
            </li>
            <li>
              <strong>You are losing more than 1 percent of body weight a week</strong> consistently
              after the first fortnight.
            </li>
          </ul>
          <p>
            If several of these appear, slowing the pace, adding a diet break or increasing calories
            toward maintenance for a while is usually the right response. A slightly longer cut is
            far better than one that has to be abandoned.
          </p>
        </>
      ),
    },
    {
      heading: "Body fat versus scale weight during a cut",
      body: (
        <>
          <p>
            During a cut, the scale and your body fat do not always move together. Water retention,
            changes in stored carbohydrate and food in the gut can make scale weight fluctuate by a
            kilogram or more from day to day, while body fat falls steadily underneath. Measurements
            and photos often show progress before the scale does, especially in the later stages of
            a cut when weekly changes are small.
          </p>
          <p>
            That is one reason to set the end point of a cut by appearance and measurements as well
            as body fat estimates. When your waist measurement, photos and the way clothes fit all
            show the result you were aiming for, the cut has done its job, even if the scale shows a
            slightly different number than the calculator predicted.
          </p>
        </>
      ),
    },
    {
      heading: "Protein and food choices during a cut",
      body: (
        <>
          <p>
            High protein is the single most important dietary factor for keeping muscle while
            cutting. Most guidance for people who train suggests around 1.8 to 2.4 g per kg of body
            weight, with leaner people toward the top of that range. Choosing filling, lower-calorie
            foods helps manage hunger: lean meats and fish, eggs, Greek yoghurt, vegetables, fruit,
            potatoes and wholegrains all give plenty of volume for their calories. Liquid calories
            and highly processed snacks are the easiest places to save calories without feeling
            deprived.
          </p>
        </>
      ),
    },
    {
      heading: "How lean you start changes the cut",
      body: (
        <>
          <p>
            The leaner you are when you start, the slower a cut should go and the more carefully it
            needs to be managed. Someone starting at 25 percent body fat has plenty of stored
            energy, and the body is less inclined to break down muscle. Someone starting at 14
            percent has far less, and muscle loss becomes more likely as the cut progresses. That is
            why the relaxed pace is usually recommended for people who are already lean, and why the
            final few percentage points of a cut tend to take much longer than the first.
          </p>
          <p>
            If you are starting from a higher body fat, the faster pace is often fine for the early
            part of the cut. Many coaches start a little faster and slow the pace as their client
            gets leaner, which combines quick early progress with careful protection of muscle later
            on.
          </p>
        </>
      ),
    },
    {
      heading: "Estimating body fat without equipment",
      body: (
        <>
          <p>
            If you do not have access to a scan or calipers, you can still estimate body fat
            reasonably well. Tape measure methods, such as the US Navy formula, use neck, waist and,
            for women, hip measurements together with height. They are free, quick and repeatable,
            and they track changes well over time even if the absolute number is a few percentage
            points off. Comparing your appearance with reference photos at known body fat levels is
            another rough but useful guide. Whichever method you use, measure under the same
            conditions each time, ideally first thing in the morning, so changes reflect real
            progress rather than daily variation.
          </p>
        </>
      ),
    },
    {
      heading: "Planning the cut backwards from a date",
      body: (
        <>
          <p>
            If you have an event date, work backwards. Enter your numbers, note how many weeks the
            cut needs, and count back from the event, adding two or three extra weeks as a buffer
            for slower progress, holidays or illness. If the start date has already passed, either
            choose a less lean target or accept a faster pace with the trade-offs it brings.
            Starting earlier is almost always better than dieting harder.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using cut length with clients",
    body: (
      <>
        <p>
          Use the result to set expectations at the start. Clients often expect a cut to take a few
          weeks; seeing that their goal realistically needs four months, including breaks, helps
          them commit to a sustainable pace instead of crash dieting.
        </p>
        <p>
          Be cautious with body fat numbers. Encourage clients to treat targets as approximate, and
          to use progress photos and measurements to judge when the cut is done.
        </p>
        <p>
          Watch for very lean targets. If a client wants to go below 10 percent for men or 18
          percent for women, discuss why, how long they plan to stay there and the trade-offs
          involved.
        </p>
      </>
    ),
  },
  pitch: {
    key: "check-ins",
    heading: "Track cuts with weight, measurements and photos",
    body: (
      <>
        <p>
          In Traiv, weekly check-ins collect each client's weight, measurements and progress photos
          alongside their diet plan and food log, so you can judge a cut by more than the scale.
        </p>
      </>
    ),
  },
  next: [
    { label: "Turn this into a daily calorie target", href: "/tools/calorie-deficit-calculator" },
    { label: "Estimate body fat from measurements", href: "/tools/body-fat-calculator" },
  ],
  nextPitch:
    "Running cuts with clients? Traiv tracks weight, photos and measurements at every check-in.",
  faq: [
    {
      q: "How long should a cut last?",
      a: "Most cuts take 8 to 20 weeks, depending on how much fat there is to lose and the pace. Longer cuts benefit from diet breaks.",
    },
    {
      q: "How fast should I lose weight on a cut?",
      a: "About 0.5 to 1 percent of body weight a week. Leaner people should aim for the lower end to protect muscle.",
    },
    {
      q: "How do I know my body fat percentage?",
      a: "DEXA, calipers, tape-measure formulas and smart scales all give estimates with some error. Use the same method each time and treat results as approximate.",
    },
    {
      q: "Will I lose muscle during a cut?",
      a: "Some lean mass loss is common, but high protein, continued strength training and a moderate pace keep it small.",
    },
    {
      q: "Do I need diet breaks?",
      a: "They are optional but helpful for cuts longer than about ten weeks, improving adherence and training.",
    },
    {
      q: "What body fat should I aim for?",
      a: "For most people, 10 to 15 percent for men and 18 to 25 percent for women is lean and sustainable. Lower levels are hard to maintain.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. If you are pregnant,
        breastfeeding, under 18, managing a medical condition or have a history of disordered
        eating, talk to a doctor or registered dietitian before changing what you eat.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "Weight loss phase calculator", href: "/tools/weight-loss-phase-calculator" },
    { label: "Protein calculator", href: "/tools/protein-calculator" },
    { label: "How check-ins work in Traiv", href: "/features/check-ins" },
  ],
  close: {
    heading: "Cuts with a plan, a timeline and the progress to prove it",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
