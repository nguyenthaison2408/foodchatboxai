import { useState } from "react";
import axios from "axios";

export default function UploadImage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Food Image</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-4" />
      <button onClick={handleUpload} className="bg-red-500 text-white px-4 py-2 rounded mb-6">Upload & Detect</button>

      {result && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">{result.name}</h2>
          <img src={result.imageUrl} alt={result.name} className="w-full h-60 object-cover" />
        </div>
      )}
    </div>
  );
}
