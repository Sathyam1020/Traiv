import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Carb Cycling Calculator: High and Low Carb Day Targets",
  description:
    "Free carb cycling calculator. Set high-carb training days and low-carb rest days with fixed protein and fat, keeping your weekly calories unchanged.",
  eyebrow: "Free tool · Nutrition",
  h1: "Carb cycling calculator",
  intro: (
    <>
      <p>
        Carb cycling moves carbohydrate toward the days you train and away from the days you rest,
        while keeping protein and fat steady. Enter your maintenance calories, body weight, goal and
        training days, choose how big the swing should be, and this calculator gives you targets for
        high and low days that add up to the same weekly total.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How does carb cycling work?",
    answer: (
      <>
        <p>
          Keep protein and fat the same every day. Eat more carbohydrate on training days, when it
          fuels performance and recovery, and less on rest days. Balance the two so that weekly
          calories match your goal, whether that is a deficit, maintenance or a surplus.
        </p>
        <p>
          Using the defaults, 2,600 kcal maintenance, 80 kg and a 20 percent deficit with four
          training days and a moderate swing: protein stays at 160 g and fat at 64 g every day. Low
          days have about 108 g of carbohydrate, high days about 297 g, and the week totals the same
          as eating 2,080 kcal every day.
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
              <strong>Average calories:</strong> maintenance adjusted by your goal (−20, −10, 0 or
              +10 percent).
            </li>
            <li>
              <strong>Fixed macros:</strong> protein at 2.0 g per kg and fat at 0.8 g per kg, the
              same every day.
            </li>
            <li>
              <strong>Average carbohydrate:</strong> whatever calories remain, divided by 4.
            </li>
            <li>
              <strong>Low days:</strong> average carbohydrate reduced by 30, 50 or 75 percent
              depending on the swing you choose.
            </li>
            <li>
              <strong>High days:</strong> take up the carbohydrate removed from low days, so the
              week's total carbohydrate, and therefore calories, stays the same.
            </li>
          </ol>
          <p>
            Low days fall on your rest days and high days on your training days, so the number of
            training days decides how the carbohydrate is split.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a swing",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Swing</th>
                  <th scope="col">Low-day carbs</th>
                  <th scope="col">Suits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mild (30%)</td>
                  <td>70% of average</td>
                  <td>First try; people who feel flat on low-carb days</td>
                </tr>
                <tr>
                  <td>Moderate (50%)</td>
                  <td>50% of average</td>
                  <td>Most people trying carb cycling</td>
                </tr>
                <tr>
                  <td>Aggressive (75%)</td>
                  <td>25% of average</td>
                  <td>Experienced dieters; physique athletes; very structured eaters</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A bigger swing gives more fuel to training days but makes rest days more restrictive. If
            low days leave you tired, irritable or hungry enough to overeat the next day, the swing
            is too large.
          </p>
        </>
      ),
    },
    {
      heading: "Does carb cycling burn more fat?",
      body: (
        <>
          <p>
            When weekly calories and protein are the same, carb cycling has not been shown to
            produce more fat loss than eating the same macros every day. The body responds mainly to
            the weekly energy balance.
          </p>
          <p>
            What carb cycling can do is help some people train better and feel better on a diet.
            More carbohydrate before and after hard sessions supports performance and recovery, and
            the higher-carbohydrate days give a psychological break from restriction. Others find
            the changing targets confusing and do better with the same numbers every day. Both
            approaches work; it is a question of preference and practicality.
          </p>
        </>
      ),
    },
    {
      heading: "A week of carb cycling",
      body: (
        <>
          <p>With four training days on Monday, Tuesday, Thursday and Friday, the defaults give:</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Type</th>
                  <th scope="col">Carbs</th>
                  <th scope="col">Calories</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monday</td>
                  <td>Training</td>
                  <td>about 297 g</td>
                  <td>about 2,404</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>Training</td>
                  <td>about 297 g</td>
                  <td>about 2,404</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>Rest</td>
                  <td>about 108 g</td>
                  <td>about 1,648</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>Training</td>
                  <td>about 297 g</td>
                  <td>about 2,404</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>Training</td>
                  <td>about 297 g</td>
                  <td>about 2,404</td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>Rest</td>
                  <td>about 108 g</td>
                  <td>about 1,648</td>
                </tr>
                <tr>
                  <td>Sunday</td>
                  <td>Rest</td>
                  <td>about 108 g</td>
                  <td>about 1,648</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Put the largest carbohydrate meals in the hours around training on high days. On low
            days, build meals around protein, vegetables and the day's fat allowance.
          </p>
        </>
      ),
    },
    {
      heading: "Carb cycling food ideas",
      body: (
        <>
          <ul>
            <li>
              <strong>High days:</strong> oats, rice, potatoes, pasta, bread, fruit, and dairy such
              as milk and yoghurt, alongside lean protein.
            </li>
            <li>
              <strong>Low days:</strong> eggs, meat, fish, tofu, Greek yoghurt, lots of non-starchy
              vegetables, salads, and a measured amount of oils, nuts or cheese.
            </li>
            <li>
              <strong>Every day:</strong> the same protein target, so each meal still has a solid
              protein source.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Who carb cycling suits",
      body: (
        <>
          <p>
            Carb cycling suits people who train hard on some days and rest fully on others, who like
            structure, and who are comfortable planning meals in advance. It suits people less if
            their training schedule changes week to week, if they find tracking stressful, or if
            they tend to overeat after restrictive days. For many people, a consistent daily target
            is simpler and just as effective.
          </p>
        </>
      ),
    },
    {
      heading: "The science behind matching carbs to training",
      body: (
        <>
          <p>
            During hard training, especially sessions with many sets, high repetitions or intervals,
            muscles rely heavily on stored glycogen. When glycogen is low, the same session feels
            harder and performance drops. Eating more carbohydrate on training days, particularly in
            the meals before and after the session, helps keep glycogen stores high when they are
            needed most.
          </p>
          <p>
            On rest days, the body needs less carbohydrate for fuel, and recovery mostly depends on
            adequate protein and total energy over several days. Moving some carbohydrate from rest
            days to training days therefore uses the same total in a way that better matches demand.
            That is the logic of carb cycling, and it is sound, even though the effect on fat loss
            itself is small.
          </p>
        </>
      ),
    },
    {
      heading: "Carb cycling for fat loss",
      body: (
        <>
          <p>
            During a diet, carb cycling can make the deficit easier to live with. Training days feel
            more normal because there is more food, and rest days, when hunger is often lower
            anyway, carry more of the restriction. Some people find this pattern much easier than a
            single moderate target every day. Others find the low days difficult and end up
            overeating, which cancels the deficit. Starting with a mild swing and adjusting from
            there is the safest approach.
          </p>
          <p>
            Remember that daily weight will move more than usual. High-carbohydrate days bring extra
            water, so the scale often rises after them and falls after low days. The weekly average
            tells the real story.
          </p>
        </>
      ),
    },
    {
      heading: "Carb cycling for muscle gain",
      body: (
        <>
          <p>
            When the goal is muscle gain, carb cycling can help keep fat gain in check. Training
            days, where extra energy supports performance and recovery, carry most of the surplus,
            while rest days sit closer to maintenance. Over a week, the total is still a surplus,
            but less of it lands on days when the body has less use for it. Whether this
            meaningfully reduces fat gain compared with an even surplus is not well established, but
            it is a reasonable approach for people who like the structure.
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
              <strong>Cutting protein on low days.</strong> Protein should stay the same every day;
              only carbohydrate changes.
            </li>
            <li>
              <strong>Making low days too low.</strong> Very low carbohydrate days followed by very
              high ones can lead to rebound eating. Start mild.
            </li>
            <li>
              <strong>Mismatching days and training.</strong> High days belong on hard training
              days. If a session is cancelled, switch to a low day.
            </li>
            <li>
              <strong>Forgetting the weekly total.</strong> If high days run over and low days are
              not reduced to compensate, the week drifts into a surplus.
            </li>
            <li>
              <strong>Overcomplicating it.</strong> Two day types are enough. Some approaches use
              three or four, which adds complexity without clear benefit.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Carb cycling for different sports",
      body: (
        <>
          <p>
            Endurance athletes often use a version of carb cycling naturally, eating more before
            long or intense sessions and less on easy days. Some deliberately train with low
            carbohydrate availability on certain easy sessions to encourage adaptations in fat use,
            a practice sometimes called 'train low'. That approach is more specialised and usually
            managed carefully around key sessions. For team sport and strength athletes, matching
            carbohydrate to training load is usually enough.
          </p>
        </>
      ),
    },
    {
      heading: "Adjusting the plan over time",
      body: (
        <>
          <p>
            Run the plan for two to three weeks before judging it. Track weekly average weight, how
            training feels on high days and how you feel on low days. If weight is moving at the
            intended rate and training is strong, keep going. If low days are too hard, choose a
            milder swing. If high days leave you feeling heavy or sluggish, move a little of the
            extra carbohydrate earlier in the day or around the session. If weight is not moving,
            adjust the goal setting rather than the swing, because the swing only redistributes
            carbohydrate; it does not change the weekly total.
          </p>
        </>
      ),
    },
    {
      heading: "Carb cycling and fibre",
      body: (
        <>
          <p>
            Low-carbohydrate days can easily fall short on fibre if the remaining carbohydrate comes
            from refined sources or is cut too far. Prioritise vegetables, berries, nuts and seeds
            on low days, which deliver fibre with relatively few digestible carbohydrates. On high
            days, choose oats, potatoes, wholegrains and fruit for at least part of the extra
            carbohydrate, so fibre stays steady across the week.
          </p>
        </>
      ),
    },
    {
      heading: "Who should avoid carb cycling",
      body: (
        <>
          <p>
            People with diabetes, especially those taking insulin or medications that lower blood
            sugar, should not change carbohydrate intake substantially from day to day without
            guidance from their care team, because medication doses may need adjusting. People with
            a history of disordered eating may find the alternating pattern unhelpful. Pregnant and
            breastfeeding women should focus on steady, adequate intake rather than cycling.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing the number of high days",
      body: (
        <>
          <p>
            The calculator places one high-carbohydrate day on each training day. That works well
            for most people, but you can adjust it. If you train twice on some days and rest fully
            on others, you might treat only the double days as high. If you play a sport at
            weekends, a match day might be high even if it is not a gym session. The principle is
            simple: put the most carbohydrate on the days and in the meals around the most demanding
            activity, and the least on the most restful days.
          </p>
          <p>
            If you train six days a week, there is only one low day, which means each high day
            carries only a little extra carbohydrate. In that situation carb cycling makes little
            practical difference, and a single daily target may be simpler.
          </p>
        </>
      ),
    },
    {
      heading: "Carb cycling and hormones",
      body: (
        <>
          <p>
            Some proponents claim that carb cycling optimises hormones such as insulin, leptin and
            thyroid hormones. Carbohydrate intake does affect these hormones in the short term;
            insulin rises after carbohydrate-rich meals, and leptin and thyroid hormone levels tend
            to fall during prolonged low-carbohydrate or low-calorie dieting. Higher-carbohydrate
            days may temporarily raise leptin. But there is little evidence that these short-term
            changes translate into meaningfully more fat loss when total calories and protein are
            equal. Treat carb cycling as a tool for training and adherence rather than a way to
            manipulate hormones.
          </p>
        </>
      ),
    },
    {
      heading: "Carb cycling for women",
      body: (
        <>
          <p>
            Women can use carb cycling in the same way as men. Some women find that hunger and
            cravings increase in the days before their period, and that higher-carbohydrate days fit
            better in that phase, while lower days feel easier earlier in the cycle. Others notice
            little difference. Because water weight shifts across the cycle, comparing weight in the
            same phase of each month gives a clearer picture of progress than week-to-week
            comparisons.
          </p>
          <p>
            Very low carbohydrate intakes combined with low calories and heavy training can affect
            the menstrual cycle in some women. If cycles become irregular, increasing calories and
            carbohydrate is usually the first step, and it is worth talking to a doctor if changes
            persist.
          </p>
        </>
      ),
    },
    {
      heading: "Turning the numbers into meals",
      body: (
        <>
          <p>
            On high days, build meals around a protein source, a generous portion of starch and a
            serving of fruit, keeping fats measured. On low days, keep the same protein, replace
            most of the starch with vegetables and salad, and use the day's fat allowance for
            cooking oil, nuts, avocado or cheese. Keeping the same protein sources on both day types
            makes planning easier, because only the side dishes change.
          </p>
        </>
      ),
    },
    {
      heading: "Carb cycling and endurance training",
      body: (
        <>
          <p>
            Endurance athletes have long matched carbohydrate intake to training: more before and
            after long or intense sessions, less on easy or rest days. This is sometimes called
            periodised carbohydrate intake. Sports nutrition guidance commonly suggests anywhere
            from 3 to 5 g of carbohydrate per kg of body weight on lighter days up to 8 to 12 g per
            kg on days with very long or hard training. That range is far wider than the swings in
            this calculator, which is designed for general fitness and physique goals. Endurance
            athletes with high training loads should base intake on their training plan rather than
            on fixed percentages.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping it simple",
      body: (
        <>
          <p>
            If tracking two sets of targets feels like too much, a simpler version works well: keep
            your normal meals every day, and on training days add one extra portion of starchy
            carbohydrate to the meals before and after the session. On rest days, replace one
            portion of starch with extra vegetables. This approximates carb cycling without any
            numbers and is easy to sustain over months.
          </p>
        </>
      ),
    },
    {
      heading: "What a low day should feel like",
      body: (
        <>
          <p>
            A well-set low day should feel lighter, not miserable. You should still be able to work,
            think clearly and go about normal activities. If low days bring headaches, irritability,
            poor sleep or intense cravings, the swing is too large for you, or total calories are
            too low. Choose a milder swing or a smaller deficit, and make sure low days still
            contain plenty of vegetables, adequate protein and the full fat allowance, which
            together help keep you full.
          </p>
        </>
      ),
    },
    {
      heading: "How long to carb cycle",
      body: (
        <>
          <p>
            There is no fixed duration. Some people use carb cycling for a single fat-loss phase of
            eight to twelve weeks; others keep it as their normal way of eating because it suits
            their training week. Review it every month: if it is helping your training and you are
            sticking to it easily, carry on. If it feels like a burden, a single daily target will
            usually work just as well.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using carb cycling with clients",
    body: (
      <>
        <p>
          Use carb cycling as a refinement, not a starting point. Clients who are not yet consistent
          with a single daily target rarely do better with two.
        </p>
        <p>
          Keep low days livable. A rest day that feels like a punishment often leads to a weekend
          binge that undoes the whole week. Start with a mild swing.
        </p>
        <p>
          Tie high days to training that actually happens. If a client misses a session, they should
          eat a low day's targets, which needs to be agreed in advance.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Plan different targets for training and rest days",
    body: (
      <>
        <p>
          In Traiv you set each client's daily calories and protein, carbohydrate and fat targets,
          build their diet plan from recipes, and see the food they log against those targets.
        </p>
      </>
    ),
  },
  next: [
    { label: "Cycle calories instead of carbs", href: "/tools/calorie-cycling-calculator" },
    { label: "Plan a higher-carb refeed day", href: "/tools/refeed-day-calculator" },
  ],
  nextPitch:
    "Coaching clients with different training days? Traiv keeps targets and food logs together.",
  faq: [
    {
      q: "What is carb cycling?",
      a: "Eating more carbohydrate on training days and less on rest days, while keeping protein and fat steady and weekly calories on target.",
    },
    {
      q: "Does carb cycling help you lose more fat?",
      a: "Not when weekly calories and protein are equal. It can help training and make a diet easier to follow for some people.",
    },
    {
      q: "How many high-carb days should I have?",
      a: "One for each hard training day is a simple rule, which is usually three to five a week.",
    },
    {
      q: "What should I eat on low-carb days?",
      a: "Protein, plenty of non-starchy vegetables and your fat allowance: eggs, meat, fish, tofu, yoghurt, salads, nuts and oils.",
    },
    {
      q: "Is carb cycling the same as keto?",
      a: "No. Low days are lower in carbohydrate, but usually not low enough for ketosis, and high days bring carbohydrate back up.",
    },
    {
      q: "Can I carb cycle for muscle gain?",
      a: "Yes. Set the goal to muscle gain; high days support training and low days help limit fat gain, with weekly calories in a small surplus.",
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
    { label: "Calorie cycling calculator", href: "/tools/calorie-cycling-calculator" },
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "Refeed day calculator", href: "/tools/refeed-day-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Training-day and rest-day targets, for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
