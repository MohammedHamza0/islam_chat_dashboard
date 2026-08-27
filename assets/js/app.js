/**
 * Main Application Orchestrator & Controller (100% LLM Ground Truth)
 */
window.App = {
  allQuestions: [],
  filteredQuestions: [],
  currentPage: 1,
  currentMonth: "all",
  searchDebounceTimer: null,
  toastTimeout: null,

  availableMonthsData: {
    "all": [
      { key: "all", label: "كل الشهور (18 شهراً)" }
    ],
    "2024": [
      { key: "all", label: "كل شهور 2024" },
      { key: "10", label: "أكتوبر (12)" },
      { key: "11", label: "نوفمبر (2)" },
      { key: "12", label: "ديسمبر (22)" }
    ],
    "2025": [
      { key: "all", label: "كل شهور 2025" },
      { key: "01", label: "يناير (127)" },
      { key: "02", label: "فبراير (38)" },
      { key: "03", label: "مارس (1,884)" },
      { key: "04", label: "أبريل (562)" },
      { key: "05", label: "مايو (498)" },
      { key: "06", label: "يونيو (1,700)" },
      { key: "07", label: "يوليو (989)" },
      { key: "08", label: "أغسطس (732)" },
      { key: "09", label: "سبتمبر (688)" },
      { key: "10", label: "أكتوبر (1,126)" },
      { key: "11", label: "نوفمبر (781)" },
      { key: "12", label: "ديسمبر (820)" }
    ],
    "2026": [
      { key: "all", label: "كل شهور 2026" },
      { key: "01", label: "يناير (578)" },
      { key: "02", label: "فبراير (535)" },
      { key: "03", label: "مارس (502)" }
    ]
  },

  async init() {
    this.initTheme();
    this.initScrollProgress();

    // Fetch dataset
    this.allQuestions = await ApiService.getEnrichedDataset();
    this.filteredQuestions = [...this.allQuestions];

    // Initialize Month Chips
    this.renderMonthChips("all");

    // Initialize Chart.js
    const isDark = document.body.getAttribute("data-theme") === "dark";
    ChartService.initCharts(isDark);

    // Initial render
    this.applyFilters();
  },

  initTheme() {
    const savedTheme = localStorage.getItem("islam_chat_theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);
  },

  toggleTheme() {
    const current = document.body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("islam_chat_theme", next);
    this.updateThemeIcon(next);
    ChartService.reRenderCharts(next === "dark");
  },

  updateThemeIcon(theme) {
    const icon = document.querySelector("#theme-toggle i");
    if (icon) {
      icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  },

  switchMainTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".view-tab-btn").forEach(el => el.classList.remove("active"));

    const target = document.getElementById(tabId);
    if (target) target.classList.add("active");

    const btn = Array.from(document.querySelectorAll(".view-tab-btn")).find(b => b.getAttribute("onclick")?.includes(tabId));
    if (btn) btn.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderMonthChips(yearVal = "all") {
    const container = document.getElementById("quick-months-container");
    if (!container) return;

    const months = this.availableMonthsData[yearVal] || this.availableMonthsData["all"];
    
    container.innerHTML = `
      <div class="quick-months-wrapper">
        <div class="quick-months-title">
          <i class="fa-solid fa-calendar-days"></i> الشهور المتاحة لسنة ${yearVal === "all" ? "المنصة" : yearVal}:
        </div>
        <div class="quick-month-chips">
          ${months.map(m => `
            <button class="month-chip-btn ${m.key === this.currentMonth ? 'active' : ''}" 
                    onclick="setQuickMonth('${m.key}', this)">
              ${m.label}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  },

  onYearDropdownChange() {
    const yearVal = document.getElementById("filter-year")?.value || "all";
    
    // Sync chip buttons
    document.querySelectorAll(".chip-btn").forEach(b => {
      const isMatch = b.getAttribute("onclick")?.includes(`'${yearVal}'`);
      b.classList.toggle("active", isMatch);
    });

    this.currentMonth = "all";
    this.renderMonthChips(yearVal);
    this.applyFilters();
  },

  setQuickYear(yearVal, btn) {
    const el = document.getElementById("filter-year");
    if (el) el.value = yearVal;
    document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    this.currentMonth = "all";
    this.renderMonthChips(yearVal);
    this.applyFilters();
  },

  setQuickMonth(monthVal, btn) {
    this.currentMonth = monthVal;
    document.querySelectorAll(".month-chip-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    this.applyFilters();
  },

  applyFilters() {
    const year = document.getElementById("filter-year")?.value || "all";
    const month = this.currentMonth || "all";
    const faith = document.getElementById("filter-faith")?.value || "all";
    const intent = document.getElementById("filter-intent")?.value || "all";
    const funnel = document.getElementById("filter-funnel")?.value || "all";
    const blocker = document.getElementById("filter-blocker")?.value || "all";
    const convType = document.getElementById("filter-convtype")?.value || "all";
    const topic = document.getElementById("filter-topic")?.value || "all";
    const language = document.getElementById("filter-language")?.value || "all";
    const region = document.getElementById("filter-region")?.value || "all";
    const trending = document.getElementById("filter-trending")?.value || "all";
    const searchQuery = document.getElementById("live-search-input")?.value || "";

    // 1. Filter
    this.filteredQuestions = FilterService.filterQuestions(this.allQuestions, {
      year, month, faith, intent, funnel, blocker, convType, topic, language, region, trending, searchQuery
    });

    // 2. Sort
    const sortType = document.getElementById("sort-select")?.value || "trending_desc";
    this.filteredQuestions = FilterService.sortQuestions(this.filteredQuestions, sortType);

    this.currentPage = 1;

    // 3. Update KPIs
    this.updateKPIs();

    // 4. Update Charts
    ChartService.updateCharts(this.filteredQuestions);

    // 5. Render Cards
    this.renderCurrentPage();
  },

  resetAllFilters() {
    const selectIds = [
      "filter-year",
      "filter-faith",
      "filter-intent",
      "filter-funnel",
      "filter-blocker",
      "filter-convtype",
      "filter-topic",
      "filter-language",
      "filter-region",
      "filter-trending"
    ];

    selectIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "all";
    });

    const searchInput = document.getElementById("live-search-input");
    if (searchInput) searchInput.value = "";

    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) sortSelect.value = "trending_desc";

    document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
    const allChip = document.querySelector(".chip-btn");
    if (allChip) allChip.classList.add("active");

    // Reset month state and re-render chips
    this.currentMonth = "all";
    this.renderMonthChips("all");

    // Reset pagination to page 1
    this.currentPage = 1;

    // Re-apply filters to immediately refresh KPIs, charts, and cards
    this.applyFilters();

    // Show visual confirmation toast
    this.showToast("تمت استعادة كافة الفلاتر والبيانات بنجاح (11,596 سؤالاً)");
  },

  showToast(message) {
    let toast = document.getElementById("app-toast-alert");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast-alert";
      toast.className = "toast-alert";
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    toast.classList.add("show");

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  },

  onSearchInput() {
    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.applyFilters();
    }, 200);
  },

  applySort() {
    const sortType = document.getElementById("sort-select")?.value || "trending_desc";
    this.filteredQuestions = FilterService.sortQuestions(this.filteredQuestions, sortType);
    this.renderCurrentPage();
  },

  updateKPIs() {
    const kpi = FilterService.calculateKPIs(this.filteredQuestions, this.allQuestions.length);

    const elFiltered = document.getElementById("kpi-filtered-count");
    if (elFiltered) elFiltered.textContent = kpi.filteredCount.toLocaleString();

    const elResults = document.getElementById("results-count");
    if (elResults) elResults.textContent = kpi.filteredCount.toLocaleString();

    const elPct = document.getElementById("kpi-percentage-badge");
    if (elPct) elPct.textContent = kpi.percentageBadge;

    const elSeekers = document.getElementById("kpi-seekers-count");
    if (elSeekers) elSeekers.textContent = kpi.genuineSeekers.toLocaleString();

    const elChallengers = document.getElementById("kpi-challengers-count");
    if (elChallengers) elChallengers.textContent = kpi.challengers.toLocaleString();

    const elConverted = document.getElementById("kpi-converted-count");
    if (elConverted) elConverted.textContent = kpi.converted.toLocaleString();

    const elInterest = document.getElementById("kpi-interest-count");
    if (elInterest) elInterest.textContent = kpi.conversionInterest.toLocaleString();
  },

  renderCurrentPage() {
    const container = document.getElementById("qa-cards-container");
    const paginationContainer = document.getElementById("pagination-container");

    QaCardComponent.renderCards(container, this.filteredQuestions, this.currentPage);
    QaCardComponent.renderPagination(paginationContainer, this.filteredQuestions.length, this.currentPage, (newPage) => {
      this.currentPage = newPage;
      this.renderCurrentPage();
      const el = document.querySelector(".results-bar");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  },

  exportFilteredDataCSV() {
    if (this.filteredQuestions.length === 0) {
      alert("لا توجد بيانات مطابقة لتصديرها!");
      return;
    }

    const headers = ["ID", "Conversation_ID", "Question", "Answer", "Topic", "Faith", "Intent", "Funnel_Stage", "Key_Blocker", "Conversation_Type", "Language", "Region", "Date", "Cluster_Size"];
    const rows = this.filteredQuestions.map(q => [
      q.id,
      q.conversation_id,
      `"${(q.question || '').replace(/"/g, '""')}"`,
      `"${(q.answer || '').replace(/"/g, '""')}"`,
      `"${q.topic_ar || q.topic}"`,
      `"${q.faith_ar}"`,
      `"${q.intent_ar}"`,
      `"${q.funnel_stage_ar}"`,
      `"${q.key_blocker_ar}"`,
      `"${q.conversation_type_ar}"`,
      `"${q.language}"`,
      `"${q.region_ar}"`,
      q.date || '',
      q.cluster_size || 1
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `islam_chat_llm_filtered_qa_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  initScrollProgress() {
    window.addEventListener("scroll", () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const bar = document.getElementById("progress-bar");
      if (bar) bar.style.width = scrolled + "%";
    });
  }
};

// Global shortcuts for inline HTML event handlers
window.toggleTheme = () => App.toggleTheme();
window.switchMainTab = (tabId) => App.switchMainTab(tabId);
window.applyFilters = () => App.applyFilters();
window.resetAllFilters = () => App.resetAllFilters();
window.setQuickYear = (year, btn) => App.setQuickYear(year, btn);
window.setQuickMonth = (month, btn) => App.setQuickMonth(month, btn);
window.onYearDropdownChange = () => App.onYearDropdownChange();
window.onSearchInput = () => App.onSearchInput();
window.applySort = () => App.applySort();
window.exportFilteredDataCSV = () => App.exportFilteredDataCSV();
window.openLightbox = (src) => LightboxComponent.open(src);
window.closeLightbox = () => LightboxComponent.close();
window.openDialogueModal = (id) => DialogueModalComponent.openModal(id);
window.closeDialogueModal = (e) => DialogueModalComponent.closeModal(e);

// Start Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
