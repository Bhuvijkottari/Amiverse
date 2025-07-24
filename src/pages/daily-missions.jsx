import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import amiAnimation from '../assets/ami.json';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function DailyMissions() {
  const location = useLocation();
  const docId = location.state?.docId;
const lessons = [
    {
      name: "Animals",
      items: [
        { emoji: "🐶", name: "Dog" },
        { emoji: "🐱", name: "Cat" },
        { emoji: "🐰", name: "Rabbit" },
        { emoji: "🦜", name: "Parrot" },
        { emoji: "🐢", name: "Turtle" },
        { emoji: "🐴", name: "Horse" },
        { emoji: "🐮", name: "Cow" },
        { emoji: "🐑", name: "Sheep" },
        { emoji: "🦁", name: "Lion" },
        { emoji: "🐷", name: "Pig" }
      ]
    },
    {
      name: "Fruits",
      items: [
        { emoji: "🍎", name: "Apple" },
        { emoji: "🍌", name: "Banana" },
        { emoji: "🍇", name: "Grapes" },
        { emoji: "🍉", name: "Watermelon" },
        { emoji: "🍓", name: "Strawberry" },
        { emoji: "🍍", name: "Pineapple" },
        { emoji: "🥭", name: "Mango" },
        { emoji: "🍒", name: "Cherry" },
        { emoji: "🥝", name: "Kiwi" },
        { emoji: "🍑", name: "Peach" }
      ]
    },
    {
      name: "Vegetables",
      items: [
        { emoji: "🥕", name: "Carrot" },
        { emoji: "🌽", name: "Corn" },
        { emoji: "🥔", name: "Potato" },
        { emoji: "🍅", name: "Tomato" },
        { emoji: "🥒", name: "Cucumber" },
        { emoji: "🧅", name: "Onion" },
        { emoji: "🥦", name: "Broccoli" },
        { emoji: "🍆", name: "Eggplant" },
        { emoji: "🥬", name: "Lettuce" },
        { emoji: "🫑", name: "Pepper" }
      ]
    },
    {
      name: "Colors",
      items: [
        { emoji: "🔴", name: "Red" },
        { emoji: "🟠", name: "Orange" },
        { emoji: "🟡", name: "Yellow" },
        { emoji: "🟢", name: "Green" },
        { emoji: "🔵", name: "Blue" },
        { emoji: "🟣", name: "Purple" },
        { emoji: "⚫", name: "Black" },
        { emoji: "⚪", name: "White" },
        { emoji: "🟤", name: "Brown" },
        { emoji: "🌈", name: "Rainbow" }
      ]
    },
    {
      name: "Numbers",
      items: [
        { emoji: "1️⃣", name: "One" },
        { emoji: "2️⃣", name: "Two" },
        { emoji: "3️⃣", name: "Three" },
        { emoji: "4️⃣", name: "Four" },
        { emoji: "5️⃣", name: "Five" },
        { emoji: "6️⃣", name: "Six" },
        { emoji: "7️⃣", name: "Seven" },
        { emoji: "8️⃣", name: "Eight" },
        { emoji: "9️⃣", name: "Nine" },
        { emoji: "🔟", name: "Ten" }
      ]
    },
    {
      name: "Shapes",
      items: [
        { emoji: "⬜", name: "Square" },
        { emoji: "⚫", name: "Circle" },
        { emoji: "🔺", name: "Triangle" },
        { emoji: "⭐", name: "Star" },
        { emoji: "❤️", name: "Heart" },
        { emoji: "⬛", name: "Rectangle" },
        { emoji: "🔷", name: "Diamond" },
        { emoji: "🔵", name: "Oval" },
        { emoji: "🟪", name: "Pentagon" },
        { emoji: "🟨", name: "Hexagon" }
      ]
    },
    {
      name: "Vehicles",
      items: [
        { emoji: "🚗", name: "Car" },
        { emoji: "🚕", name: "Taxi" },
        { emoji: "🚌", name: "Bus" },
        { emoji: "🚑", name: "Ambulance" },
        { emoji: "🚒", name: "Fire Truck" },
        { emoji: "🚜", name: "Tractor" },
        { emoji: "🚲", name: "Bicycle" },
        { emoji: "✈️", name: "Airplane" },
        { emoji: "🚂", name: "Train" },
        { emoji: "🛳️", name: "Ship" }
      ]
    },
    {
      name: "Clothes",
      items: [
        { emoji: "👕", name: "Shirt" },
        { emoji: "👖", name: "Pants" },
        { emoji: "👗", name: "Dress" },
        { emoji: "🧥", name: "Jacket" },
        { emoji: "👟", name: "Shoes" },
        { emoji: "🧢", name: "Cap" },
        { emoji: "🧤", name: "Gloves" },
        { emoji: "🧣", name: "Scarf" },
        { emoji: "🩳", name: "Shorts" },
        { emoji: "👒", name: "Hat" }
      ]
    },
    {
      name: "Body Parts",
      items: [
        { emoji: "👀", name: "Eyes" },
        { emoji: "👂", name: "Ear" },
        { emoji: "👃", name: "Nose" },
        { emoji: "👄", name: "Mouth" },
        { emoji: "✋", name: "Hand" },
        { emoji: "🦶", name: "Foot" },
        { emoji: "🧠", name: "Brain" },
        { emoji: "🫀", name: "Heart" },
        { emoji: "🦴", name: "Bone" },
        { emoji: "👅", name: "Tongue" }
      ]
    },
    {
      name: "Daily Items",
      items: [
        { emoji: "🪥", name: "Toothbrush" },
        { emoji: "🧴", name: "Soap" },
        { emoji: "🛏️", name: "Bed" },
        { emoji: "🍽️", name: "Plate" },
        { emoji: "📚", name: "Book" },
        { emoji: "🖍️", name: "Crayon" },
        { emoji: "🪑", name: "Chair" },
        { emoji: "⏰", name: "Clock" },
        { emoji: "🎒", name: "Bag" },
        { emoji: "💧", name: "Water" }
      ]
    }
  ];
 

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentItems, setCurrentItems] = useState([]);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 0.9;
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (selectedLesson && !completed && currentTarget?.name) {
      speak(`Can you find the ${currentTarget.name}? Drag it to me!`);
      setFeedback('');
    }
  }, [currentTarget, completed, selectedLesson]);

  const handleDrop = (item) => {
    if (item.name === currentTarget.name) {
      setFeedback(`🎉 Great job! You found the ${item.name}!`);
      const remaining = currentItems.filter(i => i.name !== item.name);
      if (remaining.length > 0) {
        setTimeout(() => {
          setCurrentItems(remaining);
          setCurrentTarget(remaining[0]);
        }, 1500);
      } else {
        setCompleted(true);
        speak(`Hurray! You completed the ${selectedLesson.name} lesson!`);
        giveStarReward();
      }
    } else {
      setFeedback('❌ Try again!');
    }
  };

  const giveStarReward = async () => {
    if (!docId) return;
    try {
      const userRef = doc(db, "users", docId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const prevStars = userSnap.data().stars || 0;
        await updateDoc(userRef, { stars: prevStars + 1 });
        toast.success("⭐ 1 Star added to your rewards!");
      }
    } catch (error) {
      console.error("Failed to update star reward:", error);
    }
  };

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentItems([...lesson.items]);
    setCurrentTarget(lesson.items[0]);
    setCompleted(false);
    setFeedback('');
  };

  if (!docId) {
    return (
      <div className="text-center mt-10 text-red-600 font-bold">
        ❗ No child ID provided. Please login again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-pink-100 flex flex-col items-center justify-center p-4 relative">
      <div className="w-32 mb-4 relative z-10">
        <Lottie animationData={amiAnimation} loop />
        <p className="text-sm text-gray-600 mt-2"></p>
      </div>

      {!selectedLesson && (
        <div className="text-center">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Choose a Lesson</h2>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {lessons.map((lesson) => (
              <button
                key={lesson.name}
                onClick={() => startLesson(lesson)}
                className="bg-purple-300 hover:bg-purple-400 text-white font-bold py-2 px-4 rounded-xl shadow-md"
              >
                {lesson.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedLesson && (
        <>
          {!completed && (
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-purple-800">
                Lesson: {selectedLesson.name}
              </h2>
              <p className="text-lg text-purple-700">
                Find: {currentTarget?.emoji} {currentTarget?.name}
              </p>
            </div>
          )}

          <div className="relative w-80 h-80">
            {currentItems.map((item, index) => {
              const angle = (index / currentItems.length) * 2 * Math.PI;
              const x = 120 * Math.cos(angle);
              const y = 120 * Math.sin(angle);
              return (
                <div
                  key={item.name}
                  draggable={!completed}
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', item.name)}
                  className="absolute text-4xl cursor-grab transition-transform hover:scale-125"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                >
                  {item.emoji}
                </div>
              );
            })}
          </div>

          {!completed && (
            <div
              className="mt-6 w-32 h-32 border-4 border-dashed border-purple-400 rounded-full flex items-center justify-center text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const name = e.dataTransfer.getData('text/plain');
                const found = currentItems.find((i) => i.name === name);
                if (found) handleDrop(found);
              }}
            >
              <p className="text-purple-600">Drop Here!</p>
            </div>
          )}

          {feedback && (
            <p className="mt-4 text-lg text-green-700">{feedback}</p>
          )}

          {completed && (
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-purple-800">🎉 You finished the lesson!</h2>
              <button
                onClick={() => setSelectedLesson(null)}
                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full shadow"
              >
                🔁 Choose Another Lesson
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
