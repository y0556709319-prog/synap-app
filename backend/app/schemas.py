from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

class InvestorBase(BaseModel):
    full_name: str
    id_number: str
    email: EmailStr
    phone: str
    investment_amount: float
    start_date: date
    investor_type: str
    notes: Optional[str] = None

class InvestorCreate(InvestorBase):
    pass

class InvestorResponse(InvestorBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True