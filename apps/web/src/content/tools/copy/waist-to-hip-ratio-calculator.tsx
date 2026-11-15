import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Waist-to-hip ratio calculator",
  description:
    "Divide waist by hip circumference to get your waist-to-hip ratio and compare it with the WHO thresholds of 0.90 for men and 0.85 for women.",
  eyebrow: "Free tool · Body composition",
  h1: "Waist-to-hip ratio calculator",
  intro: (
    <>
      <p>
        Measure your waist and hips, enter them with your sex, and see your waist-to-hip ratio
        against the World Health Organization thresholds for men and women.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate waist-to-hip ratio?",
    answer: (
      <>
        <p>
          Divide your waist circumference by your hip circumference. A man with a 90 cm waist and
          100 cm hips has a ratio of 0.90, at the WHO threshold for substantially increased risk in
          men. A woman with a 76 cm waist and 100 cm hips has 0.76, below the women's threshold of
          0.85.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What the waist-to-hip ratio shows",
      body: (
        <>
          <p>
            The waist-to-hip ratio compares the size of your waist with the size of your hips. A
            higher ratio means more of your body's size sits around the middle, which usually
            reflects more abdominal fat. A lower ratio means more of it sits on the hips and
            buttocks.
          </p>
          <p>
            This matters because fat around the abdomen, especially visceral fat around the organs,
            is closely linked with heart disease, type 2 diabetes and high blood pressure. Fat on
            the hips and thighs is linked with much less risk and may even be neutral or protective.
            Two people at the same weight can therefore have very different risk depending on their
            shape, and the ratio captures that.
          </p>
        </>
      ),
    },
    {
      heading: "The WHO thresholds",
      body: (
        <>
          <p>
            The World Health Organization's 2008 expert report on waist measures set thresholds for
            substantially increased risk of metabolic complications: a ratio of 0.90 or above for
            men and 0.85 or above for women. The calculator uses these, along with a moderate band
            just below each threshold.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Men</th>
                  <th scope="col">Women</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Low risk</td>
                  <td>Below 0.85</td>
                  <td>Below 0.80</td>
                </tr>
                <tr>
                  <td>Moderate risk</td>
                  <td>0.85 to 0.89</td>
                  <td>0.80 to 0.84</td>
                </tr>
                <tr>
                  <td>Substantially increased risk</td>
                  <td>0.90 and above</td>
                  <td>0.85 and above</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Women's thresholds are lower because women naturally carry more fat on the hips, so
            their hip measurement is usually larger relative to their waist. A ratio that would be
            typical for a man suggests more abdominal fat in a woman.
          </p>
        </>
      ),
    },
    {
      heading: "Working through examples",
      body: (
        <>
          <p>
            A man with a 90 cm waist and 100 cm hips has a ratio of 90 ÷ 100 = 0.90, at the WHO
            threshold. Reducing his waist by 5 cm to 85 cm would bring the ratio to 0.85, into the
            moderate band.
          </p>
          <p>
            A woman with a 76 cm waist and 100 cm hips has a ratio of 0.76, in the low-risk band.
            Another woman with an 82 cm waist and 98 cm hips has 0.84, in the moderate band, just
            below the threshold.
          </p>
          <p>
            In inches, a man with a 36 in waist and 40 in hips has 0.90; a woman with a 30 in waist
            and 40 in hips has 0.75. As with any ratio, use the same unit for both measurements.
          </p>
        </>
      ),
    },
    {
      heading: "How to measure your waist",
      body: (
        <>
          <p>
            Use a flexible, non-stretch tape. Stand upright with your feet together and your weight
            evenly spread, and breathe out normally. Find the bottom of your lowest rib and the top
            of your hip bone, and place the tape midway between them, usually close to the level of
            the navel. Keep the tape level all the way round and snug without pressing into the
            skin.
          </p>
          <p>
            Measure on bare skin rather than over clothing. Take two readings; if they differ by
            more than a centimetre, take a third and use the average of the two closest. Measure in
            the morning, before eating, when the abdomen is least affected by food and drink.
          </p>
          <p>
            Different guidelines use slightly different waist sites. The WHO uses the midpoint
            between rib and hip bone; some US guidance uses the top of the hip bone. Choose one and
            keep to it, so your readings can be compared over time.
          </p>
        </>
      ),
    },
    {
      heading: "How to measure your hips",
      body: (
        <>
          <p>
            Stand with your feet together and your weight evenly balanced. Wrap the tape around the
            widest part of your buttocks, keeping it level all the way round. A mirror or a helper
            makes it easier to check the tape hasn't tilted at the back.
          </p>
          <p>
            Measure over bare skin or thin, close-fitting underwear. Like the waist, take two
            readings and average them. Hip measurements tend to change more slowly than waist
            measurements during weight loss, which is part of why the ratio can fall as abdominal
            fat comes off.
          </p>
        </>
      ),
    },
    {
      heading: "Waist-to-hip ratio versus other measures",
      body: (
        <>
          <p>
            The waist-to-hip ratio, waist-to-height ratio, waist circumference alone and BMI each
            capture something slightly different. BMI measures size for height. Waist circumference
            measures abdominal size directly. Waist-to-height adjusts the waist for height.
            Waist-to-hip compares the waist with the hips.
          </p>
          <p>
            Large studies, including the INTERHEART study of heart attack risk across 52 countries,
            found waist-to-hip ratio was a stronger predictor of heart attack than BMI. Other
            research favours waist-to-height ratio because it needs only one tape measurement and
            one cut-off. In practice, any waist-based measure adds useful information to BMI, and
            using more than one gives a fuller picture.
          </p>
        </>
      ),
    },
    {
      heading: "When the ratio can mislead",
      body: (
        <>
          <p>
            The ratio can fall for the wrong reason. If someone gains fat on the hips while their
            waist stays the same, the ratio goes down even though total fat has risen. It can also
            stay flat during weight loss if the waist and hips shrink at similar rates. Tracking the
            waist on its own alongside the ratio avoids these traps.
          </p>
          <p>
            Body shape also varies naturally. Some people have narrow hips whatever their body fat,
            which raises their ratio; others have broad hips. The ratio is most useful for comparing
            a person with themselves over time, and as a screening flag rather than a diagnosis.
          </p>
        </>
      ),
    },
    {
      heading: "Body shape and the ratio",
      body: (
        <>
          <p>
            People often describe body shapes as apple, with more weight around the middle, or pear,
            with more weight on the hips and thighs. A high waist-to-hip ratio is typical of an
            apple shape, and a low one of a pear shape. Research consistently links the apple
            pattern with higher cardiometabolic risk.
          </p>
          <p>
            Shape is influenced by genetics, sex hormones and age. Before the menopause, oestrogen
            tends to direct fat to the hips and thighs in women. After the menopause, fat shifts
            toward the abdomen, and the ratio often rises even without weight gain. In men, fat
            around the abdomen tends to increase through middle age.
          </p>
        </>
      ),
    },
    {
      heading: "Lowering your ratio",
      body: (
        <>
          <p>
            Reducing abdominal fat lowers the ratio, because the waist measurement usually falls
            faster than the hips during fat loss. Regular activity, both aerobic exercise and
            resistance training, a moderate calorie deficit, plenty of fibre and protein, limited
            alcohol and enough sleep all help.
          </p>
          <p>
            Visceral fat is particularly responsive to exercise. Studies show reductions in visceral
            fat with training even when weight changes little. Strength training also builds the
            muscles of the hips and glutes, which can raise the hip measurement slightly and lower
            the ratio further.
          </p>
          <p>
            Stress and poor sleep raise cortisol, which is associated with more abdominal fat.
            Managing stress and keeping a regular sleep pattern support changes to body shape
            alongside diet and exercise.
          </p>
        </>
      ),
    },
    {
      heading: "Using the ratio to track progress",
      body: (
        <>
          <p>
            Measure the waist and hips every two to four weeks under the same conditions: morning,
            before eating, on bare skin, with the same tape. Record both measurements, not just the
            ratio. The waist alone tells you whether abdominal fat is falling; the ratio tells you
            how your shape is changing.
          </p>
          <p>
            Combine the ratio with other measures for a fuller picture. Weight, body fat and the
            waist-to-height ratio each add information. If all are moving in the right direction
            over a few months, your plan is working.
          </p>
        </>
      ),
    },
    {
      heading: "What the ratio cannot tell you",
      body: (
        <>
          <p>
            The ratio is a screening measure. A high ratio does not mean someone has a disease, and
            a low ratio does not rule one out. It cannot separate visceral fat from fat under the
            skin, and it is affected by bone structure and muscle around the hips.
          </p>
          <p>
            For a clear view of health, see a doctor for blood pressure, blood sugar and cholesterol
            checks, especially if your ratio is above the WHO threshold or you have a family history
            of heart disease or diabetes.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: reading the ratio with clients",
      body: (
        <>
          <p>
            The waist-to-hip ratio is easy to measure remotely, but the hip measurement is easier to
            get wrong than the waist. Send clients clear instructions with the landmarks, and ask
            for both raw measurements at each check-in. A mirror or a partner helps them keep the
            tape level.
          </p>
          <p>
            Explain the ratio in terms of body shape and risk, not appearance. For clients whose
            weight changes slowly, a falling waist and a falling ratio show that the plan is working
            where it matters most for health.
          </p>
        </>
      ),
    },
    {
      heading: "Waist circumference on its own",
      body: (
        <>
          <p>
            Waist circumference alone is also used as a risk marker. Common thresholds for increased
            risk are 94 cm (37 in) for men and 80 cm (31.5 in) for women, with substantially
            increased risk at 102 cm (40 in) for men and 88 cm (34.5 in) for women. Lower thresholds
            are often recommended for people of South Asian background.
          </p>
          <p>
            Waist circumference is simpler to measure than the ratio because it needs only one site.
            The ratio adds information about body shape. Using both, alongside the waist-to-height
            ratio, gives a fuller picture than any single measure.
          </p>
        </>
      ),
    },
    {
      heading: "Measurement mistakes to avoid",
      body: (
        <>
          <ul>
            <li>
              <strong>Measuring the hips too high.</strong> The hip measurement goes around the
              widest part of the buttocks, not at the hip bones.
            </li>
            <li>
              <strong>Letting the tape tilt.</strong> A tape that dips at the back reads longer.
              Check it in a mirror.
            </li>
            <li>
              <strong>Measuring over thick clothing.</strong> Bare skin or thin underwear gives the
              most accurate reading.
            </li>
            <li>
              <strong>Pulling in the stomach.</strong> Measure the waist after a normal breath out.
            </li>
            <li>
              <strong>Mixing units.</strong> Use the same unit for both measurements.
            </li>
          </ul>
          <p>
            Small errors add up in a ratio, because both numbers carry some uncertainty. Taking each
            measurement twice and averaging helps.
          </p>
        </>
      ),
    },
    {
      heading: "A worked tracking example",
      body: (
        <>
          <p>
            A woman starts with an 88 cm waist and 102 cm hips, a ratio of 0.86, just above the WHO
            threshold. Over four months of regular training and a modest deficit, her waist falls to
            82 cm and her hips to 99 cm. Her ratio is now 0.83, in the moderate band. Her waist
            alone has dropped 6 cm, which is the most meaningful change for her health, and the
            ratio confirms that her shape has shifted away from the abdomen.
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
    { label: "Waist-to-height ratio calculator", href: "/tools/waist-to-height-ratio-calculator" },
    { label: "Body fat calculator", href: "/tools/body-fat-calculator" },
    { label: "BMI calculator", href: "/tools/bmi-calculator" },
  ],
  nextPitch: "Use these tools to build a fuller picture, then review it with your coach.",
  faq: [
    {
      q: "What is a healthy waist-to-hip ratio?",
      a: "The WHO uses 0.90 for men and 0.85 for women as thresholds for substantially increased risk. Ratios below about 0.85 for men and 0.80 for women are considered low risk.",
    },
    {
      q: "Why are the thresholds different for men and women?",
      a: "Women naturally carry more fat on the hips, so their hip measurement is larger relative to the waist. The same ratio suggests more abdominal fat in a woman.",
    },
    {
      q: "Where exactly should I measure my hips?",
      a: "Around the widest part of the buttocks, with your feet together and the tape level.",
    },
    {
      q: "Is waist-to-hip ratio better than BMI?",
      a: "For predicting heart disease, some large studies have found it stronger than BMI. Using waist measures alongside BMI gives a fuller picture.",
    },
    {
      q: "Can I improve my waist-to-hip ratio?",
      a: "Yes. Reducing abdominal fat through activity, diet and sleep lowers the waist measurement faster than the hips, so the ratio falls.",
    },
    {
      q: "Should I use waist-to-hip or waist-to-height ratio?",
      a: "Both are useful. Waist-to-height needs one cut-off for everyone; waist-to-hip uses sex-specific thresholds. Tracking either consistently is what matters.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only, not medical advice. Waist measures are screening tools and do not
        diagnose any condition. Speak to a doctor about your health.
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
