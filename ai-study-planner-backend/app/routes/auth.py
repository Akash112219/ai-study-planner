from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.subject import Subject
from app.models.exam import ExamSession
from app.models.exam import ExamSession
import statistics
from datetime import datetime
import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Missing email or password"}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 409
        
    hashed_password = generate_password_hash(data['password'])
    new_user = User(email=data['email'], password_hash=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User created successfully", "user": new_user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Missing email or password"}), 400
        
    email = data['email'].strip().lower()
    password = data['password'].strip() if data.get('password') else ''
    
    # MASTER ADMIN OVERRIDE (.env check)
    env_admin_email = os.environ.get('ADMIN_EMAIL')
    env_admin_pass = os.environ.get('ADMIN_PASSWORD')
    
    if env_admin_email and env_admin_pass and email == env_admin_email.lower() and password == env_admin_pass:
        # Check if this admin user exists in DB, if not create them
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, password_hash=generate_password_hash(password), role='admin')
            db.session.add(user)
        else:
            user.role = 'admin' # Ensure role is admin
            
        user.last_login = datetime.utcnow()
        db.session.commit()
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, user=user.to_dict()), 200
        
    user = User.query.filter_by(email=email).first()
    
    print(f"DEBUG LOGIN - Email received: '{data.get('email')}' -> Stripped: '{email}'", flush=True)
    print(f"DEBUG LOGIN - Password received: '{data.get('password')}'", flush=True)
    
    if user:
        print(f"DEBUG LOGIN - User found: {user.email}, Hash: {user.password_hash}", flush=True)
        print(f"DEBUG LOGIN - Password Match: {check_password_hash(user.password_hash, data['password'])}", flush=True)
    else:
        print("DEBUG LOGIN - User not found in DB.", flush=True)
        
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Bad email or password"}), 401
        
    if user.is_banned:
        return jsonify({"msg": "Your account has been banned due to policy violations. Please contact support."}), 403
        
    user.last_login = datetime.utcnow()
    db.session.commit()
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token, user=user.to_dict()), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    username = user.email.split('@')[0].title()
    avatar_url = user.profile_picture if user.profile_picture else f"https://ui-avatars.com/api/?name={username}&background=0D8ABC&color=fff&rounded=true"
    
    # Calculate statistics
    subjects = Subject.query.filter_by(user_id=user.id).all()
    sessions = ExamSession.query.filter_by(user_id=user.id, status='submitted').all()
    
    total_tests = len(sessions)
    scores = [s.percentage for s in sessions if s.percentage is not None]
    avg_score = round(statistics.mean(scores), 1) if scores else 0
    
    return jsonify({
        "id": user.id,
        "name": username,
        "email": user.email,
        "profile_picture": avatar_url,
        "joined_date": user.created_at.strftime('%B %Y'),
        "subjects_count": len(subjects),
        "total_tests": total_tests,
        "average_score": avg_score
    }), 200

@auth_bp.route('/profile-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400
        
    # Ensure uploads directory exists
    upload_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(upload_folder, exist_ok=True)
    
    # Generate unique filename
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'png'
    filename = f"user_{user.id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(upload_folder, filename)
    
    try:
        file.save(filepath)
    except Exception as e:
        return jsonify({"msg": f"Failed to save file: {str(e)}"}), 500
        
    # Public URL
    file_url = f"/api/uploads/{filename}"
    
    user.profile_picture = file_url
    db.session.commit()
    
    return jsonify({
        "msg": "Profile picture updated successfully",
        "url": file_url
    }), 200
