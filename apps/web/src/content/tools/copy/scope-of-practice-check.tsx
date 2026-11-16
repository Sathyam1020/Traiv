import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching scope-of-practice check",
  description:
    "Pick a client situation to see whether to refer out now, proceed only with clearance or coach as normal, with a referral message and a file note.",
  eyebrow: "Free tool · Safety",
  h1: "Coaching scope-of-practice check",
  intro: (
    <>
      <p>
        Some client situations belong with a coach, some need a clinician's sign-off first, and some
        need a different professional entirely. Choose the situation to see which group it falls
        into, plus a message you can send and a short note for your records. It errs on the side of
        caution and is general guidance rather than legal or medical advice. Everything stays in
        your browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "When should a coach refer a client out?",
    answer: (
      <>
        <p>
          Refer out when a situation needs diagnosis or treatment: undiagnosed or worsening pain,
          disordered eating, a diet to treat a disease, significant mental health concerns, acute
          medical issues and medication questions. Proceed only with clearance for pregnancy, older
          adults with health conditions, controlled chronic conditions, weight-loss medication and
          returning injuries. Healthy adults are in your lane.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "What scope of practice means",
      body: (
        <>
          <p>
            Scope of practice is the range of things you are trained, qualified and, in some places,
            legally allowed to do. For most fitness coaches and personal trainers, that means
            designing exercise programmes, giving general healthy eating guidance and coaching
            habits for healthy people. It doesn't include diagnosing conditions, treating injuries,
            prescribing diets for disease or giving medication advice.
          </p>
          <p>
            The exact boundaries depend on your qualifications and where you work. A registered
            dietitian or physiotherapist can do things a personal trainer can't. Always work within
            your own certification's scope and your local regulations.
          </p>
        </>
      ),
    },
    {
      heading: "The three calls",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Call</th>
                  <th scope="col">Meaning</th>
                  <th scope="col">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Refer out now</td>
                  <td>Outside coaching; needs a qualified professional</td>
                  <td>
                    Undiagnosed pain, disordered eating, therapeutic diets, acute medical issues
                  </td>
                </tr>
                <tr>
                  <td>Proceed only with clearance</td>
                  <td>Coaching can continue within a clinician's guidance</td>
                  <td>
                    Pregnancy, controlled conditions, cleared injuries, weight-loss medication
                  </td>
                </tr>
                <tr>
                  <td>In your lane</td>
                  <td>General coaching for healthy adults</td>
                  <td>General training, general nutrition and habits, beginners</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The check is cautious by design: when in doubt, it leans towards referral or clearance.
          </p>
        </>
      ),
    },
    {
      heading: "Why referring protects everyone",
      body: (
        <>
          <p>
            Referring a client isn't a failure. It shows professionalism, protects the client's
            health and protects you. A coach who keeps training through undiagnosed pain or offers
            diet advice for a medical condition risks harm to the client and serious consequences
            for their business. A coach who refers appropriately builds trust with clients and with
            other professionals, who may refer clients back.
          </p>
        </>
      ),
    },
    {
      heading: "Clearance situations",
      body: (
        <>
          <p>
            Some clients can train safely with the right guidance. Pregnant and postpartum clients,
            older adults with health conditions, people with controlled chronic conditions such as
            cleared diabetes or blood pressure, clients returning from an assessed injury, and those
            on weight-loss medication often benefit greatly from coaching. Ask for clearance from
            their doctor, midwife or physiotherapist, find out any restrictions, and coach within
            them.
          </p>
          <p>
            Keep a note of the clearance and any guidance, and review it if the client's situation
            changes.
          </p>
        </>
      ),
    },
    {
      heading: "Situations to refer",
      body: (
        <>
          <ul>
            <li>
              <strong>Undiagnosed or worsening pain:</strong> pause painful movements until it's
              assessed.
            </li>
            <li>
              <strong>Disordered eating signs or history:</strong> avoid calorie targets and
              weighing; involve a doctor or specialist.
            </li>
            <li>
              <strong>A diet to treat a disease:</strong> that's for a registered dietitian or
              doctor.
            </li>
            <li>
              <strong>Significant mental health concerns:</strong> encourage professional support;
              share crisis contacts if there's risk.
            </li>
            <li>
              <strong>Acute or uncontrolled medical issues:</strong> stop training until a doctor
              has cleared them.
            </li>
            <li>
              <strong>Medication or supplement questions:</strong> refer to a doctor or pharmacist.
            </li>
          </ul>
          <p>
            In each case, the message is kind, clear and focused on getting the client the right
            help.
          </p>
        </>
      ),
    },
    {
      heading: "Health screening at the start",
      body: (
        <>
          <p>
            A health questionnaire at onboarding catches most situations before they become
            problems. Ask about medical conditions, medication, injuries, pregnancy, recent surgery
            and any symptoms during exercise. Use a recognised pre-exercise screening tool where
            possible, and refer for clearance when the answers suggest it.
          </p>
          <p>
            Ask clients to tell you if anything changes, and recheck the questionnaire periodically.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping a record",
      body: (
        <>
          <p>
            A brief file note for each referral or clearance protects you and the client. Record the
            date, what the client told you, what you advised, and any clearance or guidance
            received. The check provides a one-line note you can adapt. Store notes securely and in
            line with data protection rules.
          </p>
        </>
      ),
    },
    {
      heading: "Supporting clients after referral",
      body: (
        <>
          <p>
            Referring doesn't have to end the coaching relationship. Many clients can continue
            training, adapted to their clinician's advice, while they get the help they need. Stay
            in touch, adapt the plan as guidance comes in, and let the client know you're there when
            they're ready. That continuity often matters a great deal to them.
          </p>
        </>
      ),
    },
    {
      heading: "Building a referral network",
      body: (
        <>
          <p>
            Get to know a few local or online professionals you trust: a physiotherapist, a
            registered dietitian, a GP practice, a mental health service. Knowing who to refer to
            makes the conversation easier for the client and smoother for you. Many professionals
            welcome coaches who refer appropriately and may send clients your way in return.
          </p>
        </>
      ),
    },
    {
      heading: "Pregnancy and postpartum",
      body: (
        <>
          <p>
            Many pregnant and postpartum clients benefit from exercise, but each stage has different
            considerations. Ask for clearance from their midwife or doctor and any guidance on what
            to avoid. Coach within that guidance, adapt as pregnancy progresses, and watch for
            warning signs such as bleeding, dizziness, chest pain or reduced fetal movement, which
            need immediate medical attention.
          </p>
          <p>
            Postpartum return to exercise should be gradual, guided by the client's clinician,
            especially after a caesarean or with pelvic floor concerns.
          </p>
        </>
      ),
    },
    {
      heading: "Weight-loss medication",
      body: (
        <>
          <p>
            Clients on GLP-1 and similar medications often lose weight quickly, which can include
            muscle. Coaching strength training and adequate protein helps protect lean mass, and
            coaching habits supports long-term success. Questions about the medication itself, such
            as doses, side effects or stopping, belong with the prescriber. The GLP-1 client
            coaching planner on this site focuses on the coaching side.
          </p>
        </>
      ),
    },
    {
      heading: "Disordered eating",
      body: (
        <>
          <p>
            Signs such as extreme restriction, bingeing, purging, compulsive exercise or intense
            anxiety around food and weight need professional support. Remove calorie targets and
            weigh-ins, keep the focus on enjoyable movement if appropriate, and encourage the client
            to speak to their doctor or a specialist service. Respond with care and without
            judgement.
          </p>
        </>
      ),
    },
    {
      heading: "Mental health",
      body: (
        <>
          <p>
            Exercise can support mental wellbeing, and many clients with mental health conditions
            benefit from coaching. When a client shares a significant concern, listen, take the
            pressure off the plan if needed and encourage professional support. If they mention
            harming themselves or being in danger, encourage them to contact emergency services or a
            crisis line immediately.
          </p>
        </>
      ),
    },
    {
      heading: "Talking to clients about referral",
      body: (
        <>
          <p>
            Clients sometimes worry that being referred means losing their coach. Reassure them:
            you're referring because you want them to get the right help, and you'll keep supporting
            them in the ways that are appropriate. A calm, caring message, focused on their
            wellbeing, makes the referral feel like support rather than rejection.
          </p>
        </>
      ),
    },
    {
      heading: "Older adults",
      body: (
        <>
          <p>
            Older adults often gain more from strength and balance training than any other group,
            but many have health conditions or take medication. Ask for clearance from their doctor,
            find out about any restrictions, and start conservatively. Pay attention to blood
            pressure, balance, joint health and medication effects. Progress steadily and keep
            communication open about how they feel.
          </p>
        </>
      ),
    },
    {
      heading: "Returning from injury",
      body: (
        <>
          <p>
            When a client returns from an injury that a physiotherapist or doctor has assessed and
            cleared, ask for any guidance about what to include, avoid or progress. Build back
            gradually, watch for symptoms returning, and stop and refer if pain recurs or worsens.
            Keep the clinician's guidance on file.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            Health information is sensitive. The check runs in your browser and stores nothing. In
            your own records, keep health details secure, collect only what you need and follow the
            data protection rules where you and your clients live.
          </p>
        </>
      ),
    },
    {
      heading: "When in doubt",
      body: (
        <>
          <p>
            If you're unsure whether something is in your scope, treat it as if it isn't: ask for
            clearance or refer. A short delay while a client checks with a professional costs very
            little. Coaching through something you shouldn't have can cost a great deal.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Review your health questionnaire. Does it ask about conditions, medication, injuries,
            pregnancy and symptoms during exercise? Add anything that's missing, and write down who
            you'd refer to for each of the situations above.
          </p>
        </>
      ),
    },
    {
      heading: "Continuing education",
      body: (
        <>
          <p>
            Scope can grow with further qualifications. Courses in pre- and postnatal training,
            older adults, exercise referral or nutrition can widen what you're able to support
            safely. Until then, refer.
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
    key: "check-ins",
    heading: "Keep clients coming back each week",
    body: (
      <>
        <p>
          In Traiv, clients get their plans, check-ins and messages in an app under your name, and
          you see who has gone quiet before they cancel. Retention is where most of these numbers
          are won or lost.
        </p>
      </>
    ),
  },
  next: [
    { label: "GLP-1 client coaching planner", href: "/tools/glp1-client-coaching-planner" },
    { label: "Injury exercise swap finder", href: "/tools/injury-exercise-swap" },
    { label: "Difficult client responder", href: "/tools/difficult-client-responder" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "Can a personal trainer give nutrition advice?",
      a: "General healthy eating guidance for healthy people is usually within scope. Diets to treat medical conditions should come from a registered dietitian or doctor.",
    },
    {
      q: "Should I train a client with pain?",
      a: "Not through undiagnosed or worsening pain. Pause those movements and refer them for assessment.",
    },
    {
      q: "Can I coach clients on weight-loss medication?",
      a: "Yes, with their prescriber's guidance. Coach training and habits, and refer medication questions to the prescriber.",
    },
    {
      q: "Is this legal advice?",
      a: "No. It's general, cautious guidance. Your certification's scope and local regulations come first.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General professional guidance only, not legal or medical advice. Your qualification's scope
        and local regulations come first. If a client describes severe or sudden symptoms, they
        should contact local emergency services.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Check-ins in Traiv", href: "/features/check-ins" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
