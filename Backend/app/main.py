import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine
from models import Base
import db.base
from api.endpoints import users

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(users.router)
