import { useState, useRef, useEffect, useCallback } from "react";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{margin:0;padding:0;overflow-x:hidden}
    ::-webkit-scrollbar{width:3px}
    ::-webkit-scrollbar-track{background:#06090f}
    ::-webkit-scrollbar-thumb{background:#2563eb;border-radius:2px}
    .s{font-family:'Syne',system-ui,sans-serif}
    .j{font-family:'Plus Jakarta Sans',system-ui,sans-serif}
    @keyframes fu{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes o1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-30px)}}
    @keyframes o2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,40px)}}
    @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    .ng{background:rgba(6,9,15,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,.06)}
    .bp{background:linear-gradient(135deg,#2563eb,#4338ca);box-shadow:0 4px 20px rgba(37,99,235,.4);transition:all .3s;border:none;cursor:pointer;color:#fff}
    .bp:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(37,99,235,.55)}
    .bg{background:transparent;border:1px solid rgba(255,255,255,.15);color:#fff;transition:all .25s;cursor:pointer}
    .bg:hover{border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.05)}
    .na{color:rgba(255,255,255,.52);transition:color .2s;font-size:14px;font-weight:500;text-decoration:none;background:none;border:none;cursor:pointer;padding:4px 0;position:relative}
    .na::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;background:linear-gradient(90deg,#3b82f6,#8b5cf6);border-radius:1px;transform:scaleX(0);transition:transform .25s}
    .na:hover{color:#fff}.na:hover::after{transform:scaleX(1)}
    .wc{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.065);border-radius:20px;transition:transform .35s,border-color .35s,box-shadow .35s;overflow:hidden}
    .wc:hover{transform:translateY(-6px);border-color:rgba(59,130,246,.28);box-shadow:0 20px 60px rgba(37,99,235,.12)}
    .tc{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);border-radius:16px;transition:border-color .3s,background .3s}
    .tc:hover{border-color:rgba(59,130,246,.22);background:rgba(59,130,246,.025)}
    .pc{border:1px solid rgba(139,92,246,.28);box-shadow:0 0 50px rgba(99,68,255,.12),inset 0 0 24px rgba(99,68,255,.06)}
    .ap{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);border-radius:12px;transition:border-color .3s,background .3s}
    .ap:hover{border-color:rgba(139,92,246,.28);background:rgba(99,68,255,.03)}
    .bd{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:100px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.68)}
    .cb{border-radius:80px;border:1px solid rgba(139,92,246,.16);box-shadow:0 0 100px rgba(99,68,255,.14),inset 0 0 50px rgba(99,68,255,.06)}
    .gu{position:relative;display:inline-block}
    .gu::after{content:'';position:absolute;bottom:-7px;left:0;right:0;height:3px;background:linear-gradient(90deg,#3b82f6,#8b5cf6);border-radius:2px}
    .sp{background:rgba(37,99,235,.12);border:1px solid rgba(37,99,235,.28);color:#60a5fa;border-radius:100px}
    .hero-float{animation:float 5s ease-in-out infinite}
    @media(max-width:960px){
      .hero-grid{grid-template-columns:1fr!important;gap:40px!important}
      .work-grid{grid-template-columns:1fr!important}
      .proc-grid{grid-template-columns:1fr!important;gap:40px!important}
      .about-grid{grid-template-columns:1fr!important;gap:48px!important}
      .testi-grid{grid-template-columns:1fr!important}
      .nav-links{display:none!important}
      .hero-float{animation:none}
    }
  `}</style>
);

function useReveal(th = 0.08) {
  const r = useRef(null), [v, sv] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) sv(true); }, { threshold: th });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [th]);
  return [r, v];
}

function R({ children, delay = 0, style = {} }) {
  const [r, v] = useReveal();
  return (
    <div ref={r} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(22px)", transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms,transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ── Before / After Slider ── */
function Slider({ bfr, aft, stat, slbl, h = 280 }) {
  const [p, sp] = useState(50), [d, sd] = useState(false), r = useRef(null);
  const mv = useCallback(cx => {
    if (!r.current) return;
    const rc = r.current.getBoundingClientRect();
    sp(Math.max(3, Math.min(97, ((cx - rc.left) / rc.width) * 100)));
  }, []);
  useEffect(() => {
    if (!d) return;
    const mm = e => mv(e.clientX);
    const mu = () => sd(false);
    const tm = e => e.touches[0] && mv(e.touches[0].clientX);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", mu);
    };
  }, [d, mv]);

  const A = s => ({ position: "absolute", ...s });
  return (
    <div ref={r}
      onMouseDown={e => { sd(true); mv(e.clientX); }}
      onTouchStart={e => { sd(true); mv(e.touches[0].clientX); }}
      style={{ position: "relative", height: h, borderRadius: 16, overflow: "hidden", cursor: "col-resize", userSelect: "none" }}>
      <div style={A({ inset: 0 })}>{bfr}</div>
      <div style={A({ inset: 0, clipPath: `inset(0 ${100 - p}% 0 0)` })}>{aft}</div>
      <div style={A({ top: 10, left: 10, fontSize: 9, fontWeight: 700, letterSpacing: ".12em", color: "rgba(255,255,255,.55)", background: "rgba(0,0,0,.65)", padding: "3px 9px", borderRadius: 4, zIndex: 4 })}>BEFORE</div>
      <div style={A({ top: 10, right: 10, fontSize: 9, fontWeight: 700, letterSpacing: ".12em", color: "#fff", background: "#2563eb", padding: "3px 9px", borderRadius: 4, zIndex: 4 })}>AFTER</div>
      {stat && (
        <div style={A({ bottom: 10, right: 10, background: "rgba(0,0,0,.88)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "6px 12px", zIndex: 5, display: "flex", alignItems: "center", gap: 6 })}>
          <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: 14 }} className="j">{stat}</span>
          <span style={{ color: "rgba(255,255,255,.42)", fontSize: 11 }} className="j">{slbl}</span>
        </div>
      )}
      <div style={A({ top: 0, bottom: 0, left: `${p}%`, transform: "translateX(-50%)", width: 2, background: "rgba(255,255,255,.9)", zIndex: 3 })} />
      <div style={A({ top: "50%", left: `${p}%`, transform: "translate(-50%,-50%)", width: 38, height: 38, borderRadius: "50%", background: "#0f1626", border: "2px solid rgba(255,255,255,.85)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 28px rgba(0,0,0,.7)", zIndex: 4 })}>
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
          <path d="M4 6H1M14 6h-3M4 3L1 6l3 3M11 3l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={A({ bottom: 10, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: "rgba(255,255,255,.22)", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 3 })} className="j">← Drag to compare →</div>
    </div>
  );
}

/* ── Thumbnail mockups ── */
const T = {
  heroBfr: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#111827,#1f2937)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", opacity: .38 }}>
        <div style={{ width: 90, height: 60, margin: "0 auto 12px", background: "rgba(255,255,255,.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="rgba(255,255,255,.4)"><path d="M8 5l8 5-8 5V5z" /></svg>
        </div>
        <div style={{ color: "rgba(255,255,255,.5)", fontSize: 14, fontWeight: 700, letterSpacing: ".04em" }}>10 MONEY TIPS</div>
        <div style={{ color: "rgba(255,255,255,.25)", fontSize: 10, marginTop: 6 }} className="j">plain boring thumbnail</div>
      </div>
    </div>
  ),
  heroAft: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0d0d1f,#1a0535)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 0, top: 0, width: "62%", height: "100%", background: "linear-gradient(135deg,#3b1870,#1e0845)", clipPath: "ellipse(80% 100% at 70% 50%)" }} />
      <div style={{ position: "absolute", left: 14, top: 8, fontSize: 90, fontWeight: 900, color: "#facc15", lineHeight: 1, fontFamily: "system-ui", textShadow: "0 0 40px rgba(250,204,21,.9)", letterSpacing: -3 }}>Y</div>
      <div style={{ position: "absolute", left: 14, bottom: 8, fontSize: 68, fontWeight: 900, color: "#facc15", lineHeight: 1, fontFamily: "system-ui", textShadow: "0 0 40px rgba(250,204,21,.9)" }}>ES</div>
      <div style={{ position: "absolute", left: "42%", bottom: 38, width: 52, height: 52, borderRadius: "50%", border: "2px solid #22d3ee", display: "flex", alignItems: "center", justifyContent: "center", color: "#22d3ee", fontSize: 24, fontWeight: 900, boxShadow: "0 0 28px rgba(34,211,238,.6)" }}>$</div>
      <div style={{ position: "absolute", right: 18, bottom: 24, color: "#ef4444", fontSize: 36, fontWeight: 900, transform: "rotate(-28deg)" }}>↗</div>
      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "5px 10px" }}>
        <span style={{ color: "#60a5fa", fontWeight: 800, fontSize: 14 }}>+312%</span>
        <span style={{ color: "rgba(255,255,255,.45)", fontSize: 10, marginLeft: 5 }} className="j">CTR increase</span>
      </div>
    </div>
  ),
  g1bfr: (
    <div style={{ width: "100%", height: "100%", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,.2)", fontSize: 12, marginBottom: 8 }} className="j">before redesign</div>
        <div style={{ color: "rgba(255,255,255,.36)", fontSize: 18, fontWeight: 700, fontFamily: "system-ui" }}>GAMING TIPS</div>
        <div style={{ color: "rgba(255,255,255,.16)", fontSize: 11, marginTop: 4 }} className="j">flat text only</div>
      </div>
    </div>
  ),
  g1aft: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#050520,#1a0040)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: 0, top: 0, width: "58%", height: "100%", background: "radial-gradient(ellipse at 60% 40%,#5a2d82,#1a0040)" }} />
      <div style={{ position: "absolute", right: "14%", top: "50%", transform: "translateY(-50%)", width: 72, height: 90, background: "radial-gradient(circle at 40% 35%,#c8a87a,#7a4525)", borderRadius: "48% 48% 44% 44%" }} />
      <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-62%)", fontSize: 78, fontWeight: 900, color: "#facc15", lineHeight: 1, fontFamily: "system-ui", textShadow: "0 0 40px rgba(250,204,21,.9)", letterSpacing: -3 }}>!</div>
      <div style={{ position: "absolute", left: 12, bottom: 12, right: "52%", background: "rgba(0,0,0,.75)", borderRadius: 8, padding: "5px 9px" }}>
        <div style={{ color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1.4 }} className="s">INVISIBLE<br />TO VIRAL</div>
      </div>
    </div>
  ),
  g2bfr: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#8fafc8,#6b8fa5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,.5)", fontSize: 13 }} className="j">desert landscape<br />before redesign</div>
    </div>
  ),
  g2aft: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0d1f0d,#1a3a1a)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%,rgba(45,90,27,.6),transparent 60%)" }} />
      <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-60%)" }}>
        <div style={{ color: "#4ade80", fontSize: 54, fontWeight: 900, lineHeight: 1, fontFamily: "system-ui" }}>$</div>
        <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginTop: 4, lineHeight: 1.3 }} className="s">COMEBACK<br />STORY</div>
      </div>
      <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", textAlign: "center" }}>
        <div style={{ color: "#4ade80", fontSize: 38, fontWeight: 900 }}>↑</div>
        <div style={{ color: "rgba(255,255,255,.5)", fontSize: 9 }} className="j">2.4M Views</div>
      </div>
    </div>
  ),
  g3bfr: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#6b7280,#9ca3af)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,.48)", fontSize: 13 }} className="j">generic neutral palette</div>
    </div>
  ),
  g3aft: (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", background: "#111" }} />
      <div style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", background: "#f97316" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, textAlign: "center", textShadow: "0 2px 14px rgba(0,0,0,.7)", lineHeight: 1.3 }} className="s">CONTRAST<br />IS KING</div>
      </div>
    </div>
  ),
  g4bfr: (
    <div style={{ width: "100%", height: "100%", background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,.3)", fontSize: 13, textAlign: "center" }} className="j">standard<br />thumbnail</div>
    </div>
  ),
  g4aft: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0a0012,#1a0530)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%,rgba(139,92,246,.25),transparent 60%)" }} />
      <div style={{ position: "absolute", top: 16, left: 16, right: 16 }}>
        <div style={{ color: "rgba(255,255,255,.42)", fontSize: 10, letterSpacing: ".1em" }} className="j">THE SECRET THEY...</div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 16, marginTop: 4, lineHeight: 1.3 }} className="s">DON'T WANT<br />YOU TO KNOW</div>
      </div>
      <div style={{ position: "absolute", bottom: 20, right: 20, width: 58, height: 58, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,.45),transparent)", border: "2px dashed rgba(139,92,246,.6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 28, fontWeight: 900 }}>?</div>
    </div>
  ),
  g5bfr: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#bfdbfe,#dbeafe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "rgba(30,58,138,.5)", fontSize: 13 }} className="j">bland channel art<br />50K subs</div>
    </div>
  ),
  g5aft: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0c1445,#1e3a8a)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%,rgba(59,130,246,.3),transparent 60%)" }} />
      <div style={{ position: "absolute", left: 12, top: 14, background: "rgba(59,130,246,.2)", border: "1px solid rgba(59,130,246,.4)", borderRadius: 6, padding: "4px 8px", display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
        <span style={{ color: "#93c5fd", fontSize: 9, fontWeight: 700 }} className="j">AUTHORITY BADGE</span>
      </div>
      <div style={{ position: "absolute", left: 12, top: "40%" }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 15, lineHeight: 1.4 }} className="s">THE<br />AUTHORITY<br />PLAY</div>
      </div>
      <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,.82)", borderRadius: 6, padding: "3px 8px" }}>
        <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: 12 }} className="s">500K</span>
        <span style={{ color: "rgba(255,255,255,.42)", fontSize: 9, marginLeft: 4 }} className="j">subs</span>
      </div>
    </div>
  ),
  g6bfr: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#4ade80,#059669 30%,#1e3a5f 70%,#3b82f6)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.32)", fontSize: 13 }} className="j">scenic landscape</div>
    </div>
  ),
  g6aft: (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1a0040,#2d0060)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 40%,rgba(139,92,246,.42),transparent 60%)" }} />
      <div style={{ position: "absolute", top: 10, left: 14, fontSize: 46 }}>😱</div>
      <div style={{ position: "absolute", left: 14, top: "52%" }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 14, lineHeight: 1.35 }} className="s">THE<br />REACTION<br />MAGNET</div>
      </div>
      <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,.82)", borderRadius: 6, padding: "3px 8px" }}>
        <span style={{ color: "#c084fc", fontWeight: 700, fontSize: 12 }} className="s">4.1M</span>
        <span style={{ color: "rgba(255,255,255,.42)", fontSize: 9, marginLeft: 4 }} className="j">impressions</span>
      </div>
    </div>
  ),
};

/* ── Navbar ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const st = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <nav className="ng" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, boxShadow: scrolled ? "0 2px 40px rgba(0,0,0,.4)" : "none", transition: "box-shadow .3s" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#fff", boxShadow: "0 0 18px rgba(37,99,235,.4)" }} className="s">CC</div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-.02em", color: "#fff" }} className="s">CLICK<span style={{ color: "#3b82f6" }}>CRAFT</span></span>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {["Work", "Process", "About", "Contact"].map(l => (
            <button key={l} className="na j" onClick={() => st(l.toLowerCase())}>{l}</button>
          ))}
        </div>
        <button className="bp j" onClick={() => st("contact")} style={{ padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600 }}>Work With Me</button>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const st = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const ani = d => ({ animation: `fu .85s cubic-bezier(.16,1,.3,1) ${d}ms both` });
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 68, background: "#06090f", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "14%", left: "4%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,.1),transparent 70%)", animation: "o1 16s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "8%", right: "8%", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.08),transparent 70%)", animation: "o2 21s ease-in-out infinite", pointerEvents: "none" }} />
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}
        className="hero-grid"
      >
        {/* LEFT — copy */}
        <div>
          <div className="bd j" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", marginBottom: 28, ...ani(0) }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block", animation: "pulse 2.5s ease-in-out infinite" }} />
            YOUTUBE THUMBNAIL DESIGNER
          </div>
          <h1 className="s" style={{ fontSize: "clamp(42px,5.5vw,68px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.03em", marginBottom: 24, ...ani(80) }}>
            Thumbnails<br />That<br />
            <span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Get Clicks.</span>
          </h1>
          <p className="j" style={{ fontSize: 16, lineHeight: 1.72, color: "rgba(255,255,255,.5)", maxWidth: 430, marginBottom: 36, ...ani(160) }}>
            Designed to <strong style={{ color: "#3b82f6" }}>dominate the feed</strong>. Every pixel engineered for{" "}
            <strong style={{ color: "rgba(255,255,255,.82)" }}>maximum click-through</strong>. Your next video deserves to actually get watched.
          </p>
          <div style={{ display: "flex", gap: 14, marginBottom: 44, flexWrap: "wrap", ...ani(230) }}>
            <button className="bp j" onClick={() => st("work")} style={{ padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600 }}>View Work</button>
            <button className="bg j" onClick={() => st("contact")} style={{ padding: "13px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600 }}>Get a Thumbnail</button>
          </div>
          <div style={{ display: "flex", gap: 40, ...ani(300) }}>
            {[{ v: "+40%", l: "Avg. CTR Increase" }, { v: "200+", l: "Thumbnails Delivered" }, { v: "50M+", l: "Views Generated" }].map(s => (
              <div key={s.l}>
                <div className="s" style={{ fontSize: 24, fontWeight: 800, color: "#60a5fa", letterSpacing: "-.02em" }}>{s.v}</div>
                <div className="j" style={{ fontSize: 12, color: "rgba(255,255,255,.38)", marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT — before/after slider (420px tall — matches original design) */}
        <div style={{ ...ani(180) }} className="hero-float">
          <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,.07)", boxShadow: "0 0 80px rgba(37,99,235,.1),0 40px 100px rgba(0,0,0,.5)" }}>
            <Slider bfr={T.heroBfr} aft={T.heroAft} h={420} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Work ── */
const WD = [
  { b: T.g1bfr, a: T.g1aft, st: "+312%", sl: "CTR Increase", cat: "Gaming", title: "From Invisible to Viral", desc: "Replaced flat text with expressive reaction face. Added high-contrast yellow title that pops against dark background. Eye contact drives curiosity.", hook: "Curiosity Gap + Emotion" },
  { b: T.g2bfr, a: T.g2aft, st: "2.4M", sl: "Views Boost", cat: "Personal Finance", title: "The Comeback Story", desc: "Leveraged before/after narrative with bold split composition. Dollar sign icon anchors the value prop instantly. Urgency color palette (red + gold).", hook: "Transformation Narrative" },
  { b: T.g3bfr, a: T.g3aft, st: "3.2M", sl: "Reach", cat: "Tech", title: "The Power of Contrast", desc: "Split-screen composition forces the eye to make a visual decision. High chroma orange against pure black creates maximum contrast in any feed.", hook: "Contrast + Direction" },
  { b: T.g4bfr, a: T.g4aft, st: "890K", sl: "Views", cat: "Documentary", title: "The Open Loop", desc: "Incomplete sentence triggers pattern-completion in the brain. The question mark becomes a visual anchor. Minimalist design amplifies mystery.", hook: "Open Loop + Mystery" },
  { b: T.g5bfr, a: T.g5aft, st: "50K→500K", sl: "Channel Growth", cat: "Education", title: "The Authority Play", desc: "Bold credentials badge anchors trust. Neutral expression replaced with confident, direct gaze. Split layout communicates the core transformation in 1 second.", hook: "Authority + Social Proof" },
  { b: T.g6bfr, a: T.g6aft, st: "4.1M", sl: "Impressions", cat: "Entertainment", title: "The Reaction Magnet", desc: "Oversized emoji overlay creates familiarity + humor. High chroma background (deep purple) stands out in suggested feed. Three-word title in all caps.", hook: "Familiarity + Humor" },
];

function Work() {
  return (
    <section id="work" style={{ padding: "120px 0", background: "#06090f" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <R><div className="bd j" style={{ display: "inline-flex", padding: "7px 16px", marginBottom: 20 }}>CASE STUDIES</div></R>
          <R delay={80}><h2 className="s gu" style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-.03em", display: "inline-block", marginBottom: 24 }}>Featured Work</h2></R>
          <R delay={160}><p className="j" style={{ color: "rgba(255,255,255,.4)", maxWidth: 520, margin: "24px auto 0", lineHeight: 1.7, fontSize: 15 }}>Drag the slider on each card to see the transformation. Every redesign is built on research, contrast, and psychology.</p></R>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="work-grid">
          {WD.map((c, i) => (
            <R key={i} delay={i * 55}>
              <div className="wc">
                <Slider bfr={c.b} aft={c.a} stat={c.st} slbl={c.sl} h={272} />
                <div style={{ padding: "20px 24px 26px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.62)" }} className="j">{c.cat}</span>
                    <span className="sp j" style={{ padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{c.st} {c.sl}</span>
                  </div>
                  <h3 className="s" style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 10 }}>{c.title}</h3>
                  <p className="j" style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.72, marginBottom: 14 }}>{c.desc}</p>
                  <div className="j" style={{ fontSize: 12, color: "rgba(255,255,255,.26)" }}>Hook: <span style={{ color: "#60a5fa", fontWeight: 600 }}>{c.hook}</span></div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Process ── */
const PS = [
  { n: "01", ic: "🔍", t: "Research", d: "Deep dive into your niche. Analyze top performers, identify click patterns, map emotional triggers. Know your battlefield before designing a single pixel." },
  { n: "02", ic: "✦", t: "Design", d: "Build with intention. Every element earns its place: typography that pops, color that contrasts, composition that guides the eye exactly where it needs to go." },
  { n: "03", ic: "◈", t: "Optimize", d: "Test, measure, refine. Track CTR data, iterate on performance, build a visual system that keeps improving your click-through rate over time." },
];

function Process() {
  return (
    <section id="process" style={{ padding: "120px 0", background: "#06090f", position: "relative" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 380, background: "radial-gradient(ellipse,rgba(99,68,255,.07),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <R><div className="bd j" style={{ display: "inline-flex", padding: "7px 16px", marginBottom: 20 }}>THE METHOD</div></R>
          <R delay={80}><h2 className="s" style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-.03em" }}>How I <span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Work</span></h2></R>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48, position: "relative", alignItems: "start" }} className="proc-grid">
          <div style={{ position: "absolute", top: 69, left: "calc(16.7% + 8px)", right: "calc(16.7% + 8px)", height: 1, background: "linear-gradient(90deg,rgba(139,92,246,.5),rgba(139,92,246,.18) 50%,rgba(139,92,246,.5))", zIndex: 0, pointerEvents: "none" }} />
          {PS.map((s, i) => (
            <R key={s.n} delay={i * 130}>
              <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                  <div className="pc" style={{ width: 138, height: 138, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 40% 35%,rgba(99,68,255,.14),rgba(99,68,255,.04))" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{s.ic}</div>
                    <div className="s" style={{ fontSize: 28, fontWeight: 800, color: "rgba(139,92,246,.85)" }}>{s.n}</div>
                  </div>
                </div>
                <h3 className="s" style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 16 }}>{s.t}</h3>
                <p className="j" style={{ fontSize: 14, color: "rgba(255,255,255,.4)", lineHeight: 1.74, maxWidth: 280, margin: "0 auto" }}>{s.d}</p>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About ── */
const PR = [
  { n: "01", t: "Clarity", d: "Strip away the noise. Every pixel must earn its place. Viewers decide in 0.3 seconds — your thumbnail can't afford to be confusing." },
  { n: "02", t: "Contrast", d: "High contrast between foreground and background is the #1 driver of click-through rate. If everything stands out, nothing does." },
  { n: "03", t: "Curiosity", d: "The thumbnail's job is to raise a question. The video answers it. Master this tension and you master the algorithm." },
];

function About() {
  return (
    <section id="about" style={{ padding: "120px 0", background: "#06090f" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="about-grid">
        <R>
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 24, overflow: "hidden", background: "linear-gradient(135deg,#0d1420,#1a0530)", aspectRatio: "4/3", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 80%,rgba(99,68,255,.16),transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(34,211,238,.08),transparent 40%)" }} />
              <div style={{ position: "absolute", bottom: "15%", left: "12%", right: "18%", background: "#0a0a15", borderRadius: 12, padding: 14, border: "1px solid rgba(255,255,255,.1)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", borderRadius: 6, padding: "6px 10px", marginBottom: 8 }}>
                      <div className="s" style={{ color: "#fff", fontWeight: 900, fontSize: 11 }}>GROW NOW! →</div>
                    </div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {["#3b82f6", "#ef4444", "#f59e0b", "#22c55e"].map(c => <div key={c} style={{ width: 18, height: 18, borderRadius: 4, background: c }} />)}
                    </div>
                  </div>
                  <div style={{ width: 48, height: 58, background: "radial-gradient(circle at 40% 35%,#c8a87a,#7a4525)", borderRadius: 8 }} />
                </div>
              </div>
              <div style={{ position: "absolute", top: "8%", right: "22%", width: 6, height: "52%", background: "linear-gradient(to bottom,rgba(34,211,238,.7),transparent)", borderRadius: 3, filter: "blur(4px)" }} />
            </div>
            <div style={{ position: "absolute", bottom: 20, right: -14, background: "rgba(10,15,28,.96)", border: "1px solid rgba(59,130,246,.2)", borderRadius: 14, padding: "12px 20px", backdropFilter: "blur(12px)", boxShadow: "0 8px 36px rgba(0,0,0,.55)" }}>
              <div className="s" style={{ fontSize: 22, fontWeight: 800, color: "#60a5fa" }}>50M+</div>
              <div className="j" style={{ fontSize: 11, color: "rgba(255,255,255,.36)", marginTop: 2 }}>Views Generated</div>
            </div>
          </div>
        </R>
        <div>
          <R><div className="bd j" style={{ display: "inline-flex", padding: "7px 16px", marginBottom: 20 }}>ABOUT THE STUDIO</div></R>
          <R delay={80}><h2 className="s" style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.06, marginBottom: 24 }}>Thumbnails Built for{" "}<span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Performance</span></h2></R>
          <R delay={120}><p className="j" style={{ fontSize: 15, color: "rgba(255,255,255,.46)", lineHeight: 1.74, marginBottom: 14 }}>I'm a specialist thumbnail designer — not a generalist. I work exclusively with <strong style={{ color: "rgba(255,255,255,.82)" }}>YouTubers and creators</strong> who are serious about growth, from rising channels to multi-million subscriber brands.</p></R>
          <R delay={160}><p className="j" style={{ fontSize: 15, color: "rgba(255,255,255,.46)", lineHeight: 1.74, marginBottom: 32 }}>My process is data-informed and results-obsessed. Every design decision is rooted in what actually drives clicks — not trends, not personal taste, not guesswork.</p></R>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PR.map((p, i) => (
              <R key={p.n} delay={200 + i * 70}>
                <div className="ap" style={{ padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(99,68,255,.12)", border: "1px solid rgba(99,68,255,.24)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="s" style={{ fontSize: 11, fontWeight: 800, color: "#a78bfa" }}>{p.n}</span>
                  </div>
                  <div>
                    <div className="s" style={{ fontWeight: 800, fontSize: 16, marginBottom: 5 }}>{p.t}</div>
                    <div className="j" style={{ fontSize: 13, color: "rgba(255,255,255,.4)", lineHeight: 1.68 }}>{p.d}</div>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
const TM = [
  { n: "Marcus Webb", h: "@marcuswebb", s: "1.2M subs", av: "MW", q: "My CTR went from 2.1% to 7.8% in 3 weeks. The thumbnails don't just look good — they're engineered to get clicked. Best investment I made for my channel." },
  { n: "Priya Sharma", h: "@priyacreates", s: "680K subs", av: "PS", q: "I was skeptical about investing in thumbnail design, but the data doesn't lie. Each redesign came with a clear strategy and the results were immediate." },
  { n: "Jake Thompson", h: "@jakethompson", s: "2.1M subs", av: "JT", q: "Went from struggling with 2% CTR to consistently hitting 8–12%. The research-first approach is what sets this apart. Not just pretty — strategic." },
  { n: "Sarah Kim", h: "@sarahkim", s: "450K subs", av: "SK", q: "The channel grew from 50K to 500K in 8 months. Every thumbnail has a purpose and a clear psychological hook. The before/after difference is night and day." },
];

function Testimonials() {
  return (
    <section style={{ padding: "120px 0", background: "#06090f" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <R><div className="bd j" style={{ display: "inline-flex", padding: "7px 16px", marginBottom: 20 }}>SOCIAL PROOF</div></R>
          <R delay={80}><h2 className="s" style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 16 }}>What Creators <span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Say</span></h2></R>
          <R delay={140}><p className="j" style={{ color: "rgba(255,255,255,.36)", fontSize: 15 }}>Real results from real channels. Not testimonials — evidence.</p></R>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="testi-grid">
          {TM.map((t, i) => (
            <R key={t.h} delay={i * 70}>
              <div className="tc" style={{ padding: "28px" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {[0, 1, 2, 3, 4].map(k => <svg key={k} width="14" height="14" viewBox="0 0 14 14" fill="#3b82f6"><path d="M7 1l1.5 3.8H13l-3.5 2.6 1.4 4L7 8.9 3.1 11.4l1.4-4L1 4.8h4.5z" /></svg>)}
                </div>
                <p className="j" style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,.58)", marginBottom: 24, fontStyle: "italic" }}>"{t.q}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }} className="s">{t.av}</div>
                  <div>
                    <div className="j" style={{ fontWeight: 600, fontSize: 14 }}>{t.n}</div>
                    <div className="j" style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}><span style={{ color: "#60a5fa" }}>{t.h}</span> · {t.s}</div>
                  </div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTA() {
  return (
    <section id="contact" style={{ padding: "120px 0", background: "#06090f" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
        <R>
          <div className="bd j" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", marginBottom: 36 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 9px rgba(34,197,94,.55)", animation: "pulse 2.5s ease-in-out infinite" }} />
            NOW TAKING PROJECTS
          </div>
        </R>
        <R delay={80}>
          <div className="cb" style={{ display: "inline-block", padding: "72px 80px", maxWidth: 680, background: "radial-gradient(ellipse at center,rgba(99,68,255,.17) 0%,rgba(37,99,235,.06) 45%,transparent 70%)" }}>
            <h2 className="s" style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.06, marginBottom: 20 }}>
              <span style={{ background: "linear-gradient(135deg,#60a5fa,#a78bfa,#f0abfc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Want Better</span>
              <br /><span>Thumbnails?</span>
            </h2>
            <p className="j" style={{ color: "rgba(255,255,255,.46)", fontSize: 16, marginBottom: 36 }}>Every click counts. <strong style={{ color: "#fff" }}>Let's make yours.</strong></p>
            <button className="bp j" style={{ padding: "15px 40px", borderRadius: 14, fontSize: 16, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 10 }}>
              Work With Me <span style={{ fontSize: 18 }}>→</span>
            </button>
            <div className="j" style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,.26)" }}>
              No commitments. Email directly at{" "}
              <a href="mailto:workwithme@clickcraft.studio" style={{ color: "#3b82f6", textDecoration: "none" }}>workwithme@clickcraft.studio</a>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,.05)", padding: "32px", textAlign: "center", background: "#06090f" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff" }} className="s">CC</div>
        <span className="s" style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.45)" }}>CLICK<span style={{ color: "#3b82f6" }}>CRAFT</span></span>
      </div>
      <div className="j" style={{ fontSize: 12, color: "rgba(255,255,255,.16)" }}>© 2025 ClickCraft Studio. All rights reserved.</div>
    </footer>
  );
}

/* ── App ── */
export default function App() {
  return (
    <div className="j" style={{ background: "#06090f", color: "#fff", minHeight: "100vh" }}>
      <G />
      <Nav />
      <Hero />
      <Work />
      <Process />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}