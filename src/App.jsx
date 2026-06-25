import { useState, useRef, useEffect, useCallback } from "react";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

import colaKingThumb from "./assets/thumbnails/Cola king 1.png";
import stopStressingThumb from "./assets/thumbnails/Stop stressing 2.png";
import boostImmunityThumb from "./assets/thumbnails/Boost immunity 3.png";
import neverAgainThumb from "./assets/thumbnails/Never again 4.png";
import beggarMafiaThumb from "./assets/thumbnails/Beggar mafia 5.png";
import whichOneThumb from "./assets/thumbnails/which one 6.png";
import geoNetworkThumb from "./assets/thumbnails/Geo network 7.png";
import helpThumb from "./assets/thumbnails/Help 8.png";

import before1 from "./assets/Featured/Before1.png";
import after1 from "./assets/Featured/After1.png";
import before2 from "./assets/Featured/Before2.png";
import after2 from "./assets/Featured/After2.png";
import before3 from "./assets/Featured/Before3.png";
import after3 from "./assets/Featured/After3.png";
import before4 from "./assets/Featured/Before4.png";
import after4 from "./assets/Featured/After4.png";
import before5 from "./assets/Featured/Before5.png";
import after5 from "./assets/Featured/After5.png";
import before6 from "./assets/Featured/Before6.png";
import after6 from "./assets/Featured/After6.png";

/* ─────────────────────────────
   GLOBAL DESIGN SYSTEM
───────────────────────────── */
const theme = {
  bg: "#06070b",
  bgAlt: "#08090e",
  surface: "#0f1116",
  surfaceAlt: "#141823",
  text: "#f7f8fb",
  textSoft: "rgba(255,255,255,0.72)",
  textMuted: "rgba(255,255,255,0.42)",
  line: "rgba(255,255,255,0.06)",
  lineStrong: "rgba(255,255,255,0.1)",
  accent: "#2563eb",
  accentSoft: "rgba(37,99,235,0.12)",
  accentText: "#93c5fd",
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    :root {
      color-scheme: dark;
      font-synthesis: none;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; border-color: transparent; }
    html { scroll-behavior: smooth; width: 100%; border: none; outline: none; }
    body {
      background: ${theme.bg};
      color: ${theme.text};
      font-family: 'Inter', system-ui, sans-serif;
      width: 100%;
      min-height: 100vh;
      overflow-x: hidden;
      border: none;
      outline: none;
    }
    #root { width: 100%; border: none; outline: none; }
    ::selection { background: rgba(59,130,246,0.25); color: #fff; }
    ::-webkit-scrollbar { width: 4px; background: ${theme.bg}; }
    ::-webkit-scrollbar-thumb { background: #1e2030; border-radius: 999px; }

    button, a {
      -webkit-tap-highlight-color: transparent;
    }

    button:focus-visible, a:focus-visible {
      outline: 2px solid rgba(96,165,250,0.8);
      outline-offset: 3px;
    }

    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
    @keyframes heroSlideLeft {
      0%   { opacity: 0; transform: translateX(-64px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes heroSlideRight {
      0%   { opacity: 0; transform: translateX(64px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    @keyframes heroCenterIn {
      0%   { opacity: 0; transform: scale(0.97) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes scrollBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes softFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }

    @keyframes particleFall {
      0%   { transform: translateY(0) translateX(0px); }
      100% { transform: translateY(110vh) translateX(var(--drift)); }
    }

    .particle {
      position: absolute;
      border-radius: 50%;
      background: #ffffff;
      width: var(--sz);
      height: var(--sz);
      top: var(--top);
      left: var(--left);
      opacity: var(--op);
      animation: particleFall var(--dur) var(--delay) linear infinite;
      pointer-events: none;
      box-shadow: 0 0 var(--glow) rgba(255,255,255,0.5);
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `}</style>
);

/* ─────────────────────────────
   VIEWPORT + REVEAL HOOKS
───────────────────────────── */
const useViewport = () => {
  const getWidth = () => (typeof window !== "undefined" ? window.innerWidth : 1200);
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isMobile: width < 768,
    isTablet: width < 1100,
  };
};

const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const useCountUp = (target, duration = 2000, inView = false) => {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, target, duration]);

  return count;
};

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 700,
      color: "#3b82f6",
      letterSpacing: 3,
      textTransform: "uppercase",
      marginBottom: 16,
    }}
  >
    {children}
  </div>
);

const SectionHeading = ({ label, title, subtitle, center = true, titleStyle = {}, subtitleStyle = {} }) => (
  <div style={{ textAlign: center ? "center" : "left" }}>
    {label ? <SectionLabel>{label}</SectionLabel> : null}
    <h2
      style={{
        fontSize: "clamp(28px, 4vw, 54px)",
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: "-1.4px",
        marginBottom: subtitle ? 14 : 0,
        ...titleStyle,
      }}
    >
      {title}
    </h2>
    {subtitle ? (
      <p style={{ color: theme.textMuted, fontSize: 15, lineHeight: 1.7, ...subtitleStyle }}>{subtitle}</p>
    ) : null}
  </div>
);

/* ─────────────────────────────
   THUMBNAIL BUILDING BLOCKS
───────────────────────────── */
const Thumb = ({ bg1, bg2, text, accent = "#fff", size = 180, img }) => (
  <div
    style={{
      width: size,
      height: size * (9 / 16),
      background: img ? "#000" : `linear-gradient(135deg, ${bg1}, ${bg2})`,
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      overflow: "hidden",
      boxShadow: "0 12px 36px rgba(0,0,0,0.55)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    {img ? (
      <img
        src={img}
        alt={text || "Thumbnail"}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    ) : (
      <span
        style={{
          fontSize: size * 0.065,
          fontWeight: 900,
          color: accent,
          textAlign: "center",
          padding: "0 12px",
          lineHeight: 1.15,
          textShadow: "0 2px 8px rgba(0,0,0,0.45)",
        }}
      >
        {text}
      </span>
    )}
  </div>
);

const DullThumb = ({ text = "YOUR VIDEO TITLE", img }) => (
  <div
    style={{
      width: "100%",
      aspectRatio: "16/9",
      background: img ? "#000" : "linear-gradient(135deg, #141414, #1e1e1e)",
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    {img ? (
      <img src={img} alt={text} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    ) : (
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "rgba(255,255,255,0.2)",
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        {text}
      </span>
    )}
  </div>
);

const VividThumb = ({ bg1, bg2, text, accent = "#fff", img }) => (
  <div
    style={{
      width: "100%",
      aspectRatio: "16/9",
      background: img ? "#000" : `linear-gradient(135deg, ${bg1}, ${bg2})`,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    }}
  >
    {img ? (
      <img src={img} alt={text} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    ) : (
      <span
        style={{
          fontSize: 15,
          fontWeight: 900,
          color: accent,
          textAlign: "center",
          padding: "0 16px",
          textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          lineHeight: 1.15,
        }}
      >
        {text}
      </span>
    )}
  </div>
);

/* ─────────────────────────────
   BEFORE / AFTER SLIDER
───────────────────────────── */
const Slider = ({ before, after }) => {
  const [pos, setPos] = useState(45);
  const dragging = useRef(false);
  const ref = useRef(null);

  const move = useCallback((clientX) => {
    if (!dragging.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (!r.width) return;
    const next = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(100, Math.max(0, next)));
  }, []);

  const stopDragging = useCallback(() => {
    dragging.current = false;
  }, []);

  const startDragging = useCallback((e) => {
    dragging.current = true;
    // Immediately update position to where the user clicked/tapped
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    if (clientX != null) move(clientX);
  }, [move]);

  useEffect(() => {
    const mm = (e) => move(e.clientX);
    const tm = (e) => { if (e.touches?.[0]) move(e.touches[0].clientX); };

    // Any of these should immediately release the drag, no matter which
    // slider instance is currently active.
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("mousemove", mm);
    window.addEventListener("touchend", stopDragging);
    window.addEventListener("touchcancel", stopDragging);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    window.addEventListener("touchmove", tm, { passive: true });
    // Scrolling the page (e.g. moving to another card) must stop the drag too.
    window.addEventListener("scroll", stopDragging, { passive: true, capture: true });
    window.addEventListener("blur", stopDragging);

    return () => {
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("touchend", stopDragging);
      window.removeEventListener("touchcancel", stopDragging);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("scroll", stopDragging, { capture: true });
      window.removeEventListener("blur", stopDragging);
    };
  }, [move, stopDragging]);

  return (
    <div
      ref={ref}
      onMouseDown={startDragging}
      onTouchStart={startDragging}
      onMouseLeave={stopDragging}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: 14,
        overflow: "hidden",
        cursor: "ew-resize",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Base layer: AFTER image, always full size, never moves */}
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", userSelect: "none", pointerEvents: "none" }} draggable={false}>
        {after}
      </div>
      {/* Top layer: BEFORE image, clipped to reveal only up to the handle position.
          The image itself is always rendered at full size (inset:0) — only the
          clip-path changes, so the image never shifts or scales during drag. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      >
        {before}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: 2,
          background: "#fff",
          transform: "translateX(-50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#111",
            fontWeight: 900,
            boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
          }}
        >
          ⇔
        </div>
      </div>
      <span
        style={{
          position: "absolute",
          top: 10,
          left: 12,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          padding: "3px 10px",
          borderRadius: 6,
          fontSize: 9,
          fontWeight: 700,
          color: "#888",
          letterSpacing: 2,
          zIndex: 9,
        }}
      >
        BEFORE
      </span>
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          background: "rgba(37,99,235,0.9)",
          backdropFilter: "blur(8px)",
          padding: "3px 10px",
          borderRadius: 6,
          fontSize: 9,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: 2,
          zIndex: 9,
        }}
      >
        AFTER
      </span>
    </div>
  );
};

/* ─────────────────────────────
   CTA BUTTON
───────────────────────────── */
const GhostButton = ({ children, onClick, style = {}, href, variant = "primary", compact = false }) => {
  const [hovered, setHovered] = useState(false);

  const baseStyle =
    variant === "secondary"
      ? {
          background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
          color: "#fff",
          border: `1.5px solid ${hovered ? "rgba(255,255,255,0.34)" : "rgba(255,255,255,0.14)"}`,
          boxShadow: hovered ? "0 12px 28px rgba(0,0,0,0.18)" : "none",
        }
      : {
          background: hovered
            ? "linear-gradient(135deg, rgba(45,125,255,0.98), rgba(37,99,235,0.98))"
            : "linear-gradient(135deg, rgba(52,118,255,0.95), rgba(37,99,235,0.96))",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? "0 14px 32px rgba(37,99,235,0.28), inset 0 1px 0 rgba(255,255,255,0.16)"
            : "0 10px 24px rgba(37,99,235,0.16), inset 0 1px 0 rgba(255,255,255,0.08)",
        };

  const shared = {
    position: "relative",
    zIndex: 2,
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: compact ? "10px 20px" : "13px 30px",
    borderRadius: 999,
    fontWeight: variant === "secondary" ? 600 : 700,
    fontSize: compact ? 13 : 14,
    cursor: "pointer",
    textDecoration: "none",
    transition:
      "transform 0.45s cubic-bezier(.22,.61,.36,1), background 0.45s cubic-bezier(.22,.61,.36,1), border-color 0.45s cubic-bezier(.22,.61,.36,1), box-shadow 0.45s cubic-bezier(.22,.61,.36,1), filter 0.45s cubic-bezier(.22,.61,.36,1)",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
    filter: hovered ? "brightness(1.05)" : "brightness(1)",
    willChange: "transform, filter",
    backdropFilter: variant === "secondary" ? "blur(16px)" : "none",
    WebkitBackdropFilter: variant === "secondary" ? "blur(16px)" : "none",
    ...baseStyle,
    ...style,
  };

  const interactiveProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  const buttonContent = <span style={{ position: "relative", zIndex: 1 }}>{children}</span>;

  if (href) {
    return (
      <a href={href} style={{ ...shared, textDecoration: "none" }} {...interactiveProps}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} style={shared} {...interactiveProps}>
      {buttonContent}
    </button>
  );
};

/* ─────────────────────────────
   PARTICLE BACKGROUND
───────────────────────────── */
const ParticleBackground = () => {
  // Deterministic pseudo-random generator (no Math.random so SSR/re-renders stay stable)
  const seeded = (seed) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const particles = Array.from({ length: 46 }, (_, i) => {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const jitterX = (seeded(i * 3.1) - 0.5) * 9;
    const jitterY = (seeded(i * 5.7) - 0.5) * 9;
    const left = `${Math.min(97, Math.max(2, col * 13 + 4 + jitterX)).toFixed(1)}%`;
    const top = `${Math.min(94, Math.max(3, row * 16 + 6 + jitterY)).toFixed(1)}%`;
    const sz = [1, 1, 1.5, 1.5, 2, 2, 2.5, 3][i % 8] + "px";
    const op = (0.22 + seeded(i * 7.3) * 0.42).toFixed(2);
    const dur = (9 + seeded(i * 2.4) * 15).toFixed(1) + "s";
    const delay = -(seeded(i * 4.6) * 22).toFixed(1) + "s";
    const drift = (seeded(i * 6.2) > 0.5 ? "" : "-") + (6 + seeded(i * 8.8) * 14).toFixed(0) + "px";
    const glow = [2, 2, 3, 3, 4, 4, 5, 5][i % 8] + "px";
    return { left, top, sz, op, dur, delay, drift, glow };
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            "--sz": p.sz,
            "--op": p.op,
            "--dur": p.dur,
            "--delay": p.delay,
            "--drift": p.drift,
            "--glow": p.glow,
            "--top": p.top,
            "--left": p.left,
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────
   HERO
───────────────────────────── */
const Hero = ({ onScrollTo }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const { isMobile, isTablet } = useViewport();

  useEffect(() => {
    if (isMobile) return;

    const fn = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setMouse({
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [isMobile]);

  const THUMB_W = isTablet ? 220 : 290;

  const leftThumbs = [
    { bg1: "#0d0b2b", bg2: "#3d2fa0", text: "Cola King", accent: "#ffd700", img: colaKingThumb },
    { bg1: "#1a0533", bg2: "#7c3aed", text: "Stop Stressing", accent: "#f0abfc", img: stopStressingThumb },
    { bg1: "#001833", bg2: "#0052cc", text: "Boost Immunity", accent: "#93c5fd", img: boostImmunityThumb },
    { bg1: "#0a1f0a", bg2: "#166534", text: "Never Again", accent: "#86efac", img: neverAgainThumb },
  ];

  const rightThumbs = [
    { bg1: "#1c0a00", bg2: "#c2410c", text: "Beggar Mafia", accent: "#fef3c7", img: beggarMafiaThumb },
    { bg1: "#0a0a1f", bg2: "#1d4ed8", text: "Which One", accent: "#bfdbfe", img: whichOneThumb },
    { bg1: "#1a0a2e", bg2: "#6d28d9", text: "Geo Network", accent: "#e9d5ff", img: geoNetworkThumb },
    { bg1: "#0a1f10", bg2: "#065f46", text: "Help", accent: "#6ee7b7", img: helpThumb },
  ];

  return (
    <section
      ref={ref}
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        padding: isMobile ? "96px 20px 56px" : "64px 0 0",
        overflow: "hidden",
      }}
    >
      {/* Ambient radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(37,99,235,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Particle background */}
      <ParticleBackground />

      {!isMobile ? (
        <div style={{ animation: "heroSlideLeft 1.1s cubic-bezier(.16,.84,.44,1) both", flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: "0 0 0 3vw",
              transform: `perspective(1900px) rotateY(${35 + mouse.x * 7}deg) rotateX(${mouse.y * -6}deg)`,
              transition: "transform 0.15s ease-out",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            }}
          >
          {leftThumbs.map((t, i) => (
            <div
              key={i}
              style={{
                transform: `translateY(${mouse.y * (i % 2 === 0 ? -10 : 10)}px)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <Thumb {...t} size={THUMB_W} />
            </div>
          ))}
          </div>
        </div>
      ) : null}

      <div style={{ flex: 1, position: "relative", zIndex: 2, animation: "heroCenterIn 1.1s cubic-bezier(.16,.84,.44,1) both" }}>
        <div
          style={{
            textAlign: "center",
            padding: isMobile ? "0" : "0 2vw",
            transform: isMobile ? "none" : `translateY(${mouse.y * -5}px)`,
            transition: "transform 0.2s ease-out",
            maxWidth: isMobile ? 760 : 900,
            margin: "0 auto",
          }}
        >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: theme.accentSoft,
            border: "1px solid rgba(37,99,235,0.3)",
            padding: "7px 18px",
            borderRadius: 999,
            marginBottom: 30,
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: theme.accentText, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>
            YouTube Thumbnail Designer
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 4.5vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: "-0.04em",
            marginBottom: 20,
            whiteSpace: isMobile ? "normal" : "nowrap",
          }}
        >
          Thumbnail Strategy
          <br />
          <span
            style={{
              background: "linear-gradient(90deg,#3b82f6 0%,#8b5cf6 50%,#ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            that works.
          </span>
        </h1>

        <p style={{ fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.44)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
          Strategic thumbnail design for YouTube creators who want real clicks, not just pretty pictures.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: isMobile ? "wrap" : "nowrap" }}>
          <GhostButton onClick={() => onScrollTo("work")}>View My Work</GhostButton>
          <GhostButton variant="secondary" onClick={() => onScrollTo("contact")}>
            Let's Talk →
          </GhostButton>
        </div>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)", animation: "scrollBounce 2s ease-in-out infinite" }} />
        </div>
        </div>
      </div>

      {!isMobile ? (
        <div style={{ animation: "heroSlideRight 1.1s cubic-bezier(.16,.84,.44,1) both", flexShrink: 0, position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              padding: "0 3vw 0 0",
              transform: `perspective(1900px) rotateY(${-35 + mouse.x * 7}deg) rotateX(${mouse.y * -6}deg)`,
              transition: "transform 0.15s ease-out",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            }}
          >
          {rightThumbs.map((t, i) => (
            <div
              key={i}
              style={{
                transform: `translateY(${mouse.y * (i % 2 === 0 ? 10 : -10)}px)`,
                transition: "transform 0.2s ease-out",
              }}
            >
              <Thumb {...t} size={THUMB_W} />
            </div>
          ))}
          </div>
        </div>
      ) : null}
    </section>
  );
};

/* ─────────────────────────────
   INTRO
───────────────────────────── */
const statsData = [
  { target: 50,  suffix: "+",  label: "Thumbnails Delivered", duration: 1800 },
  { target: 800, suffix: "K+", label: "Thumbnail Clicks",     duration: 2000 },
  { target: 5,   suffix: "+",  label: "Creator Clients",      duration: 1200 },
];

const StatNumber = ({ target, suffix, duration, inView }) => {
  const count = useCountUp(target, duration, inView);
  return <span>{count}{suffix}</span>;
};

const Intro = () => {
  const { isMobile } = useViewport();
  const [statsHover, setStatsHover] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);

  return (
    <section
      style={{
        width: "100%",
        padding: isMobile ? "84px 20px" : "110px 8%",
        background: theme.bgAlt,
        borderTop: `1px solid ${theme.line}`,
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Stats bar */}
        <Reveal>
          <div
            ref={statsRef}
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
              maxWidth: 1100,
              margin: "0 auto 80px",
              borderRadius: 20,
              overflow: "hidden",
              background: "linear-gradient(180deg, rgba(59,130,246,0.92) 0%, rgba(37,99,235,0.88) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: statsHover
                ? "0 24px 60px rgba(37,99,235,0.18)"
                : "0 20px 50px rgba(37,99,235,0.22)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              opacity: 0.92,
              transform: statsHover ? "translateY(-3px)" : "translateY(0)",
              transition: "transform 0.35s cubic-bezier(.22,.61,.36,1), box-shadow 0.35s cubic-bezier(.22,.61,.36,1)",
            }}
            onMouseEnter={() => setStatsHover(true)}
            onMouseLeave={() => setStatsHover(false)}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.35)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 70% at 50% 0%, rgba(255,255,255,0.09), transparent 52%)", pointerEvents: "none" }} />
            {statsData.map(({ target, suffix, label, duration }, i) => (
              <div
                key={label}
                style={{
                  position: "relative",
                  zIndex: 1,
                  textAlign: "center",
                  padding: "36px 20px",
                  borderRight: !isMobile && i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  borderBottom: isMobile && i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div style={{
                  fontSize: i === 1 ? "clamp(36px,4.5vw,56px)" : "clamp(30px,4vw,48px)",
                  fontWeight: 900,
                  color: "#fff",
                  textShadow: "0 2px 18px rgba(0,0,0,0.18)",
                }}>
                  <StatNumber target={target} suffix={suffix} duration={duration} inView={statsInView} />
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", marginTop: 6, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Meet the Designer — centered, no right card */}
        <Reveal delay={0.1}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <SectionLabel>Meet the Designer</SectionLabel>
            <h2 style={{ fontSize: "clamp(34px, 4.4vw, 64px)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-1.5px", marginBottom: 28 }}>
              Yo, I'm Sandeep 👋
            </h2>
            <p style={{ fontSize: 19, color: "rgba(255,255,255,0.64)", lineHeight: 1.85, marginBottom: 18 }}>
              I help YouTube creators strategize and package their videos for clicks.
            </p>
            <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.40)", lineHeight: 1.9, marginBottom: 44, maxWidth: 620, margin: "0 auto 44px" }}>
              At <strong style={{ color: "#93c5fd" }}>VisualDives</strong>, every design is built around understanding the video, the audience, and what makes people stop scrolling and pay attention.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <GhostButton onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>My Work</GhostButton>
              <GhostButton variant="secondary" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                Let's Talk →
              </GhostButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ─────────────────────────────
   FEATURED WORK DATA
───────────────────────────── */
const workData = [
  { title: "Unknown Man + Famous Brand", niche: "Business Documentary", stat: "+18% CTR", hook: "Unknown Man + Famous Brand", b1: "#0f0c29", b2: "#302b63", text: "10 MONEY TIPS", accent: "#ffd700", dull: "10 MONEY TIPS", before: before1, after: after1 },
  { title: "Exposing the Beggar Mafia", niche: "Documentary", stat: "1.7M Views", hook: "Belief Reversal + Shock", b1: "#7f1d1d", b2: "#dc2626", text: "MY COMEBACK STORY", accent: "#fef2f2", dull: "MY STORY", before: before2, after: after2 },
  { title: "Worst Flight Experience Ever", niche: "Travel / Vlog", stat: "50K→500K (+20% CTR)", hook: "Fear + Curiosity", b1: "#1e3a5f", b2: "#2563eb", text: "LEARN THIS NOW", accent: "#dbeafe", dull: "LEARN THIS", before: before3, after: after3 },
  { title: "Boost Immunity Naturally", niche: "Health", stat: "985K Views", hook: "Healthy Foods + Doctor", b1: "#4a044e", b2: "#9333ea", text: "YOU WON'T BELIEVE 😱", accent: "#f5d0fe", dull: "YOU WON'T BELIEVE", before: before4, after: after4 },
  { title: "The Impossible Scenario", niche: "Entertainment", stat: "+15% CTR", hook: "Curiosity Trap", b1: "#14532d", b2: "#16a34a", text: "30 DAY BODY CHANGE", accent: "#dcfce7", dull: "MY FITNESS JOURNEY", before: before5, after: after5 },
  { title: "The Power Clash", niche: "Geopolitics", stat: "1.3M Views", hook: "The Conflict Escalation", b1: "#292524", b2: "#57534e", text: "THEY LIED ABOUT AI", accent: "#fef3c7", dull: "THE TRUTH ABOUT AI", before: before6, after: after6 },
];

const FeaturedWork = () => {
  const { isMobile } = useViewport();

  return (
    <section id="work" style={{ width: "100%", padding: isMobile ? "84px 20px 0" : "100px 8% 0" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 68 }}>
            <SectionLabel>Case Studies</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 12 }}>Featured Work</h2>
            <p style={{ color: theme.textMuted, fontSize: 15 }}>Drag each slider to see the transformation</p>
          </div>
        </Reveal>

        {workData.map((w, i) => (
          <div key={w.title} style={{ position: "sticky", top: isMobile ? 68 + i * 10 : 72 + i * 18, zIndex: i + 1, marginBottom: i < workData.length - 1 ? 72 : 96 }}>
            <div style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.68)" }}>
              <Slider before={<DullThumb text={w.dull} img={w.before} />} after={<VividThumb bg1={w.b1} bg2={w.b2} text={w.text} accent={w.accent} img={w.after} />} />
              <div style={{ padding: isMobile ? "18px 18px 20px" : "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 5, lineHeight: 1.3 }}>{w.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
                    Hook: <span style={{ color: "#818cf8" }}>{w.hook}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "4px 12px", borderRadius: 999 }}>{w.niche}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: 999 }}>{w.stat}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────
   HOW I WORK
───────────────────────────── */
const HowIWork = () => {
  const { isMobile, isTablet } = useViewport();
  const [activeStep, setActiveStep] = useState(null);
  const steps = [
    ["Brief", "Share your script or concept. I dive deep to capture the message and vibe."],
    ["Research", "I brainstorm 2–3 click-worthy ideas using your niche and audience psychology."],
    ["Design", "Scroll-stopping thumbnails crafted and shared in stages so you're never left guessing."],
    ["Refine", "Polish using your feedback, aiming for designs you'd double-click yourself."],
    ["Optimize", "Post-launch monitoring and A/B tests for the best possible results."],
  ];

  return (
    <section id="process" style={{ width: "100%", padding: isMobile ? "84px 20px" : "120px 8%", background: theme.bgAlt, borderTop: `1px solid ${theme.line}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 84 }}>
            <SectionLabel>The Method</SectionLabel>
            <h2 style={{ fontSize: "clamp(30px, 4.6vw, 58px)", fontWeight: 900, letterSpacing: "-1px" }}>How I Work</h2>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
            gap: isMobile ? 24 : 28,
            position: "relative",
          }}
        >
          {!isMobile && !isTablet ? (
            <div
              style={{
                position: "absolute",
                top: 34,
                left: "5%",
                right: "5%",
                height: 1,
                background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.22),rgba(59,130,246,0.22),transparent)",
                zIndex: 0,
              }}
            />
          ) : null}

          {steps.map(([title, desc], i) => {
            const active = activeStep === i;
            return (
              <div
                key={title}
                style={{
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                  padding: "20px 16px 22px",
                  borderRadius: 20,
                  background: active ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.01)",
                  border: `1px solid ${active ? "rgba(59,130,246,0.20)" : "rgba(255,255,255,0.04)"}`,
                  boxShadow: active ? "0 20px 48px rgba(0,0,0,0.22)" : "none",
                  transform: active ? "translateY(-5px)" : "translateY(0)",
                  transition: "transform 0.4s cubic-bezier(.22,.61,.36,1), box-shadow 0.4s cubic-bezier(.22,.61,.36,1), border-color 0.4s cubic-bezier(.22,.61,.36,1), background 0.4s cubic-bezier(.22,.61,.36,1)",
                }}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 19,
                    background: active ? "linear-gradient(135deg,#2f74ff,#7c3aed)" : "linear-gradient(135deg,#1e3a5f,#2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontWeight: 900,
                    fontSize: 17,
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: active ? "0 12px 32px rgba(37,99,235,0.32)" : "0 6px 20px rgba(37,99,235,0.18)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.16) 30%, transparent 60%)",
                      transform: active ? "translateX(100%) skewX(-18deg)" : "translateX(-120%) skewX(-18deg)",
                      transition: "transform 0.9s cubic-bezier(.22,.61,.36,1)",
                      pointerEvents: "none",
                    }}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>{i + 1}</span>
                </div>

                <div
                  style={{
                    width: 1,
                    height: active ? 32 : 20,
                    margin: "0 auto 16px",
                    background: active ? "linear-gradient(to bottom, rgba(59,130,246,0.9), rgba(59,130,246,0.1))" : "rgba(255,255,255,0.10)",
                    boxShadow: active ? "0 0 18px rgba(59,130,246,0.30)" : "none",
                    transition: "height 0.4s cubic-bezier(.22,.61,.36,1), box-shadow 0.4s cubic-bezier(.22,.61,.36,1), background 0.4s cubic-bezier(.22,.61,.36,1)",
                  }}
                />

                <div style={{ fontWeight: 800, fontSize: 17.5, marginBottom: 13, letterSpacing: "-0.3px" }}>{title}</div>
                <div style={{ fontSize: 14.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.8 }}>{desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────
   SERVICES
───────────────────────────── */
const MyServices = () => {
  const { isMobile } = useViewport();
  const services = [
    {
      num: "01",
      title: "Ideation & Strategy",
      desc: "I study your video concept, research your target audience, and build a click strategy before touching a pixel. Thumbnail ideas are shared as rough sketches for easy visualization and discussion.",
      icon: "💡",
      accent: "#3b82f6",
      bg: "linear-gradient(135deg,#080f1f,#0d1a30)",
    },
    {
      num: "02",
      title: "Design & Execution",
      desc: "High-quality, scroll-stopping thumbnails crafted with typography that pops, colors that contrast, and composition that guides the eye exactly where it needs to go.",
      icon: "🎨",
      accent: "#8b5cf6",
      bg: "linear-gradient(135deg,#0d0814,#18093a)",
    },
    {
      num: "03",
      title: "Performance & Optimization",
      desc: "Post-launch CTR monitoring, A/B testing support, and iterative refinement. I track how viewers respond and tweak until your numbers climb consistently.",
      icon: "📈",
      accent: "#22c55e",
      bg: "linear-gradient(135deg,#060f09,#0c1f11)",
    },
  ];

  return (
    <section id="services" style={{ width: "100%", padding: isMobile ? "84px 20px" : "110px 8%" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 76 }}>
            <SectionLabel>What I Offer</SectionLabel>
            <h2 style={{ fontSize: "clamp(30px, 4.4vw, 56px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 14 }}>My Services</h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: theme.textMuted, fontSize: 13 }}>
              <span style={{ letterSpacing: 2 }}>Scroll</span>
              <span style={{ display: "inline-block", animation: "scrollBounce 1.5s ease-in-out infinite" }}>↓</span>
            </div>
          </div>
        </Reveal>

        {services.map((s, i) => (
          <div key={s.num} style={{ position: "sticky", top: isMobile ? 68 + i * 12 : 170 + i * 30, zIndex: i + 1, marginBottom: i < services.length - 1 ? 72 : 96 }}>
            <div
              style={{
                background: s.bg,
                border: `1px solid ${s.accent}18`,
                borderRadius: 24,
                padding: isMobile ? "30px 26px" : "56px 60px",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 110px",
                gap: isMobile ? 22 : 44,
                alignItems: "center",
                boxShadow: "0 28px 70px rgba(0,0,0,0.62)",
              }}
            >
              <div>
                <div style={{ fontSize: 11.5, color: s.accent, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>{s.num}</div>
                <h3 style={{ fontSize: "clamp(24px,2.8vw,36px)", fontWeight: 900, color: "#fff", marginBottom: 20, letterSpacing: "-0.5px" }}>{s.title}</h3>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.46)", lineHeight: 1.88, maxWidth: 600 }}>{s.desc}</p>
              </div>
              <div style={{ fontSize: isMobile ? 56 : 80, textAlign: isMobile ? "left" : "center", opacity: 0.8 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────
   ABOUT
───────────────────────────── */
const About = () => {
  const { isMobile } = useViewport();

  return (
    <section id="about" style={{ width: "100%", padding: isMobile ? "84px 20px" : "120px 8%", background: theme.bgAlt, borderTop: `1px solid ${theme.line}` }}>
      <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <SectionLabel>About</SectionLabel>
          <h2 style={{ fontSize: "clamp(38px,5.6vw,80px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: 46 }}>
            Visual<span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Dives</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {[
              { t: "Yo, I'm Sandeep. I help YouTube creators strategize and package their videos for clicks.", big: true },
              { t: "At VisualDives, I focus on creating thumbnails that do more than look good. Every design is built around understanding the video, the audience, and what makes people stop scrolling and pay attention.", big: false },
              { t: "I believe great thumbnails come from a combination of strategy, psychology, and strong visual communication. That's why I spend time understanding the story, message, and viewer before jumping into design.", big: false },
              { t: "My goal is simple: create thumbnails that stand out, communicate the idea instantly, and give creators the best possible chance of earning the click.", big: false },
            ].map(({ t, big }, i) => (
              <p key={i} style={{ fontSize: big ? 20 : 16.5, fontWeight: big ? 700 : 400, color: big ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0.48)", lineHeight: 1.9, maxWidth: big ? "none" : 680, margin: "0 auto" }}>
                {t}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ─────────────────────────────
   TESTIMONIALS DATA
───────────────────────────── */
const testimonials = [
  { name: "Drew Blackston", handle: "@Drew Blackston", subs: "36.2K subs", text: "My CTR went from 2.1% to 7.8% in 3 weeks. The thumbnails don't just look good — they're engineered to get clicked. Best investment I made for my channel.", color: "#2563eb" },
  { name: "Abraham", handle: "@AbrahamThePharmacist", subs: "851K subs", text: "I was skeptical about investing in thumbnail design, but the data doesn't lie. Each redesign came with a clear strategy and the results were immediate.", color: "#7c3aed" },
  { name: "Shishir Wadhvan", handle: "@ShishirWadhvan", subs: "", text: "Working with VisualDives changed how I think about thumbnails entirely. He understand what makes people click — not just what looks pretty.", color: "#059669" },
];

const Testimonials = () => {
  const { isMobile } = useViewport();

  return (
    <section style={{ width: "100%", padding: isMobile ? "84px 20px" : "100px 8%" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <SectionLabel>Social Proof</SectionLabel>
            <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-1px" }}>
              What Creators{" "}
              <span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Say
              </span>
            </h2>
          </div>
        </Reveal>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 1, background: "linear-gradient(to bottom,transparent,rgba(59,130,246,0.25),transparent)" }} />
          {testimonials.map((t, i) => (
            <div key={t.name} style={{ position: "sticky", top: isMobile ? 68 + i * 16 : 170 + i * 30, zIndex: i + 1, marginBottom: i < testimonials.length - 1 ? 72 : 0 }}>
              <div style={{ background: "#0d1017", border: `1px solid ${theme.line}`, borderRadius: 20, padding: isMobile ? "28px 24px 28px 48px" : "34px 44px 34px 56px", boxShadow: "0 24px 60px rgba(0,0,0,0.65)", position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 9, height: 9, borderRadius: "50%", background: t.color, boxShadow: `0 0 16px ${t.color}` }} />
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>{Array(5).fill(0).map((_, j) => <span key={j} style={{ color: "#fbbf24", fontSize: 13 }}>★</span>)}</div>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.68)", lineHeight: 1.85, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17, flexShrink: 0 }}>{t.name[0]}</div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", marginTop: 3, lineHeight: 1 }}>
                      {t.handle}{t.subs ? ` · ${t.subs}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────
   FAQ
───────────────────────────── */
const faqs = [
  ["Do you guarantee a high CTR?", "No one can. But I give your content the best shot with strong ideas and high-performing design."],
  ["What's your typical turnaround time?", "Standard delivery is 48 hours. For bulk orders or rush projects, reach out and we'll work something out."],
  ["How many revisions do I get?", "Every project includes 2 rounds of revisions. The brief process ensures we're aligned from the start."],
  ["Do you help with strategy too?", "Yes! Ideation, title suggestions, and hook feedback are baked into every project."],
  ["What makes your thumbnails different?", "I design for clicks, not just looks. Every thumbnail is rooted in strategy and audience psychology."],
  ["Can I get the source PSD file?", "Yes, on request for an extra charge. Files are clean and organized."],
];

const FAQ = () => {
  const [open, setOpen] = useState(null);
  const { isMobile } = useViewport();

  return (
    <section style={{ width: "100%", padding: isMobile ? "72px 20px 96px" : "92px 8% 110px", background: theme.bgAlt, borderTop: `1px solid ${theme.line}` }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <Reveal>
          <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 58, textAlign: "center" }}>
            Most common questions.
          </h2>
        </Reveal>
        {faqs.map(([q, a], i) => (
          <div
            key={q}
            onClick={() => setOpen(open === i ? null : i)}
            style={{ borderBottom: `1px solid ${theme.line}`, padding: "24px 0", cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen(open === i ? null : i);
            }}
            aria-expanded={open === i}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 17.5, fontWeight: 600, color: open === i ? "#3b82f6" : "#fff", transition: "color 0.2s" }}>{q}</div>
              <div style={{ fontSize: 21, color: "rgba(255,255,255,0.25)", transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</div>
            </div>
            {open === i ? (
              <p style={{ marginTop: 16, color: "rgba(255,255,255,0.4)", fontSize: 16, lineHeight: 1.85, maxWidth: 760 }}>{a}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────
   CTA
───────────────────────────── */
const CTA = () => {
  const { isMobile } = useViewport();

  return (
    <section id="contact" style={{ width: "100%", padding: isMobile ? "96px 20px" : "130px 8%", textAlign: "center", position: "relative", overflow: "visible" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(37,99,235,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <Reveal style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: theme.accentSoft, border: "1px solid rgba(37,99,235,0.28)", padding: "7px 18px", borderRadius: 999, marginBottom: 28 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: theme.accentText, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase" }}>Now Taking Projects</span>
        </div>
        <h2 style={{ fontSize: "clamp(44px, 7vw, 90px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-3px", marginBottom: 20, paddingBottom: 8, overflow: "visible" }}>
          Want Better
          <br />
          <span style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block", paddingBottom: 6 }}>
            Thumbnails?
          </span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 17, marginBottom: 44 }}>Every click counts. Let's make yours.</p>
        <div style={{ position: "relative", zIndex: 2, display: "inline-block" }}>
          <GhostButton href={`mailto:sandeepxsahu@gmail.com?subject=${encodeURIComponent("Let's Work Together")}&body=${encodeURIComponent("Hi Sandeep,\n\nI found your portfolio and I'm interested in working together.\n\nHere's my channel:\n\nNiche:\n\nI'm looking for help with:\n\nLooking forward to hearing from you!\n\nBest,")}`}>Start Your Project →</GhostButton>
        </div>
        <div style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.32)" }}>
          Let's create something awesome.
        </div>
      </Reveal>
    </section>
  );
};

/* ─────────────────────────────
   EMAIL FOOTER WIDGET
───────────────────────────── */
const EmailFooter = () => {
  const [copied, setCopied] = useState(false);
  const email = "sandeepxsahu@gmail.com";

  const handleClick = (e) => {
    e.preventDefault();
    // Copy to clipboard
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      // Fallback for older browsers / mobile
      const el = document.createElement("textarea");
      el.value = email;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    // Also open mail client after brief delay so copy runs first
    setTimeout(() => {
      window.location.href = `mailto:${email}`;
    }, 120);
  };

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      title="Click to copy & open mail"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: copied ? "#3b82f6" : "rgba(255,255,255,0.45)",
        fontSize: 13,
        textDecoration: "none",
        cursor: "pointer",
        transition: "color 0.2s",
        userSelect: "none",
      }}
      onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
      onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
    >
      <span style={{ fontSize: 13 }}>{copied ? "✓ Copied!" : email}</span>
      <span style={{
        fontSize: 10,
        padding: "2px 7px",
        borderRadius: 4,
        background: copied ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${copied ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)"}`,
        color: copied ? "#3b82f6" : "rgba(255,255,255,0.28)",
        letterSpacing: 0.5,
        transition: "all 0.2s",
      }}>
        {copied ? "copied" : "copy"}
      </span>
    </a>
  );
};

/* ─────────────────────────────
   LOGO COMPONENT
───────────────────────────── */
const Logo = ({ size = 32 }) => (
  <img
    src="/Logo_VD.png"
    alt="VisualDives"
    style={{ width: size, height: size, borderRadius: 8, objectFit: "cover", display: "block" }}
  />
);

/* ─────────────────────────────
   APP ROOT
───────────────────────────── */
export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const { isMobile } = useViewport();

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <GlobalStyles />
      <div style={{ width: "100%", background: theme.bg, color: theme.text, fontFamily: "'Inter', system-ui, sans-serif", maxWidth: "100vw", border: "none", outline: "none" }}>
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: isMobile ? 66 : 68,
            padding: isMobile ? "0 20px" : "0 8%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            background: navScrolled ? "rgba(8,10,15,0.70)" : "rgba(8,10,15,0.12)",
            backdropFilter: navScrolled ? "blur(12px)" : "blur(6px)",
            borderBottom: navScrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
            transition: "all 0.35s cubic-bezier(.22,.61,.36,1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 9, flexShrink: 0 }}>
            <Logo size={isMobile ? 34 : 38} />
            <span style={{ fontWeight: 600, fontSize: isMobile ? 15 : 16, letterSpacing: 2.2, textTransform: "uppercase" }}>VisualDives</span>
          </div>

          {!isMobile ? (
            <div style={{ display: "flex", gap: 44 }}>
              {[
                ["Work", "work"],
                ["Process", "process"],
                ["About", "about"],
                ["Contact", "contact"],
              ].map(([l, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.48)", fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "color 0.2s", letterSpacing: "0.01em" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.48)")}
                >
                  {l}
                </button>
              ))}
            </div>
          ) : (
            <button type="button" onClick={() => scrollTo("contact")} style={{ background: theme.accent, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 999, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Work With Me
            </button>
          )}

          {!isMobile ? (
            <GhostButton compact={false} onClick={() => scrollTo("contact")} style={{ padding: "12px 26px", fontSize: 14 }}>
              Work With Me
            </GhostButton>
          ) : null}
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

        <footer style={{ padding: isMobile ? "40px 20px" : "56px 8%", borderTop: `1px solid ${theme.line}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Logo size={36} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>VisualDives</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>© 2026 VisualDives</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {[
                { icon: <FaInstagram size={17} />, link: "https://www.instagram.com/visualdives7/?hl=en" },
                { icon: <FaLinkedinIn size={17} />, link: "https://www.linkedin.com/in/design-by-san-%F0%9F%8E%A8-3a9b44320/" },
                { icon: <FaXTwitter size={17} />, link: "https://x.com/VisualDives" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                    transition: "all .3s cubic-bezier(.22,.61,.36,1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "rgba(37,99,235,0.45)";
                    e.currentTarget.style.background = "rgba(37,99,235,0.10)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08)";
                  }}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <EmailFooter />
          </div>
        </footer>
      </div>
    </>
  );
}
