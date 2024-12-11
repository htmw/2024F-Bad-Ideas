import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler, LabelEncoder

# Step 1: Data Preparation
data = {
    'Temperature': [5, 25, 15, -5, 30, 10, 0, 20, 18, 22],
    'Rain': [1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    'Snow': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    'Wind': [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
    'Outfit': ['warm', 'light', 'warm', 'snow_gear', 'light', 'rain_gear', 'snow_gear', 'light', 'rain_gear', 'wind_resistant']
}

df = pd.DataFrame(data)

# Step 2: Encode target variable
label_encoder = LabelEncoder()
df['Outfit'] = label_encoder.fit_transform(df['Outfit'])

# Step 3: Feature Scaling
X = df[['Temperature', 'Rain', 'Snow', 'Wind']]
y = df['Outfit']
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Step 4: Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Step 5: Model Training with Hyperparameter Tuning
param_grid = {
    'criterion': ['gini', 'entropy'],
    'max_depth': [None, 5, 10, 15],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(DecisionTreeClassifier(random_state=42), param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_

# Step 6: Model Evaluation
y_pred = best_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f'Best Parameters: {grid_search.best_params_}')
print(f'Accuracy: {accuracy * 100:.2f}%')
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Step 7: Cross-validation for Robust Performance Metrics
cv_scores = cross_val_score(best_model, X_scaled, y, cv=5)
print(f'\nCross-Validation Accuracy: {np.mean(cv_scores) * 100:.2f}%')

# Step 8: New Data Prediction
new_weather = {'Temperature': [2], 'Rain': [1], 'Snow': [0], 'Wind': [1]}
new_weather_scaled = scaler.transform(pd.DataFrame(new_weather))
outfit_prediction = best_model.predict(new_weather_scaled)
outfit_label = label_encoder.inverse_transform(outfit_prediction)
print(f'Suggested Outfit: {outfit_label[0]}')
