"""Extra original sections for Phase 5c batch 2."""
from phase5_common import s

EXTRA = {
"coaching-prompt-generator": [
    s("Worked example: an onboarding message",
      "For an onboarding message, the full brief tells the AI to thank the client and set a warm tone, explain what happens in the next three to seven days, list what you need from them, such as the intake form, and say when and how they'll hear from you. It adds a rule not to promise specific results or timelines. Choose a warm tone and standard length, add your niche, and the draft usually needs only your name, dates and links before it's ready to send."),
    s("Worked example: a plan draft",
      "For a programming draft, choose 'Outline first'. The AI returns a bullet outline: sessions per week, a simple split, main exercises with sets and reps, how to progress and a lighter first week. You check it against the client's intake, equipment and any medical guidance, correct anything that doesn't fit, and only then ask for the full write-up. That keeps your judgement at the centre of the plan, with the AI doing the typing."),
    s("Worked example: a price-increase message",
      "For a price-increase message, the prompt asks the AI to thank the client, state the new price and start date, explain briefly why and offer any option, such as locking in the current rate with a longer commitment. It asks for a short, confident, respectful message without over-apologising. Fill in the real numbers and date yourself before sending; never let the AI invent them."),
    s("Getting better drafts from AI",
      ("ul", [
          "**Give one task at a time.** A prompt that asks for a caption, an email and a plan gets three mediocre answers.",
          "**Add an example.** Paste a message you've written before and ask the AI to match its style.",
          "**Answer its questions.** The second draft is usually much better than the first.",
          "**Ask for shorter.** 'Cut this by a third' improves most AI drafts.",
          "**Ask for alternatives.** 'Give me three different opening lines' helps you find your angle.",
      ]),
      "Treat the AI like a junior assistant who writes fast but needs clear direction and a careful editor."),
    s("Prompt structure, explained",
      "Each full brief follows the same structure. It starts with context, who you are and who the client is. Then the task, in one sentence. Then a short list of what to include. Then the rules: tone, length, style, what to avoid, and the instruction to ask if anything is missing and to stay away from medical advice. It ends by asking the AI to list its assumptions. That structure works for almost any writing task, so you can adapt it for others."),
    s("Tone, explained",
      ("table", ["Tone", "What the AI is told", "Good for"], [["Warm", "warm, encouraging and human", "Check-in replies, onboarding, testimonials"], ["Direct", "direct, clear and friendly", "Plans, sales replies, price changes"], ["Clinical", "precise, factual and calm", "Programme notes, nutrition guidance"], ["Playful", "light, friendly and a little playful", "Captions and social content"]]),
      "Match the tone to the client and the moment. A difficult check-in usually needs warm, not playful."),
    s("Length, explained",
      "Short asks for under 80 words, which suits DMs, quick check-in replies and testimonial requests. Standard asks for around 120 to 180 words, which suits most messages and captions. Detailed allows up to 300 words, with short headings if useful, which suits onboarding messages, plan outlines and nutrition guidance. If a draft comes back longer than you want, ask the AI to cut it; it usually can without losing anything important."),
    s("Using AI for check-in replies at scale",
      "Some coaches use AI to speed up weekly check-in replies across many clients. Done well, it saves time. Done badly, every client gets the same generic message, and they notice. The safest approach is to read each check-in yourself, decide the one change or focus, and use AI only to draft the wording around your decision. The client check-in reader on this site can help with the decision itself."),
    s("Avoiding invented details",
      "AI tools sometimes invent things: statistics, research findings, client results, quotes. Every prompt asks the AI to ask rather than guess, but always check numbers and claims before using them. If a draft includes a figure you didn't give it, remove it or verify it. Inventing results in marketing is misleading and, in many places, against advertising rules."),
    s("Prompts and your brand voice",
      "Over time, collect examples of messages and posts that sound most like you. Paste two or three into a prompt and ask the AI to match their tone, sentence length and vocabulary. That works far better than describing your voice in abstract terms. Update the examples as your writing develops."),
    s("When the AI gets it wrong",
      "If a draft misses the point, don't start from scratch. Tell the AI specifically what's wrong: 'too formal', 'too long', 'this sounds like a sales pitch', 'you've added a promise I can't make'. Specific feedback gets a better second draft. If it's still wrong after two attempts, write it yourself; some messages are quicker to write than to explain."),
    s("Testimonial requests",
      "The testimonial prompt asks the AI to thank the client, mention their progress specifically, ask two or three simple questions, make it clear they can say no and ask permission before using their name or photos. It tells the AI not to write the testimonial for them. Real testimonials in the client's own words are more persuasive and more honest than polished ones."),
    s("Prompts for nutrition guidance",
      "The nutrition prompt is deliberately limited to general healthy-eating guidance for healthy adults: two or three priorities, practical examples, how to judge whether it's working and what to report next time. It tells the AI not to give advice for treating any medical condition and to flag anything that needs a dietitian or doctor. That keeps drafts within a typical coach's scope."),
    s("A quick checklist before sending",
      ("ol", [
          "Is every fact and number correct?",
          "Is there a specific detail only you would know?",
          "Is it within your scope, with no medical advice?",
          "Does it sound like you when you read it aloud?",
          "Is it as short as it can be?",
      ]),
      "Five yeses, and it's ready to send."),
    s("Privacy and AI services",
      "Before using any AI tool for client work, check its privacy settings and terms. Some services let you turn off training on your conversations or offer business plans with stronger privacy. Even then, keep identifying and health information out of prompts. Your clients trust you with personal details; that trust extends to the tools you use."),
],
"ai-writing-checker": [
    s("Contrast framing, in detail",
      "'It's not about X. It's about Y.' is the single most common pattern in AI-written social posts. It sets up a false opposition to sound insightful, and readers now recognise it instantly. The fix is simple: say Y directly. 'Habits matter more than the diet' or, better, a specific example of a habit that worked. The checker scores this pattern double because it does so much to make a post feel generic."),
    s("Openers that lose readers",
      "Opening with the state of the world, 'In today's fast-paced world', 'Now more than ever', 'In a world where', tells the reader nothing about you or them. The same goes for 'Are you tired of…' and 'Imagine…'. Start instead with something specific: a moment from a session, a number from a client, a question you were asked this week. Specific first lines earn the second line."),
    s("Lists of three",
      "Lists of three abstract qualities, such as discipline, patience and commitment, sound rhythmic but say very little. Pick the one that matters most for the point you're making and give a real example of it. 'Patience: one client took eleven weeks to see the scale move, and her waist had dropped 6 cm by then' is far more persuasive than three virtues in a row."),
    s("Buzzwords and what to say instead",
      ("table", ["Buzzword", "Say instead"], [["Unlock your potential", "Get stronger / lose fat / train consistently"], ["Transform your body", "The specific change: 5 kg, a first pull-up"], ["Your fitness journey", "Your training, your progress"], ["Elevate your game", "Lift more, run faster, recover better"], ["Holistic approach", "Training, food and sleep together"], ["Game-changer", "What actually changed, and how much"]]),
      "Plain words are clearer and, for most readers, more credible."),
    s("Endings that sound like a person",
      "AI drafts often end with a pep talk ('You've got this!') or an offer to help further ('If you'd like, I can…'). Both are filler. End with something useful instead: the next step, an invitation to reply, a clear call to action, or simply the last point. If the post has made its point, it can just stop."),
    s("Punctuation tells",
      "Several exclamation marks in a short post make it sound shouty rather than energetic. Frequent dashes, especially long em dashes in every other sentence, have become a common sign of machine-written text. Use full stops and commas instead, and let the content carry the energy. One well-placed dash is fine; three or more in a short post triggers a flag."),
    s("Hedging and wrap-ups",
      "Phrases like 'It's important to note', 'It's worth noting', 'In conclusion', 'Ultimately' and 'At the end of the day' pad writing without adding meaning. They're common in AI drafts because they appear so often in the text these tools learn from. Delete them and see whether the sentence still works; it usually works better."),
    s("Using the checker in your workflow",
      ("ol", [
          "Draft your caption, email or reply, by hand or with AI.",
          "Paste it into the checker and read the highlights.",
          "Fix each hit using the suggestion beside it.",
          "Check again until the score is 2 or lower.",
          "Read it aloud once, then post or send it.",
      ]),
      "Most drafts take two or three minutes to fix once you know what to look for. After a few weeks, you'll notice the tells as you write."),
    s("Why it runs in your browser",
      "Drafts often include client details, unpublished ideas or business information. The checker runs entirely in your browser, so nothing you paste is sent anywhere or stored. You can check sensitive drafts without worrying about where they end up."),
    s("The limits of a checklist",
      "A score of zero doesn't guarantee good writing; it means none of the fifteen habits were found. Writing can still be unclear, too long or off-topic. Use the checker to remove the most common tells, then judge the rest yourself: is it specific, is it useful, does it sound like you?"),
    s("For coaches writing every day",
      "Coaches write a lot: captions, stories, emails, check-in replies, sales messages. Small improvements across all of them add up. Clients notice when messages sound personal, and followers notice when posts sound like a real coach. Running your most important pieces through the checker each week is a quick way to keep your voice consistent."),
],
}

MORE = {
"coaching-prompt-generator": [
    s("Check-in replies, in detail",
      "A good check-in reply has four parts: one specific thing the client did well, one clear change or focus for next week, a sentence explaining why, and a question that invites them to reply. The prompt asks for exactly that, and tells the AI not to change calories, training or anything medical without your numbers. Decide the change yourself first, then let the AI draft the wording around it."),
    s("Sales and DM replies, in detail",
      "When someone messages you about coaching, the reply should feel like a conversation, not a brochure. The prompt asks the AI to thank them, reflect back what they told you, ask one or two questions about their goal and suggest a clear next step, such as a short call. It rules out pressure tactics and claims you can't support. Edit the questions so they're specific to what the person actually wrote."),
    s("Captions, in detail",
      "The caption prompt asks for a specific, concrete first line, one useful point explained simply, one real detail from your coaching and a single ask. It bans the common tells: clichés, stacked questions, lists of three, emoji and exclamation marks. Give it a real detail, such as a number from a client's week, and the draft will be far less generic. For eight complete captions at once, use the caption generator."),
    s("Prompts for different niches",
      ("table", ["Niche", "Useful client detail to add"], [["Busy parents losing fat", "Training days available, typical evening routine"], ["Women over 40 lifting", "Training history, current main lifts"], ["Runners", "Weekly distance, next race date"], ["Beginners", "Equipment at home, confidence in the gym"], ["Online nutrition clients", "Typical day of eating, cooking time"], ["Strength athletes", "Current maxes, competition date"]]),
      "Add one detail like this to the 'one thing about the client' field, in neutral words, and the draft becomes far more specific."),
    s("Being open with clients about AI",
      "Some clients care whether messages are written with AI help. A simple approach is to use AI for drafting and always send something you've read, edited and would stand behind. If a client asks, be honest: you use tools to work efficiently, and every message and plan is reviewed by you. Never present AI-generated results, testimonials or credentials as real."),
    s("How much time it saves",
      "For many coaches, a good prompt cuts drafting time for a routine message from ten minutes to two or three, including editing. Across dozens of check-ins, welcome messages and captions each week, that adds up to hours. The time saved is most valuable when it goes back into the parts of coaching AI can't do: noticing, deciding and connecting with clients."),
    s("Common prompt mistakes",
      ("ul", [
          "**No context:** the AI doesn't know who you coach or what the client is like.",
          "**Too many tasks:** one prompt, one job.",
          "**No rules:** without limits, drafts drift into clichés, medical claims or long padding.",
          "**Personal data:** names and health details don't belong in public AI tools.",
          "**No editing:** sending the first draft as-is.",
      ]),
      "The generator handles the first three; the last two are up to you."),
    s("Using the outline for content planning",
      "The outline-first version works well beyond single messages. Ask for an outline of a month of captions on one theme, a five-email welcome sequence or a short guide for new clients. Correct the outline, then ask for each piece one at a time. Working this way keeps content consistent and on-message."),
],
"ai-writing-checker": [
    s("Before and after: a caption",
      "Before: 'Are you tired of feeling stuck? It's not about motivation, it's about systems. Let's dive in!' That's an 'are you tired of' hook, contrast framing, throat-clearing and an exclamation mark.",
      "After: 'Most of my clients skip a session because the plan didn't fit their week, not because they lacked motivation. So we plan the week on Sunday.' Specific, plain and useful."),
    s("Before and after: a check-in reply",
      "Before: 'Great job this week! You're truly on an incredible journey. Keep crushing it, you've got this! If you'd like, I can adjust your plan.' Intensifiers, a buzzword, cheerleading and an assistant-style offer.",
      "After: 'Four sessions while travelling is a strong week. Your average weight is down 0.3 kg. Next week, let's keep the plan and add a 20-minute walk on your rest days.' Specific and actionable."),
    s("Before and after: an email",
      "Before: 'In today's busy world, finding balance is harder than ever. Ultimately, it's important to note that consistency, patience, and dedication are key.' A big-picture opener, a wrap-up word, hedging filler and a list of three.",
      "After: 'If your week is packed, two 30-minute sessions done is better than four planned and skipped. Here's the two-session plan I use with busy clients.' Clear and useful."),
    s("Why readers notice",
      "People read a lot of AI-generated text now, and they've learned its patterns, often without being able to name them. When a post opens with 'In today's fast-paced world' or 'It's not about…', many readers stop reading. Removing the patterns doesn't just make writing sound human; it keeps people reading long enough to get your point."),
    s("Different formats, same habits",
      "The tells appear in every format: captions, emails, check-in replies, sales messages, website copy. Check-in replies tend to suffer from cheerleading and intensifiers. Emails tend to suffer from openers, hedging and wrap-ups. Captions tend to suffer from contrast framing, stacked questions and buzzwords. The checker works on all of them."),
    s("Using the checker with a team",
      "If an assistant coach or social media helper writes for you, share the checker with them. Agree that anything going out under your name scores 2 or lower before it's posted or sent. It's a simple, objective standard that keeps your voice consistent, whoever does the first draft."),
],
}
for k, v in MORE.items():
    EXTRA[k] = EXTRA[k] + v

MORE2 = {
"coaching-prompt-generator": [
    s("Onboarding messages, in detail",
      "A welcome message has a big job: it sets the tone for the whole coaching relationship. The prompt asks the AI to thank the client and set a warm tone, explain what happens in the next three to seven days, list what you need from them and say when they'll hear from you. It rules out promises of specific results or timelines. Add your actual links, dates and name before sending, and make sure the steps match your real onboarding. The client onboarding builder on this site can help plan those steps."),
    s("Testimonial and review requests",
      "Asking for a testimonial feels awkward to many coaches, which is exactly when a clear draft helps. Send the request soon after a milestone, while the client feels their progress. Keep it short, make saying no easy and ask permission before using their name or photos. Two or three specific questions, such as what they were struggling with before and what changed, get better answers than 'Could you write me a review?'"),
    s("Price-increase messages, in detail",
      "Price changes are best announced briefly and confidently. The prompt asks for thanks, the new price, the start date, a short reason and any option you offer, such as keeping the current rate with a longer commitment. It asks the AI not to over-apologise. Give at least a month's notice, and check the price increase calculator first to see how many clients you can lose and still come out ahead."),
    s("Using AI for programme ideas",
      "AI can suggest exercise variations, session structures and progressions, which is useful when you want fresh ideas. It doesn't know the client's movement history, injuries, equipment or preferences unless you tell it, and it can suggest unsuitable exercises with total confidence. Use it as a brainstorming partner. Every exercise in a client's plan should be one you've chosen and would coach yourself."),
    s("Using AI for nutrition ideas",
      "AI can generate meal ideas, swaps and shopping lists that fit general targets, which saves time. It can also get calorie and protein numbers wrong, ignore allergies and suggest unsuitable foods. Check any numbers against a reliable source, respect the client's preferences and restrictions, and keep to general guidance. Anything to do with medical conditions belongs with a dietitian or doctor."),
    s("Prompts in other languages",
      "If you coach in another language, change the language instruction in the prompt, for example to 'plain Spanish' or 'simple Hindi'. The rest of the structure works the same. Always have the final message reviewed by someone fluent if you're not, because AI translations can sound unnatural or miss nuance."),
    s("Getting started",
      "Pick the task you write most often, usually check-in replies or captions. Build the prompt, paste it into your AI tool, edit the draft and send it. Note what you changed. After a few uses, add those changes to the prompt itself, so the drafts need less editing each time. That small habit turns a generic prompt into one that sounds like you."),
],
"ai-writing-checker": [
    s("Writing that sounds like a coach",
      "Good coaching writing sounds like a knowledgeable person talking to someone they care about. It's specific: a client's real result, a number from a session, a moment from the week. It's practical: one thing to do next. And it's honest: no exaggerated promises, no false urgency. The checker removes the habits that get in the way of that voice; the voice itself comes from you."),
    s("Email subject lines",
      "Subject lines suffer from the same tells: 'Unlock your best self', 'Are you ready?', 'The secret to success'. Readers have learned to ignore them. A plain, specific subject line, such as 'The 2-session plan for busy weeks' or 'Why your weight jumped after Sunday', is more likely to be opened. Run subject lines through the checker along with the email."),
    s("Check-in replies",
      "Check-in replies are where generic writing does the most damage, because clients expect personal attention. A reply that reads like a template tells them nobody really looked at their week. Mention one specific number or comment from their check-in, give one clear focus and keep it short. If a reply scores above 2, rewrite it before sending."),
    s("Getting faster at it",
      "After running a few dozen drafts through the checker, most coaches start spotting the tells as they write. Contrast framing, stacked questions and buzzwords become easy to catch. At that point, the checker becomes a quick final check rather than a rewrite tool, and your first drafts get better on their own."),
],
}
for k, v in MORE2.items():
    EXTRA[k] = EXTRA[k] + v

MORE3 = {
"coaching-prompt-generator": [
    s("Prompts for group coaching",
      "Group coaches can use the same prompts for group announcements, weekly themes and community posts. Describe the group in neutral terms, such as 'a 20-person group of beginners in their first 12 weeks', instead of a single client. Ask for messages that speak to the whole group while inviting individual replies, so members feel addressed personally even in a shared space."),
    s("Voice notes and transcripts",
      "Many coaches think more clearly out loud. Record a voice note explaining what you want to say to a client, transcribe it, and paste the transcript into a prompt with the instruction to tidy it into a short message without changing your meaning. The result keeps your thinking and phrasing while removing the ums and repetitions. Check it before sending, and keep identifying details out."),
    s("Checking for scope",
      "Before sending anything drafted with AI, check it against your scope of practice. AI tools don't know what you're qualified to advise on, and they may suggest things like supplement doses, diets for medical conditions or rehabilitation exercises. Remove anything outside your scope, and refer where needed. The scope-of-practice check on this site can help with borderline cases."),
    s("Measuring whether it helps",
      "Track two things for a month: how long routine messages take you, and how clients respond. If messages are faster and clients reply as warmly as before, the prompts are working. If replies get shorter or clients seem less engaged, your messages may have become too generic, and it's worth adding more personal detail before sending."),
    s("Keeping prompts up to date",
      "Your coaching changes: new offers, new check-in formats, a new price. Update your saved prompts when it does, so drafts reflect how you work now. A quick review every few months keeps them accurate and stops old details, such as a retired package or a previous price, slipping into new messages."),
],
"ai-writing-checker": [
    s("Specific beats clever",
      "Many of the fifteen tells are attempts to sound clever: contrast framing sounds insightful, rhetorical questions sound engaging, lists of three sound rhythmic. Readers respond more to specific information than to clever phrasing. A real number, a real moment and a clear next step are more memorable than any slogan."),
    s("Starting today",
      "Take your last three captions or emails and paste them in one at a time. Note which tells appear most often in your writing. Over the next week, watch for those in particular as you write. Most coaches have two or three habits that account for most of their score, and fixing those makes the biggest difference."),
    s("Keeping a sample of your voice",
      "Save three short pieces of your own writing that you're proud of: a caption, an email and a check-in reply. Use them whenever you ask an AI to rewrite something, and reread them before writing something important. They're the best reference for what you sound like on a good day."),
],
}
for k, v in MORE3.items():
    EXTRA[k] = EXTRA[k] + v

MORE4 = {
"coaching-prompt-generator": [
    s("A prompt for every week",
      ("table", ["Day", "Task", "Prompt version"], [["Monday", "Check-in replies", "Full brief, drafted around your decision"], ["Tuesday", "A caption", "Two versions, pick the stronger"], ["Wednesday", "Sales replies", "Full brief, short length"], ["Thursday", "A plan update", "Outline first"], ["Friday", "Onboarding for new clients", "Full brief, standard length"]]),
      "A routine like this keeps AI in a supporting role: it handles the typing for routine work while you make every decision."),
    s("What AI can't do for you",
      "AI can't notice that a client's tone has changed, remember the conversation you had about their father's illness, or sense when they need encouragement rather than a new target. Those moments are what clients value most in coaching. Use prompts to save time on routine writing, and spend that time on the parts of coaching only a person can do."),
],
"ai-writing-checker": [
    s("Common questions from coaches",
      ("ul", [
          "**Can I still use questions in captions?** Yes. One good question is fine; stacking several is the tell.",
          "**Are lists always bad?** No. Practical lists, such as three exercises, are fine. Lists of three abstract virtues are the problem.",
          "**What about one exclamation mark?** One is fine. The checker flags two or more.",
          "**Does British or American spelling matter?** No. The checker looks for habits, not spelling.",
      ]),
      "The aim isn't rigid rules but writing that sounds like you."),
],
}
for k, v in MORE4.items():
    EXTRA[k] = EXTRA[k] + v

MORE5 = {
"coaching-prompt-generator": [
    s("Combining prompts with the other tools",
      "The prompt generator works well alongside the rest of the tools on this site. Use the check-in reader to decide what to say, then the prompt generator to draft it. Use the caption generator for post ideas, then the AI writing checker to clean up anything you've drafted with AI. Each tool handles one part of the job, and you stay the editor throughout."),
    s("Privacy",
      "The generator runs in your browser and stores nothing. The prompts it builds contain only what you type, so keep client details general and identifying information out."),
],
"ai-writing-checker": [
    s("Checking long pieces",
      "For longer pieces, such as a blog post or sales page, check a section at a time. The score is designed for short writing; in a long piece, a few tells spread across many paragraphs matter less than the same number packed into a caption. Focus on the opening and closing paragraphs, where readers decide whether to keep going and whether to act."),
    s("A final read-through",
      "After the score is low, read the draft aloud once. Your ear catches things a checklist can't: a sentence that's too long, a word you'd never use, a point that isn't clear. If it sounds like you talking to a client, it's ready."),
],
}
for k, v in MORE5.items():
    EXTRA[k] = EXTRA[k] + v

EXTRA["coaching-prompt-generator"] += [
    s("Starting this week",
      "Choose one routine message you write every week, build a prompt for it, and use it for the next five times you write that message. Note what you edit each time and fold those edits back into the prompt. By the end of the week, you'll have a prompt that saves real time and sounds much closer to your own voice."),
]
EXTRA["ai-writing-checker"] += [
    s("Writing for different readers",
      "Followers who don't know you yet need a specific, useful first line to keep reading. Clients who already know you need to feel that the message was written for them. Leads who are deciding need clarity and honesty. In every case, removing generic habits helps: it signals that a real coach, paying attention, wrote the words. That's what builds trust, whatever the format."),
    s("When a high score is fine",
      "Occasionally a tell is the right choice: a deliberate rhetorical question, a single dash for emphasis, a cheerful sign-off to a client you know well. The checker flags habits, not rules. If you've chosen a phrase on purpose and it sounds like you, keep it."),
]

EXTRA["ai-writing-checker"] += [s("Privacy", "The checker runs entirely in your browser. Nothing you paste is stored or sent anywhere.")]
