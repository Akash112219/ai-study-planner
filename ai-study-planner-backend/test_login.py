import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User
from werkzeug.security import check_password_hash

app = create_app()

with app.app_context():
    email = "rasheedakash164@gmail.com"
    password = "hacker"
    
    user = User.query.filter_by(email=email).first()
    if not user:
        print("User not found.")
    else:
        print(f"Found user: {user.email}, Role: {user.role}")
        print(f"Hash: {user.password_hash}")
        is_valid = check_password_hash(user.password_hash, password)
        print(f"Password check for 'hacker': {is_valid}")
