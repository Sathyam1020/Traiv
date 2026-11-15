import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Personal Trainer Income Calculator: Monthly and Yearly Pay",
  description:
    "Free personal trainer income calculator. Work out monthly and annual take-home from sessions or online clients, gym split and costs, with an effective hourly rate.",
  eyebrow: "Free tool · Coaching business",
  h1: "Personal trainer income calculator",
  intro: (
    <>
      <p>
        How much a trainer earns depends on far more than the session rate. This calculator works
        out your monthly and yearly revenue and take-home pay from either in-person sessions or
        online clients, allowing for a gym's share, the weeks you actually work and your business
        costs, and shows what you really earn per coaching hour.
      </p>
    </>
  ),
  shortAnswer: {
    question: "How much do personal trainers make?",
    answer: (
      <>
        <p>
          Multiply what you charge by how much of it you sell, subtract what the gym and your
          business take, and spread the result across the hours you work. At 50 a session, 25
          sessions a week, 48 weeks a year and a 20 percent gym split, revenue is 60,000 a year.
          After the split and 300 a month in costs, take-home is 44,400, about 3,700 a month, or 37
          per coaching hour.
        </p>
        <p>
          Online coaching changes the shape of the numbers. Thirty clients at 150 a month bring in
          4,500 a month regardless of holidays, and at 45 minutes per client a week that is 22.5
          hours of coaching. The ceiling is set by how many clients you can serve well, not by the
          hours in a day.
        </p>
      </>
    ),
  },
  sections: [
    {
      heading: "How the calculator works",
      body: (
        <>
          <ul>
            <li>
              <strong>In-person:</strong> annual revenue is session rate × sessions per week ×
              working weeks. The gym's share is removed, then twelve months of business costs.
            </li>
            <li>
              <strong>Online:</strong> annual revenue is monthly price × clients × 12, because
              online clients usually pay monthly whether or not you take a week off. Business costs
              are then removed.
            </li>
            <li>
              <strong>Hours:</strong> sessions per week for in-person; clients × hours per client
              for online.
            </li>
            <li>
              <strong>Effective hourly:</strong> annual take-home divided by coaching hours across
              your working weeks.
            </li>
          </ul>
          <p>
            Take-home here means what is left before income tax. It does not include unpaid time
            spent on admin, marketing, programming and travel, which can add 30 to 50 percent to a
            trainer's working week. Keep that in mind when you compare the effective hourly figure
            with other jobs.
          </p>
        </>
      ),
    },
    {
      heading: "The four numbers that decide your income",
      body: (
        <>
          <ol>
            <li>
              <strong>Price.</strong> The single biggest lever. A 10 percent rise in price, if
              clients stay, is a 10 percent rise in revenue with no extra hours.
            </li>
            <li>
              <strong>Volume.</strong> How many sessions or clients you sell. Volume is capped by
              your time and energy, and burnout is a real limit.
            </li>
            <li>
              <strong>Retention.</strong> How long clients stay. Replacing a client costs time and
              money in marketing and onboarding; keeping one costs neither.
            </li>
            <li>
              <strong>Costs.</strong> Gym rent or split, insurance, software, equipment, travel,
              continuing education. Small monthly costs add up across a year.
            </li>
          </ol>
          <p>
            Most trainers focus on volume and work longer hours. The calculator makes it easy to see
            that the same income can usually be reached with fewer hours by adjusting price,
            reducing a gym split or moving some clients online.
          </p>
        </>
      ),
    },
    {
      heading: "Gym employee, rent-paying freelancer or online coach",
      body: (
        <>
          <p>
            Trainers usually work under one of three arrangements, and each has a different income
            profile.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Setup</th>
                  <th scope="col">How you are paid</th>
                  <th scope="col">Typical trade-off</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gym employee</td>
                  <td>Hourly wage or a small share of session fees</td>
                  <td>Low risk, steady clients from the gym, lower income ceiling</td>
                </tr>
                <tr>
                  <td>Freelancer in a gym</td>
                  <td>You keep session fees, pay rent or a percentage</td>
                  <td>Higher income per session, you find your own clients</td>
                </tr>
                <tr>
                  <td>Independent studio</td>
                  <td>You keep everything, pay all the costs</td>
                  <td>Highest ceiling, highest fixed costs and risk</td>
                </tr>
                <tr>
                  <td>Online coach</td>
                  <td>Monthly fees per client</td>
                  <td>Not limited by sessions, depends on retention and delivery systems</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Many trainers combine models: in-person sessions for local clients and online coaching
            for clients who have moved away, cannot afford weekly sessions or prefer more
            independence. A hybrid model often raises income while reducing hours on the gym floor.
          </p>
        </>
      ),
    },
    {
      heading: "Why the effective hourly rate matters",
      body: (
        <>
          <p>
            A session rate of 50 sounds like 50 an hour. After a 20 percent gym split and business
            costs, it may be closer to 37, and once unpaid admin time is counted, perhaps 25 to 30.
            That gap is why many trainers feel busy but underpaid.
          </p>
          <p>
            Knowing your real hourly figure helps with decisions such as whether to travel to a
            client's home, whether to take on a client at a discount, or whether a new piece of
            software is worth paying for. If a tool saves you two hours a week and costs less than
            two hours of your effective rate, it pays for itself.
          </p>
        </>
      ),
    },
    {
      heading: "Raising your income without working more",
      body: (
        <>
          <ul>
            <li>
              <strong>Raise prices for new clients first.</strong> Existing clients can stay on
              their rate for a while, while new clients join at the higher price.
            </li>
            <li>
              <strong>Sell packages instead of single sessions.</strong> Paying for a block of
              sessions or a monthly plan reduces cancellations and smooths income.
            </li>
            <li>
              <strong>Add an online tier.</strong> A lower-priced online programme serves clients
              who cannot afford weekly sessions and fills the gaps in your diary.
            </li>
            <li>
              <strong>Reduce no-shows.</strong> A clear cancellation policy and reminders protect
              the income you have already booked.
            </li>
            <li>
              <strong>Improve retention.</strong> Each extra month a client stays is revenue you do
              not have to replace.
            </li>
            <li>
              <strong>Cut costs that do not earn their keep.</strong> Review subscriptions and
              memberships once a year.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Working weeks and seasonality",
      body: (
        <>
          <p>
            Few trainers work 52 weeks a year. Holidays, illness, training courses and quiet periods
            around the new year and summer all reduce the weeks you sell sessions. The calculator
            defaults to 48 working weeks, which leaves four weeks for holidays, but you should
            adjust it to your own history. In-person income falls directly with fewer working weeks;
            online income usually does not, because clients keep paying their monthly fee while you
            are away, provided their programme continues.
          </p>
          <p>
            Seasonality matters too. January and September tend to bring a rush of new clients,
            while December and summer are often quieter. Building a cash buffer of two to three
            months of costs helps smooth those swings.
          </p>
        </>
      ),
    },
    {
      heading: "Pay yourself like a business",
      body: (
        <>
          <p>
            It helps to separate your business money from your personal money. Pay business costs
            from a business account, set aside a percentage of every payment for tax, and pay
            yourself a regular amount. That way, a strong month does not lead to overspending, and a
            quiet month does not cause panic. The take-home figure from this calculator is a good
            starting point for that regular amount, minus whatever you need to set aside for tax
            where you live.
          </p>
        </>
      ),
    },
    {
      heading: "Scaling an online coaching business",
      body: (
        <>
          <p>
            Online coaching removes the hard limit of sessions in a day, but it introduces a
            different limit: how many clients you can serve well. As client numbers grow, the time
            spent writing programmes, answering messages and reviewing check-ins grows with them.
            Without systems, quality drops and clients leave, which undoes the growth.
          </p>
          <p>
            Coaches who scale successfully usually standardise what they can, such as programme
            templates, onboarding steps and check-in forms, and personalise what matters most, such
            as feedback and adjustments. Reducing hours per client from an hour to 30 or 40 minutes
            a week, without reducing quality, is often the difference between capping out at 25
            clients and comfortably coaching 50.
          </p>
        </>
      ),
    },
    {
      heading: "A worked in-person example",
      body: (
        <>
          <p>
            A freelance trainer charges 50 a session and runs 25 sessions a week in a gym that keeps
            20 percent. She works 48 weeks a year and spends 300 a month on insurance, software,
            equipment and continuing education.
          </p>
          <ol>
            <li>Annual revenue: 50 × 25 × 48 = 60,000.</li>
            <li>After the gym split: 60,000 × 0.8 = 48,000.</li>
            <li>After costs: 48,000 − 3,600 = 44,400 a year, or 3,700 a month.</li>
            <li>Effective hourly: 44,400 ÷ (25 × 48) = 37 per coaching hour.</li>
          </ol>
          <p>
            If she raises her rate to 55 for new clients and keeps the same volume, annual take-home
            rises to 49,200, an increase of 4,800 for no extra hours. If instead she moved five of
            her weekly sessions to online clients at 150 a month, she would free five hours a week
            while adding steady monthly income that continues during her holidays.
          </p>
        </>
      ),
    },
    {
      heading: "A worked online example",
      body: (
        <>
          <p>
            An online coach has 30 clients at 150 a month and spends about 45 minutes per client
            each week on check-ins, programme updates and messages. Monthly revenue is 4,500. After
            300 a month in costs, take-home is 4,200 a month, or 50,400 a year, for 22.5 hours of
            client work a week. Across 48 working weeks, that is about 47 per coaching hour.
          </p>
          <p>
            The key difference from in-person coaching is that this income does not stop when the
            coach takes a week off, as long as clients continue to receive their programmes and
            support. That makes online coaching more resilient to illness and holidays, but it
            depends heavily on retention: losing five clients costs 750 a month until they are
            replaced.
          </p>
        </>
      ),
    },
    {
      heading: "The hidden hours",
      body: (
        <>
          <p>
            Coaching hours are only part of a trainer's working week. Writing programmes, answering
            messages, posting content, chasing payments, travelling between clients, doing accounts
            and keeping up with education can add 10 to 20 hours a week. Those hours are unpaid
            unless the price covers them. A trainer earning 37 per coaching hour across 25 sessions
            who also works 12 unpaid admin hours is really earning around 25 per hour worked.
          </p>
          <p>
            Tracking where your time goes for a fortnight is one of the most useful exercises a
            self-employed coach can do. It usually reveals tasks that could be streamlined,
            templated, automated or dropped, and each hour saved raises your true hourly rate.
          </p>
        </>
      ),
    },
    {
      heading: "Income and burnout",
      body: (
        <>
          <p>
            Many trainers try to raise income by adding sessions. Beyond 30 to 35 sessions a week,
            energy, session quality and personal life usually suffer, and clients notice. Burnout is
            one of the most common reasons trainers leave the profession. Sustainable income growth
            tends to come from higher prices, better retention, smarter scheduling and adding
            scalable services such as online coaching or small-group training, rather than from
            ever-longer days on the gym floor.
          </p>
          <p>
            Small-group training is worth considering. Training three or four clients together at a
            lower individual price can earn more per hour than one-to-one sessions while keeping
            prices accessible for clients.
          </p>
        </>
      ),
    },
    {
      heading: "Comparing employment and self-employment",
      body: (
        <>
          <p>
            When comparing a salaried gym job with self-employment, compare like with like. An
            employed trainer may receive paid holiday, sick pay, employer pension contributions and
            free use of facilities, none of which a self-employed trainer gets unless their prices
            cover them. A self-employed trainer needs to earn noticeably more per hour to end up
            with the same overall package. A useful rule of thumb is that self-employed income
            should be at least 20 to 30 percent higher than an equivalent salary to account for
            these differences and the extra risk.
          </p>
          <p>
            Self-employment also brings advantages that are harder to put a number on: control over
            schedule, choice of clients, the ability to raise prices and the potential to build
            something that grows beyond your own hours.
          </p>
        </>
      ),
    },
    {
      heading: "Taxes and setting money aside",
      body: (
        <>
          <p>
            Self-employed trainers are responsible for their own taxes. The safest habit is to move
            a fixed percentage of every payment into a separate account as soon as it arrives, so
            the money is there when tax is due. The right percentage depends on where you live and
            your income level; an accountant can help you set it in your first year. Many trainers
            are caught out by their first tax bill because they spent money that was never really
            theirs.
          </p>
        </>
      ),
    },
    {
      heading: "Building a client pipeline",
      body: (
        <>
          <p>
            Income depends on a steady flow of new clients to replace those who leave and to fill
            new capacity. Referrals from happy clients are usually the best source, because referred
            clients trust you already and tend to stay longer. Asking for referrals at natural
            moments, such as when a client hits a goal, and making it easy for them to share, is
            often more effective than paid advertising. Content, partnerships with local businesses
            such as physiotherapists, and a clear online presence add further channels.
          </p>
          <p>
            Tracking where each client came from helps you focus effort on the channels that work.
            The referral value calculator shows what a single referring client is worth to your
            business over time.
          </p>
        </>
      ),
    },
    {
      heading: "Review your numbers every quarter",
      body: (
        <>
          <p>
            Income, costs and client numbers change gradually, and small changes are easy to miss.
            Every three months, run this calculator with your actual figures: average sessions or
            clients, current prices, real costs. Compare the result with the previous quarter and
            with your target. That habit turns vague feelings about whether the business is doing
            well into clear numbers, and it shows early whether a price change, new service or
            marketing effort is working.
          </p>
        </>
      ),
    },
    {
      heading: "Hybrid coaching",
      body: (
        <>
          <p>
            Many trainers find that a hybrid model, combining in-person sessions with online
            coaching, gives the best balance of income, variety and resilience. In-person clients
            provide steady local work and referrals, while online clients add income that does not
            depend on being in the gym and continues during holidays. A common pattern is to offer
            existing in-person clients a lower-frequency hybrid option, such as one session a week
            plus an online programme, which keeps them engaged while freeing time to take on more
            clients.
          </p>
          <p>
            To estimate hybrid income, run the calculator twice, once for the in-person part and
            once for the online part, using the hours you plan to spend on each, and add the
            take-home figures together. Remember to count business costs only once.
          </p>
        </>
      ),
    },
    {
      heading: "Small-group and semi-private training",
      body: (
        <>
          <p>
            Training two to six clients together at a lower individual price can raise hourly income
            substantially. For example, four clients at 25 a session each bring in 100 an hour,
            double a typical one-to-one rate, while each client pays half the usual price. Small
            groups also build community, which tends to improve retention. The trade-offs are less
            individual attention and more complex scheduling, so groups work best for clients with
            similar goals and abilities.
          </p>
        </>
      ),
    },
    {
      heading: "Pricing in different markets",
      body: (
        <>
          <p>
            Session rates vary widely between countries, cities and neighbourhoods, which is why the
            calculator lets you switch currency. Compare your prices with trainers of similar
            experience in your area, but do not let the market alone set your price. Use the
            coaching rate calculator to check that your price supports the income you need, then
            decide how to position yourself: as an affordable option, a premium specialist, or
            somewhere between. Each can work if the numbers add up and the offer matches the clients
            you want to attract.
          </p>
        </>
      ),
    },
    {
      heading: "Planning for growth",
      body: (
        <>
          <p>
            Once your income and hours are where you want them, the next question is often how to
            grow without working more. Options include raising prices as demand grows, adding online
            services, hiring an assistant coach to handle some clients, creating group programmes,
            or developing products such as templates or courses. Each has costs and risks. Running
            the numbers before committing, with this calculator and the assistant coach ROI
            calculator, helps avoid expanding in ways that add work without adding enough income.
          </p>
        </>
      ),
    },
    {
      heading: "Cancellations and no-shows",
      body: (
        <>
          <p>
            Cancelled and missed sessions are a hidden drain on in-person income. If two of your 25
            weekly sessions are cancelled at short notice and not charged, you lose about 8 percent
            of your revenue. Over a year at 50 a session, that is around 4,800. A clear cancellation
            policy, such as charging for sessions cancelled with less than 24 hours' notice, along
            with reminders the day before, protects that income. Selling sessions in prepaid
            packages or monthly memberships also reduces cancellations, because clients are less
            likely to skip sessions they have already paid for.
          </p>
          <p>
            The no-show cost calculator shows exactly what missed sessions cost your business and
            how much a deposit or cancellation policy could recover.
          </p>
        </>
      ),
    },
    {
      heading: "Retention and income stability",
      body: (
        <>
          <p>
            For online coaches especially, income stability depends on how long clients stay. A
            coach with 30 clients and 10 percent monthly churn loses three clients a month and must
            find three new ones just to stay level. With 5 percent churn, that falls to one or two.
            The difference is not only income but time and stress, because finding new clients takes
            effort that could otherwise go into coaching. Improving retention, through strong
            onboarding, clear progress tracking and regular contact, is one of the most effective
            ways to make income more predictable.
          </p>
        </>
      ),
    },
    {
      heading: "Setting income goals",
      body: (
        <>
          <p>
            A useful way to set an income goal is to start from what you need for your life,
            including savings, holidays and tax, then work out what that requires from the business.
            This calculator shows what you earn now; the coaching rate calculator works backwards
            from the income you want. Using both together turns a vague hope of earning more into a
            specific plan: a target price, a number of clients or sessions, and the hours you are
            willing to work.
          </p>
        </>
      ),
    },
    {
      heading: "Income from multiple services",
      body: (
        <>
          <p>
            Many trainers earn from more than one source: one-to-one sessions, small groups, online
            programmes, workshops, and sometimes nutrition coaching where they are qualified to
            offer it. Each has a different hourly value and different demands. Listing every
            service, the income it brings and the hours it takes, and then calculating the effective
            hourly rate for each, often reveals that one or two services earn far more per hour than
            the rest. Shifting time toward those services, and either raising the price of or
            phasing out the lowest-earning ones, is a straightforward way to raise income without
            working longer.
          </p>
          <p>
            Keep an eye on how much of your income depends on a single source. A business built
            entirely on one gym's clients or one platform is vulnerable if that source changes.
            Spreading income across a few services and client channels makes it more resilient.
          </p>
        </>
      ),
    },
    {
      heading: "Income and qualifications",
      body: (
        <>
          <p>
            Further qualifications, such as specialist certifications in strength and conditioning,
            rehabilitation, pre- and postnatal training or nutrition, can support higher rates and
            open new client groups. Before paying for a course, estimate how many extra clients or
            how much higher a price it would realistically support, and how long it would take to
            recover the cost. A qualification that lets you charge 10 more per session across 20
            sessions a week pays back a 1,500 course in under two months.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Turn your income numbers into a plan to raise them",
    whenToUse:
      "When you have your current income figures and want concrete steps to reach a higher target without burning out.",
    pasteIn:
      "Your current results from the calculator, your target income, how many hours you want to work, and how you coach now.",
    text: `I'm a personal trainer. My numbers from an income calculator:
Model: [in-person / online / hybrid]
Monthly revenue: [amount]
Monthly take-home: [amount]
Coaching hours per week: [hours]
Effective hourly: [amount]

My target: [monthly take-home] working no more than [hours] a week.
My clients: [who they are, where they come from]

1. Show me two or three different combinations of price, client numbers and model that hit the target.
2. For each, list the biggest risk and how to reduce it.
3. Suggest the first three actions I should take this month.
4. Keep the advice specific to a solo coach with no staff.`,
  },
  forCoaches: {
    heading: "Using these numbers in your business",
    body: (
      <>
        <p>
          Run the calculator twice: once with your real numbers today, and once with the business
          you want in a year. The difference between the two is your plan. It usually shows that the
          gap is closed by a mix of price, retention and model rather than by working more hours.
        </p>
        <p>
          Revisit it every quarter. Prices, client numbers and costs drift, and small changes
          compound. A quarterly check takes ten minutes and keeps the business pointed where you
          want it to go.
        </p>
        <p>
          Share the effective hourly figure with yourself honestly. It is the most useful number for
          deciding what work to take on and what to stop doing.
        </p>
      </>
    ),
  },
  pitch: {
    key: "client-app",
    heading: "Keep more clients, for longer",
    body: (
      <>
        <p>
          Traiv gives your clients an app under your name with their workouts, diet plans and
          check-ins in one place, so the coaching they pay for is visible every day, which is what
          keeps them paying.
        </p>
      </>
    ),
  },
  next: [
    { label: "Work out what you should charge", href: "/tools/coaching-rate-calculator" },
    {
      label: "See what your current price really earns",
      href: "/tools/coaching-profit-calculator",
    },
  ],
  nextPitch: "Growing your coaching business? Traiv keeps clients engaged between sessions.",
  faq: [
    {
      q: "How much does a personal trainer earn?",
      a: "It varies widely with price, client numbers, location and setup. A full-time freelance trainer selling 20 to 30 sessions a week typically earns a solid professional income; gym-employed trainers usually earn less but with lower risk.",
    },
    {
      q: "What is a gym split?",
      a: "The share of session fees a gym keeps when you train clients on its premises, often 20 to 50 percent for freelancers. Some gyms charge fixed rent instead.",
    },
    {
      q: "Is online coaching more profitable than in-person?",
      a: "It can be, because income is not limited by sessions in a day. Profitability depends on price, retention and how efficiently you deliver the coaching.",
    },
    {
      q: "How many sessions a week can a trainer sustain?",
      a: "Many full-time trainers find 20 to 30 sessions a week sustainable alongside admin. Above about 35, energy and session quality often suffer.",
    },
    {
      q: "Does this include tax?",
      a: "No. Take-home here is before income tax. Set aside a share of every payment for tax according to the rules where you live.",
    },
    {
      q: "Why is my effective hourly rate lower than my session rate?",
      a: "The gym split and business costs are removed before dividing by coaching hours. Unpaid admin time, not counted here, lowers it further.",
    },
    {
      q: "How many working weeks should I enter?",
      a: "Use your real history. 46 to 48 weeks is common after holidays, illness and training courses.",
    },
    {
      q: "Should I charge per session or per month?",
      a: "Monthly packages tend to give more stable income and fewer cancellations. Per-session pricing can suit occasional clients.",
    },
    {
      q: "What costs should I include?",
      a: "Gym rent or fees, insurance, software, equipment, travel, marketing, education and certification renewals, phone and any accounting help.",
    },
  ],
  keepGoing: [
    { label: "Coaching rate calculator", href: "/tools/coaching-rate-calculator" },
    { label: "Coaching profit calculator", href: "/tools/coaching-profit-calculator" },
    { label: "Client capacity calculator", href: "/tools/client-capacity-calculator" },
    { label: "See the client app", href: "/features/client-app" },
  ],
  close: {
    heading: "Spend your hours coaching, not chasing",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
