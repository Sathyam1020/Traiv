import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Sweat Rate Calculator: How Much to Drink During Exercise",
  description:
    "Free sweat rate calculator. Weigh yourself before and after training to find your hourly sweat loss, percentage of body weight lost and how much to drink next time.",
  eyebrow: "Free tool · Nutrition",
  h1: "Sweat rate calculator",
  intro: (
    <>
      <p>
        Everyone sweats differently, and general hydration advice can leave you drinking far too
        much or far too little. Weigh yourself before and after a session, note what you drank and
        how long you trained, and this calculator works out your personal sweat rate and a drinking
        plan for similar sessions.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you calculate your sweat rate?",
    answer: (
      <>
        <p>
          Weigh yourself before and after exercise. Subtract the post-session weight from the
          pre-session weight, add the fluid you drank during the session, and divide by the hours
          you exercised. Each kilogram lost is about a litre of sweat; each pound is about 16 fl oz.
        </p>
        <p>
          Using the defaults, 176 lb before, 173 lb after and 20 fl oz drunk over 60 minutes, total
          sweat loss is about 68 fl oz, or 2 litres, an hour. That is on the high side of normal;
          typical rates range from about 0.5 to 2 litres an hour.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How to measure it properly",
      body: (
        <>
          <ol>
            <li>
              <strong>Weigh before.</strong> After using the toilet, in minimal clothing or none,
              just before the session.
            </li>
            <li>
              <strong>Track fluid.</strong> Measure everything you drink during the session.
            </li>
            <li>
              <strong>Avoid the toilet during the session</strong> if possible, or estimate and add
              what you lose.
            </li>
            <li>
              <strong>Towel off and weigh after.</strong> Remove sweaty clothing first, because it
              holds water.
            </li>
            <li>
              <strong>Note the conditions.</strong> Temperature, humidity and intensity all change
              sweat rate.
            </li>
          </ol>
          <p>
            Repeat the test in a few different conditions, such as cool and hot days and easy and
            hard sessions. Your sweat rate in summer heat can be double your rate on a cool morning,
            and knowing both lets you plan for each.
          </p>
        </>
      ),
    },
    {
      heading: "What the results mean",
      body: (
        <>
          <ul>
            <li>
              <strong>Sweat rate per hour</strong> tells you how much fluid you lose in similar
              sessions.
            </li>
            <li>
              <strong>Body weight lost</strong> shows how well you kept up. Losing more than about 2
              percent of body weight is linked to reduced performance, especially in the heat.
              Losing under 1 percent means you kept up well.
            </li>
            <li>
              <strong>Drink per hour next time</strong> is about three quarters of your sweat rate,
              which keeps most people under the 2 percent threshold without overdrinking.
            </li>
            <li>
              <strong>Rehydrate after</strong> is 1.5 times the weight still lost, because some of
              what you drink after exercise is lost as urine.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Why sweat rates vary so much",
      body: (
        <>
          <p>
            Body size is one factor: larger people generally sweat more. Fitness is another, and
            perhaps surprisingly, fitter people tend to sweat more and earlier, because their
            cooling system has adapted to training. Heat acclimatisation also increases sweat rate
            within one to two weeks of training in hot conditions. Genetics, sex and the type of
            exercise all play a part. That is why two people on the same run can need very different
            amounts of fluid.
          </p>
        </>
      ),
    },
    {
      heading: "Sodium and sweat",
      body: (
        <>
          <p>
            Sweat is not just water. It contains sodium, typically around 0.5 to 1.5 grams per
            litre, though this varies widely between people. Heavy sweaters who also lose a lot of
            sodium, sometimes called salty sweaters, may notice white salt marks on their clothing
            or a gritty feeling on their skin after exercise. For sessions over about 90 minutes or
            in hot conditions, replacing some sodium with an electrolyte drink, tablet or salty
            snack helps the body hold on to fluid and reduces the risk of cramps and low blood
            sodium.
          </p>
        </>
      ),
    },
    {
      heading: "Avoiding overdrinking",
      body: (
        <>
          <p>
            Drinking far more than you sweat during long events can dilute blood sodium and cause
            hyponatraemia, a potentially dangerous condition. It is most common in slower marathon
            runners and others who drink large amounts at every opportunity. Knowing your sweat rate
            prevents this: if you drink no more than you sweat, and include some sodium during long
            efforts, the risk is very low. Gaining weight during a session is a clear sign of
            overdrinking.
          </p>
        </>
      ),
    },
    {
      heading: "Using the plan in training and competition",
      body: (
        <>
          <p>
            Practise your drinking plan in training before using it in a race or match. Your gut
            adapts to taking in fluid during exercise, and drinking the planned amount comfortably
            takes practice. Use bottles with volume markings or a known size so you can check how
            much you are drinking, and spread intake evenly through the session rather than drinking
            a lot at once. In team sports, plan around breaks in play.
          </p>
        </>
      ),
    },
    {
      heading: "Worked example",
      body: (
        <>
          <p>
            A runner weighs 72.0 kg before a 75-minute run in warm weather and 70.6 kg afterward.
            She drank a 500 ml bottle during the run.
          </p>
          <ol>
            <li>Weight lost: 72.0 − 70.6 = 1.4 kg, which is about 1.4 litres of fluid.</li>
            <li>Total sweat loss: 1.4 + 0.5 = 1.9 litres.</li>
            <li>Sweat rate: 1.9 ÷ 1.25 hours = about 1.5 litres an hour.</li>
            <li>Body weight lost: 1.4 ÷ 72 = 1.9 percent, just under the 2 percent threshold.</li>
            <li>
              Next time: drinking around 1.1 litres an hour would keep her comfortably under 2
              percent.
            </li>
            <li>
              After the run: about 2.1 litres, 1.5 times the remaining deficit, spread over the next
              few hours.
            </li>
          </ol>
          <p>
            On a cool morning, her sweat rate might be closer to 0.8 litres an hour, so she would
            need far less. That is why testing in different conditions matters.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration before exercise",
      body: (
        <>
          <p>
            Starting a session well hydrated makes the plan easier to follow. Drinking about 5 to 7
            ml per kg of body weight in the two to four hours before exercise, roughly 350 to 500 ml
            for most adults, gives the body time to absorb what it needs and pass any excess before
            you start. Pale yellow urine before a session is a good sign. Drinking a large volume
            immediately before exercise is less helpful and may cause discomfort.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration in team sports and the gym",
      body: (
        <>
          <p>
            In team sports, opportunities to drink are limited to breaks, half-time and
            substitutions, so planning matters. Knowing your sweat rate lets you work out how much
            to drink at each break to stay within 2 percent. In the gym, strength sessions usually
            produce less sweat than continuous cardio, but long sessions in warm conditions can
            still lead to significant losses. Keeping a bottle nearby and sipping between sets is
            usually enough.
          </p>
        </>
      ),
    },
    {
      heading: "Children, older adults and hydration during exercise",
      body: (
        <>
          <p>
            Children sweat less than adults but heat up more quickly relative to their size, and
            they may not notice thirst while playing. Offering regular drinks during sport,
            especially in hot weather, is important. Older adults may have a reduced sense of thirst
            and a slower response to heat, so they should drink regularly during exercise and pay
            attention to signs of heat stress, such as dizziness, headache and unusual fatigue.
          </p>
        </>
      ),
    },
    {
      heading: "What affects your sweat rate on the day",
      body: (
        <>
          <ul>
            <li>
              <strong>Temperature and humidity:</strong> higher temperatures and humid air, which
              slows evaporation, both increase sweating.
            </li>
            <li>
              <strong>Intensity:</strong> harder efforts produce more heat and more sweat.
            </li>
            <li>
              <strong>Clothing:</strong> heavier or non-breathable clothing traps heat and increases
              sweat loss.
            </li>
            <li>
              <strong>Acclimatisation:</strong> after one to two weeks of training in heat, you
              sweat earlier and more, which helps cooling.
            </li>
            <li>
              <strong>Fitness:</strong> fitter people generally sweat more effectively.
            </li>
            <li>
              <strong>Hydration status:</strong> starting dehydrated can reduce sweating and
              increase body temperature.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Signs your hydration plan needs adjusting",
      body: (
        <>
          <p>
            Your sweat rate test gives you a starting plan, but how you feel during and after
            exercise tells you whether it is working. Signs that you are drinking too little include
            strong thirst, a dry mouth, headache, dizziness, unusually high heart rate for the
            effort, and dark urine afterward. Signs that you are drinking too much include a
            sloshing stomach, needing to urinate during exercise, swollen fingers, nausea and
            gaining weight over the session.
          </p>
          <p>
            If you notice either pattern, adjust your hourly intake by around 100 to 200 ml and
            retest in similar conditions. Over a few sessions you will find the amount that keeps
            you comfortable and performing well.
          </p>
        </>
      ),
    },
    {
      heading: "Hydration for long events",
      body: (
        <>
          <p>
            For events lasting several hours, such as marathons, long bike rides, triathlons and
            hikes, hydration planning becomes more important. Your sweat rate tells you roughly how
            much fluid you will lose. A good plan replaces a substantial part of it at regular
            intervals, includes sodium, and fits around carbohydrate intake, which is often taken in
            the same drinks or alongside them. Practise the full plan during long training sessions
            so your stomach is used to it.
          </p>
          <p>
            Conditions on the day may differ from your tests, so build in flexibility. If it is
            hotter than expected, drink a little more and add sodium; if it is cooler, drink a
            little less. Weighing yourself before and after long training sessions in similar
            weather is the best preparation.
          </p>
        </>
      ),
    },
    {
      heading: "Recovery hydration",
      body: (
        <>
          <p>
            After exercise, the goal is to replace what you lost without overloading the body.
            Drinking around 1.25 to 1.5 litres for every kilogram of weight still lost, spread over
            several hours, restores hydration for most people. Including food or drinks that contain
            sodium helps the body retain the fluid rather than passing it straight out. Milk, for
            example, has been shown to rehydrate effectively after exercise because it contains
            water, electrolytes, carbohydrate and protein. Plain water with a salty meal works well
            too.
          </p>
        </>
      ),
    },
    {
      heading: "Sweat rate and heat illness",
      body: (
        <>
          <p>
            Sweating is the body's main way of cooling down during exercise. When sweat losses are
            not replaced and body water falls significantly, the body becomes less able to cool
            itself, and core temperature rises faster. Combined with hot, humid conditions and high
            intensity, this increases the risk of heat exhaustion and, in severe cases, heat stroke,
            which is a medical emergency.
          </p>
          <p>
            Warning signs include heavy sweating that suddenly stops, confusion, dizziness,
            headache, nausea, cramps and feeling unusually hot or cold. Anyone showing these signs
            should stop exercising, move somewhere cool, drink fluids if able and seek medical help
            if symptoms are severe or do not improve quickly. Knowing your sweat rate and drinking
            to a plan reduces the risk, but in extreme heat it is also sensible to reduce intensity,
            train at cooler times of day and take more breaks.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping a hydration log",
      body: (
        <>
          <p>
            A simple log turns one-off tests into a personal reference. For each test, note the
            date, temperature, humidity, type and length of session, how hard it felt, your weights
            before and after, what you drank and your calculated sweat rate. After a few weeks,
            patterns appear: you will see how much more you sweat on hot days or during harder
            sessions, and you can plan drinking for upcoming sessions and events with confidence
            rather than guesswork.
          </p>
          <p>
            Coaches can collect the same information from clients through regular check-ins, which
            makes it easy to spot trends and adjust advice across a training season.
          </p>
        </>
      ),
    },
    {
      heading: "Sweat rate during strength training",
      body: (
        <>
          <p>
            Strength sessions usually produce lower sweat rates than continuous cardio, because
            effort comes in short bursts with rest between sets. Still, long sessions,
            high-repetition circuits and warm gyms can lead to meaningful fluid losses. Testing your
            sweat rate during a typical strength session is just as easy as during a run: weigh
            before and after, note what you drank and the session length. Many lifters find they
            need far less fluid than general advice suggests, while others who train in hot
            conditions are surprised by how much they lose.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using sweat rate with clients",
    body: (
      <>
        <p>
          A sweat test is one of the most useful practical exercises you can give an endurance or
          team sport client. It turns vague advice to stay hydrated into a specific number they can
          plan around.
        </p>
        <p>
          Test in the conditions that matter. A client preparing for a summer race should test in
          warm weather, not in an air-conditioned gym.
        </p>
        <p>
          Keep a record. Logging sweat rate alongside conditions over a season builds a personal
          reference that makes race-day planning much easier.
        </p>
      </>
    ),
  },
  pitch: {
    key: "check-ins",
    heading: "Keep training notes and measurements in one place",
    body: (
      <>
        <p>
          In Traiv, check-ins collect a client's measurements and notes alongside their training, so
          details like sweat rate, conditions and how a session felt are there when you plan the
          next block.
        </p>
      </>
    ),
  },
  next: [
    { label: "Estimate daily water needs", href: "/tools/water-intake-calculator" },
    { label: "Estimate calories burned in the session", href: "/tools/calories-burned-calculator" },
  ],
  nextPitch: "Coaching endurance athletes? Traiv keeps their training and notes together.",
  faq: [
    {
      q: "What is a normal sweat rate?",
      a: "Most people sweat between about 0.5 and 2 litres an hour during exercise, depending on size, fitness, intensity and conditions.",
    },
    {
      q: "How much should I drink during exercise?",
      a: "Enough to keep weight loss under about 2 percent of body weight. Drinking around three quarters of your sweat rate per hour works for most people.",
    },
    {
      q: "Do I need electrolytes?",
      a: "For sessions over about 90 minutes, in hot conditions, or if you sweat heavily, adding sodium helps. For shorter sessions, water is usually enough.",
    },
    {
      q: "Why should I weigh without clothes?",
      a: "Sweaty clothing holds water, which would make your after-session weight look higher and your sweat rate lower than it really is.",
    },
    {
      q: "Is it bad to gain weight during exercise?",
      a: "It means you drank more than you sweated. Occasionally this is harmless, but regularly overdrinking during long events increases the risk of low blood sodium.",
    },
    {
      q: "How often should I test my sweat rate?",
      a: "Test in a few different conditions, such as cool and hot weather and easy and hard sessions, then retest when the season or your training changes.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. People with heart or kidney
        conditions, or who have been advised to limit fluid or salt, should follow their doctor's
        guidance on hydration during exercise.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Water intake calculator", href: "/tools/water-intake-calculator" },
    { label: "Calories burned calculator", href: "/tools/calories-burned-calculator" },
    { label: "Steps to calories calculator", href: "/tools/steps-to-calories-calculator" },
    { label: "How check-ins work in Traiv", href: "/features/check-ins" },
  ],
  close: {
    heading: "Training details, measurements and plans, all in one place",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
