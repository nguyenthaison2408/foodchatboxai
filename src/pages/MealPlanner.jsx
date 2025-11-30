import { useState } from "react";
import axios from "axios";
import {
  Utensils, Calendar, ShoppingCart,
  RefreshCcw, Loader2, CheckCircle, Flame, Sparkles
} from "lucide-react";
import "../styles/MealPlanner.scss"; // Import file SCSS

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
      alert("Lỗi khi tạo thực đơn. Vui lòng kiểm tra kết nối backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async (dayIndex, mealIndex, mealType, currentName) => {
    const reason = prompt(`Lý do bạn muốn đổi món "${currentName}"?`);
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
        type: mealType // Giữ nguyên loại bữa
      };
      setPlanData(newPlan);
    } catch {
      alert("Không thể đổi món lúc này.");
    } finally {
      setLoadingSwap(null);
    }
  };

  return (
    <div className="meal-planner-page">
      <div className="container">
        
        {/* HEADER */}
        <header className="meal-header">
          <h1>
            <Calendar size={40} />
            Lên Thực Đơn Thông Minh
          </h1>
          <p>Tạo lộ trình dinh dưỡng cá nhân hóa với Gemini AI</p>
        </header>

        {/* CONFIG SECTION */}
        <section className="config-section">
          <div className="input-grid">
            <div className="form-group">
              <label>Mục tiêu</label>
              <select
                value={formData.goal}
                onChange={e => setFormData({ ...formData, goal: e.target.value })}
              >
                <option>Giảm cân</option>
                <option>Tăng cơ</option>
                <option>Duy trì cân nặng</option>
                <option>Ăn chay trường</option>
                <option>Eat Clean</option>
              </select>
            </div>

            <div className="form-group">
              <label>Calo / Ngày</label>
              <input
                type="number"
                value={formData.calories}
                onChange={e => setFormData({ ...formData, calories: e.target.value })}
                placeholder="2000"
              />
            </div>

            <div className="form-group">
              <label>Chế độ ăn</label>
              <input
                type="text"
                value={formData.diet}
                onChange={e => setFormData({ ...formData, diet: e.target.value })}
                placeholder="vd: Keto, Low-carb..."
              />
            </div>

            <div className="form-group">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="btn-generate"
              >
                {isLoading ? <Loader2 className="spin" size={20} /> : <Utensils size={20} />}
                {isLoading ? "Đang xử lý..." : "Tạo Thực Đơn"}
              </button>
            </div>
          </div>
        </section>

        {/* DASHBOARD RESULTS */}
        {planData && (
          <main className="plan-dashboard">
            
            {/* LEFT: MEAL SCHEDULE */}
            <div className="meal-schedule">
              {/* Tabs */}
              <div className="day-tabs">
                {planData.week_plan.map(dayPlan => (
                  <button
                    key={dayPlan.day}
                    onClick={() => setActiveDay(dayPlan.day)}
                    className={`tab-btn ${activeDay === dayPlan.day ? "active" : ""}`}
                  >
                    Ngày {dayPlan.day}
                  </button>
                ))}
              </div>

              {/* Meals List */}
              <div className="meals-list">
                {planData.week_plan
                  .find(d => d.day === activeDay)
                  ?.meals.map((meal, idx) => {
                    const isSwapping = loadingSwap === `${activeDay - 1}-${idx}`;
                    return (
                      <div key={idx} className="meal-card" data-type={meal.type}>
                        <div className="meal-content">
                          <div className="meal-badges">
                            <span className="type">{meal.type}</span>
                            <span className="cal">
                              <Flame size={12} fill="currentColor" /> {meal.calories} kcal
                            </span>
                          </div>
                          <h3>{meal.name}</h3>
                          <p>{meal.ingredients.join(", ")}</p>
                        </div>

                        <button
                          className="btn-swap"
                          onClick={() => handleSwap(activeDay - 1, idx, meal.type, meal.name)}
                          disabled={isSwapping}
                          title="Đổi món khác"
                        >
                          {isSwapping ? <Loader2 className="spin" size={18} /> : <RefreshCcw size={18} />}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* RIGHT: SHOPPING LIST */}
            <aside className="shopping-list-container">
              <div className="header">
                <ShoppingCart className="text-orange-600" size={24} />
                <h3>Danh Sách Đi Chợ</h3>
              </div>

              {Object.entries(planData.shopping_list).map(([cat, items]) => (
                <div key={cat} className="category-group">
                  <h4>{cat}</h4>
                  <ul>
                    {items.map((item, i) => (
                      <li key={i}>
                        <CheckCircle size={16} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="ai-note">
                <Sparkles size={16} />
                <span>Đã tối ưu cho mục tiêu: {formData.goal}</span>
              </div>
            </aside>

          </main>
        )}
      </div>
    </div>
  );
}