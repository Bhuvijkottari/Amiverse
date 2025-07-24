import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import amiAnimation from '../assets/ami.json';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

// ✅ Define your questions array
const questions = [
  {
    id: 1,
    text: {
      en: "How are you feeling today?",
      hi: "आज आप कैसा महसूस कर रहे हैं?"
    },
    options: ["😊", "😢", "😠", "😨"]
  },
  {
    id: 2,
    text: {
      en: "Can you say 'Hello' loudly?",
      hi: "क्या आप ज़ोर से 'हैलो' कह सकते हैं?"
    },
    options: []
  },
  {
    id: 3,
    text: {
      en: "Which one is your favorite?",
      hi: "इनमें से कौन सा आपका पसंदीदा है?"
    },
    options: ["🍎", "🚗", "🧸", "👟"]
  },
  {
    id: 4,
    text: {
      en: "What color do you like the most?",
      hi: "आपको कौन सा रंग सबसे ज्यादा पसंद है?"
    },
    options: ["🔴 Red", "🟢 Green", "🔵 Blue", "🟡 Yellow"]
  },
  {
    id: 5,
    text: {
      en: "Which animal do you like?",
      hi: "आपको कौन सा जानवर पसंद है?"
    },
    options: ["🐶 Dog", "🐱 Cat", "🐘 Elephant", "🐦 Bird"]
  },
  {
    id: 6,
    text: {
      en: "Which season do you enjoy?",
      hi: "आपको कौन सा मौसम पसंद है?"
    },
    options: ["☀️ Summer", "🌧️ Rainy", "🍂 Autumn", "❄️ Winter"]
  },
  {
    id: 7,
    text: {
      en: "How do you prefer to talk?",
      hi: "आप किस तरीके से बात करना पसंद करते हैं?"
    },
    options: ["🗣️ Speaking", "✍️ Writing", "🖐️ Gestures", "📱 Using Device"]
  }
];


export default function VoiceBuddy() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [stars, setStars] = useState(0);
  const [language, setLanguage] = useState('en');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const docId = location.state?.docId;

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 0.85;
    utter.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) =>
      language === 'hi' ? v.lang === 'hi-IN' : v.lang === 'en-US'
    );
    if (selectedVoice) utter.voice = selectedVoice;
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (questions[currentQuestion]) {
      speak(questions[currentQuestion].text[language]);
    }
  }, [currentQuestion, language]);

  // ✅ Add 1 star in Firebase
  const updateStarsInFirestore = async () => {
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
      console.error("Error updating stars in Firestore:", error);
    }
  };

  const handleAnswer = async (answer) => {
    setAnswers([...answers, { questionId: questions[currentQuestion].id, answer }]);
    setStars((s) => s + 1);
    await updateStarsInFirestore(); // ✅ Push star for each correct/attempted question

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 700);
    } else {
      speak(language === 'hi' ? "शाबाश! आपने बहुत अच्छा किया!" : "Yay! You did amazing!");
      setSubmitted(true);
      toast.success(language === 'hi' ? "⭐ सितारे जोड़ दिए गए!" : "⭐ Stars added to your rewards!");
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center p-4 relative">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 rounded border border-purple-300"
        >
          <option value="en">🌍 English</option>
          <option value="hi">🇮🇳 Hindi</option>
        </select>
      </div>

      {/* Ami Animation */}
      <div className="w-44 mb-4">
        <Lottie animationData={amiAnimation} loop />
      </div>

      {/* Question Box */}
      <div className="bg-white/80 backdrop-blur-lg border border-purple-300 rounded-xl shadow-xl p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-bold text-purple-800 mb-2">
          {questions[currentQuestion]?.text[language] ?? "🎉"}
        </h2>

        {/* Options */}
        {!submitted && questions[currentQuestion]?.options?.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {questions[currentQuestion].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="bg-purple-200 hover:bg-purple-300 text-3xl p-3 rounded-xl shadow transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : !submitted ? (
          <button
            onClick={() => handleAnswer("Spoken")}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full shadow"
          >
            {language === 'hi' ? 'मैंने कहा!' : 'I Said It!'}
          </button>
        ) : (
          <p className="text-green-600 font-semibold text-lg mt-4">
            {language === 'hi' ? "⭐ आपके सितारे जोड़ दिए गए हैं!" : "⭐ Stars added to your rewards!"}
          </p>
        )}
      </div>

      {/* Stars Counter */}
      <div className="mt-4 text-purple-700 font-semibold">
        ⭐ {language === 'hi' ? 'एक्टिविटी पॉइंट्स' : 'Stars Collected'}: {stars}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mt-6 text-purple-600 hover:underline"
      >
         {language === 'hi' ? '' : ''}
      </button>
    </div>
  );
}
