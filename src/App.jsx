import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────
   SCROLL STACK — JS-driven, 100% reliable
   Works by: tall outer div creates scroll space,
   one sticky inner reads scrollY to show cards
───────────────────────────────────────*/
const ScrollStack = ({ items, renderItem, cardHeight = 500 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const outerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!outerRef.current) return;
      const rect = outerRef.current.getBoundingClientRect();
      const totalScroll = outerRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(1, scrolled / totalScroll));
      const idx = Math.min(items.length - 1, Math.floor(pct * items.length));
      setActiveIndex(idx);
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items.length]);

  // Height = enough scroll for each card
  const outerHeight = items.length * (window.innerHeight * 0.85);

  return (
    <div ref={outerRef} style={{ height: outerHeight, position: "relative" }}>
      <div style={{ position: "sticky", top: 70, padding: "0 8%" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", height: cardHeight + 80 }}>
          {items.map((item, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            const scale = isPast ? 0.94 - (activeIndex - i) * 0.02 : 1;
            const translateY = isPast ? -(activeIndex - i) * 10 : 0;
            const opacity = isPast ? Math.max(0.3, 1 - (activeIndex - i) * 0.25) : isActive ? 1 : 0;
            const zIndex = items.length - Math.abs(activeIndex - i);

            return (
              <div key={i} style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                zIndex,
                transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease",
                transformOrigin: "top center",
                pointerEvents: isActive ? "auto" : "none",
              }}>
                {renderItem(item, i, isActive)}
              </div>
            );
          })}

          {/* Dot indicators */}
          <div style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === activeIndex ? "#3b82f6" : "rgba(255,255,255,0.2)", transition: "all 0.3s" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────
   REVEAL ON SCROLL
───────────────────────────────────────*/
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
};

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
};

/* ─────────────────────────────────────
   THUMBNAIL VISUALS
───────────────────────────────────────*/
const Thumb = ({ bg1, bg2, text, accent = "#fff", w = 190 }) => (
  <div style={{ width: w, height: w * 9 / 16, background: `linear-gradient(135deg,${bg1},${bg2})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 8px 28px rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
    <span style={{ fontSize: w * 0.065, fontWeight: 900, color: accent, textAlign: "center", padding: "0 8px", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{text}</span>
  </div>
);

const DullThumb = ({ text = "YOUR VIDEO" }) => (
  <div style={{ width: "100%", aspectRatio: "16/9", background: "#141414", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.18)", padding: "0 16px", textAlign: "center" }}>{text}</span>
  </div>
);

const VividThumb = ({ bg1, bg2, text, accent = "#fff" }) => (
  <div style={{ width: "100%", aspectRatio: "16/9", background: `linear-gradient(135deg,${bg1},${bg2})`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    <span style={{ fontSize: 15, fontWeight: 900, color: accent, textAlign: "center", padding: "0 16px", textShadow: "0 2px 10px rgba(0,0,0,0.5)", lineHeight: 1.2 }}>{text}</span>
  </div>
);

/* ─────────────────────────────────────
   BEFORE/AFTER SLIDER
───────────────────────────────────────*/
const Slider = ({ before, after }) => {
  const [pos, setPos] = useState(45);
  const dragging = useRef(false);
  const ref = useRef(null);
  const move = useCallback((cx) => {
    if (!dragging.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(96, Math.max(4, ((cx - r.left) / r.width) * 100)));
  }, []);
  useEffect(() => {
    const up = () => { dragging.current = false; };
    const mm = (e) => move(e.clientX);
    const tm = (e) => move(e.touches[0].clientX);
    window.addEventListener("mouseup", up); window.addEventListener("mousemove", mm);
    window.addEventListener("touchend", up); window.addEventListener("touchmove", tm, { passive: true });
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", mm); window.removeEventListener("touchend", up); window.removeEventListener("touchmove", tm); };
  }, [move]);
  return (
    <div ref={ref} onMouseDown={() => { dragging.current = true; }} onTouchStart={() => { dragging.current = true; }}
      style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", cursor: "ew-resize", userSelect: "none" }}>
      <div style={{ position: "absolute", inset: 0 }}>{after}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{before}</div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "#fff", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#111", fontWeight: 900, boxShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>⇔</div>
      </div>
      <span style={{ position: "absolute", top: 10, left: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", padding: "3px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700, color: "#666", letterSpacing: 2, zIndex: 9 }}>BEFORE</span>
      <span style={{ position: "absolute", top: 10, right: 12, background: "rgba(37,99,235,0.9)", backdropFilter: "blur(6px)", padding: "3px 10px", borderRadius: 6, fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: 2, zIndex: 9 }}>AFTER</span>
    </div>
  );
};

/* ─────────────────────────────────────
   HERO
───────────────────────────────────────*/
const Hero = ({ onScrollTo }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setMouse({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const L = [
    { bg1: "#0d0b2b", bg2: "#3d2fa0", text: "10 MONEY MISTAKES", accent: "#ffd700" },
    { bg1: "#1a0533", bg2: "#7c3aed", text: "I TRIED 30 DAYS", accent: "#f0abfc" },
    { bg1: "#001833", bg2: "#0052cc", text: "TRUTH ABOUT AI", accent: "#93c5fd" },
    { bg1: "#0a1f0a", bg2: "#166534", text: "BUDGET SECRETS", accent: "#86efac" },
    { bg1: "#2a0a0a", bg2: "#991b1b", text: "VIRAL IN 24HRS", accent: "#fca5a5" },
  ];
  const R = [
    { bg1: "#1c0a00", bg2: "#c2410c", text: "SOLO TRAVEL JAPAN", accent: "#fef3c7" },
    { bg1: "#0a0a1f", bg2: "#1d4ed8", text: "WATCH BEFORE DELETE", accent: "#bfdbfe" },
    { bg1: "#1a0a2e", bg2: "#6d28d9", text: "ALGORITHM HACK", accent: "#e9d5ff" },
    { bg1: "#0a1f10", bg2: "#065f46", text: "EARN ₹1L ONLINE", accent: "#6ee7b7" },
    { bg1: "#1f1a0a", bg2: "#b45309", text: "GAMING SETUP 2025", accent: "#fde68a" },
  ];

  const wallStyle = (dir) => ({
    display: "flex", flexDirection: "column", gap: 12, flexShrink: 0,
    transform: `perspective(900px) rotateY(${(dir === "L" ? 20 : -20) + mouse.x * 7}deg) rotateX(${mouse.y * -4}deg)`,
    transition: "transform 0.12s ease-out",
    maskImage: "linear-gradient(to bottom,transparent 0%,black 20%,black 80%,transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom,transparent 0%,black 20%,black 80%,transparent 100%)",
  });

  return (
    <section ref={ref} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 64, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 45% at 50% 50%,rgba(37,99,235,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* LEFT */}
      <div style={{ ...wallStyle("L"), padding: "0 0 0 3%" }}>
        {L.map((t, i) => <div key={i} style={{ transform: `translateY(${mouse.y * (i % 2 === 0 ? -8 : 8)}px)`, transition: "transform 0.18s ease-out" }}><Thumb {...t} /></div>)}
      </div>

      {/* CENTER */}
      <div style={{ textAlign: "center", flex: 1, padding: "0 3%", transform: `translateY(${mouse.y * -4}px)`, transition: "transform 0.18s ease-out", zIndex: 2 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.3)", padding: "7px 18px", borderRadius: 50, marginBottom: 28 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", animation: "blink 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>YouTube Thumbnail Designer</span>
        </div>
        <h1 style={{ fontSize: "clamp(30px,4vw,62px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 36 }}>
          Thumbnail Strategy<br />
          <span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>that works.</span>
        </h1>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => onScrollTo("work")} style={BtnBlue}>View My Work</button>
          <button onClick={() => onScrollTo("contact")} style={BtnGhost}>Let's Talk →</button>
        </div>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom,rgba(255,255,255,0.15),transparent)", animation: "bounce 2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ ...wallStyle("R"), padding: "0 3% 0 0" }}>
        {R.map((t, i) => <div key={i} style={{ transform: `translateY(${mouse.y * (i % 2 === 0 ? 8 : -8)}px)`, transition: "transform 0.18s ease-out" }}><Thumb {...t} /></div>)}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────
   INTRO
───────────────────────────────────────*/
const Intro = () => (
  <section style={{ padding: "100px 8%", background: "#0a0c12", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      <Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#2563eb", borderRadius: 20, overflow: "hidden", marginBottom: 80 }}>
          {[["200+", "Thumbnails Delivered"], ["50M+", "Thumbnail Clicks"], ["30+", "Creator Clients"]].map(([n, l], i) => (
            <div key={l} style={{ textAlign: "center", padding: "34px 20px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
              <div style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <Reveal delay={0.1}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 20 }}>Meet the Designer</div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,50px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 22 }}>Yo, I'm Sandeep 👋</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.9, marginBottom: 16 }}>I help YouTube creators strategize and package their videos for clicks.</p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", lineHeight: 1.9, marginBottom: 32 }}>At <strong style={{ color: "#93c5fd" }}>VisualDives</strong>, I focus on creating thumbnails that do more than look good. Every design is built around understanding the video, the audience, and what makes people stop scrolling.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })} style={BtnBlue}>My Work</button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={BtnGhost}>Let's Talk →</button>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "4/5", borderRadius: 28, background: "linear-gradient(160deg,#0f1729,#1a3050)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={{ textAlign: "center", padding: 32, width: "100%" }}>
                <div style={{ fontSize: 60, marginBottom: 20 }}>🎨</div>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 18px" }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 10, letterSpacing: 2 }}>CURRENT PROJECT</div>
                  <VividThumb bg1="#ff6b35" bg2="#ffd700" text="GROW YOUR CHANNEL →" accent="#fff" />
                  <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: 1 }}>@visualdives</div>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: -14, right: -14, background: "#2563eb", borderRadius: 14, padding: "14px 18px", boxShadow: "0 12px 32px rgba(37,99,235,0.45)" }}>
              <div style={{ fontSize: 20, fontWeight: 900 }}>4 Yrs</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>Experience</div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────
   FEATURED WORK — JS SCROLL STACK
───────────────────────────────────────*/
const workItems = [
  { title: "From Invisible to Viral", niche: "Gaming", stat: "+312% CTR", hook: "Curiosity Gap + Emotion", b1: "#0f0c29", b2: "#302b63", vtext: "10 MONEY TIPS", accent: "#ffd700", dull: "10 MONEY TIPS" },
  { title: "The Comeback Story", niche: "Personal Finance", stat: "2.4M Views", hook: "Transformation Narrative", b1: "#7f1d1d", b2: "#dc2626", vtext: "MY COMEBACK STORY", accent: "#fef2f2", dull: "MY STORY" },
  { title: "The Authority Play", niche: "Education", stat: "50K→500K", hook: "Authority + Social Proof", b1: "#1e3a5f", b2: "#2563eb", vtext: "LEARN THIS NOW", accent: "#dbeafe", dull: "LEARN THIS" },
  { title: "The Reaction Magnet", niche: "Entertainment", stat: "4.1M Impressions", hook: "Familiarity + Humor", b1: "#4a044e", b2: "#9333ea", vtext: "YOU WON'T BELIEVE 😱", accent: "#f5d0fe", dull: "YOU WON'T BELIEVE" },
  { title: "The Contrast Hook", niche: "Fitness", stat: "+280% CTR", hook: "Before/After Narrative", b1: "#14532d", b2: "#16a34a", vtext: "30 DAY BODY CHANGE", accent: "#dcfce7", dull: "MY FITNESS JOURNEY" },
  { title: "Open Loop Mastery", niche: "Tech", stat: "1.8M Views", hook: "Open Loop + Mystery", b1: "#292524", b2: "#57534e", vtext: "THEY LIED ABOUT AI", accent: "#fef3c7", dull: "THE TRUTH ABOUT AI" },
];

const FeaturedWork = () => (
  <section id="work" style={{ padding: "100px 0 0" }}>
    <Reveal style={{ padding: "0 8%", maxWidth: 860, margin: "0 auto 60px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Case Studies</div>
        <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 12 }}>Featured Work</h2>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Drag the slider · scroll to see more</p>
      </div>
    </Reveal>

    <ScrollStack
      items={workItems}
      cardHeight={480}
      renderItem={(w, i, isActive) => (
        <div style={{ background: "#0f1116", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.7)" }}>
          <Slider
            before={<DullThumb text={w.dull} />}
            after={<VividThumb bg1={w.b1} bg2={w.b2} text={w.vtext} accent={w.accent} />}
          />
          <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 5 }}>{w.title}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Hook: <span style={{ color: "#818cf8" }}>{w.hook}</span></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.12)", padding: "4px 12px", borderRadius: 20 }}>{w.niche}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: 20 }}>{w.stat}</span>
            </div>
          </div>
        </div>
      )}
    />
  </section>
);

/* ─────────────────────────────────────
   HOW I WORK
───────────────────────────────────────*/
const HowIWork = () => (
  <section id="process" style={{ padding: "100px 8%", background: "#0a0c12", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>The Method</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-1px" }}>How I Work</h2>
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20, position: "relative" }}>
        <div style={{ position: "absolute", top: 26, left: "5%", right: "5%", height: 1, background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.25),transparent)", zIndex: 0 }} />
        {[
          ["Brief", "Share your concept. I dive deep to capture the message and vibe."],
          ["Research", "I brainstorm 4–7 click-worthy ideas using your niche and audience psychology."],
          ["Design", "Scroll-stopping thumbnails crafted and shared in stages."],
          ["Refine", "Polish using your feedback until you'd double-click it yourself."],
          ["Optimize", "Post-launch monitoring and A/B tests for best possible CTR."],
        ].map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.1} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#1e3a5f,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontWeight: 900, fontSize: 15, boxShadow: "0 6px 20px rgba(37,99,235,0.3)", border: "2px solid rgba(37,99,235,0.35)" }}>{i + 1}</div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>{t}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{d}</div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────
   MY SERVICES — JS SCROLL STACK
───────────────────────────────────────*/
const serviceItems = [
  { num: "01", title: "Ideation & Strategy", desc: "I study your video concept, research your target audience, and build a click strategy before touching a pixel. Thumbnail ideas shared as rough sketches for easy visualization and discussion.", icon: "💡", accent: "#3b82f6", bg: "linear-gradient(135deg,#080f20,#0d1a32)" },
  { num: "02", title: "Design & Execution", desc: "High-quality, scroll-stopping thumbnails crafted with typography that pops, colors that contrast, and composition that guides the eye exactly where it needs to go.", icon: "🎨", accent: "#8b5cf6", bg: "linear-gradient(135deg,#0e0814,#18093c)" },
  { num: "03", title: "Performance & Optimization", desc: "Post-launch CTR monitoring, A/B testing support, and iterative refinement. I track how viewers respond and tweak until your numbers climb consistently.", icon: "📈", accent: "#22c55e", bg: "linear-gradient(135deg,#060f09,#0c2011)" },
];

const MyServices = () => (
  <section id="services" style={{ padding: "100px 0 0" }}>
    <Reveal style={{ padding: "0 8%", maxWidth: 860, margin: "0 auto 60px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>What I Offer</div>
        <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 14 }}>My Services</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          <span style={{ letterSpacing: 2 }}>Scroll</span>
          <span style={{ display: "inline-block", animation: "bounce 1.5s ease-in-out infinite" }}>↓</span>
        </div>
      </div>
    </Reveal>

    <ScrollStack
      items={serviceItems}
      cardHeight={280}
      renderItem={(s, i, isActive) => (
        <div style={{ background: s.bg, border: `1px solid ${s.accent}20`, borderRadius: 24, padding: "44px 52px", display: "grid", gridTemplateColumns: "1fr 80px", gap: 32, alignItems: "center", boxShadow: "0 28px 70px rgba(0,0,0,0.6)" }}>
          <div>
            <div style={{ fontSize: 11, color: s.accent, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>{s.num}</div>
            <h3 style={{ fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 900, color: "#fff", marginBottom: 16, letterSpacing: "-0.5px" }}>{s.title}</h3>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.85 }}>{s.desc}</p>
          </div>
          <div style={{ fontSize: 64, textAlign: "center", opacity: 0.8 }}>{s.icon}</div>
        </div>
      )}
    />
  </section>
);

/* ─────────────────────────────────────
   ABOUT
───────────────────────────────────────*/
const About = () => (
  <section id="about" style={{ padding: "100px 8%", background: "#0a0c12", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
    <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
      <Reveal>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>About</div>
        <h2 style={{ fontSize: "clamp(36px,5vw,68px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: 36 }}>
          Visual<span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Dives</span>
        </h2>
        {[
          { t: "Yo, I'm Sandeep. I help YouTube creators strategize and package their videos for clicks.", big: true },
          { t: "At VisualDives, I focus on creating thumbnails that do more than look good. Every design is built around understanding the video, the audience, and what makes people stop scrolling and pay attention.", big: false },
          { t: "I believe great thumbnails come from a combination of strategy, psychology, and strong visual communication. That's why I spend time understanding the story, message, and viewer before jumping into design.", big: false },
          { t: "My goal is simple: create thumbnails that stand out, communicate the idea instantly, and give creators the best possible chance of earning the click.", big: false },
        ].map(({ t, big }, i) => (
          <p key={i} style={{ fontSize: big ? 17 : 14, fontWeight: big ? 700 : 400, color: big ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.4)", lineHeight: 1.85, marginBottom: 16 }}>{t}</p>
        ))}
      </Reveal>
      <Reveal delay={0.15}>
        <div style={{ position: "relative", marginTop: 52 }}>
          <div style={{ aspectRatio: "4/5", borderRadius: 28, background: "linear-gradient(160deg,#0f1729,#1a3050)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ textAlign: "center", padding: 32, width: "100%" }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>🎨</div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 18px" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 10, letterSpacing: 2 }}>CURRENT PROJECT</div>
                <VividThumb bg1="#ff6b35" bg2="#ffd700" text="GROW YOUR CHANNEL NOW" accent="#fff" />
                <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: 1 }}>@visualdives</div>
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: -14, right: -14, background: "#2563eb", borderRadius: 14, padding: "14px 18px", boxShadow: "0 12px 32px rgba(37,99,235,0.45)" }}>
            <div style={{ fontSize: 20, fontWeight: 900 }}>200+</div>
            <div style={{ fontSize: 11, opacity: 0.75 }}>Happy Clients</div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ─────────────────────────────────────
   TESTIMONIALS — JS SCROLL STACK
───────────────────────────────────────*/
const testimonialItems = [
  { name: "Marcus Webb", handle: "@marcuswebb", subs: "1.2M subs", text: "My CTR went from 2.1% to 7.8% in 3 weeks. The thumbnails don't just look good — they're engineered to get clicked. Best investment I made for my channel.", color: "#2563eb" },
  { name: "Priya Sharma", handle: "@priyacreates", subs: "680K subs", text: "I was skeptical about investing in thumbnail design, but the data doesn't lie. Each redesign came with a clear strategy and the results were immediate.", color: "#7c3aed" },
  { name: "Rahul Mehta", handle: "@rahultech", subs: "2.3M subs", text: "Working with VisualDives changed how I think about thumbnails entirely. They understand what makes people click — not just what looks pretty.", color: "#059669" },
  { name: "Ananya Kapoor", handle: "@ananyavlogs", subs: "890K subs", text: "Three of my videos went viral in one month after the thumbnail redesign. The before/after is night and day. Absolutely insane results.", color: "#dc2626" },
];

const Testimonials = () => (
  <section style={{ padding: "100px 0 0" }}>
    <Reveal style={{ padding: "0 8%", maxWidth: 760, margin: "0 auto 60px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Social Proof</div>
        <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-1px" }}>
          What Creators{" "}
          <span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Say</span>
        </h2>
      </div>
    </Reveal>

    <ScrollStack
      items={testimonialItems}
      cardHeight={260}
      renderItem={(t, i, isActive) => (
        <div style={{ background: "#0d1017", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "36px 44px", boxShadow: "0 20px 50px rgba(0,0,0,0.6)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: t.color, borderRadius: "4px 0 0 4px" }} />
          <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
            {Array(5).fill(0).map((_, j) => <span key={j} style={{ color: "#fbbf24", fontSize: 13 }}>★</span>)}
          </div>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.68)", lineHeight: 1.85, marginBottom: 26, fontStyle: "italic" }}>"{t.text}"</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17 }}>{t.name[0]}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", marginTop: 3 }}>{t.handle} · {t.subs}</div>
            </div>
          </div>
        </div>
      )}
    />
  </section>
);

/* ─────────────────────────────────────
   FAQ
───────────────────────────────────────*/
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    ["Do you guarantee a high CTR?", "I can't guarantee YouTube's algorithm, but I guarantee designs built on proven click psychology. Most clients see meaningful CTR improvements within the first week."],
    ["What's your typical turnaround time?", "Standard delivery is 48 hours. For bulk or rush projects, reach out and we'll work something out."],
    ["How many revisions do I get?", "Every project includes 2 rounds of revisions. The brief process ensures we're aligned from the start."],
    ["Do you help with strategy too?", "Yes! Ideation, title suggestions, and hook feedback are baked into every project."],
    ["Can I get the source PSD file?", "Source files are available as an add-on. Most clients only need the final exported PNG/JPG."],
  ];
  return (
    <section style={{ padding: "80px 8% 100px", background: "#0a0c12", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 740, margin: "0 auto" }}>
        <Reveal><h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 48, textAlign: "center" }}>Most common questions.</h2></Reveal>
        {faqs.map(([q, a], i) => (
          <div key={q} onClick={() => setOpen(open === i ? null : i)} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "18px 0", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: open === i ? "#3b82f6" : "#fff", transition: "color 0.2s" }}>{q}</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.25)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
            </div>
            {open === i && <p style={{ marginTop: 12, color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.8 }}>{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────
   CTA
───────────────────────────────────────*/
const CTA = () => (
  <section id="contact" style={{ padding: "130px 8%", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 50% 50%,rgba(37,99,235,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />
    <Reveal style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.28)", padding: "7px 18px", borderRadius: 50, marginBottom: 28 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", animation: "blink 2s infinite" }} />
        <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>Now Taking Projects</span>
      </div>
      <h2 style={{ fontSize: "clamp(40px,7vw,86px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-3px", marginBottom: 20 }}>
        Want Better<br />
        <span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Thumbnails?</span>
      </h2>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, marginBottom: 40 }}>Every click counts. Let's make yours.</p>
      <a href="mailto:sandeepxsahu@gmail.com" style={{ textDecoration: "none" }}>
        <button style={{ ...BtnBlue, padding: "18px 52px", fontSize: 16, borderRadius: 60 }}>Work With Me →</button>
      </a>
      <div style={{ marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.18)" }}>No commitments · <span style={{ color: "#3b82f6" }}>sandeepxsahu@gmail.com</span></div>
    </Reveal>
  </section>
);

/* ─────────────────────────────────────
   SHARED BUTTON STYLES
───────────────────────────────────────*/
const BtnBlue = { background: "#2563eb", color: "#fff", border: "none", padding: "13px 28px", borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: "pointer" };
const BtnGhost = { background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", padding: "13px 28px", borderRadius: 50, fontWeight: 600, fontSize: 14, cursor: "pointer" };

/* ─────────────────────────────────────
   ROOT
───────────────────────────────────────*/
export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#080a0f", color: "#fff", fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#080a0f;color:#fff;font-family:'Inter',system-ui,sans-serif}
        ::-webkit-scrollbar{width:3px;background:#080a0f}
        ::-webkit-scrollbar-thumb{background:#1e2030;border-radius:2px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: 64, padding: "0 8%", display: "flex", alignItems: "center", justifyContent: "space-between", background: navScrolled ? "rgba(8,10,15,0.92)" : "transparent", backdropFilter: navScrolled ? "blur(20px)" : "none", borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>CC</div>
          <span style={{ fontWeight: 900, fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase" }}>ClickCraft</span>
        </div>
        <div style={{ display: "flex", gap: 36 }}>
          {[["Work", "work"], ["Process", "process"], ["About", "about"], ["Contact", "contact"]].map(([l, id]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}>{l}</button>
          ))}
        </div>
        <button onClick={() => scrollTo("contact")} style={{ ...BtnBlue, padding: "10px 22px", fontSize: 13 }}>Work With Me</button>
      </nav>

      <Hero onScrollTo={scrollTo} />
      <Intro />
      <FeaturedWork />
      <HowIWork />
      <MyServices />
      <About />
      <Testimonials />
      <FAQ />
      <CTA />

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 8%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900 }}>CC</div>
          <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>ClickCraft</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}>© 2025 ClickCraft Studio</div>
        <a href="mailto:sandeepxsahu@gmail.com" style={{ color: "rgba(255,255,255,0.28)", fontSize: 12, textDecoration: "none" }}>sandeepxsahu@gmail.com</a>
      </footer>
    </div>
  );
}
