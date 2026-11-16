import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Keto Macro Calculator: Net Carbs, Protein and Fat (2026)",
  description:
    "Keto macro calculator. Set a net carb limit, get protein from lean mass, and let fat fill your calories for cutting, maintaining or gaining on a ketogenic diet.",
  eyebrow: "Free tool · Nutrition",
  h1: "Keto macro calculator",
  intro: (
    <p>
      A ketogenic diet keeps carbohydrate low enough that the body switches to burning fat and
      producing ketones for fuel. This calculator estimates your calories, fixes net carbs at the
      limit you choose, sets protein from your lean mass when you know your body fat, and gives the
      rest of the calories to fat.
    </p>
  ),
  shortAnswer: {
    question: "How do you calculate keto macros?",
    answer: (
      <>
        <p>
          Fix net carbs first, usually 20 to 50 g a day. Set protein at about 1.6 to 2.0 g per kg of
          lean body mass. Work out your calorie target, subtract the calories from carbs and
          protein, and divide what is left by 9 to get grams of fat.
        </p>
        <p>
          For a 175 lb (79 kg) man at 25% body fat, maintaining on 2,728 kcal with 30 g of net
          carbs: lean mass is about 60 kg, so protein is about 107 g. That leaves roughly 2,180 kcal
          for fat, or about 242 g. Fat ends up around 80 percent of calories.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "The order matters: carbs, then protein, then fat",
      body: (
        <>
          <p>Keto macros are built in a fixed order, because each macro plays a different role:</p>
          <ol>
            <li>
              <strong>Net carbs are a ceiling.</strong> Staying under roughly 20 to 50 g a day is
              what keeps most people in ketosis. It is the defining rule of the diet.
            </li>
            <li>
              <strong>Protein is a target.</strong> Enough to keep muscle, which is roughly the same
              as on any other diet. Older advice to keep protein very low for fear of "kicking you
              out of ketosis" is not supported for normal intakes.
            </li>
            <li>
              <strong>Fat is the lever.</strong> It supplies the remaining calories, so it goes up
              for a bulk and down for a cut. On a fat-loss phase, some of the fat you burn comes
              from your body rather than your plate.
            </li>
          </ol>
        </>
      ),
    },
    {
      heading: "Choosing a net carb limit",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Limit</th>
                  <th scope="col">Who it suits</th>
                  <th scope="col">What it looks like</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>20 g (strict)</td>
                  <td>Starting out; anyone who wants to be sure of ketosis</td>
                  <td>Mostly leafy vegetables; very little fruit</td>
                </tr>
                <tr>
                  <td>30 g (standard)</td>
                  <td>Most people once adapted</td>
                  <td>Generous low-starch vegetables, some berries, nuts</td>
                </tr>
                <tr>
                  <td>50 g (liberal)</td>
                  <td>Active people; those who stay in ketosis at higher intakes</td>
                  <td>More berries, dairy and vegetables; still no grains or sugar</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <strong>Net carbs</strong> are total carbohydrate minus fibre (and, by most counts,
            minus sugar alcohols such as erythritol). Fibre is not digested into glucose, so it does
            not count against the limit. On US labels, subtract the fibre line from total
            carbohydrate. On UK and EU labels, the carbohydrate figure usually excludes fibre
            already.
          </p>
        </>
      ),
    },
    {
      heading: "Why protein is based on lean mass",
      body: (
        <>
          <p>
            Muscle and organs need protein; body fat does not. For someone carrying a lot of fat,
            protein based on total weight can be far more than they need, which matters more on keto
            than on other diets because it squeezes the fat budget.
          </p>
          <p>
            If you enter a body fat percentage, the calculator sets protein at 1.8 g per kg of lean
            mass, about 0.8 g per pound. If you leave it blank, it uses 1.6 g per kg of total
            weight, which lands close to the same number for most people of average build.
          </p>
          <p>
            Lean mass is total weight × (1 − body fat ÷ 100). At 80 kg and 25 percent body fat, that
            is 80 × 0.75 = 60 kg, so protein is about 108 g.
          </p>
        </>
      ),
    },
    {
      heading: "The first weeks on keto",
      body: (
        <>
          <p>
            The first one to two weeks are when most people struggle, and knowing what to expect
            makes it easier to get through:
          </p>
          <ul>
            <li>
              <strong>Fast early weight loss.</strong> Cutting carbohydrate empties glycogen stores
              and the water held with them. A loss of 1 to 3 kg in the first week is mostly water,
              not fat.
            </li>
            <li>
              <strong>"Keto flu".</strong> Headache, tiredness and irritability are common in the
              first days. Much of it comes from losing water and sodium; more salt, more fluid, and
              magnesium- and potassium-rich foods usually help.
            </li>
            <li>
              <strong>Weaker high-intensity training.</strong> Sprints and heavy sets for high reps
              rely on glycogen. Strength and endurance at steady pace usually recover after a few
              weeks of adaptation; very intense work may stay a little harder.
            </li>
            <li>
              <strong>Appetite often drops.</strong> Many people find a ketogenic diet reduces
              hunger, which is one of its main practical advantages for fat loss.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Is keto better for fat loss?",
      body: (
        <>
          <p>
            Not at equal calories. Controlled studies that match calories and protein find fat loss
            on ketogenic diets is about the same as on higher-carbohydrate diets. Where keto helps,
            it helps because people eat less without feeling as hungry, or because the clear rules
            make choices simpler.
          </p>
          <p>That makes it a good fit for some people and a poor fit for others:</p>
          <ul>
            <li>
              It can suit people who find carbohydrate-rich foods hard to moderate, or who like
              simple rules.
            </li>
            <li>
              It tends to suit people doing steady or strength training better than those in
              high-intensity sports.
            </li>
            <li>
              It is hard to sustain socially for some, and very restrictive diets are easy to
              abandon.
            </li>
          </ul>
          <p>
            People with type 1 diabetes, kidney disease or those taking medications for blood sugar
            or blood pressure should only start keto with medical supervision, because needs can
            change quickly.
          </p>
        </>
      ),
    },
    {
      heading: "What 30 g of net carbs looks like",
      body: (
        <>
          <p>
            Carbohydrate adds up quickly on keto, and most of it comes from foods people do not
            think of as carbs. Approximate net carbs in common portions:
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Food</th>
                  <th scope="col">Portion</th>
                  <th scope="col">Net carbs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Spinach, raw</td>
                  <td>100 g</td>
                  <td>about 1 g</td>
                </tr>
                <tr>
                  <td>Broccoli</td>
                  <td>100 g</td>
                  <td>about 4 g</td>
                </tr>
                <tr>
                  <td>Avocado</td>
                  <td>half (about 100 g)</td>
                  <td>about 2 g</td>
                </tr>
                <tr>
                  <td>Raspberries</td>
                  <td>100 g</td>
                  <td>about 5 g</td>
                </tr>
                <tr>
                  <td>Almonds</td>
                  <td>30 g</td>
                  <td>about 3 g</td>
                </tr>
                <tr>
                  <td>Greek yoghurt, full fat</td>
                  <td>150 g</td>
                  <td>about 6 g</td>
                </tr>
                <tr>
                  <td>Onion</td>
                  <td>half a medium</td>
                  <td>about 5 g</td>
                </tr>
                <tr>
                  <td>Apple</td>
                  <td>one medium</td>
                  <td>about 20 g</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Values vary by variety and brand, so check labels. The pattern is clear, though: leafy
            and green vegetables are almost free, berries and nuts fit in small portions, and a
            single piece of most fruit uses up most of a strict day's allowance.
          </p>
        </>
      ),
    },
    {
      heading: "Electrolytes: the most common keto mistake",
      body: (
        <>
          <p>
            Low-carbohydrate diets make the kidneys excrete more sodium and water, and potassium and
            magnesium follow. Many of the symptoms blamed on keto itself, such as headaches,
            dizziness on standing, cramps and poor workouts, are really low electrolytes.
          </p>
          <ul>
            <li>
              <strong>Sodium:</strong> many keto guides suggest adding 1 to 2 g of extra sodium a
              day (roughly half to one teaspoon of salt), more on heavy training days. Broth is an
              easy way to get it.
            </li>
            <li>
              <strong>Potassium:</strong> leafy greens, avocado, mushrooms and salmon are good
              keto-friendly sources.
            </li>
            <li>
              <strong>Magnesium:</strong> nuts, seeds and dark leafy greens; some people use a
              supplement for cramps.
            </li>
          </ul>
          <p>
            Anyone with high blood pressure, heart or kidney disease should talk to a doctor before
            increasing salt.
          </p>
        </>
      ),
    },
    {
      heading: "Coming off keto",
      body: (
        <>
          <p>
            Reintroducing carbohydrate will put weight back on the scale within days, and that is
            mostly glycogen and water, not fat. Expect 1 to 3 kg depending on body size. To make the
            change smoother, add carbohydrate in steps of about 25 to 50 g a day per week, starting
            with whole foods such as fruit, potatoes, oats and rice, and keep total calories at your
            new maintenance.
          </p>
        </>
      ),
    },
    {
      heading: "Keto and strength training",
      body: (
        <>
          <p>
            Lifting weights on a ketogenic diet is entirely possible, and strength often holds up
            well once the body has adapted, which usually takes three to six weeks. Heavy,
            low-repetition work relies mainly on stored phosphocreatine rather than carbohydrate, so
            it is less affected than high-repetition sets or circuits.
          </p>
          <p>
            Where people notice the difference is in volume and conditioning. Long sessions with
            many sets of eight to fifteen repetitions, interval training and sports with repeated
            sprints all draw heavily on muscle glycogen, which stays lower on keto. Some lifters
            handle this by eating a small amount of carbohydrate, around 20 to 30 g, shortly before
            training, an approach sometimes called a targeted ketogenic diet. Others simply accept
            slightly lower training volume during a keto phase.
          </p>
          <p>
            Protein becomes particularly important for lifters on keto. Because carbohydrate is low,
            adequate protein is what protects muscle, and the calculator's lean-mass setting is
            designed with that in mind.
          </p>
        </>
      ),
    },
    {
      heading: "Planning keto meals",
      body: (
        <p>
          A simple structure makes keto much easier to follow day to day. Build each meal from a
          protein source, a large serving of low-starch vegetables and a measured fat. Eggs with
          spinach cooked in butter, salmon with broccoli and olive oil, or chicken thighs with a
          mixed salad and avocado all fit comfortably. Snacks are where carbs and calories tend to
          creep in, so keep them simple: cheese, olives, a small handful of nuts, or cucumber with a
          full-fat dip. Planning the day's food in the morning, rather than deciding at each meal,
          helps keep net carbs within the limit without constant checking.
        </p>
      ),
    },
    {
      heading: "Keto for a short phase or for the long term",
      body: (
        <>
          <p>
            Some people use keto for a defined period, such as eight to twelve weeks of fat loss,
            and then return to a more varied diet. Others keep eating this way for years. Both can
            work. For a short phase, the main goals are to adapt quickly, keep protein high, and
            plan a gradual return to carbohydrate at the end so the scale jump from glycogen and
            water does not cause alarm. For long-term use, the priorities shift toward variety:
            plenty of different vegetables, nuts, seeds, fish and quality fats so that fibre and
            micronutrient intake stay healthy.
          </p>
          <p>
            Whichever approach you choose, regular check-ins with a doctor are sensible if you have
            any existing health conditions, and blood lipids are worth checking after a few months
            because some people see a significant rise in LDL cholesterol on a high-fat diet.
          </p>
        </>
      ),
    },
    {
      heading: "Keto for women",
      body: (
        <>
          <p>
            Women can do well on a ketogenic diet, but a few practical points come up more often.
            Calorie targets are usually lower, so the fixed carbohydrate allowance and adequate
            protein take a bigger share of the total, and fat ends up a smaller share than many keto
            guides assume. That is fine; the carbohydrate limit and protein target matter more than
            hitting a particular fat percentage.
          </p>
          <p>
            Water shifts across the menstrual cycle can mask fat loss for a week or two, so
            comparing the same week of each cycle gives a clearer picture of progress. Some women
            notice changes to their cycle on very low carbohydrate diets, especially when calories
            are also low and training is hard. If that happens, raising calories or adding some
            carbohydrate around training often helps, and it is worth discussing with a doctor if
            changes persist.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Using keto with clients",
    body: (
      <>
        <p>
          Keto works best for clients who choose it rather than clients told to do it. If a client
          asks for it, it can be a good tool; if they are only trying it because they read carbs are
          fattening, a calorie and protein target may serve them better.
        </p>
        <p>
          Plan the first fortnight. Warn them about the water loss so they are not discouraged when
          it stops, and about the tiredness so they do not quit on day three. Suggest salt and fluid
          early.
        </p>
        <p>
          Judge progress from weeks three onward, when water has settled. If fat loss stalls, the
          answer is the same as on any diet: check total calories, which on keto usually means
          checking portions of nuts, cheese and oils.
        </p>
      </>
    ),
  },
  pitch: {
    key: "nutrition",
    heading: "Set keto targets and see what clients eat",
    body: (
      <p>
        In Traiv you set each client's calories and protein, carbohydrate and fat targets, build
        their diet plan from recipes, and review the food they log, so a carb limit can be checked
        against what was actually eaten.
      </p>
    ),
  },
  next: [
    { label: "Compare with a standard macro split", href: "/tools/macro-calculator" },
    { label: "Check your maintenance calories", href: "/tools/maintenance-calorie-calculator" },
  ],
  nextPitch: "Running keto with clients? Traiv tracks targets and food logs together.",
  faq: [
    {
      q: "How many carbs can I eat on keto?",
      a: "Most people stay in ketosis on 20 to 50 g of net carbs a day. Start at 20 to 30 g, then experiment upward if you want more vegetables and berries.",
    },
    {
      q: "What are net carbs?",
      a: "Total carbohydrate minus fibre, and usually minus sugar alcohols such as erythritol. Fibre is not digested into glucose, so it does not affect ketosis.",
    },
    {
      q: "Will too much protein kick me out of ketosis?",
      a: "Not at normal intakes. The amount set here, about 1.6 to 2.0 g per kg of lean mass, is compatible with ketosis for most people and helps preserve muscle.",
    },
    {
      q: "Do I need to eat all my fat grams?",
      a: "Not on a cut. Fat is the flexible macro; if you are full and under your fat target while losing at the rate you want, you do not need to add more.",
    },
    {
      q: "How do I know I am in ketosis?",
      a: "Blood ketone meters are the most accurate; a reading above about 0.5 mmol/L indicates nutritional ketosis. Urine strips are cheaper but become unreliable after the first few weeks.",
    },
    {
      q: "Is keto safe for everyone?",
      a: "Not for everyone. People with type 1 diabetes, kidney or liver disease, a history of eating disorders, or on blood sugar or blood pressure medication should only try it under medical supervision.",
    },
  ],
  disclaimer: (
    <p>
      This calculator gives general information, not medical advice. A ketogenic diet changes blood
      sugar and fluid balance quickly. If you are pregnant, breastfeeding, under 18, take medication
      for diabetes or blood pressure, or have kidney disease or a history of disordered eating, talk
      to a doctor before starting.
    </p>
  ),
  keepGoing: [
    { label: "Macro calculator", href: "/tools/macro-calculator" },
    { label: "Fiber intake calculator", href: "/tools/fiber-intake-calculator" },
    { label: "Water intake calculator", href: "/tools/water-intake-calculator" },
    { label: "How diet plans work in Traiv", href: "/features/nutrition" },
  ],
  close: {
    heading: "Any diet style, one place to plan it",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
