from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from .routes import appointments, customers, services
from .database.database import engine, get_db
from .models import Customer, Service, Appointment
from .models.customer import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(appointments, prefix="/api")
app.include_router(customers, prefix="/api")
app.include_router(services, prefix="/api")

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple query
        db.execute(text("SELECT 1"))
        return {"message": "Successfully connected to the database!"}
    except Exception as e:
        return {"error": f"Database connection failed: {str(e)}"}