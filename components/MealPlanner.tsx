
import React from 'react';
import { MealPlan } from '../types';
import Card from './common/Card';

interface MealPlannerProps {
    plan: MealPlan | null;
}

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const MealPlanner: React.FC<MealPlannerProps> = ({ plan }) => {
    if (!plan) {
        return null;
    }

    return (
        <Card title="Your Weekly Meal Plan" icon={<CalendarIcon />}>
            <p className="mb-4 text-sm">
                Targeting approximately <span className="font-bold text-brand-dark">{plan.totalCaloriesPerDay}</span> calories per day.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Day</th>
                            <th scope="col" className="px-6 py-3">Breakfast</th>
                            <th scope="col" className="px-6 py-3">Lunch</th>
                            <th scope="col" className="px-6 py-3">Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plan.weeklyPlan.map((dayPlan) => (
                            <tr key={dayPlan.day} className={`border-b ${dayPlan.day.toLowerCase() === 'monday' ? 'bg-yellow-50' : 'bg-white'}`}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {dayPlan.day}
                                    {dayPlan.day.toLowerCase() === 'monday' && <span className="text-xs text-yellow-600 block">Cheat Day</span>}
                                </th>
                                <td className="px-6 py-4">{dayPlan.breakfast}</td>
                                <td className="px-6 py-4">{dayPlan.lunch}</td>
                                <td className="px-6 py-4">{dayPlan.dinner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default MealPlanner;
