from skyfield.api import load
import json
import requests
from flask import Flask, render_template, send_file, request, jsonify
from backend.utils.constants import PLANET_NATURAL_SATELLITE_DICT, PLANETS_LIST
from backend.utils.load_moon_data_async import load_moon_data_async 
from backend.utils.get_planet_parameters import get_planet_parameters
from backend.utils.get_moon_parameters import get_moon_parameters as g
from backend.utils.get_orbital_parameters import get_orbitals
import urllib.parse
app = Flask(__name__)

API_INCLUDE_DATA: list[str] = [
  "id",
  "name",
  "englishName",
  "massValue",""
  "massExponent",
  "mass",
  "volValue",""
  "volExponent",
  "vol",
  "planet",
  "aroundPlanet",
  "moon",
  "moons",
  "density",
  "gravity",
  "escape",
  "meanRadius",
  "equaRadius",
  "polarRadius",
  "flattening",
  "axialTilt",
  "sideralRotation",
  "avgTemp",
  "bodyType",
];
@app.route('/')
async def home():
    # load_and_retrieve_planet_moon_data(PLANET_NATURAL_SATELLITE_DICT["Mars"])
    # print(local_dt)
    # setup_time()
    # load_moon_data_async()
    return send_file('index.html')
# @app.route("/api/rest/physical")
# def physical():
#     base_url = "https://api.le-systeme-solaire.net/rest/bodies?"
#     filters = "&".join([f"filter[]=englishName,eq,{name}" for name in names])
#     data = f"data=${','.join(API_INCLUDE_DATA)}${filters}&satisfy=any"
#     print(base_url + data)
#     third_party_url = "https://api.le-systeme-solaire.net/rest/bodies"
#     params = request.args
#     # print(params)
#     response = requests.get(third_party_url, params=params)
#     return jsonify(response.json())

@app.route('/get_parameters', methods=['GET'])
def get():
    return get_planet_parameters()

@app.route('/get_moon_parameters', methods=['POST'])
def get_moon_parameters():
    data = request.get_json()
    planet_name = data.get('planetName')
    moons = data.get('moons')
    return jsonify(get_orbitals(planet_name, moons))



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80, use_reloader=True)


@app.route("/api/rest/summary/celestial", methods=["POST"])
def temp_celestial_summary():
    data = request.get_json()
    planet_name = data.get("planetName", "")
    body_type = data.get("bodyType", "")
    if not planet_name or not body_type:
        return jsonify({"error": "No planet name or body type provided"}), 400
    
    planet_name = urllib.parse.quote(planet_name)
    base_url = "https://en.wikipedia.org/api/rest_v1/page/summary/"
    
    first_attempt = f"{base_url}{planet_name}_({body_type.lower()})"
    response = requests.get(first_attempt)
    if response.status_code == 404 or response.status_code == 400:
        fallback_url = f"{base_url}{planet_name}"
        response = requests.get(fallback_url)
    if response.ok:
        data = response.json()
        summary = data.get('extract', 'No summary available.')
        return jsonify({ "summary": summary }), response.status_code
    else:
        return jsonify({"error": "Failed to fetch Wikipedia summary"}), response.status_code


@app.route("/api/rest/parameters/orbital", methods=["POST"])
def orbital():
    data = request.get_json()
    primary_name = data.get("primaryName")
    secondary_names = data.get("secondaryNames")
    if not primary_name or not secondary_names:
        return jsonify({"error": "No primary name or secondary names provided"}), 400
    
    return jsonify(get_orbitals(primary_name, secondary_names))


@app.route("/api/rest/parameters/physical", methods=['POST'])
def physical():
    data = request.get_json()
    bodyNames = data.get("bodyNames", [])

    if not bodyNames:
        return jsonify({"error": "No bodyNames provided"}), 400
    
    base_url = "https://api.le-systeme-solaire.net/rest/bodies"
    filters = "&".join([f"filter[]=englishName,eq,{name}" for name in bodyNames])
    include_data = ",".join(API_INCLUDE_DATA)
    full_url = f"{base_url}?data={include_data}&{filters}&satisfy=any"
    try:
        response = requests.get(full_url)
        response.raise_for_status()
        data = response.json()
        
        if "bodies" in data:
            result = {body["englishName"]: body for body in data["bodies"]}
        else:
            result = {}

        return jsonify(result), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/rest/summary/parameter", methods=["POST"])
def temp_parameter_summary():
    data = request.get_json()
    parameter_name: str = data.get("parametername", "")

    if not parameter_name:
        return jsonify({"error": "No parameter name"}), 400
    
    # planet_name = urllib.parse.quote(planet_name)
    processed_parameter = parameter_name.replace(" ", "_")
    base_url = "https://en.wikipedia.org/api/rest_v1/page/summary/"
    
    end_point = f"{base_url}{processed_parameter})"
    response = requests.get(end_point)

    if response.ok:
        data = response.json()
        summary = data.get('extract', 'No summary available.')
        return jsonify({ "summary": summary }), response.status_code
    else:
        return jsonify({"error": "Failed to fetch Wikipedia summary"}), response.status_code
