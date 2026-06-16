import { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════
   HOOKS
══════════════════════════════════════ */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* ══════════════════════════════════════
   REVEAL
══════════════════════════════════════ */
const Reveal = ({ children, delay = 0, style = {}, up = true }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : up ? "translateY(28px)" : "translateY(0)",
      transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

/* ══════════════════════════════════════
   FAKE THUMBNAIL VISUALS
══════════════════════════════════════ */
const FakeThumbnail = ({ bg1, bg2, text, accent = "#fff" }) => (
  <div style={{ width: "100%", aspectRatio: "16/9", background: `linear-gradient(135deg,${bg1},${bg2})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
    <div style={{ fontSize: 13, fontWeight: 900, color: accent, textAlign: "center", padding: "0 10px", textShadow: "0 2px 8px rgba(0,0,0,0.6)", lineHeight: 1.2 }}>{text}</div>
  </div>
);

const DullThumb = ({ text = "YOUR VIDEO TITLE" }) => (
  <div style={{ width: "100%", aspectRatio: "16/9", background: "#1c1c1c", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.25)", textAlign: "center", padding: "0 10px" }}>{text}</span>
  </div>
);

/* ══════════════════════════════════════
   BEFORE/AFTER SLIDER  (true 16:9)
══════════════════════════════════════ */
const Slider = ({ before, after }) => {
  const [pos, setPos] = useState(46);
  const dragging = useRef(false);
  const ref = useRef(null);
  const move = useCallback((cx) => {
    if (!dragging.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(97, Math.max(3, ((cx - r.left) / r.width) * 100)));
  }, []);
  useEffect(() => {
    const up = () => { dragging.current = false; };
    const mm = (e) => move(e.clientX);
    const tm = (e) => move(e.touches[0].clientX);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchend", up);
    window.addEventListener("touchmove", tm, { passive: true });
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", mm); window.removeEventListener("touchend", up); window.removeEventListener("touchmove", tm); };
  }, [move]);
  return (
    <div ref={ref} onMouseDown={() => { dragging.current = true; }} onTouchStart={() => { dragging.current = true; }}
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", cursor: "ew-resize", userSelect: "none" }}>
      <div style={{ position: "absolute", inset: 0 }}>{after}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{before}</div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "#fff", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 34, height: 34, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 14px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#111", fontWeight: 800 }}>⇔</div>
      </div>
      <div style={{ position: "absolute", top: 10, left: 12, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", padding: "3px 9px", borderRadius: 6, fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: 2, zIndex: 9 }}>BEFORE</div>
      <div style={{ position: "absolute", top: 10, right: 12, background: "rgba(37,99,235,0.85)", backdropFilter: "blur(4px)", padding: "3px 9px", borderRadius: 6, fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: 2, zIndex: 9 }}>AFTER</div>
    </div>
  );
};

/* ══════════════════════════════════════
   HERO — CURSOR-REACTIVE THUMBNAIL WALLS + CENTER TEXT
══════════════════════════════════════ */
const Hero = ({ onScrollTo }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setMouse({ x: (e.clientX - cx) / (rect.width / 2), y: (e.clientY - cy) / (rect.height / 2) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const leftThumbs = [
    { bg1: "#0f0c29", bg2: "#302b63", text: "10 MONEY MISTAKES", accent: "#ffd700" },
    { bg1: "#1a0533", bg2: "#6a0572", text: "I TRIED 30 DAYS", accent: "#ff79c6" },
    { bg1: "#001f3f", bg2: "#0052cc", text: "THE TRUTH ABOUT AI", accent: "#79c8ff" },
    { bg1: "#0d2137", bg2: "#1a4a6e", text: "BUDGET SECRETS", accent: "#4ade80" },
    { bg1: "#2d1b69", bg2: "#7c3aed", text: "VIRAL IN 24 HRS", accent: "#fbbf24" },
  ];
  const rightThumbs = [
    { bg1: "#1a0a00", bg2: "#b45309", text: "SOLO TRAVEL JAPAN", accent: "#fef3c7" },
    { bg1: "#0a1f0a", bg2: "#166534", text: "EARN ₹1L ONLINE", accent: "#bbf7d0" },
    { bg1: "#300a0a", bg2: "#991b1b", text: "GAMING SETUP 2025", accent: "#fca5a5" },
    { bg1: "#0c1445", bg2: "#1d4ed8", text: "WATCH BEFORE DELETE", accent: "#bfdbfe" },
    { bg1: "#1a0a2e", bg2: "#7c3aed", text: "ALGORITHM HACK", accent: "#e9d5ff" },
  ];

  const tiltY = mouse.x * 10;
  const tiltX = mouse.y * -6;
  const drift = mouse.y * -10;

  const wallStyle = (dir) => ({
    display: "flex", flexDirection: "column", gap: 10,
    transform: `perspective(900px) rotateY(${dir === "left" ? 20 + tiltY * 0.5 : -20 + tiltY * 0.5}deg) rotateX(${tiltX * 0.3}deg)`,
    transition: "transform 0.12s ease-out",
    width: 190, flexShrink: 0,
    maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
  });

  return (
    <section ref={sectionRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "80px 0 0" }}>
      {/* Ambient */}
      <div style={{ position: "absolute", top: "20%", left: "20%", width: 500, height: 350, background: "radial-gradient(ellipse,rgba(37,99,235,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 400, height: 300, background: "radial-gradient(ellipse,rgba(124,58,237,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", gap: 48, padding: "0 4%" }}>

        {/* LEFT WALL */}
        <div style={wallStyle("left")}>
          {leftThumbs.map((t, i) => (
            <div key={i} style={{ transform: `translateY(${drift * (i % 2 === 0 ? 1 : -1)}px)`, transition: "transform 0.15s ease-out" }}>
              <FakeThumbnail {...t} />
            </div>
          ))}
        </div>

        {/* CENTER TEXT */}
        <div style={{ textAlign: "center", flex: "0 0 auto", maxWidth: 520, transform: `translateY(${mouse.y * -6}px)`, transition: "transform 0.15s ease-out" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.28)", padding: "7px 18px", borderRadius: 50, marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", animation: "blink 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>YouTube Thumbnail Designer</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 4.5vw, 66px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 40 }}>
            Thumbnail Strategy<br />
            <span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              that works.
            </span>
          </h1>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-blue" onClick={() => onScrollTo("work")}>View My Work</button>
            <button className="btn-ghost" onClick={() => onScrollTo("contact")}>Let's Talk →</button>
          </div>
        </div>

        {/* RIGHT WALL */}
        <div style={wallStyle("right")}>
          {rightThumbs.map((t, i) => (
            <div key={i} style={{ transform: `translateY(${drift * (i % 2 === 0 ? -1 : 1)}px)`, transition: "transform 0.15s ease-out" }}>
              <FakeThumbnail {...t} />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "floatA 2.5s ease-in-out infinite" }}>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }} />
      </div>
    </section>
  );
};

/* ══════════════════════════════════════
   INTRO SECTION  (like reference — stats + personal)
══════════════════════════════════════ */
const IntroSection = () => {
  const [ref, inView] = useInView(0.1);
  return (
    <section style={{ padding: "120px 7%", background: "#0c0e13", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        {/* Stats bar */}
        <Reveal>
          <div style={{ display: "flex", gap: 0, background: "#2563eb", borderRadius: 24, overflow: "hidden", marginBottom: 80 }}>
            {[["200+", "Thumbnails Delivered"], ["50M+", "Thumbnail Clicks"], ["30+", "Creator Clients"]].map(([num, label], i) => (
              <div key={label} style={{ flex: 1, textAlign: "center", padding: "32px 20px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                <div style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, color: "#fff" }}>{num}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Two-column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <Reveal delay={0.1}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>Meet the Designer</div>
            <h2 style={{ fontSize: "clamp(32px,4vw,54px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 24 }}>
              Yo, I'm Sandeep 👋
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, marginBottom: 20 }}>
              I help YouTube creators strategize and package their videos for clicks.
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.85, marginBottom: 32 }}>
              At <strong style={{ color: "#93c5fd" }}>VisualDives</strong>, I focus on creating thumbnails that do more than look good. Every design is built around understanding the video, the audience, and what makes people stop scrolling and pay attention.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-blue" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>My Work</button>
              <button className="btn-ghost" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Let's Talk →</button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ position: "relative" }}>
              <div style={{ aspectRatio: "4/5", borderRadius: 28, background: "linear-gradient(160deg,#0f1729,#1e3a5f)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ textAlign: "center", padding: 32 }}>
                  <div style={{ fontSize: 72, marginBottom: 20 }}>🎨</div>
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 10, letterSpacing: 2 }}>CURRENT PROJECT</div>
                    <FakeThumbnail bg1="#ff6b35" bg2="#ffd700" text="GROW NOW! →" accent="#fff" />
                    <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>@visualdives</div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: -16, right: -16, background: "#2563eb", borderRadius: 16, padding: "16px 22px", boxShadow: "0 16px 40px rgba(37,99,235,0.4)" }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>4 Yrs</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Experience</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════
   FEATURED WORK — STACKING SCROLL
══════════════════════════════════════ */
const workCards = [
  { title: "From Invisible to Viral", niche: "Gaming", stat: "+312% CTR", hook: "Curiosity Gap + Emotion", before: <DullThumb text="10 MONEY TIPS" />, after: <FakeThumbnail bg1="#0f0c29" bg2="#302b63" text="10 MONEY TIPS" accent="#ffd700" /> },
  { title: "The Comeback Story", niche: "Personal Finance", stat: "2.4M Views", hook: "Transformation Narrative", before: <DullThumb text="MY STORY" />, after: <FakeThumbnail bg1="#7f1d1d" bg2="#dc2626" text="MY COMEBACK STORY" accent="#fef2f2" /> },
  { title: "The Authority Play", niche: "Education", stat: "50K → 500K", hook: "Authority + Social Proof", before: <DullThumb text="LEARN THIS" />, after: <FakeThumbnail bg1="#1e3a5f" bg2="#2563eb" text="LEARN THIS NOW" accent="#dbeafe" /> },
  { title: "The Reaction Magnet", niche: "Entertainment", stat: "4.1M Impressions", hook: "Familiarity + Humor", before: <DullThumb text="YOU WON'T BELIEVE" />, after: <FakeThumbnail bg1="#4a044e" bg2="#9333ea" text="YOU WON'T BELIEVE 😱" accent="#f5d0fe" /> },
  { title: "The Contrast Hook", niche: "Fitness", stat: "+280% CTR", hook: "Before/After Narrative", before: <DullThumb text="MY FITNESS JOURNEY" />, after: <FakeThumbnail bg1="#14532d" bg2="#16a34a" text="30 DAY BODY CHANGE" accent="#dcfce7" /> },
  { title: "Open Loop Mastery", niche: "Tech", stat: "1.8M Views", hook: "Open Loop + Mystery", before: <DullThumb text="THE TRUTH ABOUT AI" />, after: <FakeThumbnail bg1="#1c1917" bg2="#57534e" text="THEY LIED ABOUT AI" accent="#fef3c7" /> },
];

const FeaturedWork = () => (
  <section id="work" style={{ padding: "120px 7% 0" }}>
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Case Studies</div>
          <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 14 }}>Featured Work</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 15 }}>Drag the slider on each card to see the transformation</p>
        </div>
      </Reveal>

      {/* STACKING CARDS */}
      <div style={{ position: "relative" }}>
        {workCards.map((w, i) => (
          <div key={w.title} style={{
            position: "sticky",
            top: 80 + i * 20,
            zIndex: i + 1,
            marginBottom: i < workCards.length - 1 ? 20 : 120,
          }}>
            <div style={{
              background: "#111318",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}>
              {/* Slider */}
              <Slider before={w.before} after={w.after} />
              {/* Info row */}
              <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{w.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Hook: <span style={{ color: "#6366f1" }}>{w.hook}</span></div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "4px 12px", borderRadius: 20 }}>{w.niche}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: 20 }}>{w.stat}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════
   HOW I WORK — 5 STEPS  (comes BEFORE services)
══════════════════════════════════════ */
const HowIWork = () => (
  <section id="process" style={{ padding: "120px 7%", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>The Method</div>
          <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1px" }}>How I Work</h2>
        </div>
      </Reveal>

      {/* Steps — horizontal on desktop */}
      <div style={{ display: "flex", gap: 0, position: "relative" }}>
        {/* Connector line */}
        <div style={{ position: "absolute", top: 26, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.3),rgba(59,130,246,0.3),transparent)", zIndex: 0 }} />

        {[
          ["Brief", "Share your script, concept, or idea. I dive deep to capture the message and vibe."],
          ["Research", "I brainstorm 4–7 click-worthy ideas using your niche, topic, and audience psychology."],
          ["Design", "High-quality scroll-stopping thumbnails crafted and shared in stages so you're never left guessing."],
          ["Refine", "Polish using your feedback, aiming for designs you'd double-click yourself."],
          ["Optimize", "Post-launch monitoring, A/B tests, and iterative tweaks for the best possible results."],
        ].map(([title, desc], i) => (
          <Reveal key={title} delay={i * 0.1} style={{ flex: 1, textAlign: "center", padding: "0 14px", position: "relative", zIndex: 1 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#1e3a5f,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontWeight: 900, fontSize: 14, boxShadow: "0 6px 20px rgba(37,99,235,0.35)", border: "2px solid rgba(37,99,235,0.4)" }}>{i + 1}</div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>{title}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>{desc}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════
   MY SERVICES — STACKING SCROLL  (comes AFTER How I Work)
══════════════════════════════════════ */
const MyServices = () => {
  const services = [
    { num: "01", title: "Ideation & Strategy", desc: "I study your video concept, research your target audience, and build a click strategy before touching a pixel. Thumbnail ideas are shared as rough sketches for easy visualization and discussion.", icon: "💡", accent: "#3b82f6", bg: "#090f1e" },
    { num: "02", title: "Design & Execution", desc: "High-quality, scroll-stopping thumbnails crafted with typography that pops, colors that contrast, and composition that guides the eye exactly where it needs to go.", icon: "🎨", accent: "#8b5cf6", bg: "#0e0919" },
    { num: "03", title: "Performance & Optimization", desc: "Post-launch CTR monitoring, A/B testing support, and iterative refinement. I track how viewers respond and tweak until your numbers climb consistently.", icon: "📈", accent: "#22c55e", bg: "#091409" },
  ];

  return (
    <section id="services" style={{ padding: "120px 7%" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>What I Offer</div>
            <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 16 }}>My Services</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
              <span style={{ letterSpacing: 2 }}>Scroll</span>
              <span style={{ display: "inline-block", animation: "bounceDown 1.4s ease-in-out infinite", fontSize: 16 }}>↓</span>
            </div>
          </div>
        </Reveal>

        {/* STACKING */}
        <div style={{ position: "relative" }}>
          {services.map((s, i) => (
            <div key={s.num} style={{ position: "sticky", top: 80 + i * 28, zIndex: i + 1, marginBottom: i < services.length - 1 ? 24 : 100 }}>
              <div style={{
                background: s.bg,
                border: `1px solid ${s.accent}1a`,
                borderRadius: 28,
                padding: "48px 56px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 40,
                alignItems: "center",
                boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px ${s.accent}0d`,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: s.accent, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{s.num}</div>
                  <h3 style={{ fontSize: "clamp(22px,2.8vw,34px)", fontWeight: 900, color: "#fff", marginBottom: 18, letterSpacing: "-0.5px" }}>{s.title}</h3>
                  <p style={{ fontSize: 16, color: "rgba(255,255,255,0.48)", lineHeight: 1.85, maxWidth: 520 }}>{s.desc}</p>
                </div>
                <div style={{ fontSize: 80, lineHeight: 1, opacity: 0.75 }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════
   ABOUT — VisualDives content
══════════════════════════════════════ */
const About = () => (
  <section id="about" style={{ padding: "120px 7%", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
    <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
      <Reveal>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>About</div>
        <h2 style={{ fontSize: "clamp(36px,4vw,60px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 32, lineHeight: 1.05 }}>
          Visual<span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Dives</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            "Yo, I'm Sandeep. I help YouTube creators strategize and package their videos for clicks.",
            "At VisualDives, I focus on creating thumbnails that do more than look good. Every design is built around understanding the video, the audience, and what makes people stop scrolling and pay attention.",
            "I believe great thumbnails come from a combination of strategy, psychology, and strong visual communication. That's why I spend time understanding the story, message, and viewer before jumping into design.",
            "My goal is simple: create thumbnails that stand out, communicate the idea instantly, and give creators the best possible chance of earning the click.",
          ].map((para, i) => (
            <p key={i} style={{ fontSize: i === 0 ? 20 : 15, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)", lineHeight: 1.85 }}>{para}</p>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div style={{ position: "relative", marginTop: 56 }}>
          <div style={{ aspectRatio: "4/5", borderRadius: 28, background: "linear-gradient(160deg,#0f1729,#1e3a5f)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ textAlign: "center", padding: 36 }}>
              <div style={{ fontSize: 72, marginBottom: 20 }}>🎨</div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 12, letterSpacing: 2 }}>CURRENT PROJECT</div>
                <FakeThumbnail bg1="#ff6b35" bg2="#ffd700" text="GROW YOUR CHANNEL →" accent="#fff" />
                <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>@visualdives</div>
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: -16, right: -16, background: "#2563eb", borderRadius: 16, padding: "16px 22px", boxShadow: "0 14px 36px rgba(37,99,235,0.4)" }}>
            <div style={{ fontSize: 22, fontWeight: 900 }}>200+</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Happy Clients</div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ══════════════════════════════════════
   TESTIMONIALS — VERTICAL STACKING SCROLL
══════════════════════════════════════ */
const testimonials = [
  { name: "Marcus Webb", handle: "@marcuswebb", subs: "1.2M subs", text: "My CTR went from 2.1% to 7.8% in 3 weeks. The thumbnails don't just look good — they're engineered to get clicked. Best investment I made for my channel.", color: "#1d4ed8" },
  { name: "Priya Sharma", handle: "@priyacreates", subs: "680K subs", text: "I was skeptical about investing in thumbnail design, but the data doesn't lie. Each redesign came with a clear strategy and the results were immediate.", color: "#7c3aed" },
  { name: "Rahul Mehta", handle: "@rahultech", subs: "2.3M subs", text: "Working with VisualDives changed how I think about thumbnails entirely. They understand what makes people click — not just what looks pretty.", color: "#059669" },
  { name: "Ananya Kapoor", handle: "@ananyavlogs", subs: "890K subs", text: "Three of my videos went viral in one month after the thumbnail redesign. The before/after is night and day. Absolutely insane results.", color: "#dc2626" },
];

const Testimonials = () => (
  <section style={{ padding: "120px 7%" }}>
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Social Proof</div>
          <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1px" }}>
            What Creators{" "}
            <span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Say</span>
          </h2>
        </div>
      </Reveal>

      {/* VERTICAL STACKING */}
      <div style={{ position: "relative" }}>
        {/* Left accent line */}
        <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom,transparent,rgba(59,130,246,0.3),transparent)" }} />

        {testimonials.map((t, i) => (
          <div key={t.name} style={{ position: "sticky", top: 80 + i * 24, zIndex: i + 1, marginBottom: i < testimonials.length - 1 ? 20 : 100 }}>
            <div style={{ background: "#0e1015", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 22, padding: "36px 44px", paddingLeft: 64, boxShadow: "0 20px 50px rgba(0,0,0,0.55)", position: "relative" }}>
              {/* Left dot */}
              <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 9, height: 9, borderRadius: "50%", background: t.color, boxShadow: `0 0 16px ${t.color}88` }} />

              <div style={{ display: "flex", gap: 2, marginBottom: 18 }}>
                {Array(5).fill(0).map((_, j) => <span key={j} style={{ color: "#fbbf24", fontSize: 13 }}>★</span>)}
              </div>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: 28, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{t.handle} · {t.subs}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════
   FAQ
══════════════════════════════════════ */
const faqs = [
  ["Do you guarantee a high CTR?", "I can't guarantee YouTube's algorithm, but I guarantee designs built on proven click psychology. Most clients see meaningful CTR improvements within the first week."],
  ["What's your typical turnaround time?", "Standard delivery is 48 hours. For bulk orders or rush projects, reach out and we'll work something out."],
  ["How many revisions do I get?", "Every project includes 2 rounds of revisions. The brief process ensures we're aligned from the start."],
  ["Do you help with strategy too?", "Yes! Ideation, title suggestions, and hook feedback are baked into every project alongside the visual design."],
  ["Can I get the source PSD file?", "Source files are available as an add-on. Most clients only need the final exported PNG/JPG."],
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "80px 7% 120px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Reveal><h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 52, textAlign: "center" }}>Most common questions.</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <div key={q} onClick={() => setOpen(open === i ? null : i)}
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "20px 0", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: open === i ? "#3b82f6" : "#fff", transition: "color 0.2s" }}>{q}</div>
              <div style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
            </div>
            {open === i && <p style={{ marginTop: 14, color: "rgba(255,255,255,0.44)", fontSize: 15, lineHeight: 1.8 }}>{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ══════════════════════════════════════
   CTA
══════════════════════════════════════ */
const CTA = () => (
  <section id="contact" style={{ padding: "140px 7%", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(37,99,235,0.11) 0%, transparent 70%)", pointerEvents: "none" }} />
    <Reveal style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.28)", padding: "7px 18px", borderRadius: 50, marginBottom: 28 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", animation: "blink 2s infinite" }} />
        <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>Now Taking Projects</span>
      </div>
      <h2 style={{ fontSize: "clamp(44px,7vw,90px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-3px", marginBottom: 24 }}>
        Want Better<br />
        <span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Thumbnails?</span>
      </h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 17, marginBottom: 44 }}>Every click counts. Let's make yours.</p>
      <a href="mailto:workwithme@clickcraft.studio" style={{ textDecoration: "none" }}>
        <button className="btn-blue" style={{ padding: "18px 52px", fontSize: 17, borderRadius: 60 }}>Work With Me →</button>
      </a>
      <div style={{ marginTop: 22, fontSize: 13, color: "rgba(255,255,255,0.2)" }}>
        No commitments · Email at <span style={{ color: "#3b82f6" }}>workwithme@clickcraft.studio</span>
      </div>
    </Reveal>
  </section>
);

/* ══════════════════════════════════════
   ROOT APP
══════════════════════════════════════ */
export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const s = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#090b0f", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:3px;background:#0a0a0a}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes floatA{0%,100%{transform:translateY(0) translateX(-50%)}50%{transform:translateY(-10px) translateX(-50%)}}
        @keyframes bounceDown{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
        .btn-blue{background:#2563eb;color:#fff;border:none;padding:13px 30px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.25s;letter-spacing:0.3px}
        .btn-blue:hover{background:#1d4ed8;transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,99,235,0.4)}
        .btn-ghost{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,0.18);padding:13px 30px;border-radius:50px;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.25s}
        .btn-ghost:hover{border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.05)}
        .nav-btn{background:none;border:none;color:rgba(255,255,255,0.5);font-size:14px;font-weight:500;cursor:pointer;padding:4px 0;transition:color 0.2s}
        .nav-btn:hover{color:#fff}
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 6%", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(9,11,15,0.92)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>CC</div>
          <span style={{ fontWeight: 900, fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase" }}>ClickCraft</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[["Work", "work"], ["Process", "process"], ["About", "about"], ["Contact", "contact"]].map(([l, id]) => (
            <button key={id} className="nav-btn" onClick={() => scrollTo(id)}>{l}</button>
          ))}
        </div>
        <button className="btn-blue" style={{ padding: "10px 22px", fontSize: 13 }} onClick={() => scrollTo("contact")}>Work With Me</button>
      </nav>

      {/* PAGE SECTIONS */}
      <Hero onScrollTo={scrollTo} />
      <IntroSection />
      <FeaturedWork />
      <HowIWork />
      <MyServices />
      <About />
      <Testimonials />
      <FAQ />
      <CTA />

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 6%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900 }}>CC</div>
          <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>ClickCraft</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>© 2025 ClickCraft Studio · All rights reserved.</div>
        <a href="mailto:workwithme@clickcraft.studio" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none" }}>workwithme@clickcraft.studio</a>
      </footer>
    </div>
  );
}
