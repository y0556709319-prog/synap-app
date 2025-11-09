from nicegui import ui
import os, psycopg2

DATABASE_URL = os.getenv('DATABASE_URL')

def get_conn():
    # Render דורש SSL
    return psycopg2.connect(DATABASE_URL, sslmode='require')

def init_db():
    with get_conn() as conn, conn.cursor() as cur:
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

def add_investor(name, amount, interest, status):
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute(
            "INSERT INTO investors (name, amount, interest, status) VALUES (%s, %s, %s, %s)",
            (name, amount, interest, status)
        )
        conn.commit()

def get_investors():
    with get_conn() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, name, amount, interest, status FROM investors ORDER BY id")
        rows = cur.fetchall()
    # NiceGUI מצפה לשורות כמילונים עם 'field'ים
    return [
        {'id': r[0], 'name': r[1], 'amount': float(r[2]), 'interest': float(r[3]) if r[3] is not None else None, 'status': r[4]}
        for r in rows
    ]

init_db()

ui.label('📊 מערכת ניהול השקעות - Synap').classes('text-3xl text-bold text-center mt-8')

with ui.card().classes('mx-auto mt-6 p-6 w-3/4'):
    ui.label('➕ הוספת משקיע חדש').classes('text-xl text-bold mb-2')
    in_name = ui.input('שם משקיע')
    in_amount = ui.number('יתרת קרן', value=0)
    in_interest = ui.number('ריבית ממוצעת (%)', value=0)
    in_status = ui.select(['פעיל', 'ממתין', 'סגור'], label='סטטוס')

    def on_submit():
        add_investor(in_name.value, in_amount.value, in_interest.value, in_status.value)
        ui.notify(f'נוסף משקיע: {in_name.value}')
        refresh_table()

    ui.button('הוסף משקיע', on_click=on_submit).classes('bg-green-600 text-white mt-2')

# ---- טבלה (שימי לב לפורמט columns) ----
columns = [
    {'name': 'id', 'label': 'מזהה', 'field': 'id', 'sortable': True},
    {'name': 'name', 'label': 'שם משקיע', 'field': 'name'},
    {'name': 'amount', 'label': 'יתרת קרן', 'field': 'amount', 'sortable': True},
    {'name': 'interest', 'label': 'ריבית ממוצעת (%)', 'field': 'interest'},
    {'name': 'status', 'label': 'סטטוס', 'field': 'status'},
]

table = ui.table(columns=columns, rows=[], row_key='id').classes('w-3/4 mx-auto mt-8')

def refresh_table():
    table.rows = get_investors()
    table.update()

refresh_table()

import os
port = int(os.environ.get('PORT', 8080))
ui.run(host='0.0.0.0', port=port, reload=False)
