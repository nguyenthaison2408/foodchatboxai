import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ChatAI from "./pages/ChatAI";
import MealPlanner from "./pages/MealPlanner";
import SearchDish from "./pages/SearchDish";
import SearchByImage from "./pages/SearchByImage";

function App() {
  return (
    <div className="app">  {/* <- QUAN TRỌNG */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatAI />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/search" element={<SearchDish />} />
          <Route path="/search-image" element={<SearchByImage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
