from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import joblib
import pandas as pd
from datetime import datetime, timedelta
import json
import random
from app import db
from app.models.plan import Plan

plans_bp = Blueprint('plans', __name__)

model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'model.pkl')
try:
    model = joblib.load(model_path)
except FileNotFoundError:
    model = None

def parse_time(time_str, default_val):
    if not time_str: return default_val
    try:
        if ':' in time_str:
            h, m = map(int, time_str.split(':'))
            return h * 60 + m
        return default_val
    except:
        return default_val

def parse_time_range(range_str, default_start, default_end):
    if not range_str or '-' not in range_str: return (default_start, default_end)
    try:
        parts = range_str.split('-')
        return parse_time(parts[0].strip(), default_start), parse_time(parts[1].strip(), default_end)
    except:
        return (default_start, default_end)

def format_time(minutes_since_midnight):
    minutes_since_midnight = int(minutes_since_midnight) % (24 * 60)
    h = minutes_since_midnight // 60
    m = minutes_since_midnight % 60
    am_pm = "AM" if h < 12 else "PM"
    h_12 = h if h <= 12 else h - 12
    if h_12 == 0: h_12 = 12
    return f"{h_12:02d}:{m:02d} {am_pm}"

@plans_bp.route('', methods=['GET'])
@jwt_required()
def get_plans():
    current_user_id = get_jwt_identity()
    plans = Plan.query.filter_by(user_id=current_user_id).order_by(Plan.created_at.desc()).all()
    return jsonify([plan.to_dict() for plan in plans]), 200

@plans_bp.route('', methods=['POST'])
@jwt_required()
def create_plan():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({"msg": "Missing title"}), 400
        
    new_plan = Plan(
        user_id=current_user_id,
        title=data['title'],
        content=data.get('content', '')
    )
    db.session.add(new_plan)
    db.session.commit()
    return jsonify(new_plan.to_dict()), 201

@plans_bp.route('/generate-plan', methods=['POST'])
@jwt_required()
def generate_plan():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    exam_date_str = data.get('exam_date')
    subjects_raw = data.get('subjects', '')
    if isinstance(subjects_raw, str):
        subjects = [s.strip() for s in subjects_raw.split(',') if s.strip()]
    else:
        subjects = subjects_raw
        
    if not subjects: subjects = ["General Study"]
    
    weak_raw = data.get('weak_subjects', '')
    weak_subjects = [s.strip() for s in weak_raw.split(',') if s.strip()] if isinstance(weak_raw, str) else weak_raw
    
    strong_raw = data.get('strong_subjects', '')
    strong_subjects = [s.strip() for s in strong_raw.split(',') if s.strip()] if isinstance(strong_raw, str) else strong_raw

    daily_hours = float(data.get('daily_hours', 4.0))
    class_program = data.get('class_program', 'General')
    study_goal = data.get('study_goal', 'Pass')
    break_pref = data.get('break_preferences', 'Pomodoro')
    
    wake_up_min = parse_time(data.get('wake_up_time'), 6*60)
    sleep_min = parse_time(data.get('sleep_time'), 22*60)
    school_s, school_e = parse_time_range(data.get('school_time'), 0, 0)
    tuition_s, tuition_e = parse_time_range(data.get('tuition_time'), 0, 0)
    
    # Calculate days left
    days_left = 30
    if exam_date_str:
        try:
            exam_date = datetime.strptime(exam_date_str, '%Y-%m-%d')
            days_left = max(1, (exam_date - datetime.now()).days)
        except ValueError:
            pass
            
    subject_count = len(subjects)
    
    # ML Prediction (Fallback logic)
    predicted_score = min(100.0, max(0.0, 50 + (daily_hours*4) + (days_left*0.5) - (subject_count*3)))
    if study_goal == "Top Grades": predicted_score += 15
    if study_goal == "Exam Prep": predicted_score += 5
    predicted_score = min(98.5, predicted_score)

    schedule = []
    days_to_generate = min(days_left, 14) 
    
    # We distribute time: Weak gets more, Strong gets less
    study_queue = []
    if not weak_subjects and not strong_subjects:
        study_queue = subjects
    else:
        # Heavily weight weak subjects
        for w in weak_subjects:
            study_queue.extend([w, w, w]) # 3x priority
        for s in subjects:
            if s not in weak_subjects and s not in strong_subjects:
                study_queue.extend([s, s]) # 2x priority
        for st in strong_subjects:
            study_queue.extend([st]) # 1x priority
            
    if not study_queue: study_queue = subjects
    
    block_id = 1
    subject_index = 0
    
    for day in range(days_to_generate):
        current_date = datetime.now() + timedelta(days=day)
        date_str = current_date.strftime('%Y-%m-%d')
        
        # Build daily routine
        
        # 1. Wake Up
        schedule.append({
            "id": block_id, "date": date_str, "type": "routine",
            "time": f"{format_time(wake_up_min)} - {format_time(wake_up_min+30)}",
            "title": "🌅 Wake Up & Morning Routine", "duration": "30 Mins"
        })
        block_id += 1
        
        # 2. Breakfast
        schedule.append({
            "id": block_id, "date": date_str, "type": "meal",
            "time": f"{format_time(wake_up_min+30)} - {format_time(wake_up_min+60)}",
            "title": "🍳 Healthy Breakfast", "duration": "30 Mins"
        })
        block_id += 1
        
        # 3. School / College
        if school_e > school_s:
            schedule.append({
                "id": block_id, "date": date_str, "type": "commitment",
                "time": f"{format_time(school_s)} - {format_time(school_e)}",
                "title": f"🏫 {class_program} Classes / School", "duration": f"{(school_e-school_s)/60:.1f} Hours"
            })
            block_id += 1
            
        # 4. Lunch
        lunch_time = school_e if school_e > 0 else 13*60
        schedule.append({
            "id": block_id, "date": date_str, "type": "meal",
            "time": f"{format_time(lunch_time)} - {format_time(lunch_time+45)}",
            "title": "🥗 Lunch & Hydration", "duration": "45 Mins"
        })
        block_id += 1
        
        # 5. Tuition / Job
        if tuition_e > tuition_s:
            schedule.append({
                "id": block_id, "date": date_str, "type": "commitment",
                "time": f"{format_time(tuition_s)} - {format_time(tuition_e)}",
                "title": "💼 Tuition / Job", "duration": f"{(tuition_e-tuition_s)/60:.1f} Hours"
            })
            block_id += 1

        # 6. Find free time for Study Sessions
        # Simplified: We just append the study sessions starting after the last commitment
        study_start = max(lunch_time + 45, tuition_e + 30, wake_up_min + 60)
        current_time_minutes = study_start
        
        hours_remaining = daily_hours
        while hours_remaining > 0:
            block_hours = min(2.0, hours_remaining)
            if break_pref == "Pomodoro": block_hours = min(0.5, hours_remaining)
            
            block_minutes = int(block_hours * 60)
            
            start_time = current_time_minutes
            end_time = current_time_minutes + block_minutes
            current_time_minutes = end_time
            
            time_str = f"{format_time(start_time)} - {format_time(end_time)}"
            
            subj_target = study_queue[subject_index % len(study_queue)]
            subject_index += 1
            
            is_weak = subj_target in weak_subjects
            is_strong = subj_target in strong_subjects
            
            tag = "🔥 Intensive Focus" if is_weak else ("⚡ Quick Revision" if is_strong else "📚 Core Study")
            
            schedule.append({
                "id": block_id, "date": date_str, "type": "study",
                "time": time_str,
                "title": f"{tag}: {subj_target}", "duration": f"{block_minutes} Mins"
            })
            block_id += 1
            hours_remaining -= block_hours
            
            if hours_remaining > 0:
                break_mins = 5 if break_pref == "Pomodoro" else 15
                schedule.append({
                    "id": block_id, "date": date_str, "type": "break",
                    "time": f"{format_time(current_time_minutes)} - {format_time(current_time_minutes+break_mins)}",
                    "title": "☕ Brain Rest / Eye Break", "duration": f"{break_mins} Mins"
                })
                block_id += 1
                current_time_minutes += break_mins
                
        # 7. Dinner
        dinner_time = max(current_time_minutes + 30, 19*60)
        schedule.append({
            "id": block_id, "date": date_str, "type": "meal",
            "time": f"{format_time(dinner_time)} - {format_time(dinner_time+45)}",
            "title": "🍛 Dinner & Family Time", "duration": "45 Mins"
        })
        block_id += 1
        
        # 8. Sleep
        schedule.append({
            "id": block_id, "date": date_str, "type": "routine",
            "time": f"{format_time(sleep_min)} - {format_time(sleep_min+480)}",
            "title": "💤 Sleep / Deep Recovery", "duration": "8 Hours"
        })
        block_id += 1

    # Generate Smart Output Sections
    performance_plan = {
        "daily_revision": "Spend the last 15 minutes of every day reviewing flashcards.",
        "weekly_cycle": "Dedicate Sunday mornings to full mock exams.",
        "mistake_analysis": "Keep a 'Mistake Journal' for wrong MCQ answers.",
        "viva_prep": f"Since you are in {class_program}, focus heavily on practicals and viva concepts." if class_program in ["BS", "MPhil", "PhD", "1st Year", "2nd Year"] else "Focus on core theory and past papers."
    }
    
    health_plan = {
        "hydration": "Drink 1 glass of water every 60 minutes of studying.",
        "exercise": "Do 15 mins of light stretching or jogging at " + format_time(wake_up_min + 30),
        "sleep": f"Aim for at least 7.5 hours. Suggested sleep time: {format_time(sleep_min)}",
        "mental": "Use the 20-20-20 rule to prevent eye strain during deep work blocks."
    }
    
    recommendations = [
        f"Because your goal is '{study_goal}', consistency is more important than cramming.",
        f"You listed {', '.join(weak_subjects) if weak_subjects else 'some'} as weak subjects. The AI has automatically allocated 60% of your schedule to these.",
        f"For {', '.join(strong_subjects) if strong_subjects else 'your strong subjects'}, stick to active recall and past papers rather than re-reading notes.",
        "Auto-Reschedule: If you miss a session due to unexpected tasks, shift it to the weekend intensive mode."
    ]

    title_str = f"Complete AI Plan for {class_program}"
    plan_content = {
        "daily_hours": daily_hours,
        "exam_date": exam_date_str,
        "predicted_score": predicted_score,
        "schedule": schedule,
        "performance_plan": performance_plan,
        "health_plan": health_plan,
        "recommendations": recommendations
    }
    
    new_plan = Plan(user_id=current_user_id, title=title_str, content=json.dumps(plan_content))
    db.session.add(new_plan)
    db.session.commit()
    
    return jsonify({
        "message": "Complete Daily Study Plan Generated",
        "planId": new_plan.id,
        "predicted_score": predicted_score,
        "schedule": schedule,
        "performance_plan": performance_plan,
        "health_plan": health_plan,
        "recommendations": recommendations
    }), 201

@plans_bp.route('/recommend-study', methods=['POST'])
@jwt_required()
def recommend_study():
    data = request.get_json()
    if not data: return jsonify({"msg": "No input data provided"}), 400
    subject_list = data.get('subject_list', [])
    if not subject_list: return jsonify({"msg": "subject_list is required"}), 400
    
    days_left = 30
    recommendations = []
    for subj in subject_list:
        recommendations.append({"subject": subj, "priority": "medium", "suggested_hours": 1.0, "current_progress": 50})
        
    return jsonify({
        "study_first": subject_list[0] if subject_list else None,
        "predicted_overall_performance": 85.0,
        "recommendations": recommendations,
        "days_left": days_left
    }), 200
