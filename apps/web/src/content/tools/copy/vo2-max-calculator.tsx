import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "VO2 max calculator",
  description:
    "Estimate VO2 max from a Cooper 12-minute run, a 1.5-mile run or your resting heart rate, and see how it rates for your age and sex.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "VO2 max calculator",
  intro: (
    <>
      <p>
        Estimate your VO2 max with one of three methods: the distance you can run in 12 minutes,
        your time for 1.5 miles, or your resting and maximum heart rate. See your category for your
        age and sex.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I estimate my VO2 max without a lab?",
    answer: (
      <>
        <p>
          Use a field test. From the Cooper 12-minute run: VO2 max = (metres − 504.9) ÷ 44.73, so
          2,400 m gives 42.4 ml/kg/min. From a 1.5-mile run: VO2 max = 3.5 + 483 ÷ minutes, so 12:30
          gives 42.1. From heart rate: VO2 max ≈ 15.3 × max HR ÷ resting HR, so 190 and 60 give
          48.5.
        </p>
        <p>For a 30-year-old man, 42.4 rates as Good.</p>
      </>
    ),
  },
  sections: [
    {
      heading: "What VO2 max means",
      body: (
        <>
          <p>
            VO2 max describes the largest volume of oxygen you can absorb and put to work each
            minute at full effort, expressed in millilitres per kilogram of body weight per minute
            (ml/kg/min). It reflects how well the heart pumps blood, how well the lungs and blood
            carry oxygen, and how well the muscles use it. It is one of the most widely used
            measures of aerobic fitness.
          </p>
          <p>
            Untrained adults typically score between about 30 and 45, depending on age and sex.
            Well-trained endurance athletes often exceed 60, and elite cross-country skiers and
            runners can top 80. Higher VO2 max is strongly linked with better endurance performance
            and, in large population studies, with lower risk of heart disease and death from any
            cause.
          </p>
        </>
      ),
    },
    {
      heading: "Three ways to estimate it",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cooper 12-minute run</td>
                  <td>(metres − 504.9) ÷ 44.73</td>
                  <td>2,400 m → 42.4</td>
                </tr>
                <tr>
                  <td>1.5-mile run</td>
                  <td>3.5 + 483 ÷ minutes</td>
                  <td>12:30 → 42.1</td>
                </tr>
                <tr>
                  <td>Resting heart rate (Uth)</td>
                  <td>15.3 × max HR ÷ resting HR</td>
                  <td>190 and 60 bpm → 48.5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The two running tests require a hard, sustained effort and give the most reliable field
            estimates for people who can run. The heart rate method needs no exercise at all, but is
            less accurate for individuals. Use whichever suits you, and stick with it for retesting.
          </p>
        </>
      ),
    },
    {
      heading: "The Cooper 12-minute run",
      body: (
        <>
          <p>
            Developed by Dr Kenneth Cooper for the US Air Force in 1968, this test asks you to cover
            as much distance as possible in 12 minutes. The distance is converted to VO2 max with
            the formula above. It works best on a 400 m track, where you can count laps; six laps is
            2,400 m.
          </p>
          <p>
            Even pacing is key. Work out your target lap time in advance: two minutes per 400 m lap
            gives 2,400 m. The Cooper test calculator on this site also rates the distance against
            Cooper's published norms.
          </p>
        </>
      ),
    },
    {
      heading: "The 1.5-mile run",
      body: (
        <>
          <p>
            The 1.5-mile run, about 2,414 m, is used widely in military and police fitness testing.
            You run the distance as fast as you can and record the time. The equation VO2 max = 3.5
            + 483 ÷ time in minutes is one common form; others add terms for body weight, sex or
            heart rate.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">1.5-mile time</th>
                  <th scope="col">Estimated VO2 max</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10:00</td>
                  <td>51.8</td>
                </tr>
                <tr>
                  <td>11:00</td>
                  <td>47.4</td>
                </tr>
                <tr>
                  <td>12:30</td>
                  <td>42.1</td>
                </tr>
                <tr>
                  <td>14:00</td>
                  <td>38.0</td>
                </tr>
                <tr>
                  <td>15:00</td>
                  <td>35.7</td>
                </tr>
                <tr>
                  <td>17:00</td>
                  <td>31.9</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Six laps of a 400 m track plus 14 metres gives 1.5 miles. Many people simply run six
            laps, which slightly underestimates the distance; for consistency, use the same course
            every time.
          </p>
        </>
      ),
    },
    {
      heading: "The resting heart rate method",
      body: (
        <>
          <p>
            In 2004, Niels Uth and colleagues in Denmark found that the ratio of maximum to resting
            heart rate predicted VO2 max reasonably well in trained men: VO2 max ≈ 15.3 × HRmax ÷
            HRrest. A lower resting heart rate, relative to max, suggests a stronger heart and
            higher aerobic capacity.
          </p>
          <p>
            The method is quick and needs no exercise, but it is the least accurate of the three.
            Resting heart rate is affected by sleep, stress, caffeine and medication, and the
            estimate depends heavily on maximum heart rate, which formulas often get wrong. If you
            leave max heart rate blank, the calculator uses 220 − age. For a 40-year-old with a
            resting rate of 70, that gives 15.3 × 180 ÷ 70 = 39.3. Treat this method as a rough
            guide, and a running test as the better estimate.
          </p>
        </>
      ),
    },
    {
      heading: "VO2 max norms by age and sex",
      body: (
        <>
          <p>
            The calculator rates your estimate against a widely reproduced general-population norm
            table based on Cooper Institute data. Values below the Poor band are rated Very poor.
            For men (ml/kg/min):
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">Poor</th>
                  <th scope="col">Fair</th>
                  <th scope="col">Good</th>
                  <th scope="col">Excellent</th>
                  <th scope="col">Superior</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>20–29</td>
                  <td>33.0–36.4</td>
                  <td>36.5–42.4</td>
                  <td>42.5–46.4</td>
                  <td>46.5–52.4</td>
                  <td>52.5+</td>
                </tr>
                <tr>
                  <td>30–39</td>
                  <td>31.5–35.4</td>
                  <td>35.5–40.9</td>
                  <td>41.0–44.9</td>
                  <td>45.0–49.4</td>
                  <td>49.5+</td>
                </tr>
                <tr>
                  <td>40–49</td>
                  <td>30.2–33.5</td>
                  <td>33.6–38.9</td>
                  <td>39.0–43.7</td>
                  <td>43.8–48.0</td>
                  <td>48.1+</td>
                </tr>
                <tr>
                  <td>50–59</td>
                  <td>26.1–30.9</td>
                  <td>31.0–35.7</td>
                  <td>35.8–40.9</td>
                  <td>41.0–45.3</td>
                  <td>45.4+</td>
                </tr>
                <tr>
                  <td>60+</td>
                  <td>20.5–26.0</td>
                  <td>26.1–32.2</td>
                  <td>32.3–36.4</td>
                  <td>36.5–44.2</td>
                  <td>44.3+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>For women (ml/kg/min):</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">Poor</th>
                  <th scope="col">Fair</th>
                  <th scope="col">Good</th>
                  <th scope="col">Excellent</th>
                  <th scope="col">Superior</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>20–29</td>
                  <td>23.6–28.9</td>
                  <td>29.0–32.9</td>
                  <td>33.0–36.9</td>
                  <td>37.0–41.0</td>
                  <td>41.1+</td>
                </tr>
                <tr>
                  <td>30–39</td>
                  <td>22.8–26.9</td>
                  <td>27.0–31.4</td>
                  <td>31.5–35.6</td>
                  <td>35.7–40.0</td>
                  <td>40.1+</td>
                </tr>
                <tr>
                  <td>40–49</td>
                  <td>21.0–24.4</td>
                  <td>24.5–28.9</td>
                  <td>29.0–32.8</td>
                  <td>32.9–36.9</td>
                  <td>37.0+</td>
                </tr>
                <tr>
                  <td>50–59</td>
                  <td>20.2–22.7</td>
                  <td>22.8–26.9</td>
                  <td>27.0–31.4</td>
                  <td>31.5–35.7</td>
                  <td>35.8+</td>
                </tr>
                <tr>
                  <td>60+</td>
                  <td>17.5–20.1</td>
                  <td>20.2–24.4</td>
                  <td>24.5–30.2</td>
                  <td>30.3–31.4</td>
                  <td>31.5+</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These bands describe the general population, not athletes. A recreational runner may sit
            in Excellent or Superior while still being well below competitive standards. Use the
            rating as a broad health and fitness guide, and compare your own results over time.
          </p>
        </>
      ),
    },
    {
      heading: "Lab tests and wearables",
      body: (
        <>
          <p>
            A laboratory VO2 max test is the most accurate measure. You run on a treadmill or ride a
            bike while wearing a mask that measures the oxygen and carbon dioxide in your breath, as
            the effort increases until you can't continue. Sports science labs, some gyms and some
            clinics offer it.
          </p>
          <p>
            Many sports watches estimate VO2 max from heart rate and pace during runs. These
            estimates are often within a few ml/kg/min of lab values for steady runners, but can be
            less reliable for beginners, on hilly routes or in heat. Like field tests, they are most
            useful for tracking change over time.
          </p>
        </>
      ),
    },
    {
      heading: "How to improve VO2 max",
      body: (
        <>
          <p>
            VO2 max responds well to training, especially in people who start from a low or moderate
            level. Beginners often improve by a tenth to a fifth within a few months. Well-trained
            athletes improve more slowly, often by a few percent a year.
          </p>
          <ul>
            <li>
              <strong>High-intensity intervals:</strong> hard efforts lasting 3 to 5 minutes near
              the top of your heart rate range, with similar recovery, are among the most effective
              sessions. A classic example is 4 × 4 minutes hard with 3 minutes easy between.
            </li>
            <li>
              <strong>A strong aerobic base:</strong> regular zone 2 sessions support the harder
              work and improve how muscles use oxygen.
            </li>
            <li>
              <strong>Consistency:</strong> two or three cardio sessions a week, every week, matter
              more than any single workout.
            </li>
            <li>
              <strong>Weight management:</strong> because VO2 max is expressed per kilogram, losing
              excess fat raises it even without fitness change.
            </li>
          </ul>
          <p>
            Retest every 8 to 12 weeks with the same test and conditions to see the effect of
            training.
          </p>
        </>
      ),
    },
    {
      heading: "Why VO2 max matters for health",
      body: (
        <>
          <p>
            In large studies following thousands of adults over many years, cardiorespiratory
            fitness is one of the strongest predictors of long-term health. People in the lowest
            fitness groups have substantially higher risk of death from heart disease and other
            causes than those in higher groups, even after accounting for smoking, blood pressure
            and other factors.
          </p>
          <p>
            Moving from the lowest category to the next brings the biggest benefit. That makes VO2
            max a powerful goal for people starting from low fitness: modest, regular aerobic
            training can shift them into a lower-risk group within months.
          </p>
        </>
      ),
    },
    {
      heading: "VO2 max and age",
      body: (
        <>
          <p>
            VO2 max typically falls by about 10% per decade after the age of 30 in inactive people,
            and by about half that in people who stay active. The decline is linked to falling
            maximum heart rate, reduced muscle mass and changes in the heart and blood vessels.
          </p>
          <p>
            Regular training slows this decline considerably. Some lifelong endurance athletes in
            their 60s and 70s have VO2 max values typical of inactive people decades younger. It is
            never too late to improve: older adults who start training often see gains similar in
            percentage terms to younger people.
          </p>
        </>
      ),
    },
    {
      heading: "VO2 max, lactate threshold and economy",
      body: (
        <>
          <p>
            VO2 max is only one part of endurance performance. Two others matter just as much.
            Lactate threshold is the highest intensity you can sustain for a long time without
            lactate building up rapidly; it decides what share of your VO2 max you can use in a
            race. Running economy is how much oxygen you need at a given pace; an economical runner
            uses less energy to run at the same speed.
          </p>
          <p>
            Two runners with the same VO2 max can race very differently if one has a higher
            threshold or better economy. For this reason, training for performance targets all
            three: intervals for VO2 max, threshold sessions for lactate threshold, and plenty of
            easy running and strength work for economy.
          </p>
        </>
      ),
    },
    {
      heading: "What affects VO2 max",
      body: (
        <>
          <ul>
            <li>
              <strong>Genetics:</strong> studies of families suggest about half the variation in VO2
              max, and in how much it responds to training, is inherited.
            </li>
            <li>
              <strong>Sex:</strong> men's values are typically 15 to 30% higher, mainly due to
              higher haemoglobin, larger hearts and less body fat.
            </li>
            <li>
              <strong>Age:</strong> VO2 max falls with age, more slowly in people who stay active.
            </li>
            <li>
              <strong>Body composition:</strong> because it is expressed per kilogram, more body fat
              lowers the value.
            </li>
            <li>
              <strong>Altitude:</strong> VO2 max falls at altitude because less oxygen is available.
            </li>
            <li>
              <strong>Training:</strong> regular aerobic exercise is the factor you can change most.
            </li>
          </ul>
          <p>
            Even with average genetics, most people can raise their VO2 max substantially with
            consistent training.
          </p>
        </>
      ),
    },
    {
      heading: "Interval sessions to raise VO2 max",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Session</th>
                  <th scope="col">Structure</th>
                  <th scope="col">Effort</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Norwegian 4 × 4</td>
                  <td>4 × 4 min hard, 3 min easy</td>
                  <td>Near the top of your heart rate range</td>
                </tr>
                <tr>
                  <td>Classic intervals</td>
                  <td>5 × 3 min hard, 2 to 3 min easy</td>
                  <td>Around 3 to 5K race pace</td>
                </tr>
                <tr>
                  <td>Short intervals</td>
                  <td>10 × 1 min hard, 1 min easy</td>
                  <td>Very hard, but controlled</td>
                </tr>
                <tr>
                  <td>Hill repeats</td>
                  <td>6 to 8 × 2 min uphill, jog down</td>
                  <td>Hard, steady effort</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Do one or two of these sessions a week, with easy aerobic sessions on other days. Warm
            up for 10 to 15 minutes before each one, and build the number of intervals gradually
            over several weeks.
          </p>
        </>
      ),
    },
    {
      heading: "Typical values by sport",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Group</th>
                  <th scope="col">Typical VO2 max (ml/kg/min)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Inactive adults</td>
                  <td>30 to 40</td>
                </tr>
                <tr>
                  <td>Recreational runners</td>
                  <td>40 to 55</td>
                </tr>
                <tr>
                  <td>Team sport players</td>
                  <td>50 to 65</td>
                </tr>
                <tr>
                  <td>Elite middle- and long-distance runners</td>
                  <td>70 to 85</td>
                </tr>
                <tr>
                  <td>Elite cross-country skiers</td>
                  <td>75 to 90</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Women's values in each group are typically lower than men's. These ranges are
            approximate and vary widely between individuals.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a test",
      body: (
        <>
          <p>
            If you can run hard for 12 minutes, the Cooper test is simple and reliable. If you are
            used to timed runs, or training for a military or police test, the 1.5-mile run suits
            you. If running isn't possible, the resting heart rate method gives a rough estimate
            with no exercise at all. For the most accurate result, a laboratory test is best.
          </p>
          <p>
            Whichever you choose, use the same test, course and conditions each time you retest.
            Mixing methods gives numbers that can't be compared reliably.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring resting heart rate for the estimate",
      body: (
        <>
          <p>
            For the heart rate method, measure resting heart rate first thing in the morning, before
            getting up. Lie still for a minute, then count your pulse for 60 seconds, or use a chest
            strap. Repeat on three mornings and average the readings. Avoid measuring after a hard
            training day, a late night or alcohol, all of which raise resting heart rate.
          </p>
          <p>
            If you know your maximum heart rate from a field test, enter it. Otherwise the
            calculator uses 220 − age, which may be 10 or more beats off for you, and that error
            carries straight into the estimate.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: using VO2 max with clients",
      body: (
        <>
          <p>
            VO2 max is a motivating number for many clients, and a meaningful health marker. Test at
            the start of a training block, then every 8 to 12 weeks. Explain the estimate's limits,
            and focus on the client's change over time rather than their category.
          </p>
          <p>
            For clients in the lowest categories, regular moderate aerobic exercise will bring the
            biggest gains and the biggest health benefit. For clients training for performance,
            combine VO2 max with race times and threshold measures to guide the plan.
          </p>
        </>
      ),
    },
    {
      heading: "Common myths",
      body: (
        <>
          <ul>
            <li>
              <strong>VO2 max can't change.</strong> It improves substantially with training,
              especially from a low starting point.
            </li>
            <li>
              <strong>Only athletes need to care.</strong> Cardiorespiratory fitness is one of the
              strongest predictors of long-term health for everyone.
            </li>
            <li>
              <strong>A higher VO2 max always means a faster race.</strong> Lactate threshold and
              economy matter as much.
            </li>
            <li>
              <strong>Wearables measure VO2 max.</strong> They estimate it from heart rate and pace;
              only a lab test measures it directly.
            </li>
          </ul>
          <p>
            Understanding these points helps clients see VO2 max as a useful, changeable target
            rather than a fixed label.
          </p>
        </>
      ),
    },
    {
      heading: "How VO2 max is measured in a lab",
      body: (
        <>
          <p>
            In a laboratory test, you exercise on a treadmill or bike while breathing through a mask
            connected to a gas analyser. The speed, incline or resistance increases every minute or
            two until you can't continue. The analyser measures how much oxygen you take in and how
            much carbon dioxide you breathe out, and VO2 max is the highest oxygen uptake recorded,
            usually averaged over 30 seconds.
          </p>
          <p>
            Labs confirm a true maximum with criteria such as a plateau in oxygen uptake despite
            more work, a high ratio of carbon dioxide to oxygen, and heart rate near the predicted
            max. The test takes 8 to 15 minutes of exercise and is very demanding.
          </p>
        </>
      ),
    },
    {
      heading: "Absolute and relative VO2 max",
      body: (
        <>
          <p>
            VO2 max can be expressed in litres per minute, the total oxygen your body uses, or in
            millilitres per kilogram per minute, relative to body weight. Relative VO2 max is used
            for most comparisons, because it reflects how well you can move your own body, which
            matters for running, walking and most sports.
          </p>
          <p>
            Absolute VO2 max matters more in sports where body weight is supported, such as rowing
            or flat cycling. A heavier rower may have a much larger absolute VO2 max than a lighter
            runner, even with a lower relative value.
          </p>
        </>
      ),
    },
    {
      heading: "A worked comparison",
      body: (
        <>
          <p>
            Take a 35-year-old woman who runs 2,100 m in the Cooper test, giving (2,100 − 504.9) ÷
            44.73 = 35.7 ml/kg/min, rated Excellent for her age. A week later she runs 1.5 miles in
            13:30, giving 3.5 + 483 ÷ 13.5 = 39.3. Her resting heart rate is 58 and, using 220 − age
            for max, the Uth method gives 15.3 × 185 ÷ 58 = 48.8.
          </p>
          <p>
            The three estimates span more than 13 points. The two running tests agree reasonably
            well; the heart rate method, which doesn't involve exercise and relies on an estimated
            max, gives a much higher figure. This is typical, and is why running tests are preferred
            when possible.
          </p>
        </>
      ),
    },
    {
      heading: "Retesting and tracking",
      body: (
        <>
          <p>
            Record each estimate with the method, date and conditions. Retest every 8 to 12 weeks,
            using the same method. An improvement of 2 to 3 ml/kg/min is a meaningful change in
            fitness for most people, roughly equivalent to running 100 m further in the Cooper test
            or about 45 seconds faster over 1.5 miles from a 12:30 starting point.
          </p>
        </>
      ),
    },
    {
      heading: "VO2 max for walkers and beginners",
      body: (
        <>
          <p>
            If running a hard 12 minutes or 1.5 miles isn't realistic yet, the resting heart rate
            method gives a starting point, and walking tests such as the Rockport one-mile walk
            offer a better field estimate for beginners. As fitness improves and running becomes
            comfortable, switch to a running test and keep using it for future comparisons.
          </p>
          <p>
            For beginners, the most important step is not the test but regular movement. Brisk
            walking most days, building to 150 minutes or more a week, will raise VO2 max and bring
            significant health benefits, whatever the starting number.
          </p>
        </>
      ),
    },
    {
      heading: "How long before you see a change",
      body: (
        <>
          <p>
            In studies of previously inactive adults, VO2 max often rises measurably within four to
            six weeks of starting regular aerobic training, with larger gains by 12 weeks. The rate
            of improvement slows as fitness builds. Well-trained athletes may work for a whole
            season to gain a few ml/kg/min.
          </p>
          <p>
            Stopping training reverses the gains surprisingly quickly. After two to four weeks of
            inactivity, VO2 max can fall noticeably. Keeping even a reduced amount of training, such
            as two sessions a week, preserves much of the fitness built.
          </p>
        </>
      ),
    },
    {
      heading: "VO2 max at altitude",
      body: (
        <>
          <p>
            At altitude, the air holds less oxygen, so VO2 max falls. Above about 1,500 m, it drops
            by roughly 7 to 10% for every 1,000 m of altitude. A field test at altitude will give a
            lower estimate than the same test at sea level. If you live or train at altitude,
            compare results only with others from the same altitude.
          </p>
        </>
      ),
    },
    {
      heading: "A quick summary",
      body: (
        <>
          <ul>
            <li>
              <strong>Cooper 12-minute run:</strong> (metres − 504.9) ÷ 44.73.
            </li>
            <li>
              <strong>1.5-mile run:</strong> 3.5 + 483 ÷ minutes.
            </li>
            <li>
              <strong>Resting heart rate:</strong> 15.3 × max HR ÷ resting HR, the roughest of the
              three.
            </li>
            <li>
              <strong>Rating:</strong> compare with general-population norms for your age and sex.
            </li>
            <li>
              <strong>Retest:</strong> same method, every 8 to 12 weeks.
            </li>
          </ul>
          <p>
            Whatever your starting point, regular aerobic training raises VO2 max, and the biggest
            health gains come from moving out of the lowest fitness categories.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing with past results",
      body: (
        <>
          <p>
            Compare estimates only from the same method. A Cooper result and a heart rate estimate
            can differ by ten points without any change in fitness. Keep a simple log with the date,
            method, result and conditions. Over a year, a rising line in the same test is the
            clearest sign that training is working, and a flat line is a useful prompt to adjust the
            plan with your coach.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use your result with ChatGPT",
    whenToUse: "After calculating your estimate with one of the three methods.",
    pasteIn: "Paste your method, result, category and training.",
    text: `I estimated my VO2 max at [vo2] ml/kg/min using the [method] method, rated [category] for a [age]-year-old [sex]. My current training is [training] and my goal is [goal]. Explain what this estimate means, how accurate this method is for an individual, and how VO2 max relates to health and performance. Suggest a 12-week plan to raise it, including easy aerobic sessions and intervals, and when and how to retest. List questions to ask my coach.`,
  },
  forCoaches: {
    heading: "Use the result with your clients",
    body: (
      <>
        <p>
          Cardio numbers are most useful when they turn into a session a client can actually follow.
          Translate the result into something concrete: a heart rate range for this week's easy
          runs, a pace for the long run, a retest date for the field test. Put it in the plan, not
          only in a message, so the client sees it at the moment they train.
        </p>
        <p>
          Then review what came back. Ask clients to log the session with the numbers that matter,
          such as average heart rate, distance, time or how hard it felt, and compare them with the
          target. A pattern across three or four sessions tells you far more than one workout, and
          it gives you an honest basis for changing the plan.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Put the numbers into the plan",
    body: (
      <>
        <p>
          In Traiv you write each client's cardio and strength sessions with the targets that
          matter, and see what they logged in the app beside it. The plan and the evidence stay in
          one place.
        </p>
      </>
    ),
  },
  next: [
    { label: "Cooper test calculator", href: "/tools/cooper-test-calculator" },
    { label: "Beep test calculator", href: "/tools/beep-test-calculator" },
    { label: "Heart rate zone calculator", href: "/tools/heart-rate-zone-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "What is a good VO2 max?",
      a: "For a 30-year-old man, 41.0 to 44.9 ml/kg/min is Good and 45.0 to 49.4 Excellent. For a 30-year-old woman, 31.5 to 35.6 is Good.",
    },
    {
      q: "Which VO2 max method is most accurate?",
      a: "A lab test. Of the field methods here, the Cooper and 1.5-mile runs are more accurate than the resting heart rate estimate.",
    },
    {
      q: "How do I calculate VO2 max from the Cooper test?",
      a: "(Distance in metres − 504.9) ÷ 44.73. Running 2,400 m gives 42.4 ml/kg/min.",
    },
    {
      q: "How do I calculate VO2 max from a 1.5-mile run?",
      a: "3.5 + 483 ÷ your time in minutes. A time of 12:30 gives 42.1 ml/kg/min.",
    },
    {
      q: "Can I estimate VO2 max without exercise?",
      a: "Yes, using resting and maximum heart rate (15.3 × max ÷ resting). It is a rough guide, less reliable than a running test.",
    },
    {
      q: "What is the average VO2 max?",
      a: "For inactive adults, roughly 35 to 40 ml/kg/min for men and 27 to 32 for women in their 30s, falling with age.",
    },
    {
      q: "How long does it take to improve VO2 max?",
      a: "Newcomers commonly gain a tenth to a fifth within two to three months of regular training. Trained athletes improve more slowly.",
    },
    {
      q: "Does losing weight increase VO2 max?",
      a: "Yes, when it is expressed per kilogram. Losing excess fat raises ml/kg/min even if aerobic capacity itself is unchanged.",
    },
    {
      q: "Are smartwatch VO2 max estimates accurate?",
      a: "Often within a few points of lab values for steady runners, but less reliable for beginners, hilly routes or heat. Best used for trends.",
    },
    {
      q: "Why does VO2 max decline with age?",
      a: "Mainly because maximum heart rate and muscle mass fall. Regular training slows the decline considerably.",
    },
    {
      q: "What VO2 max do elite athletes have?",
      a: "Elite endurance athletes often exceed 70 ml/kg/min, and some cross-country skiers and runners exceed 85.",
    },
    {
      q: "Can I use an AI assistant to plan from my result?",
      a: "Yes, to draft a plan for your coach. Share your estimate, method, age, sex and training, and ask it to note the method's error.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only. Running tests are hard, sustained efforts. If you have a heart
        condition, high blood pressure or other health concerns, or have not exercised recently,
        speak to a doctor first.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Programme every client's training under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
