import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Refeed Day Calculator: Calories and Carbs for a Refeed",
  description:
    "Free refeed day calculator. Set a refeed at maintenance with the extra calories as carbohydrate, compare it with your diet days and see how often to refeed.",
  eyebrow: "Free tool · Nutrition",
  h1: "Refeed day calculator",
  intro: (
    <>
      <p>
        A refeed is a planned day of eating at maintenance, mostly by adding carbohydrate, in the
        middle of a fat-loss phase. Enter your maintenance, your daily deficit and how long you have
        been dieting, choose a protein level, and this calculator shows your normal diet day next to
        a refeed day, and how often refeeds make sense.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What is a refeed day?",
    answer: (
      <>
        <p>
          A refeed day raises calories to about maintenance for one day, with nearly all of the
          extra coming from carbohydrate. Protein stays the same and fat is kept fairly low. For
          someone dieting at 2,100 kcal with a maintenance of 2,600, a refeed adds about 500 kcal,
          mostly as 120 to 150 g of extra carbohydrate.
        </p>
        <p>
          Refeeds are usually used after four or more weeks of dieting, once every one or two weeks.
          They refill muscle glycogen, which can improve training, and give a short psychological
          break from restriction.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator works",
      body: (
        <>
          <ul>
            <li>
              <strong>Diet day:</strong> maintenance minus your deficit. Protein is your chosen
              share of maintenance (25, 30 or 35 percent) divided by 4. Fat is 25 percent of the
              diet-day calories, and carbohydrate fills the rest.
            </li>
            <li>
              <strong>Refeed day:</strong> calories at maintenance, the same grams of protein, fat
              at 15 percent of calories, and carbohydrate filling the rest. Most of the jump in
              calories lands on carbohydrate.
            </li>
            <li>
              <strong>Frequency:</strong> not yet needed under four weeks of dieting; once every two
              weeks from four to eight weeks; once a week after eight weeks or when the deficit is
              750 kcal or more.
            </li>
          </ul>
          <p>
            Using the defaults, maintenance 2,600, a 500 kcal deficit and 8 weeks with standard
            protein, diet days are 2,100 kcal with about 195 g protein, 58 g fat and 199 g
            carbohydrate. The refeed day is 2,600 kcal with the same protein, about 43 g fat and 358
            g carbohydrate, an increase of about 159 g of carbohydrate.
          </p>
        </>
      ),
    },
    {
      heading: "Why carbohydrate, not fat?",
      body: (
        <>
          <p>
            Refeeds focus on carbohydrate for two reasons. First, carbohydrate refills muscle
            glycogen, which runs low during a diet, so the following training sessions often feel
            noticeably better. Second, there is evidence that carbohydrate overfeeding has a bigger
            short-term effect on leptin, a hormone involved in hunger and energy regulation that
            falls during dieting, than fat overfeeding does. That effect is short-lived, but it may
            contribute to the sense of relief many people feel after a refeed.
          </p>
          <p>
            Keeping fat low on the refeed also keeps the extra calories under control. A high-fat
            refeed day easily runs well above maintenance without delivering the training benefit.
          </p>
        </>
      ),
    },
    {
      heading: "What a refeed can and cannot do",
      body: (
        <>
          <p>
            A single day at maintenance will not reverse metabolic adaptation, restart fat loss on
            its own or 'shock' the metabolism. Its effects are modest and mainly practical: better
            training, a more manageable diet, and a planned point in the week to look forward to.
            That last effect is not trivial; diets end mostly because people stop following them.
          </p>
          <p>
            Some research on longer breaks, such as one to two weeks at maintenance after every few
            weeks of dieting, suggests these can help preserve resting metabolic rate and muscle.
            Single refeed days are less studied but are a common, low-risk tool, particularly for
            leaner people and those in longer diets.
          </p>
        </>
      ),
    },
    {
      heading: "What a refeed day looks like",
      body: (
        <>
          <p>
            A refeed day is a normal day of eating with more starchy and sweet carbohydrate, not a
            free-for-all. For a refeed of roughly 360 g of carbohydrate:
          </p>
          <ul>
            <li>
              <strong>Breakfast:</strong> a large bowl of oats with banana and honey, plus Greek
              yoghurt.
            </li>
            <li>
              <strong>Lunch:</strong> chicken with a big portion of rice and fruit on the side.
            </li>
            <li>
              <strong>Pre-training:</strong> bagel with jam.
            </li>
            <li>
              <strong>Dinner:</strong> fish with potatoes and vegetables, and a bowl of cereal later
              in the evening.
            </li>
          </ul>
          <p>
            Place the refeed on or before a hard training day to make the best use of the extra
            glycogen.
          </p>
        </>
      ),
    },
    {
      heading: "The scale after a refeed",
      body: (
        <>
          <p>
            Expect weight to rise the next morning, often by 0.5 to 1.5 kg. Every gram of stored
            glycogen is held with about three grams of water, and there is more food in the gut.
            This is not fat. Weight usually returns to the trend within two to four days, and many
            people see a lower reading than before the refeed once the water settles. Plan weigh-ins
            and weekly averages with this in mind.
          </p>
        </>
      ),
    },
    {
      heading: "Refeeds versus cheat days",
      body: (
        <>
          <p>
            A cheat day usually has no limits and no structure, and it can easily wipe out a week's
            deficit. A refeed has a calorie target at maintenance, a macro plan and a defined
            purpose. If you want flexibility for a social occasion, a planned higher day within the
            weekly budget is a better tool than an open-ended cheat day.
          </p>
        </>
      ),
    },
    {
      heading: "Refeeds versus diet breaks",
      body: (
        <>
          <p>
            A refeed is one day, sometimes two, at maintenance. A diet break is a longer period,
            usually one to two weeks, at maintenance before returning to the diet. Both aim to
            relieve some of the physical and psychological strain of dieting, but they work on
            different timescales.
          </p>
          <p>
            Diet breaks have more direct research behind them. A notable 2018 study, the MATADOR
            trial, found that men who alternated two weeks of dieting with two weeks at maintenance
            lost more fat and kept more of it off than men who dieted continuously, although the
            diet took longer overall. Refeed days are less studied but are easier to fit into a
            schedule. Some people use both: weekly or fortnightly refeeds, with a longer diet break
            every eight to twelve weeks.
          </p>
        </>
      ),
    },
    {
      heading: "When refeeds help most",
      body: (
        <>
          <p>
            Refeeds tend to help most when the diet is long, the deficit is significant, body fat is
            already low and training is demanding. In those conditions glycogen runs low, training
            quality drops and hunger is high, so a day of extra carbohydrate makes a noticeable
            difference. For someone early in a diet with plenty of body fat and moderate training,
            refeeds offer less benefit, and keeping the deficit steady usually works just as well.
          </p>
        </>
      ),
    },
    {
      heading: "Fitting a refeed into the week",
      body: (
        <>
          <p>
            The simplest approach is to treat the refeed as one day of your week and accept that
            weekly fat loss will be slightly lower. A 500 kcal daily deficit over six days with one
            refeed at maintenance gives a weekly deficit of 3,000 kcal instead of 3,500. That is
            still steady progress.
          </p>
          <p>
            Alternatively, you can slightly enlarge the deficit on the other days to keep the weekly
            total the same, which turns the refeed into a form of calorie cycling. That approach
            works but makes the remaining days harder, so most people are better served by accepting
            the slightly slower pace.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing the protein level",
      body: (
        <>
          <p>
            The calculator sets protein as a share of maintenance calories, which keeps it
            proportional to the size and activity of the person. The standard setting, 30 percent,
            works out to about 1.8 to 2.4 g per kg for most people, which is in the range
            recommended during a diet. The high setting suits very lean dieters and those in long or
            aggressive diets. The moderate setting suits people who prefer more carbohydrate and are
            not as lean. Whichever you choose, keep it the same on refeed days so that the extra
            calories go to carbohydrate.
          </p>
        </>
      ),
    },
    {
      heading: "Signs a refeed worked",
      body: (
        <>
          <ul>
            <li>
              <strong>Training improves</strong> in the next one or two sessions, with more
              strength, a better pump and less fatigue.
            </li>
            <li>
              <strong>Mood and energy lift</strong> for a day or two after the refeed.
            </li>
            <li>
              <strong>Hunger is easier to manage</strong> in the days that follow.
            </li>
            <li>
              <strong>The scale returns to the trend</strong> within a few days, often slightly
              lower than before.
            </li>
          </ul>
          <p>
            If a refeed instead leads to several days of increased cravings or overeating, it may
            not suit you, or it may need to be smaller and more structured.
          </p>
        </>
      ),
    },
    {
      heading: "Planning refeeds across a diet",
      body: (
        <>
          <p>
            A simple schedule for a 12-week diet might look like this: no refeeds for the first four
            weeks, a refeed every second week from weeks five to eight, and one each week from week
            nine onward, with a full diet break of one to two weeks at maintenance midway if the
            diet is running longer. That structure matches the increasing strain of a diet as it
            progresses and body fat falls.
          </p>
          <p>
            Adjust from experience. If refeeds help your training and mood, keep them. If they
            trigger cravings, reduce their size or frequency. There is no single correct schedule.
          </p>
        </>
      ),
    },
    {
      heading: "Refeeds for women",
      body: (
        <>
          <p>
            Women's weight fluctuates across the menstrual cycle because of water retention, and
            hunger and cravings often rise in the days before a period. Some women find it helpful
            to place a refeed in that phase, when restriction feels hardest. Others prefer to keep
            refeeds tied to training. Comparing weight in the same phase of each cycle gives a
            clearer picture of progress than week-to-week comparisons.
          </p>
        </>
      ),
    },
    {
      heading: "Refeed foods that work well",
      body: (
        <>
          <p>
            Choose carbohydrate foods that are easy to eat in larger amounts and low in fat: rice,
            potatoes, pasta, bread, bagels, oats, cereals, fruit, juice, honey and low-fat yoghurt.
            Foods that are high in both carbohydrate and fat, such as pastries, chocolate and fried
            foods, make it hard to keep fat low and calories at maintenance. Enjoy them occasionally
            if they fit, but they are not the most effective refeed foods.
          </p>
        </>
      ),
    },
    {
      heading: "Refeeds and leptin",
      body: (
        <>
          <p>
            Leptin is a hormone produced by fat tissue that helps regulate appetite and energy
            expenditure. When you diet, leptin levels fall, more than the loss of fat alone would
            predict, and lower leptin is associated with increased hunger and reduced energy
            expenditure. Short-term overfeeding, particularly with carbohydrate, can raise leptin
            levels temporarily, which is one theory behind refeed days.
          </p>
          <p>
            The effect is real but short-lived: leptin rises during and shortly after the refeed and
            then falls back as dieting resumes. Whether that brief rise has a meaningful effect on
            fat loss over weeks is uncertain. The more reliable benefits of refeeds are improved
            training from restored glycogen and the psychological relief of a higher-calorie day.
          </p>
        </>
      ),
    },
    {
      heading: "Two-day refeeds",
      body: (
        <>
          <p>
            Some people, especially very lean athletes in long diets, use two consecutive refeed
            days instead of one. Glycogen stores take more than a day to fill fully when they are
            depleted, so a second day can restore more and give a longer break from restriction. The
            trade-off is a smaller weekly deficit. Two-day refeeds are usually reserved for the
            later stages of a long diet, and some people find them easier to manage around weekends.
          </p>
        </>
      ),
    },
    {
      heading: "When to skip a refeed",
      body: (
        <>
          <p>
            There are times when a planned refeed is better skipped. If weight loss has stalled for
            several weeks and tracking has been inconsistent, a refeed adds another variable before
            you know where you stand. If you are in the last week or two before an event and need to
            be at a specific weight, a refeed's water gain may be unhelpful. And if previous refeeds
            led to several days of overeating, it may be better to replace them with a smaller
            increase in carbohydrate spread across a few days.
          </p>
          <p>
            Skipping a refeed occasionally does no harm. The deficit continues, and you can return
            to the schedule the following week.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking on a refeed day",
      body: (
        <>
          <p>
            Track refeed days as carefully as diet days. The aim is to eat at maintenance, not well
            above it, and without tracking, a refeed can easily become a 1,000 to 1,500 kcal
            surplus. Plan the refeed meals in advance, weigh the carbohydrate portions, and keep fat
            low. A refeed done well should feel generous without leaving you uncomfortably full.
          </p>
        </>
      ),
    },
    {
      heading: "Refeeds for different body sizes",
      body: (
        <>
          <p>
            Because the calculator works from maintenance calories, the size of a refeed scales with
            the person. A smaller person with a maintenance of 1,800 kcal and a 400 kcal deficit has
            a refeed that adds 400 kcal, mostly from about 100 g of extra carbohydrate. A larger,
            more active person with a maintenance of 3,200 kcal and a 700 kcal deficit adds 700
            kcal, nearly 175 g of extra carbohydrate. Both refeeds bring calories back to
            maintenance; the absolute amounts simply reflect different needs.
          </p>
          <p>
            Smaller people and those with lower maintenance levels sometimes find a full refeed hard
            to eat without feeling overly full. In that case, a half refeed, bringing calories
            halfway back to maintenance, still offers some of the benefit with less discomfort.
          </p>
        </>
      ),
    },
    {
      heading: "Combining refeeds with training",
      body: (
        <>
          <p>
            To make the most of a refeed, schedule it on or the day before your hardest training
            day, often a lower-body or high-volume session. The extra glycogen supports better
            performance, and better training sessions during a diet help preserve muscle. Some
            people prefer to eat most of the extra carbohydrate in the meals before and after the
            session rather than spreading it evenly, which concentrates the benefit where it matters
            most.
          </p>
        </>
      ),
    },
    {
      heading: "Refeeds and appetite the next day",
      body: (
        <>
          <p>
            Some people find they are hungrier the day after a refeed, while others feel more
            satisfied and find the next few diet days easier. If you are in the first group, try
            making the refeed a little smaller or moving more of the extra carbohydrate to the meal
            around training, which tends to be used most efficiently. Keeping protein high and
            including plenty of vegetables on the day after a refeed also helps settle appetite.
          </p>
          <p>
            Over time, most people learn how their body responds and can adjust the size and timing
            of refeeds to suit them.
          </p>
        </>
      ),
    },
    {
      heading: "After the refeed",
      body: (
        <>
          <p>
            Return to your normal diet targets the following day. There is no need to compensate by
            eating less to make up for the refeed; it was part of the plan. Expect the scale to be
            higher for a day or two, keep training as normal, and judge progress from the weekly
            average rather than the morning after.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using refeeds with clients",
    body: (
      <>
        <p>
          Refeeds are most useful for clients who are already lean, who have been dieting for a
          while, and who train hard. A client in their second week of a first diet does not need
          one.
        </p>
        <p>
          Set the refeed in advance and anchor it to training. A refeed planned for leg day is more
          useful and easier to stick to than one taken whenever motivation dips.
        </p>
        <p>
          Prepare clients for the weight jump. A client who expects it will see it as water; a
          client who does not may decide refeeds 'don't work' for them.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Plan diet and refeed days in one place",
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
    { label: "Plan a gradual return to maintenance", href: "/tools/reverse-diet-calculator" },
    { label: "Cycle carbohydrate across the week", href: "/tools/carb-cycling-calculator" },
  ],
  nextPitch: "Coaching long diets? Traiv keeps each client's targets and food logs together.",
  faq: [
    {
      q: "What is a refeed day?",
      a: "A planned day at maintenance calories during a diet, with the extra calories coming mostly from carbohydrate.",
    },
    {
      q: "How often should I have a refeed?",
      a: "Usually once every one to two weeks after the first four weeks of a diet, more often when leaner or with a larger deficit.",
    },
    {
      q: "Will a refeed day ruin my progress?",
      a: "No. It removes one day's deficit, a small fraction of the week, and the weight gained the next day is mostly water.",
    },
    {
      q: "What should I eat on a refeed day?",
      a: "Mostly carbohydrate-rich foods such as rice, potatoes, oats, bread, fruit and cereal, with your normal protein and low fat.",
    },
    {
      q: "Is a refeed the same as a cheat day?",
      a: "No. A refeed has a calorie target and macro plan; a cheat day usually has neither and can undo much more progress.",
    },
    {
      q: "Why did my weight go up after a refeed?",
      a: "Glycogen stored with water and extra food in the gut. It usually settles within a few days.",
    },
    {
      q: "Do I need refeeds to lose fat?",
      a: "No. They are optional. Some people find them helpful for training and adherence; others prefer a steady target every day.",
    },
    {
      q: "Should I refeed if I am not training hard?",
      a: "The training benefit is smaller, but a planned maintenance day can still help with adherence during a long diet.",
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
    { label: "Reverse diet calculator", href: "/tools/reverse-diet-calculator" },
    { label: "Carb cycling calculator", href: "/tools/carb-cycling-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Long diets that clients can actually finish",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
