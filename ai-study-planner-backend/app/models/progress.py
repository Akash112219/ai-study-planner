from app import db
from datetime import datetime

class Progress(db.Model):
    __tablename__ = 'progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hours_per_day = db.Column(db.Float, nullable=False)
    subject_count = db.Column(db.Integer, nullable=False)
    days_left = db.Column(db.Integer, nullable=False)
    performance_score = db.Column(db.Float, nullable=False)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'hours_per_day': self.hours_per_day,
            'subject_count': self.subject_count,
            'days_left': self.days_left,
            'performance_score': self.performance_score,
            'recorded_at': self.recorded_at.isoformat()
        }
