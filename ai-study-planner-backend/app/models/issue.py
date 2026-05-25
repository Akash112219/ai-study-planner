from app import db
from datetime import datetime

class Issue(db.Model):
    __tablename__ = 'issues'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False) # 'bug', 'complaint', 'support'
    message = db.Column(db.Text, nullable=False)
    admin_reply = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending') # 'pending', 'resolved'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to get the user who submitted it
    user = db.relationship('User', backref=db.backref('issues', lazy=True, cascade="all, delete-orphan"))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_email': self.user.email if self.user else None,
            'type': self.type,
            'message': self.message,
            'admin_reply': self.admin_reply,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
