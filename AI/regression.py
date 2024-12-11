import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler, LabelEncoder
from datetime import datetime

# Step 1: Load and preprocess data
file_path = 'export.csv'
data = pd.read_csv(file_path)

# Feature Engineering
data['time'] = pd.to_datetime(data['time'])
data['hour'] = data['time'].dt.hour
data['month'] = data['time'].dt.month

# Separate features for regression and classification
X_reg = data[['rhum', 'pres', 'wspd', 'wdir', 'hour', 'month']]
y_reg = data['temp']

# Fill missing values
X_reg.fillna(X_reg.mean(), inplace=True)

# Step 2: Regression Task - Predicting Temperature
X_reg_train, X_reg_test, y_reg_train, y_reg_test = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)

reg_model = RandomForestRegressor(n_estimators=100, random_state=42)
reg_model.fit(X_reg_train, y_reg_train)

y_reg_pred = reg_model.predict(X_reg_test)
mse = mean_squared_error(y_reg_test, y_reg_pred)
rmse = mse ** 0.5

print(f'Regression - Root Mean Squared Error: {rmse:.2f}')

# Step 3: Classification Task - Predicting Outfit
# Assuming 'Outfit' column exists in the data, with temperature-based labeling
data['Outfit'] = data['temp'].apply(
    lambda x: 'warm' if x < 10 else ('light' if x < 25 else 'cool')
)

label_encoder = LabelEncoder()
data['Outfit'] = label_encoder.fit_transform(data['Outfit'])

X_clf = data[['rhum', 'pres', 'wspd', 'wdir', 'hour', 'month']]
y_clf = data['Outfit']

# Scaling Features
scaler = StandardScaler()
X_clf_scaled = scaler.fit_transform(X_clf)

X_clf_train, X_clf_test, y_clf_train, y_clf_test = train_test_split(X_clf_scaled, y_clf, test_size=0.2, random_state=42)

clf_model = DecisionTreeClassifier(random_state=42)
clf_model.fit(X_clf_train, y_clf_train)

y_clf_pred = clf_model.predict(X_clf_test)
accuracy = accuracy_score(y_clf_test, y_clf_pred)

print(f'\nClassification - Accuracy: {accuracy * 100:.2f}%')
print("\nClassification Report:")
print(classification_report(y_clf_test, y_clf_pred))
print("\nConfusion Matrix:")
print(confusion_matrix(y_clf_test, y_clf_pred))

# Step 4: New Predictions
new_weather = {'rhum': [70], 'pres': [1015], 'wspd': [10], 'wdir': [90], 'hour': [14], 'month': [6]}

# Predict Temperature
new_weather_df = pd.DataFrame(new_weather)
predicted_temp = reg_model.predict(new_weather_df)[0]
print(f'\nPredicted Temperature: {predicted_temp:.2f}°C')

# Predict Outfit
new_weather_scaled = scaler.transform(new_weather_df)
predicted_outfit = clf_model.predict(new_weather_scaled)
outfit_label = label_encoder.inverse_transform(predicted_outfit)
print(f'Suggested Outfit: {outfit_label[0]}')
