from app import db
from datetime import datetime
import json

class SiteSetting(db.Model):
    __tablename__ = 'site_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False, index=True)
    value = db.Column(db.Text, nullable=False) # Store JSON string or simple text
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        try:
            parsed_value = json.loads(self.value)
        except:
            parsed_value = self.value
            
        return {
            'key': self.key,
            'value': parsed_value,
            'updated_at': self.updated_at.isoformat()
        }
