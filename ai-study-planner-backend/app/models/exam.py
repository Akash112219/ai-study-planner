from datetime import datetime
from app import db

class ExamSession(db.Model):
    __tablename__ = 'exam_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject_name = db.Column(db.String(100), nullable=False)
    topic_focus = db.Column(db.String(255), nullable=True)
    difficulty = db.Column(db.String(50), nullable=False, default='medium')
    total_marks = db.Column(db.Integer, default=100)
    
    # Test Metadata
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    duration_minutes = db.Column(db.Integer, default=60)
    status = db.Column(db.String(50), default='in_progress') # in_progress, submitted, expired
    
    # Results
    obtained_marks = db.Column(db.Integer, nullable=True)
    percentage = db.Column(db.Float, nullable=True)
    mcq_score = db.Column(db.Integer, nullable=True)
    short_score = db.Column(db.Integer, nullable=True)
    long_score = db.Column(db.Integer, nullable=True)
    
    # Feedback Data (stored as JSON string or text for simplicity)
    weak_topics = db.Column(db.Text, nullable=True)
    strong_topics = db.Column(db.Text, nullable=True)
    improvement_suggestions = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "subject_name": self.subject_name,
            "topic_focus": self.topic_focus,
            "difficulty": self.difficulty,
            "total_marks": self.total_marks,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "duration_minutes": self.duration_minutes,
            "status": self.status,
            "obtained_marks": self.obtained_marks,
            "percentage": self.percentage,
            "mcq_score": self.mcq_score,
            "short_score": self.short_score,
            "long_score": self.long_score,
            "weak_topics": self.weak_topics,
            "strong_topics": self.strong_topics,
            "improvement_suggestions": self.improvement_suggestions
        }
