import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Calories Burned Calculator: Exercise and Activity (MET)",
  description:
    "Free calories burned calculator. Estimate calories for walking, running, cycling, weights, HIIT, swimming and more from MET values, body weight and duration.",
  eyebrow: "Free tool · Nutrition",
  h1: "Calories burned calculator",
  intro: (
    <>
      <p>
        How many calories does a workout actually burn? Choose an activity, enter your weight and
        how long you did it, and this calculator estimates the energy used, per minute, per hour and
        in total, from published MET values for each activity.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you calculate calories burned during exercise?",
    answer: (
      <>
        <p>
          Multiply the activity's MET value by 3.5, by your weight in kilograms, divide by 200, and
          multiply by the minutes you exercised. A MET is a multiple of resting energy use: brisk
          walking at about 4.3 METs burns roughly 4.3 times what you would sitting still.
        </p>
        <p>
          For a 170 lb (77 kg) person, 30 minutes of brisk walking comes to about 174 kcal, 30
          minutes of running at 6 mph to about 397 kcal, and 30 minutes of general weight training
          to about 142 kcal. These totals include the calories you would have burned at rest anyway.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "The activities and their MET values",
      body: (
        <>
          <p>
            The values come from the Compendium of Physical Activities, a widely used reference that
            lists average energy costs for hundreds of activities.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Activity</th>
                  <th scope="col">MET</th>
                  <th scope="col">kcal in 30 min at 77 kg</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Yoga (Hatha)</td>
                  <td>2.5</td>
                  <td>about 101</td>
                </tr>
                <tr>
                  <td>Weight training (general)</td>
                  <td>3.5</td>
                  <td>about 142</td>
                </tr>
                <tr>
                  <td>Walking (3.5 mph, brisk)</td>
                  <td>4.3</td>
                  <td>about 174</td>
                </tr>
                <tr>
                  <td>Elliptical trainer (moderate)</td>
                  <td>5.0</td>
                  <td>about 202</td>
                </tr>
                <tr>
                  <td>Swimming (moderate)</td>
                  <td>5.8</td>
                  <td>about 235</td>
                </tr>
                <tr>
                  <td>Hiking (cross-country)</td>
                  <td>6.0</td>
                  <td>about 243</td>
                </tr>
                <tr>
                  <td>Rowing machine (moderate)</td>
                  <td>7.0</td>
                  <td>about 283</td>
                </tr>
                <tr>
                  <td>Cycling (12 to 14 mph)</td>
                  <td>8.0</td>
                  <td>about 324</td>
                </tr>
                <tr>
                  <td>HIIT / circuit training</td>
                  <td>8.0</td>
                  <td>about 324</td>
                </tr>
                <tr>
                  <td>Basketball (game)</td>
                  <td>8.0</td>
                  <td>about 324</td>
                </tr>
                <tr>
                  <td>Running (6 mph)</td>
                  <td>9.8</td>
                  <td>about 397</td>
                </tr>
                <tr>
                  <td>Jump rope (moderate)</td>
                  <td>11.8</td>
                  <td>about 478</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      heading: "Why the numbers are estimates",
      body: (
        <>
          <p>
            MET values are averages measured in groups of people, and individuals vary. Fitness
            level, technique, body composition and the exact intensity all change the real figure. A
            trained runner is more efficient than a beginner at the same speed; someone lifting with
            short rests burns more than someone taking long breaks; and "moderate" swimming can mean
            very different things. Most MET-based estimates are within about 20 to 30 percent for an
            average person, which is useful for comparison but not precise.
          </p>
          <p>
            Fitness trackers face the same problem from a different direction. They use heart rate
            and motion to estimate energy, and studies have found their calorie estimates can be off
            by 20 percent or more, often on the high side. No consumer method measures calories
            burned exactly.
          </p>
        </>
      ),
    },
    {
      heading: "Gross versus net calories",
      body: (
        <>
          <p>
            The totals here are gross: they include the energy you would have used anyway if you had
            stayed sitting. To find the extra calories the activity added, subtract roughly 1 MET's
            worth. For a 77 kg person, that is about 1.3 kcal a minute, or 40 kcal over 30 minutes.
            For light activities like yoga or slow walking, the difference between gross and net is
            a large share of the total; for intense activities like running it matters much less.
          </p>
        </>
      ),
    },
    {
      heading: "Should you eat back exercise calories?",
      body: (
        <>
          <p>
            If you use a maintenance or TDEE calculator that already includes your exercise in an
            activity level, do not add exercise calories on top; that counts them twice. If your
            calorie target was set for a sedentary day and you track exercise separately, eating
            back some of the extra calories, often around half to allow for overestimation, is a
            reasonable approach on training days.
          </p>
          <p>
            Either method works. Choose one, apply it consistently and let two to three weeks of
            weight trend tell you whether the target is right.
          </p>
        </>
      ),
    },
    {
      heading: "Exercise and weight loss",
      body: (
        <>
          <p>
            Exercise burns fewer calories than many people expect. A 30-minute run might burn around
            400 kcal, which is about the same as a large muffin. That is why most weight-loss plans
            rely mainly on diet to create a deficit, with exercise supporting it. Exercise also has
            benefits that do not show up in calorie counts: it preserves muscle during a diet,
            improves fitness and mood, and is one of the strongest predictors of keeping weight off
            long term.
          </p>
          <p>
            Daily walking deserves special mention. It burns a meaningful amount over a week, it is
            easy to recover from, and it rarely increases appetite as much as harder exercise can.
            Adding 30 minutes of brisk walking a day adds roughly 1,200 kcal a week for an
            average-sized person.
          </p>
        </>
      ),
    },
    {
      heading: "How MET values are measured",
      body: (
        <>
          <p>
            Researchers measure the oxygen people use during an activity, usually with a mask that
            analyses breathed air, and express it relative to resting oxygen use. One MET is defined
            as an oxygen use of 3.5 millilitres per kilogram of body weight per minute, roughly the
            rate at rest. An activity measured at 8 METs therefore uses about eight times that
            amount. Because oxygen use is closely tied to energy use, METs can be converted to
            calories, which is what this calculator does.
          </p>
          <p>
            The Compendium of Physical Activities collects these measurements from many studies and
            assigns a typical MET value to each activity. It is used widely in research and fitness
            tools because it provides a consistent reference, even though any individual may differ
            from the average.
          </p>
        </>
      ),
    },
    {
      heading: "Intensity matters more than activity",
      body: (
        <>
          <p>
            The same activity can have very different energy costs depending on how it is done.
            Cycling at a leisurely pace might be 4 METs, while racing can exceed 12. Walking ranges
            from about 2 METs at a slow stroll to over 6 METs for fast walking uphill. Weight
            training ranges from light circuits to heavy compound lifts with short rests. The values
            in this calculator represent moderate versions of each activity. If your session was
            easier or harder than typical, the real figure will be lower or higher.
          </p>
          <p>
            A simple way to judge intensity is the talk test. If you can talk comfortably, you are
            at a light to moderate intensity. If you can speak in short sentences but not hold a
            conversation, you are at a moderate to vigorous intensity. If you can only manage a few
            words, you are working hard, and your calorie burn is likely above the moderate
            estimate.
          </p>
        </>
      ),
    },
    {
      heading: "Calories after exercise",
      body: (
        <>
          <p>
            Your body continues to use slightly more energy for a while after exercise, as it
            recovers, replenishes energy stores and repairs tissue. This is often called excess
            post-exercise oxygen consumption, or the afterburn effect. It is real but usually
            modest, typically adding around 6 to 15 percent of the calories burned during the
            session for moderate to hard exercise, and more for very intense or long sessions.
            Claims that certain workouts burn hundreds of extra calories afterward are generally
            exaggerated.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing activities fairly",
      body: (
        <>
          <p>
            When choosing between activities, the best one is usually the one you will do regularly.
            A high-MET activity done once a month burns far less over time than a moderate activity
            done four times a week. It also helps to consider injury risk, recovery and enjoyment.
            High-impact activities such as running and jumping rope burn a lot quickly but place
            more stress on joints, while cycling, swimming, rowing and walking are easier on the
            body and can be done more often.
          </p>
          <p>
            For many people, a mix works best: strength training two or three times a week to build
            and keep muscle, some moderate cardio for heart health, and plenty of daily walking.
          </p>
        </>
      ),
    },
    {
      heading: "Body weight and calorie burn",
      body: (
        <>
          <p>
            Heavier people burn more calories doing the same activity, because moving a larger body
            takes more energy. That is why body weight is part of the calculation. A 90 kg person
            walking briskly for 30 minutes burns about 200 kcal, while a 60 kg person burns about
            135 kcal. It also means that as someone loses weight, the same workout burns fewer
            calories than it did at the start, one of several reasons weight loss tends to slow over
            time.
          </p>
          <p>
            Body composition matters too, though it is not captured in MET calculations. Muscle
            tissue is more metabolically active than fat, so two people of the same weight but
            different body composition may burn slightly different amounts. For most purposes, body
            weight is a good enough approximation.
          </p>
        </>
      ),
    },
    {
      heading: "Calories burned in everyday activities",
      body: (
        <>
          <p>
            Formal exercise is only part of the picture. Everyday activities such as housework,
            gardening, carrying shopping, playing with children and climbing stairs all add up.
            Gardening and heavy cleaning can reach 3 to 5 METs, similar to brisk walking. Taking the
            stairs instead of the lift, walking short journeys and standing more during the day can
            add a few hundred calories of expenditure over a week without any dedicated workout
            time.
          </p>
          <p>
            This everyday movement, sometimes called non-exercise activity, varies enormously
            between people and is one of the biggest reasons two people of the same size can have
            very different calorie needs. Increasing it is often easier and more sustainable than
            adding extra gym sessions.
          </p>
        </>
      ),
    },
    {
      heading: "Using this calculator alongside your daily target",
      body: (
        <>
          <p>
            If you use a calorie target based on a sedentary activity level, this calculator helps
            you estimate how much extra you burned on training days. If you prefer a single daily
            target that already includes your typical exercise, use a TDEE calculator with an
            activity level that matches your normal week, and treat this calculator as a way to
            compare activities rather than a number to add to your intake. Either approach can work;
            the important thing is to avoid counting exercise twice.
          </p>
        </>
      ),
    },
    {
      heading: "Strength training and calorie burn over time",
      body: (
        <>
          <p>
            Strength training may burn fewer calories per session than running or cycling, but it
            has a longer-term effect on energy balance. Building muscle increases resting energy use
            slightly, by roughly 10 to 15 kcal a day per kilogram of muscle, and, more importantly,
            keeping muscle during a diet prevents the drop in metabolism that comes with losing it.
            Strength training also improves the body's ability to handle carbohydrate and supports
            long-term weight maintenance.
          </p>
          <p>
            For overall health and body composition, combining strength training with some cardio
            and plenty of daily movement is more effective than relying on any single activity for
            calorie burn.
          </p>
        </>
      ),
    },
    {
      heading: "Turning calories into a weekly picture",
      body: (
        <>
          <p>
            Looking at a whole week is often more useful than looking at a single session. Add up
            the estimated calories from each training session and from daily walking, and compare
            weeks. A week with three strength sessions, two 30-minute rides and 8,000 steps a day
            might add 2,500 to 3,500 kcal of activity for an average-sized adult. Seeing activity
            this way makes it easier to plan training around goals and to notice when a busy week
            has quietly reduced how much you move.
          </p>
        </>
      ),
    },
    {
      heading: "Rest days still burn calories",
      body: (
        <>
          <p>
            A day without a workout is not a day without calorie burn. Your body uses most of its
            daily energy simply staying alive, and everyday movement adds more on top. Rest days are
            an important part of training, allowing muscles to recover and adapt. Light activity
            such as walking on rest days keeps expenditure up without interfering with recovery.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using calorie burn with clients",
    body: (
      <>
        <p>
          Use these numbers to set expectations rather than targets. Clients who learn that a hard
          gym session burns 300 to 400 kcal stop treating workouts as permission for large treats,
          and start seeing food as the main lever for weight change.
        </p>
        <p>
          Compare activities to choose what fits. A client who hates running may burn just as much
          in a session of rowing or cycling, and enjoy it enough to keep doing it.
        </p>
        <p>
          Encourage walking. It is the easiest way to raise daily expenditure without adding fatigue
          that hurts strength training.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Plan the training that goes with the diet",
    body: (
      <>
        <p>
          In Traiv you build workout plans for each client, including cardio and conditioning, and
          see the sessions they log, so training and nutrition targets work together.
        </p>
      </>
    ),
  },
  next: [
    {
      label: "Estimate calories from your daily steps",
      href: "/tools/steps-to-calories-calculator",
    },
    { label: "Find your total daily calorie burn", href: "/tools/tdee-calculator" },
  ],
  nextPitch: "Coaching training and nutrition? Traiv keeps workout plans and logs together.",
  faq: [
    {
      q: "How accurate are calories burned estimates?",
      a: "MET-based estimates are usually within 20 to 30 percent for an average person. Fitness, technique and intensity all change the real figure.",
    },
    {
      q: "What is a MET?",
      a: "A metabolic equivalent: a multiple of resting energy use. An activity of 5 METs uses about five times the energy of sitting quietly.",
    },
    {
      q: "Does weight training burn many calories?",
      a: "Less than cardio during the session, roughly 3.5 METs for general lifting, but it builds and preserves muscle, which supports body composition.",
    },
    {
      q: "Should I eat back calories burned exercising?",
      a: "Not if your calorie target already includes exercise. If it does not, eating back about half of the estimated calories is a cautious approach.",
    },
    {
      q: "Are fitness tracker calorie counts accurate?",
      a: "Often not very. Studies find errors of 20 percent or more, usually overestimates. They are better for tracking trends than absolute numbers.",
    },
  ],
  keepGoing: [
    { label: "Steps to calories calculator", href: "/tools/steps-to-calories-calculator" },
    { label: "TDEE calculator", href: "/tools/tdee-calculator" },
    { label: "Calorie deficit calculator", href: "/tools/calorie-deficit-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Training and nutrition, planned together",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
