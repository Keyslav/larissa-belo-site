/* Larissa Belo — Edificar-se · V3
   Ato 1: timeline GSAP (pin+scrub via ScrollTrigger) com 6 fases —
   abstrato→humano: silhueta difusa ganha nitidez conforme a clareza chega.
   Lenis (smooth), anime.js (micro-detalhes). Fallback nativo completo:
   sem CDN o Ato fica empilhado (CSS) e os reveals usam IntersectionObserver.
   Debug determinístico: ?p=0..1 congela o progresso do Ato. */

(function () {
  "use strict";

  // WhatsApp: cole aqui a URL real (ex.: "https://wa.me/5521XXXXXXXXX")
  var WHATSAPP_URL = "";

  var html = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";
  var hasAnime = typeof window.anime !== "undefined";

  var debugMatch = location.search.match(/[?&]p=([\d.]+)/);
  var debugP = debugMatch ? Math.min(1, Math.max(0, parseFloat(debugMatch[1]))) : null;

  /* ---------- WhatsApp opcional ---------- */
  var whats = document.querySelector(".btn-whats");
  if (whats && WHATSAPP_URL) {
    whats.href = WHATSAPP_URL;
    whats.hidden = false;
    whats.target = "_blank";
    whats.rel = "noopener";
  }

  /* ---------- RNG determinístico (posições do caos) ---------- */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (hasLenis && !reduced && debugP === null) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    html.classList.add("lenis");
    // sincroniza com âncora na carga (sem isso o Lenis "devolve" ao topo)
    if (location.hash) {
      var alvoHash = null;
      try { alvoHash = document.querySelector(location.hash); } catch (e) {}
      if (alvoHash) {
        requestAnimationFrame(function () {
          lenis.scrollTo(alvoHash, { immediate: true, offset: -64 });
        });
      }
    }
  }

  /* ======================================================================
     ATO 1 — timeline
     ====================================================================== */

  var atoTL = null;

  function buildAto() {
    var W = window.innerWidth, H = window.innerHeight;
    var mobile = W < 640;
    var rnd = mulberry32(20260809);

    var tl = gsap.timeline({ paused: debugP !== null, defaults: { ease: "none" } });

    /* -- washes / vinheta / fio -- */
    tl.fromTo(".wash-caos", { opacity: 0 }, { opacity: 1, duration: 8 }, 2);
    tl.to(".wash-caos", { opacity: 0, duration: 13 }, 34);
    tl.fromTo(".wash-meio", { opacity: 0 }, { opacity: 1, duration: 13 }, 33);
    tl.to(".wash-meio", { opacity: 0, duration: 16 }, 62);
    tl.fromTo(".wash-fim", { opacity: 0 }, { opacity: 1, duration: 17 }, 61);
    tl.fromTo(".vinheta", { opacity: 1 }, { opacity: .18, duration: 55 }, 30);
    tl.fromTo(".fio span", { scaleY: 0 }, { scaleY: 1, duration: 90 }, 5);

    /* -- fase 0 (herói) -- */
    tl.to(".fase-0", { opacity: 0, y: -46, duration: 6, onStart: fase0Off, onReverseComplete: fase0On }, 8);
    function fase0Off() { document.querySelector(".fase-0").classList.remove("ativa"); }
    function fase0On() { document.querySelector(".fase-0").classList.add("ativa"); }

    function copyIn(sel, at) {
      tl.fromTo(sel, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 5 }, at);
    }
    function copyOut(sel, at) {
      tl.to(sel, { opacity: 0, y: -30, duration: 5 }, at);
    }

    /* -- fragmentos: caos → ordem → dissolvem -- */
    var frags = gsap.utils.toArray(".frag");
    var alinhaX = mobile ? -W * 0.30 : -W * 0.26;
    var alinhaY0 = -H * 0.20;
    frags.forEach(function (f, i) {
      var cx = (rnd() - 0.5) * W * 0.8;
      var cy = (rnd() - 0.5) * H * 0.66;
      var cr = (rnd() - 0.5) * 46;
      gsap.set(f, { x: cx, y: cy, rotation: cr, opacity: 0 });
      tl.to(f, { opacity: 1, duration: 4 }, 10 + (i % 6));
      // ordem: coluna alinhada à esquerda (ritmo de agenda limpa)
      var ox = alinhaX + (mobile ? 0 : (i % 2) * 10);
      var oy = alinhaY0 + i * (mobile ? 26 : 34);
      tl.to(f, { x: ox, y: oy, rotation: 0, duration: 14, ease: "power2.inOut" }, 42 + (i % 5));
      tl.to(f, { opacity: .28, duration: 6 }, 66 + (i % 4));
      tl.to(f, { opacity: 0, duration: 5 }, 76 + (i % 3));
    });

    /* -- copies das fases -- */
    copyIn(".fase-1", 15); copyOut(".fase-1", 28);
    copyIn(".fase-2", 34); copyOut(".fase-2", 46);
    copyIn(".fase-3", 50); copyOut(".fase-3", 62);
    copyIn(".fase-4", 66); copyOut(".fase-4", 76);
    copyIn(".fase-5", 83);

    /* -- silhueta: difusa → nítida (a resolução é a narrativa) -- */
    tl.fromTo(".pose-a", { opacity: 0, y: 30 }, { opacity: .55, y: 0, duration: 8 }, 12);
    tl.to(".pose-a", { opacity: 0, duration: 7 }, 35);
    tl.fromTo(".pose-b", { opacity: 0 }, { opacity: .85, duration: 8 }, 36);
    // crossfade interno: borrado → nítido
    tl.fromTo(".pose-b .g-sharp", { opacity: 0 }, { opacity: 1, duration: 14 }, 48);
    tl.to(".pose-b .g-blur", { opacity: 0, duration: 14 }, 48);
    tl.to(".pose-b", { opacity: 0, duration: 6 }, 73);
    tl.fromTo(".pose-c", { opacity: 0, scale: .96, transformOrigin: "50% 90%" }, { opacity: 1, scale: 1, duration: 8 }, 74);
    tl.set(".pose-c .g-sharp", { opacity: 1 }, 74);
    tl.fromTo(".halo", { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: 12 }, 76);
    gsap.utils.toArray(".pose-c .petalas circle").forEach(function (c, i) {
      tl.fromTo(c, { opacity: 0, y: 8 }, { opacity: .95, y: -6 - i * 3, duration: 6 }, 80 + i * 2);
    });

    /* -- agenda (linhas se desenham na organização) -- */
    tl.fromTo(".agenda", { opacity: 0 }, { opacity: mobile ? 0 : 1, duration: 4 }, 48);
    gsap.utils.toArray(".agenda-linha").forEach(function (l, i) {
      tl.fromTo(l, { strokeDashoffset: 280 }, { strokeDashoffset: 0, duration: 10 }, 49 + i * 2.4);
    });
    gsap.utils.toArray(".agenda-ponto").forEach(function (p, i) {
      tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 3 }, 56 + i * 2);
    });
    tl.to(".agenda", { opacity: 0, duration: 5 }, 68);

    /* -- partículas: peso disperso → constelação ascendente -- */
    var parts = gsap.utils.toArray(".particulas i");
    parts.forEach(function (p, i) {
      var cx = (rnd() - 0.5) * W * 0.9;
      var cy = (rnd() - 0.5) * H * 0.8;
      gsap.set(p, { x: cx, y: cy, opacity: 0 });
      tl.to(p, { opacity: .45, duration: 5 }, 12 + (i % 7));
      var ang = (i / parts.length) * Math.PI * 2;
      var rad = (mobile ? 120 : 190) + (i % 3) * 26;
      tl.to(p, {
        x: Math.cos(ang) * rad,
        y: Math.sin(ang) * rad * .5 - H * 0.12,
        duration: 20, ease: "power2.inOut"
      }, 55 + (i % 6));
      tl.to(p, { opacity: .9, duration: 8 }, 78 + (i % 5));
    });

    /* -- aviso -- */
    tl.fromTo(".ato-aviso", { opacity: 0 }, { opacity: 1, duration: 6 }, 90);

    /* alinhamento do tempo total */
    tl.to({}, { duration: 1 }, 99);

    return tl;
  }

  function initAto() {
    html.classList.add("gsap");

    if (debugP !== null) {
      html.classList.add("p-debug");
      atoTL = buildAto();
      atoTL.progress(debugP);
      return;
    }

    atoTL = buildAto();
    ScrollTrigger.create({
      trigger: ".ato-run",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      animation: atoTL
    });

    // rebuild em resize (posições dependem do viewport)
    var rTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(rTimer);
      rTimer = setTimeout(function () {
        var st = ScrollTrigger.getAll().find(function (s) { return s.trigger && s.trigger.classList.contains("ato-run"); });
        var prog = st ? st.progress : 0;
        ScrollTrigger.getAll().forEach(function (s) { s.kill(); });
        gsap.killTweensOf("*");
        atoTL = buildAto();
        ScrollTrigger.create({
          trigger: ".ato-run", start: "top top", end: "bottom bottom",
          scrub: 1.2, animation: atoTL
        });
        initReveals(true);
        initChrome();
        ScrollTrigger.refresh();
        void prog;
      }, 300);
    }, { passive: true });
  }

  /* ======================================================================
     Reveals + redes de segurança
     ====================================================================== */

  function revealAll() {
    document.querySelectorAll(".rv").forEach(function (el) { el.classList.add("vis"); });
  }

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight - 40 && r.bottom > 0;
  }

  function initReveals(rebuildOnly) {
    var els = Array.prototype.slice.call(document.querySelectorAll(".rv:not(.vis)"));
    if (!els.length) return;

    if (hasGSAP && !reduced) {
      els.forEach(function (el) {
        ScrollTrigger.create({
          trigger: el, start: "top 88%", once: true,
          onEnter: function () { el.classList.add("vis"); }
        });
      });
    } else if ("IntersectionObserver" in window && !reduced) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add("vis"); });
    }

    if (rebuildOnly) return;

    // varredura de segurança: acima da dobra + no scroll (rAF-throttled)
    setTimeout(function () {
      document.querySelectorAll(".rv:not(.vis)").forEach(function (el) {
        if (inViewport(el)) el.classList.add("vis");
      });
    }, 90);
    var tick = false;
    window.addEventListener("scroll", function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        document.querySelectorAll(".rv:not(.vis)").forEach(function (el) {
          if (inViewport(el)) el.classList.add("vis");
        });
        tick = false;
      });
    }, { passive: true });
    // se a página perder o foco, nada pode ficar invisível
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) revealAll();
    });
    // última rede: após 6s, tudo visível que já passou da dobra inicial
    setTimeout(function () {
      document.querySelectorAll(".rv:not(.vis)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("vis");
      });
    }, 6000);
  }

  /* ======================================================================
     Header + CTA fixo mobile (aparecem após o Ato)
     ====================================================================== */

  var atoRunEl = document.querySelector(".ato-run");
  function initChrome() {
    var top = document.querySelector(".top");
    var bar = document.querySelector(".cta-bar");
    function estado() {
      // header ganha fundo assim que sai do topo; CTA fixo entra após o Ato
      top.classList.toggle("on", window.scrollY > 40);
      var fimDoAto = atoRunEl.getBoundingClientRect().bottom - window.innerHeight;
      bar.classList.toggle("on", fimDoAto < 0);
    }
    window.addEventListener("scroll", estado, { passive: true });
    estado();
  }

  /* ======================================================================
     anime.js — micro-detalhes (com guarda)
     ====================================================================== */

  function initMicro() {
    if (!hasAnime || reduced) return;
    var cue = document.querySelector(".cue span");
    if (cue) {
      anime({
        targets: cue,
        scaleY: [0, 1],
        translateY: [0, 16],
        opacity: [{ value: [0, 1], duration: 700 }, { value: 0, duration: 700, delay: 700 }],
        duration: 2200,
        easing: "easeInOutQuad",
        loop: true
      });
    }
  }

  /* ======================================================================
     FAQ · âncoras · boot
     ====================================================================== */

  var faqs = document.querySelectorAll(".faq details");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var alvo = document.querySelector(id);
      if (!alvo) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(alvo, { offset: -64 });
      else alvo.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  });

  if (hasGSAP && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    initAto();
  }
  // sem GSAP (ou com reduced-motion): o CSS mantém o Ato empilhado e legível

  initReveals(false);
  initChrome();
  initMicro();
  if (reduced) revealAll();
})();
