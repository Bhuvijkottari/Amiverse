import { useNavigate } from 'react-router-dom';

const levels = [
  { id: 1, title: 'Rainy Day Choice 🌧️' },
  { id: 2, title: 'Sharing Toys 🎁' },
  { id: 3, title: 'Crossing the Road 🚸' },
];

export default function StoryTime() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-purple-800">📖 Choose a Story Level</h1>
      <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => navigate(`/story/${level.id}`)}
            className="bg-white p-4 rounded-xl shadow hover:bg-purple-100 border border-purple-300 text-lg font-semibold"
          >
            {level.title}
          </button>
        ))}
      </div>
    </div>
  );
}