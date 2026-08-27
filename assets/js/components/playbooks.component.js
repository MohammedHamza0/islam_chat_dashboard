/**
 * PlaybooksComponent: Interactive Religion-Specific Dawah Playbooks & Traffic Analytics (Bilingual Arabic & English)
 */
window.PlaybooksComponent = {
  playbooksData: {
    christianity: {
      id: "christianity",
      titleAr: "دليل حوار المسيحيين (Christianity Playbook)",
      titleEn: "Christianity Dawah & Dialogue Playbook",
      countAr: "2,036 محادثة",
      countEn: "2,036 conversations",
      pctAr: "16.4% من إجمالي المنصة",
      pctEn: "16.4% of total platform traffic",
      icon: "fa-cross",
      badgeColor: "var(--insight-purple)",
      badgeBg: "var(--insight-purple-soft)",
      topTopicsAr: [
        "مكانة عيسى عليه السلام في الإسلام (848 إشارة)",
        "التوحيد الخالص ونفي الشريك (750 إشارة)",
        "أصالة وتاريخ كتابة الأناجيل والعهد الجديد",
        "مفهوم الخلاص والصلب والفداء"
      ],
      topTopicsEn: [
        "Status of Jesus & Mary in Islam (848 mentions)",
        "Pure Monotheism / Tawhid (750 mentions)",
        "Gospel Authenticity, Preservation & Textual History",
        "Atonement, Salvation & Crucifixion Claims"
      ],
      topBlockersAr: [
        "عقيدة التثليث وألوهية المسيح (658 محادثة)",
        "الشكوك حول عصمة القرآن والكتب السابقة",
        "الصورة المشوهة حول انتشار الإسلام بالسيف"
      ],
      topBlockersEn: [
        "Doctrine of the Trinity & Divinity of Jesus (658 chats)",
        "Doubts regarding Quranic vs Biblical preservation",
        "Misconceptions on Islam's historical spread"
      ],
      recommendedPlaybookAr: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>البدء بنقاط الاتفاق المشتركة:</strong> إبراز المكانة العظيمة للسيد المسيح وأمه مريم البتول عليهما السلام في القرآن الكريم (سورة مريم وسورة آل عمران).<br>
        2. <strong>تأصيل التوحيد من واقع نصوص الإنجيل:</strong> الاستشهاد بنصوص العهد الجديد التي تؤكد وحدانية الله وأن المسيح رسول مرسل (مثل: يوحنا 17: 3).<br>
        3. <strong>تفكيك إشكالية التثليث بحكمة وعقلانية:</strong> تبيان التناقض العقلي في الجمع بين الأقانيم والتوحيد، وشرح مفهوم الغفران بالرحمة والتوبة المباشرة دون الحاجة لوسيط أو صلب.
      `,
      recommendedPlaybookEn: `
        <strong>Recommended Strategy for Da'ees & AI:</strong><br>
        1. <strong>Start with Common Ground:</strong> Highlight the honorable status of Prophet Jesus and Mary in the Quran (Surah Maryam & Aal-Imran).<br>
        2. <strong>Establish Monotheism from Biblical Texts:</strong> Quote explicit New Testament verses affirming that God is One and Jesus is His messenger (e.g., John 17:3).<br>
        3. <strong>Resolve the Trinity Logically & Compassionately:</strong> Explain the rational inconsistency of triune theology, emphasizing direct forgiveness through sincere repentance without blood sacrifice.
      `
    },
    atheism: {
      id: "atheism",
      titleAr: "دليل حوار الملاحدة واللادينيين (Atheism & Agnosticism)",
      titleEn: "Atheism & Agnosticism Dialogue Playbook",
      countAr: "939 محادثة",
      countEn: "939 conversations",
      pctAr: "7.5% من إجمالي المنصة",
      pctEn: "7.5% of total platform traffic",
      icon: "fa-atom",
      badgeColor: "var(--danger-red)",
      badgeBg: "var(--danger-red-soft)",
      topTopicsAr: [
        "براهين وجود الخالق والعلية الكونية (352 إشارة)",
        "الغاية من الوجود والنشأة الأولى والحياة",
        "الإعجاز العلمي والتناسق الرياضي في الكون",
        "الأخلاق الموضوعية ومصدرها"
      ],
      topTopicsEn: [
        "Cosmological & Teleological Proofs of the Creator (352 mentions)",
        "Purpose of Life, Origin of the Universe & Existence",
        "Fine-Tuning & Mathematical Order in the Cosmos",
        "Origin of Objective Morality & Moral Responsibility"
      ],
      topBlockersAr: [
        "الشك العقلي والمادي (573 محادثة)",
        "مشكلة الشر والألم ومعاناة الأبرياء",
        "افتراض تعارض العلم الحديث مع الأديان"
      ],
      topBlockersEn: [
        "Logical & Materialistic Skepticism (573 chats)",
        "Problem of Evil, Suffering & Natural Disasters",
        "Presumed conflict between Science and Faith"
      ],
      recommendedPlaybookAr: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>تجنب الاستدلال بالنصوص الدينية في البداية:</strong> الملحد لا يؤمن بقدسية الكتب، لذا يجب الاعتماد حصراً على الأدلة العقلية الفطرية وقانون السببية وغائية التصميم (Teleology).<br>
        2. <strong>حل مشكلة الشر برؤية كلية:</strong> توضيح أن الحياة الدنيا دار ابتلاء وامتحان وليست دار جزاء وخلود، وأن وجود الشر نسبي يبرز معنى الخير والحرية الإنسانية والعدل الأخروي.<br>
        3. <strong>إثبات ضرورة المصدر الموضوعي للأخلاق:</strong> تبيان أن الإلحاد المادي لا يستطيع تأسيس أي معيار أخلاقي ملزم دون مرجعية إلهية خالقة.
      `,
      recommendedPlaybookEn: `
        <strong>Recommended Strategy for Da'ees & AI:</strong><br>
        1. <strong>Avoid Scripture-First Proofs Initially:</strong> Rely on universal rational principles: the Principle of Sufficient Reason, fine-tuning, and teleology.<br>
        2. <strong>Address the Problem of Evil Holistically:</strong> Reframe earthly life as a transient testing ground rather than a final paradise, highlighting human free will and ultimate eternal justice.<br>
        3. <strong>Demonstrate the Necessity of a Moral Anchor:</strong> Show that materialism cannot ground objective moral values without a transcendent Creator.
      `
    },
    hinduism: {
      id: "hinduism",
      titleAr: "دليل حوار الهندوس والسيخ (Hinduism & Sikhism)",
      titleEn: "Hinduism & Sikhism Dialogue Playbook",
      countAr: "336 محادثة",
      countEn: "336 conversations",
      pctAr: "2.7% من إجمالي المنصة",
      pctEn: "2.7% of total platform traffic",
      icon: "fa-om",
      badgeColor: "var(--warning-amber)",
      badgeBg: "var(--warning-amber-soft)",
      topTopicsAr: [
        "التوحيد الخالص ونبذ تعدد الآلهة والأصنام (100 إشارة)",
        "إجراءات وخطوات اعتناق الإسلام والشهادة (52 إشارة)",
        "العدالة والمساواة الإنسانية وإلغاء الطبقية (Caste System)",
        "مفهوم البعث والحساب مقابل تناسخ الأرواح"
      ],
      topTopicsEn: [
        "Pure Monotheism vs Idol Worship & Polytheism (100 mentions)",
        "Practical Steps for Shahada & Embracing Islam (52 mentions)",
        "Human Equality, Universal Dignity & Abolition of Caste",
        "Resurrection & Divine Accountability vs Reincarnation"
      ],
      topBlockersAr: [
        "التمسك بالعادات الثقافية الموروثة والأسرة (53 محادثة)",
        "الخوف من النبذ الاجتماعي وملاحقة العائلة",
        "المفاهيم الخاطئة عن معاملة المرأة واللحوم"
      ],
      topBlockersEn: [
        "Cultural Attachment & Family Tradition (53 chats)",
        "Fear of social exclusion & community backlash",
        "Misconceptions regarding dietary laws & women's rights"
      ],
      recommendedPlaybookAr: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>التركيز على نصوص التوحيد في كتبهم القديمة:</strong> الإشارة إلى أن الكتب الهندوسية القديمة (كالفيدا والأوبانيشاد) دعت أصلاً لإله واحد لا شريك له ولا صورة له.<br>
        2. <strong>إبراز المساواة والكرامة الإنسانية في الإسلام:</strong> التأكيد على أن الإسلام ألغى التمييز الطبقي وأن (أكرمكم عند الله أتقاكم).<br>
        3. <strong>تيسير خطوات الإسلام سراً وتطمين السائل:</strong> شرح إمكانية نطق الشهادتين والصلاة سراً للحفاظ على الأمان الشخصي والأسري.
      `,
      recommendedPlaybookEn: `
        <strong>Recommended Strategy for Da'ees & AI:</strong><br>
        1. <strong>Reference Classical Monotheistic Texts:</strong> Highlight that the ancient Vedas and Upanishads explicitly command worship of the One formless Supreme Creator.<br>
        2. <strong>Emphasize Absolute Human Equality:</strong> Contrast the universal brotherhood of Islam with inherited caste hierarchies.<br>
        3. <strong>Facilitate Secret Conversion & Reassurance:</strong> Reassure seekers that the Shahada and essential prayers can be practiced privately to safeguard family security.
      `
    },
    judaism: {
      id: "judaism",
      titleAr: "دليل حوار اليهود (Judaism Playbook)",
      titleEn: "Judaism Dialogue Playbook",
      countAr: "88 محادثة",
      countEn: "88 conversations",
      pctAr: "0.7% من إجمالي المنصة",
      pctEn: "0.7% of total platform traffic",
      icon: "fa-star-of-david",
      badgeColor: "var(--data-blue)",
      badgeBg: "var(--data-blue-soft)",
      topTopicsAr: [
        "نبوة محمد ﷺ واستمرارية الرسالات (28 إشارة)",
        "التوحيد النقي والشريعة والأحكام الفقهية (30 إشارة)",
        "حفظ القرآن ومقارنته بالمخطوطات القديمة",
        "بشارات الأنبياء في التوراة"
      ],
      topTopicsEn: [
        "Prophethood of Muhammad ﷺ & Prophetic Continuity (28 mentions)",
        "Strict Monotheism, Divine Law & Halal/Kosher dietary overlap",
        "Quranic Preservation vs Ancient Torah Manuscripts",
        "Biblical Prophecies of the Final Prophet (Paran/Ishmael)"
      ],
      topBlockersAr: [
        "عقيدة شعب الله المختار وحصرية النبوة في بني إسرائيل",
        "الشكوك حول نبوة رسول من العرب",
        "التشويش السياسي والإعلامي المعاصر"
      ],
      topBlockersEn: [
        "Ethnic Exclusivity ('Chosen People' & prophetic lineage)",
        "Skepticism of a non-Israelite Arab prophet",
        "Contemporary geopolitical and media bias"
      ],
      recommendedPlaybookAr: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>التأكيد على استمرارية رسالة إبراهيم وموسى عليهما السلام:</strong> أن الإسلام جاء مصدقاً لما بين يديه ومتمماً لدعوة التوحيد الإبراهيمي.<br>
        2. <strong>إبراز صفات النبي الخاتم في العهد القديم:</strong> الإشارة إلى نبوءات تثنية 18: 18 وإشعياء 42 حول النبي القادم من نسل إسماعيل (فاران).<br>
        3. <strong>إبراز نقاء التوحيد الإسلامي التام</strong> الذي يتوافق جوهرياً مع أصل الوصايا العشر.
      `,
      recommendedPlaybookEn: `
        <strong>Recommended Strategy for Da'ees & AI:</strong><br>
        1. <strong>Affirm Abrahamic & Mosaic Lineage:</strong> Position Islam as the direct continuation of Abraham's and Moses' pure monotheistic call.<br>
        2. <strong>Highlight Prophecies in the Hebrew Bible:</strong> Examine Deuteronomy 18:18 and Isaiah 42 pointing to the prophet from the brethren of Israel (Ishmaelites of Kedar/Paran).<br>
        3. <strong>Demonstrate Shared Theological Purity:</strong> Emphasize Islam's uncompromising rejection of idolatry, matching the core Ten Commandments.
      `
    },
    buddhism: {
      id: "buddhism",
      titleAr: "دليل حوار البوذيين والشرق آسيويين (Buddhism Playbook)",
      titleEn: "Buddhism & East Asian Seekers Playbook",
      countAr: "103 محادثات",
      countEn: "103 conversations",
      pctAr: "0.8% من إجمالي المنصة",
      pctEn: "0.8% of total platform traffic",
      icon: "fa-dharmachakra",
      badgeColor: "var(--benefit-green)",
      badgeBg: "var(--benefit-green-soft)",
      topTopicsAr: [
        "الغاية من الحياة والوجود والسكينة النفسية (23 إشارة)",
        "الحياة بعد الموت والبعث والخلود الحقيقي",
        "الانضباط الروحي والصلة المباشرة بالخالق",
        "العدل والجزاء الأخروي"
      ],
      topTopicsEn: [
        "Ultimate Purpose of Life, Existence & Inner Peace (23 mentions)",
        "Life after Death, Resurrection vs Endless Reincarnation",
        "Spiritual Discipline, Daily Prayer & Direct Connection with God",
        "Divine Justice and Eternal Paradise"
      ],
      topBlockersAr: [
        "ضعف الاهتمام بالغيبيات والتركيز على الممارسة الدنيوية فقط (45 محادثة)",
        "الحيرة بين المدارس الفلسفية",
        "غياب المفهوم الواضح للإله الخالق في التراث البوذي"
      ],
      topBlockersEn: [
        "Apathy towards the Unseen & focus on secular meditation (45 chats)",
        "Philosophical agnosticism regarding the Creator",
        "Misconception of divine judgment vs karma"
      ],
      recommendedPlaybookAr: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>الانطلاق من البحث عن السلام الداخلي والغاية الكبرى:</strong> تبيان أن السكينة الروحية الكاملة لا تتحقق إلا بالاتصال بمصدر الوجود وبارئ النفس.<br>
        2. <strong>توضيح مفهوم الحياة الأبدية:</strong> شرح حقيقة البعث والجنة كنعيم أبدي يتجاوز آلام الدنيا دون حاجة لدورات التناسخ اللانهائية.<br>
        3. <strong>إبراز العبادات العملية في الإسلام</strong> (كالصلاة والصيام) كرياضة روحية وجسدية متكاملة.
      `,
      recommendedPlaybookEn: `
        <strong>Recommended Strategy for Da'ees & AI:</strong><br>
        1. <strong>Connect Through the Search for Inner Peace:</strong> Explain that true lasting tranquility is achieved by reconnecting with the Originator of consciousness.<br>
        2. <strong>Present the Clarity of Eternal Paradise:</strong> Contrast the endless, painful cycles of rebirth (Samsara) with the blissful, permanent reward of Paradise.<br>
        3. <strong>Highlight Islamic Spiritual Practices:</strong> Present Salah (daily prayer) and Dhikr as grounded spiritual mindfulness that connects soul and body directly to God.
      `
    }
  },

  renderPlaybook(religionKey) {
    const data = this.playbooksData[religionKey] || this.playbooksData.christianity;
    const container = document.getElementById("playbook-content-display");
    if (!container) return;

    const isEn = window.I18nService && window.I18nService.currentLang === "en";

    // Update active tab styling
    document.querySelectorAll(".playbook-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("onclick")?.includes(religionKey));
    });

    const title = isEn ? data.titleEn : data.titleAr;
    const count = isEn ? data.countEn : data.countAr;
    const pct = isEn ? data.pctEn : data.pctAr;
    const topTopics = isEn ? data.topTopicsEn : data.topTopicsAr;
    const topBlockers = isEn ? data.topBlockersEn : data.topBlockersAr;
    const strategy = isEn ? data.recommendedPlaybookEn : data.recommendedPlaybookAr;

    const sampleLabel = isEn ? "Analysis Sample:" : "عينة التحليل:";
    const certifiedBadge = isEn ? "Verified Operational Guide" : "دليل تشغيلي معتمد";
    const topicsHeader = isEn ? "Core Interests & Most Frequent Topics" : "أهم اهتمامات ومواضيع السائلين";
    const blockersHeader = isEn ? "Primary Recorded Blockers & Objections" : "أبرز العوائق والشبهات المسجلة";
    const roadmapHeader = isEn ? "Recommended Strategic Roadmap for Da'ees & AI" : "خارطة طريق الحوار الموصى بها للداعية والذكاء الاصطناعي";

    container.innerHTML = `
      <div class="playbook-card">
        <div class="playbook-header">
          <div class="playbook-title-area">
            <div class="playbook-icon-badge" style="background: ${data.badgeBg}; color: ${data.badgeColor};">
              <i class="fa-solid ${data.icon}"></i>
            </div>
            <div>
              <h3 style="font-size: 18px; font-weight: 900; color: var(--text-primary);">${title}</h3>
              <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 2px;">${sampleLabel} <strong>${count}</strong> (${pct})</p>
            </div>
          </div>
          <span class="badge" style="background: ${data.badgeBg}; color: ${data.badgeColor}; font-size: 12px; padding: 6px 12px;">
            <i class="fa-solid fa-book-bookmark"></i> ${certifiedBadge}
          </span>
        </div>

        <div class="playbook-grid-3">
          <div class="playbook-subbox">
            <div class="playbook-subbox-title" style="color: var(--brand-teal);">
              <i class="fa-solid fa-list-check"></i> ${topicsHeader}
            </div>
            <ul>
              ${topTopics.map(t => `<li>${t}</li>`).join("")}
            </ul>
          </div>

          <div class="playbook-subbox">
            <div class="playbook-subbox-title" style="color: var(--danger-red);">
              <i class="fa-solid fa-triangle-exclamation"></i> ${blockersHeader}
            </div>
            <ul>
              ${topBlockers.map(b => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="playbook-strategy-box">
          <div class="playbook-strategy-title">
            <i class="fa-solid fa-compass"></i> ${roadmapHeader}
          </div>
          <div class="playbook-strategy-text">
            ${strategy}
          </div>
        </div>
      </div>
    `;
  }
};

window.switchPlaybook = (key) => PlaybooksComponent.renderPlaybook(key);

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("playbook-content-display")) {
    PlaybooksComponent.renderPlaybook("christianity");
  }
});
