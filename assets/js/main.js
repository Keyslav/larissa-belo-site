// Larissa Belo — interações
// Efeitos de scroll com referência em samanthamelendez.com:
// fade-up escalonado, clip reveal de imagens, parallax e scrollspy.

(function () {
  "use strict";

  var body = document.body;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu mobile ---------- */

  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  /* ---------- Header com sombra ao rolar ---------- */

  var header = document.querySelector(".site-header");
  function onHeaderScroll() {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll();

  /* ---------- Reveal on scroll (fade-up + clip) ---------- */

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".rv, .rv-img"));

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - 40 && rect.bottom > 0;
  }

  if (!reducedMotion && revealEls.length) {
    var pending = revealEls.slice();
    var revealObserver = null;

    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      pending.forEach(function (el) { revealObserver.observe(el); });
    } else {
      // Fallback sem IntersectionObserver: revela conforme o scroll
      var onScrollReveal = function () {
        pending = pending.filter(function (el) {
          if (isInViewport(el)) { el.classList.add("in-view"); return false; }
          return true;
        });
        if (!pending.length) window.removeEventListener("scroll", onScrollReveal);
      };
      window.addEventListener("scroll", onScrollReveal, { passive: true });
    }

    // Varredura inicial: garante a entrada do conteúdo acima da dobra mesmo
    // se os callbacks do observer atrasarem (aba oculta, pré-render etc.)
    setTimeout(function () {
      revealEls.forEach(function (el) {
        if (isInViewport(el)) el.classList.add("in-view");
      });
    }, 60);
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Parallax de imagens ---------- */
  // A imagem é 12% maior que a moldura; o deslocamento é proporcional à
  // posição da moldura no viewport (amplitude em % via data-parallax).

  var parallaxItems = [];
  document.querySelectorAll("[data-parallax]").forEach(function (box) {
    var img = box.querySelector("img");
    if (!img) return;
    parallaxItems.push({
      box: box,
      img: img,
      amp: parseFloat(box.getAttribute("data-parallax")) || 6,
      visible: true
    });
  });

  if (!reducedMotion && parallaxItems.length) {
    if ("IntersectionObserver" in window) {
      var parallaxObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          parallaxItems.forEach(function (item) {
            if (item.box === entry.target) item.visible = entry.isIntersecting;
          });
        });
      }, { rootMargin: "20% 0px" });
      parallaxItems.forEach(function (item) { parallaxObserver.observe(item.box); });
    }

    var ticking = false;
    function updateParallax() {
      var vh = window.innerHeight;
      parallaxItems.forEach(function (item) {
        if (!item.visible) return;
        var rect = item.box.getBoundingClientRect();
        // progresso -1 (abaixo do viewport) .. 1 (acima do viewport)
        var progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        progress = Math.max(-1, Math.min(1, progress));
        item.img.style.transform = "translateY(" + (progress * item.amp).toFixed(2) + "%)";
      });
      ticking = false;
    }
    function requestParallax() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    }
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
    updateParallax();
  }

  /* ---------- Scrollspy da navegação ---------- */

  var navLinks = document.querySelectorAll(".nav-desktop a[href^='#']");
  var spied = [];
  navLinks.forEach(function (link) {
    var section = document.querySelector(link.getAttribute("href"));
    if (section) spied.push({ link: link, section: section });
  });

  if (spied.length && "IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        spied.forEach(function (item) {
          if (item.section === entry.target && entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("active"); });
            item.link.classList.add("active");
          }
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    spied.forEach(function (item) { spyObserver.observe(item.section); });
  }

  /* ---------- Carrossel de depoimentos ---------- */

  var carousel = document.querySelector(".depo-carousel");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".depo-slide"));
    var dotsBox = carousel.querySelector(".depo-dots");
    var prevBtn = carousel.querySelector(".depo-prev");
    var nextBtn = carousel.querySelector(".depo-next");
    var current = 0;
    var timer = null;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "depo-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Depoimento " + (i + 1));
      dot.addEventListener("click", function () { goTo(i, true); });
      dotsBox.appendChild(dot);
      return dot;
    });

    function goTo(index, manual) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
      if (manual) restartTimer();
    }

    function restartTimer() {
      if (reducedMotion) return;
      if (timer) clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    }

    prevBtn.addEventListener("click", function () { goTo(current - 1, true); });
    nextBtn.addEventListener("click", function () { goTo(current + 1, true); });
    carousel.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    carousel.addEventListener("mouseleave", restartTimer);

    restartTimer();
  }
})();
