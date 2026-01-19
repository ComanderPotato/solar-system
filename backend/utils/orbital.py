import os
from typing import cast
from datetime import datetime

from .orbital_information import get_orbital_parameters
from .naif_code import find_naif_code
from .types import Ephemeris
from ..db import LOAD, INITIAL_EPHEMERIS, orbital_mapping


def load_ephemeris(path: str) -> Ephemeris:
    return cast(Ephemeris, LOAD(path))


def get_orbitals(primary_name: str, secondary_names: list[str], time: datetime):
    unresolved_secondaries = set(secondary_names)
    primary_path = os.path.join(LOAD.directory, primary_name.lower())
    ephemeris_files = [INITIAL_EPHEMERIS]
    if os.path.exists(primary_path):
        ephemeris_path = os.path.join(LOAD.directory, primary_name.lower())
        ephemeris_files += [
            os.path.join(primary_name, ephemeris_file)
            for ephemeris_file in os.listdir(ephemeris_path)
        ]
    else:
        for secondary_name in secondary_names:
            ephemeris_path = os.path.join(LOAD.directory, secondary_name.lower())
            if os.path.exists(ephemeris_path):
                ephemeris_files += [
                    os.path.join(secondary_name.lower(), ephemeris_file)
                    for ephemeris_file in os.listdir(ephemeris_path)
                ]

    orbital_dict = {}
    primary_code = None
    for ephemeris_file in ephemeris_files:

        # ephemeris = LOAD(ephemeris_file)
        # ephemeris = cast(Ephemeris, LOAD(ephemeris_file))
        ephemeris = load_ephemeris(ephemeris_file)

        # with open(ephemeris_file.__str__(), "w") as f:
        #     f.write(ephemeris.comments())
        # except:
        #     print(ephemeris_file)
        comments = ephemeris.comments()
        if primary_code is None:
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
            else:
                try:
                    orbital_dict[secondary_name] = get_orbital_parameters(
                        ephemeris[primary_code]
                        .at(time)
                        .observe(ephemeris[secondary_code])
                    )

                    orbital_mapping[secondary_code] = {
                        "primary_code": int(primary_code),
                        "path": ephemeris_file,
                    }
                    unresolved_secondaries.remove(secondary_name)
                except:
                    continue
    return orbital_dict
