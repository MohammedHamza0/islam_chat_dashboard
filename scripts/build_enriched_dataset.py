import json
import csv
import sys
from pathlib import Path
from collections import Counter

csv.field_size_limit(sys.maxsize)

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
POINTS_JSON = WORKSPACE / "LLM point extraction and analysis" / "full_conversation_points_extraction.json"
DEDUPED_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_extraction_deduped.json"
CSV_CONV = WORKSPACE / "dataset" / "organized_conversations_with_language.csv"
OUTPUT_JSON = WORKSPACE / "assets" / "data" / "enriched_qa_dataset.json"

print("1. Loading LLM Point Extraction data (Ground Truth)...")
with open(POINTS_JSON, "r", encoding="utf-8") as f:
    points_raw = json.load(f)
points_lookup = {r["conversation_id"]: r for r in points_raw.get("results", [])}

print("2. Loading CSV metadata (Time, Duration, Real Language)...")
csv_metadata = {}
with open(CSV_CONV, "r", encoding="utf-8-sig", errors="ignore") as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            cid = int(row["general_chat_id"])
            csv_metadata[cid] = row
        except Exception:
            continue

print("3. Loading deduplicated Q&A pairs (11,596)...")
with open(DEDUPED_JSON, "r", encoding="utf-8") as f:
    deduped_raw = json.load(f)

# Complete Arabic Mappings
RELIGION_AR_MAP = {
    "Islam": "الإسلام (مسلم)",
    "Christianity": "المسيحية",
    "Atheism": "الإلحاد (ملحد)",
    "Hinduism": "الهندوسية",
    "Agnosticism": "اللاأدرية (Agnostic)",
    "Irreligion": "لاديني عام",
    "Buddhism": "البوذية",
    "Judaism": "اليهودية",
    "Sikhism": "السيخية",
    "Other": "أديان ومعتقدات أخرى",
    "Unknown": "غير محدد / غير معلن"
}

INTENT_AR_MAP = {
    "Muslim Learner": "مسلم يتعلم أحكام دينه",
    "Genuine Seeker": "باحث صادق عن الحقيقة",
    "Challenger": "مناظر ومشكك يتحدى البوت",
    "Conversion Interest": "مهتم باعتناق الإسلام",
    "Dawah Training": "تدريب على أساليب الدعوة",
    "Passive Listener": "مستمع سلبي / متابع",
    "Greeting Only": "تحية وسلام فقط",
    "Off-Topic User": "استفسار خارج الموضوع",
    "Troll/Spam": "عبث أو سبام",
    "Content Assistance": "طلب مساعدة في محتوى",
    "Minimal/No Engagement": "تفاعل ضعيف / خاطف"
}

FUNNEL_AR_MAP = {
    "Converted": "اعتنق الإسلام بالفعل (Converted)",
    "Bottom": "المرحلة الختامية (على مشارف الإسلام)",
    "Middle": "المرحلة المتوسطة (اهتمام ومناقشة)",
    "Top": "المرحلة التمهيدية (استكشاف أولي)",
    "Dropped": "انسحب أثناء الحوار",
    "N/A": "غير منطبق (مسلم أو عام)"
}

BLOCKER_AR_MAP = {
    "Logical Skepticism": "الشك العقلي والمنطقي",
    "Lack of Interest": "ضعف الاهتمام والجدية",
    "Trinity": "عقيدة التثليث (لدى النصارى)",
    "Moral Objection": "اعتراضات أخلاقية واجتماعية",
    "Atheism": "إنكار وجود الخالق (مادي)",
    "Cultural Identity": "التمسك بالهوية الثقافية",
    "Negative Media Perception": "الصورة المشوهة في الإعلام",
    "Sectarian Confusion": "الحيرة بين الفرق والمذاهب",
    "Family Pressure": "الخوف من ضغط الأهل والمجتمع",
    "Distrust of Religion": "انعدام الثقة في المؤسسات الدينية",
    "Distrust of religion": "انعدام الثقة في المؤسسات الدينية",
    "Personal spiritual experience": "تجارب روحية شخصية سابقة",
    "Perceived severity of Sharia": "الانطباع عن صرامة الشريعة",
    "Political/Geopolitical concerns": "مخاوف سياسية وجيوسياسية",
    "Religious Pluralism": "الاعتقاد بتعدد الطرق للخلاص",
    "Lack of physical community/witnesses": "عدم وجود مجتمع مسلم محلي",
    "Individualistic Spirituality": "الروحانية الفردية دون دين",
    "Negative perception of Prophet Muhammad": "شبهات حول النبي ﷺ",
    "Syncretism": "خلط التقاليد الدينية",
    "Personal suffering": "شبهة الألم والمعاناة الشخصية",
    "Lack of capacity to fulfill obligations": "الخوف من عدم القدرة على الالتزام",
    "Lack of social support": "غياب الدعم الاجتماعي",
    "N/A": "لا يوجد عائق محدد",
    "None": "لا يوجد عائق محدد"
}

CONV_TYPE_AR_MAP = {
    "Dawah": "دعوة غير المسلمين",
    "Islamic Guidance": "إرشاد وتوجيه إسلامي",
    "Theological Debate": "مناظرة عقدية ولاهوتية",
    "Dawah Training": "تدريب وتأهيل دعوي",
    "Off-Topic": "خارج سياق المنصة",
    "Minimal/No Engagement": "محادثة مقتضبة جداً",
    "Content Assistance": "مساعدة في نصوص أو ترجمة",
    "Emotional Support": "دعم نفسي واستشارة روحية",
    "Muslim Learner": "تعليم المسلمين الجدد"
}

TOPIC_AR_MAP = {
    "Aqeedah": "العقيدة وأصول الإيمان",
    "Comparative Religion": "مقارنة الأديان وحوار غير المسلمين",
    "Fiqh": "الفقه والعبادات والأحكام",
    "Quran": "القرآن الكريم والتفسير",
    "Quran & Tafsir": "القرآن الكريم والتفسير",
    "Dawah Methodology": "منهجية الدعوة والردود",
    "Hadith": "الحديث الشريف والسيرة النبوية",
    "Hadith & Seerah": "الحديث الشريف والسيرة النبوية",
    "New Muslims": "رعاية وتعليم المسلمين الجدد",
    "New Muslim Support": "رعاية وتعليم المسلمين الجدد",
    "Ethics": "الأخلاق والآداب الإسلامية",
    "Ethics & Morality": "الأخلاق والآداب الإسلامية",
    "History": "التاريخ والحضارة الإسلامية",
    "Islamic History": "التاريخ والحضارة الإسلامية",
    "General Counseling": "الاستشارات والتوجيه الشخصي",
    "Personal Advice": "الاستشارات والتوجيه الشخصي",
    "Other": "أبواب ومواضيع أخرى"
}

REGION_MAP = {
    "Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Najdi Arabic": "الشرق الأوسط وشمال أفريقيا",
    "North Levantine Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Egyptian Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Mesopotamian Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Moroccan Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Sudanese Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Yemeni Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Tunisian Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Algerian Arabic": "الشرق الأوسط وشمال أفريقيا",
    "Hijazi Arabic": "الشرق الأوسط وشمال أفريقيا",
    "English": "العالم الغربي والناطق بالإنجليزية",
    "French": "أوروبا وأمريكا اللاتينية",
    "German": "أوروبا وأمريكا اللاتينية",
    "Spanish": "أوروبا وأمريكا اللاتينية",
    "Italian": "أوروبا وأمريكا اللاتينية",
    "Portuguese": "أوروبا وأمريكا اللاتينية",
    "Russian": "آسيا الوسطى وأوراسيا",
    "Swahili": "أفريقيا جنوب الصحراء",
    "Hausa": "أفريقيا جنوب الصحراء",
    "Yoruba": "أفريقيا جنوب الصحراء",
    "Amharic": "أفريقيا جنوب الصحراء",
    "Somali": "أفريقيا جنوب الصحراء",
    "Japanese": "شرق وجنوب شرق آسيا",
    "Korean": "شرق وجنوب شرق آسيا",
    "Filipino": "شرق وجنوب شرق آسيا",
    "Tagalog": "شرق وجنوب شرق آسيا",
    "Indonesian": "شرق وجنوب شرق آسيا",
    "Chinese": "شرق وجنوب شرق آسيا",
    "Urdu": "جنوب آسيا (شبه القارة الهندية)",
    "Hindi": "جنوب آسيا (شبه القارة الهندية)",
    "Bengali": "جنوب آسيا (شبه القارة الهندية)",
    "Central Kurdish": "الشرق الأوسط وشمال أفريقيا",
    "Persian": "الشرق الأوسط وشمال أفريقيا",
    "Turkish": "الشرق الأوسط وشمال أفريقيا"
}

enriched_questions = []
q_counter = 0

for conv in deduped_raw.get("results", []):
    cid = conv.get("conversation_id")
    qa_list = conv.get("qa_pairs", [])
    
    pt = points_lookup.get(cid, {})
    csv_row = csv_metadata.get(cid, {})
    
    # Accurate conversation language from CSV
    conv_lang = csv_row.get("conversation_language") or conv.get("conversation_language") or "English"
    
    # Extract Ground Truth attributes
    user_demo = pt.get("user_demographics", {})
    suspected_rel = user_demo.get("suspected_religion", "Unknown")
    is_existing_muslim = user_demo.get("is_existing_muslim")
    
    intent_funnel = pt.get("intent_and_funnel", {})
    user_intent = intent_funnel.get("user_intent", "Genuine Seeker")
    funnel_stage = intent_funnel.get("conversion_funnel", "N/A")
    
    theo = pt.get("theological_profile", {})
    key_blocker = theo.get("key_blocker") or "N/A"
    if key_blocker in ["None", "null", ""]:
        key_blocker = "N/A"
    
    conv_type = pt.get("conversation_type", "Dawah")
    
    # Arabic labels
    religion_ar = RELIGION_AR_MAP.get(suspected_rel, suspected_rel)
    intent_ar = INTENT_AR_MAP.get(user_intent, user_intent)
    funnel_ar = FUNNEL_AR_MAP.get(funnel_stage, funnel_stage)
    blocker_ar = BLOCKER_AR_MAP.get(key_blocker, key_blocker)
    conv_type_ar = CONV_TYPE_AR_MAP.get(conv_type, conv_type)
    
    # Metadata
    start_time_str = csv_row.get("start_time", "")
    date_str = start_time_str[:10] if start_time_str else ""
    year_str = start_time_str[:4] if len(start_time_str) >= 4 else "2025"
    month_str = start_time_str[5:7] if len(start_time_str) >= 7 else ""
    start_hour = int(csv_row.get("start_hour", 0)) if csv_row.get("start_hour") else 0
    day_of_week = csv_row.get("day_of_week", "")
    region_ar = REGION_MAP.get(conv_lang, "مناطق عالمية أخرى")
    
    for qa in qa_list:
        q_counter += 1
        topic_raw = qa.get("topic_category", "Aqeedah")
        topic_ar = TOPIC_AR_MAP.get(topic_raw, topic_raw)
        
        cluster_size = qa.get("cluster_size", 1)
        is_trending = cluster_size > 1
        
        q_obj = {
            "id": q_counter,
            "conversation_id": cid,
            "question": qa.get("question", "").strip(),
            "answer": qa.get("answer", "").strip(),
            "topic": topic_raw,
            "topic_ar": topic_ar,
            "faith": suspected_rel,
            "faith_ar": religion_ar,
            "is_existing_muslim": is_existing_muslim,
            "intent": user_intent,
            "intent_ar": intent_ar,
            "funnel_stage": funnel_stage,
            "funnel_stage_ar": funnel_ar,
            "key_blocker": key_blocker,
            "key_blocker_ar": blocker_ar,
            "conversation_type": conv_type,
            "conversation_type_ar": conv_type_ar,
            "language": conv_lang,
            "region_ar": region_ar,
            "date": date_str,
            "year": year_str,
            "month": month_str,
            "start_hour": start_hour,
            "day_of_week": day_of_week,
            "is_follow_up": qa.get("is_follow_up", False),
            "cluster_size": cluster_size,
            "is_trending": is_trending,
            "answer_richness": len(qa.get("answer", ""))
        }
        enriched_questions.append(q_obj)

print(f"Processed {len(enriched_questions)} total enriched questions.")

metadata = {
    "total_questions": len(enriched_questions),
    "total_conversations": len(deduped_raw.get("results", [])),
    "ground_truth_source": "LLM Gemini 3.1 Flash Lite Conversation Point Extraction",
    "generated_at": "2026-08-26",
    "religions_breakdown": dict(Counter(q["faith_ar"] for q in enriched_questions)),
    "intents_breakdown": dict(Counter(q["intent_ar"] for q in enriched_questions)),
    "funnel_breakdown": dict(Counter(q["funnel_stage_ar"] for q in enriched_questions)),
    "blockers_breakdown": dict(Counter(q["key_blocker_ar"] for q in enriched_questions if q["key_blocker"] != "N/A")),
    "conversation_types_breakdown": dict(Counter(q["conversation_type_ar"] for q in enriched_questions)),
    "languages_count": len(set(q["language"] for q in enriched_questions))
}

OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump({"metadata": metadata, "questions": enriched_questions}, f, ensure_ascii=False, indent=2)

print(f"Saved full enriched dataset to {OUTPUT_JSON} ({OUTPUT_JSON.stat().st_size / (1024*1024):.2f} MB)")
