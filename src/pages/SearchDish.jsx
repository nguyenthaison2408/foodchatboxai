import { useState } from "react";
import axios from "axios";

export default function SearchDish() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get("/api/search-dish", { params: { q: query } });
      setResults(res.data.dishes);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Dishes</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search dish by name or ingredient"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleSearch} className="bg-red-500 text-white px-4 rounded">Search</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          results.map(dish => (
            <div key={dish.id} className="bg-white rounded shadow overflow-hidden">
              <img src={dish.imageUrl} alt={dish.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold">{dish.name}</h2>
                <p>Calories: {dish.calories}</p>
                <p className="text-sm text-gray-500">{dish.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
