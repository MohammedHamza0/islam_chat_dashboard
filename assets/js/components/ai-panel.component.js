/**
 * AIPanelComponent: AI-Powered Q&A Analysis Floating Sidebar (Bilingual Arabic & English)
 * Analyzes the 18 currently displayed questions using Gemini API with streaming support.
 * Includes multi-turn conversational follow-up with full chat history context.
 */
window.AIPanelComponent = {
  isOpen: false,
  isStreaming: false,
  chatHistory: [],        // [{role:'user'|'assistant', text:'...'}]
  currentAssistantEl: null,
  currentAssistantText: '',

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

    panel.classList.add('ai-panel-open');
    backdrop.classList.add('active');
    this.isOpen = true;
    this._updateFabIcon(true);

    if (GeminiService.hasApiKey()) {
      this._hideKeyBox();
      this._renderContextBar();
      // Auto-analyze only if chat is empty
      if (this.chatHistory.length === 0) {
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
  //  Clear Chat + Re-analyze
  // ═══════════════════════════════════════════
  clearAndReanalyze() {
    if (this.isStreaming) return;
    this.chatHistory = [];
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
    if (this.chatHistory.length === 0) {
      this.runAutoAnalysis();
    }
  },

  resetApiKey() {
    if (this.isStreaming) return;
    GeminiService.clearApiKey();
    this.chatHistory = [];
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

    const filterLabel = isEn ? 'Filters:' : 'الفلاتر:';
    const countLabel = isEn
      ? `${count} of ${total.toLocaleString()} questions`
      : `${count} من ${total.toLocaleString()} سؤال`;

    let badgesHtml = filters.length > 0
      ? filters.map(f => `<span class="ai-context-badge" title="${f}">${f}</span>`).join('')
      : `<span class="ai-context-badge">${isEn ? 'All questions' : 'كل الأسئلة'}</span>`;

    bar.innerHTML = `
      <span class="ai-context-label"><i class="fa-solid fa-filter"></i> ${filterLabel}</span>
      ${badgesHtml}
      <span class="ai-context-badge" style="background:var(--benefit-green-soft);color:var(--benefit-green);border-color:transparent;margin-inline-start:auto;">
        <i class="fa-solid fa-comments"></i> ${countLabel}
      </span>
    `;
  },

  _getActiveFilterLabels() {
    const isEn = window.I18nService && window.I18nService.currentLang === 'en';
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
  //  Auto-Analysis (Initial Trigger)
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
    const prompt = GeminiService.buildAnalysisPrompt(questions, lang, filterCtx);

    // Status message
    const statusMsg = isEn
      ? `🔍 Analyzing ${questions.length} displayed questions...`
      : `🔍 جاري تحليل ${questions.length} سؤالاً معروضاً...`;
    this._appendSystemMsg(statusMsg);

    // Add to history
    this.chatHistory.push({ role: 'user', text: prompt });

    // Stream
    this._setInputDisabled(true);
    this._showTypingIndicator();
    const bubbleEl = this._createAssistantBubble();
    this.currentAssistantEl = bubbleEl;
    this.currentAssistantText = '';

    GeminiService.streamGenerate(
      GeminiService.buildMessagesArray(this.chatHistory.slice(-1)),
      (chunk) => this._onChunk(chunk, bubbleEl),
      ()      => this._onDone(),
      (err)   => this._onError(err)
    );
  },

  // ═══════════════════════════════════════════
  //  Send Follow-Up Message
  // ═══════════════════════════════════════════
  async sendFollowUp() {
    if (this.isStreaming) return;
    const input = document.getElementById('ai-followup-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';

    this._appendUserBubble(text);
    this.chatHistory.push({ role: 'user', text });

    this._setInputDisabled(true);
    this._showTypingIndicator();
    const bubbleEl = this._createAssistantBubble();
    this.currentAssistantEl = bubbleEl;
    this.currentAssistantText = '';

    // Use full history for multi-turn context
    GeminiService.streamGenerate(
      GeminiService.buildMessagesArray(this.chatHistory),
      (chunk) => this._onChunk(chunk, bubbleEl),
      ()      => this._onDone(),
      (err)   => this._onError(err)
    );
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

    const body = document.getElementById('ai-chat-body');
    if (body) {
      const el = document.createElement('div');
      el.className = 'ai-error-msg';
      el.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="flex-shrink:0;margin-top:2px;"></i><span>${msg}</span>`;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }

    this._setInputDisabled(false);
  },

  // ═══════════════════════════════════════════
  //  DOM Builders
  // ═══════════════════════════════════════════
  _appendSystemMsg(text) {
    const body = document.getElementById('ai-chat-body');
    if (!body) return;
    const el = document.createElement('div');
    el.className = 'ai-msg-system';
    el.innerHTML = `<i class="fa-solid fa-circle-info"></i><span>${this._esc(text)}</span>`;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
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
      const headingMatch = trimmed.match(/^([🔍🎯⚠️🏆✅❌⚡📊💡🌟]+)\s+\*\*(.+)\*\*/);

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
