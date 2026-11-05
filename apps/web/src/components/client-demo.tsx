"use client";

import { Logo } from "@traiv/ui/components/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@traiv/ui/components/select";
import { ActiveStateIcon } from "@traiv/ui/components/shell/solid-sidebar-icon";
import { WeightCard } from "@traiv/ui/components/weight-card";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  FileText,
  Footprints,
  Home,
  Image as ImageIcon,
  MessageSquareText,
  Ruler,
  Send,
  Settings,
  ShoppingBasket,
  User,
  Utensils,
  X,
} from "@traiv/ui/icons";
import { useEffect, useRef, useState } from "react";
import { demoExercises, demoRecipes } from "./demo-media";

type Tab = "Today" | "Chat" | "Food" | "Workouts" | "Profile";
const navigation = [
  { name: "Today", Icon: Home },
  { name: "Chat", Icon: MessageSquareText },
  { name: "Food", Icon: Utensils },
  { name: "Workouts", Icon: Dumbbell },
  { name: "Profile", Icon: User },
] as const;
const baseWeight = {
  latest: 73,
  delta: 3,
  start: 70,
  goal: 75,
  series: [
    { date: "2026-10-12", kg: 70 },
    { date: "2026-10-19", kg: 71 },
    { date: "2026-10-26", kg: 71 },
    { date: "2026-11-02", kg: 73 },
  ],
};
/** Isolated local demo. The screens follow the app's source; no account/session or live client requests. */
export function ClientDemo({ brand = false }: { brand?: boolean }) {
  const [tab, setTab] = useState<Tab>("Today"),
    [screen, setScreen] = useState<"workout" | "recipe" | null>(null),
    [sheet, setSheet] = useState<"weight" | "measurements" | "checkin" | "resources" | null>(null),
    [measurement, setMeasurement] = useState("Weight"),
    [measurements, setMeasurements] = useState<Record<string, number>>({
      Arm: 32,
      Chest: 94,
      Forearm: 27,
      Hip: 90,
      Thigh: 52,
      Waist: 78,
    }),
    [mood, setMood] = useState("4"),
    [weight, setWeight] = useState(73),
    [raw, setRaw] = useState("73"),
    [done, setDone] = useState<number[]>([]),
    [logged, setLogged] = useState(false),
    [checkedIn, setCheckedIn] = useState(true),
    [message, setMessage] = useState(""),
    [messages, setMessages] = useState<string[]>([]),
    [notice, setNotice] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!sheet) return;
    const previous = document.activeElement as HTMLElement | null;
    const target = dialog.current?.querySelector<HTMLElement>("input,button,select,textarea");
    target?.focus();
    return () => previous?.focus();
  }, [sheet]);
  function go(next: Tab) {
    setTab(next);
    setScreen(null);
    setNotice("");
    if (scroll.current) scroll.current.scrollTop = 0;
  }
  function open(next: typeof sheet) {
    setSheet(next);
    setNotice("");
  }
  function close() {
    setSheet(null);
  }
  return (
    <section className="live-phone" aria-label="Interactive Traiv client app demonstration">
      <div className="live-device-top" aria-hidden="true">
        <span>9:41</span>
        <div />
        <span className="device-signal">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="device-battery" />
      </div>
      <div className="live-client-scroll" ref={scroll} inert={Boolean(sheet)}>
        {screen ? (
          <div className="live-detail-header">
            <button type="button" aria-label="Back" onClick={() => setScreen(null)}>
              <ArrowLeft size={20} />
            </button>
            <h3>{screen === "workout" ? "Full body strength" : demoRecipes[0]!.name}</h3>
            <small>{screen === "workout" ? "3 exercises" : "Breakfast · 15 min"}</small>
          </div>
        ) : null}
        {!screen && tab === "Today" ? (
          <div className="live-today live-padding">
            {brand ? (
              <div className="live-brand">
                <Logo size={22} />
                <span>Arjun Fitness</span>
              </div>
            ) : null}
            <h3>Hey Rohan!</h3>
            {!checkedIn ? (
              <div className="live-checkin">
                <h4>Time for a check-in</h4>
                <p>Share your progress and how the week actually went.</p>
                <button type="button" onClick={() => open("checkin")}>
                  Start check-in
                </button>
              </div>
            ) : null}
            <WeightCard
              weight={{ ...baseWeight, latest: weight, delta: weight - 70 }}
              onLog={() => {
                setMeasurement("Weight");
                setRaw(String(weight));
                open("weight");
              }}
            />
            <button
              type="button"
              className="live-card live-measurements"
              onClick={() => open("measurements")}
            >
              <span className="live-icon">
                <Ruler size={20} />
              </span>
              <span>
                <small>Body composition</small>
                <strong>
                  Arm {measurements.Arm} cm <em>+6 more</em>
                </strong>
              </span>
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              className="live-card live-steps"
              onClick={() => {
                setNotice("Demo: 4,000 steps logged today.");
              }}
            >
              <div>
                <span className="live-icon">
                  <Footprints size={21} />
                </span>
                <span>
                  <small>Steps</small>
                  <strong>4,000 steps</strong>
                </span>
                <ChevronRight size={18} />
              </div>
              <div className="live-week">
                {[10, 4, null, null, null, null, null].map((v, i) => (
                  <span key={i}>
                    <b style={{ borderColor: i < 2 ? "#2459b8" : undefined }}>{v ?? "—"}</b>
                    <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
                  </span>
                ))}
              </div>
              <p>Track your daily steps to see your progress here.</p>
            </button>
            <div className="live-section-heading">Recent activity</div>
            <button
              type="button"
              className="live-card live-list-row"
              onClick={() => {
                go("Workouts");
                setScreen("workout");
              }}
            >
              <Dumbbell size={20} />
              <strong>Full body strength</strong>
              <ChevronRight size={17} />
            </button>
            <div className="live-resource-grid">
              {[
                ["Documents", FileText],
                ["Images", ImageIcon],
              ].map(([title, Icon]) => {
                const I = Icon as typeof FileText;
                return (
                  <button type="button" key={String(title)} onClick={() => open("resources")}>
                    <I size={19} />
                    {String(title)}
                    <span>1</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
        {!screen && tab === "Workouts" ? (
          <div className="live-padding">
            <h3 className="live-page-title">Workouts</h3>
            <p className="live-subtitle">Your plans</p>
            <div className="live-card live-program">
              <div className="live-program-head">
                <span className="live-program-avatar">S</span>
                <div>
                  <strong>Strength programme</strong>
                  <small>1 program</small>
                </div>
                <span>Coach</span>
              </div>
              {["Full body strength", "Upper body"].map((name) => (
                <button
                  type="button"
                  className="live-session"
                  key={name}
                  onClick={() => setScreen("workout")}
                >
                  <span className="live-icon">
                    <Dumbbell size={21} />
                  </span>
                  <span>
                    <strong>{name}</strong>
                    <small>Chest & Back · 3 Exercises</small>
                  </span>
                  <span className="live-play">
                    <PlayIcon />
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {screen === "workout" ? (
          <div className="live-padding">
            <p className="live-subtitle">Log a set to try the workout.</p>
            {demoExercises.map((e, i) => (
              <div className="live-card live-exercise" key={e.name}>
                <div>
                  <img src={e.image} alt={e.name} loading="lazy" />
                  <strong>{e.name}</strong>
                </div>
                <div className="live-set-labels">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                  <span />
                </div>
                {[0, 1, 2].map((j) => {
                  const id = i * 3 + j;
                  return (
                    <div className="live-set" key={j}>
                      <span>{j + 1}</span>
                      <input
                        aria-label={`${e.name} set ${j + 1} weight`}
                        type="number"
                        defaultValue="10"
                        min="0"
                      />
                      <input
                        aria-label={`${e.name} set ${j + 1} reps`}
                        type="number"
                        defaultValue="10"
                        min="0"
                      />
                      <button
                        type="button"
                        aria-label={`Complete ${e.name} set ${j + 1}`}
                        aria-pressed={done.includes(id)}
                        onClick={() =>
                          setDone(done.includes(id) ? done.filter((n) => n !== id) : [...done, id])
                        }
                        className={done.includes(id) ? "complete" : ""}
                      >
                        <Check size={17} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
            <button
              type="button"
              className="live-primary"
              onClick={() => {
                go("Today");
                setNotice("Workout saved in this demo.");
              }}
            >
              Finish workout
            </button>
          </div>
        ) : null}
        {!screen && tab === "Food" ? (
          <div className="live-padding live-food">
            <div className="live-food-date">
              <button
                type="button"
                aria-label="Shopping list"
                onClick={() => {
                  setNotice("Shopping list: oats, milk and bananas.");
                }}
              >
                <ShoppingBasket size={19} />
              </button>
              <b>Monday, Nov 2</b>
              <CalendarDays size={20} />
            </div>
            <div className="live-food-week">
              {[1, 2, 3, 4, 5, 6, 7].map((d, i) => (
                <button
                  type="button"
                  key={d}
                  aria-pressed={d === 2}
                  onClick={() => setNotice(`Previewing ${d} November in this demo.`)}
                >
                  <b>{d}</b>
                  <small>{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][i]}</small>
                </button>
              ))}
            </div>
            <div className="live-card live-calories">
              <small>Calories</small>
              <strong>{logged ? "420" : "0"}</strong>
              <div>
                <span>
                  Protein <b>{logged ? 24 : 0}g</b>
                </span>
                <span>
                  Carbs <b>{logged ? 48 : 0}g</b>
                </span>
                <span>
                  Fat <b>{logged ? 15 : 0}g</b>
                </span>
              </div>
            </div>
            <h4>Meal plans</h4>
            <button type="button" className="live-mealplan" onClick={() => setScreen("recipe")}>
              <small>Active</small>
              <strong>Rohan's diet plan</strong>
              <div>
                <span>135g · 225g · 60g</span>
                <b>
                  1,800 <small>kcal</small>
                </b>
              </div>
            </button>
            <h4>Today's meals</h4>
            <button
              type="button"
              className="live-card live-recipe-row"
              onClick={() => setScreen("recipe")}
            >
              <img src={demoRecipes[0]!.image} alt={demoRecipes[0]!.name} loading="lazy" />
              <div>
                <strong>{demoRecipes[0]!.name}</strong>
                <small>Breakfast · 420 kcal</small>
              </div>
              <ChevronRight size={17} />
            </button>
          </div>
        ) : null}
        {screen === "recipe" ? (
          <div>
            <img
              className="live-recipe-photo"
              src={demoRecipes[0]!.image}
              alt={demoRecipes[0]!.name}
              loading="lazy"
            />
            <div className="live-padding">
              <h3 className="live-page-title">{demoRecipes[0]!.name}</h3>
              <div className="live-card live-recipe-macros">
                <b>
                  420<small>kcal</small>
                </b>
                <b>
                  24g<small>Protein</small>
                </b>
                <b>
                  48g<small>Carbs</small>
                </b>
                <b>
                  15g<small>Fat</small>
                </b>
              </div>
              <h4>Ingredients</h4>
              {["Oats · 40 g", "Milk · 150 ml", "Banana · 1 piece"].map((t) => (
                <div className="live-card live-ingredient" key={t}>
                  {t}
                </div>
              ))}
              <button
                type="button"
                className="live-primary"
                onClick={() => {
                  setLogged(true);
                  setScreen(null);
                  setNotice("Meal logged in this demo.");
                }}
              >
                {logged ? "Meal logged" : "Log this meal"}
              </button>
            </div>
          </div>
        ) : null}
        {!screen && tab === "Profile" ? (
          <div>
            <div className="live-profile-head">
              <span>
                <User size={35} />
              </span>
              <h3>Rohan Mehta</h3>
              <small>
                <Check size={12} /> Active member
              </small>
              <div>
                <span>
                  Joined<b>24/10/26</b>
                </span>
                <span>
                  Check-ins<b>3</b>
                </span>
                <span>
                  Workouts<b>2</b>
                </span>
              </div>
            </div>
            <div className="live-padding">
              <p className="live-section-heading">Latest Check-in</p>
              <button
                type="button"
                className="live-card live-list-row"
                onClick={() => open("checkin")}
              >
                <ClipboardList size={20} />
                <strong>Weekly Check-In</strong>
                <ChevronRight size={17} />
              </button>
              <p className="live-section-heading">My profile</p>
              <div className="live-card live-profile-list">
                {[
                  ["New check-in", ClipboardList, "checkin"],
                  ["Add measurement", Ruler, "measurements"],
                  ["Edit steps", Footprints, "measurements"],
                  ["Lessons & Documents", FileText, "resources"],
                ].map(([label, Icon, target]) => {
                  const I = Icon as typeof User;
                  return (
                    <button
                      type="button"
                      key={String(label)}
                      onClick={() => open(target as typeof sheet)}
                    >
                      <I size={18} />
                      {String(label)}
                      <ChevronRight size={16} />
                    </button>
                  );
                })}
              </div>
              <p className="live-section-heading">Settings</p>
              <div className="live-card live-profile-list">
                {[
                  ["Personal information", User],
                  ["Integrations", Settings],
                  ["Notifications", Bell],
                ].map(([label, Icon]) => {
                  const I = Icon as typeof User;
                  return (
                    <button
                      type="button"
                      key={String(label)}
                      onClick={() => setNotice(`${label} is available in the full app.`)}
                    >
                      <I size={18} />
                      {String(label)}
                      <ChevronRight size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
        {!screen && tab === "Chat" ? (
          <div className="live-padding">
            <h3 className="live-page-title">Chat</h3>
            <div className="live-chat-coach">
              <span className="live-icon">
                <User size={22} />
              </span>
              <strong>Arjun · Your coach</strong>
            </div>
            <div className="live-message">How did your training feel this week?</div>
            {messages.map((m, i) => (
              <div className="live-message mine" key={i}>
                {m}
              </div>
            ))}
            <form
              className="live-compose"
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) {
                  setMessages([...messages, message.trim()]);
                  setMessage("");
                }
              }}
            >
              <input
                aria-label="Demo message"
                placeholder="Write a message…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" aria-label="Send demo message">
                <Send size={18} />
              </button>
            </form>
          </div>
        ) : null}
        {notice ? (
          <div className="live-notice" role="status">
            {notice}
            <button type="button" aria-label="Dismiss" onClick={() => setNotice("")}>
              <X size={14} />
            </button>
          </div>
        ) : null}
      </div>
      <div className="live-client-footer">
        <nav inert={Boolean(sheet)} className="live-client-nav" aria-label="Demo app navigation">
          {navigation.map(({ name, Icon }) => (
            <button
              type="button"
              aria-current={tab === name ? "page" : undefined}
              onClick={() => go(name)}
              key={name}
            >
              <ActiveStateIcon icon={Icon} active={tab === name} className="size-6" />
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>
      {sheet ? (
        <div className="live-sheet-backdrop">
          <button
            type="button"
            aria-label="Close demo sheet"
            className="live-sheet-scrim"
            onClick={close}
          />
          <section
            ref={dialog}
            className="live-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={
              sheet === "weight"
                ? measurement === "Weight"
                  ? "Log your weight"
                  : `Log ${measurement.toLowerCase()}`
                : sheet === "measurements"
                  ? "Body composition"
                  : sheet === "resources"
                    ? "Lessons & Documents"
                    : "Weekly Check-In"
            }
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              if (e.key === "Tab") {
                const controls = Array.from(
                  e.currentTarget.querySelectorAll<HTMLElement>(
                    'button,input,textarea,[tabindex="0"]',
                  ),
                ).filter((el) => !el.hasAttribute("disabled"));
                const first = controls[0],
                  last = controls[controls.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className="live-sheet-handle" />
            <button type="button" className="live-sheet-close" aria-label="Close" onClick={close}>
              <X size={18} />
            </button>
            <h4>
              {sheet === "weight"
                ? measurement === "Weight"
                  ? "Log your weight"
                  : `Log ${measurement.toLowerCase()}`
                : sheet === "measurements"
                  ? "Body composition"
                  : sheet === "resources"
                    ? "Lessons & Documents"
                    : "Weekly Check-In"}
            </h4>
            {sheet === "weight" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (Number(raw) > 0 && Number(raw) < 500) {
                    if (measurement === "Weight") setWeight(Number(raw));
                    else setMeasurements({ ...measurements, [measurement]: Number(raw) });
                    close();
                  }
                }}
              >
                <label>
                  {measurement}
                  <div className="live-weight-input">
                    <input
                      aria-label={`${measurement} value`}
                      type="number"
                      min="1"
                      max="499"
                      step="0.1"
                      required
                      value={raw}
                      onChange={(e) => setRaw(e.target.value)}
                    />
                    <span>{measurement === "Weight" ? "kg" : "cm"}</span>
                  </div>
                </label>
                <button className="live-primary" type="submit">
                  Save
                </button>
              </form>
            ) : sheet === "measurements" ? (
              <div className="live-measurement-list">
                {["Weight", "Arm", "Chest", "Forearm", "Hip", "Thigh", "Waist"].map((n, i) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => {
                      setMeasurement(n);
                      setRaw(String(n === "Weight" ? weight : measurements[n]));
                      open("weight");
                    }}
                  >
                    <span>
                      {n}
                      <small>{i === 0 ? "kg" : "cm"}</small>
                    </span>
                    <strong>{i === 0 ? weight : measurements[n]}</strong>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
            ) : sheet === "resources" ? (
              <div className="live-card live-list-row">
                <FileText size={24} />
                <span>
                  Your getting started guide<small>PDF · Shared by your coach</small>
                </span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCheckedIn(true);
                  close();
                }}
              >
                <div className="live-field">
                  <span>How are you feeling this week?</span>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger aria-label="Weekly mood">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} / 5
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label>
                  What went well?
                  <textarea placeholder="Share your week…" required />
                </label>
                <button className="live-primary" type="submit">
                  Submit check-in
                </button>
              </form>
            )}
          </section>
        </div>
      ) : null}
    </section>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 5.7C7 4.3 8.5 3.5 9.7 4.2l10.1 6.1c1.3.8 1.3 2.6 0 3.4L9.7 19.8C8.5 20.5 7 19.7 7 18.3Z"
        fill="currentColor"
      />
    </svg>
  );
}
