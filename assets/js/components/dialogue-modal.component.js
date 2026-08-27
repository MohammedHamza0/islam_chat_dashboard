/**
 * DialogueModalComponent: Full Raw Dialogue Modal Viewer with AI Summary (LLM Ground Truth - Bilingual)
 */
window.DialogueModalComponent = {
  async openModal(chatId) {
    const modal = document.getElementById("dialogue-modal");
    const titleId = document.getElementById("modal-chat-id");
    const body = document.getElementById("modal-chat-body");

    if (!modal || !body) return;

    const isEn = window.I18nService && window.I18nService.currentLang === "en";

    if (titleId) titleId.textContent = chatId;
    body.innerHTML = `<div style="text-align:center; padding: 30px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:24px;"></i> ${isEn ? "Loading full dialogue and AI summary..." : "جاري تحميل المحادثة الأصلية وملخص الذكاء الاصطناعي..."}</div>`;
    modal.classList.add("active");

    const conv = await ApiService.getConversationById(chatId);

    if (!conv || !conv.full_conversation) {
      body.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">${isEn ? "No original dialogue found for #" + chatId : "تعذر العثور على نص المحادثة الأصلية للرقم #" + chatId}</div>`;
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
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 13px; font-weight: 800; color: var(--brand-teal); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span><i class="fa-solid fa-wand-magic-sparkles"></i> ${summaryHeader}</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${isMuslimBadge}
              <span class="badge badge-intent"><i class="fa-solid fa-bullseye"></i> ${conv.intent || ''}</span>
              ${blockerBadge}
              <span class="badge badge-lang"><i class="fa-solid fa-heart-pulse"></i> ${conv.start_mood || 'Neutral'} ${arrowSymbol} ${conv.end_mood || 'Neutral'}</span>
            </div>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.65; margin: 0;">${QaCardComponent.escapeHtml(conv.summary)}</p>
        </div>
      `;
    }

    // 2. Chat Bubbles
    const userPrefix = isEn ? "User" : "المستخدم";
    const botPrefix = isEn ? "Bot" : "البوت";

    const lines = conv.full_conversation.split("\n");
    let messagesHtml = "";
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.startsWith("User:")) {
        messagesHtml += `<div class="chat-bubble chat-bubble-user"><strong><i class="fa-solid fa-user"></i> ${userPrefix}:</strong><br>${QaCardComponent.escapeHtml(trimmed.replace(/^User:\s*/, ''))}</div>`;
      } else if (trimmed.startsWith("AI:") || trimmed.startsWith("Bot:")) {
        messagesHtml += `<div class="chat-bubble chat-bubble-ai"><strong><i class="fa-solid fa-robot"></i> ${botPrefix}:</strong><br>${QaCardComponent.escapeHtml(trimmed.replace(/^(AI|Bot):\s*/, '')).replace(/\n/g, '<br>')}</div>`;
      } else {
        messagesHtml += `<div class="chat-bubble chat-bubble-user">${QaCardComponent.escapeHtml(trimmed)}</div>`;
      }
    });

    body.innerHTML = summaryHtml + messagesHtml;
  },

  closeModal(event) {
    if (event && event.target && event.target.id !== "dialogue-modal") {
      return;
    }
    const modal = document.getElementById("dialogue-modal");
    if (modal) modal.classList.remove("active");
  }
};
