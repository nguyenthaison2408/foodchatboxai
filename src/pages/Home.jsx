import HeroSection from "../components/HeroSection";
import FeatureCard from "../components/FeatureCard";

export default function Home() {
  const features = [
    { title: "Upload Image", description: "Detect and identify food from images.", link: "/upload" },
    { title: "Chat AI", description: "Ask AI about food, nutrition, and recipes.", link: "/chat" },
    { title: "Meal Planner", description: "Plan your meals based on calories and preferences.", link: "/meal-planner" },
    { title: "Search Dish", description: "Search dishes by name or image.", link: "/search" },
  ];

  return (
    <div>
      <HeroSection />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
        {features.map((f, idx) => (
          <FeatureCard key={idx} {...f} />
        ))}
      </section>
    </div>
  );
}
