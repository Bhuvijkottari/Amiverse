export const speak = (text, onStart = () => {}, onEnd = () => {}) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.pitch = 1;
  utter.rate = 0.9;
  utter.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();

  // Try to pick a softer / more child-friendly voice
  const preferredVoice =
    voices.find(
      (v) =>
        v.name.toLowerCase().includes("child") ||
        v.name.toLowerCase().includes("kid") ||
        v.name.toLowerCase().includes("female")
    ) ||
    voices.find((v) => v.lang === "en-US") || // fallback to en-US
    null;

  if (preferredVoice) {
    utter.voice = preferredVoice;
  }

  window.speechSynthesis.cancel();
  utter.onstart = onStart;
  utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
};
