import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function ParentDashboard() {
  const [children, setChildren] = useState([]);
  const [storedPin, setStoredPin] = useState(localStorage.getItem('parentPin') || '');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const q = query(collection(db, 'users'), where('parentPin', '==', storedPin));
        const querySnapshot = await getDocs(q);
        const childList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChildren(childList);
      } catch (error) {
        console.error('Error fetching children:', error.message);
      }
    };

    if (storedPin) fetchChildren();
  }, [storedPin]);

  const toggleFeature = async (childId, featureKey) => {
    const child = children.find(c => c.id === childId);
    const currentFeatures = child.features || {};
    const updated = { ...currentFeatures, [featureKey]: !currentFeatures[featureKey] };
    await updateDoc(doc(db, 'users', childId), { features: updated });
    setChildren(prev =>
      prev.map(c => (c.id === childId ? { ...c, features: updated } : c))
    );
  };

  const toggleCamera = async (childId) => {
    const child = children.find(c => c.id === childId);
    const newCam = !child.showCamera;
    await updateDoc(doc(db, 'users', childId), { showCamera: newCam });
    setChildren(prev =>
      prev.map(c => (c.id === childId ? { ...c, showCamera: newCam } : c))
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

  const themeOptions = ['Jungle', 'Ocean', 'Space'];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">👨‍👩‍👧 Parent Dashboard</h1>

      {children.length === 0 && (
        <p className="text-gray-600">No children found for your PIN.</p>
      )}

      {children.map(child => (
        <div key={child.id} className="bg-white rounded-xl shadow-md p-4 mb-6 border border-purple-300">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-purple-700">{child.name}</h2>
           <button
  onClick={() =>
    navigate("/home", {
      state: {
        name: childData?.name,
        docId: childDocId, // ← pass doc ID here
      },
    })
  }
  className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700"
>
  👁️ View Child Dashboard
</button>

          </div>

          {/* Theme Selector */}
          <div className="mt-2 flex items-center gap-2">
            <label className="text-sm text-gray-700 font-medium">🎨 Theme:</label>
            <select
              value={child.theme || 'Jungle'}
              onChange={(e) => updateTheme(child.id, e.target.value)}
              className="border border-purple-300 rounded px-2 py-1"
            >
              {themeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Screen Time Setter */}
          <div className="mt-2 flex items-center gap-2">
            <label className="text-sm text-gray-700 font-medium">⏱ Screen Time (min):</label>
            <input
              type="number"
              min="0"
              value={child.screenTime }
              onChange={(e) => updateScreenTime(child.id, e.target.value)}
              className="w-20 p-1 rounded border border-gray-300"
            />
            <button
              onClick={() => resetScreenTime(child.id)}
              className="ml-2 text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded border"
            >
              Reset to 60
            </button>
          </div>

          {/* Camera Toggle */}
          <div className="mt-3">
            <label className="font-medium text-sm">📷 Show Camera View:</label>
            <input
              type="checkbox"
              className="ml-2"
              checked={child.settings.showCamera || false}
              onChange={() => toggleCamera(child.id)}
            />
          </div>

          {/* Feature Toggles */}
          <div className="mt-3">
            <h3 className="text-sm font-semibold mb-1">🧩 Features:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(child.features || {}).map(key => (
                <button
                  key={key}
                  onClick={() => toggleFeature(child.id, key)}
                  className={`text-sm px-3 py-1 rounded border ${
                    child.features[key]
                      ? 'bg-green-200 border-green-400'
                      : 'bg-red-200 border-red-400'
                  }`}
                >
                  {key} {child.features[key] ? '✅' : '❌'}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="mt-4">
            <h3 className="font-semibold text-sm text-purple-700 mb-1">⭐ Progress Overview:</h3>
            <ul className="text-sm text-gray-800 ml-4 list-disc space-y-1">
              <li>🎤 Voice Buddy: {child.progress?.voiceBuddy || 0} stars</li>
              <li>🧠 Emotion Game: {child.progress?.emotionGame || 0} stars</li>
              <li>🧩 Routine Puzzle: {child.progress?.routinePuzzle || 0} stars</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
