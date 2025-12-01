import { useState } from "react";
import axios from "axios";
import { 
  Search, Loader2, Clock, Flame, Sparkles, ChefHat, 
  X, ChevronRight, Utensils, Info 
} from 'lucide-react';
import "../styles/SearchDish.scss";

const API_URL = "http://localhost:5000/api/search-dish";

export default function SearchDish() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // State cho Modal chi tiết
  const [selectedDish, setSelectedDish] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  // --- Logic Tìm kiếm ---
  const handleSearch = async (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;
    if (overrideQuery) setQuery(overrideQuery);
    
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const res = await axios.get(API_URL, { params: { q } });
      setResults(res.data.dishes);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // --- Logic Xem Chi Tiết (Modal) ---
  const openRecipeModal = async (dish) => {
    setSelectedDish(dish);
    setRecipeDetails(null); // Reset nội dung cũ
    setLoadingRecipe(true);

    try {
      // Gọi API lấy chi tiết công thức
      const res = await axios.get(`${API_URL}/details`, { 
        params: { dishName: dish.name } 
      });
      setRecipeDetails(res.data);
    } catch (err) {
      console.error("Lỗi lấy công thức:", err);
    } finally {
      setLoadingRecipe(false);
    }
  };

  const closeModal = () => {
    setSelectedDish(null);
    setRecipeDetails(null);
  };

  const suggestions = [
    { icon: "🍳", label: "Có trứng & cà chua nấu gì?", query: "Tôi có trứng và cà chua, nấu món gì ngon?" },
    { icon: "🤧", label: "Đang ốm, cần món dễ tiêu", query: "Tôi đang bị cảm cúm, gợi ý món ăn giải cảm" },
    { icon: "⚖️", label: "Phở vs Bún Bò: Calo?", query: "So sánh dinh dưỡng giữa Phở bò và Bún bò Huế" },
    { icon: "💪", label: "Bữa trưa Eat Clean", query: "Gợi ý bữa trưa Eat Clean dưới 500 calo" },
  ];

  return (
    <div className="search-page">
      <div className="container">
        
        {/* HEADER */}
        <header className="search-header">
          <h1>
            <Sparkles size={40} strokeWidth={2.5} />
            Tìm Kiếm Ẩm Thực AI
          </h1>
          <p>Tìm công thức, so sánh dinh dưỡng, hoặc gợi ý theo cảm xúc</p>
        </header>

        {/* SEARCH BAR */}
        <section className="search-section">
          <div className="search-box-wrapper">
            <input
              type="text"
              placeholder="Nhập nguyên liệu, tên món..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="btn-search"
            >
              {isLoading ? <Loader2 className="spin" size={20} /> : <Search size={20} />}
              <span>Tìm Kiếm</span>
            </button>
          </div>

          <div className="suggestions-grid">
            {suggestions.map((s, idx) => (
              <button key={idx} onClick={() => handleSearch(s.query)} className="chip-btn">
                <span className="icon">{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </section>

        {/* RESULTS GRID */}
        {isLoading ? (
          <div className="loading-state">
            <div className="loader-wrapper">
              <div className="spinner-ring"></div>
              <ChefHat className="icon-center" size={32} />
            </div>
            <p>AI đang suy nghĩ thực đơn...</p>
          </div>
        ) : (
          <div className="results-grid">
            {results.length > 0 ? (
              results.map((dish) => (
                <div key={dish.id} className="dish-card" onClick={() => openRecipeModal(dish)}>
                  <div className="card-image">
                    <img src={dish.imageUrl} alt={dish.name} />
                    <div className="calorie-badge">
                      <Flame size={14} fill="currentColor" /> {dish.calories}
                    </div>
                  </div>
                  <div className="card-content">
                    <h2>{dish.name}</h2>
                    <p className="desc">{dish.description}</p>
                    <div className="meta-footer">
                      <div className="time">
                        <Clock size={16} /> {dish.cooking_time}
                      </div>
                      <div className="view-more">
                        Xem chi tiết <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : hasSearched && (
              <div className="col-span-full no-results">Không tìm thấy món nào phù hợp.</div>
            )}
          </div>
        )}

        {/* RECIPE MODAL */}
        {selectedDish && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>

              <div className="modal-header">
                <img src={selectedDish.imageUrl} alt={selectedDish.name} className="modal-hero-img" />
                <div className="modal-title-wrapper">
                  <h2>{selectedDish.name}</h2>
                  <div className="modal-meta">
                    <span><Clock size={16} /> {selectedDish.cooking_time}</span>
                    <span><Flame size={16} /> {selectedDish.calories}</span>
                  </div>
                </div>
              </div>

              <div className="modal-body">
                {loadingRecipe ? (
                  <div className="modal-loading">
                    <Loader2 className="spin" size={40} />
                    <p>Đang viết công thức chi tiết...</p>
                  </div>
                ) : recipeDetails ? (
                  <div className="recipe-details animate-fade-in">
                    
                    <p className="intro-text">"{recipeDetails.intro}"</p>

                    <div className="details-grid">
                      {/* Cột Trái: Nguyên liệu */}
                      <div className="ingredients-section">
                        <h3><Utensils size={20} /> Nguyên Liệu</h3>
                        <ul>
                          {recipeDetails.ingredients.map((ing, i) => (
                            <li key={i}>
                              <span className="amount">{ing.amount}</span>
                              <span className="item">{ing.item}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="nutrition-box">
                          <h4>Dinh dưỡng (ước tính)</h4>
                          <div className="nutri-row">
                            <div><span>Protein</span> {recipeDetails.nutrition_info.protein}</div>
                            <div><span>Fat</span> {recipeDetails.nutrition_info.fat}</div>
                            <div><span>Carbs</span> {recipeDetails.nutrition_info.carbs}</div>
                          </div>
                        </div>
                      </div>

                      {/* Cột Phải: Các bước nấu */}
                      <div className="steps-section">
                        <h3><ChefHat size={20} /> Cách Làm</h3>
                        <div className="steps-list">
                          {recipeDetails.steps.map((step, i) => (
                            <div key={i} className="step-item">
                              <div className="step-num">{i + 1}</div>
                              <p>{step}</p>
                            </div>
                          ))}
                        </div>
                        
                        {recipeDetails.tips && (
                          <div className="tips-box">
                            <Info size={18} />
                            <p><strong>Mẹo nhỏ:</strong> {recipeDetails.tips}</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <p className="error-text">Không tải được công thức.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}