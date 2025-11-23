'use client';

import { useState } from 'react';
import GoalForm from './components/GoalForm';
import { TaskPlan } from '../lib/types'; 
import TaskPlanDisplay from './components/TaskPlanDisplay'

export default function Home() {
  const [currentPlan, setCurrentPlan] = useState<TaskPlan | null>(null);

  const handlePlanGenerated = (plan: TaskPlan) => {
    setCurrentPlan(plan);
    document.getElementById('plan-display-area')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearPlan = () => {
    setCurrentPlan(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Smart Task Planner</h1>
        <p className="text-lg text-gray-600 mt-2">
          Break down any goal into actionable tasks and timelines .
        </p>
      </header>

      {/* Goal Submission Area */}
      <GoalForm 
        onPlanGenerated={handlePlanGenerated} 
        onClearPlan={handleClearPlan}
      />

      {/* Plan Display Area */}
      <div id="plan-display-area" className="mt-12 max-w-5xl mx-auto">
        {currentPlan ? (
          <TaskPlanDisplay plan={currentPlan} />
        ) : (
          <p className="text-center text-gray-500 italic mt-8">
            Submit a goal above to generate your smart task plan.
          </p>
        )}
      </div>
    </main>
  );
}