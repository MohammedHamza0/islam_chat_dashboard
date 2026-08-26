/**
 * ChartService: Dynamic Chart.js Rendering and Live Updates
 */
window.ChartService = {
  timelineChart: null,
  faithChart: null,

  initCharts(isDarkTheme = false) {
    const textColor = isDarkTheme ? "#cbd5e1" : "#334155";
    const gridColor = isDarkTheme ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

    // 1. Timeline Chart
    const canvasTimeline = document.getElementById("timelineChart");
    if (canvasTimeline) {
      if (this.timelineChart) this.timelineChart.destroy();
      const ctxTimeline = canvasTimeline.getContext("2d");
      this.timelineChart = new Chart(ctxTimeline, {
        type: "line",
        data: {
          labels: ["أكتوبر 24", "نوفمبر 24", "ديسمبر 24", "يناير 25", "فبراير 25", "مارس 25", "أبريل 25", "مايو 25", "يونيو 25", "يوليو 25", "أغسطس 25", "سبتمبر 25", "أكتوبر 25", "نوفمبر 25", "ديسمبر 25", "يناير 26", "فبراير 26", "مارس 26"],
          datasets: [{
            label: "عدد الأسئلة المستخرجة",
            data: [10, 12, 14, 450, 680, 3200, 1100, 480, 1650, 890, 470, 510, 1280, 940, 750, 620, 480, 515],
            borderColor: "#0f3d3e",
            backgroundColor: "rgba(15, 61, 62, 0.12)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: textColor, font: { family: 'Cairo', size: 11 } }, grid: { color: gridColor } },
            y: { ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }, grid: { color: gridColor } }
          }
        }
      });
    }

    // 2. Faith Doughnut Chart
    const canvasFaith = document.getElementById("faithChart");
    if (canvasFaith) {
      if (this.faithChart) this.faithChart.destroy();
      const ctxFaith = canvasFaith.getContext("2d");
      this.faithChart = new Chart(ctxFaith, {
        type: "doughnut",
        data: {
          labels: ["مسلم ممارس", "مسيحي", "أصول الإيمان", "باحث عن الحق", "هندوسي/بوذي", "ملحد", "مسلم جديد", "أخرى"],
          datasets: [{
            data: [3224, 2272, 1634, 1073, 608, 488, 394, 1903],
            backgroundColor: ["#059669", "#7c3aed", "#0284c7", "#c59b27", "#f97316", "#dc2626", "#10b981", "#64748b"]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: textColor, font: { family: 'Cairo', size: 11 } } }
          }
        }
      });
    }
  },

  updateCharts(filteredQuestions) {
    if (!this.faithChart) return;

    // Group faith counts from filtered questions
    const faithMap = {};
    filteredQuestions.forEach(q => {
      faithMap[q.faith_ar] = (faithMap[q.faith_ar] || 0) + 1;
    });

    const sortedFaith = Object.entries(faithMap).sort((a, b) => b[1] - a[1]).slice(0, 7);
    this.faithChart.data.labels = sortedFaith.map(x => x[0]);
    this.faithChart.data.datasets[0].data = sortedFaith.map(x => x[1]);
    this.faithChart.update();
  },

  reRenderCharts(isDarkTheme) {
    this.initCharts(isDarkTheme);
  }
};
