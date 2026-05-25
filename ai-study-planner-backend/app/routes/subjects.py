from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.subject import Subject

subjects_bp = Blueprint('subjects', __name__)

@subjects_bp.route('', methods=['GET'])
@jwt_required()
def get_subjects():
    current_user_id = get_jwt_identity()
    subjects = Subject.query.filter_by(user_id=current_user_id).all()
    return jsonify([subject.to_dict() for subject in subjects]), 200

@subjects_bp.route('', methods=['POST'])
@jwt_required()
def add_subject():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({"msg": "Missing subject name"}), 400
        
    new_subject = Subject(
        user_id=current_user_id,
        name=data['name'],
        difficulty_level=data.get('difficulty_level', 3),
        hours_studied=data.get('hours_studied', 0.0),
        target_grade=data.get('target_grade', '')
    )
    
    db.session.add(new_subject)
    db.session.commit()
    
    return jsonify(new_subject.to_dict()), 201

@subjects_bp.route('/<int:subject_id>', methods=['PUT'])
@jwt_required()
def update_subject(subject_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    subject = Subject.query.filter_by(id=subject_id, user_id=current_user_id).first()
    if not subject:
        return jsonify({"msg": "Subject not found"}), 404
        
    if 'name' in data: subject.name = data['name']
    if 'difficulty_level' in data: subject.difficulty_level = data['difficulty_level']
    if 'hours_studied' in data: subject.hours_studied = data['hours_studied']
    if 'target_grade' in data: subject.target_grade = data['target_grade']
    
    db.session.commit()
    
    return jsonify(subject.to_dict()), 200

@subjects_bp.route('/<int:subject_id>', methods=['DELETE'])
@jwt_required()
def delete_subject(subject_id):
    current_user_id = get_jwt_identity()
    subject = Subject.query.filter_by(id=subject_id, user_id=current_user_id).first()
    
    if not subject:
        return jsonify({"msg": "Subject not found"}), 404
        
    db.session.delete(subject)
    db.session.commit()
    
    return jsonify({"msg": "Subject deleted"}), 200

@subjects_bp.route('/recommendations', methods=['POST'])
@jwt_required()
def get_recommendations():
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    total_study_hours = data.get('total_study_hours', 10.0) # hours available to study
    
    subjects = Subject.query.filter_by(user_id=current_user_id).all()
    if not subjects:
        return jsonify({"msg": "No subjects found for user. Please add subjects first."}), 404
        
    # Weak Subject Recommendation Algorithm
    # Identify subjects that have high difficulty but low hours_studied
    # Weight = difficulty * (1 / (hours_studied + 1))
    scored_subjects = []
    total_weight = 0
    
    for sub in subjects:
        weight = sub.difficulty_level / (sub.hours_studied + 1.0)
        total_weight += weight
        scored_subjects.append({
            'subject': sub.to_dict(),
            'weakness_score': weight
        })
        
    # Sort descending by weakness
    scored_subjects.sort(key=lambda x: x['weakness_score'], reverse=True)
    
    # Identify weakest
    weakest_subjects = [s['subject']['name'] for s in scored_subjects[:2]]
    
    # Calculate Suggested Time per subject
    time_distribution = []
    for s in scored_subjects:
        # Proportion of total hours based on weight
        allocated_time = (s['weakness_score'] / total_weight) * total_study_hours
        time_distribution.append({
            'subject_id': s['subject']['id'],
            'subject_name': s['subject']['name'],
            'suggested_hours': round(allocated_time, 2)
        })
        
    return jsonify({
        "weak_subjects": weakest_subjects,
        "time_distribution": time_distribution,
        "message": "AI Recommendations generated successfully."
    }), 200
