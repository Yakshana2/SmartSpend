from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import expenses, categories, auth
from backend.database import engine
from backend import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SmartSpend API", version="1.0.0", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["expenses"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])


@app.get("/")
def root():
    return {"message": "SmartSpend API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
