
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from db import engine
from models import Base
import db.base
from api.endpoints import users

app = FastAPI()

import os

# ── CORS (kept for local dev; not needed in production since same origin) ──
origins = [
    "http://localhost:8000",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── DB ────────────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── API routes ────────────────────────────────────────────────────────────
app.include_router(users.router)

# ── Serve React frontend static build ─────────────────────────────────────
# main.py is at  <repo>/Backend/app/main.py
# dist is at     <repo>/Frontend/dist
FRONTEND_DIST = Path(__file__).resolve().parent.parent.parent / "Frontend" / "dist"

if FRONTEND_DIST.exists():
    # Serve /assets (JS/CSS chunks) and other static files
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")

    # Catch-all: serve index.html for React Router (SPA)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        index = FRONTEND_DIST / "index.html"
        return FileResponse(str(index))
