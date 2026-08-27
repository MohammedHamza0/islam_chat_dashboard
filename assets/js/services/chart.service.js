/**
 * ChartService: Dynamic Chart.js Rendering and Live Updates (100% LLM Ground Truth - Bilingual)
 */
window.ChartService = {
  timelineChart: null,
  faithChart: null,

  monthKeys: [
    { key: "2024-10", labelAr: "أكتوبر 24", labelEn: "Oct 24" },
    { key: "2024-11", labelAr: "نوفمبر 24", labelEn: "Nov 24" },
    { key: "2024-12", labelAr: "ديسمبر 24", labelEn: "Dec 24" },
    { key: "2025-01", labelAr: "يناير 25", labelEn: "Jan 25" },
    { key: "2025-02", labelAr: "فبراير 25", labelEn: "Feb 25" },
    { key: "2025-03", labelAr: "مارس 25", labelEn: "Mar 25" },
    { key: "2025-04", labelAr: "أبريل 25", labelEn: "Apr 25" },
    { key: "2025-05", labelAr: "مايو 25", labelEn: "May 25" },
    { key: "2025-06", labelAr: "يونيو 25", labelEn: "Jun 25" },
    { key: "2025-07", labelAr: "يوليو 25", labelEn: "Jul 25" },
    { key: "2025-08", labelAr: "أغسطس 25", labelEn: "Aug 25" },
    { key: "2025-09", labelAr: "سبتمبر 25", labelEn: "Sep 25" },
    { key: "2025-10", labelAr: "أكتوبر 25", labelEn: "Oct 25" },
    { key: "2025-11", labelAr: "نوفمبر 25", labelEn: "Nov 25" },
    { key: "2025-12", labelAr: "ديسمبر 25", labelEn: "Dec 25" },
    { key: "2026-01", labelAr: "يناير 26", labelEn: "Jan 26" },
    { key: "2026-02", labelAr: "فبراير 26", labelEn: "Feb 26" },
    { key: "2026-03", labelAr: "مارس 26", labelEn: "Mar 26" }
  ],

  initCharts(isDarkTheme = false) {
    const isEn = window.I18nService && window.I18nService.currentLang === "en";
    const fontFam = isEn ? "'Plus Jakarta Sans', sans-serif" : "'Cairo', sans-serif";
    const textColor = isDarkTheme ? "#cbd5e1" : "#334155";
    const gridColor = isDarkTheme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

    // 1. Timeline Line Chart (Live Dynamic)
    const canvasTimeline = document.getElementById("timelineChart");
    if (canvasTimeline) {
      if (this.timelineChart) this.timelineChart.destroy();
      const ctxTimeline = canvasTimeline.getContext("2d");
      this.timelineChart = new Chart(ctxTimeline, {
        type: "line",
        data: {
          labels: this.monthKeys.map(m => isEn ? m.labelEn : m.labelAr),
          datasets: [{
            label: isEn ? "Extracted Questions Count" : "عدد الأسئلة المستخرجة",
            data: new Array(this.monthKeys.length).fill(0),
            borderColor: "#0f3d3e",
            backgroundColor: "rgba(15, 61, 62, 0.12)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: "#0f3d3e"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 400 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => isEn ? ` ${ctx.parsed.y.toLocaleString()} Matching Questions` : ` ${ctx.parsed.y.toLocaleString()} سؤالاً مطابقاً`
              }
            }
          },
          scales: {
            x: {
              ticks: { color: textColor, font: { family: fontFam, size: 11 } },
              grid: { color: gridColor }
            },
            y: {
              beginAtZero: true,
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } },
              grid: { color: gridColor }
            }
          }
        }
      });
    }

    // 2. Faith Doughnut Chart (Live Dynamic)
    const canvasFaith = document.getElementById("faithChart");
    if (canvasFaith) {
      if (this.faithChart) this.faithChart.destroy();
      const ctxFaith = canvasFaith.getContext("2d");
      this.faithChart = new Chart(ctxFaith, {
        type: "doughnut",
        data: {
          labels: isEn ? ["Islam", "Christianity", "Unknown", "Atheism", "Agnosticism", "Hinduism", "Other"] : ["الإسلام", "المسيحية", "غير محدد", "الإلحاد", "اللاأدرية", "الهندوسية", "أخرى"],
          datasets: [{
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: [
              "#059669",
              "#7c3aed",
              "#64748b",
              "#dc2626",
              "#f97316",
              "#c59b27",
              "#0284c7"
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 400 },
          plugins: {
            legend: {
              position: 'right',
              labels: { color: textColor, font: { family: fontFam, size: 11 } }
            }
          }
        }
      });
    }
  },

  updateCharts(filteredQuestions) {
    if (!filteredQuestions) return;
    const isEn = window.I18nService && window.I18nService.currentLang === "en";

    // --- 1. Update Dynamic Timeline Line Chart ---
    if (this.timelineChart) {
      const monthCounts = {};
      this.monthKeys.forEach(m => { monthCounts[m.key] = 0; });

      filteredQuestions.forEach(q => {
        if (q.year && q.month) {
          const ym = `${q.year}-${String(q.month).padStart(2, '0')}`;
          if (monthCounts[ym] !== undefined) {
            monthCounts[ym]++;
          }
        }
      });

      const timelineData = this.monthKeys.map(m => monthCounts[m.key] || 0);
      this.timelineChart.data.labels = this.monthKeys.map(m => isEn ? m.labelEn : m.labelAr);
      this.timelineChart.data.datasets[0].label = isEn ? "Extracted Questions Count" : "عدد الأسئلة المستخرجة";
      this.timelineChart.data.datasets[0].data = timelineData;
      this.timelineChart.update();
    }

    // --- 2. Update Dynamic Faith Doughnut Chart ---
    if (this.faithChart) {
      const faithMap = {};
      filteredQuestions.forEach(q => {
        const faith = isEn ? (q.faith || q.faith_ar || "Unknown") : (q.faith_ar || "غير محدد");
        faithMap[faith] = (faithMap[faith] || 0) + 1;
      });

      const sortedFaith = Object.entries(faithMap).sort((a, b) => b[1] - a[1]).slice(0, 7);
      this.faithChart.data.labels = sortedFaith.map(x => x[0]);
      this.faithChart.data.datasets[0].data = sortedFaith.map(x => x[1]);
      this.faithChart.update();
    }
  },

  reRenderCharts(isDarkTheme = false) {
    this.initCharts(isDarkTheme);
    if (window.App && window.App.filteredQuestions) {
      this.updateCharts(window.App.filteredQuestions);
    }
  }
};
