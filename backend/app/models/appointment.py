from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    datetime = Column(DateTime)
    status = Column(String, default="pending")
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.utcnow())
    
    customer = relationship("Customer", back_populates="appointments")
    service = relationship("Service", back_populates="appointments")