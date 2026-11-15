import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Injury exercise swap finder",
  description:
    "Explore movement alternatives by exercise pattern and available equipment. Painful loading needs assessment; this tool does not diagnose an injury or presc",
  eyebrow: "Free tool · Strength",
  h1: "Injury exercise swap finder",
  intro: (
    <>
      <p>
        Explore movement alternatives by exercise pattern and available equipment. Painful loading
        needs assessment; this tool does not diagnose an injury or prescribe rehabilitation.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I change a plan when an exercise hurts?",
    answer: (
      <>
        <p>
          Stop the painful movement and establish whether assessment is needed before selecting a
          substitute. For a mild concern, this tool lists equipment-matched patterns to discuss with
          your coach. It withholds loaded options when you select painful loading or cannot load.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Start with the decision to stop or seek assessment",
      body: (
        <>
          <p>
            An exercise that hurts is not simply a search problem for another exercise name. First
            stop the painful movement and consider whether professional assessment is needed. This
            tool cannot examine an injury or distinguish one cause of pain from another. Choosing a
            body area does not provide enough information to diagnose what happened or clear a
            different movement.
          </p>
          <p>
            The painful-under-load and cannot-load selections therefore withhold loaded
            alternatives. They direct you toward assessment instead of giving a recovery plan based
            on a dropdown. Sudden severe symptoms, inability to bear weight or new numbness or
            weakness need prompt medical advice through the services available where you live. Do
            not use a calculator result to delay care.
          </p>
          <p>
            If a clinician has already provided a plan, follow that guidance. General suggestions
            should not override a restriction, progression rule or return-to-training decision given
            for your situation. Tell your coach what guidance you have and what remains unclear
            before changing the session.
          </p>
        </>
      ),
    },
    {
      heading: "Compare movement patterns rather than assuming equivalence",
      body: (
        <>
          <p>
            The tool groups the selected exercise into a broad pattern such as pressing, pulling,
            squatting or hinging. For a mild concern, it lists alternatives with relevant equipment.
            A matching pattern can help a coach organise options, but it does not mean the
            replacement stresses the same tissues in the same way or will be comfortable for you.
          </p>
          <p>
            A floor press limits the available lowering range compared with a bench press. A
            chest-supported row changes the support compared with a bent-over row. Those are
            practical differences to discuss, not guarantees of pain relief. No exercise in this
            list is universally safe for an injured joint or entirely free of spinal or joint
            loading.
          </p>
          <p>
            Do not copy the previous exercise’s load directly onto a substitute. Machines, cable
            ratios, movement ranges and body positions differ. If an alternative is appropriate
            after review, it needs its own starting point. The purpose of the list is to support
            that conversation, not to produce a conversion between exercises.
          </p>
        </>
      ),
    },
    {
      heading: "Use the equipment filter literally",
      body: (
        <>
          <p>
            Select the equipment actually available for the session. Dumbbells, bands, bodyweight
            and cable or machine options describe different practical setups. Full gym makes a wider
            list available. When no option in the selected pattern matches your equipment, the tool
            says so rather than suggesting equipment you do not have.
          </p>
          <p>
            A bodyweight option can still require a suitable support, anchor or surface. Check the
            setup before trying it. A band exercise needs an appropriate secure anchor, and an
            inverted row needs equipment that can support the task. The equipment label is not a
            complete installation or safety check.
          </p>
          <p>
            If the available setup is unsuitable, ask your coach for another way to organise the
            session. It may be better to omit the movement temporarily than to improvise an unstable
            version. Do not let a desire to complete every exercise override a clear practical
            limitation.
          </p>
        </>
      ),
    },
    {
      heading: "Do not turn a suggestion into a rehabilitation schedule",
      body: (
        <>
          <p>
            This tool does not assign a percentage increase each week or promise a return date.
            Recovery differs across conditions and people, and the inputs here cannot establish a
            safe loading schedule. A fixed sequence of sixty, seventy-five and ninety percent would
            imply individual knowledge the tool does not have.
          </p>
          <p>
            A goal such as building muscle does not make training through pain appropriate. In
            particular, do not take an unfamiliar alternative to failure around a painful area
            because it appears on a list. Discuss effort, range and load with the relevant
            professional. Stop if symptoms appear or worsen rather than completing the prescription
            at any cost.
          </p>
          <p>
            Keep the original movement and the substitute separate in the log. Record what was
            attempted, what was comfortable and what prompted stopping. Those observations can help
            a coach or clinician understand the session. They are not a self-diagnosis, and they
            should not be used to overrule a professional restriction.
          </p>
        </>
      ),
    },
    {
      heading: "Keep communication specific",
      body: (
        <>
          <p>
            Tell your coach which movement caused the concern, when it occurred, whether it was
            sudden and whether normal activities are affected. Avoid reducing the whole situation to
            a number out of ten. A single pain score cannot explain the cause or indicate whether an
            exercise is appropriate.
          </p>
          <p>
            When a replacement is agreed, put the exact movement and the agreed limitations in the
            plan. A vague instruction such as do something easier leaves too much interpretation to
            the client at the gym. Make it clear whether the movement is omitted, modified or
            awaiting assessment, and provide a way to ask questions before the next session.
          </p>
          <p>
            The useful outcome is continuity with appropriate boundaries: a client understands what
            to do next, the coach knows what happened and medical decisions remain with someone able
            to assess the person. Completing every planned exercise is not the priority when a
            movement is painful.
          </p>
        </>
      ),
    },
    {
      heading: "Understand the limits of each pattern",
      body: (
        <>
          <p>
            A horizontal press alternative changes features such as grip, support or available
            depth. A vertical press alternative changes the pressing angle or body position. Neither
            category identifies which tissue is irritated. A movement that is comfortable for one
            person may provoke symptoms for another, even when their selected body area is the same.
            Use the list to ask a better question, not to certify safety.
          </p>
          <p>
            Squat alternatives may change support, depth or where an external load is held. Hinge
            alternatives may change the starting position or direction of resistance. These changes
            can alter the task, but none makes the exercise automatically unloaded. Avoid
            interpreting bodyweight as zero stress or a machine as a guarantee that a joint will be
            protected.
          </p>
          <p>
            Pulling alternatives can change handle orientation, support and whether the arm moves
            overhead. Elbow-flexion and elbow-extension alternatives can change grip and resistance.
            The tool ranks some options by the selected area, but that is a broad organisational
            rule. It does not model an injury or know which range and load are appropriate for the
            person.
          </p>
        </>
      ),
    },
    {
      heading: "Keep the first discussion small and specific",
      body: (
        <>
          <p>
            If a coach or clinician agrees that trying an alternative is appropriate, clarify the
            exercise, setup and stopping rule before the session. Do not combine several new
            movements, a larger workload and a harder effort target while trying to understand one
            concern. Too many changes make it difficult to tell what happened.
          </p>
          <p>
            Write down any symptoms that occur during or after the attempt and bring those
            observations back to the relevant professional. The absence of discomfort during one set
            does not establish that the injury has recovered. This tool has no follow-up assessment
            and cannot determine readiness for the original movement.
          </p>
          <p>
            If the client is unsure about the instruction, leave the movement out until it is
            clarified. A missed exercise is easier to review than an improvised attempt made under
            pressure to complete the plan. Make it clear that reporting a problem is useful
            information, not a failure to follow the programme.
          </p>
        </>
      ),
    },
    {
      heading: "Use medical guidance without turning the tool into a diagnosis",
      body: (
        <>
          <p>
            The{" "}
            <a href="https://www.nhs.uk/conditions/sprains-and-strains/">
              NHS guidance on sprains and strains
            </a>{" "}
            explains when an injury needs prompt help, including difficulty using or bearing weight
            on the affected area. It is a general reference, not a way to identify your condition
            from these inputs. Follow the appropriate local care pathway and ask a qualified
            clinician when symptoms or the situation are concerning.
          </p>
          <p>
            For the next coaching session, record the practical status: awaiting assessment, a
            clinician-approved modification, or a movement currently omitted. Avoid assigning a
            diagnosis in the training log unless it comes from an appropriate assessment. This keeps
            the plan useful while respecting the limits of a coaching tool.
          </p>
          <p>
            The same boundary applies when using an AI assistant or a search engine after seeing the
            result. More text about an exercise does not create an individual examination. Keep
            questions focused on understanding the agreed plan and the equipment setup, and take
            medical questions to someone qualified to assess them.
          </p>
        </>
      ),
    },
    {
      heading: "Record why an exercise is currently omitted",
      body: (
        <>
          <p>
            A clear note prevents a later session from restoring a painful movement by accident.
            State that the movement is awaiting assessment or that a modification has been agreed,
            without adding a speculative diagnosis. Keep any clinician’s restrictions available to
            the coach and client.
          </p>
          <p>
            When the plan changes again, review that note rather than assuming the passage of time
            alone means the original exercise is suitable. The tool does not track recovery or issue
            clearance. Returning to a movement should follow the individual guidance and context
            that justified the change, with a new record of what was actually performed.
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
          Keep the calculation beside the completed training record. Review what the client actually
          performed, which equipment they used and how the session felt before changing the next
          prescription. A numerical result is easier to interpret when the exercise and execution
          remain consistent.
        </p>
        <p>
          Discuss one practical next step rather than giving the client several competing targets.
          Put that instruction in the session and review the returned log. The useful outcome is a
          plan the client can follow and a record that helps you decide what to do next.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Keep the plan and the completed work together",
    body: (
      <>
        <p>
          In Traiv you build workout plans, prescribe sets and repetitions, and review the work
          clients log in their app. Keep the next session alongside the history that explains it.
        </p>
      </>
    ),
  },
  next: [
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "RPE calculator", href: "/tools/rpe-calculator" },
    {
      label: "Weekly training volume calculator",
      href: "/tools/weekly-training-volume-calculator",
    },
  ],
  nextPitch: "Use these tools to check a number, then review the full plan with your coach.",
  faq: [
    {
      q: "What should I change in my training while something hurts?",
      a: "Work within any clinician’s guidance, stop the painful movement and discuss whether another pattern is appropriate. Do not assume a different exercise is safe simply because it uses the same muscle.",
    },
    {
      q: "Is this medical or rehabilitation advice?",
      a: "No. These are general movement alternatives, not a diagnosis, treatment, exercise clearance or recovery schedule. A clinician should assess an injury and guide rehabilitation when needed.",
    },
    {
      q: "When should I seek help instead of swapping exercises?",
      a: "Seek assessment for painful loading, worsening symptoms or uncertainty about an injury. Sudden severe symptoms, new numbness or weakness, or inability to bear weight warrant urgent medical advice.",
    },
    {
      q: "Is this tool free?",
      a: "Yes. You can explore the options without signing up. Keep the limitations in view and take any suggested movement to your coach or treating clinician before using it around an injury.",
    },
  ],
  disclaimer: (
    <>
      <p>
        General information only. This tool does not diagnose injuries, prescribe rehabilitation or
        clear you to exercise. Stop a painful movement and seek appropriate medical advice. Use
        local urgent-care services for severe or concerning symptoms.
      </p>
    </>
  ),
  keepGoing: [
    { label: "Workout plans in Traiv", href: "/features/plan-builder" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Write the next session with the last one in view",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
