
import React, { useState } from 'react';
import { WorkoutPlan, WorkoutPlanDay } from '../types';
import Card from './common/Card';

interface WorkoutPlannerProps {
    plan: WorkoutPlan | null;
}

const FlameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z" />
    </svg>
);

const WorkoutDayCard: React.FC<{ dayPlan: WorkoutPlanDay }> = ({ dayPlan }) => {
    const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);

    const handleToggle = (workoutName: string) => {
        setCompletedWorkouts(prev => 
            prev.includes(workoutName) ? prev.filter(w => w !== workoutName) : [...prev, workoutName]
        );
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-border-color">
            <h4 className="font-bold text-text-primary">{dayPlan.day}</h4>
            <p className="text-xs text-brand-dark font-medium mb-2">~{dayPlan.estimatedCaloriesBurned} kcal</p>
            {dayPlan.workouts.length > 0 ? (
                <ul className="space-y-2">
                    {dayPlan.workouts.map((workout, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id={`${dayPlan.day}-${workout.name}`}
                                checked={completedWorkouts.includes(workout.name)}
                                onChange={() => handleToggle(workout.name)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-secondary"
                            />
                            <label htmlFor={`${dayPlan.day}-${workout.name}`} className={`flex-1 text-sm ${completedWorkouts.includes(workout.name) ? 'text-gray-400 line-through' : ''}`}>
                                <span className="font-semibold">{workout.name}</span>
                                <span className="text-gray-500 ml-2">({workout.details})</span>
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">Rest Day</p>
            )}
        </div>
    );
};

const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({ plan }) => {
    if (!plan) {
        return null;
    }

    return (
        <Card title="Your Weekly Workout Plan" icon={<FlameIcon />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan.weeklyPlan.map((dayPlan, index) => (
                    <WorkoutDayCard key={index} dayPlan={dayPlan} />
                ))}
            </div>
        </Card>
    );
};

export default WorkoutPlanner;
