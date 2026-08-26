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
        <span>منظومة استكشاف الأسئلة والتحليل السلوكي الذكي</span>
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
          <span>منظومة استكشاف 11,596 سؤالاً وجواباً شرعياً موثقاً عبر 80 لغة</span>
        </div>
        <h2 class="hero-title">لوحة استكشاف وتصفية الأسئلة الشرعية والدعوية المتعددة الأبعاد</h2>
        <p class="hero-subtitle">
          تتيح هذه المنصة التفاعلية فلترة وفحص الأسئلة الموثقة بدقة فائقة بحسب <strong>معتقد السائل</strong>، <strong>نية السؤال</strong>، <strong>الباب الشرعي</strong>، <strong>المنطقة الجغرافية</strong>، <strong>اللغة</strong>، و<strong>النطاق الزمني والتوقيت</strong>، مع تحديث فوري للرسوم البيانية والـ Insights اللحظية.
        </p>

        <!-- KPI Metrics -->
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
              <span class="kpi-title">اللغات الممثلة</span>
              <div class="kpi-icon" style="background: var(--data-blue-soft); color: var(--data-blue);"><i class="fa-solid fa-language"></i></div>
            </div>
            <div class="kpi-val" id="kpi-languages-count">80</div>
            <div class="kpi-sub">تغطية عالمية شاملة</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">مقارنة الأديان والشبهات</span>
              <div class="kpi-icon" style="background: var(--insight-purple-soft); color: var(--insight-purple);"><i class="fa-solid fa-scale-balanced"></i></div>
            </div>
            <div class="kpi-val" id="kpi-comparative-count">3,160</div>
            <div class="kpi-sub" id="kpi-comparative-pct">27.3% من النتائج</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">الأسئلة الأكثر تكراراً (Trending)</span>
              <div class="kpi-icon" style="background: var(--warning-amber-soft); color: var(--warning-amber);"><i class="fa-solid fa-fire"></i></div>
            </div>
            <div class="kpi-val" id="kpi-trending-count">2,143</div>
            <div class="kpi-sub">عناقيد شائعة متعددة</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">رغبة في الإسلام / نطق الشهادة</span>
              <div class="kpi-icon" style="background: var(--benefit-green-soft); color: var(--benefit-green);"><i class="fa-solid fa-heart"></i></div>
            </div>
            <div class="kpi-val" id="kpi-conversion-count">20</div>
            <div class="kpi-sub">طلبات هداية مباشرة</div>
          </div>
        </div>
      </div>

      <!-- Multi-Faceted Filter Matrix -->
      <div class="filter-panel">
        <div class="filter-panel-header">
          <div class="filter-panel-title">
            <i class="fa-solid fa-sliders"></i> شريط الفلاتر الذكي متعدد الأبعاد (Smart Multi-Filter Matrix)
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

          <!-- Filter 2: Faith & User Belief -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-user-tag"></i> ديانة / معتقد السائل</label>
            <select id="filter-faith" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع المعتقدات والديانات</option>
              <option value="مسلم ممارس / مستفتي">مسلم ممارس / مستفتي (3,224)</option>
              <option value="مسيحي">مسيحي (2,272)</option>
              <option value="مستفسر عن أصول الإيمان">مستفسر عن أصول الإيمان (1,634)</option>
              <option value="غير مسلم / باحث عن الحقيقة">غير مسلم / باحث عن الحقيقة (1,073)</option>
              <option value="هندوسي / بوذي">هندوسي / بوذي (608)</option>
              <option value="ملحد / لاديني">ملحد / لاديني (488)</option>
              <option value="مسلم جديد / مهتدٍ">مسلم جديد / مهتدٍ (394)</option>
              <option value="شيعي / فرق">شيعي / فرق (203)</option>
              <option value="يهودي">يهودي (166)</option>
            </select>
          </div>

          <!-- Filter 3: Intent Classification -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-bullseye"></i> نية وطبيعة السؤال</label>
            <select id="filter-intent" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع النوايا والأنماط</option>
              <option value="استفسار معرفي وتعليمي عام">استفسار معرفي وتعليمي عام (5,131)</option>
              <option value="مقارنة أديان ورد شبهات">مقارنة أديان ورد شبهات (3,160)</option>
              <option value="طلب فتوى وحكم فقهي">طلب فتوى وحكم فقهي (2,136)</option>
              <option value="تعلم أساسيات الدين للمسلمين الجدد">تعلم أساسيات الدين للمسلمين الجدد (586)</option>
              <option value="توجيه روحي واستشارة شخصية">توجيه روحي واستشارة شخصية (563)</option>
              <option value="رغبة في اعتناق الإسلام والشهادة">رغبة في اعتناق الإسلام والشهادة (20)</option>
            </select>
          </div>

          <!-- Filter 4: Topic Category -->
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

          <!-- Filter 5: Language -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-globe"></i> لغة المحادثة (80 لغة)</label>
            <select id="filter-language" class="filter-select" onchange="applyFilters()">
              <option value="all">جميع اللغات (80 لغة)</option>
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

          <!-- Filter 6: Geographic Region -->
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

          <!-- Filter 7: Trending / Cluster Size -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-fire-flame-curved"></i> تكرار وشهرة السؤال</label>
            <select id="filter-trending" class="filter-select" onchange="applyFilters()">
              <option value="all">الكل (الأسئلة الفردية والشائعة)</option>
              <option value="trending_only">الأسئلة الأكثر تكراراً فقط (Trending > 1)</option>
              <option value="unique_only">الأسئلة الفردية فقط</option>
            </select>
          </div>

          <!-- Filter 8: Question Nature (Main vs Follow-up) -->
          <div class="filter-group">
            <label class="filter-label"><i class="fa-solid fa-sitemap"></i> نوع وسياق السؤال</label>
            <select id="filter-followup" class="filter-select" onchange="applyFilters()">
              <option value="all">الكل (رئيسي ومتابعة)</option>
              <option value="main_only">سؤال افتتاحي رئيسي فقط</option>
              <option value="followup_only">استفسار متابعة وتكميل فقط</option>
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
            <span class="chart-card-title"><i class="fa-solid fa-chart-pie"></i> توزيع معتقدات وسلوك السائلين للنتائج الحالية</span>
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
            <input type="text" id="live-search-input" class="filter-input" placeholder="ابحث في نص السؤال، الإجابة، أو الموضوع..." onkeyup="onSearchInput()">
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
              <i class="fa-solid fa-hand-holding-heart"></i> 3. مسار خاص برعاية المهتدين الجدد
            </div>
            <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.7;">
              بناء مسار تفاعلي مخصص (New Muslim Journey) يرشد السائل خطوة بخطوة بعد إبداء الرغبة في اعتناق الإسلام، مع تزويده ببطاقات تعليمية مبسطة للصلاة والطهارة.
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
    <p>Islam.chat Intelligence Hub & Analytics Suite • تم تحليل 12,448 محادثة و 11,596 سؤالاً شرعياً موثقاً</p>
  </footer>

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

print(f"Successfully assembled index.html! Size: {INDEX_FILE.stat().st_size / 1024:.2f} KB, Lines: {len(index_template.splitlines())}")
