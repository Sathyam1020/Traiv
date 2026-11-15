import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Ideal weight calculator",
  description:
    "Compare ideal body weight from the Devine, Robinson, Miller and Hamwi formulas with the healthy BMI range for your height and sex.",
  eyebrow: "Free tool · Body composition",
  h1: "Ideal weight calculator",
  intro: (
    <>
      <p>
        See what four classic ideal-weight formulas give for your height and sex, side by side with
        the healthy BMI weight range. Switch between feet and inches or centimetres.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How is ideal body weight calculated?",
    answer: (
      <>
        <p>
          All four begin with a fixed weight for someone 5 ft tall, then add a fixed number of
          kilograms for every inch beyond that. For a man at 5 ft 11 in, Devine gives 75.3 kg (166
          lb), Robinson 72.9 kg, Miller 71.7 kg and Hamwi 77.7 kg. The healthy BMI range at that
          height is about 60 to 81 kg.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Where ideal weight formulas come from",
      body: (
        <>
          <p>
            Ideal body weight formulas were not designed to tell people what they should weigh. Most
            were created for medicine. In 1974, Dr Ben Devine published a simple equation to help
            estimate drug doses for medicines that distribute mainly into lean tissue. It became so
            convenient that it spread far beyond its original purpose.
          </p>
          <p>
            Hamwi's formula came earlier, in 1964, as a quick rule of thumb for dietitians. Robinson
            (1983) and Miller (1983) later refitted similar equations to life insurance tables,
            which recorded the weights linked with the longest life expectancy among insured people
            at the time. All four share the same shape: a base weight at 5 ft and a fixed number of
            kilograms for each additional inch.
          </p>
        </>
      ),
    },
    {
      heading: "The four formulas",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Formula</th>
                  <th scope="col">Men</th>
                  <th scope="col">Women</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Devine (1974)</td>
                  <td>50 kg + 2.3 kg per inch over 5 ft</td>
                  <td>45.5 kg + 2.3 kg per inch over 5 ft</td>
                </tr>
                <tr>
                  <td>Robinson (1983)</td>
                  <td>52 kg + 1.9 kg per inch</td>
                  <td>49 kg + 1.7 kg per inch</td>
                </tr>
                <tr>
                  <td>Miller (1983)</td>
                  <td>56.2 kg + 1.41 kg per inch</td>
                  <td>53.1 kg + 1.36 kg per inch</td>
                </tr>
                <tr>
                  <td>Hamwi (1964)</td>
                  <td>48 kg + 2.7 kg per inch</td>
                  <td>45.5 kg + 2.2 kg per inch</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The formulas agree closely around average heights and spread apart for very tall and
            very short people. Hamwi climbs fastest with height and Miller slowest, so for a tall
            man Hamwi gives the highest result and Miller the lowest. The calculator shows all four,
            the lowest-to-highest range, and the healthy BMI range for comparison.
          </p>
          <p>
            For heights under 5 ft, the formulas were never designed to work and simply return the
            base weight. If you are shorter than 5 ft, the healthy BMI range is the better guide.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <p>
            For a man who is 5 ft 11 in, there are 11 inches over 5 ft. Devine gives 50 + 2.3 × 11 =
            75.3 kg. Robinson gives 52 + 1.9 × 11 = 72.9 kg. Miller gives 56.2 + 1.41 × 11 = 71.7
            kg. Hamwi gives 48 + 2.7 × 11 = 77.7 kg. The range is about 72 to 78 kg, or roughly 158
            to 171 lb.
          </p>
          <p>
            For a woman at 5 ft 5 in, there are 5 inches over 5 ft. Devine gives 57.0 kg, Robinson
            57.5 kg, Miller 59.9 kg and Hamwi 56.5 kg. The range is about 56 to 60 kg, or 125 to 132
            lb.
          </p>
          <p>
            The healthy BMI range is wider in both cases: about 60 to 81 kg for the man and 50 to 68
            kg for the woman. The formulas sit inside it, roughly in the middle, which is why they
            often feel like a reasonable reference point.
          </p>
        </>
      ),
    },
    {
      heading: "Why there is no single ideal weight",
      body: (
        <>
          <p>
            The formulas know only height and sex. They do not know how much muscle someone carries,
            how large their frame is, how old they are, or how active they are. A muscular man at 5
            ft 11 in might be lean and healthy at 88 kg, well above every formula. A small-framed
            woman might feel and perform best near the bottom of the BMI range.
          </p>
          <p>
            Health research does not point to a single best weight either. Risk is lowest across a
            range, and fitness, diet, sleep and where fat is stored all affect it. A goal weight
            that is impossible to reach or hold can also do more harm than good, through repeated
            dieting and a difficult relationship with food.
          </p>
          <p>
            A more helpful framing is a healthy weight range for you: one you can maintain while
            eating well, training and living normally, with a waist below half your height and
            health markers in good order.
          </p>
        </>
      ),
    },
    {
      heading: "Frame size and muscle",
      body: (
        <>
          <p>
            Some older approaches adjust ideal weight for frame size, adding or subtracting about
            10% for large or small frames. A common home check is wrist circumference: wrapping your
            thumb and middle finger around the opposite wrist. If they overlap, the frame is small;
            if they just touch, medium; if they don't meet, large. It is a rough guide at best.
          </p>
          <p>
            Muscle matters more than frame. Someone who has trained for years can carry 10 kg or
            more of extra lean mass compared with an untrained person of the same height. For them,
            a body fat percentage or FFMI is a far better guide than any ideal-weight formula.
          </p>
        </>
      ),
    },
    {
      heading: "Ideal weight in medicine",
      body: (
        <>
          <p>
            In hospitals, ideal body weight is still used for practical purposes. Some drug doses
            are based on it, ventilator settings for patients on breathing support are set using a
            version of the Devine formula, and kidney function estimates sometimes use it. In these
            uses it is a reference for lean body size, not a judgement about what the patient should
            weigh.
          </p>
          <p>
            That history is a reminder that the formulas were tools for estimating body size, not
            standards of appearance. Treat the result the same way: a reference, alongside other
            measures.
          </p>
        </>
      ),
    },
    {
      heading: "Using the result to set a goal",
      body: (
        <>
          <p>
            If you are using this calculator to choose a goal weight, start with where you are. For
            someone well above the formula range, a first goal of losing 5 to 10% of current weight
            is realistic and brings measurable health benefits. Reaching the formula range can come
            later, if it still makes sense.
          </p>
          <p>
            For someone who trains, consider body composition instead of weight. A goal like
            reaching 15% body fat while keeping lean mass gives a target weight that reflects the
            muscle they actually carry. It will often sit above the formula range, and that is fine.
          </p>
          <p>
            For someone near or below the bottom of the healthy BMI range, a goal of losing more
            weight is rarely appropriate. If you feel pressure to keep losing, talking to a doctor
            or registered dietitian is a good next step.
          </p>
        </>
      ),
    },
    {
      heading: "How ideal weight compares with BMI",
      body: (
        <>
          <p>
            The healthy BMI range at a given height covers about 25 kg for most adults. The
            ideal-weight formulas pick a narrow band, usually 5 to 7 kg wide, roughly in the middle
            of it. Neither is more correct; they answer slightly different questions.
          </p>
          <p>
            BMI asks whether weight for height falls in a range associated with lower health risk
            across populations. The formulas give a single reference point for lean body size. For
            many people, aiming somewhere inside the healthy BMI range, with a healthy waist
            measurement, is a more flexible and realistic target than a single number.
          </p>
        </>
      ),
    },
    {
      heading: "Ideal weight at different ages",
      body: (
        <>
          <p>
            The formulas were built on adult data and make no adjustment for age. Yet body
            composition changes across life. Muscle declines from around 30 unless trained, fat
            increases, and height falls slightly in later decades. An older adult at the same weight
            as in their twenties likely carries more fat and less muscle.
          </p>
          <p>
            For older adults, a weight a little above the formula range is often not a concern and
            may even be protective during illness. Keeping strength and muscle matters more than
            matching a number. For children and teenagers, ideal-weight formulas do not apply at
            all; growth charts are used instead.
          </p>
        </>
      ),
    },
    {
      heading: "Ideal weight for athletes",
      body: (
        <>
          <p>
            Athletes rarely match ideal-weight formulas. Strength and power athletes often sit well
            above them because of their muscle. Endurance athletes may sit near or below the bottom.
            Weight-class athletes, such as boxers and lifters, choose a class based on performance,
            not a formula.
          </p>
          <p>
            For athletes, performance and body composition are better guides. A coach might set a
            target body fat range for a competitive season and a slightly higher one for the
            off-season, then let weight follow from that. Chasing a formula weight can cost strength
            and recovery.
          </p>
        </>
      ),
    },
    {
      heading: "Talking about goal weight with clients",
      body: (
        <>
          <p>
            Clients often arrive with a number in mind, sometimes a weight they were years ago or
            one they read about. Ask where it came from and what reaching it would change for them.
            The answer often points to a more useful goal, such as fitting into certain clothes,
            running a distance or feeling more energetic.
          </p>
          <p>
            Use the formula range and BMI range as reference points in that conversation, alongside
            waist measurement and body fat. If the client's goal is far below every reference point,
            explore it gently and consider involving a health professional.
          </p>
        </>
      ),
    },
    {
      heading: "Frequently asked about the formulas",
      body: (
        <>
          <ul>
            <li>
              <strong>Why do the formulas use inches?</strong> They were developed in the United
              States and use 5 ft as a baseline. The calculator converts centimetres for you.
            </li>
            <li>
              <strong>Why are women's results lower?</strong> Women carry less lean mass on average
              for their height, so the base weights are lower.
            </li>
            <li>
              <strong>Why do the formulas disagree?</strong> Each was fitted to different data at a
              different time. Their spread is a reminder that there is no single right answer.
            </li>
            <li>
              <strong>Which should I use?</strong> Look at the range across all four, then compare
              it with the BMI range and your body composition.
            </li>
          </ul>
          <p>
            None of the formulas know your muscle, frame or history. They are useful as a starting
            point for a conversation, not as an endpoint.
          </p>
        </>
      ),
    },
    {
      heading: "Weight, waist and health together",
      body: (
        <>
          <p>
            A weight figure on its own says little about health. Pair it with a waist measurement:
            keeping your waist under half your height is a simple guide linked with lower
            cardiometabolic risk. Add a body fat estimate if you train, because muscle changes what
            a healthy weight looks like.
          </p>
          <p>
            Then look beyond size. Blood pressure, blood sugar, cholesterol, fitness and sleep shape
            health risk more than any number on the scale. A doctor can check these, and a coach can
            help you build the habits that improve them, whatever you weigh.
          </p>
        </>
      ),
    },
  ],
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
    heading: "Keep every measurement in one place",
    body: (
      <>
        <p>
          In Traiv, clients log weight, measurements and progress photos in their check-ins, and you
          see the trend beside their plan. No spreadsheets to chase, and no numbers lost in chat.
        </p>
      </>
    ),
  },
  next: [
    { label: "BMI calculator", href: "/tools/bmi-calculator" },
    { label: "Body fat calculator", href: "/tools/body-fat-calculator" },
    { label: "Waist-to-height ratio calculator", href: "/tools/waist-to-height-ratio-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "What is my ideal weight for my height?",
      a: "The four formulas give a narrow range, and the healthy BMI range gives a wider one. Where you feel and perform best inside it depends on muscle, frame and health.",
    },
    {
      q: "Which ideal weight formula is most accurate?",
      a: "No formula is reliably closer for a given person. Devine is the most widely used in medicine; Robinson and Miller were fitted to later data. Look at the range across all four.",
    },
    {
      q: "Do ideal weight formulas account for muscle?",
      a: "No. They use only height and sex. Muscular people often sit well above every formula while being lean and healthy.",
    },
    {
      q: "Why does the calculator show a BMI range too?",
      a: "The healthy BMI range is wider and better reflects normal variation. The formulas usually fall inside it.",
    },
    {
      q: "Can I use this if I am under 5 ft?",
      a: "The formulas were built for heights of 5 ft and above and return the base weight below that. Use the healthy BMI range instead.",
    },
    {
      q: "Should my goal weight be my ideal weight?",
      a: "Not necessarily. A goal you can sustain with good health markers and a waist under half your height is more useful than a formula result.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only, not medical advice. Ideal weight formulas do not account for
        muscle, frame or health. Speak to a doctor about your weight and health.
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
