import os
import sys

# Add the current directory to path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    email = "rasheedakash164@gmail.com"
    password = "hacker"
    
    user = User.query.filter_by(email=email).first()
    if user:
        print(f"User {email} already exists. Updating role and password.")
        user.password_hash = generate_password_hash(password)
        user.role = 'admin'
    else:
        print(f"Creating new admin user {email}.")
        hashed_password = generate_password_hash(password)
        user = User(email=email, password_hash=hashed_password, role='admin')
        db.session.add(user)
        
    db.session.commit()
    print("Admin user successfully created/updated!")
