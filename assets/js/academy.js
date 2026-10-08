/* Dawns Talon — Academy direction engine */
(function () {
  "use strict";

  var TRACKS = {
    p107: {
      title: "Part 107 Remote Pilot",
      code: "FAA 14 CFR §107",
      desc: "The commercial UAS credential — the fastest legal runway into paid drone operations. Required for every inspection sortie, survey contract, and aerial data mission Dawns Talon flies.",
      time: "4–8 weeks",
      cost: "$175 – $600",
      exam: "Unmanned Aircraft General (UAG)",
      steps: [
        "Obtain an FAA Tracking Number (FTN) through IACRA and create your pilot profile.",
        "Master the ACS knowledge domains: airspace classification, weather theory, sectional charts, loading, and emergency procedures.",
        "Schedule the UAG knowledge test at an FAA-approved testing center — 60 questions, 70% to pass, $175 fee.",
        "Complete the IACRA application and pass TSA security screening for certificate issuance.",
        "Register each aircraft over 0.55 lb through the FAA DroneZone portal.",
        "Log supervised sorties — then apply to the Dawns Talon inspection division roster."
      ],
      note: "Recurrency: the Part 107 online recurrent training must be completed every 24 calendar months to keep commercial privileges current."
    },
    ap: {
      title: "A&P Mechanic",
      code: "FAA 14 CFR §65 Subpart D",
      desc: "The Airframe & Powerplant certificate is the foundational license of American maintenance — the credential that turns labor into signed airworthiness. Two ratings, one mechanic's certificate, unlimited leverage.",
      time: "18–30 months",
      cost: "$8k – $45k",
      exam: "Written + Oral & Practical (DME)",
      steps: [
        "Choose your lane: graduate an FAA Part 147 school (e.g., Trident Technical) or document 30 months of practical experience for both ratings.",
        "Pass three knowledge tests — General, Airframe, and Powerplant — each valid for 24 months once passed.",
        "Accumulate and document hands-on competency across the full curriculum: structures, hydraulics, engines, electrical, and inspection.",
        "Sit the Oral & Practical examination with a Designated Mechanic Examiner — the true gate.",
        "Receive your mechanic certificate with A and/or P ratings; begin supervised industry practice.",
        "Build 3 years of documented experience to become eligible for Inspection Authorization."
      ],
      note: "Part 147 completion is the strongly preferred route — military aviation maintenance experience (MOS/AFSC) can also satisfy the experience requirement via FAA Form 8610-2."
    },
    ia: {
      title: "Inspection Authorization",
      code: "FAA 14 CFR §65.91–.95",
      desc: "The IA is the apex mechanic credential — authority to approve aircraft for return to service after annual inspections and major repairs. In the Dawns Talon network, IAs are the signatories of command.",
      time: "+3 years post-A&P",
      cost: "$0 – $1.5k",
      exam: "FSDO Interview + Record Review",
      steps: [
        "Hold a current A&P certificate for a minimum of 3 years, with active engagement for the prior 2.",
        "Maintain a fixed base of operations and the equipment, facilities, and inspection data required for the ratings held.",
        "Submit FAA Form 8610-1 to your local Flight Standards District Office for eligibility review.",
        "Complete the FSDO evaluation — inspectors review experience depth, documentation discipline, and regulatory fluency.",
        "Exercise the privilege: annual inspections, major repair/alteration approvals, and progressive inspection programs.",
        "Renew annually each March — activity, training, or refresher requirements must be documented to retain the authorization."
      ],
      note: "IA holders in the Dawns Talon network carry independent sign-off authority and command the highest contracted rates on the roster."
    },
    avionics: {
      title: "Avionics & GROL",
      code: "FCC GROL + NCATT AET",
      desc: "Modern airframes are flying networks. The FCC General Radiotelephone Operator License — paired with NCATT Aircraft Electronics Technician certification — is the credential stack for the technician who owns the wire.",
      time: "3–9 months",
      cost: "$300 – $2k",
      exam: "FCC Elements 1 & 3 + NCATT AET",
      steps: [
        "Study FCC Element 1 (marine radio law) and Element 3 (general radiotelephone theory and circuits).",
        "Pass both elements at a COLEM-recognized testing session — lifetime license, no renewal required.",
        "Add the Ship Radar Endorsement (Element 8) for radar-systems authority.",
        "Pursue the NCATT AET as the industry-recognized competency benchmark for aircraft electronics.",
        "Build bench proficiency: pitot-static test sets, transponder ramp testers, wiring repair, and EFIS/EICAS diagnostics.",
        "Pair with an A&P or repair-station affiliation — avionics sign-off authority rides on the station's certificate."
      ],
      note: "The GROL requires no prior experience and never expires — it is the highest value-per-hour credential in this entire catalog."
    },
    mgmt: {
      title: "Aerospace Management",
      code: "Ops / Program Track",
      desc: "Not every commander holds a wrench. This track develops the operational layer — dispatch, compliance coordination, program management, and the audit discipline that government contracting demands.",
      time: "6–24 months",
      cost: "$500 – $12k",
      exam: "Portfolio + Capstone Review",
      steps: [
        "Ground yourself in FAA regulatory structure: Parts 43, 91, 135, and 145 — the legal terrain every operation crosses.",
        "Earn project-management fundamentals (CAPM or equivalent) — aerospace runs on documented process, not memory.",
        "Study maintenance records law: logbook entries, AD compliance tracking, and airworthiness documentation chains.",
        "Complete supervised rotations in dispatch coordination and vendor management within the Dawns Talon network.",
        "Build a compliance portfolio — demonstrate you can run an audit-ready operation end to end.",
        "Advance to asset command officer: managing aircraft, contractors, and client relationships under one authority."
      ],
      note: "Management track candidates who hold any technical credential (Part 107, A&P, GROL) are prioritized — credibility on the ramp is earned in both directions."
    }
  };

  var buttons = document.querySelectorAll(".track-btn");
  var panel = {
    title: document.getElementById("tpTitle"),
    code: document.getElementById("tpCode"),
    desc: document.getElementById("tpDesc"),
    time: document.getElementById("tpTime"),
    cost: document.getElementById("tpCost"),
    exam: document.getElementById("tpExam"),
    steps: document.getElementById("tpSteps"),
    note: document.getElementById("tpNote")
  };

  function render(key) {
    var t = TRACKS[key];
    if (!t) return;

    buttons.forEach(function (b) {
      var active = b.dataset.track === key;
      b.setAttribute("aria-selected", active ? "true" : "false");
      b.style.borderColor = active ? "#1B4D3E" : "";
      b.style.boxShadow = active ? "0 0 0 1px #1B4D3E" : "";
    });

    panel.title.textContent = t.title;
    panel.code.textContent = "// " + t.code;
    panel.desc.textContent = t.desc;
    panel.time.textContent = t.time;
    panel.cost.textContent = t.cost;
    panel.exam.textContent = t.exam;
    panel.note.textContent = t.note;

    panel.steps.innerHTML = "";
    t.steps.forEach(function (step, i) {
      var li = document.createElement("li");
      li.className = "flex gap-4 items-start";
      var num = document.createElement("span");
      num.className = "font-mono text-[0.6rem] text-gold tracking-widest mt-1 flex-shrink-0";
      num.textContent = String(i + 1).padStart(2, "0");
      var txt = document.createElement("p");
      txt.className = "text-sm text-ink/65 leading-relaxed";
      txt.textContent = step;
      li.appendChild(num);
      li.appendChild(txt);
      panel.steps.appendChild(li);
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      render(b.dataset.track);
    });
  });

  render("p107");

  /* ---------- Track recommender ---------- */
  var rec = document.getElementById("recommender");
  if (rec) {
    var scores, answered;
    var resetState = function () {
      scores = { p107: 0, ap: 0, ia: 0, avionics: 0, mgmt: 0 };
      answered = 0;
      rec.querySelectorAll("[data-rec-group]").forEach(function (g) { g.classList.remove("locked"); });
      rec.querySelectorAll(".rec-tile").forEach(function (t) { t.classList.remove("sel"); });
      var out = document.getElementById("recResult");
      if (out) out.classList.add("hidden");
    };
    var finish = function () {
      var best = null, bestV = -1;
      Object.keys(scores).forEach(function (k) {
        if (scores[k] > bestV) { bestV = scores[k]; best = k; }
      });
      if (!best || !TRACKS[best]) return;
      render(best);
      var out = document.getElementById("recResult");
      if (out) {
        out.querySelector("[data-rec-name]").textContent = TRACKS[best].title;
        out.classList.remove("hidden");
        setTimeout(function () {
          var panel = document.getElementById("trackPanel");
          if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 1400);
      }
    };
    resetState();
    rec.querySelectorAll("[data-rec-group]").forEach(function (group) {
      group.querySelectorAll(".rec-tile").forEach(function (tile) {
        tile.addEventListener("click", function () {
          if (group.classList.contains("locked")) return;
          group.classList.add("locked");
          tile.classList.add("sel");
          (tile.getAttribute("data-points") || "").split(",").forEach(function (pair) {
            var kv = pair.split(":");
            if (kv[0] in scores) scores[kv[0]] += parseInt(kv[1], 10) || 0;
          });
          if (++answered >= 3) finish();
        });
      });
    });
    var resetBtn = document.getElementById("recReset");
    if (resetBtn) resetBtn.addEventListener("click", resetState);
  }
})();
