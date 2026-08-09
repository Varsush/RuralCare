from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.schemas.summary import SummaryRequest
from app.services.summary_service import generate_clinical_summary

from app.services.gemma_service import (
    generate_follow_up_questions,
)


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"],
)


class FollowUpRequest(BaseModel):
    complaint: str
    relationship: str
    language: str


@router.post("/follow-up")
async def follow_up(
    request: FollowUpRequest,
):

    try:

        result = await generate_follow_up_questions(
            complaint=request.complaint,
            relationship=request.relationship,
            language=request.language,
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

@router.post("/summary")
async def create_clinical_summary(request: SummaryRequest):
    try:
        summary = await generate_clinical_summary(
            complaint=request.complaint,
            relationship=request.relationship,
            questions=request.questions,
            answers=request.answers,
            language=request.language,
        )

        return summary

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )