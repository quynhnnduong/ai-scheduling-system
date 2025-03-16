from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.database import get_db
from ..models import Service
from ..schemas import schemas

router = APIRouter()

@router.get("/services/", response_model=List[schemas.Service])
def get_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    services = db.query(Service).offset(skip).limit(limit).all()
    return services

@router.post("/services/", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    db_service = Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.get("/services/{service_id}", response_model=schemas.Service)
def get_service(service_id: int, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return db_service

@router.put("/services/{service_id}", response_model=schemas.Service)
def update_service(
    service_id: int,
    service: schemas.ServiceCreate,
    db: Session = Depends(get_db)
):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    for key, value in service.dict().items():
        setattr(db_service, key, value)
    
    db.commit()
    db.refresh(db_service)
    return db_service 