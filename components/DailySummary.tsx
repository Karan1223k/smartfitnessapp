
import React from 'react';
import { DailyTotals, Meal } from '../types';
import Card from './common/Card';

interface DailySummaryProps {
    totals: DailyTotals;
    meals: Meal[];
    targetCalories: number;
}

const ChartPieIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
);

const ProgressBar: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
    );
};

const DailySummary: React.FC<DailySummaryProps> = ({ totals, meals, targetCalories }) => {
    return (
        <div className="sticky top-8">
            <Card title="Today's Summary" icon={<ChartPieIcon />}>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-semibold">Calories</span>
                            <span className="text-sm text-gray-500">{Math.round(totals.calories)} / {targetCalories} kcal</span>
                        </div>
                        <ProgressBar value={totals.calories} max={targetCalories} color="bg-brand-primary" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-brand-light p-3 rounded-lg">
                            <div className="font-bold text-text-primary">{Math.round(totals.protein)}g</div>
                            <div className="text-xs text-brand-dark">Protein</div>
                        </div>
                         <div className="bg-brand-light p-3 rounded-lg">
                            <div className="font-bold text-text-primary">{Math.round(totals.carbs)}g</div>
                            <div className="text-xs text-brand-dark">Carbs</div>
                        </div>
                         <div className="bg-brand-light p-3 rounded-lg">
                            <div className="font-bold text-text-primary">{Math.round(totals.fats)}g</div>
                            <div className="text-xs text-brand-dark">Fats</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Logged Meals</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {meals.length > 0 ? (
                                meals.map((meal) => (
                                    <div key={meal.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded-md">
                                        {meal.image && <img src={meal.image} alt={meal.name} className="w-12 h-12 object-cover rounded"/>}
                                        <div className="flex-grow">
                                            <p className="font-medium text-sm">{meal.name}</p>
                                            <p className="text-xs text-gray-500">{Math.round(meal.calories)} kcal</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No meals logged yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DailySummary;
