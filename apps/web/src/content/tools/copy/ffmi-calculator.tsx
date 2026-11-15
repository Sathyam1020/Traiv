import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "FFMI calculator",
  description:
    "Calculate fat-free mass index from height, weight and body fat. See raw and height-normalised FFMI with reference ranges for men and women.",
  eyebrow: "Free tool · Body composition",
  h1: "FFMI calculator",
  intro: (
    <>
      <p>
        Fat-free mass index tells you how much lean mass you carry for your height. Enter height,
        weight and body fat percentage to get your raw FFMI, the height-normalised figure and your
        lean mass.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate FFMI?",
    answer: (
      <>
        <p>
          Work out lean mass (weight × (1 − body fat)), then divide by height in metres squared. At
          180 lb (81.6 kg), 15% body fat and 5 ft 10 in (1.778 m), lean mass is 69.4 kg and FFMI is
          21.9. The normalised figure adds 6.1 × (1.8 − height), giving 22.1.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What FFMI is",
      body: (
        <>
          <p>
            Fat-free mass index applies the idea behind BMI to lean mass only. BMI divides total
            weight by height squared, so it cannot tell muscle from fat. FFMI first removes the fat,
            using a body fat estimate, and then scales what is left for height. The result describes
            how muscular someone is for their size, which is far more useful than BMI for anyone who
            trains.
          </p>
          <p>
            The measure was popularised by a 1995 study by Kouri and colleagues, who compared 157
            male athletes, some of whom had used anabolic steroids and some who had not. They found
            that drug-free lifters rarely exceeded a normalised FFMI of about 25, while many steroid
            users did. That finding is the source of the widely quoted ceiling, and it still shapes
            how the number is discussed.
          </p>
        </>
      ),
    },
    {
      heading: "Raw and normalised FFMI",
      body: (
        <>
          <p>
            Raw FFMI is lean mass in kilograms divided by height in metres squared. Because taller
            people tend to score slightly higher for the same muscularity, Kouri and colleagues
            added a correction that adjusts every result to a reference height of 1.8 m: normalised
            FFMI = raw FFMI + 6.1 × (1.8 − height in metres).
          </p>
          <p>
            For someone exactly 1.8 m tall, the two numbers are the same. Shorter people get a small
            boost and taller people a small reduction. The difference is modest for most heights: at
            1.70 m the correction adds about 0.6, and at 1.90 m it subtracts about 0.6. The
            calculator shows both, and the normalised figure is the one usually compared with
            reference ranges.
          </p>
        </>
      ),
    },
    {
      heading: "Reference ranges",
      body: (
        <>
          <p>Ranges for men, based on the normalised figure, are commonly described like this:</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Normalised FFMI (men)</th>
                  <th scope="col">Typical description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below 18</td>
                  <td>Below average muscle</td>
                </tr>
                <tr>
                  <td>18 to 20</td>
                  <td>Average, typical of many people who train</td>
                </tr>
                <tr>
                  <td>20 to 22</td>
                  <td>Above average, well-developed</td>
                </tr>
                <tr>
                  <td>22 to 23</td>
                  <td>Excellent, years of consistent training</td>
                </tr>
                <tr>
                  <td>23 to 25</td>
                  <td>Very high, near the upper drug-free range</td>
                </tr>
                <tr>
                  <td>Above 25</td>
                  <td>Rare without performance-enhancing drugs</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Women carry less lean mass for their height on average, so their values run about three
            to four points lower. A normalised FFMI of 14 to 16 is common for women who don't train,
            16 to 18 is typical of trained women, and figures above 20 are uncommon.
          </p>
          <p>
            These bands are descriptions, not grades. Genetics, age, training history and sport
            shape where someone lands, and an FFMI of 20 after two years of lifting is a strong
            result for most people.
          </p>
        </>
      ),
    },
    {
      heading: "Working through an example",
      body: (
        <>
          <p>
            Take a man who is 5 ft 10 in (1.778 m) and 180 lb (81.6 kg) at 15% body fat. Fat mass is
            15% of 81.6, about 12.2 kg, leaving 69.4 kg of lean mass. Height squared is 1.778 ×
            1.778, about 3.161. Dividing 69.4 by 3.161 gives a raw FFMI of 21.9.
          </p>
          <p>
            He is 0.022 m shorter than the reference height, so the correction is 6.1 × 0.022, about
            0.13. His normalised FFMI is 22.1, in the well-developed range for men.
          </p>
          <p>
            For a woman at 165 cm and 60 kg with 25% body fat, lean mass is 45 kg. Height squared is
            2.7225, so raw FFMI is 16.5. The correction is 6.1 × 0.15, about 0.9, giving a
            normalised FFMI of 17.4: typical of a woman who trains regularly.
          </p>
        </>
      ),
    },
    {
      heading: "Why body fat accuracy matters",
      body: (
        <>
          <p>
            FFMI is only as good as the body fat figure that goes into it. An error of three
            percentage points in body fat changes lean mass by about 2.4 kg at 80 kg body weight,
            which moves FFMI by about 0.8. That is enough to move someone across a band.
          </p>
          <p>
            Use the best estimate you have and be consistent. A DEXA scan gives the most dependable
            starting point. A tape measure method like the US Navy formula is a practical
            alternative for home use. Bioimpedance scales can swing several points with hydration,
            so take readings at the same time of day if you use one.
          </p>
          <p>
            Because of this uncertainty, treat FFMI as a range rather than a precise score. A result
            of 22.1 is better read as about 21 to 23.
          </p>
        </>
      ),
    },
    {
      heading: "The natural limit debate",
      body: (
        <>
          <p>
            The idea of an FFMI of 25 as a hard natural ceiling is widely repeated but
            oversimplified. The 1995 study was small, used underwater weighing to measure body fat,
            and studied a specific group of lifters. Later research has found some drug-free
            athletes, particularly heavier strength athletes and those with exceptional genetics,
            above 25.
          </p>
          <p>
            A better reading is that values above 25 are rare without drugs, and values above 27 or
            28 are very rare. An FFMI near the ceiling is not evidence of drug use on its own,
            especially when body fat has been estimated rather than scanned. It is also not a target
            most people need to chase; health and performance gains come long before it.
          </p>
        </>
      ),
    },
    {
      heading: "Using FFMI to plan training and nutrition",
      body: (
        <>
          <p>
            FFMI is most useful as a long-term progress marker. Muscle grows slowly, so expect it to
            move by a fraction of a point a year after the first year or two of training. Beginners
            can see a rise of one to two points in their first year, while experienced lifters may
            gain only a few tenths.
          </p>
          <p>
            If FFMI is rising while body fat holds steady or falls, training and nutrition are
            working. If body weight rises but FFMI stays flat, most of the gain is fat, and the
            surplus may be too large. Pair FFMI with strength numbers from the training log for a
            fuller picture.
          </p>
          <p>
            Recalculate every few months rather than every week. Short-term changes are mostly noise
            from water, glycogen and measuring error.
          </p>
        </>
      ),
    },
    {
      heading: "FFMI compared with other measures",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Measure</th>
                  <th scope="col">Uses</th>
                  <th scope="col">Tells you</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BMI</td>
                  <td>Height and weight</td>
                  <td>Size for height, not composition</td>
                </tr>
                <tr>
                  <td>Body fat %</td>
                  <td>Tape, scale or scan</td>
                  <td>Share of weight that is fat</td>
                </tr>
                <tr>
                  <td>Lean body mass</td>
                  <td>Weight and body fat</td>
                  <td>Weight of everything except fat</td>
                </tr>
                <tr>
                  <td>FFMI</td>
                  <td>Lean mass and height</td>
                  <td>Lean mass for your height</td>
                </tr>
                <tr>
                  <td>Skeletal muscle mass</td>
                  <td>Equation or scan</td>
                  <td>Weight of skeletal muscle only</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            BMI and FFMI are related. At low body fat, a high BMI is mostly muscle and FFMI will
            also be high. At high body fat, BMI rises while FFMI may barely move. That is why FFMI
            separates a muscular person from a heavy one when BMI cannot.
          </p>
        </>
      ),
    },
    {
      heading: "How to measure the inputs well",
      body: (
        <>
          <p>
            Height is easy to get right: measure without shoes, standing tall against a wall, in the
            morning, when you are slightly taller than in the evening. Weight should come from a
            morning weigh-in after using the toilet, ideally averaged across several days, because a
            single reading can swing by a kilogram with food and water.
          </p>
          <p>
            Body fat is where most of the error comes from. If you use a tape method, follow the
            landmarks carefully and take each measurement twice. If you use a smart scale, weigh at
            the same time each day, before eating or training, with similar hydration. If you have
            access to a DEXA scan, use it to set a baseline, then track with a cheaper method you
            can repeat.
          </p>
          <p>
            Keep the inputs consistent from one calculation to the next. Using a scan one month and
            a smart scale the next can move FFMI by a point or more without any change in the body.
          </p>
        </>
      ),
    },
    {
      heading: "FFMI by training experience",
      body: (
        <>
          <p>
            Training history explains more of the variation in FFMI than almost anything else. These
            rough figures for men give a sense of what is typical, though individual results differ
            widely:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Training history</th>
                  <th scope="col">Typical normalised FFMI (men)</th>
                  <th scope="col">Typical normalised FFMI (women)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Untrained</td>
                  <td>17 to 19</td>
                  <td>14 to 16</td>
                </tr>
                <tr>
                  <td>1 to 2 years</td>
                  <td>19 to 21</td>
                  <td>15 to 17</td>
                </tr>
                <tr>
                  <td>3 to 5 years</td>
                  <td>21 to 23</td>
                  <td>16 to 18</td>
                </tr>
                <tr>
                  <td>5 years or more, focused</td>
                  <td>22 to 25</td>
                  <td>17 to 20</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Genetics shifts these ranges. Some people gain muscle quickly and reach high values in a
            few years; others train for a decade and stay in the low twenties. Comparing your FFMI
            with your own earlier results says far more than comparing it with someone else's.
          </p>
        </>
      ),
    },
    {
      heading: "FFMI during a cut or a bulk",
      body: (
        <>
          <p>
            During a fat loss phase, the goal is to keep FFMI steady while body fat falls. A drop of
            more than a few tenths across a cut suggests that lean mass is being lost, often from
            too large a deficit, too little protein or reduced training. Holding FFMI is a sign that
            the cut is being run well.
          </p>
          <p>
            During a muscle gain phase, FFMI should rise slowly. If body weight climbs by several
            kilograms but FFMI barely moves, most of the gain is fat, and the surplus may be larger
            than needed. A rise of half a point over a few months is a strong result for an
            experienced lifter.
          </p>
          <p>
            Remember that water and glycogen affect lean mass readings. The first week of a diet
            often shows a drop in lean mass that is really stored carbohydrate and water. Judge the
            trend across a full phase rather than the first few weeks.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: reporting FFMI to clients",
      body: (
        <>
          <p>
            FFMI can motivate clients who see little change on the scale while their body changes
            shape. Showing that lean mass and FFMI have risen while weight held steady makes the
            progress visible. Present it as a range, given the measuring error, and avoid comparing
            a client with the drug-free ceiling unless they ask.
          </p>
          <p>
            For clients focused on weight loss, FFMI is a useful guardrail. If it drops during a
            diet, the plan may need more protein, more training or a smaller deficit. Recalculate
            every eight to twelve weeks, using the same body fat method each time.
          </p>
        </>
      ),
    },
    {
      heading: "Limits of the measure",
      body: (
        <>
          <p>
            FFMI treats all lean mass the same. Organs, bone and water count alongside muscle, so
            someone with a large frame or dense bones may score higher without carrying more muscle.
            It also says nothing about where muscle sits; a person with very developed legs and a
            modest upper body can share an FFMI with someone built the other way round.
          </p>
          <p>
            It is also only one view of fitness. Strength, endurance, mobility and health markers
            matter as much. FFMI is a good way to describe muscularity for height, not a full
            picture of what a body can do.
          </p>
        </>
      ),
    },
    {
      heading: "FFMI for women",
      body: (
        <>
          <p>
            Most FFMI research has focused on men, so reference values for women are less
            established. Studies of female athletes suggest normalised values of about 15 to 17 for
            recreationally active women, 17 to 19 for well-trained women and 20 to 22 for elite
            strength athletes. Values above 22 are very rare.
          </p>
          <p>
            Women gain muscle at similar relative rates to men when they train, but from a lower
            starting point, so FFMI increases are smaller in absolute terms. A rise of one point
            over a year of consistent training is a meaningful result for most women.
          </p>
          <p>
            Body fat estimates for women can be harder to pin down because of hormonal water shifts
            across the menstrual cycle. Measuring at the same point in the cycle each time gives a
            fairer comparison.
          </p>
        </>
      ),
    },
    {
      heading: "A quick reality check on your number",
      body: (
        <>
          <p>
            If your result seems surprisingly high, check the body fat input first. An estimate that
            reads a few points too lean raises lean mass and FFMI with it. Many people underestimate
            their body fat by eye, and some smart scales read lean for muscular users. If FFMI comes
            out above 25 and you have trained naturally for only a few years, the most likely
            explanation is a low body fat reading, not exceptional muscle.
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
    key: "workouts",
    heading: "Track muscle, not only weight",
    body: (
      <>
        <p>
          In Traiv you see each client's check-in measurements alongside the training they logged,
          so you can tell whether a gain on the scale was muscle or not, and adjust the plan.
        </p>
      </>
    ),
  },
  next: [
    { label: "Lean body mass calculator", href: "/tools/lean-body-mass-calculator" },
    { label: "Body fat calculator", href: "/tools/body-fat-calculator" },
    { label: "Muscle mass calculator", href: "/tools/muscle-mass-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "What is a good FFMI?",
      a: "For men, a normalised FFMI of 20 to 22 reflects well-developed muscle, and 22 to 23 is excellent. For women, values run about three to four points lower.",
    },
    {
      q: "Is FFMI 25 the natural limit?",
      a: "Values above 25 are rare without performance-enhancing drugs, but not impossible. The figure comes from one small 1995 study and is better read as a rough guide than a hard ceiling.",
    },
    {
      q: "What is the difference between raw and normalised FFMI?",
      a: "Normalised FFMI adjusts the result to a reference height of 1.8 m, so tall and short people can be compared fairly. For most heights the difference is under one point.",
    },
    {
      q: "Does FFMI work for women?",
      a: "Yes. The formula is the same, but women's reference values are about three to four points lower than men's.",
    },
    {
      q: "How accurate is FFMI?",
      a: "It depends on the body fat estimate. A three-point error in body fat can move FFMI by close to a point, so treat the result as a range.",
    },
    {
      q: "How fast can FFMI increase?",
      a: "Beginners can gain one to two points in their first year. Experienced lifters usually see a few tenths a year.",
    },
    {
      q: "Why use FFMI instead of BMI?",
      a: "BMI counts muscle as excess weight. FFMI removes fat first, so it shows how muscular someone is for their height.",
    },
  ],
  keepGoing: [
    { label: "Check-ins in Traiv", href: "/features/check-ins" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Track every client's progress under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
