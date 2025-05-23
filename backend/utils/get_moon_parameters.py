import json
import os
from .constants import LOAD, PLANETS_LIST
from .time import CURRENT_TIME, CURRENT_TIME_SCALE
from .get_orbital_information import get_orbital_parameters
from .find_body_code import find_naif_code
# def get_moon_parameters(planet_name: str, moon_list: list[str]): 
#     moon_dict = {}
#     ephemeris_path = os.path.join(LOAD.directory, planet_name)

#     PLANET_BARYCENTER = None
#     t = CURRENT_TIME_SCALE
#     # if planet_name.lower() == "earth":

#     print(moon_list)
#     for ephemeris_file in os.listdir(ephemeris_path):
#         ephemeris = LOAD(os.path.join(planet_name, ephemeris_file))
#         # print(ephemeris)
#         # PLANET_BARYCENTER = ephemeris[f"{planet_name} barycenter"]
#         PLANET_BARYCENTER = ephemeris[planet_name]
#         for moon in moon_list:
#             print(ephemeris_file, moon)
#             try:
#                 moon_dict[moon] = get_orbital_parameters(PLANET_BARYCENTER.at(CURRENT_TIME_SCALE).observe(ephemeris[moon]))
#                 break
#             except:
#                 continue
#     data = json.dumps(moon_dict)
#     return data

def get_moon_parameters(planet_name: str, moon_list: list[str]): 
    moon_dict = {}
    unresolved_moons = set(moon_list)  # Track which moons we still need

    if planet_name.lower() == "earth":
        try:
            # Load de432s for Earth-Moon system
            ephemeris = LOAD('de432s.bsp')
            PLANET_BARYCENTER = ephemeris['earth']
            for moon in list(unresolved_moons):
                moon_key = moon.replace(" ", "_")
                try:
                    observation = PLANET_BARYCENTER.at(CURRENT_TIME_SCALE).observe(ephemeris[moon_key])
                    moon_dict[moon] = get_orbital_parameters(observation)
                    unresolved_moons.remove(moon)
                except:
                    continue
        except:
            print("Failed to load de432s.bsp")
    
    else:
        ephemeris_path = os.path.join(LOAD.directory, planet_name)

        for ephemeris_file in os.listdir(ephemeris_path):
            ephemeris = LOAD(os.path.join(planet_name, ephemeris_file))
            # print(ephemeris.names())
            try:
                PLANET_BARYCENTER = ephemeris[planet_name]
            except:
                continue

            for moon in list(unresolved_moons):
                body_code = find_naif_code(ephemeris.comments(), moon)
                # moon_key = moon.replace(" ", "_")
                if body_code == None: continue
                try:
                    observation = PLANET_BARYCENTER.at(CURRENT_TIME_SCALE).observe(ephemeris[body_code])
                    moon_dict[moon] = get_orbital_parameters(observation)
                    unresolved_moons.remove(moon)
                except:
                    continue
    return json.dumps(moon_dict)
