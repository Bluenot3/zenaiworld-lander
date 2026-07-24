import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Check,
  Code2,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Network,
  Orbit,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import heroVisual from "@/assets/zen-pioneer-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "ZEN AI Co. | Build AI. Ship Real Work.",
      },
      {
        name: "description",
        content:
          "AI Pioneer turns AI literacy into working agents, apps, and portfolio proof. Register for the flagship youth program or join ZEN Vanguard.",
      },
      {
        property: "og:title",
        content: "ZEN AI Co. | Build AI. Ship Real Work.",
      },
      {
        property: "og:description",
        content: "AI literacy that ends in working agents, apps, and verified proof of skill.",
      },
      { property: "og:url", content: "https://zenai.world/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://zenai.world/" }],
  }),
  component: Index,
});

type Program = "ai-pioneer" | "vanguard";
type RegisteringAs = "student" | "parent" | "organization" | "self";

const ARSENAL_URL = "https://arsenal.world";
const AI_ARENA_URL = "https://us.zenai.biz";
const COURSE_BASE_URL = (
  import.meta.env.VITE_COURSE_BASE_URL || "https://us-ai-literacy.lovable.app"
).replace(/\/$/, "");
const REGISTRATION_ENDPOINT = import.meta.env.VITE_PROGRAM_REGISTRATION_ENDPOINT as
  string | undefined;
const CONTACT_EMAIL = "huxley@zenai.biz";

const PROGRAM_DESTINATIONS: Record<Program, string> = {
  "ai-pioneer": `${COURSE_BASE_URL}/programs/pioneer/register`,
  vanguard: `${COURSE_BASE_URL}/programs/vanguard/register`,
};

const SIGN_IN_URL = `${COURSE_BASE_URL}/auth?return_to=${encodeURIComponent("/programs")}`;

function ZenMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="zen-brand" aria-label="ZEN AI Co.">
      <span className="zen-mark" aria-hidden="true">
        <span />
        ZEN
      </span>
      {!compact && <span className="zen-wordmark">ZEN AI Co.</span>}
    </span>
  );
}

function Header({ onRegister }: { onRegister: (program: Program) => void }) {
  const [open, setOpen] = useState(false);

  const navigate = () => setOpen(false);

  return (
    <header className="zen-header">
      <div className="zen-shell zen-header-inner">
        <a href="#top" className="zen-header-brand" onClick={navigate}>
          <ZenMark />
        </a>

        <nav className="zen-desktop-nav" aria-label="Primary navigation">
          <a href="#pioneer">AI Pioneer</a>
          <a href="#register">Vanguard</a>
          <a href="#ecosystem">Ecosystem</a>
          <a href="#organizations">For Organizations</a>
        </nav>

        <div className="zen-header-actions">
          <a className="zen-sign-in" href={SIGN_IN_URL}>
            Sign in
          </a>
          <button
            type="button"
            className="zen-button zen-button-primary zen-button-small"
            onClick={() => onRegister("ai-pioneer")}
          >
            Register
          </button>
          <button
            type="button"
            className="zen-menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="zen-mobile-nav" aria-label="Mobile navigation">
          <a href="#pioneer" onClick={navigate}>
            AI Pioneer
          </a>
          <a href="#register" onClick={navigate}>
            Vanguard
          </a>
          <a href="#ecosystem" onClick={navigate}>
            Ecosystem
          </a>
          <a href="#organizations" onClick={navigate}>
            For Organizations
          </a>
          <a href={SIGN_IN_URL}>Sign in</a>
        </nav>
      )}
    </header>
  );
}

function Hero({ onRegister }: { onRegister: (program: Program) => void }) {
  return (
    <section id="top" className="zen-hero">
      <div className="zen-hero-thread" aria-hidden="true" />
      <div className="zen-shell zen-hero-grid">
        <div className="zen-hero-copy">
          <h1>
            Build AI.
            <br />
            Ship real work.
            <br />
            Prove what <span>you can do.</span>
          </h1>
          <p>ZEN AI turns AI literacy into working agents, apps, and verified proof of skill.</p>
          <div className="zen-hero-actions">
            <button
              type="button"
              className="zen-button zen-button-primary"
              onClick={() => onRegister("ai-pioneer")}
            >
              Register for AI Pioneer <ArrowRight size={17} />
            </button>
            <a className="zen-button zen-button-secondary" href="#pioneer">
              Explore the program
            </a>
          </div>
          <a className="zen-text-link" href={ARSENAL_URL}>
            Launch Arsenal <ExternalLink size={14} />
          </a>
        </div>

        <div className="zen-hero-visual" aria-label="AI creation system">
          <img
            src={heroVisual}
            alt="A neural constellation connecting a text agent, image studio, and portfolio proof"
          />
          <div className="zen-output-labels" aria-hidden="true">
            <span>
              <MessageSquareText size={15} /> Text agent
            </span>
            <span>
              <ImageIcon size={15} /> Image studio
            </span>
            <span>
              <ShieldCheck size={15} /> Portfolio proof
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const JOURNEY = [
  {
    title: "Understand",
    copy: "See how models learn, reason, create, and sometimes get things wrong.",
    icon: BrainCircuit,
  },
  {
    title: "Experiment",
    copy: "Change prompts, models, tools, and controls inside guided labs.",
    icon: Orbit,
  },
  {
    title: "Build",
    copy: "Turn code and APIs into agents, image tools, and knowledge systems.",
    icon: Code2,
  },
  {
    title: "Showcase",
    copy: "Publish your work, explain your choices, and assemble portfolio proof.",
    icon: Sparkles,
  },
];

function PioneerSection() {
  return (
    <section id="pioneer" className="zen-section zen-pioneer-section">
      <div className="zen-shell">
        <div className="zen-section-heading">
          <p className="zen-section-number">AI Pioneer</p>
          <h2>From first prompt to working AI product.</h2>
          <p>Learn each idea by using it, changing it, and building something you can show.</p>
        </div>

        <div className="zen-journey" aria-label="AI Pioneer learning path">
          {JOURNEY.map(({ title, copy, icon: JourneyIcon }, index) => (
            <article className="zen-journey-step" key={title}>
              <div className="zen-journey-top">
                <span className="zen-journey-index">{index + 1}</span>
                <span className="zen-journey-line" aria-hidden="true" />
              </div>
              <JourneyIcon size={21} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>

        <div className="zen-program-facts" aria-label="Program facts">
          <span>
            <GraduationCap size={18} /> 4 modules
          </span>
          <span>
            <Network size={18} /> 8 sections
          </span>
          <span>
            <Workflow size={18} /> Hands-on labs
          </span>
          <span>
            <Orbit size={18} /> Self-paced + guided sessions
          </span>
        </div>

        <div className="zen-lab-visual">
          <div className="zen-model-controls">
            <p>Model behavior</p>
            {[
              ["Creativity", "64%"],
              ["Precision", "78%"],
              ["Safety", "92%"],
            ].map(([label, width]) => (
              <div className="zen-control" key={label}>
                <span>{label}</span>
                <div>
                  <i style={{ width }} />
                </div>
              </div>
            ))}
          </div>

          <div className="zen-neural-mini" aria-hidden="true">
            {Array.from({ length: 11 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>

          <div className="zen-live-pipeline">
            <p>Idea → live app</p>
            <div>
              <span>input</span>
              <ArrowRight size={14} />
              <span>model</span>
              <ArrowRight size={14} />
              <span>tool</span>
              <ArrowRight size={14} />
              <strong>result</strong>
            </div>
            <small>
              <Check size={13} /> Ready to test
            </small>
          </div>
        </div>

        <div className="zen-pioneer-outcome">
          <p>Build agents, image tools, knowledge systems, and a final portfolio.</p>
          <a className="zen-button zen-button-secondary" href="#register">
            See the AI Pioneer path <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

interface RegistrationDraft {
  fullName: string;
  email: string;
  program: Program;
  registeringAs: RegisteringAs;
  organization: string;
  country: string;
  consent: boolean;
  website: string;
}

const INITIAL_DRAFT: RegistrationDraft = {
  fullName: "",
  email: "",
  program: "ai-pioneer",
  registeringAs: "student",
  organization: "",
  country: "",
  consent: false,
  website: "",
};

function ProgramChoice({
  selected,
  program,
  title,
  audience,
  bullets,
  onSelect,
}: {
  selected: boolean;
  program: Program;
  title: string;
  audience: string;
  bullets: string[];
  onSelect: (program: Program) => void;
}) {
  return (
    <button
      type="button"
      className={`zen-program-choice ${selected ? "is-selected" : ""}`}
      onClick={() => onSelect(program)}
      aria-pressed={selected}
    >
      <span className="zen-program-choice-icon">
        {program === "ai-pioneer" ? <GraduationCap size={24} /> : <ShieldCheck size={23} />}
      </span>
      <span>
        <strong>{title}</strong>
        <small>{audience}</small>
      </span>
      <ul>
        {bullets.map((bullet) => (
          <li key={bullet}>
            <Check size={14} /> {bullet}
          </li>
        ))}
      </ul>
      <span className="zen-program-choice-cta">
        {program === "ai-pioneer" ? "Register & continue to payment" : "Register interest"}{" "}
        <ArrowRight size={15} />
      </span>
    </button>
  );
}

function RegistrationSection({
  selectedProgram,
  onProgramChange,
}: {
  selectedProgram: Program;
  onProgramChange: (program: Program) => void;
}) {
  const [draft, setDraft] = useState<RegistrationDraft>({
    ...INITIAL_DRAFT,
    program: selectedProgram,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDraft((current) => ({ ...current, program: selectedProgram }));
  }, [selectedProgram]);

  const actionCopy =
    draft.program === "ai-pioneer"
      ? "Continue to secure registration"
      : "Register Vanguard interest";

  const setField = <K extends keyof RegistrationDraft>(field: K, value: RegistrationDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const chooseProgram = (program: Program) => {
    onProgramChange(program);
    setField("program", program);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (draft.website) return;
    if (!draft.fullName.trim() || !draft.email.trim() || !draft.country) {
      setError("Add your name, email, and country to continue.");
      return;
    }
    if (!draft.consent) {
      setError("Please confirm the registration and privacy consent.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...draft,
        source: "zenai.world",
        submittedAt: new Date().toISOString(),
      };

      if (REGISTRATION_ENDPOINT) {
        const response = await fetch(REGISTRATION_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = (await response.json().catch(() => ({}))) as {
          checkoutUrl?: string;
          registrationUrl?: string;
          message?: string;
        };

        if (!response.ok) {
          throw new Error(result.message || "Registration could not be completed.");
        }

        const destination = result.checkoutUrl || result.registrationUrl;
        if (!destination) {
          throw new Error("The secure registration destination is unavailable.");
        }
        window.location.assign(destination);
        return;
      }

      sessionStorage.setItem("zen-program-registration-draft", JSON.stringify(payload));
      const destination = new URL(PROGRAM_DESTINATIONS[draft.program]);
      destination.searchParams.set("source", "zenai.world");
      window.location.assign(destination.toString());
    } catch (caught) {
      setSubmitting(false);
      setError(caught instanceof Error ? caught.message : "Registration could not be completed.");
    }
  };

  return (
    <section id="register" className="zen-section zen-register-section">
      <div className="zen-shell">
        <div className="zen-section-heading zen-section-heading-left">
          <p className="zen-section-number">Registration</p>
          <h2>Choose your path.</h2>
          <p>
            One concise start. AI Pioneer continues into secure payment; Vanguard records your
            interest for the next available intake.
          </p>
        </div>

        <div className="zen-registration-layout">
          <div className="zen-program-choices">
            <ProgramChoice
              selected={draft.program === "ai-pioneer"}
              program="ai-pioneer"
              title="AI Pioneer"
              audience="Ages 11–18"
              bullets={[
                "Self-paced access",
                "Hands-on AI builds",
                "Progress saved",
                "Certificate review track",
              ]}
              onSelect={chooseProgram}
            />
            <ProgramChoice
              selected={draft.program === "vanguard"}
              program="vanguard"
              title="ZEN Vanguard"
              audience="Adult operators & builders"
              bullets={["Applied AI operations", "Portfolio-driven"]}
              onSelect={chooseProgram}
            />
          </div>

          <form className="zen-registration-form" onSubmit={submit}>
            <div className="zen-form-grid">
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  autoComplete="name"
                  value={draft.fullName}
                  onChange={(event) => setField("fullName", event.target.value)}
                  placeholder="Enter your full name"
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={draft.email}
                  onChange={(event) => setField("email", event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label>
              <span>Program</span>
              <select
                value={draft.program}
                onChange={(event) => chooseProgram(event.target.value as Program)}
              >
                <option value="ai-pioneer">AI Pioneer</option>
                <option value="vanguard">ZEN Vanguard</option>
              </select>
            </label>

            <fieldset>
              <legend>Registering as</legend>
              <div className="zen-segmented">
                {(
                  [
                    ["student", "Student"],
                    ["parent", "Parent or guardian"],
                    ["organization", "Organization"],
                    ["self", "Self"],
                  ] as [RegisteringAs, string][]
                ).map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="registeringAs"
                      value={value}
                      checked={draft.registeringAs === value}
                      onChange={() => setField("registeringAs", value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="zen-form-grid">
              <label>
                <span>Organization or school (optional)</span>
                <input
                  type="text"
                  autoComplete="organization"
                  value={draft.organization}
                  onChange={(event) => setField("organization", event.target.value)}
                  placeholder="Organization or school"
                />
              </label>
              <label>
                <span>Country</span>
                <select
                  value={draft.country}
                  onChange={(event) => setField("country", event.target.value)}
                >
                  <option value="">Select your country</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>South Africa</option>
                  <option>Australia</option>
                  <option>India</option>
                  <option>Nigeria</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <label className="zen-honeypot" aria-hidden="true">
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={draft.website}
                onChange={(event) => setField("website", event.target.value)}
              />
            </label>

            <label className="zen-consent">
              <input
                type="checkbox"
                checked={draft.consent}
                onChange={(event) => setField("consent", event.target.checked)}
              />
              <span>
                I agree to the <a href="/terms-and-conditions">Terms</a> and{" "}
                <a href="/privacy-policy">Privacy Policy</a> and consent to program registration
                communication.
              </span>
            </label>

            {error && (
              <p className="zen-form-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="zen-button zen-button-primary zen-submit"
              disabled={submitting}
            >
              {submitting ? "Opening secure registration…" : actionCopy}
              {!submitting && <ArrowRight size={17} />}
            </button>
            <p className="zen-secure-note">
              <LockKeyhole size={14} /> AI Pioneer payment is completed on Stripe. Access is granted
              only after the payment webhook is verified.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

const ECOSYSTEM = [
  {
    title: "Arsenal",
    copy: "Build agents and workflows",
    href: ARSENAL_URL,
    action: "Launch Arsenal",
    icon: Workflow,
  },
  {
    title: "ZEN Credentials",
    copy: "Verify proof of work",
    href: `mailto:${CONTACT_EMAIL}?subject=ZEN%20Credentials`,
    action: "Explore credentials",
    icon: ShieldCheck,
  },
  {
    title: "AI Arena",
    copy: "Compare models",
    href: AI_ARENA_URL,
    action: "Enter AI Arena",
    icon: Network,
  },
  {
    title: "Organizations",
    copy: "Bring a cohort",
    href: `mailto:${CONTACT_EMAIL}?subject=ZEN%20AI%20Cohort`,
    action: "For organizations",
    icon: Building2,
  },
];

function EcosystemSection() {
  return (
    <section id="ecosystem" className="zen-section zen-ecosystem-section">
      <div className="zen-shell">
        <div className="zen-ecosystem-heading">
          <h2>One ecosystem. Clear destinations.</h2>
          <span aria-hidden="true" />
        </div>
        <div className="zen-ecosystem-rail">
          {ECOSYSTEM.map(({ title, copy, href, action, icon: EcosystemIcon }) => (
            <a href={href} className="zen-ecosystem-link" key={title}>
              <EcosystemIcon size={23} />
              <span>
                <strong>{title}</strong>
                <small>{copy}</small>
              </span>
              <em>
                {action} <ArrowRight size={14} />
              </em>
            </a>
          ))}
        </div>

        <div id="organizations" className="zen-organization-band">
          <div>
            <p className="zen-section-number">Schools · Companies · Communities</p>
            <h3>Run one cohort or scale across an organization.</h3>
          </div>
          <p>
            Use the same self-paced program with organization-paid access, guided sessions, cohort
            grouping, learner oversight, and contract or promotional enrollment.
          </p>
          <a
            className="zen-button zen-button-secondary"
            href={`mailto:${CONTACT_EMAIL}?subject=ZEN%20AI%20Organization%20Access`}
          >
            Talk with ZEN <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="zen-footer">
      <div className="zen-shell zen-footer-top">
        <ZenMark />
        <nav aria-label="Footer navigation">
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
          <a href="/privacy-policy">Privacy</a>
          <a href="/terms-and-conditions">Terms</a>
          <a href="/refund-policy">Refunds</a>
          <a href="/accessibility-statement">Accessibility</a>
          <a href="/admin/registrations">Admin</a>
        </nav>
      </div>
      <div className="zen-shell zen-footer-bottom">
        <span>© {year} ZEN AI Co.</span>
        <span>AI literacy · deployment · proof</span>
      </div>
    </footer>
  );
}

function MobileActionBar({ onRegister }: { onRegister: (program: Program) => void }) {
  return (
    <div className="zen-mobile-actions">
      <button
        type="button"
        className="zen-button zen-button-primary"
        onClick={() => onRegister("ai-pioneer")}
      >
        Register <ArrowRight size={16} />
      </button>
      <a href={SIGN_IN_URL}>Sign in</a>
    </div>
  );
}

function Index() {
  const [selectedProgram, setSelectedProgram] = useState<Program>("ai-pioneer");

  const selectAndScroll = (program: Program) => {
    setSelectedProgram(program);
    requestAnimationFrame(() => {
      document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className="zen-site">
      <Header onRegister={selectAndScroll} />
      <Hero onRegister={selectAndScroll} />
      <PioneerSection />
      <RegistrationSection selectedProgram={selectedProgram} onProgramChange={setSelectedProgram} />
      <EcosystemSection />
      <Footer />
      <MobileActionBar onRegister={selectAndScroll} />
    </main>
  );
}
