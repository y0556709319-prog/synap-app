from openai import OpenAI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Investor
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def get_all_investors_text(db: AsyncSession) -> str:
    """קבל את כל המשקיעים כטקסט לRAG"""
    result = await db.execute(select(Investor))
    investors = result.scalars().all()
    
    if not investors:
        return "אין משקיעים במערכת"
    
    investors_text = "נתוני המשקיעים:\n\n"
    for investor in investors:
        investors_text += f"""
ID: {investor.id}
שם: {investor.full_name}
מס' זהות: {investor.id_number}
אימייל: {investor.email}
טלפון: {investor.phone}
סכום השקעה: ₪{investor.investment_amount}
תאריך התחלה: {investor.start_date}
סוג משקיע: {investor.investor_type}
הערות: {investor.notes or 'אין'}
---
"""
    return investors_text

async def chat_with_data(question: str, db: AsyncSession) -> str:
    """שלח שאלה עם הנתונים דרך RAG"""
    
    # קבל את כל הנתונים
    investors_data = await get_all_investors_text(db)
    
    # שלח ל-OpenAI עם ה-RAG
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # מודל זול!
        messages=[
            {
                "role": "system",
                "content": """אתה עוזר חכם לניהול משקיעים בישראל.
ענה רק על בסיס הנתונים שהמשתמש נותן לך.
אם לא יש מידע רלוונטי - אמור 'אין לי מידע כזה'.
תמיד ענה בעברית.
הנתונים שלך הם פרטיים של המשתמש - אל תחשוף אותם."""
            },
            {
                "role": "user",
                "content": f"""הנתונים שלי:
{investors_data}

השאלה שלי:
{question}"""
            }
        ],
        temperature=0.7,
    )
    
    return response.choices[0].message.content