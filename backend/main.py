from pathlib import Path
from typing import Annotated
from dotenv import load_dotenv
from .utils.time import get_sim_time_scale
from .api.v1.deps import PhysicalDependencies, PhysicalDeps
from .api.v1.parameters import (
    Filter,
    FilterBy,
    get_authorisation,
    retrieve_orbital_parameters,
    retrieve_physical_parameters,
    retrieve_physical_parameters_by,
    retrieve_moon_physical_parameters_by,
)
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .utils.kernel_loader import load_kernel
from .api.v1 import router

load_dotenv()

app = FastAPI()

app.include_router(router)
ROOT_DIR = Path(__file__).resolve().parent
app.mount("/", StaticFiles(directory=ROOT_DIR / "public", html=True), name="/")

from fastapi import HTTPException, Path
import httpx


async def get_api_response(url: str, parameters: dict) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=parameters)

    try:
        return response.json()
    except ValueError:
        raise HTTPException(
            status_code=502,
            detail=f"External API returned invalid JSON. Status={response.status_code}",
        )


# @app.get("/{value}")
# async def target(
#     value: Annotated[str, Path()],
# ):
#
#     return value
#     # response = await get_api_response(
#     #     f"./rest/v1/parameters/physical/{value}", {"filter": "id"}
#     # )
#     # return response


# @app.get("/")
# async def home():
#
#     # load_kernel()
#     # return {"HJello": "ASWD"}
#     auth = await get_authorisation()
#     deps = PhysicalDependencies()
#     primary = "saturn"
#     result = await retrieve_physical_parameters_by(
#         primary, Filter.EnglishName, auth, deps
#     )
#     moon_results = await retrieve_moon_physical_parameters_by(
#         result.id, Filter.Id, auth, deps
#     )
#
#     moon_orbital = retrieve_orbital_parameters(
#         primary, [m.englishName for m in moon_results.bodies], get_sim_time_scale()
#     )
#     # # moons = []
#     # # for m in result.bodies[0].moons:
#     # #     moons.append(m.moon)
#     # # # moon_names = [m["moon"] for m in result.bodies[0].moons]
#     # moon_names = [m.englishName for m in moon_results.bodies]
#     # orbital = retrieve_orbital_parameters(
#     #     primary, [m.englishName for m in moon_results.bodies], get_sim_time_scale()
#     # )
#     #
#     # a = {
#     #     "Physical count": len(moon_results.bodies),
#     #     "Orbital count": len(orbital),
#     #     "Moon id count": len(moon_ids),
#     # }
#     output = []
#     for physical in moon_results.bodies:
#         if moon_orbital.get(physical.englishName) is None:
#             continue
#         r = {
#             physical.englishName: {
#                 "Physical": physical,
#                 "Orbital": moon_orbital[physical.englishName],
#             }
#         }
#         output.append(r)
#
#     return output
#     missing = {
#         "physical moon count": len(moon_results.bodies),
#         "orbital moon count": len(moon_orbital),
#     }
#     for moon in moon_results.bodies:
#         if moon_orbital.get(moon.englishName) is None:
#             missing[moon.englishName] = True
#     return missing
#     return {
#         "physical moon count": len(moon_results.bodies),
#         "orbital moon count": len(moon_orbital),
#     }
#     return {"count": len(orbital)}
#     return orbital
#     print("Hello")
#
#     # return StaticFiles.get_path(".", scope=Scope.values)
#
