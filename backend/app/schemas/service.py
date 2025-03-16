from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration: int
    price: float

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int

    class Config:
        orm_mode = True