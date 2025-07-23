import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import amiAnimation from '../assets/ami.json';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

// ✅ Firebase imports
import { db } from '../firebase'; // Make sure this points to your firebase.js config
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EmotionGame() {
  const emotions = [
    { label: 'Happy', emoji: '😊' },
    { label: 'Sad', emoji: '😢' },
    { label: 'Angry', emoji: '😠' },
    { label: 'Scared', emoji: '😨' },
    { label: 'Tired', emoji: '😴' },
    { label: 'Loved', emoji: '😍' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [stars, setStars] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const location = useLocation();
  const docId = location.state?.docId;

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 0.85;
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    const emotion = emotions[currentIndex];
    speak(`Can you show me your ${emotion.label} face?`);
    setFeedback('');
    setShowCamera(false);

    const timer = setTimeout(() => {
      setShowCamera(true);
      speak(`Try to match the ${emotion.label} face! You can do it!`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  // ✅ Save star to Firebase
  const giveStarReward = async () => {
    if (!docId) {
      console.warn("❗ No child ID provided. Please login again.");
      return;
    }

    try {
      const userRef = doc(db, "users", docId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const prevStars = userSnap.data().stars || 0;
        await updateDoc(userRef, { stars: prevStars + 1 });
        console.log("⭐ Star added! Total:", prevStars + 1);
      }
    } catch (error) {
      console.error("Error updating stars:", error);
    }
  };

  // ✅ Handle Done
  const handleDone = async () => {
    setFeedback('🎉 Yay! Great job!');
    setStars((s) => s + 1);
    await giveStarReward();

    if (currentIndex < emotions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1500);
    } else {
      setAllDone(true);
      speak('Yay! You finished all the emotions! You did amazing!');
      toast.success("⭐ Stars added to your rewards!");
    }
  };

  if (!docId) {
    return (
      <div className="text-center mt-10 text-red-600 font-bold">
        ❗ No child ID provided. Please login again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex flex-col items-center justify-center p-4 relative">
      {/* Ami Animation */}
      <div className="w-32 mb-4">
        <Lottie animationData={amiAnimation} loop />
      </div>

      {!allDone && (
        <div className="bg-white/80 backdrop-blur-lg border border-purple-300 rounded-xl shadow-xl p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-purple-800 mb-2">
            {emotions[currentIndex].emoji} Can you show me your {emotions[currentIndex].label} face?
          </h2>

          {showCamera ? (
            <div className="mt-4">
              <video
                autoPlay
                playsInline
                muted
                width="240"
                height="180"
                className="mx-auto rounded-lg border border-purple-300 shadow"
                ref={(video) => {
                  if (video && video.srcObject == null) {
                    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                      video.srcObject = stream;
                    });
                  }
                }}
              />
              <button
                onClick={handleDone}
                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full shadow"
              >
                ✅ I Did It!
              </button>
            </div>
          ) : (
            <p className="text-purple-700 mt-4">Get ready...</p>
          )}

          {feedback && <p className="text-green-700 mt-4">{feedback}</p>}
        </div>
      )}

      {allDone && (
        <>
          <div className="text-center bg-white/80 border border-purple-300 rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-purple-800">🎉 You did all the emotions!</h2>
            <p className="text-purple-700 mt-2">Stars earned: {stars} ⭐</p>
          </div>

          {/* Butterfly Animation */}
          <div className="fixed inset-0 pointer-events-none z-50">
            <DotLottieReact
              src="https://lottie.host/1d19163e-5c30-48d0-b0d4-efc53d2872b1/Ic3cCqMKrN.lottie"
              autoplay
              loop
            />
          </div>
        </>
      )}

      {!allDone && (
        <div className="mt-4 text-purple-700 font-semibold">
          ⭐ Stars: {stars}
        </div>
      )}
    </div>
  );
}
