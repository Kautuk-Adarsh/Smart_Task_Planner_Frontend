export interface GoalRequest {
    goal_text: string;
    user_id: string | null;
    context?: string | null;
}

export interface Task {
    task_id: string;
    description: string;
    estimated_duration_days: number;
    dependencies: string[];
    priority: 'High' | 'Medium' | 'Low' | string;
    suggested_deadline: string;
}

export interface TaskPlan {
    tasks: Task[];
    summary: string;
}

