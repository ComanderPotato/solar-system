from skyfield import elementslib
from skyfield.framelib import ecliptic_frame
from skyfield.data.spice import inertial_frames
import numpy as np
from .get_ecliptic_position_and_velocity import get_ecliptic_position_and_velocity
rotX90 = np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]])
import numpy as np

rotX90 = np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]])
def get_ecliptic_position_and_velocity(planet_at):
    frame = planet_at.frame_xyz_and_velocity(ecliptic_frame)
    # position = frame[0].m
    # velocity = frame[1].m_per_s
    
    position = rotX90 @ frame[0].m
    velocity = rotX90 @ frame[1].m_per_s
    return [position, velocity]

def get_orbital_parameters(planet_at):
    position = planet_at.position.m
    position = planet_at.frame_xyz(ecliptic_frame)
    # position = rotX90 @ planet_at.position.m
    position, velocity = get_ecliptic_position_and_velocity(planet_at=planet_at)
    orbital_parameters = elementslib.osculating_elements_of(position=planet_at, reference_frame=inertial_frames['ECLIPJ2000'])
    orbital_parameters_dict = {
        "Position": position.tolist(),
        "DistanceFromPrimary": np.linalg.norm(position),
        # "Velocity": planet_at.velocity.m_per_s.tolist(),
        # "Velocity": velocity.tolist(),
        "Velocity": velocity.tolist(),
        "ApoapsisDistance": orbital_parameters.apoapsis_distance.m,
        "ArgumentOfLatitude": orbital_parameters.argument_of_latitude.radians,
        "ArgumentOfPeriapsis": orbital_parameters.argument_of_periapsis.radians,
        "EccentricAnomaly": orbital_parameters.eccentric_anomaly.radians,
        "Eccentricity": orbital_parameters.eccentricity,
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
        "TrueLongitude": orbital_parameters.true_longitude.radians
    }
    return orbital_parameters_dict

# from skyfield import elementslib
# import numpy as np
# from .get_ecliptic_position_and_velocity import get_ecliptic_position_and_velocity
# rotX90 = np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]])
# def get_orbital_parameters(planet_at):
#     orbital_parameters = elementslib.osculating_elements_of(position=planet_at)
    
#     # position = rotX90 @ planet_at.position.m
#     position, velocity = get_ecliptic_position_and_velocity(planet_at=planet_at)
#     # velocity = rotX90 @ planet_at.velocity.m_per_s
    
#     orbital_parameters_dict = {
#         "Position": position.tolist(),
#         # Need distance from actual sun since its not at (0, 0, 0)
#         "DistanceFromPrimary": np.linalg.norm(position),
#         # "Velocity": planet_at.velocity.m_per_s.tolist(),
#         "Velocity": velocity.tolist(),
#         # "Velocity": velocity.tolist(),
#         "ApoapsisDistance": orbital_parameters.apoapsis_distance.m,
#         "ArgumentOfLatitude": orbital_parameters.argument_of_latitude.radians,
#         "ArgumentOfPeriapsis": orbital_parameters.argument_of_periapsis.radians,
#         "EccentricAnomaly": orbital_parameters.eccentric_anomaly.radians,
#         "Eccentricity": orbital_parameters.eccentricity,
#         "Inclination": orbital_parameters.inclination.radians,
#         "LongitudeOfAscendingNode": orbital_parameters.longitude_of_ascending_node.radians,
#         "LongitudeOfPeriapsis": orbital_parameters.longitude_of_periapsis.radians,
#         "MeanAnomaly": orbital_parameters.mean_anomaly.radians,
#         "MeanLongitude": orbital_parameters.mean_longitude.radians,
#         "MeanMotionPerDay": orbital_parameters.mean_motion_per_day.radians,
#         "PeriapsisDistance": orbital_parameters.periapsis_distance.m,
#         "PeriapsisTime": orbital_parameters.periapsis_time.tt,
#         "PeriodInDays": orbital_parameters.period_in_days,
#         "SemiLatusRectum": orbital_parameters.semi_latus_rectum.m,
#         "SemiMajorAxis": orbital_parameters.semi_major_axis.m,
#         "SemiMinorAxis": orbital_parameters.semi_minor_axis.m,
#         "TrueAnomaly": orbital_parameters.true_anomaly.radians,
#         "TrueLongitude": orbital_parameters.true_longitude.radians
#     }
#     return orbital_parameters_dict

