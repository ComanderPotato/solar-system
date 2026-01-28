from pydantic import BaseModel, RootModel
from .orbital import Orbital
from .physical import Physical


class Parameters(BaseModel):
    Orbital: Orbital
    Physical: Physical


class ParametersGroup(RootModel):
    root: dict[str, Parameters] | None
