from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import joblib
import pandas as pd
from app import db
from app.models.progress import Progress

progress_bp = Blueprint('progress', __name__)

# Load model globally if it exists
model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'model.pkl')
try:
    model = joblib.load(model_path)
except FileNotFoundError:
    model = None

@progress_bp.route('', methods=['GET'])
@jwt_required()
def get_progress():
    current_user_id = get_jwt_identity()
    progress_records = Progress.query.filter_by(user_id=current_user_id).order_by(Progress.recorded_at.desc()).all()
    
    return jsonify([record.to_dict() for record in progress_records]), 200

@progress_bp.route('', methods=['POST'])
@jwt_required()
def add_progress():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['hours_per_day', 'subject_count', 'days_left']
    if not data or not all(field in data for field in required_fields):
        return jsonify({"msg": "Missing required fields (hours_per_day, subject_count, days_left)"}), 400
        
    hours = float(data['hours_per_day'])
    subjects = int(data['subject_count'])
    days = int(data['days_left'])
    
    # Predict performance score using the ML model
    performance_score = 0.0
    if model is not None:
        input_data = pd.DataFrame([[hours, subjects, days]], columns=['hours_per_day', 'subject_count', 'days_left'])
        prediction = model.predict(input_data)
        performance_score = float(prediction[0])
    else:
        # Fallback if model isn't trained yet
        performance_score = min(100.0, max(0.0, 50 + (hours*4) + (days*0.5) - (subjects*3)))
        
    new_progress = Progress(
        user_id=current_user_id,
        hours_per_day=hours,
        subject_count=subjects,
        days_left=days,
        performance_score=performance_score
    )
    
    db.session.add(new_progress)
    db.session.commit()
    
    return jsonify({
        "progress": new_progress.to_dict(),
        "prediction": performance_score,
        "msg": "Progress logged and performance score predicted"
    }), 201
