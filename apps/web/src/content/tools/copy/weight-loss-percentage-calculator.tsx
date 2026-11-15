import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Weight loss percentage calculator",
  description:
    "Work out the percentage of body weight you have lost, your progress to a goal and the weekly pace needed to reach it, in kg or lb.",
  eyebrow: "Free tool · Body composition",
  h1: "Weight loss percentage calculator",
  intro: (
    <>
      <p>
        Enter your starting and current weight to see the percentage of body weight you have lost.
        Add a goal and a timeframe to see your progress, what is left and the weekly pace you would
        need.
      </p>
    </>
  ),
  sources: [
    {
      label:
        "Wing RR et al. Benefits of modest weight loss in improving cardiovascular risk factors (Diabetes Care, 2011)",
      href: "https://diabetesjournals.org/care/article/34/7/1481/38558",
    },
    {
      label: "CDC: Steps for losing weight",
      href: "https://www.cdc.gov/healthy-weight-growth/losing-weight/index.html",
    },
    {
      label: "NICE guideline NG246: Overweight and obesity management",
      href: "https://www.nice.org.uk/guidance/ng246",
    },
  ],
  shortAnswer: {
    question: "How do I calculate weight loss percentage?",
    answer: (
      <>
        <p>
          Subtract current weight from starting weight, divide by starting weight and multiply by
          100. A drop from 90 kg to 84 kg is 6 kg lost, and 6 ÷ 90 × 100 gives 6.7%.
        </p>
        <p>
          With a goal of 80 kg, you are 60% of the way there, with 4 kg to go. Reaching it in 12
          weeks would mean about 0.33 kg a week, or 0.4% of your current weight.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why percentage beats pounds or kilograms",
      body: (
        <>
          <p>
            Kilograms lost tell you how much weight has gone. Percentage lost tells you how much
            that means for your body. Losing 10 kg is a large change for someone who started at 70
            kg and a smaller one for someone who started at 140 kg. Expressing it as a share of
            starting weight puts both on the same scale.
          </p>
          <p>
            That is why doctors and researchers use percentage. Clinical guidelines set goals as a
            percentage of body weight, studies report results that way, and weight loss medications
            are judged by the average percentage lost. Using the same measure for your own progress
            lets you compare it with this evidence and with other people fairly.
          </p>
        </>
      ),
    },
    {
      heading: "The formula",
      body: (
        <>
          <ul>
            <li>
              <strong>Weight lost:</strong> starting weight − current weight
            </li>
            <li>
              <strong>Percentage lost:</strong> weight lost ÷ starting weight × 100
            </li>
            <li>
              <strong>Progress to goal:</strong> weight lost ÷ (starting weight − goal weight) × 100
            </li>
            <li>
              <strong>Remaining:</strong> current weight − goal weight
            </li>
            <li>
              <strong>Weekly pace needed:</strong> remaining ÷ weeks to goal
            </li>
          </ul>
          <p>
            If current weight is higher than starting weight, the calculator shows the percentage
            gained instead. If you leave the goal blank, it shows only the percentage lost so far.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <p>
            Start at 90 kg, weigh 84 kg today, and the 6 kg difference equals 6.7% of where you
            began. With a goal of 80 kg, the full goal is 10 kg, so they are 60% of the way there.
            If they want to reach it in 12 weeks, they need to lose about 0.33 kg a week, which is
            about 0.4% of their current weight: a comfortable, sustainable pace.
          </p>
          <p>
            In pounds, someone who started at 250 lb and now weighs 230 lb has lost 20 lb, or 8%.
            With a goal of 200 lb, they are 40% of the way there with 30 lb to go. Reaching it in 30
            weeks means about 1 lb a week, or 0.43% of current weight a week.
          </p>
        </>
      ),
    },
    {
      heading: "Why 5 to 10% matters",
      body: (
        <>
          <p>
            For people carrying excess weight, losing 5% of body weight brings measurable health
            benefits. In large trials, it improved blood pressure, blood sugar, triglycerides and
            liver fat. Losing 10% brings larger gains, including better blood sugar control and, for
            some people with type 2 diabetes, remission. Reaching 15% or more can change the course
            of several weight-related conditions.
          </p>
          <p>
            These numbers are useful for goal-setting. A first goal of 5% is achievable for most
            people within a few months and delivers real benefits. It is also far less daunting than
            a goal set in tens of kilograms. Many people find that once they reach 5%, the next 5%
            feels more realistic.
          </p>
        </>
      ),
    },
    {
      heading: "A sustainable weekly pace",
      body: (
        <>
          <p>
            A loss of about 0.5 to 1% of body weight a week is a common guide for sustainable weight
            loss. At 90 kg that means roughly half a kilogram to just under a kilogram each week; at
            250 lb, about 1.25 to 2.5 lb. Faster loss is possible, particularly in the first few
            weeks when water and stored carbohydrate drop, but over months it tends to cost more
            muscle and is harder to keep up.
          </p>
          <p>
            The calculator warns when the weekly pace needed to hit your goal is over 1% of body
            weight. In that case, extending the timeframe usually makes the goal more realistic. A
            goal reached in six months and held is worth far more than one reached in three and
            regained.
          </p>
        </>
      ),
    },
    {
      heading: "Why weight loss is rarely a straight line",
      body: (
        <>
          <p>
            Body weight swings by one to two kilograms from day to day with water, salt,
            carbohydrate, digestion and, for women, the menstrual cycle. Those swings can mask fat
            loss for a week or more, then drop away suddenly. Many people see a fast loss in the
            first weeks, slower progress after, and the occasional plateau.
          </p>
          <p>
            To see the trend through the noise, weigh in the morning after using the toilet, before
            eating, on the same scale. Average the week's readings and compare weekly averages
            rather than individual days. The calculator works best with these averages as inputs.
          </p>
        </>
      ),
    },
    {
      heading: "Plateaus and what to do about them",
      body: (
        <>
          <p>
            As weight falls, the body uses less energy. A smaller body needs fewer calories, and the
            body adapts slightly by moving less and running more efficiently. A deficit that worked
            at the start can shrink to nothing after a few months, and weight stops falling.
          </p>
          <ol>
            <li>
              Check the trend across three or four weeks, not one. Water can hide progress for a
              while.
            </li>
            <li>
              Review what is actually being eaten. Portions and extras tend to creep up over time.
            </li>
            <li>
              Look at daily steps. Activity outside the gym often falls during a diet without people
              noticing.
            </li>
            <li>
              If those are on track, reduce intake slightly or add activity, or take a planned break
              at maintenance.
            </li>
          </ol>
          <p>
            A plateau is a normal part of losing weight, not a failure. Planning for it in advance
            makes it easier to handle.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping the weight off",
      body: (
        <>
          <p>
            Maintaining weight loss is often harder than losing it. People who keep weight off over
            years tend to share a few habits: they stay physically active, weigh themselves
            regularly, eat a fairly consistent diet, and respond quickly to small gains. Strength
            training helps by keeping muscle, which supports a higher energy expenditure and better
            health.
          </p>
          <p>
            Treat the end of a weight loss phase as the start of a maintenance phase, with its own
            plan. Increasing calories gradually to the new maintenance level and continuing to track
            weight weekly helps avoid regaining what was lost.
          </p>
        </>
      ),
    },
    {
      heading: "Setting a realistic goal",
      body: (
        <>
          <p>
            A good weight loss goal is specific, measurable and achievable in a set timeframe.
            Percentage makes that easier. Rather than aiming to lose 20 kg, aiming to lose 5% in
            three months, then reassessing, gives a clear first milestone. For someone at 100 kg,
            that is 5 kg in about 12 weeks, around 0.4 kg a week.
          </p>
          <p>
            Once you reach the first milestone, set the next. Many people find a second 5% follows
            more easily, because the habits that got them there are in place. Others decide that
            maintaining the first 5% is the right goal. Both are reasonable; what matters is a goal
            you can reach and keep.
          </p>
        </>
      ),
    },
    {
      heading: "Weight loss percentage in research and medicine",
      body: (
        <>
          <p>
            Clinical trials report weight loss as a percentage of starting weight. Lifestyle
            programmes typically produce average losses of about 5 to 10% over a year. Newer weight
            loss medications have shown average losses of around 15 to 20% in trials, and bariatric
            surgery around 25 to 30%.
          </p>
          <p>
            These figures help put your own progress in context. Losing 7% through changes in diet
            and activity is a strong result that matches or beats many structured programmes.
            Comparing yourself with averages from medication trials can make good progress feel
            inadequate, when in fact it is delivering real health benefits.
          </p>
        </>
      ),
    },
    {
      heading: "Which percentage targets bring which benefits",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Weight lost</th>
                  <th scope="col">Typical benefits for people carrying excess weight</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>3 to 5%</td>
                  <td>Lower triglycerides and blood sugar, smaller waist</td>
                </tr>
                <tr>
                  <td>5 to 10%</td>
                  <td>Lower blood pressure, better cholesterol, less liver fat</td>
                </tr>
                <tr>
                  <td>10 to 15%</td>
                  <td>Possible type 2 diabetes remission, less sleep apnoea, less joint pain</td>
                </tr>
                <tr>
                  <td>15% or more</td>
                  <td>Larger improvements across several weight-related conditions</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Individual results vary, and benefits depend on how weight is lost, whether it is kept
            off and what else changes, such as fitness and diet quality. Losing weight through
            better eating and more activity tends to bring benefits beyond the weight change itself.
          </p>
        </>
      ),
    },
    {
      heading: "What the scale does not show",
      body: (
        <>
          <p>
            Body weight combines fat, muscle, water, bone, organs and the contents of the gut. A
            weight loss percentage tells you total weight has fallen, not what was lost. Ideally,
            most of it is fat. Without training and enough protein, a significant share can come
            from muscle.
          </p>
          <p>
            Pair the scale with a waist measurement and, if possible, a body fat estimate. If weight
            falls while the waist shrinks and strength holds, the loss is mostly fat. If weight
            falls but strength drops and the waist barely changes, the plan may need more protein,
            more training or a smaller deficit.
          </p>
        </>
      ),
    },
    {
      heading: "Protecting muscle while losing weight",
      body: (
        <>
          <ul>
            <li>
              <strong>Strength train two to four times a week.</strong> It gives the body a reason
              to keep muscle.
            </li>
            <li>
              <strong>Eat enough protein.</strong> Around 1.6 to 2.2 g per kg of body weight a day
              is a common range during weight loss.
            </li>
            <li>
              <strong>Keep the deficit moderate.</strong> About 0.5 to 1% of body weight a week
              limits muscle loss.
            </li>
            <li>
              <strong>Sleep seven to nine hours.</strong> Short sleep during a diet increases muscle
              loss.
            </li>
            <li>
              <strong>Stay active outside training.</strong> Daily walking adds energy use without
              interfering with recovery.
            </li>
          </ul>
          <p>
            These habits help make sure the percentage you lose is mostly fat, and that you keep the
            strength and muscle that support long-term health.
          </p>
        </>
      ),
    },
    {
      heading: "Weight loss for different starting points",
      body: (
        <>
          <p>
            Someone with a lot of weight to lose often sees faster early progress in kilograms,
            because a larger body uses more energy and a given deficit produces larger losses. In
            percentage terms, the pace is often similar to someone with less to lose.
          </p>
          <p>
            Someone close to a healthy weight may find progress slower and harder. Losing the last
            few kilograms often requires more precise eating and training. For them, focusing on
            body composition, strength and waist measurement can be more useful than chasing a scale
            target.
          </p>
        </>
      ),
    },
    {
      heading: "Using the calculator to plan",
      body: (
        <>
          <p>
            Start by entering your starting and current weight to see where you are. Then add a goal
            weight and a timeframe. If the weekly pace needed is under 1% of body weight, the plan
            is realistic. If it is over 1%, consider extending the timeframe or setting an
            intermediate goal.
          </p>
          <p>
            Recalculate every few weeks using your average weight for the week. As you get closer to
            the goal, the percentage remaining shrinks and the weekly pace may need adjusting. Some
            people find it useful to switch to a body fat or waist goal once weight loss slows.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: reporting progress to clients",
      body: (
        <>
          <p>
            Clients often focus on kilograms lost and feel discouraged when the number seems small.
            Expressing progress as a percentage, and linking it to health benefits, can change how
            they see it. A client who has lost 4 kg from 85 kg has lost 4.7%, close to the 5% mark
            linked with real improvements in health.
          </p>
          <p>
            Show progress as a trend over weeks and months, not week to week. Combine it with waist
            measurements, strength gains and how the client feels. These help clients stay engaged
            through plateaus and slower phases.
          </p>
        </>
      ),
    },
    {
      heading: "When to speak to a doctor",
      body: (
        <>
          <p>
            Unexplained weight loss, losing weight without trying, should always be checked by a
            doctor, especially if it is more than 5% of body weight over six to twelve months. It
            can be a sign of a health problem that needs attention.
          </p>
          <p>
            If you have a health condition such as diabetes, heart disease or kidney disease, take
            medication, are pregnant or breastfeeding, or have a history of eating disorders, speak
            to a doctor before starting a weight loss plan. They can help set safe goals and monitor
            your health along the way.
          </p>
        </>
      ),
    },
    {
      heading: "Regaining weight and what it means",
      body: (
        <>
          <p>
            Regaining some weight after a diet is common and does not mean failure. Body weight
            naturally rises slightly when a deficit ends, as glycogen and water stores refill. A
            rise of one to two kilograms in the first weeks of maintenance is usually water, not
            fat.
          </p>
          <p>
            Larger regains over months usually reflect a return to old habits. Weighing regularly,
            keeping up activity and having a plan for maintenance help limit regain. If weight
            creeps up by more than 2 to 3% of body weight, a short return to a modest deficit can
            bring it back down.
          </p>
        </>
      ),
    },
    {
      heading: "How diet and activity add up",
      body: (
        <>
          <p>
            Weight loss happens when energy taken in is lower than energy used, over time. A common
            rule of thumb is that a deficit of around 7,700 kcal corresponds to losing a kilogram of
            body fat, though the real figure varies as the body adapts. A daily deficit of 500 kcal
            adds up to about 3,500 kcal a week, which would mean roughly half a kilogram a week at
            first.
          </p>
          <p>
            Most of the deficit usually comes from eating less, because it is easier to cut 500 kcal
            of food than to burn 500 kcal through exercise. Activity still matters: it protects
            muscle, improves fitness and health, and makes maintenance easier. Daily walking is one
            of the most effective and sustainable ways to add to the deficit.
          </p>
          <p>
            As weight falls, the deficit shrinks, so progress slows unless intake or activity is
            adjusted. The calculator's weekly pace figure helps you see when an adjustment may be
            needed to stay on track.
          </p>
        </>
      ),
    },
    {
      heading: "Weight loss for men and women",
      body: (
        <>
          <p>
            Men often lose weight faster than women in the first weeks, partly because they tend to
            be larger, carry more muscle and have higher energy needs, so the same diet creates a
            larger deficit. Over a year, the difference in percentage lost often narrows.
          </p>
          <p>
            Women's weight can fluctuate more across the month with the menstrual cycle, sometimes
            by one to two kilograms. Comparing weights from the same point in the cycle, or using
            longer averages, gives a clearer view of progress. After the menopause, weight loss may
            be slower and more weight tends to sit around the abdomen, making waist measurements
            especially useful.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking weight well",
      body: (
        <>
          <ol>
            <li>
              Weigh at the same time each day, ideally in the morning after using the toilet and
              before eating.
            </li>
            <li>Use the same scale on a hard, flat floor.</li>
            <li>Wear the same light clothing or none.</li>
            <li>Record every reading and average them across the week.</li>
            <li>Compare weekly averages, not individual days.</li>
            <li>Add a waist measurement every two to four weeks.</li>
          </ol>
          <p>
            Daily weighing works well for some people and causes stress for others. If daily numbers
            are upsetting, weighing two or three times a week and averaging still shows the trend.
          </p>
        </>
      ),
    },
    {
      heading: "Talking about weight loss with care",
      body: (
        <>
          <p>
            Weight is a sensitive subject for many people. Focusing on percentage and health
            benefits, rather than appearance, helps keep the conversation constructive. Celebrating
            habits as well as results, such as hitting a step target, cooking more meals at home or
            training consistently, keeps attention on what the person can control.
          </p>
          <p>
            If someone shows signs of disordered eating, such as extreme restriction, bingeing,
            purging or intense anxiety about food or weight, a weight loss plan is not the right
            next step. Encourage them to speak to a doctor or a specialist service.
          </p>
        </>
      ),
    },
    {
      heading: "Weight loss percentage and medication",
      body: (
        <>
          <p>
            Prescription weight loss medicines, such as GLP-1 receptor agonists, are now widely used
            and are judged by average percentage weight loss in trials. If you are taking one,
            tracking your own percentage lost helps you and your doctor see how well it is working
            for you. Results vary between people, and lifestyle changes still matter for keeping
            muscle and maintaining the loss.
          </p>
          <p>
            If you are on medication, protein intake and resistance training become even more
            important. Faster weight loss with reduced appetite can lead to more muscle loss unless
            training and protein are kept up. Speak to your prescriber about any concerns, and do
            not change your dose without their advice.
          </p>
        </>
      ),
    },
    {
      heading: "Children, older adults and pregnancy",
      body: (
        <>
          <p>
            Weight loss targets designed for adults do not apply to children and teenagers, who are
            still growing. Changes for children should be guided by a health professional, usually
            with a focus on habits rather than weight.
          </p>
          <p>
            For older adults, unintended weight loss can be a concern, and intentional loss should
            protect muscle through resistance training and enough protein. During pregnancy, weight
            loss is not recommended, and weight gain should follow a midwife's or doctor's guidance.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a timeframe",
      body: (
        <>
          <p>
            If you are unsure what timeframe to enter, work backwards from a sustainable pace. At
            0.5% of body weight a week, losing 10% takes about 20 weeks; at 0.75% a week, about 14
            weeks. Enter a timeframe in that range, then check the weekly pace the calculator gives.
            A pace you can hold through holidays, busy weeks and the odd missed workout is the one
            that gets you there.
          </p>
        </>
      ),
    },
    {
      heading: "Motivation and the long view",
      body: (
        <>
          <p>
            Weight loss rarely feels steady from the inside. Weeks of good effort can show little
            change, then the scale drops suddenly. Keeping a record of your percentage lost, rather
            than only the latest weigh-in, helps you see the progress you have already made. Many
            people find it encouraging to look back at their starting point when a week feels slow.
          </p>
          <p>
            Rewarding habits rather than numbers helps too. Hitting your protein target most days,
            training three times a week or walking every day are wins in their own right, and over
            months they are what move the percentage. A coach can help keep the focus there when the
            scale is quiet.
          </p>
        </>
      ),
    },
    {
      heading: "Body weight and fat loss are not the same",
      body: (
        <>
          <p>
            Percentage of body weight lost is a useful headline figure, but fat loss is the real
            goal for most people. Two people who each lose 8% of their weight can end up with very
            different results if one lost mostly fat and the other a mix of fat and muscle. Keep
            training and protein in the plan, and the percentage you lose will reflect the change
            you actually want.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use your result with ChatGPT",
    whenToUse: "After calculating your progress and the pace your goal needs.",
    pasteIn: "Paste your weights, goal, timeframe and current habits.",
    text: `I started at [starting weight] and now weigh [current weight], a loss of [percent]. My goal is [goal weight] in [weeks] weeks, which needs about [weekly pace] a week, or [weekly percent] of my weight. I currently eat [eating pattern], train [training] and walk about [steps] steps a day. Help me judge whether this pace is realistic and sustainable. Suggest two habits to focus on next, how to handle a plateau, and three questions to ask my coach. Keep any suggested pace at or under 1% of body weight a week.`,
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
    key: "check-ins",
    heading: "See every client's progress in one place",
    body: (
      <>
        <p>
          In Traiv, clients log their weight in weekly check-ins and you see the trend beside their
          diet and training plan, so you can spot a plateau early and adjust.
        </p>
      </>
    ),
  },
  next: [
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "Goal weight date calculator", href: "/tools/goal-weight-date-calculator" },
    { label: "BMI calculator", href: "/tools/bmi-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "How do I calculate the percentage of weight I have lost?",
      a: "Subtract current weight from starting weight, divide by starting weight, and multiply by 100. A drop from 90 kg to 84 kg works out at 6.7%.",
    },
    {
      q: "What percentage of weight loss is significant?",
      a: "Losing 5% of body weight brings measurable health benefits for people carrying excess weight. Losing 10% or more brings larger gains.",
    },
    {
      q: "How much weight should I lose per week?",
      a: "About 0.5 to 1% of body weight a week is a common sustainable guide. Faster loss tends to cost more muscle and is harder to maintain.",
    },
    {
      q: "Why has my weight loss slowed down?",
      a: "A smaller body uses less energy, and daily activity often drops during a diet. Review intake and steps, and look at the trend over several weeks.",
    },
    {
      q: "Does the calculator work in pounds?",
      a: "Yes. Switch to lb and it converts the values you have entered.",
    },
    {
      q: "Why use percentage instead of kilograms?",
      a: "Percentage shows how big a change is relative to your starting weight, so it can be compared fairly across different people and with research.",
    },
    {
      q: "What if I have gained weight?",
      a: "The calculator shows the percentage gained instead. Look at the trend over a few weeks before drawing conclusions.",
    },
    {
      q: "Can I use an AI assistant to plan from my result?",
      a: "Yes, to organise questions and a draft plan for your coach. Share your numbers, timeframe and habits, and ask it to keep the pace under 1% a week.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only, not medical advice. If you have a health condition, take
        medication or are pregnant, speak to a doctor before changing your weight.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Check-ins in Traiv", href: "/features/check-ins" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Track every client's progress under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
