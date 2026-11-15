import type { ToolCopy } from "../types";

/* Original copy, written for Traiv (ADR 0036). */

export const copy: ToolCopy = {
  title: "Creatine Dosage Calculator: Loading and Daily Dose",
  description:
    "Free creatine calculator. Get a daily maintenance dose and an optional loading phase scaled to body weight, with how long it takes for muscles to fill.",
  eyebrow: "Free tool · Nutrition",
  h1: "Creatine dosage calculator",
  intro: (
    <>
      <p>
        Creatine monohydrate is one of the most researched supplements in sport, and one of the few
        with consistent evidence behind it. This calculator gives you a daily maintenance dose and,
        if you want faster results, a loading dose scaled to your body weight, along with how long
        it takes for your muscles to become fully saturated.
      </p>
    </>
  ),
  method: "ISSN position stand: loading at 0.3 g/kg/day, maintenance at 3 to 5 g/day",
  sources: [
    {
      label:
        "Kreider RB, et al. International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. J Int Soc Sports Nutr, 2017.",
      href: "https://pubmed.ncbi.nlm.nih.gov/28615996/",
    },
    {
      label: "Hultman E, et al. Muscle creatine loading in men. J Appl Physiol, 1996.",
      href: "https://pubmed.ncbi.nlm.nih.gov/8828669/",
    },
    {
      label:
        "Antonio J, et al. Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show? J Int Soc Sports Nutr, 2021.",
      href: "https://pubmed.ncbi.nlm.nih.gov/33557850/",
    },
  ],
  shortAnswer: {
    question: "How much creatine should you take?",
    answer: (
      <>
        <p>
          3 to 5 g of creatine monohydrate a day is enough for most people. Larger and very muscular
          people may benefit from a little more, around 0.03 g per kg of body weight. Taken daily,
          this fills your muscles' creatine stores in about three to four weeks.
        </p>
        <p>
          If you want results sooner, you can load: about 0.3 g per kg a day (around 20 to 25 g for
          most people), split into four doses, for five to seven days, then drop to the maintenance
          dose. Loading reaches the same end point faster; it does not lead to higher stores.
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
              <strong>Maintenance:</strong> 0.03 g per kg of body weight, rounded to the nearest
              half gram and kept between 3 and 10 g. For most people this lands at 3 to 5 g.
            </li>
            <li>
              <strong>Loading:</strong> 0.3 g per kg a day for seven days, split into four equal
              doses through the day.
            </li>
            <li>
              <strong>Saturation:</strong> about seven days with loading, and about 28 days at the
              maintenance dose alone.
            </li>
          </ul>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Body weight</th>
                  <th scope="col">Maintenance</th>
                  <th scope="col">Loading (7 days)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>60 kg (132 lb)</td>
                  <td>3 g</td>
                  <td>18 g a day</td>
                </tr>
                <tr>
                  <td>75 kg (165 lb)</td>
                  <td>3 g</td>
                  <td>23 g a day</td>
                </tr>
                <tr>
                  <td>90 kg (198 lb)</td>
                  <td>3 g</td>
                  <td>27 g a day</td>
                </tr>
                <tr>
                  <td>120 kg (265 lb)</td>
                  <td>3.5 g</td>
                  <td>36 g a day</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The 3 g minimum reflects the doses used in most long-term studies; very large people may
            choose 5 g a day for simplicity, which is also well supported.
          </p>
        </>
      ),
    },
    {
      heading: "What creatine does",
      body: (
        <>
          <p>
            Creatine is stored in muscle mostly as phosphocreatine, which rapidly regenerates ATP,
            the molecule muscles use for energy during short, intense efforts. More stored creatine
            means you can sustain maximal efforts slightly longer, such as an extra rep or two in a
            hard set, or a faster finish to a sprint. Over weeks and months, that extra training
            work translates into greater gains in strength and muscle.
          </p>
          <p>
            Your body makes about 1 g of creatine a day and a typical diet containing meat and fish
            provides another 1 to 2 g. Muscles are usually around 60 to 80 percent full.
            Supplementing fills them close to 100 percent, which is why the effect is noticeable but
            modest, and why vegetarians and vegans, whose stores are lower to begin with, often see
            larger benefits.
          </p>
        </>
      ),
    },
    {
      heading: "What the evidence shows",
      body: (
        <>
          <p>Hundreds of studies have examined creatine. Consistent findings include:</p>
          <ul>
            <li>
              <strong>Strength and power.</strong> On average, creatine plus resistance training
              increases strength more than training alone, typically by a few percent over several
              weeks.
            </li>
            <li>
              <strong>Muscle mass.</strong> Greater gains in lean mass when combined with training,
              partly from extra training volume and partly from water inside muscle cells.
            </li>
            <li>
              <strong>Repeated sprints.</strong> Better performance in sports with repeated short
              bursts, such as football, rugby and racket sports.
            </li>
            <li>
              <strong>Recovery.</strong> Some evidence for reduced muscle damage and faster recovery
              after hard sessions.
            </li>
          </ul>
          <p>
            Effects on long, steady endurance performance are small or absent. Emerging research
            also looks at creatine for brain health and in older adults; the results so far are
            promising but less certain.
          </p>
        </>
      ),
    },
    {
      heading: "To load or not to load",
      body: (
        <>
          <p>
            Loading and the slow approach end up in the same place. A classic 1996 study found that
            20 g a day for six days raised muscle creatine by about 20 percent, and that 3 g a day
            for 28 days produced the same increase. Loading simply gets there in a week instead of a
            month.
          </p>
          <p>
            Loading suits people who want the benefit quickly, for example before a competition or a
            training block. The trade-offs are more water weight in the first week and, for some
            people, stomach discomfort from the larger doses, which splitting the dose across the
            day helps prevent. If there is no rush, the slow approach is simpler and gentler.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine and water weight",
      body: (
        <>
          <p>
            Creatine draws water into muscle cells, so most people gain 0.5 to 2 kg in the first
            weeks, more quickly with loading. This is water inside the muscle, not fat or bloating
            under the skin, and it plateaus once stores are full. It is worth knowing about if you
            are tracking weight closely during a diet, so a sudden jump on the scale does not cause
            concern.
          </p>
        </>
      ),
    },
    {
      heading: "Is creatine safe?",
      body: (
        <>
          <p>
            Creatine monohydrate is one of the most studied supplements available. In healthy
            people, research covering doses up to around 30 g a day for five years has not shown
            harmful effects on the kidneys or liver. A 2021 review addressing common concerns found
            no good evidence that creatine causes hair loss, dehydration, cramping or kidney damage
            in healthy users.
          </p>
          <p>
            Creatine does raise blood creatinine slightly, a marker doctors use to assess kidney
            function, so tell your doctor you take it before a blood test. People with existing
            kidney disease, or who take medications that affect the kidneys, should speak to their
            doctor first.
          </p>
        </>
      ),
    },
    {
      heading: "Choosing a creatine supplement",
      body: (
        <>
          <p>
            Plain creatine monohydrate is the form used in nearly all the research, and it is
            inexpensive. Other forms, such as creatine hydrochloride, buffered creatine or creatine
            ethyl ester, are often marketed as better absorbed or needing smaller doses, but none
            has been shown to work better than monohydrate. Micronised monohydrate mixes more easily
            into drinks and is otherwise the same. Choose a product tested by an independent body if
            you compete in drug-tested sport.
          </p>
        </>
      ),
    },
    {
      heading: "When and how to take it",
      body: (
        <>
          <p>
            Timing makes little difference because the goal is to keep muscles saturated, not to get
            a quick effect from each dose. Take it at whatever time you will remember every day.
            Some research suggests a small advantage to taking it near training, especially with a
            meal containing carbohydrate and protein, which may help uptake into muscle. Mixing it
            into a protein shake, yoghurt or any drink works well. Taking it with food can also help
            if you notice any stomach upset.
          </p>
          <p>
            Consistency is what matters. Missing occasional days has little effect, because stores
            fall slowly. If you stop entirely, levels return to normal over about four to six weeks.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine for women",
      body: (
        <>
          <p>
            Most early creatine research was done with men, but a growing body of work in women
            shows similar benefits for strength, power and lean mass when combined with resistance
            training. Women typically have lower baseline muscle creatine levels and may respond
            particularly well to supplementation. Research also points to possible benefits around
            menopause, when declines in oestrogen are associated with faster loss of muscle and
            bone, although more studies are needed to confirm these effects.
          </p>
          <p>
            The dosing approach is the same: 3 to 5 g a day, with or without a loading phase. Some
            women are cautious about the initial water weight. It is small, sits inside muscle
            rather than under the skin, and levels off once stores are full.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine for older adults",
      body: (
        <>
          <p>
            Muscle mass and strength decline with age, a process called sarcopenia. Several studies
            in older adults have found that creatine combined with resistance training produces
            greater gains in strength and lean mass than training alone. Some studies also report
            improvements in bone density and everyday functional tasks such as rising from a chair.
            Creatine is not a replacement for training, but it may make the training older adults do
            more effective.
          </p>
          <p>
            Older adults are more likely to have kidney problems or take medications that affect the
            kidneys, so speaking with a doctor before starting creatine is especially sensible in
            this group.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine and the brain",
      body: (
        <>
          <p>
            The brain also uses creatine for energy, and a newer line of research is exploring
            whether supplementation helps cognition, especially under stress such as sleep
            deprivation, or in groups with lower creatine intake, such as vegetarians and older
            adults. Results so far are mixed but interesting, with some studies finding benefits for
            memory and mental fatigue. Brain creatine levels seem to increase more slowly than
            muscle levels and may require higher doses, so these effects should be treated as
            possible rather than proven.
          </p>
        </>
      ),
    },
    {
      heading: "Who may not benefit much",
      body: (
        <>
          <p>
            Not everyone responds equally. People who already eat a lot of meat and fish start with
            higher muscle creatine and tend to see smaller increases. A minority of people,
            sometimes called non-responders, show little change in muscle creatine with
            supplementation. Endurance athletes training for long, steady events typically see
            little performance benefit and may not want the extra water weight. For anyone who lifts
            weights or plays sports with repeated short, intense efforts, though, creatine is one of
            the more reliably useful supplements available.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine during a diet",
      body: (
        <>
          <p>
            Taking creatine while losing fat can help maintain strength and training quality when
            calories are low, which in turn helps preserve muscle. The main issue is the scale. The
            extra water inside muscle can mask fat loss for several weeks after starting. If you
            start creatine during a diet, expect the scale to stall or rise slightly for the first
            few weeks even if fat loss continues, and use waist measurements and the weekly trend to
            judge progress.
          </p>
          <p>
            The simplest approach is to start creatine before a diet begins, so its water gain has
            settled by the time you are tracking fat loss.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine from food",
      body: (
        <>
          <p>
            Creatine occurs naturally in meat and fish. Raw beef and pork contain roughly 4 to 5 g
            per kg, and fish such as herring and salmon contain similar or slightly higher amounts.
            Cooking destroys some of it. To get 3 to 5 g a day from food alone, you would need to
            eat close to a kilogram of meat or fish daily, which is impractical for most people.
            That is why supplements are the usual way to raise muscle creatine levels. Plant foods
            contain essentially no creatine, so vegetarians and vegans rely entirely on what the
            body makes.
          </p>
        </>
      ),
    },
    {
      heading: "Common myths",
      body: (
        <>
          <ul>
            <li>
              <strong>Creatine is a steroid.</strong> It is not. It is a compound made from amino
              acids that the body produces naturally and that occurs in food.
            </li>
            <li>
              <strong>It causes dehydration and cramps.</strong> Controlled studies have not found
              this; some find fewer cramps in athletes taking creatine.
            </li>
            <li>
              <strong>It damages kidneys.</strong> Long-term studies in healthy people show no harm.
              People with kidney disease should still consult a doctor.
            </li>
            <li>
              <strong>You must cycle it.</strong> There is no evidence that taking breaks is
              necessary or beneficial.
            </li>
            <li>
              <strong>More is better.</strong> Once muscles are saturated, extra creatine is
              excreted. Higher doses do not add benefit.
            </li>
            <li>
              <strong>It only works for bodybuilders.</strong> It benefits anyone doing repeated
              high-intensity efforts, including team sport athletes and older adults doing strength
              training.
            </li>
          </ul>
        </>
      ),
    },
    {
      heading: "Taking creatine with other supplements",
      body: (
        <>
          <p>
            Creatine can be taken alongside protein powder, caffeine, and most common supplements
            without problems. Taking it with a meal that contains carbohydrate and protein may
            slightly increase how much reaches muscle, which is one reason many people mix it into a
            post-workout shake. Pre-workout products sometimes contain creatine, but often in doses
            too small to matter; check the label, and if it contains less than 3 g, take a separate
            dose to reach your daily target.
          </p>
        </>
      ),
    },
    {
      heading: "How to tell if it is working",
      body: (
        <>
          <p>
            Creatine's effects are gradual. Over four to eight weeks, look for slightly more reps at
            a given weight, a little more volume before fatigue, or faster recovery between sets.
            Keep a training log so you can compare objectively, because day-to-day variation in
            sleep, stress and food can easily hide a small but real improvement. A modest rise on
            the scale in the first weeks, from water in muscle, is a sign that muscle stores are
            filling.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine and sports performance",
      body: (
        <>
          <p>
            Creatine is most useful in sports with repeated short bursts of high-intensity effort
            separated by brief recovery: football, rugby, basketball, hockey, tennis and combat
            sports, as well as sprinting, jumping and throwing events. In these sports it can help
            maintain power across repeated sprints and support the strength and conditioning work
            done in training. Many professional teams include it in their nutrition programmes.
          </p>
          <p>
            For weight-class sports, the water gain from creatine needs to be planned around
            weigh-ins. For long-distance endurance sports, the extra weight may be a slight
            disadvantage that outweighs the limited performance benefit, although it may still help
            in training that includes intervals or strength work.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine for vegetarians and vegans",
      body: (
        <>
          <p>
            Because meat and fish are the main dietary sources, vegetarians and vegans usually have
            lower muscle creatine stores. Studies consistently show that they see larger increases
            in muscle creatine with supplementation, and some research suggests they may also see
            greater improvements in strength and cognitive measures. Most creatine monohydrate is
            produced synthetically rather than from animal products, so it is generally suitable for
            vegans, though checking the capsule material or certification is worthwhile if that
            matters to you.
          </p>
        </>
      ),
    },
    {
      heading: "Stopping creatine",
      body: (
        <>
          <p>
            If you stop taking creatine, muscle stores return to their normal level over roughly
            four to six weeks, and the extra water held in muscle goes with them, so the scale often
            drops by a similar amount to the original gain. Strength gained through training while
            taking creatine is not lost when you stop, though you may notice slightly less capacity
            for very high volumes of hard work. There are no withdrawal effects, and your body's own
            creatine production returns to normal.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine during injury or time off",
      body: (
        <>
          <p>
            Some research suggests creatine may help reduce the loss of muscle and strength when a
            limb is immobilised after injury, and may support recovery afterward, although results
            are not consistent across studies. Because creatine is safe and inexpensive, some
            athletes continue taking it through injury periods for that reason. If you take a break
            from training for other reasons, there is no need to stop creatine, and continuing means
            you will not need to rebuild your stores when you return.
          </p>
        </>
      ),
    },
    {
      heading: "Quality and contamination",
      body: (
        <>
          <p>
            Supplements are less tightly regulated than medicines in many countries, and some
            products have been found to contain contaminants or substances banned in sport. For
            creatine, choose plain creatine monohydrate from a reputable brand. If you compete in
            drug-tested sport, look for products certified by an independent testing programme,
            which checks batches for banned substances. Avoid proprietary blends that do not list
            the dose of creatine they contain.
          </p>
        </>
      ),
    },
    {
      heading: "A typical creatine routine",
      body: (
        <>
          <p>
            For most people, the simplest routine is the most reliable. Keep a tub of creatine
            monohydrate next to something you use every day, such as your protein powder, coffee
            maker or breakfast bowl, and add one scoop of 3 to 5 g each morning. If you choose to
            load, use four smaller doses spread across the day for the first week, then switch to
            the single daily dose. Most tubs include a scoop sized for 3 to 5 g; if yours does not,
            a level teaspoon is roughly 3 to 4 g.
          </p>
          <p>
            Creatine monohydrate dissolves better in warm liquids, but it works the same whether
            fully dissolved or not. Stirring it into yoghurt, oats or a smoothie avoids the gritty
            texture some people dislike in cold water.
          </p>
        </>
      ),
    },
    {
      heading: "What to expect over the first two months",
      body: (
        <>
          <p>
            In the first week, especially with loading, the scale may rise by 0.5 to 2 kg as water
            moves into muscle cells. By weeks two to four, many people notice they can complete an
            extra rep or two on hard sets or recover slightly faster between sets. Over two months
            of consistent training, those small improvements add up to more total work, which
            supports greater strength and muscle gain than training alone. If you notice no change
            at all after two months of daily use and consistent training, you may be one of the
            people who respond less to creatine.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine and caffeine",
      body: (
        <>
          <p>
            An early study suggested caffeine might blunt the benefits of creatine, which led to a
            long-standing belief that the two should not be combined. Most later research has not
            confirmed this, and many athletes take both. If you take them together and notice
            stomach discomfort, try separating them, for example taking creatine with breakfast and
            caffeine before training. There is no need to avoid coffee because you take creatine.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine and alcohol",
      body: (
        <>
          <p>
            Alcohol does not directly interfere with creatine, but heavy drinking impairs recovery,
            sleep and muscle protein synthesis, and can cause dehydration. These effects work
            against the training benefits creatine supports. Moderate, occasional drinking is
            unlikely to make a meaningful difference to the effects of creatine itself.
          </p>
        </>
      ),
    },
    {
      heading: "Creatine for teenagers",
      body: (
        <>
          <p>
            Research on creatine in adolescents is limited, though available studies have not shown
            harm. Most sports bodies advise that younger athletes focus on training, sleep and a
            balanced diet first, and only consider creatine with guidance from a doctor or sports
            dietitian, typically in older teenagers involved in structured, supervised training.
          </p>
        </>
      ),
    },
  ],
  prompt: {
    heading: "Plan how creatine fits into your training block",
    whenToUse:
      "When you are starting creatine and want to time it with a training phase and know what changes to watch for.",
    pasteIn:
      "Your body weight, training goal, the date your next block or competition starts, and whether you are dieting.",
    text: `I'm starting creatine monohydrate. From a dosage calculator:
Body weight: [weight]
Maintenance dose: [g] a day
Loading: [yes, g a day for 7 days / no]

My training: [type of training, days per week]
Goal: [strength / muscle / sport performance]
Next block or event starts: [date]
Currently: [dieting / maintaining / gaining]

1. Tell me whether to load or not, given my timeline.
2. Suggest when in the day to take it so I remember every day.
3. Explain how much the scale may change and how to tell water from fat.
4. List two or three measures I can track over 8 weeks to see if it is working.`,
  },
  forCoaches: {
    heading: "Talking about creatine with clients",
    body: (
      <>
        <p>
          Creatine is one of the few supplements worth recommending to most clients who lift, and
          one of the most misunderstood. Many clients assume it is a steroid or that it damages the
          kidneys. A short, evidence-based explanation goes a long way.
        </p>
        <p>
          Time it thoughtfully. Starting creatine in the middle of a fat-loss phase adds water
          weight that can look like a stall. Start it at the beginning of a phase, or warn the
          client in advance.
        </p>
        <p>
          Keep expectations realistic. Creatine helps training a little, consistently, over months.
          It does not replace good training, sleep and nutrition.
        </p>
      </>
    ),
  },
  pitch: {
    key: "workouts",
    heading: "Track the training that creatine supports",
    body: (
      <>
        <p>
          In Traiv you build workout plans for each client and see the weights and reps they log, so
          you can watch strength progress over a block rather than guess at it.
        </p>
      </>
    ),
  },
  next: [
    { label: "Find your one-rep max", href: "/tools/one-rep-max-calculator" },
    { label: "Set your daily protein", href: "/tools/protein-calculator" },
  ],
  nextPitch: "Coaching lifters? Traiv keeps each client's training log and plan together.",
  faq: [
    {
      q: "How much creatine should I take a day?",
      a: "3 to 5 g of creatine monohydrate for most people, or about 0.03 g per kg of body weight for larger individuals.",
    },
    {
      q: "Do I need to load creatine?",
      a: "No. Loading fills your muscles in about a week; 3 to 5 g a day gets you to the same level in three to four weeks.",
    },
    {
      q: "How much is a loading dose?",
      a: "About 0.3 g per kg of body weight a day, usually 20 to 25 g, split into four doses, for five to seven days.",
    },
    {
      q: "When should I take creatine?",
      a: "At any consistent time of day. Taking it with a meal near training may help slightly, but consistency matters more than timing.",
    },
    {
      q: "Does creatine cause weight gain?",
      a: "Usually 0.5 to 2 kg in the first weeks, mostly water stored inside muscle cells, not fat.",
    },
    {
      q: "Is creatine bad for your kidneys?",
      a: "Not in healthy people, according to long-term studies. People with kidney disease should talk to their doctor before taking it.",
    },
    {
      q: "Does creatine cause hair loss?",
      a: "There is no good evidence that it does. The idea comes from one small 2009 study that has never been replicated.",
    },
    {
      q: "Which type of creatine is best?",
      a: "Creatine monohydrate. Other forms have not been shown to work better and usually cost more.",
    },
    {
      q: "Should I cycle creatine?",
      a: "There is no evidence that cycling on and off is necessary. Daily, continuous use is the approach used in most research.",
    },
    {
      q: "Can women take creatine?",
      a: "Yes. Women benefit in similar ways, and research suggests it may support muscle and bone health in older women when combined with strength training.",
    },
    {
      q: "Is creatine useful for vegetarians?",
      a: "Often more so, because vegetarians start with lower muscle creatine stores and tend to see larger increases.",
    },
    {
      q: "Does creatine work without training?",
      a: "Only slightly. Most of its benefit comes from allowing you to train harder, so it works best alongside regular resistance or high-intensity training.",
    },
    {
      q: "Can I take creatine with coffee?",
      a: "Yes. Early concerns that caffeine cancels out creatine's effect have not been confirmed in most later studies, though a few people find the combination upsets their stomach.",
    },
  ],
  disclaimer: (
    <>
      <p>
        This calculator gives general information, not medical advice. If you have kidney disease,
        take medication that affects kidney function, are pregnant or breastfeeding, or are under
        18, talk to a doctor before taking creatine.
      </p>
    </>
  ),
  keepGoing: [
    { label: "One-rep max calculator", href: "/tools/one-rep-max-calculator" },
    { label: "Protein calculator", href: "/tools/protein-calculator" },
    { label: "Bulking calorie calculator", href: "/tools/bulking-calorie-calculator" },
    { label: "How workout plans work in Traiv", href: "/features/plan-builder" },
  ],
  close: {
    heading: "Training plans and logs for every client",
    body: "Traiv is coaching software for personal trainers: workout plans, diet plans, check-ins and the client app, under your name.",
  },
};
