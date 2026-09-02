/**
 * AIPanelComponent: AI-Powered Q&A Analysis Floating Sidebar (Bilingual Arabic & English)
 * v3.3 — Context Intelligence & Security Shield
 *
 * Features:
 * - Dynamic context injection: questions on current page are sent to the model in real-time
 * - Multi-page memory: previous pages are summarized and retained for cross-page analysis
 * - Context change detection: filter/page changes trigger silent context update + visual marker
 * - Security shield: client-side injection detection + hardened system prompt
 * - Multi-turn conversational follow-up with full chat history context
 */
window.AIPanelComponent = {
  isOpen: false,
  isStreaming: false,
  chatHistory: [],            // [{role:'user'|'assistant', text:'...', isMarker?:bool, isSystem?:bool}]
  currentAssistantEl: null,
  currentAssistantText: '',

  // Context Intelligence State
  pageHistory: [],            // [{summary: '...', contextKey: '...'}]
  currentContextKey: '',      // Unique key identifying current page+filter state
  _previousPageQuestions: [], // Cached questions from before context change

  // ═══════════════════════════════════════════
  //  Panel Open / Close / Toggle
  // ═══════════════════════════════════════════
  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    const panel = document.getElementById('ai-panel-container');
    const backdrop = document.getElementById('ai-panel-backdrop');
    if (!panel || !backdrop) return;

    // Close stats panel if open to avoid overlay conflicts
    if (window.StatsPanelComponent && window.StatsPanelComponent.isOpen) {
      window.StatsPanelComponent.close();
    }

    panel.classList.add('ai-panel-open');
    backdrop.classList.add('active');
    this.isOpen = true;
    this._updateFabIcon(true);

    if (GeminiService.hasApiKey()) {
      this._hideKeyBox();
      this._renderContextBar();

      // Check if context changed while panel was closed
      if (this._hasContextChanged()) {
        this._applyContextChange();
      }

      // Auto-analyze only if chat is empty
      if (this.chatHistory.length === 0) {
        this.currentContextKey = this._buildContextKey();
        this.runAutoAnalysis();
      }
    } else {
      this._showKeyBox();
      this._hideContextBar();
    }
  },

  close() {
    const panel = document.getElementById('ai-panel-container');
    const backdrop = document.getElementById('ai-panel-backdrop');
    if (!panel || !backdrop) return;

    panel.classList.remove('ai-panel-open');
    backdrop.classList.remove('active');
    this.isOpen = false;
    this._updateFabIcon(false);
  },

  _updateFabIcon(isOpen) {
    const fab = document.getElementById('ai-panel-fab');
    if (!fab) return;
    const icon = fab.querySelector('i');
    if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-wand-magic-sparkles';
  },

  // ═══════════════════════════════════════════
  //  Context Intelligence — Change Detection
  // ═══════════════════════════════════════════
  /**
   * Builds a unique key representing the current page + filter state.
   */
  _buildContextKey() {
    const page = (window.App && window.App.currentPage) ? window.App.currentPage : 1;
    const filterHash = this._getActiveFilterLabels().join('|');
    return `page${page}::${filterHash}`;
  },

  /**
   * Detects if the context (filters/page) has changed since last known state.
   */
  _hasContextChanged() {
    const newKey = this._buildContextKey();
    return newKey !== this.currentContextKey && this.currentContextKey !== '';
  },

  /**
   * Hook called from App.applyFilters() and App.renderCurrentPage() when
   * the displayed questions change. Handles context update logic.
   */
  onPageContextChanged() {
    if (!this._hasContextChanged() && this.currentContextKey !== '') return;

    // Save previous page's questions for summary generation
    if (this.currentContextKey && this._previousPageQuestions.length > 0) {
      this._savePrevPageSummary(this._previousPageQuestions);
    }

    // Cache current questions before the switch (for next transition)
    this._previousPageQuestions = this._getCurrentPageQuestions();

    // Update context key
    this.currentContextKey = this._buildContextKey();

    if (!this.isOpen) return; // Silent update — will apply when panel opens

    // Panel is open: inject context marker + show reanalyze button
    this._renderContextBar();
    this._injectContextMarker();
    this._showReanalyzeBanner();
  },

  /**
   * Saves a compressed statistical summary of the previous page's questions
   * into pageHistory. Uses StatsEngineService for zero-cost instant stats.
   */
  _savePrevPageSummary(questions) {
    if (!questions || questions.length === 0) return;

    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const lang = isEn ? 'en' : 'ar';
    const pageNum = this.pageHistory.length + 1;
    const filterLabel = this._getFilterContextString();

    const summary = GeminiService.buildPageSummary(questions, pageNum, filterLabel, lang);
    if (summary) {
      // Prevent duplicate entries for same context
      const exists = this.pageHistory.some(p => p.contextKey === this.currentContextKey);
      if (!exists) {
        this.pageHistory.push({
          contextKey: this.currentContextKey,
          summary: summary
        });
        // Keep history manageable (last 8 pages)
        if (this.pageHistory.length > 8) {
          this.pageHistory.shift();
        }
      }
    }
  },

  /**
   * Applies a context change: injects a visual marker bubble into the chat
   * and shows a "Reanalyze" banner for the new context.
   */
  _applyContextChange() {
    // Save previous questions as summary
    if (this._previousPageQuestions.length > 0) {
      this._savePrevPageSummary(this._previousPageQuestions);
    }

    this._previousPageQuestions = this._getCurrentPageQuestions();
    this.currentContextKey = this._buildContextKey();

    this._renderContextBar();

    if (this.chatHistory.length > 0) {
      this._injectContextMarker();
      this._showReanalyzeBanner();
    }
  },

  /**
   * Injects a visual context change marker into the chat conversation.
   */
  _injectContextMarker() {
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const questions = this._getCurrentPageQuestions();
    const filters = this._getActiveFilterLabels();
    const filterText = filters.length > 0 ? filters.join(' | ') : (isEn ? 'All Data' : 'كل البيانات');

    const markerText = isEn
      ? `📍 Context Updated: Now showing ${questions.length} new questions | Filters: ${filterText}`
      : `📍 تم تحديث السياق: ${questions.length} سؤال جديد معروض الآن | الفلاتر: ${filterText}`;

    // Add to history as a marker (won't be sent to API)
    this.chatHistory.push({
      role: 'assistant',
      text: markerText,
      isMarker: true
    });

    // Render the marker bubble
    const body = document.getElementById('ai-chat-body');
    if (body) {
      const el = document.createElement('div');
      el.className = 'ai-msg-bubble bubble-context-marker';
      el.innerHTML = `<i class="fa-solid fa-location-dot" style="flex-shrink:0;"></i> ${this._esc(markerText)}`;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }
  },

  /**
   * Shows a "Reanalyze with new context" banner in the chat.
   */
  _showReanalyzeBanner() {
    const body = document.getElementById('ai-chat-body');
    if (!body) return;

    // Remove existing banner if any
    const existing = body.querySelector('.ai-reanalyze-banner');
    if (existing) existing.remove();

    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const el = document.createElement('div');
    el.className = 'ai-reanalyze-banner';
    el.innerHTML = `
      <span style="font-weight:700;color:var(--brand-teal);">
        <i class="fa-solid fa-rotate"></i>
        ${isEn ? 'New questions loaded. Reanalyze?' : 'تم تحميل أسئلة جديدة. إعادة التحليل؟'}
      </span>
      <button class="ai-reanalyze-btn" onclick="AIPanelComponent.reanalyzeNewContext()">
        ${isEn ? '🔄 Analyze Now' : '🔄 تحليل فوري'}
      </button>
    `;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  },

  /**
   * Triggered when the user clicks "Reanalyze" after a context change.
   * Does NOT clear chat history — adds a new analysis on top.
   */
  reanalyzeNewContext() {
    if (this.isStreaming) return;

    // Remove the reanalyze banner
    const body = document.getElementById('ai-chat-body');
    const banner = body?.querySelector('.ai-reanalyze-banner');
    if (banner) banner.remove();

    this.runAutoAnalysis();
  },

  // ═══════════════════════════════════════════
  //  Clear Chat + Re-analyze
  // ═══════════════════════════════════════════
  clearAndReanalyze() {
    if (this.isStreaming) return;
    this.chatHistory = [];
    this.pageHistory = [];
    this._previousPageQuestions = [];
    this.currentContextKey = this._buildContextKey();
    this.currentAssistantEl = null;
    this.currentAssistantText = '';
    const body = document.getElementById('ai-chat-body');
    if (body) body.innerHTML = '';
    this._setInputDisabled(true);
    this._renderContextBar();
    if (GeminiService.hasApiKey()) {
      this.runAutoAnalysis();
    }
  },

  // ═══════════════════════════════════════════
  //  API Key Handling
  // ═══════════════════════════════════════════
  _showKeyBox() {
    const box = document.getElementById('ai-key-box');
    if (box) box.classList.remove('hidden');
    this._setInputDisabled(true);
  },

  _hideKeyBox() {
    const box = document.getElementById('ai-key-box');
    if (box) box.classList.add('hidden');
  },

  _hideContextBar() {
    const bar = document.getElementById('ai-context-bar');
    if (bar) bar.classList.add('hidden');
  },

  submitApiKey() {
    const input = document.getElementById('ai-key-input');
    if (!input) return;
    const key = input.value.trim();

    if (!key) {
      input.style.borderColor = 'var(--danger-red)';
      input.style.boxShadow = '0 0 0 3px var(--danger-red-soft)';
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }, 2000);
      return;
    }

    GeminiService.setApiKey(key);
    input.value = '';
    this._hideKeyBox();
    this._renderContextBar();

    // Initialize context tracking
    this.currentContextKey = this._buildContextKey();
    this._previousPageQuestions = this._getCurrentPageQuestions();

    if (this.chatHistory.length === 0) {
      this.runAutoAnalysis();
    }
  },

  resetApiKey() {
    if (this.isStreaming) return;
    GeminiService.clearApiKey();
    this.chatHistory = [];
    this.pageHistory = [];
    this._previousPageQuestions = [];
    this.currentContextKey = '';
    const body = document.getElementById('ai-chat-body');
    if (body) body.innerHTML = '';
    this._showKeyBox();
    this._hideContextBar();
    this._setInputDisabled(true);
  },

  // ═══════════════════════════════════════════
  //  Context Bar
  // ═══════════════════════════════════════════
  _renderContextBar() {
    const bar = document.getElementById('ai-context-bar');
    if (!bar) return;
    bar.classList.remove('hidden');

    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const filters = this._getActiveFilterLabels();
    const questions = this._getCurrentPageQuestions();
    const total = window.App ? window.App.filteredQuestions.length : 0;
    const count = questions.length;
    const historyCount = this.pageHistory.length;

    const filterLabel = isEn ? 'Filters:' : 'الفلاتر:';
    const countLabel = isEn
      ? `${count} of ${total.toLocaleString()} questions`
      : `${count} من ${total.toLocaleString()} سؤال`;

    let badgesHtml = filters.length > 0
      ? filters.map(f => `<span class="ai-context-badge" title="${f}">${f}</span>`).join('')
      : `<span class="ai-context-badge">${isEn ? 'All questions' : 'كل الأسئلة'}</span>`;

    // Memory indicator
    const memoryBadge = historyCount > 0
      ? `<span class="ai-context-badge" style="background:var(--insight-purple-soft);color:var(--insight-purple);border-color:transparent;" title="${isEn ? 'Previous pages in memory' : 'صفحات سابقة في الذاكرة'}">
           <i class="fa-solid fa-brain"></i> ${historyCount} ${isEn ? 'pages in memory' : 'صفحات محفوظة'}
         </span>`
      : '';

    bar.innerHTML = `
      <span class="ai-context-label"><i class="fa-solid fa-filter"></i> ${filterLabel}</span>
      ${badgesHtml}
      <span class="ai-context-badge" style="background:var(--benefit-green-soft);color:var(--benefit-green);border-color:transparent;margin-inline-start:auto;">
        <i class="fa-solid fa-comments"></i> ${countLabel}
      </span>
      ${memoryBadge}
    `;
  },

  _getActiveFilterLabels() {
    const filterIds = ['filter-year','filter-faith','filter-intent','filter-funnel',
                       'filter-blocker','filter-convtype','filter-topic','filter-language','filter-region'];
    const labels = [];
    filterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.value && el.value !== 'all') {
        const optText = el.options[el.selectedIndex]?.text || el.value;
        const short = optText.length > 22 ? optText.slice(0, 20) + '…' : optText;
        labels.push(short);
      }
    });
    // Also check search
    const search = (document.getElementById('live-search-input')?.value || '').trim();
    if (search) labels.push(`"${search.slice(0, 14)}…"`);
    return labels;
  },

  _getFilterContextString() {
    const labels = this._getActiveFilterLabels();
    return labels.length > 0 ? labels.join(' | ') : '';
  },

  // ═══════════════════════════════════════════
  //  Get Current Page Questions
  // ═══════════════════════════════════════════
  _getCurrentPageQuestions() {
    if (!window.App || !window.App.filteredQuestions) return [];
    const page = window.App.currentPage || 1;
    const start = (page - 1) * 18;
    return window.App.filteredQuestions.slice(start, start + 18);
  },

  // ═══════════════════════════════════════════
  //  Auto-Analysis (Initial or Reanalyze Trigger)
  // ═══════════════════════════════════════════
  async runAutoAnalysis() {
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const questions = this._getCurrentPageQuestions();

    if (questions.length === 0) {
      this._appendSystemMsg(
        isEn
          ? '⚠️ No questions displayed. Apply filters first, then click Analyze.'
          : '⚠️ لا توجد أسئلة معروضة حالياً. طبّق الفلاتر أولاً ثم اضغط تحليل.'
      );
      return;
    }

    const lang = isEn ? 'en' : 'ar';
    const filterCtx = this._getFilterContextString();
    const userPrompt = GeminiService.buildAnalysisPrompt(questions, lang, filterCtx);

    // Status message
    const statusMsg = isEn
      ? `🔍 Analyzing ${questions.length} questions (${this.pageHistory.length} previous pages in memory)...`
      : `🔍 جاري تحليل ${questions.length} سؤالاً (${this.pageHistory.length} صفحات سابقة في الذاكرة)...`;
    this._appendSystemMsg(statusMsg);

    // Add user prompt to chat history
    this.chatHistory.push({ role: 'user', text: userPrompt, isSystem: true });

    // Build dynamic system instruction
    const systemInstruction = GeminiService.buildSystemInstruction(
      questions,
      lang,
      this.pageHistory,
      filterCtx
    );

    // Build messages array (filter out markers and system-initiated prompts for cleaner API calls)
    const apiMessages = this.chatHistory
      .filter(m => !m.isMarker)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

    // Stream
    this._setInputDisabled(true);
    this._showTypingIndicator();
    const bubbleEl = this._createAssistantBubble();
    this.currentAssistantEl = bubbleEl;
    this.currentAssistantText = '';

    GeminiService.streamGenerate(
      systemInstruction,
      apiMessages,
      (chunk) => this._onChunk(chunk, bubbleEl),
      ()      => this._onDone(),
      (err)   => this._onError(err)
    );
  },

  // ═══════════════════════════════════════════
  //  Send Follow-Up Message (with Security Check)
  // ═══════════════════════════════════════════
  async sendFollowUp() {
    if (this.isStreaming) return;
    const input = document.getElementById('ai-followup-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    // 🔒 Security Shield — Layer 1: Client-Side Validation
    const validation = GeminiService.validateUserInput(text);
    if (!validation.safe) {
      if (validation.reason === 'INJECTION_DETECTED') {
        this._showSecurityWarning();
        return;
      }
      if (validation.reason === 'TOO_LONG') {
        const isEn = window.I18nService && window.I18nService.currentLang === 'en';
        this._appendErrorMsg(
          isEn
            ? '⚠️ Message too long. Maximum 2000 characters allowed.'
            : '⚠️ الرسالة طويلة جداً. الحد الأقصى 2000 حرف.'
        );
        return;
      }
      return;
    }

    input.value = '';
    input.style.height = 'auto';

    this._appendUserBubble(text);
    this.chatHistory.push({ role: 'user', text });

    // Build dynamic system instruction with CURRENT questions
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const lang = isEn ? 'en' : 'ar';
    const questions = this._getCurrentPageQuestions();
    const filterCtx = this._getFilterContextString();

    const systemInstruction = GeminiService.buildSystemInstruction(
      questions,
      lang,
      this.pageHistory,
      filterCtx
    );

    // Build API messages (filter out markers)
    const apiMessages = this.chatHistory
      .filter(m => !m.isMarker)
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

    this._setInputDisabled(true);
    this._showTypingIndicator();
    const bubbleEl = this._createAssistantBubble();
    this.currentAssistantEl = bubbleEl;
    this.currentAssistantText = '';

    // Use full history with dynamic system instruction
    GeminiService.streamGenerate(
      systemInstruction,
      apiMessages,
      (chunk) => this._onChunk(chunk, bubbleEl),
      ()      => this._onDone(),
      (err)   => this._onError(err)
    );
  },

  /**
   * Shows a security warning when prompt injection is detected.
   */
  _showSecurityWarning() {
    const body = document.getElementById('ai-chat-body');
    if (!body) return;

    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const el = document.createElement('div');
    el.className = 'ai-security-warning';
    el.innerHTML = `
      <i class="fa-solid fa-shield-halved" style="flex-shrink:0;margin-top:2px;font-size:16px;"></i>
      <div>
        <strong>${isEn ? '🔒 Security Alert' : '🔒 تنبيه أمني'}</strong><br>
        ${isEn
          ? 'Your message was blocked because it contains patterns that resemble an instruction override attempt. This assistant is specialized exclusively in analyzing Islam.chat conversation data.'
          : 'تم حظر رسالتك لأنها تحتوي على أنماط تشبه محاولة تجاوز التعليمات. هذا المساعد متخصص حصرياً في تحليل بيانات محادثات Islam.chat.'}
      </div>
    `;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  },

  // ═══════════════════════════════════════════
  //  Streaming Event Handlers
  // ═══════════════════════════════════════════
  _onChunk(chunk, el) {
    this._removeTypingIndicator();
    this.isStreaming = true;
    this.currentAssistantText += chunk;
    if (el) {
      el.innerHTML = this._formatMarkdown(this.currentAssistantText);
      const body = document.getElementById('ai-chat-body');
      if (body) body.scrollTop = body.scrollHeight;
    }
  },

  _onDone() {
    this.isStreaming = false;
    this._removeTypingIndicator();

    if (this.currentAssistantText) {
      this.chatHistory.push({ role: 'assistant', text: this.currentAssistantText });
      // Add copy button
      if (this.currentAssistantEl) {
        const wrapper = this.currentAssistantEl.closest('.ai-message');
        if (wrapper) {
          const isEn = window.I18nService && window.I18nService.currentLang === 'en';
          const copyBtn = document.createElement('button');
          copyBtn.className = 'ai-msg-copy-btn';
          copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> ${isEn ? 'Copy response' : 'نسخ الرد'}`;
          const savedText = this.currentAssistantText;
          copyBtn.onclick = () => this._copyText(copyBtn, savedText);
          wrapper.appendChild(copyBtn);
        }
      }
    }

    this.currentAssistantEl = null;
    this.currentAssistantText = '';
    this._setInputDisabled(false);

    const input = document.getElementById('ai-followup-input');
    if (input) setTimeout(() => input.focus(), 100);
  },

  _onError(err) {
    this.isStreaming = false;
    this._removeTypingIndicator();
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';

    let msg = '';
    if (err === 'NO_API_KEY') {
      msg = isEn
        ? '⚠️ No API Key found. Please enter your Gemini API Key below.'
        : '⚠️ لم يتم إدخال مفتاح الـ API. أدخله في الحقل أدناه.';
      GeminiService.clearApiKey();
      this._showKeyBox();
      this._hideContextBar();
    } else if (err && (err.includes('API_KEY_INVALID') || err.includes('403'))) {
      msg = isEn
        ? '❌ Invalid API Key. Get a valid key from Google AI Studio.'
        : '❌ مفتاح API غير صالح. احصل على مفتاح صحيح من Google AI Studio.';
      GeminiService.clearApiKey();
      this._showKeyBox();
      this._hideContextBar();
    } else if (err && err.includes('429')) {
      msg = isEn
        ? '⏳ Quota exceeded. Wait a moment and try again.'
        : '⏳ تم تجاوز حصة الطلبات. انتظر لحظة وأعد المحاولة.';
    } else {
      msg = isEn ? `❌ Connection error: ${err}` : `❌ خطأ في الاتصال: ${err}`;
    }

    this._appendErrorMsg(msg);
    this._setInputDisabled(false);
  },

  // ═══════════════════════════════════════════
  //  DOM Builders
  // ═══════════════════════════════════════════
  _clearWelcomeState() {
    const welcome = document.getElementById('ai-chat-body')?.querySelector('.ai-welcome-state');
    if (welcome) welcome.remove();
  },

  _appendSystemMsg(text) {
    const body = document.getElementById('ai-chat-body');
    if (!body) return;
    this._clearWelcomeState();
    const el = document.createElement('div');
    el.className = 'ai-msg-system';
    el.innerHTML = `<i class="fa-solid fa-circle-info"></i><span>${this._esc(text)}</span>`;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  },

  _appendErrorMsg(msg) {
    const body = document.getElementById('ai-chat-body');
    if (body) {
      this._clearWelcomeState();
      const el = document.createElement('div');
      el.className = 'ai-error-msg';
      el.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="flex-shrink:0;margin-top:2px;"></i><span>${msg}</span>`;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }
  },

  _appendUserBubble(text) {
    const body = document.getElementById('ai-chat-body');
    if (!body) return;
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
    const el = document.createElement('div');
    el.className = 'ai-message';
    el.innerHTML = `
      <div class="ai-msg-role-label lbl-user">
        <i class="fa-solid fa-circle-user"></i> ${isEn ? 'You' : 'أنت'}
      </div>
      <div class="ai-msg-bubble bubble-user">${this._esc(text).replace(/\n/g, '<br>')}</div>
    `;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  },

  _createAssistantBubble() {
    const body = document.getElementById('ai-chat-body');
    if (!body) return null;
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';

    const wrapper = document.createElement('div');
    wrapper.className = 'ai-message';

    const label = document.createElement('div');
    label.className = 'ai-msg-role-label lbl-assistant';
    label.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${isEn ? 'Gemini AI' : 'جيميني'}`;

    const bubble = document.createElement('div');
    bubble.className = 'ai-msg-bubble bubble-assistant';

    wrapper.appendChild(label);
    wrapper.appendChild(bubble);
    body.appendChild(wrapper);
    body.scrollTop = body.scrollHeight;

    return bubble;
  },

  _showTypingIndicator() {
    const body = document.getElementById('ai-chat-body');
    if (!body || body.querySelector('.ai-typing-indicator')) return;
    const el = document.createElement('div');
    el.className = 'ai-typing-indicator';
    el.innerHTML = `
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
      <div class="ai-typing-dot"></div>
    `;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  },

  _removeTypingIndicator() {
    const el = document.getElementById('ai-chat-body')?.querySelector('.ai-typing-indicator');
    if (el) el.remove();
  },

  _setInputDisabled(disabled) {
    const input = document.getElementById('ai-followup-input');
    const btn   = document.getElementById('ai-send-btn');
    const row   = document.querySelector('.ai-panel-input-row');
    if (input) input.disabled = disabled;
    if (btn)   btn.disabled   = disabled;
    if (row)   row.classList.toggle('input-disabled', disabled);
  },

  // ═══════════════════════════════════════════
  //  Text Formatting (Lightweight Markdown)
  // ═══════════════════════════════════════════
  _formatMarkdown(text) {
    if (!text) return '';
    let html = this._esc(text);

    // Bold: **text**
    html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    // Bold: __text__
    html = html.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');

    // Process line by line for lists and headings
    const lines = html.split('\n');
    const result = [];
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { result.push('</ul>'); inList = false; }
        result.push('');
        return;
      }

      // Numbered list
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      // Bullet list
      const bulletMatch = trimmed.match(/^[-•*]\s+(.*)/);
      // Emoji heading (🔍 **...**)
      const headingMatch = trimmed.match(/^([🔍🎯⚠️🏆✅❌⚡📊💡🌟📍🔒]+)\s+\*\*(.+)\*\*/);

      if (headingMatch) {
        if (inList) { result.push('</ul>'); inList = false; }
        result.push(`<p style="font-weight:800;font-size:13.5px;color:var(--brand-teal);margin:10px 0 4px;">${headingMatch[1]} <strong>${headingMatch[2]}</strong></p>`);
      } else if (numMatch) {
        if (!inList) { result.push('<ul style="list-style:none;padding:0;margin:4px 0;">'); inList = true; }
        result.push(`<li style="display:flex;gap:8px;margin-bottom:5px;"><span style="font-weight:800;color:var(--brand-teal);min-width:18px;">${numMatch[1]}.</span><span>${numMatch[2]}</span></li>`);
      } else if (bulletMatch) {
        if (!inList) { result.push('<ul style="list-style:none;padding:0;margin:4px 0;">'); inList = true; }
        result.push(`<li style="display:flex;gap:8px;margin-bottom:5px;"><span style="color:var(--brand-teal);min-width:14px;">•</span><span>${bulletMatch[1]}</span></li>`);
      } else {
        if (inList) { result.push('</ul>'); inList = false; }
        result.push(`<p style="margin-bottom:6px;">${trimmed}</p>`);
      }
    });

    if (inList) result.push('</ul>');
    return result.join('');
  },

  _esc(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  // ═══════════════════════════════════════════
  //  Copy to Clipboard
  // ═══════════════════════════════════════════
  _copyText(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
      const isEn = window.I18nService && window.I18nService.currentLang === 'en';
      const orig = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> ${isEn ? 'Copied!' : 'تم النسخ!'}`;
      btn.style.color = 'var(--benefit-green)';
      btn.style.borderColor = 'var(--benefit-green)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2200);
    }).catch(() => {});
  },

  // ═══════════════════════════════════════════
  //  Input Event Handlers (called from HTML)
  // ═══════════════════════════════════════════
  onInputKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      AIPanelComponent.sendFollowUp();
    }
  },

  onInputResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 110) + 'px';
  }
};

// ── Global shortcuts ──
window.toggleAIPanel  = () => AIPanelComponent.toggle();
window.closeAIPanel   = () => AIPanelComponent.close();
