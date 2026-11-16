import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Coaching prompt generator for ChatGPT",
  description:
    "Build ready-to-paste ChatGPT prompts for check-in replies, onboarding messages, plan drafts, sales replies, captions and more, written for fitness coaches.",
  eyebrow: "Free tool · AI for coaches",
  h1: "Coaching prompt generator",
  intro: (
    <>
      <p>
        Pick the kind of message you're writing, describe your niche and the client in a few neutral
        words, and you'll get a ready-to-paste brief for ChatGPT or any other AI assistant, along
        with two alternative versions. Each brief instructs the AI to check with you rather than
        guess, and to avoid medical advice. No field is required and nothing is stored.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I write a good ChatGPT prompt as a coach?",
    answer: (
      <>
        <p>
          Give the AI the context it can't guess: who you coach, one relevant detail about the
          client, the task, what to include, the tone and the length. Tell it what to avoid, such as
          medical advice or claims you can't back up, and ask it to check with you if something is
          missing. Then edit the draft so it sounds like you.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why prompts matter",
      body: (
        <>
          <p>
            AI assistants write fluently, but they don't know your clients, your coaching style or
            the conversation you're having. Given a vague request, such as 'write a check-in reply',
            they produce something generic that could have come from any coach. Given a clear brief,
            they produce a draft you can actually use with a few edits.
          </p>
          <p>
            A good prompt is like briefing an assistant: context, task, what to include, what to
            avoid and how you want it to sound. The generator assembles those parts for you, for the
            tasks coaches most often write.
          </p>
        </>
      ),
    },
    {
      heading: "The eight tasks",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Task</th>
                  <th scope="col">What the prompt asks for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Client check-in reply</td>
                  <td>
                    One specific win, one clear change, the reason, and a question to invite a reply
                  </td>
                </tr>
                <tr>
                  <td>Onboarding message</td>
                  <td>
                    A warm welcome, what happens next, what you need, and when they'll hear from you
                  </td>
                </tr>
                <tr>
                  <td>Programming / plan draft</td>
                  <td>
                    Sessions, split, exercises, sets and reps, progression and a lighter first week
                  </td>
                </tr>
                <tr>
                  <td>Nutrition guidance draft</td>
                  <td>
                    Two or three general priorities with practical examples, for healthy adults
                  </td>
                </tr>
                <tr>
                  <td>Sales / DM reply</td>
                  <td>
                    Reflect their message, ask one or two questions, offer a low-pressure next step
                  </td>
                </tr>
                <tr>
                  <td>Marketing caption</td>
                  <td>A specific first line, one point, one real detail and a single ask</td>
                </tr>
                <tr>
                  <td>Testimonial request</td>
                  <td>Thanks, two or three simple questions, permission and an easy no</td>
                </tr>
                <tr>
                  <td>Price-increase message</td>
                  <td>Thanks, the new price and date, a brief reason and any option</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Each task comes with its own list of what to include and what to avoid.</p>
        </>
      ),
    },
    {
      heading: "The three prompt versions",
      body: (
        <>
          <ul>
            <li>
              <strong>Full brief:</strong> a complete prompt the AI can run in one go. Best when you
              know what you want.
            </li>
            <li>
              <strong>Two versions:</strong> requests a pair of drafts, one opening with empathy and
              one opening with the practical step, so you can choose or blend them.
            </li>
            <li>
              <strong>Outline first:</strong> asks for bullet points before any prose, so you can
              correct the direction before the AI writes.
            </li>
          </ul>
          <p>
            Outline first is especially useful for programme drafts and anything you'll send to a
            client, because it keeps you in control of the content.
          </p>
        </>
      ),
    },
    {
      heading: "Tone and length",
      body: (
        <>
          <p>
            Choose a tone that matches how you talk to clients: warm, direct, clinical or playful.
            The prompt translates it into instructions the AI can follow, such as 'warm, encouraging
            and human'. Length ranges from under 80 words to up to 300, so a quick DM reply and a
            detailed welcome message both come out at the right size.
          </p>
          <p>
            Every prompt also asks for plain British English, sentence case and no emoji, which
            keeps drafts closer to a natural coaching voice.
          </p>
        </>
      ),
    },
    {
      heading: "Protecting client privacy",
      body: (
        <>
          <p>
            Never paste a client's name, health details, photos or anything that identifies them
            into a public AI tool. Describe the client in neutral terms instead: 'new to training,
            trains twice a week' rather than a name and medical history. Most AI services may store
            and review what you type, so treat them like a public space.
          </p>
          <p>
            The generator never needs personal data. Its 'one thing about the client' field is
            designed for general descriptions.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping clear of medical advice",
      body: (
        <>
          <p>
            Every prompt tells the AI not to give medical advice, and the nutrition and programming
            prompts add specific limits: general healthy-eating guidance only, and a flag for
            anything that needs a doctor, physiotherapist or dietitian. AI tools can sound confident
            about things they get wrong, especially on health. Treat every draft as a starting point
            that you check against your own knowledge and scope.
          </p>
        </>
      ),
    },
    {
      heading: "Editing AI drafts",
      body: (
        <>
          <ol>
            <li>Check every fact, number and recommendation.</li>
            <li>Remove anything you wouldn't say or can't back up.</li>
            <li>
              Add a detail only you know: something from their check-in, a lift they hit, a
              conversation you had.
            </li>
            <li>Read it aloud. If it doesn't sound like you, rewrite the parts that don't.</li>
            <li>Cut it shorter. AI drafts are usually longer than they need to be.</li>
          </ol>
          <p>
            The AI writing checker on this site highlights the habits that make AI drafts sound
            generic.
          </p>
        </>
      ),
    },
    {
      heading: "Worked example: a check-in reply",
      body: (
        <>
          <p>
            With the default settings, a check-in reply for a coach who works with busy parents
            losing fat, for a client who is new to training and trains twice a week, in a warm tone
            and standard length, the full brief tells the AI who you coach, describes the client,
            sets the task and lists four things to include: a specific win, one clear change, the
            reason for it, and a question to invite a reply. It sets the tone, length and style
            rules, says not to change calories or training without your numbers, and asks the AI to
            list its assumptions.
          </p>
          <p>
            Paste it into ChatGPT, add the client's check-in answers in neutral terms, and you'll
            get a draft that needs only light editing.
          </p>
        </>
      ),
    },
    {
      heading: "When not to use AI",
      body: (
        <>
          <p>
            Some messages should come straight from you. Replies to a client in distress,
            conversations about health concerns, difficult boundary conversations and anything legal
            or financial deserve your own words and judgement. AI can help you think through what to
            say, but the message itself should be yours.
          </p>
        </>
      ),
    },
    {
      heading: "Building your own prompt library",
      body: (
        <>
          <p>
            Once a prompt works well, save it. Over time, you'll build a library of prompts tuned to
            your coaching: your onboarding message, your check-in style, your caption formats.
            Update them as your voice and offers change. A small, well-maintained library saves far
            more time than writing new prompts each time.
          </p>
        </>
      ),
    },
    {
      heading: "Prompts for content",
      body: (
        <>
          <p>
            For marketing captions, the prompt asks for a specific first line, one useful point, one
            real detail from your coaching and a single ask, and bans the common habits that make
            posts sound generic: clichés, stacked questions, lists of three, emoji and exclamation
            marks. The caption generator, hook generator and reel script generator on this site
            build more detailed content prompts.
          </p>
        </>
      ),
    },
    {
      heading: "Prompts for sales",
      body: (
        <>
          <p>
            The sales reply prompt asks the AI to thank the person, reflect what they said, ask one
            or two questions about their goal and offer a clear, low-pressure next step, with no
            pressure tactics or claims you can't support. Honest, specific replies convert better
            over time than pushy ones, and they protect your reputation.
          </p>
        </>
      ),
    },
    {
      heading: "Asking the AI to ask you",
      body: (
        <>
          <p>
            Every prompt ends by asking the AI to check with you if information is missing, rather
            than guessing. That one instruction prevents many of the problems with AI drafts:
            invented details, wrong assumptions and generic filler. If the AI asks a question,
            answer it; the second draft is usually much better.
          </p>
        </>
      ),
    },
    {
      heading: "Worked example: an onboarding message",
      body: (
        <>
          <p>
            For an onboarding message, the full brief tells the AI to thank the client and set a
            warm tone, explain what happens in the next three to seven days, list what you need from
            them, such as the intake form, and say when and how they'll hear from you. It adds a
            rule not to promise specific results or timelines. Choose a warm tone and standard
            length, add your niche, and the draft usually needs only your name, dates and links
            before it's ready to send.
          </p>
        </>
      ),
    },
    {
      heading: "Worked example: a plan draft",
      body: (
        <>
          <p>
            For a programming draft, choose 'Outline first'. The AI returns a bullet outline:
            sessions per week, a simple split, main exercises with sets and reps, how to progress
            and a lighter first week. You check it against the client's intake, equipment and any
            medical guidance, correct anything that doesn't fit, and only then ask for the full
            write-up. That keeps your judgement at the centre of the plan, with the AI doing the
            typing.
          </p>
        </>
      ),
    },
    {
      heading: "Worked example: a price-increase message",
      body: (
        <>
          <p>
            For a price-increase message, the prompt asks the AI to thank the client, state the new
            price and start date, explain briefly why and offer any option, such as locking in the
            current rate with a longer commitment. It asks for a short, confident, respectful
            message without over-apologising. Fill in the real numbers and date yourself before
            sending; never let the AI invent them.
          </p>
        </>
      ),
    },
    {
      heading: "Getting better drafts from AI",
      body: (
        <>
          <ul>
            <li>
              <strong>Give one task at a time.</strong> A prompt that asks for a caption, an email
              and a plan gets three mediocre answers.
            </li>
            <li>
              <strong>Add an example.</strong> Paste a message you've written before and ask the AI
              to match its style.
            </li>
            <li>
              <strong>Answer its questions.</strong> The second draft is usually much better than
              the first.
            </li>
            <li>
              <strong>Ask for shorter.</strong> 'Cut this by a third' improves most AI drafts.
            </li>
            <li>
              <strong>Ask for alternatives.</strong> 'Give me three different opening lines' helps
              you find your angle.
            </li>
          </ul>
          <p>
            Treat the AI like a junior assistant who writes fast but needs clear direction and a
            careful editor.
          </p>
        </>
      ),
    },
    {
      heading: "Prompt structure, explained",
      body: (
        <>
          <p>
            Each full brief follows the same structure. It starts with context, who you are and who
            the client is. Then the task, in one sentence. Then a short list of what to include.
            Then the rules: tone, length, style, what to avoid, and the instruction to ask if
            anything is missing and to stay away from medical advice. It ends by asking the AI to
            list its assumptions. That structure works for almost any writing task, so you can adapt
            it for others.
          </p>
        </>
      ),
    },
    {
      heading: "Tone, explained",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Tone</th>
                  <th scope="col">What the AI is told</th>
                  <th scope="col">Good for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Warm</td>
                  <td>warm, encouraging and human</td>
                  <td>Check-in replies, onboarding, testimonials</td>
                </tr>
                <tr>
                  <td>Direct</td>
                  <td>direct, clear and friendly</td>
                  <td>Plans, sales replies, price changes</td>
                </tr>
                <tr>
                  <td>Clinical</td>
                  <td>precise, factual and calm</td>
                  <td>Programme notes, nutrition guidance</td>
                </tr>
                <tr>
                  <td>Playful</td>
                  <td>light, friendly and a little playful</td>
                  <td>Captions and social content</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Match the tone to the client and the moment. A difficult check-in usually needs warm,
            not playful.
          </p>
        </>
      ),
    },
    {
      heading: "Length, explained",
      body: (
        <>
          <p>
            Short asks for under 80 words, which suits DMs, quick check-in replies and testimonial
            requests. Standard asks for around 120 to 180 words, which suits most messages and
            captions. Detailed allows up to 300 words, with short headings if useful, which suits
            onboarding messages, plan outlines and nutrition guidance. If a draft comes back longer
            than you want, ask the AI to cut it; it usually can without losing anything important.
          </p>
        </>
      ),
    },
    {
      heading: "Using AI for check-in replies at scale",
      body: (
        <>
          <p>
            Some coaches use AI to speed up weekly check-in replies across many clients. Done well,
            it saves time. Done badly, every client gets the same generic message, and they notice.
            The safest approach is to read each check-in yourself, decide the one change or focus,
            and use AI only to draft the wording around your decision. The client check-in reader on
            this site can help with the decision itself.
          </p>
        </>
      ),
    },
    {
      heading: "Avoiding invented details",
      body: (
        <>
          <p>
            AI tools sometimes invent things: statistics, research findings, client results, quotes.
            Every prompt asks the AI to ask rather than guess, but always check numbers and claims
            before using them. If a draft includes a figure you didn't give it, remove it or verify
            it. Inventing results in marketing is misleading and, in many places, against
            advertising rules.
          </p>
        </>
      ),
    },
    {
      heading: "Prompts and your brand voice",
      body: (
        <>
          <p>
            Over time, collect examples of messages and posts that sound most like you. Paste two or
            three into a prompt and ask the AI to match their tone, sentence length and vocabulary.
            That works far better than describing your voice in abstract terms. Update the examples
            as your writing develops.
          </p>
        </>
      ),
    },
    {
      heading: "When the AI gets it wrong",
      body: (
        <>
          <p>
            If a draft misses the point, don't start from scratch. Tell the AI specifically what's
            wrong: 'too formal', 'too long', 'this sounds like a sales pitch', 'you've added a
            promise I can't make'. Specific feedback gets a better second draft. If it's still wrong
            after two attempts, write it yourself; some messages are quicker to write than to
            explain.
          </p>
        </>
      ),
    },
    {
      heading: "Testimonial requests",
      body: (
        <>
          <p>
            The testimonial prompt asks the AI to thank the client, mention their progress
            specifically, ask two or three simple questions, make it clear they can say no and ask
            permission before using their name or photos. It tells the AI not to write the
            testimonial for them. Real testimonials in the client's own words are more persuasive
            and more honest than polished ones.
          </p>
        </>
      ),
    },
    {
      heading: "Prompts for nutrition guidance",
      body: (
        <>
          <p>
            The nutrition prompt is deliberately limited to general healthy-eating guidance for
            healthy adults: two or three priorities, practical examples, how to judge whether it's
            working and what to report next time. It tells the AI not to give advice for treating
            any medical condition and to flag anything that needs a dietitian or doctor. That keeps
            drafts within a typical coach's scope.
          </p>
        </>
      ),
    },
    {
      heading: "A quick checklist before sending",
      body: (
        <>
          <ol>
            <li>Is every fact and number correct?</li>
            <li>Is there a specific detail only you would know?</li>
            <li>Is it within your scope, with no medical advice?</li>
            <li>Does it sound like you when you read it aloud?</li>
            <li>Is it as short as it can be?</li>
          </ol>
          <p>Five yeses, and it's ready to send.</p>
        </>
      ),
    },
    {
      heading: "Privacy and AI services",
      body: (
        <>
          <p>
            Before using any AI tool for client work, check its privacy settings and terms. Some
            services let you turn off training on your conversations or offer business plans with
            stronger privacy. Even then, keep identifying and health information out of prompts.
            Your clients trust you with personal details; that trust extends to the tools you use.
          </p>
        </>
      ),
    },
    {
      heading: "Check-in replies, in detail",
      body: (
        <>
          <p>
            A good check-in reply has four parts: one specific thing the client did well, one clear
            change or focus for next week, a sentence explaining why, and a question that invites
            them to reply. The prompt asks for exactly that, and tells the AI not to change
            calories, training or anything medical without your numbers. Decide the change yourself
            first, then let the AI draft the wording around it.
          </p>
        </>
      ),
    },
    {
      heading: "Sales and DM replies, in detail",
      body: (
        <>
          <p>
            When someone messages you about coaching, the reply should feel like a conversation, not
            a brochure. The prompt asks the AI to thank them, reflect back what they told you, ask
            one or two questions about their goal and suggest a clear next step, such as a short
            call. It rules out pressure tactics and claims you can't support. Edit the questions so
            they're specific to what the person actually wrote.
          </p>
        </>
      ),
    },
    {
      heading: "Captions, in detail",
      body: (
        <>
          <p>
            The caption prompt asks for a specific, concrete first line, one useful point explained
            simply, one real detail from your coaching and a single ask. It bans the common tells:
            clichés, stacked questions, lists of three, emoji and exclamation marks. Give it a real
            detail, such as a number from a client's week, and the draft will be far less generic.
            For eight complete captions at once, use the caption generator.
          </p>
        </>
      ),
    },
    {
      heading: "Prompts for different niches",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Niche</th>
                  <th scope="col">Useful client detail to add</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Busy parents losing fat</td>
                  <td>Training days available, typical evening routine</td>
                </tr>
                <tr>
                  <td>Women over 40 lifting</td>
                  <td>Training history, current main lifts</td>
                </tr>
                <tr>
                  <td>Runners</td>
                  <td>Weekly distance, next race date</td>
                </tr>
                <tr>
                  <td>Beginners</td>
                  <td>Equipment at home, confidence in the gym</td>
                </tr>
                <tr>
                  <td>Online nutrition clients</td>
                  <td>Typical day of eating, cooking time</td>
                </tr>
                <tr>
                  <td>Strength athletes</td>
                  <td>Current maxes, competition date</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Add one detail like this to the 'one thing about the client' field, in neutral words,
            and the draft becomes far more specific.
          </p>
        </>
      ),
    },
    {
      heading: "Being open with clients about AI",
      body: (
        <>
          <p>
            Some clients care whether messages are written with AI help. A simple approach is to use
            AI for drafting and always send something you've read, edited and would stand behind. If
            a client asks, be honest: you use tools to work efficiently, and every message and plan
            is reviewed by you. Never present AI-generated results, testimonials or credentials as
            real.
          </p>
        </>
      ),
    },
    {
      heading: "How much time it saves",
      body: (
        <>
          <p>
            For many coaches, a good prompt cuts drafting time for a routine message from ten
            minutes to two or three, including editing. Across dozens of check-ins, welcome messages
            and captions each week, that adds up to hours. The time saved is most valuable when it
            goes back into the parts of coaching AI can't do: noticing, deciding and connecting with
            clients.
          </p>
        </>
      ),
    },
    {
      heading: "Common prompt mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>No context:</strong> the AI doesn't know who you coach or what the client is
              like.
            </li>
            <li>
              <strong>Too many tasks:</strong> one prompt, one job.
            </li>
            <li>
              <strong>No rules:</strong> without limits, drafts drift into clichés, medical claims
              or long padding.
            </li>
            <li>
              <strong>Personal data:</strong> names and health details don't belong in public AI
              tools.
            </li>
            <li>
              <strong>No editing:</strong> sending the first draft as-is.
            </li>
          </ul>
          <p>The generator handles the first three; the last two are up to you.</p>
        </>
      ),
    },
    {
      heading: "Using the outline for content planning",
      body: (
        <>
          <p>
            The outline-first version works well beyond single messages. Ask for an outline of a
            month of captions on one theme, a five-email welcome sequence or a short guide for new
            clients. Correct the outline, then ask for each piece one at a time. Working this way
            keeps content consistent and on-message.
          </p>
        </>
      ),
    },
    {
      heading: "Onboarding messages, in detail",
      body: (
        <>
          <p>
            A welcome message has a big job: it sets the tone for the whole coaching relationship.
            The prompt asks the AI to thank the client and set a warm tone, explain what happens in
            the next three to seven days, list what you need from them and say when they'll hear
            from you. It rules out promises of specific results or timelines. Add your actual links,
            dates and name before sending, and make sure the steps match your real onboarding. The
            client onboarding builder on this site can help plan those steps.
          </p>
        </>
      ),
    },
    {
      heading: "Testimonial and review requests",
      body: (
        <>
          <p>
            Asking for a testimonial feels awkward to many coaches, which is exactly when a clear
            draft helps. Send the request soon after a milestone, while the client feels their
            progress. Keep it short, make saying no easy and ask permission before using their name
            or photos. Two or three specific questions, such as what they were struggling with
            before and what changed, get better answers than 'Could you write me a review?'
          </p>
        </>
      ),
    },
    {
      heading: "Price-increase messages, in detail",
      body: (
        <>
          <p>
            Price changes are best announced briefly and confidently. The prompt asks for thanks,
            the new price, the start date, a short reason and any option you offer, such as keeping
            the current rate with a longer commitment. It asks the AI not to over-apologise. Give at
            least a month's notice, and check the price increase calculator first to see how many
            clients you can lose and still come out ahead.
          </p>
        </>
      ),
    },
    {
      heading: "Using AI for programme ideas",
      body: (
        <>
          <p>
            AI can suggest exercise variations, session structures and progressions, which is useful
            when you want fresh ideas. It doesn't know the client's movement history, injuries,
            equipment or preferences unless you tell it, and it can suggest unsuitable exercises
            with total confidence. Use it as a brainstorming partner. Every exercise in a client's
            plan should be one you've chosen and would coach yourself.
          </p>
        </>
      ),
    },
    {
      heading: "Using AI for nutrition ideas",
      body: (
        <>
          <p>
            AI can generate meal ideas, swaps and shopping lists that fit general targets, which
            saves time. It can also get calorie and protein numbers wrong, ignore allergies and
            suggest unsuitable foods. Check any numbers against a reliable source, respect the
            client's preferences and restrictions, and keep to general guidance. Anything to do with
            medical conditions belongs with a dietitian or doctor.
          </p>
        </>
      ),
    },
    {
      heading: "Prompts in other languages",
      body: (
        <>
          <p>
            If you coach in another language, change the language instruction in the prompt, for
            example to 'plain Spanish' or 'simple Hindi'. The rest of the structure works the same.
            Always have the final message reviewed by someone fluent if you're not, because AI
            translations can sound unnatural or miss nuance.
          </p>
        </>
      ),
    },
    {
      heading: "Getting started",
      body: (
        <>
          <p>
            Pick the task you write most often, usually check-in replies or captions. Build the
            prompt, paste it into your AI tool, edit the draft and send it. Note what you changed.
            After a few uses, add those changes to the prompt itself, so the drafts need less
            editing each time. That small habit turns a generic prompt into one that sounds like
            you.
          </p>
        </>
      ),
    },
    {
      heading: "Prompts for group coaching",
      body: (
        <>
          <p>
            Group coaches can use the same prompts for group announcements, weekly themes and
            community posts. Describe the group in neutral terms, such as 'a 20-person group of
            beginners in their first 12 weeks', instead of a single client. Ask for messages that
            speak to the whole group while inviting individual replies, so members feel addressed
            personally even in a shared space.
          </p>
        </>
      ),
    },
    {
      heading: "Voice notes and transcripts",
      body: (
        <>
          <p>
            Many coaches think more clearly out loud. Record a voice note explaining what you want
            to say to a client, transcribe it, and paste the transcript into a prompt with the
            instruction to tidy it into a short message without changing your meaning. The result
            keeps your thinking and phrasing while removing the ums and repetitions. Check it before
            sending, and keep identifying details out.
          </p>
        </>
      ),
    },
    {
      heading: "Checking for scope",
      body: (
        <>
          <p>
            Before sending anything drafted with AI, check it against your scope of practice. AI
            tools don't know what you're qualified to advise on, and they may suggest things like
            supplement doses, diets for medical conditions or rehabilitation exercises. Remove
            anything outside your scope, and refer where needed. The scope-of-practice check on this
            site can help with borderline cases.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring whether it helps",
      body: (
        <>
          <p>
            Track two things for a month: how long routine messages take you, and how clients
            respond. If messages are faster and clients reply as warmly as before, the prompts are
            working. If replies get shorter or clients seem less engaged, your messages may have
            become too generic, and it's worth adding more personal detail before sending.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping prompts up to date",
      body: (
        <>
          <p>
            Your coaching changes: new offers, new check-in formats, a new price. Update your saved
            prompts when it does, so drafts reflect how you work now. A quick review every few
            months keeps them accurate and stops old details, such as a retired package or a
            previous price, slipping into new messages.
          </p>
        </>
      ),
    },
    {
      heading: "A prompt for every week",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Task</th>
                  <th scope="col">Prompt version</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monday</td>
                  <td>Check-in replies</td>
                  <td>Full brief, drafted around your decision</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>A caption</td>
                  <td>Two versions, pick the stronger</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>Sales replies</td>
                  <td>Full brief, short length</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>A plan update</td>
                  <td>Outline first</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>Onboarding for new clients</td>
                  <td>Full brief, standard length</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A routine like this keeps AI in a supporting role: it handles the typing for routine
            work while you make every decision.
          </p>
        </>
      ),
    },
    {
      heading: "What AI can't do for you",
      body: (
        <>
          <p>
            AI can't notice that a client's tone has changed, remember the conversation you had
            about their father's illness, or sense when they need encouragement rather than a new
            target. Those moments are what clients value most in coaching. Use prompts to save time
            on routine writing, and spend that time on the parts of coaching only a person can do.
          </p>
        </>
      ),
    },
    {
      heading: "Combining prompts with the other tools",
      body: (
        <>
          <p>
            The prompt generator works well alongside the rest of the tools on this site. Use the
            check-in reader to decide what to say, then the prompt generator to draft it. Use the
            caption generator for post ideas, then the AI writing checker to clean up anything
            you've drafted with AI. Each tool handles one part of the job, and you stay the editor
            throughout.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The generator runs in your browser and stores nothing. The prompts it builds contain
            only what you type, so keep client details general and identifying information out.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Choose one routine message you write every week, build a prompt for it, and use it for
            the next five times you write that message. Note what you edit each time and fold those
            edits back into the prompt. By the end of the week, you'll have a prompt that saves real
            time and sounds much closer to your own voice.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use this result with ChatGPT",
    whenToUse: "When you need a prompt for a task this tool doesn't cover.",
    pasteIn: "Paste this, then describe your task.",
    text: `I'm a fitness coach who works with [niche]. I need help writing [what you need to write]. Before writing anything, ask me up to five questions about the client, the context, my tone and the result I want. Then write a draft that is specific, in plain British English, without emoji or exclamation marks, and without medical advice. After the draft, list any assumptions you made so I can correct them.`,
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
    heading: "Send the final message from the coaching app",
    body: (
      <>
        <p>
          In Traiv, chat sits beside each client's plan and check-ins, so the reply you draft lands
          in the same thread as the work it's about.
        </p>
      </>
    ),
  },
  next: [
    { label: "AI writing checker", href: "/tools/ai-writing-checker" },
    { label: "Instagram caption generator", href: "/tools/instagram-caption-generator" },
    { label: "Client check-in reader", href: "/tools/client-check-in-reader" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "What should I include in a ChatGPT prompt?",
      a: "Who you coach, a neutral detail about the client, the task, what to include, the tone, the length and what to avoid.",
    },
    {
      q: "Is it safe to paste client information into ChatGPT?",
      a: "Avoid names, health details and anything identifying. Describe the client in neutral terms.",
    },
    {
      q: "Can AI write my training programmes?",
      a: "It can draft an outline for you to review. Always check it against your knowledge, the client's needs and any medical guidance.",
    },
    {
      q: "Why does the prompt tell the AI to ask me questions?",
      a: "So it doesn't guess. Answering its questions usually gives a much better second draft.",
    },
    {
      q: "Which AI tools does this work with?",
      a: "ChatGPT, Claude, Gemini and most other AI assistants that accept text prompts.",
    },
    {
      q: "How do I make AI drafts sound like me?",
      a: "Add a specific detail only you know, cut the length, read it aloud and rewrite anything that doesn't sound like you.",
    },
    { q: "Is anything stored?", a: "No. The generator runs in your browser and nothing is saved." },
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
