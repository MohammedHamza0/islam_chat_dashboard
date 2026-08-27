/**
 * i18n.service.js: Comprehensive Bilingual Localization Engine (Arabic & English)
 */
window.I18nService = {
  currentLang: "ar",

  translations: {
    ar: {
      // Navbar & Global
      brandTitle: "Islam.chat Intelligence Hub",
      brandSubtitle: "منظومة استكشاف الأسئلة والتحليل السلوكي الذكي (100% LLM Ground Truth)",
      tabExplorer: "مستكشف الأسئلة والفلاتر",
      tabMacro: "التحليل الإحصائي العام (17 رسمة)",
      tabPlaybooks: "خطط الحوار والاستراتيجيات",
      btnExport: "تصدير البيانات المفلترة",
      themeToggleTitle: "تبديل الوضع الليلي / الفاتح",
      langToggleText: "English",
      footerText: "Islam.chat Intelligence Hub & Analytics Suite • تم تحليل 12,448 محادثة و 11,596 سؤالاً شرعياً موثقاً بالـ LLM",

      // Tab 1: Hero & KPIs
      heroBadge1: "بيانات موثقة 100% بالذكاء الاصطناعي (Gemini 3.1 Flash Lite) عبر 12,448 محادثة",
      heroTitle1: "لوحة استكشاف وتصفية الأسئلة الشرعية والدعوية المعتمدة على الذكاء الاصطناعي",
      heroSubtitle1: "تتيح هذه المنصة فحص وتصفية الأسئلة المستخرجة بدقة فائقة بالاعتماد على <strong>الديانة الموثقة للسائل</strong>، <strong>النية الحقيقية</strong>، <strong>مراحل قمع الهداية (Conversion Funnel)</strong>، <strong>العوائق والشبهات الفكرية (Theological Blockers)</strong>، و<strong>نوع الحوار</strong>.",
      
      kpiFilteredTitle: "الأسئلة المطابقة للفلتر",
      kpiSeekersTitle: "باحثون صادقون عن الحقيقة",
      kpiSeekersSub: "Genuine Seekers",
      kpiChallengersTitle: "مناظرون ومشككون",
      kpiChallengersSub: "Challengers & Debaters",
      kpiConvertedTitle: "اعتنقوا الإسلام بالفعل",
      kpiConvertedSub: "Converted (حالات مؤكدة)",
      kpiInterestTitle: "مهتمون باعتناق الإسلام",
      kpiInterestSub: "Conversion Interest",

      // Filter Matrix Headers
      filterPanelTitle: "شريط الفلاتر الذكي المعتمد على الذكاء الاصطناعي (Smart Multi-Filter Matrix)",
      btnResetFilters: "إعادة ضبط الفلاتر",
      
      // Filter Labels
      lblYear: "السنة / النطاق الزمني",
      lblFaith: "ديانة / معتقد السائل الموثق",
      lblIntent: "نية وطبيعة السائل",
      lblFunnel: "مرحلة قمع الدعوة والهداية",
      lblBlocker: "العائق الفكري والشبهة الرئيسية",
      lblConvType: "نوع وسياق المحادثة",
      lblTopic: "الباب والموضوع الشرعي",
      lblLanguage: "لغة المحادثة (51 لغة)",
      lblRegion: "المنطقة الجغرافية",
      badgeRegionInfo: "مبني على لغة الحوار",
      lblTrending: "تكرار وشهرة السؤال",

      // Months & Years
      chipAllYears: "الكل",
      quickMonthsTitle: "الشهور المتاحة لسنة",
      quickMonthsPlatform: "المنصة",

      // Charts Row
      chartTimelineTitle: "توزيع وتطور الأسئلة المفلترة عبر الأشهر",
      chartTimelineBadge: "تحديث فوري",
      chartFaithTitle: "توزيع معتقدات وسلوك السائلين للنتائج الحالية (LLM)",
      chartFaithBadge: "Faith Breakdown",
      chartQuestionsLabel: "عدد الأسئلة المستخرجة",
      chartTooltipSuffix: "سؤالاً مطابقاً",

      // Results Bar
      resultsCountPrefix: "قائمة الأسئلة المستخرجة",
      resultsCountSuffix: "سؤالاً مطابقاً",
      searchPlaceholder: "ابحث في نص السؤال، الإجابة، أو العائق الفكري...",
      
      // Sort Options
      sortTrendingDesc: "الأكثر تكراراً (Trending)",
      sortIdDesc: "الأحدث إضافة",
      sortIdAsc: "الأقدم إضافة",
      sortRichnessDesc: "الأطول إجابة وثراءً",

      // QA Cards
      cardQuestionLabel: "السؤال",
      cardAnswerLabel: "إجابة البوت",
      cardClusterBadge: "شائع ومتكرر",
      cardSingleBadge: "سؤال فردي",
      btnViewDialogue: "عرض سياق المحادثة الكاملة",
      noResultsTitle: "لا توجد أسئلة مطابقة لمعايير الفلترة الحالية",
      noResultsSub: "جرب تغيير خيارات الفلترة أو إعادة ضبطها لعرض كافة الأسئلة.",
      paginationPrev: "السابق",
      paginationNext: "التالي",
      paginationPage: "صفحة",
      paginationOf: "من",

      // Dialogue Modal
      modalDialogueTitle: "سياق المحادثة الكاملة",
      modalSummaryTitle: "ملخص الذكاء الاصطناعي للمحادثة (AI Summary)",
      modalUserStatus: "صفة السائل:",
      modalMuslimUser: "مسلم قائم (Existing Muslim)",
      modalNonMuslimUser: "غير مسلم مستهدف بالدعوة (Target Seeker)",
      modalMoodTrajectory: "مسار المشاعر:",
      modalUserBadge: "السائل",
      modalBotBadge: "البوت",
      modalLoading: "جاري تحميل المحادثة الأصلية وملخص الذكاء الاصطناعي...",
      modalNoMessages: "لا توجد رسائل مسجلة لهذه المحادثة.",

      // Tab 3: Playbooks & Recommendations
      playbookHeroBadge: "الدليل الاستراتيجي والتشغيلي للدعاة",
      playbookHeroTitle: "أدلة الحوار التكتيكية لكل ديانة وتحليل ترافيك المنصة",
      playbookHeroSubtitle: "خلاصة الدراسات التحليلية النوعية لـ <strong>12,448 محادثة</strong> و <strong>22.9 مليون توكن</strong>؛ لتزويد الدعاة والذكاء الاصطناعي بخطط حوار تكتيكية مخصصة لكل معتقد وإدارة الموارد التقنية بكفاءة.",

      sec1Title: "1. أدلة الحوار التكتيكية المخصصة لكل ديانة (Religion-Specific Concern Playbooks)",
      sec1Sub: "خطط حوار تشغيلية واستراتيجيات ردود مبنية على تحليل أداء آلاف الحوارات الحقيقية.",
      tabPlaybookChrist: "حوار المسيحيين (2,036)",
      tabPlaybookAtheist: "حوار الملاحدة واللادينيين (939)",
      tabPlaybookHindu: "حوار الهندوس والسيخ (336)",
      tabPlaybookJew: "حوار اليهود (88)",
      tabPlaybookBuddha: "حوار البوذيين (103)",
      playbookCertifiedBadge: "دليل تشغيلي معتمد",
      playbookTopicsTitle: "أهم اهتمامات ومواضيع السائلين",
      playbookBlockersTitle: "أبرز العوائق والشبهات المسجلة",
      playbookStrategyTitle: "خارطة طريق الحوار الموصى بها للداعية والذكاء الاصطناعي",

      sec2Title: "2. تحليل حركة المسلمين على البوت وإدارة التوكنز (Muslim Traffic & Token Optimization)",
      sec2Sub: "دراسة استهلاك 22.9 مليون توكن والتوصيات المعمارية لتوفير 24.4% من التكاليف.",
      kpiMuslimChats: "إجمالي محادثات المسلمين",
      kpiMuslimChatsSub: "37.0% من إجمالي حركة المنصة",
      kpiMuslimTokens: "استهلاك التوكنز للمسلمين",
      kpiMuslimTokensSub: "39.9% من إجمالي ميزانية الـ Tokens",
      kpiMuslimFiqh: "طلب الفتاوى والإرشاد الفقهي",
      kpiMuslimFiqhSub: "58.5% من أسئلة المسلمين",
      kpiMuslimTraining: "التدريب على الدعوة (Training)",
      kpiMuslimTrainingSub: "18.2% من أسئلة المسلمين",
      boxChallengeTitle: "التحدي المكتشف في البيانات",
      boxChallengeText: "يستهلك المستخدم المسلم متوسط <strong>4,979 توكن</strong> لكل محادثة مقارنة بـ 4,393 توكن لغير المسلم، نظراً لاسترسال البوت في تفصيل المسائل الفقهية والخلافات المذهبية بدلاً من التركيز على الهدف الأساسي للمنصة وهو دعوة غير المسلمين.",
      boxSolutionTitle: "الحل المعماري المقترح (Dual-Track Routing)",
      boxSolutionText: "بناء طبقة توجيه ذكية تفصل المحادثات فورياً: مسار دعوي متخصص ومكثف لغير المسلمين (Dawah Track)، ومسار استشاري فقهي سريع ومدعوم بقاعدة فتاوى مختصرة للمسلمين، مما <strong>يوفر ما يصل إلى 24.4% من التوكنز المهدرة</strong>.",

      sec3Title: "3. المحاور الموضوعية الـ 8 الكبرى (Thematic Super-Clusters)",
      sec3Sub: "تحليل وتطبيع 22,028 إشارة لموضوعات الحوار عبر المنصة.",
      super1Title: "1. العبادات وأركان الإسلام",
      super1Sub: "1,862 إشارة عبر 1,313 محادثة (الصلاة، الصيام، الطهارة، الحج).",
      super2Title: "2. التوحيد ونفي الشريك",
      super2Sub: "1,596 إشارة عبر 1,511 محادثة (شهادة أن لا إله إلا الله، أسماء الله وصفاته).",
      super3Title: "3. القرآن الكريم وأصالته",
      super3Sub: "1,523 إشارة عبر 1,228 محادثة (حفظ النص القرآني، الإعجاز، والمخطوطات).",
      super4Title: "4. عيسى في الإسلام",
      super4Sub: "848 إشارة (بشرية المسيح، مريم العذراء، تفنيد التثليث والصلب).",
      super5Title: "5. براهين الخالق والعلية",
      super5Sub: "352 إشارة (أدلة التصميم والضبط الدقيق والرد على التفسير المادي).",
      super6Title: "6. النبوة ورسالة محمد ﷺ",
      super6Sub: "دلائل النبوة، السيرة النبوية، والبشارات في الكتب السابقة.",
      super7Title: "7. القدر ومشكلة الشر والألم",
      super7Sub: "الحكمة من الابتلاء، العدل الإلهي، ومعنى الحياة الدنيا.",
      super8Title: "8. الشريعة والأسرة ومكانة المرأة",
      super8Sub: "حقوق المرأة، نظام الميراث، الحجاب، ومقاصد الشريعة الإسلامية.",

      // Toast Notifications
      toastResetSuccess: "تمت استعادة كافة الفلاتر والبيانات بنجاح (11,596 سؤالاً)",
      toastExportEmpty: "لا توجد بيانات مطابقة لتصديرها!"
    },

    en: {
      // Navbar & Global
      brandTitle: "Islam.chat Intelligence Hub",
      brandSubtitle: "AI-Powered Q&A Discovery & Behavioral Analytics Suite (100% LLM Ground Truth)",
      tabExplorer: "Q&A Explorer & Filters",
      tabMacro: "Macro Analytics (17 Charts)",
      tabPlaybooks: "Dawah Playbooks & Roadmap",
      btnExport: "Export Filtered CSV",
      themeToggleTitle: "Toggle Dark / Light Theme",
      langToggleText: "العربية",
      footerText: "Islam.chat Intelligence Hub & Analytics Suite • 12,448 Conversations & 11,596 LLM-Verified Q&A Pairs Analyzed",

      // Tab 1: Hero & KPIs
      heroBadge1: "100% Ground Truth AI Analysis (Gemini 3.1 Flash Lite) Across 12,448 Conversations",
      heroTitle1: "AI-Powered Theological & Dawah Q&A Exploration Suite",
      heroSubtitle1: "Explore and filter authentic user questions with granular precision based on <strong>Verified User Faith</strong>, <strong>True Intent</strong>, <strong>Conversion Funnel Stage</strong>, <strong>Theological Blockers</strong>, and <strong>Conversation Type</strong>.",
      
      kpiFilteredTitle: "Filtered Matching Questions",
      kpiSeekersTitle: "Genuine Truth Seekers",
      kpiSeekersSub: "Genuine Seekers",
      kpiChallengersTitle: "Challengers & Debaters",
      kpiChallengersSub: "Challengers & Skeptics",
      kpiConvertedTitle: "Converted to Islam",
      kpiConvertedSub: "Converted (Confirmed)",
      kpiInterestTitle: "Conversion Interest",
      kpiInterestSub: "Pre-Shahada & Bottom Funnel",

      // Filter Matrix Headers
      filterPanelTitle: "Smart Multi-Dimensional Filter Matrix (AI Ground Truth)",
      btnResetFilters: "Reset Filters",
      
      // Filter Labels
      lblYear: "Year / Time Range",
      lblFaith: "User Faith / Suspected Religion",
      lblIntent: "User Intent & Engagement Pattern",
      lblFunnel: "Conversion Funnel Stage",
      lblBlocker: "Key Blocker / Theological Objection",
      lblConvType: "Conversation Context & Type",
      lblTopic: "Islamic Topic / Domain",
      lblLanguage: "Conversation Language (51 Languages)",
      lblRegion: "Geographic Sphere",
      badgeRegionInfo: "Language-Based",
      lblTrending: "Question Frequency & Popularity",

      // Months & Years
      chipAllYears: "All",
      quickMonthsTitle: "Available Months for",
      quickMonthsPlatform: "Platform",

      // Charts Row
      chartTimelineTitle: "Monthly Volume & Trend of Filtered Questions",
      chartTimelineBadge: "Real-Time",
      chartFaithTitle: "Faith & Belief Breakdown for Current Selection (LLM)",
      chartFaithBadge: "Faith Breakdown",
      chartQuestionsLabel: "Extracted Questions Count",
      chartTooltipSuffix: "Matching Questions",

      // Results Bar
      resultsCountPrefix: "Extracted Q&A List",
      resultsCountSuffix: "Matching Questions",
      searchPlaceholder: "Search within questions, answers, or theological blockers...",
      
      // Sort Options
      sortTrendingDesc: "Most Trending (Cluster Size)",
      sortIdDesc: "Newest First",
      sortIdAsc: "Oldest First",
      sortRichnessDesc: "Longest & Richest Answers",

      // QA Cards
      cardQuestionLabel: "Question",
      cardAnswerLabel: "Bot Answer",
      cardClusterBadge: "Trending Cluster",
      cardSingleBadge: "Single Question",
      btnViewDialogue: "View Full Conversation Context",
      noResultsTitle: "No questions match the current filter criteria",
      noResultsSub: "Try adjusting or resetting your filter criteria to display all questions.",
      paginationPrev: "Previous",
      paginationNext: "Next",
      paginationPage: "Page",
      paginationOf: "of",

      // Dialogue Modal
      modalDialogueTitle: "Full Conversation Dialogue Context",
      modalSummaryTitle: "AI Executive Conversation Summary",
      modalUserStatus: "User Persona:",
      modalMuslimUser: "Existing Muslim",
      modalNonMuslimUser: "Target Seeker (Non-Muslim)",
      modalMoodTrajectory: "Emotional Trajectory:",
      modalUserBadge: "User",
      modalBotBadge: "Bot",
      modalLoading: "Loading full original dialogue and AI summary...",
      modalNoMessages: "No messages recorded for this conversation.",

      // Tab 3: Playbooks & Recommendations
      playbookHeroBadge: "Strategic & Operational Dawah Guide",
      playbookHeroTitle: "Religion-Specific Concern Playbooks & Traffic Optimization",
      playbookHeroSubtitle: "Actionable strategic intelligence derived from <strong>12,448 conversations</strong> and <strong>22.9M tokens</strong>; equipping da'ees and AI with tactical objection-handling frameworks.",

      sec1Title: "1. Religion-Specific Concern & Dawah Playbooks",
      sec1Sub: "Tactical conversation roadmaps and objection-handling strategies based on thousands of real dialogues.",
      tabPlaybookChrist: "Christian Dialogue (2,036)",
      tabPlaybookAtheist: "Atheism & Agnosticism (939)",
      tabPlaybookHindu: "Hinduism & Sikhism (336)",
      tabPlaybookJew: "Judaism Dialogue (88)",
      tabPlaybookBuddha: "Buddhism Dialogue (103)",
      playbookCertifiedBadge: "Verified Operational Guide",
      playbookTopicsTitle: "Core Interests & Most Frequent Topics",
      playbookBlockersTitle: "Primary Recorded Blockers & Objections",
      playbookStrategyTitle: "Recommended Strategic Roadmap for Da'ees & AI",

      sec2Title: "2. Muslim Traffic Analysis & AI Token Optimization",
      sec2Sub: "Analysis of 22.9M tokens spent on existing Muslims and architectural savings of 24.4%.",
      kpiMuslimChats: "Total Existing Muslim Chats",
      kpiMuslimChatsSub: "37.0% of Total Platform Traffic",
      kpiMuslimTokens: "Muslim Token Consumption",
      kpiMuslimTokensSub: "39.9% of Total AI Token Budget",
      kpiMuslimFiqh: "Fiqh & Religious Guidance Requests",
      kpiMuslimFiqhSub: "58.5% of Muslim Questions",
      kpiMuslimTraining: "Dawah Training & Apologetics",
      kpiMuslimTrainingSub: "18.2% of Muslim Questions",
      boxChallengeTitle: "Identified Data Bottleneck",
      boxChallengeText: "Existing Muslim users consume an average of <strong>4,979 tokens</strong> per chat vs 4,393 for non-Muslims, as the bot engages in extensive fiqh details rather than focusing on non-Muslim outreach.",
      boxSolutionTitle: "Proposed Solution: Dual-Track Architecture",
      boxSolutionText: "Build an intelligent routing layer to split traffic: a dedicated high-impact Dawah Track for non-Muslims, and a streamlined Fiqh/Fatwa assistant for Muslims, <strong>saving up to 24.4% of wasted token spend</strong>.",

      sec3Title: "3. Thematic Super-Clusters (8 Core Pillars)",
      sec3Sub: "Normalization and structuring of 22,028 conversation topic mentions.",
      super1Title: "1. Worship & Islamic Pillars",
      super1Sub: "1,862 mentions across 1,313 chats (Prayer, Fasting, Purification, Hajj).",
      super2Title: "2. Tawhid & Pure Monotheism",
      super2Sub: "1,596 mentions across 1,511 chats (Shahada, Names & Attributes of Allah).",
      super3Title: "3. Quran: Authenticity & Preservation",
      super3Sub: "1,523 mentions across 1,228 chats (Manuscripts, Miracles, Exegesis).",
      super4Title: "4. Jesus in Islam",
      super4Sub: "848 mentions (Prophethood of Jesus, Virgin Mary, Trinity Refutation).",
      super5Title: "5. Creator Arguments & Causality",
      super5Sub: "352 mentions (Teleology, Fine-Tuning, Refuting Materialism).",
      super6Title: "6. Prophethood & Muhammad ﷺ",
      super6Sub: "Proofs of Prophethood, Seerah, and Biblical Prophecies.",
      super7Title: "7. Divine Decree & Problem of Evil",
      super7Sub: "Wisdom behind trials, Divine Justice, and purpose of worldly life.",
      super8Title: "8. Sharia, Family & Women in Islam",
      super8Sub: "Women's rights, inheritance system, Hijab, and higher objectives of Sharia.",

      // Toast Notifications
      toastResetSuccess: "All filters and dataset successfully restored (11,596 questions)",
      toastExportEmpty: "No matching data available to export!"
    }
  },

  dropdownTranslations: {
    "filter-year": {
      ar: [
        { value: "all", label: "كل السنوات (2024 - 2026)" },
        { value: "2026", label: "2026 (الربع الأول)" },
        { value: "2025", label: "2025 (سنة الانتشار الكبرى)" },
        { value: "2024", label: "2024 (فترة الإطلاق التجريبي)" }
      ],
      en: [
        { value: "all", label: "All Years (2024 - 2026)" },
        { value: "2026", label: "2026 (Q1)" },
        { value: "2025", label: "2025 (Peak Spread Year)" },
        { value: "2024", label: "2024 (Pilot Phase)" }
      ]
    },
    "filter-faith": {
      ar: [
        { value: "all", label: "جميع المعتقدات والديانات" },
        { value: "الإسلام (مسلم)", label: "الإسلام (مسلم: 5,337)" },
        { value: "المسيحية", label: "المسيحية (2,760)" },
        { value: "غير محدد / غير معلن", label: "غير محدد / غير معلن (1,431)" },
        { value: "الإلحاد (ملحد)", label: "الإلحاد (ملحد: 880)" },
        { value: "اللاأدرية (Agnostic)", label: "اللاأدرية (Agnostic: 342)" },
        { value: "الهندوسية", label: "الهندوسية (334)" },
        { value: "لاديني عام", label: "لاديني عام (155)" },
        { value: "البوذية", label: "البوذية (85)" },
        { value: "اليهودية", label: "اليهودية (80)" },
        { value: "أديان ومعتقدات أخرى", label: "أديان ومعتقدات أخرى (190)" },
        { value: "السيخية", label: "السيخية (2)" }
      ],
      en: [
        { value: "all", label: "All Religions & Beliefs" },
        { value: "الإسلام (مسلم)", label: "Islam (Muslim: 5,337)" },
        { value: "المسيحية", label: "Christianity (2,760)" },
        { value: "غير محدد / غير معلن", label: "Unknown / Undeclared (1,431)" },
        { value: "الإلحاد (ملحد)", label: "Atheism (880)" },
        { value: "اللاأدرية (Agnostic)", label: "Agnosticism (342)" },
        { value: "الهندوسية", label: "Hinduism (334)" },
        { value: "لاديني عام", label: "Irreligion / Secular (155)" },
        { value: "البوذية", label: "Buddhism (85)" },
        { value: "اليهودية", label: "Judaism (80)" },
        { value: "أديان ومعتقدات أخرى", label: "Other Beliefs (190)" },
        { value: "السيخية", label: "Sikhism (2)" }
      ]
    },
    "filter-intent": {
      ar: [
        { value: "all", label: "جميع النوايا والأنماط" },
        { value: "مسلم يتعلم أحكام دينه", label: "مسلم يتعلم أحكام دينه (4,544)" },
        { value: "مناظر ومشكك يتحدى البوت", label: "مناظر ومشكك يتحدى البوت (3,264)" },
        { value: "باحث صادق عن الحقيقة", label: "باحث صادق عن الحقيقة (1,822)" },
        { value: "مستمع سلبي / متابع", label: "مستمع سلبي / متابع (847)" },
        { value: "مهتم باعتناق الإسلام", label: "مهتم باعتناق الإسلام (545)" },
        { value: "استفسار خارج الموضوع", label: "استفسار خارج الموضوع (303)" },
        { value: "تدريب على أساليب الدعوة", label: "تدريب على أساليب الدعوة (209)" },
        { value: "عبث أو سبام", label: "عبث أو سبام (42)" }
      ],
      en: [
        { value: "all", label: "All Intents & Patterns" },
        { value: "مسلم يتعلم أحكام دينه", label: "Muslim Learner (4,544)" },
        { value: "مناظر ومشكك يتحدى البوت", label: "Challenger / Debater (3,264)" },
        { value: "باحث صادق عن الحقيقة", label: "Genuine Truth Seeker (1,822)" },
        { value: "مستمع سلبي / متابع", label: "Passive Listener (847)" },
        { value: "مهتم باعتناق الإسلام", label: "Conversion Interest (545)" },
        { value: "استفسار خارج الموضوع", label: "Off-Topic User (303)" },
        { value: "تدريب على أساليب الدعوة", label: "Dawah Training (209)" },
        { value: "عبث أو سبام", label: "Spam / Troll (42)" }
      ]
    },
    "filter-funnel": {
      ar: [
        { value: "all", label: "جميع مراحل القمع الدعوي" },
        { value: "اعتنق الإسلام بالفعل (Converted)", label: "اعتنق الإسلام بالفعل - Converted (346)" },
        { value: "المرحلة الختامية (على مشارف الإسلام)", label: "المرحلة الختامية (على مشارف الإسلام: 213)" },
        { value: "المرحلة المتوسطة (اهتمام ومناقشة)", label: "المرحلة المتوسطة (اهتمام ومناقشة: 3,371)" },
        { value: "المرحلة التمهيدية (استكشاف أولي)", label: "المرحلة التمهيدية (استكشاف أولي: 684)" },
        { value: "انسحب أثناء الحوار", label: "انسحب أثناء الحوار (1,103)" },
        { value: "غير منطبق (مسلم أو عام)", label: "غير منطبق - مسلم أو عام (5,879)" }
      ],
      en: [
        { value: "all", label: "All Funnel Stages" },
        { value: "اعتنق الإسلام بالفعل (Converted)", label: "Converted to Islam (346)" },
        { value: "المرحلة الختامية (على مشارف الإسلام)", label: "Bottom Funnel - Near Shahada (213)" },
        { value: "المرحلة المتوسطة (اهتمام ومناقشة)", label: "Middle Funnel - Active Discussion (3,371)" },
        { value: "المرحلة التمهيدية (استكشاف أولي)", label: "Top Funnel - Initial Discovery (684)" },
        { value: "انسحب أثناء الحوار", label: "Dropped / Disengaged (1,103)" },
        { value: "غير منطبق (مسلم أو عام)", label: "N/A - Existing Muslim / General (5,879)" }
      ]
    },
    "filter-blocker": {
      ar: [
        { value: "all", label: "جميع العوائق والشبهات" },
        { value: "الشك العقلي والمنطقي", label: "الشك العقلي والمنطقي (2,397)" },
        { value: "عقيدة التثليث (لدى النصارى)", label: "عقيدة التثليث لدى النصارى (703)" },
        { value: "اعتراضات أخلاقية واجتماعية", label: "اعتراضات أخلاقية واجتماعية (459)" },
        { value: "التمسك بالهوية الثقافية", label: "التمسك بالهوية الثقافية (292)" },
        { value: "الصورة المشوهة في الإعلام", label: "الصورة المشوهة في الإعلام (256)" },
        { value: "ضعف الاهتمام والجدية", label: "ضعف الاهتمام والجدية (209)" },
        { value: "الحيرة بين الفرق والمذاهب", label: "الحيرة بين الفرق والمذاهب (141)" },
        { value: "الخوف من ضغط الأهل والمجتمع", label: "الخوف من ضغط الأهل والمجتمع (100)" },
        { value: "إنكار وجود الخالق (مادي)", label: "إنكار وجود الخالق (26)" },
        { value: "انعدام الثقة في المؤسسات الدينية", label: "انعدام الثقة في المؤسسات الدينية (26)" },
        { value: "لا يوجد عائق محدد", label: "لا يوجد عائق محدد (6,958)" }
      ],
      en: [
        { value: "all", label: "All Theological Blockers" },
        { value: "الشك العقلي والمنطقي", label: "Logical & Rational Skepticism (2,397)" },
        { value: "عقيدة التثليث (لدى النصارى)", label: "Trinity & Divinity of Jesus (703)" },
        { value: "اعتراضات أخلاقية واجتماعية", label: "Moral & Social Objections (459)" },
        { value: "التمسك بالهوية الثقافية", label: "Cultural Identity & Tradition (292)" },
        { value: "الصورة المشوهة في الإعلام", label: "Negative Media Perceptions (256)" },
        { value: "ضعف الاهتمام والجدية", label: "Lack of Serious Interest (209)" },
        { value: "الحيرة بين الفرق والمذاهب", label: "Sectarian Confusion (141)" },
        { value: "الخوف من ضغط الأهل والمجتمع", label: "Family & Social Pressure (100)" },
        { value: "إنكار وجود الخالق (مادي)", label: "Materialistic Atheism (26)" },
        { value: "انعدام الثقة في المؤسسات الدينية", label: "Distrust of Religion (26)" },
        { value: "لا يوجد عائق محدد", label: "No Specific Blocker (6,958)" }
      ]
    },
    "filter-convtype": {
      ar: [
        { value: "all", label: "جميع أنواع المحادثات" },
        { value: "إرشاد وتوجيه إسلامي", label: "إرشاد وتوجيه إسلامي (3,999)" },
        { value: "مناظرة عقدية ولاهوتية", label: "مناظرة عقدية ولاهوتية (3,140)" },
        { value: "دعوة غير المسلمين", label: "دعوة غير المسلمين (2,563)" },
        { value: "تدريب وتأهيل دعوي", label: "تدريب وتأهيل دعوي (1,333)" },
        { value: "مساعدة في نصوص أو ترجمة", label: "مساعدة في نصوص أو ترجمة (230)" },
        { value: "دعم نفسي واستشارة روحية", label: "دعم نفسي واستشارة روحية (99)" },
        { value: "خارج سياق المنصة", label: "خارج سياق المنصة (185)" }
      ],
      en: [
        { value: "all", label: "All Conversation Types" },
        { value: "إرشاد وتوجيه إسلامي", label: "Islamic Guidance & Fiqh (3,999)" },
        { value: "مناظرة عقدية ولاهوتية", label: "Theological Debate (3,140)" },
        { value: "دعوة غير المسلمين", label: "Direct Dawah Outreach (2,563)" },
        { value: "تدريب وتأهيل دعوي", label: "Dawah Training & Coaching (1,333)" },
        { value: "مساعدة في نصوص أو ترجمة", label: "Content & Translation (230)" },
        { value: "دعم نفسي واستشارة روحية", label: "Emotional & Spiritual Support (99)" },
        { value: "خارج سياق المنصة", label: "Off-Topic / General (185)" }
      ]
    },
    "filter-topic": {
      ar: [
        { value: "all", label: "جميع الأبواب الشرعية" },
        { value: "العقيدة وأصول الإيمان", label: "العقيدة وأصول الإيمان (2,604)" },
        { value: "مقارنة الأديان وحوار غير المسلمين", label: "مقارنة الأديان وحوار غير المسلمين (2,367)" },
        { value: "الفقه والعبادات والأحكام", label: "الفقه والعبادات والأحكام (1,990)" },
        { value: "القرآن الكريم والتفسير", label: "القرآن الكريم والتفسير (1,030)" },
        { value: "منهجية الدعوة والردود", label: "منهجية الدعوة والردود (788)" },
        { value: "الحديث الشريف والسيرة النبوية", label: "الحديث الشريف والسيرة النبوية (766)" },
        { value: "رعاية وتعليم المسلمين الجدد", label: "رعاية وتعليم المسلمين الجدد (610)" },
        { value: "الأخلاق والآداب الإسلامية", label: "الأخلاق والآداب الإسلامية (498)" },
        { value: "التاريخ والحضارة الإسلامية", label: "التاريخ والحضارة الإسلامية (399)" },
        { value: "الاستشارات والتوجيه الشخصي", label: "الاستشارات والتوجيه الشخصي (382)" }
      ],
      en: [
        { value: "all", label: "All Islamic Domains" },
        { value: "العقيدة وأصول الإيمان", label: "Aqeedah & Creed (2,604)" },
        { value: "مقارنة الأديان وحوار غير المسلمين", label: "Comparative Religion (2,367)" },
        { value: "الفقه والعبادات والأحكام", label: "Fiqh & Worship (1,990)" },
        { value: "القرآن الكريم والتفسير", label: "Quran & Tafsir (1,030)" },
        { value: "منهجية الدعوة والردود", label: "Dawah Methodology (788)" },
        { value: "الحديث الشريف والسيرة النبوية", label: "Hadith & Seerah (766)" },
        { value: "رعاية وتعليم المسلمين الجدد", label: "New Muslim Care (610)" },
        { value: "الأخلاق والآداب الإسلامية", label: "Ethics & Morality (498)" },
        { value: "التاريخ والحضارة الإسلامية", label: "Islamic History (399)" },
        { value: "الاستشارات والتوجيه الشخصي", label: "Counseling & Guidance (382)" }
      ]
    },
    "filter-language": {
      ar: [
        { value: "all", label: "جميع اللغات (51 لغة)" },
        { value: "English", label: "الإنجليزية (English: 4,612)" },
        { value: "Arabic", label: "العربية (Arabic: 4,297)" },
        { value: "Swahili", label: "السواحلية (Swahili: 847)" },
        { value: "Japanese", label: "اليابانية (Japanese: 386)" },
        { value: "French", label: "الفرنسية (French: 281)" },
        { value: "Filipino", label: "الفلبينية (Filipino: 230)" },
        { value: "Korean", label: "الكورية (Korean: 153)" },
        { value: "Central Kurdish", label: "الكردية (Kurdish: 143)" },
        { value: "Urdu", label: "الأردية (Urdu: 126)" },
        { value: "Najdi Arabic", label: "العربية النجدية (66)" },
        { value: "German", label: "الألمانية (German: 51)" },
        { value: "Spanish", label: "الإسبانية (Spanish: 46)" },
        { value: "Russian", label: "الروسية (Russian: 38)" },
        { value: "Indonesian", label: "الإندونيسية (Indonesian: 34)" }
      ],
      en: [
        { value: "all", label: "All Languages (51 Languages)" },
        { value: "English", label: "English (4,612)" },
        { value: "Arabic", label: "Arabic (4,297)" },
        { value: "Swahili", label: "Swahili (847)" },
        { value: "Japanese", label: "Japanese (386)" },
        { value: "French", label: "French (281)" },
        { value: "Filipino", label: "Filipino / Tagalog (230)" },
        { value: "Korean", label: "Korean (153)" },
        { value: "Central Kurdish", label: "Kurdish (143)" },
        { value: "Urdu", label: "Urdu (126)" },
        { value: "Najdi Arabic", label: "Najdi Arabic (66)" },
        { value: "German", label: "German (51)" },
        { value: "Spanish", label: "Spanish (46)" },
        { value: "Russian", label: "Russian (38)" },
        { value: "Indonesian", label: "Indonesian (34)" }
      ]
    },
    "filter-region": {
      ar: [
        { value: "all", label: "جميع المناطق الجغرافية" },
        { value: "العالم الغربي والناطق بالإنجليزية", label: "العالم الغربي والناطق بالإنجليزية (4,612)" },
        { value: "الشرق الأوسط وشمال أفريقيا", label: "الشرق الأوسط وشمال أفريقيا (4,363)" },
        { value: "أفريقيا جنوب الصحراء", label: "أفريقيا جنوب الصحراء (850)" },
        { value: "شرق وجنوب شرق آسيا", label: "شرق وجنوب شرق آسيا (805)" },
        { value: "أوروبا وأمريكا اللاتينية", label: "أوروبا وأمريكا اللاتينية (403)" },
        { value: "آسيا الوسطى وأوراسيا", label: "آسيا الوسطى وأوراسيا (224)" },
        { value: "جنوب آسيا (شبه القارة الهندية)", label: "جنوب آسيا (شبه القارة الهندية: 185)" }
      ],
      en: [
        { value: "all", label: "All Geographic Spheres" },
        { value: "العالم الغربي والناطق بالإنجليزية", label: "Western / Anglophone Sphere (4,612)" },
        { value: "الشرق الأوسط وشمال أفريقيا", label: "Middle East & North Africa - MENA (4,363)" },
        { value: "أفريقيا جنوب الصحراء", label: "Sub-Saharan Africa (850)" },
        { value: "شرق وجنوب شرق آسيا", label: "East & Southeast Asia (805)" },
        { value: "أوروبا وأمريكا اللاتينية", label: "Europe & Latin America (403)" },
        { value: "آسيا الوسطى وأوراسيا", label: "Central Asia & Eurasia (224)" },
        { value: "جنوب آسيا (شبه القارة الهندية)", label: "South Asia / Indian Subcontinent (185)" }
      ]
    },
    "filter-trending": {
      ar: [
        { value: "all", label: "الكل (الأسئلة الفردية والشائعة)" },
        { value: "trending_only", label: "الأسئلة الأكثر تكراراً فقط (Trending > 1)" },
        { value: "unique_only", label: "الأسئلة الفردية فقط" }
      ],
      en: [
        { value: "all", label: "All (Single & Trending Questions)" },
        { value: "trending_only", label: "Most Trending Only (Cluster Size > 1)" },
        { value: "unique_only", label: "Unique Single Questions Only" }
      ]
    }
  },

  init() {
    const savedLang = localStorage.getItem("islam_chat_lang") || "ar";
    this.setLanguage(savedLang, false);
  },

  t(key) {
    const langDict = this.translations[this.currentLang] || this.translations.ar;
    return langDict[key] || key;
  },

  setLanguage(lang, triggerFilter = true) {
    this.currentLang = lang === "en" ? "en" : "ar";
    localStorage.setItem("islam_chat_lang", this.currentLang);

    // 1. Update HTML tag attributes
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === "ar" ? "rtl" : "ltr";
    document.body.setAttribute("dir", this.currentLang === "ar" ? "rtl" : "ltr");

    // 2. Update toggle button text
    const langTextEl = document.getElementById("lang-toggle-text");
    if (langTextEl) {
      langTextEl.textContent = this.currentLang === "ar" ? "English" : "العربية";
    }

    // 3. Update all static elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = this.t(key);
      if (translation) {
        if (el.tagName === "INPUT") {
          el.placeholder = translation;
        } else {
          el.innerHTML = translation;
        }
      }
    });

    // 4. Update Dropdown Options
    this.updateDropdowns();

    // 5. Re-render dynamic components
    if (window.App) {
      App.renderMonthChips(document.getElementById("filter-year")?.value || "all");
      if (triggerFilter) {
        App.applyFilters();
      }
    }

    if (window.ChartService) {
      const isDark = document.body.getAttribute("data-theme") === "dark";
      ChartService.reRenderCharts(isDark);
    }

    if (window.PlaybooksComponent && document.getElementById("playbook-content-display")) {
      const activeBtn = document.querySelector(".playbook-tab-btn.active");
      const activeKey = activeBtn ? activeBtn.getAttribute("onclick")?.match(/'([^']+)'/)?.[1] : "christianity";
      PlaybooksComponent.renderPlaybook(activeKey || "christianity");
    }
  },

  toggleLanguage() {
    const nextLang = this.currentLang === "ar" ? "en" : "ar";
    this.setLanguage(nextLang, true);
  },

  updateDropdowns() {
    Object.entries(this.dropdownTranslations).forEach(([selectId, langData]) => {
      const select = document.getElementById(selectId);
      if (!select) return;

      const currentVal = select.value;
      const optionsList = langData[this.currentLang] || langData.ar;

      select.innerHTML = optionsList.map(opt => `
        <option value="${opt.value}" ${opt.value === currentVal ? "selected" : ""}>
          ${opt.label}
        </option>
      `).join("");
    });
  }
};

window.toggleLanguage = () => I18nService.toggleLanguage();

document.addEventListener("DOMContentLoaded", () => {
  I18nService.init();
});
