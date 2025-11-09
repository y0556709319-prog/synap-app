import psycopg2
import pandas as pd
import streamlit as st

# --- הכניסי כאן את ה-URL שלך מ-Render ---
DB_URL = st.secrets["DB_URL"]

def get_connection():
    return psycopg2.connect(DB_URL, sslmode='require')

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS investors (
            id SERIAL PRIMARY KEY,
            name TEXT,
            capital NUMERIC,
            interest NUMERIC,
            status TEXT
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()

def add_investor(name, capital, interest, status):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO investors (name, capital, interest, status) VALUES (%s, %s, %s, %s)',
        (name, capital, interest, status)
    )
    conn.commit()
    cur.close()
    conn.close()

def get_investors():
    conn = get_connection()
    df = pd.read_sql_query('SELECT * FROM investors ORDER BY id DESC', conn)
    conn.close()
    return df
