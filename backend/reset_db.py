import asyncio
import asyncpg

async def reset_database():
    # התחברות ל-DB
    conn = await asyncpg.connect(
        "postgresql://synap_user:d7l7Mpsxx7FW25dmRdO4xqDLBTJrgMnK@dpg-d48cu74hg0os7387833g-a/synap_db"
    )
    
    # מחיקת הטבלה
    await conn.execute("DROP TABLE IF EXISTS investors CASCADE;")
    print("✅ Table deleted!")
    
    await conn.close()

# הרצה
asyncio.run(reset_database())