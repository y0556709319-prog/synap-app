from nicegui import ui
import sqlite3

# יצירת טבלת משקיעים אם לא קיימת
def init_db():
    conn = sqlite3.connect('data.db')
    conn.execute('''CREATE TABLE IF NOT EXISTS investors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        capital REAL,
        interest REAL,
        status TEXT
    )''')
    conn.close()

def add_investor(name, capital, interest, status):
    conn = sqlite3.connect('data.db')
    conn.execute(
        'INSERT INTO investors (name, capital, interest, status) VALUES (?, ?, ?, ?)',
        (name, capital, interest, status),
    )
    conn.commit()
    conn.close()
    ui.notify(f"נוסף משקיע: {name}")

def get_investors():
    conn = sqlite3.connect('data.db')
    cursor = conn.execute('SELECT * FROM investors ORDER BY id DESC')
    data = cursor.fetchall()
    conn.close()
    return data

init_db()

# UI
ui.label('📊 מערכת ניהול השקעות - Synap').classes('text-2xl text-bold mt-4')

with ui.row():
    name = ui.input('שם משקיע')
    capital = ui.number('סכום השקעה')
    interest = ui.number('ריבית נומינלית (%)')
    status = ui.select(['פעיל', 'ממתין', 'סגור'], label='סטטוס')
ui.button('הוסף משקיע', on_click=lambda: add_investor(name.value, capital.value, interest.value, status.value))

ui.separator()

with ui.card().classes('mt-4 w-full'):
    ui.label('רשימת משקיעים').classes('text-xl text-bold mb-2')

    def refresh_table():
        table.rows = get_investors()

    table = ui.table(
        columns=[
            {'name': 'id', 'label': 'מזהה', 'field': 'id'},
            {'name': 'name', 'label': 'שם משקיע', 'field': 'name'},
            {'name': 'capital', 'label': 'סכום השקעה', 'field': 'capital'},
            {'name': 'interest', 'label': 'ריבית (%)', 'field': 'interest'},
            {'name': 'status', 'label': 'סטטוס', 'field': 'status'},
        ],
        rows=get_investors(),
        row_key='id',
    ).classes('w-full')

    ui.button('רענן רשימה', on_click=refresh_table).classes('mt-2')

ui.run(host='0.0.0.0', port=8080)
