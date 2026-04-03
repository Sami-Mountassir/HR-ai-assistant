from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database.database_management import Base


class Employees(Base):
    __tablename__ = "Employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    experience_years = Column(Integer)
    performance_rate = Column(Float)
    leadership_score = Column(Float)
    creativity_score = Column(Float)
    productivity_score = Column(Float)
    attendance = Column(Float)
    salary = Column(Float)
    notes = Column(String, nullable=True)

    department_id = Column(Integer, ForeignKey("Departments.id"), index=True)
    department = relationship("Departments", back_populates="members")

    team_id = Column(Integer, ForeignKey("Teams.id"), index=True)
    team = relationship("Teams", back_populates="members")


class Employees_skills(Base):
    __tablename__ = "Employees_skills"

    employee_id = Column(Integer, ForeignKey("Employees.id"), primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("Skills.id"), primary_key=True, index=True)
    lvl = Column(Integer)
