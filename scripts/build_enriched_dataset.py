#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script to build the enriched, deduplicated Q&A dataset for the Islam.chat Intelligence Dashboard.
Combines:
- QA_Extraction_task/without duplicate/Islam_chat_questions_extraction_deduped.json
- QA_Extraction_task/without duplicate/Islam_chat_questions_unique.json
- QA_Extraction_task/Islam_chat_questions_extraction.csv (or dataset/organized_conversations_with_language.csv)
"""

import sys
import os
import csv
import json
import re
from collections import Counter
from pathlib import Path

csv.field_size_limit(sys.maxsize)

WORKSPACE = Path(r"d:\Midade.Com\islam_chat_dashboard")
DEDUPED_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_extraction_deduped.json"
UNIQUE_JSON = WORKSPACE / "QA_Extraction_task" / "without duplicate" / "Islam_chat_questions_unique.json"
CSV_FILE = WORKSPACE / "QA_Extraction_task" / "Islam_chat_questions_extraction.csv"
OUTPUT_DIR = WORKSPACE / "assets" / "data"
OUTPUT_JSON = OUTPUT_DIR / "enriched_qa_dataset.json"

# Topic translations and normalizations
TOPIC_MAP_AR = {
    "Aqeedah": "العقيدة وأصول الإيمان",
    "Aqeedah & Beliefs": "العقيدة وأصول الإيمان",
    "Comparative Religion": "مقارنة الأديان وحوار غير المسلمين",
    "Fiqh": "الفقه والعبادات والأحكام",
    "Fiqh & Worship": "الفقه والعبادات والأحكام",
    "Quran & Tafsir": "القرآن الكريم والتفسير",
    "Hadith & Seerah": "الحديث الشريف والسيرة النبوية",
    "Dawah Methodology": "منهجية الدعوة والردود",
    "New Muslim Support": "رعاية وتعليم المسلمين الجدد",
    "Ethics & Morality": "الأخلاق والآداب الإسلامية",
    "Islamic History": "التاريخ والحضارة الإسلامية",
    "Personal Advice": "الاستشارات والتوجيه الشخصي",
    "Other": "مواضيع عامة أخرى"
}

def clean_text(t):
    if not t:
        return ""
    return str(t).strip()

def detect_faith(topic_category, user_messages, question_text):
    """
    Detect user faith/belief based on:
    1. topic_category (Primary signal as per instructions)
    2. Explicit self-disclosure regex in user messages & question text
    """
    combined = (clean_text(user_messages) + " " + clean_text(question_text)).lower()
    
    # 1. Check explicit self-disclosures first
    if re.search(r'\b(christian|catholic|protestant|orthodox|lutheran|evangelical|مسيحي|نصراني|ارثوذكسي|كاثوليكي|بروتستانتي)\b', combined):
        return {
            "faith": "Christian",
            "faith_ar": "مسيحي",
            "faith_type": "Explicit"
        }
    if re.search(r'\b(atheist|agnostic|secularist|ملحد|لاديني|ربوبي|لاأدري)\b', combined):
        return {
            "faith": "Atheist / Agnostic",
            "faith_ar": "ملحد / لاديني",
            "faith_type": "Explicit"
        }
    if re.search(r'\b(jew|jewish|judaism|يهودي|عبري)\b', combined):
        return {
            "faith": "Jewish",
            "faith_ar": "يهودي",
            "faith_type": "Explicit"
        }
    if re.search(r'\b(hindu|hinduism|buddhist|buddhism|sikh|هندوسي|بوذي|سيخي)\b', combined):
        return {
            "faith": "Hindu / Buddhist",
            "faith_ar": "هندوسي / بوذي",
            "faith_type": "Explicit"
        }
    if re.search(r'\b(shia|shi\'a|ismaili|alawite|شيعي|اثنا عشري|إسماعيلي|علوي)\b', combined):
        return {
            "faith": "Shia / Sectarian",
            "faith_ar": "شيعي / فرق",
            "faith_type": "Explicit"
        }
    if re.search(r'\b(new muslim|revert|convert|i converted|i accepted islam|أسلمت حديثا|مسلم جديد|دخلت في الاسلام)\b', combined):
        return {
            "faith": "New Muslim / Revert",
            "faith_ar": "مسلم جديد / مهتدٍ",
            "faith_type": "Explicit"
        }
    if re.search(r'\b(i am muslim|i am a muslim|as a muslim|أنا مسلم|نحن المسلمين|بصفتي مسلم)\b', combined):
        return {
            "faith": "Practicing Muslim",
            "faith_ar": "مسلم ممارس / مستفتي",
            "faith_type": "Explicit"
        }

    # 2. Topic Category-based Inference (Core instruction)
    if topic_category == "Comparative Religion":
        return {
            "faith": "Non-Muslim / Truth Seeker",
            "faith_ar": "غير مسلم / باحث عن الحقيقة",
            "faith_type": "Inferred (Topic: Comparative Religion)"
        }
    elif topic_category == "New Muslim Support":
        return {
            "faith": "New Muslim / Revert",
            "faith_ar": "مسلم جديد / مهتدٍ",
            "faith_type": "Inferred (Topic: New Muslim Support)"
        }
    elif topic_category in ["Fiqh", "Fiqh & Worship", "Quran & Tafsir", "Hadith & Seerah"]:
        return {
            "faith": "Practicing Muslim",
            "faith_ar": "مسلم ممارس / مستفتي",
            "faith_type": "Inferred (Topic: Fiqh & Worship)"
        }
    elif topic_category == "Aqeedah" or topic_category == "Aqeedah & Beliefs":
        # Check if question has doubt/skepticism or affirmation
        if any(w in combined for w in ["does god exist", "prove god", "who created god", "why evil", "هل الله موجود", "من خلق الله", "لماذا الشر"]):
            return {
                "faith": "Atheist / Skeptic",
                "faith_ar": "متشكك / باحث عن أدلة وجودية",
                "faith_type": "Inferred (Topic: Aqeedah Doubts)"
            }
        return {
            "faith": "General Inquirer",
            "faith_ar": "مستفسر عن أصول الإيمان",
            "faith_type": "Inferred (Topic: Aqeedah)"
        }
    elif topic_category == "Dawah Methodology":
        return {
            "faith": "Practicing Muslim / Da'ee",
            "faith_ar": "مسلم / داعية وباحث",
            "faith_type": "Inferred (Topic: Dawah)"
        }
    elif topic_category == "Personal Advice":
        return {
            "faith": "Practicing Muslim",
            "faith_ar": "مسلم / طالب استشارة وتزكية",
            "faith_type": "Inferred (Topic: Personal Advice)"
        }
    else:
        return {
            "faith": "General Inquirer",
            "faith_ar": "مستفسر عام",
            "faith_type": "Inferred (General)"
        }

def detect_intent(topic_category, question_text):
    """
    Detect question intent based on:
    1. topic_category (Primary)
    2. Question content & terms
    """
    q_lower = clean_text(question_text).lower()
    
    # 1. Shahada / Conversion Intent
    if any(w in q_lower for w in ["how to convert", "how to become muslim", "accept islam", "take shahada", "say shahada", "want to be muslim", "اريد ان اسلم", "نطق الشهادة", "كيف ادخل الاسلام", "اعتناق الاسلام"]):
        return {
            "intent": "Desire to Convert / Shahada",
            "intent_ar": "رغبة في اعتناق الإسلام والشهادة",
            "intent_badge": "conversion"
        }
    
    # 2. Seeking Fatwa / Legal Ruling
    if topic_category in ["Fiqh", "Fiqh & Worship"] or any(w in q_lower for w in ["ruling", "permissible", "prohibited", "halal", "haram", "valid", "invalid", "is it allowed", "حكم", "يجوز", "حلال", "حرام", "هل يصح", "كفارة", "واجب", "مبطلات"]):
        return {
            "intent": "Seeking Fatwa & Ruling",
            "intent_ar": "طلب فتوى وحكم فقهي",
            "intent_badge": "fatwa"
        }
    
    # 3. Comparative Religion & Addressing Doubts
    if topic_category in ["Comparative Religion", "Dawah Methodology"] or any(w in q_lower for w in ["trinity", "jesus god", "bible", "crucifixion", "quran contradiction", "shubuhat", "prove that", "التثليث", "صلب المسيح", "تحريف الانجيل", "شبهة", "تناقض", "اثبات"]):
        return {
            "intent": "Comparative Religion & Doubts",
            "intent_ar": "مقارنة أديان ورد شبهات",
            "intent_badge": "comparative"
        }
        
    # 4. New Muslim Learning Basics
    if topic_category == "New Muslim Support" or any(w in q_lower for w in ["how to pray", "steps of wudu", "beginner muslim", "first time", "تعلم الصلاة", "خطوات الوضوء", "مسلم جديد"]):
        return {
            "intent": "New Muslim Learning",
            "intent_ar": "تعلم أساسيات الدين للمسلمين الجدد",
            "intent_badge": "new_muslim"
        }
        
    # 5. Spiritual & Life Guidance
    if topic_category == "Personal Advice" or any(w in q_lower for w in ["advice", "supplication", "dua for", "depression", "guilt", "sin", "repentance", "نصيحة", "دعاء", "توبة", "وسواس", "حزن", "ضيق"]):
        return {
            "intent": "Spiritual & Life Guidance",
            "intent_ar": "توجيه روحي واستشارة شخصية",
            "intent_badge": "guidance"
        }
        
    # 6. General Educational Inquiry
    return {
        "intent": "General Inquiry",
        "intent_ar": "استفسار معرفي وتعليمي عام",
        "intent_badge": "general"
    }

def detect_region(language, start_hour):
    """
    Map language + hour into Geographic Region
    """
    lang = clean_text(language)
    
    if lang in ["Arabic", "Najdi Arabic", "Egyptian Arabic", "Algerian Arabic", "Moroccan Arabic", "Sudanese Arabic", "Levantine Arabic", "Gulf Arabic"]:
        return {
            "region": "Middle East & North Africa (MENA)",
            "region_ar": "الشرق الأوسط وشمال أفريقيا"
        }
    elif lang in ["Swahili", "Hausa", "Somali", "Amharic", "Oromo", "Yoruba"]:
        return {
            "region": "Sub-Saharan Africa",
            "region_ar": "أفريقيا جنوب الصحراء"
        }
    elif lang in ["Filipino", "Tagalog", "Japanese", "Korean", "Indonesian", "Malay", "Chinese", "Vietnamese", "Thai"]:
        return {
            "region": "East & Southeast Asia",
            "region_ar": "شرق وجنوب شرق آسيا"
        }
    elif lang in ["Urdu", "Bengali", "Hindi", "Tamil", "Malayalam", "Telugu", "Punjabi", "Sindhi"]:
        return {
            "region": "South Asia",
            "region_ar": "جنوب آسيا (شبه القارة الهندية)"
        }
    elif lang in ["Russian", "Kurdish", "Central Kurdish", "Turkish", "Kazakh", "Uzbek", "Azerbaijani", "Persian", "Tajik"]:
        return {
            "region": "Central Asia & Eurasia",
            "region_ar": "آسيا الوسطى وأوراسيا"
        }
    elif lang in ["French", "Spanish", "German", "Italian", "Portuguese", "Dutch", "Swedish"]:
        return {
            "region": "Europe & Latin America",
            "region_ar": "أوروبا وأمريكا اللاتينية"
        }
    elif lang == "English":
        return {
            "region": "Global West / Anglophone",
            "region_ar": "العالم الغربي والناطق بالإنجليزية"
        }
    else:
        return {
            "region": "Global / International",
            "region_ar": "دول متفرقة حول العالم"
        }

def main():
    print("=== STARTING ENRICHED DATASET GENERATION ===")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Load Unique cluster sizes & duplicate info lookup
    print(f"Loading unique QA lookup from: {UNIQUE_JSON}")
    unique_cluster_sizes = {}
    with open(UNIQUE_JSON, "r", encoding="utf-8") as f:
        unique_raw = json.load(f)
        for u in unique_raw.get("unique_qa_pairs", []):
            cid = u.get("conversation_id")
            q_num = u.get("question_number")
            key = f"{cid}_{q_num}"
            unique_cluster_sizes[key] = {
                "cluster_size": u.get("cluster_size", 1),
                "duplicate_count": u.get("duplicate_count", 0),
                "answer_richness": u.get("answer_richness", len(u.get("answer", "")))
            }
    print(f"Loaded cluster info for {len(unique_cluster_sizes)} unique questions.")

    # 2. Load Conversation Metadata from CSV
    print(f"Loading conversation metadata from: {CSV_FILE}")
    conv_lookup = {}
    with open(CSV_FILE, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cid_str = row.get("general_chat_id") or row.get("\ufeffgeneral_chat_id")
            if not cid_str:
                continue
            try:
                cid = int(cid_str)
                conv_lookup[cid] = {
                    "start_time": row.get("start_time", ""),
                    "start_hour": int(row.get("start_hour", 0) or 0),
                    "day_of_week": row.get("day_of_week", ""),
                    "language": row.get("conversation_language", "Unknown"),
                    "confidence": float(row.get("language_confidence_score", 0) or 0),
                    "user_messages": row.get("all_user_messages", ""),
                    "full_conversation": row.get("full_conversation", ""),
                    "total_messages": int(row.get("total_messages", 0) or 0),
                    "duration": row.get("conversation_duration", "")
                }
            except (ValueError, TypeError):
                continue
    print(f"Loaded metadata for {len(conv_lookup)} conversations.")

    # 3. Read Deduplicated JSON
    print(f"Loading deduped JSON from: {DEDUPED_JSON}")
    with open(DEDUPED_JSON, "r", encoding="utf-8") as f:
        deduped_raw = json.load(f)
    
    conversations = deduped_raw.get("results", [])
    print(f"Found {len(conversations)} conversations in deduped JSON.")

    # 4. Enrich and structure all QA items
    enriched_qa_list = []
    qa_id_counter = 1

    faith_counter = Counter()
    intent_counter = Counter()
    topic_counter = Counter()
    region_counter = Counter()
    year_counter = Counter()

    for conv in conversations:
        cid = conv.get("conversation_id")
        qa_pairs = conv.get("qa_pairs", [])
        if not qa_pairs:
            continue
        
        c_meta = conv_lookup.get(cid, {})
        start_time_str = c_meta.get("start_time", "")
        start_hour = c_meta.get("start_hour", 12)
        day_of_week = c_meta.get("day_of_week", "Unknown")
        language = c_meta.get("language", "Unknown")
        user_msgs = c_meta.get("user_messages", "")
        full_conv_snippet = c_meta.get("full_conversation", "")[:1000]

        # Extract date parts
        date_str = ""
        year_str = ""
        month_str = ""
        if start_time_str and len(start_time_str) >= 10:
            date_str = start_time_str[:10]
            year_str = start_time_str[:4]
            month_str = start_time_str[5:7]
        
        region_info = detect_region(language, start_hour)

        for qa in qa_pairs:
            q_num = qa.get("question_number", 1)
            q_text = clean_text(qa.get("question", ""))
            a_text = clean_text(qa.get("answer", ""))
            topic = clean_text(qa.get("topic_category", "Other"))
            is_follow_up = bool(qa.get("is_follow_up", False))

            if not q_text:
                continue

            # Detect Faith (using topic_category + user messages)
            faith_info = detect_faith(topic, user_msgs, q_text)
            
            # Detect Intent (using topic_category + question text)
            intent_info = detect_intent(topic, q_text)

            # Get Cluster Size
            key = f"{cid}_{q_num}"
            c_info = unique_cluster_sizes.get(key, {"cluster_size": 1, "duplicate_count": 0, "answer_richness": len(a_text)})

            record = {
                "id": qa_id_counter,
                "conversation_id": cid,
                "question_number": q_num,
                "question": q_text,
                "answer": a_text,
                "topic": topic,
                "topic_ar": TOPIC_MAP_AR.get(topic, topic),
                "is_follow_up": is_follow_up,
                "faith": faith_info["faith"],
                "faith_ar": faith_info["faith_ar"],
                "faith_type": faith_info["faith_type"],
                "intent": intent_info["intent"],
                "intent_ar": intent_info["intent_ar"],
                "intent_badge": intent_info["intent_badge"],
                "region": region_info["region"],
                "region_ar": region_info["region_ar"],
                "language": language,
                "date": date_str,
                "year": year_str,
                "month": month_str,
                "start_time": start_time_str,
                "start_hour": start_hour,
                "day_of_week": day_of_week,
                "cluster_size": c_info["cluster_size"],
                "is_trending": c_info["cluster_size"] > 1,
                "answer_richness": c_info["answer_richness"]
            }

            enriched_qa_list.append(record)
            qa_id_counter += 1

            # Stats tracking
            faith_counter[record["faith_ar"]] += 1
            intent_counter[record["intent_ar"]] += 1
            topic_counter[record["topic_ar"]] += 1
            region_counter[record["region_ar"]] += 1
            if year_str:
                year_counter[year_str] += 1

    print(f"\nSuccessfully enriched {len(enriched_qa_list)} Q&A pairs.")

    # 5. Build summary metrics
    summary_metadata = {
        "total_questions": len(enriched_qa_list),
        "total_conversations_with_qa": len(set(q["conversation_id"] for q in enriched_qa_list)),
        "total_languages": len(set(q["language"] for q in enriched_qa_list)),
        "trending_questions_count": sum(1 for q in enriched_qa_list if q["is_trending"]),
        "year_stats": dict(year_counter),
        "faith_stats": dict(faith_counter),
        "intent_stats": dict(intent_counter),
        "topic_stats": dict(topic_counter),
        "region_stats": dict(region_counter),
        "generated_at": "2026-08-26"
    }

    # 6. Save JSON
    final_payload = {
        "metadata": summary_metadata,
        "questions": enriched_qa_list
    }

    print(f"Writing enriched output to: {OUTPUT_JSON}")
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(final_payload, f, ensure_ascii=False, indent=2)
    
    file_size_mb = os.path.getsize(OUTPUT_JSON) / (1024 * 1024)
    print(f"Done! File size: {file_size_mb:.2f} MB")

    # Print summary breakdown
    print("\n--- FAITH BREAKDOWN ---")
    for k, v in faith_counter.most_common():
        print(f"  {k}: {v} ({v/len(enriched_qa_list)*100:.1f}%)")

    print("\n--- INTENT BREAKDOWN ---")
    for k, v in intent_counter.most_common():
        print(f"  {k}: {v} ({v/len(enriched_qa_list)*100:.1f}%)")

    print("\n--- TOPICS BREAKDOWN ---")
    for k, v in topic_counter.most_common():
        print(f"  {k}: {v} ({v/len(enriched_qa_list)*100:.1f}%)")

    print("\n--- REGION BREAKDOWN ---")
    for k, v in region_counter.most_common():
        print(f"  {k}: {v} ({v/len(enriched_qa_list)*100:.1f}%)")


if __name__ == "__main__":
    main()
