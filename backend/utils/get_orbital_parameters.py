import json
import os

from .time import CURRENT_TIME, CURRENT_TIME_SCALE
from .get_orbital_information import get_orbital_parameters
from .constants import LOAD, PLANETS_LIST, INITIAL_EPHEMERIS
from .find_body_code import find_naif_code
# IF I USE PRIMARY POSITION TO GET SECONDARY ORBITAL PARAMETERS AS WELL I CAN PROCESS THE POSITIONS IN HERE
# I.E., SECONDARYPOSITION.ADD(PRIMARYPOSITION) MAYBE IDK

# 

def get_orbital_parameters_temp(primary_name: str, secondary_names: list[str]):
    index = 0
    ephemeris_files = [INITIAL_EPHEMERIS] + os.listdir(os.path.join(LOAD.directory, primary_name.lower()))
    # ephemeris = LOAD(ephemeris_files[index])


    orbital_dict = {}
    t = CURRENT_TIME_SCALE
    
    for ephemeris_file in ephemeris_files:
        ephemeris = LOAD(ephemeris_file)
        comments = ephemeris.comments()
        primary_code = find_naif_code(comments, primary_name)
        if primary_code == None: continue
        
        for secondary_name in secondary_names:
            secondary_code = find_naif_code(comments, secondary_name)

            if secondary_code is not None:
                orbital_dict[secondary_name] = get_orbital_parameters(ephemeris[primary_code].at(CURRENT_TIME_SCALE).observe(ephemeris[secondary_code]))

    data = json.dumps(orbital_dict)
    return data
