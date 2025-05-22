# from .get_orbital_information import get_orbital_parameters
from .constants import NON_MOONS, LOAD, PLANET_NATURAL_SATELLITE_DICT, NaturalSatelliteInfo
from .time import CURRENT_TIME
from .build_excerpt import build_excerpt
import os
def load_moon_data_async():
    # Commented shit went here
    for planet in PLANET_NATURAL_SATELLITE_DICT:
        natural_satellite_dict = PLANET_NATURAL_SATELLITE_DICT[planet]

        for url in natural_satellite_dict["moon_kernels"]:
            out_dir = "/".join([LOAD.directory, natural_satellite_dict["folder"]])
            if not os.path.exists(out_dir):
                os.makedirs(out_dir)

            file_name = url.split("/")[-1].replace(".", "_excerpt.")
            output_path = "/".join([out_dir, file_name])
            file_location = os.path.join(natural_satellite_dict['folder'], file_name)
            if not LOAD.exists(file_location) or LOAD.days_old(file_location) >= 7:
                build_excerpt(url, output_path)
    # for link in moon_dict["moon_kernels"]:
    #     file_name = link.split("/")[-1]
    #     path = ""
    #     if not LOAD.exists(file_name):
    #         # LOAD.download(link, filename=file_name)
    #         path = build_excerpt(link, moon_dict["folder"])  
    #     data = LOAD(path)
    #     moons = {
    #         name[0].title(): {
    #             "Orbital": get_orbital_parameters(
    #                 data[moon_dict["barycenter"]].at(CURRENT_TIME).observe(data[key])
    #             )
    #         }
    #         for key, name in data.names().items() if not any(n in NON_MOONS for n in name)
    #     }
    #     return moons

