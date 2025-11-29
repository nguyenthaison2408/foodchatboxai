import { useState } from "react";
import axios from "axios";
import {
  Utensils, Calendar, ShoppingCart,
  RefreshCcw, Loader2, CheckCircle, AlertCircle
} from "lucide-react";
import "../styles/MealPlanner.scss";

const API_URL = "http://localhost:5000/api/meal-planner";

export default function MealPlanner() {
  const [formData, setFormData] = useState({
    calories: "1800",
    goal: "Giảm cân",
    diet: "Cân bằng",
    days: 3
  });

  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [loadingSwap, setLoadingSwap] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setPlanData(null);
    try {
      const res = await axios.post(API_URL, formData);
      setPlanData(res.data);
      setActiveDay(1);
    } catch (err) {
      alert("Lỗi khi tạo thực đơn. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async (dayIndex, mealIndex, mealType, currentName) => {
    const reason = prompt(`Lý do đổi món "${currentName}"?`);
    if (!reason) return;

    setLoadingSwap(`${dayIndex}-${mealIndex}`);

    try {
      const res = await axios.post(`${API_URL}/swap`, {
        currentDish: currentName,
        reason,
        calories: formData.calories,
        diet: formData.diet
      });

      const newPlan = { ...planData };
      newPlan.week_plan[dayIndex].meals[mealIndex] = {
        ...res.data,
        type: mealType
      };
      setPlanData(newPlan);
    } catch {
      alert("Không thể đổi món lúc này.");
    } finally {
      setLoadingSwap(null);
    }
  };

  return (
    <div className="meal-planner-page min-h-screen p-4 sm:p-8 font-sans">

      {/* 🔹 Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold flex justify-center items-center gap-3 text-[#ff8b70]">
          <Calendar className="w-10 h-10" />
          Lên Thực Đơn Thông Minh
        </h1>
        <p className="opacity-60 mt-2">Gemini AI meal planning</p>
      </div>

      {/* 🔹 INPUT CARD */}
      <div className="input-card p-6 rounded-2xl border mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-sm font-semibold mb-1">Mục tiêu</label>
            <select
              value={formData.goal}
              onChange={e => setFormData({ ...formData, goal: e.target.value })}
              className="w-full p-3 rounded-xl"
            >
              <option>Giảm cân</option>
              <option>Tăng cơ</option>
              <option>Duy trì cân nặng</option>
              <option>Ăn chay trường</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Calo/Ngày</label>
            <input
              type="number"
              value={formData.calories}
              onChange={e => setFormData({ ...formData, calories: e.target.value })}
              className="w-full p-3 rounded-xl"
              placeholder="2000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Chế độ ăn</label>
            <input
              type="text"
              value={formData.diet}
              onChange={e => setFormData({ ...formData, diet: e.target.value })}
              className="w-full p-3 rounded-xl"
              placeholder="Keto, Low-carb..."
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 bg-[#ff3e34]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Utensils />}
              {isLoading ? "Đang tạo..." : "Lên Thực Đơn"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔸 RESULTS */}
      {planData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 🍽 Meals */}
          <div className="lg:col-span-2">
            <div className="day-tabs grid grid-cols-7 gap-2 mb-6">
              {planData.week_plan.map(dayPlan => (
                <button
                  key={dayPlan.day}
                  onClick={() => setActiveDay(dayPlan.day)}
                  className={`py-2 rounded-lg text-sm font-medium
                    ${activeDay === dayPlan.day ? "active-day" : ""}`}
                >
                  Ngày {dayPlan.day}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {planData.week_plan
                .find(d => d.day === activeDay)
                ?.meals.map((meal, idx) => {
                  const isSwapping = loadingSwap === `${activeDay - 1}-${idx}`;
                  return (
                    <div key={idx} className="meal-card p-5 rounded-2xl border flex justify-between items-center">
                      <div>
                        <span className="meal-type text-xs font-semibold py-1 px-3 rounded-full mr-2">
                          {meal.type}
                        </span>
                        <span className="font-medium text-base">
                          {meal.name}
                        </span>
                        <div className="text-xs opacity-60 mt-1">
                          <AlertCircle className="inline w-3 h-3 mr-1" />
                          {meal.calories} kcal
                        </div>
                        <p className="opacity-70 text-sm mt-2">
                          {meal.ingredients.join(", ")}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSwap(activeDay - 1, idx, meal.type, meal.name)}
                        disabled={isSwapping}
                        className="text-sm opacity-70 hover:opacity-100 transition"
                      >
                        {isSwapping
                          ? <Loader2 className="animate-spin" />
                          : <RefreshCcw />}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 🛒 Shopping */}
          <div className="shopping-card p-6 rounded-2xl border sticky top-4">
            <h3 className="shopping-title text-lg mb-3">
              <ShoppingCart className="inline w-5 h-5 mr-2" />
              Danh Sách Đi Chợ
            </h3>

            {Object.entries(planData.shopping_list).map(([cat, items]) => (
              <div key={cat} className="mb-4">
                <h4 className="text-sm font-semibold uppercase mb-1 opacity-70">
                  {cat}
                </h4>
                <ul className="space-y-1 text-sm">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="analysis-text mt-4">
              🔎 AI đã tối ưu dựa theo mục tiêu {formData.goal}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
