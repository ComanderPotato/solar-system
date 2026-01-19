import subprocess
import os
import math
import time
import ssl
import certifi
from tqdm import tqdm
from pathlib import Path
from .time import CURRENT_TIME, get_stop_time, format_time
from .constants import PLANET_NATURAL_SATELLITE_DICT

FILE_MAX_AGE = 26
ssl_context = ssl.create_default_context(cafile=certifi.where())


def load_kernel():
    BASE_DIR = Path(__file__).resolve().parents[1]
    for planet in tqdm(PLANET_NATURAL_SATELLITE_DICT):
        natural_satellite_dict = PLANET_NATURAL_SATELLITE_DICT[planet]
        for url in natural_satellite_dict["moon_kernels"]:
            # print(Path(__package__))
            out_dir = BASE_DIR / "db" / "ephemeris" / natural_satellite_dict["folder"]

            if not os.path.exists(out_dir):
                os.makedirs(out_dir)

            file_name = url.split("/")[-1].replace(".", "_excerpt.")

            out_path = out_dir / file_name
            if os.path.exists(out_path):
                stat = os.stat(out_path)
                modified = stat.st_mtime

                days_since_modified = math.floor((time.time() - modified) / 86400 / 7)

                diff = FILE_MAX_AGE - days_since_modified
                if diff < 4:
                    os.remove(out_path)

            if not os.path.exists(out_path):
                build_excerpt(url, out_path.__str__())


def build_excerpt(url: str, output_path: str):
    START_DATE = format_time(CURRENT_TIME)
    END_DATE = format_time(get_stop_time(weeks=FILE_MAX_AGE))
    # python -m jplephem excerpt --targets 1,2,3 2018/1/1 2018/4/1 de421.bsp excerpt421.bsp
    # def run_subprocess():
    env = os.environ.copy()
    env["SSL_CERT_FILE"] = certifi.where()
    subprocess.run(
        [
            "python",
            "-m",
            "jplephem",
            "excerpt",
            START_DATE,
            END_DATE,
            url,
            output_path,
        ],
        env=env,
    )

    # executor.submit(run_subprocess)

    # return path
