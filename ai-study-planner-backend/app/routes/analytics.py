from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.exam import ExamSession
import statistics

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/', methods=['GET'])
@jwt_required()
def get_analytics():
    current_user_id = get_jwt_identity()
    sessions = ExamSession.query.filter_by(user_id=current_user_id, status='submitted').all()
    
    if not sessions:
        return jsonify({
            "performance_score": 0,
            "weak_subjects": [],
            "strong_subjects": [],
            "improvement_suggestions": "Take some mock tests to generate analytics."
        }), 200

    subject_scores = {}
    for s in sessions:
        if s.subject_name not in subject_scores:
            subject_scores[s.subject_name] = []
        if s.percentage is not None:
            subject_scores[s.subject_name].append(s.percentage)

    weak_subjects = []
    strong_subjects = []
    overall_scores = []

    for subj, scores in subject_scores.items():
        if scores:
            avg = statistics.mean(scores)
            overall_scores.append(avg)
            if avg < 60:
                weak_subjects.append(subj)
            elif avg >= 80:
                strong_subjects.append(subj)
            
    perf_score = statistics.mean(overall_scores) if overall_scores else 0

    if weak_subjects:
        suggestions = f"Focus on revising {', '.join(weak_subjects)}. Your recent test scores in these areas indicate missing foundational knowledge."
    elif perf_score >= 80:
        suggestions = "You're doing excellent! Maintain your study schedule and try some Hard difficulty mock tests to challenge yourself."
    else:
        suggestions = "Good steady progress. Try to push your average score above 80% by focusing on understanding the explanations for Short and Long questions."

    return jsonify({
        "performance_score": round(perf_score, 1),
        "weak_subjects": weak_subjects,
        "strong_subjects": strong_subjects,
        "improvement_suggestions": suggestions
    }), 200
