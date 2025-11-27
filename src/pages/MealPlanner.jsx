import { useState } from "react";
import axios from "axios";
import { 
  Utensils, Calendar, ShoppingCart, RefreshCcw, 
  Loader2, CheckCircle, ChevronRight, AlertCircle 
} from 'lucide-react';

const API_URL = "http://localhost:5000/api/meal-planner";

export default function MealPlanner() {
  // State cho Form Input
  const [formData, setFormData] = useState({
    calories: "1800",
    goal: "Giảm cân",
    diet: "Cân bằng",
    days: 3 // Mặc định 3 ngày cho demo nhanh, có thể tăng lên 7
  });

  // State dữ liệu & UI
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(1); // Tab ngày đang chọn
  const [loadingSwap, setLoadingSwap] = useState(null); // ID của món đang đổi

  const handleGenerate = async () => {
    setIsLoading(true);
    setPlanData(null);
    try {
      const res = await axios.post(API_URL, formData);
      setPlanData(res.data);
      setActiveDay(1);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo thực đơn. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý đổi món
  const handleSwap = async (dayIndex, mealIndex, mealType, currentName) => {
    const reason = prompt(`Tại sao bạn muốn đổi món "${currentName}"? (vd: Dị ứng, Không thích ăn gà...)`);
    if (!reason) return;

    setLoadingSwap(`${dayIndex}-${mealIndex}`); // Đánh dấu đang load món này

    try {
      const res = await axios.post(`${API_URL}/swap`, {
        currentDish: currentName,
        reason: reason,
        calories: formData.calories,
        diet: formData.diet
      });

      const newDish = res.data;

      // Cập nhật State sâu (Deep update)
      const newPlan = { ...planData };
      // Gán đè món mới vào vị trí cũ, giữ lại type cũ
      newPlan.week_plan[dayIndex].meals[mealIndex] = {
        ...newDish,
        type: mealType // Giữ nguyên là "Sáng" hay "Trưa"
      };

      setPlanData(newPlan);

    } catch (err) {
      alert("Không thể đổi món lúc này.");
    } finally {
      setLoadingSwap(null);
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-orange-700 flex justify-center items-center gap-3">
            <Calendar className="w-10 h-10" />
            Lên Thực Đơn Thông Minh
          </h1>
          <p className="text-gray-600 mt-2">Kế hoạch bữa ăn cá nhân hóa với Gemini AI</p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mục tiêu</label>
              <select 
                value={formData.goal}
                onChange={e => setFormData({...formData, goal: e.target.value})}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-300 outline-none"
              >
                <option>Giảm cân</option>
                <option>Tăng cơ</option>
                <option>Duy trì cân nặng</option>
                <option>Ăn chay trường</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Calo/Ngày</label>
              <input
                type="number"
                value={formData.calories}
                onChange={e => setFormData({...formData, calories: e.target.value})}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-300 outline-none"
                placeholder="vd: 2000"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Chế độ ăn</label>
              <input
                type="text"
                value={formData.diet}
                onChange={e => setFormData({...formData, diet: e.target.value})}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-300 outline-none"
                placeholder="vd: Keto, Low-carb, Cơm Việt..."
              />
            </div>

            <div className="flex items-end">
              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-orange-600 text-white font-bold p-3 rounded-xl hover:bg-orange-700 transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-orange-200"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Utensils />}
                {isLoading ? "Đang tạo..." : "Lên Thực Đơn"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Area */}
        {planData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            
            {/* Cột Trái: Danh sách ngày & Món ăn */}
            <div className="lg:col-span-2">
              {/* Day Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {planData.week_plan.map((dayPlan) => (
                  <button
                    key={dayPlan.day}
                    onClick={() => setActiveDay(dayPlan.day)}
                    className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                      activeDay === dayPlan.day
                        ? "bg-orange-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-orange-100"
                    }`}
                  >
                    Ngày {dayPlan.day}
                  </button>
                ))}
              </div>

              {/* Meals List for Active Day */}
              <div className="space-y-4">
                {planData.week_plan
                  .find(d => d.day === activeDay)
                  ?.meals.map((meal, idx) => {
                    const isSwapping = loadingSwap === `${activeDay - 1}-${idx}`; // Indexing logic
                    return (
                      <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-hover hover:shadow-md">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded uppercase">
                              {meal.type}
                            </span>
                            <span className="text-gray-400 text-xs font-medium flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" /> {meal.calories} kcal
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">{meal.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {meal.ingredients.join(", ")}
                          </p>
                        </div>

                        <button 
                          onClick={() => handleSwap(activeDay - 1, idx, meal.type, meal.name)}
                          disabled={isSwapping}
                          className="group flex items-center justify-center p-3 rounded-full bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 transition-all"
                          title="Đổi món này"
                        >
                          {isSwapping ? (
                            <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                          ) : (
                            <RefreshCcw className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                          )}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Cột Phải: Shopping List */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 sticky top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                  Danh Sách Đi Chợ
                </h3>
                
                <div className="space-y-6">
                  {Object.entries(planData.shopping_list).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="text-sm font-bold text-gray-500 uppercase mb-2 border-b pb-1">
                        {category}
                      </h4>
                      <ul className="space-y-2">
                        {items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-orange-50 p-3 rounded-lg text-xs text-orange-700">
                  💡 Tip: Đây là danh sách tổng hợp cho {formData.days} ngày. Hãy kiểm tra tủ lạnh trước khi đi mua sắm!
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}