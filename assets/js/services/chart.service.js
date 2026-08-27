/**
 * ChartService: Dynamic Chart.js Rendering and Live Updates (100% LLM Ground Truth)
 */
window.ChartService = {
  timelineChart: null,
  faithChart: null,

  monthKeys: [
    { key: "2024-10", label: "أكتوبر 24" },
    { key: "2024-11", label: "نوفمبر 24" },
    { key: "2024-12", label: "ديسمبر 24" },
    { key: "2025-01", label: "يناير 25" },
    { key: "2025-02", label: "فبراير 25" },
    { key: "2025-03", label: "مارس 25" },
    { key: "2025-04", label: "أبريل 25" },
    { key: "2025-05", label: "مايو 25" },
    { key: "2025-06", label: "يونيو 25" },
    { key: "2025-07", label: "يوليو 25" },
    { key: "2025-08", label: "أغسطس 25" },
    { key: "2025-09", label: "سبتمبر 25" },
    { key: "2025-10", label: "أكتوبر 25" },
    { key: "2025-11", label: "نوفمبر 25" },
    { key: "2025-12", label: "ديسمبر 25" },
    { key: "2026-01", label: "يناير 26" },
    { key: "2026-02", label: "فبراير 26" },
    { key: "2026-03", label: "مارس 26" }
  ],

  initCharts(isDarkTheme = false) {
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
          labels: this.monthKeys.map(m => m.label),
          datasets: [{
            label: "عدد الأسئلة المستخرجة",
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
                label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} سؤالاً مطابقاً`
              }
            }
          },
          scales: {
            x: {
              ticks: { color: textColor, font: { family: 'Cairo', size: 11 } },
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
          labels: ["الإسلام", "المسيحية", "غير محدد", "الإلحاد", "اللاأدرية", "الهندوسية", "أخرى"],
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
              labels: { color: textColor, font: { family: 'Cairo', size: 11 } }
            }
          }
        }
      });
    }
  },

  updateCharts(filteredQuestions) {
    if (!filteredQuestions) return;

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
      this.timelineChart.data.datasets[0].data = timelineData;
      this.timelineChart.update();
    }

    // --- 2. Update Dynamic Faith Doughnut Chart ---
    if (this.faithChart) {
      const faithMap = {};
      filteredQuestions.forEach(q => {
        const faith = q.faith_ar || "غير محدد";
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
