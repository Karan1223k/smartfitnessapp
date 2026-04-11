# Smart Health & Fitness Coach

This project is an AI-powered web application designed to help users track their meals, estimate nutritional intake, and generate personalized meal and workout plans. It demonstrates how modern web technologies and generative AI can be combined to build practical health-oriented applications.

---

## Features

### Meal Tracking

Users can upload an image of their food, and the application analyzes it to estimate:

* Calorie content
* Macronutrients (protein, carbohydrates, and fats)
* Approximate portion size

---

### AI Weekly Planner

The application generates:

* A 7-day personalized meal plan
* A 7-day workout plan

These recommendations are tailored based on:

* Age, height, and weight
* Activity level
* Fitness goals (e.g., fat loss, maintenance, muscle gain)

---

### Daily Summary

The system tracks daily intake and provides:

* Total calories consumed
* Macronutrient breakdown
* Progress relative to the user’s target intake

---

### Fallback Mechanism

To ensure reliability, the application includes a fallback system:

* If the AI service fails or exceeds quota limits
* The app continues to function using estimated values

This guarantees a consistent user experience even under API limitations.

---

## Tech Stack

* Frontend: React with TypeScript and Vite
* Styling: Tailwind CSS
* AI Integration: Google Gemini API
* State Management: React Hooks

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-fitness-ai.git
cd smart-fitness-ai
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the root directory and add:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

---

### 4. Run the application

```bash
npm run dev
```

---

## Demo Behavior

The AI features depend on API availability and quota limits.
If the quota is exceeded or the API fails, the application automatically switches to a fallback mode and provides estimated nutritional values.

---

## Project Highlights

* Integration of generative AI for both image and text-based tasks
* Robust error handling and fallback design
* Clean and responsive user interface
* Modular and scalable code structure

---

## Use Case

This project demonstrates how AI can be applied in the health and fitness domain to:

* Assist users in tracking their nutrition
* Provide personalized meal and workout recommendations
* Encourage better lifestyle decisions

---

## Note

* This project uses the free tier of the Gemini API
* Some AI functionalities may be limited due to quota restrictions
* It is developed primarily for academic and demonstration purposes

---

## Author

Karan Sood
B.Tech Computer Science and Engineering

---

## Future Improvements

* Integration with real-time nutritional databases
* User authentication and data persistence
* Mobile application version
* Improved food recognition accuracy

---

## License

This project is intended for academic and educational use.
