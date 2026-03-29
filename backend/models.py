from pydantic import BaseModel
from typing import List, Optional


class DataForSimulation(BaseModel):
    name: str
    next_role: str

class ChatMessage(BaseModel):
    message: str
    history: Optional[List[str]] = None


class FireEmployeeRequest(BaseModel):
    name: str
    notes: Optional[str] = None  # optional manager notes


class LetGoRequest(BaseModel):
    financial_status: str
    budget_target: float
    high_risk_departments: str
