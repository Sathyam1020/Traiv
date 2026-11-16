import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "AI writing checker for coaches",
  description:
    "Score a caption, email or check-in reply from 0 to 10 for fifteen habits that make writing sound like generic AI copy, with every hit highlighted and a fix.",
  eyebrow: "Free tool · Writing",
  h1: "AI writing checker for coaches",
  intro: (
    <>
      <p>
        Paste a caption, email or check-in reply. The checker scores it from 0 to 10 for fifteen
        habits common in AI-written drafts, highlights each one in your text, shows how to fix it
        and builds a rewrite prompt with your draft already in it. It isn't a detector: it can't
        tell who wrote something, only whether it reads like everyone else's. Nothing you paste
        leaves your browser.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How can I tell if my writing sounds like AI?",
    answer: (
      <>
        <p>
          Look for habits AI drafts share: 'it's not X, it's Y' framing, openers about today's
          fast-paced world, stacked questions, lists of three abstract words, buzzwords such as
          unlock and journey, pep-talk sign-offs and 'if you'd like, I can' offers. A few of these
          together make a post sound generic, whoever wrote it.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why it matters for coaches",
      body: (
        <>
          <p>
            Clients choose coaches partly for their voice: how they explain things, how they
            encourage, what they notice. When captions, emails and replies sound like everyone
            else's, that voice disappears. Readers scroll past, and clients feel they're getting a
            template rather than a coach.
          </p>
          <p>
            AI tools are useful for drafting, but their first drafts share recognisable habits.
            Removing them makes writing sound human again, whether you started with AI or not.
          </p>
        </>
      ),
    },
    {
      heading: "The fifteen tells",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Tell</th>
                  <th scope="col">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Contrast framing</td>
                  <td>It's not about the diet. It's about the habits.</td>
                </tr>
                <tr>
                  <td>Big-picture opener</td>
                  <td>In today's fast-paced world…</td>
                </tr>
                <tr>
                  <td>Stacked questions</td>
                  <td>Tired of stalling? Ready to change?</td>
                </tr>
                <tr>
                  <td>List of three abstractions</td>
                  <td>Discipline, patience, and commitment</td>
                </tr>
                <tr>
                  <td>Buzzwords</td>
                  <td>unlock, journey, transform, elevate</td>
                </tr>
                <tr>
                  <td>Cheerleader sign-off</td>
                  <td>You've got this!</td>
                </tr>
                <tr>
                  <td>Assistant-style offer</td>
                  <td>If you'd like, I can…</td>
                </tr>
                <tr>
                  <td>'Are you tired of' hook</td>
                  <td>Are you tired of starting over?</td>
                </tr>
                <tr>
                  <td>Throat-clearing</td>
                  <td>Here's the thing…</td>
                </tr>
                <tr>
                  <td>'Imagine' opener</td>
                  <td>Imagine waking up…</td>
                </tr>
                <tr>
                  <td>Stacked intensifiers</td>
                  <td>truly, really, incredibly</td>
                </tr>
                <tr>
                  <td>Dash overuse</td>
                  <td>Three or more dashes</td>
                </tr>
                <tr>
                  <td>Exclamation marks</td>
                  <td>Two or more</td>
                </tr>
                <tr>
                  <td>Hedging filler</td>
                  <td>It's important to note…</td>
                </tr>
                <tr>
                  <td>Summary wrap-up</td>
                  <td>At the end of the day…</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Most of these are fine once. The problem is how often they appear together in AI drafts.
          </p>
        </>
      ),
    },
    {
      heading: "How the score works",
      body: (
        <>
          <p>
            Each tell found scores one point. Contrast framing scores two, because it's the most
            recognisable habit, and three or more buzzwords score two. The total is capped at 10.
          </p>
          <ul>
            <li>
              <strong>0 to 2:</strong> reads like you. Read it aloud once, then post.
            </li>
            <li>
              <strong>3 to 5:</strong> one rewrite pass will fix it.
            </li>
            <li>
              <strong>6 and above:</strong> rewrite, starting from your own first sentence.
            </li>
          </ul>
          <p>
            The score measures habits, not authorship. A human can score 8 and an AI-assisted draft
            can score 0 after a good edit.
          </p>
        </>
      ),
    },
    {
      heading: "Not a detector",
      body: (
        <>
          <p>
            AI detectors claim to tell whether text was written by a machine. They are unreliable,
            and they can wrongly flag people who write in a second language or a formal style. This
            checker makes no such claim. It looks for specific, visible habits and shows you exactly
            where they are, so you can decide what to change.
          </p>
        </>
      ),
    },
    {
      heading: "The sample",
      body: (
        <>
          <p>
            The sample text loaded on the page is deliberately bad. It opens with contrast framing,
            follows with a big-picture opener, stacks three questions, lists three abstract virtues,
            uses buzzwords, ends with two cheers and closes with an assistant-style offer. It scores
            high on purpose, so you can see how the highlights and fixes work. Replace it with your
            own draft.
          </p>
        </>
      ),
    },
    {
      heading: "Fixing each tell",
      body: (
        <>
          <p>
            Every hit comes with a fix. Most fixes are about being specific: replace the general
            opener with something from this week, replace the abstract list with one concrete
            example, replace the buzzword with the plain thing you mean, and end with a useful next
            step instead of a pep talk. Specific writing is almost always more persuasive than
            general writing.
          </p>
        </>
      ),
    },
    {
      heading: "The rewrite prompt",
      body: (
        <>
          <p>
            If you'd rather have an AI help with the rewrite, copy the rewrite prompt. It includes
            your draft and a set of rules that remove the fifteen tells. Paste three things you've
            written yourself where it asks, so the AI has examples of your real voice. Then edit the
            result, and run it through the checker again.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            Draft: 'In today's fast-paced world, it's not about working harder, it's about working
            smarter. Unlock your potential with consistency, patience, and dedication!' That's a
            big-picture opener, contrast framing (two points), a list of three and buzzwords: five
            points, enough for a rewrite pass.
          </p>
          <p>
            Rewrite: 'Most of my clients train three times a week, 40 minutes each. That's enough
            when the sessions are planned and the food is steady.' Specific, plain and in a coach's
            voice. Score: 0.
          </p>
        </>
      ),
    },
    {
      heading: "Writing habits that help",
      body: (
        <>
          <ul>
            <li>Start with a specific moment, number or client situation.</li>
            <li>Make one point per post or message.</li>
            <li>Use short sentences and everyday words.</li>
            <li>Say what you mean instead of hinting at it with questions.</li>
            <li>End with a clear, useful next step.</li>
          </ul>
          <p>
            These habits make writing sound like a person, and they work whether you draft by hand
            or with AI.
          </p>
        </>
      ),
    },
    {
      heading: "Contrast framing, in detail",
      body: (
        <>
          <p>
            'It's not about X. It's about Y.' is the single most common pattern in AI-written social
            posts. It sets up a false opposition to sound insightful, and readers now recognise it
            instantly. The fix is simple: say Y directly. 'Habits matter more than the diet' or,
            better, a specific example of a habit that worked. The checker scores this pattern
            double because it does so much to make a post feel generic.
          </p>
        </>
      ),
    },
    {
      heading: "Openers that lose readers",
      body: (
        <>
          <p>
            Opening with the state of the world, 'In today's fast-paced world', 'Now more than
            ever', 'In a world where', tells the reader nothing about you or them. The same goes for
            'Are you tired of…' and 'Imagine…'. Start instead with something specific: a moment from
            a session, a number from a client, a question you were asked this week. Specific first
            lines earn the second line.
          </p>
        </>
      ),
    },
    {
      heading: "Lists of three",
      body: (
        <>
          <p>
            Lists of three abstract qualities, such as discipline, patience and commitment, sound
            rhythmic but say very little. Pick the one that matters most for the point you're making
            and give a real example of it. 'Patience: one client took eleven weeks to see the scale
            move, and her waist had dropped 6 cm by then' is far more persuasive than three virtues
            in a row.
          </p>
        </>
      ),
    },
    {
      heading: "Buzzwords and what to say instead",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Buzzword</th>
                  <th scope="col">Say instead</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Unlock your potential</td>
                  <td>Get stronger / lose fat / train consistently</td>
                </tr>
                <tr>
                  <td>Transform your body</td>
                  <td>The specific change: 5 kg, a first pull-up</td>
                </tr>
                <tr>
                  <td>Your fitness journey</td>
                  <td>Your training, your progress</td>
                </tr>
                <tr>
                  <td>Elevate your game</td>
                  <td>Lift more, run faster, recover better</td>
                </tr>
                <tr>
                  <td>Holistic approach</td>
                  <td>Training, food and sleep together</td>
                </tr>
                <tr>
                  <td>Game-changer</td>
                  <td>What actually changed, and how much</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Plain words are clearer and, for most readers, more credible.</p>
        </>
      ),
    },
    {
      heading: "Endings that sound like a person",
      body: (
        <>
          <p>
            AI drafts often end with a pep talk ('You've got this!') or an offer to help further
            ('If you'd like, I can…'). Both are filler. End with something useful instead: the next
            step, an invitation to reply, a clear call to action, or simply the last point. If the
            post has made its point, it can just stop.
          </p>
        </>
      ),
    },
    {
      heading: "Punctuation tells",
      body: (
        <>
          <p>
            Several exclamation marks in a short post make it sound shouty rather than energetic.
            Frequent dashes, especially long em dashes in every other sentence, have become a common
            sign of machine-written text. Use full stops and commas instead, and let the content
            carry the energy. One well-placed dash is fine; three or more in a short post triggers a
            flag.
          </p>
        </>
      ),
    },
    {
      heading: "Hedging and wrap-ups",
      body: (
        <>
          <p>
            Phrases like 'It's important to note', 'It's worth noting', 'In conclusion',
            'Ultimately' and 'At the end of the day' pad writing without adding meaning. They're
            common in AI drafts because they appear so often in the text these tools learn from.
            Delete them and see whether the sentence still works; it usually works better.
          </p>
        </>
      ),
    },
    {
      heading: "Using the checker in your workflow",
      body: (
        <>
          <ol>
            <li>Draft your caption, email or reply, by hand or with AI.</li>
            <li>Paste it into the checker and read the highlights.</li>
            <li>Fix each hit using the suggestion beside it.</li>
            <li>Check again until the score is 2 or lower.</li>
            <li>Read it aloud once, then post or send it.</li>
          </ol>
          <p>
            Most drafts take two or three minutes to fix once you know what to look for. After a few
            weeks, you'll notice the tells as you write.
          </p>
        </>
      ),
    },
    {
      heading: "Why it runs in your browser",
      body: (
        <>
          <p>
            Drafts often include client details, unpublished ideas or business information. The
            checker runs entirely in your browser, so nothing you paste is sent anywhere or stored.
            You can check sensitive drafts without worrying about where they end up.
          </p>
        </>
      ),
    },
    {
      heading: "The limits of a checklist",
      body: (
        <>
          <p>
            A score of zero doesn't guarantee good writing; it means none of the fifteen habits were
            found. Writing can still be unclear, too long or off-topic. Use the checker to remove
            the most common tells, then judge the rest yourself: is it specific, is it useful, does
            it sound like you?
          </p>
        </>
      ),
    },
    {
      heading: "For coaches writing every day",
      body: (
        <>
          <p>
            Coaches write a lot: captions, stories, emails, check-in replies, sales messages. Small
            improvements across all of them add up. Clients notice when messages sound personal, and
            followers notice when posts sound like a real coach. Running your most important pieces
            through the checker each week is a quick way to keep your voice consistent.
          </p>
        </>
      ),
    },
    {
      heading: "Before and after: a caption",
      body: (
        <>
          <p>
            Before: 'Are you tired of feeling stuck? It's not about motivation, it's about systems.
            Let's dive in!' That's an 'are you tired of' hook, contrast framing, throat-clearing and
            an exclamation mark.
          </p>
          <p>
            After: 'Most of my clients skip a session because the plan didn't fit their week, not
            because they lacked motivation. So we plan the week on Sunday.' Specific, plain and
            useful.
          </p>
        </>
      ),
    },
    {
      heading: "Before and after: a check-in reply",
      body: (
        <>
          <p>
            Before: 'Great job this week! You're truly on an incredible journey. Keep crushing it,
            you've got this! If you'd like, I can adjust your plan.' Intensifiers, a buzzword,
            cheerleading and an assistant-style offer.
          </p>
          <p>
            After: 'Four sessions while travelling is a strong week. Your average weight is down 0.3
            kg. Next week, let's keep the plan and add a 20-minute walk on your rest days.' Specific
            and actionable.
          </p>
        </>
      ),
    },
    {
      heading: "Before and after: an email",
      body: (
        <>
          <p>
            Before: 'In today's busy world, finding balance is harder than ever. Ultimately, it's
            important to note that consistency, patience, and dedication are key.' A big-picture
            opener, a wrap-up word, hedging filler and a list of three.
          </p>
          <p>
            After: 'If your week is packed, two 30-minute sessions done is better than four planned
            and skipped. Here's the two-session plan I use with busy clients.' Clear and useful.
          </p>
        </>
      ),
    },
    {
      heading: "Why readers notice",
      body: (
        <>
          <p>
            People read a lot of AI-generated text now, and they've learned its patterns, often
            without being able to name them. When a post opens with 'In today's fast-paced world' or
            'It's not about…', many readers stop reading. Removing the patterns doesn't just make
            writing sound human; it keeps people reading long enough to get your point.
          </p>
        </>
      ),
    },
    {
      heading: "Different formats, same habits",
      body: (
        <>
          <p>
            The tells appear in every format: captions, emails, check-in replies, sales messages,
            website copy. Check-in replies tend to suffer from cheerleading and intensifiers. Emails
            tend to suffer from openers, hedging and wrap-ups. Captions tend to suffer from contrast
            framing, stacked questions and buzzwords. The checker works on all of them.
          </p>
        </>
      ),
    },
    {
      heading: "Using the checker with a team",
      body: (
        <>
          <p>
            If an assistant coach or social media helper writes for you, share the checker with
            them. Agree that anything going out under your name scores 2 or lower before it's posted
            or sent. It's a simple, objective standard that keeps your voice consistent, whoever
            does the first draft.
          </p>
        </>
      ),
    },
    {
      heading: "Writing that sounds like a coach",
      body: (
        <>
          <p>
            Good coaching writing sounds like a knowledgeable person talking to someone they care
            about. It's specific: a client's real result, a number from a session, a moment from the
            week. It's practical: one thing to do next. And it's honest: no exaggerated promises, no
            false urgency. The checker removes the habits that get in the way of that voice; the
            voice itself comes from you.
          </p>
        </>
      ),
    },
    {
      heading: "Email subject lines",
      body: (
        <>
          <p>
            Subject lines suffer from the same tells: 'Unlock your best self', 'Are you ready?',
            'The secret to success'. Readers have learned to ignore them. A plain, specific subject
            line, such as 'The 2-session plan for busy weeks' or 'Why your weight jumped after
            Sunday', is more likely to be opened. Run subject lines through the checker along with
            the email.
          </p>
        </>
      ),
    },
    {
      heading: "Check-in replies",
      body: (
        <>
          <p>
            Check-in replies are where generic writing does the most damage, because clients expect
            personal attention. A reply that reads like a template tells them nobody really looked
            at their week. Mention one specific number or comment from their check-in, give one
            clear focus and keep it short. If a reply scores above 2, rewrite it before sending.
          </p>
        </>
      ),
    },
    {
      heading: "Getting faster at it",
      body: (
        <>
          <p>
            After running a few dozen drafts through the checker, most coaches start spotting the
            tells as they write. Contrast framing, stacked questions and buzzwords become easy to
            catch. At that point, the checker becomes a quick final check rather than a rewrite
            tool, and your first drafts get better on their own.
          </p>
        </>
      ),
    },
    {
      heading: "Specific beats clever",
      body: (
        <>
          <p>
            Many of the fifteen tells are attempts to sound clever: contrast framing sounds
            insightful, rhetorical questions sound engaging, lists of three sound rhythmic. Readers
            respond more to specific information than to clever phrasing. A real number, a real
            moment and a clear next step are more memorable than any slogan.
          </p>
        </>
      ),
    },
    {
      heading: "Starting today",
      body: (
        <>
          <p>
            Take your last three captions or emails and paste them in one at a time. Note which
            tells appear most often in your writing. Over the next week, watch for those in
            particular as you write. Most coaches have two or three habits that account for most of
            their score, and fixing those makes the biggest difference.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping a sample of your voice",
      body: (
        <>
          <p>
            Save three short pieces of your own writing that you're proud of: a caption, an email
            and a check-in reply. Use them whenever you ask an AI to rewrite something, and reread
            them before writing something important. They're the best reference for what you sound
            like on a good day.
          </p>
        </>
      ),
    },
    {
      heading: "Common questions from coaches",
      body: (
        <>
          <ul>
            <li>
              <strong>Can I still use questions in captions?</strong> Yes. One good question is
              fine; stacking several is the tell.
            </li>
            <li>
              <strong>Are lists always bad?</strong> No. Practical lists, such as three exercises,
              are fine. Lists of three abstract virtues are the problem.
            </li>
            <li>
              <strong>What about one exclamation mark?</strong> One is fine. The checker flags two
              or more.
            </li>
            <li>
              <strong>Does British or American spelling matter?</strong> No. The checker looks for
              habits, not spelling.
            </li>
          </ul>
          <p>The aim isn't rigid rules but writing that sounds like you.</p>
        </>
      ),
    },
    {
      heading: "Checking long pieces",
      body: (
        <>
          <p>
            For longer pieces, such as a blog post or sales page, check a section at a time. The
            score is designed for short writing; in a long piece, a few tells spread across many
            paragraphs matter less than the same number packed into a caption. Focus on the opening
            and closing paragraphs, where readers decide whether to keep going and whether to act.
          </p>
        </>
      ),
    },
    {
      heading: "A final read-through",
      body: (
        <>
          <p>
            After the score is low, read the draft aloud once. Your ear catches things a checklist
            can't: a sentence that's too long, a word you'd never use, a point that isn't clear. If
            it sounds like you talking to a client, it's ready.
          </p>
        </>
      ),
    },
    {
      heading: "Writing for different readers",
      body: (
        <>
          <p>
            Followers who don't know you yet need a specific, useful first line to keep reading.
            Clients who already know you need to feel that the message was written for them. Leads
            who are deciding need clarity and honesty. In every case, removing generic habits helps:
            it signals that a real coach, paying attention, wrote the words. That's what builds
            trust, whatever the format.
          </p>
        </>
      ),
    },
    {
      heading: "When a high score is fine",
      body: (
        <>
          <p>
            Occasionally a tell is the right choice: a deliberate rhetorical question, a single dash
            for emphasis, a cheerful sign-off to a client you know well. The checker flags habits,
            not rules. If you've chosen a phrase on purpose and it sounds like you, keep it.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The checker runs entirely in your browser. Nothing you paste is stored or sent anywhere.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use this result with ChatGPT",
    whenToUse: "After checking a draft and seeing which tells it has.",
    pasteIn: "Paste your draft and three samples of your own writing.",
    text: `Here's a draft I wrote for my fitness coaching audience, and three short pieces of my own writing so you can hear my voice. Rewrite the draft to sound like me. Keep my meaning and facts exactly. Remove 'it's not X, it's Y' framing, big-picture openers, stacked questions, lists of three abstract words, buzzwords, pep-talk sign-offs, offers like 'if you'd like, I can', emoji and exclamation marks. Start with something specific. Keep it the same length or shorter. Draft: [paste]. My writing: [paste three samples].`,
  },
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
    key: "messaging",
    heading: "Write to clients in your own voice",
    body: (
      <>
        <p>
          In Traiv, each client has one thread beside their plan and check-ins, so the replies you
          write, in your own words, sit with the coaching they're about.
        </p>
      </>
    ),
  },
  next: [
    { label: "Coaching prompt generator", href: "/tools/coaching-prompt-generator" },
    { label: "Instagram caption generator", href: "/tools/instagram-caption-generator" },
    { label: "Reel script generator", href: "/tools/reel-script-generator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "Does this detect AI-written text?",
      a: "No. It checks for writing habits common in AI drafts. It can't tell who wrote something.",
    },
    {
      q: "What is a good score?",
      a: "0 to 2. Between 3 and 5, one rewrite pass usually fixes it; 6 or more needs a fuller rewrite.",
    },
    {
      q: "Why is contrast framing scored double?",
      a: "It's the most recognisable habit in AI drafts and the quickest to make writing sound generic.",
    },
    {
      q: "Is it bad to use AI for drafts?",
      a: "Not at all. Use it to start, then edit so the writing sounds like you.",
    },
    {
      q: "What does the rewrite prompt do?",
      a: "It puts your draft into a prompt with rules that remove these habits. Add three samples of your own writing for the best result.",
    },
    {
      q: "Does it work for emails and check-in replies?",
      a: "Yes. Any short piece of writing works.",
    },
    {
      q: "Is my text stored?",
      a: "No. Everything runs in your browser and nothing leaves the page.",
    },
  ],
  keepGoing: [
    { label: "Chat in Traiv", href: "/features/messaging" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
