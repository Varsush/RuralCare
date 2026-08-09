from pydantic import BaseModel
from typing import Dict, List


class SummaryRequest(BaseModel):
    complaint: str
    relationship: str
    questions: List[dict]
    answers: Dict[str, str]
    language: str