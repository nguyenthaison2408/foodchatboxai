import { useState } from "react";
import axios from "axios";
import { Search, Loader2, Clock, Flame, Sparkles, ChefHat } from 'lucide-react';

const API_URL = "http://localhost:5000/api/search-dish";

export default function SearchDish() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    // Cập nhật UI nếu dùng chip gợi ý
    if (overrideQuery) setQuery(overrideQuery);
    
    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const res = await axios.get(API_URL, { params: { q } });
      setResults(res.data.dishes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Các ví dụ tìm kiếm thông minh
  const suggestions = [
    { icon: "🍳", label: "Có trứng & cà chua nấu gì?", query: "Tôi có trứng và cà chua, nấu món gì ngon?" },
    { icon: "🤧", label: "Đang ốm, cần món dễ tiêu", query: "Tôi đang bị cảm cúm, gợi ý món ăn giải cảm, dễ tiêu hóa" },
    { icon: "⚖️", label: "Phở vs Bún Bò: Calo?", query: "So sánh dinh dưỡng giữa Phở bò và Bún bò Huế" },
    { icon: "💪", label: "Bữa trưa Eat Clean", query: "Gợi ý bữa trưa Eat Clean dưới 500 calo" },
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-900 flex justify-center items-center gap-3">
            <Sparkles className="w-10 h-10 text-yellow-500" />
            Tìm Kiếm Ẩm Thực AI
          </h1>
          <p className="text-blue-600 mt-2">Tìm công thức, so sánh dinh dưỡng, hoặc gợi ý theo cảm xúc</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-2 rounded-2xl shadow-lg flex items-center border border-blue-100 mb-6 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Nhập nguyên liệu, tên món, hoặc tâm trạng của bạn..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-3 outline-none text-gray-700 rounded-xl"
          />
          <button 
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="hidden sm:inline">Tìm Kiếm</span>
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(s.query)}
              className="bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <ChefHat className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 w-6 h-6" />
            </div>
            <p className="mt-4 text-blue-800 font-medium">AI đang suy nghĩ thực đơn...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {results.length > 0 ? (
              results.map((dish) => (
                <div key={dish.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full">
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={dish.imageUrl} 
                      alt={dish.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-600 flex items-center gap-1 shadow-sm">
                      <Flame className="w-3 h-3" /> {dish.calories}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {dish.name}
                      </h2>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {dish.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium border-t pt-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" /> {dish.cooking_time}
                      </span>
                      {dish.tags && dish.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : hasSearched && (
              <div className="col-span-full text-center py-10 text-gray-500">
                Không tìm thấy món nào phù hợp. Hãy thử từ khóa khác!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}