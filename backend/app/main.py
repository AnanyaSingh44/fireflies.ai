from fastapi import FastAPI
from app.db.database import Base, engine
from app.models.models import *
from app.routes.meetings import router as meetings_router
from app.routes.action_items import router as action_items_router
from app.routes.transcripts import router as transcripts_router
from app.routes.topic import router as topics_router
from app.routes.summaries import router as summaries_router
from app.routes.imports import router as imports_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(meetings_router)
app.include_router(action_items_router)
app.include_router(transcripts_router)
app.include_router(topics_router)
app.include_router(summaries_router)
app.include_router(imports_router)


@app.get("/")
def read_root():
    return {"message": "Hello"}