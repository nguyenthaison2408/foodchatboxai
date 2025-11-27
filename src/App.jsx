import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UploadImage from "./pages/UploadImage"; // Có thể tích hợp SearchByImage vào đây sau này
import ChatAI from "./pages/ChatAI"; // Lưu ý: Đảm bảo đường dẫn import đúng với nơi bạn lưu file
import MealPlanner from "./pages/MealPlanner";
import SearchDish from "./pages/SearchDish";
import SearchByImage from "./pages/SearchByImage"; // Import component SearchByImage vừa tạo

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadImage />} />
        <Route path="/chat" element={<ChatAI />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/search" element={<SearchDish />} />
        
        {/* Route mới cho tính năng Tìm kiếm/Phân tích bằng hình ảnh */}
        <Route path="/search-image" element={<SearchByImage />} />
      </Routes>
    </Router>
  );
}

export default App;