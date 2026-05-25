from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.exam import ExamSession
from app.models.plan import Plan
from app.models.site_setting import SiteSetting
from functools import wraps
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash
import os
import uuid
from functools import wraps
from app.models.issue import Issue

admin_bp = Blueprint('admin', __name__)

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or user.role != 'admin':
                return jsonify({"msg": "Admin access required"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

@admin_bp.route('/stats', methods=['GET'])
@admin_required()
def get_stats():
    total_users = User.query.count()
    total_exams = ExamSession.query.count()
    total_plans = Plan.query.count()
    
    return jsonify({
        "total_users": total_users,
        "total_exams": total_exams,
        "total_plans": total_plans,
    }), 200

@admin_bp.route('/users', methods=['GET'])
@admin_required()
def get_users():
    users = User.query.all()
    user_list = []
    for u in users:
        user_list.append({
            'id': u.id,
            'email': u.email,
            'role': u.role,
            'created_at': u.created_at.isoformat(),
            'is_banned': u.is_banned,
            'last_login': u.last_login.isoformat() if u.last_login else None,
            'plans_count': len(u.plans),
            'exams_count': ExamSession.query.filter_by(user_id=u.id).count()
        })
    return jsonify(user_list), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required()
def edit_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    if 'email' in data:
        # Check if email is already taken by someone else
        existing = User.query.filter_by(email=data['email']).first()
        if existing and existing.id != user_id:
            return jsonify({"msg": "Email already in use"}), 400
        user.email = data['email']
        
    if 'role' in data and data['role'] in ['user', 'admin']:
        user.role = data['role']
        
    db.session.commit()
    return jsonify({"msg": "User updated successfully", "user": user.to_dict()}), 200

@admin_bp.route('/users/<int:user_id>/ban', methods=['PUT'])
@admin_required()
def toggle_ban_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    current_user_id = get_jwt_identity()
    if str(user.id) == str(current_user_id):
        return jsonify({"msg": "Cannot ban yourself"}), 400
        
    user.is_banned = not user.is_banned
    db.session.commit()
    
    status = "banned" if user.is_banned else "unbanned"
    return jsonify({"msg": f"User {status} successfully", "is_banned": user.is_banned}), 200

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    # Prevent self-deletion
    current_user_id = get_jwt_identity()
    if str(user.id) == str(current_user_id):
        return jsonify({"msg": "Cannot delete your own admin account"}), 400
        
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted successfully"}), 200

# --- SITE SETTINGS ---

@admin_bp.route('/settings', methods=['GET'])
@admin_required()
def get_settings():
    settings = SiteSetting.query.all()
    # Convert list to key-value dict for easy frontend consumption
    settings_dict = {}
    for setting in settings:
        settings_dict[setting.key] = setting.to_dict()['value']
    return jsonify(settings_dict), 200

@admin_bp.route('/settings', methods=['POST'])
@admin_required()
def update_settings():
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({"msg": "Invalid data payload"}), 400
        
    for key, value in data.items():
        setting = SiteSetting.query.filter_by(key=key).first()
        import json
        
        # Convert dicts/lists to JSON strings
        if isinstance(value, (dict, list)):
            value_str = json.dumps(value)
        else:
            value_str = str(value)
            
        if setting:
            setting.value = value_str
        else:
            setting = SiteSetting(key=key, value=value_str)
            db.session.add(setting)
            
    db.session.commit()
    return jsonify({"msg": "Settings updated successfully"}), 200

@admin_bp.route('/settings/upload', methods=['POST'])
@admin_required()
def upload_setting_image():
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400
        
    key = request.form.get('key')
    if not key or key not in ['logo', 'favicon', 'hero_image']:
        return jsonify({"msg": "Invalid or missing setting key"}), 400

    # Ensure uploads directory exists
    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique filename
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'png'
    filename = f"{key}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(upload_folder, filename)
    
    try:
        file.save(filepath)
    except Exception as e:
        return jsonify({"msg": f"Failed to save file: {str(e)}"}), 500
        
    # Public URL
    # Assuming backend is running on same host, or we return relative URL
    file_url = f"/api/uploads/{filename}"
    
    # Save to database
    setting = SiteSetting.query.filter_by(key=key).first()
    if setting:
        setting.value = file_url
    else:
        setting = SiteSetting(key=key, value=file_url)
        db.session.add(setting)
        
    db.session.commit()
    
    return jsonify({
        "msg": "File uploaded successfully",
        "key": key,
        "url": file_url
    }), 200

# --- USER ISSUES ---

@admin_bp.route('/issues', methods=['GET'])
@admin_required()
def get_all_issues():
    issues = Issue.query.order_by(Issue.created_at.desc()).all()
    return jsonify([issue.to_dict() for issue in issues]), 200

@admin_bp.route('/issues/<int:issue_id>/resolve', methods=['PUT'])
@admin_required()
def resolve_issue(issue_id):
    issue = Issue.query.get(issue_id)
    if not issue:
        return jsonify({"msg": "Issue not found"}), 404
        
    data = request.get_json() or {}
    
    # If it's a password change request, process the password change
    if issue.type == 'password_change':
        user = issue.user
        if not user:
            return jsonify({"msg": "User associated with this issue no longer exists"}), 400
            
        # Extract new password from the message (assuming it's formatted properly by frontend)
        # We'll just look for a new password in the payload first, or parse it from message
        new_password = data.get('new_password')
        if not new_password and issue.message.startswith('REQUESTED_PASSWORD:'):
            new_password = issue.message.split('REQUESTED_PASSWORD:')[1].strip()
            
        if new_password:
            user.password_hash = generate_password_hash(new_password)
            issue.admin_reply = data.get('reply', 'Password successfully changed by admin.')
        else:
            issue.admin_reply = data.get('reply', 'Failed to change password. No valid password provided.')
            issue.status = 'rejected'
            db.session.commit()
            return jsonify({"msg": "No valid password provided in request", "issue": issue.to_dict()}), 400
    else:
        issue.admin_reply = data.get('reply', 'Issue resolved by admin.')
        
    issue.status = data.get('status', 'resolved')
    db.session.commit()
    
    return jsonify({"msg": "Issue updated successfully", "issue": issue.to_dict()}), 200
