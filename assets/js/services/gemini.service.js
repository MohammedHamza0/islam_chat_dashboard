/**
 * GeminiService: Gemini API Integration with Streaming Support (Bilingual)
 * Supports file:/// protocol — API Key stored securely in sessionStorage (never in code)
 * Model: gemini-1.5-flash-8b (fast, low-cost, 1M context window)
 */
window.GeminiService = {
  MODEL: 'gemini-3.1-flash-lite',
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  SESSION_KEY: 'islam_chat_gemini_api_key',

  // --- API Key Management (sessionStorage only) ---
  setApiKey(key) {
    const trimmed = (key || '').trim();
    if (trimmed) {
      sessionStorage.setItem(this.SESSION_KEY, trimmed);
      return true;
    }
    return false;
  },

  getApiKey() {
    return sessionStorage.getItem(this.SESSION_KEY) || '';
  },

  hasApiKey() {
    return !!this.getApiKey();
  },

  clearApiKey() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  // --- Core Streaming Generator ---
  async streamGenerate(messages, onChunk, onDone, onError) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      if (onError) onError('NO_API_KEY');
      return;
    }

    const url = `${this.BASE_URL}/${this.MODEL}:streamGenerateContent?key=${apiKey}&alt=sse`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.85,
            topK: 40
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ]
        })
      });

      if (!response.ok) {
        let errMsg = `HTTP ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData?.error?.message || errMsg;
        } catch (_) {}
        if (onError) onError(errMsg);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const jsonStr = trimmed.slice(6).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          try {
            const data = JSON.parse(jsonStr);
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (text && onChunk) onChunk(text);
          } catch (_) {
            // silently skip malformed SSE chunks
          }
        }
      }

      if (onDone) onDone();

    } catch (err) {
      if (onError) onError(err.message || 'NETWORK_ERROR');
    }
  },

  // --- Prompt Builder: Initial Auto-Analysis ---
  buildAnalysisPrompt(questions, lang = 'ar', filterContext = '') {
    const isAr = lang !== 'en';

    const questionsText = questions.map((q, i) => {
      const qText = (q.question || '').slice(0, 350);
      const aText = (q.answer || '').slice(0, 450);
      const topic = isAr ? (q.topic_ar || q.topic || '') : (q.topic || q.topic_ar || '');
      const faith = isAr ? (q.faith_ar || q.faith || '') : (q.faith || q.faith_ar || '');
      const intent = isAr ? (q.intent_ar || q.intent || '') : (q.intent || q.intent_ar || '');
      return `[${i + 1}] الديانة: ${faith} | النية: ${intent} | الباب: ${topic}\nسؤال: ${qText}\nإجابة البوت: ${aText}`;
    }).join('\n\n---\n\n');

    if (isAr) {
      return `أنت محلل بيانات متخصص ومحترف في الدعوة الإسلامية، وعلم النفس الديني، والحوار بين الأديان.

لديك ${questions.length} سؤالاً ومحادثة حقيقية من منصة Islam.chat (بوت دعوة إسلامي مدعوم بالذكاء الاصطناعي تحلّل أكثر من 12,448 محادثة).

[السياق الحالي: ${filterContext || 'جميع الأسئلة (بدون فلاتر محددة)'}]

[الأسئلة والأجوبة]:
${questionsText}

قم بتحليل هذه المجموعة وأعطني تقريراً استراتيجياً منظماً يشمل المحاور الأربعة التالية:

🔍 **1. أبرز الأنماط والمخاوف المشتركة**
ما هي المخاوف والتساؤلات المتكررة في هذه المجموعة؟ ما القاسم المشترك بين سائليها؟

🎯 **2. استراتيجية الحوار الموصى بها**
ما أفضل طريقة وأسلوب للتعامل مع هذه الفئة تحديداً؟ اجعل النصائح عملية وقابلة للتطبيق الفوري من الداعية.

⚠️ **3. نقاط الضعف في ردود البوت**
أين يمكن تحسين جودة ردود الذكاء الاصطناعي؟ أعطِ أمثلة محددة من الأسئلة المطروحة مع اقتراح البديل الأفضل.

🏆 **4. أعمق سؤال في المجموعة**
حدد السؤال الأكثر تعقيداً ومركزيةً، وأعطِ مثالاً للرد الاحترافي المثالي الذي كان يجب أن يقدمه البوت.

اجعل تحليلك مباشراً، عملياً، ومفيداً للداعية والمطور في عملهم الميداني. تجنب العموميات وركز على ما هو موجود في هذه الأسئلة تحديداً.`;
    } else {
      return `You are a professional data analyst specializing in Islamic dawah, comparative religion, and interfaith dialogue psychology.

You have ${questions.length} real questions and conversations from Islam.chat (an AI-powered dawah bot platform with over 12,448 analyzed conversations).

[Current Context: ${filterContext || 'All Questions (No Active Filters)'}]

[Questions & Bot Answers]:
${questionsText}

Analyze this group and provide a focused strategic report with these four sections:

🔍 **1. Key Patterns & Common Concerns**
What recurring worries, doubts, and questions appear in this group? What do these seekers have in common?

🎯 **2. Recommended Dialogue Strategy**
What is the best approach and technique for engaging with this specific group? Make advice practical and immediately actionable for a da'ee.

⚠️ **3. Bot Response Weaknesses**
Where can the AI responses be improved? Give specific examples from the presented questions, with suggested alternatives.

🏆 **4. Deepest Question in the Group**
Identify the most complex and central question, and provide an example of the ideal professional response the bot should have given.

Make your analysis direct, practical, and useful. Avoid generalities—focus specifically on what appears in these questions.`;
    }
  },

  // --- Messages Array Builder for Multi-turn Chat ---
  buildMessagesArray(chatHistory) {
    // chatHistory: [{role: 'user'|'assistant', text: '...'}]
    return chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
  }
};
