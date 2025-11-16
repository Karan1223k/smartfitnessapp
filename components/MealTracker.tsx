
import React, { useState, useRef } from 'react';
import { Meal, UserProfileData } from '../types';
import { analyzeMealImage } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface MealTrackerProps {
    onMealAdd: (meal: Meal) => void;
    userProfile: UserProfileData;
}

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const MealTracker: React.FC<MealTrackerProps> = ({ onMealAdd, userProfile }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<Omit<Meal, 'id'> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await analyzeMealImage(selectedFile, userProfile);
            setAnalysisResult(result);
            const newMeal: Meal = {
                ...result,
                id: new Date().toISOString(),
                image: previewUrl || undefined
            };
            onMealAdd(newMeal);

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="Track a Meal" icon={<CameraIcon />}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-full md:w-48">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Meal preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <span className="text-center">Click to upload photo</span>
                        )}
                    </div>
                </div>

                <div className="flex-grow w-full">
                    {selectedFile && !isLoading && !analysisResult && (
                        <button
                            onClick={handleAnalyze}
                            className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
                        >
                            Analyze Meal
                        </button>
                    )}
                    
                    {isLoading && <Spinner />}

                    {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</div>}
                    
                    {analysisResult && (
                        <div className="bg-brand-light p-4 rounded-lg">
                            <h3 className="text-lg font-bold text-brand-dark mb-2">{analysisResult.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">Portion: {analysisResult.portionSize}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                <div className="bg-white p-2 rounded">
                                    <div className="font-bold text-lg">{Math.round(analysisResult.calories)}</div>
                                    <div className="text-xs">Calories</div>
                                </div>
                                <div className="bg-white p-2 rounded">
                                    <div className="font-bold text-lg">{Math.round(analysisResult.protein)}g</div>
                                    <div className="text-xs">Protein</div>
                                </div>
                                <div className="bg-white p-2 rounded">
                                    <div className="font-bold text-lg">{Math.round(analysisResult.carbs)}g</div>
                                    <div className="text-xs">Carbs</div>
                                </div>
                                <div className="bg-white p-2 rounded">
                                    <div className="font-bold text-lg">{Math.round(analysisResult.fats)}g</div>
                                    <div className="text-xs">Fats</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!selectedFile && <p className="text-sm text-gray-500">Upload a picture of your meal to get a nutritional breakdown from our AI coach.</p>}
                </div>
            </div>
        </Card>
    );
};

export default MealTracker;
