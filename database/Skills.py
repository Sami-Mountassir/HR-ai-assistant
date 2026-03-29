from sqlalchemy import Column, String, Float, Integer
from database_management import Base
  
class Skills(Base):
    __tablename__ = "Skills"

    id= Column(Integer, primary_key = True, index = True)
    skill = Column(String)
