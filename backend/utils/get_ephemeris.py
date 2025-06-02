from .constants import PLANET_NATURAL_SATELLITE_DICT, LOAD
from .build_excerpt import build_excerpt
from tqdm import tqdm
import os

def get_ephemeris():
    for planet in tqdm(PLANET_NATURAL_SATELLITE_DICT):
        natural_satellite_dict = PLANET_NATURAL_SATELLITE_DICT[planet]
        for url in natural_satellite_dict["moon_kernels"]:
            out_dir = "/".join(["./backend/temp_ephemeris", natural_satellite_dict["folder"]])
            if not os.path.exists(out_dir):
                os.makedirs(out_dir)

            file_name = url.split("/")[-1].replace(".", "_excerpt.")
            output_path = "/".join([out_dir, file_name])
            file_location = os.path.join(natural_satellite_dict['folder'], file_name)
            # if not LOAD.exists(file_location) or LOAD.days_old(file_location) >= 7:
            build_excerpt(url, output_path)