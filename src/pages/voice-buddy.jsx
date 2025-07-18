import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import amiAnimation from '../assets/ami.json';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const questions = [/* same as before */];

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

  const updateStarsInFirestore = async () => {
    try {
      const userRef = doc(db, 'users', docId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const existingStars = userSnap.data()?.stars || 0;
        await updateDoc(userRef, {
          stars: existingStars + stars,
        });
        console.log('⭐ Rewards updated in Firestore!');
      }
    } catch (error) {
      console.error('Error updating rewards:', error);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers([...answers, { questionId: questions[currentQuestion].id, answer }]);
    setStars((s) => s + 1);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 700);
    } else {
      speak(language === 'hi' ? "शाबाश! आपने बहुत अच्छा किया!" : "Yay! You did amazing!");
      setSubmitted(true);
      updateStarsInFirestore(); // 🟡 Push stars after last question
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
            {language === 'hi' ? "आपके सितारे जोड़ दिए गए हैं!" : "Stars added to your rewards!"}
          </p>
        )}
      </div>

      {/* Stars */}
      <div className="mt-4 text-purple-700 font-semibold">
        ⭐ {language === 'hi' ? 'एक्टिविटी पॉइंट्स' : 'Stars Collected'}: {stars}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mt-6 text-purple-600 hover:underline"
      >
        ⬅️ {language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Home'}
      </button>
    </div>
  );
}
