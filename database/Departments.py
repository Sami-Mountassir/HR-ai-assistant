from sqlalchemy import Column, String, Float, Integer
from sqlalchemy.orm import relationship
from database_management import Base


class Departments(Base):
    __tablename__ = "Departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    leader = Column(String)
    profit = Column(Float)
    members = relationship("Employees", back_populates="department")  # back_populates matches Employees.department
