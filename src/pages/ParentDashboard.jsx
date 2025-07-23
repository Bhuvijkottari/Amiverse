import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend);

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [storedPin, setStoredPin] = useState(localStorage.getItem('parentPin') || '');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const q = query(collection(db, 'users'), where('parentPin', '==', storedPin));
        const querySnapshot = await getDocs(q);
        const defaultFeatures = {
          artMusic: true,
          dailyMissions: true,
          emotionGame: true,
          repeat: true,
          rewards: true,
          routinePuzzle: false,
          storyTime: true,
          talkToToy: true,
          voiceBuddy: true
        };
        const childList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            features: {
              ...defaultFeatures,
              ...(data.features || {})
            }
          };
        });
        setChildren(childList);
      } catch (error) {
        console.error('Error fetching children:', error.message);
      }
    };

    if (storedPin) fetchChildren();
  }, [storedPin]);

  const toggleFeature = async (childId, featureKey) => {
    const child = children.find(c => c.id === childId);
    const updated = { ...child.features, [featureKey]: !child.features[featureKey] };
    await updateDoc(doc(db, 'users', childId), { features: updated });
    setChildren(prev =>
      prev.map(c => (c.id === childId ? { ...c, features: updated } : c))
    );
  };

  const toggleCamera = async (childId) => {
    const child = children.find(c => c.id === childId);
    const newCam = !child.settings?.showCamera;
    await updateDoc(doc(db, 'users', childId), {
      settings: { ...child.settings, showCamera: newCam }
    });
    setChildren(prev =>
      prev.map(c =>
        c.id === childId ? { ...c, settings: { ...c.settings, showCamera: newCam } } : c
      )
    );
  };

  const resetScreenTime = async (childId) => {
    await updateDoc(doc(db, 'users', childId), { screenTime: 60 });
    setChildren(prev =>
      prev.map(c => (c.id === childId ? { ...c, screenTime: 60 } : c))
    );
  };

  const updateTheme = async (childId, newTheme) => {
    await updateDoc(doc(db, 'users', childId), { theme: newTheme });
    setChildren(prev =>
      prev.map(c => (c.id === childId ? { ...c, theme: newTheme } : c))
    );
  };

  const updateScreenTime = async (childId, time) => {
    const t = parseInt(time);
    if (!isNaN(t)) {
      await updateDoc(doc(db, 'users', childId), { screenTime: t });
      setChildren(prev =>
        prev.map(c => (c.id === childId ? { ...c, screenTime: t } : c))
      );
    }
  };

  const generateRewardHistory = (stars = 0) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();

    return Array.from({ length: 5 }, (_, i) => {
      const offset = 4 - i;
      const dayIndex = (todayIndex - offset + 7) % 7;
      const label = i === 4 ? 'Today' : daysOfWeek[dayIndex];
      const value = Math.max(stars - (4 - i), 0);
      return { day: label, value };
    });
  };

  const themeOptions = ['Jungle', 'Ocean', 'Space'];

  return (
    <div className="p-6 bg-gradient-to-br from-violet-50 to-orange-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-purple-900 mb-10 text-center">
        👨‍👩‍👧 Parent Dashboard
      </h1>

      {children.length === 0 && (
        <p className="text-gray-600 text-center">No children found for your PIN.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map(child => {
          const rewardHistory = generateRewardHistory(child.stars || 0);
          const chartData = {
            labels: rewardHistory.map(r => r.day),
            datasets: [{
              label: "⭐ Weekly Progress",
              data: rewardHistory.map(r => r.value),
              fill: true,
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              borderColor: "rgba(99, 102, 241, 1)",
              pointBackgroundColor: "rgba(99, 102, 241, 1)",
              tension: 0.3,
            }]
          };

          const chartOptions = {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: "Weekly Star Progress",
                font: { size: 14 },
                color: "#4f46e5"
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
                grid: { color: "#e5e7eb" }
              },
              x: { grid: { display: false } }
            }
          };

          return (
            <div key={child.id} className="bg-white rounded-2xl shadow-lg p-6 border border-purple-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-purple-700">{child.name}</h2>
                <button
                  onClick={() =>
                    navigate("/home", {
                      state: {
                        name: child.name,
                        docId: child.id,
                      },
                    })
                  }
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700"
                >
                 
                </button>
              </div>

              <p className="mb-2 text-indigo-600 font-semibold text-sm">
                ⭐ Stars Earned: {child.stars || 0}
              </p>

              <div className="mb-4">
                <Line data={chartData} options={chartOptions} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">🎨 Theme:</label>
                  <select
                    value={child.theme || 'Jungle'}
                    onChange={(e) => updateTheme(child.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {themeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">⏱ Screen Time:</label>
                  <input
                    type="number"
                    min="0"
                    value={child.screenTime}
                    onChange={(e) => updateScreenTime(child.id, e.target.value)}
                    className="w-20 p-1 rounded border border-gray-300"
                  />
                  <button
                    onClick={() => resetScreenTime(child.id)}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
                  >
                    Reset
                  </button>
                </div>

             

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">🧩 Feature Access:</h3>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                    {Object.keys(child.features || {}).map(key => (
                      <button
                        key={key}
                        onClick={() => toggleFeature(child.id, key)}
                        className={`text-xs px-3 py-1 rounded border font-medium ${
                          child.features[key]
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-red-100 border-red-400 text-red-800'
                        }`}
                      >
                        {key} {child.features[key] ? '✅' : '❌'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <footer className="mt-10 text-center text-sm text-[#4B5563] font-medium bg-[#f3f4f7] py-4 rounded-md shadow-sm">
  © {new Date().getFullYear()} <span className="text-[#2563EB] font-semibold">AmiVerse</span>. All rights reserved.
</footer>
    </div>
  );
}
