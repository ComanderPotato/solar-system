from fastapi import APIRouter
from .summary import router as summary_router
from .parameters import router as parameters_router


router = APIRouter(prefix="/rest/v1")

router.include_router(summary_router)
router.include_router(parameters_router)

__all__ = ["router"]
