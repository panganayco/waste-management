// Main application logic for Istorya Recipe Builder

class IstoryaRecipeBuilder {
  constructor() {
    // State
    this.currentStep = 1;
    this.selectedConstellationIds = new Set();
    this.selectedIngredientIds = new Set();
    this.selectedMethodId = null;
    this.selectedVesselId = null;
    this.selectedSawsawanId = null;
    this.sessionId = this.generateSessionId();

    // Initialize
    this.init();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  init() {
    this.loadFromLocalStorage();
    this.initConstellationStep();
    this.initMethodVesselSawsawan();
    this.attachEventListeners();
    this.setupKeyboardNavigation();

    // Track initial page view
    Analytics.trackPageView('/step-1');
  }

  // Local Storage Management
  loadFromLocalStorage() {
    if (!CONFIG.FEATURES.LOCAL_STORAGE) return;

    try {
      const draft = localStorage.getItem(CONFIG.STORAGE_KEYS.DRAFT);
      if (draft) {
        const data = JSON.parse(draft);
        this.selectedConstellationIds = new Set(data.constellationIds || []);
        this.selectedIngredientIds = new Set(data.ingredientIds || []);
        this.selectedMethodId = data.methodId || null;
        this.selectedVesselId = data.vesselId || null;
        this.selectedSawsawanId = data.sawsawanId || null;
        this.currentStep = data.currentStep || 1;
      }
    } catch (e) {
      console.error('Failed to load draft from localStorage:', e);
    }
  }

  saveToLocalStorage() {
    if (!CONFIG.FEATURES.LOCAL_STORAGE) return;

    try {
      const draft = {
        constellationIds: Array.from(this.selectedConstellationIds),
        ingredientIds: Array.from(this.selectedIngredientIds),
        methodId: this.selectedMethodId,
        vesselId: this.selectedVesselId,
        sawsawanId: this.selectedSawsawanId,
        currentStep: this.currentStep,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(CONFIG.STORAGE_KEYS.DRAFT, JSON.stringify(draft));
    } catch (e) {
      console.error('Failed to save draft to localStorage:', e);
    }
  }

  clearLocalStorage() {
    if (!CONFIG.FEATURES.LOCAL_STORAGE) return;
    localStorage.removeItem(CONFIG.STORAGE_KEYS.DRAFT);
  }

  // Step Navigation
  setStep(step) {
    this.currentStep = step;

    document.querySelectorAll("[data-step]").forEach(card => {
      const cardStep = Number(card.getAttribute("data-step"));
      card.style.display = cardStep === step ? "block" : "none";
    });

    document.querySelectorAll("[data-step-pill]").forEach(pill => {
      const pillStep = Number(pill.getAttribute("data-step-pill"));
      const isActive = pillStep === step;
      pill.classList.toggle("active", isActive);
      pill.setAttribute("aria-selected", isActive);
      pill.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    if (step === 2) {
      this.generateIngredientPills();
    }

    if (step === 4) {
      this.renderRecipe();
    }

    this.saveToLocalStorage();
    Analytics.trackStepChange(step);
    Analytics.trackPageView(`/step-${step}`);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // UI Creation Helpers
  createOptionCard({ emoji, label, desc, id, group }) {
    const div = document.createElement("div");
    div.className = "option-card";
    div.dataset.optionId = id;
    div.dataset.group = group;
    div.setAttribute("role", group === "constellation" ? "checkbox" : "radio");
    div.setAttribute("tabindex", "0");
    div.setAttribute("aria-checked", "false");

    const labelDiv = document.createElement("div");
    labelDiv.className = "option-label";

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "option-emoji";
    emojiSpan.setAttribute("aria-hidden", "true");
    emojiSpan.textContent = emoji;

    const textSpan = document.createElement("span");
    textSpan.textContent = label;

    labelDiv.appendChild(emojiSpan);
    labelDiv.appendChild(textSpan);

    const descDiv = document.createElement("div");
    descDiv.className = "option-desc";
    descDiv.textContent = desc;

    div.appendChild(labelDiv);
    div.appendChild(descDiv);

    div.addEventListener("click", () => this.handleOptionClick(div));
    div.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleOptionClick(div);
      }
    });

    return div;
  }

  handleOptionClick(card) {
    const group = card.dataset.group;
    const id = card.dataset.optionId;

    if (group === "constellation") {
      if (this.selectedConstellationIds.has(id)) {
        this.selectedConstellationIds.delete(id);
        card.classList.remove("selected");
        card.setAttribute("aria-checked", "false");
      } else {
        this.selectedConstellationIds.add(id);
        card.classList.add("selected");
        card.setAttribute("aria-checked", "true");
      }
      Analytics.trackSelection('constellation', id);
      this.saveToLocalStorage();
      return;
    }

    if (group === "method") {
      this.selectedMethodId = (this.selectedMethodId === id) ? null : id;
      document.querySelectorAll('.option-card[data-group="method"]').forEach(c => {
        c.classList.remove("selected");
        c.setAttribute("aria-checked", "false");
      });
      if (this.selectedMethodId) {
        card.classList.add("selected");
        card.setAttribute("aria-checked", "true");
      }
      Analytics.trackSelection('method', id);
      this.saveToLocalStorage();
      return;
    }

    if (group === "vessel") {
      this.selectedVesselId = (this.selectedVesselId === id) ? null : id;
      document.querySelectorAll('.option-card[data-group="vessel"]').forEach(c => {
        c.classList.remove("selected");
        c.setAttribute("aria-checked", "false");
      });
      if (this.selectedVesselId) {
        card.classList.add("selected");
        card.setAttribute("aria-checked", "true");
      }
      Analytics.trackSelection('vessel', id);
      this.saveToLocalStorage();
      return;
    }

    if (group === "sawsawan") {
      this.selectedSawsawanId = (this.selectedSawsawanId === id) ? null : id;
      document.querySelectorAll('.option-card[data-group="sawsawan"]').forEach(c => {
        c.classList.remove("selected");
        c.setAttribute("aria-checked", "false");
      });
      if (this.selectedSawsawanId) {
        card.classList.add("selected");
        card.setAttribute("aria-checked", "true");
      }
      Analytics.trackSelection('sawsawan', id);
      this.saveToLocalStorage();
      return;
    }

    if (group === "ingredient") {
      const maxIngredients = CONFIG.VALIDATION.MAX_INGREDIENTS;
      const already = this.selectedIngredientIds.has(id);

      if (already) {
        this.selectedIngredientIds.delete(id);
        card.classList.remove("selected");
        card.setAttribute("aria-checked", "false");
      } else {
        if (this.selectedIngredientIds.size >= maxIngredients) {
          this.shakeElement(card);
          this.showToast(`Maximum ${maxIngredients} ingredients allowed`, 'error');
        } else {
          this.selectedIngredientIds.add(id);
          card.classList.add("selected");
          card.setAttribute("aria-checked", "true");
        }
      }
      Analytics.trackSelection('ingredient', id);
      this.saveToLocalStorage();
    }
  }

  shakeElement(element) {
    element.style.transform = "translateX(-3px)";
    setTimeout(() => { element.style.transform = "translateX(3px)"; }, 50);
    setTimeout(() => { element.style.transform = "translateX(-3px)"; }, 100);
    setTimeout(() => { element.style.transform = "none"; }, 150);
  }

  showToast(message, type = 'info') {
    const statusEl = document.getElementById('copy-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = type === 'error' ? 'error-message' : 'success-message';

    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'copy-status';
    }, 3000);
  }

  initConstellationStep() {
    const container = document.getElementById("constellation-options");
    container.innerHTML = "";

    CONSTELLATION_POINTS.forEach(point => {
      const option = this.createOptionCard({
        emoji: "✦",
        label: point.label,
        desc: point.desc,
        id: point.id,
        group: "constellation"
      });

      if (this.selectedConstellationIds.has(point.id)) {
        option.classList.add("selected");
        option.setAttribute("aria-checked", "true");
      }

      container.appendChild(option);
    });
  }

  generateIngredientPills() {
    const container = document.getElementById("ingredient-pills");
    container.innerHTML = "";

    const mappedIds = new Set();
    this.selectedConstellationIds.forEach(cid => {
      const point = CONSTELLATION_POINTS.find(p => p.id === cid);
      if (point) mappedIds.add(point.ingredientId);
    });

    if (mappedIds.size === 0) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = "You didn't select any constellation points. Go back and choose at least one.";
      container.appendChild(p);
      return;
    }

    mappedIds.forEach(iid => {
      const ing = INGREDIENTS[iid];
      if (!ing) return;

      const pill = document.createElement("div");
      pill.className = "pill";
      pill.dataset.optionId = iid;
      pill.dataset.group = "ingredient";
      pill.setAttribute("role", "checkbox");
      pill.setAttribute("tabindex", "0");
      pill.setAttribute("aria-checked", "false");

      const emojiSpan = document.createElement("span");
      emojiSpan.className = "emoji";
      emojiSpan.setAttribute("aria-hidden", "true");
      emojiSpan.textContent = ing.emoji;

      const textSpan = document.createElement("span");
      textSpan.textContent = ing.name;

      const descSpan = document.createElement("span");
      descSpan.style.color = "#9ca3af";
      descSpan.style.fontSize = "0.75rem";
      descSpan.textContent = " (" + ing.meaning + ")";

      pill.appendChild(emojiSpan);
      pill.appendChild(textSpan);
      pill.appendChild(descSpan);

      if (this.selectedIngredientIds.has(iid)) {
        pill.classList.add("selected");
        pill.setAttribute("aria-checked", "true");
      }

      pill.addEventListener("click", () => {
        this.handleOptionClick(pill);
      });

      pill.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handleOptionClick(pill);
        }
      });

      container.appendChild(pill);
    });
  }

  initMethodVesselSawsawan() {
    // Methods
    const methodContainer = document.getElementById("method-options");
    methodContainer.innerHTML = "";
    METHODS.forEach(m => {
      const c = this.createOptionCard({
        emoji: m.emoji,
        label: m.label,
        desc: m.desc,
        id: m.id,
        group: "method"
      });
      if (this.selectedMethodId === m.id) {
        c.classList.add("selected");
        c.setAttribute("aria-checked", "true");
      }
      methodContainer.appendChild(c);
    });

    // Vessels
    const vesselContainer = document.getElementById("vessel-options");
    vesselContainer.innerHTML = "";
    VESSELS.forEach(v => {
      const c = this.createOptionCard({
        emoji: v.emoji,
        label: v.label,
        desc: v.desc,
        id: v.id,
        group: "vessel"
      });
      if (this.selectedVesselId === v.id) {
        c.classList.add("selected");
        c.setAttribute("aria-checked", "true");
      }
      vesselContainer.appendChild(c);
    });

    // Sawsawan
    const sawsawanContainer = document.getElementById("sawsawan-options");
    sawsawanContainer.innerHTML = "";
    SAWSAWAN.forEach(s => {
      const c = this.createOptionCard({
        emoji: s.emoji,
        label: s.label,
        desc: s.desc,
        id: s.id,
        group: "sawsawan"
      });
      if (this.selectedSawsawanId === s.id) {
        c.classList.add("selected");
        c.setAttribute("aria-checked", "true");
      }
      sawsawanContainer.appendChild(c);
    });
  }

  renderRecipe() {
    const container = document.getElementById("recipe-output");
    container.innerHTML = "";

    const data = this.buildRecipeData();
    const { ingredients, method, vessel, sawsawan } = data;

    const ingredientNames = ingredients.map(i => `${i.emoji} ${i.name}`);
    const ingredientMeaning = ingredients.map(i => `• ${i.emoji} ${i.name}: ${i.meaning}`).join("\n");

    // Title
    const title = document.createElement("div");
    title.className = "recipe-title";
    title.textContent = ingredientNames.length
      ? `Istorya Recipe With ${ingredientNames.join(", ")}`
      : "Istorya Recipe";

    // Subtitle
    const sub = document.createElement("div");
    sub.className = "recipe-sub";
    sub.textContent = "A working draft of your story in recipe form.";

    // Ingredients
    const ingredientsTitle = document.createElement("div");
    ingredientsTitle.className = "recipe-section-title";
    ingredientsTitle.textContent = "Base ingredients";

    const ingredientsText = document.createElement("pre");
    ingredientsText.className = "recipe-text";
    ingredientsText.style.whiteSpace = "pre-wrap";
    ingredientsText.style.fontFamily = "inherit";
    ingredientsText.textContent = ingredientMeaning || "You can go back and choose at least one base ingredient.";

    // Method and Vessel
    const methodTitle = document.createElement("div");
    methodTitle.className = "recipe-section-title";
    methodTitle.textContent = "Method and vessel";

    const methodText = document.createElement("div");
    methodText.className = "recipe-text";
    methodText.textContent =
      method && vessel
        ? `You are processing this as ${method.emoji} ${method.label} in a ${vessel.emoji} ${vessel.label} context.`
        : "You can go back and pick one method and one vessel.";

    // Sawsawan
    const sawsawanTitle = document.createElement("div");
    sawsawanTitle.className = "recipe-section-title";
    sawsawanTitle.textContent = "Sawsawan (agency layer)";

    const sawsawanText = document.createElement("div");
    sawsawanText.className = "recipe-text";
    sawsawanText.textContent = sawsawan
      ? `${sawsawan.emoji} ${sawsawan.label}: ${sawsawan.desc}`
      : "You can go back and choose one sawsawan that fits how you are adapting your story right now.";

    // Summary
    const summaryTitle = document.createElement("div");
    summaryTitle.className = "recipe-section-title";
    summaryTitle.textContent = "Serving suggestion";

    const summary = document.createElement("div");
    summary.className = "recipe-text";
    summary.textContent = data.summary;

    // Footer
    const footer = document.createElement("div");
    footer.className = "recipe-footer";
    footer.textContent = "This is not your final dish. It is a snapshot. Recipes evolve as you do.";

    // Append all elements
    container.appendChild(title);
    container.appendChild(sub);
    container.appendChild(ingredientsTitle);
    container.appendChild(ingredientsText);
    container.appendChild(methodTitle);
    container.appendChild(methodText);
    container.appendChild(sawsawanTitle);
    container.appendChild(sawsawanText);
    container.appendChild(summaryTitle);
    container.appendChild(summary);
    container.appendChild(footer);
  }

  buildSummarySentence(ingredients, method, vessel, sawsawan) {
    if (ingredients.length === 0 && !method && !vessel && !sawsawan) {
      return "Once you add ingredients, a method, a vessel, and sawsawan, this will read like a short story of where you are in your Istorya.";
    }

    const ingPart = ingredients.length
      ? "You are working with " + ingredients.map(i => i.name.toLowerCase()).join(", ") + "."
      : "";

    const methodPart =
      method && vessel
        ? ` Right now that feels like ${method.label.toLowerCase()} in a ${vessel.label.toLowerCase()} setting.`
        : "";

    const sawsawanPart = sawsawan
      ? ` You are choosing ${sawsawan.label.toLowerCase()} as your sawsawan, which means ${sawsawan.desc.toLowerCase()}.`
      : "";

    return (ingPart + methodPart + sawsawanPart).trim();
  }

  buildRecipeData() {
    const ingredients = Array.from(this.selectedIngredientIds).map(id => INGREDIENTS[id]);
    const method = METHODS.find(m => m.id === this.selectedMethodId) || null;
    const vessel = VESSELS.find(v => v.id === this.selectedVesselId) || null;
    const sawsawan = SAWSAWAN.find(s => s.id === this.selectedSawsawanId) || null;

    const constellation = Array.from(this.selectedConstellationIds).map(id => {
      const point = CONSTELLATION_POINTS.find(p => p.id === id);
      return point
        ? { id: point.id, label: point.label, desc: point.desc, ingredientId: point.ingredientId }
        : null;
    }).filter(Boolean);

    const summary = this.buildSummarySentence(ingredients, method, vessel, sawsawan);

    return {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      constellationSelections: constellation,
      ingredients,
      method,
      vessel,
      sawsawan,
      summary
    };
  }

  buildRecipeTextExport(data) {
    const lines = [];

    lines.push("MY ISTORYA RECIPE");
    lines.push("-----------------");
    lines.push(`Timestamp: ${data.timestamp}`);
    lines.push("");

    lines.push("Constellation Points:");
    if (data.constellationSelections.length === 0) {
      lines.push("  (none selected)");
    } else {
      data.constellationSelections.forEach(p => {
        lines.push(`  - ${p.label}: ${p.desc}`);
      });
    }
    lines.push("");

    lines.push("Base Ingredients:");
    if (data.ingredients.length === 0) {
      lines.push("  (none selected)");
    } else {
      data.ingredients.forEach(i => {
        lines.push(`  - ${i.emoji} ${i.name}: ${i.meaning}`);
      });
    }
    lines.push("");

    lines.push("Method and Vessel:");
    if (data.method && data.vessel) {
      lines.push(`  Method: ${data.method.emoji} ${data.method.label} – ${data.method.desc}`);
      lines.push(`  Vessel: ${data.vessel.emoji} ${data.vessel.label} – ${data.vessel.desc}`);
    } else {
      lines.push("  (method and/or vessel not selected)");
    }
    lines.push("");

    lines.push("Sawsawan (Agency Layer):");
    if (data.sawsawan) {
      lines.push(`  ${data.sawsawan.emoji} ${data.sawsawan.label}: ${data.sawsawan.desc}`);
    } else {
      lines.push("  (no sawsawan selected)");
    }
    lines.push("");

    lines.push("Serving Suggestion:");
    lines.push(`  ${data.summary}`);

    return lines.join("\n");
  }

  resetAll() {
    this.selectedConstellationIds.clear();
    this.selectedIngredientIds.clear();
    this.selectedMethodId = null;
    this.selectedVesselId = null;
    this.selectedSawsawanId = null;

    document.querySelectorAll(".option-card").forEach(c => {
      c.classList.remove("selected");
      c.setAttribute("aria-checked", "false");
    });

    document.querySelectorAll(".pill").forEach(p => {
      p.classList.remove("selected");
      p.setAttribute("aria-checked", "false");
    });

    const status = document.getElementById("copy-status");
    if (status) status.textContent = "";

    this.clearLocalStorage();
    this.sessionId = this.generateSessionId();
    this.setStep(1);

    Analytics.trackEvent('Navigation', 'reset', 'Recipe reset');
  }

  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    } catch (e) {
      console.error("Clipboard copy failed:", e);
      return false;
    }
  }

  async saveRecipeToServer() {
    if (!CONFIG.FEATURES.SAVE_TO_SERVER) {
      this.showToast('Server save is disabled', 'error');
      return;
    }

    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';

    try {
      const data = this.buildRecipeData();

      const response = await fetch(`${CONFIG.API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      this.showToast('Recipe saved successfully!', 'success');
      Analytics.trackRecipeSave(true);

      // Clear draft from localStorage after successful save
      this.clearLocalStorage();

      return result;
    } catch (error) {
      console.error('Failed to save recipe:', error);
      this.showToast('Failed to save recipe. Please try again.', 'error');
      Analytics.trackRecipeSave(false);
      throw error;
    } finally {
      loadingOverlay.style.display = 'none';
    }
  }

  setupKeyboardNavigation() {
    // Allow arrow key navigation for step pills
    const stepPills = document.querySelectorAll('.step-pill');
    stepPills.forEach((pill, index) => {
      pill.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && index < stepPills.length - 1) {
          stepPills[index + 1].focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          stepPills[index - 1].focus();
        }
      });
    });
  }

  attachEventListeners() {
    // Step navigation
    document.getElementById("next-1").addEventListener("click", () => {
      this.setStep(2);
    });

    document.getElementById("reset-all-1").addEventListener("click", () => {
      this.resetAll();
      this.initConstellationStep();
    });

    document.getElementById("back-2").addEventListener("click", () => {
      this.setStep(1);
    });

    document.getElementById("next-2").addEventListener("click", () => {
      this.setStep(3);
    });

    document.getElementById("back-3").addEventListener("click", () => {
      this.setStep(2);
    });

    document.getElementById("next-3").addEventListener("click", () => {
      this.setStep(4);
    });

    document.getElementById("back-4").addEventListener("click", () => {
      this.setStep(3);
    });

    document.getElementById("restart").addEventListener("click", () => {
      this.resetAll();
      this.initConstellationStep();
      this.initMethodVesselSawsawan();
    });

    // Copy buttons
    document.getElementById("copy-text").addEventListener("click", async () => {
      const data = this.buildRecipeData();
      const text = this.buildRecipeTextExport(data);
      const ok = await this.copyToClipboard(text);

      if (ok) {
        this.showToast("Recipe text copied to clipboard.", 'success');
        Analytics.trackEvent('Export', 'copy_text', 'Success');
      } else {
        this.showToast("Copy failed. Check console or copy manually.", 'error');
        Analytics.trackEvent('Export', 'copy_text', 'Failure');
      }
    });

    document.getElementById("copy-json").addEventListener("click", async () => {
      const data = this.buildRecipeData();
      const json = JSON.stringify(data, null, 2);
      const ok = await this.copyToClipboard(json);

      if (ok) {
        this.showToast("Recipe JSON copied to clipboard.", 'success');
        Analytics.trackEvent('Export', 'copy_json', 'Success');
      } else {
        this.showToast("Copy failed. Check console or copy manually.", 'error');
        Analytics.trackEvent('Export', 'copy_json', 'Failure');
        console.log("Istorya Recipe JSON:", data);
      }
    });

    document.getElementById("save-recipe").addEventListener("click", async () => {
      try {
        await this.saveRecipeToServer();
      } catch (error) {
        // Error already handled in saveRecipeToServer
      }
    });
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new IstoryaRecipeBuilder();
});
