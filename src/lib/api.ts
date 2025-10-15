import { GoalRequest,TaskPlan } from "./types";
const BACKEND_URL = 'http://127.0.0.1:8000/api/v1/plans';

export async function createPlan(goal: GoalRequest): Promise<TaskPlan> {

  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(goal),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create plan');
  }

  return response.json();
}