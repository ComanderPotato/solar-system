from pydantic import BaseModel, RootModel


class Orbital(BaseModel):
    Position: tuple[float, float, float]
    DistanceFromPrimary: float
    Velocity: tuple[float, float, float]
    ApoapsisDistance: float
    ArgumentOfLatitude: float
    ArgumentOfPeriapsis: float
    EccentricAnomaly: float
    OrbitalEccentricity: float
    Inclination: float
    LongitudeOfAscendingNode: float
    LongitudeOfPeriapsis: float
    MeanAnomaly: float
    MeanLongitude: float
    MeanMotionPerDay: float
    PeriapsisDistance: float
    PeriapsisTime: float
    PeriodInDays: float
    SemiLatusRectum: float
    SemiMajorAxis: float
    SemiMinorAxis: float
    TrueAnomaly: float
    TrueLongitude: float


class OrbitalSystem(RootModel):
    root: dict[str, Orbital] | None
