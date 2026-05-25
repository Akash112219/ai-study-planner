from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user')
    is_banned = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    profile_picture = db.Column(db.String(255), nullable=True)
    
    # Relationships
    plans = db.relationship('Plan', backref='user', lazy=True, cascade="all, delete-orphan")
    progress = db.relationship('Progress', backref='user', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'is_banned': self.is_banned,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat(),
            'profile_picture': self.profile_picture
        }
