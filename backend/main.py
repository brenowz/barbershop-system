import sqlite3

db = sqlite3.connect("barbershop.db")

cursor = db.cursor()

cursor.execute("""
    CREATE TABLE services (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL
    )
""")

db.commit()

db.close()