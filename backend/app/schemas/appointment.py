from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AppointmentBase(BaseModel):
    customer_id: int
    service_id: int
    datetime: datetime
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    pass

class Appointment(AppointmentBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True