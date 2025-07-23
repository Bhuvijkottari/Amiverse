import React, { useState } from "react";
import Lottie from "lottie-react";
import amiAnimation from "../assets/ami.json";
import { speak } from "../utils/speak";

const suggestions = [
  "You can ask me to sing a song.",
  "Try saying: Tell me a story.",
  "You can ask: What's your favorite color?",
  "Say: Count to ten!",
  "Try asking: Can you dance?",
  "Say: Tell me a joke.",
  "Ask me: Who made you?",
  "Say: Do you love me?",
  "Say: Let's play a game.",
  "Try: What's your favorite animal?",
  "Say: Can you clap?",
  "Say: Can you laugh?",
  "Ask: What's your favorite food?",
  "Say: Tell me something interesting.",
  "Say: What can you do?",
  "Say: Good night!"
];

const getSimpleResponse = (text) => {
  if (!text) return "Can you say something?";
  text = text.toLowerCase();

  if (text.includes("hello") || text.includes("hi")) return "Hi there! So happy to talk to you!";
  if (text.includes("good morning")) return "Good morning! Have a happy day!";
  if (text.includes("good night")) return "Good night! Sweet dreams!";
  if (text.includes("bye")) return "Goodbye! See you soon!";
  if (text.includes("how are you")) return "I'm great! I love playing with you!";
  if (text.includes("your name")) return "I'm Ami, your toy friend!";
  if (text.includes("sing") || text.includes("song")) return "La la la! Twinkle twinkle little star!";
  if (text.includes("dance")) return "I love dancing! Wiggle wiggle!";
  if (text.includes("joke")) return "Why did the teddy bear say no to dessert? Because he was stuffed!";
  if (text.includes("story")) return "Once upon a time, there was a brave little bunny who loved adventures!";
  if (text.includes("clap")) return "Yay! Clap clap clap!";
  if (text.includes("laugh")) return "Ha ha ha! That is so funny!";
  if (text.includes("i am sad")) return "Oh no! I am here to cheer you up! Big hugs!";
  if (text.includes("i am happy")) return "Yay! I'm so happy you're happy!";
  if (text.includes("i am angry")) return "Take a deep breath... You will feel better soon.";
  if (text.includes("i am bored")) return "Let's play something fun together!";
  if (text.includes("i am tired")) return "Maybe a little rest will help.";
  if (text.includes("count to ten")) return "One, two, three, four, five, six, seven, eight, nine, ten!";
  if (text.includes("2 plus 2")) return "Two plus two is four!";
  if (text.includes("3 plus 5")) return "Three plus five is eight!";
  if (text.includes("10 minus 3")) return "Ten minus three is seven!";
  if (text.includes("math")) return "Math is fun! Ask me an addition or subtraction question!";
  if (text.includes("bedtime") || text.includes("sleep")) return "It's time to rest. Snuggle up and have sweet dreams.";
  if (text.includes("weather")) return "I hope it's sunny and nice today!";
  if (text.includes("favorite color")) return "I love all colors, but pink is extra pretty!";
  if (text.includes("favorite animal")) return "I like bunnies and puppies a lot!";
  if (text.includes("dog")) return "Woof woof! Dogs are so cute!";
  if (text.includes("cat")) return "Meow meow! Cats love to nap.";
  if (text.includes("i love you")) return "I love you too! You are my best friend!";
  if (text.includes("you are my friend")) return "Yippee! Friends forever!";
  if (text.includes("hug")) return "Hugs for you! Squeeze!";
  if (text.includes("thank you")) return "You're very welcome!";
  if (text.includes("alphabet")) return "A B C D E F G!";
  if (text.includes("numbers")) return "1 2 3 4 5 6 7 8 9 10!";
  if (text.includes("read")) return "Let's read a fun story together!";
  if (text.includes("help")) return "I can help you learn and play!";
  if (text.includes("game")) return "Let's play a fun game!";
  if (text.includes("what can you do")) return "I can sing, tell stories, count, and be your friend!";
  if (text.includes("tell me something")) return "Did you know? A group of bunnies is called a fluffle!";
  if (text.includes("who made you")) return "I was made by two smart people Adithya and Bhuvi!";
  if (text.includes("favorite food")) return "I like pretend cookies the best!";
  if (text.includes("are you real")) return "I'm real in your heart!";
  return "Hmm, I can't help you with that. Try asking me to sing, tell a story, or play!";
};

export default function TalkToToy() {
  const [messages, setMessages] = useState([
    { from: "ami", text: "Hi there! 🧸 I'm your toy friend. You can type or press Speak!" },
  ]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const handleResponse = (text) => {
    const reply = getSimpleResponse(text);
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    const fullReply = `${reply} ${suggestion}`;
    addMessage("ami", fullReply);
    speak(fullReply);
  };

  const handleTextInput = () => {
    if (!input.trim()) return;
    addMessage("user", input.trim());
    handleResponse(input.trim());
    setInput("");
  };

  const handleVoiceInput = async () => {
    setLoading(true);
    try {
      const result = await listenToMic();
      addMessage("user", result);
      handleResponse(result);
    } catch (err) {
      console.error("Voice input error:", err);
      speak("I couldn't hear you. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const listenToMic = () => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject("Speech recognition not supported.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        reject(event.error);
      };

      recognition.start();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center p-4">
      {/* Animation */}
      <div className="w-40 mb-4">
        <Lottie animationData={amiAnimation} loop />
      </div>

      {/* Messages */}
      <div className="w-full max-w-md bg-white/80 border border-purple-300 rounded-xl shadow-xl p-4 space-y-2 overflow-y-auto max-h-[60vh]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "ami" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                m.from === "ami"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Text input */}
      <div className="mt-4 flex gap-2 w-full max-w-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something..."
          className="flex-1 px-4 py-2 rounded-full border border-purple-300 focus:outline-none"
        />
        <button
          onClick={handleTextInput}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>

      {/* Mic input */}
      <button
        onClick={handleVoiceInput}
        disabled={loading}
        className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow"
      >
        {loading ? "🎤 Listening..." : "🎙️ Speak"}
      </button>
    </div>
  );
}
