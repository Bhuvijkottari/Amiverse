import React from 'react';
import { useNavigate } from 'react-router-dom';
import storyData from '../data/storyLevels';

export default function StoryHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-100 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-purple-800 text-center mb-6">📚 Story Time</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {storyData.map((story) => (
          <div
            key={story.id}
            className={`bg-white/80 rounded-xl shadow-md p-4 border-2 border-purple-300 flex flex-col items-center transition hover:scale-105 cursor-pointer ${
              !story.unlocked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => {
              if (story.unlocked) navigate(`/story/${story.id}`);
            }}
          >
            <img
              src={`/assets/${story.thumbnail}`}
              alt={story.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h2 className="text-xl font-bold text-purple-700">{story.title}</h2>
            <p className="text-sm text-purple-600">{story.level}</p>
            <p className="text-3xl mt-2">{story.emoji}</p>
            {!story.unlocked && (
              <p className="mt-2 text-sm text-red-500 font-medium">🔒 Locked</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
