import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import os

def train_and_save_model():
    print("Generating synthetic data for the Study Planner model...")
    
    # Generate synthetic training data
    np.random.seed(42)
    n_samples = 1000
    
    # Features
    # hours_per_day: 1 to 10 hours
    hours_per_day = np.random.uniform(1, 10, n_samples)
    
    # subject_count: 1 to 8 subjects
    subject_count = np.random.randint(1, 9, n_samples)
    
    # days_left: 1 to 60 days before exam
    days_left = np.random.randint(1, 61, n_samples)
    
    # Target: performance_score (0 to 100)
    # Simple heuristic: more hours + more days + fewer subjects = higher score
    base_score = 50
    hours_impact = hours_per_day * 4
    days_impact = days_left * 0.5
    subject_impact = subject_count * (-3)
    
    noise = np.random.normal(0, 5, n_samples)
    
    performance_score = base_score + hours_impact + days_impact + subject_impact + noise
    # Clip between 0 and 100
    performance_score = np.clip(performance_score, 0, 100)
    
    df = pd.DataFrame({
        'hours_per_day': hours_per_day,
        'subject_count': subject_count,
        'days_left': days_left,
        'performance_score': performance_score
    })
    
    X = df[['hours_per_day', 'subject_count', 'days_left']]
    y = df['performance_score']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    score = model.score(X_test, y_test)
    print(f"Model R^2 Score on test set: {score:.4f}")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    joblib.dump(model, model_path)
    print(f"Model successfully saved to {model_path}")

if __name__ == '__main__':
    train_and_save_model()
