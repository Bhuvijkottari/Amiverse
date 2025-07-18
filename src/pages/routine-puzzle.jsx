// src/pages/routine-puzzle.jsx
import React, { useState } from "react";
import Lottie from "lottie-react";
import amiAnimation from "../assets/ami.json";
import { useLocation } from "react-router-dom";

const defaultRoutines = [
  { id: 1, task: "🛌 Wake Up", completed: false, timestamp: null },
  { id: 2, task: "🪥 Brush Teeth", completed: false, timestamp: null },
  { id: 3, task: "🍽️ Eat Breakfast", completed: false, timestamp: null },
  { id: 4, task: "📚 Study Time", completed: false, timestamp: null },
  { id: 5, task: "🤸 Exercise", completed: false, timestamp: null },
  { id: 6, task: "🎨 Do Art", completed: false, timestamp: null },
  { id: 7, task: "🧹 Clean Up Toys", completed: false, timestamp: null },
  { id: 8, task: "🛏️ Go to Bed", completed: false, timestamp: null },
];

export default function RoutinePuzzle() {
  const [routines, setRoutines] = useState(defaultRoutines);
  const [points, setPoints] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [newTask, setNewTask] = useState("");
   const location = useLocation();
    const docId = location.state?.docId;
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 0.85;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  const handleComplete = (id) => {
    const newRoutines = routines.map((routine) => {
      if (routine.id === id && !routine.completed) {
        const now = new Date().toLocaleTimeString();
        speak(`Amazing! You finished ${routine.task}`);
        setPoints((prev) => prev + 5);
        return { ...routine, completed: true, timestamp: now };
      }
      return routine;
    });
    setRoutines(newRoutines);
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const newRoutine = {
      id: routines.length + 1,
      task: newTask,
      completed: false,
      timestamp: null,
    };
    setRoutines([...routines, newRoutine]);
    setNewTask("");
  };
  const giveRoutineReward = async () => {
  if (!docId) return;

  try {
    const userRef = doc(db, "users", docId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentStars = userData.stars || 0;

      await updateDoc(userRef, {
        "rewards.stars": currentStars + 1,
      });

      toast.success("⭐ 1 Star added for completing your routine!");
    }
  } catch (error) {
    console.error("Failed to update routine reward:", error);
    toast.error("Failed to add star reward.");
  }
};


  const allDone = routines.every((r) => r.completed);
  if (!docId) {
    return (
      <div className="text-center mt-10 text-red-600 font-bold">
        ❗ No child ID provided. Please login again.
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-6 text-center">
      <div className="w-32 mx-auto mb-4">
        <Lottie animationData={amiAnimation} loop />
      </div>

      <h1 className="text-2xl font-bold text-purple-800 mb-4">🌞 Your Daily Routine</h1>

      <div className="max-w-md mx-auto space-y-4">
        {routines.map((r) => (
          <div
            key={r.id}
            className={`flex items-center justify-between p-4 rounded-xl shadow border ${
              r.completed ? "bg-green-100 border-green-400" : "bg-white border-purple-300"
            }`}
          >
            <div className="text-left">
              <div className="text-lg font-semibold">{r.task}</div>
              {r.timestamp && <div className="text-sm text-gray-600">⏰ {r.timestamp}</div>}
            </div>
            {!r.completed && (
              <button
                onClick={() => handleComplete(r.id)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
              >
                ✅ Done
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-lg font-medium text-purple-700">⭐ Points Collected: {points}</div>

      {allDone && (
        <div className="mt-6 p-6 bg-white/90 border border-purple-300 rounded-xl shadow">
          <h2 className="text-xl font-bold text-green-700">🎉 You completed all your routines!</h2>
          <p className="mt-2 text-purple-600">Ami is super proud of you! 🌟</p>
          {giveRoutineReward()}
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-purple-600 hover:underline mb-2"
        >
          {editMode ? "✖ Cancel" : "➕ Add/Edit Routines"}
        </button>

        {editMode && (
          <div className="mt-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new routine task"
              className="border border-purple-400 px-3 py-2 rounded-lg mr-2"
            />
            <button
              onClick={handleAddTask}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

