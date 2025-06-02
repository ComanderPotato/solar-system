import subprocess
import os
import multiprocessing
import concurrent.futures
from datetime import datetime
# from .constants import LOAD
from .time import CURRENT_TIME, get_stop_time, format_time

# executor = concurrent.futures.ThreadPoolExecutor(max_workers=1000)


def build_excerpt(url: str, output_path: str):
    START_DATE = format_time(CURRENT_TIME)
    # START_DATE = "1980/1/1"
    # END_DATE = "2049/12/31"
    END_DATE = format_time(get_stop_time(weeks=26))
    # return
    # python -m jplephem excerpt --targets 1,2,3 2018/1/1 2018/4/1 de421.bsp excerpt421.bsp
    print(url)
    # def run_subprocess():
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
        ]
    )

    # executor.submit(run_subprocess)

    # return path

