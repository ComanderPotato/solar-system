import json
import os
from pprint import pprint
from .time import CURRENT_TIME, CURRENT_TIME_SCALE
from .get_orbital_information import get_orbital_parameters
from .constants import LOAD, PLANETS_LIST, INITIAL_EPHEMERIS
from .find_body_code import find_naif_code
# IF I USE PRIMARY POSITION TO GET SECONDARY ORBITAL PARAMETERS AS WELL I CAN PROCESS THE POSITIONS IN HERE
# I.E., SECONDARYPOSITION.ADD(PRIMARYPOSITION) MAYBE IDK

# 

def get_orbitals(primary_name: str, secondary_names: list[str]):
    unresolved_secondaries = set(secondary_names)
    primary_path = os.path.join(LOAD.directory, primary_name.lower())
    ephemeris_files = [INITIAL_EPHEMERIS]
    if os.path.exists(primary_path):
        ephemeris_path = os.path.join(LOAD.directory, primary_name.lower())
        ephemeris_files += [os.path.join(primary_name, ephemeris_file) for ephemeris_file in os.listdir(ephemeris_path)]
    else:
        for secondary_name in secondary_names:
            ephemeris_path = os.path.join(LOAD.directory, secondary_name.lower())
            if os.path.exists(ephemeris_path):
                ephemeris_files += [os.path.join(secondary_name.lower(), ephemeris_file) for ephemeris_file in os.listdir(ephemeris_path)]

    orbital_dict = {}
    t = CURRENT_TIME_SCALE
    for ephemeris_file in ephemeris_files:
        try:
            ephemeris = LOAD(ephemeris_file)
        except:
            print(ephemeris_file)
        comments = ephemeris.comments()
        try:
            primary_code = ephemeris.decode(primary_name)
        except:
            primary_code = find_naif_code(comments, primary_name)

        if primary_code == None:
            continue
        # orbital_dict[primary_name] = get_orbital_parameters(ephemeris[primary_code].at(CURRENT_TIME_SCALE))
        for secondary_name in list(unresolved_secondaries):
            try:
                secondary_code = ephemeris.decode(secondary_name)
            except:
                secondary_code = find_naif_code(comments, secondary_name)


            if secondary_code == None:
                continue
            if secondary_code is not None:
                try:
                    orbital_dict[secondary_name] = get_orbital_parameters(ephemeris[primary_code].at(CURRENT_TIME_SCALE).observe(ephemeris[secondary_code]))
                    unresolved_secondaries.remove(secondary_name)
                except:
                    continue
    # import json
    # from pprint import pprint

    # # Assuming orbital_dict is already defined
    # pprint(orbital_dict)  # For console display

    # # Save to JSON file
    # with open("orbital_data.json", "w") as f:
    #     json.dump(orbital_dict, f, indent=4)
    return orbital_dict
