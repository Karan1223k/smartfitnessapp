
import React, { useState, useMemo } from 'react';
import { UserProfileData, Meal, MealPlan, WorkoutPlan, DailyTotals } from './types';
import Header from './components/Header';
import UserProfile from './components/UserProfile';
import MealTracker from './components/MealTracker';
import DailySummary from './components/DailySummary';
import AIPlanner from './components/AIPlanner';
import WorkoutPlanner from './components/WorkoutPlanner';
import MealPlanner from './components/MealPlanner';

const App: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfileData>({
        age: 30,
        height: 175,
        weight: 70,
        gender: 'male',
        activityLevel: 'moderately_active',
        goal: 'fat_loss',
        preferences: 'non-veg',
        allergies: 'none',
    });

    const [meals, setMeals] = useState<Meal[]>([]);
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

    const handleProfileUpdate = (profile: UserProfileData) => {
        setUserProfile(profile);
    };

    const handleMealAdd = (meal: Meal) => {
        setMeals(prevMeals => [...prevMeals, meal]);
    };

    const dailyTotals: DailyTotals = useMemo(() => {
        return meals.reduce((acc, meal) => {
            acc.calories += meal.calories;
            acc.protein += meal.protein;
            acc.carbs += meal.carbs;
            acc.fats += meal.fats;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
    }, [meals]);

    const targetCalories = useMemo(() => {
        // A simple placeholder for TDEE calculation
        const base = userProfile.goal === 'fat_loss' ? 1800 : userProfile.goal === 'muscle_gain' ? 2500 : 2200;
        return base;
    }, [userProfile.goal]);

    return (
        <div className="min-h-screen bg-bg-light text-text-primary">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8">
                <UserProfile userProfile={userProfile} onUpdate={handleProfileUpdate} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <MealTracker onMealAdd={handleMealAdd} userProfile={userProfile} />
                        <AIPlanner 
                            userProfile={userProfile} 
                            setMealPlan={setMealPlan}
                            setWorkoutPlan={setWorkoutPlan}
                        />
                        <WorkoutPlanner plan={workoutPlan} />
                        <MealPlanner plan={mealPlan} />
                    </div>
                    <div className="lg:col-span-1">
                        <DailySummary totals={dailyTotals} meals={meals} targetCalories={targetCalories}/>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
