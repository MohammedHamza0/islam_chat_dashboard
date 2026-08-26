/**
 * ApiService: Data Fetching and In-Memory Caching Service
 */
window.ApiService = {
  questionsCache: null,
  conversationsCache: null,

  async getEnrichedDataset() {
    if (this.questionsCache) {
      return this.questionsCache;
    }
    try {
      const response = await fetch("assets/data/enriched_qa_dataset.min.json");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      this.questionsCache = data.questions || [];
      return this.questionsCache;
    } catch (err) {
      console.error("ApiService: Failed to load enriched dataset", err);
      return [];
    }
  },

  async getConversationById(chatId) {
    if (!this.conversationsCache) {
      try {
        const response = await fetch("assets/data/conversations_lookup.json");
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        this.conversationsCache = await response.json();
      } catch (err) {
        console.error("ApiService: Failed to load conversations lookup", err);
        return null;
      }
    }
    return this.conversationsCache[chatId] || null;
  }
};
