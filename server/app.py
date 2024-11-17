from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

load_dotenv()
app = Flask(__name__)
CORS(app)

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY')
MONGODB_URI = os.environ.get('MONGODB_URI')

if not all([RAPIDAPI_KEY, MONGODB_URI]):
    logger.error('Missing required environment variables')
    @app.route('/', methods=['GET', 'POST'])
    def server_error():
        return jsonify({"error": "Server configuration error"}), 500

try:
    client = MongoClient(MONGODB_URI)
    db = client['clothing_db']
    clothes_collection = db['clothes']
    logger.info('Successfully connected to MongoDB')
except Exception as e:
    logger.error(f'Failed to connect to MongoDB: {e}')

BASE_URL = "https://open-weather13.p.rapidapi.com/city/{city}/{country}"

def get_clothing_recommendations(weather_condition, temperature):
    try:
        temp_celsius = temperature - 273.15

        if temp_celsius < 10:
            temp_category = "cold"
        elif temp_celsius < 20:
            temp_category = "mild"
        else:
            temp_category = "hot"

        query = {
            "weather_conditions": {
                "$in": [weather_condition.lower(), temp_category]
            }
        }

        clothes = list(clothes_collection.find(query))

        for cloth in clothes:
            cloth['_id'] = str(cloth['_id'])

        return clothes

    except Exception as e:
        logger.error(f'Error getting clothing recommendations: {e}')
        return []

@app.route('/weather', methods=['GET'])
def get_weather():
    logger.info('Received weather request')
    city = request.args.get('city')
    country = request.args.get('country', 'EN')
    logger.info(f'Request for city: {city}, country: {country}')

    if not city:
        logger.error('No city provided')
        return jsonify({"error": "City parameter is required"}), 400

    url = BASE_URL.format(city=city, country=country)
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "open-weather13.p.rapidapi.com"
    }

    try:
        logger.info(f'Making request to RapidAPI for {city}')
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        weather = {
            'city': data['name'],
            'country': data['sys']['country'],
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon']
        }

        recommendations = get_clothing_recommendations(
            data['weather'][0]['description'],
            data['main']['temp']
        )

        response_data = {
            'weather': weather,
            'clothing_recommendations': recommendations
        }

        logger.info(f'Successfully retrieved weather and clothing data for {city}')
        return jsonify(response_data)

    except requests.exceptions.HTTPError as http_err:
        logger.error(f'HTTP error occurred: {http_err}')
        return jsonify({"error": str(http_err)}), response.status_code
    except Exception as err:
        logger.error(f'Error occurred: {err}')
        return jsonify({"error": str(err)}), 500

@app.route('/clothes', methods=['GET'])
def get_all_clothes():
    try:
        clothes = list(clothes_collection.find())
        for cloth in clothes:
            cloth['_id'] = str(cloth['_id'])
        return jsonify(clothes)
    except Exception as e:
        logger.error(f'Error retrieving clothes: {e}')
        return jsonify({"error": str(e)}), 500

@app.route('/clothes', methods=['POST'])
def add_cloth():
    try:
        cloth_data = request.json
        if not cloth_data or not all(k in cloth_data for k in ['name', 'weather_conditions']):
            return jsonify({"error": "Missing required fields"}), 400

        result = clothes_collection.insert_one(cloth_data)
        cloth_data['_id'] = str(result.inserted_id)
        return jsonify(cloth_data), 201
    except Exception as e:
        logger.error(f'Error adding cloth: {e}')
        return jsonify({"error": str(e)}), 500

@app.route('/clothes/<id>', methods=['PUT'])
def update_cloth(id):
    try:
        cloth_data = request.json
        result = clothes_collection.update_one(
            {'_id': ObjectId(id)},
            {'$set': cloth_data}
        )
        if result.modified_count:
            return jsonify({"message": "Cloth updated successfully"})
        return jsonify({"error": "Cloth not found"}), 404
    except Exception as e:
        logger.error(f'Error updating cloth: {e}')
        return jsonify({"error": str(e)}), 500

@app.route('/clothes/<id>', methods=['DELETE'])
def delete_cloth(id):
    try:
        result = clothes_collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count:
            return jsonify({"message": "Cloth deleted successfully"})
        return jsonify({"error": "Cloth not found"}), 404
    except Exception as e:
        logger.error(f'Error deleting cloth: {e}')
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info('Starting Weather and Clothing API server...')
    app.run(host='127.0.0.1', port=5000, debug=True)
