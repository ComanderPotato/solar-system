from typing import Optional, List
from pydantic import BaseModel

class Mass(BaseModel):
    massValue: float
    massExponent: float

class Volume(BaseModel):
    volValue: float
    volExponent: float

class AroundPlanet(BaseModel):
    planet: str

class Moon(BaseModel):
    moon: str

class PhysicalParameters(BaseModel):
    id: str
    name: str
    englishName: str
    mass: Optional[Mass]
    vol: Optional[Volume]
    aroundPlanet: Optional[AroundPlanet]
    moons: Optional[List[Moon]]
    density: float
    gravity: float
    escape: float
    meanRadius: float
    equaRadius: float
    polarRadius: float
    flattening: float
    axialTilt: float
    avgTemp: float
    sideralRotation: float
    bodyType: str
