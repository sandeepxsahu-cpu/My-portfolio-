import { useState, useRef, useEffect, useCallback } from "react";

/* ── Global Styles ── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { overflow-x: hidden; }

    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: #04060d; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #2563eb, #7c3aed); border-radius: 2px; }

    .font-display { font-family: 'Syne', system-ui, sans-serif; }
    .font-body   { font-family: 'DM Sans', system-ui, sans-serif; }

    /* Noise texture overlay */
    .noise::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.022;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 180px;
    }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes orb1     { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(60px,-45px) scale(1.08); } }
    @keyframes orb2     { 0%,100% { transform:translate(0,0) scale(1); } 50% { transform:translate(-45px,55px) scale(.94); } }
    @keyframes orb3     { 0%,100% { transform:translate(0,0); } 50% { transform:translate(30px,-20px); } }
    @keyframes pulse    { 0%,100% { opacity:.35; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
    @keyframes float    { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-14px); } }
    @keyframes shimmer  { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes borderPulse { 0%,100% { opacity:.4; } 50% { opacity:.85; } }
    @keyframes lineGrow { from { transform:scaleX(0); } to { transform:scaleX(1); } }

    .nav-glass {
      background: rgba(4, 6, 13, 0.82);
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .btn-primary {
      background: linear-gradient(135deg, #1d4ed8, #4f46e5);
      border: none;
      cursor: pointer;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      letter-spacing: 0.01em;
      position: relative;
      overflow: hidden;
      transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s;
      box-shadow: 0 4px 24px rgba(37,99,235,.35), 0 1px 0 rgba(255,255,255,.08) inset;
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,.12), transparent 60%);
      opacity: 0;
      transition: opacity .25s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(37,99,235,.5), 0 1px 0 rgba(255,255,255,.12) inset; }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:active { transform: translateY(0); }

    .btn-ghost {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      color: rgba(255,255,255,.85);
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      transition: all .22s;
    }
    .btn-ghost:hover {
      background: rgba(255,255,255,0.07);
      border-color: rgba(255,255,255,0.2);
      color: #fff;
    }

    .nav-link {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,.48);
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px 0;
      position: relative;
      transition: color .2s;
      letter-spacing: 0.01em;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 1.5px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 1px;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform .25s cubic-bezier(.16,1,.3,1);
    }
    .nav-link:hover { color: rgba(255,255,255,.9); }
    .nav-link:hover::after { transform: scaleX(1); }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 100px;
      font-family: 'DM Sans', sans-serif;
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: rgba(255,255,255,.52);
      padding: 7px 16px;
    }

    /* Work card */
    .work-card {
      background: rgba(255,255,255,.018);
      border: 1px solid rgba(255,255,255,.07);
      border-radius: 20px;
      overflow: hidden;
      transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .35s, box-shadow .35s;
    }
    .work-card:hover {
      transform: translateY(-8px);
      border-color: rgba(59,130,246,.25);
      box-shadow: 0 24px 80px rgba(37,99,235,.1), 0 0 0 1px rgba(59,130,246,.08);
    }

    /* Process step */
    .process-orb {
      background: radial-gradient(circle at 40% 35%, rgba(99,68,255,.18), rgba(99,68,255,.04));
      border: 1px solid rgba(139,92,246,.22);
      box-shadow: 0 0 60px rgba(99,68,255,.12), inset 0 0 28px rgba(99,68,255,.06);
    }

    /* Testimonial card */
    .testi-card {
      background: rgba(255,255,255,.02);
      border: 1px solid rgba(255,255,255,.07);
      border-radius: 18px;
      transition: border-color .3s, background .3s, transform .35s;
    }
    .testi-card:hover {
      border-color: rgba(59,130,246,.18);
      background: rgba(59,130,246,.018);
      transform: translateY(-4px);
    }

    /* About principle card */
    .principle-card {
      background: rgba(255,255,255,.025);
      border: 1px solid rgba(255,255,255,.075);
      border-radius: 14px;
      transition: border-color .3s, background .3s;
    }
    .principle-card:hover {
      border-color: rgba(139,92,246,.25);
      background: rgba(99,68,255,.03);
    }

    /* CTA outer ring */
    .cta-ring {
      border: 1px solid rgba(139,92,246,.18);
      border-radius: 28px;
      box-shadow: 0 0 120px rgba(99,68,255,.16), 0 0 40px rgba(99,68,255,.08), inset 0 0 60px rgba(99,68,255,.05);
      animation: borderPulse 5s ease-in-out infinite;
    }

    /* Stat pill */
    .stat-pill {
      background: rgba(37,99,235,.1);
      border: 1px solid rgba(37,99,235,.22);
      border-radius: 100px;
      color: #60a5fa;
    }

    /* Gradient text shimmer for hero */
    .shimmer-text {
      background: linear-gradient(
        90deg,
        #60a5fa 0%,
        #a78bfa 30%,
        #f0abfc 50%,
        #a78bfa 70%,
        #60a5fa 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 5s linear infinite;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Reveal animation base */
    .reveal { will-change: opacity, transform; }

    @media (max-width: 1024px) {
      .hero-grid    { grid-template-columns: 1fr !important; }
      .about-grid   { grid-template-columns: 1fr !important; gap: 56px !important; }
      .proc-grid    { grid-template-columns: 1fr !important; gap: 32px !important; }
      .proc-line    { display: none !important; }
    }
    @media (max-width: 768px) {
      .work-grid    { grid-template-columns: 1fr !important; }
      .testi-grid   { grid-template-columns: 1fr !important; }
      .hero-stats   { gap: 28px !important; }
      .nav-links    { display: none !important; }
      .hero-float   { animation: none !important; }
    }
  `}</style>
);

/* ── Reveal on scroll ── */
function useReveal(threshold = 0.07) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, y = 24, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateY(${y}px)`,
        transition: `opacity .75s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .75s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Before / After Slider ── */
function Slider({ before, after, stat, statLabel, height = 280 }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const move = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove  = e => move(e.clientX);
    const onUp    = () => setDragging(false);
    const onTouch = e => e.touches[0] && move(e.touches[0].clientX);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, move]);

  const abs = s => ({ position: "absolute", ...s });

  return (
    <div
      ref={containerRef}
      onMouseDown={e => { setDragging(true); move(e.clientX); }}
      onTouchStart={e => { setDragging(true); move(e.touches[0].clientX); }}
      style={{
        position: "relative", height, borderRadius: 16, overflow: "hidden",
        cursor: "col-resize", userSelect: "none",
      }}
    >
      {/* Before layer */}
      <div style={abs({ inset: 0 })}>{before}</div>
      {/* After layer — clip */}
      <div style={abs({ inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` })}>{after}</div>

      {/* Labels */}
      <div style={abs({ top: 12, left: 12, fontSize: 9, fontWeight: 700, letterSpacing: ".12em", color: "rgba(255,255,255,.5)", background: "rgba(0,0,0,.68)", padding: "3px 9px", borderRadius: 5, zIndex: 4, fontFamily:"'DM Sans',sans-serif" })}>BEFORE</div>
      <div style={abs({ top: 12, right: 12, fontSize: 9, fontWeight: 700, letterSpacing: ".12em", color: "#fff", background: "#2563eb", padding: "3px 9px", borderRadius: 5, zIndex: 4, fontFamily:"'DM Sans',sans-serif" })}>AFTER</div>

      {/* Stat badge */}
      {stat && (
        <div style={abs({ bottom: 12, right: 12, background: "rgba(4,6,13,.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "7px 13px", zIndex: 5, display: "flex", alignItems: "center", gap: 6 })}>
          <span style={{ color: "#60a5fa", fontWeight: 700, fontSize: 15, fontFamily: "'Syne',sans-serif" }}>{stat}</span>
          <span style={{ color: "rgba(255,255,255,.38)", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>{statLabel}</span>
        </div>
      )}

      {/* Divider line */}
      <div style={abs({ top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", width: "1.5px", background: "rgba(255,255,255,.92)", zIndex: 3, boxShadow: "0 0 12px rgba(255,255,255,.3)" })} />

      {/* Handle */}
      <div style={abs({
        top: "50%", left: `${pos}%`,
        transform: "translate(-50%,-50%)",
        width: 40, height: 40, borderRadius: "50%",
        background: "#0a0f1e",
        border: "1.5px solid rgba(255,255,255,.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 32px rgba(0,0,0,.8), 0 0 0 4px rgba(255,255,255,.06)",
        zIndex: 4,
      })}>
        <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
          <path d="M5 6.5H1M15 6.5h-4M5 3.5L1 6.5l4 3M11 3.5l4 3-4 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Hint */}
      <div style={abs({ bottom: 12, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: "rgba(255,255,255,.18)", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 3, fontFamily:"'DM Sans',sans-serif", letterSpacing:".08em" })}>← DRAG TO COMPARE →</div>
    </div>
  );
}

/* ── Thumbnail Mockups ── */
const Thumbs = {
  heroBefore: (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#0f1520,#1e2a3a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", opacity:.32 }}>
        <div style={{ width:96, height:64, margin:"0 auto 14px", background:"rgba(255,255,255,.07)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,.4)"><path d="M8 5l11 7-11 7V5z"/></svg>
        </div>
        <div style={{ color:"rgba(255,255,255,.42)", fontSize:15, fontWeight:700, letterSpacing:".04em", fontFamily:"system-ui" }}>10 MONEY TIPS</div>
        <div style={{ color:"rgba(255,255,255,.2)", fontSize:11, marginTop:6, fontFamily:"system-ui" }}>plain boring thumbnail</div>
      </div>
    </div>
  ),
  heroAfter: (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#0d0d22,#1a0535)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:0, top:0, width:"62%", height:"100%", background:"linear-gradient(135deg,#3b1870,#1e0845)", clipPath:"ellipse(80% 100% at 70% 50%)" }}/>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 30% 40%,rgba(59,130,246,.12),transparent 55%)" }}/>
      <div style={{ position:"absolute", left:18, top:10, fontSize:108, fontWeight:900, color:"#facc15", lineHeight:1, fontFamily:"system-ui", textShadow:"0 0 50px rgba(250,204,21,.9),0 0 100px rgba(250,204,21,.4)", letterSpacing:-4 }}>Y</div>
      <div style={{ position:"absolute", left:18, bottom:10, fontSize:80, fontWeight:900, color:"#facc15", lineHeight:1, fontFamily:"system-ui", textShadow:"0 0 50px rgba(250,204,21,.9)" }}>ES</div>
      <div style={{ position:"absolute", left:"44%", bottom:45, width:56, height:56, borderRadius:"50%", border:"2px solid #22d3ee", display:"flex", alignItems:"center", justifyContent:"center", color:"#22d3ee", fontSize:28, fontWeight:900, boxShadow:"0 0 32px rgba(34,211,238,.65)" }}>$</div>
      <div style={{ position:"absolute", right:22, bottom:28, color:"#ef4444", fontSize:40, fontWeight:900, transform:"rotate(-28deg)", textShadow:"0 0 20px rgba(239,68,68,.6)" }}>↗</div>
      <div style={{ position:"absolute", top:14, right:14, background:"rgba(0,0,0,.75)", backdropFilter:"blur(10px)", borderRadius:9, padding:"6px 12px", border:"1px solid rgba(255,255,255,.08)" }}>
        <span style={{ color:"#60a5fa", fontWeight:800, fontSize:15, fontFamily:"'Syne',sans-serif" }}>+312%</span>
        <span style={{ color:"rgba(255,255,255,.4)", fontSize:10, marginLeft:6, fontFamily:"system-ui" }}>CTR increase</span>
      </div>
    </div>
  ),
  g1b: (<div style={{ width:"100%",height:"100%",background:"#0f1823",display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ textAlign:"center" }}><div style={{ color:"rgba(255,255,255,.18)",fontSize:11,marginBottom:8,fontFamily:"system-ui",letterSpacing:".06em" }}>before redesign</div><div style={{ color:"rgba(255,255,255,.32)",fontSize:19,fontWeight:700,fontFamily:"system-ui" }}>GAMING TIPS</div><div style={{ color:"rgba(255,255,255,.14)",fontSize:10,marginTop:4,fontFamily:"system-ui" }}>flat text only</div></div></div>),
  g1a: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#05051f,#1a0040)",position:"relative",overflow:"hidden" }}><div style={{ position:"absolute",right:0,top:0,width:"58%",height:"100%",background:"radial-gradient(ellipse at 60% 40%,#5a2d82,#1a0040)" }}/><div style={{ position:"absolute",right:"14%",top:"50%",transform:"translateY(-50%)",width:76,height:94,background:"radial-gradient(circle at 40% 35%,#c8a87a,#7a4525)",borderRadius:"48% 48% 44% 44%" }}/><div style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-64%)",fontSize:88,fontWeight:900,color:"#facc15",lineHeight:1,fontFamily:"system-ui",textShadow:"0 0 48px rgba(250,204,21,.9)",letterSpacing:-3 }}>!</div><div style={{ position:"absolute",left:14,bottom:14,right:"52%",background:"rgba(0,0,0,.8)",borderRadius:9,padding:"6px 10px" }}><div style={{ color:"#fff",fontSize:10,fontWeight:700,lineHeight:1.4,fontFamily:"'Syne',sans-serif" }}>INVISIBLE<br/>TO VIRAL</div></div></div>),
  g2b: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#8fafc8,#6b8fa5)",display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ textAlign:"center",color:"rgba(255,255,255,.45)",fontSize:13,fontFamily:"system-ui" }}>desert landscape<br/>before redesign</div></div>),
  g2a: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#0d1f0d,#1a3a1a)",position:"relative",overflow:"hidden" }}><div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 70% 50%,rgba(45,90,27,.6),transparent 60%)" }}/><div style={{ position:"absolute",left:18,top:"50%",transform:"translateY(-60%)" }}><div style={{ color:"#4ade80",fontSize:60,fontWeight:900,lineHeight:1,fontFamily:"system-ui" }}>$</div><div style={{ color:"#fff",fontSize:11,fontWeight:700,marginTop:4,lineHeight:1.3,fontFamily:"'Syne',sans-serif" }}>COMEBACK<br/>STORY</div></div><div style={{ position:"absolute",right:18,top:"50%",transform:"translateY(-50%)",textAlign:"center" }}><div style={{ color:"#4ade80",fontSize:40,fontWeight:900 }}>↑</div><div style={{ color:"rgba(255,255,255,.5)",fontSize:9,fontFamily:"system-ui" }}>2.4M Views</div></div></div>),
  g3b: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#6b7280,#9ca3af)",display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ textAlign:"center",color:"rgba(255,255,255,.45)",fontSize:13,fontFamily:"system-ui" }}>generic neutral palette</div></div>),
  g3a: (<div style={{ width:"100%",height:"100%",position:"relative",overflow:"hidden" }}><div style={{ position:"absolute",left:0,top:0,width:"50%",height:"100%",background:"#111" }}/><div style={{ position:"absolute",right:0,top:0,width:"50%",height:"100%",background:"#f97316" }}/><div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ color:"#fff",fontWeight:900,fontSize:24,textAlign:"center",textShadow:"0 2px 18px rgba(0,0,0,.7)",lineHeight:1.25,fontFamily:"'Syne',sans-serif" }}>CONTRAST<br/>IS KING</div></div></div>),
  g4b: (<div style={{ width:"100%",height:"100%",background:"#1c2333",display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ color:"rgba(255,255,255,.28)",fontSize:13,textAlign:"center",fontFamily:"system-ui" }}>standard<br/>thumbnail</div></div>),
  g4a: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#0a0012,#1a0530)",position:"relative",overflow:"hidden" }}><div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%,rgba(139,92,246,.28),transparent 60%)" }}/><div style={{ position:"absolute",top:18,left:18,right:18 }}><div style={{ color:"rgba(255,255,255,.38)",fontSize:10,letterSpacing:".1em",fontFamily:"system-ui" }}>THE SECRET THEY...</div><div style={{ color:"#fff",fontWeight:900,fontSize:17,marginTop:4,lineHeight:1.3,fontFamily:"'Syne',sans-serif" }}>DON'T WANT<br/>YOU TO KNOW</div></div><div style={{ position:"absolute",bottom:22,right:22,width:62,height:62,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,.45),transparent)",border:"2px dashed rgba(139,92,246,.6)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:30,fontWeight:900 }}>?</div></div>),
  g5b: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#bfdbfe,#dbeafe)",display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ textAlign:"center",color:"rgba(30,58,138,.48)",fontSize:13,fontFamily:"system-ui" }}>bland channel art<br/>50K subs</div></div>),
  g5a: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#0c1445,#1e3a8a)",position:"relative",overflow:"hidden" }}><div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,rgba(59,130,246,.32),transparent 60%)" }}/><div style={{ position:"absolute",left:14,top:16,background:"rgba(59,130,246,.18)",border:"1px solid rgba(59,130,246,.4)",borderRadius:7,padding:"4px 9px",display:"flex",alignItems:"center",gap:5 }}><div style={{ width:6,height:6,borderRadius:"50%",background:"#3b82f6" }}/><span style={{ color:"#93c5fd",fontSize:9,fontWeight:700,fontFamily:"system-ui" }}>AUTHORITY BADGE</span></div><div style={{ position:"absolute",left:14,top:"40%" }}><div style={{ color:"#fff",fontWeight:900,fontSize:16,lineHeight:1.4,fontFamily:"'Syne',sans-serif" }}>THE<br/>AUTHORITY<br/>PLAY</div></div><div style={{ position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,.85)",borderRadius:7,padding:"4px 9px" }}><span style={{ color:"#60a5fa",fontWeight:700,fontSize:13,fontFamily:"'Syne',sans-serif" }}>500K</span><span style={{ color:"rgba(255,255,255,.4)",fontSize:9,marginLeft:5,fontFamily:"system-ui" }}>subs</span></div></div>),
  g6b: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#4ade80,#059669 30%,#1e3a5f 70%,#3b82f6)",position:"relative" }}><div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.28)",fontSize:13,fontFamily:"system-ui" }}>scenic landscape</div></div>),
  g6a: (<div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#1a0040,#2d0060)",position:"relative",overflow:"hidden" }}><div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 60% 40%,rgba(139,92,246,.44),transparent 60%)" }}/><div style={{ position:"absolute",top:12,left:16,fontSize:50 }}>😱</div><div style={{ position:"absolute",left:16,top:"54%" }}><div style={{ color:"#fff",fontWeight:900,fontSize:14,lineHeight:1.35,fontFamily:"'Syne',sans-serif" }}>THE<br/>REACTION<br/>MAGNET</div></div><div style={{ position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,.85)",borderRadius:7,padding:"4px 9px" }}><span style={{ color:"#c084fc",fontWeight:700,fontSize:13,fontFamily:"'Syne',sans-serif" }}>4.1M</span><span style={{ color:"rgba(255,255,255,.38)",fontSize:9,marginLeft:5,fontFamily:"system-ui" }}>impressions</span></div></div>),
};

/* ── NAVBAR ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav
      className="nav-glass"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        boxShadow: scrolled ? "0 4px 48px rgba(0,0,0,.5)" : "none",
        transition: "box-shadow .4s",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 900, color: "#fff",
            boxShadow: "0 0 22px rgba(37,99,235,.45), 0 0 0 1px rgba(255,255,255,.06) inset",
          }} className="font-display">CC</div>
          <span className="font-display" style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-.02em", color: "#fff" }}>
            CLICK<span style={{ color: "#3b82f6" }}>CRAFT</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="nav-links" style={{ display: "flex", gap: 38, alignItems: "center" }}>
          {["Work", "Process", "About", "Contact"].map(l => (
            <button key={l} className="nav-link" onClick={() => scrollTo(l.toLowerCase())}>{l}</button>
          ))}
        </div>

        {/* CTA */}
        <button
          className="btn-primary font-body"
          onClick={() => scrollTo("contact")}
          style={{ padding: "10px 22px", borderRadius: 11, fontSize: 14, fontWeight: 600 }}
        >
          Work With Me
        </button>
      </div>
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const fadeIn = (d) => ({ animation: `fadeUp .9s cubic-bezier(.16,1,.3,1) ${d}ms both` });

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 70, background: "#04060d", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position:"absolute", top:"8%", left:"2%", width:680, height:680, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,.085),transparent 68%)", animation:"orb1 18s ease-in-out infinite", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"5%", right:"4%", width:780, height:780, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.065),transparent 65%)", animation:"orb2 24s ease-in-out infinite", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"40%", left:"45%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,68,255,.055),transparent 70%)", animation:"orb3 14s ease-in-out infinite", pointerEvents:"none" }}/>

      {/* Grid dot pattern */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,.028) 1px, transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }}/>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 40px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="hero-grid">
        {/* LEFT */}
        <div>
          <div className="badge font-body" style={{ ...fadeIn(0), marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0, animation: "pulse 2.5s ease-in-out infinite" }}/>
            YouTube Thumbnail Designer
          </div>

          <h1 className="font-display" style={{ fontSize: "clamp(44px,5.5vw,72px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-.035em", marginBottom: 26, ...fadeIn(75) }}>
            Thumbnails<br/>That<br/>
            <span className="shimmer-text">Get Clicks.</span>
          </h1>

          <p className="font-body" style={{ fontSize: 16.5, lineHeight: 1.75, color: "rgba(255,255,255,.46)", maxWidth: 440, marginBottom: 38, ...fadeIn(155) }}>
            Designed to <strong style={{ color: "#60a5fa", fontWeight: 600 }}>dominate the feed</strong>. Every pixel engineered for{" "}
            <strong style={{ color: "rgba(255,255,255,.82)", fontWeight: 600 }}>maximum click-through</strong>. Your next video deserves to actually get watched.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 52, flexWrap: "wrap", ...fadeIn(225) }}>
            <button className="btn-primary font-body" onClick={() => scrollTo("work")} style={{ padding: "14px 30px", borderRadius: 12, fontSize: 15, fontWeight: 600 }}>
              View Work
            </button>
            <button className="btn-ghost font-body" onClick={() => scrollTo("contact")} style={{ padding: "14px 30px", borderRadius: 12, fontSize: 15 }}>
              Get a Thumbnail
            </button>
          </div>

          <div className="hero-stats" style={{ display: "flex", gap: 48, ...fadeIn(295) }}>
            {[
              { v: "+40%",  l: "Avg. CTR Increase" },
              { v: "200+",  l: "Thumbnails Delivered" },
              { v: "50M+",  l: "Views Generated" },
            ].map(s => (
              <div key={s.l}>
                <div className="font-display" style={{ fontSize: 26, fontWeight: 900, color: "#60a5fa", letterSpacing: "-.025em", lineHeight: 1 }}>{s.v}</div>
                <div className="font-body" style={{ fontSize: 12, color: "rgba(255,255,255,.32)", marginTop: 5, letterSpacing: ".01em" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — hero slider */}
        <div style={{ ...fadeIn(180) }} className="hero-float" style={{ animation: "float 6s ease-in-out infinite" }}>
          <div style={{
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.07)",
            boxShadow: "0 0 100px rgba(37,99,235,.12), 0 48px 120px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04) inset",
          }}>
            <Slider before={Thumbs.heroBefore} after={Thumbs.heroAfter} height={440} />
          </div>
          {/* Floating glow pip */}
          <div style={{ position:"absolute", bottom:-20, left:"50%", transform:"translateX(-50%)", width:160, height:40, background:"radial-gradient(ellipse,rgba(37,99,235,.25),transparent 70%)", pointerEvents:"none" }}/>
        </div>
      </div>
    </section>
  );
}

/* ── WORK ── */
const WORK_DATA = [
  { b:Thumbs.g1b, a:Thumbs.g1a, stat:"+312%", statLabel:"CTR Increase",  cat:"Gaming",          title:"From Invisible to Viral",  desc:"Replaced flat text with an expressive reaction face. High-contrast yellow title pops against deep dark background. Eye contact drives curiosity.", hook:"Curiosity Gap + Emotion" },
  { b:Thumbs.g2b, a:Thumbs.g2a, stat:"2.4M",  statLabel:"Views Boost",   cat:"Personal Finance", title:"The Comeback Story",       desc:"Leveraged before/after narrative with bold split composition. Dollar sign anchors the value prop instantly. Urgency color palette (red + gold).", hook:"Transformation Narrative" },
  { b:Thumbs.g3b, a:Thumbs.g3a, stat:"3.2M",  statLabel:"Reach",          cat:"Tech",             title:"The Power of Contrast",    desc:"Split-screen forces the eye to choose. High chroma orange against pure black creates maximum contrast in any feed. Direction implied by layout.", hook:"Contrast + Direction" },
  { b:Thumbs.g4b, a:Thumbs.g4a, stat:"890K",  statLabel:"Views",          cat:"Documentary",      title:"The Open Loop",            desc:"Incomplete sentence triggers pattern-completion in the brain. The question mark becomes a visual anchor. Minimalist design amplifies mystery.", hook:"Open Loop + Mystery" },
  { b:Thumbs.g5b, a:Thumbs.g5a, stat:"50K→500K", statLabel:"Channel Growth", cat:"Education",    title:"The Authority Play",       desc:"Bold credentials badge anchors trust. Confident direct gaze replaces generic neutral expression. Layout communicates transformation in one second.", hook:"Authority + Social Proof" },
  { b:Thumbs.g6b, a:Thumbs.g6a, stat:"4.1M",  statLabel:"Impressions",    cat:"Entertainment",    title:"The Reaction Magnet",      desc:"Oversized emoji creates familiarity and humor instantly. Deep purple background stands out in the suggested feed. Three-word caps title lands fast.", hook:"Familiarity + Humor" },
];

function Work() {
  return (
    <section id="work" style={{ padding: "128px 0", background: "#04060d" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <Reveal><div className="badge font-body" style={{ marginBottom: 20 }}>Case Studies</div></Reveal>
          <Reveal delay={80}>
            <h2 className="font-display" style={{ fontSize: "clamp(40px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-.035em", marginBottom: 0, display: "inline-block", position: "relative" }}>
              Featured Work
              <div style={{ position:"absolute", bottom:-10, left:0, right:0, height:3, background:"linear-gradient(90deg,#3b82f6,#8b5cf6)", borderRadius:2, animation:"lineGrow .8s cubic-bezier(.16,1,.3,1) .3s both", transformOrigin:"left" }}/>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="font-body" style={{ color: "rgba(255,255,255,.36)", maxWidth: 520, margin: "32px auto 0", lineHeight: 1.72, fontSize: 15.5 }}>
              Drag the slider on each card to see the transformation. Every redesign is built on research, contrast, and psychology.
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="work-grid">
          {WORK_DATA.map((card, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="work-card">
                <Slider before={card.b} after={card.a} stat={card.stat} statLabel={card.statLabel} height={268} />
                <div style={{ padding: "22px 26px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                    <span className="font-body" style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:100, padding:"4px 13px", fontSize:11.5, fontWeight:600, color:"rgba(255,255,255,.55)", letterSpacing:".01em" }}>{card.cat}</span>
                    <span className="stat-pill font-body" style={{ padding:"4px 13px", fontSize:11.5, fontWeight:700 }}>{card.stat} {card.statLabel}</span>
                  </div>
                  <h3 className="font-display" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 11, lineHeight: 1.2 }}>{card.title}</h3>
                  <p className="font-body" style={{ fontSize: 13.5, color: "rgba(255,255,255,.38)", lineHeight: 1.74, marginBottom: 14 }}>{card.desc}</p>
                  <div className="font-body" style={{ fontSize: 12, color: "rgba(255,255,255,.22)" }}>
                    Hook: <span style={{ color: "#60a5fa", fontWeight: 600 }}>{card.hook}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROCESS ── */
const PROCESS_STEPS = [
  { n:"01", icon:"🔍", title:"Research",  desc:"Deep dive into your niche. Analyze top performers, identify click patterns, map emotional triggers. Know your battlefield before designing a single pixel." },
  { n:"02", icon:"✦",  title:"Design",    desc:"Build with intention. Every element earns its place — typography that pops, color that contrasts, composition that guides the eye exactly where it needs to go." },
  { n:"03", icon:"◈",  title:"Optimize",  desc:"Test, measure, refine. Track CTR data, iterate on performance, build a visual system that keeps improving your click-through rate over time." },
];

function Process() {
  return (
    <section id="process" style={{ padding: "128px 0", background: "#04060d", position: "relative" }}>
      {/* Glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:800, height:400, background:"radial-gradient(ellipse,rgba(99,68,255,.065),transparent 68%)", pointerEvents:"none" }}/>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 88 }}>
          <Reveal><div className="badge font-body" style={{ marginBottom: 20 }}>The Method</div></Reveal>
          <Reveal delay={80}>
            <h2 className="font-display" style={{ fontSize: "clamp(40px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-.035em" }}>
              How I <span className="gradient-text">Work</span>
            </h2>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 56, position: "relative" }} className="proc-grid">
          {/* Connector line */}
          <div className="proc-line" style={{ position:"absolute", top:69, left:"calc(16.67% + 8px)", right:"calc(16.67% + 8px)", height:"1px", background:"linear-gradient(90deg,rgba(139,92,246,.5),rgba(139,92,246,.15) 50%,rgba(139,92,246,.5))", zIndex:0 }}/>

          {PROCESS_STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 140}>
              <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                {/* Orb */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
                  <div className="process-orb" style={{ width: 138, height: 138, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 7, lineHeight: 1 }}>{s.icon}</div>
                    <div className="font-display" style={{ fontSize: 30, fontWeight: 900, color: "rgba(139,92,246,.88)" }}>{s.n}</div>
                  </div>
                </div>
                <h3 className="font-display" style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-.025em", marginBottom: 16 }}>{s.title}</h3>
                <p className="font-body" style={{ fontSize: 14, color: "rgba(255,255,255,.38)", lineHeight: 1.76, maxWidth: 288, margin: "0 auto" }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
const PRINCIPLES = [
  { n:"01", title:"Clarity",   desc:"Strip away the noise. Every pixel must earn its place. Viewers decide in 0.3 seconds — your thumbnail can't afford to be confusing." },
  { n:"02", title:"Contrast",  desc:"High contrast between foreground and background is the #1 driver of click-through. If everything stands out, nothing does." },
  { n:"03", title:"Curiosity", desc:"The thumbnail's job is to raise a question. The video answers it. Master this tension and you master the algorithm." },
];

function About() {
  return (
    <section id="about" style={{ padding: "128px 0", background: "#04060d" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 88, alignItems: "center" }} className="about-grid">
        {/* LEFT — visual mockup */}
        <Reveal>
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: 24, overflow: "hidden",
              background: "linear-gradient(135deg,#0d1420,#1a0530)",
              aspectRatio: "4/3", position: "relative",
              border: "1px solid rgba(255,255,255,.06)",
              boxShadow: "0 0 80px rgba(99,68,255,.1), 0 40px 100px rgba(0,0,0,.5)",
            }}>
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 20% 80%,rgba(99,68,255,.18),transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(34,211,238,.09),transparent 42%)" }}/>
              {/* Mini thumbnail editor mockup */}
              <div style={{ position:"absolute", bottom:"14%", left:"10%", right:"16%", background:"rgba(7,10,20,.92)", borderRadius:14, padding:16, border:"1px solid rgba(255,255,255,.1)", backdropFilter:"blur(8px)" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ background:"linear-gradient(135deg,#7c3aed,#2563eb)", borderRadius:8, padding:"7px 12px", marginBottom:10 }}>
                      <div className="font-display" style={{ color:"#fff", fontWeight:900, fontSize:11, letterSpacing:".04em" }}>GROW NOW! →</div>
                    </div>
                    <div style={{ display:"flex", gap:4 }}>
                      {["#3b82f6","#ef4444","#f59e0b","#22c55e"].map(c => (
                        <div key={c} style={{ width:20, height:20, borderRadius:5, background:c, boxShadow:`0 2px 8px ${c}66` }}/>
                      ))}
                    </div>
                  </div>
                  <div style={{ width:52, height:64, background:"radial-gradient(circle at 40% 35%,#c8a87a,#7a4525)", borderRadius:10, flexShrink:0 }}/>
                </div>
              </div>
              {/* Decorative bar */}
              <div style={{ position:"absolute", top:"8%", right:"22%", width:5, height:"52%", background:"linear-gradient(to bottom,rgba(34,211,238,.75),transparent)", borderRadius:3, filter:"blur(3px)" }}/>
              <div style={{ position:"absolute", top:"8%", right:"18%", width:2, height:"38%", background:"linear-gradient(to bottom,rgba(139,92,246,.6),transparent)", borderRadius:2, filter:"blur(2px)" }}/>
            </div>

            {/* Floating stat badge */}
            <div style={{
              position:"absolute", bottom:18, right:-20,
              background:"rgba(7,10,20,.96)",
              border:"1px solid rgba(59,130,246,.2)",
              borderRadius:14, padding:"14px 22px",
              backdropFilter:"blur(14px)",
              boxShadow:"0 10px 40px rgba(0,0,0,.6), 0 0 0 1px rgba(59,130,246,.06) inset",
            }}>
              <div className="font-display" style={{ fontSize:26, fontWeight:900, color:"#60a5fa", lineHeight:1 }}>50M+</div>
              <div className="font-body" style={{ fontSize:11, color:"rgba(255,255,255,.32)", marginTop:4 }}>Views Generated</div>
            </div>
          </div>
        </Reveal>

        {/* RIGHT — copy */}
        <div>
          <Reveal><div className="badge font-body" style={{ marginBottom: 20 }}>About the Studio</div></Reveal>
          <Reveal delay={80}>
            <h2 className="font-display" style={{ fontSize: "clamp(36px,4vw,50px)", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1.05, marginBottom: 24 }}>
              Thumbnails Built for{" "}<span className="gradient-text">Performance</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="font-body" style={{ fontSize: 15.5, color: "rgba(255,255,255,.44)", lineHeight: 1.76, marginBottom: 14 }}>
              I'm a specialist thumbnail designer — not a generalist. I work exclusively with{" "}
              <strong style={{ color: "rgba(255,255,255,.82)", fontWeight: 500 }}>YouTubers and creators</strong> who are serious about growth, from rising channels to multi-million subscriber brands.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p className="font-body" style={{ fontSize: 15.5, color: "rgba(255,255,255,.44)", lineHeight: 1.76, marginBottom: 36 }}>
              My process is data-informed and results-obsessed. Every design decision is rooted in what actually drives clicks — not trends, not personal taste, not guesswork.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={200 + i * 75}>
                <div className="principle-card" style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,68,255,.1)", border: "1px solid rgba(99,68,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="font-display" style={{ fontSize: 11, fontWeight: 900, color: "#a78bfa" }}>{p.n}</span>
                  </div>
                  <div>
                    <div className="font-display" style={{ fontWeight: 800, fontSize: 16, marginBottom: 6, letterSpacing: "-.01em" }}>{p.title}</div>
                    <div className="font-body" style={{ fontSize: 13.5, color: "rgba(255,255,255,.38)", lineHeight: 1.7 }}>{p.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
const TESTIMONIALS = [
  { name:"Marcus Webb",   handle:"@marcuswebb",    subs:"1.2M subs", initials:"MW", quote:"My CTR went from 2.1% to 7.8% in 3 weeks. The thumbnails don't just look good — they're engineered to get clicked. Best investment I've made for my channel." },
  { name:"Priya Sharma",  handle:"@priyacreates",  subs:"680K subs", initials:"PS", quote:"I was skeptical about investing in thumbnail design, but the data doesn't lie. Each redesign came with a clear strategy and the results were immediate." },
  { name:"Jake Thompson", handle:"@jakethompson",  subs:"2.1M subs", initials:"JT", quote:"Went from struggling at 2% CTR to consistently hitting 8–12%. The research-first approach sets this apart. Not just pretty — strategic." },
  { name:"Sarah Kim",     handle:"@sarahkim",      subs:"450K subs", initials:"SK", quote:"The channel grew from 50K to 500K in 8 months. Every thumbnail has a purpose and a clear psychological hook. The before/after difference is night and day." },
];

function Testimonials() {
  return (
    <section style={{ padding: "128px 0", background: "#04060d" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <Reveal><div className="badge font-body" style={{ marginBottom: 20 }}>Social Proof</div></Reveal>
          <Reveal delay={80}>
            <h2 className="font-display" style={{ fontSize: "clamp(40px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-.035em", marginBottom: 16 }}>
              What Creators <span className="gradient-text">Say</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="font-body" style={{ color: "rgba(255,255,255,.32)", fontSize: 15.5 }}>Real results from real channels. Not testimonials — evidence.</p>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.handle} delay={i * 75}>
              <div className="testi-card" style={{ padding: "30px 32px" }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
                  {[0,1,2,3,4].map(k => (
                    <svg key={k} width="14" height="14" viewBox="0 0 14 14" fill="#3b82f6">
                      <path d="M7 1l1.5 3.8H13l-3.5 2.6 1.4 4L7 8.9 3.1 11.4l1.4-4L1 4.8h4.5z"/>
                    </svg>
                  ))}
                </div>
                <p className="font-body" style={{ fontSize: 14.5, lineHeight: 1.78, color: "rgba(255,255,255,.55)", marginBottom: 26, fontStyle: "italic" }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow:"0 0 18px rgba(37,99,235,.35)" }} className="font-display">{t.initials}</div>
                  <div>
                    <div className="font-body" style={{ fontWeight: 600, fontSize: 14.5 }}>{t.name}</div>
                    <div className="font-body" style={{ fontSize: 12, color: "rgba(255,255,255,.28)", marginTop: 2 }}>
                      <span style={{ color: "#60a5fa" }}>{t.handle}</span> · {t.subs}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTA() {
  return (
    <section id="contact" style={{ padding: "128px 0", background: "#04060d" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
        <Reveal>
          <div className="badge font-body" style={{ marginBottom: 40 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0, boxShadow: "0 0 10px rgba(34,197,94,.6)", animation: "pulse 2.5s ease-in-out infinite" }}/>
            Now Taking Projects
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="cta-ring" style={{ display: "inline-block", padding: "80px 88px", maxWidth: 720, background: "radial-gradient(ellipse at center, rgba(99,68,255,.18) 0%, rgba(37,99,235,.06) 42%, transparent 68%)" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(44px,5vw,64px)", fontWeight: 900, letterSpacing: "-.035em", lineHeight: 1.04, marginBottom: 20 }}>
              <span className="shimmer-text">Want Better</span>
              <br/>
              <span style={{ color: "#fff" }}>Thumbnails?</span>
            </h2>
            <p className="font-body" style={{ color: "rgba(255,255,255,.44)", fontSize: 16.5, marginBottom: 40, lineHeight: 1.65 }}>
              Every click counts.{" "}<strong style={{ color: "#fff", fontWeight: 600 }}>Let's make yours.</strong>
            </p>
            <button className="btn-primary font-body" style={{ padding: "16px 44px", borderRadius: 14, fontSize: 16.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 10 }}>
              Work With Me <span style={{ fontSize: 18 }}>→</span>
            </button>
            <div className="font-body" style={{ marginTop: 22, fontSize: 13, color: "rgba(255,255,255,.22)" }}>
              No commitments. Email directly at{" "}
              <a href="mailto:workwithme@clickcraft.studio" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}>workwithme@clickcraft.studio</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,.04)", padding: "36px 40px", textAlign: "center", background: "#04060d" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff" }} className="font-display">CC</div>
        <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,.4)" }}>CLICK<span style={{ color: "#3b82f6" }}>CRAFT</span></span>
      </div>
      <div className="font-body" style={{ fontSize: 12, color: "rgba(255,255,255,.14)", letterSpacing: ".02em" }}>© 2025 ClickCraft Studio. All rights reserved.</div>
    </footer>
  );
}

/* ── APP ── */
export default function App() {
  return (
    <div className="noise font-body" style={{ background: "#04060d", color: "#fff", minHeight: "100vh" }}>
      <GlobalStyles />
      <Navbar />
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