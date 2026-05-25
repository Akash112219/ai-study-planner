import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure uploads
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.plans import plans_bp
    from app.routes.progress import progress_bp
    from app.routes.subjects import subjects_bp
    from app.routes.questions import questions_bp
    from app.routes.exam import exam_bp
    from app.routes.analytics import analytics_bp
    from app.routes.admin import admin_bp
    from app.routes.issues import issues_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(plans_bp, url_prefix='/api/plans')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    app.register_blueprint(subjects_bp, url_prefix='/api/subjects')
    app.register_blueprint(questions_bp, url_prefix='/api/questions')
    app.register_blueprint(exam_bp, url_prefix='/api/exam')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(issues_bp, url_prefix='/api/issues')

    # Base health route
    @app.route('/')
    def health_check():
        return jsonify({"status": "healthy", "service": "AI Study Planner API"}), 200

    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app
