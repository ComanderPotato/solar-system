from enum import Enum
from typing import Annotated
from fastapi import APIRouter, Depends, Query, status, HTTPException, Path
import httpx
import os
from ...schemas.orbital import OrbitalSystem

from ...utils.time import get_sim_time_scale
from .deps import PhysicalDependencies, PhysicalDeps
from ...schemas.physical import PhysicalAPIResponse, PhysicalResponse
from ...utils.orbital import get_orbitals
from ...schemas import Physical


router = APIRouter(prefix="/parameters")


def build_url(base: str, filters: str):
    return f"{base}?{filters}&satisfy=any"


async def get_api_response(url: str, authorisation: dict) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=authorisation)

    try:
        return response.json()
    except ValueError:
        raise HTTPException(
            status_code=502,
            detail=f"External API returned invalid JSON. Status={response.status_code}",
        )


@router.get("/orbital", response_model=OrbitalSystem, status_code=status.HTTP_200_OK)
def retrieve_orbital_parameters(
    primary_name: Annotated[str, Query()],
    secondary_names: Annotated[list[str], Query()],
    time: Annotated[dict, Depends(get_sim_time_scale)],
):
    return get_orbitals(primary_name, secondary_names, time["sim_time"])


async def get_authorisation():
    token = os.environ.get("API_KEY")
    if not token:
        raise RuntimeError("API_TOKEN missing")
    return {"Authorization": f"Bearer {token}"}


class FilterBy(str, Enum):
    Custom = "filter[]={},eq,{}"
    AroundPlanet = "filter[]=aroundPlanet,eq,{}"
    Id = "filter[]=id,eq,{}"
    EnglishName = "filter[]=englishName,eq,{}"
    Name = "filter[]=name,eq,{}"


class Filter(str, Enum):
    Id = "Id"
    EnglishName = "EnglishName"
    Name = "Name"


# @router.get(
#     "/{body_name}"
# )
# async def retrieve_all_parameters(
#     body_name: Annotated[str, Path()],
#     authorisation: Annotated[dict, Depends(get_authorisation)],
#     physical_dependencies: PhysicalDeps,
# ):


@router.get(
    "/physical/{value}", response_model=Physical, status_code=status.HTTP_200_OK
)
async def retrieve_physical_parameters_by(
    value: Annotated[str, Path()],
    authorisation: Annotated[dict, Depends(get_authorisation)],
    physical_dependencies: PhysicalDeps,
    filter: Annotated[Filter, Query()] = Filter.EnglishName,
) -> Physical | None:

    return Physical.model_validate(
        await retrieve_physical_parameters_by_value(
            value, filter, authorisation, physical_dependencies
        )
    )


async def retrieve_physical_parameters_by_value(
    value: str,
    filter: Filter,
    authorisation: dict,
    physical_dependencies: PhysicalDependencies,
):
    filter_by = FilterBy[filter.value]
    full_url = build_url(physical_dependencies.base_url, filter_by.format(value))
    payload = await get_api_response(full_url, authorisation)
    physical = PhysicalAPIResponse.model_validate(payload)
    bodies = physical.bodies or []
    if not bodies:
        raise HTTPException(
            status_code=404, detail=f"No body with {filter.value} equals {value} found."
        )

    return bodies[0]


@router.get(
    "/physical", response_model=PhysicalResponse, status_code=status.HTTP_200_OK
)
async def retrieve_physical_parameters(
    body_names: Annotated[list[str], Query()],
    filter_by: Annotated[Filter, Query()],
    authorisation: Annotated[dict, Depends(get_authorisation)],
    physical_dependencies: PhysicalDeps,
):
    if not body_names:
        return PhysicalAPIResponse.model_validate(PhysicalAPIResponse(bodies=[]))

    filter = FilterBy[filter_by]
    filters = "&".join([filter.format(name) for name in body_names])
    print(filters)
    full_url = build_url(physical_dependencies.base_url, filters)
    payload = await get_api_response(full_url, authorisation)
    values = PhysicalAPIResponse.model_validate(payload)

    return PhysicalResponse.model_validate(
        {body.englishName: body for body in values.bodies}
    )
    return PhysicalAPIResponse.model_validate(payload)


@router.get(
    "/physical/{value}/moons",
    response_model=PhysicalResponse,
    status_code=status.HTTP_200_OK,
)
async def retrieve_moon_physical_parameters_by(
    value: Annotated[str, Path()],
    filter_by: Annotated[Filter, Query()],
    authorisation: Annotated[dict, Depends(get_authorisation)],
    physical_dependencies: PhysicalDeps,
):
    id = None
    if filter_by == Filter.Id:
        id = value
    else:
        parent = await retrieve_physical_parameters_by_value(
            value, filter_by, authorisation, physical_dependencies
        )
        id = parent.id

    full_url = build_url(
        physical_dependencies.base_url, FilterBy.AroundPlanet.format(id)
    )
    payload = await get_api_response(full_url, authorisation)
    values = PhysicalAPIResponse.model_validate(payload)

    return PhysicalResponse.model_validate(
        {body.englishName: body for body in values.bodies}
    )
