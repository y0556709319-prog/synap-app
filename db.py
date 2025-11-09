import sqlite3
import pandas as pd

DB_NAME = 'data.db'

def get_connection():
    return sqlite3.connect(DB_NAME)

def init_db():
    conn = get_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS investors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            capital REAL,
            interest REAL,
            status TEXT
        )
    ''')
    conn.commit()
    conn.close()

def add_investor(name, capital, interest, status):
    conn = get_connection()
    conn.execute('INSERT INTO investors (name, capital, interest, status) VALUES (?, ?, ?, ?)',
                 (name, capital, interest, status))
    conn.commit()
    conn.close()

def get_investors():
    conn = get_connection()
    df = pd.read_sql_query('SELECT * FROM investors', conn)
    conn.close()
    return df
