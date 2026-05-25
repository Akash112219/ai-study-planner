import os
import sys

# Add the current directory to path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    users = User.query.all()
    if not users:
        print("No users found in the database. Please create an account first.")
    else:
        # Promote the first user (usually the primary tester) to admin
        target_user = users[0]
        target_user.role = 'admin'
        db.session.commit()
        print(f"User {target_user.email} promoted to admin!")
