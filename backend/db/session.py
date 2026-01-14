from typing import Dict, TypedDict
from pathlib import Path
from skyfield.api import Loader

script_dir = Path(__file__).resolve().parent

LOAD: Loader = Loader(script_dir / "ephemeris")
INITIAL_EPHEMERIS = "de432s.bsp"


class OrbitalMapping(TypedDict):
    primary_code: int | str
    path: str


orbital_mapping: Dict[int | str, OrbitalMapping] = {}
