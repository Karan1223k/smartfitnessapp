# Smart Health & Fitness Coach

An AI fitness app built on React and Google Gemini. You take a photo of your food and get its calories and macros. You fill in a short profile and get a full week of meals and workouts.

That's the pitch. The part I actually learned from, though, wasn't getting the AI to answer. It was everything around the answer: what to do when the AI sends back messy output, runs out of quota, or doesn't respond at all. And, in one case, what happens when your API key ends up on GitHub.

📸 **[Screenshot: the full app — profile at the top, meal tracker, daily summary on the right]**

## What's in here

- **Meal tracking from a photo.** Upload a picture and Gemini estimates the calories, protein, carbs, fats and portion size.
- **An AI weekly planner.** One click generates a 7-day meal plan *and* a 7-day workout plan, both based on your profile.
- **A daily summary.** A running total of what you've eaten today, compared against a calorie target for your goal.
- **A fallback layer.** The app keeps working when Gemini doesn't.
- No backend and no database. It's a single-page React app talking directly to the Gemini API.

## How it works

```
User profile (age, height, weight, gender, activity, goal, veg/non-veg, allergies)
        │
        ├──► Meal photo ──► Gemini (image + prompt) ──► calories & macros ──► Daily summary
        │
        └──► "Generate plans" ──► two Gemini calls in parallel
                                     ├──► 7-day meal plan
                                     └──► 7-day workout plan
```

The profile goes into every prompt as JSON. A fat-loss vegetarian and a muscle-gain non-vegetarian should get very different plans, and the only way the model knows the difference is if you tell it every time.

## The features, one at a time

### Tracking a meal

Click the upload box, pick a photo, then hit *Analyze Meal*. The image is converted to base64 in the browser and sent to `gemini-2.5-flash` with your profile and a prompt asking for JSON *only*: name, calories, protein, carbs, fats, portion size.

<img width="1226" height="534" alt="Screenshot 2026-10-08 at 9 48 45 PM" src="https://github.com/user-attachments/assets/921d5d5c-5b62-449b-9333-1540b4cdd1a8" />

The result is added to your log straight away, and the summary panel updates.

One honest note: these are estimates. A photo can't see how much ghee went into the dal. Treat the numbers as a ballpark, not a lab report.

### The daily summary

This sits on the right side of the page. It shows calories eaten against your daily target, with a progress bar, then your totals for protein, carbs and fats, and every meal you've logged so far with its photo.

<img width="470" height="294" alt="Screenshot 2026-10-08 at 9 49 52 PM" src="https://github.com/user-attachments/assets/ab4fe946-38a4-41e6-8794-5f96dbfedba7" />


### The weekly planner

One button, two plans. Both requests go out at the same time (`Promise.all`) so you're not waiting for one to finish before the other starts.

The **meal plan** comes back as a 7-day table with breakfast, lunch and dinner, plus the daily calorie target the plan is aiming for.

<img width="733" height="733" alt="Screenshot 2026-10-08 at 9 50 25 PM" src="https://github.com/user-attachments/assets/da068085-10f9-44ba-bff3-a4441d7ac755" />


The **workout plan** is a card for each day, with cardio and resistance exercises, sets and durations, and an estimate of calories burned. Each exercise has a checkbox so you can tick it off once it's done. That's a small thing, but it turned out to be the most satisfying part of the UI.

<img width="727" height="721" alt="Screenshot 2026-10-08 at 9 51 11 PM" src="https://github.com/user-attachments/assets/6bca522f-9467-429a-93d6-a9dbf1519e50" />


### Your profile

You can edit your age, height, weight, gender, activity level, goal (fat loss / maintenance / muscle gain), diet preference and allergies. Every AI call uses whatever is saved here.

<img width="1117" height="346" alt="Screenshot 2026-10-08 at 9 51 50 PM" src="https://github.com/user-attachments/assets/3f1cb69d-2816-4b01-a9b0-32a8f8b29247" />


## What went wrong along the way

### Gemini doesn't always return clean JSON

I asked for "ONLY JSON". Sometimes that's what came back. Often the JSON came wrapped in markdown code fences, or with a sentence of explanation before it, and `JSON.parse` would fall over.

So every response now goes through two steps before it gets parsed:

1. strip out any ` ```json ` / ` ``` ` fences
2. use a regex to pull out the first `{ ... }` block and parse only that

It isn't elegant, but it made parsing reliable enough for a demo. Gemini also has a structured-output mode built for exactly this problem, and moving to it is on the list below.

### The free tier runs out, and the app used to just break

On the free Gemini tier you hit rate limits quickly, especially while testing the same feature over and over. Before I added the fallback, a failed request meant an error and an empty screen.

Now every Gemini call is wrapped in a `try/catch` that returns sensible default values if anything goes wrong:

| Feature | What you get if Gemini fails |
|---|---|
| Meal analysis | "Estimated Meal": 400 kcal, 20g protein, 45g carbs, 15g fat |
| Meal plan | a basic 1-day plan (oats, dal rice, paneer roti) |
| Workout plan | a basic 1-day plan (20 minutes of cycling) |

The app never crashes, and that mattered for demos. The trade-off is covered in the next section.

### My API key ended up on GitHub

The first version of this repo had the `.env` file committed, real API key included. `.gitignore` didn't list `.env`, and I didn't notice until later.

What fixed it:
- I revoked the old key and created a new one. This is the step that actually matters, because once a key is pushed it stays in the git history even after you delete the file.
- I added `.env` to `.gitignore` and removed it from the repo.

A related thing worth knowing: in a Vite app, anything prefixed with `VITE_` gets **bundled into the JavaScript the browser downloads**. So even with `.env` kept off GitHub, the key is visible to anyone who opens DevTools on a deployed version. That's fine for running locally. For a real deployment, the Gemini calls should go through a small backend.

## Being honest about what it can't do

- **The fallback is silent.** When Gemini fails, you get the default values above with no warning on screen. If you see exactly 400 kcal, that's the fallback, not the AI. The real error only shows up in the browser console. A visible "AI unavailable, showing estimates" message is the first thing I'd add.
- **The fallback plans only cover one day**, not seven.
- **The calorie target is a placeholder.** It's a fixed number per goal (1800 for fat loss, 2200 for maintenance, 2500 for muscle gain), not a real BMR/TDEE calculation from your body stats.
- **The meal plan prompt is fixed to ~1800 kcal of Indian food**, whatever your goal is. It suited me, but it doesn't match the muscle-gain target.
- **Nothing is saved.** Refresh the page and your meals and plans are gone.
- **Photo estimates are rough**, especially for mixed dishes where the ingredients are hidden.

## Code layout

| File | Job |
|---|---|
| `App.tsx` | Holds all the app state (profile, meals, plans) and works out daily totals and the calorie target |
| `services/geminiService.ts` | Every Gemini call: the prompts, image encoding, JSON cleanup and fallbacks. If you want to change what the AI is asked, it's all here |
| `components/UserProfile.tsx` | View and edit the profile |
| `components/MealTracker.tsx` | Photo upload, preview and analysis |
| `components/DailySummary.tsx` | The calories/macros sidebar and meal log |
| `components/AIPlanner.tsx` | The "Generate My Weekly Plans" button and loading state |
| `components/MealPlanner.tsx` | The weekly meal table |
| `components/WorkoutPlanner.tsx` | Weekly workout cards with checkboxes |
| `components/common/` | Shared `Card` and `Spinner` |
| `types.ts` | TypeScript types for profiles, meals and plans |

## What I'd do next with more time

- Show a clear message when the fallback is used, instead of failing silently
- Calculate the calorie target properly (Mifflin-St Jeor + activity multiplier) and pass it into the meal plan prompt
- Switch to Gemini's structured-output mode and drop the regex parsing
- Move the API calls behind a small backend so the key never reaches the browser
- Save meals and plans, starting with localStorage and moving to a real database with login later
- Check the AI's calorie estimates against a real nutrition database

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · Google Gemini (`gemini-2.5-flash` via `@google/genai`)

## Setup

You need Node.js 18 or newer and a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

If you're coming from Python: there's no virtual environment to create or activate. `npm install` puts everything into a local `node_modules/` folder, which does the same job.

```bash
# Clone the repo
git clone https://github.com/Karan1223k/smartfitnessapp.git
cd smartfitnessapp

# Install dependencies
npm install

# Create a .env file in the project root (not included, for obvious reasons) with:
# VITE_GEMINI_API_KEY=your_key

# Run it
npm run dev
```

Then open **http://localhost:3000**.

If you change `.env` while the server is running, restart it. Vite only reads environment variables when it starts.

For a production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serves the build locally
```

**If every meal comes back as "Estimated Meal, 400 kcal"**, the Gemini call is failing. Open the browser console (F12) to see why. Usually it's a missing or wrong key, the server not being restarted after editing `.env`, or the daily quota running out.
