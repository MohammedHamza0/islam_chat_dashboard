/**
 * QaCardComponent: Renders individual Q&A cards and pagination controls (Bilingual Arabic & English)
 */
window.QaCardComponent = {
  pageSize: 18,

  renderCards(container, questions, currentPage = 1) {
    if (!container) return;

    if (!questions || questions.length === 0) {
      const isEn = window.I18nService && window.I18nService.currentLang === "en";
      container.innerHTML = `
        <div class="empty-results-box" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 40px; color: var(--text-muted); margin-bottom: 16px;"><i class="fa-solid fa-folder-open"></i></div>
          <h3 style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            ${isEn ? "No questions match the current filter criteria" : "لا توجد أسئلة مطابقة لمعايير الفلترة الحالية"}
          </h3>
          <p style="font-size: 13.5px; color: var(--text-muted);">
            ${isEn ? "Try adjusting or resetting your filter criteria to display all questions." : "جرب تغيير خيارات الفلترة أو إعادة ضبطها لعرض كافة الأسئلة."}
          </p>
        </div>
      `;
      return;
    }

    const isEn = window.I18nService && window.I18nService.currentLang === "en";
    const startIdx = (currentPage - 1) * this.pageSize;
    const pageQuestions = questions.slice(startIdx, startIdx + this.pageSize);

    const cardsHtml = pageQuestions.map((q, idx) => {
      const isTrending = q.is_trending;
      const isConverted = (q.funnel_stage_ar && q.funnel_stage_ar.includes("اعتنق الإسلام")) || q.funnel_stage === "Converted";
      const isNearShahada = (q.funnel_stage_ar && q.funnel_stage_ar.includes("مشارف الإسلام")) || q.funnel_stage === "Bottom";
      const hasBlocker = q.key_blocker && q.key_blocker !== "N/A" && q.key_blocker !== "None";

      const topicLabel = isEn ? (q.topic || q.topic_ar) : (q.topic_ar || q.topic);
      const faithLabel = isEn ? (q.faith || q.faith_ar) : (q.faith_ar || q.faith);
      const intentLabel = isEn ? (q.intent || q.intent_ar) : (q.intent_ar || q.intent);
      const blockerLabel = isEn ? (q.key_blocker || q.key_blocker_ar) : (q.key_blocker_ar || q.key_blocker);

      const qLabel = isEn ? "Question" : "السؤال";
      const aLabel = isEn ? "Bot Answer" : "إجابة البوت";
      const viewDialogText = isEn ? "View Full Conversation Context" : "عرض سياق المحادثة الكاملة";
      const trendingBadgeText = isEn ? `Trending (${q.cluster_size || 1}x)` : `تكرر ${q.cluster_size || 1} مرات`;
      const convertedBadgeText = isEn ? "Converted to Islam" : "اعتنق الإسلام (Converted)";
      const nearShahadaBadgeText = isEn ? "Near Shahada" : "على مشارف الإسلام";
      const blockerPrefix = isEn ? "Blocker" : "عائق";

      return `
        <div class="qa-card ${isTrending ? 'trending' : ''}">
          <div class="qa-card-header">
            <span class="badge badge-topic"><i class="fa-solid fa-book-quran"></i> ${topicLabel}</span>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${isConverted ? `<span class="badge" style="background: var(--benefit-green-soft); color: var(--benefit-green); font-weight: 800;"><i class="fa-solid fa-check-double"></i> ${convertedBadgeText}</span>` : ''}
              ${isNearShahada ? `<span class="badge" style="background: var(--warning-amber-soft); color: var(--warning-amber); font-weight: 800;"><i class="fa-solid fa-heart"></i> ${nearShahadaBadgeText}</span>` : ''}
              ${isTrending ? `<span class="badge badge-trending"><i class="fa-solid fa-fire"></i> ${trendingBadgeText}</span>` : ''}
            </div>
          </div>

          <div class="qa-card-body">
            <div class="qa-block qa-question-block">
              <span class="qa-label qa-label-q"><i class="fa-solid fa-circle-question"></i> ${qLabel}</span>
              <p class="qa-text">${this.escapeHtml(q.question)}</p>
            </div>

            <div class="qa-block qa-answer-block">
              <span class="qa-label qa-label-a"><i class="fa-solid fa-robot"></i> ${aLabel}</span>
              <p class="qa-text">${this.formatAnswer(q.answer)}</p>
            </div>
          </div>

          <div class="qa-card-footer">
            <div class="qa-tags">
              <span class="badge badge-faith"><i class="fa-solid fa-user-tag"></i> ${faithLabel}</span>
              <span class="badge badge-intent"><i class="fa-solid fa-bullseye"></i> ${intentLabel}</span>
              ${hasBlocker ? `<span class="badge badge-blocker" title="${blockerLabel}"><i class="fa-solid fa-shield-halved"></i> ${blockerPrefix}: ${blockerLabel}</span>` : ''}
              <span class="badge badge-date"><i class="fa-solid fa-clock"></i> ${q.date || '2025'}</span>
            </div>

            <button class="qa-open-dialogue-btn" onclick="openDialogueModal('${q.conversation_id}')">
              <i class="fa-solid fa-comments"></i> ${viewDialogText} (#${q.conversation_id})
            </button>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = cardsHtml;
  },

  renderPagination(container, totalItems, currentPage = 1, onPageChange) {
    if (!container) return;

    const totalPages = Math.ceil(totalItems / this.pageSize) || 1;
    if (totalPages <= 1) {
      container.innerHTML = "";
      return;
    }

    const isEn = window.I18nService && window.I18nService.currentLang === "en";
    const prevText = isEn ? "Previous" : "السابق";
    const nextText = isEn ? "Next" : "التالي";
    const pageText = isEn ? "Page" : "صفحة";
    const ofText = isEn ? "of" : "من";

    let paginationHtml = `
      <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} id="btn-prev-page">
        <i class="fa-solid ${isEn ? 'fa-chevron-left' : 'fa-chevron-right'}"></i> ${prevText}
      </button>
      <div class="pagination-info">
        ${pageText} <strong>${currentPage}</strong> ${ofText} <strong>${totalPages}</strong>
      </div>
      <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} id="btn-next-page">
        ${nextText} <i class="fa-solid ${isEn ? 'fa-chevron-right' : 'fa-chevron-left'}"></i>
      </button>
    `;

    container.innerHTML = paginationHtml;

    const prevBtn = container.querySelector("#btn-prev-page");
    const nextBtn = container.querySelector("#btn-next-page");

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
      };
    }
  },

  escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  },

  formatAnswer(answer) {
    if (!answer) return "";
    const escaped = this.escapeHtml(answer);
    if (escaped.length > 300) {
      return escaped.slice(0, 300) + "...";
    }
    return escaped;
  }
};
