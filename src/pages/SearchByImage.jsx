import { useState, useRef } from "react";
import axios from "axios";
import { Upload, Camera, Loader2, Utensils, Activity, Leaf, ChefHat, AlertCircle } from 'lucide-react';

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
      setError("Có lỗi xảy ra khi kết nối tới server.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="bg-green-50 min-h-screen p-4 sm:p-8 font-sans flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 shadow-md text-center">
          <h2 className="text-2xl font-bold flex justify-center items-center gap-2">
            <Camera className="w-8 h-8" />
            FoodAI Vision
          </h2>
          <p className="text-green-100 mt-2 text-sm">Phân tích món ăn, dinh dưỡng & độ tươi bằng hình ảnh</p>
        </header>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Upload Area */}
          <div className="flex flex-col gap-4">
            <div 
              onClick={triggerFileInput}
              className={`border-4 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all ${
                imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
              }`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-xl" />
              ) : (
                <div className="text-center text-gray-400 p-4">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <p className="font-semibold">Click để tải ảnh lên</p>
                  <p className="text-xs mt-2">JPG, PNG (Max 5MB)</p>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-all ${
                !selectedImage || isLoading
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200 transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Activity />}
              {isLoading ? "Đang phân tích..." : "Phân tích ngay"}
            </button>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-full overflow-y-auto min-h-[300px]">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                <Utensils className="w-16 h-16 mb-4" />
                <p>Kết quả phân tích sẽ hiện ở đây</p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in-up">
                {/* 1. Dish Name & Identification */}
                <div>
                  <h3 className="text-3xl font-extrabold text-gray-800 mb-1">{result.dish_name}</h3>
                  <p className="text-gray-600 italic">{result.identification}</p>
                </div>

                {/* 2. Nutrition Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-100 p-3 rounded-xl text-center">
                    <p className="text-xs text-orange-600 font-bold uppercase">Calo</p>
                    <p className="text-xl font-bold text-orange-800">{result.nutrition.calories}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl text-center">
                    <p className="text-xs text-blue-600 font-bold uppercase">Protein</p>
                    <p className="text-xl font-bold text-blue-800">{result.nutrition.protein}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-xl text-center">
                    <p className="text-xs text-yellow-600 font-bold uppercase">Fat</p>
                    <p className="text-xl font-bold text-yellow-800">{result.nutrition.fat}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl text-center">
                    <p className="text-xs text-purple-600 font-bold uppercase">Carbs</p>
                    <p className="text-xl font-bold text-purple-800">{result.nutrition.carbs}</p>
                  </div>
                </div>

                {/* 3. Ingredients */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-2">
                    <Utensils className="w-4 h-4 text-green-500" /> Nguyên liệu chính
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.ingredients.map((item, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Freshness (Chỉ hiện nếu có điểm) */}
                {result.freshness && result.freshness.score && (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <h4 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                      <Leaf className="w-4 h-4" /> Đánh giá độ tươi
                    </h4>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl font-bold text-green-600">{result.freshness.score}/10</div>
                      <div className="text-sm text-green-700 font-medium">{result.freshness.status}</div>
                    </div>
                    {result.freshness.tips && (
                      <p className="text-xs text-green-600 bg-green-100 p-2 rounded-lg">
                        💡 Tip: {result.freshness.tips}
                      </p>
                    )}
                  </div>
                )}

                {/* 5. Recipe Suggestion */}
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-800 flex items-center gap-2 mb-2">
                    <ChefHat className="w-4 h-4" /> Gợi ý chế biến
                  </h4>
                  <p className="text-sm text-indigo-700 mb-3">{result.recipe_suggestion}</p>
                  
                  {/* Google Search Button */}
                  <a 
                    href={`https://www.google.com/search?q=công thức làm món ${result.dish_name}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
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