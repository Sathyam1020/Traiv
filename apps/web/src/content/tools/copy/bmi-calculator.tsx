import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "BMI calculator",
  description:
    "Work out body mass index from height and weight in metric or imperial units, see the WHO category and the healthy weight range for your height.",
  eyebrow: "Free tool · Body composition",
  h1: "BMI calculator",
  intro: (
    <>
      <p>
        Enter your height and weight to get your body mass index, the WHO adult category it falls in
        and the weight range that counts as healthy for your height. Switch between centimetres and
        kilograms or feet, inches and pounds.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How is BMI calculated?",
    answer: (
      <>
        <p>
          Divide weight in kilograms by height in metres squared. At 175 cm and 70 kg, height
          squared is 3.0625, and 70 divided by 3.0625 is 22.9: inside the healthy band of 18.5 to
          24.9. For that height, the healthy band runs from about 57 to 76 kg.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What body mass index measures",
      body: (
        <>
          <p>
            Body mass index is weight scaled for height. It answers a narrow question: is this
            person heavy or light for how tall they are? It does not know what the weight is made
            of. Two people with the same height and weight get the same BMI whether one carries a
            lot of muscle and the other a lot of fat. That limit is the main thing to understand
            before reading any result.
          </p>
          <p>
            The measure dates back to the nineteenth century, when the Belgian statistician Adolphe
            Quetelet noticed that, across adult populations, weight tended to rise with roughly the
            square of height. Researchers in the 1970s adopted his ratio as a quick way to sort
            large groups by size, and it became the standard screening measure because it needs
            nothing more than a scale and a tape.
          </p>
          <p>
            That history explains both its strength and its weakness. BMI is excellent for
            describing populations and spotting broad trends. It is far weaker for judging one
            person, because individuals vary in muscle, bone, fat distribution and build in ways
            that a ratio of two numbers cannot capture.
          </p>
        </>
      ),
    },
    {
      heading: "The WHO adult categories",
      body: (
        <>
          <p>
            The World Health Organization uses four main bands for adults aged 20 and over. They
            apply to both sexes and are the categories this calculator reports.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">BMI</th>
                  <th scope="col">Category</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below 18.5</td>
                  <td>Underweight</td>
                </tr>
                <tr>
                  <td>18.5 to 24.9</td>
                  <td>Healthy weight</td>
                </tr>
                <tr>
                  <td>25 to 29.9</td>
                  <td>Overweight</td>
                </tr>
                <tr>
                  <td>30 and above</td>
                  <td>Obese</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The obese band is often split further into classes I (30 to 34.9), II (35 to 39.9) and
            III (40 and above), which clinicians use when weighing treatment options. Some health
            bodies also suggest lower action points for people of South Asian, Chinese, Middle
            Eastern, Black African or African-Caribbean background, because risk of type 2 diabetes
            tends to rise at a lower BMI in those groups. If that applies to you, ask a doctor which
            thresholds they use.
          </p>
          <p>
            The bands are not designed for children and teenagers, whose BMI is read against age-
            and sex-specific growth charts instead. They are also less reliable in pregnancy, in
            older adults who have lost muscle, and in people with conditions that change fluid
            balance.
          </p>
        </>
      ),
    },
    {
      heading: "Working through an example",
      body: (
        <>
          <p>
            Take someone who is 6 ft tall and weighs 200 lb. Converting to metric gives 182.9 cm and
            90.7 kg. Height in metres squared is 1.829 × 1.829, which is about 3.345. Dividing 90.7
            by 3.345 gives a BMI of 27.1, in the overweight band.
          </p>
          <p>
            The calculator also turns the healthy band back into weights for that height.
            Multiplying 3.345 by 18.5 and by 24.9 gives roughly 62 to 83 kg, or about 136 to 184 lb.
            That range is often more useful than the BMI itself, because it is expressed in a unit
            people already track.
          </p>
          <p>
            If the same person trained hard and carried a lot of muscle, the 27.1 might describe a
            lean, strong body rather than excess fat. This is where a waist measurement or a body
            fat estimate earns its place: it can tell you whether the extra weight sits around the
            middle, where it matters most for health.
          </p>
        </>
      ),
    },
    {
      heading: "Where BMI misleads",
      body: (
        <>
          <ul>
            <li>
              <strong>Muscular people.</strong> Lifters, rugby players and many manual workers often
              score as overweight or obese with little body fat. BMI reads their muscle as excess
              weight.
            </li>
            <li>
              <strong>Older adults.</strong> Muscle declines with age. Someone can keep the same BMI
              for decades while losing muscle and gaining fat, so a stable number can hide a
              meaningful change.
            </li>
            <li>
              <strong>Fat distribution.</strong> Fat stored around the organs carries more health
              risk than fat on the hips and thighs. BMI cannot tell the two apart; waist-based
              measures can.
            </li>
            <li>
              <strong>Very tall and very short people.</strong> Because the formula squares height,
              it tends to overstate BMI for tall people and understate it for short people slightly.
            </li>
            <li>
              <strong>Ethnic background.</strong> Risk at a given BMI differs between populations,
              which is why some guidelines use lower cut-offs for certain groups.
            </li>
          </ul>
          <p>
            None of this makes BMI useless. It is a reasonable first look, and at the extremes, very
            low or very high, it is a dependable signal that a conversation with a doctor is
            worthwhile. In the middle ranges, treat it as one data point to be read alongside
            others.
          </p>
        </>
      ),
    },
    {
      heading: "Measures that add context",
      body: (
        <>
          <p>
            Waist circumference is the simplest addition. A waist-to-height ratio under 0.5, meaning
            a waist less than half your height, is a widely used guide that tracks abdominal fat
            better than BMI does. The waist-to-hip ratio is another option, with WHO thresholds of
            0.90 for men and 0.85 for women.
          </p>
          <p>
            Body fat percentage, estimated with a tape measure method such as the US Navy formula,
            or measured with DEXA, bioimpedance or skinfold calipers, tells you what share of your
            weight is fat. For someone who trains, it is usually the more informative number. Lean
            mass and FFMI go further and describe how much muscle a person carries for their height.
          </p>
          <p>
            Health markers matter more than any of these: blood pressure, blood sugar, cholesterol,
            fitness and how well someone sleeps and moves. A doctor can check them. Body size
            measures are useful because they are cheap and repeatable, not because they replace a
            medical assessment.
          </p>
        </>
      ),
    },
    {
      heading: "How to measure accurately",
      body: (
        <>
          <p>
            Weigh yourself in the morning, after using the toilet and before eating, in light
            clothing or none. Use the same scale on a hard, flat floor each time. Measure height
            without shoes, standing straight against a wall with heels together, and mark the top of
            your head with a flat object held level.
          </p>
          <p>
            Weight moves by a kilogram or more across a day and from one day to the next, mostly
            from water, food and salt. A single weigh-in can therefore shift BMI by a few tenths
            without any real change. Averaging several morning weights across a week gives a
            steadier figure to put into the calculator.
          </p>
          <p>
            Recalculate every few weeks rather than every day. If you are working toward a weight
            goal, the healthy range shown for your height is a broad reference, not a precise
            target; where inside it you feel and perform best is an individual question.
          </p>
        </>
      ),
    },
    {
      heading: "BMI and health risk",
      body: (
        <>
          <p>
            Large population studies link both low and high BMI with higher risk of illness. At the
            upper end, risk of type 2 diabetes, high blood pressure, heart disease, some cancers,
            sleep apnoea and joint problems rises as BMI climbs, especially above 30. At the lower
            end, being underweight is linked with weaker bones, a less robust immune system,
            fertility problems and, in older adults, frailty.
          </p>
          <p>
            These are averages across many people. For one person, the risk attached to a given BMI
            depends heavily on where their fat sits, how fit they are, whether they smoke, their
            family history and their blood markers. A fit person at a BMI of 27 with a modest waist
            may be at lower risk than an inactive person at 23 with a large one. That is why doctors
            combine BMI with other checks rather than relying on it alone.
          </p>
        </>
      ),
    },
    {
      heading: "Setting a weight goal from your result",
      body: (
        <>
          <p>
            If you want to change your weight, the healthy range for your height gives a broad
            frame, but the most useful first goal is usually smaller. For people carrying excess
            weight, losing 5 to 10% of current body weight brings measurable improvements in blood
            pressure, blood sugar and cholesterol, long before BMI reaches the healthy band.
          </p>
          <p>
            A pace of about 0.5 to 1% of body weight a week is sustainable for most people. For
            someone at 90 kg, that is roughly 0.45 to 0.9 kg a week. Faster loss is possible but
            tends to cost more muscle and is harder to maintain. Pair the scale with a waist
            measurement, so you can see fat coming off even in weeks when water hides it.
          </p>
          <p>
            If you are underweight, the aim is gradual gain with enough protein and some resistance
            training, so that new weight includes muscle. Unplanned weight loss, or difficulty
            gaining weight despite eating well, is worth raising with a doctor.
          </p>
        </>
      ),
    },
    {
      heading: "BMI at different stages of life",
      body: (
        <>
          <p>
            The adult bands assume a fully grown body. In children and teenagers, BMI is converted
            to a percentile for their age and sex, because healthy proportions change as they grow.
            A BMI of 22 might be typical for one fifteen-year-old and high for a ten-year-old.
          </p>
          <p>
            In older adults, some research suggests that a BMI slightly above 25 is not linked with
            higher mortality and may even be protective, possibly because reserves help during
            illness. Muscle loss with age also means BMI says less about body fat later in life.
            Strength, walking speed and the ability to get up from a chair often tell a doctor more
            than the ratio does.
          </p>
          <p>
            During pregnancy BMI is not used to judge current weight. Clinicians use the
            pre-pregnancy BMI to guide how much weight gain is expected, which is a separate
            conversation with a midwife or doctor.
          </p>
        </>
      ),
    },
    {
      heading: "Metric or imperial: the same answer",
      body: (
        <>
          <p>
            BMI is defined in kilograms and metres. In pounds and inches, the formula multiplies by
            703 to give the same number: weight in pounds divided by height in inches squared, times
            703. For the 6 ft, 200 lb example, 200 divided by 5,184 is 0.0386, and multiplying by
            703 gives 27.1, matching the metric result.
          </p>
          <p>
            The calculator handles the conversion when you switch units, carrying your height and
            weight across so you don't need to re-enter them. Rounding in the conversion can move
            the result by a tenth at most, which makes no difference to the category.
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
    { label: "Body fat calculator", href: "/tools/body-fat-calculator" },
    { label: "Waist-to-height ratio calculator", href: "/tools/waist-to-height-ratio-calculator" },
    { label: "Ideal weight calculator", href: "/tools/ideal-weight-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "What is a healthy BMI for adults?",
      a: "The WHO healthy band is 18.5 to 24.9 for adults of both sexes. Some guidelines use lower action points for people of certain ethnic backgrounds, so ask a doctor which thresholds suit you.",
    },
    {
      q: "Is BMI accurate for people who lift weights?",
      a: "Often not. BMI cannot separate muscle from fat, so muscular people regularly score as overweight. A waist measurement or body fat estimate gives a better picture for them.",
    },
    {
      q: "Is BMI the same for men and women?",
      a: "The adult formula and categories are the same for both. At the same BMI, women typically carry more body fat than men, which is one reason body fat percentage uses separate ranges.",
    },
    {
      q: "Can children use this BMI calculator?",
      a: "No. Children's and teenagers' BMI must be read against age- and sex-specific growth charts. Use a paediatric calculator or ask a health professional.",
    },
    {
      q: "Why does my BMI change from day to day?",
      a: "Body weight swings with water, food and salt intake. Weigh in the morning under the same conditions and average a week of readings for a steadier result.",
    },
    {
      q: "What should I do if my BMI is outside the healthy range?",
      a: "Treat it as a prompt, not a diagnosis. Check your waist measurement and talk to a doctor, who can look at blood pressure, blood sugar and other markers before suggesting any change.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only, not medical advice. BMI is a screening measure and does not
        diagnose any condition. Speak to a doctor about your weight and health.
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
