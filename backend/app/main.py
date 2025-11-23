from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.llm import chat_with_data
from app.database import engine, Base, get_db
from app.models import Investor
from app.schemas import InvestorCreate, InvestorResponse

app = FastAPI(title="InvestIQ API", version="1.0.0")

# ⭐ CORS - חשוב מאוד!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # כתובת הReact
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# יצירת הטבלאות בDB
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# 🏠 Homepage
@app.get("/")
def read_root():
    return {"message": "Welcome to InvestIQ API"}

# ➕ הוספת משקיע
@app.post("/api/investors", response_model=InvestorResponse)
async def create_investor(
    investor: InvestorCreate, 
    db: AsyncSession = Depends(get_db)
):
    db_investor = Investor(**investor.model_dump())
    db.add(db_investor)
    await db.commit()
    await db.refresh(db_investor)
    return db_investor

# 📋 רשימת כל המשקיעים
@app.get("/api/investors", response_model=List[InvestorResponse])
async def get_investors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Investor).order_by(Investor.created_at.desc()))
    investors = result.scalars().all()
    return investors

# 🔍 משקיע ספציפי
@app.get("/api/investors/{investor_id}", response_model=InvestorResponse)
async def get_investor(investor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Investor).where(Investor.id == investor_id))
    investor = result.scalar_one_or_none()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    return investor

# ✏️ עדכון משקיע
@app.put("/api/investors/{investor_id}", response_model=InvestorResponse)
async def update_investor(
    investor_id: int,
    investor_update: InvestorCreate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Investor).where(Investor.id == investor_id))
    db_investor = result.scalar_one_or_none()
    if not db_investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    for key, value in investor_update.model_dump().items():
        setattr(db_investor, key, value)
    
    await db.commit()
    await db.refresh(db_investor)
    return db_investor

# 🗑️ מחיקת משקיע
@app.delete("/api/investors/{investor_id}")
async def delete_investor(investor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Investor).where(Investor.id == investor_id))
    db_investor = result.scalar_one_or_none()
    if not db_investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    
    await db.delete(db_investor)
    await db.commit()
    return {"message": "Investor deleted successfully"}

@app.post("/api/chat")
async def chat_endpoint(message: str, db: AsyncSession = Depends(get_db)):
    try:
        answer = await chat_with_data(message, db)
        return {
            "question": message,
            "answer": answer,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")