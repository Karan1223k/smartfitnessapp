
import React, { useState } from 'react';
import { UserProfileData, MealPlan, WorkoutPlan } from '../types';
import { generateMealPlan, generateWorkoutPlan } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface AIPlannerProps {
    userProfile: UserProfileData;
    setMealPlan: (plan: MealPlan | null) => void;
    setWorkoutPlan: (plan: WorkoutPlan | null) => void;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4-4-4 5.293-5.293a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 011.414 0L17 13.586" />
    </svg>
);

const AIPlanner: React.FC<AIPlannerProps> = ({ userProfile, setMealPlan, setWorkoutPlan }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlans = async () => {
        setIsLoading(true);
        setError(null);
        setMealPlan(null);
        setWorkoutPlan(null);

        try {
            const [mealResult, workoutResult] = await Promise.all([
                generateMealPlan(userProfile),
                generateWorkoutPlan(userProfile)
            ]);
            setMealPlan(mealResult);
            setWorkoutPlan(workoutResult);
        } catch (err: any) {
            setError(err.message || 'Failed to generate plans. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="AI Weekly Planner" icon={<SparklesIcon />}>
            <p className="mb-4">
                Let our AI coach generate a personalized weekly meal and workout plan based on your profile and goals.
            </p>
            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-4">
                    <Spinner />
                    <p className="mt-2 text-sm text-text-secondary">Generating your personalized plans...</p>
                </div>
            ) : (
                <button
                    onClick={handleGeneratePlans}
                    className="w-full px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary transition-transform transform hover:scale-105"
                >
                    Generate My Weekly Plans
                </button>
            )}
            {error && <p className="mt-4 text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
        </Card>
    );
};

export default AIPlanner;
