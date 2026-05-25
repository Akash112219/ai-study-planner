from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.issue import Issue
from app.models.user import User

issues_bp = Blueprint('issues', __name__)

@issues_bp.route('/', methods=['POST'])
@jwt_required()
def submit_issue():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('type') or not data.get('message'):
        return jsonify({"msg": "Missing type or message"}), 400
        
    issue = Issue(
        user_id=user_id,
        type=data['type'],
        message=data['message']
    )
    
    db.session.add(issue)
    db.session.commit()
    
    return jsonify({"msg": "Issue submitted successfully", "issue": issue.to_dict()}), 201

@issues_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_issues():
    user_id = get_jwt_identity()
    issues = Issue.query.filter_by(user_id=user_id).order_by(Issue.created_at.desc()).all()
    
    return jsonify([issue.to_dict() for issue in issues]), 200
