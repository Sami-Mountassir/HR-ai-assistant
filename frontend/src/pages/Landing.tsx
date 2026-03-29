import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const navigate = useNavigate();
  const veilCanvasRef = useRef<HTMLCanvasElement>(null);
  const sparkCanvasRef = useRef<HTMLCanvasElement>(null);
  const handsContainerRef = useRef<HTMLDivElement>(null);
  const sparkContainerRef = useRef<HTMLDivElement>(null);
  const connectionLineRef = useRef<SVGSVGElement>(null);
  const handHumanRef = useRef<SVGSVGElement>(null);
  const handDataRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const veilThreadsRef = useRef<any[]>([]);
  const veilRipRef = useRef(0);
  const veilHealRef = useRef(0);
  const gridModeRef = useRef(false);
  const sparkActiveRef = useRef(true);
  const sparkFrameRef = useRef(0);
  const sparkParticlesRef = useRef<any[]>([]);
  const hasExplodedRef = useRef(false);

  const initVeilCanvas = useCallback(() => {
    const canvas = veilCanvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const threads: any[] = [];
    const threadCount = Math.min(1500, Math.floor(window.innerWidth * 1.2));
    for (let i = 0; i < threadCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.max(canvas.width, canvas.height) * 0.6;
      const t: any = {
        startX: canvas.width / 2 + Math.cos(angle) * radius,
        startY: canvas.height / 2 + Math.sin(angle) * radius,
        angle: angle + Math.PI + (Math.random() - 0.5) * 0.5,
        length: 50 + Math.random() * 150,
        opacity: 0.08 + Math.random() * 0.25,
        thickness: 0.5 + Math.random() * 1.5,
        hue: Math.random() > 0.5 ? '#0066B1' : '#1c69d4',
      };
      t.originalStartX = t.startX;
      t.originalStartY = t.startY;
      t.originalEndX = t.startX + Math.cos(t.angle) * t.length;
      t.originalEndY = t.startY + Math.sin(t.angle) * t.length;
      threads.push(t);
    }
    veilThreadsRef.current = threads;
  }, []);

  const drawVeil = useCallback(() => {
    const canvas = veilCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const veilRipProgress = veilRipRef.current;
    const veilHealProgress = veilHealRef.current;
    const gm = gridModeRef.current;

    veilThreadsRef.current.forEach(thread => {
      let sx = thread.originalStartX, sy = thread.originalStartY;
      let ex = thread.originalEndX, ey = thread.originalEndY;
      let opacity = thread.opacity;

      if (gm) {
        const g = veilHealProgress, gs = 80;
        const nx = Math.round(sx / gs) * gs, ny = Math.round(sy / gs) * gs;
        sx = thread.originalStartX + (nx - thread.originalStartX) * g;
        sy = thread.originalStartY + (ny - thread.originalStartY) * g;
        ex = thread.originalEndX + (nx + gs - thread.originalEndX) * g;
        ey = thread.originalEndY + (ny - thread.originalEndY) * g;
        opacity = Math.min(0.6, opacity + g * 0.2);
      } else if (veilRipProgress > 0) {
        const dist = Math.sqrt(Math.pow((sx + ex) / 2 - cx, 2) + Math.pow((sy + ey) / 2 - cy, 2));
        const maxD = Math.max(canvas.width, canvas.height) * 0.4;
        const rip = (1 - dist / maxD) * veilRipProgress * 100;
        const pa = Math.atan2((sy + ey) / 2 - cy, (sx + ex) / 2 - cx);
        sx += Math.cos(pa) * rip; sy += Math.sin(pa) * rip;
        ex += Math.cos(pa) * rip; ey += Math.sin(pa) * rip;
        opacity = Math.max(0.03, opacity - veilRipProgress * 0.15);
      }

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = thread.hue;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = thread.thickness;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }, []);

  const initSparkCanvas = useCallback(() => {
    const canvas = sparkCanvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.height = 60;
    const particles: any[] = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: 30, y: 30,
        radius: Math.max(0.5, 1 + Math.random() * 2),
        angle: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.4,
        distance: Math.max(1, 5 + Math.random() * 15),
        opacity: 0.4 + Math.random() * 0.5,
      });
    }
    sparkParticlesRef.current = particles;
  }, []);

  const drawSpark = useCallback(() => {
    if (!sparkActiveRef.current) return;
    const canvas = sparkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 60, 60);
    sparkFrameRef.current++;
    const frame = sparkFrameRef.current;
    const pulse = 1 + Math.sin(frame * 0.03) * 0.1;
    const cg = ctx.createRadialGradient(30, 30, 0, 30, 30, 15 * pulse);
    cg.addColorStop(0, 'rgba(14,240,173,0.7)');
    cg.addColorStop(0.5, 'rgba(14,240,173,0.25)');
    cg.addColorStop(1, 'rgba(14,240,173,0)');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(30, 30, 15, 0, Math.PI * 2); ctx.fill();

    sparkParticlesRef.current.forEach(p => {
      const a = p.angle + frame * 0.015 * p.speed;
      const w = Math.sin(frame * 0.04 + p.distance) * 2;
      ctx.beginPath();
      ctx.arc(30 + Math.cos(a) * (p.distance + w), 30 + Math.sin(a) * (p.distance + w), p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(14,240,173,${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(drawSpark);
  }, []);

  const createExplosion = useCallback(() => {
    const container = handsContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.style.cssText = `position:fixed;width:4px;height:4px;border-radius:50%;background:#0ef0ad;pointer-events:none;z-index:100;box-shadow:0 0 10px #0ef0ad,0 0 20px #0ef0ad;`;
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 250;
      gsap.set(p, { x: cx, y: cy, opacity: 1 });
      gsap.to(p, {
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance + 180,
        opacity: 0, scale: 0,
        duration: 0.8 + Math.random() * 0.8,
        ease: 'power2.out',
        onComplete: () => p.remove(),
      });
    }
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initVeilCanvas();
    initSparkCanvas();
    if (!prefersReduced) drawSpark();
    drawVeil();

    // Reveal text animations
    const revealEls = containerRef.current?.querySelectorAll('.reveal-text') || [];
    revealEls.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1, y: 0,
        duration: prefersReduced ? 0.01 : 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el as Element, start: 'top 88%', toggleActions: 'play none none reverse' },
        delay: prefersReduced ? 0 : (i % 4) * 0.08,
      });
    });

    // Spark toggle on hero leave/enter
    ScrollTrigger.create({
      trigger: '#hero',
      onLeave: () => { sparkActiveRef.current = false; },
      onEnterBack: () => {
        if (!prefersReduced) { sparkActiveRef.current = true; drawSpark(); }
      },
    });

    // Hand animations
    if (!prefersReduced && handHumanRef.current && handDataRef.current) {
      gsap.to(handHumanRef.current, { x: 70, ease: 'none', scrollTrigger: { trigger: '#problem', start: 'top bottom', end: 'top center', scrub: 1 } });
      gsap.to(handDataRef.current, { x: -70, ease: 'none', scrollTrigger: { trigger: '#problem', start: 'top bottom', end: 'top center', scrub: 1 } });

      if (connectionLineRef.current) {
        const line = connectionLineRef.current.querySelector('line');
        if (line) {
          gsap.fromTo(line, { attr: { 'stroke-dashoffset': 200 } }, {
            attr: { 'stroke-dashoffset': 0 }, duration: 2.5, ease: 'power2.inOut',
            scrollTrigger: { trigger: '#hero', start: 'top 60%', end: 'top 20%', scrub: 1 },
          });
        }
        gsap.to(connectionLineRef.current, { opacity: 0.5, scrollTrigger: { trigger: '#hero', start: 'top center', end: 'bottom center', scrub: 1 } });
      }
    }

    // Veil rip
    ScrollTrigger.create({
      trigger: '#problem', start: 'top 80%', end: 'top 20%', scrub: 1,
      onUpdate: (self) => { veilRipRef.current = self.progress; drawVeil(); },
    });

    // Explosion
    ScrollTrigger.create({
      trigger: '#problem', start: 'top 50%',
      onEnter: () => {
        if (!hasExplodedRef.current && !prefersReduced) {
          hasExplodedRef.current = true;
          sparkActiveRef.current = false;
          if (sparkContainerRef.current) sparkContainerRef.current.style.opacity = '0';
          createExplosion();
        }
      },
    });

    // Grid mode / heal
    ScrollTrigger.create({
      trigger: '#solution', start: 'top 80%', end: 'top 30%', scrub: 1,
      onEnter: () => { gridModeRef.current = true; },
      onLeaveBack: () => { gridModeRef.current = false; },
      onUpdate: (self) => { veilHealRef.current = self.progress; drawVeil(); },
    });

    // Mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReduced || !handsContainerRef.current) return;
      const mx = (e.clientX / window.innerWidth - 0.5) * 15;
      const my = (e.clientY / window.innerHeight - 0.5) * 15;
      gsap.to(handsContainerRef.current, { x: mx, y: my, duration: 0.5, ease: 'power2.out' });
    };
    document.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => { initVeilCanvas(); drawVeil(); };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [initVeilCanvas, initSparkCanvas, drawSpark, drawVeil, createExplosion]);

  return (
    <div ref={containerRef} className="min-h-screen overflow-y-auto">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Ambient light blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[700px] h-[700px] -top-[200px] -left-[150px]" style={{ background: 'radial-gradient(circle, rgba(0,102,177,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute w-[500px] h-[500px] top-[10%] -right-[100px]" style={{ background: 'radial-gradient(circle, rgba(14,240,173,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute w-[800px] h-[400px] -bottom-[100px] left-1/2 -translate-x-1/2" style={{ background: 'radial-gradient(ellipse, rgba(0,102,177,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute w-[400px] h-[400px] top-[55%] left-[30%]" style={{ background: 'radial-gradient(circle, rgba(0,102,177,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* BMW Roundel Watermark */}
      <svg
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-[0.06] pointer-events-none z-0"
        viewBox="0 0 100 100" fill="none"
        style={{ animation: 'slowRotate 120s linear infinite' }}
      >
        <circle cx="50" cy="50" r="48" stroke="#0066B1" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="44" stroke="#0066B1" strokeWidth="1" />
        <circle cx="50" cy="50" r="40" stroke="#0066B1" strokeWidth="0.5" />
        <path d="M50 10 A40 40 0 0 1 90 50 L50 50 Z" fill="#0ef0ad" opacity="0.3" />
        <path d="M50 90 A40 40 0 0 1 10 50 L50 50 Z" fill="#0ef0ad" opacity="0.3" />
        <path d="M50 10 A40 40 0 0 0 10 50 L50 50 Z" fill="#0066B1" opacity="0.3" />
        <path d="M50 90 A40 40 0 0 0 90 50 L50 50 Z" fill="#0066B1" opacity="0.3" />
      </svg>

      {/* Veil Canvas */}
      <canvas ref={veilCanvasRef} className="fixed top-0 left-0 w-full h-full z-[1] pointer-events-none" />

      {/* Hands Container */}
      <div ref={handsContainerRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] pointer-events-none hidden lg:block">
        <svg ref={handHumanRef} className="absolute w-[120px] h-[180px]" style={{ left: -140, top: '50%', transform: 'translateY(-50%)' }} viewBox="0 0 120 180" fill="none">
          <defs>
            <linearGradient id="humanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a2035" />
              <stop offset="100%" stopColor="#0a0e1a" />
            </linearGradient>
          </defs>
          <path d="M60 180 L60 120 Q30 110 25 80 L25 60 Q25 50 35 50 Q45 50 45 60 L45 80 L45 40 Q45 30 55 30 Q65 30 65 40 L65 75 L65 30 Q65 20 75 20 Q85 20 85 30 L85 75 L85 45 Q85 35 95 35 Q105 35 105 45 L105 90 Q105 120 80 130 L80 180"
            fill="url(#humanGrad)" stroke="rgba(0,102,177,0.3)" strokeWidth="1" />
          <circle cx="35" cy="65" r="3" fill="#0066B1" opacity="0.5" />
          <circle cx="55" cy="45" r="2" fill="#0066B1" opacity="0.4" />
          <circle cx="75" cy="35" r="2.5" fill="#0066B1" opacity="0.5" />
          <circle cx="95" cy="50" r="2" fill="#0066B1" opacity="0.4" />
        </svg>

        <div ref={sparkContainerRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px]">
          <canvas ref={sparkCanvasRef} className="w-full h-full" />
        </div>

        <svg ref={connectionLineRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-1 z-[4] pointer-events-none opacity-0" >
          <line x1="0" y1="0" x2="100%" y2="0" stroke="#0ef0ad" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" />
        </svg>

        <svg ref={handDataRef} className="absolute w-[120px] h-[180px]" style={{ right: -140, top: '50%', transform: 'translateY(-50%)' }} viewBox="0 0 120 180" fill="none">
          <defs>
            <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,102,177,0.8)" />
              <stop offset="50%" stopColor="rgba(28,105,212,0.6)" />
              <stop offset="100%" stopColor="rgba(14,240,173,0.4)" />
            </linearGradient>
          </defs>
          <path d="M60 180 L60 120 Q90 110 95 80 L95 60 Q95 50 85 50 Q75 50 75 60 L75 80 L75 40 Q75 30 65 30 Q55 30 55 40 L55 75 L55 30 Q55 20 45 20 Q35 20 35 30 L35 75 L35 45 Q35 35 25 35 Q15 35 15 45 L15 90 Q15 120 40 130 L40 180"
            fill="none" stroke="url(#dataGrad)" strokeWidth="2" strokeDasharray="4 2" />
          <circle cx="85" cy="65" r="2" fill="#0ef0ad"><animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" /></circle>
          <circle cx="65" cy="45" r="1.5" fill="#1c69d4"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" /></circle>
          <circle cx="45" cy="35" r="2" fill="#0ef0ad"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" /></circle>
          <circle cx="25" cy="50" r="1.5" fill="#1c69d4"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.2s" repeatCount="indefinite" /></circle>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative z-10" id="hero">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="reveal-text opacity-0 translate-y-10 font-mono text-xs uppercase tracking-[0.2em] text-primary mb-5">
                Leadership Intelligence Platform
              </p>
              <div className="reveal-text opacity-0 translate-y-10 hidden lg:block mb-5" style={{ width: 48, height: 1, background: 'linear-gradient(90deg, #0ef0ad, transparent)' }} />
              <h1 className="reveal-text opacity-0 translate-y-10 font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] mb-8" style={{ letterSpacing: '-0.035em' }}>
                <span className="block">Where Intuition</span>
                <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#0066B1] to-[#0ef0ad]">
                  Meets Intelligence
                </span>
              </h1>
              <p className="reveal-text opacity-0 translate-y-10 text-lg text-muted-foreground max-w-xl mb-8" style={{ lineHeight: 1.65 }}>
                Ask anything about your team — promotion readiness, retention risk, succession gaps,
                development paths — get simulation-backed answers in seconds.
              </p>
              <button
                onClick={() => navigate("/chat")}
                className="reveal-text opacity-0 translate-y-10 btn-primary-landing relative overflow-hidden px-8 py-4 rounded-lg font-semibold text-foreground transition-all duration-300
                  bg-gradient-to-br from-primary to-bmw-blue-light
                  hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(0,102,177,0.4)]"
              >
                <span className="relative z-10">Start Your First Simulation</span>
              </button>
              <p className="reveal-text opacity-0 translate-y-10 text-xs text-muted-foreground mt-3">
                No credit card • Instant access • BMW-aligned models
              </p>
            </div>

            {/* Chat Mockup */}
            <div className="reveal-text opacity-0 translate-y-10 mt-8 lg:mt-0 relative">
              <div className="absolute -inset-10 rounded-3xl z-[-1]" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,102,177,0.28) 0%, rgba(14,240,173,0.1) 40%, transparent 70%)', filter: 'blur(30px)' }} />
              <div className="glass rounded-2xl overflow-hidden border border-[rgba(28,105,212,0.3)] top-glow-border">
                <div className="px-6 py-3 flex items-center gap-3 border-b border-[rgba(28,105,212,0.2)]" style={{ background: 'rgba(0,102,177,0.08)', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)' }}>
                  <div className="w-3 h-3 rounded-full bg-accent" style={{ boxShadow: '0 0 8px #0ef0ad' }} />
                  <span className="text-sm font-medium text-foreground">BMW AI HR Assistant</span>
                  <div className="ml-auto flex gap-1.5">
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary opacity-50" />)}
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-[rgba(0,102,177,0.15)] rounded-2xl rounded-tr-none px-5 py-3 text-sm text-foreground">
                      Who in Production is ready for promotion next quarter?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[85%] bg-gradient-to-r from-[rgba(0,102,177,0.1)] to-[rgba(14,240,173,0.05)] rounded-2xl rounded-tl-none px-5 py-4 border border-[rgba(28,105,212,0.2)] text-sm">
                      <p className="font-medium mb-2 text-foreground">Top 3 candidates (based on 8,400+ simulations):</p>
                      <ul className="space-y-2 text-muted-foreground">
                        {[
                          { name: "Anna K.", score: "87%", note: "leadership training recommended", color: "text-accent" },
                          { name: "Marcus L.", score: "79%", note: "strong technical, needs soft skills", color: "text-[#1c69d4]" },
                          { name: "Sophie R.", score: "92%", note: "immediate promotion viable, low flight risk", color: "text-accent" },
                        ].map(c => (
                          <li key={c.name} className="flex items-start gap-2">
                            <span className={`${c.color} mt-0.5`}>●</span>
                            <span><strong className="text-foreground">{c.name}</strong> – {c.score} ({c.note})</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs font-medium text-accent">Next step: Schedule calibration meeting →</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-[rgba(28,105,212,0.2)] bg-[rgba(0,0,0,0.2)]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2 text-sm text-muted-foreground">Ask about your team...</div>
                    <button className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 py-32 md:py-48" id="problem">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <p className="reveal-text opacity-0 translate-y-10 font-mono text-xs uppercase tracking-[0.2em] text-destructive mb-5">The Challenge</p>
            <h2 className="reveal-text opacity-0 translate-y-10 font-display text-4xl md:text-5xl lg:text-6xl mb-5" style={{ letterSpacing: '-0.025em' }}>Decisions Lost in the Fog</h2>
            <p className="reveal-text opacity-0 translate-y-10 text-lg text-muted-foreground max-w-xl" style={{ lineHeight: 1.65 }}>
              Most leadership decisions lack the full context they need. The result is wasted time and unseen risk.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {[
              { number: "47", label: "hours/week lost per HR team", detail: "Searching fragmented systems for context that should be instant." },
              { number: "73%", label: "of decisions without bias review", detail: "Promotions proceed without full simulation context or bias detection." },
            ].map(s => (
              <div key={s.number} className="reveal-text opacity-0 translate-y-10 stat-card rounded-xl p-8 top-glow-border">
                <p className="font-display text-destructive opacity-90" style={{ fontSize: 'clamp(72px, 9vw, 108px)', lineHeight: 1, letterSpacing: '-0.04em' }}>{s.number}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-2.5">{s.label}</p>
                <p className="text-sm text-muted-foreground mt-2.5" style={{ lineHeight: 1.55 }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative z-10 py-32 md:py-48" id="solution">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="reveal-text opacity-0 translate-y-10 font-mono text-xs uppercase tracking-[0.2em] text-accent mb-5">The Solution</p>
            <h2 className="reveal-text opacity-0 translate-y-10 font-display text-4xl md:text-5xl lg:text-6xl mb-5">Leadership Clarity Engine</h2>
            <p className="reveal-text opacity-0 translate-y-10 text-lg text-muted-foreground max-w-xl mx-auto" style={{ lineHeight: 1.65 }}>
              A unified intelligence layer that transforms organizational chaos into crystalline insight.
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="reveal-text opacity-0 translate-y-10 rounded-3xl p-2 mb-8 relative border border-primary/30 top-glow-border" style={{ background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(20px)' }}>
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-[rgba(14,240,173,0.12)] border border-[rgba(14,240,173,0.3)] rounded-full text-xs font-medium text-accent z-10">
              Bias Detection & Explainability Built-In
            </div>
            <div className="rounded-2xl p-6 md:p-8" style={{ background: 'linear-gradient(145deg, rgba(0,102,177,0.1), rgba(14,240,173,0.05))', border: '1px solid rgba(0,102,177,0.2)' }}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[rgba(0,102,177,0.2)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <span className="font-display text-sm italic text-foreground">Leadership OS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" style={{ boxShadow: '0 0 6px #0ef0ad' }} />
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-5">
                <div className="bg-[rgba(0,102,177,0.05)] rounded-xl p-4 border border-[rgba(0,102,177,0.15)]">
                  <p className="text-xs text-muted-foreground mb-1">Decision Velocity</p>
                  <p className="text-xl font-display text-accent">+34%</p>
                  <div className="mt-2 h-8 flex items-end gap-1">
                    {[40, 55, 45, 70, 65, 90].map((h, i) => (
                      <div key={i} className={`flex-1 rounded-t ${i === 5 ? 'bg-accent' : 'bg-primary'}`} style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.4 + i * 0.1 }} />
                    ))}
                  </div>
                </div>
                <div className="bg-[rgba(0,102,177,0.05)] rounded-xl p-4 border border-[rgba(0,102,177,0.15)]">
                  <p className="text-xs text-muted-foreground mb-1">Insight Coverage</p>
                  <p className="text-xl font-display text-[#1c69d4]">94%</p>
                  <div className="mt-2 relative w-14 h-14 mx-auto">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(0,102,177,0.2)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#0ef0ad" strokeWidth="3" strokeDasharray="94 100" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div className="bg-[rgba(0,102,177,0.05)] rounded-xl p-4 border border-[rgba(0,102,177,0.15)]">
                  <p className="text-xs text-muted-foreground mb-1">Time to Decision</p>
                  <p className="text-xl font-display text-foreground">-58%</p>
                  <p className="text-xs text-accent mt-1">From 47hrs to 20hrs</p>
                </div>
              </div>
              <div className="bg-[rgba(0,0,0,0.2)] rounded-xl p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-2">Recent Intelligence</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-muted-foreground">Q4 Strategy alignment improved by</span>
                    <span className="text-accent font-medium">23%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1c69d4]" />
                    <span className="text-muted-foreground">Cross-functional visibility index:</span>
                    <span className="text-[#1c69d4] font-medium">8.7/10</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-[rgba(0,0,0,0.25)] rounded-xl p-4 text-xs">
                <p className="text-muted-foreground mb-2 font-medium">Recent Queries</p>
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Succession risk – Battery Division</span><span className="text-accent">Completed • 92% confidence</span></div>
                  <div className="flex justify-between"><span>Promotion equity audit – Munich Plant</span><span className="text-[#1c69d4]">In Progress</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal-text opacity-0 translate-y-10 text-center mb-16">
            <p className="text-sm text-muted-foreground italic font-display">
              "Reduced succession planning time by 65% — HR Director, BMW Plant Munich"
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-16">
            {[
              { title: "Unified Data Fabric", desc: "Connect every system, surface every insight.", gradient: "from-[#0066B1] to-[#1c69d4]", icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /> },
              { title: "Real-Time Intelligence", desc: "Context-aware insights delivered when needed.", gradient: "from-[#0ef0ad] to-[#0066B1]", icon: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> },
              { title: "Team Alignment", desc: "Everyone sees the same picture.", gradient: "from-[#1c69d4] to-[#0ef0ad]", icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
            ].map(f => (
              <div key={f.title} className="reveal-text opacity-0 translate-y-10 stat-card rounded-xl p-5 top-glow-border">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">{f.icon}</svg>
                </div>
                <h3 className="font-semibold text-sm mb-1 text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 md:py-48 flex items-center" id="cta">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="reveal-text opacity-0 translate-y-10 font-mono text-xs uppercase tracking-[0.2em] text-accent mb-5">Get Started</p>
          <div className="reveal-text opacity-0 translate-y-10 mx-auto mb-6" style={{ width: 48, height: 1, background: 'linear-gradient(90deg, transparent, #0ef0ad, transparent)' }} />
          <h2 className="reveal-text opacity-0 translate-y-10 font-display text-4xl md:text-5xl lg:text-6xl mb-6">Ready to See Clearly?</h2>
          <p className="reveal-text opacity-0 translate-y-10 text-lg text-muted-foreground mb-10" style={{ lineHeight: 1.65 }}>
            Join leaders who've torn through the veil and transformed their decision-making.
          </p>
          <button
            onClick={() => navigate("/chat")}
            className="reveal-text opacity-0 translate-y-10 relative overflow-hidden px-8 py-4 rounded-lg font-semibold text-foreground transition-all duration-300
              bg-gradient-to-br from-primary to-bmw-blue-light
              hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(0,102,177,0.4)]"
          >
            <span className="relative z-10">Start Simulation</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 top-glow-border">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent" />
            <span className="font-display text-sm italic text-foreground">Leadership OS</span>
          </div>
          <p className="text-xs text-muted-foreground">Transforming intuition into intelligence</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
