import sqlite3

db = sqlite3.connect("barbershop.db")
cursor = db.cursor()
cursor.execute(""
"   CREATE TABLE IF NOT EXISTS users (" \
"       id INTEGER PRIMARY KEY AUTOINCREMENT," \
"       username text NOT NULL,"
"       password text NOT NULL," \
"       email text NOT NULL," \
"       phone text NOT NULL," \
"       role text NOT NULL," \
"       is_vip INTEGER DEFAULT 0" \
"   )" \
)