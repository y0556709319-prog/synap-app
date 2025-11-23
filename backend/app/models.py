from sqlalchemy import Column, Integer, String, Float, Date, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Investor(Base):
    __tablename__ = "investors"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    id_number = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    investment_amount = Column(Float, nullable=False)
    start_date = Column(Date, nullable=False)
    investor_type = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())