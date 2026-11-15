import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Rucking calorie calculator",
  description:
    "Estimate calories burned rucking from body weight, pack load, pace, grade and terrain with the Pandolf load-carriage equation, versus the same walk unloaded.",
  eyebrow: "Free tool · Heart rate & cardio",
  h1: "Rucking calorie calculator",
  intro: (
    <>
      <p>
        Enter your body weight, pack or vest load, walking pace, uphill grade, terrain and duration
        to estimate the calories you burn rucking, and how much more that is than the same walk
        without a load.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How many calories does rucking burn?",
    answer: (
      <>
        <p>
          At 175 lb with a 30 lb pack, walking at 3 mph on flat pavement for an hour burns about 323
          calories, according to the Pandolf equation. The same walk without the pack burns about
          287, so the load adds about 13%. A 5% uphill grade raises the total to about 511 calories,
          and loose sand to about 560.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What rucking is",
      body: (
        <>
          <p>
            Rucking means walking with a weighted backpack or vest. It comes from military training,
            where soldiers march long distances carrying heavy loads, and has become a popular form
            of fitness training. It raises the energy cost of walking, builds strength in the legs,
            hips, back and core, and improves aerobic fitness, all with much less impact than
            running.
          </p>
          <p>
            Its appeal is its simplicity. Most people can ruck: put some weight in a backpack,
            choose a route and walk. Load, pace, distance and terrain can all be adjusted to make it
            easier or harder, and it fits easily into daily life, whether as a commute, a dog walk
            or a weekend hike.
          </p>
        </>
      ),
    },
    {
      heading: "The Pandolf equation",
      body: (
        <>
          <p>
            The calculator uses the load-carriage equation published by Kent Pandolf, Baruch Givoni
            and Ralph Goldman of the US Army Research Institute of Environmental Medicine in 1977.
            It predicts energy expenditure in watts from body mass, load, speed, grade and terrain:
          </p>
          <ul>
            <li>
              <strong>M</strong> = 1.5W + 2.0(W + L)(L ÷ W)² + η(W + L)(1.5V² + 0.35VG)
            </li>
            <li>
              <strong>W</strong> is body mass in kg, **L** the load in kg, **V** speed in m/s, **G**
              grade in %, and **η** a terrain factor.
            </li>
          </ul>
          <p>
            The first term is the energy of standing. The second adds the cost of carrying the load,
            which rises with the square of the load relative to body weight. The third is the cost
            of moving, which rises with speed, grade, total mass and terrain. Watts are converted to
            calories at 1 watt = 0.01434 kcal per minute.
          </p>
        </>
      ),
    },
    {
      heading: "Terrain factors",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Terrain</th>
                  <th scope="col">Factor (η)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pavement or track</td>
                  <td>1.0</td>
                </tr>
                <tr>
                  <td>Dirt road</td>
                  <td>1.1</td>
                </tr>
                <tr>
                  <td>Trail or light brush</td>
                  <td>1.2</td>
                </tr>
                <tr>
                  <td>Heavy brush</td>
                  <td>1.5</td>
                </tr>
                <tr>
                  <td>Loose sand</td>
                  <td>2.1</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Soft or uneven ground makes every step harder, because energy is lost as the surface
            gives way and the body works to stay balanced. Loose sand roughly doubles the cost of
            moving compared with pavement.
          </p>
        </>
      ),
    },
    {
      heading: "Worked examples",
      body: (
        <>
          <p>For a 175 lb (79.4 kg) person carrying 30 lb (13.6 kg) at 3 mph for 60 minutes:</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Conditions</th>
                  <th scope="col">Calories in 60 min</th>
                  <th scope="col">Per minute</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Flat pavement</td>
                  <td>323</td>
                  <td>5.4</td>
                </tr>
                <tr>
                  <td>Flat dirt road</td>
                  <td>345</td>
                  <td>5.7</td>
                </tr>
                <tr>
                  <td>Flat trail</td>
                  <td>366</td>
                  <td>6.1</td>
                </tr>
                <tr>
                  <td>5% grade, pavement</td>
                  <td>511</td>
                  <td>8.5</td>
                </tr>
                <tr>
                  <td>10% grade, pavement</td>
                  <td>699</td>
                  <td>11.6</td>
                </tr>
                <tr>
                  <td>Flat loose sand</td>
                  <td>560</td>
                  <td>9.3</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Grade has the largest effect. A moderate 5% hill increases the burn by more than half,
            and a 10% hill more than doubles it. Increasing the load from 30 to 45 lb on flat
            pavement adds only about 22 calories an hour, while increasing pace from 3 to 4 mph adds
            about 168.
          </p>
        </>
      ),
    },
    {
      heading: "Load, pace or hills: what matters most",
      body: (
        <>
          <p>
            Because the load term in the equation grows with the square of load relative to body
            weight, light loads add little and heavy loads add a lot. A pack that is 10 to 15% of
            body weight raises energy cost modestly. At 25 to 30%, the increase is much greater, but
            so is the strain on the back, hips and feet.
          </p>
          <p>
            Pace and grade affect total mass moving, so they raise energy cost for both body and
            load. For most people, the safest way to make rucking harder is to walk a little faster
            or add hills, rather than to keep adding weight.
          </p>
        </>
      ),
    },
    {
      heading: "Starting rucking safely",
      body: (
        <>
          <ul>
            <li>
              <strong>Start light:</strong> about 10% of body weight, or 10 to 20 lb for most
              adults.
            </li>
            <li>
              <strong>Start short:</strong> 20 to 30 minutes on flat ground, two or three times a
              week.
            </li>
            <li>
              <strong>Use a good pack:</strong> with padded shoulder straps, a hip belt and the
              weight high and close to your back.
            </li>
            <li>
              <strong>Wear supportive shoes:</strong> walking or trail shoes with good grip.
            </li>
            <li>
              <strong>Progress slowly:</strong> increase time or distance first, then pace or hills,
              and load last.
            </li>
            <li>
              <strong>Listen to your body:</strong> stop if you feel pain in your back, knees, hips
              or feet.
            </li>
          </ul>
          <p>
            Most military guidance recommends building load gradually over weeks, rarely by more
            than about 10% at a time. If you have back, knee or foot problems, get advice from a
            physiotherapist before starting.
          </p>
        </>
      ),
    },
    {
      heading: "Limits of the estimate",
      body: (
        <>
          <p>
            The Pandolf equation was developed from studies of fit young soldiers walking steadily
            on treadmills and outdoor courses. It is less accurate for very slow or very fast
            walking, for downhill walking, which it doesn't model, and for people very different
            from the original study group. Later research has suggested it can underestimate energy
            cost at slow speeds.
          </p>
          <p>
            Treat the result as an estimate for comparing sessions, not an exact measurement. For
            example, it is useful for seeing how much more a hill route costs than a flat one, or
            how a heavier pack compares with a faster pace.
          </p>
        </>
      ),
    },
    {
      heading: "Rucking versus walking and running",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Activity, 175 lb person, 60 min</th>
                  <th scope="col">Approximate calories</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Walking 3 mph, no load</td>
                  <td>287</td>
                </tr>
                <tr>
                  <td>Rucking 3 mph, 30 lb, flat</td>
                  <td>323</td>
                </tr>
                <tr>
                  <td>Rucking 3 mph, 30 lb, 5% grade</td>
                  <td>511</td>
                </tr>
                <tr>
                  <td>Rucking 4 mph, 30 lb, flat</td>
                  <td>491</td>
                </tr>
                <tr>
                  <td>Running 6 mph (10:00 per mile)</td>
                  <td>About 815</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Running burns the most calories per minute, but rucking on hills closes much of the gap
            with far less impact on the joints. The walking and rucking figures come from the
            Pandolf equation; the running figure uses a MET value of about 9.8 from the Compendium
            of Physical Activities.
          </p>
        </>
      ),
    },
    {
      heading: "Benefits beyond calories",
      body: (
        <>
          <p>
            Rucking builds muscular endurance in the legs, glutes, back and core, because they work
            to carry and stabilise the load. It improves posture when the pack is fitted well, and
            places a mild load on the bones, which supports bone density. It also raises heart rate
            enough to improve aerobic fitness, often into zone 2 or 3 on flat ground and higher on
            hills.
          </p>
          <p>
            Because it is low impact and easy to scale, rucking suits a wide range of people, from
            beginners to athletes. It is also social and outdoor-friendly, which helps many people
            stick with it.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a pack and load",
      body: (
        <>
          <p>
            A purpose-built rucking pack with a plate pocket keeps the weight high and close to the
            back, which is easier on the shoulders and spine. A sturdy hiking backpack with a hip
            belt also works. Weight plates, sandbags or water bottles wrapped in a towel can provide
            the load; make sure it doesn't shift as you walk.
          </p>
          <p>
            Weighted vests spread the load around the torso and suit shorter sessions and gym work.
            For longer walks, a backpack with a hip belt is often more comfortable, because it
            transfers some weight to the hips.
          </p>
        </>
      ),
    },
    {
      heading: "A sample progression",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Weeks</th>
                  <th scope="col">Load (175 lb person)</th>
                  <th scope="col">Session</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1–2</td>
                  <td>15 lb</td>
                  <td>2 × 30 min flat</td>
                </tr>
                <tr>
                  <td>3–4</td>
                  <td>20 lb</td>
                  <td>3 × 30 to 40 min, some gentle hills</td>
                </tr>
                <tr>
                  <td>5–6</td>
                  <td>25 lb</td>
                  <td>3 × 40 to 50 min, mixed terrain</td>
                </tr>
                <tr>
                  <td>7–8</td>
                  <td>30 lb</td>
                  <td>2 × 45 min plus one 60 to 75 min walk</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Increase one variable at a time: time, then terrain, then load. If you feel pain in your
            back, knees or feet, step back a week.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: programming rucking",
      body: (
        <>
          <p>
            Rucking can replace or complement a client's cardio sessions, especially for those who
            dislike running or need low-impact options. Write sessions with clear targets for load,
            time and route, and ask clients to log distance, pace and how their back and feet felt
            afterwards.
          </p>
          <p>
            Pair rucking with strength training for the back, hips and core, such as deadlifts,
            rows, carries and planks. Those muscles carry the load, and building their strength
            makes rucking safer and more comfortable.
          </p>
        </>
      ),
    },
    {
      heading: "Rucking for weight loss",
      body: (
        <>
          <p>
            Rucking is a useful addition to a weight loss plan because it raises the energy cost of
            walking while staying low impact. Three one-hour rucks a week at the flat-pavement
            figure above add up to nearly 1,000 calories. With hills, that rises quickly. It also
            builds muscle, which helps preserve lean mass during a calorie deficit.
          </p>
          <p>
            As with any exercise, the calories burned matter less than the overall energy balance
            from food. Rucking works best alongside a moderate calorie deficit, enough protein and
            strength training.
          </p>
        </>
      ),
    },
    {
      heading: "Common rucking mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Too heavy, too soon:</strong> the most common cause of back, hip and foot
              pain.
            </li>
            <li>
              <strong>A loose pack:</strong> a load that swings or sits low strains the lower back.
            </li>
            <li>
              <strong>Poor footwear:</strong> thin soles and no grip make long rucks uncomfortable.
            </li>
            <li>
              <strong>Leaning forward:</strong> stand tall and keep the pack close to your back.
            </li>
            <li>
              <strong>Skipping recovery:</strong> heavy rucking on consecutive days can overload the
              feet and joints.
            </li>
          </ul>
          <p>Avoiding these keeps rucking comfortable and sustainable as you progress.</p>
        </>
      ),
    },
    {
      heading: "Hydration and conditions",
      body: (
        <>
          <p>
            Carrying a load raises body heat and sweat rate. On warm days, carry water and drink
            regularly, and consider a lighter load or a cooler time of day. In cold or wet weather,
            layers and a waterproof pack cover keep you comfortable. Use a reflective layer or light
            when rucking in low light near roads.
          </p>
        </>
      ),
    },
    {
      heading: "Calories per mile",
      body: (
        <>
          <p>
            Because rucking is slow, it can help to think in calories per mile. In the flat-pavement
            example at 3 mph, the 175 lb walker with 30 lb burns about 108 calories per mile. On a
            5% grade, that rises to about 170 calories per mile. Without the pack, flat walking
            costs about 96 calories per mile.
          </p>
          <p>
            Calories per mile make it easy to plan a route: a 4-mile flat ruck at this load is
            roughly 430 calories, and a 4-mile hilly ruck roughly 680. The calculator gives precise
            figures for your own weight, load and route.
          </p>
        </>
      ),
    },
    {
      heading: "Rucking and heart rate",
      body: (
        <>
          <p>
            Rucking on flat ground at a steady pace often keeps heart rate in zone 2, making it a
            good aerobic base session. Hills and heavier loads push heart rate higher, into zone 3
            or 4. Wearing a heart rate monitor helps you choose the right load and route for the
            session you want: easy and long, or shorter and harder.
          </p>
        </>
      ),
    },
    {
      heading: "A quick summary",
      body: (
        <>
          <p>
            Rucking calories depend most on grade and pace, then terrain, then load. Start light,
            progress gradually and use the Pandolf estimate to compare routes and sessions rather
            than as an exact measure.
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
    { label: "Interval walking calculator", href: "/tools/interval-walking-calculator" },
    { label: "Calories burned calculator", href: "/tools/calories-burned-calculator" },
    { label: "Steps to calories calculator", href: "/tools/steps-to-calories-calculator" },
  ],
  nextPitch: "Use these tools together, then turn the numbers into sessions with your coach.",
  faq: [
    {
      q: "How many calories does rucking burn?",
      a: "At 175 lb with a 30 lb pack, walking at 3 mph on flat pavement burns about 323 calories an hour. Hills and soft terrain increase it substantially.",
    },
    {
      q: "Does rucking burn more calories than walking?",
      a: "Yes. In the example above, the 30 lb pack adds about 13% compared with walking unloaded. Heavier loads and hills add more.",
    },
    {
      q: "How heavy should my rucking pack be?",
      a: "Start at about 10% of body weight and build up gradually. Many people stay between 15 and 25%.",
    },
    {
      q: "Is rucking better than running?",
      a: "It burns fewer calories per minute than running, but with much less impact, and it builds strength. Both have a place.",
    },
    {
      q: "What is the Pandolf equation?",
      a: "A 1977 US Army equation that predicts the energy cost of walking with a load from body mass, load, speed, grade and terrain.",
    },
    {
      q: "Does downhill rucking burn fewer calories?",
      a: "Usually, though steep descents still take effort. The Pandolf equation doesn't model downhill walking.",
    },
  ],
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Programme every client's training under your name",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
