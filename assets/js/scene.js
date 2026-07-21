/* ==========================================================================
   Edificar Scene — metáfora procedural "caos → clareza"
   Cena pseudo-3D em canvas 2D: partículas, planos translúcidos e um fio
   dourado evoluem de dispersão para ordem conforme o progresso p ∈ [0,1].
   Determinística (RNG com semente) e função pura de (p, t) — o scroll pode
   avançar e voltar que o estado é sempre coerente.
   API: EdificarScene.init(canvas) · setProgress(p) · destroy()
   Debug: ?p=0.7 congela o progresso e o tempo (verificação headless).
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- utilitários ---------- */

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  // smoothstep numa janela [a,b] do progresso global
  function win(p, a, b) {
    var t = clamp01((p - a) / (b - a));
    return t * t * (3 - 2 * t);
  }
  function easeInOut(t) { return t * t * (3 - 2 * t); }

  /* ---------- paleta (sincronizada com o CSS) ---------- */

  var INK    = { r: 58,  g: 46,  b: 36  };   // marrom profundo
  var GOLD   = { r: 185, g: 152, b: 98  };   // dourado suave
  var ROSE   = { r: 201, g: 160, b: 145 };   // rose queimado
  var TAUPE  = { r: 138, g: 123, b: 108 };
  var CHAMP  = { r: 233, g: 220, b: 198 };   // champanhe

  function rgba(c, a) { return "rgba(" + c.r + "," + c.g + "," + c.b + "," + a + ")"; }

  /* ---------- construção do mundo (semente fixa) ---------- */

  var rnd = mulberry32(20260720);

  var NP_DESKTOP = 130, NP_MOBILE = 70;
  var particles = [];
  var planes = [];
  var threadPts = [];

  function sphereRand(radius) {
    var u = rnd() * 2 - 1, phi = rnd() * Math.PI * 2;
    var r = Math.cbrt(rnd()) * radius, s = Math.sqrt(1 - u * u);
    return { x: r * s * Math.cos(phi), y: r * u, z: r * s * Math.sin(phi) };
  }

  function buildWorld() {
    var i, n;

    // Partículas: caos = nuvem esparsa; ordem = dois anéis concêntricos
    // inclinados + coluna ascendente central (trajetória dominada)
    for (i = 0; i < NP_DESKTOP; i++) {
      var chaos = sphereRand(1.35);
      var order;
      if (i % 5 === 4) {                      // coluna central
        var h = (i / NP_DESKTOP) * 2 - 1;
        order = { x: 0.02 * Math.sin(h * 9), y: h * 0.85, z: 0.02 * Math.cos(h * 9) };
      } else {                                 // anéis
        var ring = i % 2, ang = rnd() * Math.PI * 2;
        var rad = ring ? 0.52 : 0.78, tilt = ring ? 0.35 : -0.22;
        order = {
          x: Math.cos(ang) * rad,
          y: Math.sin(ang) * rad * Math.sin(tilt) + (ring ? 0.06 : -0.04),
          z: Math.sin(ang) * rad * Math.cos(tilt)
        };
      }
      particles.push({
        chaos: chaos, order: order,
        size: 0.8 + rnd() * 2.1,
        tone: rnd(),                           // 0 taupe → 1 dourado
        phase: rnd() * Math.PI * 2,
        speed: 0.4 + rnd() * 0.9,
        settle: 0.38 + rnd() * 0.42            // início da janela de ordem
      });
    }

    // Planos translúcidos: caos = cacos espalhados e tortos;
    // ordem = pórtico de camadas centradas recuando em profundidade
    var NPl = 13;
    for (i = 0; i < NPl; i++) {
      var pc = sphereRand(1.15);
      var depth = (i / (NPl - 1)) * 1.5 - 0.35;   // -0.35 (perto) → 1.15 (fundo)
      var w = lerp(0.92, 0.34, i / (NPl - 1));
      planes.push({
        chaos: { x: pc.x * 1.25, y: pc.y * 0.9, z: pc.z },
        chaosRot: { x: (rnd() - 0.5) * 1.9, y: (rnd() - 0.5) * 2.4, z: (rnd() - 0.5) * 1.2 },
        order: { x: 0, y: lerp(-0.05, 0.1, i / (NPl - 1)), z: depth },
        orderRot: { x: 0, y: 0, z: 0 },
        w: w, h: w * 1.28,
        tone: i % 3,                           // champanhe / rose / dourado
        settle: 0.5 + (i / (NPl - 1)) * 0.3,   // encaixam do fundo para frente
        phase: rnd() * Math.PI * 2
      });
    }

    // Fio dourado: caos = pontos erráticos; ordem = curva em S ascendente
    n = 26;
    for (i = 0; i < n; i++) {
      var t = i / (n - 1);
      var pcxz = sphereRand(1.1);
      threadPts.push({
        chaos: { x: pcxz.x, y: pcxz.y, z: pcxz.z * 0.6 },
        order: {
          x: Math.sin(t * Math.PI * 1.6 - 0.4) * 0.34 * (1 - t * 0.45),
          y: lerp(-0.95, 0.95, t),
          z: Math.cos(t * Math.PI * 1.2) * 0.12
        },
        jitter: rnd() * Math.PI * 2
      });
    }
  }
  buildWorld();

  /* ---------- estado e projeção ---------- */

  var canvas, ctx, W = 0, H = 0, DPR = 1;
  var target = 0;          // progresso pedido pelo scroll
  var shown = 0;           // progresso exibido (persegue target — retorno suave)
  var rafId = null;
  var running = false;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobile = false;
  var t0 = performance.now();
  var frozenTime = null;   // modo debug

  var cam = { rotY: 0, rotX: 0, dolly: 2.6, f: 2.2 };

  function project(pt) {
    var cy = Math.cos(cam.rotY), sy = Math.sin(cam.rotY);
    var cx = Math.cos(cam.rotX), sx = Math.sin(cam.rotX);
    var x = pt.x * cy - pt.z * sy;
    var z1 = pt.x * sy + pt.z * cy;
    var y = pt.y * cx - z1 * sx;
    var z = pt.y * sx + z1 * cx + cam.dolly;
    if (z < 0.12) z = 0.12;
    var s = cam.f / z;
    var m = Math.min(W, H) * 0.5;
    return { x: W / 2 + x * s * m, y: H / 2 - y * s * m, s: s, z: z };
  }

  /* ---------- desenho ---------- */

  function drawBackground(p, light) {
    // marfim que aquece e abre conforme a clareza chega
    var top = { r: lerp(244, 250, light), g: lerp(238, 246, light), b: lerp(228, 239, light) };
    var bot = { r: lerp(232, 242, light), g: lerp(223, 234, light), b: lerp(206, 220, light) };
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, rgba(top, 1));
    g.addColorStop(1, rgba(bot, 1));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // fonte de luz central que se intensifica
    var lg = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.42, Math.max(W, H) * 0.7);
    lg.addColorStop(0, "rgba(255,250,240," + (0.25 + light * 0.45) + ")");
    lg.addColorStop(1, "rgba(255,250,240,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, W, H);

    // vinheta pesada no caos, abre na clareza
    var vAlpha = lerp(0.16, 0.05, light);
    var vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, "rgba(58,46,36,0)");
    vg.addColorStop(1, rgba(INK, vAlpha));
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  }

  function planeCorners(pl, mix, time) {
    // cantos do plano no espaço, interpolando posição e rotação caos→ordem
    var pos = {
      x: lerp(pl.chaos.x, pl.order.x, mix),
      y: lerp(pl.chaos.y, pl.order.y, mix),
      z: lerp(pl.chaos.z, pl.order.z, mix)
    };
    var chaosAmp = (1 - mix);
    pos.x += Math.sin(time * 0.4 + pl.phase) * 0.045 * chaosAmp;
    pos.y += Math.cos(time * 0.33 + pl.phase * 2) * 0.05 * chaosAmp + Math.sin(time * 0.22 + pl.phase) * 0.008;
    var rx = pl.chaosRot.x * chaosAmp, ry = pl.chaosRot.y * chaosAmp + Math.sin(time * 0.2 + pl.phase) * 0.05 * chaosAmp;
    var rz = pl.chaosRot.z * chaosAmp;
    var hw = pl.w / 2, hh = pl.h / 2;
    var base = [{ x: -hw, y: -hh }, { x: hw, y: -hh }, { x: hw, y: hh }, { x: -hw, y: hh }];
    var cxr = Math.cos(rx), sxr = Math.sin(rx);
    var cyr = Math.cos(ry), syr = Math.sin(ry);
    var czr = Math.cos(rz), szr = Math.sin(rz);
    return base.map(function (c) {
      var x = c.x * czr - c.y * szr, y = c.x * szr + c.y * czr, z = 0;
      var x2 = x * cyr + z * syr, z2 = -x * syr + z * cyr;
      var y2 = y * cxr - z2 * sxr, z3 = y * sxr + z2 * cxr;
      return { x: pos.x + x2, y: pos.y + y2, z: pos.z + z3 };
    });
  }

  function drawScene(p, time) {
    var light = win(p, 0.25, 0.95);

    drawBackground(p, light);

    // câmera: órbita lenta e contínua + dolly de aproximação
    var sway = reduced ? 0 : Math.sin(time * 0.1) * 0.02 * (1 - p * 0.6);
    cam.rotY = lerp(-0.38, 0.1, easeInOut(p)) + sway;
    cam.rotX = lerp(0.12, 0.03, p) + (reduced ? 0 : Math.cos(time * 0.08) * 0.008);
    cam.dolly = lerp(2.7, 2.1, easeInOut(p));

    var drawList = [];

    // planos
    planes.forEach(function (pl) {
      var mix = win(p, pl.settle - 0.28, pl.settle + 0.12);
      var corners = planeCorners(pl, mix, time).map(project);
      var depth = (corners[0].z + corners[2].z) / 2;
      drawList.push({ z: depth, kind: "plane", pl: pl, c: corners, mix: mix });
    });

    // partículas
    var np = mobile ? NP_MOBILE : NP_DESKTOP;
    for (var i = 0; i < np; i++) {
      var pt = particles[i];
      var mix = win(p, pt.settle - 0.3, pt.settle + 0.14);
      var chaosAmp = (1 - mix);
      var pos = {
        x: lerp(pt.chaos.x, pt.order.x, mix) + Math.sin(time * pt.speed + pt.phase) * 0.09 * chaosAmp,
        y: lerp(pt.chaos.y, pt.order.y, mix) + Math.cos(time * pt.speed * 0.8 + pt.phase) * 0.09 * chaosAmp
             + Math.sin(time * 0.3 + pt.phase) * 0.006,
        z: lerp(pt.chaos.z, pt.order.z, mix) + Math.sin(time * pt.speed * 0.6 + pt.phase * 2) * 0.07 * chaosAmp
      };
      var pr = project(pos);
      drawList.push({ z: pr.z, kind: "dot", pt: pt, pr: pr, mix: mix });
    }

    // pinta de trás para frente
    drawList.sort(function (a, b) { return b.z - a.z; });

    drawList.forEach(function (d) {
      if (d.kind === "plane") {
        var tone = d.pl.tone === 0 ? CHAMP : d.pl.tone === 1 ? ROSE : GOLD;
        var alpha = lerp(0.1, 0.16, d.mix) * lerp(0.75, 1, win(shown, 0, 0.1));
        ctx.beginPath();
        ctx.moveTo(d.c[0].x, d.c[0].y);
        for (var k = 1; k < 4; k++) ctx.lineTo(d.c[k].x, d.c[k].y);
        ctx.closePath();
        ctx.fillStyle = rgba(tone, alpha);
        ctx.fill();
        ctx.strokeStyle = rgba(GOLD, lerp(0.12, 0.3, d.mix));
        ctx.lineWidth = Math.max(0.6, 1.1 * d.c[0].s);
        ctx.stroke();
      } else {
        var c = d.pt.tone > 0.55 ? GOLD : TAUPE;
        var a = lerp(0.28, 0.6, d.mix) * clamp01(d.pr.s * 1.5);
        ctx.beginPath();
        ctx.arc(d.pr.x, d.pr.y, d.pt.size * d.pr.s * (mobile ? 2.1 : 2.6), 0, Math.PI * 2);
        ctx.fillStyle = rgba(c, a);
        ctx.fill();
      }
    });

    // fio dourado — coerência cresce com o progresso
    var coher = win(p, 0.3, 0.92);
    if (coher > 0.01) {
      var pts = threadPts.map(function (tp) {
        var chaosAmp = 1 - coher;
        var pos = {
          x: lerp(tp.chaos.x, tp.order.x, coher) + Math.sin(time * 0.5 + tp.jitter) * 0.05 * chaosAmp,
          y: lerp(tp.chaos.y, tp.order.y, coher) + Math.cos(time * 0.4 + tp.jitter) * 0.05 * chaosAmp,
          z: lerp(tp.chaos.z, tp.order.z, coher)
        };
        return project(pos);
      });
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var j = 1; j < pts.length - 1; j++) {
        var mx = (pts[j].x + pts[j + 1].x) / 2, my = (pts[j].y + pts[j + 1].y) / 2;
        ctx.quadraticCurveTo(pts[j].x, pts[j].y, mx, my);
      }
      var grad = ctx.createLinearGradient(0, H, 0, 0);
      grad.addColorStop(0, rgba(GOLD, 0.05 + coher * 0.15));
      grad.addColorStop(0.6, rgba(GOLD, 0.25 + coher * 0.5));
      grad.addColorStop(1, rgba(ROSE, 0.2 + coher * 0.3));
      ctx.strokeStyle = grad;
      ctx.lineWidth = lerp(0.8, 2.2, coher) * (W / 1200 + 0.4);
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  /* ---------- loop ---------- */

  function frame(now) {
    rafId = null;
    var time = frozenTime !== null ? frozenTime : (now - t0) / 1000;

    // o progresso exibido persegue o alvo — voltas de scroll ficam suaves
    var diff = target - shown;
    shown = Math.abs(diff) < 0.0005 ? target : shown + diff * 0.09;

    drawScene(clamp01(shown), time);

    if (running && !reduced) schedule();
  }

  function schedule() { if (rafId === null) rafId = requestAnimationFrame(frame); }

  function resize() {
    if (!canvas) return;
    DPR = Math.min(window.devicePixelRatio || 1, 1.75);
    var r = canvas.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;   // viewport oculto/colapsado
    W = Math.round(r.width);
    H = Math.round(r.height);
    mobile = W < 720;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // mudar canvas.width apaga o buffer — repinta já o estado atual,
    // sem depender do próximo requestAnimationFrame
    if (reduced) shown = target;
    var t = frozenTime !== null ? frozenTime : (performance.now() - t0) / 1000;
    drawScene(clamp01(shown), t);
  }

  /* ---------- API ---------- */

  window.EdificarScene = {
    init: function (el) {
      canvas = el;
      ctx = canvas.getContext("2d");
      resize();
      window.addEventListener("resize", resize, { passive: true });

      // modo debug determinístico: ?p=0.7 (desenho síncrono — headless não
      // garante requestAnimationFrame sob virtual time)
      var m = location.search.match(/[?&]p=([\d.]+)/);
      if (m) {
        target = shown = clamp01(parseFloat(m[1]));
        frozenTime = 12;
        drawScene(shown, frozenTime);
        document.documentElement.setAttribute("data-scene", W + "x" + H + "@" + shown);
        return;
      }
      running = true;
      if (reduced) {
        shown = target;
        schedule();
      } else {
        schedule();
      }
    },
    setProgress: function (p) {
      target = clamp01(p);
      if (reduced) { shown = target; schedule(); }
    },
    getShown: function () { return shown; },
    destroy: function () {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    }
  };
})();
