import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

data = {
    'Temperature': [5, 25, 15, -5, 30, 10, 0, 20, 18, 22],
    'Rain': [1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    'Snow': [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
    'Wind': [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
    'Outfit': ['warm', 'light', 'warm', 'snow_gear', 'light', 'rain_gear', 'snow_gear', 'light', 'rain_gear', 'wind_resistant']
}

df = pd.DataFrame(data)
X = df[['Temperature', 'Rain', 'Snow', 'Wind']]
y = df['Outfit']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = DecisionTreeClassifier()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy * 100:.2f}%')

new_weather = {'Temperature': [2], 'Rain': [1], 'Snow': [0], 'Wind': [1]}
outfit_prediction = model.predict(pd.DataFrame(new_weather))
print(f'Suggested Outfit: {outfit_prediction[0]}')

