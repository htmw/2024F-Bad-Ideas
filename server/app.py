from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import logging
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY')
if not RAPIDAPI_KEY:
    app.logger.error('RAPIDAPI_KEY not set in environment variables')
    @app.route('/', methods=['GET', 'POST'])
    def server_error():
        return jsonify({"error": "Server configuration error"}), 500

BASE_URL = "https://open-weather13.p.rapidapi.com/city/{city}/{country}"

@app.route('/weather', methods=['GET'])
def get_weather():
    app.logger.debug('Received request for /weather')
    city = request.args.get('city')
    country = request.args.get('country', 'EN')
    app.logger.debug(f'City: {city}, Country: {country}')
    if not city:
        app.logger.error('No city provided')
        return jsonify({"error": "City parameter is required"}), 400

    url = BASE_URL.format(city=city, country=country)
    headers = {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "open-weather13.p.rapidapi.com"
    }
    app.logger.debug(f'Making request to RapidAPI OpenWeather with URL: {url}')

    try:
        response = requests.get(url, headers=headers, timeout=10)
        app.logger.debug(f'RapidAPI response status code: {response.status_code}')
        response.raise_for_status()
        data = response.json()
        weather = {
            'city': data['name'],
            'country': data['sys']['country'],
            'temperature': data['main']['temp'],
            'description': data['weather'][0]['description'],
            'icon': data['weather'][0]['icon']
        }
        app.logger.debug(f'Returning weather data: {weather}')
        return jsonify(weather)
    except requests.exceptions.HTTPError as http_err:
        app.logger.error(f'HTTP error occurred: {http_err}')
        error_message = f"Error fetching weather data: {http_err}"
        return jsonify({"error": error_message}), response.status_code
    except requests.exceptions.RequestException as err:
        app.logger.error(f'An error occurred: {err}')
        return jsonify({"error": f"Error fetching weather data: {err}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
