# You can rewrite this file to use any Database you want!

import sqlite3
from pathlib import Path

def main():
    BASE_DIR = Path(__file__).resolve().parent

    DB_PATH = BASE_DIR / "database.db"
    SQL_PATH = BASE_DIR / "schema.sql" # Change manually if needed (example migration). You can actually use this script to execute any SQL. Make it better if you want!

    if DB_PATH.exists():
        raise SystemError("Database already exist. Manually delete file.")
        

    with sqlite3.connect(DB_PATH) as conn:
        sql = SQL_PATH.read_text(encoding="utf-8")
        conn.executescript(sql)
        conn.commit()

    print("Database Created")

if __name__ == "__main__":
    main()
