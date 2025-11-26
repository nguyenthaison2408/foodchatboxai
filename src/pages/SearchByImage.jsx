import { useState } from "react";
import axios from "axios";

export default function SearchByImage() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      try {
        const res = await axios.post("http://localhost:5000/api/search-by-image", { image: base64 });
        setResults(res.data.dishes);
      } catch (err) {
        console.error(err);
      }
    };
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Dish by Image</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-4" />
      <button onClick={handleSearch} className="bg-red-500 text-white px-4 py-2 mb-6 rounded">Search</button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(d => (
          <div key={d.id} className="bg-white rounded shadow overflow-hidden">
            <img src={d.imageUrl} alt={d.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold">{d.name}</h2>
              <p>Score: {d.score.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
