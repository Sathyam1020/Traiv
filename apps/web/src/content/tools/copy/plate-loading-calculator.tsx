import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Plate Loading Calculator: Which Plates Go on the Bar",
  description:
    "Free plate loading calculator. Enter a target weight, bar and the plates you have to see exactly which plates to load on each side, in kg or lb.",
  eyebrow: "Free tool · Strength",
  h1: "Plate loading calculator",
  intro: (
    <>
      <p>
        Working out which plates to put on the bar wastes time between sets, especially with unusual
        weights. Enter your target weight, choose your bar and tick the plates you have, and this
        calculator shows exactly which plates go on each side, and how close you can get if an exact
        match is not possible.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do you calculate plates for a barbell?",
    answer: (
      <>
        <p>
          Subtract the bar weight from your target, divide by two for each side, then load the
          heaviest plates that fit, working down to smaller ones. For 102.5 kg on a 20 kg bar, each
          side needs 41.25 kg: a 25, a 15 and a 1.25 kg plate.
        </p>
        <p>
          In pounds, 225 lb on a 45 lb bar needs 90 lb per side: two 45 lb plates. If you lack a
          plate size, the calculator finds the closest weight you can actually load.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator works",
      body: (
        <>
          <p>
            The calculator subtracts the bar from your target, halves the result, and then fills
            each side with the heaviest available plates first, repeating plates as needed. If the
            remaining weight cannot be matched exactly with your plates, it shows the closest
            achievable total and how far short it is.
          </p>
        </>
      ),
    },
    {
      heading: "Standard bars and plates",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Equipment</th>
                  <th scope="col">Metric</th>
                  <th scope="col">Imperial</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Men's Olympic bar</td>
                  <td>20 kg</td>
                  <td>45 lb</td>
                </tr>
                <tr>
                  <td>Women's Olympic bar</td>
                  <td>15 kg</td>
                  <td>35 lb</td>
                </tr>
                <tr>
                  <td>Technique or training bar</td>
                  <td>10 kg</td>
                  <td>25 lb</td>
                </tr>
                <tr>
                  <td>Large plates</td>
                  <td>25, 20, 15, 10 kg</td>
                  <td>45, 35, 25 lb</td>
                </tr>
                <tr>
                  <td>Small plates</td>
                  <td>5, 2.5, 1.25 kg</td>
                  <td>10, 5, 2.5 lb</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Specialty bars, such as trap bars, safety squat bars and cambered bars, often weigh more
            or less than a standard bar. Weigh them or check the manufacturer's figure and enter the
            right value in the target if needed.
          </p>
        </>
      ),
    },
    {
      heading: "Competition colours",
      body: (
        <>
          <p>
            In competition, metric plates are colour-coded: red for 25 kg, blue for 20 kg, yellow
            for 15 kg, green for 10 kg, white for 5 kg, and smaller change plates in other colours.
            Most gyms use black plates for training, but knowing the colours helps at meets and in
            gyms with competition plates.
          </p>
        </>
      ),
    },
    {
      heading: "Loading order and safety",
      body: (
        <>
          <ul>
            <li>
              <strong>Heaviest plates on first,</strong> closest to the inside of the sleeve.
            </li>
            <li>
              <strong>Load both sides evenly,</strong> alternating sides on heavy loads so the bar
              does not tip off the rack.
            </li>
            <li>
              <strong>Always use collars,</strong> especially on squats, presses and anything moved
              off a rack.
            </li>
            <li>
              <strong>Check both sides match</strong> before lifting; uneven loading is a common
              cause of accidents.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Microplates and small jumps",
      body: (
        <>
          <p>
            Small plates of 0.5 to 1.25 kg, or 1 to 2.5 lb, allow tiny increases that keep progress
            going on lifts like the overhead press and bench press, where standard 2.5 kg or 5 lb
            jumps can be too big. If you have microplates, tick them in the calculator to reach
            weights in between standard increments.
          </p>
        </>
      ),
    },
    {
      heading: "Kilograms and pounds",
      body: (
        <>
          <p>
            Many gyms mix kilogram and pound plates. A 20 kg plate is about 44.1 lb, slightly less
            than a 45 lb plate, and a 45 lb plate is about 20.4 kg. Over several plates, the
            difference adds up. Choose the unit that matches your plates, and if you mix them,
            convert carefully so your logged weights stay accurate.
          </p>
        </>
      ),
    },
    {
      heading: "Loading for percentages",
      body: (
        <>
          <p>
            When a programme calls for a percentage of your max, round the result to a weight you
            can actually load. The one-rep max calculator rounds percentages to 5 lb or 2.5 kg
            steps; this calculator then shows exactly which plates to use. Using both together makes
            percentage-based training quick and accurate.
          </p>
        </>
      ),
    },
    {
      heading: "Common loading mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Forgetting the bar weight</strong> when adding up plates.
            </li>
            <li>
              <strong>Counting plates for one side only</strong> and doubling incorrectly.
            </li>
            <li>
              <strong>Mixing kg and lb plates</strong> without converting.
            </li>
            <li>
              <strong>Assuming every bar is 20 kg or 45 lb.</strong> Check specialty and lighter
              bars.
            </li>
          </ul>
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
                  <th scope="col">Target</th>
                  <th scope="col">Bar</th>
                  <th scope="col">Each side</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>60 kg</td>
                  <td>20 kg</td>
                  <td>20 kg</td>
                </tr>
                <tr>
                  <td>82.5 kg</td>
                  <td>20 kg</td>
                  <td>25 + 5 + 1.25 kg</td>
                </tr>
                <tr>
                  <td>140 kg</td>
                  <td>20 kg</td>
                  <td>25 + 25 + 10 kg</td>
                </tr>
                <tr>
                  <td>135 lb</td>
                  <td>45 lb</td>
                  <td>45 lb</td>
                </tr>
                <tr>
                  <td>185 lb</td>
                  <td>45 lb</td>
                  <td>45 + 25 lb</td>
                </tr>
                <tr>
                  <td>315 lb</td>
                  <td>45 lb</td>
                  <td>45 + 45 + 45 lb</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Loading the heaviest plates first keeps the number of plates on the bar low, which makes
            the bar easier to load and unload, and keeps the weight closer to the centre of the
            sleeve.
          </p>
        </>
      ),
    },
    {
      heading: "Why fewer, heavier plates is better",
      body: (
        <>
          <p>
            Using the largest plates possible reduces how much of the sleeve the plates take up,
            leaving room for collars and more plates if needed. It also makes loading faster and
            reduces the chance of mistakes. A 20 kg plate is easier to handle than four 5 kg plates,
            and the bar is more stable with fewer plates on it.
          </p>
        </>
      ),
    },
    {
      heading: "Loading for deadlifts",
      body: (
        <>
          <p>
            For deadlifts, the bar's height off the floor depends on the plate diameter. Standard
            full-size plates, usually 20 kg and 25 kg or 45 lb, set the bar at the standard starting
            height of about 22.5 cm (8.9 in) to the bar's centre. If you need a lighter weight
            without full-size plates, the bar sits lower, which changes the lift. Bumper plates,
            which come in full-size diameter even at lighter weights, or blocks under smaller
            plates, keep the starting height consistent.
          </p>
        </>
      ),
    },
    {
      heading: "Loading at home",
      body: (
        <>
          <p>
            Home gyms often have a limited selection of plates. Before buying, think about which
            jumps you need. A set with pairs of 20, 10, 5, 2.5 and 1.25 kg plates can make almost
            any weight in 2.5 kg steps up to around 100 kg on a 20 kg bar. For heavier lifting, more
            20 kg or 25 kg plates are needed. Ticking only the plates you own in the calculator
            shows the weights you can actually load.
          </p>
        </>
      ),
    },
    {
      heading: "Plate tolerances",
      body: (
        <>
          <p>
            Plates are not always exactly the weight printed on them. Inexpensive cast-iron plates
            can vary by several percent, while calibrated competition plates are accurate to within
            a few grams. For most training this does not matter, but if you are tracking small
            increases, or comparing lifts across gyms, it can make a difference. Weighing your
            plates once on a bathroom or kitchen scale gives you a better idea of what you are
            really lifting.
          </p>
        </>
      ),
    },
    {
      heading: "Loading different bars",
      body: (
        <>
          <p>
            Specialty bars change the maths. A trap bar might weigh 25 kg, a safety squat bar 30 kg,
            a cambered bar 25 kg, and an EZ curl bar around 10 kg. Fixed-weight barbells and smith
            machines are different again; smith machine bars are often counterbalanced, so their
            effective weight is much less than a free bar. Check the weight of the bar you are using
            before calculating plates, and record it in your training log so lifts on different bars
            are not confused.
          </p>
        </>
      ),
    },
    {
      heading: "Percentages and plates together",
      body: (
        <>
          <p>
            When a programme calls for 75 percent of a 160 kg max, the exact figure is 120 kg, which
            loads easily as two 25 kg plates on each side of a 20 kg bar. Other percentages land on
            awkward numbers, such as 78 percent giving 124.8 kg. Round to the nearest loadable
            weight, usually 125 kg, and keep the rounding consistent so your training stays on
            track.
          </p>
        </>
      ),
    },
    {
      heading: "Safety when loading and unloading",
      body: (
        <>
          <p>
            Load and unload plates evenly, alternating sides, especially when the bar is on a rack.
            Removing all the plates from one side at once can flip the bar off the hooks. Lift
            plates with a straight back and bent knees, using the handles if they have them. Use
            collars on every lift, and check the bar is level before starting. Returning plates to
            the rack after use keeps the gym safe for everyone.
          </p>
        </>
      ),
    },
    {
      heading: "Using the calculator during a session",
      body: (
        <>
          <p>
            Keep the calculator open on your phone between sets, especially for sessions with many
            different weights, such as warm-up ramps, top sets and back-off sets. Planning plate
            changes in advance, adding small plates rather than stripping the bar each time, keeps
            rest periods on track and avoids loading mistakes when you are tired.
          </p>
        </>
      ),
    },
    {
      heading: "Converting between units",
      body: (
        <>
          <p>
            If your programme is written in kilograms but your gym has pound plates, or the other
            way round, convert the target weight first, then use the calculator in the gym's unit.
            One kilogram is 2.2046 pounds. For example, a 100 kg target is about 220 lb. On a 45 lb
            bar that needs 87.5 lb per side, which loads as 45 + 35 + 5 + 2.5 lb with a typical
            pound plate set. The calculator works this out automatically if you tick the plates you
            have.
          </p>
        </>
      ),
    },
    {
      heading: "Read the result as one sleeve, not the whole bar",
      body: (
        <>
          <p>
            The plate list is for each side. If it says twenty-five plus fifteen plus
            one-and-a-quarter, put that combination on both sleeves. The total adds both sides to
            the bar. Counting the displayed list only once is a common mistake when moving from a
            written plan to the rack, especially when the target includes small plates.
          </p>
          <p>
            Use a simple check before lifting: add one sleeve, double that number, then add the bar.
            Do the check independently of the target shown in your plan. This catches a missing
            small plate or a mistaken bar choice. A calculator can generate a correct combination
            while the actual equipment on the rack is different.
          </p>
          <p>
            Collars secure the plates, but their weight may also matter. Some competition collars
            contribute a known amount, while ordinary gym clips are often ignored in everyday
            logging. This tool has no collar-weight input. If your target must include weighted
            collars, account for them separately and keep that convention consistent. Do not
            silently add them to the total on one session and omit them on the next.
          </p>
        </>
      ),
    },
    {
      heading: "What the available-plates setting assumes",
      body: (
        <>
          <p>
            Selecting a denomination means the tool may use repeated plates of that size. It does
            not record how many pairs you own. If your home gym has one pair of twenty-kilogram
            plates, a result using three per side is not loadable from that inventory. Check
            quantities as well as denominations before using the suggestion.
          </p>
          <p>
            The default selection represents a conventional set of plate sizes, not a guarantee
            about your gym. Remove sizes that are unavailable. If the resulting load falls short,
            decide whether the nearest lower weight is appropriate for the session. Do not
            compensate by putting a different plate combination on the other sleeve. Both sides must
            remain balanced.
          </p>
          <p>
            The routine selects larger denominations first. With the standard sets supplied here,
            that gives a familiar practical combination. It does not optimise for sleeve length,
            plate thickness, a limited number of pairs or the effort of changing plates between
            exercises. Those are separate equipment constraints. If one matters, review the
            combination manually before loading.
          </p>
        </>
      ),
    },
    {
      heading: "Plan changes between sets before you start",
      body: (
        <>
          <p>
            For a series of increasing loads, keep the heavy inner plates in place where possible
            and change the outer plates. The calculator shows each target independently, so its
            suggested arrangement may not minimise changes across a whole session. You can use an
            equivalent balanced combination if it makes transitions easier, provided the total is
            correct and the plates fit securely.
          </p>
          <p>
            Consider the final working weight when arranging earlier warm-up sets. If a heavy plate
            will be needed later, it may be useful to have it nearby. That does not mean using a
            heavier warm-up than planned just to avoid a change. Preserve the intended progression
            and use the tool to check the arithmetic of each step.
          </p>
          <p>
            When training with someone using a different load, agree on who checks each sleeve after
            a change. A small plate can be left on one side when several people are switching
            between sets. Repeat the total-and-balance check after every adjustment rather than
            assuming the previous lifter left the arrangement you expected.
          </p>
        </>
      ),
    },
    {
      heading: "Understand a rounded target",
      body: (
        <>
          <p>
            A percentage-based plan often produces a number between available increments. A coach
            might intentionally round that target to a practical load. The closest lower weight
            shown here is an equipment result, not a judgement that the original programme was badly
            designed. Keep the intended effort in mind when deciding whether a small difference is
            meaningful.
          </p>
          <p>
            For a lift that progresses slowly, a small increment may be useful. Microplates can make
            a target loadable without a large jump. Before buying them, check that the hole size
            fits your bar and that a matched pair is available. Enter the actual denominations the
            tool supports; do not select a larger plate and pretend it represents several smaller
            ones.
          </p>
          <p>
            If your target is below the bar weight, no plate arrangement can make the bar lighter.
            Choose a lighter suitable bar or another exercise setup with your coach. The bare-bar
            output is not the requested target. That distinction matters for beginners and for
            technical practice where the desired load may be much smaller than a standard bar.
          </p>
        </>
      ),
    },
    {
      heading: "Keep kilograms and pounds distinct",
      body: (
        <>
          <p>
            A twenty-kilogram plate is close to, but not identical to, a forty-five-pound plate. A
            twenty-kilogram bar is also not exactly a forty-five-pound bar. The unit switch changes
            the assumed equipment set as well as converting the target. Expect the actual loadable
            target to move slightly because the available increments change.
          </p>
          <p>
            Do not convert the plate labels individually and then round each one before adding them.
            That can create a different total from converting the complete loaded bar. Add the
            equipment in its native unit first, then convert the total when needed for a log. Record
            which system the equipment uses so future comparisons remain understandable.
          </p>
          <p>
            Mixed-unit equipment requires a separate arithmetic check. This interface assumes one
            unit system for the selected bar and plate set. If your gym combines kilogram bumpers
            with pound iron plates, convert the real combination carefully rather than expecting a
            single checkbox selection to represent it. Keep equal loads on both sides regardless of
            the labels printed on the plates.
          </p>
        </>
      ),
    },
    {
      heading: "Make the final check part of the routine",
      body: (
        <>
          <p>
            Before each work set, confirm the exercise, bar, target, plate order and matching
            sleeves. Ask for help when changing a heavy or awkward setup. Use appropriate rack
            safeties and a spotter where the lift and setting call for them. Accurate arithmetic is
            useful, but it does not replace safe setup or the skill required for the exercise.
          </p>
          <p>
            After the set, log the load actually used. If the nearest practical weight differed from
            the planned percentage, preserve both the plan and the completed result. That makes the
            next adjustment easier and prevents a rounded load from being mistaken for a different
            strength level. A good training record explains what happened, including small equipment
            constraints.
          </p>
        </>
      ),
    },
    {
      heading: "Worked checks using the supplied plate sets",
      body: (
        <>
          <p>
            For a 100 kg target on a 20 kg bar, the plates account for 80 kg in total. Each sleeve
            therefore needs 40 kg. With the default kilogram set, a 25 kg plate and a 15 kg plate on
            each side make that amount. Check it as 20 plus twice 40, which equals 100. The result
            refers to each sleeve, not to a single forty-kilogram addition across the whole bar.
          </p>
          <p>
            For a 102.5 kg target using the same bar, each sleeve needs 41.25 kg. A 25 kg plate, a
            15 kg plate and a 1.25 kg plate make 41.25. Twice that amount plus the bar produces
            102.5. If the small plates are not available, the exact target cannot be made from those
            larger increments. The tool reports the lower load it can assemble rather than inventing
            a plate.
          </p>
          <p>
            For a 225 lb target on a 45 lb bar, the sleeves together need 180 lb. That is 90 lb per
            side, or two 45 lb plates on each sleeve. Adding a single extra 2.5 lb plate to both
            sides increases the whole bar by 5 lb, not 2.5. This is why plate increments and
            total-load increments must be distinguished when planning a small progression.
          </p>
          <p>
            For a 135 lb target with the same bar, one 45 lb plate on each sleeve is sufficient. The
            phrase one plate often refers to that familiar arrangement, but it is ambiguous when the
            gym uses different denominations. Write the full load and unit in a client plan instead
            of relying on shorthand. Someone reading the plan in a kilogram gym should not need to
            guess which plate the coach intended.
          </p>
          <p>
            When checking a result, write the equation in the order you will inspect the equipment:
            bar plus left sleeve plus right sleeve. The two sleeve totals should match before you
            add them. A correct overall total could otherwise conceal an unequal arrangement.
            Balanced loading is a separate condition from reaching the desired total, and both need
            to be true before a set begins.
          </p>
          <p>
            The tool does not know whether a plate is calibrated, whether a bar is damaged, or
            whether the selected arrangement fits inside the collars. Those are physical checks. If
            a combination does not fit, use another balanced arrangement or a different appropriate
            setup. Do not leave collars insecure to accommodate a calculated result. The number is a
            planning aid, and the actual equipment remains the final constraint.
          </p>
        </>
      ),
    },
    {
      heading: "Confirm again when equipment changes",
      body: (
        <>
          <p>
            Recalculate after choosing another bar rather than leaving the previous result in place.
            Two bars that look similar may have different masses. The same plate arrangement then
            produces a different total, even though the sleeves look unchanged. Check the
            manufacturer label or ask the gym staff when the bar weight is uncertain.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Plan the plate changes for a whole session",
    whenToUse:
      "When you have several working weights in a session and want to plan loading so plate changes are quick.",
    pasteIn:
      "Your bar weight, the plates available, and the list of weights for each set in the session.",
    text: `I'm planning a training session.
Bar: [weight]
Plates available: [list]
Sets in order: [weight × reps, weight × reps, ...]

1. Tell me which plates go on each side for every set.
2. Order the changes so I add or remove as few plates as possible between sets.
3. Flag any weight I cannot load exactly and suggest the closest option.`,
  },
  forCoaches: {
    heading: "Using plate loading with clients",
    body: (
      <>
        <p>
          Plate maths is a surprisingly common source of mistakes for newer clients. Showing them
          how to load the bar, or giving them the exact plates per side, prevents logging errors and
          uneven loading.
        </p>
        <p>
          In shared gyms, encourage clients to check bar weights, since many gyms have lighter bars
          that look like standard ones.
        </p>
        <p>
          Recommend microplates for lifts that progress slowly, so clients can keep adding weight in
          small steps.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Programmes with exact weights for every set",
    body: (
      <>
        <p>
          In Traiv you build workout plans for each client, set weights from their numbers, and see
          every set and rep they log, so progress on each lift is visible week by week.
        </p>
      </>
    ),
  },
  next: [
    { label: "Build a warm-up for your working weight", href: "/tools/warm-up-set-calculator" },
    { label: "Get working weights from your max", href: "/tools/one-rep-max-calculator" },
  ],
  nextPitch: "Coaching in the gym? Traiv keeps every client's weights, sets and progress together.",
  faq: [
    {
      q: "How do I calculate plates per side?",
      a: "Subtract the bar weight from the target and divide by two, then load the heaviest plates that fit.",
    },
    {
      q: "How much does a standard barbell weigh?",
      a: "A men's Olympic bar weighs 20 kg or 45 lb; a women's bar 15 kg or about 35 lb.",
    },
    {
      q: "What plates do I need for 100 kg?",
      a: "On a 20 kg bar: a 25 kg and a 15 kg plate on each side.",
    },
    { q: "What plates do I need for 225 lb?", a: "On a 45 lb bar: two 45 lb plates on each side." },
    {
      q: "What if I cannot load the exact weight?",
      a: "The calculator shows the closest weight you can load with your plates and how far short it is.",
    },
    {
      q: "Do I need collars?",
      a: "Yes, especially for squats and presses. They stop plates sliding off unevenly.",
    },
    {
      q: "Are kg and lb plates the same?",
      a: "No. A 20 kg plate is about 44.1 lb, slightly lighter than a 45 lb plate.",
    },
    {
      q: "What are microplates?",
      a: "Very small plates, often 0.5 to 1.25 kg, used for small increases on slowly progressing lifts.",
    },
    {
      q: "How much does a trap bar weigh?",
      a: "It varies by model, commonly 20 to 30 kg. Check the manufacturer's figure.",
    },
    {
      q: "Which plates go on first?",
      a: "The heaviest plates go closest to the inside of the sleeve.",
    },
    {
      q: "What are bumper plates?",
      a: "Rubber plates designed to be dropped, used in weightlifting and some gyms. They are thicker than iron plates.",
    },
    {
      q: "What colour is a 25 kg plate?",
      a: "Red, in competition colour coding. Blue is 20 kg, yellow 15 kg, green 10 kg.",
    },
    {
      q: "Can I mix kg and lb plates on one bar?",
      a: "You can, but convert the weights carefully so your total is accurate.",
    },
  ],
  keepGoing: [
    { label: "Warm-up set calculator", href: "/tools/warm-up-set-calculator" },
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "Strength standards calculator", href: "/tools/strength-standards-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Exact weights, every set, for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
