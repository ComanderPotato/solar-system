import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .api.v1 import router
from fastapi.responses import HTMLResponse, JSONResponse


load_dotenv()

app = FastAPI()

app.include_router(router)
BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public"
# print(PUBLIC_DIR)
# print(os.getcwd())
# path = "."
#
# print(f"\nContents of directory '{path}':")
# # os.listdir() returns a list of names
# contents = os.listdir(path)  #
#
# for item in contents:
#     print(item)
#
#
# print(f"\nContents of directory'{PUBLIC_DIR}':")
# # os.listdir() returns a list of names
# contents = os.listdir(PUBLIC_DIR)  #
#
# for item in contents:
#     print(item)
# app.mount("/", StaticFiles(directory=PUBLIC_DIR, html=True), name="/")
app.mount("/", StaticFiles(directory=PUBLIC_DIR, html=True), name="public")
from fastapi.responses import FileResponse


@app.get("/", include_in_schema=False)
def root():
    return FileResponse(PUBLIC_DIR / "index.html")


@app.get("/app")
async def a():
    __import__("pprint").pprint(app.router.routes)
    return "fart"


# @app.get("/")
# async def home():
#     print(BASE_DIR)
#     return Path("/textures.json").read_text()
# return Path(BASE_DIR / "public" / "index.html").read_text()


# @app.get("/")
# async def home():
#     # return BASE_DIR
#     return Path(BASE_DIR / "public" / "index.html").read_text()


# from fastapi import HTTPException, Path
# import httpx
#
#
# async def get_api_response(url: str, parameters: dict) -> str:
#     async with httpx.AsyncClient() as client:
#         response = await client.get(url, params=parameters)
#
#     try:
#         return response.json()
#     except ValueError:
#         raise HTTPException(
#             status_code=502,
#             detail=f"External API returned invalid JSON. Status={response.status_code}",
#         )
#

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
