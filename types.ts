
export interface UserProfileData {
    age: number;
    height: number;
    weight: number;
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
    goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
    preferences: 'veg' | 'non-veg';
    allergies: string;
}

export interface Meal {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    portionSize: string;
    image?: string; 
}

export interface DailyTotals {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface MealPlanDay {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    notes?: string;
}

export interface MealPlan {
    weeklyPlan: MealPlanDay[];
    totalCaloriesPerDay: number;
}

export interface Workout {
    name: string;
    type: 'cardio' | 'resistance';
    details: string;
}

export interface WorkoutPlanDay {
    day: string;
    workouts: Workout[];
    estimatedCaloriesBurned: number;
}

export interface WorkoutPlan {
    weeklyPlan: WorkoutPlanDay[];
}
