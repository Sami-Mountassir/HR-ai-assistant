from database.database_management import SessionLocal
from database.Employees import Employees
from database.Teams import Teams
from database.Departments import Departments

def get_employee(name: str):
    db = SessionLocal()
    try:
        return db.query(Employees).filter(Employees.name == name).first()
    finally:
        db.close()

def get_team_by_employee(name: str):
    db = SessionLocal()
    try:
        employee = db.query(Employees).filter(Employees.name == name).first()
        if employee and employee.team_id:
            return db.query(Teams).filter(Teams.id == employee.team_id).first()
        return None
    finally:
        db.close()

def current_role(name: str):
    employee = get_employee(name)
    return employee.role if employee else None

def department(name: str):
    employee = get_employee(name)
    return employee.department.name if employee and employee.department else None

def performance_rate(name: str):
    employee = get_employee(name)
    return employee.performance_rate if employee else None

def leadership_score(name: str):
    employee = get_employee(name)
    return employee.leadership_score if employee else None

def creativity_score(name: str):
    employee = get_employee(name)
    return employee.creativity_score if employee else None

def work_experience(name: str):
    employee = get_employee(name)
    return employee.experience_years if employee else None

def attendance_issues(name: str):
    employee = get_employee(name)
    return employee.attendance if employee else None

def team_size(name: str):
    team = get_team_by_employee(name)
    return team.size if team else None

def team_members(name: str):
    team = get_team_by_employee(name)
    return team.members if team else []

def financial_status() -> str:
    db = SessionLocal()
    try:
        teams = db.query(Teams).all()
        if not teams:
            return "No team financial data available."
        lines = [f"- {t.name}: income {t.income}, outcome {t.outcome}" for t in teams]
        return "\n".join(lines)
    finally:
        db.close()

def high_risk_departments() -> str:
    db = SessionLocal()
    try:
        deps = db.query(Departments).order_by(Departments.profit.asc()).limit(3).all()
        if len(deps) < 3:
            return "Not enough departments to rank risk."
        return (f"Most endangered department is {deps[0].name}, "
                f"followed by {deps[1].name}, then {deps[2].name}.")
    finally:
        db.close()

def company_database() -> str:
    db = SessionLocal()
    try:
        employees = db.query(Employees).all()
        if not employees:
            return "No employee data available."
        header = ("Name | Role | Department | Performance | Leadership | "
                  "Creativity | Experience (yrs) | Salary | Attendance | Notes")
        separator = "-" * len(header)
        rows = [header, separator]
        for e in employees:
            dep_name = e.department.name if e.department else "N/A"
            rows.append(f"{e.name} | {e.role} | {dep_name} | {e.performance_rate} | "
                        f"{e.leadership_score} | {e.creativity_score} | {e.experience_years} | "
                        f"{e.salary} | {e.attendance} | {e.notes or 'N/A'}")
        return "\n".join(rows)
    finally:
        db.close()
