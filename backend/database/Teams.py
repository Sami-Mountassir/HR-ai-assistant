from sqlalchemy import Column, String, Float, Integer
from sqlalchemy.orm import relationship
from database.database_management import Base


class Teams(Base):
    __tablename__ = "Teams"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    size = Column(Integer)
    income = Column(Float)
    outcome = Column(Float)
    members = relationship("Employees", back_populates="team")
