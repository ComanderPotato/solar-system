from typing import Annotated
import urllib.parse
from fastapi import APIRouter, HTTPException, Header, Query, Response, status, Depends
from ...schemas import Extract, BodyType
import httpx

BASE_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/"
HEADERS = {"User-Agent": "SolarSystem/1.0 (contact: thomas.r.golding@outlook.com)"}

router = APIRouter(prefix="/summary", tags=["Summary"])


async def get_api_response(url: str) -> httpx.Response:
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=HEADERS)

    try:
        return response
    except ValueError:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"External API returned invalid JSON. Status={response.status_code}",
        )


async def user_agent(user_agent: Annotated[str, Header()]):
    return user_agent


@router.get("/celestial", response_model=Extract, status_code=status.HTTP_200_OK)
async def retrieve_celestial_summary(
    celestial_name: Annotated[str, Query()],
    body_type: Annotated[BodyType, Query()],
    # user_agent: Annotated[dict, Depends(user_agent)],
):
    celestial_name = celestial_name.replace(" ", "_")
    # celestial_name = urllib.parse.quote(celestial_name.lower())

    end_point = f"{BASE_URL}{celestial_name}_({body_type.lower()})"
    response = await get_api_response(end_point)

    if response.is_error:
        end_point = f"{BASE_URL}{celestial_name}"
        response = await get_api_response(end_point)
    if response.is_success:
        payload = response.json()
        return Extract.model_validate(payload)
    else:
        return {
            "extract": "Some celestial bodies just don't have much information about them... You happened to click one that didn't :("
        }


@router.get("/parameter", response_model=Extract, status_code=status.HTTP_200_OK)
async def retrieve_parameter_summary(
    parameter_name: Annotated[str, Query()],
):
    processed_parameter = parameter_name.replace(" ", "_")
    end_point = f"{BASE_URL}{processed_parameter}"
    response = await get_api_response(end_point)

    if response.is_success:
        payload = response.json()
        return Extract.model_validate(payload)
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
