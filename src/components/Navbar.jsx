import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">FoodAI</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload Image</Link>
        <Link to="/chat">Chat AI</Link>
        <Link to="/meal-planner">Meal Planner</Link>
        <Link to="/search">Search Dish</Link>
      </div>
    </nav>
  );
}
