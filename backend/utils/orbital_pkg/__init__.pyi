from datetime import datetime
from typing import Protocol, Any

class OrbitalObject(Protocol):
    def at(self, time: datetime) -> Any:
        pass

class Ephemeris(Protocol):
    def comments(self) -> str:
        pass

    def decode(self, code: str | int) -> str:
        pass

    def __getitem__(self, code: str | int) -> OrbitalObject:
        pass

__all__ = ["Ephemeris"]
