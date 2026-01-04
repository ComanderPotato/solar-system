from typing import cast
from skyfield.api import load, Time
from tzlocal import get_localzone
from datetime import datetime, timedelta
from skyfield.timelib import Timescale

LOCAL_TIMEZONE = get_localzone()
CURRENT_TIME: datetime = datetime.now().astimezone(LOCAL_TIMEZONE)
TIME_SCALE: Timescale = load.timescale()

CURRENT_TIME_SCALE: Time = TIME_SCALE.from_datetime(CURRENT_TIME)


def get_sim_time_scale(sim_time: str | None = None):
    if sim_time is None:
        sim_time = datetime.now().isoformat()
    local_timezone = get_localzone()
    sim_datetime: datetime = datetime.fromisoformat(sim_time).astimezone(local_timezone)
    time_scale: Timescale = load.timescale()
    sim_time_scale: Time = time_scale.from_datetime(sim_datetime)
    return {"sim_time": sim_time_scale}


def get_stop_time(
    days: float = 0,
    seconds: float = 0,
    microseconds: float = 0,
    milliseconds: float = 0,
    minutes: float = 0,
    hours: float = 0,
    weeks: float = 0,
):
    return CURRENT_TIME + timedelta(
        days=days,
        seconds=seconds,
        microseconds=microseconds,
        milliseconds=milliseconds,
        minutes=minutes,
        hours=hours,
        weeks=weeks,
    )


def format_time(time: datetime, format: str = "%Y/%m/%d") -> str:
    return time.strftime(format)
