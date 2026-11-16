import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Reel script generator for fitness coaches",
  description:
    "Get six 30-second talking-head reel scripts from your topic, point and one real number, each timed from hook to ask with a read-aloud estimate.",
  eyebrow: "Free tool · Content for coaches",
  h1: "Reel script generator for fitness coaches",
  intro: (
    <>
      <p>
        Add your topic, who it's for, the one point, and a real number or client question, then
        choose a tone and an ending. You'll get six talking-head scripts on six patterns, each split
        into four timed parts from hook to ask, at about 30 seconds read aloud, with word counts and
        timings. Copy any script, or copy a ChatGPT prompt instead. Nothing you type leaves this
        page.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I script a 30-second reel?",
    answer: (
      <>
        <p>
          Plan four sections: an opening hook lasting about three seconds, the point from three to
          twenty seconds, proof such as a number or example from twenty to twenty-five, and a single
          ask in the last five. Aim for about 75 spoken words, which takes roughly 30 seconds at a
          natural pace.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why script a short reel",
      body: (
        <>
          <p>
            Talking-head reels look effortless, but the best ones are planned. Without a script,
            it's easy to ramble, bury the point or forget the ask. A short script keeps the reel
            focused: one idea, one piece of proof, one action. It also makes filming quicker,
            because you know exactly what to say.
          </p>
        </>
      ),
    },
    {
      heading: "The four timed parts",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Part</th>
                  <th scope="col">Time</th>
                  <th scope="col">Job</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hook</td>
                  <td>0 to 3 s</td>
                  <td>Stop the scroll and set up the topic</td>
                </tr>
                <tr>
                  <td>Point</td>
                  <td>3 to 20 s</td>
                  <td>Make the one point clearly</td>
                </tr>
                <tr>
                  <td>Proof</td>
                  <td>20 to 25 s</td>
                  <td>Back it with a number or example</td>
                </tr>
                <tr>
                  <td>Ask</td>
                  <td>25 to 30 s</td>
                  <td>One clear action</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Each script shows the words in each part, the total word count and an estimated
            read-aloud time at 150 words a minute.
          </p>
        </>
      ),
    },
    {
      heading: "Six patterns",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Pattern</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Belief, then the number</td>
                  <td>Reach: corrects a belief your audience holds</td>
                </tr>
                <tr>
                  <td>Their question, answered</td>
                  <td>Saves and messages</td>
                </tr>
                <tr>
                  <td>A mistake I made</td>
                  <td>Trust</td>
                </tr>
                <tr>
                  <td>What I tell clients</td>
                  <td>Profile visits</td>
                </tr>
                <tr>
                  <td>Two clients, one week</td>
                  <td>Shares</td>
                </tr>
                <tr>
                  <td>One thing to do today</td>
                  <td>Saves and follows</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Rotating patterns keeps your reels varied and reaches different viewers.</p>
        </>
      ),
    },
    {
      heading: "The inputs",
      body: (
        <>
          <ul>
            <li>
              <strong>Topic:</strong> a short phrase, such as protein at breakfast.
            </li>
            <li>
              <strong>Audience:</strong> who it's for, such as women over 40 who lift.
            </li>
            <li>
              <strong>The one point:</strong> a full sentence, such as 'the first meal decides the
              snacking at four'.
            </li>
            <li>
              <strong>One number or client question:</strong> such as '30 g of protein by 9am'.
            </li>
            <li>
              <strong>Tone and ask:</strong> direct, warm or dry; follow, comment keyword, save or
              none.
            </li>
          </ul>
          <p>The point and the number carry the reel. Make them specific and true.</p>
        </>
      ),
    },
    {
      heading: "Belief, then the number",
      body: (
        <>
          <p>
            This pattern opens with what most of your audience believes about the topic, gives your
            point and backs it with your number. It reaches new viewers because it challenges a
            common assumption. Keep the tone helpful rather than dismissive.
          </p>
        </>
      ),
    },
    {
      heading: "Their question, answered",
      body: (
        <>
          <p>
            Opening with a client's question, then answering it, makes viewers who share that
            question stop and listen. It's one of the most saved formats, because people keep useful
            answers.
          </p>
        </>
      ),
    },
    {
      heading: "A mistake I made",
      body: (
        <>
          <p>
            Admitting a mistake, with a date or detail, builds trust quickly. Follow it with what
            you do differently now. Viewers relate to coaches who have learned, not ones who claim
            they always knew.
          </p>
        </>
      ),
    },
    {
      heading: "What I tell clients",
      body: (
        <>
          <p>
            Sharing what you tell every new client gives viewers a taste of being coached by you.
            It's an effective way to show your approach and attract people who want exactly that.
          </p>
        </>
      ),
    },
    {
      heading: "Two clients, one week",
      body: (
        <>
          <p>
            Comparing two clients on the same plan, one who got the detail right and one who didn't,
            creates natural curiosity about the difference. Keep it anonymous and focus on the
            lesson, not on criticising anyone.
          </p>
        </>
      ),
    },
    {
      heading: "One thing to do today",
      body: (
        <>
          <p>
            The simplest pattern: one action viewers can take today, why it works and the number to
            aim for. It's easy to save, share and act on, which makes it a strong format for growing
            followers.
          </p>
        </>
      ),
    },
    {
      heading: "Filming tips",
      body: (
        <>
          <ul>
            <li>
              Read the script a couple of times, then talk it rather than reading word for word.
            </li>
            <li>Film in good, natural light with the camera at eye level.</li>
            <li>Put the hook as on-screen text in the first frame.</li>
            <li>Add captions; many people watch without sound.</li>
            <li>Keep it to one take where you can; small imperfections feel authentic.</li>
          </ul>
          <p>Allow a few extra seconds for on-screen text and pauses.</p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            With the default inputs, protein at breakfast, women over 40 who lift, the point that
            the first meal decides the snacking at four, and the number 30 g of protein by 9am, the
            first script opens with 'Most women over 40 who lift think protein at breakfast doesn't
            matter much.' It explains the point, uses 30 g by 9am as proof and ends with 'Follow for
            one practical coaching tip a week.' The full script comes to roughly 75 words, close to
            30 seconds read aloud.
          </p>
        </>
      ),
    },
    {
      heading: "Writing a strong point",
      body: (
        <>
          <p>
            The point should be a full sentence a viewer could repeat: 'the first meal decides the
            snacking at four', 'two sessions done beats four planned', 'your weight jumps after rest
            days because of water, not fat'. If the point is vague, the reel will be too. Spend most
            of your planning time getting this sentence right.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing proof",
      body: (
        <>
          <p>
            Proof makes the point believable. The best proof is a real number or example from your
            coaching: a target you use, a result a client saw, a pattern you notice in check-ins.
            Avoid invented statistics. A simple, true number is far more convincing than a dramatic
            one viewers suspect is made up.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing the ask",
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
                  <td>Follow</td>
                  <td>When the reel is part of a series or represents your regular content</td>
                </tr>
                <tr>
                  <td>Comment keyword</td>
                  <td>When you have something useful to send</td>
                </tr>
                <tr>
                  <td>Save</td>
                  <td>For practical tips people will want to revisit</td>
                </tr>
                <tr>
                  <td>None</td>
                  <td>When the content is personal or the ask would feel forced</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>One ask per reel. Ending with several requests dilutes all of them.</p>
        </>
      ),
    },
    {
      heading: "Tone",
      body: (
        <>
          <p>
            Direct scripts are clear and confident. Warm scripts add reassurance, such as 'You don't
            need to get it perfect.' Dry scripts add a little understated humour. Choose the tone
            that matches how you actually talk; viewers notice when a coach is performing a
            personality that isn't theirs.
          </p>
        </>
      ),
    },
    {
      heading: "Reading time and pacing",
      body: (
        <>
          <p>
            Most people speak at about 130 to 160 words a minute in a natural, conversational style.
            The read-aloud estimate assumes 150. Pause slightly after the hook and before the ask;
            those pauses help viewers absorb the point. If a script runs long, cut words from the
            point section first; the hook and ask should stay tight.
          </p>
        </>
      ),
    },
    {
      heading: "Talking-head reels that hold attention",
      body: (
        <>
          <ul>
            <li>Start talking in the first frame; don't wait.</li>
            <li>Look at the lens, not the screen.</li>
            <li>Use your hands naturally; it helps energy.</li>
            <li>Change framing or add text every few seconds.</li>
            <li>End on the ask, not on a long goodbye.</li>
          </ul>
          <p>
            Simple production is fine. Clear sound and good light matter more than fancy editing.
          </p>
        </>
      ),
    },
    {
      heading: "Batching scripts and filming",
      body: (
        <>
          <p>
            Generate scripts for several topics in one sitting, then film them together. Batching
            saves set-up time and keeps your posting consistent. Many coaches film a week's reels in
            one session, changing tops or backgrounds between takes for variety.
          </p>
        </>
      ),
    },
    {
      heading: "Repurposing scripts",
      body: (
        <>
          <p>
            A 30-second script can become a carousel, a caption, an email tip or a story sequence.
            The hook becomes a first slide or subject line; the point and proof become the body; the
            ask stays the same. One good script can fuel several pieces of content across platforms.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring reels",
      body: (
        <>
          <p>
            Track how many viewers watch past the first three seconds, how many watch to the end,
            and how many save, share or follow. If many drop off early, the hook needs work. If they
            drop off in the middle, the point may be too long. If they watch to the end but don't
            act, the ask may need to be clearer or more relevant.
          </p>
        </>
      ),
    },
    {
      heading: "Common reel script mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>A slow start:</strong> introductions such as 'Hi guys, today I want to talk
              about…' lose viewers.
            </li>
            <li>
              <strong>Several points:</strong> one reel, one idea.
            </li>
            <li>
              <strong>No proof:</strong> claims without a number or example are easy to dismiss.
            </li>
            <li>
              <strong>A long ending:</strong> the ask should be the last thing viewers hear.
            </li>
            <li>
              <strong>Overused openers:</strong> 'Stop doing this' and 'Unpopular opinion' are
              scrolled past.
            </li>
          </ul>
          <p>Each script avoids these by design.</p>
        </>
      ),
    },
    {
      heading: "From reel to client",
      body: (
        <>
          <p>
            A single reel rarely brings a client. A steady stream of useful, specific reels, each
            showing how you think and coach, builds familiarity and trust. When viewers have seen
            you explain things clearly many times, booking a call feels like a natural next step
            rather than a leap.
          </p>
        </>
      ),
    },
    {
      heading: "Scripts for different niches",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Niche</th>
                  <th scope="col">Topic</th>
                  <th scope="col">Point</th>
                  <th scope="col">Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fat loss</td>
                  <td>weekend eating</td>
                  <td>Plan Saturday like a weekday</td>
                  <td>Two planned meals on Saturday</td>
                </tr>
                <tr>
                  <td>Strength</td>
                  <td>warm-ups</td>
                  <td>Ramp up to your working weight</td>
                  <td>Four sets, 40 to 85%</td>
                </tr>
                <tr>
                  <td>Running</td>
                  <td>easy pace</td>
                  <td>Easy runs build the engine</td>
                  <td>Conversational pace, 80% of runs</td>
                </tr>
                <tr>
                  <td>Over-50s</td>
                  <td>balance</td>
                  <td>Balance is trainable at any age</td>
                  <td>Ten seconds on one leg</td>
                </tr>
                <tr>
                  <td>Nutrition</td>
                  <td>protein</td>
                  <td>Protein first, then the rest</td>
                  <td>30 g per meal</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Use your own topics, points and numbers; these show how specific the inputs can be.</p>
        </>
      ),
    },
    {
      heading: "Captions for your reels",
      body: (
        <>
          <p>
            Write a short caption to go with each reel: restate the point, add the detail and repeat
            the ask. The caption generator on this site can help. Keep the caption from simply
            repeating the script; add a sentence of context or a tip that didn't fit in 30 seconds.
          </p>
        </>
      ),
    },
    {
      heading: "On-screen text",
      body: (
        <>
          <p>
            Put the hook as text in the first frame, and consider adding the number as text during
            the proof section. On-screen text helps viewers watching without sound and reinforces
            the key points for those who are. Keep text large, high-contrast and away from the edges
            where app buttons appear.
          </p>
        </>
      ),
    },
    {
      heading: "When a script runs long",
      body: (
        <>
          <p>
            If a script reads at more than about 32 seconds, trim the point section first: remove a
            clause, a qualifier or a repeated idea. The hook should stay under three seconds and the
            ask under five. Short, tight reels are more likely to be watched to the end and
            replayed.
          </p>
        </>
      ),
    },
    {
      heading: "Longer formats",
      body: (
        <>
          <p>
            The four-part structure scales. For a 60-second reel, keep the hook short, double the
            point section and add a second piece of proof. For a short YouTube video, each part
            becomes a section. The principle stays the same: one idea, clearly made, backed up and
            followed by one action.
          </p>
        </>
      ),
    },
    {
      heading: "Consistency over production",
      body: (
        <>
          <p>
            Viewers forgive simple production; they don't forgive unclear content. A phone, natural
            light and clear audio are enough. Posting a well-scripted reel every week does far more
            than an expensively produced reel once a month.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Pick one topic and one real number from your coaching. Generate six scripts, choose the
            two you like best, read each aloud twice and film them. Post one this week and one next
            week, and compare how many people watch to the end.
          </p>
        </>
      ),
    },
    {
      heading: "Reels for different goals",
      body: (
        <>
          <p>
            Reels can grow your audience, build trust or bring in enquiries. Growth reels correct
            common beliefs or share quick tips that are easy to share. Trust reels show how you
            coach, admit mistakes or explain decisions. Enquiry reels answer specific questions your
            ideal clients ask and end with a comment or DM keyword. Plan a mix across the month.
          </p>
        </>
      ),
    },
    {
      heading: "Using client questions",
      body: (
        <>
          <p>
            The 'their question, answered' pattern works best with real questions in clients' own
            words, used anonymously. Keep a running list of questions clients ask in check-ins and
            messages. Each one is a potential reel, and the people asking are exactly the audience
            you want to reach.
          </p>
        </>
      ),
    },
    {
      heading: "Avoiding health claims",
      body: (
        <>
          <p>
            Keep reels within your scope. Share general guidance and coaching experience, avoid
            promising specific results and leave medical topics to medical professionals. A reel
            that says '30 g of protein at breakfast helps many of my clients manage afternoon
            snacking' is fine; one that promises it will cure a condition is not.
          </p>
        </>
      ),
    },
    {
      heading: "The ChatGPT prompt",
      body: (
        <>
          <p>
            If you'd rather have a model draft scripts, copy the prompt. It contains your inputs,
            the four-part timing and the six patterns. Paste it into ChatGPT or a similar tool, then
            edit the scripts so they sound like you talking, and check the word counts before
            filming.
          </p>
        </>
      ),
    },
    {
      heading: "Rehearsing quickly",
      body: (
        <>
          <p>
            Read the script aloud twice, then put it away and say it in your own words. Most coaches
            find their natural phrasing is better than the written version. If you forget a part,
            glance at the four section headings: hook, point, proof, ask. That's enough to keep the
            reel on track.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The generator runs entirely in your browser. Your topic, point and numbers aren't stored
            or sent.
          </p>
        </>
      ),
    },
    {
      heading: "Scripts and your offer",
      body: (
        <>
          <p>
            Every few reels, connect the topic to how you coach. A reel about protein at breakfast
            can end by mentioning that it's one of the first things you set up with new clients.
            Keep the main content useful on its own; a short mention of your coaching at the end
            feels natural rather than salesy.
          </p>
        </>
      ),
    },
    {
      heading: "A checklist before you film",
      body: (
        <>
          <ol>
            <li>Does the hook work in under three seconds?</li>
            <li>Is there one clear point?</li>
            <li>Is the proof real and specific?</li>
            <li>Is there one clear ask?</li>
            <li>Does it read in about 30 seconds?</li>
          </ol>
          <p>Five yeses, and you're ready to press record.</p>
        </>
      ),
    },
    {
      heading: "Learning from your best reels",
      body: (
        <>
          <p>
            Look at the reels people watched to the end and saved. Which pattern did they use? How
            specific was the number? How quickly did the point arrive? Use those answers to choose
            inputs for your next scripts. Over time, the generator becomes a quick way to produce
            more of what already works for your audience.
          </p>
        </>
      ),
    },
    {
      heading: "Scripts for in-person trainers",
      body: (
        <>
          <p>
            In-person trainers can film reels between sessions or at quiet times in the gym. Use the
            gym as the backdrop, film a client's form with permission, or record yourself explaining
            a tip by the rack. The same four-part structure works; the setting simply adds
            authenticity and shows local followers where you coach.
          </p>
        </>
      ),
    },
    {
      heading: "When to use the warm tone",
      body: (
        <>
          <p>
            Warm scripts add reassurance, such as 'You don't need to get it perfect.' They suit
            topics where viewers might feel guilty or anxious: weekend eating, missed sessions, slow
            progress. Direct scripts suit practical tips and corrections. Dry scripts suit light
            topics where a little humour helps the point land.
          </p>
        </>
      ),
    },
    {
      heading: "Scripts for group programmes",
      body: (
        <>
          <p>
            If you run a group programme, reels can show what it's like inside: a weekly tip you
            give the group, a common question members ask, a result a member is happy to share. Keep
            the structure the same, and end with an ask that points to your next intake or a waiting
            list.
          </p>
        </>
      ),
    },
    {
      heading: "Building confidence on camera",
      body: (
        <>
          <p>
            Many coaches avoid reels because they feel awkward on camera. Scripts help, because you
            know exactly what to say. Start with short, simple patterns such as 'one thing to do
            today', film a few practice takes you don't post, and remember that viewers care far
            more about useful content than polished delivery.
          </p>
        </>
      ),
    },
    {
      heading: "Script length for different platforms",
      body: (
        <>
          <p>
            Thirty seconds suits Instagram reels, TikTok and YouTube Shorts well. Some platforms
            favour slightly shorter videos for discovery, so test 20 to 25-second versions by
            trimming the point section. The four-part structure still works; each part simply gets a
            little shorter.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping a script library",
      body: (
        <>
          <p>
            Save scripts that performed well in a simple document grouped by topic. When a topic
            comes round again, such as New Year goals or summer travel, revisit those scripts,
            update the numbers and examples, and film a fresh version.
          </p>
        </>
      ),
    },
    {
      heading: "One idea per reel",
      body: (
        <>
          <p>
            If a script tries to cover two ideas, split it into two reels. Each will be clearer, and
            you'll have twice the content.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use this result with ChatGPT",
    whenToUse: "When you want a model to draft more scripts from your details.",
    pasteIn: "Copy the full prompt from the generator, or use this shorter version.",
    text: `Write three 30-second talking-head reel scripts for my fitness coaching account. Topic: [topic]. Audience: [audience]. The one point: [point]. One real number or client question: [number]. Tone: [tone]. Split each into hook (0–3 s), point (3–20 s), proof (20–25 s) and ask (25–30 s), about 75 spoken words in total. No 'stop doing this', no 'unpopular opinion', no 'it's not X, it's Y', no emoji. Show the word count for each.`,
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
    { label: "Instagram caption generator", href: "/tools/instagram-caption-generator" },
    { label: "AI writing checker", href: "/tools/ai-writing-checker" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How long should a 30-second reel script be?",
      a: "Roughly 75 words when spoken at a relaxed, natural speed.",
    },
    {
      q: "What should go in the first three seconds?",
      a: "A specific hook that sets up the topic, such as a number, a question or a short scene.",
    },
    {
      q: "Should I read the script word for word?",
      a: "Read it a few times, then talk it naturally. Viewers respond to a conversational delivery.",
    },
    { q: "Do I need captions on reels?", a: "Yes, ideally. Many people watch without sound." },
    {
      q: "How often should I post reels?",
      a: "Consistency matters more than volume. Two or three a week is a sustainable start for many coaches.",
    },
    {
      q: "Can I use the scripts for TikTok or YouTube Shorts?",
      a: "Yes. The same structure works for most short-form video platforms.",
    },
    { q: "Is anything I type stored?", a: "No. Everything runs in your browser." },
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
