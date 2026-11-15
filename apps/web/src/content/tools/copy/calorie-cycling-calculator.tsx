import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Calorie Cycling Calculator: Training and Rest Day Calories",
  description:
    "Free calorie cycling calculator. Shift calories toward training days and away from rest days while keeping your weekly total the same, with macros for each.",
  eyebrow: "Free tool · Nutrition",
  h1: "Calorie cycling calculator",
  intro: (
    <>
      <p>
        Calorie cycling means eating more on the days you train and less on the days you rest,
        without changing your weekly total. Start from a daily average or from maintenance plus a
        goal, choose your training days and how big the training-day boost should be, and this
        calculator gives you calories and macros for each type of day.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you cycle calories?",
    answer: (
      <>
        <p>
          Pick a weekly calorie total, the same as your daily target times seven. Give training days
          a percentage more than the daily average and spread the difference across rest days so the
          week still adds up. With a 2,400 kcal average, four training days and a 20 percent boost,
          training days are 2,880 kcal and rest days 1,760 kcal.
        </p>
        <p>
          Weight change depends on the weekly total, so cycling does not change your results on the
          scale. It changes how the week feels: more food when you need it, less when you do not.
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
              <strong>Weekly total:</strong> your daily average × 7. If you start from maintenance,
              the average is maintenance adjusted by your goal.
            </li>
            <li>
              <strong>Training days:</strong> the average plus 10, 20 or 30 percent.
            </li>
            <li>
              <strong>Rest days:</strong> whatever is left of the weekly total, divided by the
              number of rest days.
            </li>
            <li>
              <strong>Macros:</strong> protein stays the same every day at 30 percent of the average
              calories. Training days run lower in fat (20 percent of calories) and higher in
              carbohydrate; rest days run higher in fat (35 percent).
            </li>
          </ol>
          <p>
            The result shows the cycled week and the flat week side by side, so you can see they are
            identical.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a boost",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Boost</th>
                  <th scope="col">Training day (2,400 avg, 4 days)</th>
                  <th scope="col">Rest day</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mild (10%)</td>
                  <td>2,640</td>
                  <td>2,080</td>
                </tr>
                <tr>
                  <td>Moderate (20%)</td>
                  <td>2,880</td>
                  <td>1,760</td>
                </tr>
                <tr>
                  <td>Aggressive (30%)</td>
                  <td>3,120</td>
                  <td>1,440</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The more training days you have, the more each rest day has to give up. With five or six
            training days and an aggressive boost, rest days can fall uncomfortably low; the result
            warns you if they drop below 1,200 kcal.
          </p>
        </>
      ),
    },
    {
      heading: "Why people cycle calories",
      body: (
        <>
          <ul>
            <li>
              <strong>Fuel for hard sessions.</strong> More food, especially carbohydrate, on
              training days supports performance and recovery.
            </li>
            <li>
              <strong>Matching appetite.</strong> Many people are hungrier on active days and less
              hungry on rest days.
            </li>
            <li>
              <strong>Social flexibility.</strong> Some people use a version of cycling to save
              calories for weekends or events.
            </li>
            <li>
              <strong>A diet break in miniature.</strong> Higher days during a fat-loss phase can
              make restriction feel less constant.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Calorie cycling versus carb cycling",
      body: (
        <>
          <p>
            The two are closely related. Calorie cycling changes total calories from day to day,
            mostly by changing carbohydrate and fat. Carb cycling keeps protein and fat fixed and
            moves only carbohydrate. In practice the results look similar, because carbohydrate
            makes up most of the difference either way. Calorie cycling is a little simpler to
            explain; carb cycling gives more precise control over protein and fat.
          </p>
        </>
      ),
    },
    {
      heading: "Does it work better than eating the same every day?",
      body: (
        <>
          <p>
            Research comparing intermittent or cycled approaches with continuous dieting at the same
            weekly intake generally finds similar fat loss. A few studies suggest periodic
            higher-calorie days or weeks may reduce some of the metabolic and hormonal adaptations
            to dieting and help retain muscle, but the effects are modest and not consistent. The
            best reason to cycle is that it suits your training and appetite better than a flat
            target.
          </p>
        </>
      ),
    },
    {
      heading: "Planning a cycled week",
      body: (
        <>
          <p>
            Decide training days in advance and keep them consistent where you can. If a session
            moves, swap the days' targets too. Prepare rest-day meals with plenty of protein and
            vegetables so the lower target feels filling, and save foods you enjoy for training
            days, where the extra calories are easy to use. Review the weekly average weight rather
            than the day-to-day changes, which will move around more with cycling because food
            volume and carbohydrate vary.
          </p>
        </>
      ),
    },
    {
      heading: "Calorie cycling around weekends",
      body: (
        <>
          <p>
            One of the most common real-world reasons to cycle calories has nothing to do with
            training: weekends. Many people eat more on Saturdays and Sundays because of social
            plans, meals out and less routine. Rather than seeing that as failure, you can plan for
            it. Lower calories slightly on weekdays and allow more at the weekend, keeping the
            weekly total on target.
          </p>
          <p>
            The same approach works for any predictable event: a weekly family dinner, a regular
            night out or a work lunch. The key is deciding in advance and sticking to the weekday
            targets. Unplanned extra calories on top of a normal week will still add up.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing training days and rest days",
      body: (
        <>
          <p>
            Training days should be the days with your hardest or longest sessions. If you lift on
            some days and do light cardio or walking on others, treat the lifting days as training
            days and the light days as rest days for this purpose. If you train every day but with
            very different intensities, you can treat the two or three hardest days as training
            days.
          </p>
          <p>
            Consistency helps. If your training days change every week, the cycled targets change
            too, which makes planning harder. Many people find it easiest to fix their hardest
            sessions on the same days each week.
          </p>
        </>
      ),
    },
    {
      heading: "Macros on cycled days",
      body: (
        <>
          <p>
            In this calculator, protein stays the same every day, because muscle repair and the
            satiety benefits of protein do not stop on rest days. Training days get a lower share of
            fat and more carbohydrate to support performance. Rest days get a higher share of fat,
            which helps meals feel satisfying when total calories are lower.
          </p>
          <p>
            You can adapt this to your preferences. Some people prefer to keep fat steady and let
            carbohydrate change entirely, which turns calorie cycling into carb cycling. Others keep
            both steady and simply eat larger portions of everything on training days. All of these
            work as long as protein is adequate and the weekly total matches the goal.
          </p>
        </>
      ),
    },
    {
      heading: "When calorie cycling is a bad fit",
      body: (
        <>
          <p>
            Calorie cycling is not for everyone. It can be unhelpful for people with a history of
            disordered eating, because alternating higher and lower days may reinforce restrictive
            or compensatory patterns. It also adds planning, which can reduce adherence for people
            who are already busy or new to tracking. If a single daily target is working, there is
            no need to change it.
          </p>
        </>
      ),
    },
    {
      heading: "A note on intermittent energy restriction",
      body: (
        <>
          <p>
            Some diets take cycling further, alternating full days of very low intake with normal
            days, such as the 5:2 approach or alternate-day fasting. Research comparing these with
            daily calorie restriction generally finds similar weight loss when weekly energy intake
            is the same. Calorie cycling as described here is a gentler form of the same idea, with
            smaller differences between days and no very low days.
          </p>
        </>
      ),
    },
    {
      heading: "Calorie cycling for athletes",
      body: (
        <>
          <p>
            Athletes with demanding schedules often cycle calories without calling it that: more
            food on heavy training and competition days, less on rest days. Endurance athletes in
            particular may need far more on long-session days than on easy days. For them, matching
            intake to training load helps performance and recovery, and avoids underfuelling on the
            hardest days, which can lead to fatigue, illness and injury over time.
          </p>
          <p>
            For this group, the training-day boost may need to be larger than the calculator's
            options, and rest days may not need to drop much at all. The weekly total is still the
            anchor, but it may be higher than a typical maintenance estimate because of the volume
            of training.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking a cycled week",
      body: (
        <>
          <p>
            Plan the week before it starts, marking which days are training and which are rest, and
            write down the targets for each. Logging food against the right day's target is easier
            than trying to remember which target applies. If you use an app, set two meal plans, one
            for each type of day. At the end of the week, check that the total is close to the
            weekly target, which matters more than any single day.
          </p>
        </>
      ),
    },
    {
      heading: "Example meals for each day type",
      body: (
        <>
          <ul>
            <li>
              <strong>Training day breakfast:</strong> oats with milk, banana and protein powder.
            </li>
            <li>
              <strong>Training day lunch:</strong> chicken rice bowl with vegetables.
            </li>
            <li>
              <strong>Training day dinner:</strong> pasta with lean beef and tomato sauce, side
              salad.
            </li>
            <li>
              <strong>Rest day breakfast:</strong> eggs, spinach and a slice of wholegrain toast.
            </li>
            <li>
              <strong>Rest day lunch:</strong> large salad with salmon, avocado and seeds.
            </li>
            <li>
              <strong>Rest day dinner:</strong> grilled chicken thighs with roasted vegetables and a
              little olive oil.
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
            Suppose your target is 2,200 kcal a day for fat loss, 15,400 kcal a week, and you train
            on Monday, Wednesday, Friday and Saturday. With a moderate 20 percent boost, training
            days are 2,640 kcal. Four training days use 10,560 kcal, leaving 4,840 kcal for the
            three rest days, or about 1,613 kcal each. Protein stays at 165 g every day. The week
            still totals 15,400 kcal, exactly as if you had eaten 2,200 every day.
          </p>
          <p>
            If 1,613 kcal feels too low on rest days, a mild 10 percent boost gives training days of
            2,420 and rest days of about 1,907, a smaller difference that many people find easier.
          </p>
        </>
      ),
    },
    {
      heading: "Calorie cycling during a muscle-building phase",
      body: (
        <>
          <p>
            In a gaining phase, calorie cycling can direct more of the surplus to training days,
            where it supports performance and recovery, while keeping rest days near maintenance.
            Set the average to maintenance plus your planned surplus and choose a mild or moderate
            boost. Rest days will be close to maintenance, and training days will carry the surplus.
            This may help limit fat gain, though the evidence that it outperforms an even surplus is
            limited. The weekly trend on the scale remains the best guide to whether the surplus is
            the right size.
          </p>
        </>
      ),
    },
    {
      heading: "Calorie cycling and the scale",
      body: (
        <>
          <p>
            Daily weight fluctuates more with calorie cycling than with an even intake. Training
            days bring more food and more carbohydrate, which increases glycogen and the water
            stored with it, and food volume in the gut is higher. The morning after a high day, the
            scale is often up by a few hundred grams to a kilogram; after a few low days, it drops.
            None of this reflects fat change.
          </p>
          <p>
            Use the weekly average and compare it week to week. If you want cleaner data, weigh on
            the same day each week relative to your cycle, such as the morning after a rest day, but
            daily weighing averaged over the week remains the most reliable approach.
          </p>
        </>
      ),
    },
    {
      heading: "Combining calorie cycling with refeeds and diet breaks",
      body: (
        <>
          <p>
            Calorie cycling, refeeds and diet breaks can be combined in a long diet. A typical
            approach is calorie cycling during normal weeks, a refeed day at maintenance every week
            or two as the diet progresses, and a one- to two-week diet break at maintenance every
            eight to twelve weeks. Each adds flexibility and may help adherence, but each also
            slightly reduces the weekly deficit, so the diet takes a little longer.
          </p>
        </>
      ),
    },
    {
      heading: "Who benefits most",
      body: (
        <>
          <p>
            Calorie cycling tends to work best for people with a consistent training schedule, who
            are comfortable planning meals a few days ahead, and who notice a clear difference in
            hunger between training and rest days. It can also help people who struggle with the
            monotony of a fixed daily target and find that knowing a higher day is coming makes the
            lower days easier.
          </p>
          <p>
            It tends to work less well for people whose training changes from week to week, who
            prefer simple rules, or who find that lower days lead to overeating. For them, a single
            daily target with an occasional planned higher day is usually the better option.
          </p>
        </>
      ),
    },
    {
      heading: "Adjusting the plan",
      body: (
        <>
          <p>
            After two to three weeks, check the weekly average weight against your goal. If weight
            is not moving as planned, adjust the average calories rather than the boost; the boost
            only changes how calories are distributed. If training days feel great but rest days are
            a struggle, reduce the boost. If training still feels flat on high days, move more of
            the extra calories into the meals immediately before and after the session.
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
              <strong>Adding high days without lowering rest days.</strong> The weekly total then
              rises and progress stalls.
            </li>
            <li>
              <strong>Choosing too large a boost.</strong> Rest days become so low that they lead to
              overeating.
            </li>
            <li>
              <strong>Treating high days as free days.</strong> High days still have a target; they
              are not unlimited.
            </li>
            <li>
              <strong>Cutting protein on rest days.</strong> Protein should stay the same every day.
            </li>
            <li>
              <strong>Judging progress by single weigh-ins.</strong> Daily weight swings more with
              cycling; use weekly averages.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "How long to keep cycling",
      body: (
        <>
          <p>
            Calorie cycling can be used for a single phase or as a long-term habit. Many people find
            it fits naturally into their week once they are used to it, especially if their training
            schedule is stable. Review it every month or so: if it is helping you train better and
            stick to your targets, keep going. If it is adding complexity without a clear benefit,
            return to a single daily target.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using calorie cycling with clients",
    body: (
      <>
        <p>
          Calorie cycling works well for clients who already track and want more flexibility, and
          for athletes with heavy training days. It is less helpful for beginners, who usually do
          better with one simple number.
        </p>
        <p>
          Watch the rest days. If a client's rest-day target is too low, they will either feel poor
          or eat more than planned, which erases the benefit. Choose the mildest boost that achieves
          what the client wants.
        </p>
        <p>
          Expect more variation on the scale. Higher training days bring more carbohydrate and
          water, so daily weights swing more. Focus clients on weekly averages.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set training and rest day targets in one plan",
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
    { label: "Cycle carbohydrate instead", href: "/tools/carb-cycling-calculator" },
    { label: "Find your maintenance calories", href: "/tools/maintenance-calorie-calculator" },
  ],
  nextPitch: "Coaching clients who train on set days? Traiv keeps their targets and logs together.",
  faq: [
    {
      q: "What is calorie cycling?",
      a: "Eating more on training days and less on rest days while keeping the weekly total the same as eating your average every day.",
    },
    {
      q: "Does calorie cycling help you lose more weight?",
      a: "Not by itself. Weekly calories decide weight change. Cycling can make a diet easier to follow and support training.",
    },
    {
      q: "How much more should I eat on training days?",
      a: "10 to 20 percent above your daily average suits most people. Larger boosts make rest days quite restrictive.",
    },
    {
      q: "What should I eat more of on training days?",
      a: "Mostly carbohydrate, especially around the session, with protein kept steady.",
    },
    {
      q: "Can I use calorie cycling to bulk?",
      a: "Yes. Start from maintenance plus a small surplus; training days get more and rest days slightly less, with the week in surplus.",
    },
    {
      q: "Why does my weight jump around more?",
      a: "Training days bring more food and carbohydrate, which holds water. Compare weekly averages rather than single days.",
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
    { label: "Carb cycling calculator", href: "/tools/carb-cycling-calculator" },
    { label: "Maintenance calorie calculator", href: "/tools/maintenance-calorie-calculator" },
    { label: "Calories per meal calculator", href: "/tools/calories-per-meal-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Targets that match how each client trains",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
