from app import db
from datetime import datetime

class Subject(db.Model):
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    difficulty_level = db.Column(db.Integer, default=3) # 1-5 scale
    hours_studied = db.Column(db.Float, default=0.0)
    target_grade = db.Column(db.String(10), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'difficulty_level': self.difficulty_level,
            'hours_studied': self.hours_studied,
            'target_grade': self.target_grade,
            'created_at': self.created_at.isoformat()
        }
