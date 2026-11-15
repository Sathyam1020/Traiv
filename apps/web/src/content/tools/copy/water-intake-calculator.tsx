import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Water Intake Calculator: How Much Water to Drink a Day",
  description:
    "Free water intake calculator. Estimate daily fluid needs from body weight plus exercise, in litres, fluid ounces and glasses.",
  eyebrow: "Free tool · Nutrition",
  h1: "Water intake calculator",
  intro: (
    <>
      <p>
        How much you need to drink depends mostly on your size and how much you sweat. This
        calculator estimates a daily fluid target from your body weight, adds extra for exercise,
        and shows the result in litres, fluid ounces and glasses.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much water should you drink a day?",
    answer: (
      <>
        <p>
          A practical rule is half an ounce of fluid per pound of body weight, about 33 ml per kg,
          plus roughly 12 fl oz (355 ml) for every 30 minutes of exercise. For a 170 lb (77 kg)
          person who exercises for 45 minutes, that comes to about 3 litres a day.
        </p>
        <p>
          All drinks count, including tea, coffee and milk, and food provides around a fifth of
          daily water. Thirst and pale yellow urine are reliable everyday guides for most healthy
          adults.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the estimate is worked out",
      body: (
        <>
          <ol>
            <li>
              <strong>Baseline:</strong> body weight in pounds × 0.5 gives fluid ounces, which is
              about 33 ml per kg.
            </li>
            <li>
              <strong>Exercise:</strong> 12 fl oz (about 355 ml) for every 30 minutes of activity,
              or roughly 12 ml per minute.
            </li>
            <li>
              <strong>Total:</strong> baseline plus the exercise allowance, shown in litres, fluid
              ounces and 250 ml glasses.
            </li>
          </ol>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Body weight</th>
                  <th scope="col">Rest day</th>
                  <th scope="col">With 60 min exercise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>55 kg (121 lb)</td>
                  <td>1.8 L</td>
                  <td>2.5 L</td>
                </tr>
                <tr>
                  <td>70 kg (154 lb)</td>
                  <td>2.3 L</td>
                  <td>3.0 L</td>
                </tr>
                <tr>
                  <td>85 kg (187 lb)</td>
                  <td>2.8 L</td>
                  <td>3.5 L</td>
                </tr>
                <tr>
                  <td>100 kg (220 lb)</td>
                  <td>3.3 L</td>
                  <td>4.0 L</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These are reasonable estimates, not exact requirements. Heat, humidity, altitude,
            illness, pregnancy and breastfeeding all raise fluid needs, and very heavy sweaters may
            need more during long sessions.
          </p>
        </>
      ),
    },
    {
      heading: "What official guidelines say",
      body: (
        <>
          <p>
            The US National Academies set adequate total water intakes of about 3.7 litres a day for
            men and 2.7 litres for women, including water from food. The European Food Safety
            Authority suggests 2.5 litres for men and 2.0 litres for women. Because food supplies
            about 20 percent of the total, that leaves roughly 2 to 3 litres a day from drinks for
            most adults, which matches the calculator's estimates for average body sizes.
          </p>
          <p>
            The familiar eight glasses a day is a rough rule of thumb rather than a scientific
            requirement. It is in the right range for many people but too little for larger, active
            people and more than necessary for smaller, sedentary ones.
          </p>
        </>
      ),
    },
    {
      heading: "Signs you are well hydrated",
      body: (
        <>
          <ul>
            <li>
              <strong>Urine colour.</strong> Pale straw to light yellow is a good sign. Dark yellow
              suggests you need more; completely clear all day may mean you are drinking more than
              you need.
            </li>
            <li>
              <strong>Thirst.</strong> For healthy adults in normal conditions, drinking when
              thirsty is a reliable guide.
            </li>
            <li>
              <strong>Body weight around exercise.</strong> Losing more than 2 percent of body
              weight during a session means you sweated out more than you replaced.
            </li>
            <li>
              <strong>How you feel.</strong> Headaches, tiredness and poor concentration can be
              early signs of dehydration.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Hydration and exercise",
      body: (
        <>
          <p>
            During exercise, the goal is to limit fluid loss to under about 2 percent of body
            weight, which is the point where performance tends to suffer, especially in the heat.
            For most sessions under an hour, drinking water to thirst is enough. For longer or
            hotter sessions, drinking regularly and including sodium helps replace what is lost in
            sweat.
          </p>
          <p>
            Individual sweat rates vary enormously, from under half a litre to more than two litres
            an hour. The sweat rate calculator lets you measure yours by weighing yourself before
            and after a session, which is far more accurate than any general rule.
          </p>
        </>
      ),
    },
    {
      heading: "Can you drink too much water?",
      body: (
        <>
          <p>
            Yes, though it is uncommon. Drinking very large amounts in a short time, especially
            during long endurance events where sodium is also lost in sweat, can dilute blood sodium
            and cause a dangerous condition called hyponatraemia. Symptoms include nausea, headache,
            confusion and swelling. The risk is highest for slower marathon runners and others who
            drink far more than they sweat. Drinking to thirst and including sodium during long
            events prevents it.
          </p>
        </>
      ),
    },
    {
      heading: "Does coffee or tea count?",
      body: (
        <>
          <p>
            Yes. Caffeine has a mild diuretic effect, but regular coffee and tea drinkers adapt to
            it, and studies show that moderate amounts hydrate about as well as water. Milk, juice
            and soup all count too. Alcohol is the exception: it increases fluid loss, so it does
            not contribute much toward your target.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration in hot weather",
      body: (
        <>
          <p>
            Heat and humidity raise sweat rates sharply, and fluid needs can rise by a litre or more
            on a hot day, even without formal exercise. On hot days, drink regularly through the day
            rather than waiting until you are very thirsty, and include salty foods or an
            electrolyte drink if you are sweating heavily for long periods. Pay attention to signs
            of heat illness, such as dizziness, nausea, headache and confusion, which need prompt
            cooling and fluids.
          </p>
          <p>
            Older adults, young children and people taking certain medications, such as diuretics,
            are at higher risk in the heat and should be particularly careful to drink enough.
          </p>
        </>
      ),
    },
    {
      heading: "Electrolytes and when you need them",
      body: (
        <>
          <p>
            Sweat contains sodium and smaller amounts of potassium and other minerals. For everyday
            activity and sessions under about an hour, a normal diet replaces these easily and plain
            water is enough. For longer sessions, heavy sweating, hot conditions or several sessions
            in a day, adding sodium helps the body hold on to fluid and reduces the risk of cramps
            and low blood sodium. Sports drinks, electrolyte tablets or salty snacks all work.
          </p>
          <p>
            People who sweat heavily or notice white salt marks on their clothing after exercise
            often lose more sodium than average and may benefit most from adding it during long
            sessions.
          </p>
        </>
      ),
    },
    {
      heading: "Water and weight loss",
      body: (
        <>
          <p>
            Drinking water does not directly burn fat, but it can help a diet in small ways.
            Drinking a glass of water before meals has been linked to eating slightly less in some
            studies, particularly in older adults. Replacing sugary drinks with water removes
            calories without reducing food. And mild dehydration can feel similar to hunger, so a
            drink is worth trying before a snack.
          </p>
          <p>
            Water also affects the scale. Sudden changes in salt or carbohydrate intake shift water
            retention, which can hide or exaggerate fat loss for a few days. Steady, adequate
            drinking helps keep these swings smaller.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration through the day",
      body: (
        <>
          <p>
            Spreading drinks through the day is easier on the body and easier to manage than
            drinking a lot at once. A simple pattern is a glass on waking, one with each meal, one
            mid-morning and one mid-afternoon, plus extra around exercise. Front-loading drinks
            earlier in the day also reduces the chance of waking at night to use the toilet.
          </p>
          <p>
            Habits help more than willpower. Keeping a bottle on your desk, drinking a glass
            whenever you make a hot drink, or tying a drink to routine events such as finishing a
            meeting turns hydration into something you do without thinking.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration for older adults and children",
      body: (
        <>
          <p>
            The sense of thirst becomes weaker with age, so older adults can become dehydrated
            without feeling thirsty, especially in hot weather or during illness. Regular drinks at
            set times, and foods with high water content such as soups, fruit and yoghurt, help.
            Children have higher fluid needs relative to their size and may not notice thirst during
            play, so offering water regularly is sensible.
          </p>
        </>
      ),
    },
    {
      heading: "Foods that hydrate",
      body: (
        <>
          <p>
            Many foods are mostly water. Cucumber, lettuce, celery, tomatoes, watermelon,
            strawberries and oranges are all more than 85 percent water. Soups, stews, yoghurt,
            porridge and cooked rice and pasta also contribute meaningful amounts. A diet rich in
            fruit, vegetables and home-cooked meals may supply more than the typical 20 percent of
            daily water from food, which is one reason people eating that way often feel less
            thirsty than those eating mostly dry, processed foods.
          </p>
        </>
      ),
    },
    {
      heading: "Sparkling water, flavoured water and electrolyte drinks",
      body: (
        <>
          <p>
            Sparkling water hydrates just as well as still water and can make it easier to drink
            more if you find plain water boring. Flavoured waters and squashes count too, though
            some contain added sugar or sweeteners, so check the label. Electrolyte drinks are
            useful during long or hot sessions but unnecessary for most daily hydration, and many
            contain sugar that adds calories without much benefit outside of exercise.
          </p>
        </>
      ),
    },
    {
      heading: "How much to drink around exercise",
      body: (
        <>
          <p>
            A practical approach for most training sessions: drink a glass or two of water in the
            couple of hours before you start, sip to thirst during the session, and drink afterward
            until your urine returns to a pale colour. For sessions longer than about 90 minutes or
            in hot conditions, aim to replace a good part of what you lose by drinking regularly
            during exercise, and include sodium. Weighing yourself before and after a few sessions
            shows how much you typically lose, and the sweat rate calculator turns that into a plan.
          </p>
          <p>
            After exercise, replacing about 1.25 to 1.5 litres of fluid for every kilogram of weight
            lost restores hydration fully, because some of what you drink is lost as urine.
            Including salty food or an electrolyte drink helps the body retain more of that fluid.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration and pregnancy",
      body: (
        <>
          <p>
            Fluid needs rise during pregnancy and breastfeeding. Official guidance in many countries
            suggests an extra 300 ml or so a day in pregnancy and around 600 to 700 ml a day while
            breastfeeding. Thirst is usually a good guide, but pregnant and breastfeeding women
            should follow the advice of their midwife or doctor, particularly in hot weather or if
            they are vomiting.
          </p>
        </>
      ),
    },
    {
      heading: "Signs of dehydration to watch for",
      body: (
        <>
          <p>
            Early dehydration is easy to miss. Common signs include thirst, dark yellow urine,
            needing the toilet less often, a dry mouth, headache, tiredness and difficulty
            concentrating. During exercise, performance often drops before you feel very thirsty.
            More severe dehydration can cause dizziness, a rapid heartbeat and confusion, and needs
            prompt attention. Babies, young children and older adults are more vulnerable and may
            not show obvious thirst, so they need extra care in hot weather or during illness with
            vomiting or diarrhoea.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration at work and while travelling",
      body: (
        <>
          <p>
            Air-conditioned offices, long meetings and travel all make it easy to forget to drink.
            Keeping a refillable bottle visible on your desk, setting it as a habit to refill it at
            set times, and drinking a glass with each meal covers most needs. On flights, the dry
            cabin air increases water loss through breathing, so drinking regularly and limiting
            alcohol helps you arrive feeling better.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using water targets with clients",
    body: (
      <>
        <p>
          Hydration is a simple, low-risk habit that often improves how clients feel and train
          within days. It is a good early win, especially for clients who are new to tracking
          anything.
        </p>
        <p>
          Make it visible. A marked water bottle with a target for each part of the day works better
          than a daily total that is easy to forget.
        </p>
        <p>
          Be careful not to overemphasise it. Some clients take a water target as a rule they must
          hit regardless of thirst. Thirst and urine colour are good enough guides for most healthy
          adults, and the number is just a starting point.
        </p>
      </>
    ),
  },
  pitch: {
    key: "check-ins",
    heading: "Track habits like hydration alongside the plan",
    body: (
      <>
        <p>
          In Traiv, weekly check-ins collect how a client's week went, including habits such as
          water, sleep and steps, alongside their weight and photos, so you can see patterns over
          time.
        </p>
      </>
    ),
  },
  next: [
    { label: "Measure your sweat rate", href: "/tools/sweat-rate-calculator" },
    { label: "Estimate calories burned in a session", href: "/tools/calories-burned-calculator" },
  ],
  nextPitch: "Tracking client habits? Traiv's check-ins keep them in one place.",
  faq: [
    {
      q: "How much water should I drink a day?",
      a: "Roughly 33 ml per kg of body weight, or half an ounce per pound, plus about 12 fl oz for every 30 minutes of exercise. For most adults that is 2 to 3.5 litres from all drinks.",
    },
    {
      q: "Does food count toward water intake?",
      a: "Yes. Food supplies around 20 percent of daily water, more if you eat a lot of fruit, vegetables and soups.",
    },
    {
      q: "Do coffee and tea count?",
      a: "Yes. Moderate amounts hydrate about as well as water for regular drinkers. Alcohol does not count.",
    },
    {
      q: "Is eight glasses a day right?",
      a: "It is a rough rule that suits many people but not everyone. Larger and more active people usually need more.",
    },
    {
      q: "How do I know if I am dehydrated?",
      a: "Dark yellow urine, thirst, headaches and tiredness are common signs. Pale yellow urine suggests you are drinking enough.",
    },
    {
      q: "Can drinking too much water be dangerous?",
      a: "Very large amounts in a short time, especially during long endurance events, can lower blood sodium. Drinking to thirst and including salt during long events prevents this.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. People with heart, kidney or
        liver conditions, or who have been told to limit fluids, should follow their doctor's
        guidance on how much to drink.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Sweat rate calculator", href: "/tools/sweat-rate-calculator" },
    { label: "Calories burned calculator", href: "/tools/calories-burned-calculator" },
    { label: "Fiber intake calculator", href: "/tools/fiber-intake-calculator" },
    { label: "How check-ins work in Traiv", href: "/features/check-ins" },
  ],
  close: {
    heading: "Habits, plans and progress for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
