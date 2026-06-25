import os
from sqlalchemy import create_all, create_engine
from sqlalchemy.orm import sessionmaker

# 1. Grab variables from Render's dashboard environment
TURSO_URL = os.getenv("TURSO_DATABASE_URL")
TURSO_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

# 2. Build connection fallback string
if TURSO_URL and TURSO_TOKEN:
    # Change libsql:// to sqlite:// so SQLAlchemy handles it natively via the client extension
    db_url = TURSO_URL.replace("libsql://", "sqlite://") + f"?auth_token={TURSO_TOKEN}"
else:
    # Local fallback for development
    db_url = "sqlite:///./fireflies.db"

engine = create_engine(db_url, connect_args={"check_same_thread": False} if "sqlite" in db_url else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)