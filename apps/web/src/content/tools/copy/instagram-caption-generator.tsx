import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Instagram caption generator for fitness coaches",
  description:
    "Get eight Instagram captions for your coaching account from your niche, the point of the post and one real detail, each under 150 words.",
  eyebrow: "Free tool · Content for coaches",
  h1: "Instagram caption generator for fitness coaches",
  intro: (
    <>
      <p>
        Add your niche, who the post is for, the one point you want to make and a real detail from
        your week, then choose a tone and an ending. You'll get eight captions, each built on a
        different structure and each under 150 words, written to avoid the habits that make posts
        sound generic. Nothing is sent anywhere; if you'd rather a model drafts them, copy the
        ready-made ChatGPT prompt.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I write better Instagram captions as a fitness coach?",
    answer: (
      <>
        <p>
          Lead with something specific, such as a real number or moment from your coaching, make one
          point, explain it plainly and end with one clear ask. Avoid the habits that make captions
          sound generic: 'it's not X, it's Y', a question as the first line, lists of three
          adjectives, emoji and exclamation marks. Rotate between structures so your feed doesn't
          repeat itself.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why most coaching captions get ignored",
      body: (
        <>
          <p>
            Scroll through fitness coaching accounts and many captions sound the same: a rhetorical
            question, a motivational line, three virtues and a 'link in bio'. Readers skim past
            because they've seen it a thousand times. Captions that get read start with something
            specific to the coach and the reader, make one point clearly and give a reason to act.
          </p>
          <p>
            The generator builds captions that follow those principles, using your own details. Your
            real detail does most of the work; the structure gives it a shape.
          </p>
        </>
      ),
    },
    {
      heading: "The four inputs",
      body: (
        <>
          <ul>
            <li>
              <strong>Your niche:</strong> who you coach, such as strength coaching for women over
              40.
            </li>
            <li>
              <strong>Who the post is for:</strong> the reader you're speaking to, such as people
              who train four times a week and see nothing change.
            </li>
            <li>
              <strong>The one point:</strong> what you want them to understand, such as that the
              weekend is where the calories go.
            </li>
            <li>
              <strong>One real detail:</strong> something true from your week, such as how many food
              logs were at maintenance on a Saturday.
            </li>
          </ul>
          <p>
            The detail matters most. It's what makes a caption sound like your coaching rather than
            anyone's.
          </p>
        </>
      ),
    },
    {
      heading: "Eight structures",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Structure</th>
                  <th scope="col">What it's good for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Client result, with permission</td>
                  <td>Proof</td>
                </tr>
                <tr>
                  <td>Belief to correct</td>
                  <td>Trust</td>
                </tr>
                <tr>
                  <td>Fixes I make most</td>
                  <td>Saves</td>
                </tr>
                <tr>
                  <td>Why I programmed it</td>
                  <td>Profile visits</td>
                </tr>
                <tr>
                  <td>Permission to ease off</td>
                  <td>Shares</td>
                </tr>
                <tr>
                  <td>What I don't do</td>
                  <td>Profile visits and shares</td>
                </tr>
                <tr>
                  <td>Straight how-to</td>
                  <td>Saves</td>
                </tr>
                <tr>
                  <td>A real day</td>
                  <td>Follows</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Using different structures keeps your feed varied and gives different kinds of readers a
            reason to engage.
          </p>
        </>
      ),
    },
    {
      heading: "Client result, with permission",
      body: (
        <>
          <p>
            Client results are powerful proof, and they need care. The caption opens with the real
            detail, says it's shared with the client's permission, explains what changed and why,
            and ends with your ask. It includes a consent line. Only post it with the client's
            written agreement, and never share identifying details or photos without explicit
            permission.
          </p>
        </>
      ),
    },
    {
      heading: "Belief to correct",
      body: (
        <>
          <p>
            Many readers hold a belief that's holding them back, such as thinking more training is
            always better. This structure names what people do because of the belief, explains what
            you see in practice and backs it with your detail. It builds trust, because it shows you
            understand the reader's situation and can explain it plainly.
          </p>
        </>
      ),
    },
    {
      heading: "Fixes I make most",
      body: (
        <>
          <p>
            Lists of specific fixes are among the most saved types of posts. This structure opens
            with how many things you fix for most new clients, lists them simply and connects them
            to your point. Keep each item concrete: 'protein is low on busy days' rather than
            'nutrition needs work'.
          </p>
        </>
      ),
    },
    {
      heading: "Why I programmed it",
      body: (
        <>
          <p>
            Showing a decision you made for a client, and why, gives readers a look inside your
            coaching. It's one of the best ways to show expertise without lecturing. The caption
            describes the change, links it to your detail and explains the principle behind it.
          </p>
        </>
      ),
    },
    {
      heading: "Permission to ease off",
      body: (
        <>
          <p>
            Many people feel guilty about doing less. A caption that gives them permission, to train
            shorter, rest when life is heavy, or skip the perfect plan in favour of the done one, is
            often shared. It shows empathy and positions you as a realistic coach.
          </p>
        </>
      ),
    },
    {
      heading: "What I don't do",
      body: (
        <>
          <p>
            Saying what you don't do, such as changing a client's whole plan every week, defines
            your approach clearly. It attracts people who share your values and filters out those
            who want something else. Keep it calm and explanatory rather than critical of other
            coaches.
          </p>
        </>
      ),
    },
    {
      heading: "Straight how-to",
      body: (
        <>
          <p>
            Open with the instruction itself, such as 'Pick one meal and add 30 g of protein to it.'
            No question, no build-up. Explain why it works and how to start. Practical, immediately
            useful captions are saved and revisited.
          </p>
        </>
      ),
    },
    {
      heading: "A real day",
      body: (
        <>
          <p>
            Opening with a time and what you were doing, such as reviewing check-ins at 6:40am,
            gives followers a sense of who you are and how you coach. It builds familiarity, which
            is often what turns a follower into a client months later.
          </p>
        </>
      ),
    },
    {
      heading: "Tone and ending",
      body: (
        <>
          <p>
            Choose direct, warm or dry. Direct is clear and confident; warm is encouraging; dry adds
            a little understated humour. For the ending, choose a comment keyword, a DM keyword, a
            save prompt or no ask at all. A keyword ask, such as 'Comment PLAN and I'll send you the
            simple version', gives readers an easy action and gives you a way to start
            conversations.
          </p>
        </>
      ),
    },
    {
      heading: "Rules built into every caption",
      body: (
        <>
          <ul>
            <li>Under 150 words.</li>
            <li>Your detail near the top.</li>
            <li>No 'it's not X, it's Y'.</li>
            <li>No question as the first line.</li>
            <li>No lists of three adjectives.</li>
            <li>No emoji and no exclamation marks.</li>
            <li>No moral tacked on at the end.</li>
          </ul>
          <p>
            These rules remove the most common habits that make captions sound generic. Edit freely;
            they're a starting point.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            With the default inputs, strength coaching for women over 40, a post for anyone who
            trains four times a week and sees nothing change, the point that the weekend is where
            the calories go, and the detail that 27 of the last 30 food logs were at maintenance on
            a Saturday, the belief-to-correct caption opens with what most readers do because they
            think more training is the answer. It explains what you see in practice, uses the
            27-of-30 detail as proof and ends with 'Comment PLAN and I'll send you the simple
            version I give clients.'
          </p>
          <p>
            The same inputs produce seven other captions with different structures, so one idea can
            fuel a week or more of posts.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing the one point",
      body: (
        <>
          <p>
            A caption works best when it makes one point. If you have three things to say, that's
            three posts. Write the point as a single sentence a client could repeat to a friend:
            'the weekend is where the calories go', 'two sessions done beats four planned', 'protein
            first at breakfast'. If you can't write it in one sentence, the caption will probably
            wander.
          </p>
        </>
      ),
    },
    {
      heading: "Finding real details",
      body: (
        <>
          <p>
            Real details come from your coaching week: a number from a check-in, a question a client
            asked, a lift someone hit, a pattern you noticed across clients. Keep a note on your
            phone and add one detail a day. Within a month, you'll have more caption material than
            you can use, all of it specific to your coaching.
          </p>
        </>
      ),
    },
    {
      heading: "Writing the first two lines",
      body: (
        <>
          <p>
            On Instagram, only the first line or two show before 'more'. Those lines decide whether
            anyone reads the rest. The generator puts your detail or a direct instruction there,
            rather than a question or a general statement. If you edit a caption, keep the
            strongest, most specific sentence at the top.
          </p>
        </>
      ),
    },
    {
      heading: "Calls to action that work",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Ask</th>
                  <th scope="col">When to use it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Comment keyword</td>
                  <td>
                    When you have something to send, such as a guide or plan, and want visible
                    engagement
                  </td>
                </tr>
                <tr>
                  <td>DM keyword</td>
                  <td>
                    When you'd rather start a private conversation, such as for coaching enquiries
                  </td>
                </tr>
                <tr>
                  <td>Save</td>
                  <td>For practical how-to and list posts people will want to revisit</td>
                </tr>
                <tr>
                  <td>None</td>
                  <td>For personal or story posts where an ask would feel forced</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Use one ask per post. Several competing asks reduce the response to all of them.</p>
        </>
      ),
    },
    {
      heading: "Using keywords well",
      body: (
        <>
          <p>
            If you ask for a comment keyword, follow through: reply to every comment and send what
            you promised, promptly. Keywords that lead to nothing damage trust. Choose a simple,
            relevant word in capitals, such as PLAN or GUIDE, and keep a ready-to-send message for
            each keyword so replying is quick.
          </p>
        </>
      ),
    },
    {
      heading: "Posting client results responsibly",
      body: (
        <>
          <p>
            Client results build trust, but they come with responsibilities. Get written permission
            before sharing anything. Ask what they're comfortable with: a number, a quote, a photo,
            their first name or nothing identifying. Avoid making results sound typical if they
            aren't, and never imply guaranteed outcomes. The client-result caption includes a
            consent line as a reminder.
          </p>
        </>
      ),
    },
    {
      heading: "Building a weekly posting plan",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Caption structure</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monday</td>
                  <td>Straight how-to</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>Belief to correct</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>A real day</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>Fixes I make most</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>Client result, with permission</td>
                </tr>
                <tr>
                  <td>Weekend</td>
                  <td>Permission to ease off</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            A plan like this, using the same point across different structures, keeps your message
            consistent and your feed varied.
          </p>
        </>
      ),
    },
    {
      heading: "Editing the captions",
      body: (
        <>
          <p>
            The captions are drafts. Read each one aloud and change anything that doesn't sound like
            you. Add a sentence only you would write, cut anything that feels like filler and check
            every fact. Run your edited version through the AI writing checker to catch any habits
            that crept back in.
          </p>
        </>
      ),
    },
    {
      heading: "Hashtags and discovery",
      body: (
        <>
          <p>
            Hashtags matter less than they used to, but a few relevant ones can help people find
            your posts. Add three to five specific hashtags below the caption rather than in the
            text, such as ones describing your niche and location. Avoid long blocks of generic
            hashtags, which look spammy and rarely help.
          </p>
        </>
      ),
    },
    {
      heading: "Captions for carousels and reels",
      body: (
        <>
          <p>
            For carousels, the caption can expand on the slides or add your personal angle. For
            reels, the caption supports the video: restate the point, add the detail and include the
            ask. In both cases, the same structures work; just keep the caption from repeating the
            content word for word.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring what works",
      body: (
        <>
          <p>
            Track saves, shares, comments and profile visits for each caption structure over a
            month. You'll likely find that some structures work better for your audience than
            others. Use more of those, but keep some variety so your feed doesn't become
            predictable.
          </p>
        </>
      ),
    },
    {
      heading: "Turning followers into clients",
      body: (
        <>
          <p>
            Captions alone rarely turn a follower into a client; consistent, useful posts over time
            do. Each caption should either help the reader, show how you coach or invite a
            conversation. Over months, followers who keep finding your posts useful are the ones who
            eventually message you, and they arrive already trusting your approach.
          </p>
        </>
      ),
    },
    {
      heading: "Captions for different niches",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Niche</th>
                  <th scope="col">Example point</th>
                  <th scope="col">Example detail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fat loss for busy parents</td>
                  <td>Two planned meals a day beats a perfect diet</td>
                  <td>One client went from three takeaways a week to one</td>
                </tr>
                <tr>
                  <td>Strength for women over 40</td>
                  <td>Heavier weights, fewer reps, build bone and muscle</td>
                  <td>A client deadlifted her body weight at 52</td>
                </tr>
                <tr>
                  <td>Running</td>
                  <td>Easy runs should feel easy</td>
                  <td>Most clients run their easy days 40 seconds too fast</td>
                </tr>
                <tr>
                  <td>Beginners</td>
                  <td>Two sessions a week is a real start</td>
                  <td>Six of my last ten new clients started with two</td>
                </tr>
                <tr>
                  <td>Online nutrition</td>
                  <td>Protein first at every meal</td>
                  <td>Average protein rose 35 g a day in four weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>These are illustrations. Use points and details from your own coaching.</p>
        </>
      ),
    },
    {
      heading: "Voice and personality",
      body: (
        <>
          <p>
            The generator gives a structure and plain wording. Your personality comes from what you
            add: the phrases you use with clients, your sense of humour, your stories. Read the
            caption and ask whether a client who knows you would recognise it as yours. If not,
            change a few words until they would.
          </p>
        </>
      ),
    },
    {
      heading: "When to post",
      body: (
        <>
          <p>
            Timing matters less than consistency and quality, but posting when your audience is
            online can help early engagement. Check your account insights to see when followers are
            most active. Many coaches find mornings and early evenings on weekdays work well, but
            your audience may differ.
          </p>
        </>
      ),
    },
    {
      heading: "Responding to comments",
      body: (
        <>
          <p>
            Engagement doesn't end when you post. Reply to comments in the first hour or two, answer
            questions properly and thank people for sharing. Conversations in the comments often
            turn into direct messages, and direct messages into coaching enquiries.
          </p>
        </>
      ),
    },
    {
      heading: "Captions and accessibility",
      body: (
        <>
          <p>
            Write captions in plain language, break long text into short paragraphs and avoid
            relying on emoji to carry meaning, since screen readers read them aloud. If your post
            includes an image with text, add alt text describing it. Accessible captions reach more
            people and are easier for everyone to read.
          </p>
        </>
      ),
    },
    {
      heading: "Consistency over perfection",
      body: (
        <>
          <p>
            Many coaches post rarely because each caption has to be perfect. A good caption posted
            this week does more than a perfect caption posted next month. The generator is designed
            to get you from idea to a usable draft in minutes, so posting consistently becomes
            realistic.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Write one point and three real details from your coaching this week. Run the generator
            with each detail, choose your favourite caption from each run and schedule them across
            the week. Note which ones get saved or shared, and use those structures again next week.
          </p>
        </>
      ),
    },
    {
      heading: "Writing for one reader",
      body: (
        <>
          <p>
            Captions land best when they feel written for one person. Picture a specific client or
            follower, someone who trains four times a week and feels stuck, and write to them. 'You'
            becomes more natural, examples become more relevant and the tone becomes warmer. Readers
            who match that person feel understood; others can tell the post isn't for them, which is
            fine.
          </p>
        </>
      ),
    },
    {
      heading: "Avoiding medical claims",
      body: (
        <>
          <p>
            Captions about fat loss, nutrition or health should stay within your scope. Share
            general, evidence-based guidance and real coaching experience, but avoid claims to treat
            or cure conditions, promises of specific results or advice that should come from a
            doctor or dietitian. Many countries regulate health claims in advertising; staying
            general and honest keeps you on the right side of them.
          </p>
        </>
      ),
    },
    {
      heading: "Turning a caption into a series",
      body: (
        <>
          <p>
            If a caption performs well, make a series from it. A popular 'fixes I make most' post
            can become a weekly series, each post diving into one fix. A strong client result can be
            followed by a post explaining the plan behind it. Series give followers a reason to come
            back and make planning content easier.
          </p>
        </>
      ),
    },
    {
      heading: "When captions don't perform",
      body: (
        <>
          <p>
            Not every post will do well, and that's normal. Look at the first line: was it specific?
            Look at the point: was it clear and useful? Look at the ask: was there one, and was it
            easy? Change one element and try the same idea again in a few weeks. Ideas that flop
            once often work with a better first line.
          </p>
        </>
      ),
    },
    {
      heading: "The ChatGPT prompt",
      body: (
        <>
          <p>
            If you'd rather have a model draft the captions, copy the prompt. It includes your
            niche, audience, point, detail, tone and ask, the eight structures and all the rules.
            Paste it into ChatGPT or a similar tool, then edit what comes back and run it through
            the AI writing checker before posting.
          </p>
        </>
      ),
    },
    {
      heading: "Captions and your offer",
      body: (
        <>
          <p>
            Every few posts, connect a caption to your coaching offer. A client result can end with
            how they started working with you. A how-to can end by mentioning that this is part of
            what clients get in their first week. Don't turn every caption into an advert; one in
            four or five that makes the next step clear is usually enough.
          </p>
        </>
      ),
    },
    {
      heading: "Repurposing captions",
      body: (
        <>
          <p>
            A caption that works on Instagram can become an email tip, a LinkedIn post, a Facebook
            group post or the script for a short video. Change the length and tone slightly for each
            platform, but keep the specific detail and the single point. One good idea, shared in
            several places, reaches far more people than a new idea for every platform.
          </p>
        </>
      ),
    },
    {
      heading: "Caption length by goal",
      body: (
        <>
          <p>
            Short captions of 40 to 80 words suit simple tips and personal moments. Medium captions
            of 80 to 150 words suit most coaching posts, with room for a point, a detail and an ask.
            Longer captions can work for client stories or detailed explanations, but only if every
            sentence earns its place. The generator keeps all eight under 150 words.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The generator runs entirely in your browser. Your niche, details and keywords aren't
            stored or sent anywhere.
          </p>
        </>
      ),
    },
    {
      heading: "A checklist before you post",
      body: (
        <>
          <ol>
            <li>Is the first line specific enough to make someone tap 'more'?</li>
            <li>Is there one clear point?</li>
            <li>Is the detail true, and do you have permission to share it?</li>
            <li>Is there one ask, or a deliberate choice of none?</li>
            <li>Does it sound like you when you read it aloud?</li>
          </ol>
          <p>Five yeses and it's ready.</p>
        </>
      ),
    },
    {
      heading: "Learning from your best posts",
      body: (
        <>
          <p>
            Look back at your five most-saved or most-shared posts. What did their first lines have
            in common? What kind of point did they make? Which structure did they use? Feed those
            patterns back into the generator by choosing similar points and details, and you'll
            produce more posts like your best ones.
          </p>
        </>
      ),
    },
    {
      heading: "Why the rules exist",
      body: (
        <>
          <p>
            Every rule in the generator removes a habit readers have learned to skip. Questions as
            first lines feel like adverts. Lists of three adjectives sound like slogans. Emoji and
            exclamation marks make posts look like everyone else's. Contrast framing has become a
            sign of machine-written text. Removing them doesn't make captions bland; it lets your
            specific detail stand out.
          </p>
        </>
      ),
    },
    {
      heading: "Starting small",
      body: (
        <>
          <p>
            If writing captions feels daunting, start with one post a week using one structure. Once
            that feels easy, add a second. Within a month, you'll have a rhythm and a sense of which
            structures suit your voice.
          </p>
        </>
      ),
    },
    {
      heading: "One idea, many captions",
      body: (
        <>
          <p>
            Run the generator with the same point and a new detail each week. The structures stay
            familiar to you, while each post feels new to your followers.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use this result with ChatGPT",
    whenToUse: "When you want a model to draft captions from your details.",
    pasteIn: "Copy the full prompt from the generator, or use this shorter version.",
    text: `Write three Instagram captions for my fitness coaching account. Niche: [niche]. Audience: [audience]. The one point: [point]. One real detail from this week: [detail]. Each caption under 150 words, with the detail in the first two lines. No emoji, no exclamation marks, no 'it's not X, it's Y', no question as the first line, no lists of three adjectives. End with: [your ask]. Ask me if anything is unclear.`,
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
    key: "client-app",
    heading: "Turn followers into clients you keep",
    body: (
      <>
        <p>
          Content brings people in; the coaching keeps them. In Traiv, new clients get their plans,
          check-ins and chat in one app under your name from day one.
        </p>
      </>
    ),
  },
  next: [
    { label: "Instagram hook generator", href: "/tools/instagram-hook-generator" },
    { label: "Reel script generator", href: "/tools/reel-script-generator" },
    { label: "AI writing checker", href: "/tools/ai-writing-checker" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How long should an Instagram caption be?",
      a: "For most coaching posts, under 150 words is enough to make one point well. Longer captions can work for detailed explanations.",
    },
    {
      q: "Should I use hashtags?",
      a: "A few relevant hashtags can help discovery. Add them below the caption rather than in the text.",
    },
    {
      q: "Can I post client results?",
      a: "Only with the client's written permission, and without identifying details or photos unless they've agreed to those specifically.",
    },
    {
      q: "What is a comment keyword?",
      a: "A word readers comment to receive something, such as a guide. It's an easy action that starts a conversation.",
    },
    {
      q: "How often should I post?",
      a: "Consistency matters more than frequency. Many coaches post three to five times a week.",
    },
    {
      q: "Why no emoji?",
      a: "They're one of the habits that make captions look generic. Add one or two if they suit your style.",
    },
    {
      q: "Can I edit the captions?",
      a: "Yes. Treat them as drafts and change anything that doesn't sound like you.",
    },
    {
      q: "Why put the detail at the top?",
      a: "The first two lines decide whether people tap 'more'. A specific detail earns the click.",
    },
    {
      q: "Do I need a different caption for each post?",
      a: "Yes. Rotate structures so your feed stays varied.",
    },
    {
      q: "Can I use the captions for other platforms?",
      a: "Yes. They work on Facebook, LinkedIn and Threads with small edits.",
    },
    {
      q: "Is anything I type stored?",
      a: "No. The generator runs in your browser and nothing is sent.",
    },
  ],
  keepGoing: [
    { label: "The client app in Traiv", href: "/features/client-app" },
    { label: "All free tools", href: "/tools" },
  ],
  close: {
    heading: "Run your coaching business on one platform",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
