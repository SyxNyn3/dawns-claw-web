/* Dawns Claw — intake form logic */
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
      var roles = el.dataset.cert.split(" ");
      var show = roles.indexOf(role) !== -1;
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
      var r = required[i];
      if (!r.el.value.trim()) {
        err.textContent = "// " + r.msg;
        err.classList.remove("hidden");
        r.el.focus();
        return;
      }
    }

    var email = document.getElementById("email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = "// Valid email required.";
      err.classList.remove("hidden");
      return;
    }

    // Generate reference code: DC-ROLE-timestamp fragment
    var frag = Date.now().toString(36).toUpperCase().slice(-6);
    var ref = "DC-" + currentRole.toUpperCase().slice(0, 3) + "-" + frag;
    document.getElementById("refCode").textContent = ref;

    // Persist a local copy for the applicant's records
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
