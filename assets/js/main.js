/* Larissa Belo — V3
   JavaScript vanilla, sem dependências. Tudo que este arquivo faz é
   enriquecimento: se ele falhar ou nunca rodar, o CSS mantém a página
   inteira legível (os estados iniciais invisíveis vivem sob html.js).
   Depuração: ?p=0..1 congela a seção de reorganização.  Ver SPEC-V3.md §5–§6 */

(function () {
  "use strict";

  /* Cole aqui a URL real para exibir o botão do WhatsApp.
     Ex.: var WHATSAPP_URL = "https://wa.me/5521999999999"; */
  var WHATSAPP_URL = "";

  var html = document.documentElement;
  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var mDebug = location.search.match(/[?&]p=([\d.]+)/);
  var pDebug = mDebug ? Math.min(1, Math.max(0, parseFloat(mDebug[1]))) : null;
  if (pDebug !== null) html.classList.add("p-debug");

  /* ---------- utilitários ---------- */

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  // progresso suavizado dentro de uma janela [a,b]
  function janela(p, a, b) {
    var t = clamp01((p - a) / (b - a));
    return t * t * (3 - 2 * t);
  }
  function semente(s) {
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function noViewport(el, folga) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight - (folga || 40) && r.bottom > 0;
  }
  // agenda uma função para o próximo quadro, no máximo uma vez por quadro
  function porQuadro(fn) {
    var agendado = false;
    return function () {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(function () { agendado = false; fn(); });
    };
  }

  /* ---------- WhatsApp (só aparece com número real) ---------- */

  var whats = document.querySelector(".btn-whats");
  if (whats && WHATSAPP_URL) {
    whats.href = WHATSAPP_URL;
    whats.target = "_blank";
    whats.rel = "noopener";
    whats.hidden = false;
  }

  /* ======================================================================
     Revelações — com as seis redes de segurança da spec §6
     ====================================================================== */

  function revelarTudo() {
    var todos = document.querySelectorAll(".rv, .rvi");
    for (var i = 0; i < todos.length; i++) todos[i].classList.add("vis");
  }

  function iniciarRevelacoes() {
    if (reduzido) { revelarTudo(); return; }

    var alvos = Array.prototype.slice.call(document.querySelectorAll(".rv, .rvi"));
    if (!alvos.length) return;

    var obs = null;
    function marcar(el) {
      el.classList.add("vis");
      if (obs) obs.unobserve(el);
    }

    // 1 · mecanismo principal
    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver(function (entradas) {
        for (var i = 0; i < entradas.length; i++) {
          if (entradas[i].isIntersecting) marcar(entradas[i].target);
        }
      }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
      alvos.forEach(function (el) { obs.observe(el); });
    }

    // 2 · varredura no scroll (também cobre navegadores sem IO)
    function varrer() {
      var restantes = false;
      for (var i = 0; i < alvos.length; i++) {
        var el = alvos[i];
        if (el.classList.contains("vis")) continue;
        if (noViewport(el)) marcar(el);
        else restantes = true;
      }
      if (!restantes) window.removeEventListener("scroll", aoRolar);
    }
    var aoRolar = porQuadro(varrer);
    window.addEventListener("scroll", aoRolar, { passive: true });

    // 3 · varredura inicial (conteúdo acima da dobra)
    setTimeout(varrer, 80);
    // 4 · timeouts escalonados
    setTimeout(varrer, 400);
    setTimeout(varrer, 1200);
    setTimeout(varrer, 2600);
    // 5 · se a página perder o foco, nada pode ficar invisível
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) revelarTudo();
    });
    // 6 · a guarda no-JS é a classe html.js, adicionada no <head>
  }

  /* ======================================================================
     Parallax das fotografias
     ====================================================================== */

  function iniciarParallax() {
    if (reduzido) return;
    var itens = [];
    document.querySelectorAll("[data-plx]").forEach(function (moldura) {
      var img = moldura.querySelector("img");
      if (!img) return;
      itens.push({
        moldura: moldura,
        img: img,
        amp: parseFloat(moldura.getAttribute("data-plx")) || 6,
        visivel: true
      });
    });
    if (!itens.length) return;

    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          itens.forEach(function (it) {
            if (it.moldura === e.target) it.visivel = e.isIntersecting;
          });
        });
      }, { rootMargin: "20% 0px" });
      itens.forEach(function (it) { obs.observe(it.moldura); });
    }

    function pintar() {
      var vh = window.innerHeight;
      itens.forEach(function (it) {
        if (!it.visivel) return;
        var r = it.moldura.getBoundingClientRect();
        var prog = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        prog = Math.max(-1, Math.min(1, prog));
        it.img.style.transform = "translateY(" + (prog * it.amp).toFixed(2) + "%)";
      });
    }
    var agendar = porQuadro(pintar);
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar, { passive: true });
    pintar();
  }

  /* ======================================================================
     A reorganização (spec §5)
     Fragmentos da rotina saem da desordem, alinham-se em coluna e abrem
     espaço no centro para o manifesto. Progresso derivado da posição da
     pista — rolar para cima reverte naturalmente.
     ====================================================================== */

  function iniciarReorg() {
    var pista = document.querySelector(".reorg-pista");
    var palco = document.querySelector(".reorg-palco");
    if (!pista || !palco || reduzido) return;

    var frags = Array.prototype.slice.call(palco.querySelectorAll(".frag"));
    var fundo = palco.querySelector(".reorg-fundo");
    var textoA = palco.querySelector(".rt-a");
    var textoB = palco.querySelector(".rt-b");
    var textoC = palco.querySelector(".rt-c");
    if (!frags.length) return;

    var layout = [];
    var visivel = true;

    function medir() {
      var w = palco.clientWidth || window.innerWidth;
      var h = palco.clientHeight || window.innerHeight;
      var estreito = w < 720;
      var rnd = semente(20260809);
      var passo = estreito ? 30 : 34;
      // vão central reservado ao texto: a coluna se forma JÁ aberta, metade
      // acima e metade abaixo, para nunca colidir com o que se está lendo
      var vao = estreito ? 150 : 190;
      var n = frags.length;
      var metade = n / 2;

      layout = frags.map(function (el, i) {
        var caos = {
          x: (rnd() - 0.5) * w * (estreito ? 0.72 : 0.78),
          y: (rnd() - 0.5) * h * 0.62,
          r: (rnd() - 0.5) * 50
        };
        var y = i < metade
          ? -(vao + (metade - 1 - i) * passo)
          :  (vao + (i - metade) * passo);
        return {
          el: el,
          caos: caos,
          ordem: { x: 0, y: y },
          prio: el.classList.contains("frag-prio"),
          atraso: i * 0.012
        };
      });
    }

    function pintar(p) {
      var entrada = janela(p, 0.02, 0.12);
      var esmaecer = janela(p, 0.62, 0.80);

      layout.forEach(function (f) {
        var t = janela(p, 0.26 + f.atraso, 0.58 + f.atraso);
        var x = lerp(f.caos.x, f.ordem.x, t);
        var y = lerp(f.caos.y, f.ordem.y, t);
        var r = lerp(f.caos.r, 0, t);
        f.el.style.transform =
          "translate3d(calc(-50% + " + x.toFixed(1) + "px), calc(-50% + " + y.toFixed(1) + "px), 0) rotate(" + r.toFixed(1) + "deg)";
        var op = f.prio ? 1 : lerp(1, 0.15, esmaecer);
        f.el.style.opacity = (entrada * op).toFixed(3);
      });

      // as prioridades ganham cor quando a escolha acontece
      palco.classList.toggle("escolhido", p > 0.66);

      if (fundo) fundo.style.opacity = janela(p, 0.50, 0.90).toFixed(3);
      if (textoA) textoA.style.opacity = (1 - janela(p, 0.28, 0.36)).toFixed(3);
      if (textoB) textoB.style.opacity = (janela(p, 0.36, 0.44) * (1 - janela(p, 0.58, 0.66))).toFixed(3);
      if (textoC) textoC.style.opacity = janela(p, 0.68, 0.78).toFixed(3);
    }

    function progresso() {
      var r = pista.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      return total > 0 ? clamp01(-r.top / total) : 0;
    }

    medir();

    if (pDebug !== null) {
      pintar(pDebug);
      html.setAttribute("data-reorg", pDebug);
      return;
    }

    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (es) {
        visivel = es[0].isIntersecting;
        // will-change só enquanto a seção está em jogo
        frags.forEach(function (el) { el.style.willChange = visivel ? "transform, opacity" : "auto"; });
      }, { rootMargin: "20% 0px" });
      obs.observe(pista);
    }

    function atualizar() { if (visivel) pintar(progresso()); }
    var agendar = porQuadro(atualizar);
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", function () { medir(); agendar(); }, { passive: true });
    pintar(progresso());
  }

  /* ======================================================================
     Header, CTA fixo, FAQ, âncoras
     ====================================================================== */

  function iniciarCromo() {
    var topo = document.querySelector(".topo");
    var ctaFixo = document.querySelector(".cta-fixo");
    var hero = document.querySelector(".hero");

    function estado() {
      if (topo) topo.classList.toggle("rolou", window.scrollY > 30);
      if (ctaFixo && hero) {
        var fim = hero.getBoundingClientRect().bottom;
        ctaFixo.classList.toggle("on", fim < 0);
      }
    }
    var agendar = porQuadro(estado);
    window.addEventListener("scroll", agendar, { passive: true });
    estado();
  }

  function iniciarFaq() {
    var itens = document.querySelectorAll(".faq details");
    itens.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        itens.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  function iniciarAncoras() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var alvo = document.querySelector(id);
        if (!alvo) return;
        e.preventDefault();
        alvo.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
      });
    });
  }

  /* ---------- boot ---------- */

  iniciarRevelacoes();
  iniciarParallax();
  iniciarReorg();
  iniciarCromo();
  iniciarFaq();
  iniciarAncoras();
})();
