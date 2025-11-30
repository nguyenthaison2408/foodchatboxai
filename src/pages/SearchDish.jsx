import { useState } from "react";
import axios from "axios";
import { Search, Loader2, Clock, Flame, Sparkles, ChefHat } from 'lucide-react';
import "../styles/SearchDish.scss"; // Import file SCSS mới

const API_URL = "http://localhost:5000/api/search-dish";

export default function SearchDish() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    // Cập nhật UI input nếu người dùng bấm vào chip gợi ý
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

  const suggestions = [
    { icon: "🍳", label: "Có trứng & cà chua nấu gì?", query: "Tôi có trứng và cà chua, nấu món gì ngon?" },
    { icon: "🤧", label: "Đang ốm, cần món dễ tiêu", query: "Tôi đang bị cảm cúm, gợi ý món ăn giải cảm, dễ tiêu hóa" },
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

        {/* SEARCH SECTION */}
        <section className="search-section">
          <div className="search-box-wrapper">
            <input
              type="text"
              placeholder="Nhập nguyên liệu, tên món, hoặc tâm trạng..."
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

          {/* Suggestions Chips */}
          <div className="suggestions-grid">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(s.query)}
                className="chip-btn"
              >
                <span className="icon">{s.icon}</span> 
                {s.label}
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
            <p>AI đang suy nghĩ thực đơn cho bạn...</p>
          </div>
        ) : (
          <div className="results-grid">
            {results.length > 0 ? (
              results.map((dish) => (
                <div key={dish.id} className="dish-card">
                  
                  {/* Card Image */}
                  <div className="card-image">
                    <img src={dish.imageUrl} alt={dish.name} />
                    <div className="calorie-badge">
                      <Flame size={14} fill="currentColor" /> 
                      {dish.calories}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="card-content">
                    <h2>{dish.name}</h2>
                    <p className="desc">{dish.description}</p>

                    <div className="meta-footer">
                      <div className="time">
                        <Clock size={16} /> 
                        {dish.cooking_time}
                      </div>
                      <div className="tags">
                        {dish.tags && dish.tags.slice(0, 2).map((tag, i) => (
                          <span key={i}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : hasSearched && (
              <div className="col-span-full no-results">
                Không tìm thấy món nào phù hợp. Hãy thử từ khóa khác!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}