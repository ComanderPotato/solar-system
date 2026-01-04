from os import stat
from typing import Annotated
import urllib.parse
import requests
from fastapi import APIRouter, HTTPException, Header, Query, Response, status
from ...schemas import Extract, BodyType
import httpx

BASE_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/"

router = APIRouter(prefix="/summary", tags=["Summary"])


async def get_api_response(url: str, user_agent: dict) -> httpx.Response:
    async with httpx.AsyncClient(headers=user_agent) as client:
        response = await client.get(url)

    try:
        return response
    except ValueError:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"External API returned invalid JSON. Status={response.status_code}",
        )


@router.get("/celestial", response_model=Extract, status_code=status.HTTP_200_OK)
async def retrieve_celestial_summary(
    celestial_name: Annotated[str, Query()],
    body_type: Annotated[BodyType, Query()],
    user_agent: Annotated[str | None, Header()],
):
    celestial_name = urllib.parse.quote(celestial_name.lower())

    end_point = f"{BASE_URL}{celestial_name}_({body_type.lower()})"
    response = await get_api_response(end_point, {"User-Agent": user_agent})

    if response.is_error:
        end_point = f"{BASE_URL}{celestial_name}"
        response = await get_api_response(end_point, {"User-Agent": user_agent})
    if response.is_success:
        payload = response.json()
        return Extract.model_validate(payload)
    else:
        return {
            "extract": "Some celestial bodies just don't have much information about them... You happened to click one that didn't :("
        }


@router.get("/parameter", response_model=Extract, status_code=status.HTTP_200_OK)
async def retrieve_parameter_summary(
    parameter_name: Annotated[str, Query()], user_agent: Annotated[str | None, Header()]
):
    processed_parameter = parameter_name.replace(" ", "_")
    end_point = f"{BASE_URL}{processed_parameter}"
    response = await get_api_response(end_point, {"User-Agent": user_agent})

    if response.is_success:
        payload = response.json()
        return Extract.model_validate(payload)
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
