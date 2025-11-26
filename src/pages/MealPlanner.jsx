import { useState } from "react";
import axios from "axios";

export default function MealPlanner() {
  const [calories, setCalories] = useState("");
  const [preference, setPreference] = useState("");
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    if (!calories) return;

    try {
      const res = await axios.post("/api/meal-planner", {
        calories,
        preference
      });
      setPlan(res.data.mealPlan);
    } catch (err) {
      console.error(err);
      setPlan({ error: "Cannot generate meal plan." });
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meal Planner</h1>
      <div className="mb-4 flex gap-4">
        <input
          type="number"
          placeholder="Calories per day"
          value={calories}
          onChange={e => setCalories(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Preferences (vegan, low-carb...)"
          value={preference}
          onChange={e => setPreference(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleGenerate} className="bg-red-500 text-white px-4 rounded">Generate</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        {plan ? (
          plan.error ? (
            <p className="text-red-500">{plan.error}</p>
          ) : (
            <ul className="list-disc pl-6">
              {plan.map((dish, idx) => (
                <li key={idx}>{dish.name} - {dish.calories} cal</li>
              ))}
            </ul>
          )
        ) : (
          <p>Enter calories and preferences to get your meal plan.</p>
        )}
      </div>
    </div>
  );
}
