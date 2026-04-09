import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SupportBot from "./common/SupportBot";

const stats = [
  { value: "24/7", label: "patient access through one refined portal" },
  { value: "4 roles", label: "patients, doctors, staff, and admins" },
  { value: "1 flow", label: "from signup to care coordination" },
];

const pathways = [
  {
    tag: "Immediate entry",
    title: "Patients move forward instantly",
    text: "Patient onboarding is presented as one guided path from account creation to profile setup and then directly into the dashboard.",
  },
  {
    tag: "Approval lane",
    title: "Team access stays controlled",
    text: "Doctors, staff, and admins are framed as an approval-based intake so the experience matches your operational logic.",
  },
  {
    tag: "Unified care",
    title: "Appointments, files, and billing stay connected",
    text: "The homepage language now reflects a complete health management system instead of a generic medical landing page.",
  },
];

const highlights = [
  {
    title: "Editorial healthcare",
    text: "A warmer palette and stronger typography make the product feel premium instead of template-based.",
  },
  {
    title: "Layered storytelling",
    text: "Images, cards, and sections are composed like a brand campaign while still supporting the portal's actual routes.",
  },
  {
    title: "Responsive presence",
    text: "The layout keeps the same character on desktop and mobile without collapsing into a plain stacked screen.",
  },
];

const gallery = [
  {
    title: "Concierge patient arrival",
    text: "A softer first impression for onboarding and patient trust.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Clinical collaboration",
    text: "A more elevated visual story for doctors, staff, and care teams.",
    image:
      "https://images.unsplash.com/photo-1580281657702-257584239a9b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Human-centered environment",
    text: "Photography and composition that feel calm, modern, and memorable.",
    image:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=900&q=80",
  },
];

function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');
        :root{--ivory:#f7f1e7;--cream:#fdf9f2;--green:#11241f;--green2:#1d3932;--copper:#bf6d42;--muted:#5c6c66;--line:rgba(17,36,31,.1);--card:rgba(255,255,255,.56);--shadow:0 24px 60px rgba(17,36,31,.12)}
        *{box-sizing:border-box} html{scroll-behavior:smooth} body{margin:0;font-family:'Manrope',sans-serif;background:radial-gradient(circle at top left,rgba(191,109,66,.18),transparent 33%),radial-gradient(circle at 85% 10%,rgba(151,171,160,.22),transparent 24%),linear-gradient(180deg,#f8f4ec 0%,#f2ebdf 100%);color:var(--green)}
        a{text-decoration:none;color:inherit} img{display:block;width:100%}
        .home-root{min-height:100vh;overflow:hidden}
        .wrap{width:min(1200px,calc(100% - 44px));margin:0 auto;position:relative;z-index:1}
        .topbar{position:sticky;top:14px;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:18px;width:min(1200px,calc(100% - 24px));margin:18px auto 0;padding:14px 18px;border:1px solid var(--line);border-radius:999px;background:rgba(253,249,242,.74);backdrop-filter:blur(14px);box-shadow:0 16px 36px rgba(17,36,31,.08);transition:.25s ease}
        .topbar.scrolled{transform:translateY(-2px);background:rgba(253,249,242,.9);box-shadow:0 22px 46px rgba(17,36,31,.12)}
        .brand{display:flex;align-items:center;gap:12px}.brand-badge{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(135deg,var(--green),#24453d);color:var(--cream);font:700 1.1rem 'Fraunces',serif}.brand-title{font-size:1rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase}.brand-sub{font-size:.8rem;color:var(--muted)}
        .nav{display:flex;gap:22px;color:var(--muted);font-size:.94rem}.nav a:hover{color:var(--green)}
        .actions,.hero-actions,.cta-actions{display:flex;flex-wrap:wrap;gap:12px}
        .btn,.hero-btn,.cta-btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 22px;border-radius:999px;font-weight:700;border:1px solid var(--line);transition:.22s ease}
        .btn:hover,.hero-btn:hover,.cta-btn:hover{transform:translateY(-2px)}
        .primary{background:linear-gradient(135deg,var(--green),#25453c);color:var(--cream);box-shadow:0 18px 36px rgba(17,36,31,.2)}
        .ghost{background:rgba(255,255,255,.45);color:var(--green)}
        .hero{display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center;padding:68px 0 56px}
        .eyebrow{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.52);border:1px solid var(--line);font-size:.82rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
        .eyebrow:before{content:"";width:8px;height:8px;border-radius:50%;background:var(--copper);box-shadow:0 0 0 8px rgba(191,109,66,.16)}
        .hero h1,.section h2,.cta-panel h2{margin:20px 0 16px;font-family:'Fraunces',serif;line-height:.95;letter-spacing:-.04em;color:var(--green)}
        .hero h1{font-size:clamp(3rem,7vw,5.9rem)} .hero h1 span{display:block;color:var(--copper)}
        .hero p,.section p,.card p,.gallery-copy,.cta-panel p{line-height:1.8;color:var(--muted)}
        .hero-copy>p{max-width:620px;font-size:1.03rem;margin:0 0 28px}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:34px}
        .stat,.path,.note,.gallery-card{background:var(--card);border:1px solid var(--line);box-shadow:0 18px 40px rgba(17,36,31,.08)}
        .stat{padding:18px;border-radius:24px}.stat strong{display:block;margin-bottom:8px;font:700 1.7rem 'Fraunces',serif;color:var(--green)}.stat span{font-size:.92rem;color:var(--muted);line-height:1.6}
        .stage{position:relative;min-height:680px}
        .panel{position:absolute;overflow:hidden;border-radius:34px;box-shadow:var(--shadow)}
        .panel img{height:100%;object-fit:cover;filter:saturate(.93) contrast(1.03)}
        .panel.main{inset:0 72px 110px 0;border-top-left-radius:130px}
        .panel.side{right:0;bottom:20px;width:44%;height:38%;border:10px solid rgba(247,241,231,.96)}
        .float{position:absolute;padding:22px 22px 20px;border-radius:28px;background:rgba(253,249,242,.88);border:1px solid var(--line);box-shadow:0 22px 46px rgba(17,36,31,.12);backdrop-filter:blur(14px)}
        .float.top{top:30px;right:12px;width:min(290px,100%)} .float.bottom{left:-6px;bottom:118px;width:min(300px,calc(100% - 24px))}
        .kicker,.section-kicker,.tag{font-size:.78rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
        .kicker,.section-kicker{color:var(--copper)} .float h3,.path h3,.note h3,.gallery-card h3{margin:10px 0 12px;font-family:'Fraunces',serif;line-height:1.08;color:var(--green)}
        .float h3{font-size:1.5rem}.flow{display:grid;gap:10px;margin-top:16px}.flow div{display:flex;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:16px;background:rgba(17,36,31,.04);font-size:.9rem}.flow strong{font-size:.78rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase}
        .section{padding:56px 0}.section-kicker{display:block;margin-bottom:12px}.section h2{max-width:760px;font-size:clamp(2.1rem,4vw,3.5rem)}.section .intro{max-width:720px;margin:0 0 28px}
        .band{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:20px 22px;border-radius:30px;background:linear-gradient(135deg,var(--green),#224038);color:rgba(253,249,242,.92);box-shadow:var(--shadow)}
        .band-item{display:flex;gap:14px;line-height:1.7;font-size:.94rem}.band-no{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.08);font-weight:800;color:#ffd3bb}
        .paths,.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .path{padding:28px;border-radius:30px}.tag{display:inline-flex;padding:8px 12px;border-radius:999px;background:rgba(191,109,66,.14);color:var(--copper)} .path h3{font-size:1.6rem}
        .identity{display:grid;grid-template-columns:1.08fr .92fr;gap:22px}
        .visual{position:relative;overflow:hidden;border-radius:34px;box-shadow:var(--shadow)} .visual img{height:100%;min-height:510px;object-fit:cover}
        .note{position:absolute;left:24px;right:24px;bottom:24px;padding:22px 24px;border-radius:26px;background:rgba(253,249,242,.9)} .note h3{font-size:1.55rem}
        .stack{display:grid;gap:18px}.card{padding:26px;border-radius:28px;background:rgba(255,255,255,.58);border:1px solid var(--line);box-shadow:0 18px 40px rgba(17,36,31,.08)} .card h3{margin:0 0 12px;font-family:'Fraunces',serif;font-size:1.4rem}
        .gallery-card{overflow:hidden;border-radius:30px}.gallery-media{height:280px;overflow:hidden;position:relative}.gallery-media:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(17,36,31,.18) 100%)} .gallery-media img{height:100%;object-fit:cover} .gallery-copy{padding:24px} .gallery-card h3{font-size:1.5rem}
        .cta{padding:30px 0 90px}.cta-panel{position:relative;overflow:hidden;padding:40px;border-radius:36px;background:linear-gradient(140deg,var(--green),#25463d 62%,#3a5a50);color:rgba(253,249,242,.94);box-shadow:0 28px 70px rgba(17,36,31,.22)} .cta-panel:before,.cta-panel:after{content:"";position:absolute;border-radius:50%;pointer-events:none}.cta-panel:before{width:220px;height:220px;left:-40px;bottom:-60px;background:rgba(191,109,66,.2)} .cta-panel:after{width:240px;height:240px;right:-40px;top:-60px;background:rgba(255,255,255,.08)} .cta-grid{position:relative;z-index:1;display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end} .cta-panel h2{font-size:clamp(2.1rem,4vw,3.4rem);color:var(--cream)} .cta-panel p{max-width:640px;color:rgba(253,249,242,.78)}
        .bot-greeting{position:fixed;right:120px;bottom:54px;z-index:39;display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:18px 18px 6px 18px;background:rgba(253,249,242,.96);border:1px solid var(--line);box-shadow:0 18px 40px rgba(17,36,31,.14);font-size:.94rem;font-weight:700;color:var(--green);backdrop-filter:blur(14px)}
        .bot-greeting .wave{font-size:1.2rem}
        .reveal{opacity:0;transform:translateY(24px);animation:rise .8s ease forwards}.delay{animation-delay:.14s} @keyframes rise{to{opacity:1;transform:translateY(0)}}
        @media (max-width:1120px){.hero,.identity,.cta-grid,.band,.paths,.gallery{grid-template-columns:1fr}.stage{min-height:600px}.cta-actions{justify-content:flex-start}}
        @media (max-width:860px){.topbar{flex-wrap:wrap;border-radius:28px}.nav{width:100%;justify-content:space-between;gap:12px;font-size:.88rem}.stats{grid-template-columns:1fr}.stage{min-height:540px}.panel.main{inset:0 26px 140px 0;border-top-left-radius:90px}.panel.side{width:55%;height:34%}.float.top,.float.bottom{width:min(270px,100%)}.float.top{top:10px;right:0}.float.bottom{left:0;bottom:56px}}
        @media (max-width:640px){.wrap{width:min(100% - 24px,1200px)}.topbar{width:min(100% - 16px,1200px);top:8px;margin-top:10px;padding:16px}.brand{width:100%}.actions a,.hero-actions a,.cta-actions a{width:100%}.hero{padding-top:42px}.panel.main{inset:0 0 170px 0}.panel.side{right:16px;width:58%;height:28%}.float{padding:18px;border-radius:24px}.float.top{bottom:196px;top:auto}.section,.cta{padding:42px 0}.path,.card,.gallery-copy,.cta-panel,.note{padding:22px}.bot-greeting{right:100px;bottom:44px;padding:10px 12px;font-size:.86rem}}
      `}</style>

      <header className={`topbar ${scrolled ? "scrolled" : ""}`}>
        <div className="brand">
          <div className="brand-badge">H</div>
          <div>
            <div className="brand-title">HealthHub</div>
            <div className="brand-sub">
              Clinical operations with a premium patient feel
            </div>
          </div>
        </div>

        <nav className="nav">
          <a href="#experience">Experience</a>
          <a href="#identity">Identity</a>
          <a href="#gallery">Moments</a>
        </nav>

        <div className="actions">
          <Link className="btn ghost" to="/login">
            Login
          </Link>
          <Link className="btn primary" to="/signup">
            Get Started
          </Link>
        </div>
      </header>

      <main className="wrap">
        <section className="hero">
          <div className="hero-copy reveal">
            <div className="eyebrow">Healthcare operations</div>
            <h1>
              A care platform that feels
              <span>concierge outside, command-center inside.</span>
            </h1>
            <p>
              HealthHub now opens with a more premium, memorable visual system:
              warmer colors, layered imagery, stronger typography, and a layout
              shaped around the real onboarding logic already inside your app.
            </p>

            <div className="hero-actions">
              <Link className="hero-btn primary" to="/signup">
                Create Your Account
              </Link>
              <Link className="hero-btn ghost" to="/login">
                Open Login
              </Link>
            </div>

            <div className="stats">
              {stats.map((item) => (
                <div className="stat" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stage reveal delay">
            <div className="panel main">
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
                alt="Healthcare professional supporting a patient"
              />
            </div>

            <div className="panel side">
              <img
                src="https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=900&q=80"
                alt="Patient reviewing digital healthcare information"
              />
            </div>

            <div className="float top">
              <div className="kicker">Patient route</div>
              <h3>Signup, profile, dashboard.</h3>
              <p>
                The patient journey is presented as one smooth arrival sequence
                instead of a disconnected set of screens.
              </p>
              <div className="flow">
                <div>
                  <strong>Step 01</strong>
                  <span>Create account</span>
                </div>
                <div>
                  <strong>Step 02</strong>
                  <span>Complete profile</span>
                </div>
                <div>
                  <strong>Step 03</strong>
                  <span>Enter dashboard</span>
                </div>
              </div>
            </div>

            <div className="float bottom">
              <div className="kicker">Role control</div>
              <h3>Admin-approved team access.</h3>
              <p>
                Staff, doctors, and admin onboarding is visually separated into
                a more controlled lane to match approval-based access.
              </p>
            </div>
          </div>
        </section>

        <section className="section reveal delay">
          <div className="band">
            <div className="band-item">
              <div className="band-no">01</div>
              <div>
                A warm ivory, evergreen, and copper palette breaks away from the
                usual blue healthcare template.
              </div>
            </div>
            <div className="band-item">
              <div className="band-no">02</div>
              <div>
                The homepage is structured like a brand experience while still
                pointing clearly to login and signup.
              </div>
            </div>
            <div className="band-item">
              <div className="band-no">03</div>
              <div>
                Layered photography gives HealthHub a more custom, less reused
                visual identity.
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <span className="section-kicker">Experience map</span>
          <h2>The homepage now explains your product with more clarity and more character.</h2>
          <p className="intro">
            Instead of a generic hospital page, the design now introduces
            HealthHub as a polished care ecosystem built around patients,
            approvals, and coordinated operations.
          </p>

          <div className="paths">
            {pathways.map((item) => (
              <article className="path" key={item.title}>
                <div className="tag">{item.tag}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="identity">
          <span className="section-kicker">Visual identity</span>
          <h2>A stronger brand language makes HealthHub feel owned, elevated, and memorable.</h2>
          <div className="identity">
            <div className="visual">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80"
                alt="Clinician working in a thoughtfully designed care environment"
              />
              <div className="note">
                <h3>Designed to feel human before it feels technical.</h3>
                <p>
                  The new homepage uses editorial composition, softer medical
                  imagery, and premium typography so the product feels distinct
                  from commonly reused healthcare designs.
                </p>
              </div>
            </div>

            <div className="stack">
              {highlights.map((item) => (
                <article className="card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="gallery">
          <span className="section-kicker">Curated moments</span>
          <h2>Multiple image-led scenes give the homepage its own signature mood and depth.</h2>
          <p className="intro">
            The visual story is now based on layered human-centered healthcare
            imagery, making the landing page feel intentional instead of
            interchangeable.
          </p>

          <div className="gallery">
            {gallery.map((item) => (
              <article className="gallery-card" key={item.title}>
                <div className="gallery-media">
                  <img
                    src={
                      item.title === "Clinical collaboration"
                        ? "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=900"
                        : item.image
                    }
                    alt={item.title}
                  />
                </div>
                <div className="gallery-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cta">
          <div className="cta-panel">
            <div className="cta-grid">
              <div>
                <h2>Bring patients in beautifully and route teams with control.</h2>
                <p>
                  The updated homepage now matches the promise of your platform:
                  patient-friendly entry, admin-governed staff access, and a
                  much stronger visual identity from the very first screen.
                </p>
              </div>

              <div className="cta-actions">
                <Link className="cta-btn primary" to="/signup">
                  Start Signup
                </Link>
                <Link className="cta-btn ghost" to="/login">
                  Open Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="bot-greeting">
        <span>Hi</span>
        <span className="wave" role="img" aria-label="waving hand">
          {"👋"}
        </span>
        <span>Sravya</span>
      </div>
      <SupportBot />
    </div>
  );
}

export default HomePage;

