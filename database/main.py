
from dotenv import load_dotenv
from pathlib import Path
import os




dotenv_path = Path(__file__).resolve().parent / ".env"
if not dotenv_path.exists():
    raise FileNotFoundError(f".env file not found at {dotenv_path}")

load_dotenv(dotenv_path)

print("DATABASE_URL =", os.getenv("DATABASE_URL"))

from database_management import Base, engine
from Employees import Employees, Employees_skills
from Departments import Departments
from Teams import Teams
from Skills import Skills

Base.metadata.create_all(bind=engine)
