import numpy as np
from typing import cast
from skyfield import elementslib
from skyfield.framelib import ecliptic_frame
from skyfield.data.spice import inertial_frames


from .position import get_ecliptic_position_and_velocity
from .types import OsculatingElements


def load_osculating_elements(planet_at) -> OsculatingElements:
    return cast(
        OsculatingElements,
        elementslib.osculating_elements_of(
            position=planet_at, reference_frame=inertial_frames["ECLIPJ2000"]
        ),
    )


def get_orbital_parameters(planet_at):
    position = planet_at.position.m
    position = planet_at.frame_xyz(ecliptic_frame)
    position, velocity = get_ecliptic_position_and_velocity(planet_at=planet_at)
    orbital_parameters = load_osculating_elements(planet_at)
    orbital_parameters_dict = {
        "Position": position.tolist(),
        "DistanceFromPrimary": np.linalg.norm(position),
        "Velocity": velocity.tolist(),
        "ApoapsisDistance": orbital_parameters.apoapsis_distance.m,
        "ArgumentOfLatitude": orbital_parameters.argument_of_latitude.radians,
        "ArgumentOfPeriapsis": orbital_parameters.argument_of_periapsis.radians,
        "EccentricAnomaly": orbital_parameters.eccentric_anomaly.radians,
        "OrbitalEccentricity": orbital_parameters.eccentricity,
        "Inclination": orbital_parameters.inclination.radians,
        "LongitudeOfAscendingNode": orbital_parameters.longitude_of_ascending_node.radians,
        "LongitudeOfPeriapsis": orbital_parameters.longitude_of_periapsis.radians,
        "MeanAnomaly": orbital_parameters.mean_anomaly.radians,
        "MeanLongitude": orbital_parameters.mean_longitude.radians,
        "MeanMotionPerDay": orbital_parameters.mean_motion_per_day.radians,
        "PeriapsisDistance": orbital_parameters.periapsis_distance.m,
        "PeriapsisTime": orbital_parameters.periapsis_time.tt,
        "PeriodInDays": orbital_parameters.period_in_days,
        "SemiLatusRectum": orbital_parameters.semi_latus_rectum.m,
        "SemiMajorAxis": orbital_parameters.semi_major_axis.m,
        "SemiMinorAxis": orbital_parameters.semi_minor_axis.m,
        "TrueAnomaly": orbital_parameters.true_anomaly.radians,
        "TrueLongitude": orbital_parameters.true_longitude.radians,
    }
    return orbital_parameters_dict
    # return Orbital.model_validate(**orbital_parameters_dict)
