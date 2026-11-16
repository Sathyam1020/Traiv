import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Discovery call calculator for coaches",
  description:
    "Work out the monthly revenue your discovery calls produce, what each call is worth, and what a higher close rate would add, for a coaching business.",
  eyebrow: "Free tool · For your coaching business",
  h1: "Discovery call calculator",
  intro: (
    <>
      <p>
        Enter how many discovery calls you take each month, your close rate and what a new client is
        worth. See your monthly new revenue, the value of a single call and what ten more points of
        close rate would add.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much is a discovery call worth?",
    answer: (
      <>
        <p>
          Multiply calls by close rate to get new clients, then by client value. Twenty calls at a
          30% close rate bring 6 clients; at €1,500 each, that is €9,000 a month, or €450 per call.
          Lifting the close rate to 40% turns the same calls into 8 clients, adding €3,000 a month.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "Why calls deserve a number",
      body: (
        <>
          <p>
            A discovery call, sometimes called a consultation or sales call, is where most
            one-to-one coaching is sold. Coaches often think of calls as time spent rather than
            money earned, and treat them as a chore to fit around client work. Putting a value on
            each call changes that. When a 30-minute call is worth €450 on average, it is one of the
            best-paid half hours in the week.
          </p>
          <p>
            That value also shows where to focus. If calls are valuable, it is worth getting more of
            them, preparing for them properly and improving how you run them. The calculator makes
            those trade-offs visible.
          </p>
        </>
      ),
    },
    {
      heading: "The calculation",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  <th scope="col">Formula</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>New clients</td>
                  <td>Calls × close rate</td>
                  <td>20 × 30% = 6</td>
                </tr>
                <tr>
                  <td>Monthly new revenue</td>
                  <td>New clients × client value</td>
                  <td>6 × €1,500 = €9,000</td>
                </tr>
                <tr>
                  <td>Value per call</td>
                  <td>Revenue ÷ calls</td>
                  <td>€9,000 ÷ 20 = €450</td>
                </tr>
                <tr>
                  <td>+10 points of close rate</td>
                  <td>Calls × 10% × client value</td>
                  <td>2 × €1,500 = €3,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Client value is what a new client is worth to you. For a package, use the package price.
            For monthly coaching, use the monthly fee times the average months a client stays.
          </p>
        </>
      ),
    },
    {
      heading: "A smaller business example",
      body: (
        <>
          <p>
            A coach taking 12 calls a month at a 25% close rate signs 3 clients. If each is worth
            €1,200, that is €3,600 a month, or €300 per call. Raising close rate to 35% adds 1.2
            clients a month on average, about €1,440. Over a year, that is more than €17,000, from
            the same number of calls.
          </p>
          <p>
            Small percentage changes in close rate have large effects because they apply to every
            call you take.
          </p>
        </>
      ),
    },
    {
      heading: "What a good close rate looks like",
      body: (
        <>
          <p>
            Close rates vary widely, from under 20% to over 60%, depending on how warm the leads
            are, how well the offer fits them and how the call is run. Leads from referrals and
            long-term content followers tend to close at higher rates than leads from cold ads.
          </p>
          <p>
            Rather than comparing with other coaches, track your own rate by lead source. If
            referral calls close at 60% and ad calls at 20%, the difference tells you something
            about the ad leads, the ad promise or your follow-up for that group.
          </p>
        </>
      ),
    },
    {
      heading: "Running a better discovery call",
      body: (
        <>
          <ol>
            <li>
              <strong>Prepare.</strong> Read the intake form before the call and note two or three
              questions.
            </li>
            <li>
              <strong>Listen first.</strong> Ask about goals, past attempts and what is getting in
              the way, and let them talk.
            </li>
            <li>
              <strong>Reflect back.</strong> Summarise what you heard, so they feel understood.
            </li>
            <li>
              <strong>Explain the fit.</strong> Describe how your coaching addresses what they told
              you, in their words.
            </li>
            <li>
              <strong>Be clear about the offer.</strong> Price, length, what is included, what is
              expected of them.
            </li>
            <li>
              <strong>Ask for the decision.</strong> Invite them to start, and handle questions
              honestly.
            </li>
            <li>
              <strong>Follow up.</strong> Send a short summary and next step the same day.
            </li>
          </ol>
          <p>
            A consistent structure makes calls easier to run and easier to improve, because you can
            see which part is losing people.
          </p>
        </>
      ),
    },
    {
      heading: "Pre-qualifying leads",
      body: (
        <>
          <p>
            Not every call should happen. A short application or intake form before booking filters
            out people who aren't ready, can't afford the offer or want something you don't provide.
            Fewer, better-matched calls usually raise close rate and save time.
          </p>
          <p>
            Ask about goals, timeline, budget range and what support they want. Be clear on your
            booking page about who the coaching is for. Some coaches add a small booking deposit for
            in-depth consultations, refundable against the first payment.
          </p>
        </>
      ),
    },
    {
      heading: "Follow-up matters",
      body: (
        <>
          <p>
            Many people don't decide on the call itself. A clear, friendly follow-up within a day,
            and another a few days later, often converts a meaningful share of the 'not yet' group.
            Without follow-up, those people usually drift away.
          </p>
          <p>
            Track how many clients sign after a follow-up rather than on the call. If it's a large
            share, follow-up is part of your sales process and worth doing consistently.
          </p>
        </>
      ),
    },
    {
      heading: "Calls and capacity",
      body: (
        <>
          <p>
            Every call takes time: preparation, the call itself and follow-up, often an hour in
            total. Twenty calls a month is about five hours a week. If your client calendar is full,
            adding calls without capacity for the clients they bring is a problem. Check your client
            capacity before pushing call volume up.
          </p>
          <p>
            If calls take too much time for the clients they produce, look at qualification and
            close rate before cutting calls altogether. A better filter often means fewer calls and
            the same number of new clients.
          </p>
        </>
      ),
    },
    {
      heading: "Tracking calls",
      body: (
        <>
          <p>
            Keep a simple log: date, lead source, outcome, reason if they didn't sign, and the value
            of the client if they did. After a couple of months, it shows your close rate by source,
            common objections and average client value, all of which feed this calculator with real
            numbers instead of guesses.
          </p>
        </>
      ),
    },
    {
      heading: "Calls by lead source",
      body: (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Source</th>
                  <th scope="col">Example close rate</th>
                  <th scope="col">What it suggests</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Client referrals</td>
                  <td>50 to 70%</td>
                  <td>Warm, trusting leads; prioritise these</td>
                </tr>
                <tr>
                  <td>Long-time social followers</td>
                  <td>30 to 50%</td>
                  <td>Content is doing much of the selling</td>
                </tr>
                <tr>
                  <td>Paid ads</td>
                  <td>15 to 30%</td>
                  <td>Colder leads; qualification and follow-up matter most</td>
                </tr>
                <tr>
                  <td>Cold outreach</td>
                  <td>Under 15%</td>
                  <td>Low intent; often not worth the time</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These are illustrations, not benchmarks. Your own figures will differ. What matters is
            comparing your sources and noticing which bring the calls most likely to convert.
          </p>
        </>
      ),
    },
    {
      heading: "Handling common objections",
      body: (
        <>
          <ul>
            <li>
              <strong>'It's too expensive.'</strong> Ask what they compared it with, restate what's
              included, and, if it fits, offer a payment plan rather than a discount.
            </li>
            <li>
              <strong>'I need to think about it.'</strong> Ask what they want to think through, and
              offer to answer it now or follow up on a set day.
            </li>
            <li>
              <strong>'I don't have time.'</strong> Explain how much time the coaching actually
              takes each week and how it fits around their schedule.
            </li>
            <li>
              <strong>'I've tried before and failed.'</strong> Ask what didn't work and explain what
              will be different this time.
            </li>
          </ul>
          <p>
            Objections are often questions in disguise. Answering them honestly builds trust, even
            when the person doesn't sign straight away.
          </p>
        </>
      ),
    },
    {
      heading: "Call length and format",
      body: (
        <>
          <p>
            Most coaching discovery calls run 20 to 45 minutes. Shorter calls suit lower-priced
            offers and warm leads; longer calls suit premium coaching where more needs to be
            understood. Video calls feel more personal than phone calls and let you show your app or
            a sample plan.
          </p>
          <p>
            Whatever the length, keep a consistent structure. It is easier to improve a call when
            each one follows the same steps.
          </p>
        </>
      ),
    },
    {
      heading: "Measuring call quality",
      body: (
        <>
          <p>
            Close rate is the headline number, but other measures help. Show-up rate shows how many
            booked calls actually happen; a low rate suggests reminders or a booking deposit may
            help. Average client value shows whether calls are converting into the right package.
            Time per call shows the real cost of each one.
          </p>
          <p>
            Tracking these together makes it clear where to focus. If show-up is low, fix reminders.
            If close is low, work on the call. If client value is low, look at the offer.
          </p>
        </>
      ),
    },
    {
      heading: "For coaches: a monthly calls review",
      body: (
        <>
          <p>
            At the end of each month, enter your calls, close rate and average client value. Compare
            with the previous month. Listen back to one call that closed and one that didn't, if you
            recorded them with permission, and note one thing to change. Small, steady improvements
            in close rate add up to a lot of revenue over a year.
          </p>
        </>
      ),
    },
    {
      heading: "Raising client value",
      body: (
        <>
          <p>
            Client value is the third lever. Offering a longer package, a premium tier with more
            support, or a clear path from a starter programme to ongoing coaching can raise average
            value without changing calls or close rate.
          </p>
          <p>
            Be careful not to push clients into packages they don't need. The right package for each
            person retains better, which raises lifetime value in the long run.
          </p>
        </>
      ),
    },
    {
      heading: "Show-up rate",
      body: (
        <>
          <p>
            A call that never happens is worth nothing. If 25 calls are booked and only 20 happen, a
            fifth of your potential revenue disappears before the conversation starts. Send a
            confirmation straight after booking, a reminder the day before and a short message an
            hour before. Ask people to reschedule rather than miss the call if something comes up.
          </p>
          <p>
            Some coaches ask for a short questionnaire when booking. People who complete it are more
            likely to show up, and you arrive better prepared.
          </p>
        </>
      ),
    },
    {
      heading: "After the call",
      body: (
        <>
          <p>
            Whether they sign or not, send a summary within a few hours: what you discussed, what
            you recommended and the next step. For those who sign, start onboarding straight away
            while motivation is high. For those who don't, follow up once or twice over the next
            week, then add them to your email list with their permission.
          </p>
          <p>
            A surprising number of clients sign weeks or months after a call, once timing suits
            them. Staying in touch costs little and keeps you in mind.
          </p>
        </>
      ),
    },
    {
      heading: "Group calls and webinars",
      body: (
        <>
          <p>
            Some coaches replace individual calls with a group information session or webinar,
            followed by short one-to-one calls for those interested. This can save time when demand
            is high, though close rates for webinar attendees are often lower than for individual
            calls. Compare revenue per hour spent rather than close rate alone when choosing between
            the two.
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
              <strong>New clients</strong> = calls × close rate.
            </li>
            <li>
              <strong>Monthly revenue</strong> = new clients × client value.
            </li>
            <li>
              <strong>Value per call</strong> = revenue ÷ calls.
            </li>
            <li>
              <strong>Biggest lever:</strong> close rate, which applies to every call.
            </li>
          </ul>
          <p>
            Track your calls for a month, enter the real numbers, and choose one change to the call
            or follow-up to test next month.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing on the call",
      body: (
        <>
          <p>
            State your price clearly and confidently, after you have explained how the coaching
            addresses their goals. Hesitating or apologising for the price makes it feel bigger. If
            you offer payment options, such as paying monthly or upfront with a small discount,
            mention them once and let the person choose.
          </p>
          <p>
            If price objections are common, look at whether the call is building enough value first,
            whether the leads match your price point, and whether a lower-priced entry option would
            help some people start. Don't drop your price on the call; that teaches prospects to
            negotiate and undervalues your existing clients.
          </p>
        </>
      ),
    },
    {
      heading: "Using the result to plan your week",
      body: (
        <>
          <p>
            If each call is worth €450 on average, protecting time for calls is worth it. Many
            coaches block two or three fixed call windows a week, so calls don't fragment client
            work. Knowing the value also helps decide whether to spend money on getting more calls:
            an ad that books a call for €50 is a bargain if calls are worth €450 and you have
            capacity for the clients.
          </p>
        </>
      ),
    },
    {
      heading: "Recording calls to improve",
      body: (
        <>
          <p>
            With the prospect's permission, recording calls lets you listen back and spot patterns:
            where you talk too much, which questions open people up, where objections appear. Ten
            minutes reviewing one recording a week often improves close rate faster than any script.
            Delete recordings once you've reviewed them, and tell prospects why you record.
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
    heading: "Show prospects what they'll get",
    body: (
      <>
        <p>
          On a call, showing beats telling. With Traiv, you can show a prospect the app their plans,
          check-ins and messages will arrive in, under your brand, so the coaching feels real before
          they sign.
        </p>
      </>
    ),
  },
  next: [
    {
      label: "Customer acquisition cost calculator",
      href: "/tools/customer-acquisition-cost-calculator",
    },
    { label: "Free trial conversion calculator", href: "/tools/free-trial-conversion-calculator" },
    { label: "Client capacity calculator", href: "/tools/client-capacity-calculator" },
  ],
  nextPitch: "These tools work best together: run them on the same month of real numbers.",
  faq: [
    {
      q: "How do I calculate the value of a discovery call?",
      a: "Multiply calls by close rate and client value to get monthly revenue, then divide by the number of calls.",
    },
    {
      q: "What is a good close rate for coaching calls?",
      a: "It varies widely with lead quality and offer fit. Track your own rate by lead source rather than comparing with others.",
    },
    {
      q: "What should I use as client value?",
      a: "The package price, or the monthly fee times average months retained for ongoing coaching.",
    },
    {
      q: "How can I raise my close rate?",
      a: "Pre-qualify leads, prepare, listen first, explain the fit clearly, ask for the decision and follow up.",
    },
    {
      q: "Should I offer free discovery calls?",
      a: "Most coaches do. A short application form before booking keeps them focused on people likely to be a good fit.",
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
