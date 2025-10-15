'use client';

import React from 'react';
import GanttChart from './GanttChart';
import { Task, TaskPlan } from '../../lib/types';

const getPriorityStyles = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'bg-red-100 text-red-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

interface TaskPlanDisplayProps {
    plan: TaskPlan;
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const priorityClass = getPriorityStyles(task.priority);
    return (
        <div className="border border-gray-200 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition duration-150">
            <div className="flex justify-between items-start mb-3">

                <h3 className="text-lg font-semibold text-gray-800">
                    <span className="font-mono text-blue-600 mr-2">{task.task_id}</span>
                    {task.description}
                </h3>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${priorityClass} whitespace-nowrap`}>
                    {task.priority}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-3 mt-3">
                <div>
                    <p className="font-medium text-gray-700">Suggested Deadline:</p>
                    <p className="text-base font-bold text-red-500">{task.suggested_deadline}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Estimated Duration:</p>
                    <p>{task.estimated_duration_days} Day{task.estimated_duration_days !== 1 ? 's' : ''}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed">
                <p className="font-medium text-gray-700 mb-1">Dependencies:</p>
                {task.dependencies && task.dependencies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {task.dependencies.map((depId) => (
                            <span key={depId} className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                                Waiting on: {depId}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                        No Dependencies (Can start immediately)
                    </span>
                )}
            </div>
        </div>
    );
};


const TaskPlanDisplay: React.FC<TaskPlanDisplayProps> = ({ plan }) => {

    const sortedTasks = [...plan.tasks].sort((a, b) =>
        a.task_id.localeCompare(b.task_id)
    );
    return (
        <div className="space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-blue-800 mb-2">Plan Summary</h2>
                <p className="text-lg text-blue-700">{plan.summary}</p>
            </div>
            <GanttChart tasks={sortedTasks} />
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Detailed Task Breakdown</h2>
                <div className="space-y-6">
                    {sortedTasks.map((task) => (
                        <TaskCard key={task.task_id} task={task} />
                    ))}
                </div>
            </div>

        </div>
    );
};

export default TaskPlanDisplay;