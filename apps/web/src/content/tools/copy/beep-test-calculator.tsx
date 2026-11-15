import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Beep test calculator",
  description:
    "Turn your 20 m beep test level and shuttle into an estimated VO2 max with the Ramsbottom equation, plus speed, distance and an age and sex rating.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Beep test calculator",
  intro: (
    <>
      <p>
        Enter the level and shuttle you reached on the 20 m multistage fitness test to estimate your
        VO2 max. See your final speed, total shuttles and distance, and a rating for your age and
        sex.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I convert a beep test score to VO2 max?",
    answer: (
      <>
        <p>
          Use the Ramsbottom equation: VO2 max = 3.46 × (level + shuttle ÷ shuttles in that level) +
          12.2. Level 9 has 11 shuttles, so level 9 shuttle 5 gives 3.46 × (9 + 5 ÷ 11) + 12.2 =
          44.9 ml/kg/min.
        </p>
        <p>
          That result means 77 shuttles, or 1,540 m, with a final speed of 12.5 km/h. For a
          30-year-old man it rates as Good.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What the beep test is",
      body: (
        <>
          <p>
            The beep test, also known as the multistage fitness test, the bleep test or, in US
            schools, the PACER, is a running test of aerobic fitness. You shuttle between two
            markers set 20 metres apart, arriving at each one before the next beep. The beeps start
            slowly and get faster each level, roughly every minute. Your test is over once you miss
            the line on two shuttles in a row.
          </p>
          <p>
            The test was developed by Luc Léger and colleagues in Canada in the early 1980s and
            refined in 1988. In the same year, Ramsbottom, Brewer and Williams at Loughborough
            University published a version and an equation linking the final level to VO2 max, which
            this calculator uses. Because it needs only a flat 20 m space and a recording, it became
            a standard test in schools, sports clubs, the armed forces, police and fire services
            worldwide.
          </p>
        </>
      ),
    },
    {
      heading: "How the test is scored",
      body: (
        <>
          <p>
            Your result is the last level and shuttle you completed. Level 1 starts at 8.5 km/h, and
            each level is 0.5 km/h faster. Each level lasts about a minute, so faster levels contain
            more shuttles.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Level</th>
                  <th scope="col">Shuttles</th>
                  <th scope="col">Speed (km/h)</th>
                  <th scope="col">Level</th>
                  <th scope="col">Shuttles</th>
                  <th scope="col">Speed (km/h)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>7</td>
                  <td>8.5</td>
                  <td>12</td>
                  <td>12</td>
                  <td>14.0</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>8</td>
                  <td>9.0</td>
                  <td>13</td>
                  <td>13</td>
                  <td>14.5</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>8</td>
                  <td>9.5</td>
                  <td>14</td>
                  <td>13</td>
                  <td>15.0</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>9</td>
                  <td>10.0</td>
                  <td>15</td>
                  <td>13</td>
                  <td>15.5</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>9</td>
                  <td>10.5</td>
                  <td>16</td>
                  <td>14</td>
                  <td>16.0</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>10</td>
                  <td>11.0</td>
                  <td>17</td>
                  <td>14</td>
                  <td>16.5</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>10</td>
                  <td>11.5</td>
                  <td>18</td>
                  <td>15</td>
                  <td>17.0</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>11</td>
                  <td>12.0</td>
                  <td>19</td>
                  <td>15</td>
                  <td>17.5</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>11</td>
                  <td>12.5</td>
                  <td>20</td>
                  <td>16</td>
                  <td>18.0</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>11</td>
                  <td>13.0</td>
                  <td>21</td>
                  <td>16</td>
                  <td>18.5</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>12</td>
                  <td>13.5</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Scores are usually written as level and shuttle, for example 9/5 or 9.5, meaning the
            fifth shuttle of level 9. Note that 9.5 here does not mean nine and a half; it means
            level 9, shuttle 5.
          </p>
        </>
      ),
    },
    {
      heading: "The Ramsbottom equation",
      body: (
        <>
          <p>
            Ramsbottom and colleagues tested runners on both the shuttle test and a treadmill test
            of VO2 max, then fitted an equation to predict one from the other. The version widely
            used today is VO2 max = 3.46 × (L + S ÷ Smax) + 12.2, where L is the level reached, S
            the shuttles completed in that level and Smax the total shuttles in that level.
          </p>
          <p>
            The term in brackets turns your score into a decimal level. Level 9 shuttle 5 is 9 + 5 ÷
            11, or about 9.45. Multiplying by 3.46 and adding 12.2 gives 44.9. In practice, each
            extra level adds about 3.5 ml/kg/min to the estimate.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Score</th>
                  <th scope="col">VO2 max</th>
                  <th scope="col">Shuttles</th>
                  <th scope="col">Distance</th>
                  <th scope="col">Final speed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>6/2</td>
                  <td>33.6</td>
                  <td>43</td>
                  <td>860 m</td>
                  <td>11.0 km/h</td>
                </tr>
                <tr>
                  <td>9/5</td>
                  <td>44.9</td>
                  <td>77</td>
                  <td>1,540 m</td>
                  <td>12.5 km/h</td>
                </tr>
                <tr>
                  <td>12/4</td>
                  <td>54.9</td>
                  <td>110</td>
                  <td>2,200 m</td>
                  <td>14.0 km/h</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            For a 30-year-old man, these would rate as Poor, Good and Superior. For a 30-year-old
            woman, 33.6 rates as Good and both higher scores as Superior. The same score means
            different things at different ages and for each sex, which is why the calculator asks
            for both.
          </p>
        </>
      ),
    },
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
      heading: "How to run the beep test",
      body: (
        <>
          <ol>
            <li>
              Mark two lines exactly 20 metres apart on a flat, non-slip surface such as a sports
              hall floor or track.
            </li>
            <li>
              Use an official recording or app. Unofficial versions with different timings will give
              misleading results.
            </li>
            <li>Warm up for 10 minutes with easy jogging and some dynamic stretches.</li>
            <li>
              Start behind one line. On each beep, run to the other line, placing a foot on or over
              it.
            </li>
            <li>
              Turn and wait for the next beep before running back. As levels rise, you'll have less
              time to wait.
            </li>
            <li>
              If you miss a line, you get a warning. Missing a second consecutive line ends the
              test.
            </li>
            <li>Record the last level and shuttle you fully completed.</li>
            <li>Cool down with easy walking and jogging.</li>
          </ol>
          <p>
            Running in a group helps motivation, but each person should be scored separately. A
            partner who watches the line and records your score makes the result more reliable.
          </p>
        </>
      ),
    },
    {
      heading: "Tips for a better score",
      body: (
        <>
          <ul>
            <li>
              <strong>Pace the early levels.</strong> They are slow; arriving just as the beep
              sounds saves energy.
            </li>
            <li>
              <strong>Turn efficiently.</strong> Plant one foot, pivot and push off. Practise turns
              before the test.
            </li>
            <li>
              <strong>Stay relaxed.</strong> Tense shoulders and clenched hands waste energy.
            </li>
            <li>
              <strong>Be rested.</strong> Avoid hard training in the 24 to 48 hours before.
            </li>
            <li>
              <strong>Eat and drink sensibly.</strong> A light meal two to three hours before works
              well for most people.
            </li>
          </ul>
          <p>
            Familiarity matters. People often improve by a level or so on their second attempt,
            simply from knowing what to expect. If you are using the test to track fitness, do a
            practice run first.
          </p>
        </>
      ),
    },
    {
      heading: "How accurate is the estimate?",
      body: (
        <>
          <p>
            The beep test estimates VO2 max reasonably well for groups, with studies typically
            finding correlations of about 0.8 to 0.9 with laboratory tests. For an individual, the
            estimate may sit several ml/kg/min from a lab result. Running economy, turning skill,
            motivation and body size all affect the score independently of VO2 max.
          </p>
          <p>
            The test favours people who turn well and are used to short, repeated sprints, such as
            team sport players. It can underestimate fitness for long-distance runners who are less
            practised at turning. As a tracking tool, though, it works well: the same person, tested
            the same way, will see a higher level as their fitness improves.
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
      heading: "Beep test standards for sport and services",
      body: (
        <>
          <p>
            Many organisations set beep test entry standards, though they change over time and
            differ between countries. Police fitness tests in the UK have often used a 15 m version,
            with a minimum of level 5.4. Military and fire services use their own standards, and
            team sports often set position-specific targets, with professional football and rugby
            players commonly reaching levels 13 to 15.
          </p>
          <p>
            If you are preparing for a specific test, check the current standard and protocol with
            the organisation, as distances and timings may differ from the 20 m version used here.
          </p>
        </>
      ),
    },
    {
      heading: "VO2 max at the end of each level",
      body: (
        <>
          <p>
            If you finish every shuttle of a level, the decimal score is the next whole level, so
            the estimate is 3.46 × (level + 1) + 12.2. This quick reference shows the VO2 max for
            completing selected levels:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Level completed</th>
                  <th scope="col">VO2 max (ml/kg/min)</th>
                  <th scope="col">Level completed</th>
                  <th scope="col">VO2 max (ml/kg/min)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>19.1</td>
                  <td>11</td>
                  <td>53.7</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>26.0</td>
                  <td>13</td>
                  <td>60.6</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>33.0</td>
                  <td>15</td>
                  <td>67.6</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>39.9</td>
                  <td>17</td>
                  <td>74.5</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>46.8</td>
                  <td>19</td>
                  <td>81.4</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Very high levels are rare. Scores above level 15 are mostly seen in well-trained
            endurance and team sport athletes, and the equation becomes less reliable at the
            extremes.
          </p>
        </>
      ),
    },
    {
      heading: "Typical scores in sport",
      body: (
        <>
          <p>
            Results vary a great deal between sports and positions. As a rough guide, recreationally
            active adults often reach levels 6 to 9. Amateur team sport players commonly reach 9 to
            12. Professional footballers, rugby players and hockey players often score between 12
            and 15, with midfielders and backs at the higher end. Middle- and long-distance runners
            can reach 14 or more, though turning is less natural for them than for team sport
            players.
          </p>
          <p>
            Women's scores are generally lower than men's at similar levels of training, reflecting
            average differences in VO2 max. Professional women's football and hockey players
            commonly reach levels 10 to 13.
          </p>
        </>
      ),
    },
    {
      heading: "An eight-week plan to improve your score",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Weeks</th>
                  <th scope="col">Session 1</th>
                  <th scope="col">Session 2</th>
                  <th scope="col">Session 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1–2</td>
                  <td>30 min easy run</td>
                  <td>6 × 2 min hard, 2 min easy</td>
                  <td>20 m shuttle practice: 4 × 1 min</td>
                </tr>
                <tr>
                  <td>3–4</td>
                  <td>35 min easy run</td>
                  <td>5 × 3 min hard, 2 min easy</td>
                  <td>Shuttle intervals: 6 × 1 min, 1 min rest</td>
                </tr>
                <tr>
                  <td>5–6</td>
                  <td>40 min easy run</td>
                  <td>4 × 4 min hard, 3 min easy</td>
                  <td>Shuttle intervals: 6 × 90 s, 90 s rest</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>40 min easy run</td>
                  <td>6 × 3 min hard, 2 min easy</td>
                  <td>Practice beep test to level 6, then stop</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>25 min easy run</td>
                  <td>4 × 2 min hard</td>
                  <td>Rest two days, then test</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Hard intervals should feel like an 8 out of 10. Easy runs should allow conversation. If
            you play a team sport, count matches and training as part of the week and drop one
            session. Strength training twice a week supports turning and helps prevent injury.
          </p>
        </>
      ),
    },
    {
      heading: "Turning technique",
      body: (
        <>
          <p>
            Turns cost time and energy, especially at higher levels where they happen every few
            seconds. Good turning can add a level or more to your score. Approach the line with
            short, quick steps, lower your hips slightly, plant your outside foot on or just over
            the line, and push off in the new direction. Alternate the turning foot so one leg
            doesn't tire faster than the other.
          </p>
          <p>
            Practise turns at a moderate pace before the test. Many people decelerate too early,
            wasting the time they gained, or overshoot the line and have to come back. Aim to reach
            the line just as the beep sounds at the early levels, then match the rhythm as the beeps
            speed up.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: testing a group",
      body: (
        <>
          <p>
            Test groups in waves of 6 to 10 people, with a partner for each runner to watch the line
            and record the score. Give a standard warm-up, explain the warning rule, and play the
            official recording through a speaker loud enough to hear at both ends. Note the surface,
            temperature and time of day, so retests can match the conditions.
          </p>
          <p>
            Record scores in a consistent format, such as level and shuttle, and calculate VO2 max
            for each athlete. Retest every 8 to 12 weeks on the same surface and at the same time of
            day. Compare each athlete with their own previous scores before comparing them with the
            group.
          </p>
        </>
      ),
    },
    {
      heading: "Common scoring errors",
      body: (
        <>
          <ul>
            <li>
              <strong>Recording the failed shuttle.</strong> The score is the last shuttle
              completed, not the one where the runner stopped.
            </li>
            <li>
              <strong>Confusing notation.</strong> Level 9 shuttle 5 is often written 9.5, which
              looks like nine and a half levels. Record both numbers separately.
            </li>
            <li>
              <strong>Using the wrong recording.</strong> Versions with different speeds or
              distances give results that don't match the tables.
            </li>
            <li>
              <strong>Mismeasured distance.</strong> A course that is a metre short or long changes
              the result. Measure with a tape.
            </li>
            <li>
              <strong>Lenient line calls.</strong> Allowing runners to turn short makes the test
              easier and the scores less comparable.
            </li>
          </ul>
          <p>
            Avoiding these errors makes each result trustworthy and comparable with the next test.
          </p>
        </>
      ),
    },
    {
      heading: "The beep test in schools",
      body: (
        <>
          <p>
            Many schools use the 20 m shuttle run, sometimes called the PACER test in the United
            States, as part of physical education. Large international studies of children's results
            show that aerobic fitness in young people has fallen over recent decades in many
            countries.
          </p>
          <p>
            For children, the test is best used to encourage activity and track personal progress
            rather than to compare classmates. Children's VO2 max norms differ from adults', and the
            adult equation is less suited to them. Schools often use age-specific tables instead.
          </p>
        </>
      ),
    },
    {
      heading: "Beep test versus Cooper test",
      body: (
        <>
          <p>
            Both tests estimate VO2 max from a maximal running effort. The beep test is set by the
            recording: everyone runs at the same pace until they drop out, so pacing skill matters
            less, but turning matters more. The Cooper test is self-paced over 12 minutes, so pacing
            skill matters a great deal and turning doesn't apply.
          </p>
          <p>
            The beep test suits team sports and indoor spaces. The Cooper test suits runners and
            outdoor tracks. Both are reliable for tracking change; choose one and stick with it.
          </p>
        </>
      ),
    },
    {
      heading: "Preparing on the day",
      body: (
        <>
          <p>
            Eat a light meal two to three hours before the test, and drink water through the day.
            Wear supportive running shoes with good grip for the surface. Avoid hard training for 48
            hours beforehand. Warm up for 10 minutes, including a few short accelerations and
            practice turns, so the first levels feel smooth.
          </p>
          <p>
            Mental preparation helps too. The test is designed to be uncomfortable at the end.
            Decide in advance which level you want to reach, and break the later levels into small
            targets: one more shuttle, then one more level.
          </p>
        </>
      ),
    },
    {
      heading: "Safety",
      body: (
        <>
          <p>
            The beep test is a maximal test. It is not suitable for people with heart conditions,
            uncontrolled high blood pressure, recent illness or injury, or anyone who has been
            inactive for a long time without medical clearance. Stop immediately if you feel chest
            pain, dizziness, unusual breathlessness or nausea. A cool-down of easy walking and
            jogging helps heart rate return to normal gradually.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking your progress",
      body: (
        <>
          <p>
            Record your level, shuttle, estimated VO2 max and the conditions each time you test.
            Plot the results over months. Most people see the biggest gains in the first few months
            of regular training. A gain of one level is roughly a 3.5 ml/kg/min improvement in
            estimated VO2 max, a meaningful change in aerobic fitness.
          </p>
        </>
      ),
    },
    {
      heading: "Shuttle intervals for team sport players",
      body: (
        <>
          <p>
            Team sport players can train for the beep test with sessions that mimic its stop-start
            pattern. Set up two lines 20 m apart and run shuttles for a set time at a pace slightly
            faster than your target test level, then rest. Examples include 6 × 1 minute with 1
            minute rest, building to 6 × 2 minutes with 90 seconds rest over several weeks.
          </p>
          <p>
            These sessions train both aerobic fitness and the repeated acceleration and deceleration
            of turning. They also make the rhythm of the test familiar, which helps pacing on test
            day. Combine them with one longer steady run each week for the aerobic base.
          </p>
        </>
      ),
    },
    {
      heading: "How the beep test feels, level by level",
      body: (
        <>
          <p>
            Levels 1 to 4 feel very easy for most active people; many walk between beeps. Levels 5
            to 7 become a steady jog, and breathing rises. From levels 8 to 10, the pace is a firm
            run for most recreational athletes, and the short rest at each line disappears. Beyond
            level 11, the effort is hard and sustained, and only well-trained people continue past
            level 13.
          </p>
          <p>
            Knowing this helps with pacing and mental preparation. Treat the early levels as part of
            your warm-up, settle into a rhythm through the middle levels, and save your focus for
            the levels where you expect to finish.
          </p>
        </>
      ),
    },
    {
      heading: "Body weight and the beep test",
      body: (
        <>
          <p>
            Because the test involves carrying body weight back and forth and changing direction,
            heavier athletes work harder at each level than lighter ones. That partly explains why
            VO2 max is expressed per kilogram. Larger team sport players, such as rugby forwards,
            often score lower than lighter teammates despite similar aerobic capacity in absolute
            terms.
          </p>
          <p>
            For these athletes, comparing with position-specific standards and their own previous
            scores is more useful than comparing with the whole team.
          </p>
        </>
      ),
    },
    {
      heading: "When the result surprises you",
      body: (
        <>
          <p>
            If your score is much lower than expected, check the basics: was the recording official,
            was the course exactly 20 m, were you rested, and did you start too fast or turn poorly?
            Fatigue, heat and illness can all lower a score by a level or more. If your score is
            much higher than expected, check that turns were made at the line and the scoring was
            correct.
          </p>
          <p>
            One unusual result is not a reason to change a training plan. Retest in a few weeks
            under better conditions before drawing conclusions.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: setting targets",
      body: (
        <>
          <p>
            Use the first test as a baseline, then set a target for the next test based on the
            athlete's level and training time. For a beginner training three times a week, an
            improvement of one to two levels over 8 to 12 weeks is realistic. For trained athletes,
            half a level may be a strong result.
          </p>
          <p>
            Link the target to the training: if an athlete reaches level 9 and wants level 10, their
            interval sessions should include running at the speed of level 10, 13 km/h, for
            increasing durations. That makes the goal concrete and the training specific.
          </p>
        </>
      ),
    },
    {
      heading: "Recovering after the test",
      body: (
        <>
          <p>
            After a maximal test, keep moving. Walk or jog gently for at least five to ten minutes
            so heart rate and breathing come down gradually, then stretch the calves, hamstrings and
            hips. Drink water and eat a meal with carbohydrate and protein within a couple of hours.
            Expect some leg soreness the next day, especially if you are not used to turning; an
            easy session or rest day helps.
          </p>
          <p>
            Avoid scheduling the test the day before an important match or hard training session.
            Most people need a day or two to feel fully recovered from an all-out effort.
          </p>
        </>
      ),
    },
    {
      heading: "Why your score may plateau",
      body: (
        <>
          <p>
            Many people improve quickly in their first few tests, then level off. Early gains come
            partly from learning the test and partly from fitness. Once the technique is settled,
            further improvement depends on aerobic fitness, which builds more slowly. A plateau over
            two tests usually means it is time to change the training: more interval work at test
            speed, more total running, or better recovery.
          </p>
          <p>
            Body weight also matters. Carrying extra fat makes every shuttle harder. For some
            people, a gradual reduction in body fat alongside training is what moves the score.
          </p>
        </>
      ),
    },
    {
      heading: "Using the beep test alongside other measures",
      body: (
        <>
          <p>
            The beep test measures one quality, aerobic capacity, and combines it with turning skill
            and pacing. Coaches often pair it with sprint tests, jump tests and strength measures to
            build a fuller picture of an athlete. For general fitness clients, combining it with
            resting heart rate, body measurements and how everyday activities feel gives a clearer
            sense of progress than any single score.
          </p>
        </>
      ),
    },
    {
      heading: "Indoor and outdoor surfaces",
      body: (
        <>
          <p>
            A sports hall floor gives reliable grip and no wind, which is why the beep test is
            usually run indoors. Outdoors, grass can be slippery and uneven, artificial turf grips
            well but can be hot, and tarmac is hard on the joints at the turns. Wind and rain make
            outdoor results less comparable from one test to the next.
          </p>
          <p>
            Wherever you test, use the same surface and shoes each time. Shoes with good lateral
            support and grip matter more for this test than for straight-line running, because of
            the constant turns.
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
              <strong>Score:</strong> the last level and shuttle you fully completed, written as
              level and shuttle.
            </li>
            <li>
              <strong>Estimate:</strong> VO2 max = 3.46 × (level + shuttle ÷ shuttles in level) +
              12.2.
            </li>
            <li>
              <strong>Rating:</strong> compare with norms for your age and sex.
            </li>
            <li>
              <strong>Retest:</strong> every 8 to 12 weeks, same surface, recording and conditions.
            </li>
            <li>
              <strong>Improve:</strong> intervals at test speed, steady running and turn practice.
            </li>
          </ul>
          <p>
            Used this way, the beep test gives a clear, repeatable measure of aerobic fitness that
            you and your coach can build a plan around.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing with past results",
      body: (
        <>
          <p>
            When you compare two tests, look at the conditions first. A higher score on a cool
            evening after a rest day and a lower score on a hot afternoon after a match don't
            necessarily mean fitness has fallen. Note the time of day, surface, temperature,
            footwear and what training you did in the previous two days. Over several tests, those
            notes make the trend clear and stop one unusual result from changing the plan.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use your result with ChatGPT",
    whenToUse: "After you have completed the test and calculated your result.",
    pasteIn: "Paste your score, rating and current training.",
    text: `I completed the 20 m beep test and reached level [level], shuttle [shuttle]. The Ramsbottom equation estimates my VO2 max at [vo2] ml/kg/min, rated [rating] for a [age]-year-old [sex]. I currently train [training] and my goal is [goal, such as a target level by a date]. Explain what this score tells me and its limits as an estimate. Suggest an 8-week plan with intervals, steady running and practice turns, and tell me when to retest. List questions I should ask my coach.`,
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
    { label: "VO2 max calculator", href: "/tools/vo2-max-calculator" },
    { label: "Cooper test calculator", href: "/tools/cooper-test-calculator" },
    { label: "Heart rate zone calculator", href: "/tools/heart-rate-zone-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "What beep test level counts as good?",
      a: "That depends on your age and sex. For a 30-year-old man, level 9 shuttle 5 (44.9 ml/kg/min) rates as Good. For a 30-year-old woman, level 6 shuttle 2 (33.6) rates as Good.",
    },
    {
      q: "How do I calculate VO2 max from my beep test?",
      a: "Use the Ramsbottom equation: 3.46 × (level + shuttle ÷ shuttles in that level) + 12.2. The calculator does this for you.",
    },
    {
      q: "How many shuttles are in each level?",
      a: "Level 1 has 7 shuttles, rising to 16 by levels 20 and 21. Each level lasts about a minute, so faster levels have more shuttles.",
    },
    {
      q: "How fast is each level?",
      a: "Level 1 is 8.5 km/h, and each level adds 0.5 km/h, reaching 18.5 km/h at level 21.",
    },
    {
      q: "What does 9.5 mean on a beep test?",
      a: "Level 9, shuttle 5. It does not mean nine and a half levels.",
    },
    {
      q: "How accurate is the beep test?",
      a: "Good for groups and for tracking change. For an individual, the estimate may be several ml/kg/min from a lab test.",
    },
    {
      q: "How can I improve my beep test score?",
      a: "Train with intervals and steady running, practise turns, and pace the early levels. Familiarity alone often adds about a level.",
    },
    {
      q: "Is the beep test the same as the pacer test?",
      a: "The PACER test used in US schools is a version of the 20 m multistage shuttle run, with its own scoring tables.",
    },
    {
      q: "Can I do the beep test on a shorter distance?",
      a: "Some versions use 15 m. They need their own timings and conversion tables; don't use this calculator for them.",
    },
    {
      q: "Can I use an AI assistant to plan from my result?",
      a: "Yes, to draft a training plan to discuss with your coach. Share your score, age, sex, current training and target, and ask it to include safe progression.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only. The beep test is a maximal test. If you have a heart condition,
        high blood pressure or other health concerns, or have not exercised recently, speak to a
        doctor before attempting it.
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
