// src/pages/storyPlayer.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import amiAnimation from '../assets/ami.json';
import happyPlay from '../assets/happyPlay.png';
import sadPlay from '../assets/sadPlay.png';
import safeRoad from '../assets/safeRoad.png';
import riskyRoad from '../assets/riskyRoad.png';
import umbrella1 from '../assets/umbrella1.png';
import umbrella2 from '../assets/umbrella2.png';
import lonelyAnaya from '../assets/lonelyanaya.png';
import happyAnaya from '../assets/happyanaya.png';

const stories = {
  1: {
    scenes: [
      {
        text: "It’s a rainy day. Rohan is excited to go to the park, but he notices dark clouds outside.",
        options: [
          { label: '🌂 Take an umbrella', next: 1 },
          { label: '🚶 Go without umbrella', next: 2 },
        ]
      },
      {
        text: "Rohan takes his umbrella and steps outside. It begins to pour, but he stays dry and happy! ☺️",
        options: [
          { label: '😊 Smile and walk', end: umbrella2, moral: 'Great job! Carrying an umbrella keeps you dry and happy.' }
        ]
      },
      {
        text: "Rohan runs outside. It starts raining heavily. He gets wet and starts sneezing. 😢",
        options: [
          { label: '😞 Go back home', end: umbrella1, moral: 'Oops! Always carry an umbrella when it looks rainy.' }
        ]
      }
    ]
  },

  2: {
    scenes: [
      {
        text: "Tara enters a playroom with many toys. She sees a dollhouse, blocks, and puzzles. A boy named Ravi is already playing quietly in the corner.",
        options: [
          { label: '🧸 Play alone', next: 1 },
          { label: '🤗 Say hello to Ravi', next: 2 },
        ]
      },
      {
        text: "Tara begins playing with blocks. She feels a bit lonely. She glances at Ravi who is still quiet.",
        options: [
          { label: '🙋 Ask Ravi to join', next: 3 },
          { label: '😶 Keep playing alone', end: sadPlay, moral: 'She played alone. Next time, sharing can make playtime better.' }
        ]
      },
      {
        text: "Tara smiles and waves. Ravi smiles back. They both sit together near the puzzles.",
        options: [
          { label: '🤝 Offer him a puzzle piece', end: happyPlay, moral: 'They became great friends. Sharing is fun!' },
          { label: '😐 Grab puzzle first', end: sadPlay, moral: 'She played alone. Next time, sharing can make playtime better.' }
        ]
      },
      {
        text: "Ravi comes over and they both begin building with blocks together!",
        options: [
          { label: '🎉 Yay!', end: happyPlay, moral: 'They became great friends. Sharing is fun!' }
        ]
      }
    ]
  },

  3: {
    scenes: [
      {
        text: "Aryan walks home after school. He reaches a crossing with no traffic light.",
        options: [
          { label: '🦓 Find zebra crossing', next: 1 },
          { label: '🚶 Cross quickly', next: 2 }
        ]
      },
      {
        text: "He sees the zebra crossing ahead but a dog barks loudly.",
        options: [
          { label: '🧍 Wait patiently', end: safeRoad, moral: 'He made a smart choice and crossed safely. Well done!' },
          { label: '🏃 Run fast', end: riskyRoad, moral: 'That was risky! Always cross safely at zebra crossings.' }
        ]
      },
      {
        text: "He tries to run across. A car honks loudly!",
        options: [
          { label: '⛔ Go back', end: safeRoad, moral: 'Phew! That was smart. Always be careful.' },
          { label: '💨 Keep running', end: riskyRoad, moral: 'It was risky! We must cross only when it’s safe.' }
        ]
      }
    ]
  },
  4: {
  scenes: [
    {
      text: "A new student, Anaya, joins the class. She looks nervous and sits alone.",
      options: [
        { label: '👋 Say hi', next: 1 },
        { label: '🙈 Ignore and play with own friends', end: lonelyAnaya, moral: 'It’s nice to welcome new friends!' }
      ]
    },
    {
      text: "Anaya smiles when you greet her. She still seems a little shy.",
      options: [
        { label: '🤝 Invite her to play', end: happyAnaya, moral: 'Being friendly makes everyone feel included.' },
        { label: '😶 Leave her again', end: lonelyAnaya, moral: 'She felt left out. Let’s try to be kind to new friends.' }
      ]
    }
  ]
}

  
};

export default function StoryPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const story = stories[id];
  const [sceneIndex, setSceneIndex] = useState(0);
  const [resultImg, setResultImg] = useState(null);
  const [moral, setMoral] = useState('');

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 0.85;
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (story) speak(story.scenes[sceneIndex].text);
  }, [sceneIndex, story]);

  const handleChoice = (option) => {
    if (option.end) {
      setResultImg(option.end);
      setMoral(option.moral);
      speak(option.moral);
    } else if (option.next !== undefined) {
      setSceneIndex(option.next);
    }
  };

  if (!story) return <div className="p-6 text-center">Story not found!</div>;

  const currentScene = story.scenes[sceneIndex];
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 p-6 text-center">
      <div className="w-36 mx-auto mb-4">
        <Lottie animationData={amiAnimation} loop />
      </div>

      {!resultImg ? (
        <>
          <h2 className="text-xl font-bold mb-4 text-purple-800">{currentScene.text}</h2>
          <div className="flex flex-col gap-4">
            {currentScene.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt)}
                className="bg-purple-200 hover:bg-purple-300 text-lg p-3 rounded-xl shadow"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <img src={resultImg} alt="result" className="mx-auto max-w-xs mt-4 rounded-xl shadow-lg" />
          <p className="text-md mt-4 font-semibold text-green-700">📘 Moral: {moral}</p>
          <button
            onClick={() => navigate('/story-time')}
            className="mt-6 text-purple-600 hover:underline"
          >
            ⬅️ Back to Levels
          </button>
        </>
      )}
    </div>
  );
}
