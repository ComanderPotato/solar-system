import subprocess
import os
import multiprocessing
import concurrent.futures
from datetime import datetime
from .constants import LOAD
from .time import CURRENT_TIME, get_stop_time, format_time

# def build_excerpt(url: str):
#     path = "/".join([LOAD.directory, url.split("/")[-1].replace(".", "_excerpt.")])
#     print(path)
#     CURRENT_DATE = CURRENT_TIME.utc
#     CURRENT_YEAR = CURRENT_DATE[0]
#     CURRENT_MONTH = CURRENT_DATE[1]
#     CURRENT_DAY = CURRENT_DATE[2]
#     START_DATE = f"{CURRENT_YEAR}/{CURRENT_MONTH}/{CURRENT_DAY}"
#     STOP_DATE = f"{CURRENT_YEAR}/{CURRENT_MONTH}/{CURRENT_DAY}"
#     current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#     subprocess.run(["python3", "-m", "jplephem", "excerpt", START_DATE, STOP_DATE, url, path])
#     return path

executor = concurrent.futures.ThreadPoolExecutor(max_workers=1000)


def build_excerpt(url: str, output_path: str):
    # file_name = url.split("/")[-1].replace(".", "_excerpt.")
    # path = "/".join([path, file_name])
    START_DATE = format_time(CURRENT_TIME)
    END_DATE = format_time(get_stop_time(days=14))
    # return
    # python -m jplephem excerpt --targets 1,2,3 2018/1/1 2018/4/1 de421.bsp excerpt421.bsp
    def run_subprocess():
        subprocess.run(
            [
                "python3",
                "-m",
                "jplephem",
                "excerpt",
                START_DATE,
                END_DATE,
                url,
                output_path,
            ]
        )

    # Run subprocess in a separate thread
    executor.submit(run_subprocess)

    # return path

