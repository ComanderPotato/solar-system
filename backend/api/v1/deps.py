from multiprocessing import AuthenticationError
from typing import Annotated, TypedDict

from fastapi import Depends
from pydantic import BaseModel
from backend.schemas.physical import PhysicalResponse


API_INCLUDE_DATA: list[str] = [
    "id",
    "name",
    "englishName",
    "massValue",
    "" "massExponent",
    "mass",
    "volValue",
    "" "volExponent",
    "vol",
    "planet",
    "aroundPlanet",
    "moon",
    "rel",
    "moons",
    "density",
    "gravity",
    "sideralOrbit",
    "escape",
    "meanRadius",
    "equaRadius",
    "polarRadius",
    "flattening",
    "axialTilt",
    "sideralRotation",
    "avgTemp",
    "bodyType",
]

base_url = "https://api.le-systeme-solaire.net/rest/bodies"


class PhysicalDependencies:
    def __init__(self) -> None:
        self.include_data = API_INCLUDE_DATA
        self.base_url = base_url


API_KEY = "b09527f7-d52f-4d9c-8d83-ba33c1ba58ce"
auth = {"Authorization": f"Bearer {API_KEY}"}


class AuthDependency:
    def __init__(self) -> None:
        self.authorisation = auth


AuthDep = Annotated[AuthDependency, Depends(AuthDependency)]


PhysicalDeps = Annotated[PhysicalDependencies, Depends(PhysicalDependencies)]
