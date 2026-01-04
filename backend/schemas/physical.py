from pydantic import BaseModel, RootModel
from enum import Enum


class BodyType(str, Enum):
    star = "Star"
    planet = "Planet"
    dwarf_planet = "Dwarf Planet"
    moon = "Moon"


class Moons(BaseModel):
    moon: str
    rel: str


class Volume(BaseModel):
    volValue: float
    volExponent: float


class Mass(BaseModel):
    massValue: float
    massExponent: float


class Physical(BaseModel):
    id: str
    name: str
    englishName: str
    mass: Mass | None
    vol: Volume | None
    moons: list[Moons] | None
    density: float
    gravity: float
    escape: float
    sideralOrbit: float
    meanRadius: float
    equaRadius: float
    polarRadius: float
    flattening: float
    axialTilt: float
    avgTemp: float
    sideralRotation: float
    bodyType: BodyType


class PhysicalAPIResponse(BaseModel):
    bodies: list[Physical] | None


class PhysicalResponse(RootModel[dict[str, Physical]]):
    pass
