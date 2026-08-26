/**
 * DialogueModalComponent: Full Raw Dialogue Modal Viewer
 */
window.DialogueModalComponent = {
  async openModal(chatId) {
    const modal = document.getElementById("dialogue-modal");
    const titleId = document.getElementById("modal-chat-id");
    const body = document.getElementById("modal-chat-body");

    if (!modal || !body) return;

    if (titleId) titleId.textContent = chatId;
    body.innerHTML = `<div style="text-align:center; padding: 30px;"><i class="fa-solid fa-spinner fa-spin" style="font-size:24px;"></i> جاري تحميل المحادثة الأصلية...</div>`;
    modal.classList.add("active");

    const conv = await ApiService.getConversationById(chatId);

    if (!conv || !conv.full_conversation) {
      body.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">تعذر العثور على نص المحادثة الأصلية للرقم #${chatId}.</div>`;
      return;
    }

    const lines = conv.full_conversation.split("\n");
    let html = "";
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.startsWith("User:")) {
        html += `<div class="chat-bubble chat-bubble-user"><strong><i class="fa-solid fa-user"></i> المستخدم:</strong><br>${QaCardComponent.escapeHtml(trimmed.replace(/^User:\s*/, ''))}</div>`;
      } else if (trimmed.startsWith("AI:") || trimmed.startsWith("Bot:")) {
        html += `<div class="chat-bubble chat-bubble-ai"><strong><i class="fa-solid fa-robot"></i> البوت:</strong><br>${QaCardComponent.escapeHtml(trimmed.replace(/^(AI|Bot):\s*/, '')).replace(/\n/g, '<br>')}</div>`;
      } else {
        html += `<div class="chat-bubble chat-bubble-user">${QaCardComponent.escapeHtml(trimmed)}</div>`;
      }
    });

    body.innerHTML = html;
  },

  closeModal(event) {
    if (event && event.target && event.target.id !== "dialogue-modal") {
      return;
    }
    const modal = document.getElementById("dialogue-modal");
    if (modal) modal.classList.remove("active");
  }
};
