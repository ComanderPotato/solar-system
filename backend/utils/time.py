from skyfield.api import load, Time
from tzlocal import get_localzone
from datetime import datetime, timedelta
LOCAL_TIMEZONE = get_localzone()  
CURRENT_TIME: datetime = datetime.now().astimezone(LOCAL_TIMEZONE)
TIME_SCALE = load.timescale()
CURRENT_TIME_SCALE: Time = TIME_SCALE.from_datetime(CURRENT_TIME)

def get_stop_time(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0, hours=0, weeks=0):
    return CURRENT_TIME + timedelta(days=days, seconds=seconds, microseconds=microseconds, milliseconds=milliseconds, minutes=minutes, hours=hours, weeks=weeks)

def format_time(time: datetime, format: str = '%Y/%m/%d'):
    return time.strftime(format=format)

