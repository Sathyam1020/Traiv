import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "GLP-1 client coaching planner",
  description:
    "Build a coaching plan for a client on a GLP-1 weight-loss medication: muscle-protecting training, protein strategies, habits and what stays with the prescriber.",
  eyebrow: "Free tool · Client issue",
  h1: "Coaching a client on a GLP-1 medication",
  intro: (
    <>
      <p>
        Clients on GLP-1 medications often lose weight quickly, and without the right support a
        large share of it can be muscle. The coach's role is the part the medication doesn't cover:
        protecting muscle through training, reaching protein when appetite is low, and building
        habits that last after the medication ends. Set where the client is and get a plan, with a
        clear line on what belongs with their prescriber. Not medical advice. Your choices stay in
        your browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How should I coach a client on a GLP-1 medication?",
    answer: (
      <>
        <p>
          Focus on strength training two to four times a week, protein at every meal (often around
          1.2 to 1.6 g per kg of body weight a day, adjusted with their prescriber if they have
          other conditions), fluids, daily steps and habits that will last. Watch strength, waist
          and protein at check-ins. Leave the medication, dose and side effects to the prescriber.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why coaching matters on a GLP-1",
      body: (
        <>
          <p>
            GLP-1 receptor agonists and related medications reduce appetite and can lead to
            substantial weight loss. Studies show that a meaningful share of the weight lost can be
            lean mass, including muscle. Losing muscle lowers strength, affects metabolism and can
            make weight regain more likely when the medication stops.
          </p>
          <p>
            Coaching addresses exactly that. Strength training signals the body to hold on to
            muscle, adequate protein supplies what muscle needs, and habits built during treatment
            help maintain results afterwards.
          </p>
        </>
      ),
    },
    {
      heading: "Four stages",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col">Coaching focus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Just starting</td>
                  <td>Build protein, strength and fluid habits early; expect side effects</td>
                </tr>
                <tr>
                  <td>Mid-titration</td>
                  <td>Keep training steady; protect protein as appetite falls further</td>
                </tr>
                <tr>
                  <td>Stable dose</td>
                  <td>Progressive strength training; protein most days</td>
                </tr>
                <tr>
                  <td>Coming off or tapering</td>
                  <td>Structured meals and training as appetite returns</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>The planner adjusts its focus to the stage you select.</p>
        </>
      ),
    },
    {
      heading: "Training to protect muscle",
      body: (
        <>
          <p>
            Strength training is the single most important coaching tool for these clients. Two to
            four sessions a week, built around compound movements such as squats or leg presses,
            hinges, pushes, pulls and carries, gives muscle a reason to stay. The aim is to keep the
            weights steady or slowly rising while body weight falls.
          </p>
          <p>
            Adjust volume to energy. On low-appetite days, shorter sessions that stop a rep or two
            before failure are better than skipped sessions. Daily walking adds activity without
            much fatigue.
          </p>
        </>
      ),
    },
    {
      heading: "Protein when appetite is low",
      body: (
        <>
          <p>
            Reaching protein targets is often the hardest part. Appetite can be very low, and large
            meals may cause discomfort. Practical strategies include leading each meal with protein,
            eating smaller, more frequent portions, choosing soft or liquid protein sources such as
            yoghurt, milk, eggs or shakes, and tracking protein alone rather than every calorie.
          </p>
          <p>
            A common target for adults losing weight is around 1.2 to 1.6 g per kg of body weight a
            day, but clients with kidney disease or other conditions need guidance from their
            prescriber or a dietitian.
          </p>
        </>
      ),
    },
    {
      heading: "Side effects and when to refer",
      body: (
        <>
          <p>
            Nausea, constipation, reflux and fatigue are common, especially early on and after dose
            increases. Coaches can help with practical eating habits, such as eating slowly and
            avoiding very rich meals, but managing side effects medically belongs with the
            prescriber.
          </p>
          <ul>
            <li>Severe or persistent vomiting or diarrhoea</li>
            <li>Signs of dehydration, such as dizziness or very dark urine</li>
            <li>Severe abdominal pain, which can signal gallbladder or pancreas problems</li>
            <li>A client who can't eat enough to function or train</li>
          </ul>
          <p>Refer any of these to the prescriber promptly.</p>
        </>
      ),
    },
    {
      heading: "What to watch at check-ins",
      body: (
        <>
          <p>
            Track weight trend, waist and strength on the main lifts. Strength holding steady while
            weight falls is a good sign that muscle is being protected. Also track protein days,
            training sessions, energy and side effects. A sudden drop in strength, very rapid weight
            loss or persistent fatigue are reasons to review the plan and, where needed, talk to the
            prescriber.
          </p>
        </>
      ),
    },
    {
      heading: "Preparing for life after the medication",
      body: (
        <>
          <p>
            Many people stop GLP-1 medications at some point, and appetite usually returns. Habits
            built during treatment, such as regular protein-rich meals, consistent strength
            training, daily movement and an awareness of hunger and fullness, make the difference
            between maintaining results and regaining weight. Start building these from the
            beginning, not at the end.
          </p>
        </>
      ),
    },
    {
      heading: "Staying in your lane",
      body: (
        <>
          <p>
            The medication, dose, side-effect management and decisions about continuing or stopping
            belong with the prescriber. Coaches support training, food habits and behaviour.
            Coordinate where possible, encourage clients to report side effects, and keep a note of
            what's coaching and what's medical.
          </p>
        </>
      ),
    },
    {
      heading: "A sample plan",
      body: (
        <>
          <p>
            For a beginner just starting the medication, with three training days and difficulty
            eating enough protein, the planner suggests three full-body sessions of two to three
            sets of 8 to 12 reps on five or six exercises, centred on compound movements. It
            suggests protein at every meal with smaller, more frequent portions and liquid protein
            on difficult days, tracking protein alone for the first few weeks, and daily walking. It
            lists what to watch at check-ins and what stays with the prescriber.
          </p>
        </>
      ),
    },
    {
      heading: "Training through dose increases",
      body: (
        <>
          <p>
            Appetite and energy often dip for a few days after each dose increase. Plan for it: keep
            sessions shorter during those days, prioritise protein and fluids, and don't push for
            personal bests. Once the client adjusts, training can return to normal. Consistency
            through these weeks matters more than intensity.
          </p>
        </>
      ),
    },
    {
      heading: "Talking about body composition",
      body: (
        <>
          <p>
            Clients on GLP-1 medications often focus on the scale, which can move quickly. Help them
            value strength and waist measurements too. A client whose weight falls 8 kg while their
            squat holds steady has likely kept most of their muscle, which is a much better result
            than the same weight loss with falling strength.
          </p>
        </>
      ),
    },
    {
      heading: "Nutrition beyond protein",
      body: (
        <>
          <p>
            Fibre from vegetables, fruit, legumes and wholegrains supports digestion, which matters
            when constipation is common. Regular fluids help with both side effects and energy.
            Smaller meals eaten slowly reduce discomfort. Keep advice general and practical;
            anything specific to a medical condition belongs with a dietitian or doctor.
          </p>
        </>
      ),
    },
    {
      heading: "Coordinating with the prescriber",
      body: (
        <>
          <p>
            Where the client is comfortable, encourage them to share their training and nutrition
            plan with their prescriber, and to report side effects promptly. A coach who works
            alongside the medical team, rather than around it, gives the client the safest and most
            effective support.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            Medication details are sensitive health information. The planner runs in your browser
            and stores nothing. In your own records, keep health information secure and share it
            only with the client's consent.
          </p>
        </>
      ),
    },
    {
      heading: "Clients new to strength training",
      body: (
        <>
          <p>
            Many clients starting a GLP-1 medication have never lifted weights. Start simply:
            machines or dumbbells, a few movement patterns, moderate loads and a focus on good form.
            Two sessions a week is enough to begin. The goal is a routine they can keep, so that
            strength training becomes part of their life alongside the medication and after it.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking progress beyond the scale",
      body: (
        <>
          <ul>
            <li>Waist measurement every two weeks</li>
            <li>Strength on two or three main lifts</li>
            <li>Days protein target was met</li>
            <li>Training sessions completed</li>
            <li>Energy and side effects, rated weekly</li>
          </ul>
          <p>
            These measures show whether the weight lost is mostly fat and whether the habits that
            protect muscle are in place.
          </p>
        </>
      ),
    },
    {
      heading: "When progress stalls",
      body: (
        <>
          <p>
            Weight loss on GLP-1 medications often slows after the first months. That's normal. Keep
            the focus on strength, protein and habits rather than chasing faster loss. If a client
            is worried, encourage them to discuss it with their prescriber; changes to the
            medication are a medical decision.
          </p>
        </>
      ),
    },
    {
      heading: "Habits that outlast the medication",
      body: (
        <>
          <ul>
            <li>Protein at every meal, without having to think about it</li>
            <li>Two or three strength sessions a week, every week</li>
            <li>A daily step target that fits their routine</li>
            <li>Regular meal times, so hunger doesn't catch them off guard</li>
            <li>A weekly check-in habit, so drift is noticed early</li>
          </ul>
          <p>
            If these are in place before the medication ends, the result is far more likely to last.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Set the client's stage, experience, days and main challenge, copy the plan and adapt it
            to their equipment and schedule. Share it with them and agree what you'll track at their
            next check-in.
          </p>
        </>
      ),
    },
    {
      heading: "Supporting the client emotionally",
      body: (
        <>
          <p>
            Rapid weight loss can bring mixed feelings: excitement, worry about loose skin or
            regain, uncertainty about how to eat, or comments from others. Listen, keep the focus on
            strength and habits, and encourage professional support if the client is struggling with
            body image or eating. Coaching is as much about confidence as it is about training.
          </p>
        </>
      ),
    },
    {
      heading: "Reviewing the plan",
      body: (
        <>
          <p>
            Revisit the plan at each stage change, such as a dose increase, a plateau or tapering.
            The client's appetite, energy and goals shift through treatment, and the coaching should
            shift with them. Re-run the planner with the new stage and adjust.
          </p>
        </>
      ),
    },
    {
      heading: "Clear roles",
      body: (
        <>
          <p>
            The prescriber manages the medication; you coach training, food habits and behaviour.
            Saying this plainly to the client at the start sets expectations and builds trust.
          </p>
        </>
      ),
    },
  ],
  forCoaches: {
    heading: "Put the result to work",
    body: (
      <>
        <p>
          Run the numbers with your own figures, not industry averages. Pull the last three months
          from your payment records and client list: how many clients started, how many left, what
          each paid and what you spent to find them. Real figures make the result specific to your
          business, and they often show that one lever matters far more than the rest.
        </p>
        <p>
          Then change one thing and measure it. Pick the lever the calculator says is worth most,
          set a target for the next month or quarter, and re-run the numbers at the end. A business
          improves the same way a client does: one deliberate change at a time, checked against what
          actually happened.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Deliver the muscle-protecting plan",
    body: (
      <>
        <p>
          In Traiv, the strength programme, nutrition targets and weekly check-ins for this client
          live in one app, so you can see whether strength is holding as their weight falls.
        </p>
      </>
    ),
  },
  next: [
    { label: "Coaching scope-of-practice check", href: "/tools/scope-of-practice-check" },
    { label: "Protein calculator", href: "/tools/protein-calculator" },
    { label: "Lean body mass calculator", href: "/tools/lean-body-mass-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How much protein should a client on a GLP-1 eat?",
      a: "Often around 1.2 to 1.6 g per kg of body weight a day for adults losing weight, adjusted with their prescriber or dietitian if they have other conditions.",
    },
    {
      q: "Should clients on GLP-1 medications lift weights?",
      a: "Yes, where safe. Strength training is the main way to protect muscle during rapid weight loss.",
    },
    {
      q: "Can I advise on the medication or dose?",
      a: "No. That belongs with the prescriber. Coach training, food habits and behaviour.",
    },
    {
      q: "When should I refer a client to their prescriber?",
      a: "For severe or persistent vomiting or diarrhoea, signs of dehydration, severe abdominal pain, or if they can't eat enough to function.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General coaching information only, not medical advice. The medication, dose, side effects
        and decisions to continue or stop are for the prescriber. Refer anything concerning
        promptly.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
