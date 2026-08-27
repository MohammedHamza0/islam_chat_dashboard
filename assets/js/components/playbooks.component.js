/**
 * PlaybooksComponent: Interactive Religion-Specific Dawah Playbooks & Traffic Analytics (Eng.Menna Data)
 */
window.PlaybooksComponent = {
  playbooksData: {
    christianity: {
      id: "christianity",
      title: "دليل حوار المسيحيين (Christianity Playbook)",
      count: "2,036 محادثة",
      pct: "16.4% من إجمالي المنصة",
      icon: "fa-cross",
      badgeColor: "var(--insight-purple)",
      badgeBg: "var(--insight-purple-soft)",
      topTopics: [
        "مكانة عيسى عليه السلام في الإسلام (848 إشارة)",
        "التوحيد الخالص ونفي الشريك (750 إشارة)",
        "أصالة وتاريخ كتابة الأناجيل والعهد الجديد",
        "مفهوم الخلاص والصلب والفداء"
      ],
      topBlockers: [
        "عقيدة التثليث وألوهية المسيح (658 محادثة)",
        "الشكوك حول عصمة القرآن والكتب السابقة",
        "الصورة المشوهة حول انتشار الإسلام بالسيف"
      ],
      recommendedPlaybook: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>البدء بنقاط الاتفاق المشتركة:</strong> إبراز المكانة العظيمة للسيد المسيح وأمه مريم البتول عليهما السلام في القرآن الكريم (سورة مريم وسورة آل عمران).<br>
        2. <strong>تأصيل التوحيد من واقع نصوص الإنجيل:</strong> الاستشهاد بنصوص العهد الجديد التي تؤكد وحدانية الله وأن المسيح رسول مرسل (مثل: يوحنا 17: 3).<br>
        3. <strong>تفكيك إشكالية التثليث بحكمة وعقلانية:</strong> تبيان التناقض العقلي في الجمع بين الأقانيم والتوحيد، وشرح مفهوم الغفران بالرحمة والتوبة المباشرة دون الحاجة لوسيط أو صلب.
      `
    },
    atheism: {
      id: "atheism",
      title: "دليل حوار الملاحدة واللادينيين (Atheism & Agnosticism)",
      count: "939 محادثة",
      pct: "7.5% من إجمالي المنصة",
      icon: "fa-atom",
      badgeColor: "var(--danger-red)",
      badgeBg: "var(--danger-red-soft)",
      topTopics: [
        "براهين وجود الخالق والعلية الكونية (352 إشارة)",
        "الغاية من الوجود والنشأة الأولى والحياة",
        "الإعجاز العلمي والتناسق الرياضي في الكون",
        "الأخلاق الموضوعية ومصدرها"
      ],
      topBlockers: [
        "الشك العقلي والمادي (573 محادثة)",
        "مشكلة الشر والألم ومعاناة الأبرياء",
        "افتراض تعارض العلم الحديث مع الأديان"
      ],
      recommendedPlaybook: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>تجنب الاستدلال بالنصوص الدينية في البداية:</strong> الملحد لا يؤمن بقدسية الكتب، لذا يجب الاعتماد حصراً على الأدلة العقلية الفطرية وقانون السببية وغائية التصميم (Teleology).<br>
        2. <strong>حل مشكلة الشر برؤية كلية:</strong> توضيح أن الحياة الدنيا دار ابتلاء وامتحان وليست دار جزاء وخلود، وأن وجود الشر نسبي يبرز معنى الخير والحرية الإنسانية والعدل الأخروي.<br>
        3. <strong>إثبات ضرورة المصدر الموضوعي للأخلاق:</strong> تبيان أن الإلحاد المادي لا يستطيع تأسيس أي معيار أخلاقي ملزم دون مرجعية إلهية خالقة.
      `
    },
    hinduism: {
      id: "hinduism",
      title: "دليل حوار الهندوس والسيخ (Hinduism & Sikhism)",
      count: "336 محادثة",
      pct: "2.7% من إجمالي المنصة",
      icon: "fa-om",
      badgeColor: "var(--warning-amber)",
      badgeBg: "var(--warning-amber-soft)",
      topTopics: [
        "التوحيد الخالص ونبذ تعدد الآلهة والأصنام (100 إشارة)",
        "إجراءات وخطوات اعتناق الإسلام والشهادة (52 إشارة)",
        "العدالة والمساواة الإنسانية وإلغاء الطبقية (Caste System)",
        "مفهوم البعث والحساب مقابل تناسخ الأرواح"
      ],
      topBlockers: [
        "التمسك بالعادات الثقافية الموروثة والأسرة (53 محادثة)",
        "الخوف من النبذ الاجتماعي وملاحقة العائلة",
        "المفاهيم الخاطئة عن معاملة المرأة واللحوم"
      ],
      recommendedPlaybook: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>التركيز على نصوص التوحيد في كتبهم القديمة:</strong> الإشارة إلى أن الكتب الهندوسية القديمة (كالفيدا والأوبانيشاد) دعت أصلاً لإله واحد لا شريك له ولا صورة له.<br>
        2. <strong>إبراز المساواة والكرامة الإنسانية في الإسلام:</strong> التأكيد على أن الإسلام ألغى التمييز الطبقي وأن (أكرمكم عند الله أتقاكم).<br>
        3. <strong>تيسير خطوات الإسلام سراً وتطمين السائل:</strong> شرح إمكانية نطق الشهادتين والصلاة سراً للحفاظ على الأمان الشخصي والأسري.
      `
    },
    judaism: {
      id: "judaism",
      title: "دليل حوار اليهود (Judaism Playbook)",
      count: "88 محادثة",
      pct: "0.7% من إجمالي المنصة",
      icon: "fa-star-of-david",
      badgeColor: "var(--data-blue)",
      badgeBg: "var(--data-blue-soft)",
      topTopics: [
        "نبوة محمد ﷺ واستمرارية الرسالات (28 إشارة)",
        "التوحيد النقي والشريعة والأحكام الفقهية (30 إشارة)",
        "حفظ القرآن ومقارنته بالمخطوطات القديمة",
        "بشارات الأنبياء في التوراة"
      ],
      topBlockers: [
        "عقيدة شعب الله المختار وحصرية النبوة في بني إسرائيل",
        "الشكوك حول نبوة رسول من العرب",
        "التشويش السياسي والإعلامي المعاصر"
      ],
      recommendedPlaybook: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>التأكيد على استمرارية رسالة إبراهيم وموسى عليهما السلام:</strong> أن الإسلام جاء مصدقاً لما بين يديه ومتمماً لدعوة التوحيد الإبراهيمي.<br>
        2. <strong>إبراز صفات النبي الخاتم في العهد القديم:</strong> الإشارة إلى نبوءات تثنية 18: 18 وإشعياء 42 حول النبي القادم من نسل إسماعيل (فاران).<br>
        3. <strong>إبراز نقاء التوحيد الإسلامي التام</strong> الذي يتوافق جوهرياً مع أصل الوصايا العشر.
      `
    },
    buddhism: {
      id: "buddhism",
      title: "دليل حوار البوذيين والشرق آسيويين (Buddhism Playbook)",
      count: "103 محادثات",
      pct: "0.8% من إجمالي المنصة",
      icon: "fa-dharmachakra",
      badgeColor: "var(--benefit-green)",
      badgeBg: "var(--benefit-green-soft)",
      topTopics: [
        "الغاية من الحياة والوجود والسكينة النفسية (23 إشارة)",
        "الحياة بعد الموت والبعث والخلود الحقيقي",
        "الانضباط الروحي والصلة المباشرة بالخالق",
        "العدل والجزاء الأخروي"
      ],
      topBlockers: [
        "ضعف الاهتمام بالغيبيات والتركيز على الممارسة الدنيوية فقط (45 محادثة)",
        "الحيرة بين المدارس الفلسفية",
        "غياب المفهوم الواضح للإله الخالق في التراث البوذي"
      ],
      recommendedPlaybook: `
        <strong>الاستراتيجية الموصى بها للدعاة والذكاء الاصطناعي:</strong><br>
        1. <strong>الانطلاق من البحث عن السلام الداخلي والغاية الكبرى:</strong> تبيان أن السكينة الروحية الكاملة لا تتحقق إلا بالاتصال بمصدر الوجود وبارئ النفس.<br>
        2. <strong>توضيح مفهوم الحياة الأبدية:</strong> شرح حقيقة البعث والجنة كنعيم أبدي يتجاوز آلام الدنيا دون حاجة لدورات التناسخ اللانهائية.<br>
        3. <strong>إبراز العبادات العملية في الإسلام</strong> (كالصلاة والصيام) كرياضة روحية وجسدية متكاملة.
      `
    }
  },

  renderPlaybook(religionKey) {
    const data = this.playbooksData[religionKey] || this.playbooksData.christianity;
    const container = document.getElementById("playbook-content-display");
    if (!container) return;

    // Update active tab styling
    document.querySelectorAll(".playbook-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("onclick")?.includes(religionKey));
    });

    container.innerHTML = `
      <div class="playbook-card">
        <div class="playbook-header">
          <div class="playbook-title-area">
            <div class="playbook-icon-badge" style="background: ${data.badgeBg}; color: ${data.badgeColor};">
              <i class="fa-solid ${data.icon}"></i>
            </div>
            <div>
              <h3 style="font-size: 18px; font-weight: 900; color: var(--text-primary);">${data.title}</h3>
              <p style="font-size: 12.5px; color: var(--text-muted); margin-top: 2px;">عينة التحليل: <strong>${data.count}</strong> (${data.pct})</p>
            </div>
          </div>
          <span class="badge" style="background: ${data.badgeBg}; color: ${data.badgeColor}; font-size: 12px; padding: 6px 12px;">
            <i class="fa-solid fa-book-bookmark"></i> دليل تشغيلي معتمد
          </span>
        </div>

        <div class="playbook-grid-3">
          <div class="playbook-subbox">
            <div class="playbook-subbox-title" style="color: var(--brand-teal);">
              <i class="fa-solid fa-list-check"></i> أهم اهتمامات ومواضيع السائلين
            </div>
            <ul>
              ${data.topTopics.map(t => `<li>${t}</li>`).join("")}
            </ul>
          </div>

          <div class="playbook-subbox">
            <div class="playbook-subbox-title" style="color: var(--danger-red);">
              <i class="fa-solid fa-triangle-exclamation"></i> أبرز العوائق والشبهات المسجلة
            </div>
            <ul>
              ${data.topBlockers.map(b => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="playbook-strategy-box">
          <div class="playbook-strategy-title">
            <i class="fa-solid fa-compass"></i> خارطة طريق الحوار الموصى بها للداعية والذكاء الاصطناعي
          </div>
          <div class="playbook-strategy-text">
            ${data.recommendedPlaybook}
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
