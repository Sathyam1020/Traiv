import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Steps to Calories Calculator: Calories Burned Walking",
  description:
    "Free steps to calories calculator. Convert a step count into distance, walking time and calories burned from your weight, height and pace.",
  eyebrow: "Free tool · Nutrition",
  h1: "Steps to calories calculator",
  intro: (
    <>
      <p>
        Step counts are easy to track, but what do they mean for energy? Enter your steps, weight,
        height and usual walking pace, and this calculator converts them into distance, time spent
        walking and calories burned, plus a per-1,000-steps figure you can use every day.
      </p>
    </>
  ),
  method:
    "Stride from height (41.4%), pace from your selection, MET values from the 2011 Compendium of Physical Activities",
  sources: [
    {
      label:
        "Ainsworth BE, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Med Sci Sports Exerc, 2011.",
      href: "https://pubmed.ncbi.nlm.nih.gov/21681120/",
    },
    {
      label:
        "Paluch AE, et al. Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts. Lancet Public Health, 2022.",
      href: "https://pubmed.ncbi.nlm.nih.gov/35247352/",
    },
    {
      label:
        "Tudor-Locke C, Bassett DR. How many steps/day are enough? Preliminary pedometer indices for public health. Sports Med, 2004.",
      href: "https://pubmed.ncbi.nlm.nih.gov/14715035/",
    },
  ],
  shortAnswer: {
    question: "How many calories do 10,000 steps burn?",
    answer: (
      <>
        <p>
          For an average adult, roughly 300 to 500 kcal, depending mostly on body weight and walking
          speed. A 170 lb (77 kg) person who is 5 ft 7 in, walking at an average pace, covers about
          4.4 miles (7 km) in 10,000 steps and burns around 400 kcal, or about 40 kcal per 1,000
          steps.
        </p>
        <p>
          That total includes the energy you would have used at rest during the same time. The extra
          burn above resting is roughly three quarters of it. Heavier people and faster walkers burn
          more per step; lighter people and slower walkers burn less.
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
              <strong>Stride length:</strong> your height × 0.414, a common estimate that sits
              between the usual figures for women and men.
            </li>
            <li>
              <strong>Distance:</strong> steps × stride length.
            </li>
            <li>
              <strong>Walking time:</strong> distance divided by your pace.
            </li>
            <li>
              <strong>Calories:</strong> the MET value for your pace × 3.5 × weight in kg ÷ 200, per
              minute, multiplied by walking time.
            </li>
            <li>
              <strong>Per 1,000 steps:</strong> total calories scaled to 1,000 steps, a handy
              everyday number.
            </li>
          </ol>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Pace</th>
                  <th scope="col">Speed</th>
                  <th scope="col">MET</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Slow stroll</td>
                  <td>2.0 mph / 3.2 km/h</td>
                  <td>2.8</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>3.0 mph / 4.8 km/h</td>
                  <td>3.5</td>
                </tr>
                <tr>
                  <td>Brisk</td>
                  <td>3.5 mph / 5.6 km/h</td>
                  <td>4.3</td>
                </tr>
                <tr>
                  <td>Fast</td>
                  <td>4.0 mph / 6.4 km/h</td>
                  <td>5.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "Calories per 1,000 steps at different weights",
      body: (
        <>
          <p>
            At an average pace and a height of about 5 ft 7 in, approximate calories per 1,000
            steps:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Body weight</th>
                  <th scope="col">Per 1,000 steps</th>
                  <th scope="col">Per 10,000 steps</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>55 kg (121 lb)</td>
                  <td>about 28 kcal</td>
                  <td>about 285 kcal</td>
                </tr>
                <tr>
                  <td>70 kg (154 lb)</td>
                  <td>about 36 kcal</td>
                  <td>about 360 kcal</td>
                </tr>
                <tr>
                  <td>85 kg (187 lb)</td>
                  <td>about 44 kcal</td>
                  <td>about 440 kcal</td>
                </tr>
                <tr>
                  <td>100 kg (220 lb)</td>
                  <td>about 52 kcal</td>
                  <td>about 520 kcal</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Walking faster burns more per minute and slightly more per step, because a faster pace
            has a higher MET value but you cover each step a little more quickly. Walking uphill or
            carrying a load increases the cost considerably.
          </p>
        </>
      ),
    },
    {
      heading: "Is 10,000 steps a day the right goal?",
      body: (
        <>
          <p>
            The 10,000-step target began as a marketing slogan for a Japanese pedometer in the 1960s
            rather than a scientific recommendation. Research since then has looked at what step
            counts actually do for health. A large 2022 analysis of 15 studies found that the risk
            of early death fell as daily steps increased, levelling off around 6,000 to 8,000 steps
            a day for adults over 60 and 8,000 to 10,000 for younger adults.
          </p>
          <p>
            In other words, 10,000 is a reasonable target but not a magic threshold. Going from
            3,000 to 6,000 steps a day brings larger benefits than going from 10,000 to 13,000. For
            people who are currently inactive, any increase helps, and setting a target 1,000 to
            2,000 steps above your current average is a sensible way to build up.
          </p>
        </>
      ),
    },
    {
      heading: "Steps and weight loss",
      body: (
        <>
          <p>
            Walking is one of the most useful tools for fat loss, not because it burns huge amounts
            in a single session but because it adds up and is easy to sustain. Raising daily steps
            from 5,000 to 10,000 adds roughly 200 kcal a day of expenditure for an average-sized
            adult, or about 1,400 kcal a week, without much effect on appetite or recovery from
            strength training.
          </p>
          <p>
            Steps are also one of the first things to fall during a diet. As people eat less, they
            tend to move less without noticing, which quietly shrinks the deficit. Tracking steps
            and keeping them steady is a simple way to protect progress. Many coaches set a daily
            step target alongside calorie and protein targets for exactly this reason.
          </p>
        </>
      ),
    },
    {
      heading: "Making steps more accurate",
      body: (
        <>
          <p>
            Phone and watch step counts are usually reasonably accurate for normal walking but can
            overcount or undercount during other activities, such as cycling, pushing a pram or
            doing housework. Stride length also varies with pace, terrain and individual build. For
            a more accurate personal stride length, walk a known distance, such as 100 metres on a
            track, count your steps and divide. Your result will usually land close to the 41
            percent of height estimate, but it may differ by several centimetres.
          </p>
        </>
      ),
    },
    {
      heading: "Ways to add steps without trying",
      body: (
        <>
          <ul>
            <li>
              <strong>Walk during phone calls</strong> or meetings that do not need a screen.
            </li>
            <li>
              <strong>Get off public transport a stop early,</strong> or park further away.
            </li>
            <li>
              <strong>Take the stairs</strong> whenever there is a choice.
            </li>
            <li>
              <strong>Walk after meals.</strong> A 10-minute walk after each main meal adds around
              3,000 steps a day and may help blood sugar control.
            </li>
            <li>
              <strong>Make errands active.</strong> Walk to nearby shops instead of driving.
            </li>
            <li>
              <strong>Set a reminder</strong> to stand and walk for a few minutes every hour during
              desk work.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Why taller people cover more ground per step",
      body: (
        <>
          <p>
            Stride length grows with height, so a taller person covers more distance with each step
            and, all else being equal, burns more per step. Someone 190 cm tall has an estimated
            stride of about 79 cm, while someone 155 cm tall has a stride of about 64 cm. Over
            10,000 steps, that is the difference between about 7.9 km and 6.4 km. Combined with
            differences in body weight, this means two people can burn very different amounts from
            the same step count, which is why the calculator asks for height as well as weight.
          </p>
        </>
      ),
    },
    {
      heading: "Steps and health beyond calories",
      body: (
        <>
          <p>
            Walking more is linked to a wide range of health benefits that have little to do with
            calorie burn. Higher daily step counts are associated with lower risk of heart disease,
            type 2 diabetes, some cancers, depression and early death. Walking improves blood sugar
            control, blood pressure and cholesterol, supports joint health and bone density, and
            improves mood and sleep. Brisk walking also improves aerobic fitness, especially for
            people who are currently inactive.
          </p>
          <p>
            Many of these benefits appear at step counts well below 10,000. Even modest increases,
            such as 2,000 extra steps a day, are associated with meaningful improvements in health
            outcomes, which makes walking one of the most valuable habits anyone can build.
          </p>
        </>
      ),
    },
    {
      heading: "Walking pace and intensity",
      body: (
        <>
          <p>
            Pace matters for fitness as well as calories. A brisk pace, often defined as around 100
            steps a minute or more, or a speed where you can talk but not sing, counts as
            moderate-intensity activity. Public health guidelines recommend at least 150 minutes of
            moderate activity a week, and brisk walking is one of the easiest ways to reach it. Some
            studies suggest that a brisk pace brings additional health benefits beyond the total
            number of steps.
          </p>
          <p>
            If you want to increase the intensity of walking without running, try walking uphill,
            using stairs, carrying a weighted backpack or adding short bursts of faster walking.
            Each raises the MET value and the calories burned per minute.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking steps accurately",
      body: (
        <>
          <p>
            Phones count steps only when they are being carried, so they often undercount for people
            who leave their phone on a desk. Wrist-worn trackers count more of the day but can
            mistake arm movements for steps, or miss steps when pushing a trolley or pram. Hip-worn
            pedometers tend to be the most accurate for walking but are less convenient. Whichever
            you use, the trend over weeks matters more than the exact count on any day.
          </p>
          <p>
            If you want to compare devices, walk a counted 500 steps and see what each one records.
            Most are within a few percent for normal walking.
          </p>
        </>
      ),
    },
    {
      heading: "Walking for weight loss: a realistic picture",
      body: (
        <>
          <p>
            Adding steps is one of the most sustainable ways to increase energy expenditure, but it
            works best alongside a calorie target rather than instead of one. An extra 5,000 steps a
            day might burn around 200 kcal for an average adult, which over a week is about 1,400
            kcal, or roughly 0.2 kg of fat. Over a few months, that adds up to a meaningful
            difference, especially when combined with a modest change in diet.
          </p>
          <p>
            Walking also has a protective effect against the slowdown in daily movement that often
            happens during a diet. Keeping steps steady while eating less helps the planned deficit
            stay closer to its intended size.
          </p>
        </>
      ),
    },
    {
      heading: "Walking with joint pain or limited mobility",
      body: (
        <>
          <p>
            For people with joint pain, arthritis or limited mobility, walking is often recommended
            because it is low impact, but it may need to be built up gradually. Shorter, more
            frequent walks, supportive footwear, walking on flat or soft surfaces, and using walking
            poles can all help. If pain increases significantly during or after walking, reduce the
            amount and speak to a physiotherapist or doctor, who can suggest adaptations or
            alternatives such as cycling, swimming or water walking.
          </p>
        </>
      ),
    },
    {
      heading: "Steps for older adults",
      body: (
        <>
          <p>
            For older adults, walking supports balance, strength, cardiovascular health and
            independence. Research on daily steps and longevity suggests that the benefits for
            adults over 60 level off around 6,000 to 8,000 steps a day, a lower threshold than for
            younger adults. Combining walking with strength and balance exercises gives the greatest
            benefit for maintaining mobility and reducing fall risk.
          </p>
        </>
      ),
    },
    {
      heading: "Turning steps into a weekly target",
      body: (
        <>
          <p>
            Daily step counts vary with work, weather and plans, so it can help to think in weekly
            totals. A target of 56,000 steps a week is the same as 8,000 a day on average, but it
            allows a busy day with 4,000 steps to be balanced by a weekend walk of 15,000. Looking
            at the week also makes it easier to see trends: if your weekly total has fallen by
            10,000 steps over a month, your daily energy expenditure has fallen by roughly 400 kcal
            a week, which may explain a slowdown in weight loss.
          </p>
          <p>
            Many fitness apps show weekly averages. Checking them once a week, alongside your weight
            trend, gives you a simple way to keep activity on track.
          </p>
        </>
      ),
    },
    {
      heading: "Walking and recovery from training",
      body: (
        <>
          <p>
            Walking is one of the few forms of activity that adds meaningful energy expenditure
            without interfering much with recovery from strength training or harder cardio. Easy
            walking increases blood flow and can help muscles feel less stiff after hard sessions.
            For people who lift weights, a daily step target is often a better way to increase
            energy expenditure than adding extra high-intensity cardio, which can compete with
            recovery and strength gains.
          </p>
        </>
      ),
    },
    {
      heading: "Steps on rest days",
      body: (
        <>
          <p>
            Rest days from the gym are not rest days from moving. Keeping daily steps reasonably
            steady on rest days helps keep total weekly energy expenditure consistent, which matters
            during a diet. A relaxed walk, a walk to the shops or a longer stroll with friends or
            family can easily add several thousand steps without adding fatigue.
          </p>
        </>
      ),
    },
    {
      heading: "Building the habit",
      body: (
        <>
          <p>
            The hardest part of walking more is usually remembering to do it. Linking walks to
            existing routines makes it automatic: a walk after lunch, a walk while on a regular
            phone call, or a walk before the evening meal. Setting a modest target, reaching it
            consistently for a few weeks and only then raising it builds the habit more reliably
            than setting an ambitious target from the start. Tracking steps and seeing the weekly
            total rise is motivating in itself, and many people find that once walking becomes
            routine, they miss it on days when they cannot do it.
          </p>
        </>
      ),
    },
    {
      heading: "Calories from steps compared with other activities",
      body: (
        <>
          <p>
            Ten thousand steps at an average pace burns roughly as much as 35 to 45 minutes of
            moderate cycling or 25 to 30 minutes of running for the same person. The difference is
            that steps are usually spread across the day and do not require changing clothes,
            travelling to a gym or recovering afterward. For many people, that convenience makes
            walking the most reliable way to increase activity over months and years.
          </p>
        </>
      ),
    },
    {
      heading: "How walking speed changes the result",
      body: (
        <>
          <p>
            The same 10,000 steps take very different amounts of time at different speeds. At a slow
            stroll of 2 mph, an average adult might need over two hours to cover the distance; at a
            fast 4 mph, closer to an hour. Because slower walking uses fewer calories per minute but
            takes longer, the total calories for a given number of steps do not change as much as
            you might expect. Faster walking still burns a little more per step, and it brings
            greater fitness benefits, but the biggest driver of calories from walking is how far you
            walk, which is set by your steps and stride.
          </p>
          <p>
            If your goal is fitness, aim to include some brisk walking each day. If your goal is
            simply to move more and burn more energy, total steps matter most, whatever the pace.
          </p>
        </>
      ),
    },
    {
      heading: "Hills, stairs and carrying loads",
      body: (
        <>
          <p>
            The calculator assumes walking on flat ground. Walking uphill, climbing stairs or
            carrying a load all increase the energy cost considerably. Walking up a moderate incline
            can raise the MET value by 50 percent or more compared with flat walking at the same
            speed, and climbing stairs can be several times as demanding as walking on the flat.
            Carrying a backpack or shopping also increases energy use roughly in proportion to the
            extra weight.
          </p>
          <p>
            If much of your walking involves hills or stairs, your real calorie burn is likely
            higher than the calculator's estimate. If you want to increase the energy cost of
            walking without walking further, adding hills or stairs is an efficient way to do it.
          </p>
        </>
      ),
    },
    {
      heading: "Using steps to estimate your activity level",
      body: (
        <>
          <p>
            Daily steps are a practical way to choose an activity level for a TDEE or maintenance
            calculator. As a rough guide, fewer than 5,000 steps a day fits a sedentary level, 5,000
            to 7,500 a light level, and 7,500 to 10,000 a moderate level, before counting any formal
            exercise. People who regularly walk more than 12,000 steps a day, or who are on their
            feet for work, may fit a very active level once training is added. Checking your average
            over a few weeks gives a more honest picture than guessing, and it makes your calorie
            targets more accurate.
          </p>
        </>
      ),
    },
    {
      heading: "Steps for children and teenagers",
      body: (
        <>
          <p>
            Children and teenagers generally take more steps than adults, and guidelines often
            suggest around 60 minutes of moderate to vigorous activity a day for young people. Step
            counts for active children commonly range from 10,000 to 15,000 a day. For young people,
            the focus should be on active play, sport and enjoyment rather than calorie counting,
            and calorie calculations based on adult formulas are not appropriate for setting their
            food intake.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            A woman who is 165 cm tall and weighs 68 kg walks 8,000 steps a day at an average pace.
            Her estimated stride is about 68 cm, so 8,000 steps cover roughly 5.5 km, or 3.4 miles.
            At 3 mph, that takes about 68 minutes of walking spread through her day. At a MET value
            of 3.5, she uses about 4.2 kcal a minute while walking, which comes to roughly 280 kcal
            across her 8,000 steps, or about 35 kcal per 1,000 steps.
          </p>
          <p>
            If she raised her daily average to 11,000 steps, she would add around 105 kcal a day, or
            about 735 kcal a week, with no change to her diet and no extra workouts. Over three
            months, that is the energy equivalent of roughly 1 kg of body fat, which shows how
            small, steady changes in daily movement add up.
          </p>
        </>
      ),
    },
    {
      heading: "Indoor walking options",
      body: (
        <>
          <p>
            Bad weather, long work hours and safety concerns can all make outdoor walking difficult.
            Treadmills, walking pads under a standing desk, indoor shopping centres, stair climbing
            at home and following along with indoor walking videos are all ways to keep steps up.
            Even pacing during phone calls or walking around the house during adverts adds up over a
            day. The best option is whichever you will actually use consistently.
          </p>
        </>
      ),
    },
    {
      heading: "Steps during a diet versus maintenance",
      body: (
        <>
          <p>
            During a fat-loss phase, keeping steps steady is one of the most effective ways to
            protect your deficit. As calories come down, energy levels can dip, and people often
            start moving less without noticing, taking the lift, driving short distances and sitting
            more in the evenings. Over weeks, that can remove several hundred calories a day of
            expenditure. Setting a daily step floor, such as 8,000 steps, and sticking to it
            throughout the diet keeps that from happening. During maintenance, the same habit helps
            hold weight steady and makes it easier to enjoy more food while staying in balance.
          </p>
        </>
      ),
    },
    {
      heading: "Small steps add up",
      body: (
        <>
          <p>
            If 10,000 feels out of reach, start with what you can do. Adding 1,000 steps a day each
            week, roughly ten minutes of walking, takes most people from 4,000 to 8,000 steps within
            a month without any dramatic change to their routine.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Build a daily step plan around your routine",
    whenToUse:
      "When you want to raise your daily steps gradually without adding formal exercise sessions.",
    pasteIn:
      "Your current average daily steps, your target, and a description of a typical weekday and weekend.",
    text: `My current average is [steps] steps a day. I want to reach [target] steps a day.

A typical weekday: [describe work, commute, meals, evenings]
A typical weekend day: [describe]

1. Suggest a gradual plan to reach the target over [weeks] weeks.
2. Give me five specific ways to add steps into my existing routine without extra workouts.
3. Estimate how many extra calories a week the target adds, using about [kcal per 1,000 steps] per 1,000 steps.
4. Suggest how to keep steps up on busy or bad-weather days.`,
  },
  forCoaches: {
    heading: "Using step targets with clients",
    body: (
      <>
        <p>
          A daily step target is one of the simplest and most effective habits to give a new client.
          It is easy to understand, easy to measure and makes a real difference to energy
          expenditure.
        </p>
        <p>
          Start from the client's current average, not from 10,000. A client averaging 4,000 steps
          will find 6,000 achievable and motivating; 10,000 may feel impossible.
        </p>
        <p>
          Watch for steps falling during a diet. If weight loss stalls, checking step counts is
          often quicker and more revealing than changing calories.
        </p>
      </>
    ),
  },
  pitch: {
    key: "check-ins",
    heading: "Track steps alongside the rest of the plan",
    body: (
      <>
        <p>
          In Traiv, weekly check-ins capture habits such as daily steps alongside weight,
          measurements and photos, so you can see how movement and progress relate for each client.
        </p>
      </>
    ),
  },
  next: [
    { label: "Estimate calories for other activities", href: "/tools/calories-burned-calculator" },
    { label: "Find your total daily calorie burn", href: "/tools/tdee-calculator" },
  ],
  nextPitch: "Setting step targets for clients? Traiv tracks habits at every check-in.",
  faq: [
    {
      q: "How many calories do 10,000 steps burn?",
      a: "Roughly 300 to 500 kcal for most adults, depending on body weight and walking speed.",
    },
    {
      q: "How many calories are burned per 1,000 steps?",
      a: "About 30 to 50 kcal for most people, more if you are heavier or walk faster.",
    },
    {
      q: "How far is 10,000 steps?",
      a: "About 7 to 8 km (4 to 5 miles) for most adults, depending on stride length.",
    },
    {
      q: "Is 10,000 steps a day necessary?",
      a: "No. Health benefits rise steadily from lower step counts and level off around 6,000 to 10,000 steps a day depending on age.",
    },
    {
      q: "Do steps count as exercise?",
      a: "Yes. Walking is moderate physical activity, especially at a brisk pace, and counts toward weekly activity guidelines.",
    },
    {
      q: "Will walking help me lose weight?",
      a: "Yes, by adding to daily energy expenditure without much effect on appetite. It works best combined with a calorie target.",
    },
    {
      q: "How accurate are step counters?",
      a: "Most phones and watches are reasonably accurate for normal walking but can miscount during other activities.",
    },
    {
      q: "Does walking pace matter?",
      a: "Faster walking burns more calories per minute and offers greater fitness benefits, though total steps still matter most for overall expenditure.",
    },
    {
      q: "How long does it take to walk 10,000 steps?",
      a: "Around 80 to 100 minutes at an average pace, though most people accumulate them through the day rather than in one walk.",
    },
    {
      q: "Should I eat back calories from steps?",
      a: "Not if your daily calorie target already includes your usual activity. Only consider it if your target assumes a sedentary day.",
    },
    {
      q: "Is walking after meals helpful?",
      a: "Yes. Short walks after meals can modestly improve blood sugar responses and add steps easily.",
    },
  ],
  keepGoing: [
    { label: "Calories burned calculator", href: "/tools/calories-burned-calculator" },
    { label: "TDEE calculator", href: "/tools/tdee-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "How check-ins work in Traiv", href: "/features/check-ins" },
  ],
  close: {
    heading: "Steps, habits and progress for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
