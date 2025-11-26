import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UploadImage from "./pages/UploadImage";
import ChatAI from "./pages/ChatAI";
import MealPlanner from "./pages/MealPlanner";
import SearchDish from "./pages/SearchDish";

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
      </Routes>
    </Router>
  );
}

export default App;
