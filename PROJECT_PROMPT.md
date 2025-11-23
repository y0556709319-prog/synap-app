# 📋 InvestIQ - פרויקט ניהול משקיעים עם AI Chat

## 🎯 סקירה כללית

**InvestIQ** היא פלטפורמה מודרנית לניהול משקיעים בישראל. המשתמשת יכולה:
- ➕ להוסיף משקיעים חדשים
- 💬 לשאול שאלות בעברית על הנתונים שלה דרך AI Chat
- 📊 לראות את כל המשקיעים בתצוגה ידידותית

---

## 🏗️ ארכיטקטורה

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│              localhost:5173                             │
├─────────────────────────────────────────────────────────┤
│  - App.tsx (Router בין דפים)                           │
│  - pages/AddInvestor.tsx (טופס הוספת משקיע)           │
│  - pages/Chat.tsx (ממשק AI Chat)                       │
│  - TypeScript + Tailwind CSS + shadcn/ui              │
└─────────────────────────────────────────────────────────┘
              ↕ (Fetch API + JSON)
┌─────────────────────────────────────────────────────────┐
│               BACKEND (FastAPI + Python)                │
│              127.0.0.1:8000                             │
├─────────────────────────────────────────────────────────┤
│  - main.py (API Endpoints)                              │
│  - models.py (SQLAlchemy Models)                        │
│  - database.py (PostgreSQL Connection)                  │
│  - schemas.py (Pydantic Validation)                     │
│  - llm.py (OpenAI RAG Chat)                             │
└─────────────────────────────────────────────────────────┘
              ↕ (asyncpg + SQL)
┌─────────────────────────────────────────────────────────┐
│            DATABASE (PostgreSQL on Render)              │
│  postgresql://synap_user:***@dpg-****/synap_db         │
├─────────────────────────────────────────────────────────┤
│  Table: investors                                       │
│  - id (Primary Key)                                     │
│  - full_name, id_number, email, phone                  │
│  - investment_amount, start_date                        │
│  - investor_type, notes                                 │
│  - created_at, updated_at                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 מבנה הקבצים

```
investiq/
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Router ראשי
│   │   ├── pages/
│   │   │   ├── AddInvestor.tsx     # טופס הוספה
│   │   │   └── Chat.tsx             # ממשק Chat
│   │   ├── components/
│   │   │   └── ui/                 # shadcn components
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
│
└── backend/
    ├── app/
    │   ├── __init__.py
    │   ├── main.py                 # FastAPI app + endpoints
    │   ├── models.py               # SQLAlchemy models
    │   ├── database.py             # DB connection
    │   ├── schemas.py              # Pydantic schemas
    │   └── llm.py                  # OpenAI RAG logic
    ├── venv/                       # Virtual environment
    ├── .env                        # Environment variables
    ├── requirements.txt
    └── reset_db.py                 # DB reset script
```

---

## 🔧 טכנולוגיות

### Frontend:
- **React 18** + **Vite** - UI Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Lucide Icons** - Icons
- **Fetch API** - HTTP Requests

### Backend:
- **FastAPI** - Web Framework
- **Python 3.11+**
- **SQLAlchemy 2.0** - ORM
- **asyncpg** - PostgreSQL driver (async)
- **Pydantic V2** - Data validation
- **OpenAI API** - AI Chat (gpt-4o-mini)
- **python-dotenv** - Environment variables

### Database:
- **PostgreSQL** - Render.com
- **asyncio** - Async operations

### Deployment:
- **Frontend**: Vercel (ready)
- **Backend**: Render (ready)
- **Database**: Render PostgreSQL (active)

---

## 🔌 API Endpoints

### Investors Management:
```
POST   /api/investors              # הוספת משקיע
GET    /api/investors              # קבלת כל המשקיעים
GET    /api/investors/{id}         # קבלת משקיע ספציפי
PUT    /api/investors/{id}         # עדכון משקיע
DELETE /api/investors/{id}         # מחיקת משקיע
```

### AI Chat (RAG):
```
POST   /api/chat                   # שלח שאלה ל-AI
```

**Input:**
```json
{
  "message": "כמה משקיעים יש לי?"
}
```

**Output:**
```json
{
  "question": "כמה משקיעים יש לי?",
  "answer": "יש לך 5 משקיעים במערכת...",
  "status": "success"
}
```

---

## 📊 Database Schema

### Investors Table:
```sql
CREATE TABLE investors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    id_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    investment_amount FLOAT NOT NULL,
    start_date DATE NOT NULL,
    investor_type VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔑 דרישות סביבה

### Backend (.env):
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
DATABASE_URL=postgresql+asyncpg://user:pass@host/db
```

### Database Connection:
```
postgresql://synap_user:d7l7Mpsxx7FW25dmRdO4xqDLBTJrgMnK@dpg-d48cu74hg0os7387833g-a/synap_db
```

---

## 🚀 הרצה מקומית

### Backend:
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload
# http://127.0.0.1:8000
# Swagger: http://127.0.0.1:8000/docs
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

---

## 💬 AI Chat - RAG System

### איך זה עובד:

1. **User Question** (עברית)
   ```
   "כמה משקיעים יש לי?"
   ```

2. **Backend Extraction** - משך את כל נתוני הinvestors מ-DB

3. **Context Building** - בנה context עם הנתונים:
   ```
   נתוני המשקיעים:
   ID: 1
   שם: דוד כהן
   סכום השקעה: ₪100,000
   ...
   ```

4. **OpenAI Request** - שלח ל-ChatGPT עם system prompt:
   ```
   "ענה רק על בסיס הנתונים שנתונים לך"
   ```

5. **Answer** (עברית)
   ```
   "יש לך 1 משקיע - דוד כהן"
   ```

### Model Used:
- **gpt-4o-mini** - זול (~$0.001 לשאלה)
- Temperature: 0.7
- עברית full-support

---

## 🎨 Design System

### Colors:
- Primary: `#2F80ED` (Blue)
- Secondary: `#56CCF2` (Light Blue)
- Background: `#F8F9FB` (Light Gray)
- Text Dark: `#1A2B4A`
- Text Light: `#717182`

### Typography:
- Headers: Bold, 28-32px
- Body: Regular, 14-16px
- Direction: RTL (עברית)

### Components:
- Input Fields: Light gray background, blue focus
- Buttons: Gradient blue, hover opacity
- Chat Messages: User (blue), Assistant (gray)
- Icons: Lucide React

---

## 📝 Investor Types:
- `individual` - משקיע פרטי
- `institutional` - משקיע מוסדי
- `angel` - מלאך השקעות
- `fund` - קרן השקעות
- `other` - אחר

---

## ✅ Checklist - מה שיש וצריך:

### ✅ קיים:
- ✅ Frontend React App עם 2 דפים
- ✅ Backend FastAPI עם CRUD endpoints
- ✅ PostgreSQL Database בRender
- ✅ AI Chat עם RAG
- ✅ Hebrew Support
- ✅ CORS Configured
- ✅ Async/Await throughout

### 🔄 Future Enhancements:
- [ ] Chat History (שמירה של שיחות קודמות)
- [ ] User Authentication
- [ ] Multiple Tenants (clients)
- [ ] More DB Tables (deals, campaigns, etc.)
- [ ] Dashboard with Charts
- [ ] Export to Excel
- [ ] Email Notifications
- [ ] Mobile App

---

## 🐛 Troubleshooting

### CORS Errors:
- ✅ Fixed: CORS middleware configured for `http://localhost:5173`

### Database Column Errors:
- ✅ Fixed: Drop table and let FastAPI recreate

### OpenAI API Key Invalid:
- Check `.env` file in backend
- Verify API key from platform.openai.com

### Chat Not Responding:
- Check OpenAI API key has credits
- Verify backend running on 8000
- Check network connection

---

## 📞 Important Links

- **Frontend**: http://localhost:5173
- **Backend**: http://127.0.0.1:8000
- **Swagger Docs**: http://127.0.0.1:8000/docs
- **Database**: Render.com Dashboard
- **OpenAI**: https://platform.openai.com/

---

## 🎯 Current Status

**MVP (Minimum Viable Product):** ✅ COMPLETE
- Investors CRUD: ✅
- AI Chat with RAG: ✅
- Hebrew Support: ✅
- Real Database: ✅

**Next Milestone:** Chat History + Authentication

---

## 📚 Notes for Future Development

1. **RAG Optimization**: כיום שולחים את כל הנתונים. בעתיד - להוסיף embedding search.
2. **Scaling**: אם יהיו 10,000+ משקיעים, צריך vector DB (Pinecone/Weaviate).
3. **Multi-Table Support**: ניתן להרחיב את `llm.py` להכיל נתונים מטבלאות נוספות.
4. **Cost Optimization**: Monitor OpenAI usage בmonthly.
5. **Security**: Add authentication layer before production.

---

## 🚀 Deploy to Production

### Frontend (Vercel):
```bash
git push origin main
# Auto-deploys from GitHub
```

### Backend (Render):
```bash
git push origin main
# Auto-deploys from GitHub
```

---

**עודכן:** נובמבר 2025
**וגרסה:** 1.0 MVP