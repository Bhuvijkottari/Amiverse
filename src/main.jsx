import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import VoiceBuddy from "./pages/voice-buddy";
import EmotionGame from "./pages/emotion-game";
import DailyMissions from "./pages/daily-missions";
import RoutinePuzzle from "./pages/routine-puzzle";
import ArtMusic from "./pages/art-music";
import TalkToToy from "./pages/talk-toy";
import RepeatAfterMe from "./pages/repeat";
import Rewards from "./pages/rewards";
import StoryTime from "./pages/StoryTime";
import StoryPlayer from "./pages/StoryPlayer";
import ParentDashboard from "./pages/ParentDashboard";
import "./index.css";
import "./firebase.js"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
       
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/parentdashboard" element={<ParentDashboard />} />
        <Route path="/voice-buddy" element={<VoiceBuddy />} />
        <Route path="/emotion-game" element={<EmotionGame />} />
        <Route path="/daily-missions" element={<DailyMissions />} />
        <Route path="/routine-puzzle" element={<RoutinePuzzle />} />
        <Route path="/art-music" element={<ArtMusic />} />
        <Route path="/talk-toy" element={<TalkToToy />} />
        <Route path="/repeat" element={<RepeatAfterMe />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/story-time" element={<StoryTime />} />
        <Route path="/story/:id" element={<StoryPlayer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
