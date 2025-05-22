from .get_orbital_information import get_orbital_parameters
from .constants import NON_MOONS, LOAD, NaturalSatelliteInfo
from .time import CURRENT_TIME
from .build_excerpt import build_excerpt

def load_and_retrieve_planet_moon_data(moon_dict: NaturalSatelliteInfo):
    # Commented shit went here
    for link in moon_dict["moon_kernels"]:
        file_name = link.split("/")[-1]
        path = ""
        if not LOAD.exists(file_name):
            # LOAD.download(link, filename=file_name)
            path = build_excerpt(link, moon_dict["folder"])  
        data = LOAD(path)
        moons = {
            name[0].title(): {
                "Orbital": get_orbital_parameters(
                    data[moon_dict["barycenter"]].at(CURRENT_TIME).observe(data[key])
                )
            }
            for key, name in data.names().items() if not any(n in NON_MOONS for n in name)
        }
        return moons

# if not load.exists(name) or load.days_old(name) >= max_days:
#     load.download(url, filename=name)
# if isinstance(moon_dict, str):
#     file_name = url.split("/")[-1]
#     print(file_name)
#     if not LOAD.exists(file_name):
#         data = LOAD.download(url, filename=file_name)
# else: