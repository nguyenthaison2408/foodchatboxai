import React from "react";
import { Link } from "react-router-dom";
import { Camera, MessageSquare, Calendar, Search, ArrowRight, Sparkles } from "lucide-react";
import "../styles/Home.scss"; // Đã cập nhật đường dẫn sang file CSS

export default function Home() {
  const features = [
    {
      id: 1,
      icon: <Camera size={40} />,
      title: "Food Vision AI",
      description: "Chụp ảnh món ăn để nhận diện tên món, tính toán calo và đánh giá độ tươi ngay lập tức.",
      link: "/search-image",
      color: "green",
    },
    {
      id: 2,
      icon: <MessageSquare size={40} />,
      title: "Trợ Lý Dinh Dưỡng",
      description: "Chat với AI chuyên gia để hỏi về dinh dưỡng, sửa đổi công thức nấu ăn lành mạnh hơn.",
      link: "/chat",
      color: "red",
    },
    {
      id: 3,
      icon: <Calendar size={40} />,
      title: "Lên Thực Đơn",
      description: "Tạo kế hoạch bữa ăn cá nhân hóa 7 ngày dựa trên mục tiêu giảm cân hoặc tăng cơ của bạn.",
      link: "/meal-planner",
      color: "orange",
    },
    {
      id: 4,
      icon: <Search size={40} />,
      title: "Tìm Kiếm Thông Minh",
      description: "Tìm món ăn dựa trên nguyên liệu có sẵn trong tủ lạnh hoặc theo tâm trạng của bạn.",
      link: "/search",
      color: "blue",
    },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge">
            <Sparkles size={16} /> Powered by Gemini 2.5 Flash
          </div>
          <h1 className="hero-title">
            Trợ Lý Ẩm Thực & <br />
            <span className="gradient-text">Dinh Dưỡng Thông Minh</span>
          </h1>
          <p className="hero-subtitle">
            Biến việc ăn uống lành mạnh trở nên dễ dàng hơn bao giờ hết với sức mạnh của AI. 
            Phân tích hình ảnh, lên thực đơn và nấu ăn ngon mỗi ngày.
          </p>
          <div className="hero-buttons">
            <Link to="/search-image" className="btn btn-primary">
              Thử Ngay Vision AI <ArrowRight size={18} />
            </Link>
            <Link to="/chat" className="btn btn-outline">
              Chat với Chuyên gia
            </Link>
          </div>
        </div>
        
        {/* Abstract Visual / Image Placeholder */}
        <div className="hero-visual">
          <div className="circle-bg"></div>
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Healthy Food Bowl" 
            className="hero-image floating-animation"
          />
          <div className="floating-card card-1">
            <span>🥗 350 kcal</span>
          </div>
          <div className="floating-card card-2">
            <span>✨ Very Fresh</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2>Tính Năng Nổi Bật</h2>
          <p>Công nghệ AI tiên tiến phục vụ bữa ăn của bạn</p>
        </div>
        
        <div className="features-grid">
          {features.map((f) => (
            <Link to={f.link} key={f.id} className={`feature-card ${f.color}-theme`}>
              <div className="icon-wrapper">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
              <div className="card-footer">
                <span>Khám phá</span>
                <ArrowRight size={16} className="arrow-icon" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}