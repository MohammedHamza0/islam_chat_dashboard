/**
 * FilterService: Multi-Dimensional Fast Filtering and Sorting Engine (100% LLM Ground Truth)
 */
window.FilterService = {
  filterQuestions(allQuestions, filterCriteria) {
    const {
      year = "all",
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

  calculateKPIs(filteredQuestions, totalAllQuestionsCount) {
    const count = filteredQuestions.length;
    const totalAll = totalAllQuestionsCount || 1;
    const percentage = ((count / totalAll) * 100).toFixed(1);

    const genuineSeekers = filteredQuestions.filter(q => q.intent === "Genuine Seeker").length;
    const challengers = filteredQuestions.filter(q => q.intent === "Challenger").length;
    const converted = filteredQuestions.filter(q => q.funnel_stage === "Converted").length;
    const conversionInterest = filteredQuestions.filter(q => q.intent === "Conversion Interest").length;
    const languages = new Set(filteredQuestions.map(q => q.language));

    return {
      filteredCount: count,
      percentageBadge: `${percentage}% من إجمالي الأسئلة`,
      genuineSeekers,
      challengers,
      converted,
      conversionInterest,
      languagesCount: languages.size
    };
  }
};
