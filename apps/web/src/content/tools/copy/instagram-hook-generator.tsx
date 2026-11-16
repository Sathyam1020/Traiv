import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Instagram hook generator for fitness coaches",
  description:
    "Get forty reel and post hooks from one topic across ten patterns, with a quick score sheet for each, built for fitness coaches.",
  eyebrow: "Free tool · Content for coaches",
  h1: "Instagram hook generator for fitness coaches",
  intro: (
    <>
      <p>
        Give the topic, the audience, a real figure from your coaching and a question a client put
        to you recently, then choose where the hook will appear. You'll get forty hooks across ten
        patterns, each with a copy button and a five-point score sheet to check before you film. Or
        copy a ChatGPT prompt for a hundred more. Nothing you type leaves this page.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What makes a good hook for fitness content?",
    answer: (
      <>
        <p>
          A good hook is specific, creates tension or curiosity, hints at what the viewer will get,
          works both spoken and on screen, and is short, ideally eight words or fewer. 'Up 2 kg
          overnight. Not fat.' does all five. Avoid tired formulas such as 'Stop doing this' and
          'Unpopular opinion'.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why hooks matter",
      body: (
        <>
          <p>
            On reels and short videos, most viewers decide within the first second or two whether to
            keep watching. On carousels and captions, the first line decides whether they swipe or
            tap 'more'. A strong hook doesn't guarantee a post does well, but a weak one almost
            guarantees it doesn't.
          </p>
          <p>
            Hooks are also where generic content is most obvious. Many coaching accounts use the
            same openers, so a hook built from your own topic, number and client question
            immediately stands out.
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
              <strong>Topic:</strong> a short phrase, three to five words, such as rest-day weight
              jumps.
            </li>
            <li>
              <strong>Audience:</strong> who it's for, such as women over 40 who lift.
            </li>
            <li>
              <strong>One number:</strong> something real from your coaching, such as 2 kg.
            </li>
            <li>
              <strong>One client question:</strong> in their words, such as 'Why did I gain 2 kg
              overnight?'
            </li>
          </ul>
          <p>Real numbers and real questions make hooks feel specific and trustworthy.</p>
        </>
      ),
    },
    {
      heading: "Ten patterns",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Pattern</th>
                  <th scope="col">Example shape</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lead with a number</td>
                  <td>2 kg. Here's what it means.</td>
                </tr>
                <tr>
                  <td>Admit a mistake</td>
                  <td>I got this wrong for years.</td>
                </tr>
                <tr>
                  <td>Answer their question</td>
                  <td>"Why did I gain 2 kg?" Good question.</td>
                </tr>
                <tr>
                  <td>Set the scene</td>
                  <td>Monday, 7am, a client's message.</td>
                </tr>
                <tr>
                  <td>Flag a risk</td>
                  <td>Before you change this, check this.</td>
                </tr>
                <tr>
                  <td>Say it short</td>
                  <td>Rest days. Simplified.</td>
                </tr>
                <tr>
                  <td>State the plain truth</td>
                  <td>This is simpler than you've been told.</td>
                </tr>
                <tr>
                  <td>Two sides</td>
                  <td>One client nailed it. One didn't.</td>
                </tr>
                <tr>
                  <td>Promise, with a condition</td>
                  <td>Fix it in a month, if you start small.</td>
                </tr>
                <tr>
                  <td>What I tell clients</td>
                  <td>What I tell every client about this.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Each pattern gives four hooks, forty in total. Patterns that suit your chosen format are
            marked.
          </p>
        </>
      ),
    },
    {
      heading: "Matching hooks to format",
      body: (
        <>
          <p>
            Reels and stories need hooks that work spoken in the first second and as on-screen text.
            Carousels need a first slide that makes people swipe. Captions need a first line that
            earns the tap on 'more'. Some patterns, such as setting the scene, work best on video;
            others, such as stating the plain truth, work well on carousels. The generator marks
            which patterns suit the format you pick.
          </p>
        </>
      ),
    },
    {
      heading: "The five-point score sheet",
      body: (
        <>
          <ol>
            <li>
              <strong>Specific:</strong> does it include a real number, moment or detail?
            </li>
            <li>
              <strong>Tension:</strong> does it create curiosity or a question in the viewer's mind?
            </li>
            <li>
              <strong>Promise:</strong> does it hint at what they'll get?
            </li>
            <li>
              <strong>Spoken and on screen:</strong> does it work both ways?
            </li>
            <li>
              <strong>Short:</strong> eight words or fewer? The tool counts this for you.
            </li>
          </ol>
          <p>
            Tick the boxes before you film. Hooks scoring 4 or 5 are worth using; below 3, try
            another.
          </p>
        </>
      ),
    },
    {
      heading: "Leading with a number",
      body: (
        <>
          <p>
            Numbers stop the scroll because they're specific and concrete. '2 kg up overnight' is
            more arresting than 'weight fluctuations'. Use real numbers from your coaching: a
            client's result, a common mistake, a target you set. Never invent numbers.
          </p>
        </>
      ),
    },
    {
      heading: "Admitting a mistake",
      body: (
        <>
          <p>
            Confession hooks, such as 'I got this wrong for years', build trust because they're
            honest and human. They work best when followed by a specific lesson. Use them sparingly;
            a feed full of confessions loses its effect.
          </p>
        </>
      ),
    },
    {
      heading: "Answering their question",
      body: (
        <>
          <p>
            Using a real client question, in their words, is one of the most effective hooks,
            because other viewers have often wondered the same thing. It also shows that you listen
            to clients. Ask clients if you can use their questions anonymously.
          </p>
        </>
      ),
    },
    {
      heading: "Setting the scene",
      body: (
        <>
          <p>
            Scene hooks, such as 'Monday, 7am, a client's message about rest days', pull viewers
            into a moment. They work particularly well for talking-head videos and stories.
          </p>
        </>
      ),
    },
    {
      heading: "Flagging a risk",
      body: (
        <>
          <p>
            Risk hooks warn viewers about a common mistake. They're effective because people want to
            avoid losing progress. Keep them calm and helpful rather than alarmist.
          </p>
        </>
      ),
    },
    {
      heading: "Short, plain and two-sided hooks",
      body: (
        <>
          <p>
            Very short hooks, such as 'Rest days. Simplified.', work well as on-screen text.
            Plain-truth hooks cut through confusion. Two-sided hooks, comparing two clients or two
            outcomes, create natural curiosity about the difference.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks to avoid",
      body: (
        <>
          <p>
            Some hooks have been overused to the point that viewers scroll past them on sight: 'Stop
            doing this', 'Unpopular opinion', 'It's not X, it's Y', 'Nobody talks about this', and
            openers stacked with emoji or multiple questions. The generator avoids these. If your
            hook sounds like something you've seen a hundred times, it probably has been.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            With the default inputs, rest-day weight jumps, women over 40 who lift, 2 kg, and the
            question 'Why did I gain 2 kg overnight?', the generator produces hooks such as '2 kg.
            Here's what it means for rest-day weight jumps.', 'I got rest-day weight jumps wrong for
            years.', '"Why did I gain 2 kg overnight?" Good question.' and 'Monday, 7am, a client's
            message about rest-day weight jumps.' Each is specific, short and tied to a real number
            or question.
          </p>
        </>
      ),
    },
    {
      heading: "Writing your own hooks",
      body: (
        <>
          <p>
            The patterns work as a template for writing hooks by hand. Pick a pattern, add your
            specific detail and cut it to eight words or fewer. 'Lead with a number' becomes 'Down 4
            cm, same weight.' 'Admit a mistake' becomes 'I used to cut carbs for every client.' With
            practice, you'll write hooks in seconds.
          </p>
        </>
      ),
    },
    {
      heading: "Testing hooks",
      body: (
        <>
          <p>
            The best way to find out which hooks work for your audience is to test them. Post
            similar content with different hooks and compare how long people watch, how many save
            and how many share. Over a few weeks, you'll see which patterns your audience responds
            to. Keep notes so you can repeat what works.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks for reels",
      body: (
        <>
          <p>
            For reels, the hook has two jobs: what you say in the first second and what appears as
            text on screen. They don't have to be identical, but they should match. A strong spoken
            hook with a weak on-screen hook, or the other way round, loses viewers who watch without
            sound or who only read the text.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks for carousels",
      body: (
        <>
          <p>
            On a carousel, the first slide is the hook. It needs to make people swipe. Large, clear
            text with a specific promise or question works well: 'The 2 kg rule', 'Why your weight
            jumps after rest days', '3 fixes for stalled squats'. The rest of the carousel delivers
            on the promise.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks for captions and stories",
      body: (
        <>
          <p>
            For captions, the hook is the first line shown before 'more'. For stories, it's the
            first frame. Both need to be immediately clear. Stories are casual, so short scene or
            question hooks often work best. Caption hooks should be specific statements rather than
            questions, which tend to be scrolled past.
          </p>
        </>
      ),
    },
    {
      heading: "Using the score sheet",
      body: (
        <>
          <p>
            Score hooks honestly. Is it specific, or could any coach have written it? Does it create
            tension, or is it just a statement? Does it promise something useful? Would it work both
            spoken and as text? Is it short? Five ticks is rare; four is strong. The word count is
            checked automatically, so you can focus on the other four.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks and honesty",
      body: (
        <>
          <p>
            A hook should promise something the content delivers. Clickbait hooks that overpromise,
            such as 'This one trick melts belly fat', might get views, but they lose trust and
            followers when the content doesn't match. Specific, honest hooks build an audience that
            believes what you say.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping a hook bank",
      body: (
        <>
          <p>
            Copy the hooks you like into a note and add to it each week. When you're short of ideas,
            the bank gives you a starting point for new content. Group them by topic so you can find
            the right hook quickly when filming.
          </p>
        </>
      ),
    },
    {
      heading: "Matching hooks to your audience",
      body: (
        <>
          <p>
            The same topic needs different hooks for different audiences. 'Rest-day weight jumps'
            for women over 40 might focus on hormonal and water changes; for young male lifters, it
            might focus on carbohydrate and training. Fill in the audience field carefully, and edit
            hooks so they speak directly to the people you want to reach.
          </p>
        </>
      ),
    },
    {
      heading: "Common hook mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Too vague:</strong> 'Fitness tips' gives no reason to keep watching.
            </li>
            <li>
              <strong>Too long:</strong> hooks over ten words lose people before they finish.
            </li>
            <li>
              <strong>Overused formulas:</strong> 'Stop doing this' and 'Unpopular opinion' are
              scrolled past.
            </li>
            <li>
              <strong>Questions stacked on questions:</strong> one question at most.
            </li>
            <li>
              <strong>Overpromising:</strong> a hook the content can't deliver on damages trust.
            </li>
          </ul>
          <p>Avoiding these puts your hooks ahead of most fitness content.</p>
        </>
      ),
    },
    {
      heading: "From hook to full post",
      body: (
        <>
          <p>
            Once you have a strong hook, the rest of the content follows: the point, the proof and
            the ask. The reel script generator builds a full 30-second script around a hook, and the
            caption generator builds captions with a strong first line. Use them together to turn
            one idea into several posts.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks and the 100-hook prompt",
      body: (
        <>
          <p>
            If forty hooks aren't enough, copy the 100-hook prompt and paste it into ChatGPT or a
            similar tool. It includes your topic, audience, number and question, the ten patterns
            and the rules. Ask the AI to mark its strongest ten and explain why. Then score your
            favourites with the score sheet before filming.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks for different niches",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Niche</th>
                  <th scope="col">Topic</th>
                  <th scope="col">Example hook</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fat loss</td>
                  <td>weekend eating</td>
                  <td>Saturday undid Monday to Friday.</td>
                </tr>
                <tr>
                  <td>Strength</td>
                  <td>stalled squats</td>
                  <td>Same squat for six weeks. Here's why.</td>
                </tr>
                <tr>
                  <td>Running</td>
                  <td>easy runs</td>
                  <td>Your easy run is too fast.</td>
                </tr>
                <tr>
                  <td>Older adults</td>
                  <td>balance training</td>
                  <td>Ten seconds on one leg. Try it.</td>
                </tr>
                <tr>
                  <td>Nutrition</td>
                  <td>protein at breakfast</td>
                  <td>30 g by 9am changes the afternoon.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>These are examples; use topics and numbers from your own coaching.</p>
        </>
      ),
    },
    {
      heading: "The first second of a reel",
      body: (
        <>
          <p>
            Viewers decide almost immediately. Start talking in the first frame, put the hook on
            screen at the same time, and make the first words the most interesting ones. 'So I
            wanted to talk about…' wastes the most valuable second of the video. Cut straight to the
            hook.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks and thumbnails",
      body: (
        <>
          <p>
            On your profile grid, the cover of a reel acts as a hook too. Use a clear frame with the
            hook as large text, so visitors browsing your profile can see what each reel is about.
            Consistent cover styling makes your profile look organised and encourages people to
            watch more.
          </p>
        </>
      ),
    },
    {
      heading: "Questions as hooks",
      body: (
        <>
          <p>
            Real client questions make excellent hooks, but rhetorical questions usually don't. 'Why
            did I gain 2 kg overnight?' in a client's words feels genuine. 'Are you tired of
            plateaus?' feels like an advert. Use questions people actually ask you, and answer them
            quickly.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks and series",
      body: (
        <>
          <p>
            If you create a series, such as a weekly myth-busting reel, use a consistent hook format
            so followers recognise it: 'Myth of the week:' or 'Client question:'. Recognisable
            formats build habit, and followers start looking out for them.
          </p>
        </>
      ),
    },
    {
      heading: "Writing hooks for carousels",
      body: (
        <>
          <p>
            Carousel hooks can be slightly longer than video hooks, because people can read at their
            own pace, but they still need to be clear in a glance. Pair a short headline with a
            smaller subheading if needed: 'The 2 kg rule' with 'Why your weight jumps after rest
            days'. The first slide should make the reader want the second.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks that age well",
      body: (
        <>
          <p>
            Trend-based hooks can work briefly, but specific, useful hooks keep working. A hook like
            'Up 2 kg overnight. Not fat.' will be just as relevant next year. Building a library of
            evergreen hooks and content means older posts keep bringing in viewers long after you
            publish them.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Choose one topic you get asked about often. Run the generator, score your top five hooks
            and film three short reels using the three highest-scoring ones. Compare how they
            perform, and use what you learn to shape next week's hooks.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks that start conversations",
      body: (
        <>
          <p>
            Some hooks invite comments naturally: a real client question, a surprising number or a
            gentle challenge to a common belief. Pair them with a clear ask at the end of the
            content, such as inviting viewers to share their own experience. Comments signal that
            the content resonated, and replying to them builds relationships with potential clients.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks for live and stories",
      body: (
        <>
          <p>
            Stories and lives benefit from casual, conversational hooks: 'Quick one from today's
            sessions', 'A client asked me this an hour ago', 'Two minutes on rest days'. They should
            feel immediate. Use the scene and question patterns most here, and keep the tone
            relaxed.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring hook strength",
      body: (
        <>
          <p>
            For reels, look at the share of viewers who keep watching after the first three seconds.
            For carousels, look at how many swipe past the first slide. For captions, look at how
            many tap 'more' or engage. Compare these across hooks to see which patterns your
            audience responds to most.
          </p>
        </>
      ),
    },
    {
      heading: "Avoiding clickbait",
      body: (
        <>
          <p>
            There's a difference between a hook that creates curiosity and one that misleads. 'Up 2
            kg overnight. Not fat.' creates curiosity and is answered by the content. 'The one food
            destroying your progress' misleads, because there rarely is one. Honest curiosity builds
            a loyal audience; clickbait builds disappointed viewers.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks in other languages",
      body: (
        <>
          <p>
            If you create content in another language, the patterns still work, but translate the
            meaning rather than the words. Short, specific and honest hooks are effective in any
            language. Ask a native speaker to check hooks if you're writing in a second language.
          </p>
        </>
      ),
    },
    {
      heading: "Combining tools",
      body: (
        <>
          <p>
            Use the hook generator to find the opening, the reel script generator to write the
            30-second script around it and the caption generator for the caption. Run the final text
            through the AI writing checker. Together, they take one idea from blank page to finished
            post in a few minutes.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy and client questions",
      body: (
        <>
          <p>
            When using a client's question as a hook, remove anything that could identify them:
            their name, location, job or unusual details. Many coaches ask clients in advance
            whether they're happy for anonymous questions to be used in content. Most are, and some
            enjoy seeing their question help others.
          </p>
        </>
      ),
    },
    {
      heading: "Writing hooks for your own voice",
      body: (
        <>
          <p>
            The generated hooks are starting points. Rewrite them in the way you'd actually say
            them. If you'd never say 'Here's what it means', change it to how you would. A hook
            delivered naturally on camera is far more convincing than a perfectly worded one you
            stumble over.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks across a content week",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Pattern</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monday</td>
                  <td>Lead with a number</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>Answer their question</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>What I tell clients</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>Flag a risk</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>Two sides</td>
                </tr>
                <tr>
                  <td>Weekend</td>
                  <td>Set the scene</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Using different patterns through the week keeps your content fresh while staying on the
            same topic.
          </p>
        </>
      ),
    },
    {
      heading: "How many hooks to try",
      body: (
        <>
          <p>
            For an important piece of content, write or generate at least ten hooks, score them and
            pick the best. Professional content creators often write many more options than they
            use. The first idea is rarely the strongest, and comparing several makes the best one
            obvious.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The generator runs in your browser. Your topic, numbers and client questions aren't
            stored or sent anywhere.
          </p>
        </>
      ),
    },
    {
      heading: "Hook formulas versus patterns",
      body: (
        <>
          <p>
            Formulas are fixed phrases, such as 'Stop doing this' or 'Nobody talks about this',
            copied across thousands of accounts. Patterns are structures you fill with your own
            specifics, such as leading with a real number or answering a real question. Formulas
            wear out because everyone uses the same words. Patterns stay fresh because the words are
            always yours.
          </p>
        </>
      ),
    },
    {
      heading: "A checklist before you film",
      body: (
        <>
          <ol>
            <li>Is the hook under eight words?</li>
            <li>Does it contain something specific: a number, a question, a moment?</li>
            <li>Does it make the viewer curious about what comes next?</li>
            <li>Can you say it naturally in one breath?</li>
            <li>Does the rest of the content deliver on it?</li>
          </ol>
          <p>If you can answer yes to all five, start filming.</p>
        </>
      ),
    },
    {
      heading: "Hooks for client results",
      body: (
        <>
          <p>
            When sharing a client result, the hook can lead with the number and the timeframe: 'Down
            6 cm in eight weeks. Same weight.' Always get written permission, avoid identifying
            details unless agreed, and don't present one client's result as typical. A specific,
            honest result is a powerful hook on its own.
          </p>
        </>
      ),
    },
    {
      heading: "Getting unstuck",
      body: (
        <>
          <p>
            If you're stuck for hooks, change one input. A different number, a different audience or
            a different client question produces a completely new set. Running the generator three
            times with three numbers from the same topic often gives more than enough options for a
            month of content.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks and your niche",
      body: (
        <>
          <p>
            The more specific your niche, the easier hooks become. 'Women over 40 who lift' gives
            you a clear person to speak to, with specific questions and concerns. 'Everyone who
            wants to get fit' gives you nothing to grab. If hooks feel generic, try narrowing the
            audience field, even for one batch, and see how much sharper they get.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping hooks consistent with your brand",
      body: (
        <>
          <p>
            Your hooks set expectations for your whole account. If your coaching is calm and
            evidence-based, alarmist hooks will attract the wrong audience and confuse the right
            one. Choose patterns that match how you coach: plain truth and what-I-tell-clients hooks
            for a calm brand, two-sides and risk hooks for a more direct one.
          </p>
        </>
      ),
    },
    {
      heading: "Re-using strong hooks",
      body: (
        <>
          <p>
            A hook that worked once can work again with new content months later, especially for new
            followers who never saw the original. Keep a record of your strongest hooks and revisit
            them with updated examples or numbers. Evergreen topics, such as weight fluctuations or
            protein, are always being searched for by someone new.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks for educational carousels",
      body: (
        <>
          <p>
            Educational carousels, such as how-to guides or myth explainers, benefit from hooks that
            promise a clear payoff: 'The 3-step warm-up I give every client', 'What 2 kg overnight
            actually means'. The promise tells readers exactly what they'll learn by swiping.
            Deliver it in the slides, and end with a slide that sums up the point and makes the ask.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Pick one topic and run the generator. Copy your ten favourite hooks into a note, score
            them and choose three. Film or design three pieces of content using those hooks, post
            them across the week, and note which one viewers stayed with longest. Next week, write
            more hooks in that pattern.
          </p>
        </>
      ),
    },
    {
      heading: "Hooks and pacing",
      body: (
        <>
          <p>
            After the hook, the next line has to keep the promise moving. A strong hook followed by
            a slow second sentence loses viewers almost as quickly as a weak hook. Plan the first
            two lines together: the hook creates the question, and the second line starts answering
            it.
          </p>
        </>
      ),
    },
    {
      heading: "The goal of a hook",
      body: (
        <>
          <p>
            A hook's only job is to earn the next few seconds of attention. It doesn't need to
            explain everything or sell anything. Keep it short, specific and honest, and let the
            content do the rest.
          </p>
        </>
      ),
    },
    {
      heading: "Simple beats clever",
      body: (
        <>
          <p>
            When choosing between a clever hook and a clear one, pick the clear one. Viewers decide
            in a moment, and clarity wins that moment far more often than wordplay.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Use this result with ChatGPT",
    whenToUse: "When you want more hooks than the forty on the page.",
    pasteIn: "Copy the 100-hook prompt from the generator, or use this shorter version.",
    text: `Write 30 short hooks for [format] content on my fitness coaching account. Topic: [topic]. Audience: [audience]. A real number: [number]. A real client question: [question]. Use ten patterns: number first, a mistake I made, their question, a scene, a risk, very short, plain truth, two sides, a promise with a condition, what I tell clients. Under 10 words each, specific, no 'stop doing this', no 'unpopular opinion', no 'it's not X, it's Y', no emoji. Mark your five strongest.`,
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
    { label: "Reel script generator", href: "/tools/reel-script-generator" },
    { label: "Instagram caption generator", href: "/tools/instagram-caption-generator" },
    { label: "AI writing checker", href: "/tools/ai-writing-checker" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How long should a hook be?",
      a: "Ideally eight words or fewer, so it works on screen and can be said in a second or two.",
    },
    {
      q: "Do hooks work for carousels and captions too?",
      a: "Yes. The first slide or first line does the same job as a video hook.",
    },
    {
      q: "Can I use client questions?",
      a: "Yes, anonymously and ideally with permission. Real questions make strong hooks.",
    },
    {
      q: "Why avoid 'Stop doing this'?",
      a: "It's been used so often that many viewers scroll past it automatically.",
    },
    {
      q: "How do I test hooks?",
      a: "Try different hooks on similar content and compare watch time, saves and shares.",
    },
    {
      q: "What's the 100-hook prompt?",
      a: "A ChatGPT prompt with your details filled in, asking for a hundred hooks across the ten patterns.",
    },
    { q: "Is anything stored?", a: "No. Everything runs in your browser." },
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
