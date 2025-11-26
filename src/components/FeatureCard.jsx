import { Link } from 'react-router-dom';

export default function FeatureCard({ title, description, link }) {
  return (
    <div className="bg-white shadow p-6 rounded hover:shadow-lg transition">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4">{description}</p>
      <Link to={link} className="text-red-500 font-semibold">Go →</Link>
    </div>
  );
}
