from database.database_functions import (
    current_role, department, team_size, team_members,
    performance_rate, leadership_score, creativity_score,
    work_experience, attendance_issues, company_database,
    financial_status, high_risk_departments
)


def ROLE_TEMPLATE(name, next_role):
    return f"""
You are an HR strategy expert.

Analyze the impact of promoting {name}
from {current_role(name)} to {next_role}.

Department: {department(name)}
Team Size: {team_size(name)}
Team Members:
{team_members(name)}

Employee Metrics:
Performance Score: {performance_rate(name)}
Leadership Score: {leadership_score(name)}
Creativity Score: {creativity_score(name)}
Work Experience: {work_experience(name)} years

Return:

1. Productivity Impact
2. Risk Level
3. Recommendation

Each point must contain:
- Short answer
- Maximum 2 sentences explanation.
"""


# notes: optional free-text from the manager calling the API
def FIRING_EMPLOYEE_TEMPLATE(name, notes=None):
    return f"""
You are an HR strategy expert.

Analyze the scenario of deciding whether to terminate an employee or retain them.

Employee Information:
- Name: {name}
- Current Role: {current_role(name)}
- Department: {department(name)}
- Performance Score: {performance_rate(name)} (0 to 1)
- Leadership Score: {leadership_score(name)} (0 to 1)
- Creativity Score: {creativity_score(name)} (0 to 1)
- Work Experience: {work_experience(name)} years
- Attendance / Punctuality Issues: {attendance_issues(name)}
- Any other relevant notes: {notes}

Consider:
1. Performance and contribution to the team
2. Risks of keeping vs. firing
3. Possible alternatives to firing (retraining, mentorship, role change)

Return:
- Recommendation: "Fire" or "Retain" or "Consider Alternatives"
- Reasoning: 2–3 short bullet points explaining your decision
- Actionable Advice: 1–2 sentences suggesting next steps

Be objective, concise, and professional. Do not make personal judgments beyond business context.
"""


# financial_status, budget_target, high_risk_departments come from the user via the POST API body
def LETTING_GO_PROMPT(financial_status_input, budget_target, high_risk_departments_input):
    return f"""
You are an HR and finance strategy expert.

The company is facing a financial crisis and needs to reduce costs.
You have access to the company's employee database with the following columns:

- Name
- Current Role
- Department
- Performance Score (0 to 1)
- Leadership Score (0 to 1)
- Creativity Score (0 to 1)
- Work Experience (years)
- Salary
- Attendance / Punctuality Issues
- Role Criticality (High / Medium / Low)
- Any other notes

{company_database()}

Company Context:
- Current financial situation: {financial_status_input}
- Budget reduction target: ${budget_target}
- Departments at higher risk: {high_risk_departments_input}

Instructions:
1. Analyze the database and identify employees who could be considered for layoff to meet budget reduction goals.
2. Prioritize decisions based on:
   - Performance and contribution to the company
   - Role criticality
   - Salary/cost savings
   - Department risk levels
3. Recommend alternatives where possible (role reassignment, retraining, reduced hours).
4. Return a structured response:

- For each employee recommended for layoff, provide:
  - Name
  - Role
  - Department
  - Reason for layoff (2 sentences max)
  - Financial impact

- Summarize total estimated savings at the end.

Be objective, concise, and professional. Only make decisions based on business logic and financial necessity, not personal opinions.
"""


def ANALYZING_CVS_PROMPT(*files):
    n = len(files)
    prompt_lines = ""
    for i, filepath in enumerate(files):
        with open(filepath) as f:
            content = f.read()
        prompt_lines += f"CV number {i + 1}:\n{content}\n\n"

    return f"""
You are a senior recruitment specialist with expertise in talent evaluation and organizational performance.
I will provide multiple CVs for a specific job position.

Your task is to perform a rigorous, objective, and structured evaluation of each candidate.

Step 1: Evaluation Criteria (Score each out of 100)

For each CV, assign a score based on the following weighted criteria:

Relevance to the role (25%) – Alignment of experience with job requirements
Technical and/or professional skills (20%) – Hard and soft skills required for success
Work experience and achievements (20%) – Impact, results, and career progression
Education and certifications (10%) – Academic background and relevant credentials
Adaptability and growth potential (15%) – Ability to learn, evolve, and handle challenges
Communication and clarity (10%) – How clearly the CV presents the candidate

Calculate a final weighted score out of 100 for each candidate.

Step 2: Candidate Analysis

For each candidate, provide:
- Final score
- Key strengths
- Weaknesses or potential risks
- Overall fit for the role (brief summary)

Step 3: Ranking and Selection
Rank all candidates from highest to lowest score.
If there are more than 3 CVs → select the top 3 candidates.
If there are 3 or fewer → select the single best candidate.

Step 4: Final Recommendation

For the top candidate, provide a detailed explanation including:
- Why they outperform other candidates
- What differentiates them clearly
- How they are expected to improve:
  - Team performance
  - Productivity
  - Creativity and innovation
- Their potential long-term value to the organization

Step 5: Output Format

Present your answer in a clear, structured format with headings and bullet points.
Maintain a strictly professional, neutral, and evidence-based tone.
Do not make assumptions beyond the CV content.

{prompt_lines}
"""
