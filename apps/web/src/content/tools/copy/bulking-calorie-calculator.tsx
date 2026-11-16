import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Bulking Calorie Calculator: Surplus, Macros and Weekly Gain",
  description:
    "Bulking calculator. Enter maintenance calories and body weight, choose a lean, moderate or aggressive bulk, and get daily calories, macros and weekly gain.",
  eyebrow: "Free tool · Nutrition",
  h1: "Bulking calorie calculator",
  intro: (
    <p>
      A bulk is a planned period of eating above maintenance to build muscle. If you already know
      your maintenance calories, this calculator turns them into a bulking target: a surplus sized
      as a percentage of maintenance, protein, fat and carbohydrate in grams, and the most weight
      you could expect to add each week.
    </p>
  ),
  shortAnswer: {
    question: "How many calories should I eat to bulk?",
    answer: (
      <>
        <p>
          Eat about 10 to 15 percent above maintenance. At a maintenance of 2,500 kcal, a moderate
          bulk is about 2,875 kcal a day. Set protein at around 2 g per kg of body weight, keep fat
          near a quarter of calories and give the rest to carbohydrate.
        </p>
        <p>
          Aim to gain about 0.25 to 0.5 percent of body weight a week. If the scale climbs faster
          than that for more than a month, the extra is mostly fat; trim the surplus.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the numbers are worked out",
      body: (
        <>
          <ol>
            <li>
              <strong>Surplus:</strong> maintenance × 10, 15 or 20 percent, depending on the pace
              you choose.
            </li>
            <li>
              <strong>Total:</strong> maintenance plus the surplus.
            </li>
            <li>
              <strong>Protein:</strong> 2.0 g per kg of body weight (about 0.9 g per lb).
            </li>
            <li>
              <strong>Fat:</strong> 25 percent of total calories.
            </li>
            <li>
              <strong>Carbohydrate:</strong> whatever calories remain, divided by 4.
            </li>
            <li>
              <strong>Weekly gain, at most:</strong> surplus × 7 ÷ 7,700 kcal per kg. Real gain is
              usually lower.
            </li>
          </ol>
          <p>
            For maintenance of 2,500 kcal and 170 lb (77 kg) on a moderate bulk: surplus 375, total
            2,875 kcal, protein 154 g, fat 80 g, carbohydrate 385 g, and at most about 0.34 kg (0.75
            lb) a week.
          </p>
        </>
      ),
    },
    {
      heading: "Lean, moderate or aggressive?",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Pace</th>
                  <th scope="col">Surplus</th>
                  <th scope="col">Suits</th>
                  <th scope="col">Trade-off</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lean</td>
                  <td>+10%</td>
                  <td>Two or more years of training; anyone who dislikes cutting</td>
                  <td>Slow scale progress; needs patience</td>
                </tr>
                <tr>
                  <td>Moderate</td>
                  <td>+15%</td>
                  <td>Most people in their first one to three years</td>
                  <td>Some fat gain, usually manageable</td>
                </tr>
                <tr>
                  <td>Aggressive</td>
                  <td>+20%</td>
                  <td>Very lean beginners; very high activity; hard gainers</td>
                  <td>More fat gain and a longer cut later</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A 2019 study comparing a slower and a faster gain in trained athletes found similar
            muscle gain but more fat gain in the faster group. Beyond a modest surplus, the body
            cannot build muscle any quicker; it just stores more.
          </p>
        </>
      ),
    },
    {
      heading: "Clean bulk versus dirty bulk",
      body: (
        <>
          <p>
            A dirty bulk means eating as much as possible, from any food. It works in the narrow
            sense that weight goes up, but much of it is fat, and the fat has to come off again
            later. A clean bulk is a controlled surplus from mostly whole foods.
          </p>
          <p>
            There is no need to be strict. A diet built around protein, carbohydrate from grains,
            potatoes and fruit, plenty of vegetables, and some calorie-dense extras (nuts, oils,
            dairy, the occasional dessert) hits the numbers without making eating a chore. The
            surplus size matters more than any single food.
          </p>
        </>
      ),
    },
    {
      heading: "Bulking for beginners and for experienced lifters",
      body: (
        <>
          <p>
            <strong>Beginners</strong> can build muscle quickly almost regardless of diet, as long
            as protein is high and training is consistent. Many beginners, especially those with
            some body fat, do well at maintenance or a small surplus and do not need a formal bulk
            at all.
          </p>
          <p>
            <strong>Intermediate lifters</strong> (two to four years of consistent training) usually
            benefit most from a deliberate, moderate bulk, because progress at maintenance slows
            down.
          </p>
          <p>
            <strong>Advanced lifters</strong> gain muscle slowly, so a lean bulk with a small
            surplus and a long time horizon is the norm. A surplus that adds weight faster than
            about 0.25 percent a week will mostly be fat.
          </p>
        </>
      ),
    },
    {
      heading: "How long to bulk, and when to stop",
      body: (
        <>
          <p>
            There is no fixed length, but these signals help decide when a bulk has done its job:
          </p>
          <ul>
            <li>
              <strong>Body fat has risen</strong> to a level you are no longer comfortable with.
              Many lifters use about 15 to 20 percent for men and 25 to 30 percent for women as an
              upper limit.
            </li>
            <li>
              <strong>Strength progress has stalled</strong> for several weeks despite good training
              and sleep.
            </li>
            <li>
              <strong>The planned block is over:</strong> three to six months is a common length
              before a period at maintenance.
            </li>
          </ul>
          <p>
            After a bulk, a few weeks at maintenance lets the body settle before any cut, and makes
            it easier to see how much of the gain was real tissue.
          </p>
        </>
      ),
    },
    {
      heading: "Common bulking mistakes",
      body: (
        <ul>
          <li>
            <strong>Guessing maintenance.</strong> Find it with a calculator and confirm it with two
            weeks of weigh-ins before adding a surplus.
          </li>
          <li>
            <strong>Judging by daily weight.</strong> Use weekly averages and look at the monthly
            trend.
          </li>
          <li>
            <strong>Not adjusting as weight goes up.</strong> A heavier body burns more; a surplus
            that worked at 70 kg may be close to maintenance at 76 kg.
          </li>
          <li>
            <strong>Neglecting training.</strong> A surplus without progressive overload is just
            weight gain.
          </li>
          <li>
            <strong>Bulking forever.</strong> Set an end point before you start.
          </li>
        </ul>
      ),
    },
    {
      heading: "Bulking targets at different maintenance levels",
      body: (
        <>
          <p>
            The percentage approach scales the surplus with your size: a larger, more active person
            gets a larger surplus in absolute terms. Daily totals for each pace:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Maintenance</th>
                  <th scope="col">Lean (+10%)</th>
                  <th scope="col">Moderate (+15%)</th>
                  <th scope="col">Aggressive (+20%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2,000 kcal</td>
                  <td>2,200</td>
                  <td>2,300</td>
                  <td>2,400</td>
                </tr>
                <tr>
                  <td>2,500 kcal</td>
                  <td>2,750</td>
                  <td>2,875</td>
                  <td>3,000</td>
                </tr>
                <tr>
                  <td>3,000 kcal</td>
                  <td>3,300</td>
                  <td>3,450</td>
                  <td>3,600</td>
                </tr>
                <tr>
                  <td>3,500 kcal</td>
                  <td>3,850</td>
                  <td>4,025</td>
                  <td>4,200</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            At the low end, a moderate bulk is a modest 300 kcal. At the high end it is over 500
            kcal, which suits a large, active lifter but would be too much for a small one. If your
            maintenance is under about 2,200 kcal, the lean pace is usually the better choice.
          </p>
        </>
      ),
    },
    {
      heading: "A day of eating on a moderate bulk",
      body: (
        <>
          <p>
            For the default numbers on this page (2,875 kcal, about 154 g protein, 80 g fat, 385 g
            carbohydrate), a day built from everyday foods might look like this:
          </p>
          <ul>
            <li>
              <strong>Breakfast:</strong> 80 g oats cooked in milk with a banana and a scoop of
              whey. About 650 kcal, 45 g protein.
            </li>
            <li>
              <strong>Lunch:</strong> chicken, a large portion of rice and vegetables with a spoon
              of olive oil. About 750 kcal, 45 g protein.
            </li>
            <li>
              <strong>Pre-training:</strong> a bagel with peanut butter and an apple. About 450
              kcal, 12 g protein.
            </li>
            <li>
              <strong>Dinner:</strong> salmon, potatoes and a side salad. About 700 kcal, 40 g
              protein.
            </li>
            <li>
              <strong>Evening:</strong> Greek yoghurt with berries and honey. About 300 kcal, 18 g
              protein.
            </li>
          </ul>
          <p>
            Exact amounts depend on brands and portions, but the shape is the point: protein at
            every meal, plenty of carbohydrate around training, and fats measured rather than
            guessed.
          </p>
        </>
      ),
    },
    {
      heading: "Training that makes a bulk worth it",
      body: (
        <>
          <p>
            The surplus provides the raw material. The training decides whether it becomes muscle.
            The basics that matter most during a bulk:
          </p>
          <ul>
            <li>
              <strong>Volume:</strong> about 10 to 20 hard sets per muscle group per week is the
              range most research supports for growth.
            </li>
            <li>
              <strong>Effort:</strong> take most working sets to within one to three reps of
              failure.
            </li>
            <li>
              <strong>Progression:</strong> add weight or reps every week or two, and track it. If
              the logbook is not moving, the bulk is mostly adding fat.
            </li>
            <li>
              <strong>Frequency:</strong> train each muscle at least twice a week.
            </li>
            <li>
              <strong>Recovery:</strong> seven to nine hours of sleep and a lighter week every four
              to eight weeks.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Reading your progress month by month",
      body: (
        <>
          <p>
            Compare each four-week block with the last. These patterns tell you what to do next:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Weight</th>
                  <th scope="col">Lifts</th>
                  <th scope="col">Waist</th>
                  <th scope="col">What to do</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Up, on target</td>
                  <td>Up</td>
                  <td>Slightly up</td>
                  <td>Keep going</td>
                </tr>
                <tr>
                  <td>Flat</td>
                  <td>Flat</td>
                  <td>Flat</td>
                  <td>Add 100 to 150 kcal</td>
                </tr>
                <tr>
                  <td>Up fast</td>
                  <td>Flat</td>
                  <td>Up clearly</td>
                  <td>Cut the surplus; review training</td>
                </tr>
                <tr>
                  <td>Up, on target</td>
                  <td>Flat</td>
                  <td>Up</td>
                  <td>Fix training and sleep before eating more</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "Why the calculator uses a percentage, not a fixed number",
      body: (
        <>
          <p>
            Many guides give a single surplus for everyone, such as 500 kcal a day. That number
            means very different things for different people. For a 55 kg woman with a maintenance
            of 1,900 kcal, an extra 500 kcal is a 26 percent increase. For a 100 kg man maintaining
            at 3,400 kcal, it is under 15 percent. The first person would gain fat quickly; the
            second might barely gain at all.
          </p>
          <p>
            Expressing the surplus as a share of maintenance keeps the pace roughly comparable
            across body sizes and activity levels. A larger, more active person burns more, recovers
            from more training and can make use of a larger absolute surplus. A smaller person needs
            less. It is still an estimate, but it starts most people in a sensible place, and the
            weekly weigh-ins then tell you how to adjust.
          </p>
        </>
      ),
    },
    {
      heading: "Protein, fat and carbohydrate on a bulk",
      body: (
        <>
          <p>
            <strong>Protein</strong> is set at 2 g per kg of body weight. That is at the upper end
            of what research supports for muscle growth, which leaves a comfortable margin for days
            that fall short. More than this adds little, because the extra calories in a bulk
            already spare protein from being used for energy.
          </p>
          <p>
            <strong>Fat</strong> is held at about a quarter of calories. It keeps meals satisfying
            and supports normal hormone production, and it is the easiest way to add calories
            without adding much food volume. Going much higher tends to crowd out carbohydrate.
          </p>
          <p>
            <strong>Carbohydrate</strong> gets the rest, and on a bulk that is a lot. Carbohydrate
            refills the glycogen your muscles use during hard sets, which helps you do more work in
            each session. Over months, more work means more growth. Most of the extra food in a bulk
            should therefore come from carbohydrate: rice, potatoes, oats, bread, pasta, fruit and
            dairy.
          </p>
        </>
      ),
    },
    {
      heading: "Bulking on a tight schedule or budget",
      body: (
        <>
          <p>
            Eating more does not have to mean cooking more or spending a lot. Some of the cheapest
            foods per calorie are also the most useful on a bulk. Oats, rice, pasta, potatoes,
            bananas, eggs, milk, peanut butter, tinned fish and frozen vegetables cover most needs
            at low cost, and they keep well.
          </p>
          <p>
            Batch cooking helps when time is short. A large pot of rice, a tray of roasted chicken
            or lentils, and some prepared vegetables can become four or five meals with very little
            extra effort. A blender makes it easy to drink a few hundred calories: milk, oats, a
            banana and a spoon of peanut butter together come to around 600 kcal and take two
            minutes.
          </p>
        </>
      ),
    },
    {
      heading: "Signs the bulk is going well",
      body: (
        <p>
          A good bulk is quietly boring. The scale moves up slowly and steadily, without big jumps
          after the first two weeks. Lifts go up most weeks, even if only by a rep or a small amount
          of weight. Clothes feel tighter in the shoulders, chest, arms and legs before they feel
          tighter at the waist. Energy in training is good, sleep is solid and appetite is
          manageable. If all of that is true, change nothing: keep eating to the same target, keep
          training hard, and only adjust when the monthly trend clearly moves away from the plan.
        </p>
      ),
    },
    {
      heading: "Bulking when you are naturally slim",
      body: (
        <>
          <p>
            People who find it hard to gain weight often underestimate how much they need to eat and
            overestimate how much they already eat. A few days of tracking usually shows intake well
            below what they guessed, with large gaps between meals and small portions at the meals
            they do eat. The solution is rarely a huge surplus; it is a consistent one, eaten every
            day including weekends.
          </p>
          <p>
            Start at the moderate pace and use the strategies that make eating easier rather than
            harder: more frequent meals, calorie-dense additions to normal food, and drinks such as
            milk or smoothies. Weigh in daily and look at the weekly average. If it has not moved
            after three weeks, add another 150 to 200 kcal. Slim people often need to repeat that
            step once or twice before the scale starts climbing, because their everyday movement
            tends to rise as they eat more.
          </p>
        </>
      ),
    },
    {
      heading: "What to do after the bulk",
      body: (
        <>
          <p>
            When a bulk ends, the most useful next step is usually two to four weeks at your new
            maintenance. It lets the weight settle, shows you how much of the gain holds once the
            extra food and water drop, and gives you an accurate maintenance number for whatever
            comes next. Many lifters then run a short fat-loss phase to remove some of the fat
            gained, often eight to twelve weeks at a moderate deficit with high protein and
            unchanged training. Others are happy at their new weight and simply maintain. Either
            way, the muscle gained during the bulk is kept as long as training continues and protein
            stays high, so the work is not lost when the surplus ends.
          </p>
        </>
      ),
    },
    {
      heading: "Bulking and cardio",
      body: (
        <>
          <p>
            Some lifters avoid all cardio during a bulk, fearing it will burn the calories they
            worked hard to eat. In moderate amounts, cardio supports heart health, improves work
            capacity in the gym and helps keep appetite regular, all of which make a bulk go better.
            Two or three sessions a week of easy cycling, walking or rowing for 20 to 40 minutes is
            enough for most people and has little effect on muscle gain.
          </p>
          <p>
            The key is to include it in your maintenance estimate. If you add cardio after
            calculating your bulk, the real surplus shrinks, and weight gain slows or stops. Either
            choose an activity level that includes the cardio from the start, or add the calories it
            burns to your daily target. High-intensity interval work and long endurance sessions are
            the ones most likely to interfere with recovery from lifting, so keep them modest during
            a gaining phase.
          </p>
        </>
      ),
    },
    {
      heading: "Supplements on a bulk",
      body: (
        <>
          <p>
            No supplement is necessary for a successful bulk, but a few can make it easier. Protein
            powder is simply a convenient food that helps hit the protein target when meals fall
            short. Creatine monohydrate is one of the most studied supplements in sport, and at 3 to
            5 g a day it reliably improves strength and training volume for most people, which
            supports muscle gain over time. It also adds a little water to muscles, so expect a
            small extra rise on the scale in the first weeks. Calorie-dense mass gainers are another
            option for people who struggle to eat enough, though homemade shakes with milk, oats,
            banana and peanut butter do the same job at lower cost. Beyond these, most products
            marketed for muscle building have little evidence behind them.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping a bulk on track over months",
      body: (
        <>
          <p>
            The first few weeks of a bulk are usually easy: motivation is high, the extra food is
            welcome and the scale moves quickly. Months two and three are where most bulks drift.
            Appetite falls as weight rises, meals get skipped on busy days, and intake slides back
            toward maintenance without anyone noticing. Other times the opposite happens, and a
            relaxed attitude to food turns a planned surplus into a much larger one.
          </p>
          <p>
            A simple routine keeps things steady. Plan the next day's meals each evening, keep easy
            calorie-dense foods on hand for busy days, and review the weekly average every Sunday
            against the target rate. Recalculate the target after every two to three kilograms
            gained, because a heavier body needs more to keep gaining. Most importantly, keep the
            training log moving: if lifts are going up and weight is rising at the planned pace, the
            bulk is working, whatever the mirror says on a given morning.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Turn your bulking numbers into a week of meals",
    whenToUse:
      "When you have your daily targets and want a meal structure you can actually eat every day.",
    pasteIn:
      "Your calories and macros, how many meals you want, foods you like and dislike, and your training times.",
    text: `I'm starting a lean bulk. My daily targets from a bulking calculator are:
Calories: [kcal]
Protein: [g], Carbs: [g], Fat: [g]

I eat [number] meals a day and train at [time] on [days].
Foods I like: [list]
Foods I avoid: [list]

1. Give me a simple daily meal structure that hits these numbers within 5%.
2. Put the biggest carbohydrate meal around my training.
3. Suggest three easy ways to add 200 to 300 kcal if I am not gaining after three weeks.
4. Keep it to everyday supermarket foods and meals I can repeat.`,
  },
  forCoaches: {
    heading: "Running bulks with clients",
    body: (
      <>
        <p>
          Agree the success measures before the bulk starts. Weight is one, but strength in a few
          key lifts and a couple of body measurements (waist, chest, arms, thighs) tell you much
          more about whether the gain is muscle.
        </p>
        <p>
          Review monthly. Muscle gain is too slow to judge week to week, and constant tweaks make
          the trend impossible to read.
        </p>
        <p>
          Be honest about the cost. A bulk adds some fat, and the client will need to accept softer
          weeks to look better a year later. Clients who understand that stay the course; clients
          who expect pure muscle quit when the waist measurement goes up.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Plan the bulk and track what clients eat",
    body: (
      <p>
        In Traiv you set each client's daily calories and protein, carbohydrate and fat targets,
        build their diet plan from recipes, and review the food they log, so you can see whether a
        slow gain is the plan or the eating.
      </p>
    ),
  },
  next: [
    {
      label: "Find your maintenance calories first",
      href: "/tools/maintenance-calorie-calculator",
    },
    { label: "Spread your protein across meals", href: "/tools/protein-per-meal-calculator" },
  ],
  nextPitch: "Coaching muscle gain? Traiv keeps each client's targets and food logs together.",
  faq: [
    {
      q: "How many calories should I eat on a bulk?",
      a: "About 10 to 15 percent above your maintenance calories for most people. That is roughly 250 to 450 kcal extra a day for typical maintenance levels.",
    },
    {
      q: "How much weight should I gain per week while bulking?",
      a: "About 0.25 to 0.5 percent of body weight a week. For an 80 kg person that is 0.2 to 0.4 kg a week.",
    },
    {
      q: "How much protein do I need on a bulk?",
      a: "This calculator uses 2.0 g per kg of body weight. Anything from 1.6 to 2.2 g per kg is well supported; more than that adds little.",
    },
    {
      q: "Can I bulk without getting fat?",
      a: "You can keep fat gain small with a modest surplus, high protein and hard training, but some fat gain is normal. A lean bulk trades speed for less fat.",
    },
    {
      q: "Is a dirty bulk a good idea?",
      a: "Rarely. Eating everything in sight adds weight quickly, but most of it is fat that has to come off later. A controlled surplus builds about as much muscle with far less fat.",
    },
    {
      q: "What if I am not gaining weight?",
      a: "Check that you are hitting the target every day, including weekends. If you are and weight is flat for three weeks, add 100 to 150 kcal a day.",
    },
    {
      q: "Should I bulk as a beginner?",
      a: "Beginners can often build muscle at maintenance or a small surplus. A formal bulk helps most if you are very lean or have been training for a year or more.",
    },
    {
      q: "Do I need to eat more on training days?",
      a: "You can, but it is not required. Total weekly intake matters most. Some people find it easier to eat more on training days and less on rest days.",
    },
    {
      q: "Does the weekly gain figure mean I will gain that much?",
      a: "No. It is the upper limit if every surplus calorie were stored. Some of the surplus is burned through digestion and extra movement, so real gain is usually lower.",
    },
    {
      q: "How long should a bulk last?",
      a: "Often three to six months, followed by a few weeks at maintenance. Stop sooner if body fat climbs higher than you are comfortable with.",
    },
    {
      q: "Should I do cardio while bulking?",
      a: "Yes, in moderation. Two or three easy sessions a week support heart health and recovery and do not interfere with muscle gain. Account for them in your maintenance estimate.",
    },
  ],
  disclaimer: (
    <p>
      This calculator gives general information, not medical advice. If you are under 18, managing a
      medical condition or have a history of disordered eating, talk to a doctor or registered
      dietitian before changing what you eat.
    </p>
  ),
  keepGoing: [
    { label: "Calorie surplus calculator", href: "/tools/calorie-surplus-calculator" },
    { label: "Maintenance calorie calculator", href: "/tools/maintenance-calorie-calculator" },
    { label: "Protein per meal calculator", href: "/tools/protein-per-meal-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Gaining phases with a plan and an end point",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
