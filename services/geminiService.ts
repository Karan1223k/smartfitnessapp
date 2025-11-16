
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfileData, Meal, MealPlan, WorkoutPlan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A simple alert for demonstration. In a real app, handle this more gracefully.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const analyzeMealImage = async (imageFile: File, userProfile: UserProfileData): Promise<Omit<Meal, 'id'>> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const prompt = `Analyze the meal in the image. The user is from India, so please identify Indian dishes if applicable. Based on the user's profile (${JSON.stringify(userProfile)}), estimate the nutritional content. Provide your analysis in the specified JSON format. Be slightly upward biased on calories and slightly downward on protein estimates.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: 'A descriptive name for the meal.' },
                        calories: { type: Type.NUMBER, description: 'Estimated calories.' },
                        protein: { type: Type.NUMBER, description: 'Estimated protein in grams.' },
                        carbs: { type: Type.NUMBER, description: 'Estimated carbohydrates in grams.' },
                        fats: { type: Type.NUMBER, description: 'Estimated fats in grams.' },
                        portionSize: { type: Type.STRING, description: 'Estimated portion size (e.g., "1 bowl", "2 pieces").' },
                    },
                    required: ['name', 'calories', 'protein', 'carbs', 'fats', 'portionSize'],
                },
            },
        });

        const jsonString = response.text.trim();
        const mealData = JSON.parse(jsonString);
        return mealData as Omit<Meal, 'id'>;

    } catch (error) {
        console.error("Error analyzing meal image:", error);
        throw new Error("Failed to analyze meal. The image might be unclear or the content unrecognizable.");
    }
};

export const generateMealPlan = async (userProfile: UserProfileData): Promise<MealPlan> => {
    try {
        const prompt = `
        Create a 7-day weekly meal plan for a user in India with the following profile:
        - Profile: ${JSON.stringify(userProfile)}
        - Goal: Generate a plan with a target of around 1800 kcal/day.
        - Cuisine: Focus on local Indian food.
        - Special Rule: Monday should be a "cheat day" with more flexible, enjoyable meal options, but still within a reasonable calorie range.
        - Output Format: Provide the plan in the specified JSON format. Ensure all fields are filled. For notes, you can add tips or alternatives.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        weeklyPlan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING },
                                    breakfast: { type: Type.STRING },
                                    lunch: { type: Type.STRING },
                                    dinner: { type: Type.STRING },
                                    notes: { type: Type.STRING },
                                },
                                required: ['day', 'breakfast', 'lunch', 'dinner'],
                            }
                        },
                        totalCaloriesPerDay: { type: Type.NUMBER }
                    },
                    required: ['weeklyPlan', 'totalCaloriesPerDay']
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as MealPlan;

    } catch (error) {
        console.error("Error generating meal plan:", error);
        throw new Error("Failed to generate a meal plan. Please try again later.");
    }
};


export const generateWorkoutPlan = async (userProfile: UserProfileData): Promise<WorkoutPlan> => {
    try {
        const prompt = `
        Create a 7-day weekly workout plan for a user with the following profile:
        - Profile: ${JSON.stringify(userProfile)}
        - Plan Type: Include a mix of gym and home workouts. For each day, specify if it's a rest day or list workouts.
        - Workout Types: Include both cardio (like cycling, criss-cross/jumping jacks) and resistance training (e.g., for triceps, biceps, legs).
        - Output Format: Provide the plan in the specified JSON format. Estimate calories burned for each day's session.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        weeklyPlan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING },
                                    workouts: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING },
                                                type: { type: Type.STRING, enum: ['cardio', 'resistance'] },
                                                details: { type: Type.STRING, description: "e.g., 3 sets of 12 reps, or 20 minutes" }
                                            },
                                            required: ['name', 'type', 'details']
                                        }
                                    },
                                    estimatedCaloriesBurned: { type: Type.NUMBER }
                                },
                                required: ['day', 'workouts', 'estimatedCaloriesBurned']
                            }
                        }
                    },
                    required: ['weeklyPlan']
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as WorkoutPlan;

    } catch (error) {
        console.error("Error generating workout plan:", error);
        throw new Error("Failed to generate a workout plan. Please try again later.");
    }
};
