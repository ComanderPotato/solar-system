import numpy as np
from skyfield.framelib import ecliptic_frame

rotX90 = np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]])
def get_ecliptic_position_and_velocity(planet_at):
    frame = planet_at.frame_xyz_and_velocity(ecliptic_frame)
    position = rotX90 @ frame[0].m
    velocity = rotX90 @ frame[1].m_per_s
    return [position, velocity]