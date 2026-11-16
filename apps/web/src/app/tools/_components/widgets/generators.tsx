"use client";

import { checkWriting, segments, wordCount } from "@traiv/calculators/writing";
import { Checkbox } from "@traiv/ui/components/checkbox";
import { Input } from "@traiv/ui/components/input";
import { Textarea } from "@traiv/ui/components/textarea";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { Field } from "@/components/tool-controls";
import {
  type BioCta,
  type BioTone,
  bios,
  buildCheckin,
  buildGlp1Plan,
  buildOffer,
  buildOnboarding,
  buildPrompts,
  businessNames,
  type CapAsk,
  type CapTone,
  CHECKIN_GOALS,
  CHECKIN_METRICS,
  type CheckinGoal,
  type CheckinMetric,
  captionPrompt,
  captions,
  DEFAULT_METRICS,
  type Depth,
  type Glp1Challenge,
  type Glp1Stage,
  type HookFormat,
  hookPrompt,
  hooks,
  type Level,
  type NameStyle,
  OFFER_ITEMS,
  OFFER_LENGTHS,
  OFFER_MODELS,
  type OfferItem,
  type OfferLength,
  type OfferModel,
  ONBOARD_STEPS,
  ONBOARD_TYPES,
  type OnboardStep,
  type OnboardType,
  PROMPT_TASKS,
  type PromptLength,
  type PromptTask,
  type PromptTone,
  type ReelAsk,
  reelPrompt,
  reels,
  rewritePrompt,
  TELL_FIX,
  type Timeline,
  WRITING_SAMPLE,
} from "@/content/tools/generators";
import {
  ErrorText,
  Note,
  type Num,
  NumberInput,
  Pills,
  ResultPanel,
  Select,
  ToolForm,
  ToolLayout,
  Warning,
} from "../kit";
import { useTool } from "../tool-context";
import { trackCalculateSettled } from "../track";

function useSettled(key: string) {
  const tool = useTool();
  useEffect(() => {
    if (key) trackCalculateSettled(tool.slug, tool.group, tool.kind);
  }, [key, tool.slug, tool.group, tool.kind]);
}

function TextInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} {...(hint ? { hint } : {})}>
      {(id) => (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="h-11" />
      )}
    </Field>
  );
}

/** A row of toggle chips for picking several options. */
function MultiPick<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: readonly T[];
  onChange: (v: T[]) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-2 text-body-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-control border px-3.5 text-body-sm transition-colors ${on ? "border-brand bg-brand text-brand-fg" : "border-line-strong hover:bg-hover"}`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Output({
  title,
  text,
  meta,
  children,
}: {
  title: string;
  text: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-control border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-body-sm font-medium">{title}</p>
          {meta ? <p className="text-caption text-fg-subtle">{meta}</p> : null}
        </div>
        <CopyButton text={text} label={title} />
      </div>
      <p className="text-body-sm whitespace-pre-line break-words">{text}</p>
      {children}
    </div>
  );
}

const btn =
  "inline-flex min-h-11 w-fit cursor-pointer items-center rounded-control border border-line-strong px-4 text-body-sm font-medium transition-colors hover:bg-hover";

/* -------------------------------------------------------- AI writing checker */

export function WritingCheckerWidget() {
  const [text, setText] = useState(WRITING_SAMPLE);
  const r = useMemo(() => checkWriting(text), [text]);
  useSettled(text.trim() ? String(r.score) : "");
  const spans = r.hits.flatMap((h) => h.spans);
  const BAND = {
    post: "Reads like you. Read it aloud once, then post it.",
    edit: "One rewrite pass will fix it.",
    rewrite: "Rewrite from your own first sentence.",
  } as const;
  return (
    <ToolLayout
      form={
        <ToolForm label="AI writing checker">
          <p className="text-caption text-fg-subtle">
            {r.words} words · {r.sentences} sentences
          </p>
          <Field
            label="Your draft"
            hint="A caption, email or check-in reply. The sample is a bad one on purpose."
          >
            {(id) => (
              <Textarea id={id} value={text} rows={10} onChange={(e) => setText(e.target.value)} />
            )}
          </Field>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={rewritePrompt(text)} label="Rewrite prompt" />
            <button type="button" onClick={() => setText(WRITING_SAMPLE)} className={btn}>
              Load the sample again
            </button>
          </div>
          <Note>
            The rewrite prompt puts your draft into a "rewrite this in my voice" brief. Paste in
            three samples of your own writing where the prompt asks for them.
          </Note>
        </ToolForm>
      }
      result={
        <ResultPanel label="Your score">
          {text.trim() ? (
            <>
              <div>
                <p className="text-caption font-medium text-fg-subtle">
                  Reads like generic AI copy
                </p>
                <p className="mt-1 font-display text-display font-medium tabular-nums">
                  {r.score}
                  <span className="text-lead text-fg-muted"> / 10</span>
                </p>
                <p className="mt-1 text-body-sm text-fg-muted">
                  {BAND[r.band]} A high score means rewrite, not "written by AI".
                </p>
              </div>
              <div className="rounded-control border border-line bg-surface p-4 text-body-sm whitespace-pre-line break-words">
                {segments(text, spans).map((s, i) =>
                  s.hit ? (
                    <mark
                      key={`${i}-${s.text}`}
                      className="rounded-sm bg-hover px-0.5 text-fg underline decoration-line-strong decoration-2"
                    >
                      {s.text}
                    </mark>
                  ) : (
                    <span key={`${i}-${s.text}`}>{s.text}</span>
                  ),
                )}
              </div>
              {r.hits.length ? (
                <ul className="flex flex-col gap-2">
                  {r.hits.map((h) => (
                    <li
                      key={h.tell.id}
                      className="rounded-control border border-line bg-surface p-3 text-body-sm"
                    >
                      <p className="font-medium">
                        {h.tell.name}{" "}
                        <span className="text-caption text-fg-subtle">
                          · {h.tell.points(h.spans.length)} pt
                        </span>
                      </p>
                      <p className="mt-1 text-fg-muted">{TELL_FIX[h.tell.id]}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Note>No tells found. Read it aloud once; if it sounds like you, post it.</Note>
              )}
              <Note>
                Each tell scores one point; contrast framing and three or more buzzwords score two.
                0 to 2: post it. 3 to 5: one rewrite pass. 6 and above: rewrite. Nothing you type
                leaves this page.
              </Note>
            </>
          ) : (
            <ErrorText>Paste a draft to check it.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- check-in builder */

export function CheckinBuilderWidget() {
  const [goal, setGoalRaw] = useState<CheckinGoal>("Fat loss");
  const [metrics, setMetrics] = useState<CheckinMetric[]>(DEFAULT_METRICS["Fat loss"]);
  const [depth, setDepth] = useState<Depth>("standard");
  const setGoal = (g: CheckinGoal) => {
    setGoalRaw(g);
    setMetrics(DEFAULT_METRICS[g]);
  };
  const text = buildCheckin(goal, metrics, depth);
  useSettled(`${goal}-${metrics.length}-${depth}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Client check-in builder">
          <Pills
            label="1. Client goal"
            value={goal}
            onChange={setGoal}
            options={CHECKIN_GOALS.map((g) => ({ value: g, label: g }))}
          />
          <MultiPick
            label="2. What you track"
            options={CHECKIN_METRICS}
            value={metrics}
            onChange={setMetrics}
          />
          <Pills
            label="3. Depth"
            value={depth}
            onChange={setDepth}
            options={[
              { value: "quick", label: "Quick scan" },
              { value: "standard", label: "Standard" },
              { value: "deep", label: "Deep" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="Your weekly check-in">
          <Output
            title="Your weekly check-in"
            text={text}
            meta="Numbers first, then a few short questions"
          />
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- onboarding builder */

export function OnboardingBuilderWidget() {
  const [type, setType] = useState<OnboardType>("Fat loss");
  const [steps, setSteps] = useState<OnboardStep[]>([...ONBOARD_STEPS]);
  const [timeline, setTimeline] = useState<Timeline>("week");
  const text = buildOnboarding(type, steps, timeline);
  useSettled(`${type}-${steps.length}-${timeline}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Client onboarding builder">
          <Pills
            label="1. Coaching type"
            value={type}
            onChange={setType}
            options={ONBOARD_TYPES.map((t) => ({ value: t, label: t }))}
          />
          <MultiPick
            label="2. Steps you run"
            options={ONBOARD_STEPS}
            value={steps}
            onChange={setSteps}
          />
          <Pills
            label="3. Timeline"
            value={timeline}
            onChange={setTimeline}
            options={[
              { value: "3days", label: "First 3 days" },
              { value: "week", label: "First week" },
              { value: "2weeks", label: "First 2 weeks" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="Your onboarding sequence">
          <Output
            title="Your onboarding sequence"
            text={text}
            meta="Phase by phase, ready to copy into your checklist"
          />
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- offer builder */

export function OfferBuilderWidget() {
  const [model, setModel] = useState<OfferModel>("1:1 coaching");
  const [length, setLength] = useState<OfferLength>("Monthly");
  const [items, setItems] = useState<OfferItem[]>([
    "Training programme",
    "Nutrition / meal plan",
    "Weekly check-ins",
    "Messaging support",
    "Client app",
  ]);
  const text = buildOffer(model, length, items);
  useSettled(`${model}-${length}-${items.length}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Coaching offer builder">
          <Pills
            label="1. Model"
            value={model}
            onChange={setModel}
            options={OFFER_MODELS.map((m) => ({ value: m, label: m }))}
          />
          <Pills
            label="2. Length"
            value={length}
            onChange={setLength}
            options={OFFER_LENGTHS.map((m) => ({ value: m, label: m }))}
          />
          <MultiPick
            label="3. What's included"
            options={OFFER_ITEMS}
            value={items}
            onChange={setItems}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="Your offer">
          <Output
            title="Your offer"
            text={text}
            meta="Paste into a sales page, a message or your call notes"
          />
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- prompt generator */

export function PromptGeneratorWidget() {
  const [task, setTask] = useState<PromptTask>("Client check-in reply");
  const [niche, setNiche] = useState("busy parents losing fat");
  const [detail, setDetail] = useState("new to training, trains twice a week");
  const [tone, setTone] = useState<PromptTone>("Warm");
  const [length, setLength] = useState<PromptLength>("Standard");
  const p = buildPrompts(task, niche, detail, tone, length);
  useSettled(`${task}-${tone}-${length}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Coaching prompt generator">
          <Select
            label="What do you need to write?"
            value={task}
            onChange={setTask}
            options={PROMPT_TASKS.map((t) => ({ value: t, label: t }))}
          />
          <TextInput label="Your niche" value={niche} onChange={setNiche} />
          <TextInput
            label="One thing about the client"
            hint="Goal, level or constraint. Use neutral words; never paste a name or health details into a public AI tool."
            value={detail}
            onChange={setDetail}
          />
          <Pills
            label="Tone"
            value={tone}
            onChange={setTone}
            options={(["Warm", "Direct", "Clinical", "Playful"] as const).map((t) => ({
              value: t,
              label: t,
            }))}
          />
          <Pills
            label="Output length"
            value={length}
            onChange={setLength}
            options={(["Short", "Standard", "Detailed"] as const).map((t) => ({
              value: t,
              label: t,
            }))}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="Your prompts">
          <Output
            title="Full brief"
            meta="Everything the AI needs to write it in one go"
            text={p.full}
          />
          <Output
            title="Two versions"
            meta="A pair of drafts from different starting points"
            text={p.two}
          />
          <Output
            title="Outline first"
            meta="Bullets before prose, so you stay the editor"
            text={p.outline}
          />
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- GLP-1 planner */

export function Glp1PlannerWidget() {
  const [stage, setStage] = useState<Glp1Stage>("starting");
  const [level, setLevel] = useState<Level>("Beginner");
  const [days, setDays] = useState<Num>(3);
  const [ch, setCh] = useState<Glp1Challenge>("protein");
  const ok = days !== "" && days >= 1 && days <= 7;
  const text = ok ? buildGlp1Plan(stage, level, days, ch) : "";
  useSettled(ok ? `${stage}-${level}-${days}-${ch}` : "");
  return (
    <ToolLayout
      form={
        <ToolForm label="GLP-1 client coaching planner">
          <Select
            label="Where the client is"
            value={stage}
            onChange={setStage}
            options={[
              { value: "starting", label: "Just starting the medication" },
              { value: "titrating", label: "Mid-titration (dose rising)" },
              { value: "stable", label: "Stable dose, losing steadily" },
              { value: "tapering", label: "Coming off / tapering" },
            ]}
          />
          <Pills
            label="Training experience"
            value={level}
            onChange={setLevel}
            options={(["Beginner", "Intermediate", "Advanced"] as const).map((l) => ({
              value: l,
              label: l,
            }))}
          />
          <NumberInput
            label="Training days available a week"
            value={days}
            onChange={setDays}
            min={1}
            max={7}
          />
          <Select
            label="Biggest challenge right now"
            value={ch}
            onChange={setCh}
            options={[
              { value: "protein", label: "Can't eat enough protein" },
              { value: "energy", label: "Low energy to train" },
              { value: "nausea", label: "Nausea / digestive symptoms" },
              { value: "smooth", label: "Going smoothly" },
            ]}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="The coaching plan">
          {ok ? (
            <>
              <Output
                title="The coaching plan"
                text={text}
                meta="Training, protein and habits: the coaching side"
              />
              <Warning>
                The medication, dose, side effects and whether to continue are for the prescriber.
                Refer for severe or persistent vomiting, signs of dehydration, abdominal pain, or a
                client who can't eat enough to function. Not medical advice.
              </Warning>
            </>
          ) : (
            <ErrorText>Enter between 1 and 7 training days.</ErrorText>
          )}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- captions */

export function CaptionGeneratorWidget() {
  const [niche, setNiche] = useState("strength coaching for women over 40");
  const [audience, setAudience] = useState(
    "anyone who trains four times a week and sees nothing change",
  );
  const [point, setPoint] = useState("the weekend is where the calories go");
  const [detail, setDetail] = useState(
    "27 of the last 30 food logs were at maintenance on Saturday",
  );
  const [keyword, setKeyword] = useState("PLAN");
  const [tone, setTone] = useState<CapTone>("Direct");
  const [ask, setAsk] = useState<CapAsk>("comment");
  const f = { niche, audience, point, detail, keyword, tone, ask };
  const list = captions(f);
  useSettled(`${tone}-${ask}-${point.length}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Instagram caption generator">
          <TextInput label="Your niche" value={niche} onChange={setNiche} />
          <TextInput label="Who the post is for" value={audience} onChange={setAudience} />
          <TextInput label="The one point of this post" value={point} onChange={setPoint} />
          <TextInput
            label="One specific detail from this week"
            value={detail}
            onChange={setDetail}
          />
          <Pills
            label="Tone"
            value={tone}
            onChange={setTone}
            options={(["Direct", "Warm", "Dry"] as const).map((t) => ({ value: t, label: t }))}
          />
          <Pills
            label="The ask at the end"
            value={ask}
            onChange={setAsk}
            options={[
              { value: "comment", label: "Comment keyword" },
              { value: "dm", label: "DM keyword" },
              { value: "save", label: "Save" },
              { value: "none", label: "None" },
            ]}
          />
          {ask === "comment" || ask === "dm" ? (
            <TextInput label="Keyword" value={keyword} onChange={setKeyword} />
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={captionPrompt(f)} label="ChatGPT prompt" />
            <span className="text-caption text-fg-subtle">
              Copy a full prompt with your fields, if you'd rather a model drafts them.
            </span>
          </div>
        </ToolForm>
      }
      result={
        <ResultPanel label="Eight captions">
          {list.map((c, i) => (
            <Output
              key={c.name}
              title={`${i + 1}. ${c.name}`}
              meta={`${c.purpose} · ${c.words} words`}
              text={c.text}
            />
          ))}
          <Note>
            Every caption is kept below 150 words, opens close to your real detail and steers clear
            of common filler habits. Post the client-result caption only with the client's written
            permission.
          </Note>
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- hooks */

function HookScore({ hook }: { hook: string }) {
  const [c, setC] = useState({ specific: false, tension: false, promise: false, spoken: false });
  const short = wordCount(hook) <= 8;
  const score = Object.values(c).filter(Boolean).length + (short ? 1 : 0);
  const LABEL = {
    specific: "specific",
    tension: "tension",
    promise: "promise",
    spoken: "works spoken and on screen",
  } as const;
  return (
    <details className="text-caption">
      <summary className="inline-flex min-h-11 cursor-pointer items-center text-fg-muted">
        Score it · {score}/5
      </summary>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {(["specific", "tension", "promise", "spoken"] as const).map((k) => (
          <div key={k} className="inline-flex min-h-11 items-center gap-2">
            <Checkbox
              aria-label={`${LABEL[k]}: ${hook}`}
              checked={c[k]}
              onCheckedChange={(v) => setC({ ...c, [k]: v === true })}
              controlClassName="min-h-11 min-w-11"
            />
            <span aria-hidden="true">{LABEL[k]}</span>
          </div>
        ))}
        <span className="inline-flex min-h-11 items-center">
          {short ? "✓" : "✗"} 8 words or fewer ({wordCount(hook)})
        </span>
      </div>
    </details>
  );
}

export function HookGeneratorWidget() {
  const [topic, setTopic] = useState("rest-day weight jumps");
  const [audience, setAudience] = useState("women over 40 who lift");
  const [number, setNumber] = useState("2 kg");
  const [question, setQuestion] = useState("Why did I gain 2 kg overnight?");
  const [format, setFormat] = useState<HookFormat>("Reel");
  const f = { topic, audience, number, question, format };
  const groups = hooks(f);
  useSettled(`${format}-${topic.length}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Instagram hook generator">
          <TextInput
            label="Your topic"
            hint="A short phrase, three to five words."
            value={topic}
            onChange={setTopic}
          />
          <TextInput label="Who it is for" value={audience} onChange={setAudience} />
          <TextInput label="One number from your coaching" value={number} onChange={setNumber} />
          <TextInput
            label="One client question this week"
            hint="In their words."
            value={question}
            onChange={setQuestion}
          />
          <Pills
            label="Format"
            value={format}
            onChange={setFormat}
            options={(["Reel", "Carousel", "Caption", "Story"] as const).map((x) => ({
              value: x,
              label: x,
            }))}
          />
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={hookPrompt(f)} label="100-hook prompt" />
            <span className="text-caption text-fg-subtle">
              A ChatGPT prompt for 100 hooks with your fields filled in.
            </span>
          </div>
        </ToolForm>
      }
      result={
        <ResultPanel label="Forty hooks">
          {groups.map((g, i) => (
            <div
              key={g.name}
              className="flex flex-col gap-2 rounded-control border border-line bg-surface p-4"
            >
              <p className="text-body-sm font-medium">
                {i + 1}. {g.name}{" "}
                {g.fit ? (
                  <span className="text-caption text-fg-subtle">
                    · suits {format.toLowerCase()}
                  </span>
                ) : null}
              </p>
              <ul className="flex flex-col gap-2">
                {g.hooks.map((h) => (
                  <li key={h} className="border-t border-line pt-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-body-sm">{h}</p>
                      <CopyButton text={h} label="Hook" />
                    </div>
                    <HookScore hook={h} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- bios */

export function BioGeneratorWidget() {
  const [who, setWho] = useState("busy parents");
  const [outcome, setOutcome] = useState("lose fat without crash diets");
  const [method, setMethod] = useState("custom training + weekly check-ins");
  const [proof, setProof] = useState("");
  const [cta, setCta] = useState<BioCta>("link");
  const [tone, setTone] = useState<BioTone>("Direct");
  const list = bios({ who, outcome, method, proof, cta, tone });
  useSettled(`${cta}-${tone}-${who.length}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Personal trainer bio generator">
          <TextInput label="Who you help" value={who} onChange={setWho} />
          <TextInput label="Outcome you deliver" value={outcome} onChange={setOutcome} />
          <TextInput
            label="Method or what makes you different"
            value={method}
            onChange={setMethod}
          />
          <TextInput
            label="Proof point (optional)"
            hint="Used exactly as you type it. Nothing is invented."
            value={proof}
            onChange={setProof}
          />
          <Pills
            label="Call to action"
            value={cta}
            onChange={setCta}
            options={[
              { value: "link", label: "Link click" },
              { value: "dm", label: "DM keyword" },
              { value: "magnet", label: "Lead magnet" },
            ]}
          />
          <Pills
            label="Tone"
            value={tone}
            onChange={setTone}
            options={(["Direct", "Friendly", "Premium"] as const).map((x) => ({
              value: x,
              label: x,
            }))}
          />
        </ToolForm>
      }
      result={
        <ResultPanel label="Eight bios">
          {list.map((b) => (
            <Output
              key={b.name}
              title={b.name}
              meta={`${b.purpose} · ${b.chars} / 150 characters`}
              text={b.text}
            />
          ))}
          <Note>
            Every option stays within Instagram's 150-character bio limit. Leave a field blank and
            the layouts adapt.
          </Note>
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- business names */

export function BusinessNameWidget() {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("strength");
  const [loc, setLoc] = useState("");
  const [style, setStyle] = useState<NameStyle>("descriptive");
  const [seed, setSeed] = useState(7);
  const list = businessNames(name, niche, loc, style, seed);
  useSettled(`${style}-${seed}`);
  return (
    <ToolLayout
      form={
        <ToolForm
          label="Personal training business name generator"
          submitLabel="Generate name ideas"
          onSubmit={() => setSeed((s) => s + 1)}
        >
          <TextInput label="Your name (optional)" value={name} onChange={setName} />
          <TextInput label="Niche or audience word" value={niche} onChange={setNiche} />
          <Pills
            label="Style"
            value={style}
            onChange={setStyle}
            options={[
              { value: "personal", label: "Personal brand" },
              { value: "descriptive", label: "Descriptive" },
              { value: "abstract", label: "Abstract" },
            ]}
          />
          <TextInput label="Location word (optional)" value={loc} onChange={setLoc} />
          {style === "personal" && !name.trim() ? (
            <Note>
              Add your name for personal-brand ideas; until then you'll see descriptive ones.
            </Note>
          ) : null}
        </ToolForm>
      }
      result={
        <ResultPanel label="Name ideas">
          <p className="text-caption font-medium text-fg-subtle">{list.length} name ideas</p>
          <ul className="flex flex-col gap-2">
            {list.map((n) => (
              <li
                key={n.name}
                className="flex flex-wrap items-center justify-between gap-2 rounded-control border border-line bg-surface p-3"
              >
                <div className="min-w-0">
                  <p className="text-body-sm font-medium">{n.name}</p>
                  <p className="text-caption text-fg-subtle">{n.chars} characters</p>
                </div>
                <div className="flex gap-2">
                  <CopyButton text={n.name} label="Name" />
                  <a
                    href={`https://lookup.icann.org/en/lookup?name=${encodeURIComponent(n.domain)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center rounded-control border border-line-strong px-3 py-1.5 text-caption font-medium hover:bg-hover pointer-coarse:min-h-11"
                  >
                    Check domain
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <Warning>
            These are ideas only. A name can be registered, trademarked or used locally even if the
            domain is free. Check your country's company register, trademark database and social
            handles before you commit. Not legal advice.
          </Warning>
        </ResultPanel>
      }
    />
  );
}

/* -------------------------------------------------------- reel scripts */

export function ReelScriptWidget() {
  const [topic, setTopic] = useState("protein at breakfast");
  const [audience, setAudience] = useState("women over 40 who lift");
  const [point, setPoint] = useState("the first meal decides the snacking at four");
  const [number, setNumber] = useState("30 g of protein by 9am");
  const [keyword, setKeyword] = useState("BREAKFAST");
  const [tone, setTone] = useState<CapTone>("Direct");
  const [ask, setAsk] = useState<ReelAsk>("follow");
  const f = { topic, audience, point, number, keyword, tone, ask };
  const list = reels(f);
  useSettled(`${tone}-${ask}-${topic.length}`);
  return (
    <ToolLayout
      form={
        <ToolForm label="Reel script generator">
          <TextInput label="Topic" hint="A short phrase." value={topic} onChange={setTopic} />
          <TextInput label="Who it is for" value={audience} onChange={setAudience} />
          <TextInput
            label="The one point"
            hint="A full sentence."
            value={point}
            onChange={setPoint}
          />
          <TextInput label="One number or client question" value={number} onChange={setNumber} />
          <Pills
            label="Tone"
            value={tone}
            onChange={setTone}
            options={(["Direct", "Warm", "Dry"] as const).map((x) => ({ value: x, label: x }))}
          />
          <Pills
            label="The ask"
            value={ask}
            onChange={setAsk}
            options={[
              { value: "follow", label: "Follow" },
              { value: "comment", label: "Comment keyword" },
              { value: "save", label: "Save" },
              { value: "none", label: "None" },
            ]}
          />
          {ask === "comment" ? (
            <TextInput label="Keyword" value={keyword} onChange={setKeyword} />
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={reelPrompt(f)} label="ChatGPT prompt" />
            <span className="text-caption text-fg-subtle">
              A full prompt for six scripts with your fields filled in.
            </span>
          </div>
        </ToolForm>
      }
      result={
        <ResultPanel label="Six scripts">
          {list.map((r, i) => (
            <Output
              key={r.name}
              title={`${i + 1}. ${r.name}`}
              meta={`${r.purpose} · ${r.words} words · about ${r.seconds} s read aloud`}
              text={r.text}
            />
          ))}
          <Note>
            Four timed parts, hook to ask. Read-aloud time assumes 150 words a minute; allow a few
            extra seconds for on-screen text.
          </Note>
        </ResultPanel>
      }
    />
  );
}
