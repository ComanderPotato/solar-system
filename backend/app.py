import requests
from flask import Flask, send_file, request, jsonify
from backend.utils.load_moon_data_async import load_moon_data_async
from backend.utils.get_orbital_parameters import get_orbitals
import urllib.parse

app = Flask(__name__, static_folder="../frontend/dist/", static_url_path="/")

YOUR_API_TOKEN = "10fdf93f-65c0-49bc-83d4-c8725c9e0ea7"
auth = {"Authorization": f"Bearer {YOUR_API_TOKEN}"}
API_INCLUDE_DATA: list[str] = [
    "id",
    "name",
    "englishName",
    "massValue",
    "" "massExponent",
    "mass",
    "volValue",
    "" "volExponent",
    "vol",
    "planet",
    "aroundPlanet",
    "moon",
    "rel",
    "moons",
    "density",
    "gravity",
    "sideralOrbit",
    "escape",
    "meanRadius",
    "equaRadius",
    "polarRadius",
    "flattening",
    "axialTilt",
    "sideralRotation",
    "avgTemp",
    "bodyType",
]

session = requests.session()
session.headers.update(
    {"User-Agent": "WikiSummary/1.0 (https://github.com/ComanderPotato/solar-system)"}
)


@app.route("/")
async def home():
    # return send_file('index.html')
    return send_file("./static/src/index.html")
    # return send_file("index.html")


# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=80, use_reloader=True)


@app.route("/api/rest/parameters/orbital", methods=["POST"])
def orbital():
    data = request.get_json()
    primary_name = data.get("primaryName")
    secondary_names = data.get("secondaryNames")
    if not primary_name or not secondary_names:
        return jsonify({"error": "No primary name or secondary names provided"}), 400
    json = get_orbitals(primary_name, secondary_names)
    return jsonify(json)


@app.route("/api/rest/parameters/physical", methods=["POST"])
def physical():
    data = request.get_json()
    body_names = data.get("bodyNames", [])
    filter_by = data.get("filterBy", "englishName")

    if not body_names:
        return jsonify({"error": "No bodyNames provided"}), 400

    base_url = "https://api.le-systeme-solaire.net/rest/bodies"
    filters = "&".join([f"filter[]={filter_by},eq,{name}" for name in body_names])
    include_data = ",".join(API_INCLUDE_DATA)
    full_url = f"{base_url}?data={include_data}&{filters}&satisfy=any"
    try:
        response = session.get(full_url, headers=auth)
        response.raise_for_status()
        data = response.json()

        if "bodies" in data:
            result = {body["englishName"]: body for body in data["bodies"]}
        else:
            result = {}
        return jsonify(result), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/rest/summary/celestial", methods=["POST"])
def temp_celestial_summary():

    data = request.get_json()
    planet_name = data.get("planetName", "")
    body_type = data.get("bodyType", "")
    if not planet_name or not body_type:
        return jsonify({"error": "No planet name or body type provided"}), 400

    planet_name = urllib.parse.quote(planet_name)
    base_url = "https://en.wikipedia.org/api/rest_v1/page/summary/"
    headers = {
        "User-Agent": "CelestialSummaryBot/1.0 (https://github.com/tomgolding/celestial)"
    }
    first_attempt = f"{base_url}{planet_name}_({body_type.lower()})"
    response = session.get(first_attempt, headers=headers)

    if (
        response.status_code == 404
        or response.status_code == 400
        or response.status_code == 403
    ):
        fallback_url = f"{base_url}{planet_name}"
        response = session.get(fallback_url, headers=headers)
    if response.ok:

        data = response.json()
        summary = data.get("extract", "No summary available.")
        return jsonify({"summary": summary}), response.status_code
    else:

        return (
            jsonify(
                {
                    "summary": "Some celestial bodies just don't have much information about them... You happened to click one that didn't :("
                }
            ),
            response.status_code,
        )


@app.route("/api/rest/summary/parameter", methods=["POST"])
def temp_parameter_summary():
    data = request.get_json()
    parameter_name: str = data.get("parameterName", "")

    if not parameter_name:
        return jsonify({"error": "No parameter name"}), 400

    # planet_name = urllib.parse.quote(planet_name)
    processed_parameter = parameter_name.replace(" ", "_")
    base_url = "https://en.wikipedia.org/api/rest_v1/page/summary/"

    end_point = f"{base_url}{processed_parameter}"
    response = session.get(end_point, headers=auth)

    if response.ok:
        data = response.json()
        summary = data.get("extract", "No summary available.")
        return jsonify({"summary": summary}), response.status_code
    else:
        return (
            jsonify({"error": "Failed to fetch Wikipedia summary"}),
            response.status_code,
        )
