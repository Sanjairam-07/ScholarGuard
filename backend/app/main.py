from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import pdf_routes, url_routes

app = FastAPI(title="ScholarGuard API", version="1.0.0")

# Allow frontend (Next.js on port 3000) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf_routes.router, prefix="/api")
app.include_router(url_routes.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "ScholarGuard API is running"}