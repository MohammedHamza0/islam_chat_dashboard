/**
 * DialogueModalComponent: Enhanced Dialogue Viewer with AI Summary & Smart Text Formatting (Bilingual)
 */
window.DialogueModalComponent = {
  currentZoomPct: 100,

  async openModal(chatId) {
    const modal = document.getElementById("dialogue-modal");
    const titleId = document.getElementById("modal-chat-id");
    const body = document.getElementById("modal-chat-body");
    const statsContainer = document.getElementById("modal-stats-container");

    if (!modal || !body) return;

    const isEn = window.I18nService && window.I18nService.currentLang === "en";

    if (titleId) titleId.textContent = chatId;
    if (statsContainer) statsContainer.innerHTML = "";
    body.innerHTML = `<div style="text-align:center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:26px; color: var(--brand-teal);"></i><br><br>${isEn ? "Loading full dialogue and AI summary..." : "جاري تحميل المحادثة الأصلية وتنسيق الردود..."}</div>`;
    modal.classList.add("active");

    const conv = await ApiService.getConversationById(chatId);

    if (!conv || !conv.full_conversation) {
      body.innerHTML = `<div style="text-align:center; padding: 30px; color: var(--text-muted);">${isEn ? "No original dialogue found for #" + chatId : "تعذر العثور على نص المحادثة الأصلية للرقم #" + chatId}</div>`;
      return;
    }

    // 1. AI Summary Header Box
    let summaryHtml = "";
    if (conv.summary) {
      const isMuslimBadge = conv.is_muslim ? 
        `<span class="badge badge-topic"><i class="fa-solid fa-check"></i> ${isEn ? 'Existing Muslim' : 'مسلم قائم'}</span>` : 
        `<span class="badge badge-faith"><i class="fa-solid fa-user-plus"></i> ${isEn ? 'Target Seeker' : 'غير مسلم / مستهدف'}</span>`;
      
      const blockerBadge = (conv.key_blocker && conv.key_blocker !== "N/A" && conv.key_blocker !== "None") ? 
        `<span class="badge" style="background:var(--warning-amber-soft); color:var(--warning-amber);"><i class="fa-solid fa-shield-halved"></i> ${isEn ? 'Blocker: ' : 'عائق: '}${conv.key_blocker}</span>` : "";

      const summaryHeader = isEn ? "AI Executive Conversation Summary" : "ملخص المحادثة بالذكاء الاصطناعي (AI Summary)";
      const arrowSymbol = isEn ? "➡️" : "⬅️";

      summaryHtml = `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 18px; box-shadow: var(--shadow-sm);">
          <div style="font-size: 13.5px; font-weight: 800; color: var(--brand-teal); margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span><i class="fa-solid fa-wand-magic-sparkles"></i> ${summaryHeader}</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${isMuslimBadge}
              <span class="badge badge-intent"><i class="fa-solid fa-bullseye"></i> ${conv.intent || ''}</span>
              ${blockerBadge}
              <span class="badge badge-lang"><i class="fa-solid fa-heart-pulse"></i> ${conv.start_mood || 'Neutral'} ${arrowSymbol} ${conv.end_mood || 'Neutral'}</span>
            </div>
          </div>
          <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.7; margin: 0;">${QaCardComponent.escapeHtml(conv.summary)}</p>
        </div>
      `;
    }

    // 2. Parse & Format Chat Messages
    const rawLines = conv.full_conversation.split("\n");
    const messages = [];
    let currentRole = null;
    let currentText = [];

    rawLines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith("User:")) {
        if (currentRole && currentText.length) {
          messages.push({ role: currentRole, text: currentText.join("\n") });
          currentText = [];
        }
        currentRole = "user";
        currentText.push(trimmed.replace(/^User:\s*/, ''));
      } else if (trimmed.startsWith("AI:") || trimmed.startsWith("Bot:")) {
        if (currentRole && currentText.length) {
          messages.push({ role: currentRole, text: currentText.join("\n") });
          currentText = [];
        }
        currentRole = "ai";
        currentText.push(trimmed.replace(/^(AI|Bot):\s*/, ''));
      } else {
        if (!currentRole) currentRole = "user";
        currentText.push(trimmed);
      }
    });

    if (currentRole && currentText.length) {
      messages.push({ role: currentRole, text: currentText.join("\n") });
    }

    // Count stats
    let totalWords = 0;
    messages.forEach(m => {
      totalWords += (m.text.match(/\S+/g) || []).length;
    });

    if (statsContainer) {
      const msgLabel = isEn ? "Messages" : "رسائل";
      const wordsLabel = isEn ? "Words" : "كلمة";
      statsContainer.innerHTML = `
        <div class="modal-stats-badge">
          <i class="fa-solid fa-comments"></i> ${messages.length} ${msgLabel} &bull; ${totalWords.toLocaleString()} ${wordsLabel}
        </div>
      `;
    }

    // Build Messages HTML
    let messagesHtml = messages.map((msg, idx) => {
      if (msg.role === "user") {
        return this.renderUserBubble(msg.text, idx + 1, isEn);
      } else {
        return this.renderAiBubble(msg.text, idx + 1, isEn);
      }
    }).join("");

    body.innerHTML = summaryHtml + messagesHtml;
  },

  renderUserBubble(text, index, isEn) {
    const roleTitle = isEn ? "User Inquiry" : "سؤال / رسالة المستخدم";
    const escapedText = QaCardComponent.escapeHtml(text);
    return `
      <div class="chat-bubble chat-bubble-user">
        <div class="bubble-header">
          <span class="bubble-role-badge bubble-role-user">
            <i class="fa-solid fa-circle-user"></i> ${roleTitle} #${index}
          </span>
        </div>
        <div class="chat-body-content">
          ${escapedText.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  },

  renderAiBubble(text, index, isEn) {
    const roleTitle = isEn ? "Islam.chat AI Assistant" : "إجابة مساعد Islam.chat";
    const copyLabel = isEn ? "Copy" : "نسخ";
    const formattedContent = this.formatBotMessage(text);
    const escapedRaw = encodeURIComponent(text);

    return `
      <div class="chat-bubble chat-bubble-ai">
        <div class="bubble-header">
          <span class="bubble-role-badge bubble-role-ai">
            <i class="fa-solid fa-robot"></i> ${roleTitle}
          </span>
          <div class="bubble-actions">
            <button class="btn-copy-bubble" onclick="DialogueModalComponent.copyBubbleText(this, decodeURIComponent('${escapedRaw}'))">
              <i class="fa-regular fa-copy"></i> <span>${copyLabel}</span>
            </button>
          </div>
        </div>
        <div class="chat-body-content">
          ${formattedContent}
        </div>
      </div>
    `;
  },

  formatBotMessage(rawText) {
    if (!rawText) return "";

    // 1. Clean and escape HTML first
    let clean = QaCardComponent.escapeHtml(rawText.trim());

    // 2. Detect inline list patterns like "1) ... 2) ..." or "1. ... 2. ..."
    const hasMultipleNumbers = (clean.match(/\b\d+[\.\)]\s+/g) || []).length >= 2;

    if (hasMultipleNumbers && !clean.includes("\n")) {
      const parts = clean.split(/(?=\b\d+[\.\)]\s+)/g);
      let listItems = [];
      let intro = "";

      parts.forEach((part, idx) => {
        const match = part.match(/^\s*(\d+)[\.\)]\s*(.*)/s);
        if (match) {
          listItems.push({ num: match[1], content: match[2].trim() });
        } else if (idx === 0) {
          intro = part.trim();
        }
      });

      if (listItems.length > 0) {
        let html = intro ? `<p class="chat-paragraph">${intro}</p>` : "";
        html += `<ul class="chat-list">`;
        listItems.forEach(item => {
          html += `
            <li class="chat-list-item">
              <div class="chat-list-num">${item.num}</div>
              <div class="chat-list-text">${this.highlightPhrases(item.content)}</div>
            </li>
          `;
        });
        html += `</ul>`;
        return html;
      }
    }

    // 3. Multiline formatting
    const paragraphs = clean.split(/\n\s*\n|\n/);
    let outputHtml = "";
    let inList = false;
    let listHtml = "";

    paragraphs.forEach(p => {
      const trimmed = p.trim();
      if (!trimmed) return;

      const numMatch = trimmed.match(/^(\d+)[\.\)]\s*(.*)/);
      const bulletMatch = trimmed.match(/^[\*\-•]\s*(.*)/);

      if (numMatch) {
        if (!inList) {
          inList = true;
          listHtml = `<ul class="chat-list">`;
        }
        listHtml += `
          <li class="chat-list-item">
            <div class="chat-list-num">${numMatch[1]}</div>
            <div class="chat-list-text">${this.highlightPhrases(numMatch[2])}</div>
          </li>
        `;
      } else if (bulletMatch) {
        if (!inList) {
          inList = true;
          listHtml = `<ul class="chat-list">`;
        }
        listHtml += `
          <li class="chat-list-item">
            <div class="chat-list-num" style="font-size: 8px;"><i class="fa-solid fa-circle"></i></div>
            <div class="chat-list-text">${this.highlightPhrases(bulletMatch[1])}</div>
          </li>
        `;
      } else {
        if (inList) {
          listHtml += `</ul>`;
          outputHtml += listHtml;
          inList = false;
          listHtml = "";
        }
        outputHtml += `<p class="chat-paragraph">${this.highlightPhrases(trimmed)}</p>`;
      }
    });

    if (inList) {
      listHtml += `</ul>`;
      outputHtml += listHtml;
    }

    return outputHtml;
  },

  highlightPhrases(text) {
    if (!text) return "";
    let formatted = text.replace(/(&quot;|«|“)(.*?)(&quot;|»|”)/g, '<span class="chat-quote">&ldquo;$2&rdquo;</span>');
    formatted = formatted.replace(/(سورة\s+[\u0600-\u06FF]+|Surah\s+[A-Za-z\-]+)/gi, '<strong class="chat-highlight">$1</strong>');
    return formatted;
  },

  copyBubbleText(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
      const isEn = window.I18nService && window.I18nService.currentLang === "en";
      const span = btn.querySelector("span");
      const originalText = span ? span.textContent : "";
      
      btn.classList.add("copied");
      if (span) span.textContent = isEn ? "Copied!" : "تم النسخ!";

      setTimeout(() => {
        btn.classList.remove("copied");
        if (span) span.textContent = originalText;
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  },

  changeFontSize(direction) {
    this.currentZoomPct = Math.min(Math.max(this.currentZoomPct + (direction * 10), 70), 160);
    this.applyZoom();
  },

  resetFontSize() {
    this.currentZoomPct = 100;
    this.applyZoom();
  },

  applyZoom() {
    const container = document.querySelector(".modal-container");
    const pctBtn = document.getElementById("modal-font-pct-btn");
    
    const calculatedPx = (13.5 * (this.currentZoomPct / 100)).toFixed(1);
    if (container) {
      container.style.setProperty("--chat-font-size", `${calculatedPx}px`);
    }
    
    if (pctBtn) {
      pctBtn.textContent = `${this.currentZoomPct}%`;
    }
  },

  closeModal(event) {
    if (event && event.target && event.target.id !== "dialogue-modal") {
      return;
    }
    const modal = document.getElementById("dialogue-modal");
    if (modal) modal.classList.remove("active");
  }
};

window.openDialogueModal = (id) => DialogueModalComponent.openModal(id);
window.closeDialogueModal = (e) => DialogueModalComponent.closeModal(e);
