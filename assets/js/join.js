/* Dawns Talon — intake wizard + dossier logic */
(function () {
  "use strict";

  var ROLE_LABELS = {
    mechanic: "A&P / IA Mechanic",
    pilot: "Part 107 Drone Pilot",
    apprentice: "Aerospace Apprentice",
    partner: "Infrastructure Partner"
  };

  var currentRole = "mechanic";
  var roleCards = document.querySelectorAll(".role-card");
  var certFields = document.querySelectorAll("[data-cert]");
  var form = document.getElementById("intakeForm");
  var successPanel = document.getElementById("successPanel");

  /* ---------- Role switching ---------- */
  function setRole(role) {
    currentRole = role;
    roleCards.forEach(function (card) {
      var active = card.dataset.role === role;
      card.setAttribute("aria-selected", active ? "true" : "false");
      card.style.borderColor = active ? "#1B4D3E" : "";
      card.style.boxShadow = active ? "0 0 0 1px #1B4D3E" : "";
    });
    certFields.forEach(function (el) {
      var show = el.dataset.cert.split(" ").indexOf(role) !== -1;
      el.style.display = show ? "" : "none";
      el.querySelectorAll("input, select").forEach(function (input) {
        input.disabled = !show;
      });
    });
    var sumRole = document.getElementById("sumRole");
    if (sumRole) sumRole.textContent = ROLE_LABELS[role];
  }

  roleCards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      setRole(card.dataset.role);
    });
  });
  setRole("mechanic");

  /* ---------- Live dossier summary ---------- */
  var nameInput = document.getElementById("fullName");
  var sumName = document.getElementById("sumName");
  var sumTools = document.getElementById("sumTools");
  var sumStatus = document.getElementById("sumStatus");

  function refreshSummary() {
    if (sumName) sumName.textContent = nameInput.value.trim() || "—";
    var checked = document.querySelectorAll('input[name="tools"]:checked').length;
    if (sumTools) sumTools.textContent = checked + " selected";
    var dirty = nameInput.value.trim() || checked > 0;
    if (sumStatus) {
      sumStatus.textContent = dirty ? "IN PROGRESS" : "DRAFT";
      sumStatus.style.color = dirty ? "#D4AF37" : "";
    }
  }
  form.addEventListener("input", refreshSummary);
  form.addEventListener("change", refreshSummary);

  /* ---------- Step wizard ---------- */
  var steps = Array.prototype.slice.call(form.querySelectorAll("fieldset"));
  var leftCol = steps.length ? steps[0].parentElement : null;
  var cur = 0;
  var gotoStep = null;

  if (leftCol && steps.length > 1) {
    // progress rail
    var rail = document.createElement("div");
    rail.className = "flex flex-wrap items-center gap-x-5 gap-y-3 mb-8 reveal in-view";
    rail.id = "wizRail";
    leftCol.insertBefore(rail, steps[0]);

    var dots = steps.map(function (fs, i) {
      var legend = fs.querySelector("legend");
      var label = legend ? legend.textContent.replace(/^SEC\.\s*\d+\s*—\s*/i, "").trim() : "Step " + (i + 1);
      var item = document.createElement("div");
      item.className = "flex items-center gap-2.5";
      item.innerHTML = '<span class="wiz-dot"></span><span class="font-mono text-[0.55rem] tracking-[0.22em] uppercase text-ink/45">' + label + "</span>";
      rail.appendChild(item);
      fs.classList.add("wiz-step");
      return item.querySelector(".wiz-dot");
    });

    // nav buttons
    var nav = document.createElement("div");
    nav.className = "flex flex-wrap items-center gap-4 pt-4";
    nav.innerHTML =
      '<button type="button" class="btn-ghost wiz-back"><span>← Back</span></button>' +
      '<button type="button" class="btn-gold wiz-next"><span>Continue</span><span>→</span></button>';
    leftCol.appendChild(nav);
    var backBtn = nav.querySelector(".wiz-back");
    var nextBtn = nav.querySelector(".wiz-next");

    function validStep(i) {
      var err = document.getElementById("formError");
      err.classList.add("hidden");
      var ok = true;
      steps[i].querySelectorAll("input[required], select[required]").forEach(function (f) {
        if (!f.disabled && !f.value.trim()) { ok = false; f.classList.add("!border-rose"); }
        else f.classList.remove("!border-rose");
      });
      if (!ok) {
        err.textContent = "// Complete required fields before advancing.";
        err.classList.remove("hidden");
      }
      return ok;
    }

    function setStep(i) {
      cur = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (fs, j) { fs.classList.toggle("active", j === cur); });
      dots.forEach(function (d, j) {
        d.classList.toggle("done", j < cur);
        d.classList.toggle("current", j === cur);
      });
      backBtn.style.visibility = cur === 0 ? "hidden" : "visible";
      nextBtn.querySelector("span").textContent = cur === steps.length - 1 ? "Review & Transmit" : "Continue";
      if (cur === steps.length - 1) refreshSummary();
      document.getElementById("intake").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    gotoStep = setStep;

    backBtn.addEventListener("click", function () { setStep(cur - 1); });
    nextBtn.addEventListener("click", function () {
      if (!validStep(cur)) return;
      if (cur < steps.length - 1) setStep(cur + 1);
      else if (form.requestSubmit) form.requestSubmit();
    });

    setStep(0);
  }

  /* ---------- Submission ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = document.getElementById("formError");
    err.classList.add("hidden");

    var required = [
      { el: document.getElementById("fullName"), msg: "Full legal name required." },
      { el: document.getElementById("phone"), msg: "Phone number required." },
      { el: document.getElementById("email"), msg: "Valid email required." }
    ];
    for (var i = 0; i < required.length; i++) {
      if (!required[i].el.value.trim()) {
        err.textContent = "// " + required[i].msg;
        err.classList.remove("hidden");
        if (gotoStep) {
          var fs = required[i].el.closest("fieldset");
          var idx = steps.indexOf(fs);
          if (idx >= 0) gotoStep(idx);
        }
        required[i].el.focus();
        return;
      }
    }

    var email = document.getElementById("email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = "// Valid email required.";
      err.classList.remove("hidden");
      return;
    }

    var frag = Date.now().toString(36).toUpperCase().slice(-6);
    var ref = "DT-" + currentRole.toUpperCase().slice(0, 3) + "-" + frag;
    document.getElementById("refCode").textContent = ref;

    try {
      var record = {
        ref: ref,
        role: ROLE_LABELS[currentRole],
        name: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: email,
        tools: Array.prototype.map.call(
          document.querySelectorAll('input[name="tools"]:checked'),
          function (c) { return c.value; }
        ),
        assets: document.getElementById("assets").value.trim(),
        submitted: new Date().toISOString()
      };
      var stash = JSON.parse(localStorage.getItem("dc_intakes") || "[]");
      stash.push(record);
      localStorage.setItem("dc_intakes", JSON.stringify(stash));
    } catch (_) { /* private browsing — non-fatal */ }

    form.classList.add("hidden");
    successPanel.classList.remove("hidden");
    successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
