import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import amiAnimation from '../assets/ami.json';
import jungleBg from '../assets/jungleBg.json';
import oceanBg from '../assets/oceanBg.json';
import spaceBg from '../assets/spaceBg.json';
import { speak } from '../utils/speak';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';


// ✅ Now docId will be available to use in Firestore

const themes = {
  Jungle: {
    bg: 'bg-gradient-to-br from-green-100 via-green-200 to-lime-100',
    message: 'Let’s swing into the Jungle! 🍃🦜',
  },
  Ocean: {
    bg: 'bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200',
    message: 'Time to splash in the Ocean! 🐬🫧🪼',
  },
  Space: {
    bg: 'bg-gradient-to-br from-gray-900 via-purple-900 to-black text',
    message: 'Ready for a space mission? 🚀🪐',
  },
};

const features = [
  { emoji: '🎤', title: 'Voice Buddy', desc: 'Talk to Ami', key: 'voiceBuddy' },
  { emoji: '🧠', title: 'Emotion Game', desc: 'Mirror Faces', key: 'emotionGame' },
  { emoji: '📦', title: 'Daily Missions', desc: 'Morning & Social', key: 'dailyMissions' },
  { emoji: '🧩', title: 'Routine Puzzle', desc: 'Plan Your Day', key: 'routinePuzzle' },
  { emoji: '🎨', title: 'Art & Music', desc: 'Create & Listen', key: 'artMusic' },
  { emoji: '🧸', title: 'Talk to Toy', desc: 'Friendly Plushie', key: 'talkToToy' },
  { emoji: '📖', title: 'Story Time', desc: 'Choose the Ending', key: 'storyTime' },
  { emoji: '🔁', title: 'Repeat With Me', desc: 'Practice Words', key: 'repeat' },
  { emoji: '🎁', title: 'Earn Rewards', desc: 'Stars & Stickers', key: 'rewards' },
];

const featureRoutes = {
  'Voice Buddy': '/voice-buddy',
  'Emotion Game': '/emotion-game',
  'Daily Missions': '/daily-missions',
  'Routine Puzzle': '/routine-puzzle',
  'Art & Music': '/art-music',
  'Talk to Toy': '/talk-toy',
  'Story Time': '/story-time',
  'Repeat With Me': '/repeat',
  'Earn Rewards': '/rewards',
};

const FeatureCard = ({ emoji, title, desc, onClick, onHover, disabled }) => (
  <div
    className={`bg-white/80 shadow-xl rounded-2xl p-5 flex flex-col items-center transform transition-all duration-300 border border-purple-300 cursor-pointer ${
      disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-opacity-100 hover:scale-105'
    }`}
    onMouseEnter={!disabled ? onHover : undefined}
    onClick={!disabled ? onClick : undefined}
  >
    <div className="text-5xl hover:animate-bounce">{emoji}</div>
    <h3 className="font-bold mt-2 text-purple-800 text-lg">{title}</h3>
    <p className="text-sm text-gray-600 text-center">{desc}</p>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || 'Friend';
  const docId = location.state?.docId;

  const [theme, setTheme] = useState('Jungle');
  const [featuresEnabled, setFeaturesEnabled] = useState({});
  const [progress, setProgress] = useState({});
  const [screenTime, setScreenTime] = useState(60);
  const [usedTime, setUsedTime] = useState(0);
  const [screenBlocked, setScreenBlocked] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [showBubble, setShowBubble] = useState(false);
   
  console.log("Doc ID from HomePage:", docId);

  useEffect(() => {
    if (!docId) {
      console.warn("❗ No docId passed to HomePage");
      return;
    }

    const unsub = onSnapshot(doc(db, 'users', docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("📦 Live sync from Firestore:", data);

        setTheme(data.theme || 'Jungle');
        setScreenTime(data.screenTime || 60);
        setFeaturesEnabled(data.features || {});
        setProgress(data.rewards || {});
      } else {
        console.error("❌ No document found for this ID:", docId);
      }
    });

    return () => unsub();
  }, [docId]);

  useEffect(() => {
    const greet = `Hi ${name}! I’m Ami 👋 Welcome to AmiVerse!`;
    speak(
      greet,
      () => {
        setBubbleText(greet);
        setShowBubble(true);
      },
      () => setShowBubble(false)
    );
  }, [name]);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastUsed = localStorage.getItem('lastUsedDate');
    if (lastUsed !== today) {
      localStorage.setItem('usedTime', '0');
      localStorage.setItem('lastUsedDate', today);
    }

    const savedTime = parseInt(localStorage.getItem('usedTime') || '0');
    setUsedTime(savedTime);

    const interval = setInterval(() => {
      setUsedTime((prev) => {
        const updated = prev + 1;
        localStorage.setItem('usedTime', updated.toString());
        if (updated >= screenTime) setScreenBlocked(true);
        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [screenTime]);

  const currentTheme = themes[theme];
  
  return (
    <div className="relative min-h-screen transition-all duration-500">
      <Lottie
        animationData={
          theme === 'Jungle' ? jungleBg :
          theme === 'Ocean' ? oceanBg :
          spaceBg
        }
        loop
        className="absolute top-0 left-0 w-full h-full opacity-30"
      />

      <div className={`min-h-screen ${currentTheme.bg} p-4 sm:p-8`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Hi {name}! 👋</h1>
            <p className="text-sm text-gray-700 mt-2">
             Theme: {theme} | ScreenTime: {screenTime} mins
           </p>

            <p className="text-lg">{currentTheme.message}</p>
          </div>
          <div className="relative w-28 sm:w-36">
            {showBubble && (
              <div className="absolute -top-14 -left-10 sm:-top-20 sm:-left-16 bg-white border-2 border-purple-300 rounded-2xl px-4 py-2 text-sm shadow-xl max-w-[180px] z-50">
                <span className="text-purple-700 font-semibold">Ami:</span> {bubbleText}
              </div>
            )}
            <Lottie animationData={amiAnimation} loop />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {features.map((item, i) => (
            <FeatureCard
              key={i}
              emoji={item.emoji}
              title={item.title}
              desc={item.desc}
              disabled={screenBlocked || featuresEnabled[item.key] === false}
              onHover={() => {
                if (window.speechSynthesis.speaking) return;
                speak(item.title, () => {
                  setBubbleText(item.title);
                  setShowBubble(true);
                }, () => setShowBubble(false));
              }}
              onClick={() => {
                speak(item.title);
                setTimeout(() => {
                  const route = featureRoutes[item.title];
                 if (route) {
  navigate(route, { state: { docId } }); // ✅ Always send docId, no matter the title
}


                }, 1200);
              }}
            />
          ))}
        </div>

        {/* Blocked Message */}
        {screenBlocked && (
          <div className="text-red-600 text-center text-lg mt-6 font-bold">
            🚫 Your screen time for today is over. Come back tomorrow!
          </div>
        )}

        {/* Theme Info (Non-editable) */}
        <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-xl p-4 flex justify-between items-center border-t-4 border-purple-400 shadow">
          <div className="text-purple-700 font-medium">🎨 Theme:</div>
          <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                if (docId) {
                    updateDoc(doc(db, "users", docId), { theme: e.target.value });
                 }
        }}
            className="p-1 px-2 rounded-md bg-white border border-purple-300 text-purple-800"
          >
            {Object.keys(themes).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Progress Overview */}
        
      </div>
      <footer className="mt-10 text-center text-sm text-[#4B5563] font-medium bg-[#f3f4f7] py-4 rounded-md shadow-sm">
  © {new Date().getFullYear()} <span className="text-[#2563EB] font-semibold">AmiVerse</span>. All rights reserved.
</footer>


    </div>
   
    
  );
}
