'use client';

import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';
import { Task } from '../../lib/types';

interface GanttChartProps {
    tasks: Task[];
}
const parseDate = (dateStr?: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('-').map((s) => Number(s));
    if (parts.length !== 3) return null;
    const [year, month, day] = parts;
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? null : d;
};

const daysToMilliseconds = (days: number): number =>
    Math.round(days * 24 * 60 * 60 * 1000);

const safeClamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

const buildGanttDataTable = (tasks: Task[]) => {
    const cols = [
        { id: 'taskId', label: 'Task ID', type: 'string' },
        { id: 'taskName', label: 'Task Name', type: 'string' },
        { id: 'start', label: 'Start Date', type: 'date' },
        { id: 'end', label: 'End Date', type: 'date' },
        { id: 'duration', label: 'Duration', type: 'number' },
        { id: 'percent', label: 'Percent Complete', type: 'number' },
        { id: 'deps', label: 'Dependencies', type: 'string' },
    ];

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const rows = tasks.map((task) => {
        const durationDays =
            Number.isFinite(task.estimated_duration_days) && task.estimated_duration_days > 0
                ? task.estimated_duration_days
                : 1;
        const durationMs = daysToMilliseconds(durationDays);

        const suggestedEnd = parseDate(task.suggested_deadline);

        let startDate: Date;
        let endDate: Date;
        if (suggestedEnd) {
            endDate = new Date(suggestedEnd.getFullYear(), suggestedEnd.getMonth(), suggestedEnd.getDate());
            startDate = new Date(endDate.getTime() - durationMs);
        } else {
            startDate = new Date(todayStart.getTime());
            endDate = new Date(startDate.getTime() + durationMs);
        }
        let percentComplete = 0;
        if (endDate.getTime() > startDate.getTime()) {
            const total = endDate.getTime() - startDate.getTime();
            const elapsed = today.getTime() - startDate.getTime();
            percentComplete = Math.round((elapsed / total) * 100);
            percentComplete = safeClamp(percentComplete);
        }

        const deps = Array.isArray(task.dependencies) && task.dependencies.length > 0
            ? task.dependencies.join(',')
            : null;
        const row = {
            c: [
                { v: task.task_id },
                { v: task.task_id },
                { v: startDate },
                { v: endDate },
                { v: null },
                { v: percentComplete },
                { v: deps },
            ],
        };

        return row;
    });

    return { cols, rows };
};

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
    const dataTable = useMemo(() => buildGanttDataTable(tasks), [tasks]);

    if (!tasks || tasks.length === 0) {
        return <p className="text-center text-gray-500">No tasks to display in the timeline.</p>;
    }

    const options = {
        height: 60 + tasks.length * 30,
        gantt: {
            trackHeight: 30,
        },
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-inner">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Timeline Visualization (Gantt Chart)</h3>
            <Chart
                chartType="Gantt"
                width="100%"
                height={`${options.height}px`}
                data={dataTable}
                options={options}
            />
        </div>
    );
};

export default GanttChart;