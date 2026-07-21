/* Larissa Belo — Edificar-se · orquestração
   Lenis (smooth scroll) + GSAP/ScrollTrigger (pin, scrub, reveals) sobre a
   cena procedural. Cada camada degrada com elegância: sem CDN, o sticky do
   CSS mantém o ato cinematográfico e um fallback nativo assume o progresso. */

(function () {
  "use strict";

  // WhatsApp: cole aqui a URL real (ex.: "https://wa.me/5521XXXXXXXXX")
  // para o botão "Falar com a Larissa no WhatsApp" aparecer no encerramento.
  var WHATSAPP_URL = "";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  /* ---------- WhatsApp opcional ---------- */
  var whatsBtn = document.querySelector(".btn-whats");
  if (whatsBtn && WHATSAPP_URL) {
    whatsBtn.href = WHATSAPP_URL;
    whatsBtn.hidden = false;
    whatsBtn.target = "_blank";
    whatsBtn.rel = "noopener";
  }

  /* ---------- cena ---------- */
  var canvas = document.getElementById("scene");
  var cinema = document.getElementById("cinema");
  if (canvas && window.EdificarScene) EdificarScene.init(canvas);

  function cinemaProgress() {
    var r = cinema.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }

  /* ---------- capítulos (janelas de progresso) ---------- */
  var chapters = Array.prototype.map.call(
    document.querySelectorAll(".chapter"),
    function (el) {
      var w = (el.getAttribute("data-win") || "0,1").split(",");
      return { el: el, a: parseFloat(w[0]), b: parseFloat(w[1]) };
    }
  );

  function updateChapters(p) {
    chapters.forEach(function (ch) {
      var span = ch.b - ch.a;
      var fadeIn = Math.min(span * 0.3, 0.05);
      var o;
      if (p < ch.a || p > ch.b) o = 0;
      else if (p < ch.a + fadeIn) o = (p - ch.a) / fadeIn;
      else if (p > ch.b - fadeIn) o = (ch.b - p) / fadeIn;
      else o = 1;
      // primeiro capítulo já nasce visível
      if (ch.a === 0 && p <= ch.b) o = Math.max(o, p < fadeIn ? 1 : o);
      ch.el.style.opacity = o.toFixed(3);
      ch.el.style.transform = "translateY(" + ((1 - o) * 26).toFixed(1) + "px)";
      ch.el.classList.toggle("on", o > 0.5);
    });
  }

  /* ---------- smooth scroll + scrub ---------- */
  var lenis = null;
  if (hasLenis && !reduced) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    document.documentElement.classList.add("lenis");

    // Ao abrir a página já com âncora (#faq etc.), o navegador salta mas o
    // estado interno do Lenis fica em 0 — sem esta sincronização ele
    // "devolveria" a visitante ao topo no primeiro frame.
    if (location.hash) {
      var anchorTgt = null;
      try { anchorTgt = document.querySelector(location.hash); } catch (e) {}
      if (anchorTgt) {
        requestAnimationFrame(function () {
          lenis.scrollTo(anchorTgt, { immediate: true, offset: -70 });
        });
      }
    }
  }

  function feed(p) {
    if (window.EdificarScene) EdificarScene.setProgress(p);
    updateChapters(p);
  }

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    ScrollTrigger.create({
      trigger: cinema,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: function (self) { feed(self.progress); }
    });

    // reveals editoriais
    gsap.utils.toArray(".rv").forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: function () { el.classList.add("vis"); }
      });
    });

    // parallax das fotografias
    gsap.utils.toArray(".ph[data-plx]").forEach(function (fig) {
      var img = fig.querySelector("img");
      var amp = parseFloat(fig.getAttribute("data-plx")) || 8;
      if (!img || reduced) return;
      gsap.fromTo(img,
        { yPercent: -amp },
        {
          yPercent: amp,
          ease: "none",
          scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true }
        });
    });
  } else {
    // Fallback nativo: scroll + rAF alimentam a cena; reveals via IO
    var pend = false;
    function onScroll() {
      if (pend) return;
      pend = true;
      requestAnimationFrame(function () {
        feed(cinemaProgress());
        pend = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    var rv = document.querySelectorAll(".rv");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      rv.forEach(function (el) { io.observe(el); });
    } else {
      rv.forEach(function (el) { el.classList.add("vis"); });
    }
  }

  // estado inicial + rede de segurança para elementos já visíveis
  feed(cinemaProgress());
  setTimeout(function () {
    document.querySelectorAll(".rv").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40 && r.bottom > 0) el.classList.add("vis");
    });
  }, 80);

  /* ---------- header ---------- */
  var hdr = document.querySelector(".hdr");
  function hdrState() { hdr.classList.toggle("on", window.scrollY > 40); }
  window.addEventListener("scroll", hdrState, { passive: true });
  hdrState();

  /* ---------- âncoras com Lenis ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var alvo = document.querySelector(id);
      if (!alvo) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(alvo, { offset: -70 });
      else alvo.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  });

  /* ---------- FAQ: um aberto por vez ---------- */
  var faqs = document.querySelectorAll(".faq details");
  faqs.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
})();
