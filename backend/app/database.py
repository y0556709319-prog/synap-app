from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

# ה-URL של הDB שלך
DATABASE_URL = "postgresql+asyncpg://synap_user:d7l7Mpsxx7FW25dmRdO4xqDLBTJrgMnK@dpg-d48cu74hg0os7387833g-a.frankfurt-postgres.render.com/synap_db"


# יצירת Engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Session maker
AsyncSessionLocal = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Base לטבלאות
Base = declarative_base()

# Depבendency לקבלת Session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session