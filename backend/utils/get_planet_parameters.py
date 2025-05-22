import json
import os

from .time import CURRENT_TIME, CURRENT_TIME_SCALE
from .get_orbital_information import get_orbital_parameters
from .constants import LOAD, PLANETS_LIST


def get_planet_parameters():
    planets_dict = {}
    planets_ephermeris = LOAD("de432s.bsp")
    SOLAR_SYSTEM_BARYCENTER = planets_ephermeris["sun"]
    t = CURRENT_TIME_SCALE
    for planet in PLANETS_LIST:
        # print(planet)
        try:
            planets_dict[planet] = get_orbital_parameters(
                SOLAR_SYSTEM_BARYCENTER.at(CURRENT_TIME_SCALE).observe(
                    planets_ephermeris[planet]
                )
            )
        except:
            # Later integrate not the barycenter
            # for ephemeris in os.listdir(os.path.join(LOAD.directory, planet.lower())):
            planets_dict[planet] = get_orbital_parameters(
                SOLAR_SYSTEM_BARYCENTER.at(CURRENT_TIME_SCALE).observe(
                    planets_ephermeris[f"{planet} barycenter"]
                )
            )
            # print(ephemeris)
            # path = os.path.join(planet.lower(), ephemeris)
            # ephemeris = LOAD(path)
            # planets_dict[planet] = get_orbital_parameters(SOLAR_SYSTEM_BARYCENTER.at(CURRENT_TIME_SCALE).observe(ephemeris[planet]))
    # print(json.dumps(planets_dict))
    data = json.dumps(planets_dict)
    # print(data)
    return data
