import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Personal training business name generator",
  description:
    "Generate personal training and coaching business name ideas from your name, niche, location and style, with character counts and a domain check.",
  eyebrow: "Free tool · Naming",
  h1: "Personal training business name generator",
  intro: (
    <>
      <p>
        Add your name, your niche and, if you like, a location, choose a style, and generate up to
        twelve business name ideas from our own word lists. Every idea comes with its length in
        characters and a quick link to look up the domain. Treat them as a starting list, and check
        a name is genuinely available where you work before committing.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How do I choose a name for my personal training business?",
    answer: (
      <>
        <p>
          Decide whether you want a personal brand, built around your name, a descriptive name that
          says what you do, or an abstract name that's memorable and flexible. Keep it brief, simple
          to pronounce and simple to write down, and check that the domain, social handles and
          company name are available and that no one else holds a trademark on it.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why the name matters",
      body: (
        <>
          <p>
            Your business name appears on your website, social profiles, invoices and client app.
            It's often the first thing people remember and the thing they search for when a friend
            recommends you. A good name is simple to pronounce and write down, fits your niche and
            leaves room to grow. A poor name is confusing, hard to find or limits you later.
          </p>
        </>
      ),
    },
    {
      heading: "Three styles",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Style</th>
                  <th scope="col">Example shape</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Personal brand</td>
                  <td>[Your name] Coaching</td>
                  <td>Coaches whose clients come for them personally</td>
                </tr>
                <tr>
                  <td>Descriptive</td>
                  <td>Strength Collective, The Strength Method</td>
                  <td>Clearly signalling what you do and who for</td>
                </tr>
                <tr>
                  <td>Abstract</td>
                  <td>An invented word plus Fitness or Coaching</td>
                  <td>Building a brand that can grow beyond one coach</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Each style has trade-offs. Personal brands are authentic but harder to sell or expand.
            Descriptive names are clear but can be generic. Abstract names are distinctive but need
            more effort to explain.
          </p>
        </>
      ),
    },
    {
      heading: "Personal brand names",
      body: (
        <>
          <p>
            Using your name makes the business feel personal and trustworthy, and it's usually easy
            to secure online. It works especially well for one-to-one coaching, where clients choose
            you as a person. The drawback is that the business is tied to you; if you later hire
            coaches or want to sell, a personal brand can be harder to transfer. Add your name to
            the generator to see personal-brand ideas.
          </p>
        </>
      ),
    },
    {
      heading: "Descriptive names",
      body: (
        <>
          <p>
            Descriptive names combine your niche with a word that suggests a place, method or
            community: Collective, Method, Lab, Club, Studio, Project. They tell people what you do
            at a glance and help with search. Because many coaches use similar words, check
            carefully that your chosen name isn't already used nearby.
          </p>
        </>
      ),
    },
    {
      heading: "Abstract names",
      body: (
        <>
          <p>
            Abstract names use an invented or unusual word, often paired with Fitness or Coaching.
            They're memorable and easier to protect as trademarks, and they don't limit you to one
            niche. They take longer to build recognition, because the name itself doesn't explain
            what you do; your tagline and content have to.
          </p>
        </>
      ),
    },
    {
      heading: "Adding a location",
      body: (
        <>
          <p>
            A location word, such as a city or neighbourhood, helps local clients find you and makes
            it clear where you coach. It suits in-person trainers well. For online coaches, a
            location can limit your appeal to clients elsewhere, so consider whether it fits your
            plans.
          </p>
        </>
      ),
    },
    {
      heading: "What makes a good name",
      body: (
        <>
          <ul>
            <li>
              <strong>Short:</strong> ideally under 20 characters, so it fits on social profiles and
              is easy to type.
            </li>
            <li>
              <strong>Easy to say:</strong> if people hear it, can they spell it?
            </li>
            <li>
              <strong>Easy to remember:</strong> distinctive enough to stick.
            </li>
            <li>
              <strong>Relevant:</strong> fits your niche and the clients you want.
            </li>
            <li>
              <strong>Available:</strong> domain, social handles and company registration free.
            </li>
            <li>
              <strong>Room to grow:</strong> won't feel wrong if you add services or locations.
            </li>
          </ul>
          <p>The character count beside each idea helps with length.</p>
        </>
      ),
    },
    {
      heading: "Checking availability",
      body: (
        <>
          <p>
            Before committing to a name, check four things: the domain name, the social media
            handles you need, your country's company register and its trademark database. The 'Check
            domain' link opens a public domain lookup for the .com version of each idea. A free
            domain doesn't mean the name is free to use; someone may already trade under it or hold
            a trademark.
          </p>
        </>
      ),
    },
    {
      heading: "Trademarks and local businesses",
      body: (
        <>
          <p>
            Trademark rules differ by country. A name that's free in one country may be registered
            in another. Also search for local businesses using similar names, especially other
            fitness businesses nearby; even without a trademark, using a very similar name can cause
            confusion and disputes. If you're unsure, seek advice from a professional who knows your
            local rules. This tool is not legal advice.
          </p>
        </>
      ),
    },
    {
      heading: "Testing names",
      body: (
        <>
          <p>
            Shortlist three to five names and test them. Say them aloud, write them in a bio,
            imagine them on a T-shirt or a client app. Ask a few clients or friends which they
            remember an hour later. The name people remember, spell correctly and can explain to
            someone else is usually the right choice.
          </p>
        </>
      ),
    },
    {
      heading: "Generating more ideas",
      body: (
        <>
          <p>
            Press 'Generate name ideas' again for a new set. Each press shuffles the combinations,
            so you'll see different ideas each time. Try each style, add or remove your name and
            location, and change the niche word to see how the ideas shift. Copy the ones you like
            into a shortlist.
          </p>
        </>
      ),
    },
    {
      heading: "A worked example",
      body: (
        <>
          <p>
            With the defaults, niche 'strength', a descriptive style, and no name or location, the
            generator suggests ideas along the lines of Strength Collective, Strength Method, Simply
            Strength Studio or Strength &amp; Grit. Add a location, such as a city, and some ideas
            include it at the front. Switch to abstract, and you'll see invented words paired with
            Fitness, Coaching or Strength.
          </p>
        </>
      ),
    },
    {
      heading: "Names for different niches",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Niche word</th>
                  <th scope="col">Descriptive idea</th>
                  <th scope="col">Abstract idea</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Strength</td>
                  <td>Strength Collective</td>
                  <td>Cairn Strength</td>
                </tr>
                <tr>
                  <td>Run</td>
                  <td>Run Method</td>
                  <td>Ostra Training</td>
                </tr>
                <tr>
                  <td>Mobility</td>
                  <td>Daily Mobility Club</td>
                  <td>Lumen Movement</td>
                </tr>
                <tr>
                  <td>Pilates</td>
                  <td>Pilates &amp; Form</td>
                  <td>Solen Coaching</td>
                </tr>
                <tr>
                  <td>Nutrition</td>
                  <td>Honest Nutrition Project</td>
                  <td>Varo Performance</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These show the shapes the generator uses; your results depend on your inputs and each
            new set.
          </p>
        </>
      ),
    },
    {
      heading: "Thinking about the future",
      body: (
        <>
          <p>
            Ask where you want the business to be in five years. If you'll always coach one-to-one,
            a personal brand may suit you. If you plan to hire coaches, open a studio or sell
            programmes, a descriptive or abstract name gives more room. Changing a business name
            later is possible but costs time, recognition and money, so choosing with the future in
            mind is worth it.
          </p>
        </>
      ),
    },
    {
      heading: "Saying it out loud",
      body: (
        <>
          <p>
            Many clients will hear about you by word of mouth. Say each shortlisted name aloud as if
            recommending yourself to a friend: 'You should try Strength Collective.' Does it sound
            natural? Would the friend be able to search for it correctly? Names that are hard to say
            or spell lose referrals.
          </p>
        </>
      ),
    },
    {
      heading: "Checking social handles",
      body: (
        <>
          <p>
            Your social handles should match your business name as closely as possible. Check
            Instagram, TikTok, YouTube and Facebook for the exact name. If the handle is taken, a
            small addition such as 'coaching' or your city can work, but avoid strings of
            underscores or numbers that make you hard to find.
          </p>
        </>
      ),
    },
    {
      heading: "Domain names",
      body: (
        <>
          <p>
            A .com domain is the most widely recognised, but country domains, such as .co.uk or .in,
            can work well for local businesses. Keep the domain short, avoid hyphens and check that
            it matches your social handles. If the .com is taken, consider whether the existing
            owner is a similar business; if so, choose a different name to avoid confusion.
          </p>
        </>
      ),
    },
    {
      heading: "Registering your business",
      body: (
        <>
          <p>
            Rules for registering a business name vary by country. Many countries let you trade
            under your own name without registration, but require registration for a different
            trading name or a company. Check your country's company register and, if needed,
            register the name before you invest in branding. This tool is not legal advice; check
            the rules where you operate.
          </p>
        </>
      ),
    },
    {
      heading: "Logos and branding",
      body: (
        <>
          <p>
            Once you've chosen a name, keep branding simple: a clean logo, one or two colours and a
            consistent font. A simple wordmark is often enough at the start. Consistent branding
            across your website, social profiles and client app makes your business look established
            and trustworthy.
          </p>
        </>
      ),
    },
    {
      heading: "Names to avoid",
      body: (
        <>
          <ul>
            <li>
              <strong>Very generic names:</strong> 'Fitness Coaching' is impossible to find or
              protect.
            </li>
            <li>
              <strong>Hard-to-spell names:</strong> unusual spellings lose people who search for
              you.
            </li>
            <li>
              <strong>Names too close to big brands:</strong> they risk legal trouble and confusion.
            </li>
            <li>
              <strong>Overly narrow names:</strong> a name tied to one service can limit you later.
            </li>
            <li>
              <strong>Long names:</strong> they don't fit social profiles and are hard to remember.
            </li>
          </ul>
          <p>If a name falls into one of these, keep looking.</p>
        </>
      ),
    },
    {
      heading: "Getting feedback",
      body: (
        <>
          <p>
            Share your shortlist with a few clients, friends or other coaches, and ask which they'd
            remember and which suits your coaching. Their first reactions are useful: if several
            people stumble over a name or misunderstand what it means, that's a sign to choose
            another.
          </p>
        </>
      ),
    },
    {
      heading: "Starting this week",
      body: (
        <>
          <p>
            Generate ideas in all three styles, copy your favourite five into a list and check each
            domain and handle. Say each one aloud, ask two people for their reaction, and narrow it
            to one or two before checking the company register and trademark database properly.
          </p>
        </>
      ),
    },
    {
      heading: "Privacy",
      body: (
        <>
          <p>
            The generator runs in your browser. Your name, niche and location aren't stored or sent.
            The 'Check domain' link opens a public domain lookup for the name you click.
          </p>
        </>
      ),
    },
    {
      heading: "Naming a studio or gym",
      body: (
        <>
          <p>
            If you run, or plan to run, a physical space, the name has to work on a sign, a map
            listing and a door. Shorter names read better from a distance. Consider how it will look
            on Google Maps and in local search results, where people often compare several
            businesses side by side.
          </p>
        </>
      ),
    },
    {
      heading: "Naming an online coaching brand",
      body: (
        <>
          <p>
            Online brands live mostly on social media, websites and apps. The name should be easy to
            type on a phone, fit within social handle limits and look good as a logo in a small
            square. Check how it appears as an app icon or profile picture, where only a few letters
            may be visible.
          </p>
        </>
      ),
    },
    {
      heading: "Using your initials",
      body: (
        <>
          <p>
            Initials, such as 'JK Coaching', are short and easy to secure, but they don't tell
            people anything about what you do and can be hard to remember. If you use initials, pair
            them with a clear tagline in your bio and website.
          </p>
        </>
      ),
    },
    {
      heading: "Names in other languages",
      body: (
        <>
          <p>
            If you coach in more than one language, check that your name works in each. Some words
            have unexpected meanings or are hard to pronounce in other languages. A name that's easy
            to say in all your clients' languages helps word-of-mouth referrals.
          </p>
        </>
      ),
    },
    {
      heading: "Changing your name later",
      body: (
        <>
          <p>
            If you outgrow your name, you can change it, but plan carefully. Keep the old handles
            and redirect them, tell clients in advance, update every profile and document at once
            and use a line such as 'formerly…' for a few months. It's much easier to choose
            carefully at the start than to rebrand later.
          </p>
        </>
      ),
    },
    {
      heading: "Taglines",
      body: (
        <>
          <p>
            A tagline explains what the name doesn't. Abstract names especially benefit from one:
            'Cairn Strength · Strength coaching for women over 40'. Keep it short and specific, and
            use it consistently in your bio, website header and client communications.
          </p>
        </>
      ),
    },
    {
      heading: "Your name in the client experience",
      body: (
        <>
          <p>
            Clients see your business name every time they open their plan, check in or receive a
            message. A name that feels professional and personal at the same time makes the coaching
            feel like a real business, which supports trust and retention.
          </p>
        </>
      ),
    },
    {
      heading: "Avoiding confusion with competitors",
      body: (
        <>
          <p>
            Search your shortlisted names on Google, Instagram and local business directories. If a
            nearby coach or gym uses something similar, choose another name, even if it's legally
            allowed. Clients who confuse you with another business may end up at the wrong place,
            and a similar name can damage both reputations.
          </p>
        </>
      ),
    },
    {
      heading: "Names and pricing",
      body: (
        <>
          <p>
            Names carry a feel. Words such as 'House', 'Room' or 'Studio' can feel calm and premium;
            words such as 'Club' and 'Project' can feel friendly and community-led; 'Lab' and
            'Method' can feel analytical. Choose words that match your price point and the
            experience you offer.
          </p>
        </>
      ),
    },
    {
      heading: "Names and your niche word",
      body: (
        <>
          <p>
            The niche word shapes everything the generator suggests. 'Strength' produces
            strength-focused names; 'Mobility' produces movement-focused ones; 'Run' produces
            running brands. Try a few different niche words, including broader ones such as
            'Fitness' or 'Movement', to see how specific or general you want the name to be.
          </p>
        </>
      ),
    },
    {
      heading: "A shortlist template",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Domain</th>
                  <th scope="col">Handles</th>
                  <th scope="col">Register</th>
                  <th scope="col">Trademark</th>
                  <th scope="col">Feedback</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Option 1</td>
                  <td>Free / taken</td>
                  <td>Free / taken</td>
                  <td>Clear / taken</td>
                  <td>Clear / conflict</td>
                  <td>Notes</td>
                </tr>
                <tr>
                  <td>Option 2</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Option 3</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Filling in a table like this for each shortlisted name makes the final decision clearer
            and keeps a record of what you checked.
          </p>
        </>
      ),
    },
    {
      heading: "When you've chosen",
      body: (
        <>
          <p>
            Once you've decided, secure the domain and social handles straight away, register the
            name if your country requires it and update your bio, website and client materials
            together. A coordinated launch, even a small one, tells clients and followers that the
            business has a clear identity.
          </p>
        </>
      ),
    },
    {
      heading: "Ideas, not decisions",
      body: (
        <>
          <p>
            Treat the generated names as inspiration. You might combine parts of two ideas, swap a
            word or come up with something new while reading the list. The best names often come
            from that process rather than straight from a generator.
          </p>
        </>
      ),
    },
    {
      heading: "Names for partnerships",
      body: (
        <>
          <p>
            If you coach with a partner or plan to, consider a name that doesn't belong to either of
            you personally. Descriptive and abstract names work well for partnerships, because both
            coaches can represent the brand equally, and the name stays the same if the team
            changes.
          </p>
        </>
      ),
    },
    {
      heading: "Names and your story",
      body: (
        <>
          <p>
            Some of the most memorable business names come from a story: a place you trained, a
            phrase clients repeat, a principle at the heart of your coaching. If a name has a
            meaning you can explain in one sentence, it gives you something to talk about in content
            and on calls. Use the generator to spark ideas, then look for connections to your own
            story.
          </p>
        </>
      ),
    },
    {
      heading: "Short names and domains",
      body: (
        <>
          <p>
            Short, common words are rarely available as .com domains. If your favourite name is
            taken, try adding a word such as 'coaching' or 'training' to the domain, using a country
            domain, or adjusting the name slightly. Make sure the final domain still matches the
            name clearly, so people can find you when they search.
          </p>
        </>
      ),
    },
    {
      heading: "Names that work in conversation",
      body: (
        <>
          <p>
            Clients will say your business name to friends, partners and colleagues. A name that's
            comfortable to say in a sentence, such as 'I train with Halden Coaching', spreads more
            easily than one that feels awkward or needs explaining. Test it in a few sentences
            before deciding.
          </p>
        </>
      ),
    },
    {
      heading: "Thinking like a client",
      body: (
        <>
          <p>
            Ask what a potential client would expect from each name. Does 'The Strength House'
            suggest a friendly gym or a serious performance centre? Does an abstract name suggest
            premium coaching or something unclear? The impression a name gives should match the
            experience you deliver.
          </p>
        </>
      ),
    },
    {
      heading: "How the generator builds names",
      body: (
        <>
          <p>
            The generator combines your niche word with lists of words we've written for each style:
            place and method words for descriptive names, invented roots for abstract names, and
            patterns built around your name for personal brands. It adds your location to some ideas
            if you give one. Each press of the button shuffles the combinations, so you see a fresh
            set of up to twelve ideas each time.
          </p>
        </>
      ),
    },
    {
      heading: "Colour and visual identity",
      body: (
        <>
          <p>
            A name is easier to remember when it's paired with a consistent look. Choose one main
            colour and one accent, a simple font and a logo that works in black and white. Use them
            on your profile picture, website and client materials. Consistency matters more than an
            elaborate design.
          </p>
        </>
      ),
    },
    {
      heading: "A checklist before you commit",
      body: (
        <>
          <ol>
            <li>Is it short, easy to say and easy to spell?</li>
            <li>Does it fit your niche and the clients you want?</li>
            <li>Are the domain and social handles available?</li>
            <li>Is it clear on your country's company register and trademark database?</li>
            <li>Is no nearby business using something similar?</li>
            <li>Will it still fit if your business grows?</li>
          </ol>
          <p>Six yeses, and you've found your name.</p>
        </>
      ),
    },
    {
      heading: "Personal brand ideas",
      body: (
        <>
          <p>
            Choose 'Personal brand' and add your name to see ideas such as '[First name] Coaching',
            'Coached by [first name]', '[Surname] Strength Club' or 'Team [surname]'. These suit
            coaches who want clients to know exactly who they'll be working with. If you leave your
            name blank, the generator shows descriptive ideas instead.
          </p>
        </>
      ),
    },
    {
      heading: "Abstract ideas",
      body: (
        <>
          <p>
            Choose 'Abstract' to see invented words paired with Fitness, Coaching, Strength,
            Performance, Training or Movement. These roots are short, easy to say and unlikely to be
            common, which can make domains and trademarks easier to secure. Press the button a few
            times to see more combinations.
          </p>
        </>
      ),
    },
    {
      heading: "Location in names",
      body: (
        <>
          <p>
            If you add a location, it appears at the front of about a third of the ideas, such as
            'Leeds Strength Collective'. Location names help local search and make it clear where
            you coach. If you might move or go fully online, consider keeping the location out of
            the name and in your bio instead.
          </p>
        </>
      ),
    },
    {
      heading: "Take your time",
      body: (
        <>
          <p>
            A name is worth a few days of thought. Shortlist, check, sleep on it and say it aloud
            again before you commit. The right name usually still feels right after a week.
          </p>
        </>
      ),
    },
    {
      heading: "Ask your clients",
      body: (
        <>
          <p>
            Your current clients know your coaching best. Ask them which shortlisted name feels most
            like you; their answer is often the clearest guide.
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
    heading: "Put your new name on the client app",
    body: (
      <>
        <p>
          In Traiv, clients see your name and logo inside the app, so your business name is what
          they see every time they open their plan.
        </p>
      </>
    ),
  },
  next: [
    { label: "Personal trainer bio generator", href: "/tools/personal-trainer-bio-generator" },
    { label: "Coaching offer builder", href: "/tools/coaching-offer-builder" },
    { label: "Instagram caption generator", href: "/tools/instagram-caption-generator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "Should I use my own name for my business?",
      a: "It works well for personal coaching. If you plan to hire coaches or sell the business later, a descriptive or abstract name may be more flexible.",
    },
    {
      q: "How long should a business name be?",
      a: "Short enough to fit on social profiles and be easy to type, ideally under about 20 characters.",
    },
    {
      q: "Does a free domain mean I can use the name?",
      a: "No. Also check the company register, trademark database and local businesses.",
    },
    {
      q: "Can I trademark my business name?",
      a: "Often, yes, depending on your country and the name. Distinctive names are usually easier to protect. Seek local advice.",
    },
    {
      q: "Why do I get different names each time?",
      a: "Each press of the button shuffles the word combinations for a new set.",
    },
    { q: "Is anything stored?", a: "No. The generator runs in your browser." },
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
