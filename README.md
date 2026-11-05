# Python + React Local Desktop App Template

A starter template for building **cross-platform desktop applications** with a Python backend and a modern React frontend. It uses **pywebview** to display the UI in a native desktop window and expose Python functions to JavaScript without requiring a separate REST API.

> **Template status:** This repository is intended as a starting point. Replace the sample pages, assets, database schema, and API methods with your application's functionality.

## Tech stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Desktop shell | Python + pywebview | Creates the native window and hosts the frontend |
| Backend | Python | Application logic and native/OS integration |
| Database | SQLite | Local data storage |
| Frontend | React + TypeScript + Vite | UI and development tooling |
| Styling | Tailwind CSS | UI styling |
| Navigation | React Router (hash routing) | Client-side pages that work with local HTML files |

## How it works

```text
main.py
  └─ starts pywebview window
       ├─ development: Vite dev server (http://localhost:5173)
       └─ production: frontend/dist/index.html
             └─ React app
                  ├─ router → layouts → pages
                  └─ src/api/api.ts
                       └─ window.pywebview.api.<method>(...args)
                            └─ backend/api.py
                                 └─ backend/database/
```

1. `main.py` starts the desktop window and attaches the Python API object to pywebview.
2. React renders the UI. React Router swaps pages inside the shared layout without reloading the window.
3. Frontend code calls Python through the reusable `api.call<T>(method, ...args)` wrapper.
4. pywebview forwards the call to a public method on the exposed Python API object and returns its result asynchronously.
5. Backend code can read or update the local SQLite database as needed.

**Important:** The generic type parameter `<T>` describes the expected response to TypeScript; it does **not** validate Python's response at runtime.

## Project structure

```text
.
├── backend/
│   ├── api.py                 # Python methods exposed to the frontend
│   └── database/
│       ├── create_schema.py   # Database initialization script
│       ├── models.py          # Database models / data-access code
│       ├── schema.sql         # SQLite schema
│       └── database.db        # Local SQLite database (if initialized)
├── docs/
│   └── example.md             # Write here your documentation
├── frontend/
│   ├── public/                # Static files served as-is
│   ├── src/
│   │   ├── api/api.ts         # React → Python bridge wrapper
│   │   ├── assets/            # Imported images and other assets
│   │   ├── layouts/MainLayout.tsx # Shared navigation / footer / shell
│   │   ├── pages/             # Route components
│   │   ├── router/index.tsx   # Route definitions
│   │   ├── types/pywebview.d.ts # TypeScript declarations for bridge
│   │   ├── App.tsx            # Mounts the router
│   │   ├── index.css          # Global styles / Tailwind import
│   │   └── main.tsx           # React entry point
│   ├── package.json
│   └── vite.config.ts         # Vite configuration
├── .env                       # Local application environment settings
└── main.py                    # Desktop application entry point
```

Generated directories such as `frontend/node_modules/`, Python `__pycache__/`, and `frontend/dist/` are intentionally omitted from the tree.

## Getting started

### Prerequisites

- Python and `pip` (use a version supported by the project's Python dependencies)
- Node.js and npm (use a version supported by the project's Vite version)
- A supported desktop webview runtime for your operating system (for example, WebView2 on Windows)

### 1. Install Python dependencies

From the repository root, create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install pywebview python-dotenv
```

These are the core dependencies used by the described setup. **Install any additional libraries imported by your backend code.** Consider adding a root `requirements.txt` or `pyproject.toml` to pin the complete dependency list before publishing the template.

On macOS/Linux, activate with `source .venv/bin/activate` instead.

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure the environment

The desktop entry point is designed to choose its frontend based on `APP_ENV`:

```dotenv
APP_ENV=development
```

Ensure `main.py` loads `.env` (for example, using `python-dotenv`). **Check the actual environment variable names in your code before changing this file.**

### 4. Run in development

Start Vite in one terminal:

```bash
cd frontend
npm run dev
```

Then, from the repository root, start the desktop app in another terminal:

```bash
python main.py
```

The pywebview window should load the Vite development server. React edits update through Vite's hot reload. **Open the app through pywebview to test the Python bridge**; opening the same URL in a regular browser does not provide `window.pywebview.api`.

### 5. Build and run the frontend locally

```bash
cd frontend
npm run build
```

Then set the environment to production mode (if supported by your `main.py`):

```dotenv
APP_ENV=production
```

Start the app from the repository root:

```bash
python main.py
```

Production should load `frontend/dist/index.html`. Keep `base: "./"` in Vite and hash-based routing so asset paths and routes work when the frontend is loaded from a local file.

> **Note:** Building the frontend does not create a distributable desktop executable. Packaging Python, the frontend build, and native webview dependencies is a separate step for each OS.

## Where to make changes

| Want to… | Edit… |
| --- | --- |
| Change the window title, size, startup URL, or runtime settings | `main.py` |
| Add Python functions callable from React | `backend/api.py` |
| Change how React calls Python | `frontend/src/api/api.ts` |
| Define global TypeScript types for the bridge | `frontend/src/types/pywebview.d.ts` |
| Add or modify pages | `frontend/src/pages/` |
| Register a route | `frontend/src/router/index.tsx` |
| Change shared sidebar, navbar, or footer | `frontend/src/layouts/MainLayout.tsx` |
| Change app-wide styles and Tailwind setup | `frontend/src/index.css` |
| Change frontend build settings | `frontend/vite.config.ts` |
| Change the database structure | `backend/database/schema.sql` |
| Change database initialization | `backend/database/create_schema.py` |
| Change database access / models | `backend/database/models.py` |
| Replace icons and illustrations | `frontend/public/` and `frontend/src/assets/` |

### Add a page

1. Create a component such as `frontend/src/pages/Settings.tsx`.
2. Add a route in `frontend/src/router/index.tsx`.
3. Add a navigation link in `MainLayout.tsx`, if needed.
4. Ensure `MainLayout` renders `<Outlet />` for its child routes.

### Add a Python API method

Add a public method to the Python API class exposed by `main.py`:

```python
# Example method inside the existing API class in backend/api.py
def greet(self, name: str) -> str:
    return f"Hello, {name}!"
```

Call it from a React component:

```ts
import { api } from "../api/api";

const message = await api.call<string>("greet", "Alex");
console.log(message);
```

The wrapper waits for the pywebview bridge before invoking the method. Python methods exposed through the bridge should return values that pywebview can serialize to JavaScript. Handle rejected promises and Python exceptions in your UI.

### Change the database

- Update `backend/database/schema.sql` for tables and indexes.
- Review `backend/database/create_schema.py` before running it: initialization scripts may modify or recreate database objects.
- Update `backend/database/models.py` and any API methods that depend on the schema.
- Back up existing data before applying schema changes. For real applications, consider adding database migrations.

## Development notes

- **No HTTP API required:** The frontend calls Python directly through pywebview's JavaScript bridge.
- **Bridge availability:** `window.pywebview` is not available in an ordinary browser tab; use the desktop window for end-to-end tests.
- **Async calls:** Calls to Python return promises. Use `await` and `try/catch` in React.
- **Routing:** Hash routing keeps navigation compatible with `file://` loading in production.
- **Platform support:** The architecture targets Windows, macOS, and Linux, but native dependencies and packaging differ by OS.
- **Security:** Only expose intended Python methods. Validate arguments in Python; TypeScript types alone do not enforce runtime safety.
- **Local data:** Decide whether `database.db` should be shipped as seed data or created on first launch. User-writable data should generally live in an OS-appropriate application-data directory rather than alongside a packaged executable.

## Before publishing your own app

- [ ] Replace starter branding, sample pages, icons, and images.
- [ ] Set your app's window title and production configuration.
- [ ] Add and pin complete Python dependencies.
- [ ] Verify `.env` contains no secrets and add a safe `.env.example`.
- [ ] Confirm `.gitignore` excludes `.venv/`, `node_modules/`, `__pycache__/`, `dist/`, and any private local databases.
- [ ] Decide whether to include or ignore `backend/database/database.db`.
- [ ] Test development and production launches.
- [ ] Test the Python bridge and navigation in the packaged application.
- [ ] Build and test separate packages for each target operating system.
