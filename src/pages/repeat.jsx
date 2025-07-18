import React, { useState, useEffect, useRef } from 'react';
import { lessons } from '../data/repeatWords';
import { speak } from '../utils/speak';
import { useLocation } from "react-router-dom";

export default function RepeatAfterMe() {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [stage, setStage] = useState('select'); // select | repeat | recap | complete
  const [completedLessons, setCompletedLessons] = useState([]);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [revealWord, setRevealWord] = useState(false);
   const location = useLocation();
    const docId = location.state?.docId;
  const currentWord = currentLesson?.words[currentWordIndex];

  const speakWord = (word) => {
    speak(`Repeat after me. ${word}`);
  };

  const startLesson = (lesson) => {
    setCurrentLesson(lesson);
    setCurrentWordIndex(0);
    setStage('repeat');
    speakWord(lesson.words[0].word);
  };

  const handleRecord = async () => {
    try {
      setRecording(true);
      setAudioURL(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        speak("Yay! You did great!");
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 3000);
    } catch (err) {
      console.error("Mic error:", err);
      alert("🎙️ Please allow microphone access.");
      setRecording(false);
    }
  };

  const handleNext = () => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < currentLesson.words.length) {
      setCurrentWordIndex(nextIndex);
      setAudioURL(null);
      speakWord(currentLesson.words[nextIndex].word);
    } else {
      setCurrentWordIndex(0);
      setRevealWord(false);
      setStage('recap');
      speak("Now let's recap what you've learned!");
    }
  };

  const handleRecapNext = () => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < currentLesson.words.length) {
      setCurrentWordIndex(nextIndex);
      setRevealWord(false);
    } else {
      setCompletedLessons((prev) =>
        prev.includes(currentLesson.id) ? prev : [...prev, currentLesson.id]
      );
      setStage('complete');
    }
  };
  const giveStarReward = async () => {
  if (!docId) return;

  try {
    const userRef = doc(db, "users", docId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      const prevStars = userData.stars || 0;

      await updateDoc(userRef, {
        stars: prevStars + 1
      });

      toast.success("⭐ 1 Star added to your rewards!");
    }
  } catch (error) {
    console.error("Error updating rewards:", error);
    toast.error("Failed to add star.");
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6 text-center font-sans">
      <h1 className="text-3xl font-bold text-purple-800 mb-4">🗣️ Repeat After Me</h1>

      {/* Select Lessons */}
      {stage === 'select' && (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {lessons.map((lesson, index) => {
            const isUnlocked = index === 0 || completedLessons.includes(lesson.id - 1);
            return (
              <div
                key={lesson.id}
                onClick={() => isUnlocked && startLesson(lesson)}
                className={`w-40 p-4 rounded-xl border text-center shadow-lg cursor-pointer transition-all duration-300 ${
                  isUnlocked
                    ? 'bg-white hover:bg-purple-100 border-purple-400'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <strong>{lesson.title}</strong>
                {completedLessons.includes(lesson.id) && (
                  <div className="text-green-600 text-sm mt-1">✅ Done</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Repeat Stage */}
      {stage === 'repeat' && currentWord && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">{currentLesson.title}</h2>
          <div className="text-7xl mb-4 animate-bounce">{currentWord.emoji}</div>
          <div className="text-3xl font-bold text-purple-800">{currentWord.word}</div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              onClick={handleRecord}
              disabled={recording}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow"
            >
              {recording ? "🎙️ Recording..." : "🔴 Tap to Repeat"}
            </button>

            {audioURL && (
              <audio controls src={audioURL} className="mt-2" />
            )}

            <button
              onClick={handleNext}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
            >
              ✅ Next Word
            </button>
          </div>
        </div>
      )}

      {/* Recap Stage */}
      {stage === 'recap' && currentWord && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-purple-700 mb-2">🔁 Recap</h2>
          <div className="text-7xl mb-4 animate-bounce">{currentWord.emoji}</div>
          {!revealWord ? (
            <>
              <p className="text-xl text-purple-800 font-bold mb-2">❓ What is this?</p>
              <button
                onClick={() => {
                  speak(`This is ${currentWord.word}`);
                  setRevealWord(true);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full"
              >
                🤔 Reveal Answer
              </button>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-green-700 mt-4">{currentWord.word}</div>
              <button
                onClick={handleRecapNext}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
              >
                🔄 Next Recap
              </button>
            </>
          )}
        </div>
      )}

      {/* Completion */}
      {stage === 'complete' && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md border border-green-300">
          <h2 className="text-2xl font-bold text-green-800">🎉 All Done!</h2>
          <p className="text-purple-700 mt-2">Ami is super proud of you!</p>
          <button
            onClick={() => {
              setStage('select');
              setCurrentLesson(null);
              setCurrentWordIndex(0);
              setAudioURL(null);
              giveStarReward();
            }}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
          >
            🔙 Back to Lessons
          </button>
        </div>
      )}
    </div>
  );
}
