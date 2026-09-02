/**
 * StatsPanelComponent: Statistical Intelligence Sidebar Component (Bilingual Arabic & English)
 * Renders instantaneous, deep quantitative & text intelligence across all filtered questions.
 * Zero API Key requirement • 100% offline & instantaneous (<50ms).
 */
window.StatsPanelComponent = {
  isOpen: false,
  currentReport: null,

  // ═══════════════════════════════════════════
  //  Panel Open / Close / Toggle
  // ═══════════════════════════════════════════
  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    const container = document.getElementById('stats-panel-container');
    const backdrop = document.getElementById('stats-panel-backdrop');
    if (!container || !backdrop) return;

    // If AI Panel is open, close it to prevent overlay conflicts
    if (window.AIPanelComponent && window.AIPanelComponent.isOpen) {
      window.AIPanelComponent.close();
    }

    container.classList.add('stats-panel-open');
    backdrop.classList.add('active');
    this.isOpen = true;
    this._updateFabIcon(true);

    this.refreshReport();
  },

  close() {
    const container = document.getElementById('stats-panel-container');
    const backdrop = document.getElementById('stats-panel-backdrop');
    if (!container || !backdrop) return;

    container.classList.remove('stats-panel-open');
    backdrop.classList.remove('active');
    this.isOpen = false;
    this._updateFabIcon(false);
  },

  _updateFabIcon(isOpen) {
    const fab = document.getElementById('stats-panel-fab');
    if (!fab) return;
    const icon = fab.querySelector('i');
    if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-chart-column';
  },

  // ═══════════════════════════════════════════
  //  Generate & Render Report
  // ═══════════════════════════════════════════
  refreshReport() {
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const lang = isEn ? 'en' : 'ar';

    const filtered = (window.App && window.App.filteredQuestions) ? window.App.filteredQuestions : [];
    const all = (window.App && window.App.allQuestions) ? window.App.allQuestions : filtered;

    this.currentReport = StatsEngineService.generateFullReport(filtered, all, lang);
    this._renderUI(this.currentReport, isEn);
  },

  _renderUI(report, isEn) {
    const contextBar = document.getElementById('stats-context-bar');
    const body = document.getElementById('stats-report-body');
    if (!body) return;

    // 1. Render Context Bar
    if (contextBar) {
      const activeFilters = this._getActiveFilterLabels();
      const filterSummary = activeFilters.length > 0
        ? activeFilters.map(f => `<span class="stats-badge-chip" title="${f}">${f}</span>`).join('')
        : `<span class="stats-badge-chip">${isEn ? 'All Dataset' : 'كامل قاعدة البيانات'}</span>`;

      contextBar.innerHTML = `
        <span class="stats-context-label"><i class="fa-solid fa-filter"></i> ${isEn ? 'Cohort:' : 'الفئة:'}</span>
        ${filterSummary}
        <span class="stats-badge-chip badge-count">
          <i class="fa-solid fa-layer-group"></i> ${report.metadata.totalFiltered.toLocaleString()} ${isEn ? 'Questions' : 'سؤال'} (${report.metadata.percentageOfTotal}%)
        </span>
        <span class="stats-badge-chip badge-speed" title="Computation speed">
          <i class="fa-solid fa-bolt"></i> ${report.metadata.calcTimeMs}ms
        </span>
      `;
    }

    // 2. Build Report Sections
    let html = '';

    // Section 1: Strategic Recommendations
    html += this._renderRecommendationsSection(report.recommendations, isEn);

    // Section 2: Intellectual Blockers Distribution
    html += this._renderDistributionCard(
      isEn ? 'Key Intellectual Blockers' : 'أبرز العوائق والشبهات الفكرية',
      'fa-shield-halved',
      report.distributions.blocker,
      'fill-gold',
      isEn ? 'Blockers' : 'العوائق'
    );

    // Section 3: Faith & Intent Breakdown
    html += this._renderDualDistributionCard(
      isEn ? 'Seekers Faith & Intent Profile' : 'توزيع معتقدات ونوايا السائلين',
      'fa-users-viewfinder',
      report.distributions.faith,
      report.distributions.intent,
      isEn
    );

    // Section 4: Temporal Intelligence & Peaks
    html += this._renderTemporalCard(report.temporal, isEn);

    // Section 5: NLP Text Mining & Keywords (TF-IDF)
    html += this._renderKeywordCard(report.textIntel, isEn);

    // Section 6: AI Performance Diagnostics (Low Richness vs High Volume)
    html += this._renderDiagnosticsCard(report.correlations, isEn);

    // Section 7: High Priority Questions (Top Trending & Urgent Fixes)
    html += this._renderPrioritiesCard(report.priorities, isEn);

    body.innerHTML = html;
    body.scrollTop = 0;
  },

  // ═══════════════════════════════════════════
  //  Section Renderers
  // ═══════════════════════════════════════════
  _renderRecommendationsSection(recs, isEn) {
    if (!recs || recs.length === 0) return '';
    const title = isEn ? 'Automated Strategic Recommendations' : 'التوصيات الدعوية والتشغيلية المباشرة';

    const cardsHtml = recs.map(r => `
      <div class="stats-rec-card rec-${r.type}">
        <div class="stats-rec-title">
          <i class="fa-solid ${r.icon}"></i> ${r.title}
        </div>
        <p>${r.description}</p>
      </div>
    `).join('');

    return `
      <div class="stats-card" style="border-inline-start: 4px solid var(--brand-teal);">
        <div class="stats-card-header">
          <div class="stats-card-title">
            <i class="fa-solid fa-wand-magic-sparkles" style="color:var(--brand-gold);"></i> ${title}
          </div>
          <span class="stats-card-tag" style="background:var(--brand-teal-soft);color:var(--brand-teal);">
            ${isEn ? 'Actionable AI' : 'توجيه فوري'}
          </span>
        </div>
        <div class="stats-recs-container">
          ${cardsHtml}
        </div>
      </div>
    `;
  },

  _renderDistributionCard(title, icon, items, fillClass = '', tag = '') {
    if (!items || items.length === 0) return '';

    const barsHtml = items.map(item => `
      <div class="stat-bar-item">
        <div class="stat-bar-labels">
          <span class="stat-bar-name" title="${this._esc(item.label)}">${this._esc(item.label)}</span>
          <span class="stat-bar-val">
            <strong>${item.pct}%</strong> (${item.count.toLocaleString()})
          </span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill ${fillClass}" style="width: ${Math.max(item.pct, 3)}%;"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="stats-card">
        <div class="stats-card-header">
          <div class="stats-card-title">
            <i class="fa-solid ${icon}"></i> ${title}
          </div>
          ${tag ? `<span class="stats-card-tag">${tag}</span>` : ''}
        </div>
        <div class="stat-bars-container">
          ${barsHtml}
        </div>
      </div>
    `;
  },

  _renderDualDistributionCard(title, icon, faithItems, intentItems, isEn) {
    const renderBars = (list, fillClass) => (list || []).slice(0, 4).map(item => `
      <div class="stat-bar-item">
        <div class="stat-bar-labels">
          <span class="stat-bar-name">${this._esc(item.label)}</span>
          <span class="stat-bar-val"><strong>${item.pct}%</strong></span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill ${fillClass}" style="width: ${Math.max(item.pct, 3)}%;"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="stats-card">
        <div class="stats-card-header">
          <div class="stats-card-title">
            <i class="fa-solid ${icon}"></i> ${title}
          </div>
          <span class="stats-card-tag">${isEn ? 'Demographics' : 'ديموغرافيا'}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div>
            <div style="font-size:11px;font-weight:800;color:var(--brand-teal);margin-bottom:6px;">
              <i class="fa-solid fa-cross"></i> ${isEn ? 'Faith Backgrounds:' : 'الخلفية الدينية السابقة:'}
            </div>
            <div class="stat-bars-container">
              ${renderBars(faithItems, 'fill-teal')}
            </div>
          </div>
          <div style="border-top:1px dashed var(--border-color);padding-top:10px;">
            <div style="font-size:11px;font-weight:800;color:var(--brand-gold);margin-bottom:6px;">
              <i class="fa-solid fa-compass"></i> ${isEn ? 'Intent & Motive:' : 'نية ودافع السؤال:'}
            </div>
            <div class="stat-bars-container">
              ${renderBars(intentItems, 'fill-gold')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderTemporalCard(temporal, isEn) {
    if (!temporal) return '';

    const peakMonthStr = temporal.peakMonth ? temporal.peakMonth.key : 'N/A';
    const peakHourStr = temporal.peakHour ? `${temporal.peakHour.hour % 12 || 12}:00 ${temporal.peakHour.hour >= 12 ? (isEn ? 'PM' : 'م') : (isEn ? 'AM' : 'ص')}` : 'N/A';

    let trendIcon = 'fa-arrow-right';
    let trendClass = '';
    let trendLabel = isEn ? 'Stable' : 'مستقر';

    if (temporal.trendDirection === 'up') {
      trendIcon = 'fa-arrow-trend-up';
      trendClass = 'trend-indicator-up';
      trendLabel = isEn ? `Growing (+${temporal.growthPct}%)` : `صاعد (+${temporal.growthPct}%)`;
    } else if (temporal.trendDirection === 'down') {
      trendIcon = 'fa-arrow-trend-down';
      trendClass = 'trend-indicator-down';
      trendLabel = isEn ? `Declining (${temporal.growthPct}%)` : `هابط (${temporal.growthPct}%)`;
    }

    return `
      <div class="stats-card">
        <div class="stats-card-header">
          <div class="stats-card-title">
            <i class="fa-solid fa-clock-rotate-left"></i> ${isEn ? 'Temporal Dynamics & Peak Windows' : 'التحليل الزمني وساعات الذروة'}
          </div>
          <span class="stats-card-tag">${isEn ? 'Temporal' : 'زمني'}</span>
        </div>
        <div class="stats-mini-grid">
          <div class="stats-mini-metric">
            <span class="stats-mini-metric-lbl">${isEn ? 'Trajectory' : 'اتجاه النمو'}</span>
            <span class="stats-mini-metric-val ${trendClass}">
              <i class="fa-solid ${trendIcon}"></i> ${trendLabel}
            </span>
          </div>
          <div class="stats-mini-metric">
            <span class="stats-mini-metric-lbl">${isEn ? 'Peak Hour' : 'ساعة الذروة'}</span>
            <span class="stats-mini-metric-val" style="color:var(--data-blue);">
              ${peakHourStr}
            </span>
          </div>
          <div class="stats-mini-metric">
            <span class="stats-mini-metric-lbl">${isEn ? 'Peak Month' : 'أعلى الشهور'}</span>
            <span class="stats-mini-metric-val">
              ${peakMonthStr}
            </span>
          </div>
        </div>
      </div>
    `;
  },

  _renderKeywordCard(textIntel, isEn) {
    if (!textIntel || (!textIntel.topWords.length && !textIntel.topBigrams.length)) return '';

    const wordPills = textIntel.topWords.map((w, idx) => `
      <span class="stats-keyword-pill ${idx < 4 ? 'top-tier' : ''}">
        ${this._esc(w.word)} <span class="kw-count">${w.count}</span>
      </span>
    `).join('');

    const bigramPills = textIntel.topBigrams.map(b => `
      <span class="stats-keyword-pill" style="border-style:dashed;">
        <i class="fa-solid fa-quote-right" style="font-size:9px;opacity:0.6;"></i> ${this._esc(b.phrase)} <span class="kw-count">${b.count}</span>
      </span>
    `).join('');

    return `
      <div class="stats-card">
        <div class="stats-card-header">
          <div class="stats-card-title">
            <i class="fa-solid fa-brain"></i> ${isEn ? 'NLP Keyword & Semantic Concepts' : 'سحابة المفاهيم والكلمات البارزة (TF-IDF)'}
          </div>
          <span class="stats-card-tag">${isEn ? 'Text Mining' : 'تعدين نصوص'}</span>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:7px;">
            ${isEn ? 'Core Keywords:' : 'أبرز الكلمات المفتاحية الأكثر دلالة:'}
          </div>
          <div class="stats-keyword-cloud">
            ${wordPills}
          </div>
        </div>
        ${textIntel.topBigrams.length > 0 ? `
          <div style="border-top:1px dashed var(--border-color);padding-top:8px;margin-top:4px;">
            <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:7px;">
              ${isEn ? 'Frequent 2-Word Phrases:' : 'العبارات الثنائية الشائعة:'}
            </div>
            <div class="stats-keyword-cloud">
              ${bigramPills}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  _renderDiagnosticsCard(correlations, isEn) {
    if (!correlations || !correlations.richnessByTopic.length) return '';

    const weakTopics = correlations.richnessByTopic.slice(0, 3).map(t => `
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:11.5px;padding:4px 0;border-bottom:1px solid var(--border-color);">
        <span style="font-weight:700;color:var(--text-primary);"><i class="fa-solid fa-book-open" style="color:var(--warning-amber);margin-inline-end:5px;"></i>${t.topic}</span>
        <span style="font-weight:800;color:var(--danger-red);">${t.avgRichness} ${isEn ? 'chars avg' : 'حرف'} (${t.count} ${isEn ? 'Q' : 'سؤال'})</span>
      </div>
    `).join('');

    return `
      <div class="stats-card">
        <div class="stats-card-header">
          <div class="stats-card-title">
            <i class="fa-solid fa-chart-line"></i> ${isEn ? 'AI Response Richness & Topic Diagnostics' : 'تشخيص جودة ردود البوت حسب الباب'}
          </div>
          <span class="stats-card-tag" style="background:var(--danger-red-soft);color:var(--danger-red);">${isEn ? 'Quality' : 'جودة الردود'}</span>
        </div>
        <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.5;">
          ${isEn ? 'Cohorts with lowest average answer length (candidates for prompt refinement):' : 'الأبواب ذات أقصر إجابات للبوت (أولى بالمراجعة والإثراء الشرعي):'}
        </div>
        <div>
          ${weakTopics}
        </div>
        <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">
          <i class="fa-solid fa-circle-info"></i> ${isEn ? `Overall cohort average: ${correlations.avgRichness} characters per response.` : `المعدل العام للمجموعة الحالية: ${correlations.avgRichness} حرفاً لكل إجابة.`}
        </div>
      </div>
    `;
  },

  _renderPrioritiesCard(priorities, isEn) {
    if (!priorities) return '';

    const trendingItems = (priorities.topTrending || []).slice(0, 2).map(q => `
      <div class="stats-priority-card">
        <div class="stats-priority-meta">
          <span class="stats-priority-badge badge-trending">
            <i class="fa-solid fa-fire"></i> ${isEn ? 'Trending' : 'شديد التكرار'} (${q.cluster_size || 1} ${isEn ? 'times' : 'تكرار'})
          </span>
          <span style="font-size:10.5px;color:var(--text-muted);">${q.faith_ar || q.faith || ''}</span>
        </div>
        <div class="stats-priority-question">"${this._esc((q.question || '').slice(0, 130))}..."</div>
      </div>
    `).join('');

    const urgentItems = (priorities.needsImprovement || []).slice(0, 2).map(q => `
      <div class="stats-priority-card" style="border-inline-start:3px solid var(--danger-red);">
        <div class="stats-priority-meta">
          <span class="stats-priority-badge badge-weak-ans">
            <i class="fa-solid fa-wrench"></i> ${isEn ? 'Urgent Fix' : 'يحتاج إثراء فوري'} (${q.answer_richness || 0} ${isEn ? 'chars' : 'حرف'})
          </span>
          <span style="font-size:10.5px;color:var(--text-muted);">${q.key_blocker_ar || ''}</span>
        </div>
        <div class="stats-priority-question">"${this._esc((q.question || '').slice(0, 130))}..."</div>
      </div>
    `).join('');

    if (!trendingItems && !urgentItems) return '';

    return `
      <div class="stats-card">
        <div class="stats-card-header">
          <div class="stats-card-title">
            <i class="fa-solid fa-list-check"></i> ${isEn ? 'Priority Action Questions' : 'الأسئلة ذات الأولوية التشغيلية'}
          </div>
          <span class="stats-card-tag">${isEn ? 'Action Items' : 'أولويات'}</span>
        </div>
        <div class="stats-priority-list">
          ${trendingItems}
          ${urgentItems}
        </div>
      </div>
    `;
  },

  // ═══════════════════════════════════════════
  //  Export Markdown Report
  // ═══════════════════════════════════════════
  exportMarkdownReport() {
    if (!this.currentReport) this.refreshReport();
    const rep = this.currentReport;
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';

    let md = '';
    md += `# 📊 ${isEn ? 'Statistical Intelligence Report' : 'التقرير الإحصائي الذكي لمنصة Islam.chat'}\n`;
    md += `**${isEn ? 'Generated At:' : 'تاريخ التوليد:'}** ${new Date().toLocaleString()}  \n`;
    md += `**${isEn ? 'Cohort Size:' : 'حجم الفئة المفلترة:'}** ${rep.metadata.totalFiltered.toLocaleString()} / ${rep.metadata.totalAll.toLocaleString()} (${rep.metadata.percentageOfTotal}%)  \n`;
    md += `**${isEn ? 'Execution Time:' : 'زمن التحليل الإحصائي:'}** ${rep.metadata.calcTimeMs}ms (Zero API Cost)  \n\n`;
    md += `---\n\n`;

    // 1. Recommendations
    md += `## 🎯 ${isEn ? 'Automated Strategic Recommendations' : 'التوصيات الاستراتيجية الدعوية'}\n\n`;
    rep.recommendations.forEach((r, idx) => {
      md += `${idx + 1}. **${r.title}**\n   ${r.description}\n\n`;
    });

    // 2. Blockers Distribution
    md += `## 🛡️ ${isEn ? 'Key Intellectual Blockers' : 'توزيع العوائق والشبهات الفكرية'}\n\n`;
    md += `| ${isEn ? 'Blocker' : 'العائق الفكري'} | ${isEn ? 'Count' : 'العدد'} | ${isEn ? 'Percentage' : 'النسبة'} |\n`;
    md += `|---|---|---|\n`;
    rep.distributions.blocker.forEach(b => {
      md += `| ${b.label} | ${b.count.toLocaleString()} | ${b.pct}% |\n`;
    });
    md += `\n`;

    // 3. Faith Demographics
    md += `## 👥 ${isEn ? 'Seekers Faith Background' : 'توزيع الديانات السابقة للسائلين'}\n\n`;
    md += `| ${isEn ? 'Faith' : 'الديانة'} | ${isEn ? 'Count' : 'العدد'} | ${isEn ? 'Percentage' : 'النسبة'} |\n`;
    md += `|---|---|---|\n`;
    rep.distributions.faith.forEach(f => {
      md += `| ${f.label} | ${f.count.toLocaleString()} | ${f.pct}% |\n`;
    });
    md += `\n`;

    // 4. Keywords
    md += `## 🧠 ${isEn ? 'Top NLP Keywords (TF-IDF)' : 'أبرز الكلمات والمفاهيم البارزة'}\n\n`;
    md += rep.textIntel.topWords.map(w => `\`${w.word}\` (${w.count})`).join(' · ') + `\n\n`;

    // Trigger file download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `islam_chat_intelligence_report_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // ═══════════════════════════════════════════
  //  Helpers
  // ═══════════════════════════════════════════
  _getActiveFilterLabels() {
    const filterIds = ['filter-year','filter-faith','filter-intent','filter-funnel',
                       'filter-blocker','filter-convtype','filter-topic','filter-language','filter-region'];
    const labels = [];
    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value && el.value !== 'all') {
        const optText = el.options[el.selectedIndex]?.text || el.value;
        const short = optText.length > 20 ? optText.slice(0, 18) + '…' : optText;
        labels.push(short);
      }
    });
    const search = (document.getElementById('live-search-input')?.value || '').trim();
    if (search) labels.push(`"${search.slice(0, 12)}…"`);
    return labels;
  },

  _esc(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};

// Global shortcuts
window.toggleStatsPanel = () => StatsPanelComponent.toggle();
window.closeStatsPanel  = () => StatsPanelComponent.close();
