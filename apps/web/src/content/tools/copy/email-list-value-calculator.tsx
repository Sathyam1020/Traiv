import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Email list value calculator for coaches",
  description:
    "Estimate the revenue each email campaign brings from your list, the value of each subscriber and what 100 more subscribers are worth.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Email list value calculator",
  intro: (
    <>
      <p>
        Enter your subscribers, open rate, click rate, purchase conversion and offer price. See
        revenue per campaign, revenue per subscriber, the value of 100 more subscribers and how many
        buyers each send produces.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much is my email list worth?",
    answer: (
      <>
        <p>
          Multiply subscribers by open rate, click rate and conversion to get buyers, then by the
          offer price. 500 subscribers × 40% open × 8% click × 5% buy = 0.8 buyers per campaign; at
          €300 that is €240, or €0.48 per subscriber. Every 100 extra subscribers adds about €48 a
          campaign.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why an email list matters for coaches",
      body: (
        <>
          <p>
            An email list is an audience you own. Social platforms decide who sees your posts, and
            reach can fall overnight. Email reaches the inbox of everyone who chose to hear from
            you, and you can contact them whenever you have something worth saying. For coaches, it
            is one of the most dependable ways to turn interest into clients over time.
          </p>
          <p>
            Valuing the list puts a number on that. It tells you what each subscriber is worth on
            average, which helps decide how much effort or money to put into growing the list and
            how often to email it.
          </p>
        </>
      ),
    },
    {
      heading: "The funnel behind the number",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col">Rate</th>
                  <th scope="col">500 subscribers</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subscribers</td>
                  <td></td>
                  <td>500</td>
                </tr>
                <tr>
                  <td>Open the email</td>
                  <td>40%</td>
                  <td>200</td>
                </tr>
                <tr>
                  <td>Click through to the offer</td>
                  <td>8% of openers</td>
                  <td>16</td>
                </tr>
                <tr>
                  <td>Buy</td>
                  <td>5% of clickers</td>
                  <td>0.8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            At €300, 0.8 buyers is €240 per campaign. Some campaigns will sell nothing and others
            will sell two or three; the calculator gives the average you can expect over many sends.
          </p>
        </>
      ),
    },
    {
      heading: "Revenue per subscriber",
      body: (
        <>
          <p>
            Revenue per subscriber is campaign revenue divided by list size: €240 ÷ 500 = €0.48 per
            subscriber per campaign. If you send one offer email a month, each subscriber is worth
            about €5.76 a year. That figure is useful for judging list-building: a lead magnet or ad
            that adds subscribers at €2 each pays back within months.
          </p>
          <p>
            The value of 100 more subscribers is the same idea scaled up: €48 more per campaign at
            these rates. Growing the list to 2,000 subscribers at the same rates would bring about
            €960 per campaign.
          </p>
        </>
      ),
    },
    {
      heading: "Improving each stage",
      body: (
        <>
          <ul>
            <li>
              <strong>Open rate:</strong> clear, specific subject lines, a recognisable sender name
              and a consistent sending schedule.
            </li>
            <li>
              <strong>Click rate:</strong> one clear call to action, placed early and repeated at
              the end; a short email that explains why the offer matters now.
            </li>
            <li>
              <strong>Conversion:</strong> a sales page or booking page that matches the email's
              promise, with proof, clear pricing and an easy next step.
            </li>
            <li>
              <strong>List quality:</strong> subscribers who joined for something related to your
              coaching convert far better than those who joined for an unrelated giveaway.
            </li>
          </ul>
          <p>
            Improvements multiply. Raising open, click and conversion rates by a quarter each nearly
            doubles revenue per campaign.
          </p>
        </>
      ),
    },
    {
      heading: "Open rates are less reliable than they were",
      body: (
        <>
          <p>
            Since 2021, some email apps load images automatically for privacy reasons, which can
            count as opens even when nobody reads the email. Reported open rates may therefore be
            higher than the real number. Click rates and sales are more dependable measures of
            engagement.
          </p>
          <p>
            If your open rate looks unusually high, focus on click and conversion rates, and compare
            campaigns with each other rather than with industry averages.
          </p>
        </>
      ),
    },
    {
      heading: "Value beyond a single campaign",
      body: (
        <>
          <p>
            The calculator measures direct sales from one offer email. A list also builds trust over
            time. Many clients buy after reading several emails over weeks or months, or reply to an
            email to ask a question that leads to a call. Those sales are harder to attribute but
            real.
          </p>
          <p>
            Regular, useful emails, such as training tips, client stories and simple recipes, keep
            the list engaged so that offer emails land with people who already trust you.
          </p>
        </>
      ),
    },
    {
      heading: "Growing the list",
      body: (
        <>
          <ol>
            <li>
              Offer something useful in exchange for an email: a short guide, a plan template, a
              challenge.
            </li>
            <li>Link to it from your social profiles, posts and website.</li>
            <li>Mention it in podcasts, talks and collaborations.</li>
            <li>Ask existing subscribers to share it with friends.</li>
            <li>Make signing up easy from your phone, with as few fields as possible.</li>
          </ol>
          <p>
            Quality matters more than size. A thousand subscribers interested in exactly what you
            offer are worth more than ten thousand who joined for a prize.
          </p>
        </>
      ),
    },
    {
      heading: "Keeping the list healthy",
      body: (
        <>
          <p>
            Remove or re-engage subscribers who haven't opened or clicked for many months. A
            smaller, engaged list delivers better and keeps your sender reputation high. Make
            unsubscribing easy; people who leave weren't going to buy, and complaints hurt delivery.
          </p>
          <p>
            Follow email law in your region. In the UK and EU, that generally means clear consent
            before adding someone to your list, a visible unsubscribe link and a privacy notice
            explaining how you use their data.
          </p>
        </>
      ),
    },
    {
      heading: "Turning subscribers into clients",
      body: (
        <>
          <p>
            A simple welcome sequence of three to five emails sent automatically after someone joins
            introduces you, delivers the free resource, shares a client story and invites them to a
            call or offer. Welcome emails are often the most opened emails a list ever receives.
          </p>
          <p>
            After that, a regular rhythm, such as one useful email a week and an offer once or twice
            a month, keeps the list warm without wearing it out.
          </p>
        </>
      ),
    },
    {
      heading: "What different list sizes are worth",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Subscribers</th>
                  <th scope="col">Buyers per campaign</th>
                  <th scope="col">Revenue per campaign</th>
                  <th scope="col">With 12 campaigns a year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>250</td>
                  <td>0.4</td>
                  <td>€120</td>
                  <td>€1,440</td>
                </tr>
                <tr>
                  <td>500</td>
                  <td>0.8</td>
                  <td>€240</td>
                  <td>€2,880</td>
                </tr>
                <tr>
                  <td>1,000</td>
                  <td>1.6</td>
                  <td>€480</td>
                  <td>€5,760</td>
                </tr>
                <tr>
                  <td>2,500</td>
                  <td>4.0</td>
                  <td>€1,200</td>
                  <td>€14,400</td>
                </tr>
                <tr>
                  <td>5,000</td>
                  <td>8.0</td>
                  <td>€2,400</td>
                  <td>€28,800</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            At the default rates, value scales directly with size. In reality, larger lists often
            have slightly lower engagement, so treat these as upper estimates.
          </p>
        </>
      ),
    },
    {
      heading: "Offer price and list value",
      body: (
        <>
          <p>
            The offer price has a direct effect. Selling a €300 package at these rates brings €240 a
            campaign. Selling a €100 starter programme brings €80, unless the lower price raises
            conversion enough to compensate. Many coaches use a low-priced offer to turn subscribers
            into first-time buyers, then invite them to full coaching.
          </p>
          <p>
            If you sell several offers, run the calculator for each and compare. The best offer for
            the list is the one that brings the most revenue over time, including follow-on sales.
          </p>
        </>
      ),
    },
    {
      heading: "Segmenting the list",
      body: (
        <>
          <p>
            Not everyone on the list wants the same thing. Segmenting by interest, such as fat loss,
            strength or nutrition, or by stage, such as new subscribers or past clients, lets you
            send more relevant emails. Relevant emails get more opens, more clicks and more sales.
          </p>
          <p>
            Even simple segmentation, such as asking new subscribers one question about their goal,
            can lift results noticeably.
          </p>
        </>
      ),
    },
    {
      heading: "Past clients on the list",
      body: (
        <>
          <p>
            Past clients are often the most valuable subscribers. They know your coaching, trust you
            and may return or refer others. Keep them on the list with their permission, send them
            useful content and let them know when you have space or a new offer. Many coaches find a
            meaningful share of new clients come from people who coached with them before.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a simple email rhythm",
      body: (
        <>
          <ol>
            <li>Week 1: a useful tip or short story.</li>
            <li>Week 2: a client result, with permission.</li>
            <li>Week 3: a useful tip or recipe.</li>
            <li>Week 4: a clear offer email with one call to action.</li>
          </ol>
          <p>
            This rhythm keeps the list engaged and makes offer emails feel natural. Track clicks and
            sales each month and enter them into the calculator to see how the list's value changes
            as it grows.
          </p>
        </>
      ),
    },
    {
      heading: "Email and social media together",
      body: (
        <>
          <p>
            Social media is good for reach, email for conversion. Use social posts to invite people
            onto your list with a useful free resource, then use email to build trust and make
            offers. Many coaches find that clients who joined the list first and bought later stay
            longer than those who bought straight from a post.
          </p>
          <p>
            Mentioning your newsletter in posts, stories and your profile link steadily grows the
            list without paid ads.
          </p>
        </>
      ),
    },
    {
      heading: "Click rate and offer clarity",
      body: (
        <>
          <p>
            The click rate depends heavily on how clear and relevant the offer is. An email with one
            clear purpose and one link tends to get more clicks than a newsletter with ten links.
            Explain who the offer is for, what changes for them and what to do next. Put the link
            early and again at the end.
          </p>
          <p>
            If click rate is low despite good open rates, the email isn't making a strong enough
            case. If clicks are healthy but sales are low, the page they land on needs work.
          </p>
        </>
      ),
    },
    {
      heading: "Landing page conversion",
      body: (
        <>
          <p>
            Purchase conversion happens on the page subscribers click to. That page should match the
            email: same offer, same promise, same tone. Include who it's for, what's included,
            price, proof and a clear button. Remove distractions such as menus and unrelated links.
          </p>
          <p>
            Test the page on a phone. Most subscribers read email on mobile, and a page that is slow
            or hard to use on a small screen loses sales.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking list growth",
      body: (
        <>
          <p>
            Each month, record subscribers gained, subscribers lost and the main sources of new
            sign-ups. Enter your current list size and rates into the calculator to see how the
            value per campaign changes. Over time, this shows which sign-up sources bring
            subscribers who actually buy.
          </p>
        </>
      ),
    },
    {
      heading: "How many campaigns to send",
      body: (
        <>
          <p>
            Revenue per campaign multiplied by the number of offer campaigns gives annual list
            revenue. Sending more offers raises revenue up to a point, then unsubscribes and fatigue
            start to cut into it. Most coaches find one or two offer emails a month, between useful
            content emails, a sustainable balance.
          </p>
          <p>
            Watch unsubscribe rates after offer emails. A small rise is normal. A large, sustained
            rise suggests emails are too frequent or too salesy.
          </p>
        </>
      ),
    },
    {
      heading: "A quick summary",
      body: (
        <>
          <ul>
            <li>
              <strong>Buyers</strong> = subscribers × open × click × conversion.
            </li>
            <li>
              <strong>Revenue per campaign</strong> = buyers × offer price.
            </li>
            <li>
              <strong>Revenue per subscriber</strong> = revenue ÷ subscribers.
            </li>
            <li>
              <strong>Levers:</strong> list quality, click rate and landing page conversion.
            </li>
          </ul>
          <p>
            Use the value per subscriber to decide how much list growth is worth, and improve each
            stage of the funnel one at a time.
          </p>
        </>
      ),
    },
    {
      heading: "Lead magnets that attract the right subscribers",
      body: (
        <>
          <p>
            The free resource that brings people onto your list shapes who they are. A generic 'free
            workout plan' attracts anyone. A specific 'three-day meal prep guide for busy parents'
            or 'beginner's guide to the first month of lifting' attracts people close to your ideal
            client. Specific lead magnets usually bring fewer subscribers, but those subscribers
            open, click and buy far more often.
          </p>
          <p>
            Match the lead magnet to the offer you plan to sell. If you coach strength for women
            over 40, a resource on that exact topic brings subscribers who are a natural fit for
            your coaching.
          </p>
        </>
      ),
    },
    {
      heading: "A worked growth example",
      body: (
        <>
          <p>
            A coach with 500 subscribers sends one offer a month, earning about €240 per campaign,
            or €2,880 a year. Over twelve months, a specific lead magnet adds 1,000 well-matched
            subscribers, and clearer emails raise the click rate from 8% to 10%. At 1,500
            subscribers and the new click rate, each campaign brings 1,500 × 40% × 10% × 5% = 3
            buyers, or €900. Annual list revenue rises to about €10,800, nearly four times the
            start.
          </p>
        </>
      ),
    },
    {
      heading: "Email and retention",
      body: (
        <>
          <p>
            A list isn't only for new clients. Current clients on the list receive useful content
            between check-ins, which keeps them engaged and reminds them of the value of coaching.
            Past clients receive reminders that you're there when they're ready to return. Both
            effects raise lifetime value, which this calculator doesn't capture but which often
            matters as much as direct campaign sales.
          </p>
        </>
      ),
    },
    {
      heading: "Automations worth setting up",
      body: (
        <>
          <p>
            A welcome sequence for new subscribers, a short sequence for people who clicked an offer
            but didn't buy, and a re-engagement email for subscribers who've gone quiet for months
            cover most coaches' needs. Once set up, they run without effort and usually lift revenue
            per subscriber.
          </p>
        </>
      ),
    },
    {
      heading: "Plain text or designed emails?",
      body: (
        <>
          <p>
            Many coaches find that short, plain emails written like a personal message get more
            replies and clicks than heavily designed newsletters. They feel like a note from a
            person rather than a brochure. Test both with your own list: send the same offer in each
            style to half the list and compare clicks and sales.
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
    heading: "Turn subscribers into clients who stay",
    body: (
      <>
        <p>
          Once a subscriber signs up, the coaching itself keeps them. In Traiv, clients get their
          plans, check-ins and messages in a branded app, so the experience matches the promise in
          your emails.
        </p>
      </>
    ),
  },
  next: [
    {
      label: "Customer acquisition cost calculator",
      href: "/tools/customer-acquisition-cost-calculator",
    },
    { label: "Referral value calculator", href: "/tools/referral-value-calculator" },
    { label: "Free trial conversion calculator", href: "/tools/free-trial-conversion-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How do I calculate the value of my email list?",
      a: "Subscribers × open rate × click rate × conversion × offer price gives revenue per campaign. Divide by subscribers for value per subscriber.",
    },
    {
      q: "What is a good open rate for a coaching newsletter?",
      a: "Rates vary, and privacy features inflate opens. Track click rate and sales as more reliable measures.",
    },
    {
      q: "How often should I email my list?",
      a: "Many coaches send one useful email a week and an offer once or twice a month. Consistency matters more than frequency.",
    },
    {
      q: "Is a bigger list always better?",
      a: "No. An engaged list of people interested in your coaching converts far better than a large list of uninterested subscribers.",
    },
    {
      q: "How much should I spend to get a subscriber?",
      a: "Less than the subscriber's value over the months you expect them to stay. At €0.48 a campaign and one offer a month, that is about €5.76 a year.",
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
