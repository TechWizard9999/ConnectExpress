import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error
import warnings

warnings.filterwarnings("ignore")

def preprocess_data(filepath):
    df = pd.read_csv(filepath)
    
    df['date'] = pd.to_datetime(df['date'])
    df['day_of_week'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    df['day_of_year'] = df['date'].dt.dayofyear
    
    df['scheduled_departure'] = pd.to_datetime(df['scheduled_departure'], format='%H:%M', errors='coerce').dt.hour
    df['scheduled_arrival'] = pd.to_datetime(df['scheduled_arrival'], format='%H:%M', errors='coerce').dt.hour

    df.fillna({'scheduled_departure': 0, 'scheduled_arrival': 0}, inplace=True)

    df['trip_duration_scheduled'] = df['scheduled_arrival'] - df['scheduled_departure']
    df['trip_duration_scheduled'] = df['trip_duration_scheduled'].apply(lambda x: x + 24 if x < 0 else x)

    categorical_features = ['train_number', 'from_station', 'to_station']
    encoders = {col: LabelEncoder() for col in categorical_features}

    for col in categorical_features:
        df[col] = encoders[col].fit_transform(df[col])
        
    return df, encoders

def train_model(df):
    features = [
        'train_number', 'from_station', 'to_station', 
        'scheduled_departure', 'scheduled_arrival', 
        'weather_condition', 'day_of_week', 'month', 
        'day_of_year', 'trip_duration_scheduled'
    ]
    target = 'actual_delay_minutes'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    lgb_params = {
        'objective': 'regression_l1',
        'metric': 'rmse',
        'n_estimators': 2000,
        'learning_rate': 0.01,
        'feature_fraction': 0.8,
        'bagging_fraction': 0.8,
        'bagging_freq': 1,
        'lambda_l1': 0.1,
        'lambda_l2': 0.1,
        'num_leaves': 31,
        'verbose': -1,
        'n_jobs': -1,
        'seed': 42,
        'boosting_type': 'gbdt',
    }
    
    model = lgb.LGBMRegressor(**lgb_params)
    
    model.fit(X_train, y_train, 
              eval_set=[(X_test, y_test)], 
              eval_metric='rmse', 
              callbacks=[lgb.early_stopping(100, verbose=False)])
              
    return model

def predict_delay(model, encoders, user_input):
    input_df = pd.DataFrame([user_input])
    
    input_df['date'] = pd.to_datetime(input_df['date'])
    input_df['day_of_week'] = input_df['date'].dt.dayofweek
    input_df['month'] = input_df['date'].dt.month
    input_df['day_of_year'] = input_df['date'].dt.dayofyear

    input_df['scheduled_departure'] = pd.to_datetime(input_df['scheduled_departure'], format='%H:%M').dt.hour
    input_df['scheduled_arrival'] = pd.to_datetime(input_df['scheduled_arrival'], format='%H:%M').dt.hour

    input_df['trip_duration_scheduled'] = input_df['scheduled_arrival'] - input_df['scheduled_departure']
    input_df['trip_duration_scheduled'] = input_df['trip_duration_scheduled'].apply(lambda x: x + 24 if x < 0 else x)

    for col, encoder in encoders.items():
        try:
            input_df[col] = encoder.transform(input_df[col])
        except ValueError:
            return f"Error: '{input_df[col].iloc[0]}' is an unknown category for {col}. It was not present in the training data."

    features = [
        'train_number', 'from_station', 'to_station', 
        'scheduled_departure', 'scheduled_arrival', 
        'weather_condition', 'day_of_week', 'month', 
        'day_of_year', 'trip_duration_scheduled'
    ]
    
    input_features = input_df[features]
    
    prediction = model.predict(input_features)
    
    return max(0, prediction[0])

if __name__ == '__main__':
    filepath = 'data.csv'
    
    try:
        processed_data, label_encoders = preprocess_data(filepath)
        
        trained_model = train_model(processed_data)
        
        print("Train Delay Prediction Model")
        print("----------------------------")
        
        user_input_data = {
            'date': input("Enter date (YYYY-MM-DD): "),
            'train_number': int(input("Enter train number (e.g., 16031): ")),
            'from_station': input("Enter from station (e.g., MAS): ").upper(),
            'to_station': input("Enter to station (e.g., AJJ): ").upper(),
            'scheduled_departure': input("Enter scheduled departure (HH:MM): "),
            'scheduled_arrival': input("Enter scheduled arrival (HH:MM): "),
            'weather_condition': int(input("Enter weather condition (0 for Clear, 1 for Bad): "))
        }

        predicted_delay = predict_delay(trained_model, label_encoders, user_input_data)

        if isinstance(predicted_delay, str):
            print(f"\n{predicted_delay}")
        else:
            print(f"\nPredicted Delay: {predicted_delay:.2f} minutes")

    except FileNotFoundError:
        print(f"Error: The data file '{filepath}' was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")