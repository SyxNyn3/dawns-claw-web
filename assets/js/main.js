/* ============================================================
   DAWNS TALON — interaction engine
   Modules: reveal, mega-nav, custom cursor, page wipes,
   ops-mode toggle, live clock, typewriter, parallax,
   magnetic hover, canvas contours
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Reveal on scroll (.reveal + .reveal-wipe) ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-wipe");
  if ("IntersectionObserver" in window && revealEls.length && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mega navigation ---------- */
  var btn = document.getElementById("menuBtn");
  var mega = document.getElementById("megaNav");
  var megaClose = document.getElementById("megaClose");
  function setMega(open) {
    if (!mega) return;
    mega.classList.toggle("open", open);
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (btn) btn.addEventListener("click", function () { setMega(!(mega && mega.classList.contains("open"))); });
  if (megaClose) megaClose.addEventListener("click", function () { setMega(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMega(false);
  });

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add("has-cursor");

    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + (mx - 3) + "px," + (my - 3) + "px)";
    });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + (rx - ring.offsetWidth / 2) + "px," + (ry - ring.offsetHeight / 2) + "px)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a, button, .role-card, .track-btn, label").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-hover"); });
    });
  }

  /* ---------- Page transition wipe ---------- */
  var wipe = document.createElement("div");
  wipe.className = "page-wipe";
  wipe.innerHTML = '<div class="pw-layer pw-ink"></div><div class="pw-layer pw-gold"></div>';
  document.body.appendChild(wipe);

  // entrance
  requestAnimationFrame(function () {
    wipe.classList.add("exit");
    setTimeout(function () { wipe.classList.remove("exit"); }, 700);
  });

  // intercept internal page links
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^https?:/i.test(href) || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
    if (!/\.html(\?|#|$)/.test(href)) return;
    e.preventDefault();
    setMega(false);
    if (reduceMotion) { window.location.href = href; return; }
    wipe.classList.add("enter");
    setTimeout(function () { window.location.href = href; }, 560);
  });

  /* ---------- Ops mode (dark) toggle ---------- */
  var opsBtn = document.getElementById("opsToggle");
  function setOps(on) {
    document.documentElement.classList.toggle("ops-dark", on);
    try { localStorage.setItem("dc-ops", on ? "1" : "0"); } catch (_) {}
    if (opsBtn) opsBtn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  if (opsBtn) {
    opsBtn.setAttribute("aria-pressed", document.documentElement.classList.contains("ops-dark") ? "true" : "false");
    opsBtn.addEventListener("click", function () {
      setOps(!document.documentElement.classList.contains("ops-dark"));
    });
  }

  /* ---------- Live clock (KCHS local + zulu) ---------- */
  var clocks = document.querySelectorAll("[data-clock]");
  if (clocks.length) {
    var fmtLocal = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "America/New_York" });
    var fmtZ = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
    function tick() {
      var now = new Date();
      var s = "KCHS " + fmtLocal.format(now) + " ET · " + fmtZ.format(now) + "Z";
      clocks.forEach(function (c) { c.textContent = s; });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Typewriter ---------- */
  var typers = document.querySelectorAll("[data-type]");
  if (typers.length) {
    var runType = function (el) {
      var full = el.getAttribute("data-type") || el.textContent;
      el.textContent = "";
      el.classList.add("type-caret");
      var i = 0;
      (function step() {
        el.textContent = full.slice(0, ++i);
        if (i < full.length) setTimeout(step, 26);
        else setTimeout(function () { el.classList.remove("type-caret"); }, 2200);
      })();
    };
    if ("IntersectionObserver" in window && !reduceMotion) {
      var tio = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting) { runType(e.target); tio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      typers.forEach(function (el) { tio.observe(el); });
    }
  }

  /* ---------- Photo parallax ---------- */
  var px = document.querySelectorAll("[data-parallax] img");
  if (px.length && !reduceMotion) {
    var ticking = false;
    var apply = function () {
      ticking = false;
      var vh = window.innerHeight;
      px.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height / 2 - vh / 2) / vh;   // -0.5..0.5
        img.style.transform = "scale(1.12) translateY(" + (p * 36) + "px)";
      });
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
    // give parallax imgs headroom
    px.forEach(function (img) { img.style.willChange = "transform"; });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn-gold, .btn-ghost, .btn-ghost-light").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = "translate(" + dx * 8 + "px," + dy * 6 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Canvas contours ---------- */
  document.querySelectorAll("canvas[data-contours]").forEach(function (cv) {
    var ctx = cv.getContext("2d");
    var raf = null, t = 0;
    function size() {
      cv.width = cv.offsetWidth * (window.devicePixelRatio || 1);
      cv.height = cv.offsetHeight * (window.devicePixelRatio || 1);
    }
    function draw() {
      t += 0.0035;
      ctx.clearRect(0, 0, cv.width, cv.height);
      var rows = 9;
      for (var i = 0; i < rows; i++) {
        ctx.beginPath();
        var baseY = (cv.height / (rows + 1)) * (i + 1);
        for (var x = 0; x <= cv.width; x += 8) {
          var y = baseY
            + Math.sin(x * 0.004 + t * 2 + i * 0.7) * 14
            + Math.sin(x * 0.009 - t + i) * 7;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(212,175,55," + (0.05 + i * 0.012) + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    }
    size();
    window.addEventListener("resize", size);
    if ("IntersectionObserver" in window && !reduceMotion) {
      var cio = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting && raf === null) raf = requestAnimationFrame(draw);
          else if (!e.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
        });
      });
      cio.observe(cv);
    } else if (reduceMotion) {
      // single static frame
      t = 1; draw(); cancelAnimationFrame(raf); raf = null;
    } else {
      raf = requestAnimationFrame(draw);
    }
  });
})();
