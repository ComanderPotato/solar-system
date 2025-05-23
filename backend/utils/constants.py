from typing import TypedDict, List, Dict
from skyfield.api import Loader

LOAD = Loader("./static/src/data/ephemeris")
# ts = LOAD.timescale()
INITIAL_EPHEMERIS = "de432s.bsp"

PLANETS_LIST = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
]

MILKY_WAY_PLANETS_URL = (
    "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de432s.bsp"
)
NON_MOONS = [
    "SOLAR SYSTEM BARYCENTER",
    "SUN",
    "MERCURY",
    "VENUS",
    "EARTH",
    "MARS",
    "JUPITER",
    "SATURN",
    "URANUS",
    "NEPTUNE",
    "PLUTO",
    "EARTH BARYCENTER",
    "MARS BARYCENTER",
    "JUPITER BARYCENTER",
    "SATURN BARYCENTER",
    "URANUS BARYCENTER",
    "NEPTUNE BARYCENTER",
    "PLUTO BARYCENTER",
]


class NaturalSatelliteInfo(TypedDict):
    barycenter: str
    folder: str
    moon_kernels: List[str]


JUPITERS_NATURAL_SATELLITES: NaturalSatelliteInfo = {
    "barycenter": "JUPITER_BARYCENTER",
    "folder": "jupiter",
    "moon_kernels": [
        # "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/jup344.bsp",
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/jup347.bsp",
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/jup365.bsp",
    ],
}
MARS_NATURAL_SATELLITES: NaturalSatelliteInfo = {
    "barycenter": "MARS_BARYCENTER",
    "folder": "mars",
    "moon_kernels": [
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/mar097.bsp",
    ],
}
NEPTUNES_NATURAL_SATELLITES: NaturalSatelliteInfo = {
    "barycenter": "NEPTUNE_BARYCENTER",
    "folder": "neptune",
    "moon_kernels": [
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/nep095.bsp",
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/nep104.bsp",
    ],
}
PLUTOS_NATURAL_SATELLITES: NaturalSatelliteInfo = {
    "barycenter": "PLUTO_BARYCENTER",
    "folder": "pluto",
    "moon_kernels": [
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/plu060.bsp",
    ],
}
SATURNS_NATURAL_SATELLITES: NaturalSatelliteInfo = {
    "barycenter": "SATURN_BARYCENTER",
    "folder": "saturn",
    "moon_kernels": [
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/sat415.bsp",
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/sat441.bsp",
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/sat454.bsp",
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/sat455.bsp",
    ],
}
URANUS_NATURAL_SATELLITES: NaturalSatelliteInfo = {
    "barycenter": "URANUS_BARYCENTER",
    "folder": "uranus",
    "moon_kernels": [
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/ura115.bsp",
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/ura117.bsp",
        "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/ura182.bsp",
    ],
}


PLANET_NATURAL_SATELLITE_DICT: Dict[str, NaturalSatelliteInfo] = {
    "Jupiter": JUPITERS_NATURAL_SATELLITES,
    "Mars": MARS_NATURAL_SATELLITES,
    "Neptune": NEPTUNES_NATURAL_SATELLITES,
    "Saturn": SATURNS_NATURAL_SATELLITES,
    "Uranus": URANUS_NATURAL_SATELLITES,
    "Pluto": PLUTOS_NATURAL_SATELLITES,
}

