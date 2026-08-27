import re
from pathlib import Path

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
SCRATCH_MACRO = Path(r"C:\Users\moham\.gemini\antigravity-ide\brain\8d78b02f-ebad-474f-8bec-5597a59a7c81\scratch\macro_section.html")
INDEX_FILE = WORKSPACE / "index.html"

with open(SCRATCH_MACRO, "r", encoding="utf-8") as f:
    macro_html = f.read()

index_template = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>المنصة الموحدة لتحليلات واستكشاف محادثات منصة Islam.chat | Full Intelligence & Q&A Hub</title>
  
  <!-- Google Fonts: Cairo, Plus Jakarta Sans, IBM Plex Sans Arabic -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Modular Stylesheets (Microservices Architecture) -->
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/navbar.css">
  <link rel="stylesheet" href="assets/css/kpi.css">
  <link rel="stylesheet" href="assets/css/filter-matrix.css">
  <link rel="stylesheet" href="assets/css/qa-explorer.css">
  <link rel="stylesheet" href="assets/css/macro-analytics.css">
  <link rel="stylesheet" href="assets/css/modal.css">

  <!-- Chart.js for Dynamic Visualizations -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body data-theme="light">

  <div id="progress-bar"></div>

  <!-- Top Sticky Navigation Bar -->
  <header class="top-navbar">
    <a href="#" class="brand-logo">
      <div class="brand-icon">
        <i class="fa-solid fa-kaaba"></i>
      </div>
      <div class="brand-text">
        <h1>Islam.chat Intelligence Hub</h1>
        <span>منظومة استكشاف الأسئلة والتحليل السلوكي الذكي (100% LLM Ground Truth)</span>
      </div>
    </a>

    <!-- View Mode Switcher -->
    <div class="view-mode-tabs">
      <button class="view-tab-btn active" onclick="switchMainTab('explorer-view')">
        <i class="fa-solid fa-compass"></i> مستكشف الأسئلة والفلاتر
      </button>
      <button class="view-tab-btn" onclick="switchMainTab('macro-analytics-view')">
        <i class="fa-solid fa-chart-line"></i> التحليل الإحصائي العام (17 رسمة)
      </button>
      <button class="view-tab-btn" onclick="switchMainTab('action-plan-view')">
        <i class="fa-solid fa-flag-checkered"></i> التوصيات وخطة العمل
      </button>
    </div>

    <!-- Actions -->
    <div class="nav-actions">
      <button class="btn-export" onclick="exportFilteredDataCSV()">
        <i class="fa-solid fa-file-csv"></i> تصدير البيانات المفلترة
      </button>

      <button class="theme-toggle-btn" id="theme-toggle" title="تبديل الوضع الليلي / الفاتح" onclick="toggleTheme()">
        <i class="fa-solid fa-moon"></i>
      </button>
    </div>
  </header>

  <!-- Main Dashboard Container -->
  <div class="dashboard-container">

    <!-- ====================================================================
         TAB 1: Interactive Q&A Explorer & Behavioral Filter Matrix
         ==================================================================== -->
    <section id="explorer-view" class="tab-content active">

      <!-- Hero & Dynamic Metrics -->
      <div class="hero-banner">
        <div class="hero-badge">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>بيانات موثقة 100% بالذكاء الاصطناعي (Gemini 3.1 Flash Lite) عبر 12,448 محادثة</span>
        </div>
        <h2 class="hero-title">لوحة استكشاف وتصفية الأسئلة الشرعية والدعوية المعتمدة على الذكاء الاصطناعي</h2>
        <p class="hero-subtitle">
          تتيح هذه المنصة فحص وتصفية الأسئلة المستخرجة بدقة فائقة بالاعتماد على <strong>الديانة الموثقة للسائل</strong>، <strong>النية الحقيقية</strong>، <strong>مراحل قمع الهداية (Conversion Funnel)</strong>، <strong>العوائق والشبهات الفكرية (Theological Blockers)</strong>، و<strong>نوع الحوار</strong>.
        </p>

        <!-- KPI Metrics (Ground Truth) -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">الأسئلة المطابقة للفلتر</span>
              <div class="kpi-icon" style="background: var(--brand-teal-soft); color: var(--brand-teal);"><i class="fa-solid fa-comments"></i></div>
            </div>
            <div class="kpi-val" id="kpi-filtered-count">11,596</div>
            <div class="kpi-sub" id="kpi-percentage-badge">100% من إجمالي الأسئلة</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">باحثون صادقون عن الحقيقة</span>
              <div class="kpi-icon" style="background: var(--data-blue-soft); color: var(--data-blue);"><i class="fa-solid fa-magnifying-glass-location"></i></div>
            </div>
            <div class="kpi-val" id="kpi-seekers-count">1,822</div>
            <div class="kpi-sub">Genuine Seekers</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">مناظرون ومشككون</span>
              <div class="kpi-icon" style="background: var(--insight-purple-soft); color: var(--insight-purple);"><i class="fa-solid fa-scale-balanced"></i></div>
            </div>
            <div class="kpi-val" id="kpi-challengers-count">3,264</div>
            <div class="kpi-sub">Challengers & Debaters</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">اعتنقوا الإسلام بالفعل</span>
              <div class="kpi-icon" style="background: var(--benefit-green-soft); color: var(--benefit-green);"><i class="fa-solid fa-check-double"></i></div>
            </div>
            <div class="kpi-val" id="kpi-converted-count">346</div>
            <div class="kpi-sub">Converted (حالات مؤكدة)</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">مهتمون باعتناق الإسلام</span>
              <div class="kpi-icon" style="background: var(--warning-amber-soft); color: var(--warning-amber);"><i class="fa-solid fa-heart"></i></div>
            </div>
            <div class="kpi-val" id="kpi-interest-count">545</div>
            <div class="kpi-sub">Conversion Interest</div>
          </div>
        </div>
      </div>

      <!-- Multi-Faceted Filter Matrix (10 LLM Ground Truth Dimensions) -->
      <div class="filter-panel">
        <div class="filter-panel-header">
          <div class="filter-panel-title">
            <i class="fa-solid fa-sliders"></i> شريط الفلاتر الذكي المعتمد على الذكاء الاصطناعي (Smart Multi-Filter Matrix)
          </div>
          <div class="filter-actions">
            <button class="btn-action" onclick="resetAllFilters()">
              <i class="fa-solid fa-rotate-left"></i> إعادة ضبط الفلاتر
            </button>
          </div>
        </div>

        <div class="filter-grid">
          <!-- Filter 1: Year / Date -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-calendar"></i> السنة / النطاق الزمني</label>
            <select id="filter-year" class="filter-select" onchange="applyFilters()">
              <option value="all">كل السنوات (2024 - 2026)</option>
              <option value="2026">2026 (الربع الأول)</option>
              <option value="2025">2025 (سنة الانتشار الكبرى)</option>
              <option value="2024">2024 (فترة الإطلاق التجريبي)</option>
            </select>
            <div class="quick-year-chips">
              <button class="chip-btn active" onclick="setQuickYear('all', this)">الكل</button>
              <button class="chip-btn" onclick="setQuickYear('2026', this)">2026</button>
              <button class="chip-btn" onclick="setQuickYear('2025', this)">2025</button>
              <button class="chip-btn" onclick="setQuickYear('2024', this)">2024</button>
            </div>
          </div>

          <!-- Filter 2: Faith & User Belief (LLM Ground Truth) -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-user-tag"></i> ديانة / معتقد السائل الموثق</label>
            <select id="filter-faith" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع المعتقدات والديانات</option>
              <option value="الإسلام (مسلم)">الإسلام (مسلم: 5,337)</option>
              <option value="المسيحية">المسيحية (2,760)</option>
              <option value="غير محدد / غير معلن">غير محدد / غير معلن (1,431)</option>
              <option value="الإلحاد (ملحد)">الإلحاد (ملحد: 880)</option>
              <option value="اللاأدرية (Agnostic)">اللاأدرية (Agnostic: 342)</option>
              <option value="الهندوسية">الهندوسية (334)</option>
              <option value="لاديني عام">لاديني عام (155)</option>
              <option value="البوذية">البوذية (85)</option>
              <option value="اليهودية">اليهودية (80)</option>
              <option value="أديان ومعتقدات أخرى">أديان ومعتقدات أخرى (190)</option>
              <option value="السيخية">السيخية (2)</option>
            </select>
          </div>

          <!-- Filter 3: Intent Classification (LLM Ground Truth) -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-bullseye"></i> نية وطبيعة السائل</label>
            <select id="filter-intent" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع النوايا والأنماط</option>
              <option value="مسلم يتعلم أحكام دينه">مسلم يتعلم أحكام دينه (4,544)</option>
              <option value="مناظر ومشكك يتحدى البوت">مناظر ومشكك يتحدى البوت (3,264)</option>
              <option value="باحث صادق عن الحقيقة">باحث صادق عن الحقيقة (1,822)</option>
              <option value="مستمع سلبي / متابع">مستمع سلبي / متابع (847)</option>
              <option value="مهتم باعتناق الإسلام">مهتم باعتناق الإسلام (545)</option>
              <option value="استفسار خارج الموضوع">استفسار خارج الموضوع (303)</option>
              <option value="تدريب على أساليب الدعوة">تدريب على أساليب الدعوة (209)</option>
              <option value="عبث أو سبام">عبث أو سبام (42)</option>
            </select>
          </div>

          <!-- Filter 4: Conversion Funnel Stage (NEW LLM Dimension) -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-filter-circle-dollar"></i> مرحلة قمع الدعوة والهداية</label>
            <select id="filter-funnel" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع مراحل القمع الدعوي</option>
              <option value="اعتنق الإسلام بالفعل (Converted)">اعتنق الإسلام بالفعل - Converted (346)</option>
              <option value="المرحلة الختامية (على مشارف الإسلام)">المرحلة الختامية (على مشارف الإسلام: 213)</option>
              <option value="المرحلة المتوسطة (اهتمام ومناقشة)">المرحلة المتوسطة (اهتمام ومناقشة: 3,371)</option>
              <option value="المرحلة التمهيدية (استكشاف أولي)">المرحلة التمهيدية (استكشاف أولي: 684)</option>
              <option value="انسحب أثناء الحوار">انسحب أثناء الحوار (1,103)</option>
              <option value="غير منطبق (مسلم أو عام)">غير منطبق - مسلم أو عام (5,879)</option>
            </select>
          </div>

          <!-- Filter 5: Key Blocker / Theological Objection (NEW LLM Dimension) -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-shield-halved"></i> العائق الفكري والشبهة الرئيسية</label>
            <select id="filter-blocker" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع العوائق والشبهات</option>
              <option value="الشك العقلي والمنطقي">الشك العقلي والمنطقي (2,397)</option>
              <option value="عقيدة التثليث (لدى النصارى)">عقيدة التثليث لدى النصارى (703)</option>
              <option value="اعتراضات أخلاقية واجتماعية">اعتراضات أخلاقية واجتماعية (459)</option>
              <option value="التمسك بالهوية الثقافية">التمسك بالهوية الثقافية (292)</option>
              <option value="الصورة المشوهة في الإعلام">الصورة المشوهة في الإعلام (256)</option>
              <option value="ضعف الاهتمام والجدية">ضعف الاهتمام والجدية (209)</option>
              <option value="الحيرة بين الفرق والمذاهب">الحيرة بين الفرق والمذاهب (141)</option>
              <option value="الخوف من ضغط الأهل والمجتمع">الخوف من ضغط الأهل والمجتمع (100)</option>
              <option value="إنكار وجود الخالق (مادي)">إنكار وجود الخالق (26)</option>
              <option value="انعدام الثقة في المؤسسات الدينية">انعدام الثقة في المؤسسات الدينية (26)</option>
              <option value="لا يوجد عائق محدد">لا يوجد عائق محدد (6,958)</option>
            </select>
          </div>

          <!-- Filter 6: Conversation Type (NEW LLM Dimension) -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-comments-dollar"></i> نوع وسياق المحادثة</label>
            <select id="filter-convtype" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع أنواع المحادثات</option>
              <option value="إرشاد وتوجيه إسلامي">إرشاد وتوجيه إسلامي (3,999)</option>
              <option value="مناظرة عقدية ولاهوتية">مناظرة عقدية ولاهوتية (3,140)</option>
              <option value="دعوة غير المسلمين">دعوة غير المسلمين (2,563)</option>
              <option value="تدريب وتأهيل دعوي">تدريب وتأهيل دعوي (1,333)</option>
              <option value="مساعدة في نصوص أو ترجمة">مساعدة في نصوص أو ترجمة (230)</option>
              <option value="دعم نفسي واستشارة روحية">دعم نفسي واستشارة روحية (99)</option>
              <option value="خارج سياق المنصة">خارج سياق المنصة (185)</option>
            </select>
          </div>

          <!-- Filter 7: Topic Category -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-book-quran"></i> الباب والموضوع الشرعي</label>
            <select id="filter-topic" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع الأبواب الشرعية</option>
              <option value="العقيدة وأصول الإيمان">العقيدة وأصول الإيمان (2,604)</option>
              <option value="مقارنة الأديان وحوار غير المسلمين">مقارنة الأديان وحوار غير المسلمين (2,367)</option>
              <option value="الفقه والعبادات والأحكام">الفقه والعبادات والأحكام (1,990)</option>
              <option value="القرآن الكريم والتفسير">القرآن الكريم والتفسير (1,030)</option>
              <option value="منهجية الدعوة والردود">منهجية الدعوة والردود (788)</option>
              <option value="الحديث الشريف والسيرة النبوية">الحديث الشريف والسيرة النبوية (766)</option>
              <option value="رعاية وتعليم المسلمين الجدد">رعاية وتعليم المسلمين الجدد (610)</option>
              <option value="الأخلاق والآداب الإسلامية">الأخلاق والآداب الإسلامية (498)</option>
              <option value="التاريخ والحضارة الإسلامية">التاريخ والحضارة الإسلامية (399)</option>
              <option value="الاستشارات والتوجيه الشخصي">الاستشارات والتوجيه الشخصي (382)</option>
            </select>
          </div>

          <!-- Filter 8: Language -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-globe"></i> لغة المحادثة (51 لغة)</label>
            <select id="filter-language" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع اللغات (51 لغة)</option>
              <option value="English">الإنجليزية (English: 4,612)</option>
              <option value="Arabic">العربية (Arabic: 4,297)</option>
              <option value="Swahili">السواحلية (Swahili: 847)</option>
              <option value="Japanese">اليابانية (Japanese: 386)</option>
              <option value="French">الفرنسية (French: 281)</option>
              <option value="Filipino">الفلبينية (Filipino: 230)</option>
              <option value="Korean">الكورية (Korean: 153)</option>
              <option value="Central Kurdish">الكردية (Kurdish: 143)</option>
              <option value="Urdu">الأردية (Urdu: 126)</option>
              <option value="Najdi Arabic">العربية النجدية (66)</option>
              <option value="German">الألمانية (German: 51)</option>
              <option value="Spanish">الإسبانية (Spanish: 46)</option>
              <option value="Russian">الروسية (Russian: 38)</option>
              <option value="Indonesian">الإندونيسية (Indonesian: 34)</option>
            </select>
          </div>

          <!-- Filter 9: Geographic Region -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-map-location-dot"></i> المنطقة الجغرافية</label>
            <select id="filter-region" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع المناطق الجغرافية</option>
              <option value="العالم الغربي والناطق بالإنجليزية">العالم الغربي والناطق بالإنجليزية (4,612)</option>
              <option value="الشرق الأوسط وشمال أفريقيا">الشرق الأوسط وشمال أفريقيا (4,363)</option>
              <option value="أفريقيا جنوب الصحراء">أفريقيا جنوب الصحراء (850)</option>
              <option value="شرق وجنوب شرق آسيا">شرق وجنوب شرق آسيا (805)</option>
              <option value="أوروبا وأمريكا اللاتينية">أوروبا وأمريكا اللاتينية (403)</option>
              <option value="آسيا الوسطى وأوراسيا">آسيا الوسطى وأوراسيا (224)</option>
              <option value="جنوب آسيا (شبه القارة الهندية)">جنوب آسيا (شبه القارة الهندية: 185)</option>
            </select>
          </div>

          <!-- Filter 10: Trending / Cluster Size -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-fire-flame-curved"></i> تكرار وشهرة السؤال</label>
            <select id="filter-trending" class="filter-select" onchange="applyFilters()">
              <option value="all">الكل (الأسئلة الفردية والشائعة)</option>
              <option value="trending_only">الأسئلة الأكثر تكراراً فقط (Trending > 1)</option>
              <option value="unique_only">الأسئلة الفردية فقط</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Dynamic Live Charts Row -->
      <div class="charts-split-grid">
        <div class="chart-card">
          <div class="chart-card-header">
            <span class="chart-card-title"><i class="fa-solid fa-chart-area"></i> توزيع وتطور الأسئلة المفلترة عبر الأشهر</span>
            <span class="badge badge-topic" id="chart-timeline-badge">تحديث فوري</span>
          </div>
          <div class="chart-canvas-wrapper">
            <canvas id="timelineChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-card-header">
            <span class="chart-card-title"><i class="fa-solid fa-chart-pie"></i> توزيع معتقدات وسلوك السائلين للنتائج الحالية (LLM)</span>
            <span class="badge badge-faith" id="chart-faith-badge">Faith Breakdown</span>
          </div>
          <div class="chart-canvas-wrapper">
            <canvas id="faithChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Results Header & Controls -->
      <div class="results-bar">
        <div class="results-count-title">
          <i class="fa-solid fa-list-check"></i> قائمة الأسئلة المستخرجة (<span id="results-count">11,596</span> سؤالاً مطابقاً)
        </div>

        <div class="results-controls">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="live-search-input" class="filter-input" placeholder="ابحث في نص السؤال، الإجابة، أو العائق الفكري..." onkeyup="onSearchInput()">
          </div>

          <select id="sort-select" class="filter-select" style="width: 170px;" onchange="applySort()">
            <option value="trending_desc">الأكثر تكراراً (Trending)</option>
            <option value="id_desc">الأحدث إضافة</option>
            <option value="id_asc">الأقدم إضافة</option>
            <option value="richness_desc">الأطول إجابة وثراءً</option>
          </select>
        </div>
      </div>

      <!-- Cards Grid -->
      <div class="qa-cards-grid" id="qa-cards-container">
        <!-- Rendered dynamically via QaCardComponent -->
      </div>

      <!-- Pagination -->
      <div class="pagination-bar" id="pagination-container">
        <!-- Rendered dynamically via QaCardComponent -->
      </div>

    </section>

    <!-- ====================================================================
         TAB 2: Macro Statistical Analysis (17 Full Visual Charts from Commit 2ba7ad9)
         ==================================================================== -->
    <section id="macro-analytics-view" class="tab-content">
      
      <div class="hero-banner">
        <div class="hero-badge"><i class="fa-solid fa-chart-pie"></i> التقرير الإحصائي الكلي الشامل</div>
        <h2 class="hero-title">الدليل التحليلي الشامل لـ 17 رسماً بيانياً</h2>
        <p class="hero-subtitle">
          تفسير إحصائي وإداري معمق لجميع جوانب أداء منصة Islam.chat عبر <strong>12,448 محادثة</strong> و <strong>80 لغة</strong>، شاملاً التحليل الزمني، معدلات الارتداد، توازن الحوار، اتفاقية مستوى الخدمة (SLA)، وأوقات الذروة العالمية.
        </p>
      </div>

      <!-- 10 Topics & 17 Charts from commit 2ba7ad92c833c33012003ac646be503efb5759c4 -->
""" + macro_html + """
    </section>

    <!-- ====================================================================
         TAB 3: Executive Recommendations & Action Roadmap
         ==================================================================== -->
    <section id="action-plan-view" class="tab-content">
      <div class="hero-banner">
        <div class="hero-badge"><i class="fa-solid fa-flag-checkered"></i> خطة العمل الاستراتيجية</div>
        <h2 class="hero-title">التوصيات التنفيذية وخارطة الطريق لتطوير Islam.chat</h2>
        <p class="hero-subtitle">خلاصة القرارات المستخلصة من تحليل 12,448 محادثة و 11,596 سؤالاً لتحقيق أعلى أثر دعوي وتقني.</p>
      </div>

      <div class="section-container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          
          <div style="background: var(--bg-secondary); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <div style="font-size: 16px; font-weight: 800; color: var(--brand-teal); margin-bottom: 12px;">
              <i class="fa-solid fa-robot"></i> 1. استثمار بنك الأسئلة الفريدة (RAG & Fine-Tuning)
            </div>
            <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.7;">
              استخدام الـ 11,596 سؤالاً وجواباً كقاعدة معرفية ذهبية لبناء نظام استرجاع معرفي مدعم بالذكاء الاصطناعي (RAG)، وتغذية النموذج بأدق الأجوبة المعتمدة في الشبهات ومقارنة الأديان.
            </p>
          </div>

          <div style="background: var(--bg-secondary); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <div style="font-size: 16px; font-weight: 800; color: var(--brand-gold); margin-bottom: 12px;">
              <i class="fa-solid fa-earth-africa"></i> 2. التوسع اللغوي في اللغات الصاعدة
            </div>
            <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.7;">
              أثبتت البيانات وجود طلب هائل في اللغة السواحلية (847 محادثة) واليابانية (386) والفلبينية. يوصى بإعداد محتوى دعوي مخصص لهذه الثقافات وربطهم بدعاة محليين ناطقين بلغاتهم.
            </p>
          </div>

          <div style="background: var(--bg-secondary); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
            <div style="font-size: 16px; font-weight: 800; color: var(--benefit-green); margin-bottom: 12px;">
              <i class="fa-solid fa-hand-holding-heart"></i> 3. مسار خاص برعاية المهتدين الجدد (346 حالة مؤكدة)
            </div>
            <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.7;">
              بناء مسار تفاعلي مخصص (New Muslim Journey) يرشد السائل خطوة بخطوة بعد إبداء الرغبة في اعتناق الإسلام، مع تزويده ببطاقات تعليمية مبسطة للصلاة والطهارة وربطه بمجتمع داعم.
            </p>
          </div>

        </div>
      </div>
    </section>

  </div>

  <!-- Dialogue Context Modal -->
  <div class="modal-overlay" id="dialogue-modal" onclick="closeDialogueModal(event)">
    <div class="modal-container" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 id="modal-title"><i class="fa-solid fa-comments"></i> سياق المحادثة الكاملة (#<span id="modal-chat-id"></span>)</h3>
        <button class="modal-close-btn" onclick="closeDialogueModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body" id="modal-chat-body">
        <!-- Messages rendered dynamically via DialogueModalComponent -->
      </div>
    </div>
  </div>

  <!-- Image Lightbox Modal -->
  <div class="lightbox-modal" id="lightbox-modal" onclick="closeLightbox()">
    <img id="lightbox-img" class="lightbox-content" src="" alt="Zoomed Chart">
  </div>

  <!-- Footer -->
  <footer class="dashboard-footer">
    <p>Islam.chat Intelligence Hub & Analytics Suite • تم تحليل 12,448 محادثة و 11,596 سؤالاً شرعياً موثقاً بالـ LLM</p>
  </footer>

  <!-- Preloaded Data Objects (Guarantees zero CORS issue on file:/// protocol) -->
  <script src="assets/data/enriched_qa_data.js"></script>
  <script src="assets/data/conversations_data.js"></script>

  <!-- Modular Scripts (Microservices Architecture) -->
  <script src="assets/js/services/api.service.js"></script>
  <script src="assets/js/services/filter.service.js"></script>
  <script src="assets/js/services/chart.service.js"></script>
  <script src="assets/js/components/qa-card.component.js"></script>
  <script src="assets/js/components/dialogue-modal.component.js"></script>
  <script src="assets/js/components/lightbox.component.js"></script>
  <script src="assets/js/app.js"></script>
</body>
</html>
"""

with open(INDEX_FILE, "w", encoding="utf-8") as f:
    f.write(index_template)

print(f"Successfully assembled index.html with 100% LLM Ground Truth! Size: {INDEX_FILE.stat().st_size / 1024:.2f} KB")
