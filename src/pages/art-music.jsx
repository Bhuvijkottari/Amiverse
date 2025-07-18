import React, { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import amiAnimation from "../assets/ami.json";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";

import song1 from "../assets/song1.mp3";
import song2 from "../assets/song2.mp3";
import song3 from "../assets/song3.mp3";

export default function ArtMusic({ docId }) {

  const [mode, setMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [feedback, setFeedback] = useState("");
const [brushSize, setBrushSize] = useState(4);

const praises = [
  "Wow! That’s amazing!",
  "You’re a little artist!",
  "Super job!",
  "Your drawing made me smile!",
  "Keep it up! You're doing great!",
];

  const [brushColor, setBrushColor] = useState("#4b0082");

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  // MUSIC
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef(new Audio(song1));
  const songs = [
    { src: song1, title: "Calm Ukulele 🎸" },
    { src: song2, title: "Soft Piano 🎹" },
    { src: song3, title: "Joyful Claps 🥁" },
  ];

  const drawings = [
    { label: "House", emoji: "🏠" },
    { label: "Tree", emoji: "🌳" },
    { label: "Sun", emoji: "☀️" },
    { label: "Ball", emoji: "⚽" },
  ];

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 0.85;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const endDrawing = () => {
    isDrawing.current = false;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.nativeEvent.clientX - rect.left;
    const y = e.nativeEvent.clientY - rect.top;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = brushColor;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;

  };

const handleDone = () => {
  const praise = praises[Math.floor(Math.random() * praises.length)];
  const message = `🎉 Yay! You drew a ${drawings[currentIndex].label}! ${praise}`;
  setFeedback(message);
  speak(message);

  // ⭐ Reward after every drawing
  giveStarReward();
  


  if (currentIndex < drawings.length - 1) {
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      clearCanvas();
      setFeedback("");
    }, 4000);
  } else {
    setAllDone(true);
    speak("Wow! You finished all your drawings! Great job!");
  }
};



  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === "Art") {
      speak("Let's start drawing! Try to copy the picture you see.");
    } else {
      speak("Let's enjoy some happy music!");
      playSong(currentSong);
    }
  };

  // 🎵 Music Controls
  const playSong = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const newAudio = new Audio(songs[index].src);
    newAudio.loop = false;
    newAudio.play();
    audioRef.current = newAudio;
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const nextSong = () => {
    let next = (currentSong + 1) % songs.length;
    setCurrentSong(next);
    playSong(next);
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  const giveStarReward = async () => {
  if (!docId) {
    console.error("❌ No docId passed to ArtMusic");
    return;
  }

  try {
    const userRef = doc(db, "users", docId);
    await updateDoc(userRef, {
      stars: increment(1),
    });
    toast.success("⭐ Stars added to your rewards!");
    
  } catch (error) {
    console.error("Failed to update star reward:", error);
  }
};



  // 🔊 Stop music if user leaves page
  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);
   if (!docId) {
    return (
      <div className="text-center mt-10 text-red-600 font-bold">
        ❗ No child ID provided. Please login again.
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${mode === 'Music' ? 'bg-yellow-100' : 'bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100'} flex flex-col items-center justify-center p-4`}>
      {/* Ami */}
      <div className="w-32 mb-4">
        <Lottie animationData={amiAnimation} loop />
      </div>

      {!mode && (
        <>
          <h2 className="text-xl font-bold text-purple-800 mb-4">What would you like to do?</h2>
          <div className="flex gap-6">
            <button onClick={() => handleModeSelect("Art")} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full shadow text-lg">🎨 Art</button>
            <button onClick={() => handleModeSelect("Music")} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow text-lg">🎵 Music</button>
          </div>
        </>
      )}

      {mode === "Art" && !allDone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mt-6">
          {/* Target */}
          <div className="bg-white/80 border border-purple-300 rounded-xl p-4 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Draw this:</h3>
            <div className="text-6xl">{drawings[currentIndex].emoji}</div>
            <p className="mt-2 text-purple-600">{drawings[currentIndex].label}</p>
            {/* Color Palette */}
            <div className="flex gap-2 mt-4">
              {["#4b0082", "#ff0000", "#00b894", "#f1c40f", "#000000"].map((color) => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  className="w-6 h-6 rounded-full border-2 border-gray-400"
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
          <p className="mt-4 text-purple-700 font-medium">Select Brush Size:</p>
<div className="flex gap-2 mt-2">
  {[2, 4, 8].map((size) => (
    <button
      key={size}
      onClick={() => setBrushSize(size)}
      className="px-3 py-1 bg-purple-200 rounded-full text-sm hover:bg-purple-300"
    >
      {size === 2 ? "Small" : size === 4 ? "Medium" : "Large"}
    </button>
  ))}
</div>


          {/* Canvas */}
          <div className="bg-white/80 border border-purple-300 rounded-xl p-4">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              onMouseDown={startDrawing}
              onMouseUp={endDrawing}
              onMouseMove={draw}
              onMouseLeave={endDrawing}
              className="border border-purple-400 rounded shadow cursor-crosshair bg-white"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={handleDone} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full shadow">✅ Done</button>
              <button onClick={clearCanvas} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-full shadow">🧹 Clear</button>
            </div>
            {feedback && <p className="mt-2 text-green-700 font-medium">{feedback}</p>}
          </div>
        </div>
      )}

      {mode === "Art" && allDone && (
        <div className="text-center mt-6 bg-white/80 border border-purple-300 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-purple-800">🎉 You completed all drawings!</h2>
          <p className="text-purple-700 mt-2">Great work! ⭐</p>
        </div>
      )}

      {mode === "Music" && (
        <div className="text-center mt-6 bg-white/80 border border-pink-300 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-bold text-pink-800">🎵 Now Playing:</h2>
          <p className="text-lg mt-2">{songs[currentSong].title}</p>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={() => playSong(currentSong)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full">▶️ Play</button>
            <button onClick={pauseMusic} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full">⏸ Pause</button>
            <button onClick={nextSong} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full">⏭ Next</button>
            <button onClick={stopMusic} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">⏹ Stop</button>
          </div>
        </div>
      )}
    </div>
  );
}
