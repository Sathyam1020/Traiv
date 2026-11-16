import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Personal trainer bio generator for Instagram",
  description:
    "Get eight Instagram bio options for a personal trainer or online coach from who you help, the outcome, your method and a call to action, each within 150 characters.",
  eyebrow: "Free tool · Marketing",
  h1: "Personal trainer bio generator",
  intro: (
    <>
      <p>
        Add who you help, the result you deliver, your method and a call to action, and get eight
        Instagram bio options in different layouts. Every option fits inside the 150 characters
        Instagram allows, and each shows how many characters it uses. Fill in as much or as little
        as you like and refine from there. Nothing is stored.
      </p>
    </>
  ),
  shortAnswer: {
    question: "What makes a good personal trainer bio on Instagram?",
    answer: (
      <>
        <p>
          Who you help, the outcome you deliver, how you do it and what to do next. 'I help busy
          parents lose fat without crash diets. Custom training and weekly check-ins. Start below.'
          fits comfortably within 150 characters and tells a visitor in seconds whether you're the
          right coach for them.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why your bio matters",
      body: (
        <>
          <p>
            Your bio is often the first thing a potential client reads after finding one of your
            posts. In a few seconds, they decide whether to follow, tap your link or move on. A
            clear bio answers three questions instantly: who is this for, what will I get and what
            should I do next. A vague bio, such as 'Fitness coach | Living my best life', answers
            none of them.
          </p>
          <p>
            Because the space is so small, every word has to earn its place. The generator helps you
            try different layouts quickly and see which reads best within the limit.
          </p>
        </>
      ),
    },
    {
      heading: "The four parts of a coaching bio",
      body: (
        <>
          <ul>
            <li>
              <strong>Who you help:</strong> a specific audience, such as busy parents, women over
              40 or new lifters.
            </li>
            <li>
              <strong>The outcome:</strong> what changes for them, such as losing fat without crash
              diets or getting strong in three sessions a week.
            </li>
            <li>
              <strong>Your method:</strong> what makes your coaching different, such as custom
              training and weekly check-ins.
            </li>
            <li>
              <strong>The call to action:</strong> what to do next, such as tapping the link,
              sending a DM keyword or getting a free guide.
            </li>
          </ul>
          <p>
            An optional proof point, such as years of experience or a qualification, adds
            credibility. The generator uses it exactly as you type it and never invents numbers or
            credentials.
          </p>
        </>
      ),
    },
    {
      heading: "Eight layouts",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Layout</th>
                  <th scope="col">How it reads</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Four-line stack</td>
                  <td>Who, outcome, method and call to action on separate lines</td>
                </tr>
                <tr>
                  <td>Result first</td>
                  <td>Leads with what you deliver</td>
                </tr>
                <tr>
                  <td>Single line</td>
                  <td>Compact, with separators</td>
                </tr>
                <tr>
                  <td>Proof on top</td>
                  <td>Credibility and method first</td>
                </tr>
                <tr>
                  <td>Reader question</td>
                  <td>Opens with the question your reader is asking</td>
                </tr>
                <tr>
                  <td>Quiet and clean</td>
                  <td>Three calm lines, no symbols</td>
                </tr>
                <tr>
                  <td>Credential lead</td>
                  <td>Your proof carries the first line</td>
                </tr>
                <tr>
                  <td>Point to the link</td>
                  <td>A short header with an arrow to the link</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Different layouts suit different styles. A premium coach may prefer quiet and clean; a
            direct coach may prefer the four-line stack.
          </p>
        </>
      ),
    },
    {
      heading: "The 150-character limit",
      body: (
        <>
          <p>
            Instagram bios are limited to 150 characters, including spaces, line breaks and symbols.
            The generator shows a live count for each option and trims anything that runs over. If
            an option is close to the limit, shortening the audience or outcome usually helps more
            than removing the call to action.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a call to action",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Call to action</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Link click</td>
                  <td>Sending people to a booking page, application or sales page</td>
                </tr>
                <tr>
                  <td>DM keyword</td>
                  <td>Starting a conversation, such as 'DM START to apply'</td>
                </tr>
                <tr>
                  <td>Lead magnet</td>
                  <td>Growing an email list with a free guide or plan</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Pick one. Several competing calls to action make it harder for visitors to act.</p>
        </>
      ),
    },
    {
      heading: "Choosing a tone",
      body: (
        <>
          <p>
            Direct bios start with 'I help', which is clear and confident. Friendly bios start with
            'Helping', which feels warmer and more conversational. Premium bios start with 'Coaching
            for', which sounds more exclusive. Choose the tone that matches your brand and your
            price point.
          </p>
        </>
      ),
    },
    {
      heading: "Writing a specific audience",
      body: (
        <>
          <p>
            The more specific your audience, the stronger your bio. 'Women' is broad; 'women over 40
            who want to lift' is clear. A specific audience helps the right people recognise
            themselves immediately, and it helps everyone else move on, which saves both of you
            time.
          </p>
        </>
      ),
    },
    {
      heading: "Writing a believable outcome",
      body: (
        <>
          <p>
            The outcome should be something your clients actually achieve, described in their terms.
            'Lose fat without crash diets', 'get strong in three sessions a week' and 'run your
            first 10K' are specific and believable. Avoid exaggerated promises, such as 'transform
            your body in 30 days', which attract the wrong clients and erode trust.
          </p>
        </>
      ),
    },
    {
      heading: "Using proof responsibly",
      body: (
        <>
          <p>
            A proof point can be a qualification, years of experience, a number of clients coached
            or a notable result. Use only what's true and verifiable. The generator uses your proof
            exactly as you type it, so check it carefully before posting.
          </p>
        </>
      ),
    },
    {
      heading: "Beyond the bio",
      body: (
        <>
          <p>
            Your bio works together with your profile picture, name field, highlights and pinned
            posts. Use a clear, friendly photo, put your niche in the name field if it fits, and pin
            posts that show results, your method and how to work with you. Together, they make your
            profile a small, effective sales page.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            With the defaults, busy parents, lose fat without crash diets, custom training and
            weekly check-ins, a link call to action and a direct tone, the four-line stack reads: 'I
            help busy parents / Lose fat without crash diets / Custom training + weekly check-ins /
            Start below ↓'. It comes to just under 100 characters, leaving room for a proof point if
            you have one. The result-first layout opens with 'Lose fat without crash diets, for busy
            parents.' instead.
          </p>
        </>
      ),
    },
    {
      heading: "Bios for different niches",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Niche</th>
                  <th scope="col">Who</th>
                  <th scope="col">Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Strength for women</td>
                  <td>women over 40</td>
                  <td>get strong and protect your bones</td>
                </tr>
                <tr>
                  <td>Online fat loss</td>
                  <td>busy professionals</td>
                  <td>lose fat around a full-time job</td>
                </tr>
                <tr>
                  <td>Running</td>
                  <td>new runners</td>
                  <td>run your first 10K without injury</td>
                </tr>
                <tr>
                  <td>Postnatal</td>
                  <td>new mums cleared to train</td>
                  <td>rebuild strength after pregnancy</td>
                </tr>
                <tr>
                  <td>Older adults</td>
                  <td>adults over 60</td>
                  <td>stay strong and independent</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Specific audiences and outcomes like these make a bio instantly clear to the right
            people.
          </p>
        </>
      ),
    },
    {
      heading: "Testing your bio",
      body: (
        <>
          <p>
            Change your bio and watch what happens over a few weeks: profile visits that turn into
            follows, link taps and enquiries. Instagram's insights show profile activity. If a new
            bio brings more link taps or messages, keep it. If not, try another layout or a sharper
            outcome. Small changes to the first line often make the biggest difference.
          </p>
        </>
      ),
    },
    {
      heading: "Bios on other platforms",
      body: (
        <>
          <p>
            The same structure works on TikTok, YouTube, Threads and Facebook, though character
            limits differ. LinkedIn headlines can be longer and more professional. Keep the core
            message, who you help, the outcome and your method, consistent across platforms so
            people recognise you wherever they find you.
          </p>
        </>
      ),
    },
    {
      heading: "Your name field",
      body: (
        <>
          <p>
            On Instagram, the name field is searchable. Adding a short keyword, such as 'Strength
            coach' or 'Online PT', alongside your name helps people searching for coaches find you.
            Keep it natural; stuffing keywords looks spammy.
          </p>
        </>
      ),
    },
    {
      heading: "Your profile link",
      body: (
        <>
          <p>
            The call to action only works if the link leads somewhere useful. Point it at a booking
            page, an application form, a free guide or a simple page listing your options. Make sure
            it loads quickly on a phone and that the first thing visitors see matches what your bio
            promised.
          </p>
        </>
      ),
    },
    {
      heading: "Common bio mistakes",
      body: (
        <>
          <ul>
            <li>
              <strong>Being vague:</strong> 'Fitness coach | Healthy living' tells visitors nothing.
            </li>
            <li>
              <strong>Listing every qualification:</strong> pick the one that matters most to
              clients.
            </li>
            <li>
              <strong>No call to action:</strong> visitors don't know what to do next.
            </li>
            <li>
              <strong>Several calls to action:</strong> one is clearer.
            </li>
            <li>
              <strong>Exaggerated promises:</strong> they attract the wrong clients and damage
              trust.
            </li>
            <li>
              <strong>Too many emoji:</strong> they crowd out the message.
            </li>
          </ul>
          <p>The generator avoids these by design.</p>
        </>
      ),
    },
    {
      heading: "Writing your method",
      body: (
        <>
          <p>
            Your method is what makes your coaching different: custom training and weekly check-ins,
            strength-first programmes, food without restriction, coaching built around shift work.
            Choose one or two things that matter most to your clients, in plain language. Avoid
            jargon such as 'holistic transformation', which says little.
          </p>
        </>
      ),
    },
    {
      heading: "Premium positioning",
      body: (
        <>
          <p>
            If you charge premium prices, your bio should feel calm and confident rather than busy.
            The quiet and clean layout, with a premium tone, uses fewer symbols and fewer words. A
            strong proof point, such as years of experience or a specialist qualification, supports
            the premium position.
          </p>
        </>
      ),
    },
    {
      heading: "When to update your bio",
      body: (
        <>
          <p>
            Update your bio when your offer changes, when you launch something new, when you open or
            close spaces, or when you narrow your niche. A seasonal call to action, such as a
            January intake or a summer programme, keeps the bio current and gives followers a reason
            to act now.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Fill in the four fields, pick the two layouts you like best and try one for two weeks,
            then the other. Compare profile visits, link taps and messages. Keep the winner, and
            revisit it when your offer changes.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>The generator runs in your browser. Nothing you type is stored or sent anywhere.</p>
        </>
      ),
    },
    {
      heading: "Bios for in-person trainers",
      body: (
        <>
          <p>
            In-person trainers should make location clear: the gym, studio or area you work in.
            Local clients search for coaches nearby, and seeing a familiar place in a bio builds
            trust. Combine location with your niche, such as 'Strength coaching for women in Leeds',
            and a call to action pointing to a booking page or a free consultation.
          </p>
        </>
      ),
    },
    {
      heading: "Bios for online coaches",
      body: (
        <>
          <p>
            Online coaches can reach clients anywhere, so the niche matters even more than location.
            Make it clear you coach online, who you coach and how it works: an app, check-ins,
            custom plans. If you work in a particular time zone or language, saying so helps the
            right clients find you.
          </p>
        </>
      ),
    },
    {
      heading: "Bios for group programmes",
      body: (
        <>
          <p>
            If your main offer is a group programme or challenge, the bio can lead with it: the
            programme name, who it's for, the next start date and a link to join. Update it for each
            intake, so the bio always points to the next opportunity to work with you.
          </p>
        </>
      ),
    },
    {
      heading: "Line breaks and symbols",
      body: (
        <>
          <p>
            Line breaks make bios easier to scan, but they count towards the 150 characters. Simple
            separators, such as a vertical bar or a dot, can fit more into one line. A single arrow
            pointing to the link draws the eye to your call to action. Avoid long strings of symbols
            or emoji, which clutter the space and can be read awkwardly by screen readers.
          </p>
        </>
      ),
    },
    {
      heading: "Matching your bio to your content",
      body: (
        <>
          <p>
            Your bio sets expectations for your posts. If the bio says you help busy parents lose
            fat, most of your content should speak to busy parents and fat loss. When visitors see
            the bio and the posts telling the same story, they're far more likely to follow and
            eventually enquire.
          </p>
        </>
      ),
    },
    {
      heading: "Proof that builds trust",
      body: (
        <>
          <p>
            Good proof points are specific and relevant: '10 years coaching', 'Registered
            physiotherapist', '200+ online clients', 'Pre- and postnatal certified'. Choose the one
            that matters most to your ideal client. A busy parent cares more about results with
            people like them than a long list of courses.
          </p>
        </>
      ),
    },
    {
      heading: "Bios and search",
      body: (
        <>
          <p>
            Instagram search looks at your name field and username more than the bio itself, but a
            clear bio still helps people decide once they find you. Use plain words people would
            actually search for, such as 'personal trainer', 'online coach' or 'strength coach',
            rather than invented terms.
          </p>
        </>
      ),
    },
    {
      heading: "Bio, highlights and pinned posts",
      body: (
        <>
          <p>
            Your bio is only one part of your profile. Story highlights can cover the questions
            visitors ask most: how coaching works, client results, prices or how to apply, and
            frequently asked questions. Pinned posts can show your best client result, a post
            explaining your method and one about working with you. Together with the bio, they let a
            visitor go from curious to ready in a minute.
          </p>
        </>
      ),
    },
    {
      heading: "Writing for a phone screen",
      body: (
        <>
          <p>
            Most people read your bio on a phone, often while scrolling quickly. Short lines, plain
            words and a clear call to action at the end work best. Read your bio on your own phone
            before saving it, and check that nothing important is cut off or awkwardly wrapped.
          </p>
        </>
      ),
    },
    {
      heading: "Consistency across your brand",
      body: (
        <>
          <p>
            Use the same audience, outcome and method in your bio, website headline, email signature
            and discovery call introduction. When the same message appears everywhere, people
            remember it, and referrals become easier: clients can describe exactly what you do.
          </p>
        </>
      ),
    },
    {
      heading: "Bios that convert",
      body: (
        <>
          <p>
            A bio converts when the right person reads it and thinks, 'that's me'. That happens when
            the audience is specific, the outcome is something they want and the method feels
            achievable. A generic bio rarely makes anyone feel that way, however polished it is.
            Specificity is what turns visitors into followers and followers into enquiries.
          </p>
        </>
      ),
    },
    {
      heading: "Using the character count",
      body: (
        <>
          <p>
            The live count beside each option shows how much room is left. If you're under 120
            characters, there may be space for a proof point or a short location. If you're at 148,
            try a shorter word or two rather than cutting the call to action. Clear and complete
            beats packed and cramped.
          </p>
        </>
      ),
    },
    {
      heading: "The first line",
      body: (
        <>
          <p>
            Many visitors read only the first line of a bio. Make it the clearest statement of who
            you help and what changes for them. 'I help busy parents lose fat without crash diets'
            works as a complete message on its own. Everything after it, method, proof and call to
            action, supports that first line.
          </p>
        </>
      ),
    },
    {
      heading: "Questions as openers",
      body: (
        <>
          <p>
            The reader-question layout opens with a question your ideal client is already asking,
            such as 'Want to lose fat without crash diets?' Used once, in a bio, a question can work
            well because it speaks directly to the reader. Keep it specific; a vague question such
            as 'Ready to change your life?' does little.
          </p>
        </>
      ),
    },
    {
      heading: "Bios for coaches with a waiting list",
      body: (
        <>
          <p>
            If you're full, say so. 'Waiting list open, next spaces in March' or 'Applications open'
            signals demand and sets expectations. Link to the waiting list or application form, and
            update the bio when spaces open. Scarcity that's real can encourage serious enquiries;
            scarcity that's invented damages trust.
          </p>
        </>
      ),
    },
    {
      heading: "Reviewing your bio quarterly",
      body: (
        <>
          <p>
            Every few months, reread your bio as if you were a potential client. Is it still
            accurate? Does the outcome still describe what clients achieve? Does the link still go
            to the right place? A quick quarterly review keeps the bio working as your coaching
            evolves.
          </p>
        </>
      ),
    },
    {
      heading: "Bios for specialists",
      body: (
        <>
          <p>
            If you specialise, such as in pre- and postnatal training, rehabilitation after
            clearance, sports performance or older adults, lead with it. Specialists can usually
            charge more and attract clients who are actively searching for that expertise. Include
            the relevant qualification as your proof point, so visitors trust the specialism
            immediately.
          </p>
        </>
      ),
    },
    {
      heading: "A checklist before you save",
      body: (
        <>
          <ol>
            <li>Does the first line say who you help and what changes?</li>
            <li>Is the method clear in plain words?</li>
            <li>Is any proof true and relevant?</li>
            <li>Is there one call to action, and does the link match it?</li>
            <li>Is it under 150 characters and easy to read on a phone?</li>
          </ol>
          <p>
            If all five are yes, save it and leave it for a few weeks before judging the results.
          </p>
        </>
      ),
    },
    {
      heading: "Leaving a field blank",
      body: (
        <>
          <p>
            No field is required. Leave the method blank, and layouts that use it fall back to a
            simple default. Leave proof blank, and layouts that lead with proof start with 'Online
            coach' instead. Try a few combinations to see which fields matter most for your bio; for
            many coaches, a sharp audience and outcome do most of the work.
          </p>
        </>
      ),
    },
    {
      heading: "One bio, then the rest of the profile",
      body: (
        <>
          <p>
            Once your bio is set, make sure the rest of your profile backs it up. If the bio
            promises fat loss without crash diets, your pinned posts and highlights should show
            exactly that. A bio that matches what visitors see next is far more convincing than one
            that promises something the profile doesn't show.
          </p>
        </>
      ),
    },
    {
      heading: "Keep it honest",
      body: (
        <>
          <p>
            Every word in your bio should be true today. If it promises something your coaching
            doesn't yet deliver, change the bio, or change the coaching.
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
    key: "client-app",
    heading: "Deliver what your bio promises",
    body: (
      <>
        <p>
          When someone taps your link and signs up, Traiv gives them the custom training, check-ins
          and chat your bio describes, in an app under your name.
        </p>
      </>
    ),
  },
  next: [
    { label: "Instagram caption generator", href: "/tools/instagram-caption-generator" },
    {
      label: "Personal training business name generator",
      href: "/tools/personal-training-business-name-generator",
    },
    { label: "Coaching offer builder", href: "/tools/coaching-offer-builder" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How long can an Instagram bio be?",
      a: "150 characters, including spaces and line breaks.",
    },
    {
      q: "Should I put my qualifications in my bio?",
      a: "If they help clients trust you, yes. Use only what's true and verifiable.",
    },
    {
      q: "What's the best call to action for a coach?",
      a: "It depends on your goal: a link to book or apply, a DM keyword to start conversations, or a free guide to grow your list.",
    },
    {
      q: "Should I use emoji in my bio?",
      a: "Sparingly, if they suit your brand. The generator uses only a simple arrow.",
    },
    {
      q: "How often should I update my bio?",
      a: "Whenever your offer, audience or call to action changes, and review it every few months.",
    },
    { q: "Is anything I type stored?", a: "No. The generator runs in your browser." },
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
