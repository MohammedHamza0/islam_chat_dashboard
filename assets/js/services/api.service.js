/**
 * ApiService: Data Fetching and In-Memory Caching Service
 * Supports both direct JS object loading (for file:/// protocol) and Fetch API (for http://)
 */
window.ApiService = {
  questionsCache: null,
  conversationsCache: null,

  async getEnrichedDataset() {
    if (this.questionsCache) {
      return this.questionsCache;
    }

    // 1. Direct window global check (Fastest & works on file:// protocol without CORS restriction)
    if (window.ENRICHED_QA_DATASET && window.ENRICHED_QA_DATASET.questions) {
      this.questionsCache = window.ENRICHED_QA_DATASET.questions;
      return this.questionsCache;
    }

    // 2. Fetch API fallback (when served over http/https)
    try {
      const response = await fetch("assets/data/enriched_qa_dataset.min.json");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      this.questionsCache = data.questions || [];
      return this.questionsCache;
    } catch (err) {
      console.warn("ApiService: Fetch API failed, checking window object...", err);
      if (window.ENRICHED_QA_DATASET && window.ENRICHED_QA_DATASET.questions) {
        this.questionsCache = window.ENRICHED_QA_DATASET.questions;
        return this.questionsCache;
      }
      return [];
    }
  },

  async getConversationById(chatId) {
    // 1. Check window global check
    if (window.CONVERSATIONS_LOOKUP && window.CONVERSATIONS_LOOKUP[chatId]) {
      return window.CONVERSATIONS_LOOKUP[chatId];
    }

    if (!this.conversationsCache) {
      try {
        const response = await fetch("assets/data/conversations_lookup.json");
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        this.conversationsCache = await response.json();
      } catch (err) {
        console.warn("ApiService: Fetch conversation lookup failed, checking window...", err);
        if (window.CONVERSATIONS_LOOKUP) {
          this.conversationsCache = window.CONVERSATIONS_LOOKUP;
        }
      }
    }
    return (this.conversationsCache && this.conversationsCache[chatId]) || null;
  }
};
