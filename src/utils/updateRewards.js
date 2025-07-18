import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

// Call this with docId and count of stars/stickers to add
export const addReward = async (docId, { stars = 0, stickers = 0 }) => {
  if (!docId) {
    console.error("❌ No docId provided to addReward");
    return;
  }

  try {
    const userRef = doc(db, "users", docId);
    await updateDoc(userRef, {
      "rewards.stars": increment(stars),
      "rewards.stickers": increment(stickers),
    });
    console.log(`✅ Rewards updated for ${docId} (+${stars} stars, +${stickers} stickers)`);
  } catch (err) {
    console.error("❌ Failed to update rewards:", err);
  }
};
