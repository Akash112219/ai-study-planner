import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
import sqlite3

app = create_app()

def migrate():
    with app.app_context():
        # Create any new tables (Issue, SiteSetting)
        db.create_all()
        print("Created new tables successfully.")
        
        # Alter users table to add new columns if they don't exist
        db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
        
        # Handle absolute paths vs relative paths correctly for sqlite
        if not os.path.exists(db_path) and os.path.exists(os.path.join(app.instance_path, 'studyplanner.db')):
             db_path = os.path.join(app.instance_path, 'studyplanner.db')
             
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check if columns exist
            cursor.execute("PRAGMA table_info(users)")
            columns = [col[1] for col in cursor.fetchall()]
            
            if 'is_banned' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT 0")
                print("Added is_banned column.")
                
            if 'last_login' not in columns:
                cursor.execute("ALTER TABLE users ADD COLUMN last_login DATETIME")
                print("Added last_login column.")
                
            conn.commit()
            conn.close()
            print("Migration completed successfully.")
        except Exception as e:
            print(f"Migration error: {e}")

if __name__ == "__main__":
    migrate()
