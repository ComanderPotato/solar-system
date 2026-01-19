from datetime import datetime
from typing import Protocol, Any


class OrbitalObject(Protocol):
    def at(self, time: datetime) -> Any: ...


class Ephemeris(Protocol):
    def comments(self) -> str: ...
    def decode(self, code: str | int) -> str: ...
    def __getitem__(self, code: str | int) -> OrbitalObject: ...


class Unit(Protocol):
    m: int
    radians: int
    tt: int


class OsculatingElements(Protocol):
    apoapsis_distance: Unit
    argument_of_latitude: Unit
    argument_of_periapsis: Unit
    eccentric_anomaly: Unit
    eccentricity: Unit
    inclination: Unit
    longitude_of_ascending_node: Unit
    longitude_of_periapsis: Unit
    mean_anomaly: Unit
    mean_longitude: Unit
    mean_motion_per_day: Unit
    periapsis_distance: Unit
    periapsis_time: Unit
    period_in_days: Unit
    semi_latus_rectum: Unit
    semi_major_axis: Unit
    semi_minor_axis: Unit
    true_anomaly: Unit
    true_longitude: Unit
