import os
import webview
from pathlib import Path

from backend.api import API

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

DEV_MODE = os.getenv("APP_ENV") == "development"


def main():
    if DEV_MODE:
        url = "http://localhost:5173"
    else:
        url = (BASE_DIR / "frontend" / "dist" / "index.html").as_uri()

    webview.create_window(
        "Wallet",
        url,
        js_api=API(),
        width=1200,
        height=800,
        resizable=True
    )

    webview.start(debug=True if DEV_MODE else False)

if __name__ == "__main__":
    main()