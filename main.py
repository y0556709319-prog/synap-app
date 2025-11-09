import streamlit as st
import pandas as pd
import db

st.set_page_config(page_title="Synap - מערכת ניהול השקעות", layout="wide")
st.title("📊 מערכת ניהול השקעות - Synap")

# אתחול בסיס הנתונים
db.init_db()

# --- טופס הוספת משקיע ---
st.subheader("➕ הוסף משקיע חדש")

with st.form("add_investor_form"):
    name = st.text_input("שם משקיע")
    capital = st.number_input("יתרת קרן (₪)", min_value=0.0, step=1000.0)
    interest = st.number_input("ריבית נומינלית (%)", min_value=0.0, step=0.1)
    status = st.selectbox("סטטוס", ["פעיל", "ממתין", "סגור"])
    submitted = st.form_submit_button("שמור")

    if submitted:
        if name:
            db.add_investor(name, capital, interest, status)
            st.success(f"המשקיע {name} נוסף בהצלחה!")
        else:
            st.warning("אנא הזיני שם משקיע לפני השמירה.")

# --- הצגת רשימת משקיעים ---
st.subheader("📋 רשימת משקיעים")
investors = db.get_investors()
st.dataframe(investors, use_container_width=True)
