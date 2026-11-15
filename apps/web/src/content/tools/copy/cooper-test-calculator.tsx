import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Cooper test calculator",
  description:
    "Enter the distance you ran in 12 minutes to estimate VO2 max with Cooper's formula, see your average pace and a rating for your age and sex.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Cooper test calculator",
  intro: (
    <>
      <p>
        Run as far as you can in 12 minutes, then enter the distance in metres, kilometres or miles.
        See your estimated VO2 max, your average pace and how the distance rates against Cooper's
        norms for your age and sex.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I calculate VO2 max from the Cooper test?",
    answer: (
      <>
        <p>
          Use Cooper's formula: VO2 max = (distance in metres − 504.9) ÷ 44.73. Running 2,400 m, six
          laps of a 400 m track, gives (2,400 − 504.9) ÷ 44.73 = 42.4 ml/kg/min, at an average pace
          of 5:00 per km. For a 30-year-old man, 2,400 m rates as Good.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What the Cooper test is",
      body: (
        <>
          <p>
            The Cooper test is a simple field test of aerobic fitness: run, or run and walk, as far
            as you can in exactly 12 minutes. Dr Kenneth Cooper developed it in 1968 for the US Air
            Force, as part of the research that led to his book Aerobics and helped launch the
            jogging boom. He found that the distance covered in 12 minutes was closely related to
            VO2 max measured in a laboratory.
          </p>
          <p>
            The test remains popular because it needs only a measured course, usually a 400 m
            running track, and a stopwatch. Schools, sports teams, military units and personal
            trainers use it to assess and track aerobic fitness. Because the whole test takes 12
            minutes of hard effort, it rewards even pacing and gives a clear, repeatable result.
          </p>
        </>
      ),
    },
    {
      heading: "The formula",
      body: (
        <>
          <p>
            Cooper's original paper gave the relationship as VO2 max = (distance in metres − 504.9)
            ÷ 44.73. Every extra 100 metres in 12 minutes adds about 2.2 ml/kg/min to the estimate.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Distance in 12 min</th>
                  <th scope="col">Estimated VO2 max</th>
                  <th scope="col">Average pace</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1,800 m</td>
                  <td>29.0</td>
                  <td>6:40 /km</td>
                </tr>
                <tr>
                  <td>2,000 m</td>
                  <td>33.4</td>
                  <td>6:00 /km</td>
                </tr>
                <tr>
                  <td>2,400 m</td>
                  <td>42.4</td>
                  <td>5:00 /km</td>
                </tr>
                <tr>
                  <td>2,800 m</td>
                  <td>51.3</td>
                  <td>4:17 /km</td>
                </tr>
                <tr>
                  <td>3,200 m</td>
                  <td>60.3</td>
                  <td>3:45 /km</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Some versions use miles: VO2 max = (35.97 × miles) − 11.29. The two forms give almost
            identical results. The calculator converts kilometres and miles to metres before
            applying the metric formula.
          </p>
        </>
      ),
    },
    {
      heading: "Cooper test norms",
      body: (
        <>
          <p>
            Cooper published distance norms by age and sex. The calculator uses these to rate your
            result. For adults (metres in 12 minutes):
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">Sex</th>
                  <th scope="col">Very poor</th>
                  <th scope="col">Poor</th>
                  <th scope="col">Fair</th>
                  <th scope="col">Good</th>
                  <th scope="col">Excellent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>20–29</td>
                  <td>Men</td>
                  <td>Under 1,600</td>
                  <td>1,600–2,199</td>
                  <td>2,200–2,399</td>
                  <td>2,400–2,800</td>
                  <td>Over 2,800</td>
                </tr>
                <tr>
                  <td>20–29</td>
                  <td>Women</td>
                  <td>Under 1,500</td>
                  <td>1,500–1,799</td>
                  <td>1,800–2,199</td>
                  <td>2,200–2,700</td>
                  <td>Over 2,700</td>
                </tr>
                <tr>
                  <td>30–39</td>
                  <td>Men</td>
                  <td>Under 1,500</td>
                  <td>1,500–1,899</td>
                  <td>1,900–2,299</td>
                  <td>2,300–2,700</td>
                  <td>Over 2,700</td>
                </tr>
                <tr>
                  <td>30–39</td>
                  <td>Women</td>
                  <td>Under 1,400</td>
                  <td>1,400–1,699</td>
                  <td>1,700–1,999</td>
                  <td>2,000–2,500</td>
                  <td>Over 2,500</td>
                </tr>
                <tr>
                  <td>40–49</td>
                  <td>Men</td>
                  <td>Under 1,400</td>
                  <td>1,400–1,699</td>
                  <td>1,700–2,099</td>
                  <td>2,100–2,500</td>
                  <td>Over 2,500</td>
                </tr>
                <tr>
                  <td>40–49</td>
                  <td>Women</td>
                  <td>Under 1,200</td>
                  <td>1,200–1,499</td>
                  <td>1,500–1,899</td>
                  <td>1,900–2,300</td>
                  <td>Over 2,300</td>
                </tr>
                <tr>
                  <td>50+</td>
                  <td>Men</td>
                  <td>Under 1,300</td>
                  <td>1,300–1,599</td>
                  <td>1,600–1,999</td>
                  <td>2,000–2,400</td>
                  <td>Over 2,400</td>
                </tr>
                <tr>
                  <td>50+</td>
                  <td>Women</td>
                  <td>Under 1,100</td>
                  <td>1,100–1,399</td>
                  <td>1,400–1,699</td>
                  <td>1,700–2,200</td>
                  <td>Over 2,200</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Separate norms exist for teenagers aged 13 to 19, which the calculator also uses. These
            bands are for the general population; trained runners will often exceed the Excellent
            threshold.
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
      heading: "How to run the Cooper test",
      body: (
        <>
          <ol>
            <li>
              Use a 400 m track if possible, so you can count laps. Otherwise, use a measured flat
              route or a GPS watch.
            </li>
            <li>
              Warm up for 10 to 15 minutes with easy jogging, some drills and a few short strides.
            </li>
            <li>
              Start the stopwatch and run as far as you can in 12 minutes. Walking is allowed if
              needed.
            </li>
            <li>
              Have someone call out the time at each lap or every few minutes, and signal clearly at
              12 minutes.
            </li>
            <li>
              Note exactly where you are when the time ends, and add any part lap to your total.
            </li>
            <li>Cool down with easy jogging and walking for 10 minutes.</li>
          </ol>
          <p>
            On a track, each lap is 400 m. Six laps is 2,400 m; seven is 2,800 m. Count partial laps
            by the 100 m markings, or estimate the remaining distance to the nearest 50 m.
          </p>
        </>
      ),
    },
    {
      heading: "Pacing the 12 minutes",
      body: (
        <>
          <p>
            The most common mistake is starting too fast. The first lap feels easy, and many people
            run it far quicker than they can hold. By the halfway point, they slow sharply and lose
            more distance than they gained. Even pacing, or a slightly faster finish, produces the
            best result.
          </p>
          <p>
            Work out a target pace before the test. To reach 2,400 m, you need to run each 400 m lap
            in exactly 2 minutes. To reach 2,800 m, each lap must take about 1 minute 43 seconds.
            Use your previous result or a recent race to choose a realistic target, then hold that
            pace and push hard in the final two minutes.
          </p>
        </>
      ),
    },
    {
      heading: "How accurate is the Cooper test?",
      body: (
        <>
          <p>
            Cooper's original study found a very strong relationship between 12-minute distance and
            lab-measured VO2 max, with a correlation of about 0.9. Later studies have found somewhat
            weaker relationships, typically 0.6 to 0.9, depending on the group tested. The test
            tends to be most accurate for people who are used to running and pacing.
          </p>
          <p>
            Running economy, motivation, pacing skill, weather and surface all affect the distance.
            Two people with the same VO2 max may cover different distances because one runs more
            efficiently. For tracking your own fitness, though, the test is excellent: run it the
            same way, on the same course, and the change in distance reflects real change in
            fitness.
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
      heading: "The Cooper test for different groups",
      body: (
        <>
          <p>
            The Cooper test suits people who can run continuously for 12 minutes. For beginners, a
            walking test such as the Rockport one-mile walk is often safer and more practical.
            Swimmers and cyclists have their own 12-minute versions, with different formulas and
            norms.
          </p>
          <p>
            Team sport coaches often prefer the beep test, because its stop-start pattern is closer
            to match demands. Endurance coaches often prefer the Cooper test or a time trial,
            because it resembles steady running. Choose the test that matches the client's sport and
            experience, and use it consistently.
          </p>
        </>
      ),
    },
    {
      heading: "Lap times for target distances",
      body: (
        <>
          <p>
            On a 400 m track, divide 12 minutes by the number of laps in your target distance to
            find the lap time to hold.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Target distance</th>
                  <th scope="col">Laps</th>
                  <th scope="col">Time per lap</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2,000 m</td>
                  <td>5</td>
                  <td>2:24</td>
                </tr>
                <tr>
                  <td>2,400 m</td>
                  <td>6</td>
                  <td>2:00</td>
                </tr>
                <tr>
                  <td>2,800 m</td>
                  <td>7</td>
                  <td>1:43</td>
                </tr>
                <tr>
                  <td>3,200 m</td>
                  <td>8</td>
                  <td>1:30</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Aim to run each lap within a couple of seconds of your target. If you feel strong after
            eight minutes, gradually speed up for the final laps.
          </p>
        </>
      ),
    },
    {
      heading: "Norms for teenagers",
      body: (
        <>
          <p>
            Cooper also published norms for 13 to 19-year-olds, which the calculator uses. For boys
            (metres in 12 minutes):
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">Very poor</th>
                  <th scope="col">Poor</th>
                  <th scope="col">Fair</th>
                  <th scope="col">Good</th>
                  <th scope="col">Excellent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>13–14</td>
                  <td>Under 2,100</td>
                  <td>2,100–2,199</td>
                  <td>2,200–2,399</td>
                  <td>2,400–2,700</td>
                  <td>Over 2,700</td>
                </tr>
                <tr>
                  <td>15–16</td>
                  <td>Under 2,200</td>
                  <td>2,200–2,299</td>
                  <td>2,300–2,499</td>
                  <td>2,500–2,800</td>
                  <td>Over 2,800</td>
                </tr>
                <tr>
                  <td>17–19</td>
                  <td>Under 2,300</td>
                  <td>2,300–2,499</td>
                  <td>2,500–2,699</td>
                  <td>2,700–3,000</td>
                  <td>Over 3,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>For girls:</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">Very poor</th>
                  <th scope="col">Poor</th>
                  <th scope="col">Fair</th>
                  <th scope="col">Good</th>
                  <th scope="col">Excellent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>13–14</td>
                  <td>Under 1,500</td>
                  <td>1,500–1,599</td>
                  <td>1,600–1,899</td>
                  <td>1,900–2,000</td>
                  <td>Over 2,000</td>
                </tr>
                <tr>
                  <td>15–16</td>
                  <td>Under 1,600</td>
                  <td>1,600–1,699</td>
                  <td>1,700–1,999</td>
                  <td>2,000–2,100</td>
                  <td>Over 2,100</td>
                </tr>
                <tr>
                  <td>17–19</td>
                  <td>Under 1,700</td>
                  <td>1,700–1,799</td>
                  <td>1,800–2,099</td>
                  <td>2,100–2,300</td>
                  <td>Over 2,300</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Teenagers' results can change quickly with growth and training, so recheck norms as they
            move between age bands.
          </p>
        </>
      ),
    },
    {
      heading: "Weather, surface and other conditions",
      body: (
        <>
          <p>
            Heat, humidity, wind and altitude all reduce the distance you can cover. On a hot day, a
            result may be 100 m or more below what you could manage in cool conditions. Strong wind
            costs time on the exposed straight. A soft, wet or uneven surface slows you down
            compared with a dry track.
          </p>
          <p>
            For fair comparisons, test at a similar time of day, in similar weather, on the same
            surface. Record the conditions with your result, so you can explain an unusually high or
            low score later.
          </p>
        </>
      ),
    },
    {
      heading: "Other 12-minute tests",
      body: (
        <>
          <p>
            Cooper developed versions of the test for swimming and cycling, using the same 12-minute
            idea. In the swimming test, you swim as far as possible in 12 minutes in a pool; in the
            cycling test, you ride as far as possible on a flat course or stationary bike. Each has
            its own distance norms and does not use the running formula.
          </p>
          <p>
            These versions are useful for people who can't run, or for athletes in those sports.
            Results are not directly comparable with the running test, because the activities place
            different demands on the body.
          </p>
        </>
      ),
    },
    {
      heading: "An eight-week plan to improve your result",
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
                  <td>6 × 400 m at target pace, 90 s rest</td>
                  <td>40 min easy run</td>
                </tr>
                <tr>
                  <td>3–4</td>
                  <td>35 min easy run</td>
                  <td>5 × 800 m at target pace, 2 min rest</td>
                  <td>45 min easy run</td>
                </tr>
                <tr>
                  <td>5–6</td>
                  <td>35 min easy run</td>
                  <td>4 × 1,200 m slightly faster than target, 2 min rest</td>
                  <td>50 min easy run</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>30 min easy run</td>
                  <td>3 × 1,600 m at target pace, 3 min rest</td>
                  <td>45 min easy run</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>25 min easy run</td>
                  <td>4 × 400 m at target pace</td>
                  <td>Rest two days, then test</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Target pace is the lap time for the distance you want to reach. These sessions teach
            your body and mind what that pace feels like, which improves pacing on test day as well
            as fitness.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: testing a group",
      body: (
        <>
          <p>
            Run groups of up to 10 people on a track, with a partner for each runner to count laps
            and note the final position. Use a single loud whistle or call at 12 minutes, and ask
            runners to stop where they are so partners can mark the spot. Measure the final partial
            lap to the nearest 10 m using the track markings.
          </p>
          <p>
            Record distances, conditions and estimated VO2 max for each runner. Retest every 8 to 12
            weeks. Share results with each client individually, comparing with their previous test
            before referring to norms.
          </p>
        </>
      ),
    },
    {
      heading: "Common Cooper test mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Starting too fast.</strong> Even pacing almost always produces a better
              result.
            </li>
            <li>
              <strong>Inaccurate lap counting.</strong> Use a partner or a lap counter; it's easy to
              lose count when tired.
            </li>
            <li>
              <strong>Running in lane 2 or wider.</strong> Each lap in an outer lane is longer than
              400 m. Stay in lane 1 if possible.
            </li>
            <li>
              <strong>Skipping the warm-up.</strong> The first minutes feel harder without one, and
              pacing suffers.
            </li>
            <li>
              <strong>Testing when tired.</strong> Hard training in the previous two days lowers the
              result.
            </li>
          </ul>
          <p>Fix these and your result will better reflect your real fitness.</p>
        </>
      ),
    },
    {
      heading: "Tracking change over time",
      body: (
        <>
          <p>
            An improvement of 100 m in the Cooper test means roughly a 2.2 ml/kg/min increase in
            estimated VO2 max. For most people training regularly, gains of 200 to 400 m over three
            to six months are realistic, with beginners improving fastest.
          </p>
          <p>
            Record each result with the date, conditions and how you paced it. Over a year, the
            trend shows how well your training is working, and whether it's time to change the plan.
          </p>
        </>
      ),
    },
    {
      heading: "The history of Cooper's aerobics",
      body: (
        <>
          <p>
            Kenneth Cooper's work in the late 1960s changed how people thought about exercise. His
            book Aerobics introduced a points system that rewarded running, swimming, cycling and
            walking, and helped popularise the idea that regular aerobic exercise improves health.
            The 12-minute test gave people a simple way to measure their own fitness.
          </p>
          <p>
            Cooper later founded the Cooper Institute in Dallas, whose long-term studies of tens of
            thousands of people have linked higher fitness with lower risk of death and disease.
            Many of the VO2 max norms used today come from that research.
          </p>
        </>
      ),
    },
    {
      heading: "Running the test alone",
      body: (
        <>
          <p>
            If you have no partner, a GPS watch can record the distance, but expect an error of a
            few per cent, especially near buildings or trees. On a track, set a lap counter or count
            laps aloud, and note your position at the 12-minute mark using the 100 m markings.
          </p>
          <p>
            Some people find it helpful to set a watch to beep every two minutes, with a target lap
            time for each section. That breaks the 12 minutes into manageable pieces and helps keep
            the pace even.
          </p>
        </>
      ),
    },
    {
      heading: "What a good result means for health",
      body: (
        <>
          <p>
            In the Cooper Institute's studies, people in the lowest fitness group had about twice
            the risk of death from any cause compared with those in moderate groups, even after
            accounting for other risk factors. Moving out of the lowest group gave the largest
            benefit.
          </p>
          <p>
            For a 40-year-old man, moving from 1,350 m to 1,800 m in 12 minutes would shift him from
            Very poor to Fair. That improvement, achievable with a few months of regular running or
            brisk walking, is linked with a meaningful drop in long-term health risk.
          </p>
        </>
      ),
    },
    {
      heading: "Walking the Cooper test",
      body: (
        <>
          <p>
            People who are new to exercise can walk the Cooper test, or mix walking and jogging. A
            brisk walker might cover 1,200 to 1,500 m in 12 minutes. The formula still applies,
            though it is less accurate at low speeds. For beginners, a walking test such as the
            Rockport one-mile walk, which uses heart rate and time, can be a better choice.
          </p>
          <p>
            Whichever version you use, the key is consistency. Retest the same way, and improvements
            in distance will reflect real improvements in fitness.
          </p>
        </>
      ),
    },
    {
      heading: "Converting between kilometres and miles",
      body: (
        <>
          <p>
            The calculator accepts metres, kilometres or miles. 2.4 km is 2,400 m; 1.5 miles is
            about 2,414 m. Six laps of a standard 400 m track is 2,400 m, and four laps is very
            close to a mile (1,600 m versus 1,609 m). If you record your distance in miles from a
            watch, enter it directly and the calculator converts it.
          </p>
        </>
      ),
    },
    {
      heading: "Recovering after the test",
      body: (
        <>
          <p>
            The Cooper test is a hard, sustained effort. Keep walking or jogging gently for ten
            minutes afterwards so heart rate and breathing settle gradually, then stretch. Drink
            water and eat a balanced meal within a couple of hours. Plan an easy day afterwards;
            most people feel the effects in their legs for a day or two.
          </p>
        </>
      ),
    },
    {
      heading: "Using the result to set training paces",
      body: (
        <>
          <p>
            Your Cooper distance can guide training paces. The average pace during the test is close
            to the pace you could hold for about 3 to 5 kilometres. Interval sessions of three to
            five minutes are often run at around that pace. Easy runs should be much slower,
            typically 60 to 90 seconds per kilometre slower than test pace, and threshold runs about
            15 to 25 seconds per kilometre slower.
          </p>
          <p>
            For someone who covers 2,400 m, test pace is 5:00 per kilometre. Easy runs would be
            around 6:00 to 6:30 per kilometre, and threshold runs around 5:15 to 5:25. Recalculate
            these after each test as fitness improves.
          </p>
        </>
      ),
    },
    {
      heading: "Who should not do the Cooper test",
      body: (
        <>
          <p>
            People with heart conditions, uncontrolled high blood pressure, recent chest pain,
            dizziness on exertion, or who have been inactive for a long time should get medical
            advice before a maximal effort. A walking test or a gradual build-up of regular exercise
            is a safer start. Stop the test immediately if you feel chest pain, light-headedness or
            severe breathlessness.
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
              <strong>Test:</strong> run as far as you can in exactly 12 minutes, ideally on a 400 m
              track.
            </li>
            <li>
              <strong>Estimate:</strong> VO2 max = (metres − 504.9) ÷ 44.73.
            </li>
            <li>
              <strong>Rating:</strong> compare your distance with Cooper's norms for your age and
              sex.
            </li>
            <li>
              <strong>Pacing:</strong> hold an even lap time; 2:00 per lap gives 2,400 m.
            </li>
            <li>
              <strong>Retest:</strong> every 8 to 12 weeks under similar conditions.
            </li>
          </ul>
          <p>
            Keep each result with its date and conditions. Over months, the change in your 12-minute
            distance is one of the simplest and most honest measures of how your aerobic fitness is
            responding to training.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing with past results",
      body: (
        <>
          <p>
            When you compare two Cooper tests, check that the course, lane, weather and preparation
            were similar. A 100 m difference can come from wind or a hot day as easily as from
            fitness. Keep notes on conditions and how you paced each test, so a real improvement
            stands out from day-to-day variation. If two tests in a row show a fall in distance
            under similar conditions, review recovery, sleep and training load with your coach.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use your result with ChatGPT",
    whenToUse: "After completing the test and calculating your result.",
    pasteIn: "Paste your distance, estimate, rating and training.",
    text: `I ran [distance] in the Cooper 12-minute test. That estimates my VO2 max at [vo2] ml/kg/min, rated [rating] for a [age]-year-old [sex]. I currently run [training] and my goal is [goal]. Explain what my result means and how reliable it is as an estimate. Suggest a 10-week plan to improve it, including easy running, intervals and a pacing target for my retest. Tell me what lap times to aim for next time and list questions to ask my coach.`,
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
    { label: "Beep test calculator", href: "/tools/beep-test-calculator" },
    { label: "Running pace calculator", href: "/tools/running-pace-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "What is a good Cooper test result?",
      a: "For a 30-year-old man, 2,300 to 2,700 m rates as Good and over 2,700 m as Excellent. For a 30-year-old woman, 2,000 to 2,500 m is Good.",
    },
    {
      q: "How is VO2 max calculated from the Cooper test?",
      a: "VO2 max = (distance in metres − 504.9) ÷ 44.73. Running 2,400 m gives 42.4 ml/kg/min.",
    },
    {
      q: "Can I walk during the Cooper test?",
      a: "Yes. The aim is to cover as much distance as possible in 12 minutes, whether running, walking or both.",
    },
    {
      q: "How many laps of a track is a good result?",
      a: "Six laps of a 400 m track is 2,400 m, rated Good for a 30-year-old man. Seven laps is 2,800 m.",
    },
    {
      q: "How accurate is the Cooper test?",
      a: "It estimates VO2 max reasonably well, especially for experienced runners. For tracking your own fitness, it is very reliable if run the same way each time.",
    },
    {
      q: "How often should I do the Cooper test?",
      a: "Every 8 to 12 weeks is enough to see training effects. Testing more often mostly shows day-to-day variation.",
    },
    {
      q: "Can I use a treadmill?",
      a: "Yes, though results may differ from running outdoors. Set the incline to 1% to better match outdoor effort, and use the treadmill each time.",
    },
    {
      q: "What should I do before the test?",
      a: "Rest the day before, eat a light meal two to three hours ahead and warm up for 10 to 15 minutes.",
    },
    {
      q: "Can I use an AI assistant to plan from my result?",
      a: "Yes, to draft a plan to discuss with your coach. Share your distance, age, sex and training, and ask for safe weekly progression.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only. The Cooper test is a hard, sustained effort. If you have a heart
        condition, high blood pressure or other health concerns, or have not exercised recently,
        speak to a doctor before attempting it.
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
