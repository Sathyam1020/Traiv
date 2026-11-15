import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Intermittent Fasting Calculator: Your Eating Window",
  description:
    "Free intermittent fasting calculator. Pick 16:8, 18:6, 20:4, OMAD or 5:2 and set your first or last meal to see your daily eating and fasting windows.",
  eyebrow: "Free tool · Nutrition",
  h1: "Intermittent fasting calculator",
  intro: (
    <>
      <p>
        Intermittent fasting means eating within a set window each day and fasting for the rest.
        Choose a protocol, set the time of your first or last meal, and this calculator shows
        exactly when your eating window opens and closes, when your fast begins and ends, and
        whether you are eating or fasting right now.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How does intermittent fasting work?",
    answer: (
      <>
        <p>
          You split each day into a fasting period and an eating window. On 16:8, you fast for 16
          hours and eat within 8. If your last meal is at 8 pm, your eating window runs from noon to
          8 pm, and you fast from 8 pm until noon the next day.
        </p>
        <p>
          Fasting is a way of structuring when you eat, not a separate way of losing fat. In studies
          that match total calories, intermittent fasting produces similar weight loss to eating the
          same amount spread across the day. It works for many people because a shorter eating
          window makes it easier to eat less.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "The protocols",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Protocol</th>
                  <th scope="col">Fast</th>
                  <th scope="col">Eat</th>
                  <th scope="col">What it suits</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>16:8</td>
                  <td>16 hours</td>
                  <td>8 hours</td>
                  <td>Most people; easy to fit around normal meals</td>
                </tr>
                <tr>
                  <td>18:6</td>
                  <td>18 hours</td>
                  <td>6 hours</td>
                  <td>People comfortable with 16:8 who want a shorter window</td>
                </tr>
                <tr>
                  <td>20:4</td>
                  <td>20 hours</td>
                  <td>4 hours</td>
                  <td>Experienced fasters; one main meal plus a smaller one</td>
                </tr>
                <tr>
                  <td>OMAD</td>
                  <td>About 23 hours</td>
                  <td>About 1 hour</td>
                  <td>Very experienced fasters; hard to meet nutrient needs</td>
                </tr>
                <tr>
                  <td>5:2</td>
                  <td>Two low-calorie days</td>
                  <td>Five normal days</td>
                  <td>People who prefer full normal days to daily windows</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Most people start with a 12- or 14-hour overnight fast, which many already do naturally,
            and move to 16:8 once that feels comfortable. Longer daily fasts are not necessarily
            better; the best protocol is the one you can follow while meeting your nutrition needs.
          </p>
        </>
      ),
    },
    {
      heading: "Setting your window",
      body: (
        <>
          <p>
            Choose whether to anchor the window to your first or last meal. Anchoring to the last
            meal suits people who want to eat dinner with family or friends and skip breakfast.
            Anchoring to the first meal suits people who prefer an early start and a finished day. A
            16:8 window from 8 am to 4 pm and one from noon to 8 pm are both valid; the right one is
            whichever fits your day and your training.
          </p>
          <p>
            If you train, consider placing the window so you can eat a meal within a few hours after
            your session. Training fasted is fine for many people, especially for lower-intensity
            sessions, but eating protein reasonably soon afterward supports recovery.
          </p>
        </>
      ),
    },
    {
      heading: "What the research says",
      body: (
        <>
          <p>
            Studies comparing intermittent fasting with daily calorie restriction generally find
            similar weight loss and similar changes in blood markers when total calories are
            matched. Some people find fasting easier to follow because it reduces the number of
            eating decisions and limits late-night snacking. Others find long fasts lead to
            overeating in the eating window, which cancels out the benefit.
          </p>
          <p>
            Early time-restricted eating, with the window earlier in the day, has shown some
            advantages for blood sugar and blood pressure in small studies, possibly because of
            alignment with the body clock. These findings are promising but not yet strong enough to
            say an earlier window is necessary for everyone.
          </p>
        </>
      ),
    },
    {
      heading: "What breaks a fast",
      body: (
        <>
          <p>
            Anything with meaningful calories breaks a fast. Water, black coffee, plain tea and
            other zero-calorie drinks are generally considered fine and can help manage hunger. A
            splash of milk in coffee adds a small amount of energy; most people accept this in
            practice, though strict fasters avoid it. Sugary drinks, juice, milky coffees and snacks
            break the fast.
          </p>
          <p>
            If your goal is weight management, the occasional small exception matters far less than
            total calories over the week. If you are following fasting for other reasons, decide
            your rules in advance and keep them consistent.
          </p>
        </>
      ),
    },
    {
      heading: "Eating well within the window",
      body: (
        <>
          <p>
            A shorter eating window makes it easy to under-eat protein, fibre and micronutrients.
            Plan meals that include a solid protein source, plenty of vegetables and fruit,
            wholegrains or other quality carbohydrate, and healthy fats. On 16:8, two to three meals
            within the window usually works well. On 20:4 or OMAD, getting enough protein and fibre
            in one or two sittings takes more planning and larger portions.
          </p>
          <p>
            Breaking the fast with a balanced meal rather than a large amount of refined
            carbohydrate tends to help with energy and appetite for the rest of the window.
          </p>
        </>
      ),
    },
    {
      heading: "5:2 and other weekly approaches",
      body: (
        <>
          <p>
            The 5:2 approach involves eating normally on five days and restricting intake to about
            500 kcal for women or 600 kcal for men on two non-consecutive days. It is not
            clock-based, so the calculator does not show a window for it. Some people prefer it
            because five days are completely normal; others find the low days hard. Alternate-day
            fasting, which alternates normal and very low days, is a more demanding version with
            similar results in studies to daily calorie restriction.
          </p>
        </>
      ),
    },
    {
      heading: "Who should be careful with fasting",
      body: (
        <>
          <p>
            Intermittent fasting is not suitable for everyone. People who are pregnant or
            breastfeeding, under 18, have a history of eating disorders, have type 1 diabetes, or
            take medication that affects blood sugar should not start fasting without medical
            advice. People with other medical conditions should check with a doctor first. If
            fasting leads to dizziness, persistent headaches, poor sleep or a sense of losing
            control around food, it may not be the right approach.
          </p>
        </>
      ),
    },
    {
      heading: "Common challenges",
      body: (
        <>
          <ul>
            <li>
              <strong>Hunger in the first week.</strong> Usually settles as you adapt. Water, black
              coffee and keeping busy help.
            </li>
            <li>
              <strong>Overeating in the window.</strong> Plan meals in advance and focus on protein
              and fibre.
            </li>
            <li>
              <strong>Social meals.</strong> Move the window on days with events, or treat them as
              exceptions.
            </li>
            <li>
              <strong>Training performance.</strong> Place the window around harder sessions if
              fasted training feels poor.
            </li>
            <li>
              <strong>Sleep.</strong> Eating very late can disturb sleep for some; an earlier window
              may help.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "A day on 16:8",
      body: (
        <>
          <p>Here is how a typical 16:8 day might look with an eating window from noon to 8 pm:</p>
          <ul>
            <li>
              <strong>Morning:</strong> water, black coffee or tea. Training before noon if
              preferred.
            </li>
            <li>
              <strong>Noon:</strong> first meal, built around protein, vegetables and a portion of
              carbohydrate.
            </li>
            <li>
              <strong>3 to 4 pm:</strong> a snack or small meal, such as Greek yoghurt with fruit or
              a protein shake.
            </li>
            <li>
              <strong>7 pm:</strong> dinner, again with a good protein source, vegetables and
              carbohydrate.
            </li>
            <li>
              <strong>8 pm:</strong> window closes; water or herbal tea until noon the next day.
            </li>
          </ul>
          <p>
            For many people, this pattern simply means skipping breakfast and not snacking after
            dinner, which is why 16:8 is often the easiest protocol to start with.
          </p>
        </>
      ),
    },
    {
      heading: "Fasting and muscle",
      body: (
        <>
          <p>
            A common concern is that fasting will lead to muscle loss. Research suggests that, when
            total protein intake and resistance training are adequate, intermittent fasting does not
            cause more muscle loss than other diets with the same calorie deficit. The challenge is
            fitting enough protein into a shorter window. On 16:8, three protein-rich meals or two
            meals and a snack are usually enough. On 20:4 or OMAD, reaching 1.6 g per kg or more of
            protein in one or two meals is much harder, and some people may find it difficult to
            maintain or build muscle on these more extreme schedules.
          </p>
        </>
      ),
    },
    {
      heading: "Fasting, hunger and hormones",
      body: (
        <>
          <p>
            Hunger during a fast tends to come in waves rather than building steadily, partly
            because ghrelin, a hormone that stimulates appetite, rises around habitual meal times.
            After a week or two of consistent fasting, many people find these waves become weaker as
            the body adapts to the new meal pattern. Drinking water, black coffee or tea, and
            staying busy during habitual meal times can help in the early days.
          </p>
          <p>
            Fasting also influences insulin, which falls during the fasting period. Some proponents
            claim this is the main reason fasting works, but in studies where total calories are the
            same, fat loss is similar whether insulin is lower or higher across the day. The
            benefits of fasting for weight loss come mainly from eating less overall.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a window that fits your life",
      body: (
        <>
          <p>
            The best window is one you can keep most days. Consider work hours, family meals, social
            plans and training times. A window from noon to 8 pm suits people who like a family
            dinner; a window from 8 am to 4 pm suits early risers and people who prefer to stop
            eating earlier in the evening. Shift workers may need to anchor the window to their
            waking hours rather than the clock.
          </p>
          <p>
            Flexibility helps. Many people keep the window most days but relax it for social
            occasions or holidays. A missed day does not undo the benefits of the rest of the week,
            and returning to the routine the next day is what matters.
          </p>
        </>
      ),
    },
    {
      heading: "Fasting and training",
      body: (
        <>
          <p>
            Training in a fasted state is common and well tolerated by many people, particularly for
            lower-intensity cardio and moderate strength sessions. Some people feel lighter and more
            focused training on an empty stomach; others feel weak and dizzy. For hard or long
            sessions, performance is often better with some food beforehand, so placing these
            sessions within or just before the eating window can help.
          </p>
          <p>
            After training, eating a meal with protein and carbohydrate within a few hours supports
            recovery. If you train early in the morning and your window does not open until noon,
            consider shifting the window earlier on training days or including protein in your first
            meal as soon as the window opens.
          </p>
        </>
      ),
    },
    {
      heading: "Fasting and sleep",
      body: (
        <>
          <p>
            Eating a large meal close to bedtime can disturb sleep for some people, while going to
            bed very hungry can do the same for others. An eating window that ends two to three
            hours before sleep is a good compromise for most. If you find it hard to fall asleep on
            fasting days, try moving the window earlier or including a slightly larger final meal.
          </p>
        </>
      ),
    },
    {
      heading: "Is fasting right for you?",
      body: (
        <>
          <p>
            Intermittent fasting tends to suit people who are not very hungry in the morning, who
            like clear rules, and who find it easier to skip a meal than to eat smaller meals. It
            tends to suit people less if they get very hungry or irritable without regular meals,
            tend to overeat after long gaps, train early in the morning with high intensity, or have
            a history of disordered eating. Trying a moderate protocol such as 14:10 or 16:8 for a
            few weeks is a sensible way to find out how it suits you.
          </p>
        </>
      ),
    },
    {
      heading: "Starting intermittent fasting",
      body: (
        <>
          <p>
            Easing into fasting makes it far more likely to stick. A good first step is a 12-hour
            overnight fast, such as 8 pm to 8 am, which many people already do. After a week, extend
            it to 14 hours by moving breakfast later or finishing dinner earlier. Once that feels
            easy, move to 16:8. Taking two to three weeks to reach 16 hours gives your appetite time
            to adjust and helps you learn how your energy, mood and training respond.
          </p>
          <p>
            During the first weeks, plan your meals for the eating window in advance. Knowing what
            you will eat when the window opens makes it easier to break the fast with a balanced
            meal rather than whatever is quickest.
          </p>
        </>
      ),
    },
    {
      heading: "Calories still matter",
      body: (
        <>
          <p>
            Intermittent fasting changes when you eat, not how your body uses food. If you eat more
            than you burn within the eating window, you will not lose weight, however long the fast.
            Equally, if you eat less than you burn, you will lose weight whether you fast or not.
            For fat loss, combining a fasting schedule with a calorie and protein target, such as
            from the calorie deficit and protein calculators, gives the best of both: a simple daily
            structure and a clear sense of how much to eat.
          </p>
        </>
      ),
    },
    {
      heading: "Fasting and social life",
      body: (
        <>
          <p>
            One of the practical challenges of intermittent fasting is fitting it around meals with
            family, friends and colleagues. Breakfasts and lunches out, late dinners and
            celebrations do not always fit the window. Rather than treating these as failures, shift
            the window on those days or treat them as planned exceptions. Fasting works best as a
            flexible tool that supports your goals, not a rule that prevents you from enjoying meals
            with others.
          </p>
        </>
      ),
    },
    {
      heading: "How long to keep fasting",
      body: (
        <>
          <p>
            Some people use intermittent fasting for a defined period, such as a fat-loss phase, and
            then return to a more conventional meal pattern. Others keep a version of it
            indefinitely because it suits their appetite and routine. Both are fine. If you stop,
            expect your weight to stay stable as long as total intake stays at maintenance; the meal
            timing itself is not what keeps weight off. Review how fasting is working every month or
            so, and adjust or stop if it no longer suits you.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing the protocols in practice",
      body: (
        <>
          <p>
            In practice, the protocols differ mainly in how much they ask of you each day. A 16:8
            schedule usually means skipping breakfast or eating dinner earlier, and most people
            adapt within a week or two. An 18:6 schedule narrows the window to two meals for many
            people, which can make it harder to reach protein and fibre targets. A 20:4 schedule
            usually means one main meal and a small snack, and OMAD means a single large meal; both
            require careful planning to meet nutritional needs and can be difficult to sustain.
          </p>
          <p>
            If your goal is weight management, longer fasts are not automatically better. Many
            studies of time-restricted eating used windows of 8 to 10 hours, and the results were
            driven largely by eating less overall. Choosing a window you can keep for months is more
            valuable than choosing the most restrictive one for a few weeks.
          </p>
        </>
      ),
    },
    {
      heading: "What to eat when you break the fast",
      body: (
        <>
          <p>
            The first meal after a fast sets the tone for the rest of the eating window. A balanced
            meal with protein, fibre and some healthy fat tends to keep energy steady and reduce the
            urge to keep eating. Examples include eggs with vegetables and wholegrain toast, Greek
            yoghurt with fruit and nuts, or a chicken, rice and vegetable bowl. Breaking a fast with
            something very sweet or highly processed can lead to a quick rise and fall in energy,
            followed by more hunger.
          </p>
          <p>
            Some people find their stomach is sensitive after a long fast and prefer a smaller first
            meal followed by a larger one later. Others are happy to eat a full meal straight away.
            Both are fine; choose what feels comfortable.
          </p>
        </>
      ),
    },
    {
      heading: "Signs fasting is working for you",
      body: (
        <>
          <p>
            Intermittent fasting is working well if you feel steady energy through the day, hunger
            during the fast is manageable, you eat balanced meals in the window rather than
            overeating, sleep is unaffected, training performance holds up and your weight trend is
            moving as planned. If several of these are not true after three or four weeks, adjust
            the window length or timing, or consider a different approach. Fasting is one of many
            tools for managing intake, and it suits some people far better than others.
          </p>
          <p>
            Tracking a few simple measures, such as weekly average weight, energy on a scale of one
            to five, and how often you stuck to the window, makes it easy to judge objectively
            whether fasting is helping.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration during the fast",
      body: (
        <>
          <p>
            Drinking enough during the fasting period helps manage hunger and keeps energy up, since
            mild dehydration is easy to mistake for hunger or fatigue. Water, sparkling water, black
            coffee and plain or herbal tea all count. Some people add a pinch of salt to water
            during longer fasts, especially if they train, to help with headaches or
            light-headedness. If you feel dizzy, faint or unwell during a fast, eat something and
            reconsider whether that length of fast suits you.
          </p>
        </>
      ),
    },
    {
      heading: "Fasting on rest days and training days",
      body: (
        <>
          <p>
            Some people keep the same window every day; others use a longer fast on rest days and a
            wider window on training days, when they need more food around their sessions. Either
            approach works if total intake for the week matches your goal and you eat enough protein
            on every day.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using intermittent fasting with clients",
    body: (
      <>
        <p>
          Fasting can be a useful structure for clients who struggle with constant grazing or
          late-night snacking. It is less useful for clients who already eat irregularly or who tend
          to overeat after long periods without food.
        </p>
        <p>
          Keep the focus on total intake and protein. A client on 16:8 who still overeats in the
          window will not lose weight; a client who uses the window to eat planned, balanced meals
          often does well.
        </p>
        <p>
          Screen for risk. Ask about eating disorder history, medication and medical conditions
          before suggesting fasting.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Plan meals that fit each client's eating window",
    body: (
      <>
        <p>
          In Traiv you set each client's daily calories and protein, carbohydrate and fat targets,
          build their diet plan from recipes, and see the food they log against those targets,
          alongside their weekly check-ins and weight trend.
        </p>
      </>
    ),
  },
  next: [
    { label: "Split your calories across the window", href: "/tools/calories-per-meal-calculator" },
    { label: "Make sure each meal has enough protein", href: "/tools/protein-per-meal-calculator" },
  ],
  nextPitch: "Coaching clients who fast? Traiv builds diet plans around their meals and targets.",
  faq: [
    {
      q: "What is the best intermittent fasting schedule?",
      a: "There is no single best one. 16:8 is the most popular and easiest to sustain. Choose a window that fits your day and training.",
    },
    {
      q: "Can I drink coffee while fasting?",
      a: "Black coffee and plain tea are generally fine. Adding sugar or a lot of milk adds calories and breaks the fast.",
    },
    {
      q: "Does intermittent fasting burn more fat?",
      a: "Not when total calories are the same. It helps many people eat less overall, which leads to fat loss.",
    },
    {
      q: "Can I build muscle while fasting?",
      a: "Yes, if total calories and protein are adequate and you train consistently. Fitting enough protein into a short window takes planning.",
    },
    {
      q: "Is it safe to fast every day?",
      a: "For most healthy adults, daily 12- to 16-hour fasts are safe. Some groups, including pregnant women and people with diabetes or eating disorder history, should seek advice first.",
    },
    {
      q: "Should I train fasted?",
      a: "It is fine for many people, especially for lighter sessions. If performance suffers, schedule training within or just before your eating window.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. Do not start intermittent
        fasting without medical advice if you are pregnant, breastfeeding, under 18, have diabetes,
        take medication that affects blood sugar, or have a history of disordered eating.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Calories per meal calculator", href: "/tools/calories-per-meal-calculator" },
    { label: "Protein per meal calculator", href: "/tools/protein-per-meal-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Meal plans that fit how each client actually eats",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
