/**
 * FilterService: Multi-Dimensional Fast Filtering and Sorting Engine (100% LLM Ground Truth)
 */
window.FilterService = {
  filterQuestions(allQuestions, filterCriteria) {
    const {
      year = "all",
      month = "all",
      faith = "all",
      intent = "all",
      funnel = "all",
      blocker = "all",
      convType = "all",
      topic = "all",
      language = "all",
      region = "all",
      trending = "all",
      followup = "all",
      searchQuery = ""
    } = filterCriteria;

    const query = searchQuery.trim().toLowerCase();

    return allQuestions.filter(q => {
      if (year !== "all" && q.year !== year) return false;
      
      if (month !== "all") {
        const qMonth = String(q.month).padStart(2, '0');
        if (qMonth !== month) return false;
      }

      if (faith !== "all" && q.faith_ar !== faith) return false;
      if (intent !== "all" && q.intent_ar !== intent) return false;
      if (funnel !== "all" && q.funnel_stage_ar !== funnel) return false;
      if (blocker !== "all" && q.key_blocker_ar !== blocker) return false;
      if (convType !== "all" && q.conversation_type_ar !== convType) return false;
      if (topic !== "all" && q.topic_ar !== topic) return false;
      if (language !== "all" && q.language !== language) return false;
      if (region !== "all" && q.region_ar !== region) return false;
      if (trending === "trending_only" && !q.is_trending) return false;
      if (trending === "unique_only" && q.is_trending) return false;
      if (followup === "main_only" && q.is_follow_up) return false;
      if (followup === "followup_only" && !q.is_follow_up) return false;

      if (query) {
        const matchQ = (q.question || "").toLowerCase().includes(query);
        const matchA = (q.answer || "").toLowerCase().includes(query);
        const matchT = (q.topic || "").toLowerCase().includes(query) || (q.topic_ar || "").toLowerCase().includes(query);
        const matchB = (q.key_blocker_ar || "").toLowerCase().includes(query);
        if (!matchQ && !matchA && !matchT && !matchB) return false;
      }

      return true;
    });
  },

  sortQuestions(questions, sortType) {
    const sorted = [...questions];
    if (sortType === "trending_desc") {
      sorted.sort((a, b) => (b.cluster_size || 1) - (a.cluster_size || 1));
    } else if (sortType === "id_desc") {
      sorted.sort((a, b) => b.id - a.id);
    } else if (sortType === "id_asc") {
      sorted.sort((a, b) => a.id - b.id);
    } else if (sortType === "richness_desc") {
      sorted.sort((a, b) => (b.answer_richness || 0) - (a.answer_richness || 0));
    }
    return sorted;
  },

  calculateKPIs(filteredQuestions, totalCount) {
    const filteredCount = filteredQuestions.length;
    const percentageBadge = `${((filteredCount / totalCount) * 100).toFixed(1)}% من إجمالي الأسئلة`;

    let genuineSeekers = 0;
    let challengers = 0;
    let converted = 0;
    let conversionInterest = 0;

    for (let i = 0; i < filteredCount; i++) {
      const q = filteredQuestions[i];
      if (q.intent_ar === "باحث صادق عن الحقيقة") genuineSeekers++;
      if (q.intent_ar === "مناظر ومشكك يتحدى البوت") challengers++;
      if (q.funnel_stage_ar === "اعتنق الإسلام بالفعل (Converted)") converted++;
      if (q.intent_ar === "مهتم باعتناق الإسلام" || q.funnel_stage_ar === "المرحلة الختامية (على مشارف الإسلام)") conversionInterest++;
    }

    return {
      filteredCount,
      percentageBadge,
      genuineSeekers,
      challengers,
      converted,
      conversionInterest
    };
  }
};
