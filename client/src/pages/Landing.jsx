import { useEffect, useRef, useState, useCallback } from "react";
import "./Landing.css";

/* ----------------------------------------------------------------------- */
/*  Small utilities                                                        */
/* ----------------------------------------------------------------------- */

// Reveals an element once it scrolls into view, and keeps the state so we
// can trigger count-up numbers / line-draw animations exactly once.
function useInView(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

// Animates a number from 0 -> target once `start` becomes true.
function useCountUp(target, start, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

/* ----------------------------------------------------------------------- */
/*  Icon set — small inline SVGs, no icon library                          */
/* ----------------------------------------------------------------------- */

const Icon = {
  logo: (p) => (
    <svg viewBox="0 0 32 32" fill="none" {...p}>
      <rect width="32" height="32" rx="9" fill="url(#logoGrad)" />
      <path d="M10 21V11.6c0-.6.5-1 1-1h4.4c2.5 0 4.2 1.6 4.2 3.9 0 2.3-1.7 3.9-4.2 3.9H13v2.6c0 .6-.4 1-1 1h-1c-.6 0-1-.4-1-1Zm3-6.4h2.1c1 0 1.6-.6 1.6-1.5s-.6-1.5-1.6-1.5H13v3Z" fill="#0A0B0D" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#5EA7F2" />
        </linearGradient>
      </defs>
    </svg>
  ),
  arrowRight: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  play: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M6.5 4.8v10.4c0 .7.8 1.2 1.4.8l8.2-5.2c.6-.4.6-1.3 0-1.6L7.9 4c-.6-.4-1.4 0-1.4.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="9" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 20c.6-3.6 3-5.6 5.5-5.6s4.9 2 5.5 5.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.3 5.3c1.6.3 2.8 1.7 2.8 3.4 0 1.7-1.2 3.1-2.8 3.4M17.8 14.7c2 .5 3.5 2.3 3.9 5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  bell: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.2 1.5 5.2H4.5S6 14 6 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 18.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="M10 1.6l2.5 5.3 5.7.7-4.2 4 1.1 5.8L10 14.7l-5.1 2.7 1.1-5.8-4.2-4 5.7-.7L10 1.6Z" />
    </svg>
  ),
  chat: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5.5h16v10.2H9.6L5 19.3v-3.6H4V5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  building: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="5" y="3.5" width="10" height="17" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 10.5h4v10H15M8 7.5h1M11.5 7.5h1M8 11h1M11.5 11h1M8 14.5h1M11.5 14.5h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  target: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
    </svg>
  ),
  mic: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="9.2" y="3.5" width="5.6" height="10" rx="2.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3M9 20.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  trend: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 16l5.2-5.6 4 3.6L20 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 6H20v5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  history: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 12a8 8 0 1 1 2.6 5.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 8v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8.5V12l2.6 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  spark: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.8 2.8M15.2 15.2 18 18M18 6l-2.8 2.8M8.8 15.2 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 20 20" fill="none" {...p}>
      <path d="M4 10.5l3.6 3.6L16 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ----------------------------------------------------------------------- */
/*  Section: Nav                                                           */
/* ----------------------------------------------------------------------- */

function Nav({ onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`pp-nav ${scrolled ? "pp-nav--scrolled" : ""}`}>
      <div className="pp-shell pp-nav__row">
        <div className="pp-nav__brand">
          <Icon.logo className="pp-nav__mark" />
          <span>PlacementPrep</span>
        </div>
        <nav className="pp-nav__links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#walkthrough">Product</a>
          <a href="#testimonials">Stories</a>
        </nav>
        <div className="pp-nav__actions">
          <button className="pp-btn pp-btn--ghost" onClick={onLogin}>
            Log in
          </button>
          <button className="pp-btn pp-btn--primary" onClick={onLogin}>
            Start Mock Interview
          </button>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section 1: Hero + interactive dashboard mockup                         */
/* ----------------------------------------------------------------------- */

function DashboardMock() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const score = useCountUp(4.8, inView, 1200);
  const requests = useCountUp(3, inView, 900);

  return (
    <div className="pp-dash" ref={ref}>
      <div className="pp-dash__glow" aria-hidden="true" />
      <div className="pp-dash__card pp-dash__card--main">
        <div className="pp-dash__topbar">
          <span className="pp-dash__dot pp-dash__dot--r" />
          <span className="pp-dash__dot pp-dash__dot--y" />
          <span className="pp-dash__dot pp-dash__dot--g" />
          <span className="pp-dash__title">Your dashboard</span>
        </div>

        <div className="pp-dash__body">
          <div className="pp-dash__block">
            <div className="pp-dash__label">
              <Icon.calendar className="pp-ic" /> Upcoming interview
            </div>
            <div className="pp-dash__upcoming">
              <div className="pp-dash__avatar pp-dash__avatar--blue">R</div>
              <div>
                <div className="pp-dash__upcoming-name">Rhea M. · SDE Mock</div>
                <div className="pp-dash__upcoming-time">Tomorrow, 6:30 PM</div>
              </div>
              <span className="pp-chip pp-chip--live">Confirmed</span>
            </div>
          </div>

          <div className="pp-dash__row2">
            <div className="pp-dash__block pp-dash__block--half">
              <div className="pp-dash__label">
                <Icon.users className="pp-ic" /> Pending requests
              </div>
              <div className="pp-dash__count">{Math.round(requests)}</div>
              <div className="pp-dash__sub">waiting on your response</div>
            </div>
            <div className="pp-dash__block pp-dash__block--half">
              <div className="pp-dash__label">
                <Icon.star className="pp-ic" /> Feedback score
              </div>
              <div className="pp-dash__count pp-dash__count--accent">
                {score.toFixed(1)}
                <span className="pp-dash__count-max">/5</span>
              </div>
              <div className="pp-dash__sub">across 12 sessions</div>
            </div>
          </div>

          <div className="pp-dash__block">
            <div className="pp-dash__label">
              <Icon.building className="pp-ic" /> Company interview list
            </div>
            <div className="pp-dash__companies">
              {["Amazon", "Stripe", "Google", "Atlassian"].map((c) => (
                <span className="pp-dash__company" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pp-dash__card pp-dash__card--float">
        <Icon.bell className="pp-ic" />
        <div>
          <div className="pp-dash__float-title">Request accepted</div>
          <div className="pp-dash__float-sub">Karan accepted your slot</div>
        </div>
      </div>
    </div>
  );
}

function Hero({ onLogin }) {
  return (
    <section className="pp-hero">
      <div className="pp-shell pp-hero__grid">
        <div className="pp-hero__copy">
          <span className="pp-eyebrow">Mock interviews, built for placements</span>
          <h1 className="pp-hero__headline">
            Practice like it's <span className="pp-grad-text">the real interview.</span>
          </h1>
          <p className="pp-hero__sub">
            Join mock interviews with peers and seniors, receive real feedback,
            improve communication, and prepare for placements with confidence.
          </p>
          <div className="pp-hero__cta">
            <button className="pp-btn pp-btn--primary pp-btn--lg" onClick={onLogin}>
              Start Mock Interview
              <Icon.arrowRight className="pp-ic pp-ic--sm" />
            </button>
            <a href="#features" className="pp-btn pp-btn--outline pp-btn--lg">
              <Icon.play className="pp-ic pp-ic--sm" />
              Explore Features
            </a>
          </div>
          <div className="pp-hero__proof">
            <div className="pp-avatar-stack">
              <span />
              <span />
              <span />
            </div>
            <span className="pp-hero__proof-text">
              Trusted by students preparing for 40+ companies
            </span>
          </div>
        </div>

        <DashboardMock />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section 2: The problem — vertical visual timeline                      */
/* ----------------------------------------------------------------------- */

const PROBLEMS = [
  { icon: Icon.users, title: "Nobody to practice with", desc: "Friends are busy, seniors are hard to reach, and solo prep only goes so far." },
  { icon: Icon.chat, title: "No structured feedback", desc: "Vague \"you did fine\" comments don't tell you what to actually fix." },
  { icon: Icon.spark, title: "Interview anxiety", desc: "The first real interview becomes the first time nerves are tested too." },
  { icon: Icon.target, title: "Missed opportunities", desc: "Without reps, strong candidates freeze up when it matters most." },
  { icon: Icon.mic, title: "Poor communication skills", desc: "Technical knowledge doesn't always translate into a clear, confident answer." },
];

function ProblemItem({ item, index }) {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const Icn = item.icon;
  return (
    <div className={`pp-tl-item ${inView ? "is-in" : ""}`} ref={ref}>
      <div className="pp-tl-item__marker">
        <Icn className="pp-ic" />
      </div>
      <div className="pp-tl-item__body">
        <span className="pp-tl-item__index">{String(index + 1).padStart(2, "0")}</span>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="pp-section pp-problem">
      <div className="pp-shell">
        <div className="pp-section__head pp-section__head--left">
          <span className="pp-eyebrow">The problem</span>
          <h2>Preparing alone doesn't work</h2>
          <p className="pp-section__lead">
            Most placement prep breaks down in the same five places. PlacementPrep
            exists to close each one.
          </p>
        </div>
        <div className="pp-tl">
          <div className="pp-tl__line" aria-hidden="true" />
          {PROBLEMS.map((p, i) => (
            <ProblemItem item={p} index={i} key={p.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section 3: How it works — horizontal timeline that draws on scroll     */
/* ----------------------------------------------------------------------- */

const STEPS = [
  { title: "Create a slot", desc: "Open a time slot for a mock interview." },
  { title: "Candidates request", desc: "Peers request to join your slot." },
  { title: "Accept or decline", desc: "Choose who you'll interview." },
  { title: "Link unlocks", desc: "A meeting link becomes available." },
  { title: "Conduct interview", desc: "Run the mock, just like the real thing." },
  { title: "Exchange feedback", desc: "Both sides share structured feedback." },
];

function HowItWorks() {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <section className="pp-section" id="how-it-works" ref={ref}>
      <div className="pp-shell">
        <div className="pp-section__head">
          <span className="pp-eyebrow">How it works</span>
          <h2>From open slot to real feedback, in six steps</h2>
        </div>
        <div className={`pp-hw ${inView ? "is-in" : ""}`}>
          <div className="pp-hw__track">
            <div className="pp-hw__fill" />
          </div>
          <div className="pp-hw__steps">
            {STEPS.map((s, i) => (
              <div className="pp-hw__step" key={s.title} style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="pp-hw__node">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section 4: Feature showcase — editorial bento grid                     */
/* ----------------------------------------------------------------------- */

function BentoPreviewScheduling() {
  return (
    <div className="pp-bento__preview pp-bento__preview--schedule">
      <div className="pp-bento__preview-row">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
      </div>
      <div className="pp-bento__preview-grid">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className={i === 6 || i === 11 ? "is-on" : ""} />
        ))}
      </div>
    </div>
  );
}

function BentoPreviewRequests() {
  return (
    <div className="pp-bento__preview pp-bento__preview--requests">
      {["Ananya", "Devesh"].map((n) => (
        <div className="pp-bento__request" key={n}>
          <span className="pp-dash__avatar pp-dash__avatar--sm">{n[0]}</span>
          <span className="pp-bento__request-name">{n}</span>
          <span className="pp-bento__accept"><Icon.check className="pp-ic pp-ic--xs" /></span>
        </div>
      ))}
    </div>
  );
}

function BentoPreviewFeedback() {
  return (
    <div className="pp-bento__preview pp-bento__preview--feedback">
      <div className="pp-bento__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon.star key={n} className={`pp-ic pp-ic--xs ${n <= 4 ? "is-filled" : ""}`} />
        ))}
      </div>
      <div className="pp-bento__feedback-bar"><span style={{ width: "82%" }} /></div>
      <div className="pp-bento__feedback-bar"><span style={{ width: "64%" }} /></div>
    </div>
  );
}

function BentoPreviewCompanies() {
  return (
    <div className="pp-bento__preview pp-bento__preview--companies">
      {["Google", "Amazon", "Stripe", "Adobe", "Meta"].map((c) => (
        <span key={c} className="pp-bento__company-row">
          <Icon.building className="pp-ic pp-ic--xs" /> {c}
        </span>
      ))}
    </div>
  );
}

function BentoPreviewOpportunities() {
  return (
    <div className="pp-bento__preview pp-bento__preview--opps">
      <div className="pp-bento__opp"><Icon.target className="pp-ic pp-ic--xs" /> SDE Intern — Applied</div>
      <div className="pp-bento__opp"><Icon.target className="pp-ic pp-ic--xs" /> Analyst — Shortlisted</div>
    </div>
  );
}

function BentoPreviewReviews() {
  return (
    <div className="pp-bento__preview pp-bento__preview--reviews">
      <p>"Sharp, structured, and exactly like the real onsite."</p>
      <span>— 4th year, ECE</span>
    </div>
  );
}

const BENTO = [
  { size: "lg", title: "Mock Interview Scheduling", desc: "Open a slot in seconds and let peers book the time that works.", preview: BentoPreviewScheduling },
  { size: "md", title: "Real-Time Request Management", desc: "Accept, decline, or reschedule requests the moment they land.", preview: BentoPreviewRequests },
  { size: "md", title: "Interview Feedback", desc: "Structured scorecards replace vague, forgettable comments.", preview: BentoPreviewFeedback },
  { size: "lg", title: "Company Interview Experiences", desc: "Read real rounds from students who interviewed at your target company.", preview: BentoPreviewCompanies },
  { size: "md", title: "Placement Opportunities", desc: "Track applications and interview stages in one place.", preview: BentoPreviewOpportunities },
  { size: "md", title: "Student Reviews", desc: "See how past interviewers rated the experience.", preview: BentoPreviewReviews },
];

function BentoCard({ item }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const Preview = item.preview;
  return (
    <div className={`pp-bento__card pp-bento__card--${item.size} ${inView ? "is-in" : ""}`} ref={ref}>
      <div className="pp-bento__text">
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
      </div>
      <Preview />
    </div>
  );
}

function FeatureShowcase() {
  return (
    <section className="pp-section pp-section--alt" id="features">
      <div className="pp-shell">
        <div className="pp-section__head">
          <span className="pp-eyebrow">Everything you need</span>
          <h2>Built like a real product, not a checklist</h2>
        </div>
        <div className="pp-bento">
          {BENTO.map((item) => (
            <BentoCard item={item} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section 5: Product walkthrough — alternating screenshots               */
/* ----------------------------------------------------------------------- */

function ScreenDashboard() {
  return (
    <div className="pp-screen">
      <div className="pp-screen__bar"><span /><span /><span /></div>
      <div className="pp-screen__body pp-screen__body--dashboard">
        <div className="pp-screen__side">
          <span className="is-active">Dashboard</span>
          <span>My Slots</span>
          <span>Requests</span>
          <span>Feedback</span>
        </div>
        <div className="pp-screen__main">
          <div className="pp-screen__stat"><b>4.8</b><small>Avg score</small></div>
          <div className="pp-screen__stat"><b>12</b><small>Interviews</small></div>
          <div className="pp-screen__stat"><b>3</b><small>Pending</small></div>
        </div>
      </div>
    </div>
  );
}

function ScreenCreatedSlots() {
  return (
    <div className="pp-screen">
      <div className="pp-screen__bar"><span /><span /><span /></div>
      <div className="pp-screen__list">
        {["Backend · Wed 5:00 PM", "System Design · Fri 7:30 PM", "HR Round · Sat 11:00 AM"].map((s) => (
          <div className="pp-screen__list-row" key={s}>
            <span>{s}</span>
            <span className="pp-chip pp-chip--muted">Open</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenRequestedSlots() {
  return (
    <div className="pp-screen">
      <div className="pp-screen__bar"><span /><span /><span /></div>
      <div className="pp-screen__list">
        {["DSA Round · Priya S.", "Product Sense · Mohit K."].map((s) => (
          <div className="pp-screen__list-row" key={s}>
            <span>{s}</span>
            <span className="pp-chip pp-chip--live">Requested</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenNotifications() {
  return (
    <div className="pp-screen">
      <div className="pp-screen__bar"><span /><span /><span /></div>
      <div className="pp-screen__list">
        {["Your request was accepted", "New feedback received", "Slot starts in 1 hour"].map((s) => (
          <div className="pp-screen__list-row" key={s}>
            <Icon.bell className="pp-ic pp-ic--xs" />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenFeedbackModal() {
  return (
    <div className="pp-screen">
      <div className="pp-screen__bar"><span /><span /><span /></div>
      <div className="pp-screen__modal">
        <h4>Rate this interview</h4>
        <div className="pp-bento__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <Icon.star key={n} className={`pp-ic ${n <= 4 ? "is-filled" : ""}`} />
          ))}
        </div>
        <div className="pp-screen__textarea">Clear structure, could dive deeper on trade-offs.</div>
      </div>
    </div>
  );
}

function ScreenExperiencePage() {
  return (
    <div className="pp-screen">
      <div className="pp-screen__bar"><span /><span /><span /></div>
      <div className="pp-screen__article">
        <span className="pp-chip pp-chip--muted">Amazon · SDE-1</span>
        <div className="pp-screen__article-line" />
        <div className="pp-screen__article-line" style={{ width: "88%" }} />
        <div className="pp-screen__article-line" style={{ width: "72%" }} />
      </div>
    </div>
  );
}

const WALKTHROUGH = [
  { name: "Dashboard", desc: "Everything that matters — upcoming interviews, open requests, and your feedback trend — on one screen.", Screen: ScreenDashboard },
  { name: "Created Slots", desc: "See every slot you've opened and its status at a glance.", Screen: ScreenCreatedSlots },
  { name: "Requested Slots", desc: "Track the sessions you've asked to join, and where they stand.", Screen: ScreenRequestedSlots },
  { name: "Notifications", desc: "Acceptances, feedback, and reminders land the moment they happen.", Screen: ScreenNotifications },
  { name: "Feedback Modal", desc: "A quick, structured rating flow that both sides fill out after every session.", Screen: ScreenFeedbackModal },
  { name: "Interview Experience Page", desc: "Read detailed, round-by-round accounts from students who've been there.", Screen: ScreenExperiencePage },
];

function WalkthroughRow({ item, index }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const reversed = index % 2 === 1;
  return (
    <div className={`pp-walk ${reversed ? "pp-walk--rev" : ""} ${inView ? "is-in" : ""}`} ref={ref}>
      <div className="pp-walk__copy">
        <span className="pp-eyebrow">{String(index + 1).padStart(2, "0")}</span>
        <h3>{item.name}</h3>
        <p>{item.desc}</p>
      </div>
      <div className="pp-walk__visual">
        <item.Screen />
      </div>
    </div>
  );
}

function Walkthrough() {
  return (
    <section className="pp-section" id="walkthrough">
      <div className="pp-shell">
        <div className="pp-section__head">
          <span className="pp-eyebrow">Product walkthrough</span>
          <h2>Every screen, built to feel real</h2>
        </div>
        <div className="pp-walk-list">
          {WALKTHROUGH.map((item, i) => (
            <WalkthroughRow item={item} index={i} key={item.name} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section 6: Why students love it — benefits + stats                     */
/* ----------------------------------------------------------------------- */

const BENEFITS = [
  { icon: Icon.spark, title: "Become confident", desc: "Repetition under real conditions turns nerves into muscle memory." },
  { icon: Icon.chat, title: "Practice communication", desc: "Explaining your thinking out loud is a skill — this is where you build it." },
  { icon: Icon.users, title: "Learn from peers", desc: "See how others approach the same problems and questions." },
  { icon: Icon.target, title: "Improve technical interviews", desc: "Sharpen problem-solving under time pressure, round after round." },
  { icon: Icon.history, title: "Track interview history", desc: "Every session and score, kept in one running record." },
  { icon: Icon.trend, title: "Build consistency", desc: "Small, regular practice compounds faster than last-minute cramming." },
];

function StatItem({ value, suffix, label }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const n = useCountUp(value, inView, 1300);
  return (
    <div className="pp-stat" ref={ref}>
      <div className="pp-stat__value">
        {Number.isInteger(value) ? Math.round(n) : n.toFixed(1)}
        <span>{suffix}</span>
      </div>
      <div className="pp-stat__label">{label}</div>
    </div>
  );
}

function WhyLoveIt() {
  return (
    <section className="pp-section pp-section--alt">
      <div className="pp-shell">
        <div className="pp-section__head">
          <span className="pp-eyebrow">Why students love it</span>
          <h2>Outcomes, not just features</h2>
        </div>

        <div className="pp-benefits">
          {BENEFITS.map((b) => {
            const Icn = b.icon;
            return (
              <div className="pp-benefit" key={b.title}>
                <Icn className="pp-ic" />
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="pp-stats">
          <StatItem value={4.8} suffix="/5" label="Average feedback score" />
          <StatItem value={2100} suffix="+" label="Mock interviews conducted" />
          <StatItem value={92} suffix="%" label="Felt more confident after 3 sessions" />
          <StatItem value={40} suffix="+" label="Companies represented" />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section 8: Testimonials                                                */
/* ----------------------------------------------------------------------- */

const TESTIMONIALS = [
  {
    name: "Sanya Kapoor",
    role: "SDE-1 · Placed at Atlassian",
    quote: "Three mock rounds in and my answers finally had structure. The feedback was specific enough to actually act on.",
    rating: 5,
    metric: "+1.4 score improvement",
  },
  {
    name: "Arjun Verma",
    role: "Analyst · Placed at Deutsche Bank",
    quote: "Practicing with seniors who'd already cleared the same interview changed how I prepared completely.",
    rating: 5,
    metric: "6 mock interviews",
  },
  {
    name: "Meera Iyer",
    role: "SDE Intern · Placed at Flipkart",
    quote: "The feedback modal alone is worth it — no more vague \"good job, keep practicing.\"",
    rating: 4,
    metric: "4.9 avg rating given",
  },
];

function TestimonialCard({ t }) {
  const initials = t.name.split(" ").map((w) => w[0]).join("");
  return (
    <div className="pp-testi">
      <div className="pp-bento__stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon.star key={i} className={`pp-ic pp-ic--sm ${i < t.rating ? "is-filled" : ""}`} />
        ))}
      </div>
      <p className="pp-testi__quote">"{t.quote}"</p>
      <div className="pp-testi__footer">
        <div className="pp-dash__avatar pp-dash__avatar--blue">{initials}</div>
        <div>
          <div className="pp-testi__name">{t.name}</div>
          <div className="pp-testi__role">{t.role}</div>
        </div>
        <span className="pp-chip pp-chip--muted pp-testi__metric">{t.metric}</span>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="pp-section" id="testimonials">
      <div className="pp-shell">
        <div className="pp-section__head">
          <span className="pp-eyebrow">Stories</span>
          <h2>What practicing here actually changes</h2>
        </div>
        <div className="pp-testi-grid">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard t={t} key={t.name} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section 9: Final CTA                                                   */
/* ----------------------------------------------------------------------- */

function FinalCTA({ onLogin }) {
  return (
    <section className="pp-final">
      <div className="pp-shell pp-final__inner">
        <h2>
          Your next interview shouldn't be
          <br />
          <span className="pp-grad-text">your first practice.</span>
        </h2>
        <button className="pp-btn pp-btn--primary pp-btn--lg" onClick={onLogin}>
          Start Practicing
          <Icon.arrowRight className="pp-ic pp-ic--sm" />
        </button>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/*  Footer                                                                 */
/* ----------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="pp-footer">
      <div className="pp-shell pp-footer__row">
        <div className="pp-nav__brand">
          <Icon.logo className="pp-nav__mark" />
          <span>PlacementPrep</span>
        </div>
        <nav className="pp-footer__links">
          <a href="#">About</a>
          <a href="#features">Features</a>
          <a href="#walkthrough">Resources</a>
          <a href="#">Privacy</a>
          <a href="#">GitHub</a>
          <a href="#">Contact</a>
        </nav>
        <span className="pp-footer__copy">© {new Date().getFullYear()} PlacementPrep</span>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------------- */
/*  Page                                                                   */
/* ----------------------------------------------------------------------- */

export default function LandingPage({ login }) {
  const handleLogin = useCallback(() => {
    if (typeof login === "function") login();
  }, [login]);

  return (
    <div className="pp-page">
      <Nav onLogin={handleLogin} />
      <Hero onLogin={handleLogin} />
      <ProblemSection />
      <HowItWorks />
      <FeatureShowcase />
      <Walkthrough />
      <WhyLoveIt />
      <Testimonials />
      <FinalCTA onLogin={handleLogin} />
      <Footer />
    </div>
  );
}
