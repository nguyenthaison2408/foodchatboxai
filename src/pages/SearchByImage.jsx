import { useState, useRef } from "react";
import axios from "axios";
import { 
  Upload, Camera, Loader2, Utensils, 
  Activity, Leaf, ChefHat, AlertCircle 
} from 'lucide-react';
import "../styles/SearchByImage.scss"; // Import file CSS mới

const API_URL = "http://localhost:5000/api/image-analysis";

export default function SearchByImage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResult(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi kết nối tới server. Vui lòng kiểm tra backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="vision-container">
      <div className="vision-wrapper">
        
        {/* Header */}
        <header className="vision-header">
          <h2>
            <Camera size={32} />
            FoodAI Vision
          </h2>
          <p>Công nghệ AI nhận diện món ăn, tính calo và đánh giá độ tươi sống</p>
        </header>

        <div className="vision-content">
          
          {/* Left Column: Upload Area */}
          <div className="upload-section">
            <div 
              onClick={triggerFileInput}
              className={`drop-zone ${imagePreview ? 'has-image' : ''}`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={64} strokeWidth={1.5} className="upload-icon" />
                  <p style={{ fontWeight: 600, color: '#334155' }}>Tải ảnh món ăn lên đây</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>JPG, PNG (Tối đa 5MB)</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || isLoading}
              className="btn-analyze"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Activity />}
              {isLoading ? "Đang phân tích..." : "Phân Tích Ngay"}
            </button>

            {error && (
              <div className="error-box">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="results-section">
            {!result ? (
              <div className="empty-state">
                <Utensils size={64} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Kết quả phân tích dinh dưỡng<br/>sẽ hiển thị tại đây</p>
              </div>
            ) : (
              <div className="result-content">
                {/* 1. Dish Identity */}
                <div>
                  <h3 className="dish-title">{result.dish_name}</h3>
                  <p className="dish-desc">{result.identification}</p>
                </div>

                {/* 2. Nutrition Grid */}
                <div className="nutrition-grid">
                  <div className="nutri-card calories">
                    <h4>Calo</h4>
                    <p>{result.nutrition.calories}</p>
                  </div>
                  <div className="nutri-card protein">
                    <h4>Đạm</h4>
                    <p>{result.nutrition.protein}</p>
                  </div>
                  <div className="nutri-card fat">
                    <h4>Béo</h4>
                    <p>{result.nutrition.fat}</p>
                  </div>
                  <div className="nutri-card carbs">
                    <h4>Carbs</h4>
                    <p>{result.nutrition.carbs}</p>
                  </div>
                </div>

                {/* 3. Ingredients */}
                <div className="info-card">
                  <h4 className="card-header">
                    <Utensils size={18} color="#16a34a" /> Nguyên liệu chính
                  </h4>
                  <div className="tags-wrapper">
                    {result.ingredients.map((item, idx) => (
                      <span key={idx} className="ingredient-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Freshness (Conditional) */}
                {result.freshness && result.freshness.score && (
                  <div className="info-card freshness-card">
                    <h4 className="card-header" style={{ color: '#15803d' }}>
                      <Leaf size={18} /> Đánh giá độ tươi
                    </h4>
                    <div className="freshness-score">
                      <span className="score-num">{result.freshness.score}/10</span>
                      <span className="score-text">{result.freshness.status}</span>
                    </div>
                    {result.freshness.tips && (
                      <div className="tip-box">
                        💡 Tip: {result.freshness.tips}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Recipe Suggestion */}
                <div className="info-card recipe-card">
                  <h4 className="card-header" style={{ color: '#4338ca' }}>
                    <ChefHat size={18} /> Gợi ý chế biến
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#4338ca', lineHeight: 1.5 }}>
                    {result.recipe_suggestion}
                  </p>
                  
                  <a 
                    href={`https://www.google.com/search?q=công thức làm món ${result.dish_name}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-search-recipe"
                  >
                    🔍 Tìm công thức chi tiết
                  </a>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}