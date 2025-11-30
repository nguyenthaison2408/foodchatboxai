import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Home, 
  Camera, 
  MessageCircle, 
  CalendarDays, 
  Search 
} from 'lucide-react';
import "../styles/Navbar.scss"; // Import file CSS vừa tạo

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <div className="bg-orange-100 p-2 rounded-xl">
          <UtensilsCrossed size={24} className="logo-icon" />
        </div>
        <h1>FoodAI</h1>
      </Link>

      {/* Links */}
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          end
        >
          <Home size={18} />
          <span>Trang Chủ</span>
        </NavLink>

        <NavLink 
          to="/search-image" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <Camera size={18} />
          <span>Vision AI</span>
        </NavLink>

        <NavLink 
          to="/chat" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <MessageCircle size={18} />
          <span>Chat AI</span>
        </NavLink>

        <NavLink 
          to="/meal-planner" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <CalendarDays size={18} />
          <span>Thực Đơn</span>
        </NavLink>

        <NavLink 
          to="/search" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <Search size={18} />
          <span>Tìm Kiếm</span>
        </NavLink>
      </div>
    </nav>
  );
}