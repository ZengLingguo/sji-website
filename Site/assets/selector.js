(function () {
  const DATA_URL = "../assets/selector-specs.json";
  const CONTACT_EMAIL = "Sales@zhsji.com";
  const FIXED_SERIES = ["RS60", "RS80", "NRS100A", "RS210", "RS220", "RS250", "RS290"];
  const RS200_FAMILY = ["RS210", "RS220", "RS250", "RS290"];
  const MAIN_SERIES = ["RS60", "RS210", "RS220", "RS250", "RS290"];

  const seriesMeta = {
    RS60: {
      label: "RS60 Series",
      link: "./rs60.html",
      image: "../assets/rs60-web.png",
      type: "Standard fixed reader",
      note: "Compact fixed reading for production equipment and standard 1D/2D codes."
    },
    RS80: {
      label: "RS80-M Series",
      link: "./barcode-readers.html",
      image: "../assets/rs200-web.png",
      type: "Fixed reader option",
      note: "Representative fixed-reader option for production-line code reading."
    },
    NRS100A: {
      label: "RS100-A / RS100-M Series",
      link: "./barcode-readers.html",
      image: "../assets/rs200-web.png",
      type: "Stable fixed reader",
      note: "Balanced fixed reader family for machine builders and production teams."
    },
    RS210: {
      label: "RS210",
      link: "./rs200.html",
      image: "../assets/rs200-web.png",
      type: "RS200 family",
      note: "RS200 family option for demanding fixed-reader applications."
    },
    RS220: {
      label: "RS220",
      link: "./rs200.html",
      image: "../assets/rs200-web.png",
      type: "RS200 family",
      note: "RS200 family option for wider FOV or longer-distance requirements."
    },
    RS250: {
      label: "RS250",
      link: "./rs200.html",
      image: "../assets/rs200-web.png",
      type: "RS200 family",
      note: "RS200 family option for high-performance traceability and flexible distance ranges."
    },
    RS290: {
      label: "RS290",
      link: "./rs200.html",
      image: "../assets/rs200-web.png",
      type: "RS200 family",
      note: "RS200 family option for longer distance and large FOV requirements."
    },
    H620: {
      label: "H620 Series",
      link: "./h620.html",
      image: "../assets/h620-web.png",
      type: "Handheld reader",
      note: "Recommended for inspection, warehouse, workstation, and flexible manual scanning."
    },
    H920: {
      label: "H920 Series",
      link: "./barcode-readers.html",
      image: "../assets/h620-web.png",
      type: "Handheld reader option",
      note: "Use when wired or wireless handheld workflow needs should be confirmed."
    },
    R170: {
      label: "R170 / R172 Series",
      link: "./barcode-readers.html",
      image: "../assets/rs200-web.png",
      type: "Compact reader",
      note: "Compact reader option for embedded positions and limited installation space."
    },
    R270: {
      label: "R270-A / R275-A Series",
      link: "./barcode-readers.html",
      image: "../assets/rs200-web.png",
      type: "Compact autofocus reader",
      note: "Compact option for constrained layouts or autofocus application needs."
    },
    D100: {
      label: "D100 PDA",
      link: "./barcode-readers.html",
      image: "../assets/h620-web.png",
      type: "Mobile data terminal",
      note: "Discuss mobile data collection and warehouse workflow requirements with SJI."
    },
    ES100: {
      label: "ES100 Software Engine",
      link: "./barcode-readers.html",
      image: "../assets/rs200-web.png",
      type: "Software decoding",
      note: "Use when the requirement is software-based decoding from image input."
    }
  };

  let specs = [];
  let lastSummary = "";

  function $(id) {
    return document.getElementById(id);
  }

  function numberValue(id, fallback = 0) {
    const value = Number($(id)?.value);
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  function textValue(id) {
    return $(id)?.value || "";
  }

  function round(value, digits = 1) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

  function is2DCode(codeType) {
    return ["QR", "Data Matrix", "DPM", "Mixed"].includes(codeType);
  }

  function calculateRequiredMil(state) {
    if (!state.useResolution) return null;
    if (state.twoD) {
      const moduleCount = Math.max(state.moduleCount, 1);
      return (state.codeSize / moduleCount) * 39.37;
    }
    if (state.narrowBar > 0) return state.narrowBar * 39.37;
    return null;
  }

  function getStartPoint() {
    return document.querySelector('input[name="startPoint"]:checked')?.value || "application";
  }

  function getState() {
    const codeType = textValue("selectorCodeType");
    const state = {
      startPoint: getStartPoint(),
      application: textValue("selectorApplication"),
      installation: textValue("selectorInstallation"),
      knownModel: textValue("selectorKnownModel"),
      codeType,
      twoD: is2DCode(codeType),
      codeSize: numberValue("selectorCodeSize", 5),
      moduleCount: numberValue("selectorModuleCount", 25),
      narrowBar: numberValue("selectorNarrowBar", 0),
      distance: numberValue("selectorDistance", 100),
      tolerance: Math.max(numberValue("selectorTolerance", 50), 1),
      fovX: numberValue("selectorFovX", 0),
      fovY: numberValue("selectorFovY", 0),
      lineSpeed: numberValue("selectorLineSpeed", 0),
      interfaceNeed: textValue("selectorInterface"),
      quantity: numberValue("selectorQuantity", 0),
      useResolution: $("selectorUseResolution")?.checked !== false
    };
    const requiredMil = calculateRequiredMil(state);
    state.requiredMil = requiredMil;
    state.safeMil = requiredMil ? requiredMil * 0.8 : null;
    return state;
  }

  function seriesForKnownModel(model) {
    if (!model) return [];
    if (model === "H620" || model === "H920") return [model];
    return [model];
  }

  function seriesForInstallation(installation) {
    if (installation === "handheld") return ["H620", "H920"];
    if (installation === "compact") return ["R170", "R270"];
    if (installation === "mobile") return ["D100", "ES100"];
    return FIXED_SERIES;
  }

  function applicationBonus(series, state) {
    if (state.application === "electronics") {
      if (series === "RS60") return 8;
      if (["RS210", "RS250"].includes(series)) return 5;
    }
    if (state.application === "packaging") {
      if (["RS220", "RS250", "RS290"].includes(series)) return 7;
      if (series === "RS80") return 4;
    }
    if (state.application === "automotive" || state.application === "new-energy") {
      if (RS200_FAMILY.includes(series)) return 8;
      if (series === "RS60") return 3;
    }
    if (state.application === "semiconductor") {
      if (["RS60", "RS250", "RS290"].includes(series)) return 6;
    }
    if (state.lineSpeed >= 60 && ["RS220", "RS250", "RS290"].includes(series)) return 7;
    return 0;
  }

  function scoreSpec(spec, state) {
    const distanceGap = Math.abs(spec.distanceMm - state.distance);
    const distanceScore = Math.max(0, 100 - (distanceGap / state.tolerance) * 42);

    const fovChecks = [];
    if (state.fovX > 0) fovChecks.push({ actual: spec.fovXmm, required: state.fovX });
    if (state.fovY > 0) fovChecks.push({ actual: spec.fovYmm, required: state.fovY });
    const fovOk = fovChecks.every((item) => item.actual >= item.required);
    let fovScore = 78;
    if (fovChecks.length) {
      if (fovOk) {
        const excess = fovChecks.reduce((sum, item) => sum + item.actual / item.required - 1, 0) / fovChecks.length;
        fovScore = Math.max(68, 100 - Math.min(32, excess * 22));
      } else {
        const coverage = fovChecks.reduce((sum, item) => sum + Math.min(item.actual / item.required, 1), 0) / fovChecks.length;
        fovScore = Math.max(0, 58 * coverage);
      }
    }

    const resolution = state.twoD ? spec.resolution2DMil : spec.resolution1DMil;
    const resolutionOk = state.safeMil ? resolution <= state.safeMil : true;
    let resolutionScore = 76;
    let resolutionSlack = null;
    if (state.safeMil) {
      resolutionSlack = state.safeMil / Math.max(resolution, 0.1) - 1;
      resolutionScore = resolutionOk
        ? Math.min(100, 72 + resolutionSlack * 26)
        : Math.max(0, 58 * (state.safeMil / Math.max(resolution, 0.1)));
    }

    const priorityBonus = MAIN_SERIES.includes(spec.series) ? 4 : 0;
    const score =
      distanceScore * 0.38 +
      fovScore * 0.22 +
      resolutionScore * 0.32 +
      applicationBonus(spec.series, state) +
      priorityBonus;

    return {
      ...spec,
      score: round(Math.min(score, 100), 1),
      distanceGap,
      fovOk,
      resolution,
      resolutionOk,
      resolutionSlack,
      reason: buildReason(spec, state, { distanceGap, fovOk, resolutionOk, resolution, resolutionSlack })
    };
  }

  function buildReason(spec, state, details) {
    const reason = [
      `Working distance ${spec.distanceMm} mm, gap ${round(details.distanceGap, 1)} mm`,
      `FOV output ${spec.fovXmm} x ${spec.fovYmm} mm`
    ];
    if (state.safeMil) {
      const label = state.twoD ? "2D" : "1D";
      reason.push(`${label} resolution ${details.resolution} mil ${details.resolutionOk ? "passes" : "needs review"}`);
    }
    if (applicationBonus(spec.series, state) > 0) reason.push("Application fit bonus");
    return reason;
  }

  function filterCandidates(state) {
    const knownSeries = seriesForKnownModel(state.knownModel);
    if (knownSeries.some((series) => !FIXED_SERIES.includes(series))) return [];

    const allowedSeries = knownSeries.length ? knownSeries : seriesForInstallation(state.installation);
    if (!allowedSeries.some((series) => FIXED_SERIES.includes(series))) return [];

    return specs
      .filter((spec) => allowedSeries.includes(spec.series))
      .filter((spec) => Math.abs(spec.distanceMm - state.distance) <= state.tolerance)
      .filter((spec) => {
        if (state.fovX > 0 && spec.fovXmm < state.fovX) return false;
        if (state.fovY > 0 && spec.fovYmm < state.fovY) return false;
        return true;
      })
      .filter((spec) => {
        if (!state.safeMil) return true;
        const resolution = state.twoD ? spec.resolution2DMil : spec.resolution1DMil;
        return resolution <= state.safeMil;
      })
      .map((spec) => scoreSpec(spec, state))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }

  function fallbackRecommendations(state) {
    const knownSeries = seriesForKnownModel(state.knownModel);
    const target = knownSeries[0];
    let keys = [];

    if (target === "H620" || target === "H920") keys = [target, target === "H620" ? "H920" : "H620"];
    else if (state.installation === "handheld" || state.application === "warehouse") keys = ["H620", "H920"];
    else if (state.installation === "compact") keys = ["R170", "R270"];
    else if (state.installation === "mobile") keys = ["D100", "ES100"];
    else keys = [];

    return keys.map((key, index) => ({
      manual: true,
      series: key,
      lens: "Confirm",
      distanceMm: state.distance,
      fovXmm: state.fovX || null,
      fovYmm: state.fovY || null,
      resolution: state.safeMil ? round(state.safeMil, 1) : null,
      score: index === 0 ? 86 : 76,
      reason: [
        "Recommended by installation or workflow",
        "Detailed optical range should be confirmed with sample images",
        "SJI sales can confirm the final configuration"
      ]
    }));
  }

  function dedupeBySeries(results) {
    const seen = new Set();
    return results.filter((item) => {
      const key = `${item.series}|${item.lens}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function renderInsights(state, results) {
    const chips = [];
    chips.push(`Start: ${state.startPoint}`);
    chips.push(`Distance: ${state.distance} +/- ${state.tolerance} mm`);
    if (state.safeMil) chips.push(`Safe resolution: ${round(state.safeMil, 1)} mil`);
    if (state.fovX || state.fovY) chips.push(`FOV need: ${state.fovX || "-"} x ${state.fovY || "-"} mm`);
    chips.push(`Candidates: ${results.length}`);
    $("selectorInsights").innerHTML = chips.map((chip) => `<span>${chip}</span>`).join("");
  }

  function modelLabel(item) {
    const meta = seriesMeta[item.series] || { label: item.series };
    return item.manual ? meta.label : `${meta.label} ${item.lens}`;
  }

  function renderResults(results, state) {
    const title = $("selectorResultTitle");
    const status = $("selectorStatus");
    const top = results[0];

    if (!results.length) {
      title.textContent = "Engineering review recommended";
      status.textContent = "No direct match";
      $("selectorTopModel").textContent = "Review";
      $("selectorReviewStatus").textContent = "Needs sample";
      $("selectorResults").innerHTML = `
        <article class="selector-empty">
          <h3>No direct public-spec match</h3>
          <p>Try widening distance tolerance, leaving FOV blank, or send sample code images and installation photos for SJI confirmation.</p>
        </article>
      `;
      renderInsights(state, results);
      renderSummary(state, results);
      return;
    }

    title.textContent = top.manual ? "Workflow recommendation" : "Recommended reader options";
    status.textContent = top.manual ? "Confirm with sales" : "Calculated";
    $("selectorTopModel").textContent = modelLabel(top);
    $("selectorReviewStatus").textContent = top.manual ? "Manual review" : "Matched";
    renderInsights(state, results);

    $("selectorResults").innerHTML = results
      .slice(0, 4)
      .map((item, index) => {
        const meta = seriesMeta[item.series] || { label: item.series, image: "../assets/rs200-web.png", link: "./barcode-readers.html", type: "Reader", note: "" };
        const resolutionLabel = state.twoD ? "2D res." : "1D res.";
        return `
          <article class="selector-result-card ${index === 0 ? "recommended" : ""}">
            <div class="selector-result-media"><img src="${meta.image}" alt="${meta.label}" /></div>
            <div class="selector-result-body">
              <div class="selector-result-title">
                <div>
                  <span>${index === 0 ? "Recommended" : "Alternative"}</span>
                  <h3>${modelLabel(item)}</h3>
                </div>
                <strong>${item.score} pts</strong>
              </div>
              <p>${meta.note}</p>
              <div class="selector-spec-row">
                <span>Distance <strong>${item.manual ? "Confirm" : `${item.distanceMm} mm`}</strong></span>
                <span>FOV <strong>${item.fovXmm && item.fovYmm ? `${item.fovXmm} x ${item.fovYmm} mm` : "Confirm"}</strong></span>
                <span>${resolutionLabel} <strong>${item.resolution ? `${round(item.resolution, 1)} mil` : "Confirm"}</strong></span>
              </div>
              <ul>${item.reason.map((line) => `<li>${line}</li>`).join("")}</ul>
              <a class="text-link" href="${meta.link}">View ${meta.type}</a>
            </div>
          </article>
        `;
      })
      .join("");
    renderSummary(state, results);
  }

  function renderSummary(state, results) {
    const top = results[0];
    const alternatives = results.slice(1, 4).map(modelLabel).join(", ") || "To be confirmed";
    const optional = (value, suffix = "") => (value ? `${value}${suffix}` : "Not provided");
    const fovText = state.fovX || state.fovY
      ? `${state.fovX || "-"} x ${state.fovY || "-"} mm`
      : "Not provided";
    lastSummary = [
      "SJI barcode reader selection inquiry",
      `Recommended model: ${top ? modelLabel(top) : "Engineering review required"}`,
      `Alternative models: ${alternatives}`,
      `Application: ${state.application}`,
      `Installation: ${state.installation}`,
      `Known target model: ${state.knownModel || "None"}`,
      `Code type: ${state.codeType}`,
      `2D code size / module count: ${state.codeSize} mm / ${state.moduleCount}`,
      `1D narrow bar: ${optional(state.narrowBar, " mm")}`,
      `Working distance: ${state.distance} mm, tolerance +/- ${state.tolerance} mm`,
      `Required FOV: ${fovText}`,
      `Line speed: ${optional(state.lineSpeed, " m/min")}`,
      `Interface: ${state.interfaceNeed}`,
      `Expected quantity: ${optional(state.quantity)}`,
      "Please help confirm the final model, lens configuration, quotation, lead time, and required documents."
    ].join("\n");
    $("selectorSummary").value = lastSummary;
    $("selectorMail").href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("SJI barcode reader selection inquiry")}&body=${encodeURIComponent(lastSummary)}`;
  }

  function calculate(options = {}) {
    const state = getState();
    let results = dedupeBySeries(filterCandidates(state));
    if (!results.length) results = fallbackRecommendations(state);
    renderResults(results, state);
    if (options.scrollToResults) {
      window.setTimeout(() => {
        document.querySelector(".selector-results-panel")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 80);
    }
  }

  function resetForm() {
    $("selectorApplication").value = "electronics";
    $("selectorInstallation").value = "fixed";
    $("selectorKnownModel").value = "";
    $("selectorCodeType").value = "QR";
    $("selectorCodeSize").value = "5";
    $("selectorModuleCount").value = "25";
    $("selectorNarrowBar").value = "";
    $("selectorDistance").value = "100";
    $("selectorTolerance").value = "50";
    $("selectorFovX").value = "";
    $("selectorFovY").value = "";
    $("selectorLineSpeed").value = "";
    $("selectorInterface").value = "Ethernet";
    $("selectorQuantity").value = "";
    $("selectorUseResolution").checked = true;
    document.querySelector('input[name="startPoint"][value="application"]').checked = true;
    calculate();
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(lastSummary);
      $("selectorCopy").textContent = "Copied";
      setTimeout(() => {
        $("selectorCopy").textContent = "Copy Summary";
      }, 1400);
    } catch (_) {
      $("selectorSummary").select();
      document.execCommand("copy");
    }
  }

  function bindEvents() {
    $("selectorCalculate")?.addEventListener("click", () => calculate({ scrollToResults: true }));
    $("selectorReset")?.addEventListener("click", resetForm);
    $("selectorCopy")?.addEventListener("click", copySummary);
    document.querySelectorAll("#selectorForm select, #selectorForm input").forEach((field) => {
      field.addEventListener("change", calculate);
    });
  }

  async function init() {
    if (!$("selectorForm")) return;
    bindEvents();
    try {
      const response = await fetch(DATA_URL);
      const data = await response.json();
      specs = data.specs || [];
      $("selectorSpecCount").textContent = String(data.count || specs.length);
      calculate();
    } catch (error) {
      $("selectorResultTitle").textContent = "Selector data unavailable";
      $("selectorStatus").textContent = "Check data";
      $("selectorResults").innerHTML = "<article class=\"selector-empty\"><h3>Unable to load selector data</h3><p>Please contact SJI directly and include your application details.</p></article>";
      renderSummary(getState(), []);
    }
  }

  init();
})();
