'use client';

import React, { useState } from 'react';
import { createPlan } from '@/lib/api';
import { TaskPlan } from '../../lib/types';
interface GoalFormProps {
  onPlanGenerated: (plan: TaskPlan) => void;
  onClearPlan: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onPlanGenerated, onClearPlan }) => {
  const [goalText, setGoalText] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    onClearPlan();
    if (goalText.length < 10) {
      setError('Please provide a goal with at least 10 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const goalRequest = {
        goal_text: goalText,
        context: context || undefined,
        user_id: 'nextjs-user-temp-101',
      };

      const plan = await createPlan(goalRequest);
      onPlanGenerated(plan);
      setGoalText('');
      setContext('');
    } catch (err: unknown) {
      console.error("API Error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while creating the plan.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Define Your Goal</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
            High-Level Goal <span className="text-red-500">*</span>
          </label>
          <textarea
            id="goal"
            rows={4}
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder='E.g., "Launch a successful marketing campaign for the new app by next month"'
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Context (Optional)
          </label>
          <textarea
            id="context"
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder='E.g., "I have a $5k budget and 2 team members to assign tasks to."'
            disabled={isLoading}
          />
        </div>
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            **Error:** {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading || goalText.length < 10}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}
          `}
        >
          {isLoading ? 'Generating Plan .....' : 'Generate Smart Plan'}
        </button>
      </form>
    </div>
  );
};

export default GoalForm;