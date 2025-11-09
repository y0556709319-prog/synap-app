from nicegui import ui
import psycopg2
import os

# ==============================
# 🔗 הגדרת חיבור ל-PostgreSQL
# ==============================
DATABASE_URL = os.environ.get("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# יצירת טבלה אם לא קיימת
cur.execute("""
CREATE TABLE IF NOT EXISTS investors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    interest NUMERIC,
    status TEXT
)
""")
conn.commit()


# ==============================
# 💡 פונקציות עזר
# ==============================
def get_investors():
    cur.execute("SELECT id, name, amount, interest, status FROM investors ORDER BY id")
    return cur.fetchall()


def add_investor(name, amount, interest, status):
    cur.execute(
        "INSERT INTO investors (name, amount, interest, status) VALUES (%s, %s, %s, %s)",
        (name, amount, interest, status)
    )
    conn.commit()


# ==============================
# 🖥️ ממשק משתמש
# ==============================
ui.label('📊 מערכת ניהול השקעות - Synap').classes('text-3xl text-bold text-center mt-8')

with ui.card().classes('mx-auto mt-6 p-6 w-3/4'):
    ui.label('➕ הוספת משקיע חדש').classes('text-xl text-bold mb-2')

    name = ui.input('שם משקיע')
    amount = ui.number('יתרת קרן', value=0)
    interest = ui.number('ריבית ממוצעת (%)', value=0)
    status = ui.select(['פעיל', 'ממתין', 'סגור'], label='סטטוס')

    def on_submit():
        add_investor(name.value, amount.value, interest.value, status.value)
        ui.notify(f'נוסף משקיע: {name.value}')
        refresh_table()

    ui.button('הוסף משקיע', on_click=on_submit).classes('bg-green-600 text-white mt-2')

ui.separator()

# ==============================
# 📋 טבלת משקיעים
# ==============================
table = ui.table({
    'id': 'מזהה',
    'name': 'שם משקיע',
    'amount': 'יתרת קרן',
    'interest': 'ריבית ממוצעת (%)',
    'status': 'סטטוס'
}, rows=[]).classes('w-3/4 mx-auto mt-8')


def refresh_table():
    data = get_investors()
    table.rows = [{'id': r[0], 'name': r[1], 'amount': r[2], 'interest': r[3], 'status': r[4]} for r in data]
    table.update()


refresh_table()

# ==============================
# 🚀 הרצת השרת
# ==============================
ui.run(host='0.0.0.0', port=8080)
