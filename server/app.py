from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY')
if not RAPIDAPI_KEY:
    logger.error('RAPIDAPI_KEY not set in environment variables')
    @app.route('/', methods=['GET', 'POST'])
    def server_error():
        return jsonify({"error": "Server configuration error"}), 500

BASE_URL = "https://open-weather13.p.rapidapi.com/city/{city}/{country}"

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

        logger.info(f'Successfully retrieved weather data for {city}')
        return jsonify(weather)

    except requests.exceptions.HTTPError as http_err:
        logger.error(f'HTTP error occurred: {http_err}')
        return jsonify({"error": str(http_err)}), response.status_code
    except Exception as err:
        logger.error(f'Error occurred: {err}')
        return jsonify({"error": str(err)}), 500

if __name__ == '__main__':
    logger.info('Starting Weather API server...')
    # Explicitly binding to IPv4 loopback address
    app.run(host='127.0.0.1', port=5000, debug=True)
