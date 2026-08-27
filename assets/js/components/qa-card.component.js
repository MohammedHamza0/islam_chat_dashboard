/**
 * QaCardComponent: Card Rendering, Answer Expansion, and Pagination UI (LLM Ground Truth)
 */
window.QaCardComponent = {
  pageSize: 18,

  renderCards(containerElement, questions, currentPage = 1) {
    if (!containerElement) return;
    containerElement.innerHTML = "";

    if (!questions || questions.length === 0) {
      containerElement.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-filter-circle-xmark" style="font-size: 38px; color: var(--text-muted); margin-bottom: 12px;"></i>
          <h3 style="font-size: 17px; font-weight: 800;">لا توجد أسئلة تطابق هذه الفلاتر المحددة</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">جرب تخفيف شروط الفلترة أو الضغط على زر "إعادة ضبط الفلاتر".</p>
        </div>
      `;
      return;
    }

    const startIndex = (currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, questions.length);
    const pageItems = questions.slice(startIndex, endIndex);

    pageItems.forEach(q => {
      const card = document.createElement("div");
      card.className = "qa-card";

      // Funnel badge
      let funnelBadge = "";
      if (q.funnel_stage === "Converted") {
        funnelBadge = `<span class="badge" style="background: var(--benefit-green-soft); color: var(--benefit-green); border: 1px solid var(--benefit-green);"><i class="fa-solid fa-check-double"></i> اعتنق الإسلام (Converted)</span>`;
      } else if (q.funnel_stage === "Bottom") {
        funnelBadge = `<span class="badge" style="background: var(--brand-gold-light); color: #855d00; border: 1px solid var(--brand-gold);"><i class="fa-solid fa-star"></i> على مشارف الإسلام</span>`;
      }

      // Blocker badge
      let blockerBadge = "";
      if (q.key_blocker && q.key_blocker !== "N/A" && q.key_blocker !== "None") {
        blockerBadge = `<span class="badge" style="background: var(--warning-amber-soft); color: var(--warning-amber);"><i class="fa-solid fa-shield-halved"></i> عائق: ${q.key_blocker_ar}</span>`;
      }

      const trendingBadge = q.is_trending 
        ? `<span class="badge badge-trending"><i class="fa-solid fa-fire"></i> تكرر ${q.cluster_size} مرات</span>` 
        : "";

      const followupBadge = q.is_follow_up 
        ? `<span class="badge badge-lang"><i class="fa-solid fa-reply"></i> متابعة</span>` 
        : "";

      card.innerHTML = `
        <div class="qa-card-meta">
          <span class="badge badge-topic"><i class="fa-solid fa-tag"></i> ${q.topic_ar || q.topic}</span>
          <span class="badge badge-faith"><i class="fa-solid fa-user"></i> ${q.faith_ar}</span>
          <span class="badge badge-intent"><i class="fa-solid fa-bullseye"></i> ${q.intent_ar}</span>
          ${funnelBadge}
          ${blockerBadge}
          <span class="badge badge-lang"><i class="fa-solid fa-globe"></i> ${q.language}</span>
          ${trendingBadge}
          ${followupBadge}
        </div>

        <div class="qa-question-text" onclick="QaCardComponent.toggleAnswer(${q.id})">
          ${this.escapeHtml(q.question)}
        </div>

        <div class="qa-answer-container" id="ans-${q.id}">
          ${this.escapeHtml(q.answer).replace(/\n/g, '<br>')}
        </div>

        <div class="qa-card-footer">
          <span><i class="fa-regular fa-clock"></i> ${q.date || 'غير محدد'} (#${q.conversation_id})</span>
          <div class="qa-card-footer-btns">
            <button class="btn-card-sm" onclick="QaCardComponent.toggleAnswer(${q.id})">
              <i class="fa-solid fa-expand"></i> الإجابة
            </button>
            <button class="btn-card-sm" onclick="DialogueModalComponent.openModal(${q.conversation_id})">
              <i class="fa-solid fa-comments"></i> المحادثة كاملة
            </button>
          </div>
        </div>
      `;
      containerElement.appendChild(card);
    });
  },

  renderPagination(containerElement, totalItems, currentPage, onPageChange) {
    if (!containerElement) return;
    containerElement.innerHTML = "";

    const totalPages = Math.ceil(totalItems / this.pageSize);
    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => onPageChange(currentPage - 1);
    containerElement.appendChild(prevBtn);

    // Page Numbers
    const startP = Math.max(1, currentPage - 2);
    const endP = Math.min(totalPages, currentPage + 2);

    for (let i = startP; i <= endP; i++) {
      const btn = document.createElement("button");
      btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      btn.textContent = i;
      btn.onclick = () => onPageChange(i);
      containerElement.appendChild(btn);
    }

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => onPageChange(currentPage + 1);
    containerElement.appendChild(nextBtn);
  },

  toggleAnswer(id) {
    const el = document.getElementById(`ans-${id}`);
    if (el) el.classList.toggle("expanded");
  },

  escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
