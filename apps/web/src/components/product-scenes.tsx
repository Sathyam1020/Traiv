import { ClientAvatar } from "@traiv/ui/components/client-avatar";
import { Logo } from "@traiv/ui/components/logo";
import {
  Apple,
  ArrowLeft,
  ArrowUpRight,
  Cake,
  ChartArea,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Dumbbell,
  FileText,
  Flame,
  GripVertical,
  LayoutGrid,
  MessageSquareText,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Ruler,
  Search,
  Settings,
  Smile,
  Sparkles,
  Star,
  User,
} from "@traiv/ui/icons";
import Image from "next/image";
import { ClientDemo } from "./client-demo";
import { demoExercises, demoRecipes } from "./demo-media";
export type ProductSceneKind =
  | "review"
  | "build"
  | "phone"
  | "payments"
  | "brand"
  | "chat"
  | "vault";
const featureScenes: Record<string, ProductSceneKind> = {
  today: "phone",
  "plan-builder": "build",
  nutrition: "build",
  "check-ins": "review",
  "client-app": "phone",
  payments: "payments",
  messaging: "chat",
  vault: "vault",
};
export function sceneForFeature(slug: string): ProductSceneKind {
  const scene = featureScenes[slug];
  if (!scene) throw new Error(`Missing product preview for feature: ${slug}`);
  return scene;
}
/** Presentation mirrors ClientHeader, Development, BuilderExerciseRow and PlanOptionCard in the trainer app. */
export function ProductScene({ kind = "review" }: { kind?: ProductSceneKind }) {
  return (
    <div className={`product-scene scene-${kind} ${kind === "build" ? "builder-stack-scene" : ""}`}>
      {kind === "phone" || kind === "brand" ? (
        <ClientDemo brand={kind === "brand"} />
      ) : kind === "build" ? (
        <BuilderStack />
      ) : kind === "chat" ? (
        <InboxPreview />
      ) : kind === "vault" ? (
        <VaultPreview />
      ) : kind === "payments" ? (
        <Payments />
      ) : (
        <Review />
      )}
      <span className="scene-caption">
        {kind === "phone" || kind === "brand"
          ? "Try the tabs, log a set, or update a measurement."
          : "Traiv product preview · Demonstration data"}
      </span>
    </div>
  );
}
const navTabs = [
  { title: "Overview", Icon: LayoutGrid },
  { title: "Development", Icon: ChartArea },
  { title: "Nutrition", Icon: Apple },
  { title: "Workouts", Icon: Dumbbell },
  { title: "Vault", Icon: FileText },
  { title: "Payment", Icon: CreditCard },
  { title: "Automations", Icon: Sparkles },
  { title: "Settings", Icon: Settings },
];
function Review() {
  return (
    <div
      className="replica-trainer"
      role="img"
      aria-label="Traiv client Development tab for Rohan Mehta with six rating cards, written responses and weight-goal gauge."
    >
      <div className="replica-client-header">
        <PanelLeft size={14} />
        <ArrowLeft size={14} />
        <ClientAvatar id="demo-rohan" name="Rohan Mehta" size={38} />
        <div className="replica-client-identity">
          <div>
            <strong>Rohan Mehta</strong>
            <span>
              Active <ChevronDown size={9} />
            </span>
          </div>
          <small>
            <Cake size={10} /> 28 years old <User size={10} /> Male <Ruler size={10} /> 178 cm{" "}
            <em>Muscle gain</em>
          </small>
        </div>
        <span className="replica-chat">
          <MessageSquareText size={11} />
          Chat
        </span>
      </div>
      <div className="replica-client-tabs">
        {navTabs.map(({ title, Icon }) => (
          <span key={title} className={title === "Development" ? "active" : ""}>
            <Icon size={11} />
            {title}
          </span>
        ))}
      </div>
      <div className="replica-development">
        <aside>
          {[ClipboardList, Apple, Ruler, Dumbbell].map((Icon, i) => (
            <span className={i === 0 ? "active" : ""} key={i}>
              <Icon size={13} />
            </span>
          ))}
        </aside>
        <div className="replica-development-main">
          <header>
            <div>
              <strong>Check-in</strong>
              <small>Answers, ratings, weight and photos from this check-in.</small>
            </div>
            <span>
              <ChevronLeft size={11} />2 Nov 2026<b>Latest</b>
              <ChevronRight size={11} />
            </span>
          </header>
          <div className="replica-rating-grid">
            {["Average Rating", "Mood", "Energy", "Nutrition", "Progress", "Sleep"].map(
              (label, i) => (
                <div key={label}>
                  <span>{i < 2 ? <Smile size={15} /> : <Star size={15} />}</span>
                  <small>{label}</small>
                  <b>
                    4<em>/5</em>
                  </b>
                </div>
              ),
            )}
          </div>
          <div className="replica-response-grid">
            <section className="replica-responses">
              {/* A styled label, not a real heading — this whole mock is already one
                  `role="img"` with its own aria-label above, so a nested <h4> only adds
                  a false skip to the page's real heading order. */}
              <p className="replica-responses-heading">Responses</p>
              <div>
                <strong>What was your biggest win last week?</strong>
                <p>I completed all three workouts.</p>
              </div>
              <div>
                <strong>How did your training feel?</strong>
                <p>Good. Ready for next week.</p>
              </div>
            </section>
            <div>
              <section className="replica-gauge">
                <span>1 kg since last check-in</span>
                <div>
                  <svg viewBox="0 0 240 140" aria-hidden="true">
                    <path
                      d="M20 120 A100 100 0 0 1 220 120"
                      fill="none"
                      stroke="#d9dfd8"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20 120 A100 100 0 0 1 220 120"
                      fill="none"
                      stroke="#2459b8"
                      strokeWidth="18"
                      strokeLinecap="round"
                      pathLength="100"
                      strokeDasharray="60 100"
                    />
                  </svg>
                  <strong>
                    +3 kg<small>Total weight gained</small>
                  </strong>
                </div>
                <footer>
                  <span>
                    Starting weight<b>70 kg</b>
                  </span>
                  <span>
                    Current weight<b>73 kg</b>
                  </span>
                  <span>
                    Goal weight<b>75 kg</b>
                  </span>
                </footer>
              </section>
              <section className="replica-goal">
                <ChartArea size={18} />
                <span>
                  Rohan's goal<b>Build muscle</b>
                </span>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function BuilderStack() {
  return (
    <div className="builder-stack">
      <section
        className="replica-builder workout-builder"
        role="img"
        aria-label="Traiv workout builder with exercise library, Monday session and three exercise rows with real exercise images."
      >
        <div className="replica-builder-title">
          <PanelLeft size={12} />
          <ArrowLeft size={13} />
          <strong>Strength programme</strong>
          <span>Live</span>
          <b>Save</b>
        </div>
        <div className="replica-builder-body">
          <aside>
            <div className="replica-search">
              <Search size={11} />
              Search exercises
            </div>
            <div className="replica-filters">
              Muscle <ChevronDown size={9} /> Equipment <ChevronDown size={9} />
            </div>
            {demoExercises.map((e) => (
              <div className="replica-library-exercise" key={e.name}>
                <Image
                  width={400}
                  height={300}
                  sizes="(max-width: 600px) 160px, 240px"
                  src={e.image}
                  alt=""
                  loading="lazy"
                />
                <span>
                  {e.name}
                  <small>{e.muscle} · dumbbell</small>
                </span>
                <Plus size={11} />
              </div>
            ))}
          </aside>
          <div className="replica-session-body">
            <div className="replica-session-tabs">
              <span>
                <GripVertical size={11} />
                Monday <Settings size={10} />
              </span>
              <Plus size={13} />
            </div>
            {demoExercises.map((e) => (
              <div className="replica-exercise-row" key={e.name}>
                <ChevronRight size={10} />
                <Image
                  width={400}
                  height={300}
                  sizes="(max-width: 600px) 160px, 240px"
                  src={e.image}
                  alt=""
                  loading="lazy"
                />
                <div>
                  <strong>{e.name}</strong>
                  <small>Add note</small>
                </div>
                <span>
                  <small>sets</small>3
                </span>
                <span>
                  <small>reps</small>10
                </span>
                <span>
                  <small>rest</small>60
                </span>
                <MoreHorizontal size={11} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        className="replica-builder diet-builder"
        role="img"
        aria-label="Traiv diet plan builder with calorie and macro targets and photographed recipe option cards."
      >
        <div className="replica-builder-title">
          <PanelLeft size={12} />
          <ArrowLeft size={13} />
          <strong>Rohan's diet plan</strong>
          <span>Live</span>
          <b>Save</b>
        </div>
        <div className="replica-nutrition-targets">
          <strong>
            <Flame size={14} /> 1,800 <small>kcal</small>
          </strong>
          <span>
            Protein <b>135 g</b>
          </span>
          <span>
            Carbs <b>225 g</b>
          </span>
          <span>
            Fat <b>60 g</b>
          </span>
        </div>
        <div className="replica-meal-heading">
          <strong>Breakfast</strong>
          <span>25% · 450 kcal</span>
          <Plus size={14} />
        </div>
        <div className="replica-recipe-options">
          {demoRecipes.map((r) => (
            <article key={r.name}>
              <Image
                width={400}
                height={300}
                sizes="(max-width: 600px) 160px, 240px"
                src={r.image}
                alt={r.name}
                loading="lazy"
              />
              <div>
                <strong>{r.name}</strong>
                <span>{r.kcal} kcal</span>
                <small>
                  <b>{r.protein} g protein</b> · {r.carbs} g carbs · {r.fat} g fat
                </small>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
function Payments() {
  return (
    <div
      className="demo-window payment-window"
      role="img"
      aria-label="Traiv client payment preview showing Rohan Mehta's ₹3,000 November coaching fee, collected through Razorpay."
    >
      <div className="demo-window-top">
        <Logo size={19} />
        <span>Client fees</span>
      </div>
      <div className="demo-client">
        <ClientAvatar id="demo-rohan" name="Rohan Mehta" size={36} />
        <div>
          <strong>Rohan Mehta</strong>
          <small>Monthly coaching</small>
        </div>
      </div>
      <div className="payment-amount">
        <small>Coaching fees</small>
        <strong>₹3,000</strong>
        <span>November coaching</span>
      </div>
      <div className="payment-method">
        <span>Payment provider</span>
        <b>Razorpay</b>
      </div>
      <div className="payment-example-link">
        Client payment link <ArrowUpRight size={15} />
      </div>
      <p className="payment-note">Keep the payment with the client it belongs to.</p>
    </div>
  );
}

function InboxPreview() {
  return (
    <div
      className="feature-inbox replica-trainer"
      role="img"
      aria-label="Traiv Inbox showing a conversation with Rohan Mehta about his workout plan."
    >
      <aside className="feature-conversations">
        <div className="feature-preview-tabs">
          <strong>Inbox</strong>
          <span>Photo Log</span>
        </div>
        <div className="feature-preview-search">
          <Search size={14} />
          Search clients by name
        </div>
        <div className="feature-preview-status">
          Active 2 <span>Pending 0</span>
        </div>
        {[
          { name: "Rohan Mehta", text: "Thanks, coach. That helps!", active: true },
          { name: "Priya Shah", text: "See you tomorrow!", active: false },
        ].map((person) => (
          <div
            className={`feature-conversation ${person.active ? "selected" : ""}`}
            key={person.name}
          >
            <ClientAvatar id={person.name} name={person.name} size={32} />
            <div>
              <strong>{person.name}</strong>
              <small>{person.text}</small>
            </div>
          </div>
        ))}
      </aside>
      <div className="feature-conversation-panel">
        <header>
          <ClientAvatar id="Rohan Mehta" name="Rohan Mehta" size={34} />
          <div>
            <strong>Rohan Mehta</strong>
            <small>Active client</small>
          </div>
          <MoreHorizontal size={18} />
        </header>
        <div className="feature-messages">
          <small>Today</small>
          <p className="feature-message received">
            Hi coach, can I swap today's workout with tomorrow's?<time>09:41</time>
          </p>
          <p className="feature-message sent">
            Of course. Keep a rest day between your strength sessions. Your plan is updated.
            <time>09:43</time>
          </p>
          <p className="feature-message received">
            Thanks, coach. That helps!<time>09:44</time>
          </p>
        </div>
        <div className="feature-compose">
          <Plus size={17} />
          <span>Write a message...</span>
          <span className="feature-send">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </div>
  );
}
function VaultPreview() {
  return (
    <div
      className="feature-vault replica-trainer"
      role="img"
      aria-label="Traiv Vault with searchable files and links, resource types and client visibility."
    >
      <header>
        <PanelLeft size={16} />
        <strong>Vault</strong>
      </header>
      <div className="feature-vault-tools">
        <div className="feature-preview-search">
          <Search size={14} />
          Search resources...
        </div>
        <span>
          Resource type <ChevronDown size={12} />
        </span>
        <span>
          Select tags <ChevronDown size={12} />
        </span>
        <span className="feature-add-file">
          <Plus size={13} />
          Add file
        </span>
      </div>
      <div className="feature-vault-table">
        <table>
          <thead>
            <tr>
              {["Name", "Type", "Uploaded", "Size", "Visibility"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Getting started guide",
                description: "Everything you need for your first week",
                type: "Document",
                size: "2.4 MB",
              },
              {
                name: "Recovery and mobility",
                description: "Your guide to moving and recovering well",
                type: "Document",
                size: "1.1 MB",
              },
              {
                name: "Weekly meal preparation",
                description: "Simple preparation for the week ahead",
                type: "Link",
                size: "—",
              },
            ].map((resource) => (
              <tr key={resource.name}>
                <td>
                  <div className="feature-resource-name">
                    <FileText size={20} />
                    <div>
                      <strong>{resource.name}</strong>
                      <small>{resource.description}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span>{resource.type}</span>
                </td>
                <td>Nov 2</td>
                <td>{resource.size}</td>
                <td>
                  <em>Shared</em>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer>Viewing 3 of 3</footer>
    </div>
  );
}
